import Koa from "koa";

import { ERROR, isProd, ABSTRACT} from "../common/const";
import { sendError } from "../common/utils";
import * as c from "@propelr/common";

export default function (ctx: Koa.Context): void { 
  if (ctx.method === "POST") {
    if (!ctx.is("json")) { sendError(ctx, ERROR.invalidMime); return };
    let data = ctx.request.body as {
      username: string,
      password: string,
      email: string
    };

    if (!data?.username || !data?.password || !data?.email) {
      sendError(ctx, ERROR.badRequest);
      return;
    }

    const emailValid = c.emailValidator(data.email, isProd, ABSTRACT.KEY);

    if (!emailValid) {
      sendError(ctx, ERROR.emailInvalid);
      return;
    }

    // ADD USER TO DATABASE
      console.log(data.username, data.password, data.email);
    // ADD USER TO DATABASE

  }
}
