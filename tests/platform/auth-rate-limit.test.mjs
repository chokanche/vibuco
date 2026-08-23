import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

test("auth callback limiting is transaction-bound, bounded, and resets", () => {
  const url = new URL("../../src/platform/auth/rate-limit.ts", import.meta.url).href;
  const source = `import { registerHooks } from "node:module"; registerHooks({resolve(s,c,n){if(s.startsWith(".")&&c.parentURL?.endsWith(".ts"))return {shortCircuit:true,url:new URL(s+".ts",c.parentURL).href};return n(s,c)}}); const {createAuthRateLimiter,authRateLimitKey}=await import(${JSON.stringify(url)}); const limiter=createAuthRateLimiter(2,100); const key=authRateLimitKey("signed-transaction"); console.log(JSON.stringify({same:key===authRateLimitKey("signed-transaction"),different:key!==authRateLimitKey("another-signed-transaction"),attempts:[limiter.allow(key,0),limiter.allow(key,1),limiter.allow(key,2),limiter.allow(key,100)]}));`;
  const child = spawnSync(process.execPath, ["--conditions=react-server", "--input-type=module", "--eval", source], { encoding: "utf8" });
  assert.equal(child.status, 0, child.stderr);
  assert.deepEqual(JSON.parse(child.stdout), { same: true, different: true, attempts: [true, true, false, true] });
});
