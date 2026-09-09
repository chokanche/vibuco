import "server-only";
import { getServerConfig } from "@/platform/config/server";
import { createTelemetry, type TelemetryExporter } from "@/platform/telemetry/foundation";
import { instrumentRequest } from "@/platform/telemetry/request-instrumentation";

const exporter: TelemetryExporter = {
  async export(signal) {
    console.info(JSON.stringify(signal));
  },
};

export function instrumentAuthRequest(
  request: Request,
  route: string,
  handler: Parameters<typeof instrumentRequest>[3]
): Promise<Response> {
  return instrumentRequest(
    request,
    { route, actorClass: "anonymous" },
    createTelemetry(exporter, getServerConfig().deploymentEnvironment),
    handler
  );
}
