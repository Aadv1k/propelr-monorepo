import Koa from 'koa';

import { ERROR, isProd, ABSTRACT_API, JWT_SECRET } from '../common/const';
import {
  sendErrorResponse,
  invalidEmailBloomTable,
  sendJSONResponse,
  generateId,
  md5,
  validateSchema,
} from '../common/utils';
import {node} from '@propelr/common/';
import { User } from '../types';
import { USER_DB } from '../models/UserRepository';

import userSchema from '../schemas/user';

export default async function (ctx: Koa.Context): Promise<void> {
  if (ctx.method !== 'POST') {
    sendErrorResponse(ctx, ERROR.invalidMethod);
    return;
  }
  if (ctx.headers?.['content-type'] !== "application/json") {
    sendErrorResponse(ctx, ERROR.invalidMime);
    return;
  }
  if (!ctx.request.body) {
    sendErrorResponse(ctx, ERROR.invalidJSON);
    return;
  }
  const data = ctx.request.body as User;
  if (!data.email || !data.password) {
    sendErrorResponse(ctx, ERROR.badInput);
    return;
  }

  let isEmailValid;
  const emailExistsInBloomTable = invalidEmailBloomTable.exists(data.email);

  if (emailExistsInBloomTable) {
    isEmailValid = false;
  } else {
    isEmailValid = await node.validateEmail(data.email, isProd, ABSTRACT_API.KEY);
  }

  if (!isEmailValid) {
    sendErrorResponse(ctx, ERROR.emailInvalid);
    if (!emailExistsInBloomTable) {
      invalidEmailBloomTable.push(data.email);
    }
    return;
  }

  const foundUser = await USER_DB.getUserByEmail(data.email);

  if (!foundUser) {
    sendErrorResponse(ctx, ERROR.userNotFound);
    return;
  }

  const jwt_payload: any = {
    id: foundUser.id,
    email: foundUser.email,
    username: foundUser.username
  };

  const token = node.jwt.sign(jwt_payload, JWT_SECRET);

  sendJSONResponse(ctx, {
    success: {
      message: 'Successfully logged in',
      data: {
        token,
      },
    },
    status: 200,
  });
}
