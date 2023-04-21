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
  apiOAuthCallback: /^\/api\/oauth\/[\w-]+\/callback\/?$/,
  apiOAuth: /^\/api\/oauth\/[\w-]+\/?$/,
  apiRegister: /^\/api\/register$/,
  index: /^\/$/,
}

app.use(passport.initialize());

app.use(async (ctx: Koa.Context, next) => {
  if (ctx.path === "/") {
    ctx.set("Content-type", "text/html");
    ctx.status = 200;
    ctx.body = `
      <a href="/api/oauth/google">login with google</a>
      <a href="/api/oauth/microsoft">login with microsoft</a>
      `;
  } else if (ctx.path.match(ROUTES.apiRegister)) {
    await routeRegister(ctx);
  } else if (ctx.path.match(ROUTES.apiOAuthCallback)) {
    await routeOAuthCallback(ctx, next);
  } else if (ctx.path.match(ROUTES.apiOAuth)) {
    await routeOAuth(ctx, next);
  }
  await next();
})

app.listen(PORT, () => {
  console.log(`listening at http://localhost:${PORT}`);
});
