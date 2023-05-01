import Koa from 'koa';

import { ERROR } from '../common/const';
import * as utils from '../common/utils';
import * as common from '@propelr/common';

export default async function (ctx: Koa.Context) {
  const targetUrl = ctx.URL.searchParams.get("url");

  if (!targetUrl) {
    utils.sendErrorResponse(ctx, ERROR.badInput);
    return;
  }

  let html 

  try {
    html = await common.fetchAndCacheHtml(targetUrl);
  } catch (error) {
    utils.sendErrorResponse(ctx, ERROR.badInput);
    return;
  }

  console.log(html);

  utils.sendJSONResponse(ctx, {
    message: "Success",
    status: 200,
    data: {
      content: html
    } 
  })

}
