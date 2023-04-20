import Koa from "koa";
import * as Const from "./common/const";
import routeOAuth from "./routes/oauth";
import routeLogin from "./routes/login";
import bodyParser from "koa-bodyparser";

import { ERROR } from "./common/const";
import { sendError } from "./common/utils";

const app = new Koa();

app.use(bodyParser({
  onerror: (_, ctx) => {
    sendError(ctx, ERROR.invalidJSON);
  }
}));

app.use(async (ctx: Koa.Context, next) => {
  if (ctx.path === "/") {
    ctx.set("Content-type", "text/html");
    ctx.status = 200;
    ctx.body = "welcome to index"
  } else if (ctx.path.startsWith("/api/login")) {
    routeLogin(ctx);
  }
  await next();
})

app.listen(Const.PORT, () => {
  console.log(`listening at http://localhost:${Const.PORT}`);
});
