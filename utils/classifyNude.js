"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.classifyNude = void 0;
const onnxjs_1 = require("onnxjs");
const path_1 = __importDefault(require("path"));
exports.classifyNude = (imagePath, callback) => __awaiter(void 0, void 0, void 0, function* () {
    const session = new onnxjs_1.InferenceSession();
    const scriptPath = path_1.default.join(__dirname, '/../../alTest.py');
    const { spawn } = require('child_process');
    const pyProg = spawn('python3', [scriptPath, imagePath]);
    let hasNudity = false;
    pyProg.stdout.on('data', function (data) {
        const response = data.toString().replace('', "").replace("b", "");
        console.warn(response, "response back");
        let buff = Buffer.from(response, 'base64');
        const predection = JSON.parse(buff.toString().replace(/\'/g, "\""))[0];
        hasNudity = predection.unsafe > predection.safe;
        callback(hasNudity);
    });
    pyProg.stderr.on('data', (errData) => {
        console.log(errData.toString());
    });
    return hasNudity;
});
//# sourceMappingURL=classifyNude.js.map