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
const koa_1 = __importDefault(require("koa"));
const Const = __importStar(require("./common/const"));
const login_1 = __importDefault(require("./routes/login"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const const_1 = require("./common/const");
const utils_1 = require("./common/utils");
const app = new koa_1.default();
app.use((0, koa_bodyparser_1.default)({
    onerror: (_, ctx) => {
        (0, utils_1.sendError)(ctx, const_1.ERROR.invalidJSON);
    }
}));
app.use((ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (ctx.path === "/") {
        ctx.set("Content-type", "text/html");
        ctx.status = 200;
        ctx.body = "welcome to index";
    }
    else if (ctx.path.startsWith("/api/login")) {
        (0, login_1.default)(ctx);
    }
    yield next();
}));
app.listen(Const.PORT, () => {
    console.log(`listening at http://localhost:${Const.PORT}`);
});
