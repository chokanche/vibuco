import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  PUBLIC_ENVIRONMENT_KEYS,
  parsePublicEnvironment,
} from "../../src/platform/config/public.ts";

test("public configuration allowlist is an intentional snapshot", () => {
  assert.deepEqual(PUBLIC_ENVIRONMENT_KEYS, ["NEXT_PUBLIC_SITE_URL"]);
});

test("normalizes an HTTPS origin and local loopback HTTP", () => {
  assert.deepEqual(
    parsePublicEnvironment({
      NEXT_PUBLIC_SITE_URL: "https://preview.synthetic.example/",
    }),
    { siteUrl: "https://preview.synthetic.example" }
  );
  assert.deepEqual(
    parsePublicEnvironment({
      NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
    }),
    { siteUrl: "http://localhost:3000" }
  );
});

test("reports missing and malformed public values without echoing input", () => {
  assert.throws(
    () => parsePublicEnvironment({}),
    (error) => error.code === "CONFIG_PUBLIC_SITE_URL_MISSING"
  );

  const malformedValue = "synthetic-invalid-public-value";
  assert.throws(
    () =>
      parsePublicEnvironment({
        NEXT_PUBLIC_SITE_URL: malformedValue,
      }),
    (error) =>
      error.code === "CONFIG_PUBLIC_SITE_URL_INVALID" &&
      !error.message.includes(malformedValue)
  );
});

test("rejects insecure remote origins and unknown public keys", () => {
  assert.throws(
    () =>
      parsePublicEnvironment({
        NEXT_PUBLIC_SITE_URL: "http://synthetic.example",
      }),
    (error) => error.code === "CONFIG_PUBLIC_SITE_URL_INVALID"
  );
  assert.throws(
    () =>
      parsePublicEnvironment({
        NEXT_PUBLIC_SITE_URL: "https://synthetic.example",
        NEXT_PUBLIC_DATABASE_URL: "synthetic-secret",
      }),
    (error) => error.code === "CONFIG_PUBLIC_UNKNOWN_KEY"
  );
});

test("client configuration source references only allowlisted values", async () => {
  const source = await readFile(
    new URL("../../src/platform/config/public.ts", import.meta.url),
    "utf8"
  );
  const referencedEnvironmentKeys = Array.from(
    source.matchAll(/process\.env\.([A-Z0-9_]+)/g),
    (match) => match[1]
  );

  assert.deepEqual(referencedEnvironmentKeys, [...PUBLIC_ENVIRONMENT_KEYS]);
  for (const forbiddenMarker of [
    "DATABASE_URL",
    "SESSION_KEY",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "server-only",
  ]) {
    assert.equal(source.includes(forbiddenMarker), false, forbiddenMarker);
  }
});
