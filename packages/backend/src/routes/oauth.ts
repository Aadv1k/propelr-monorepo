import Koa from "koa";

import { GOOGLE_AUTH, OAuthSchemes } from "../common/const";

import passport from "koa-passport";

import { Strategy as GoogleStrategy } from 'passport-google-oauth2';

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


export async function routeOAuth(ctx: Koa.Context, next: Koa.Next): Promise<void> {
  // const [_a, _b, scheme, _c ] = ctx.path.split('/');
  const state = Math.random().toString(36).substring(2, 15);
  await passport.authenticate("google", 
    {
      scope: ["profile", "email"],
      state: state,
    }
  )(ctx, next);

}

export async function routeOAuthCallback(ctx: Koa.Context, next: Koa.Next): Promise<void> {
  passport.authenticate('google', async (err, user) => {
    console.log(user)
    // google: user.email, user.language, user.photos[0].value
  })(ctx, next);
}
