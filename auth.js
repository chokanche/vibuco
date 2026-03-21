import { createUseAuth } from "aws-cognito-next";
import { USER_POOL_CLIENT_ID, USER_POOL_ID, USER_POOL_REGION } from "./config";
import pems from "./pems.json";

const hasAuthConfig = USER_POOL_CLIENT_ID && USER_POOL_ID && USER_POOL_REGION;

const fallbackUseAuth = (initialAuth) => initialAuth || null;

// create useAuth hook by passing pems when auth config is available
export const useAuth = hasAuthConfig ? createUseAuth({ pems }) : fallbackUseAuth;
