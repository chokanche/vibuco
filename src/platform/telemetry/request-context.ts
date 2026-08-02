import "server-only";
import { headers } from "next/headers";
import { createRequestContext, type RequestContext } from "./correlation";

export { createRequestContext, type RequestContext };

export async function getRequestContext(): Promise<RequestContext> {
  const requestHeaders = await headers();
  return createRequestContext(requestHeaders);
}
