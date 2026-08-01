import type { NextConfig } from "next";
import path from "node:path";

const legacyPublicEnvironment = {
  USER_POOL_REGION: process.env.USER_POOL_REGION ?? "",
  USER_POOL_ID: process.env.USER_POOL_ID ?? "",
  USER_POOL_CLIENT_ID: process.env.USER_POOL_CLIENT_ID ?? "",
  PUBLIC_BUCKET_NAME: process.env.PUBLIC_BUCKET_NAME ?? "",
  COMMON_BUCKET_NAME: process.env.COMMON_BUCKET_NAME ?? "",
  IDENTITY_POOL_ID: process.env.IDENTITY_POOL_ID ?? "",
  AUTH_COOKIE_DOMAIN: process.env.AUTH_COOKIE_DOMAIN ?? "",
  IDP_DOMAIN: process.env.IDP_DOMAIN ?? "",
  REDIRECT_SIGN_IN: process.env.REDIRECT_SIGN_IN ?? "",
  REDIRECT_SIGN_OUT: process.env.REDIRECT_SIGN_OUT ?? "",
};

const nextConfig: NextConfig = {
  env: legacyPublicEnvironment,
  experimental: {
    cpus: 1,
  },
  output: "export",
  transpilePackages: ["styled-components"],
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "react-is": path.resolve(
        "node_modules/prop-types/node_modules/react-is"
      ),
    };
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
};

export default nextConfig;
