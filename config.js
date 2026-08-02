export const USER_POOL_REGION = process.env.USER_POOL_REGION;
export const USER_POOL_ID = process.env.USER_POOL_ID;
export const USER_POOL_CLIENT_ID = process.env.USER_POOL_CLIENT_ID;
export const PUBLIC_BUCKET_NAME = process.env.PUBLIC_BUCKET_NAME;
export const COMMON_BUCKET_NAME = process.env.COMMON_BUCKET_NAME;
export const IDENTITY_POOL_ID = process.env.IDENTITY_POOL_ID;
export const AUTH_COOKIE_DOMAIN = process.env.AUTH_COOKIE_DOMAIN;
export const NODE_ENV = process.env.NODE_ENV;
export const IDP_DOMAIN = process.env.IDP_DOMAIN;
export const REDIRECT_SIGN_IN = process.env.REDIRECT_SIGN_IN;
export const REDIRECT_SIGN_OUT = process.env.REDIRECT_SIGN_OUT;
export const HAS_COGNITO_AUTH_CONFIG =
  Boolean(USER_POOL_REGION) &&
  Boolean(USER_POOL_ID) &&
  Boolean(USER_POOL_CLIENT_ID);
export const HAS_HOSTED_UI_AUTH_CONFIG =
  HAS_COGNITO_AUTH_CONFIG &&
  Boolean(IDP_DOMAIN) &&
  Boolean(REDIRECT_SIGN_IN) &&
  Boolean(REDIRECT_SIGN_OUT);
