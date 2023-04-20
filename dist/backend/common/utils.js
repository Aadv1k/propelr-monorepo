"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = void 0;
function sendError(ctx, err) {
    ctx.body = JSON.stringify({
        error: {
            code: err.code,
            message: err.message,
            details: err.details,
        },
        status: err.status,
    });
    ctx.set("Content-type", "application/json");
    ctx.status = err.status;
}
exports.sendError = sendError;
