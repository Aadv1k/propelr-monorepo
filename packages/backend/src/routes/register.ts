import Koa from 'koa';

import { ERROR, isProd, ABSTRACT_API, JWT_SECRET } from '../common/const';
import {
  sendErrorResponse,
  invalidEmailBloomTable,
  sendJSONResponse,
  generateId
} from '../common/utils';
import * as common from '@propelr/common';
import { User } from '../types/user';
import { DBUser } from '../types/userRepository';
import UserRepo from "../models/UserRepository";

const USER_DB = new UserRepo();

export default async function (ctx: Koa.Context): Promise<void> {
  await USER_DB.init();

  if (ctx.method !== "POST") {
    sendErrorResponse(ctx, ERROR.invalidMethod);
    return;
  }

  if (!ctx.is('json')) { sendErrorResponse(ctx, ERROR.invalidMime); return; }
  if (!ctx.request.body) { sendErrorResponse(ctx, ERROR.invalidJSON); return; }

  let data = ctx.request.body as User;

  if (
    !common.validateSchema(data, {
      email: "string",
      password: "string",
    })
  ) {
    sendErrorResponse(ctx, ERROR.badRequest);
    return;
  }

  let isEmailValid;
  let emailExistsInBloomTable = invalidEmailBloomTable.exists(data.email);

  if (emailExistsInBloomTable) {
    isEmailValid = false;
  } else {
    isEmailValid = await common.validateEmail(
      data.email,
      isProd,
      ABSTRACT_API.KEY,
    );
  }

  if (!isEmailValid) {
    sendErrorResponse(ctx, ERROR.emailInvalid);
    if (!emailExistsInBloomTable) {
      invalidEmailBloomTable.push(data.email);
    }
    return;
  }

  const user: DBUser = {
    id: generateId(16),
    email: data.email,
    password: data.password,
  }

  let pushedUser: DBUser | null = await USER_DB.pushUser(user);
  
  if (!pushedUser) {
    sendErrorResponse(ctx, ERROR.internalError);
    return;
  }

  let jwt_payload: any = {
    id: pushedUser.id,
    email: pushedUser.email
  }
  
  let token = common.jwt.sign(jwt_payload, JWT_SECRET);

  sendJSONResponse(ctx, {
    success: {
      message: 'Successfully registered',
      token,
    },
    status: 200,
  });
}
