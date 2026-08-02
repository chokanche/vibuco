import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

test("server configuration validates every deployment schema and redacts secrets", () => {
  const moduleUrl = new URL(
    "../../src/platform/config/server.ts",
    import.meta.url
  ).href;
  const childSource = `
    import { registerHooks } from "node:module";

    registerHooks({
      resolve(specifier, context, nextResolve) {
        if (specifier.startsWith(".") && context.parentURL?.endsWith(".ts")) {
          return {
            shortCircuit: true,
            url: new URL(specifier + ".ts", context.parentURL).href,
          };
        }
        return nextResolve(specifier, context);
      },
    });

    const { parseServerEnvironment } = await import(${JSON.stringify(moduleUrl)});

    const validSecrets = {
      DATABASE_URL: "postgresql://synthetic-user:synthetic-password@db.synthetic.invalid/vibuco",
      SESSION_KEY: "synthetic-session-key-with-32-characters",
    };
    const base = {
      NEXT_PUBLIC_SITE_URL: "https://synthetic.example",
    };
    const cases = [
      ["local", { ...base, VIBUCO_ENV: "local" }],
      ["preview", { ...base, ...validSecrets, VIBUCO_ENV: "preview" }],
      ["staging", { ...base, ...validSecrets, VIBUCO_ENV: "staging" }],
      ["production", { ...base, ...validSecrets, VIBUCO_ENV: "production" }],
      ["missing-environment", base],
      ["invalid-environment", { ...base, VIBUCO_ENV: "qa" }],
      ["insecure-preview-origin", {
        ...base,
        ...validSecrets,
        VIBUCO_ENV: "preview",
        NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
      }],
      ["missing-database", { ...base, VIBUCO_ENV: "preview", SESSION_KEY: validSecrets.SESSION_KEY }],
      ["invalid-database", { ...base, VIBUCO_ENV: "preview", ...validSecrets, DATABASE_URL: "synthetic-invalid-database" }],
      ["missing-session", { ...base, VIBUCO_ENV: "staging", DATABASE_URL: validSecrets.DATABASE_URL }],
      ["invalid-session", { ...base, VIBUCO_ENV: "production", ...validSecrets, SESSION_KEY: "synthetic-short" }],
    ];

    const results = cases.map(([name, environment]) => {
      try {
        const config = parseServerEnvironment(environment);
        const serialized = JSON.stringify(config);
        return {
          name,
          ok: true,
          deploymentEnvironment: config.deploymentEnvironment,
          serialized,
          hasDatabase: Boolean(config.databaseUrl),
          hasSession: Boolean(config.sessionKey),
          databaseReveals: config.databaseUrl?.reveal() === environment.DATABASE_URL,
          sessionReveals: config.sessionKey?.reveal() === environment.SESSION_KEY,
        };
      } catch (error) {
        return { name, ok: false, code: error.code, message: error.message };
      }
    });
    console.log(JSON.stringify({ results, validSecrets }));
  `;
  const child = spawnSync(
    process.execPath,
    [
      "--conditions=react-server",
      "--input-type=module",
      "--eval",
      childSource,
    ],
    { encoding: "utf8" }
  );

  assert.equal(child.status, 0, child.stderr);
  const { results, validSecrets } = JSON.parse(child.stdout);
  const byName = Object.fromEntries(results.map((result) => [result.name, result]));

  for (const environment of ["local", "preview", "staging", "production"]) {
    assert.equal(byName[environment].ok, true, environment);
    assert.equal(byName[environment].deploymentEnvironment, environment);
  }
  assert.equal(byName.local.hasDatabase, false);
  assert.equal(byName.local.hasSession, false);
  assert.equal(byName.preview.databaseReveals, true);
  assert.equal(byName.preview.sessionReveals, true);
  assert.match(byName.preview.serialized, /\[REDACTED\]/);
  assert.equal(byName.preview.serialized.includes(validSecrets.DATABASE_URL), false);
  assert.equal(byName.preview.serialized.includes(validSecrets.SESSION_KEY), false);

  assert.equal(
    byName["missing-environment"].code,
    "CONFIG_SERVER_ENVIRONMENT_MISSING"
  );
  assert.equal(
    byName["invalid-environment"].code,
    "CONFIG_SERVER_ENVIRONMENT_INVALID"
  );
  assert.equal(
    byName["insecure-preview-origin"].code,
    "CONFIG_SERVER_SITE_URL_INVALID"
  );
  assert.equal(
    byName["missing-database"].code,
    "CONFIG_SERVER_DATABASE_URL_MISSING"
  );
  assert.equal(
    byName["invalid-database"].code,
    "CONFIG_SERVER_DATABASE_URL_INVALID"
  );
  assert.equal(
    byName["missing-session"].code,
    "CONFIG_SERVER_SESSION_KEY_MISSING"
  );
  assert.equal(
    byName["invalid-session"].code,
    "CONFIG_SERVER_SESSION_KEY_INVALID"
  );

  for (const result of results.filter(({ ok }) => !ok)) {
    assert.equal(result.message.includes("synthetic-invalid-database"), false);
    assert.equal(result.message.includes("synthetic-short"), false);
  }
});
