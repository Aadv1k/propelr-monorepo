import Koa from 'koa';

import { ERROR, JWT_SECRET } from '../common/const';
import * as utils from '../common/utils';

import * as common from '@propelr/common';
import { DBFlow } from '../types/userRepository';
import { USER_DB } from '../models/UserRepository';

function validateTokenOrSendError(ctx: Koa.Context): void {
  if (!ctx.headers.authorization || common.jwt.verify(ctx.headers?.authorization?.split(' ')?.[1], JWT_SECRET)) {
    utils.sendErrorResponse(ctx, ERROR.unauthorized);
    return;
  }
}

async function handlePost(ctx: Koa.Context): Promise<void> {
  validateTokenOrSendError(ctx);

  // we already validate this
  let target = ctx.headers.authorization as any;
  let parsedToken = common.jwt.parse(target.split(' ')[1], JWT_SECRET)

  if (ctx.headers["content-type"] !== "application/json") {
    utils.sendErrorResponse(ctx, ERROR.invalidMime);
    return;
  }

  if (!ctx.request.body) {
    utils.sendErrorResponse(ctx, ERROR.invalidJSON);
    return;
  }

  const data = ctx.request.body as DBFlow;

  if (!data?.query) {
    utils.sendErrorResponse(ctx, ERROR.badInput);
    return;
  }

  if (!utils.verifyDracoSyntax(data.query)) {
    utils.sendErrorResponse(ctx, ERROR.invalidDracoSyntax);
    return;
  }

  const flow: DBFlow = {
    id: utils.generateId(16),
    userid: parsedToken.id,
    query: data.query,
    vars: data?.vars,
  }

  const pushedFlow = await USER_DB.pushFlow(flow);

  if (!pushedFlow) {
    utils.sendErrorResponse(ctx, ERROR.internalError);
    return;
  }

  utils.sendJSONResponse(ctx, {
      message: "Successfully added a flow",
      data: {
        id: flow.id,
      },
    status: 200,
  });
}


async function handleGet(ctx: Koa.Context): Promise<void> {
  validateTokenOrSendError(ctx);

  // we already validate this
  let target = ctx.headers.authorization as any;
  let parsedToken = common.jwt.parse(target.split(' ')[1], JWT_SECRET)

  const foundUser = await USER_DB.getUserByEmail(parsedToken.email);

  if (!foundUser) {
    utils.sendErrorResponse(ctx, ERROR.userNotFound);
    return;
  }

  const foundFlows = await USER_DB.getFlowsByUserId(foundUser.id);
  if (!foundFlows) {
    utils.sendErrorResponse(ctx, ERROR.internalError);
    return;
  }

  utils.sendJSONResponse(ctx, {
    message: "Success",
    data: [
      ...foundFlows
    ],
    status: 200,
  }, 200)
}

export default async function (ctx: Koa.Context): Promise<void> {
  switch (ctx.method) {
    case "POST":
      await handlePost(ctx);
      break;
    case "GET":
      await handleGet(ctx);
      break;
    default: 
      utils.sendErrorResponse(ctx, ERROR.invalidMethod);
      break;
  }
}
