import { Error } from "../types/const";
import Koa from "koa";

export function sendError(ctx: Koa.Context, err: Error) {
  ctx.body = JSON.stringify({
    error: {
      code: err.code, 
      message: err.message,
      details: err.details,
    },
    status: err.status,
  })
  ctx.set("Content-type", "application/json");
  ctx.status = err.status;
}
