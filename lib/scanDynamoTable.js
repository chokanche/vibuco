const DEFAULT_DEPENDENCY_TIMEOUT_MS = 10000;

const dependencyError = (code, message) => {
  const error = new Error(message);
  error.code = code;
  return error;
};

const validateDynamoConfig = ({ identityPoolId, region }) => {
  if (!identityPoolId || !region) {
    throw dependencyError(
      "AWS_CONFIG_MISSING",
      "The card data dependency is not configured."
    );
  }
};

const scanDynamoTable = ({
  credentials,
  createDocumentClient,
  tableName,
  timeoutMs = DEFAULT_DEPENDENCY_TIMEOUT_MS,
}) =>
  new Promise((resolve, reject) => {
    let settled = false;

    const finish = (callback, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      callback(value);
    };

    const timeout = setTimeout(() => {
      finish(
        reject,
        dependencyError(
          "AWS_DEPENDENCY_TIMEOUT",
          "The card data dependency did not respond in time."
        )
      );
    }, timeoutMs);

    if (typeof timeout.unref === "function") timeout.unref();

    credentials.get((credentialError) => {
      if (credentialError) {
        finish(
          reject,
          dependencyError(
            "AWS_CREDENTIALS_UNAVAILABLE",
            "Card data credentials are unavailable."
          )
        );
        return;
      }

      let documentClient;
      try {
        documentClient = createDocumentClient();
      } catch (_error) {
        finish(
          reject,
          dependencyError(
            "AWS_CLIENT_UNAVAILABLE",
            "The card data client could not be created."
          )
        );
        return;
      }

      documentClient.scan({ TableName: tableName }, (scanError, data) => {
        if (scanError) {
          finish(
            reject,
            dependencyError(
              "AWS_SCAN_FAILED",
              "The card data dependency returned an error."
            )
          );
          return;
        }

        finish(resolve, Array.isArray(data && data.Items) ? data.Items : []);
      });
    });
  });

module.exports = {
  DEFAULT_DEPENDENCY_TIMEOUT_MS,
  scanDynamoTable,
  validateDynamoConfig,
};
