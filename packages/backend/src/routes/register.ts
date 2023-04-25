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

  let isEmailValid;
  const emailExistsInBloomTable = invalidEmailBloomTable.exists(data.email);

  if (emailExistsInBloomTable) {
    isEmailValid = false;
  } else {
    isEmailValid = await common.validateEmail(data.email, isProd, ABSTRACT_API.KEY);
  }

  if (!isEmailValid) {
    sendErrorResponse(ctx, ERROR.emailInvalid);
    if (!emailExistsInBloomTable) {
      invalidEmailBloomTable.push(data.email);
    }
    return;
  }

  const foundUser = await USER_DB.getUserByEmail(data.email);

  if (foundUser) {
    sendErrorResponse(ctx, ERROR.userAlreadyExists);
    return;
  }

  const user: User = {
    id: generateId(8),
    email: data.email,
    password: md5(data.password),
  };

  const pushedUser: User | null = await USER_DB.pushUser(user);

  if (!pushedUser) {
    sendErrorResponse(ctx, ERROR.internalError);
    return;
  }

  const jwt_payload: any = {
    id: pushedUser.id,
    email: pushedUser.email,
  };

  const token = common.jwt.sign(jwt_payload, JWT_SECRET);

  sendJSONResponse(ctx, {
    success: {
      message: 'Successfully registered',
      data: {
        token,
      },
    },
    status: 200,
  });
}
