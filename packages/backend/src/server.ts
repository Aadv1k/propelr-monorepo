import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import passport from 'koa-passport';

import { routeOAuth, routeOAuthCallback } from './routes/oauth';
import routeRegister from './routes/register';
import routeLogin from './routes/login';

const app = new Koa();

app.use(bodyParser({}));

const ROUTES = {
  apiOAuthCallback: /^\/api\/oauth\/[\w-]+\/callback\/?$/,
  apiOAuth: /^\/api\/oauth\/[\w-]+\/?$/,
  apiUsersRegister: /^\/api\/users\/register$/,
  apiUsersLogin: /^\/api\/users\/login$/,
  apiUsers: /^\/api\/users\/$/,
  index: /^\/$/,
};

app.use(passport.initialize());

app.use(async (ctx: Koa.Context, next) => {
  if (ctx.path === '/') {
    ctx.set('Content-type', 'text/html');
    ctx.status = 200;
    ctx.body = `
      <a href="/api/oauth/google">login with google</a>
      <a href="/api/oauth/microsoft">login with microsoft</a>
      `;
  } else if (ctx.path.match(ROUTES.apiUsersRegister)) {
    await routeRegister(ctx);
  } else if (ctx.path.match(ROUTES.apiUsersLogin)) {
    await routeLogin(ctx);
  } else if (ctx.path.match(ROUTES.apiUsers)) {

  } else if (ctx.path.match(ROUTES.apiOAuthCallback)) {
    await routeOAuthCallback(ctx, next);
  } else if (ctx.path.match(ROUTES.apiOAuth)) {
    await routeOAuth(ctx, next);
  }   await next();
});

export default app;
