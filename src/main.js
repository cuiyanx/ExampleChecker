const Builder = require("../node_modules/selenium-webdriver").Builder;
const By = require("../node_modules/selenium-webdriver").By;
const until = require("../node_modules/selenium-webdriver").until;
const Chrome = require("../node_modules/selenium-webdriver/chrome");
const fs = require("fs");
const os = require("os");

var TTFEjson = JSON.parse(fs.readFileSync("./TTFE.config.json"));
var exampleURL = TTFEjson.exampleURL;
var libPath = process.cwd() + "/lib/image/";
var mlTools = ["mobilenet", "squeezenet", "ssd_mobilenet", "posenet"];
var backendModels = ["WASM", "WebGL2", "WebML", "MPS", "BNNS"];

var backendId = new Map();
backendId.set("WASM", "wasm");
backendId.set("WebGL2", "webgl");
backendId.set("WebML", "webml");

var platform = null;
var sys = os.type();
if (sys == "Linux") {
    platform = "linux";
} else if (sys == "Darwin") {
    platform = "mac";
} else if (sys == "Windows_NT") {
    platform = "windows";
}

var browserPath = TTFEjson.chromium.path;
var chromeOption = new Chrome.Options();

if (TTFEjson.chromium.flag) {
    chromeOption = chromeOption.setChromeBinaryPath(browserPath);
}

const driver = new Builder()
    .forBrowser("chrome")
    .setChromeOptions(chromeOption)
    .build();

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

function getImage (mlTool) {
    let imageName;

    if (mlTool == "mobilenet") {
        imageName = TTFEjson.image.mobilenet;
    } else if (mlTool == "squeezenet") {
        imageName = TTFEjson.image.squeezenet;
    } else if (mlTool == "ssd_mobilenet") {
        imageName = TTFEjson.image.ssd_mobilenet;
    } else if (mlTool == "posenet") {
        imageName = TTFEjson.image.posenet;
    }

    return imageName;
}

function getBenchmark (mlTool, backendModel, parameter) {
    let value;

    if (mlTool == "mobilenet") {
        value = TTFEjson.mobilenet;
    } else if (mlTool == "squeezenet") {
        value = TTFEjson.squeezenet;
    } else if (mlTool == "ssd_mobilenet") {
        value = TTFEjson.ssd_mobilenet;
    } else if (mlTool == "posenet") {
        value = TTFEjson.posenet;
    }

    if (backendModel == "WASM") {
        value = value.WASM;
    } else if (backendModel == "WebGL2") {
        value = value.WebGL2;
    } else if (backendModel == "WebML") {
        value = value.WebML;
    } else if (backendModel == "MPS") {
        value = value.MPS;
    } else if (backendModel == "BNNS") {
        value = value.BNNS;
    }

    if (parameter == "inferenceTime") {
        value = value.inferenceTime;
    } else if (parameter == "name") {
        value = value.name;
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
            } else if (parameter == "name") {
                TTFEjson.mobilenet.WASM.name = value;
            } else if (parameter == "probability") {
                TTFEjson.mobilenet.WASM.probability = value;
            }
        } else if (backendModel == "WebGL2") {
            if (parameter == "inferenceTime") {
                TTFEjson.mobilenet.WebGL2.inferenceTime = value;
            } else if (parameter == "name") {
                TTFEjson.mobilenet.WebGL2.name = value;
            } else if (parameter == "probability") {
                TTFEjson.mobilenet.WebGL2.probability = value;
            }
        } else if (backendModel == "WebML") {
            if (parameter == "inferenceTime") {
                TTFEjson.mobilenet.WebML.inferenceTime = value;
            } else if (parameter == "name") {
                TTFEjson.mobilenet.WebML.name = value;
            } else if (parameter == "probability") {
                TTFEjson.mobilenet.WebML.probability = value;
            }
        }
    } else if (mlTool == "squeezenet") {
        if (backendModel == "WASM") {
            if (parameter == "inferenceTime") {
                TTFEjson.squeezenet.WASM.inferenceTime = value;
            } else if (parameter == "name") {
                TTFEjson.squeezenet.WASM.name = value;
            } else if (parameter == "probability") {
                TTFEjson.squeezenet.WASM.probability = value;
            }
        } else if (backendModel == "WebGL2") {
            if (parameter == "inferenceTime") {
                TTFEjson.squeezenet.WebGL2.inferenceTime = value;
            } else if (parameter == "name") {
                TTFEjson.squeezenet.WebGL2.name = value;
            } else if (parameter == "probability") {
                TTFEjson.squeezenet.WebGL2.probability = value;
            }
        } else if (backendModel == "WebML") {
            if (parameter == "inferenceTime") {
                TTFEjson.squeezenet.WebML.inferenceTime = value;
            } else if (parameter == "name") {
                TTFEjson.squeezenet.WebML.name = value;
            } else if (parameter == "probability") {
                TTFEjson.squeezenet.WebML.probability = value;
            }
        } else if (backendModel == "MPS") {
            if (parameter == "inferenceTime") {
                TTFEjson.squeezenet.MPS.inferenceTime = value;
            } else if (parameter == "name") {
                TTFEjson.squeezenet.MPS.name = value;
            } else if (parameter == "probability") {
                TTFEjson.squeezenet.MPS.probability = value;
            }
        } else if (backendModel == "BNNS") {
            if (parameter == "inferenceTime") {
                TTFEjson.squeezenet.BNNS.inferenceTime = value;
            } else if (parameter == "name") {
                TTFEjson.squeezenet.BNNS.name = value;
            } else if (parameter == "probability") {
                TTFEjson.squeezenet.BNNS.probability = value;
            }
        }
    } else if (mlTool == "ssd_mobilenet") {
        if (backendModel == "WASM") {
            if (parameter == "inferenceTime") {
                TTFEjson.ssd_mobilenet.WASM.inferenceTime = value;
            }
        } else if (backendModel == "WebGL2") {
            if (parameter == "inferenceTime") {
                TTFEjson.ssd_mobilenet.WebGL2.inferenceTime = value;
            }
        } else if (backendModel == "WebML") {
            if (parameter == "inferenceTime") {
                TTFEjson.ssd_mobilenet.WebML.inferenceTime = value;
            }
        }
    } else if (mlTool == "posenet") {
        if (backendModel == "WASM") {
            if (parameter == "inferenceTime") {
                TTFEjson.posenet.WASM.inferenceTime = value;
            }
        } else if (backendModel == "WebGL2") {
            if (parameter == "inferenceTime") {
                TTFEjson.posenet.WebGL2.inferenceTime = value;
            }
        } else if (backendModel == "WebML") {
            if (parameter == "inferenceTime") {
                TTFEjson.posenet.WebML.inferenceTime = value;
            }
        }
    }

    fs.writeFileSync("./TTFE.config.json", JSON.stringify(TTFEjson, null, 4));
}

function checkTestResult (mlTool, backendModel, inferenceTime, name, probability) {
    let result = "passed";

    let benchmarkTime = getBenchmark(mlTool, backendModel, "inferenceTime");
    if (inferenceTime > benchmarkTime && ((inferenceTime - benchmarkTime) > benchmarkTime * 0.05)) {
        result = "failed";
    }

    if (name !== null && result !== "failed") {
        let benchmarkName = getBenchmark(mlTool, backendModel, "name");
        if (name !== benchmarkName) {
            result = "failed";
        }
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
    TTFElog("console", "example test is start");

    for (let i = 0; i < mlTools.length; i++) {
        for (let j = 0; j < backendModels.length; j++) {
            let mlTool = mlTools[i];
            let backendModel = backendModels[j];
            let pageURL = exampleURL + mlTool + "/";

            if (backendModel == "MPS" || backendModel == "BNNS") {
                if (platform == "mac" && mlTool == "squeezenet") {
                    if (backendModel == "MPS") {
                        pageURL = pageURL + "index.html?prefer=sustained";
                        backendModel = "WebML";
                    } else if (backendModel == "BNNS") {
                        pageURL = pageURL + "index.html?prefer=fast";
                        backendModel = "WebML";
                    }
                } else {
                    TTFElog("debug", "example: not support " + mlTool + " " + backendModel + " on " + platform);
                    continue;
                }
            }

            await driver.getCurrentUrl().then(async function(url) {
                if (url !== pageURL) {
                    await driver.get(pageURL);
                    TTFElog("console", "open '" + pageURL + "'");

                    await driver.wait(until.elementLocated(By.xpath("//*[@id='inferenceTime']/em")), 100000).catch(function() {
                        throw new Error("failed to load web page");
                    });

                    let imageURL, imageTime, imagePath;
                    if (TTFEjson.image.flag == true) {
                        TTFElog("console", "with image '" + getImage(mlTool) + "'");

                        imagePath = libPath + getImage(mlTool);
                        TTFElog("debug", "current image path '" + imagePath + "'");

                        if (mlTool == "posenet") {
                            await driver.findElement(By.xpath("//*[@id='inferenceTime']/em")).getText().then(function(message) {
                                TTFElog("debug", message);
                                imageTime = message;
                            });

                            await driver.findElement(By.xpath("//*[@id='image']")).sendKeys(imagePath);

                            await driver.wait(function() {
                                return driver.findElement(By.xpath("//*[@id='inferenceTime']/em")).getText().then(function(message) {
                                    return (message !== imageTime);
                                });
                            }, 100000).catch(function() {
                                throw new Error("failed to load image");
                            });
                        } else {
                            await driver.findElement(By.xpath("//*[@id='image']")).getAttribute("src").then(function(message) {
                                TTFElog("debug", message);
                                imageURL = message;
                            });

                            await driver.findElement(By.xpath("//*[@id='input']")).sendKeys(imagePath);

                            await driver.wait(function() {
                                return driver.findElement(By.xpath("//*[@id='image']")).getAttribute("src").then(function(message) {
                                    return (message !== imageURL);
                                });
                            }, 100000).catch(function() {
                                throw new Error("failed to load image");
                            });
                        }
                    } else {
                        TTFElog("console", "with the default image");
                    }
                }
            });

            let backendCurrent;
            let backendElement = await driver.findElement(By.xpath("//*[@id='backend']"));

            await backendElement.getText().then(function(message) {
                backendCurrent = message;
                TTFElog("debug", "current backend '" + backendCurrent + "'");
            });

            if (backendCurrent !== backendModel) {
                await backendElement.click();
                await driver.sleep(3000);
                await driver.findElement(By.xpath('//*[@id="' + backendId.get(backendModel) + '"]')).click();
                TTFElog("debug", "change current backend to '" + backendModel + "'");
            } else {
                TTFElog("debug", "no need to change current backend");
            }

            await driver.wait(function() {
                return backendElement.getText().then(function(message) {
                    return (message === backendModel);
                });
            }, 10000).then(async function() {
                let inferenceTime;
                await driver.findElement(By.xpath("//*[@id='inferenceTime']/em")).getText().then(function(message) {
                    inferenceTime = message;
                    TTFElog("debug", "current inference time '" + inferenceTime + "'");

                    if (getBenchmark(mlTool, backendModels[j], "inferenceTime") == null) {
                        setBenchmark(mlTool, backendModels[j], "inferenceTime", inferenceTime);
                        TTFElog("console", "set benchmark " + mlTool + " " + backendModels[j] + " inference time '" + inferenceTime + "'");
                    }
                });

                if (mlTool == "ssd_mobilenet" || mlTool == "posenet") {
                    checkTestResult(mlTool, backendModels[j], inferenceTime, null, null);
                } else {
                    let nameFirst, probabilityFirst;
                    await driver.findElement(By.xpath("//*[@id='label0']")).getText().then(function(message) {
                        nameFirst = message;
                        TTFElog("debug", "current first name '" + nameFirst + "'");

                        if (getBenchmark(mlTool, backendModels[j], "name") == null) {
                            setBenchmark(mlTool, backendModels[j], "name", nameFirst);
                            TTFElog("console", "set benchmark " + mlTool + " " + backendModels[j] + " name '" + nameFirst + "'");
                        }
                    });

                    await driver.findElement(By.xpath("//*[@id='prob0']")).getText().then(function(message) {
                        probabilityFirst = message.slice(0, -1);
                        TTFElog("debug", "current first probability '" + probabilityFirst + "'");

                        if (getBenchmark(mlTool, backendModels[j], "probability") == null) {
                            setBenchmark(mlTool, backendModels[j], "probability", probabilityFirst);
                            TTFElog("console", "set benchmark " + mlTool + " " + backendModels[j] + " probability '" + probabilityFirst + "'");
                        }
                    });

                    checkTestResult(mlTool, backendModels[j], inferenceTime, nameFirst, probabilityFirst);
                }
            }).catch(function() {
                TTFElog("debug", "can not change current backend to '" + backendModels[j] + "'");
                TTFElog("console", "example: " + mlTool + " " + backendModels[j] + " is canceled");
            });

            await driver.sleep(3000);
        }
    }
})().then(function() {
    TTFElog("console", "example test is completed");
    driver.quit();
}).catch(function(err) {
    TTFElog("console", err);
    driver.quit();
});
