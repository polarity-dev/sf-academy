"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = require("path");
const express_openapi_validator_1 = require("express-openapi-validator");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const config_1 = require("../../config");
const apiErrorHandler_1 = __importDefault(require("../../errorHandlers/apiErrorHandler"));
const grpcErrorHandler_1 = __importDefault(require("../../errorHandlers/grpcErrorHandler"));
const apiSpec = (0, path_1.join)(__dirname, "../../openapi/openapi.yaml");
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.text());
app.use(express_1.default.json());
app.use("/spec", express_1.default.static(apiSpec));
app.use((0, express_openapi_validator_1.middleware)({
    apiSpec,
    validateRequests: true,
    validateResponses: true,
    operationHandlers: (0, path_1.join)(__dirname),
    validateSecurity: {
        handlers: {
            bearerAuth: (req, scopes, schema) => (0, verifyToken_1.default)(req)
        }
    }
}));
app.use(apiErrorHandler_1.default);
app.use(grpcErrorHandler_1.default);
app.listen(config_1.apiPort, () => { console.log(`Api server listening on port ${config_1.apiPort}`); });
