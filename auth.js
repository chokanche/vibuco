import { createUseAuth } from "aws-cognito-next";
import pems from "./pems.json";

// create useAuth hook by passing pems
export const useAuth = createUseAuth({ pems });
