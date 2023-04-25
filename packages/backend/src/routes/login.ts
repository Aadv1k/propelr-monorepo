import Koa from 'koa';

import { ERROR, JWT_SECRET } from '../common/const';
import { sendErrorResponse, sendJSONResponse, md5, validateSchema } from '../common/utils';

import * as common from '@propelr/common';
import { User } from '../types';
import { USER_DB } from '../models/UserRepository';
import userSchema from '../schemas/user';

export default async function (ctx: Koa.Context): Promise<void> {
  if (ctx.method !== 'POST') {
    sendErrorResponse(ctx, ERROR.invalidMethod);
    return;
  }
  if (!ctx.is('json')) {
    sendErrorResponse(ctx, ERROR.invalidMime);
    return;
  }
  if (!ctx.request.body) {
    sendErrorResponse(ctx, ERROR.invalidJSON);
    return;
  }
  if (!validateSchema(ctx.request.body, userSchema)) {
    sendErrorResponse(ctx, ERROR.badInput);
    return;
  }

  const data = ctx.request.body as User;
  const foundUser = await USER_DB.getUserByEmail(data.email);

  if (!foundUser) {
    sendErrorResponse(ctx, ERROR.userNotFound);
    return;
  }

  if (foundUser.password !== md5(data.password)) {
    sendErrorResponse(ctx, ERROR.invalidPassword);
    return;
  }

  const jwt_payload: any = {
    id: foundUser.id,
    email: foundUser.email,
  };

  const token = common.jwt.sign(jwt_payload, JWT_SECRET);

  sendJSONResponse(ctx, {
    success: {
      message: 'Login successful',
      token,
    },
    status: 200,
  });
}
