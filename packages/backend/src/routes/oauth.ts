import Koa from "koa";
import passport from "koa-passport";

import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { Strategy as MicrosoftStategy } from "passport-microsoft";

import { GOOGLE_AUTH, MS_AUTH, OAuthSchemes, ERROR } from "../common/const";
import { sendErrorResponse } from "../common/utils";


passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_AUTH.CLIENT_ID,
      clientSecret: GOOGLE_AUTH.CLIENT_SECRET,
      callbackURL: GOOGLE_AUTH.REDIRECT
    },
    (_a, _b, profile, done) => {
      return done(null, profile);
    }
  )
);

passport.use(
  new MicrosoftStategy(
    {
      clientID: MS_AUTH.CLIENT_ID,
      clientSecret: MS_AUTH.CLIENT_SECRET,
      callbackURL: MS_AUTH.REDIRECT,
      passReqToCallback: false,
    },
    function(accessToken: any, refreshToken: any, profile: any, done: any) {
      return done(null, profile);
    }
  )
);

export async function routeOAuth(ctx: Koa.Context, next: Koa.Next): Promise<void> {
  console.log(ctx.path.split('/'))
  let params = ctx.path.split('/');
  let scheme = params.find(e => OAuthSchemes[e])

  if (!scheme) {
    sendErrorResponse(ctx, ERROR.oAuthSchemeNotFound);
    return;
  }

  const state = Math.random().toString(36).substring(2, 15);

  let authScheme: {
    provider: string,
    scope: Array<string>
    state: string,
  } = {
    provider: "",
    scope: [],
    state: state,
  };

  switch (scheme) {
    case "google":
      authScheme.provider = "google";
      authScheme.scope = ["email", "profile"]
      break;
    case "microsoft":
      authScheme.provider = "microsoft";
      authScheme.scope = ["User.Read"];
      break;
  }

  await passport.authenticate(authScheme.provider,
    {
      scope: authScheme.scope,
      state: state,

    }
  )(ctx, next);
}

export async function routeOAuthCallback(ctx: Koa.Context, next: Koa.Next): Promise<void> {
  let params = ctx.path.split('/');
  let scheme = params.find(e => OAuthSchemes[e])

  if (!scheme) {
    sendErrorResponse(ctx, ERROR.oAuthSchemeNotFound);
    return;
  }

  passport.authenticate(scheme, async (err, user, info) => {
    if (err) {
      console.log(err, info);
      sendErrorResponse(ctx, ERROR.badOAuthCallback);
      return;
    }
    console.log(user)
    // google: user.email, user.language, user.photos[0].value
    // microsoft: user.userPrincipalName, user.preferredLanguage, us
  })(ctx, next);
}
