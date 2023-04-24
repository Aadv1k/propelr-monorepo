import Koa from 'koa';

import { ERROR, JWT_SECRET } from '../common/const';
import * as utils from '../common/utils';

import * as common from '@propelr/common';
import { DBFlow } from '../types/userRepository';
import { USER_DB } from '../models/UserRepository';

async function handleDelete(ctx: Koa.Context): Promise<void> {
  let splitUrl = ctx.path.split('/')
  let flowToDelete = splitUrl?.[splitUrl.findIndex(e => e === "flows") + 1]

  if (!flowToDelete) {
    utils.sendErrorResponse(ctx, ERROR.badInput);
    return;
  }

  const jwtString = ctx.headers?.["authorization"]?.split(" ").pop() ?? "";

  if (!common.jwt.verify(jwtString, JWT_SECRET)) {
    utils.sendErrorResponse(ctx, ERROR.unauthorized);
    return;
  }

  const flowExists = await USER_DB.flowExists(flowToDelete);
  if (!flowExists) {
    utils.sendErrorResponse(ctx, ERROR.flowNotFound);
    return;
  }
  const deletedFlow = await USER_DB.deleteFlowById(flowToDelete);

  if (!deletedFlow) {
    utils.sendErrorResponse(ctx, ERROR.internalError);
    return;
  }

  utils.sendJSONResponse(ctx, { status: 204, }, 204);
}


async function handlePost(ctx: Koa.Context): Promise<void> {
  const jwtString = ctx.headers?.["authorization"]?.split(" ").pop() ?? "";

  if (!common.jwt.verify(jwtString, JWT_SECRET)) {
    utils.sendErrorResponse(ctx, ERROR.unauthorized);
    return;
  }

  const parsedToken = common.jwt.parse(jwtString);

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
    status: 201,
  });
}

async function handleExecute(ctx: Koa.Context): Promise<void> {
  let splitUrl = ctx.path.split('/')
  let flowToExecute = splitUrl?.[splitUrl.findIndex(e => e === "execute") - 1]

  if (!flowToExecute) {
    utils.sendErrorResponse(ctx, ERROR.badInput);
    return;
  }

  const flowExists = await USER_DB.flowExists(flowToExecute);
  if (!flowExists) {
    utils.sendErrorResponse(ctx, ERROR.flowNotFound);
    return;
  }

  utils.sendJSONResponse(ctx, {
    message: "Still in todo"
  });
  console.log("alright mate");
}

async function handleGet(ctx: Koa.Context): Promise<void> {
  const jwtString = ctx.headers?.["authorization"]?.split(" ").pop() ?? "";

  if (!common.jwt.verify(jwtString, JWT_SECRET)) {
    utils.sendErrorResponse(ctx, ERROR.unauthorized);
    return;
  }

  let splitUrl = ctx.path.split('/')
  let flowToExecute = splitUrl?.[splitUrl.findIndex(e => e === "execute") - 1]

  if (flowToExecute) {
    handleExecute(ctx);
    return;
  }

  const parsedToken = common.jwt.parse(jwtString);

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

  const returnFlows = foundFlows.map(e => {return {
    id: e.id, 
    query: e.query,
    vars: e?.vars ?? null,
  }});

  utils.sendJSONResponse(ctx, {
    message: "Success",
    data: [
      ...returnFlows
    ],
    status: 200,
  }, 200)
}

export {
  handleGet as handleFlowsGet,
  handlePost as handleFlowsPost,
  handleDelete as handleFlowsDelete
}
