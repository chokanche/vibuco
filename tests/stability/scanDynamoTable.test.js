const test = require("node:test");
const assert = require("node:assert/strict");
const {
  scanDynamoTable,
  validateDynamoConfig,
} = require("../../lib/scanDynamoTable");

test("rejects missing AWS configuration without exposing configuration values", () => {
  assert.throws(
    () => validateDynamoConfig({ identityPoolId: "", region: "" }),
    (error) =>
      error.code === "AWS_CONFIG_MISSING" &&
      error.message === "The card data dependency is not configured."
  );
});

test("rejects when the card data dependency exceeds its timeout", async () => {
  const credentials = {
    get(callback) {
      callback(null);
    },
  };

  await assert.rejects(
    scanDynamoTable({
      credentials,
      createDocumentClient: () => ({
        scan() {},
      }),
      tableName: "synthetic-table",
      timeoutMs: 5,
    }),
    (error) => error.code === "AWS_DEPENDENCY_TIMEOUT"
  );
});

test("resolves only the DynamoDB item array", async () => {
  const credentials = {
    get(callback) {
      callback(null);
    },
  };

  const items = await scanDynamoTable({
    credentials,
    createDocumentClient: () => ({
      scan(_request, callback) {
        callback(null, { Items: [{ id: "opaque-card-id" }] });
      },
    }),
    tableName: "synthetic-table",
    timeoutMs: 50,
  });

  assert.deepEqual(items, [{ id: "opaque-card-id" }]);
});
