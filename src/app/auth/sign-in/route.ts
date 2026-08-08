import { NextResponse } from "next/server";
import { getServerConfig } from "@/platform/config/server";
import { AUTH_TRANSACTION_COOKIE, SESSION_COOKIE, authCookieOptions, authTransactionMaxAge, createAuthorizationRequest, openSession, sealAuthTransaction, safeReturnPath } from "@/platform/auth/code-flow";
import { parseOidcConfiguration } from "@/platform/auth/config";
import { createFlagEvaluator } from "@/platform/flags/evaluator";
import { parseTargetAuthFlag, resolveAuthMode } from "@/platform/auth/rollout";

export async function GET(request: Request): Promise<Response> {
  const config = getServerConfig();
  if (!config.sessionKey) return NextResponse.json({ code: "AUTH_UNAVAILABLE" }, { status: 503 });
  try {
    const returnTo = safeReturnPath(new URL(request.url).searchParams.get("returnTo"));
    const existingSession = request.headers.get("cookie")?.match(/(?:^|; )__Host-vibuco-session=([^;]+)/)?.[1];
    let actorId: string | undefined;
    if (existingSession) {
      try {
        actorId = openSession(decodeURIComponent(existingSession), config.sessionKey.reveal()).subject;
      } catch {
        // An invalid session cannot influence a rollout decision.
      }
    }
    const evaluator = createFlagEvaluator({ get: async (key) => key === "target_auth" ? parseTargetAuthFlag(process.env.AUTH_TARGET_FLAG) : undefined });
    if ((await resolveAuthMode(evaluator, actorId)) === "legacy") {
      return NextResponse.redirect(new URL(`/login?returnTo=${encodeURIComponent(returnTo)}`, request.url));
    }
    const { url, transaction } = createAuthorizationRequest(parseOidcConfiguration(process.env), returnTo);
    const response = NextResponse.redirect(url);
    response.cookies.set(AUTH_TRANSACTION_COOKIE, sealAuthTransaction(transaction, config.sessionKey.reveal()), {
      ...authCookieOptions,
      maxAge: authTransactionMaxAge,
    });
    return response;
  } catch {
    return NextResponse.json({ code: "AUTH_START_INVALID" }, { status: 400 });
  }
}
