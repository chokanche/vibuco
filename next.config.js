const withImages = require("next-images");
require("dotenv").config();

module.exports = withImages({
  publicRuntimeConfig: {
    USER_POOL_REGION: process.env.USER_POOL_REGION,
    USER_POOL_ID: process.env.USER_POOL_ID,
    USER_POOL_CLIENT_ID: process.env.USER_POOL_CLIENT_ID,
    PUBLIC_BUCKET_NAME: process.env.PUBLIC_BUCKET_NAME,
    IDENTITY_POOL_ID: process.env.IDENTITY_POOL_ID,
    AUTH_COOKIE_DOMAIN: process.env.AUTH_COOKIE_DOMAIN,
    NODE_ENV: process.env.NODE_ENV,
    IDP_DOMAIN: process.env.IDP_DOMAIN,
    REDIRECT_SIGN_IN: process.env.REDIRECT_SIGN_IN,
    REDIRECT_SIGN_OUT: process.env.REDIRECT_SIGN_OUT,
  },
});
