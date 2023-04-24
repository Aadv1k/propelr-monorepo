import { Errors } from '../types/const';
import dotenv from 'dotenv';

dotenv.config({
  path: '../../.env',
});

export const PORT = 3000;

export const isProd = process.env?.NODE_ENV === 'production' ? true : false;

export const JWT_SECRET = process.env.JWT_SECRET ?? 'default';

export const ABSTRACT_API = {
  KEY: process.env.ABSTRACT_API_KEY ?? '',
};

export const GOOGLE_AUTH = {
  CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? '',
  CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ?? '',
  REDIRECT: 'http://localhost:3000/api/oauth/google/callback',
};

export const MS_AUTH = {
  CLIENT_ID: process.env.MS_CLIENT_ID ?? '',
  CLIENT_SECRET: process.env.MS_CLIENT_SECRET ?? '',
  REDIRECT: 'http://localhost:3000/api/oauth/microsoft/callback',
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

export const ERROR: Errors = {
  invalidMime: {
    code: 'invalid-MIME',
    message: 'Invalid MIME type',
    details: 'The provided MIME type is not valid. Please provide a valid MIME type in the request',
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
    details: 'You do not have the necessary permissions to access this resource',
    status: 401,
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
      'The provided password is not valid. Please provide a valid password with at least 8 characters, including at least one uppercase letter, one lowercase letter, and one numeric digit.',
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
