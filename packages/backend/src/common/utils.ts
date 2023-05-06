import { httpError, Schedule } from '../types';
import { ERROR, JWT_SECRET } from "./const";
import { node } from '@propelr/common';
const jwt = node.jwt;
const BloomTable = node.bloomTable; 


import crypto from 'node:crypto';

import Koa from 'koa';
import Ajv from "ajv";

const AJV = new Ajv();

// bloom table will probably fail :/
export const invalidEmailBloomTable = new BloomTable(15_000, 10);

export function generateCronExpressionFromSchedule(schedule: Schedule): string | null {
  let cronExpression = '';
  switch (schedule.type) {
    case 'daily':
      // For daily type, cron expression will be in the format: "minute hour * * *"
      cronExpression = `${schedule.time} * * * *`;
      break;
    case 'weekly':
      // For weekly type, cron expression will be in the format: "minute hour * * dayOfWeek"
      cronExpression = `${schedule.time} * * ${schedule.dayOfWeek}`;
      break;
    case 'monthly':
      // For monthly type, cron expression will be in the format: "minute hour dayOfMonth * *"
      cronExpression = `${schedule.time} ${schedule.dayOfMonth} * * *`;
      break;
    default:
      return null;
  }

  return cronExpression;
}

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
  console.log(validator.errors);
  return schemaValid as boolean;
}

export function validateTokenOrSendError(ctx: Koa.Context): void {
  let popped = ctx.headers?.authorization?.split(" ")?.pop();
  if (!ctx.headers.authorization || !popped || !jwt.verify(popped, JWT_SECRET)) {
    sendErrorResponse(ctx, ERROR.unauthorized);
    return;
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
