import "server-only";
import {
  DEPLOYMENT_ENVIRONMENTS,
  type DeploymentEnvironment,
} from "@/platform/config/server";
import { createTelemetry, type TelemetryExporter } from "@/platform/telemetry/foundation";
import { instrumentRequest } from "@/platform/telemetry/request-instrumentation";

const exporter: TelemetryExporter = {
  async export(signal) {
    console.info(JSON.stringify(signal));
  },
};

function deploymentEnvironmentForTelemetry(): DeploymentEnvironment {
  const value = process.env.VIBUCO_ENV;
  return DEPLOYMENT_ENVIRONMENTS.includes(value as DeploymentEnvironment)
    ? (value as DeploymentEnvironment)
    : "local";
}

export function instrumentAuthRequest(
  request: Request,
  route: string,
  handler: Parameters<typeof instrumentRequest>[3]
): Promise<Response> {
  return instrumentRequest(
    request,
    { route, actorClass: "anonymous" },
    createTelemetry(exporter, deploymentEnvironmentForTelemetry()),
    handler
  );
}
