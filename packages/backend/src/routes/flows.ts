import Koa from 'koa';
import * as draco from 'dracoql';

import { ERROR, JWT_SECRET } from '../common/const';
import * as utils from '../common/utils';
import * as common from '@propelr/common';
import { Flow, FlowState, Key, KeyPerms } from '../types';
import { USER_DB } from '../models/UserRepository';
import flowSchema from "../schemas/flow";
import { FLOW_RUNNER } from "../models/FlowRunner";

async function hasValidApiKey(ctx: Koa.Context): Promise<boolean> {
  if (!ctx.headers?.['x-api-key']) return false;
  const key = await USER_DB.getKey(ctx.headers?.['x-api-key'] as string)
  if (!key) return false;
  return true;
}

async function hasKeyPermission(key: string, perm: KeyPerms): Promise<boolean> {
  const keyObj  = await USER_DB.getKey(key);
  if (!keyObj) return false;
  if (!keyObj.permissions.includes(perm)) return false
  return true
}

async function getFlowStop(ctx: Koa.Context): Promise<void> {
  let splitUrl = ctx.path.split('/');
  let flowToStop = splitUrl?.[splitUrl.findIndex((e) => e === 'flows') + 1];

  const jwtString = ctx.headers?.['authorization']?.split(' ').pop() ?? '';
  let parsedToken = common.jwt.parse(jwtString);

  const apiKey = ctx.headers?.['x-api-key'];
  const hasValidKey = await hasValidApiKey(ctx)

  if (
    !common.jwt.verify(jwtString, JWT_SECRET) && 
    !hasValidKey
  ) {
    utils.sendErrorResponse(ctx, ERROR.unauthorized);
    return;
  }

  if (hasValidKey) {
    if (!await hasKeyPermission(apiKey as string, KeyPerms.stop)) {
      utils.sendErrorResponse(ctx, ERROR.forbidden);
      return;
    }
    const key = (await USER_DB.getKey(apiKey as string)) as Key;
    parsedToken = { id: key.userid };
  }

  if (!flowToStop) {
    utils.sendErrorResponse(ctx, ERROR.badInput);
    return;
  }

  const foundFlow = await USER_DB.getFlowById(flowToStop);
  if (!foundFlow) {
    utils.sendErrorResponse(ctx, ERROR.flowNotFound);
    return;
  }

  if (foundFlow.status !== FlowState.RUNNING) {
    utils.sendErrorResponse(ctx, ERROR.flowNotRunning);
    return;
  }

  try {
    FLOW_RUNNER.stopFlowById(flowToStop);
    await USER_DB.updateFlowFieldById(foundFlow.id, {status: FlowState.STOPPED})
  } catch {
    utils.sendErrorResponse(ctx, ERROR.internalError);
    return;
  }

  utils.sendJSONResponse(ctx, {
    message: "Stopped",
    details: `${flowToStop} was stopped`,
    data: {
      id: flowToStop
    }
  }, 200)
}

async function getFlowStart(ctx: Koa.Context): Promise<void> {
  let splitUrl = ctx.path.split('/');
  let flowToStart = splitUrl?.[splitUrl.findIndex((e) => e === 'flows') + 1];

  const jwtString = ctx.headers?.['authorization']?.split(' ').pop() ?? '';
  let parsedToken = common.jwt.parse(jwtString);

  const apiKey = ctx.headers?.['x-api-key'];
  const hasValidKey = await hasValidApiKey(ctx)

  if (
    !common.jwt.verify(jwtString, JWT_SECRET) && 
    !hasValidKey
  ) {
    utils.sendErrorResponse(ctx, ERROR.unauthorized);
    return;
  }

  if (hasValidKey) {
    if (!await hasKeyPermission(apiKey as string, KeyPerms.start)) {
      utils.sendErrorResponse(ctx, ERROR.forbidden);
      return;
    }
    const key = (await USER_DB.getKey(apiKey as string)) as Key;
    parsedToken = { id: key.userid };
  }

  if (!flowToStart) {
    utils.sendErrorResponse(ctx, ERROR.badInput);
    return;
  }

  const foundFlow = await USER_DB.getFlowById(flowToStart);
  if (!foundFlow) {
    utils.sendErrorResponse(ctx, ERROR.notFound);
    return;
  }

  if (foundFlow.status === FlowState.RUNNING) {
    utils.sendErrorResponse(ctx, ERROR.flowAlreadyRunning);
    return;
  }

  try {
    FLOW_RUNNER.startFlowById(flowToStart);
  } catch (err) {
    utils.sendErrorResponse(ctx, ERROR.internalError) // TODO: it is not a registered job
    return;
  }

  await USER_DB.updateFlowFieldById(foundFlow.id, {status: FlowState.RUNNING})

  utils.sendJSONResponse(ctx, {
    message: "Running",
    details: `${flowToStart} is now running`,
    data: {
      id: flowToStart
    }
  }, 200)
}

async function deleteFlow(ctx: Koa.Context): Promise<void> {
  const jwtString = ctx.headers?.['authorization']?.split(' ').pop() ?? '';
  let parsedToken = common.jwt.parse(jwtString);

  const apiKey = ctx.headers?.['x-api-key'];
  const hasValidKey = await hasValidApiKey(ctx)

  if (
    !common.jwt.verify(jwtString, JWT_SECRET) && 
    !hasValidKey
  ) {
    utils.sendErrorResponse(ctx, ERROR.unauthorized);
    return;
  }

  if (hasValidKey) {
    if (!await hasKeyPermission(apiKey as string, KeyPerms.delete)) {
      utils.sendErrorResponse(ctx, ERROR.forbidden);
      return;
    }
    const key = (await USER_DB.getKey(apiKey as string)) as Key;
    parsedToken = { id: key.userid };
  }


  let splitUrl = ctx.path.split('/');
  let flowToDelete = splitUrl?.[splitUrl.findIndex((e) => e === 'flows') + 1];

  if (!flowToDelete) {
    utils.sendErrorResponse(ctx, ERROR.badInput);
    return;
  }

  const flowExists = await USER_DB.flowExists(flowToDelete);
  if (!flowExists) {
    utils.sendErrorResponse(ctx, ERROR.flowNotFound);
    return;
  }
  const deletedFlow = await USER_DB.deleteFlowByUserId(parsedToken.id, flowToDelete);

  if (!deletedFlow) {
    utils.sendErrorResponse(ctx, ERROR.internalError);
    return;
  }

  utils.sendJSONResponse(ctx, {
    message: "Successfully deleted flow",
    data: {
      id: flowToDelete,
    },
    status: 204
  }, 204);
}

async function createFlow(ctx: Koa.Context): Promise<void> {
  const jwtString = ctx.headers?.['authorization']?.split(' ').pop() ?? '';

  const apiKey = ctx.headers?.['x-api-key'];
  const hasValidKey = await hasValidApiKey(ctx)

  if (
    !common.jwt.verify(jwtString, JWT_SECRET) && 
    !hasValidKey
  ) {
    utils.sendErrorResponse(ctx, ERROR.unauthorized);
    return;
  }

  let parsedToken ;
  if (hasValidKey) {
    const key = (await USER_DB.getKey(apiKey as string)) as Key;
    parsedToken = { id: key.userid };
    if (!await hasKeyPermission(apiKey as string, KeyPerms.create)) {
      utils.sendErrorResponse(ctx, ERROR.forbidden);
      return;
    }
  } else {
    parsedToken = common.jwt.parse(jwtString);
  }


  if (ctx.headers['content-type'] !== 'application/json') {
    utils.sendErrorResponse(ctx, ERROR.invalidMime);
    return;
  }

  if (!ctx.request.body) {
    utils.sendErrorResponse(ctx, ERROR.invalidJSON);
    return;
  }

  if (!utils.validateSchema(ctx.request.body, flowSchema)) {
    utils.sendErrorResponse(ctx, ERROR.badInput);
    return;
  }

  const data = ctx.request.body as Flow;

  try {
    await runDracoQueryAndGetVar(data.query.syntax, []);
  } catch (err: any) {
    utils.sendJSONResponse(
      ctx,
      {
        error: {
          code: 'invalid-draco-syntax',
          message: `Syntax check failed with "${err.name}"`,
          details: err.message,
        },
        status: 400,
      },
      400,
    );
    return;
  }

  const flow: Flow = {
    id: utils.generateId(4),
    userid: parsedToken.id as string,
    status: FlowState.STOPPED,
    query: data.query,
    schedule: data.schedule,
    receiver: data.receiver,
    createdAt: Date.now(),
  };

  FLOW_RUNNER.register(flow, (f: Flow) => {
    console.log(f.id); // TODO: change this
  })

  const pushedFlow = await USER_DB.pushFlow(flow as Flow);

  if (!pushedFlow) {
    utils.sendErrorResponse(ctx, ERROR.internalError);
    return;
  }

  utils.sendJSONResponse(ctx, {
    message: 'Successfully added a flow',
    data: {
      id: flow.id,
    },
    status: 201,
  });
}

function runDracoQueryAndGetVar(
  query: string,
  vars: Array<string>,
): Promise<Array<string>> | undefined {
  return new Promise(async (resolve, reject) => {
    try {
      const lexer = new draco.lexer(query);
      const parser = new draco.parser(lexer.lex());
      const interpreter = new draco.interpreter(parser.parse());
      await interpreter.run();
      resolve(vars.map((e) => interpreter.getVar(e)));
    } catch (err) {
      reject(err);
    }
  });
}

async function getFlowExecute(ctx: Koa.Context): Promise<void> {
  let splitUrl = ctx.path.split('/');
  let flowToExecute = splitUrl?.[splitUrl.findIndex((e) => e === 'execute') - 1];

  const jwtString = ctx.headers?.['authorization']?.split(' ').pop() ?? '';
  let parsedToken;

  const apiKey = ctx.headers?.['x-api-key'];
  const hasValidKey = await hasValidApiKey(ctx)

  if (
    !common.jwt.verify(jwtString, JWT_SECRET) && 
    !hasValidKey
  ) {
    utils.sendErrorResponse(ctx, ERROR.unauthorized);
    return;
  }

  if (hasValidKey) {
    if (!await hasKeyPermission(apiKey as string, KeyPerms.execute)) {
      utils.sendErrorResponse(ctx, ERROR.forbidden);
      return;
    }
    const key = (await USER_DB.getKey(apiKey as string)) as Key;
    parsedToken = { id: key.userid };
  } else {
    parsedToken = common.jwt.parse(jwtString);
  }


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

  const start: any = new Date();
  try {
    computedVars = await runDracoQueryAndGetVar(foundFlow.query.syntax, foundFlow.query.vars);
  } catch (err: any) {
    utils.sendJSONResponse(ctx, {
      name: err.name,
      message: err.message,
    });
    return;
  }

  const end: any = new Date();
  computedVars = computedVars as any;
  let ret: any = {};
  for (let i = 0; i < computedVars.length; i++) {
    ret[foundFlow.query.vars[i]] = computedVars[i].value;
  }

  utils.sendJSONResponse(ctx, {
    data: ret,
    message: `Parsed query in ${end - start}ms`,
    status: 200,
  });
}

async function getFlow(ctx: Koa.Context): Promise<void> {
  const jwtString = ctx.headers?.['authorization']?.split(' ').pop() ?? "";

  const apiKey = ctx.headers?.['x-api-key'];
  const hasValidKey = await hasValidApiKey(ctx)

  if (
    !common.jwt.verify(jwtString, JWT_SECRET) && 
    !hasValidKey
  ) {
    utils.sendErrorResponse(ctx, ERROR.unauthorized);
    return;
  }

  let parsedToken 

  if (hasValidKey) {
    if (!await hasKeyPermission(apiKey as string, KeyPerms.read)) {
      utils.sendErrorResponse(ctx, ERROR.forbidden);
      return;
    }
    const key = (await USER_DB.getKey(apiKey as string)) as Key;
    parsedToken = { id: key.userid };
  } else {
    parsedToken = common.jwt.parse(jwtString);
  }

  const foundUser = await USER_DB.getUserById(parsedToken.id);

  if (!foundUser) {
    utils.sendErrorResponse(ctx, ERROR.userNotFound);
    return;
  }

  const foundFlows = await USER_DB.getFlowsByUserId(foundUser?.id as string);
  if (!foundFlows) {
    utils.sendErrorResponse(ctx, ERROR.internalError);
    return;
  }

  const returnFlows = foundFlows.map((e) => {
    return {
      id: e.id,
      query: e.query,
      createdAt: e.createdAt,
      schedule: e.schedule,
      receiver: {
        identity: e.receiver.identity 
      }
    };
  });

  utils.sendJSONResponse(
    ctx,
    {
      message: 'Success',
      data: [...returnFlows],
      status: 200,
    },
    200,
  );
}

export {
  getFlow,
  createFlow,
  deleteFlow,
  getFlowExecute,
  getFlowStart,
  getFlowStop,
};
