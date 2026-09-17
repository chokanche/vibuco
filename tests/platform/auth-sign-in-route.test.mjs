import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

test("disabled target auth fails off before runtime config and rejects unsafe returns", () => {
  const routeUrl = new URL(
    "../../src/app/auth/sign-in/route.ts",
    import.meta.url
  ).href;
  const signOutRouteUrl = new URL(
    "../../src/app/auth/sign-out/route.ts",
    import.meta.url
  ).href;
  const sourceRoot = new URL("../../src/", import.meta.url).href;
  const source = `
    import { registerHooks } from "node:module";
    const sourceRoot = new URL(${JSON.stringify(sourceRoot)});
    registerHooks({ resolve(specifier, context, nextResolve) {
      if (specifier === "server-only") return { shortCircuit: true, url: "data:text/javascript,export%20default%20undefined" };
      if (specifier === "next/server") return nextResolve("next/server.js", context);
      if (specifier.startsWith("@/")) return { shortCircuit: true, url: new URL(specifier.slice(2) + ".ts", sourceRoot).href };
      if (specifier.startsWith(".") && context.parentURL?.endsWith(".ts")) return { shortCircuit: true, url: new URL(specifier + ".ts", context.parentURL).href };
      return nextResolve(specifier, context);
    }});
    process.env.AUTH_TARGET_FLAG = JSON.stringify({
      key: "target_auth",
      owner: "identity",
      purpose: "emergency rollback",
      expiresAt: "2099-01-01T00:00:00Z",
      defaultValue: false,
      globalValue: false,
      actorIds: ["pilot-subject"]
    });
    delete process.env.VIBUCO_ENV;
    const { GET } = await import(${JSON.stringify(routeUrl)});
    const { POST } = await import(${JSON.stringify(signOutRouteUrl)});
    const disabled = await GET(new Request("https://preview.example/auth/sign-in?returnTo=%2Fcards"));
    process.env.AUTH_TARGET_FLAG = JSON.stringify({
      key: "target_auth",
      owner: "identity",
      purpose: "expired pilot",
      expiresAt: "2020-01-01T00:00:00Z",
      defaultValue: true
    });
    const expired = await GET(new Request("https://preview.example/auth/sign-in?returnTo=%2Fcards"));
    process.env.AUTH_TARGET_FLAG = "{";
    const malformed = await GET(new Request("https://preview.example/auth/sign-in?returnTo=%2Fcards"));
    delete process.env.AUTH_TARGET_FLAG;
    const missing = await GET(new Request("https://preview.example/auth/sign-in?returnTo=%2Fcards"));
    const unsafe = await GET(new Request("https://preview.example/auth/sign-in?returnTo=https%3A%2F%2Fattacker.example"));
    const rejectedSignOut = await POST(new Request("https://preview.example/auth/sign-out", { method: "POST", headers: { origin: "https://attacker.example" } }));
    const signOut = await POST(new Request("https://preview.example/auth/sign-out", { method: "POST", headers: { origin: "https://preview.example" } }));
    console.log(JSON.stringify({
      disabledStatus: disabled.status,
      disabledLocation: disabled.headers.get("location"),
      expiredStatus: expired.status,
      expiredLocation: expired.headers.get("location"),
      malformedStatus: malformed.status,
      malformedLocation: malformed.headers.get("location"),
      missingStatus: missing.status,
      missingLocation: missing.headers.get("location"),
      unsafeStatus: unsafe.status,
      unsafeBody: await unsafe.json(),
      rejectedSignOutStatus: rejectedSignOut.status,
      signOutStatus: signOut.status,
      signOutLocation: signOut.headers.get("location"),
      signOutCookie: signOut.headers.get("set-cookie")
    }));
  `;
  const child = spawnSync(
    process.execPath,
    ["--input-type=module", "--eval", source],
    { encoding: "utf8" }
  );
  assert.equal(child.status, 0, child.stderr);
  const result = JSON.parse(child.stdout.trim().split("\n").at(-1));
  const { signOutCookie, ...responseResult } = result;
  assert.deepEqual(responseResult, {
    disabledStatus: 307,
    disabledLocation: "https://preview.example/login?returnTo=%2Fcards",
    expiredStatus: 307,
    expiredLocation: "https://preview.example/login?returnTo=%2Fcards",
    malformedStatus: 307,
    malformedLocation: "https://preview.example/login?returnTo=%2Fcards",
    missingStatus: 307,
    missingLocation: "https://preview.example/login?returnTo=%2Fcards",
    unsafeStatus: 400,
    unsafeBody: { code: "AUTH_START_INVALID" },
    rejectedSignOutStatus: 403,
    signOutStatus: 303,
    signOutLocation: "https://preview.example/sign-in?signedOut=1",
  });
  assert.match(signOutCookie, /^__Host-vibuco-session=;/);
  for (const attribute of [
    "Path=/",
    "Max-Age=0",
    "Secure",
    "HttpOnly",
    "SameSite=lax",
  ]) {
    assert.equal(signOutCookie.includes(attribute), true, attribute);
  }
});
