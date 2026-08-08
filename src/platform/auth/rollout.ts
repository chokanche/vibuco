import "server-only";
import type { FlagDefinition, FlagEvaluator } from "@/platform/flags/evaluator";

export const TARGET_AUTH_FLAG = "target_auth";

export async function resolveAuthMode(
  evaluator: FlagEvaluator,
  actorId?: string
): Promise<"target" | "legacy"> {
  return (await evaluator.evaluate(TARGET_AUTH_FLAG, { ...(actorId ? { actorId } : {}) }))
    ? "target"
    : "legacy";
}

export function parseTargetAuthFlag(rawValue: string | undefined): FlagDefinition | undefined {
  if (!rawValue) return undefined;
  try {
    const candidate = JSON.parse(rawValue) as FlagDefinition;
    return candidate.key === TARGET_AUTH_FLAG ? candidate : undefined;
  } catch {
    return undefined;
  }
}
