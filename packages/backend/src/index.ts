import Koa from "koa";

// import routeOAuth from "./routes/oauth";
// import routeLogin from "./routes/login";

import routeRegister from "./routes/register";

import bodyParser from "koa-bodyparser";

import * as Const from "./common/const";

const app = new Koa();

app.use(bodyParser({
  onerror: () => {}
}));

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
