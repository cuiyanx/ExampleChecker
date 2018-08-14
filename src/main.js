const Builder = require("../node_modules/selenium-webdriver").Builder;
const By = require("../node_modules/selenium-webdriver").By;
const Chrome = require("../node_modules/selenium-webdriver/chrome");
const fs = require("fs");

const driver = new Builder()
    .forBrowser("chrome")
    .setChromeOptions(new Chrome.Options())
    .build();

var TTFEjson = JSON.parse(fs.readFileSync("./TTFE.config.json"));
var exampleURL = TTFEjson.exampleURL;
var sleepTime = 5000;
var mlTools = ["mobilenet", "squeezenet", "ssd_mobilenet"];
var backendModels = ["WASM", "WebGL2", "WebML"];

var backendId = new Map();
backendId.set("WASM", "wasm");
backendId.set("WebGL2", "webgl");
backendId.set("WebML", "webml");

var debugFlag = false;
function TTFElog (target, message) {
    if (target == "console") {
        console.log("TTFE -- " + message);
    } else if (target == "debug") {
        if (debugFlag) console.log("TTFE -- " + message);
    } else {
        throw new Error("Not support target '" + target + "'");
    }
}

function getBenchmark (mlTool, backendModel, parameter) {
    let value;

    if (mlTool == "mobilenet") {
        value = TTFEjson.mobilenet;
    } else if (mlTool == "squeezenet") {
        value = TTFEjson.squeezenet;
    } else if (mlTool == "ssd_mobilenet") {
        value = TTFEjson.ssd_mobilenet;
    }

    if (backendModel == "WASM") {
        value = value.WASM;
    } else if (backendModel == "WebGL2") {
        value = value.WebGL2;
    } else if (backendModel == "WebML") {
        value = value.WebML;
    }

    if (parameter == "inferenceTime") {
        value = value.inferenceTime;
    } else if (parameter == "probability") {
        value = value.probability;
    }

    return value;
}

function setBenchmark (mlTool, backendModel, parameter, value) {
    if (mlTool == "mobilenet") {
        if (backendModel == "WASM") {
            if (parameter == "inferenceTime") {
                TTFEjson.mobilenet.WASM.inferenceTime = value;
            } else if (parameter == "probability") {
                TTFEjson.mobilenet.WASM.probability = value;
            }
        } else if (backendModel == "WebGL2") {
            if (parameter == "inferenceTime") {
                TTFEjson.mobilenet.WebGL2.inferenceTime = value;
            } else if (parameter == "probability") {
                TTFEjson.mobilenet.WebGL2.probability = value;
            }
        } else if (backendModel == "WebML") {
            if (parameter == "inferenceTime") {
                TTFEjson.mobilenet.WebML.inferenceTime = value;
            } else if (parameter == "probability") {
                TTFEjson.mobilenet.WebML.probability = value;
            }
        }
    } else if (mlTool == "squeezenet") {
        if (backendModel == "WASM") {
            if (parameter == "inferenceTime") {
                TTFEjson.squeezenet.WASM.inferenceTime = value;
            } else if (parameter == "probability") {
                TTFEjson.squeezenet.WASM.probability = value;
            }
        } else if (backendModel == "WebGL2") {
            if (parameter == "inferenceTime") {
                TTFEjson.squeezenet.WebGL2.inferenceTime = value;
            } else if (parameter == "probability") {
                TTFEjson.squeezenet.WebGL2.probability = value;
            }
        } else if (backendModel == "WebML") {
            if (parameter == "inferenceTime") {
                TTFEjson.squeezenet.WebML.inferenceTime = value;
            } else if (parameter == "probability") {
                TTFEjson.squeezenet.WebML.probability = value;
            }
        }
    } else if (mlTool == "ssd_mobilenet") {
        if (backendModel == "WASM") {
            if (parameter == "inferenceTime") {
                TTFEjson.ssd_mobilenet.WASM.inferenceTime = value;
            } else if (parameter == "probability") {
                TTFEjson.ssd_mobilenet.WASM.probability = value;
            }
        } else if (backendModel == "WebGL2") {
            if (parameter == "inferenceTime") {
                TTFEjson.ssd_mobilenet.WebGL2.inferenceTime = value;
            } else if (parameter == "probability") {
                TTFEjson.ssd_mobilenet.WebGL2.probability = value;
            }
        } else if (backendModel == "WebML") {
            if (parameter == "inferenceTime") {
                TTFEjson.ssd_mobilenet.WebML.inferenceTime = value;
            } else if (parameter == "probability") {
                TTFEjson.ssd_mobilenet.WebML.probability = value;
            }
        }
    }

    fs.writeFileSync("./TTFE.config.json", JSON.stringify(TTFEjson, null, 4));
}

function checkTestResult (mlTool, backendModel, inferenceTime, probability) {
    let result = "passed";

    let benchmarkTime = getBenchmark(mlTool, backendModel, "inferenceTime");
    if (inferenceTime > benchmarkTime && ((inferenceTime - benchmarkTime) > benchmarkTime * 0.05)) {
        result = "failed";
    }

    if (probability !== null && result !== "failed") {
        let benchmarkProbability = getBenchmark(mlTool, backendModel, "probability");
        if (probability < benchmarkProbability && ((benchmarkProbability - probability) > benchmarkProbability * 0.05)) {
            result = "failed";
        }
    }

    TTFElog("console", "example: " + mlTool + " " + backendModel + " is " + result);
}

(async function() {
    TTFElog("console", "example test is start with the default image");

    for (let i = 0; i < mlTools.length; i++) {
        await driver.get(exampleURL + mlTools[i]);
        await driver.sleep(sleepTime);
        TTFElog("console", "open '" + exampleURL + mlTools[i] + "'");

        for (let j = 0; j < backendModels.length; j++) {
            let backendModel;
            let backendElement = await driver.findElement(By.xpath("//*[@id='backend']"));

            await backendElement.getText().then(function(message) {
                backendModel = message;
                TTFElog("debug", "current backend '" + backendModel + "'");
            });

            if (backendModel !== backendModels[j]) {
                await backendElement.click();
                await driver.findElement(By.xpath('//*[@id="' + backendId.get(backendModels[j]) + '"]')).click();
                TTFElog("debug", "change current backend to '" + backendModels[j] + "'");
            } else {
                TTFElog("debug", "no need to change current backend");
            }

            await driver.sleep(sleepTime);

            let checkBackendModel;
            await backendElement.getText().then(function(message) {
                checkBackendModel = message;
            });

            if (checkBackendModel !== backendModels[j]) {
                TTFElog("debug", "can not change current backend to '" + backendModels[j] + "'");
                TTFElog("console", "example: " + mlTools[i] + " " + backendModels[j] + " is canceled");
            } else {
                let inferenceTime;
                await driver.findElement(By.xpath("//*[@id='inferenceTime']/em")).getText().then(function(message) {
                    inferenceTime = message;
                    TTFElog("debug", "current inference time '" + inferenceTime + "'");

                    if (getBenchmark(mlTools[i], backendModels[j], "inferenceTime") == null) {
                        setBenchmark(mlTools[i], backendModels[j], "inferenceTime", inferenceTime);
                        TTFElog("console", "set benchmark " + mlTools[i] + " " + backendModels[j] + " inference time '" + inferenceTime + "'");
                    }
                });

                if (mlTools[i] !== "ssd_mobilenet") {
                    let probabilityFirst;
                    await driver.findElement(By.xpath("//*[@id='prob0']")).getText().then(function(message) {
                        probabilityFirst = message.slice(0, -1);
                        TTFElog("debug", "current first probability '" + probabilityFirst + "'");

                        if (getBenchmark(mlTools[i], backendModels[j], "probability") == null) {
                            setBenchmark(mlTools[i], backendModels[j], "probability", probabilityFirst);
                            TTFElog("console", "set benchmark " + mlTools[i] + " " + backendModels[j] + " probability '" + probabilityFirst + "'");
                        }
                    });

                    checkTestResult(mlTools[i], backendModels[j], inferenceTime, probabilityFirst);
                } else {
                    checkTestResult(mlTools[i], backendModels[j], inferenceTime, null);
                }
            }
        }
    }

    await driver.sleep(sleepTime);
    await driver.quit();
})().then(function() {
    TTFElog("console", "example test is completed");
}).catch(function(err) {
    throw err;
});
