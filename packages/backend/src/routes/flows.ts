import Koa from 'koa';

import { ERROR, JWT_SECRET } from '../common/const';
import * as utils from '../common/utils';

import * as draco from "dracoql";

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

  try {
    await runDracoQueryAndGetVar(data.query, []);
  } catch (err: any) {
    utils.sendJSONResponse(ctx, {
      error: {
        code: "invalid-draco-syntax",
        message: `Syntax check failed with "${err.name}"`,
        details: err.message
      },
      status: 400,
    }, 400);
    return;
  }


  const flow: DBFlow = {
    id: utils.generateId(8),
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

function runDracoQueryAndGetVar(query: string, vars: Array<string>): Promise<Array<string>> | undefined {
  return new Promise(async (resolve, reject) => {
    try {
      const lexer = new draco.lexer(query);
      const parser = new draco.parser(lexer.lex());
      const interpreter = new draco.interpreter(parser.parse());
      await interpreter.run();
      resolve(vars.map(e => interpreter.getVar(e)));
    } catch (err) {
      reject(err);
    }
  })
}

async function handleExecute(ctx: Koa.Context): Promise<void> {
  let splitUrl = ctx.path.split('/')
  let flowToExecute = splitUrl?.[splitUrl.findIndex(e => e === "execute") - 1]

  if (!flowToExecute) {
    utils.sendErrorResponse(ctx, ERROR.badInput);
    return;
  }

  const foundFlow = await USER_DB.getFlowById(flowToExecute);

  if (!foundFlow) {
    utils.sendErrorResponse(ctx, ERROR.flowNotFound);
    return;
  }

  let computedVars;

  try {
    computedVars = await runDracoQueryAndGetVar(foundFlow.query, foundFlow.vars);
  } catch (err: any) {
    utils.sendJSONResponse(ctx, {
      name: err.name,
      message: err.message
    })
    return;
  }

  utils.sendJSONResponse(ctx, {
    message: computedVars
  })
}

async function handleGet(ctx: Koa.Context): Promise<void> {
  const jwtString = ctx.headers?.["authorization"]?.split(" ").pop() ?? "";

  if (!common.jwt.verify(jwtString, JWT_SECRET)) {
    utils.sendErrorResponse(ctx, ERROR.unauthorized);
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
  handleDelete as handleFlowsDelete,
  handleExecute as handleFlowsExecute,

}
