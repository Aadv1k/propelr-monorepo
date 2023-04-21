import Koa from "koa";
import bodyParser from "koa-bodyparser";
import passport from "koa-passport";

import routeRegister from "./routes/register";
import routeOAuth from "./routes/oauth";


import { sendErrorResponse } from "./common/utils";
import * as Const from "./common/const";

const app = new Koa();

app.use(bodyParser({
  onerror: () => {}
}));

app.use(async (ctx, next) => {
  if (!ctx.is('json')) {
    sendErrorResponse(ctx, Const.ERROR.invalidMime);
    return;
  }

  if (!ctx.request.body) {
    sendErrorResponse(ctx, Const.ERROR.invalidJSON);
    return;
  }

  await next();
})

app.use(passport.initialize());

app.use(async (ctx: Koa.Context, next) => {
  if (ctx.path === "/") {
    ctx.set("Content-type", "text/html");
    ctx.status = 200;
    ctx.body = "welcome to index";
  } else if (ctx.path.startsWith("/api/register")) {
    await routeRegister(ctx);
  }
  await next();
})

app.listen(Const.PORT, () => {
  console.log(`listening at http://localhost:${Const.PORT}`);
});
