import "server-only";
import { assertEnvironmentBoundary } from "./environment-boundary";
import { parsePublicEnvironment, type PublicConfig } from "./public";

export const DEPLOYMENT_ENVIRONMENTS = [
  "local",
  "preview",
  "staging",
  "production",
] as const;

export type DeploymentEnvironment =
  (typeof DEPLOYMENT_ENVIRONMENTS)[number];

export type ServerConfigurationErrorCode =
  | "CONFIG_SERVER_ENVIRONMENT_MISSING"
  | "CONFIG_SERVER_ENVIRONMENT_INVALID"
  | "CONFIG_SERVER_SITE_URL_INVALID"
  | "CONFIG_SERVER_DATABASE_URL_MISSING"
  | "CONFIG_SERVER_DATABASE_URL_INVALID"
  | "CONFIG_SERVER_SESSION_KEY_MISSING"
  | "CONFIG_SERVER_SESSION_KEY_INVALID";

export class ServerConfigurationError extends Error {
  readonly code: ServerConfigurationErrorCode;

  constructor(code: ServerConfigurationErrorCode) {
    super(
      `[${code}] Server environment configuration is invalid. ` +
        "Review .env.example; configuration values were not logged."
    );
    this.name = "ServerConfigurationError";
    this.code = code;
  }
}

export type SecretValue = Readonly<{
  reveal: () => string;
  toJSON: () => "[REDACTED]";
  toString: () => "[REDACTED]";
}>;

export type ServerConfig = Readonly<{
  deploymentEnvironment: DeploymentEnvironment;
  public: PublicConfig;
  databaseUrl?: SecretValue;
  sessionKey?: SecretValue;
}>;

type Environment = Readonly<Record<string, string | undefined>>;

function invalid(code: ServerConfigurationErrorCode): never {
  throw new ServerConfigurationError(code);
}

function secret(value: string): SecretValue {
  return Object.freeze({
    reveal: () => value,
    toJSON: () => "[REDACTED]" as const,
    toString: () => "[REDACTED]" as const,
  });
}

function parseDeploymentEnvironment(
  rawValue: string | undefined
): DeploymentEnvironment {
  const value = rawValue?.trim();
  if (!value) invalid("CONFIG_SERVER_ENVIRONMENT_MISSING");
  if (!DEPLOYMENT_ENVIRONMENTS.includes(value as DeploymentEnvironment)) {
    invalid("CONFIG_SERVER_ENVIRONMENT_INVALID");
  }
  return value as DeploymentEnvironment;
}

function parseDatabaseUrl(
  rawValue: string | undefined,
  required: boolean
): SecretValue | undefined {
  const value = rawValue;
  if (!value) {
    if (required) invalid("CONFIG_SERVER_DATABASE_URL_MISSING");
    return undefined;
  }

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return invalid("CONFIG_SERVER_DATABASE_URL_INVALID");
  }
  if (!["postgres:", "postgresql:"].includes(parsed.protocol)) {
    invalid("CONFIG_SERVER_DATABASE_URL_INVALID");
  }

  return secret(value);
}

function parseSessionKey(
  rawValue: string | undefined,
  required: boolean
): SecretValue | undefined {
  const value = rawValue;
  if (!value) {
    if (required) invalid("CONFIG_SERVER_SESSION_KEY_MISSING");
    return undefined;
  }
  if (value.length < 32) invalid("CONFIG_SERVER_SESSION_KEY_INVALID");
  return secret(value);
}

export function parseServerEnvironment(environment: Environment): ServerConfig {
  assertEnvironmentBoundary(environment);
  const deploymentEnvironment = parseDeploymentEnvironment(
    environment.VIBUCO_ENV
  );
  const requiresRuntimeServices = deploymentEnvironment !== "local";
  const publicConfig = parsePublicEnvironment(environment);
  if (
    requiresRuntimeServices &&
    new URL(publicConfig.siteUrl).protocol !== "https:"
  ) {
    invalid("CONFIG_SERVER_SITE_URL_INVALID");
  }

  return Object.freeze({
    deploymentEnvironment,
    public: publicConfig,
    databaseUrl: parseDatabaseUrl(
      environment.DATABASE_URL,
      requiresRuntimeServices
    ),
    sessionKey: parseSessionKey(
      environment.SESSION_KEY,
      requiresRuntimeServices
    ),
  });
}

export function getServerConfig(): ServerConfig {
  return parseServerEnvironment(process.env);
}

export function validateServerEnvironment(): void {
  getServerConfig();
}
