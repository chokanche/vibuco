import "server-only";
import { randomUUID } from "node:crypto";
import { headers } from "next/headers";

export type RequestContext = Readonly<{
  requestId: string;
  traceId: string;
}>;

const SAFE_CORRELATION_VALUE = /^[A-Za-z0-9._:/-]{1,200}$/;

function safeHeader(value: string | null): string | undefined {
  return value && SAFE_CORRELATION_VALUE.test(value) ? value : undefined;
}

export async function getRequestContext(): Promise<RequestContext> {
  const requestHeaders = await headers();
  const requestId =
    safeHeader(requestHeaders.get("x-request-id")) ?? randomUUID();
  const traceId =
    safeHeader(requestHeaders.get("x-trace-id")) ??
    safeHeader(requestHeaders.get("traceparent")) ??
    requestId;

  return { requestId, traceId };
}
