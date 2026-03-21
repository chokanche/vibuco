import { createUseAuth, useAuthFunctions } from "aws-cognito-next";
import { HAS_COGNITO_AUTH_CONFIG, HAS_HOSTED_UI_AUTH_CONFIG } from "./config";
import pems from "./pems.json";

const fallbackUseAuth = (initialAuth) => initialAuth || null;
const fallbackUseAuthFunctions = () => ({
  login: () => {},
  logout: () => {},
});

// create useAuth hook by passing pems when auth config is available
export const useAuth = HAS_COGNITO_AUTH_CONFIG ? createUseAuth({ pems }) : fallbackUseAuth;
export const useAuthControls = HAS_HOSTED_UI_AUTH_CONFIG
  ? useAuthFunctions
  : fallbackUseAuthFunctions;
