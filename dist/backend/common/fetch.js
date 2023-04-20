"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const node_http_1 = __importDefault(require("node:http"));
const node_http_2 = __importDefault(require("node:http"));
function GET(target) {
    const url = new URL(target);
    return new Promise((resolve, reject) => {
        (url.protocol === "http:" ? node_http_1.default : node_http_2.default)
            .get(url.href, (res) => {
            let data = [];
            res.on("data", (d) => data.push(d));
            res.on("end", () => resolve(data));
            res.on("error", (error) => reject(error));
        });
    });
}
exports.GET = GET;
