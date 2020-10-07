const withImages = require("next-images");
const withCSS = require("@zeit/next-css");
const withSvgr = require("next-svgr")
const withPlugins = require('next-compose-plugins');

require("dotenv").config();

module.exports = withPlugins( [withCSS, [withImages, {}], withSvgr],
  {
    fileExtensions: ["jpg", "jpeg", "png", "gif"],
    publicRuntimeConfig: {
      USER_POOL_REGION: process.env.USER_POOL_REGION,
      USER_POOL_ID: process.env.USER_POOL_ID,
      USER_POOL_CLIENT_ID: process.env.USER_POOL_CLIENT_ID,
      PUBLIC_BUCKET_NAME: process.env.PUBLIC_BUCKET_NAME,
      COMMON_BUCKET_NAME: process.env.COMMON_BUCKET_NAME,
      IDENTITY_POOL_ID: process.env.IDENTITY_POOL_ID,
      AUTH_COOKIE_DOMAIN: process.env.AUTH_COOKIE_DOMAIN,
      NODE_ENV: process.env.NODE_ENV,
      IDP_DOMAIN: process.env.IDP_DOMAIN,
      REDIRECT_SIGN_IN: process.env.REDIRECT_SIGN_IN,
      REDIRECT_SIGN_OUT: process.env.REDIRECT_SIGN_OUT,
    },
    webpack: (config) => {
      // Fixes npm packages that depend on `fs` module
      config.node = {
        fs: "empty",
      };

      // Enable loading of SVGs
      config.module.rules.push({
        test: /\.svg$/,
        use: [
          {
            loader: "svg-url-loader",
            options: {
              limit: 10000,
            },
          },
        ],
      });

      config.module.rules.push({
        test: /\.(eot|woff|woff2|ttf|svg|PNG|png|jpg|JPG|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            limit: 100000,
            name: '[name].[ext]'
          }
        }
      })
      return config;
    },
    resolve: {
      extensions: [".js", ".jsx"],
    },
  });
