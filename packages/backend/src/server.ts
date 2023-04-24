import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import passport from 'koa-passport';

import { routeOAuth, routeOAuthCallback } from './routes/oauth';

import routeRegister from './routes/register';
import routeLogin from './routes/login';

import { routeUsersGet, routeUsersDelete } from './routes/users';

import { USER_DB } from './models/UserRepository';

import {
  handleFlowsGet as routeFlowsGet,
  handleFlowsPost as routeFlowsPost,
  handleFlowsDelete as routeFlowsDelete,
} from './routes/flows';

const app = new Koa();

import * as utils from './common/utils';
import { ERROR } from './common/const';

app.use(
  bodyParser({
    onerror: () => {},
  }),
);

const ROUTES = {
  '/api/users': /^\/api\/users\/?$/,
  '/api/users/:id': /^\/api\/users\/[a-zA-Z0-9_-]+\/?$/,
  '/api/users/register': /^\/api\/users\/register\/?$/,
  '/api/users/login': /^\/api\/users\/login\/?$/,
  '/api/flows': /^\/api\/flows\/?$/,
  '/api/flows/:id': /^\/api\/flows\/[a-zA-Z0-9_-]+\/?$/,
  '/api/oauth/callback': /^\/api\/oauth\/callback\/?$/,
};

app.use(passport.initialize());

app.use(async (ctx: Koa.Context, next) => {
  await USER_DB.init();

  if (ctx.path === '/') {
    ctx.set('Content-type', 'text/html');
    ctx.status = 200;
    ctx.body = `
      <a href="/api/oauth/google">login with google</a>
      <a href="/api/oauth/microsoft">login with microsoft</a>
      `;
  } else if (ctx.url.match(ROUTES['/api/flows']) && ctx.method === 'GET') {
    await routeFlowsGet(ctx);
  } else if (ctx.url.match(ROUTES['/api/flows']) && ctx.method === 'POST') {
    await routeFlowsPost(ctx);
  } else if (ctx.url.match(ROUTES['/api/flows']) && ctx.method === 'DELETE') {
    await routeFlowsDelete(ctx);
  } else if (ctx.url.match(ROUTES['/api/users/login']) && ctx.method === 'POST') {
    await routeLogin(ctx);
  } else if (ctx.url.match(ROUTES['/api/users/register']) && ctx.method === 'POST') {
    await routeRegister(ctx);
  } else if (ctx.url.match(ROUTES['/api/users']) && ctx.method === 'GET') {
    await routeUsersGet(ctx);
  } else if (ctx.url.match(ROUTES['/api/users']) && ctx.method === 'DELETE') {
    await routeUsersDelete(ctx);
  } else if (ctx.url.match(ROUTES['/api/oauth/callback']) && ctx.method === 'GET') {
    await routeOAuthCallback(ctx, next);
  }
  await next();
});

app.use((ctx) => {
  utils.sendErrorResponse(ctx, ERROR.notFound);

})

process.on('exit', async () => {
  await USER_DB.close();
});

export default app;
