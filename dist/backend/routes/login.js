"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const const_1 = require("../common/const");
const utils_1 = require("../common/utils");
function default_1(ctx) {
    if (ctx.method === "POST") {
        if (!ctx.is("json")) {
            (0, utils_1.sendError)(ctx, const_1.ERROR.invalidMime);
            return;
        }
        ;
        let data = ctx.request.body;
        if (!(data === null || data === void 0 ? void 0 : data.username) || !(data === null || data === void 0 ? void 0 : data.password) || !(data === null || data === void 0 ? void 0 : data.email)) {
            (0, utils_1.sendError)(ctx, const_1.ERROR.badRequest);
            return;
        }
        // ADD USER TO DATABASE
        console.log(data.username, data.password, data.email);
        // ADD USER TO DATABASE
    }
}
exports.default = default_1;
