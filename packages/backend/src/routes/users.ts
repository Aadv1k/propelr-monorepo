import Koa from 'koa';

import { ERROR } from '../common/const';
import { sendErrorResponse, sendJSONResponse } from '../common/utils';

import UserRepo from '../models/UserRepository';

const USER_DB = new UserRepo();

export default async function (ctx: Koa.Context): Promise<void> {
  await USER_DB.init();

  if (ctx.method !== "GET") {
    sendErrorResponse(ctx, ERROR.invalidMethod);
    return;
  }

  let users = await USER_DB.getUsers() ;

  if (!users) {
    sendErrorResponse(ctx, ERROR.internalError);
    return;
  }

  let arr = users.map(e => {return {id: e.id}});

  sendJSONResponse(ctx, {
    success: {
      ...arr
    },
    status: 200,
  });
}
