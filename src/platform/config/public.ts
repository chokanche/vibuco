export const PUBLIC_ENVIRONMENT_KEYS = ["NEXT_PUBLIC_SITE_URL"] as const;

export type PublicEnvironmentKey = (typeof PUBLIC_ENVIRONMENT_KEYS)[number];

export type PublicConfig = Readonly<{
  siteUrl: string;
}>;

export type PublicConfigurationErrorCode =
  | "CONFIG_PUBLIC_UNKNOWN_KEY"
  | "CONFIG_PUBLIC_SITE_URL_MISSING"
  | "CONFIG_PUBLIC_SITE_URL_INVALID";

export class PublicConfigurationError extends Error {
  readonly code: PublicConfigurationErrorCode;

  constructor(code: PublicConfigurationErrorCode) {
    super(
      `[${code}] Public environment configuration is invalid. ` +
        "Review .env.example; configuration values were not logged."
    );
    this.name = "PublicConfigurationError";
    this.code = code;
  }
}

type Environment = Readonly<Record<string, string | undefined>>;

function invalid(code: PublicConfigurationErrorCode): never {
  throw new PublicConfigurationError(code);
}

function parseSiteUrl(rawValue: string | undefined): string {
  const value = rawValue?.trim();
  if (!value) invalid("CONFIG_PUBLIC_SITE_URL_MISSING");

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return invalid("CONFIG_PUBLIC_SITE_URL_INVALID");
  }

  const isLocalHttp =
    parsed.protocol === "http:" &&
    ["localhost", "127.0.0.1", "[::1]"].includes(parsed.hostname);
  if (parsed.protocol !== "https:" && !isLocalHttp) {
    invalid("CONFIG_PUBLIC_SITE_URL_INVALID");
  }

  if (
    parsed.username ||
    parsed.password ||
    parsed.pathname !== "/" ||
    parsed.search ||
    parsed.hash
  ) {
    invalid("CONFIG_PUBLIC_SITE_URL_INVALID");
  }

  return parsed.origin;
}

export function parsePublicEnvironment(environment: Environment): PublicConfig {
  const unknownPublicKey = Object.keys(environment).some(
    (key) =>
      key.startsWith("NEXT_PUBLIC_") &&
      !PUBLIC_ENVIRONMENT_KEYS.includes(key as PublicEnvironmentKey)
  );
  if (unknownPublicKey) invalid("CONFIG_PUBLIC_UNKNOWN_KEY");

  return Object.freeze({
    siteUrl: parseSiteUrl(environment.NEXT_PUBLIC_SITE_URL),
  });
}

export function getPublicConfig(): PublicConfig {
  return parsePublicEnvironment({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  });
}
