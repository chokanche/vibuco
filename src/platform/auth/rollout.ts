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

export function targetAuthFlagCanEnable(
  flag: FlagDefinition,
  now = Date.now()
): boolean {
  const expiresAt = Date.parse(flag.expiresAt);
  if (
    !flag.owner.trim() ||
    !flag.purpose.trim() ||
    !Number.isFinite(expiresAt) ||
    expiresAt <= now ||
    flag.globalValue === false
  ) {
    return false;
  }

  return (
    flag.globalValue === true ||
    flag.defaultValue ||
    Boolean(flag.actorIds?.length)
  );
}

export function parseTargetAuthFlag(
  rawValue: string | undefined
): FlagDefinition | undefined {
  if (!rawValue) return undefined;
  try {
    const candidate = JSON.parse(rawValue) as Partial<FlagDefinition> | null;
    if (
      !candidate ||
      candidate.key !== TARGET_AUTH_FLAG ||
      typeof candidate.owner !== "string" ||
      typeof candidate.purpose !== "string" ||
      typeof candidate.expiresAt !== "string" ||
      typeof candidate.defaultValue !== "boolean" ||
      (candidate.globalValue !== undefined &&
        typeof candidate.globalValue !== "boolean") ||
      (candidate.actorIds !== undefined &&
        (!Array.isArray(candidate.actorIds) ||
          candidate.actorIds.some((actorId) => typeof actorId !== "string")))
    ) {
      return undefined;
    }
    return candidate as FlagDefinition;
  } catch {
    return undefined;
  }
}
