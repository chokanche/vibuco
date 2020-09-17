import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export const USER_POOL_REGION = publicRuntimeConfig.USER_POOL_REGION;
export const USER_POOL_ID = publicRuntimeConfig.USER_POOL_ID;
export const USER_POOL_CLIENT_ID = publicRuntimeConfig.USER_POOL_CLIENT_ID;
export const PUBLIC_BUCKET_NAME = publicRuntimeConfig.PUBLIC_BUCKET_NAME;
export const IDENTITY_POOL_ID = publicRuntimeConfig.IDENTITY_POOL_ID;
export const AUTH_COOKIE_DOMAIN = publicRuntimeConfig.AUTH_COOKIE_DOMAIN;
export const NODE_ENV = publicRuntimeConfig.NODE_ENV;
export const IDP_DOMAIN = publicRuntimeConfig.IDP_DOMAIN;
export const REDIRECT_SIGN_IN = publicRuntimeConfig.REDIRECT_SIGN_IN;
export const REDIRECT_SIGN_OUT = publicRuntimeConfig.REDIRECT_SIGN_OUT;
