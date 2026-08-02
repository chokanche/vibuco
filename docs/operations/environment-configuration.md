# Environment configuration

Work item: `VIB-PLAT-002`
Requirements: SEC-004, SEC-011, OPS-005, OPS-006

## Typed boundary

Target code reads configuration through `src/platform/config/server.ts` or
`src/platform/config/public.ts`. Server code must not read target configuration
directly from `process.env`, and Client Components must not import the server
module.

`NEXT_PUBLIC_SITE_URL` is the complete public allowlist. It must be an HTTPS
origin without credentials, query, or fragment; local loopback HTTP is allowed.
Adding another `NEXT_PUBLIC_` key fails with `CONFIG_PUBLIC_UNKNOWN_KEY` until
the key receives a security review and is added deliberately to the typed
public schema and its bundle snapshot.

Server configuration contains `VIBUCO_ENV`, `DATABASE_URL`, and `SESSION_KEY`.
Database and session values are wrapped as redacting `SecretValue` objects.
They require the explicit `reveal()` operation for server adapter use and
serialize as `[REDACTED]`. Validation errors expose stable codes and never raw
configuration values.

## Environment matrix

| Environment | `VIBUCO_ENV` | Public origin | Database/session schema | Data and access policy |
| --- | --- | --- | --- | --- |
| Local | `local` | HTTPS or loopback HTTP | Optional until its adapter is enabled; validated when present | Seeded synthetic data; developer access |
| Preview | `preview` | HTTPS | Required | Ephemeral synthetic resources; no production credentials or personal data |
| Staging | `staging` | HTTPS | Required | Production-shaped synthetic resources; team access |
| Production | `production` | HTTPS | Required | Real isolated resources; least-privilege access |

Each non-local environment supplies its own database URL and session key from
the selected platform's secret manager. Identity, media, email, and telemetry
adapters extend the server schema in their owning work items; they must follow
the same isolation rules and cannot expand the public allowlist implicitly.

## Startup and operations

Call `getServerConfig()` at a server startup boundary before enabling a target
runtime path. A failure is safe to emit as its `code`, for example
`CONFIG_SERVER_DATABASE_URL_MISSING`; do not log the raw environment, error
input, or revealed secret. Local development starts from `.env.example`.

The legacy Pages Router variables remain temporarily documented in
`.env.example` because the migration still supports the existing browser path.
They are outside the target typed contract and are removed with the legacy
identity/media boundary under MIG-011.

## Rollback

This work does not enable a target route or mutate any environment. Reverting
the configuration modules and this document returns to the VIB-PLAT-001 shell;
the legacy build variables and static artifact remain unchanged.
