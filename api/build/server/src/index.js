"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = require("path");
const express_openapi_validator_1 = require("express-openapi-validator");
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: (0, path_1.join)(__dirname, '../../../../.env') });
const PORT = (process.env.NODE_ENV === "Production") ? process.env.API_PORT : 3000;
const apiSpec = (0, path_1.join)(__dirname, "../../openapi/openapi.yaml");
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.text());
app.use(express_1.default.json());
app.use('/spec', express_1.default.static(apiSpec));
app.use((0, express_openapi_validator_1.middleware)({
    apiSpec,
    validateRequests: true,
    operationHandlers: (0, path_1.join)(__dirname)
}));
app.listen(PORT, () => { console.log(`listening on port ${PORT}`); });
