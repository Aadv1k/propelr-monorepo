import Koa from 'koa';
import passport from 'koa-passport';

import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { Strategy as MicrosoftStategy } from 'passport-microsoft';

import { GOOGLE_AUTH, MS_AUTH, OAuthSchemes, ERROR, JWT_SECRET } from '../common/const';
import { sendErrorResponse, generateId, sendJSONResponse } from '../common/utils';

import { User } from '../types';
import UserRepo from '../models/UserRepository';
import * as common from '@propelr/common/node';

import fetch from 'node-fetch';

const USER_DB = new UserRepo();

async function getGoogleUserFromToken(token: string): Promise<{
  name: string,
  email: string,
} | null> {
  const userProfileEndpoint = 'https://www.googleapis.com/oauth2/v3/userinfo';
  const response = await fetch(userProfileEndpoint, {
    headers: { Authorization: `Bearer ${token}` },
  });

  // TODO: handle errors here man
  const data = await response.json();


  return {
    name: data.name,
    email:  data?.email,
  };
}

async function getGoogleAuthTokenFromCode(code: string, redirect: string) {
  const requestBody = JSON.stringify({
    code: code,
    client_id: GOOGLE_AUTH.CLIENT_ID,
    client_secret: GOOGLE_AUTH.CLIENT_SECRET,
    redirect_uri: redirect,
    grant_type: 'authorization_code',
  });

  let tokenEndpoint = `https://oauth2.googleapis.com/token`;

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    body: requestBody,
  });
  const data = await response.json();
  return data.access_token;
}

async function getMicrosoftAuthTokenFromCode(code: string, redirect: string) {
  const requestBody = new URLSearchParams({
    code: code,
    client_id: MS_AUTH.CLIENT_ID,
    client_secret: MS_AUTH.CLIENT_SECRET,
    redirect_uri: redirect,
    grant_type: 'authorization_code',
  });

  let tokenEndpoint = `https://login.microsoftonline.com/common/oauth2/v2.0/token`;

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    body: requestBody,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const data = await response.json();
  return data.access_token;
}

async function getMicrosoftUserFromToken(token: string): Promise<{
  name: string,
  email: string,
} | null> {
  const userProfileEndpoint = 'https://graph.microsoft.com/v1.0/me';
  const response = await fetch(userProfileEndpoint, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  return {
    name: data.displayName,
    email: data.userPrincipalName ?? data.mail
  }
}

async function findUserOrCreateUserToken(user: User): Promise<string | null> {
  await USER_DB.init();

  const foundUser = await USER_DB.getUserByEmail(user.email);

  if (foundUser) {
    const token = common.jwt.sign(
      {
        id: foundUser.id,
        email: foundUser.email,
        username: foundUser.username,
      },
      JWT_SECRET,
    );

    return token;
  }

  const userToPush: User = {
    id: generateId(16),
    email: user.email,
    username: user.username,
    password: user.password,
  };

  const pushedUser = await USER_DB.pushUser(userToPush);

  if (!pushedUser) return null;

  const jwt_payload: any = {
    id: pushedUser.id,
    email: pushedUser.email,
    username: pushedUser.username,
  };

  const token = common.jwt.sign(jwt_payload, JWT_SECRET);
  return token;
}



export default async function routeOAuthToken(ctx: Koa.Context, next: Koa.Next) {
  const params = ctx.path.split('/');
  const scheme = params.find((e) => OAuthSchemes[e]);

  if (!scheme) {
    sendErrorResponse(ctx, ERROR.oAuthSchemeNotFound);
    return;
  }

  const authCode = ctx.URL.searchParams.get('code');
  const redirectOrigin = ctx.URL.searchParams.get('redirect');

  if (!authCode || !redirectOrigin) {
    sendErrorResponse(ctx, ERROR.badOAuthCallback);
    return;
  }

  const authScheme: {
    provider: string;
    scope: Array<string>;
  } = {
    provider: '',
    scope: [],
  };

  switch (scheme) {
    case 'google': {
      const authToken = await getGoogleAuthTokenFromCode(authCode, redirectOrigin);
      if (!authToken) {
        sendErrorResponse(ctx, ERROR.expiredToken);
        break;
      }

      const gUser = await getGoogleUserFromToken(authToken);
      if (!gUser?.email) {
        sendErrorResponse(ctx, ERROR.internalError);
        return;
      }

      const jwtToken = await findUserOrCreateUserToken({
          email: gUser.email,
          username: gUser.name,
          password: generateId(16),
      });

      if (!jwtToken) {
        sendErrorResponse(ctx, ERROR.internalError);
        return;
      }
      sendJSONResponse(
        ctx,
        {
          message: 'Success',
          token: jwtToken,
          status: 200,
        },
        200,
      );
      break;
    }
    case 'microsoft':
      {
        const authToken = await getMicrosoftAuthTokenFromCode(authCode, redirectOrigin);
        if (!authToken) {
          sendErrorResponse(ctx, ERROR.expiredToken);
          break;
        }
        const msUser = await getMicrosoftUserFromToken(authToken);
        if (!msUser?.email) {
          sendErrorResponse(ctx, ERROR.internalError);
          return;
        }

        const jwtToken = await findUserOrCreateUserToken({
          email: msUser.email,
          username: msUser.name,
          password: generateId(16),
        });

        if (!jwtToken) {
          sendErrorResponse(ctx, ERROR.internalError);
          return;
        }
        sendJSONResponse(
          ctx,
          {
            message: 'Success',
            token: jwtToken,
            status: 200,
          },
          200,
        );
      }
      break;
  }
}
