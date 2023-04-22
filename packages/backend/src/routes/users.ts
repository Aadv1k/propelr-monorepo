import Koa from 'koa';

import { ERROR } from '../common/const';
import { sendErrorResponse, sendJSONResponse } from '../common/utils';

import { USER_DB } from '../models/UserRepository';

async function handleGet(ctx: Koa.Context): Promise<void> {
  let users = await USER_DB.getUsers();

  if (!users) {
    sendErrorResponse(ctx, ERROR.internalError);
    return;
  }

  let arr = users.map((e: any) => {
    return { id: e.id };
  });

  sendJSONResponse(ctx, {
    success: {
      data: [ 
        ...arr
      ]
    },
    status: 200,
  });
}

export default async function (ctx: Koa.Context): Promise<void> {
  switch (ctx.method) {
    case "GET":
      await handleGet(ctx);
      break;
    default: 
      sendErrorResponse(ctx, ERROR.invalidMethod);
      break;
  }
}
