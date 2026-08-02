import "server-only";
import type { RequestContext } from "./correlation";

export const TELEMETRY_OUTCOMES = ["success", "client_error", "server_error"] as const;
export const ACTOR_CLASSES = ["anonymous", "facilitator", "administrator", "system"] as const;
export const TELEMETRY_ENVIRONMENTS = ["local", "preview", "staging", "production"] as const;

export type TelemetryOutcome = (typeof TELEMETRY_OUTCOMES)[number];
export type ActorClass = (typeof ACTOR_CLASSES)[number];
export type TelemetryEnvironment = (typeof TELEMETRY_ENVIRONMENTS)[number];

export type RequestCompletionSignal = Readonly<{
  kind: "request_completion";
  timestamp: string;
  severity: "info" | "error";
  service: "vibuco";
  environment: TelemetryEnvironment;
  route: string;
  method: string;
  statusClass: "2xx" | "4xx" | "5xx";
  outcome: TelemetryOutcome;
  durationMs: number;
  requestId: string;
  traceId: string;
  actorClass: ActorClass;
  errorCode?: string;
}>;

export type TelemetrySignal = RequestCompletionSignal;

export interface TelemetryExporter {
  export(signal: TelemetrySignal): Promise<void>;
}

export type Telemetry = Readonly<{
  recordRequestCompletion: (
    context: RequestContext,
    details: Readonly<{
      route: string;
      method: string;
      status: number;
      durationMs: number;
      actorClass: ActorClass;
      errorCode?: string;
    }>
  ) => Promise<void>;
  droppedCount: () => number;
}>;

const SAFE_ERROR_CODE = /^[A-Z][A-Z0-9_]{2,80}$/;
const SAFE_ROUTE = /^\/[A-Za-z0-9_./{}-]{0,200}$/;
const SAFE_METHOD = /^(GET|HEAD|POST|PUT|PATCH|DELETE|OPTIONS)$/;

function toStatusClass(status: number): "2xx" | "4xx" | "5xx" {
  if (status >= 500) return "5xx";
  if (status >= 400) return "4xx";
  return "2xx";
}

function toOutcome(status: number): TelemetryOutcome {
  if (status >= 500) return "server_error";
  if (status >= 400) return "client_error";
  return "success";
}

function assertSafeDetails(details: Parameters<Telemetry["recordRequestCompletion"]>[1]): void {
  if (!SAFE_ROUTE.test(details.route) || !SAFE_METHOD.test(details.method)) {
    throw new Error("Telemetry route or method is invalid");
  }
  if (!Number.isFinite(details.durationMs) || details.durationMs < 0) {
    throw new Error("Telemetry duration is invalid");
  }
  if (details.errorCode && !SAFE_ERROR_CODE.test(details.errorCode)) {
    throw new Error("Telemetry error code is invalid");
  }
}

export function createTelemetry(
  exporter: TelemetryExporter,
  environment: TelemetryEnvironment = "local"
): Telemetry {
  let dropped = 0;

  return Object.freeze({
    async recordRequestCompletion(context, details) {
      assertSafeDetails(details);
      const statusClass = toStatusClass(details.status);
      const signal: RequestCompletionSignal = {
        kind: "request_completion",
        timestamp: new Date().toISOString(),
        severity: statusClass === "5xx" ? "error" : "info",
        service: "vibuco",
        environment,
        route: details.route,
        method: details.method,
        statusClass,
        outcome: toOutcome(details.status),
        durationMs: Math.round(details.durationMs),
        requestId: context.requestId,
        traceId: context.traceId,
        actorClass: details.actorClass,
        ...(details.errorCode ? { errorCode: details.errorCode } : {}),
      };

      try {
        await exporter.export(signal);
      } catch {
        dropped += 1;
      }
    },
    droppedCount: () => dropped,
  });
}
