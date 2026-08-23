import "server-only";
import { createPublicKey, verify } from "node:crypto";
import type { OidcConfiguration, TokenExchange, VerifiedIdentity } from "./code-flow";

const EXTERNAL_REQUEST_TIMEOUT_MS = 5_000;

function externalRequest(url: string, init: RequestInit = {}): Promise<Response> {
  return fetch(url, { ...init, signal: AbortSignal.timeout(EXTERNAL_REQUEST_TIMEOUT_MS) });
}

type JsonWebKey = Readonly<{ kty: string; kid?: string; use?: string; alg?: string; n?: string; e?: string }>;
type JwtHeader = Readonly<{ alg: string; kid?: string }>;
type JwtPayload = Readonly<{ sub?: string; iss?: string; aud?: string | string[]; nonce?: string; exp?: number }>;

function decodeSegment<T>(segment: string): T {
  if (!/^[A-Za-z0-9_-]+$/.test(segment)) throw new Error("invalid JWT");
  return JSON.parse(Buffer.from(segment, "base64url").toString("utf8")) as T;
}

export function createCognitoTokenExchange(configuration: OidcConfiguration): TokenExchange {
  return async ({ code, codeVerifier, redirectUri }) => {
    if (redirectUri !== configuration.redirectUri) throw new Error("redirect URI mismatch");
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: configuration.clientId,
      code,
      code_verifier: codeVerifier,
      redirect_uri: redirectUri,
    });
    const response = await externalRequest(configuration.tokenEndpoint, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded", accept: "application/json" },
      body,
      cache: "no-store",
    });
    if (!response.ok) throw new Error("token exchange failed");
    const tokenResponse = (await response.json()) as { id_token?: unknown };
    if (typeof tokenResponse.id_token !== "string") throw new Error("missing ID token");
    return verifyCognitoIdToken(tokenResponse.id_token, configuration);
  };
}

export async function verifyCognitoIdToken(token: string, configuration: OidcConfiguration): Promise<VerifiedIdentity> {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("invalid JWT");
  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const header = decodeSegment<JwtHeader>(encodedHeader);
  const payload = decodeSegment<JwtPayload>(encodedPayload);
  if (header.alg !== "RS256" || !header.kid) throw new Error("unsupported JWT");
  const jwksResponse = await externalRequest(`${configuration.issuer}/.well-known/jwks.json`, { cache: "no-store" });
  if (!jwksResponse.ok) throw new Error("JWKS unavailable");
  const jwks = (await jwksResponse.json()) as { keys?: JsonWebKey[] };
  const key = jwks.keys?.find((candidate) => candidate.kid === header.kid && candidate.kty === "RSA" && candidate.use === "sig");
  if (!key) throw new Error("JWT key unavailable");
  const validSignature = verify(
    "RSA-SHA256",
    Buffer.from(`${encodedHeader}.${encodedPayload}`),
    createPublicKey({ key, format: "jwk" }),
    Buffer.from(encodedSignature, "base64url")
  );
  if (!validSignature || !payload.sub || !payload.iss || !payload.aud || !payload.exp) throw new Error("invalid JWT");
  return Object.freeze({
    subject: payload.sub,
    issuer: payload.iss,
    audience: payload.aud,
    ...(payload.nonce ? { nonce: payload.nonce } : {}),
    expiresAt: payload.exp * 1000,
  });
}
