import "server-only";
import { createHash } from "node:crypto";

type Entry = Readonly<{ count: number; resetAt: number }>;

export type AuthRateLimiter = Readonly<{
  allow: (key: string, now?: number) => boolean;
}>;

export function createAuthRateLimiter(
  maximumAttempts = 5,
  windowMilliseconds = 60_000
): AuthRateLimiter {
  const entries = new Map<string, Entry>();
  return Object.freeze({
    allow(key, now = Date.now()) {
      const current = entries.get(key);
      if (!current || current.resetAt <= now) {
        entries.set(key, { count: 1, resetAt: now + windowMilliseconds });
        return true;
      }
      if (current.count >= maximumAttempts) return false;
      entries.set(key, { ...current, count: current.count + 1 });
      return true;
    },
  });
}

export function authRateLimitKey(transaction: string): string {
  return createHash("sha256")
    .update(transaction)
    .digest("base64url");
}
