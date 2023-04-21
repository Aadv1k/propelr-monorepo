import Koa from "koa";
import bodyParser from "koa-bodyparser";
import passport from "koa-passport";

import { routeOAuth, routeOAuthCallback } from "./routes/oauth";
import routeRegister from "./routes/register";
import { PORT } from "./common/const";

const app = new Koa();

app.use(bodyParser({
  onerror: () => {}
}));


const ROUTES = {
  apiOAuthCallback: /\/api\/oauth\/(\w+)/,
  apiOAuth: /\/api\/oauth\/(\w+)/,
  apiRegister: /^\/api\/register$/,
  index: /^\/$/,
}

app.use(passport.initialize());

app.use(async (ctx: Koa.Context, next) => {
  if (ctx.path === "/") {
    ctx.set("Content-type", "text/html");
    ctx.status = 200;
    ctx.body = `<a href="/api/oauth/google">login with google</a>`;
  } else if (ctx.path.match(ROUTES.apiRegister)) {
    await routeRegister(ctx);
  } else if (ctx.path.startsWith("/api/oauth/google/callback")) {
    await routeOAuthCallback(ctx, next);
  } else if (ctx.path.startsWith("/api/oauth/google")) {
    await routeOAuth(ctx, next);
  }
  await next();
})

app.listen(PORT, () => {
  console.log(`listening at http://localhost:${PORT}`);
});
