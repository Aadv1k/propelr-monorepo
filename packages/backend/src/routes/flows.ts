import Koa from 'koa';

import { ERROR, JWT_SECRET } from '../common/const';
import {
  sendErrorResponse,
  sendJSONResponse,
  verifyDracoSyntax
} from '../common/utils';

import * as common from '@propelr/common';
import { DBFlow } from '../types/userRepository';
import UserRepo from '../models/UserRepository';

const USER_DB = new UserRepo();

export default async function (ctx: Koa.Context): Promise<void> {
  /*
  let parsedToken = common.jwt.parse(ctx.headers?.authorization?.split(' ')?.[1] ?? "", JWT_SECRET);
  if (!ctx.headers.authorization || !parsedToken) {
    sendErrorResponse(ctx, ERROR.unauthorized);
    return;
  }
  */
  

  if (ctx.method !== "POST") {
    sendErrorResponse(ctx, ERROR.invalidMethod);
    return;
  }

  if (ctx.headers["content-type"] !== "application/json") {
    sendErrorResponse(ctx, ERROR.invalidMime);
    return;
  }

  if (!ctx.request.body) {
    sendErrorResponse(ctx, ERROR.invalidJSON);
    return;
  }

  const data = ctx.request.body as DBFlow;

  if (!data?.query) {
    sendErrorResponse(ctx, ERROR.badInput);
    return;
  }

  if (!verifyDracoSyntax(data.query)) {
    sendErrorResponse(ctx, ERROR.invalidDracoSyntax);
    return;
  }

  sendJSONResponse(ctx, {
    success: {
      message: "TODO, this needs to be implemented",
    },
    status: 200,
  });

}
