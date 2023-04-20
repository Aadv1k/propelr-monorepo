"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR = exports.ABSTRACT = exports.isProd = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: "../../"
});
exports.PORT = 3000;
exports.isProd = ((_a = process.env) === null || _a === void 0 ? void 0 : _a.NODE_ENV) === "production" ? true : false;
exports.ABSTRACT = {
    KEY: (_b = process.env.ABSTRACT_API_KEY) !== null && _b !== void 0 ? _b : "",
};
exports.ERROR = {
    invalidMime: {
        code: "invalid-mime",
        message: "Invalid MIME type",
        details: "The provided MIME type is not valid. Please provide a valid MIME type in the request",
        status: 400,
    },
    invalidJSON: {
        code: "invalid-JSON",
        message: "Invalid JSON",
        details: "expected valid JSON for the path",
        status: 400,
    },
    badRequest: {
        code: "bad-request",
        message: "Received a bad request",
        details: "expected a particular data format recieved something else",
        status: 400,
    },
};
