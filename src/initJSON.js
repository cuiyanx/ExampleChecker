const fs = require("fs");

var Examples = ["image_classification", "posenet", "ssd_mobilenet"];
var CollectionModels = [
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
    "MPS",
    "BNNS"
];

function changeModelName (modelName) {
    let name = null;
    switch(modelName) {
        case "default":
            name = "default";
            break;
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

    return name;
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

var ECjson = JSON.parse(fs.readFileSync("./ExampleChecker.json"));

for (let key of Object.keys(ECjson)) {
    if (key !== "exampleURL" && key !== "platform" && key !== "chromium" && key !== "image") {
        delete ECjson[key];
    }
}

fs.writeFileSync("./ExampleChecker.json", JSON.stringify(ECjson, null, 4));

for (let example of Examples) {
    if (example == "image_classification") {
        for (let model of CollectionModels) {
            for (let backend of CollectionBackends) {
                if (backend == "WebML") {
                    for (let prefer of CollectionPrefers) {
                        setBenchmark(example, model, backend, prefer, "InferenceTime", null);
                        setBenchmark(example, model, backend, prefer, "Label", null);
                        setBenchmark(example, model, backend, prefer, "Probability", null);
                    }
                }

                setBenchmark(example, model, backend, "skip", "InferenceTime", null);
                setBenchmark(example, model, backend, "skip", "Label", null);
                setBenchmark(example, model, backend, "skip", "Probability", null);
            }
        }
    } else {
        model = "default";
        for (let backend of CollectionBackends) {
            for (let backend of CollectionBackends) {
                if (backend == "WebML") {
                    for (let prefer of CollectionPrefers) {
                        setBenchmark(example, model, backend, prefer, "InferenceTime", null);
                    }
                }

                setBenchmark(example, model, backend, "skip", "InferenceTime", null);
            }
        }
    }
}
