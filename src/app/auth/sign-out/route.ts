import { NextResponse } from "next/server";
import { SESSION_COOKIE, authCookieOptions } from "@/platform/auth/code-flow";
import { instrumentAuthRequest } from "@/platform/auth/telemetry";

export async function POST(request: Request): Promise<Response> {
  return instrumentAuthRequest(request, "/auth/sign-out", async () => {
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin) {
      return NextResponse.json({ code: "AUTH_ORIGIN_INVALID" }, { status: 403, headers: { "x-vibuco-error-code": "AUTH_ORIGIN_INVALID" } });
    }
    const response = NextResponse.redirect(new URL("/sign-in?signedOut=1", request.url), 303);
    response.cookies.set(SESSION_COOKIE, "", { ...authCookieOptions, maxAge: 0 });
    return response;
  });
}
