import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

test("auth code flow validates PKCE, state, nonce, session rotation, expiry, and safe return paths", () => {
  const url = new URL("../../src/platform/auth/code-flow.ts", import.meta.url).href;
  const rolloutUrl = new URL("../../src/platform/auth/rollout.ts", import.meta.url).href;
  const source = `
    import { registerHooks } from "node:module";
    registerHooks({ resolve(specifier, context, nextResolve) {
      if (specifier.startsWith(".") && context.parentURL?.endsWith(".ts")) return { shortCircuit: true, url: new URL(specifier + ".ts", context.parentURL).href };
      return nextResolve(specifier, context);
    }});
    const auth = await import(${JSON.stringify(url)});
    const { createFlagEvaluator } = await import(${JSON.stringify(new URL("../../src/platform/flags/evaluator.ts", import.meta.url).href)});
    const { resolveAuthMode } = await import(${JSON.stringify(rolloutUrl)});
    const config = { authorizationEndpoint:"https://issuer.example/oauth2/authorize", tokenEndpoint:"https://issuer.example/oauth2/token", clientId:"synthetic-client", issuer:"https://issuer.example", redirectUri:"https://app.example/auth/callback" };
    const start = auth.createAuthorizationRequest(config, "/workspace?deck=full", 1000);
    const cookie = auth.sealAuthTransaction(start.transaction, "synthetic-session-key-with-32-characters");
    const transaction = auth.openAuthTransaction(cookie, "synthetic-session-key-with-32-characters", 1001);
    const code = auth.validateCallback(transaction, { state: transaction.state, code:"synthetic-code-123", error:null });
    const identity = { subject:"cognito-subject", issuer:config.issuer, audience:config.clientId, nonce:transaction.nonce, expiresAt:2000 };
    auth.validateIdentity(identity, config, transaction, 1002);
    const session = auth.sealSession(identity.subject, "synthetic-session-key-with-32-characters", 1000);
    const opened = auth.openSession(session, "synthetic-session-key-with-32-characters", 1001);
    const pilotGrant = auth.sealAuthPilotGrant(identity.subject, "synthetic-session-key-with-32-characters", 1000);
    const pilot = auth.openAuthPilotGrant(pilotGrant, "synthetic-session-key-with-32-characters", 1001);
    const capture = (run) => { try { run(); return null; } catch (error) { return error.code; } };
    console.log(JSON.stringify({
      url:start.url, returnTo:transaction.returnTo, code, opened, pilot,
      tampered:capture(() => auth.openAuthTransaction(cookie + "x", "synthetic-session-key-with-32-characters", 1001)),
      replay:capture(() => auth.openAuthTransaction(cookie, "synthetic-session-key-with-32-characters", 700000)),
      state:capture(() => auth.validateCallback(transaction, { state:"wrong", code:"synthetic-code-123", error:null })),
      nonce:capture(() => auth.validateIdentity({ ...identity, nonce:"wrong" }, config, transaction, 1002)),
      expiredSession:capture(() => auth.openSession(session, "synthetic-session-key-with-32-characters", 30000000)),
      unsafePath:capture(() => auth.safeReturnPath("https://attacker.example"))
    }));
  `;
  const child = spawnSync(process.execPath, ["--conditions=react-server", "--input-type=module", "--eval", source], { encoding: "utf8" });
  assert.equal(child.status, 0, child.stderr);
  const result = JSON.parse(child.stdout);
  const authorizationUrl = new URL(result.url);
  assert.equal(authorizationUrl.searchParams.get("response_type"), "code");
  assert.equal(authorizationUrl.searchParams.get("code_challenge_method"), "S256");
  assert.ok(authorizationUrl.searchParams.get("code_challenge"));
  assert.equal(result.returnTo, "/workspace?deck=full");
  assert.equal(result.code, "synthetic-code-123");
  assert.equal(result.opened.subject, "cognito-subject");
  assert.equal(result.pilot.subject, "cognito-subject");
  assert.equal(result.tampered, "AUTH_TRANSACTION_INVALID");
  assert.equal(result.replay, "AUTH_TRANSACTION_EXPIRED");
  assert.equal(result.state, "AUTH_STATE_INVALID");
  assert.equal(result.nonce, "AUTH_TOKEN_INVALID");
  assert.equal(result.expiredSession, "AUTH_SESSION_EXPIRED");
  assert.equal(result.unsafePath, "AUTH_INVALID_RETURN_PATH");
});

test("auth rollout defaults to legacy and permits an explicitly flagged cohort", () => {
  const rolloutUrl = new URL("../../src/platform/auth/rollout.ts", import.meta.url).href;
  const flagsUrl = new URL("../../src/platform/flags/evaluator.ts", import.meta.url).href;
  const source = `import { registerHooks } from "node:module"; registerHooks({resolve(s,c,n){if(s.startsWith(".")&&c.parentURL?.endsWith(".ts"))return {shortCircuit:true,url:new URL(s+".ts",c.parentURL).href};return n(s,c)}}); const {createFlagEvaluator}=await import(${JSON.stringify(flagsUrl)}); const {resolveAuthMode}=await import(${JSON.stringify(rolloutUrl)}); const off=createFlagEvaluator({get:async()=>undefined}); const cohort=createFlagEvaluator({get:async()=>({key:"target_auth",owner:"identity",purpose:"pilot",expiresAt:"2099-01-01T00:00:00Z",defaultValue:false,actorIds:["subject-1"]})}); console.log(JSON.stringify({off:await resolveAuthMode(off),cohort:await resolveAuthMode(cohort,"subject-1"),other:await resolveAuthMode(cohort,"other")}));`;
  const child = spawnSync(process.execPath, ["--conditions=react-server", "--input-type=module", "--eval", source], { encoding: "utf8" });
  assert.equal(child.status, 0, child.stderr);
  assert.deepEqual(JSON.parse(child.stdout), { off: "legacy", cohort: "target", other: "legacy" });
});
