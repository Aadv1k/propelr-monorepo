import { httpError } from '../types';
import { ERROR, JWT_SECRET } from "./const";
import { bloomTable as BloomTable, jwt} from '@propelr/common';
import crypto from 'node:crypto';
import * as draco from "dracoql";

import Koa from 'koa';
import Ajv from "ajv";

const AJV = new Ajv();

export const invalidEmailBloomTable = new BloomTable(10000, 10);

export function sendErrorResponse(ctx: Koa.Context, err: httpError) {
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


export function validateSchema(input: any, schema: any): boolean {
  const validator = AJV.compile(schema);
  const schemaValid = validator(input)
  return schemaValid as boolean;
}

export function validateTokenOrSendError(ctx: Koa.Context): void {
  let popped = ctx.headers?.authorization?.split(" ")?.pop();
  if (!ctx.headers.authorization || !popped || !jwt.verify(popped, JWT_SECRET)) {
    sendErrorResponse(ctx, ERROR.unauthorized);
    return;
  }
}

export function verifyDracoSyntax(syn: string): boolean {

  try {
    const lexer = new draco.lexer(syn);
    const parser = new draco.parser(lexer.lex())
    parser.parse();
    return true;
  } catch (err) {
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
