import Koa from 'koa';
import passport from 'koa-passport';

import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { Strategy as MicrosoftStategy } from 'passport-microsoft';

import { GOOGLE_AUTH, MS_AUTH, OAuthSchemes, ERROR, JWT_SECRET } from '../common/const';
import { sendErrorResponse, generateId, sendJSONResponse } from '../common/utils';

import { User } from '../types/user';
import { DBUser } from '../types/userRepository';
import UserRepo from '../models/UserRepository';
import * as common from '@propelr/common';

const USER_DB = new UserRepo();

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_AUTH.CLIENT_ID,
      clientSecret: GOOGLE_AUTH.CLIENT_SECRET,
      callbackURL: GOOGLE_AUTH.REDIRECT,
    },
    (_a, _b, profile, done) => {
      return done(null, profile);
      // return done(null, profile);
    },
  ),
);

passport.use(
  new MicrosoftStategy(
    {
      clientID: MS_AUTH.CLIENT_ID,
      clientSecret: MS_AUTH.CLIENT_SECRET,
      callbackURL: MS_AUTH.REDIRECT,
      passReqToCallback: false,
    },
    function (accessToken: any, refreshToken: any, profile: any, done: any) {
      return done(null, profile);
      // return done(null, profile);
    },
  ),
);

export async function routeOAuth(ctx: Koa.Context, next: Koa.Next): Promise<void> {
  console.log(ctx.path.split('/'));
  const params = ctx.path.split('/');
  const scheme = params.find((e) => OAuthSchemes[e]);

  if (!scheme) {
    sendErrorResponse(ctx, ERROR.oAuthSchemeNotFound);
    return;
  }

  const state = Math.random().toString(36).substring(2, 15);

  const authScheme: {
    provider: string;
    scope: Array<string>;
    state: string;
  } = {
    provider: '',
    scope: [],
    state: state,
  };

  switch (scheme) {
    case 'google':
      authScheme.provider = 'google';
      authScheme.scope = ['email', 'profile'];
      break;
    case 'microsoft':
      authScheme.provider = 'microsoft';
      authScheme.scope = ['User.Read'];
      break;
  }

  await passport.authenticate(authScheme.provider, {
    scope: authScheme.scope,
    state: state,
  })(ctx, next);
}

export async function routeOAuthCallback(ctx: Koa.Context, next: Koa.Next): Promise<void> {
  const params = ctx.path.split('/');
  const scheme = params.find((e) => OAuthSchemes[e]);

  if (!scheme) {
    sendErrorResponse(ctx, ERROR.oAuthSchemeNotFound);
    return;
  }

  let callback;
  try {
    callback = await new Promise((resolve, reject) => {
      const scheme = params.find((e) => OAuthSchemes[e]) as string;
      passport.authenticate(scheme, async (err, user) => {
        if (err) {
          reject(err);
        } else {
          resolve(user);
        }
      })(ctx, next);
    });
  } catch (err) {
    console.log(err);
    sendErrorResponse(ctx, ERROR.badOAuthCallback);
    return;
  }

  const user: any = callback;
  await USER_DB.init();

  // TODO: this currently works since we have two schemes
  const foundUser = await USER_DB.getUserByEmail(user?.email || user?.userPrincipalName);

  if (foundUser) {
    sendErrorResponse(ctx, ERROR.userAlreadyExists);
    return;
  }

  const userToPush: DBUser = {
    id: generateId(16),
    email: user?.email ?? user?.userPrincipalName,
    password: generateId(16), // TODO: find a better way to generate password
  };

  const pushedUser = await USER_DB.pushUser(userToPush);

  if (!pushedUser) {
    sendErrorResponse(ctx, ERROR.internalError);
    return;
  }

  const jwt_payload: any = {
    id: pushedUser.id,
    email: pushedUser.email,
  };

  const token = common.jwt.sign(jwt_payload, JWT_SECRET);

  sendJSONResponse(ctx, {
    success: {
      message: 'Successfully registered',
      token,
    },
    status: 200,
  });
}
