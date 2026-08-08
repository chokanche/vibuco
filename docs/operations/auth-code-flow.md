# Cognito code-flow authentication

Work item: `VIB-AUTH-001`  
Requirements: FR-006, FR-007, FR-009, SEC-001, SEC-002, SEC-006, MIG-005, MIG-006

## Configuration

The selected Cognito application client must permit only the exact callback
`https://<approved-host>/auth/callback`. Configure the server-only values in
the selected environment's secret store: `COGNITO_ISSUER`,
`COGNITO_CLIENT_ID`, `COGNITO_AUTHORIZATION_ENDPOINT`, and
`COGNITO_TOKEN_ENDPOINT`. `SESSION_KEY` must be independently managed per
environment and rotated under the security runbook. Do not put any of these
values in `NEXT_PUBLIC_*` variables.

The callback exchanges a code with its PKCE verifier, validates the token's
RS256 signature using the issuer JWKS, then validates issuer, audience, nonce,
subject, and expiry. It never returns an upstream token to the browser.

## Session and rollback

`__Host-vibuco-auth` holds a signed, ten-minute transaction and is consumed on
the callback. `__Host-vibuco-session` holds an encrypted, authenticated,
eight-hour server session and is rotated after every successful authentication.
Both are `HttpOnly`, `Secure`, `SameSite=Lax`, and host scoped.

Target code flow remains disabled until the server-evaluated `target_auth`
flag is configured with an Identity owner, purpose, expiry, and a false safe
default. Turn its global value off to return the pilot cohort to the legacy
flow immediately; preserve the Cognito user pool and do not mutate its users.

## Signals and failure behavior

Route completion telemetry carries only the request/trace IDs, route, outcome,
and stable auth error code. Callback failures clear the transaction cookie,
redirect to the sign-in error state, and never disclose token, state, or
identity details. Sign-out validates Origin when present, clears the local
session, and redirects to the public confirmation state.

## Rollback

Set `target_auth` global value to false and verify the legacy sign-in synthetic
journey. Existing target session cookies expire naturally or may be cleared by
sign-out; no database or Cognito mutation is required.
