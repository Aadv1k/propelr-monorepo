import { Error } from '../types/const';
import { bloomTable as BloomTable } from '@propelr/common';
import crypto from 'node:crypto';
import draco from "dracoql";

import Koa from 'koa';

export const invalidEmailBloomTable = new BloomTable(10000, 10);

export function sendErrorResponse(ctx: Koa.Context, err: Error) {
  ctx.body = JSON.stringify({
    error: {
      code: err.code,
      message: err.message,
      details: err.details,
    },
    status: err.status,
  });
  ctx.set('Content-type', 'application/json');
  ctx.status = err.status;
}

export function verifyDracoSyntax(syn: string): boolean {
  try {
    const lexer = new draco.lexer(syn);
    const parser = new draco.parser(lexer.lex())
    parser.parse();
    return true;
  } catch {
    return false;
  }
}

export function generateId(length: number): string {
  return crypto.randomBytes(length).toString("hex");
}

export function md5(input: string): string {
  return crypto.createHash('md5').update(input).digest('hex');
}

export function sendJSONResponse(ctx: Koa.Context, obj: any, status?: number) {
  const json = JSON.stringify(obj);

  ctx.body = json;
  ctx.set('Content-type', 'application/json');
  ctx.status = status ?? 200;
}
