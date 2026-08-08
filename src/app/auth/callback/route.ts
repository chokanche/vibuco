import { NextRequest, NextResponse } from "next/server";
import { createCognitoTokenExchange } from "@/platform/auth/cognito";
import { parseOidcConfiguration } from "@/platform/auth/config";
import { AUTH_TRANSACTION_COOKIE, SESSION_COOKIE, authCookieOptions, openAuthTransaction, sealSession, sessionMaxAge, validateCallback, validateIdentity } from "@/platform/auth/code-flow";
import { getServerConfig } from "@/platform/config/server";

function failureResponse(request: Request, code: string): NextResponse {
  return NextResponse.redirect(new URL(`/sign-in?error=${encodeURIComponent(code)}`, request.url));
}

export async function GET(request: NextRequest): Promise<Response> {
  const config = getServerConfig();
  const transactionCookie = request.cookies.get(AUTH_TRANSACTION_COOKIE)?.value;
  if (!config.sessionKey || !transactionCookie) return failureResponse(request, "AUTH_TRANSACTION_INVALID");
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
  } catch {
    const response = failureResponse(request, "AUTH_CALLBACK_FAILED");
    response.cookies.set(AUTH_TRANSACTION_COOKIE, "", { ...authCookieOptions, maxAge: 0 });
    return response;
  }
}
