import Koa from 'koa';

import { ERROR, JWT_SECRET } from '../common/const';
import * as utils from '../common/utils';
import { node } from '@propelr/common';

async function verifyAndparseJwtTokenFromHeader(ctx: Koa.Context): Promise<any | null> {
  if (!ctx.headers?.['authorization']) return null;
  let authHeader = ctx.headers?.['authorization'] as string;

  const [scheme, token] = authHeader.split(' ');

  if (!scheme && !token) return null;

  if (!node.jwt.verify(token, JWT_SECRET)) return null;

  return node.jwt.parse(token);
}

export default async function (ctx: Koa.Context) {
  const targetUrl = ctx.URL.searchParams.get("url");
  const timeout = ctx.URL.searchParams.get("timeout");

  if (!targetUrl) {
    utils.sendErrorResponse(ctx, ERROR.badInput);
    return;
  }

  if (timeout) {
    if (!Number(timeout)) {
      utils.sendErrorResponse(ctx, ERROR.badInput);
      return;
    }
  }

  const jwtToken = await verifyAndparseJwtTokenFromHeader(ctx);
  if (!jwtToken) {
    utils.sendErrorResponse(ctx, ERROR.unauthorized);
    return;
  }

  let html: any;

  try {
    html = await node.fetchAndCacheHtml(targetUrl, Number(timeout));
  } catch (error) {
     console.warn(`[WARN] ${targetUrl} failed in headless mode, trying http`)
    let chunks = await node.http.GET(targetUrl)
    html = {
        content: Buffer.concat(chunks).toString()
    }
    return;
  }

  utils.sendJSONResponse(ctx, {
    message: "Success",
    status: 200,
    data: {
      ...html
    } 
  })

}
