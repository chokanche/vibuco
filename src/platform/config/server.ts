import "server-only";
import { assertEnvironmentBoundary } from "./environment-boundary";

export function validateServerEnvironment(): void {
  assertEnvironmentBoundary(process.env);
}
