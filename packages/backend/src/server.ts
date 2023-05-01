import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import passport from 'koa-passport';
import koaCors from "@koa/cors";

import { routeOAuth, routeOAuthCallback, routeOAuthToken } from './routes/oauth';

import routeRegister from './routes/register';
import routeLogin from './routes/login';

import { createKey } from "./routes/key";

import { routeUsersGet, routeUsersDelete } from './routes/users';

import { Flow, FlowState } from "./types";

import { USER_DB } from './models/UserRepository';
import { FLOW_RUNNER } from "./models/FlowRunner";

import {
  getFlow,
  deleteFlow,
  createFlow,
  getFlowExecute,
  getFlowStop,
  getFlowStart,
} from './routes/flows';

const app = new Koa();

app.use(koaCors());

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
  '/api/oauth/:id/callback': /^\/api\/oauth\/[^/?]+\/callback(\?.*)?$/,
  '/api/oauth/:id/token': /^\/api\/oauth\/[^/?]+\/token(\?.*)?$/,
  '/api/oauth/:id': /^\/api\/oauth\/[a-zA-Z0-9_-]+\/?$/,
  '/api/flows/:id': /^\/api\/flows\/[a-zA-Z0-9_-]+\/?$/,
  "/api/flows/:id/execute": /^\/api\/flows\/[a-zA-Z0-9_-]+\/execute\/?$/,
  "/api/flows/:id/start": /^\/api\/flows\/[a-zA-Z0-9_-]+\/start\/?$/,
  "/api/flows/:id/stop": /^\/api\/flows\/[a-zA-Z0-9_-]+\/stop\/?$/,
  "/api/developers/keys": /^\/api\/developers\/keys\/?$/,
};

app.use(passport.initialize());

async function startFlowsAfterInit() {
  let flows = await USER_DB.RAW_getFlows({});
  flows.forEach((flow: Flow) => {
    if (flow.schedule.type === "none") return;
    FLOW_RUNNER.register(flow, (f: any) => {
      console.log(`should run: ${f.query.syntax}`);
    })
    if (flow.status === FlowState.RUNNING) FLOW_RUNNER.startFlowById(flow.id);
  })
}

app.use(async (ctx: Koa.Context, next) => {
  await USER_DB.init();
  await startFlowsAfterInit();

  if (ctx.path === '/') {
    utils.sendJSONResponse(ctx, Object.keys(ROUTES), 200);
  } else if (ctx.url.match(ROUTES['/api/flows']) && ctx.method === 'GET') {
    await getFlow(ctx);
  } else if (ctx.url.match(ROUTES['/api/flows']) && ctx.method === 'POST') {
    await createFlow(ctx);
  } else if (ctx.url.match(ROUTES['/api/flows/:id']) && ctx.method === 'DELETE') {
    await deleteFlow(ctx);
  } else if (ctx.url.match(ROUTES['/api/flows/:id/execute']) && ctx.method === 'GET') {
    await getFlowExecute(ctx);
  } else if (ctx.url.match(ROUTES['/api/flows/:id/start']) && ctx.method === 'GET') {
    await getFlowStart(ctx);
  } else if (ctx.url.match(ROUTES['/api/flows/:id/stop']) && ctx.method === 'GET') {
    await getFlowStop(ctx);
  } else if (ctx.url.match(ROUTES['/api/users/login']) && ctx.method === 'POST') {
    await routeLogin(ctx);
  } else if (ctx.url.match(ROUTES['/api/users/register']) && ctx.method === 'POST') {
    await routeRegister(ctx);
  } else if (ctx.url.match(ROUTES['/api/users']) && ctx.method === 'GET') {
    await routeUsersGet(ctx);
  } else if (ctx.url.match(ROUTES['/api/users']) && ctx.method === 'DELETE') {
    await routeUsersDelete(ctx);
  } else if (ctx.url.match(ROUTES['/api/oauth/:id/callback']) && ctx.method === 'GET') {
    await routeOAuthCallback(ctx, next);
  } else if (ctx.url.match(ROUTES['/api/oauth/:id/token']) && ctx.method === "GET") {
    await routeOAuthToken(ctx, next);
  } else if (ctx.url.match(ROUTES['/api/oauth/:id']) && ctx.method === "GET") {
    await routeOAuth(ctx, next); }
  else if (ctx.url.match(ROUTES['/api/developers/keys']) && ctx.method === "POST") {
    await createKey(ctx);
  } else {
    utils.sendErrorResponse(ctx, ERROR.notFound);
  } 
  await next();
});

process.on('exit', async () => {
  await USER_DB.close();
});

export default app;
