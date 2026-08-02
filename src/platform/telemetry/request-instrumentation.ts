import "server-only";
import { createRequestContext, type RequestContext } from "./correlation";
import type { ActorClass, Telemetry } from "./foundation";

export type InstrumentedRequestOptions = Readonly<{
  route: string;
  actorClass: ActorClass;
}>;

function responseWithCorrelationHeaders(
  response: Response,
  context: RequestContext
): Response {
  const headers = new Headers(response.headers);
  headers.set("x-request-id", context.requestId);
  headers.set("x-trace-id", context.traceId);
  return new Response(response.body, { headers, status: response.status, statusText: response.statusText });
}

export async function instrumentRequest(
  request: Request,
  options: InstrumentedRequestOptions,
  telemetry: Telemetry,
  handler: (context: RequestContext) => Promise<Response>
): Promise<Response> {
  const context = createRequestContext(request.headers);
  const startedAt = performance.now();
  let response: Response;
  let errorCode: string | undefined;

  try {
    response = await handler(context);
  } catch {
    errorCode = "INTERNAL_ERROR";
    response = new Response(null, { status: 500 });
  }

  const correlatedResponse = responseWithCorrelationHeaders(response, context);
  void telemetry.recordRequestCompletion(context, {
    route: options.route,
    method: request.method,
    status: correlatedResponse.status,
    durationMs: performance.now() - startedAt,
    actorClass: options.actorClass,
    ...(errorCode ? { errorCode } : {}),
  });
  return correlatedResponse;
}
