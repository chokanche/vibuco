import { NextResponse, type NextRequest } from "next/server";
import { openSession, SESSION_COOKIE } from "@/platform/auth/code-flow";
import { getServerConfig } from "@/platform/config/server";

const PROTECTED_PREFIXES = ["/workspace", "/admin"];

export function middleware(request: NextRequest): NextResponse {
  if (!PROTECTED_PREFIXES.some((prefix) => request.nextUrl.pathname.startsWith(prefix))) {
    return NextResponse.next();
  }
  const sessionValue = request.cookies.get(SESSION_COOKIE)?.value;
  try {
    const sessionKey = getServerConfig().sessionKey;
    if (sessionValue && sessionKey) {
      openSession(sessionValue, sessionKey.reveal());
      return NextResponse.next();
    }
  } catch {
    // Authentication failures deliberately redirect to the public sign-in flow.
  }
  const signInUrl = new URL("/auth/sign-in", request.url);
  signInUrl.searchParams.set("returnTo", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(signInUrl);
}

export const config = { matcher: ["/workspace/:path*", "/admin/:path*"] };
export const runtime = "nodejs";
