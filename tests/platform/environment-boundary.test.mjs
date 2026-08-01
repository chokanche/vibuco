import test from "node:test";
import assert from "node:assert/strict";
import { assertEnvironmentBoundary } from "../../src/platform/config/environment-boundary.ts";

test("allows public values that are not privileged credentials", () => {
  assert.doesNotThrow(() =>
    assertEnvironmentBoundary({
      NEXT_PUBLIC_SITE_NAME: "synthetic-site",
    })
  );
});

test("rejects private names without serializing their values", () => {
  const secretValue = "synthetic-value-that-must-not-appear";

  assert.throws(
    () =>
      assertEnvironmentBoundary({
        NEXT_PUBLIC_DATABASE_URL: secretValue,
      }),
    (error) =>
      error.message ===
        "Server-only environment variable cannot be public: NEXT_PUBLIC_DATABASE_URL" &&
      !error.message.includes(secretValue)
  );
});
