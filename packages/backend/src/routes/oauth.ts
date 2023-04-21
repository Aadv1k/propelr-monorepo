import passport from "koa-passport";

export function routeOAuth(scheme: string): any {
  return passport.authenticate(scheme, {
    scope: ['profile', 'email'] 
  });
}

export function routeOAuthCallback(scheme: string): any {
  return passport.authenticate(scheme, {
    successRedirect: '/',
    failureRedirect: '/'
  })
}
