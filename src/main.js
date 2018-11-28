const Builder = require("../node_modules/selenium-webdriver").Builder;
const By = require("../node_modules/selenium-webdriver").By;
const until = require("../node_modules/selenium-webdriver").until;
const Chrome = require("../node_modules/selenium-webdriver/chrome");
const execSync = require("child_process").execSync;
const fs = require("fs");
const os = require("os");

var ECjson = JSON.parse(fs.readFileSync("./ExampleChecker.json"));
var exampleURL = ECjson.exampleURL;
var testPlatform = ECjson.platform;
var browserPath = ECjson.chromium.path;
var chromiumFlag = ECjson.chromium.flag;
var imageFlag = ECjson.image.flag;
var chromeOption = new Chrome.Options();
var runPlatform, adbPath, command, imagePath;
var Examples = ["image_classification", "posenet", "ssd_mobilenet"];
var CollectionModels = [
    "default",
    "Mobilenet V1(TFlite)",
    "Mobilenet V2(TFlite)",
    "Inception V3(TFlite)",
    "Inception V4(TFlite)",
    "Squeezenet(TFlite)",
    "Incep. Res. V2(TFlite)",
    "SqueezeNet(Onnx)",
    "Mobilenet v2(Onnx)",
    "Resnet v1(Onnx)",
    "Resnet v2(Onnx)",
    "Inception v2(Onnx)"
];
var CollectionBackends = [
    "WebML",
    "WASM",
    "WebGL2"
];
var CollectionPrefers = [
    "skip",
    "MPS",
    "BNNS"
];
var defaultModels = ["default"];
var defaultBackend = ["WASM"];
var defaultPrefers = ["skip"];
var resultData = new Map();

var sys = os.type();
switch(sys) {
    case "Linux":
        runPlatform = "Linux";
        adbPath = "./lib/adb-tool/Linux/adb";
        imagePath = process.cwd() + "/lib/image/";
        break;
    case "Darwin":
        runPlatform = "Mac";
        adbPath = "./lib/adb-tool/Mac/adb";
        imagePath = process.cwd() + "/lib/image/";
        break;
    case "Windows_NT":
        runPlatform = "Windows";
        adbPath = ".\\lib\\adb-tool\\Windows\\adb";
        imagePath = process.cwd() + "\\lib\\image\\";
        break;
}

switch(testPlatform) {
    case "Windows":
        chromeOption = chromeOption.setChromeBinaryPath(browserPath);
        if (chromiumFlag) {
            chromeOption = chromeOption.addArguments("--no-sandbox");
        };
        break;
    case "Linux":
        chromeOption = chromeOption.setChromeBinaryPath(browserPath);
        if (chromiumFlag) {
            chromeOption = chromeOption.addArguments("--no-sandbox");
        };
        break;
    case "Mac":
        chromeOption = chromeOption.setChromeBinaryPath(browserPath);
        break;
    case "Android":
        if (chromiumFlag) {
            chromeOption = chromeOption.androidPackage("org.chromium.chrome");
        } else {
            chromeOption = chromeOption.androidPackage("com.android.chrome");
        };
        command = adbPath + " start-server";
        execSync(command, {encoding: "UTF-8", stdio: "pipe"});
        break;
}

const driver = new Builder()
    .forBrowser("chrome")
    .setChromeOptions(chromeOption)
    .build();

var debugFlag = false;
function EClog (target, message) {
    if (target == "console") {
        console.log("EC -- " + message);
    } else if (target == "debug") {
        if (debugFlag) console.log("EC -- " + message);
    } else {
        throw new Error("Not support target '" + target + "'");
    }
}

function changeModelName (modelName) {
    let name = null;
    if (modelName == "default" ||
        modelName == "Mobilenet_V1_TFlite" ||
        modelName == "Mobilenet_V2_TFlite" ||
        modelName == "Inception_V3_TFlite" ||
        modelName == "Inception_V4_TFlite" ||
        modelName == "Squeezenet_TFlite" ||
        modelName == "Incep_Res_V2_TFlite" ||
        modelName == "SqueezeNet_Onnx" ||
        modelName == "Mobilenet_v2_Onnx" ||
        modelName == "Resnet_v1_Onnx" ||
        modelName == "Resnet_v2_Onnx" ||
        modelName == "Inception_v2_Onnx") {
        name = modelName;
    } else {
        switch(modelName) {
            case "Mobilenet V1(TFlite)":
                name = "Mobilenet_V1_TFlite";
                break;
            case "Mobilenet V2(TFlite)":
                name = "Mobilenet_V2_TFlite";
                break;
            case "Inception V3(TFlite)":
                name = "Inception_V3_TFlite";
                break;
            case "Inception V4(TFlite)":
                name = "Inception_V4_TFlite";
                break;
            case "Squeezenet(TFlite)":
                name = "Squeezenet_TFlite";
                break;
            case "Incep. Res. V2(TFlite)":
                name = "Incep_Res_V2_TFlite";
                break;
            case "SqueezeNet(Onnx)":
                name = "SqueezeNet_Onnx";
                break;
            case "Mobilenet v2(Onnx)":
                name = "Mobilenet_v2_Onnx";
                break;
            case "Resnet v1(Onnx)":
                name = "Resnet_v1_Onnx";
                break;
            case "Resnet v2(Onnx)":
                name = "Resnet_v2_Onnx";
                break;
            case "Inception v2(Onnx)":
                name = "Inception_v2_Onnx";
                break;
        }
    }

    return name;
}

function getBenchmark (example, model, backend, prefer, parameter) {
    model = changeModelName(model);

    if (prefer !== "skip") {
        return ECjson[example][model][backend][prefer][parameter];
    } else {
        return ECjson[example][model][backend][parameter];
    }
}

function setBenchmark (example, model, backend, prefer, parameter, value) {
    model = changeModelName(model);

    if (typeof ECjson[example] == "undefined") {
        ECjson[example] = new Map();
    }

    if (typeof ECjson[example][model] == "undefined") {
        ECjson[example][model] = new Map();
    }

    if (typeof ECjson[example][model][backend] == "undefined") {
        ECjson[example][model][backend] = new Map();
    }

    if (prefer !== "skip") {
        if (typeof ECjson[example][model][backend][prefer] == "undefined") {
            ECjson[example][model][backend][prefer] = new Map();
        }

        ECjson[example][model][backend][prefer][parameter] = value;
    } else {
        ECjson[example][model][backend][parameter] = value;
    }

    fs.writeFileSync("./ExampleChecker.json", JSON.stringify(ECjson, null, 4));
}

function replaceNullValue (example, model, backend, prefer, InferenceTime, Label, Probability) {
    model = changeModelName(model);

    if (getBenchmark(example, model, backend, prefer, "InferenceTime") == null) {
        setBenchmark(example, model, backend, prefer, "InferenceTime", InferenceTime);
    }

    if (example == "image_classification") {
        if (getBenchmark(example, model, backend, prefer, "Label") == null) {
            setBenchmark(example, model, backend, prefer, "Label", Label);
        }

        if (getBenchmark(example, model, backend, prefer, "Probability") == null) {
            setBenchmark(example, model, backend, prefer, "Probability", Probability);
        }
    }
}

function setResultData (example, model, backend, prefer, parameter, value) {
    model = changeModelName(model);

    if (typeof resultData.get(example) == "undefined") {
        resultData.set(example, new Map());
    }

    if (typeof resultData.get(example).get(model) == "undefined") {
        resultData.get(example).set(model, new Map());
    }

    if (typeof resultData.get(example).get(model).get(backend) == "undefined") {
        resultData.get(example).get(model).set(backend, new Map());
    }

    if (prefer !== "skip") {
        if (typeof resultData.get(example).get(model).get(backend).get(prefer) == "undefined") {
            resultData.get(example).get(model).get(backend).set(prefer, new Map());
        }

        resultData.get(example).get(model).get(backend).get(prefer).set(parameter, value);
    } else {
        resultData.get(example).get(model).get(backend).set(parameter, value);
    }
}

function printResultData () {
    console.log("");
    console.log("test platform: " + testPlatform);
    console.log(" run platform: " + runPlatform);

    if (chromiumFlag) {
        console.log("      browser: chromium");
    } else {
        console.log("      browser: chrome");
    }

    console.log("");
    console.log("Result:");

    for (let exampleKey of resultData.keys()) {
        console.log("  example: " + exampleKey);
        for (let modelKey of resultData.get(exampleKey).keys()) {
            console.log("    model: " + modelKey);
            for (let backendKey of resultData.get(exampleKey).get(modelKey).keys()) {
                if (typeof resultData.get(exampleKey).get(modelKey).get(backendKey).get("result") == "undefined") {
                    console.log("  backend: " + backendKey);
                    for (let preferKey of resultData.get(exampleKey).get(modelKey).get(backendKey).keys()) {
                        console.log("   prefer: " + preferKey + " - " +
                                    resultData.get(exampleKey).get(modelKey).get(backendKey).get(preferKey).get("result"));
                    }
                } else {
                    console.log("  backend: " + backendKey + " - " +
                                resultData.get(exampleKey).get(modelKey).get(backendKey).get("result"));
                }
            }
            console.log("");
        }
    }
}

function checkTestResult (example, model, backend, prefer, InferenceTime, Label, Probability) {
    model = changeModelName(model);
    let result = "passed";

    let benchmarkTime = getBenchmark(example, model, backend, prefer, "InferenceTime");
    if (InferenceTime > benchmarkTime && ((InferenceTime - benchmarkTime) > benchmarkTime * 0.05)) {
        result = "failed";
    }

    if (Label !== null && result !== "failed") {
        let benchmarkLabel = getBenchmark(example, model, backend, prefer, "Label");
        if (Label !== benchmarkLabel) {
            result = "failed";
        }
    }

    if (Probability !== null && result !== "failed") {
        let benchmarkProbability = getBenchmark(example, model, backend, prefer, "Probability");
        if (Probability < benchmarkProbability && ((benchmarkProbability - Probability) > benchmarkProbability * 0.05)) {
            result = "failed";
        }
    }

    setResultData(example, model, backend, prefer, "result", result);

    EClog("console", "result is '" + result + "'");
}

var currentExample, currentModel, currentBackend, currentPrefer, currentInferenceTime, currentLabel, currentProbability;
var Models, Backends, Prefers;
(async function() {
    EClog("console", "example test is start");

    // Refresh: currentModel, currentBackend, currentPrefer
    var waitLoadPage = async function() {
        await driver.wait(async function() {
            let modelFlag = false;
            let backendFlag = false;
            let preferFlag = false;

            await driver.findElement(By.xpath("//*[@id='selectModel']")).getText().then(function(message) {
                EClog("debug", "model: " + message);
                for (let model of CollectionModels) {
                    if (message == model) {
                        modelFlag = true;
                        currentModel = message;
                    }
                };
            }).catch(function(err) {
                currentModel = defaultModels[0];
                modelFlag = true;
            });

            await driver.findElement(By.xpath("//*[@id='backend']")).getText().then(function(message) {
                EClog("debug", "backend: " + message);
                for (let backend of CollectionBackends) {
                    if (message == backend) {
                        backendFlag = true;
                        currentBackend = message;
                    }
                }
            }).catch(function(err) {
                currentBackend = defaultBackend[0];
                backendFlag = true;
            });

            await driver.findElement(By.xpath("//*[@id='selectPrefer']")).getText().then(function(message) {
                EClog("debug", "prefer: " + message);
                if (message == "") {
                    currentPrefer = defaultPrefers[0];
                    preferFlag = true;
                } else {
                    for (let prefer of CollectionPrefers) {
                        if (message == prefer) {
                            preferFlag = true;
                            currentPrefer = message;
                        }
                    }
                }
            }).catch(function(err) {
                currentPrefer = defaultPrefers[0];
                preferFlag = true;
            });

            if (modelFlag == true && backendFlag == true && preferFlag == true) {
                return true;
            } else {
                return false;
            }
        }, 300000).then(function() {
            EClog("debug", "currentExample: " + currentExample);
            EClog("debug", "currentModel: " + currentModel);
            EClog("debug", "currentBackend: " + currentBackend);
        }).catch(function(err) {
            EClog("debug", err);
        });

        await driver.sleep(5000);
    }

    var getModels = async function() {
        await driver.findElement(By.xpath("//*[@id='selectModel']")).then(async function(element) {
            await element.findElements(By.xpath("./following-sibling::div[1]/child::*")).then(async function(elements) {
                for (let element of elements) {
                    await element.getAttribute("textContent").then(function(message) {
                        EClog("debug", message);
                        Models.push(message);
                    });
                }
            });
        }).catch(function(err) {
            EClog("debug", err);
            if (err.name == "NoSuchElementError") {
                Models = defaultModels;
            }
        });

        EClog("console", "get models: " + Models);
    }

    var getBackends = async function() {
        await driver.findElement(By.xpath("//*[@id='backend']")).then(async function(element) {
            await element.findElements(By.xpath("./following-sibling::div[1]/child::*")).then(async function(elements) {
                for (let element of elements) {
                    await element.getAttribute("class").then(async function(message) {
                        EClog("debug", message);

                        if (message !== "dropdown-item disabled") {
                            await element.getAttribute("textContent").then(function(message) {
                                EClog("debug", message);
                                Backends.push(message);
                            });
                        }
                    });
                }
            });
        }).catch(function(err) {
            EClog("debug", err);
            if (err.name == "NoSuchElementError") {
                Backends = defaultBackend;
            }
        });

        EClog("console", "get backends: " + Backends);
    }

    var getPrefers = async function() {
        await driver.findElement(By.xpath("//*[@id='selectPrefer']")).then(async function(element) {
            await element.getAttribute("textContent").then(async function(message) {
                if (message !== "undefined") {
                    await element.findElements(By.xpath("./following-sibling::div[1]/child::*")).then(async function(elements) {
                        for (let ele of elements) {
                            await ele.getAttribute("textContent").then(function(message) {
                                EClog("debug", message);
                                Prefers.push(message);
                            });
                        }
                    });
                } else {
                    Prefers = defaultPrefers;
                }
            });
        }).catch(function(err) {
            EClog("debug", err);
            if (err.name == "NoSuchElementError") {
                Prefers = defaultPrefers;
            }
        });

        EClog("console", "get prefers: " + Prefers);
    }

    var getBackendAlert = async function() {
        EClog("console", "get backend alert");

        let alertFlag = false;
        await driver.findElement(By.xpath("//*[@id='backendAlert']")).then(async function(element) {
            alertFlag = true;
        }).catch(function(err) {
            EClog("debug", err);
            if (err.name == "NoSuchElementError") {
                alertFlag = false;
            }
        });

        return alertFlag;
    }

    var cleanBackendAlert = async function() {
        EClog("console", "clean backend alert");

        await driver.findElements(By.xpath("//*[@id='backendAlert']")).then(async function(elements) {
            for (let element of elements) {
                await element.findElement(By.xpath("./button")).then(async function(ele) {
                    ele.click();
                    await driver.sleep(3000);
                });
            }
        });
    }

    var switchImage = async function(example) {
        let imageName, imageTime, imageURL;

        if (example == "image_classification") {
            imageName = ECjson.image.image_classification;
        } else if (example == "posenet") {
            imageName = ECjson.image.posenet;
        } else if (example == "ssd_mobilenet") {
            imageName = ECjson.image.ssd_mobilenet;
        }

        EClog("console", "with image '" + imageName + "'");

        if (example == "posenet") {
            await driver.findElement(By.xpath("//*[@id='inferenceTime']/em")).getText().then(function(message) {
                imageTime = message;
            });

            await driver.findElement(By.xpath("//*[@id='image']")).sendKeys(imagePath + imageName).catch(function(err) {EClog("debug", err);});

            await driver.wait(function() {
                return driver.findElement(By.xpath("//*[@id='inferenceTime']/em")).getText().then(function(message) {
                    return (message !== imageTime);
                });
            }, 100000).catch(function() {
                throw new Error("failed to load image");
            });
        } else {
            await driver.findElement(By.xpath("//*[@id='image']")).getAttribute("src").then(function(message) {
                imageURL = message;
            });

            await driver.findElement(By.xpath("//*[@id='input']")).sendKeys(imagePath + imageName).catch(function(err) {EClog("debug", err);});

            await driver.wait(function() {
                return driver.findElement(By.xpath("//*[@id='image']")).getAttribute("src").then(function(message) {
                    return (message !== imageURL);
                });
            }, 100000).catch(function() {
                throw new Error("failed to load image");
            });
        }

        await driver.sleep(5000);
    }

    var switchModel = async function(model) {
        EClog("console", "switch model to '" + model + "'");

        await driver.findElement(By.xpath("//*[@id='selectModel']")).then(async function(element) {
            await element.click();
            await driver.sleep(3000);
            await element.findElements(By.xpath("./following-sibling::div[1]/child::*")).then(async function(elements) {
                for (let ele of elements) {
                    await ele.getAttribute("textContent").then(function(message) {
                        if (model == message) {
                            ele.click();
                        }
                    });
                }
            });
            await driver.sleep(3000);
        });
    }

    var switchBackend = async function(backend) {
        EClog("console", "switch backend to '" + backend + "'");

        await driver.findElement(By.xpath("//*[@id='backend']")).click();
        await driver.sleep(3000);

        switch(backend) {
            case "WASM":
                await driver.findElement(By.xpath("//*[@id='wasm']")).click();
                break;
            case "WebGL2":
                await driver.findElement(By.xpath("//*[@id='webgl']")).click();
                break;
            case "WebML":
                await driver.findElement(By.xpath("//*[@id='webml']")).click();
                break;
        }

        await driver.sleep(3000);
    }

    var switchPrefer = async function(prefer) {
        EClog("console", "switch prefer to '" + prefer + "'");

        await driver.findElement(By.xpath("//*[@id='selectPrefer']")).then(async function(element) {
            await element.click();
            await driver.sleep(3000);
            await element.findElements(By.xpath("./following-sibling::div[1]/child::*")).then(async function(elements) {
                for (let ele of elements) {
                    await ele.getAttribute("textContent").then(function(message) {
                        if (prefer == message) {
                            ele.click();
                        }
                    });
                }
            });
            await driver.sleep(3000);
        });
    }

    // Refresh: currentInferenceTime, currentLabel, currentProbability
    var getPageData = async function(example, model, backend, prefer) {
        EClog("console", "grabbing example data");

        if (example == "image_classification") {
            await driver.findElement(By.xpath("//*[@id='label0']")).getText().then(function(message) {
                currentLabel = message;
                setResultData(example, model, backend, prefer, "Label", currentLabel);
                EClog("console", "current first name '" + currentLabel + "'");
            });

            await driver.findElement(By.xpath("//*[@id='prob0']")).getText().then(function(message) {
                currentProbability = message.slice(0, -1);
                setResultData(example, model, backend, prefer, "Probability", currentProbability);
                EClog("console", "current first probability '" + currentProbability + "'");
            });
        }

        await driver.findElement(By.xpath("//*[@id='inferenceTime']/em")).getText().then(function(message) {
            currentInferenceTime = message;
            setResultData(example, model, backend, prefer, "InferenceTime", currentInferenceTime);
            EClog("console", "current inference time '" + currentInferenceTime + "'");
        });
    }

    for (let example of Examples) {
        let pageURL = exampleURL + "/" + example + "/index.html";
        Models = new Array();
        Backends = new Array();
        Prefers = new Array();
        currentExample = example;
        currentModel = null;
        currentBackend = null;
        currentPrefer = null;
        currentInferenceTime = null;
        currentLabel = null;
        currentProbability = null;

        await driver.get(pageURL).then(async function() {
            EClog("console", "open '" + pageURL + "'");
        });

        await waitLoadPage();
        EClog("console", "load example URL is completed");

        await getModels();
        await getBackends();
        await getPrefers();

        if (imageFlag) {
            await switchImage(currentExample);
        } else {
            EClog("console", "with the default image");
        }

        for (let model of CollectionModels) {
            if (Models.includes(model)) {
                if (model !== "default") {
                    if (model !== currentModel) {
                        await switchModel(model);
                        await waitLoadPage();
                    }
                }

                for (let backend of CollectionBackends) {
                    if (Backends.includes(backend)) {
                        if (backend !== currentBackend) {
                            await switchBackend(backend);
                            await waitLoadPage();
                        }

                        if (backend == "WebML" && testPlatform == "Mac") {
                            for (let prefer of CollectionPrefers) {
                                if (Prefers.includes(prefer)) {
                                    if (prefer !== "skip") {
                                        if (prefer !== currentPrefer) {
                                            await switchPrefer(prefer);
                                            await waitLoadPage();
                                        }
                                    }

                                    if (prefer !== currentPrefer && await getBackendAlert()) {
                                        await cleanBackendAlert();
                                        setResultData(currentExample, currentModel, backend, prefer, "result", "unsupport");
                                    } else {
                                        await getPageData(currentExample, currentModel, currentBackend, currentPrefer);
                                        replaceNullValue(currentExample, currentModel, currentBackend, currentPrefer,
                                                         currentInferenceTime, currentLabel, currentProbability);
                                        checkTestResult(currentExample, currentModel, currentBackend, currentPrefer,
                                                        currentInferenceTime, currentLabel, currentProbability);
                                    }
                                } else {
                                    continue;
                                }
                            }
                        } else {
                            await getPageData(currentExample, currentModel, currentBackend, "skip");
                            replaceNullValue(currentExample, currentModel, currentBackend, "skip",
                                             currentInferenceTime, currentLabel, currentProbability);
                            checkTestResult(currentExample, currentModel, currentBackend, "skip",
                                            currentInferenceTime, currentLabel, currentProbability);
                        }
                    } else {
                        continue;
                    }
                }
            } else {
                continue;
            }
        };
    }

    printResultData();
})().then(function() {
    EClog("console", "example test is completed");
    driver.quit();
}).catch(function(err) {
    EClog("console", err);
    driver.quit();
});
