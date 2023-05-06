import Koa from 'koa';

import { ERROR, JWT_SECRET } from '../common/const';
import { 
  sendErrorResponse, 
  sendJSONResponse,
} from '../common/utils';

import { USER_DB } from '../models/UserRepository';
import { node } from "@propelr/common";

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

async function handleDelete(ctx: Koa.Context): Promise<void> {
  const jwtString = ctx.headers?.["authorization"]?.split(" ").pop() ?? "";

  if (!node.jwt.verify(jwtString, JWT_SECRET)) {
    sendErrorResponse(ctx, ERROR.unauthorized);
    return;
  }

  const parsedToken = node.jwt.parse(jwtString);

  if (!parsedToken) {
    sendErrorResponse(ctx, ERROR.unauthorized);
    return;
  }

  const userDeleted = await USER_DB.deleteUserByEmail(parsedToken.email);

  if (!userDeleted) {
    sendErrorResponse(ctx, ERROR.internalError);
  }

  sendJSONResponse(ctx, {
    success: {
      message: "Deleted user",
    },
    status: 200,
  });
}

export {
  handleDelete as routeUsersDelete,
  handleGet as routeUsersGet
}
