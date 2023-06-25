import Koa from 'koa';

import { ERROR, JWT_SECRET } from '../common/const';
import * as utils from '../common/utils';
import { Key } from '../types';
import { USER_DB } from '../models/UserRepository';
import keySchema from '../schemas/key';

import * as jwt from "../common/jwt";

async function createKey(ctx: Koa.Context): Promise<void> {
  const jwtString = ctx.headers?.['authorization']?.split(' ').pop() ?? '';

  if (!jwt.verify(jwtString, JWT_SECRET)) {
    utils.sendErrorResponse(ctx, ERROR.unauthorized);
    return;
  }

  const parsedToken = jwt.parse(jwtString);

  if (ctx.headers['content-type'] !== 'application/json') {
    utils.sendErrorResponse(ctx, ERROR.invalidMime);
    return;
  }

  if (!ctx.request.body) {
    utils.sendErrorResponse(ctx, ERROR.invalidJSON);
    return;
  }

  if (!utils.validateSchema(ctx.request.body, keySchema)) {
    utils.sendErrorResponse(ctx, ERROR.badInput);
    return;
  }

  const data = ctx.request.body as Key;
  const date = new Date();

  const key: Key = {
    key: utils.generateId(8),
    userid: parsedToken.id,
    permissions: data.permissions,
    expires: data.expires,
    createdAt: date.toISOString(),
  };

  let pushedKey = await USER_DB.pushKey(key);

  if (!pushedKey) {
    utils.sendErrorResponse(ctx, ERROR.internalError);
    return;
  }

  utils.sendJSONResponse(ctx, {
    message: 'Successfully registered a key',
    data: {
      key: key.key,
      expires: key.expires,
      permissions: key.permissions,
    },
    status: 201,
  });
}

async function getKeys(ctx: Koa.Context) {
  const jwtString = ctx.headers?.['authorization']?.split(' ').pop() ?? '';

  if (!jwt.verify(jwtString, JWT_SECRET)) {
    utils.sendErrorResponse(ctx, ERROR.unauthorized);
    return;
  }

  const parsedToken = jwt.parse(jwtString);

  let keys = await USER_DB.getKeysByUserId(parsedToken.id);

  if (!keys) {
    utils.sendErrorResponse(ctx, ERROR.internalError);
    return;
  }

  utils.sendJSONResponse(
    ctx,
    {
      message: 'Success',
      data: keys,
      status: 200,
    },
    200,
  );
}

async function deleteKey(ctx: Koa.Context): Promise<void> {
  let splitUrl = ctx.path.split('/');
  let keyToDelete = splitUrl?.[splitUrl.findIndex((e) => e === 'key') + 1];

  if (!keyToDelete) {
    utils.sendErrorResponse(ctx, ERROR.badInput);
    return;
  }

  const jwtString = ctx.headers?.['authorization']?.split(' ').pop() ?? '';

  if (!jwt.verify(jwtString, JWT_SECRET)) {
    utils.sendErrorResponse(ctx, ERROR.unauthorized);
    return;
  }
  const parsedToken = jwt.parse(jwtString);

  const keyExists = await USER_DB.getKey(keyToDelete);
  if (!keyExists) {
    utils.sendErrorResponse(ctx, ERROR.flowNotFound);
    return;
  }
  const deletedKey = await USER_DB.deleteKeyByUserId(parsedToken.id, keyToDelete);

  if (!deletedKey) {
    utils.sendErrorResponse(ctx, ERROR.internalError);
    return;
  }

  utils.sendJSONResponse(
    ctx,
    {
      message: 'Successfully deleted key',
      data: {
        key: keyToDelete,
      },
      status: 204,
    },
    204,
  );
}

export { createKey, getKeys, deleteKey };
