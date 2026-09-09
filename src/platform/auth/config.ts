import "server-only";
import type { OidcConfiguration } from "./code-flow";

export class AuthConfigurationError extends Error {
  constructor() {
    super("[AUTH_CONFIGURATION_INVALID] Authentication configuration is invalid.");
    this.name = "AuthConfigurationError";
  }
}

function httpsUrl(value: string | undefined): string {
  try {
    const url = new URL(value ?? "");
    if (url.protocol !== "https:" || url.username || url.password || url.hash) throw new Error();
    return url.toString();
  } catch {
    throw new AuthConfigurationError();
  }
}

export function parseOidcConfiguration(environment: Readonly<Record<string, string | undefined>>): OidcConfiguration {
  const issuer = httpsUrl(environment.COGNITO_ISSUER).replace(/\/$/, "");
  const clientId = environment.COGNITO_CLIENT_ID?.trim();
  const siteUrl = httpsUrl(environment.NEXT_PUBLIC_SITE_URL).replace(/\/$/, "");
  if (!clientId || !/^[A-Za-z0-9_-]{8,128}$/.test(clientId)) throw new AuthConfigurationError();
  const redirectUri = `${siteUrl}/auth/callback`;
  const authorizationEndpoint = httpsUrl(environment.COGNITO_AUTHORIZATION_ENDPOINT ?? `${issuer}/oauth2/authorize`);
  const tokenEndpoint = httpsUrl(environment.COGNITO_TOKEN_ENDPOINT ?? `${issuer}/oauth2/token`);
  return Object.freeze({ authorizationEndpoint, tokenEndpoint, clientId, issuer, redirectUri });
}
