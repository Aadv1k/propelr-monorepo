import Koa from 'koa';

import { ERROR, isProd, ABSTRACT_API } from '../common/const';
import {
  sendErrorResponse,
  invalidEmailBloomTable,
  sendJSONResponse,
} from '../common/utils';
import * as common from '@propelr/common';
import { User } from '../types/user';

export default async function (ctx: Koa.Context): Promise<void> {
  if (ctx.method === 'POST') {
    if (!ctx.is('json')) {
      sendErrorResponse(ctx, ERROR.invalidMime);
      return;
    }

    let data = ctx.request.body as User;

    if (!data) {
      sendErrorResponse(ctx, ERROR.invalidJSON);
      return;
    }

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

    // TODO: ADD USER TO DATABASE
    console.log(data.password, data.email);

    sendJSONResponse(ctx, {
      success: {
        message: 'Successfully registered',
        token: 1234,
      },
      status: 200,
    });
  }
}
