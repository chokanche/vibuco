import { NextRequest, NextResponse } from "next/server";
import { createCognitoTokenExchange } from "@/platform/auth/cognito";
import { parseOidcConfiguration } from "@/platform/auth/config";
import { AUTH_TRANSACTION_COOKIE, SESSION_COOKIE, authCookieOptions, openAuthTransaction, sealSession, sessionMaxAge, validateCallback, validateIdentity } from "@/platform/auth/code-flow";
import { getServerConfig } from "@/platform/config/server";
import { AuthError } from "@/platform/auth/code-flow";
import { authRateLimitKey, createAuthRateLimiter } from "@/platform/auth/rate-limit";
import { instrumentAuthRequest } from "@/platform/auth/telemetry";

const callbackRateLimiter = createAuthRateLimiter();

function failureResponse(request: Request, code: string, status = 302): NextResponse {
  return NextResponse.redirect(new URL(`/sign-in?error=${encodeURIComponent(code)}`, request.url), status);
}

export async function GET(request: NextRequest): Promise<Response> {
  const config = getServerConfig();
  const transactionCookie = request.cookies.get(AUTH_TRANSACTION_COOKIE)?.value;
  return instrumentAuthRequest(request, "/auth/callback", async () => {
    if (!config.sessionKey || !transactionCookie) {
      const response = failureResponse(request, "AUTH_TRANSACTION_INVALID");
      response.headers.set("x-vibuco-error-code", "AUTH_TRANSACTION_INVALID");
      return response;
    }
    if (!callbackRateLimiter.allow(authRateLimitKey(transactionCookie))) {
      return NextResponse.json({ code: "AUTH_RATE_LIMITED" }, { status: 429, headers: { "retry-after": "60", "x-vibuco-error-code": "AUTH_RATE_LIMITED" } });
    }
    try {
    const configuration = parseOidcConfiguration(process.env);
    const transaction = openAuthTransaction(transactionCookie, config.sessionKey.reveal());
    const code = validateCallback(transaction, {
      state: request.nextUrl.searchParams.get("state"),
      code: request.nextUrl.searchParams.get("code"),
      error: request.nextUrl.searchParams.get("error"),
    });
    const identity = await createCognitoTokenExchange(configuration)({ code, codeVerifier: transaction.codeVerifier, redirectUri: configuration.redirectUri });
    validateIdentity(identity, configuration, transaction);
    const response = NextResponse.redirect(new URL(transaction.returnTo, request.url));
    response.cookies.set(AUTH_TRANSACTION_COOKIE, "", { ...authCookieOptions, maxAge: 0 });
    response.cookies.set(SESSION_COOKIE, sealSession(identity.subject, config.sessionKey.reveal()), { ...authCookieOptions, maxAge: sessionMaxAge });
    return response;
    } catch (error) {
    const code = error instanceof AuthError ? error.code : "AUTH_CALLBACK_FAILED";
    const response = failureResponse(request, code);
    response.cookies.set(AUTH_TRANSACTION_COOKIE, "", { ...authCookieOptions, maxAge: 0 });
    response.headers.set("x-vibuco-error-code", code);
    return response;
    }
  });
}
