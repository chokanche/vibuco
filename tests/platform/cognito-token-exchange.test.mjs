import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

test("Cognito code exchange validates a signed ID token before returning identity claims", () => {
  const url = new URL("../../src/platform/auth/cognito.ts", import.meta.url).href;
  const source = `
    import { generateKeyPairSync, sign } from "node:crypto";
    import { registerHooks } from "node:module";
    registerHooks({ resolve(specifier, context, nextResolve) {
      if (specifier.startsWith(".") && context.parentURL?.endsWith(".ts")) return { shortCircuit: true, url: new URL(specifier + ".ts", context.parentURL).href };
      return nextResolve(specifier, context);
    }});
    const { createCognitoTokenExchange } = await import(${JSON.stringify(url)});
    const { publicKey, privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
    const header = Buffer.from(JSON.stringify({ alg:"RS256", kid:"synthetic-key" })).toString("base64url");
    const payload = Buffer.from(JSON.stringify({ sub:"subject-1", iss:"https://issuer.example", aud:"synthetic-client", nonce:"nonce-1", exp:Math.floor(Date.now()/1000)+3600 })).toString("base64url");
    const signature = sign("RSA-SHA256", Buffer.from(header+"."+payload), privateKey).toString("base64url");
    const token = header+"."+payload+"."+signature;
    const jwk = publicKey.export({ format:"jwk" });
    let tokenRequest = null;
    const requestSignals = [];
    globalThis.fetch = async (input, init) => {
      requestSignals.push(Boolean(init.signal));
      const value = String(input);
      if (value === "https://issuer.example/oauth2/token") { tokenRequest = init; return new Response(JSON.stringify({ id_token:token }), { status:200 }); }
      if (value === "https://issuer.example/.well-known/jwks.json") return new Response(JSON.stringify({ keys:[{ ...jwk, kid:"synthetic-key", use:"sig", alg:"RS256" }] }), { status:200 });
      return new Response(null, { status:404 });
    };
    const config = { authorizationEndpoint:"https://issuer.example/oauth2/authorize", tokenEndpoint:"https://issuer.example/oauth2/token", clientId:"synthetic-client", issuer:"https://issuer.example", redirectUri:"https://app.example/auth/callback" };
    const result = await createCognitoTokenExchange(config)({ code:"synthetic-code-123", codeVerifier:"verifier", redirectUri:config.redirectUri });
    const body = new URLSearchParams(tokenRequest.body);
    console.log(JSON.stringify({ result, grantType:body.get("grant_type"), verifier:body.get("code_verifier"), redirectUri:body.get("redirect_uri"), requestSignals }));
  `;
  const child = spawnSync(process.execPath, ["--conditions=react-server", "--input-type=module", "--eval", source], { encoding: "utf8" });
  assert.equal(child.status, 0, child.stderr);
  const result = JSON.parse(child.stdout);
  assert.equal(result.result.subject, "subject-1");
  assert.equal(result.result.issuer, "https://issuer.example");
  assert.equal(result.grantType, "authorization_code");
  assert.equal(result.verifier, "verifier");
  assert.equal(result.redirectUri, "https://app.example/auth/callback");
  assert.deepEqual(result.requestSignals, [true, true]);
});
