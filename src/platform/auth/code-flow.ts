import "server-only";
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

export const AUTH_TRANSACTION_COOKIE = "__Host-vibuco-auth";
export const SESSION_COOKIE = "__Host-vibuco-session";
const AUTH_TRANSACTION_TTL_SECONDS = 10 * 60;
const SESSION_TTL_SECONDS = 8 * 60 * 60;

export type AuthErrorCode =
  | "AUTH_INVALID_RETURN_PATH"
  | "AUTH_TRANSACTION_INVALID"
  | "AUTH_TRANSACTION_EXPIRED"
  | "AUTH_STATE_INVALID"
  | "AUTH_CALLBACK_ERROR"
  | "AUTH_TOKEN_INVALID"
  | "AUTH_SESSION_INVALID"
  | "AUTH_SESSION_EXPIRED";

export class AuthError extends Error {
  readonly code: AuthErrorCode;

  constructor(code: AuthErrorCode) {
    super(code);
    this.name = "AuthError";
    this.code = code;
  }
}

export type OidcConfiguration = Readonly<{
  authorizationEndpoint: string;
  tokenEndpoint: string;
  clientId: string;
  issuer: string;
  redirectUri: string;
}>;

export type AuthTransaction = Readonly<{
  state: string;
  nonce: string;
  codeVerifier: string;
  returnTo: string;
  expiresAt: number;
}>;

export type VerifiedIdentity = Readonly<{
  subject: string;
  issuer: string;
  audience: string | readonly string[];
  nonce?: string;
  expiresAt: number;
}>;

export type Session = Readonly<{
  subject: string;
  issuedAt: number;
  expiresAt: number;
}>;

export type TokenExchange = (input: Readonly<{
  code: string;
  codeVerifier: string;
  redirectUri: string;
}>) => Promise<VerifiedIdentity>;

function base64Url(value: Uint8Array | string): string {
  return Buffer.from(value).toString("base64url");
}

function fromBase64Url(value: string): Buffer {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) throw new AuthError("AUTH_TOKEN_INVALID");
  return Buffer.from(value, "base64url");
}

function sign(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function signed(value: string, secret: string): string {
  return `${value}.${sign(value, secret)}`;
}

function verified(value: string, secret: string, invalidCode: AuthErrorCode): string {
  const separator = value.lastIndexOf(".");
  if (separator < 1) throw new AuthError(invalidCode);
  const payload = value.slice(0, separator);
  const signature = value.slice(separator + 1);
  const expected = sign(payload, secret);
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    throw new AuthError(invalidCode);
  }
  return payload;
}

function parseJson<T>(value: string, code: AuthErrorCode): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    throw new AuthError(code);
  }
}

export function safeReturnPath(value: string | null | undefined): string {
  if (!value) return "/cards";
  if (
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    /%2f|%5c/i.test(value)
  ) {
    throw new AuthError("AUTH_INVALID_RETURN_PATH");
  }
  const parsed = new URL(value, "https://vibuco.invalid");
  if (parsed.origin !== "https://vibuco.invalid" || parsed.pathname.startsWith("/auth/")) {
    throw new AuthError("AUTH_INVALID_RETURN_PATH");
  }
  return `${parsed.pathname}${parsed.search}`;
}

export function createAuthorizationRequest(
  configuration: OidcConfiguration,
  returnTo: string,
  now = Date.now()
): Readonly<{ url: string; transaction: AuthTransaction }> {
  const transaction: AuthTransaction = Object.freeze({
    state: base64Url(randomBytes(32)),
    nonce: base64Url(randomBytes(32)),
    codeVerifier: base64Url(randomBytes(48)),
    returnTo: safeReturnPath(returnTo),
    expiresAt: now + AUTH_TRANSACTION_TTL_SECONDS * 1000,
  });
  const url = new URL(configuration.authorizationEndpoint);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", configuration.clientId);
  url.searchParams.set("redirect_uri", configuration.redirectUri);
  url.searchParams.set("scope", "openid");
  url.searchParams.set("state", transaction.state);
  url.searchParams.set("nonce", transaction.nonce);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set(
    "code_challenge",
    createHash("sha256").update(transaction.codeVerifier).digest("base64url")
  );
  return Object.freeze({ url: url.toString(), transaction });
}

export function sealAuthTransaction(transaction: AuthTransaction, secret: string): string {
  return signed(base64Url(JSON.stringify(transaction)), secret);
}

export function openAuthTransaction(value: string, secret: string, now = Date.now()): AuthTransaction {
  const payload = verified(value, secret, "AUTH_TRANSACTION_INVALID");
  const transaction = parseJson<AuthTransaction>(fromBase64Url(payload).toString("utf8"), "AUTH_TRANSACTION_INVALID");
  if (!transaction.state || !transaction.nonce || !transaction.codeVerifier || !Number.isFinite(transaction.expiresAt)) {
    throw new AuthError("AUTH_TRANSACTION_INVALID");
  }
  if (transaction.expiresAt <= now) throw new AuthError("AUTH_TRANSACTION_EXPIRED");
  return Object.freeze({ ...transaction, returnTo: safeReturnPath(transaction.returnTo) });
}

export function validateCallback(
  transaction: AuthTransaction,
  callback: Readonly<{ state: string | null; code: string | null; error: string | null }>
): string {
  if (callback.error) throw new AuthError("AUTH_CALLBACK_ERROR");
  if (!callback.state || callback.state.length !== transaction.state.length || !timingSafeEqual(Buffer.from(callback.state), Buffer.from(transaction.state))) {
    throw new AuthError("AUTH_STATE_INVALID");
  }
  if (!callback.code || !/^[A-Za-z0-9._~-]{8,2048}$/.test(callback.code)) {
    throw new AuthError("AUTH_CALLBACK_ERROR");
  }
  return callback.code;
}

export function validateIdentity(
  identity: VerifiedIdentity,
  configuration: OidcConfiguration,
  transaction: AuthTransaction,
  now = Date.now()
): void {
  const audience = Array.isArray(identity.audience) ? identity.audience : [identity.audience];
  if (
    identity.issuer !== configuration.issuer ||
    !audience.includes(configuration.clientId) ||
    identity.nonce !== transaction.nonce ||
    !identity.subject ||
    identity.expiresAt <= now
  ) {
    throw new AuthError("AUTH_TOKEN_INVALID");
  }
}

function sessionKey(secret: string): Buffer {
  return createHash("sha256").update(secret).digest();
}

export function sealSession(subject: string, secret: string, now = Date.now()): string {
  if (!subject || subject.length > 256) throw new AuthError("AUTH_TOKEN_INVALID");
  const payload: Session = { subject, issuedAt: now, expiresAt: now + SESSION_TTL_SECONDS * 1000 };
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", sessionKey(secret), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(payload), "utf8"), cipher.final()]);
  return [base64Url(iv), base64Url(encrypted), base64Url(cipher.getAuthTag())].join(".");
}

export function openSession(value: string, secret: string, now = Date.now()): Session {
  const [ivValue, ciphertextValue, tagValue, ...rest] = value.split(".");
  if (rest.length || !ivValue || !ciphertextValue || !tagValue) throw new AuthError("AUTH_SESSION_INVALID");
  try {
    const decipher = createDecipheriv("aes-256-gcm", sessionKey(secret), fromBase64Url(ivValue));
    decipher.setAuthTag(fromBase64Url(tagValue));
    const payload = parseJson<Session>(Buffer.concat([decipher.update(fromBase64Url(ciphertextValue)), decipher.final()]).toString("utf8"), "AUTH_SESSION_INVALID");
    if (!payload.subject || !Number.isFinite(payload.issuedAt) || !Number.isFinite(payload.expiresAt)) throw new AuthError("AUTH_SESSION_INVALID");
    if (payload.expiresAt <= now) throw new AuthError("AUTH_SESSION_EXPIRED");
    return Object.freeze(payload);
  } catch (error) {
    if (error instanceof AuthError) throw error;
    throw new AuthError("AUTH_SESSION_INVALID");
  }
}

export const authCookieOptions = Object.freeze({ httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" });
export const authTransactionMaxAge = AUTH_TRANSACTION_TTL_SECONDS;
export const sessionMaxAge = SESSION_TTL_SECONDS;
