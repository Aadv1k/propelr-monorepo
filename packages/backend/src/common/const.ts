import { httpErrors } from '../types';
import dotenv from 'dotenv';
import path from "node:path";

import { config } from "@propelr/common/";
const OAuthConfig = config.OAuthConfig


dotenv.config({
  path: path.resolve(__dirname, "../../../.env"),
});

export const PORT = process.env.PORT || 4000;

export const isProd = process.env?.NODE_ENV === 'production' ? true : false;

export const JWT_SECRET = process.env.JWT_SECRET ?? 'default';

export const ABSTRACT_API = {
  KEY: process.env.ABSTRACT_API_KEY ?? '',
};

export const MAIL = {
  address: process.env.MAIL_ADDRESS,
  password: process.env.MAIL_PASSWORD,
}

export const GOOGLE_AUTH = {
  CLIENT_ID: OAuthConfig.GOOGLE_AUTH.CLIENT_ID,
  CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ?? '',
};

export const MS_AUTH = {
  CLIENT_ID: OAuthConfig.MS_AUTH.CLIENT_ID,
  CLIENT_SECRET: process.env.MS_CLIENT_SECRET ?? '',
};

export const ATLAS = {
  PASSWORD: process.env.ATLAS_PASSWORD,
  USER: process.env.ATLAS_USER,
};

export const OAuthSchemes = {
  google: 'google',
  microsoft: 'microsoft',
  discord: 'discord',
} as {
  [key: string]: string;
};

export const ERROR: httpErrors = {
  invalidMime: {
    code: 'invalid-MIME',
    message: 'Invalid MIME type',
    details: 'The provided MIME type is not valid. Please provide a valid MIME type in the request',
    status: 400,
  },

  expiredToken: {
    code: 'expired-token',
    message: 'expired OAuth token',
    details: 'your OAuth token has expired, please try again',
    status: 400,
  },

  flowNotRunning: {
    code: 'flow-not-running',
    message: 'The flow is not running',
    details: 'the flow that you are trying to stop is not running',
    status: 400,
  },

  flowAlreadyRunning: {
    code: 'flow-already-running',
    message: 'The flow is already running',
    details: 'the flow that you are trying to run is already running',
    status: 400,
  },

  notFound: {
    code: 'not-found',
    message: 'Resource not found',
    details: 'was unable to find the requested resource',
    status: 404,
  },

  unauthorized: {
    code: 'unauthorized',
    message: 'Unauthorized',
    details: 'Authentication is required to access the requested resource',
    status: 401,
  },

  forbidden: {
    code: 'forbidden',
    message: 'Forbidden',
    details: 'Access to the requested resource is forbidden',
    status: 403,
  },

  userNotFound: {
    code: 'user-not-found',
    message: 'User not found',
    details: 'The user was not found. Please check the credentials and try again.',
    status: 404,
  },

  flowNotFound: {
    code: 'flow-not-found',
    message: 'Flow not found',
    details: 'The flow was not found. Please check the id and try again.',
    status: 404,
  },

  invalidPassword: {
    code: 'invalid-password',
    message: 'Invalid password',
    details:
      'You have provided an invalid password, please check it again',
    status: 400,
  },

  userAlreadyExists: {
    code: 'user-already-exists',
    message: 'Registration Failed',
    details: 'The user with the provided email already exists in the system.',
    status: 400,
  },

  internalError: {
    code: 'internal-error',
    message: 'Internal server error',
    details: 'An internal server error occurred',
    status: 500,
  },

  invalidMethod: {
    code: 'invalid-method',
    message: 'Invalid HTTP Method',
    details:
      'The provided HTTP method is not allowed for this route. Please use the correct HTTP method.',
    status: 405,
  },

  invalidJSON: {
    code: 'invalid-JSON',
    message: 'Invalid JSON',
    details: 'expected valid JSON for the path',
    status: 400,
  },

  badInput: {
    code: 'bad-input',
    message: 'Bad input',
    details: 'The provided input data is not valid. Please provide valid input data',
    status: 400,
  },

  invalidDracoSyntax: {
    code: 'invalid-draco-syntax',
    message: 'Invalid syntax for DracoQL',
    details:
      'the provided syntax for DracoQL was invalid. please vist https://github.com/aadv1k/dracoql#syntax for the correct syntax',
    status: 400,
  },

  oAuthSchemeNotFound: {
    code: 'oauth-scheme-not-found',
    message: 'OAuth Scheme Not Found',
    details:
      'The requested OAuth scheme was not found. Please check your request and try again with a valid OAuth scheme.',
    status: 401,
  },

  badOAuthCallback: {
    code: 'bad-oauth-callback',
    message: 'Callback parameters error',
    details:
      'The callback route was accessed without proper parameters. Please provide valid parameters.',
    status: 400,
  },

  emailInvalid: {
    code: 'email-invalid',
    message: 'Received a bad email',
    details: 'The provided email is not valid. Please provide a valid email address.',
    status: 400,
  },
};
