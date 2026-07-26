# System architecture

## Architecture style

Vibuco is a TypeScript modular monolith on Next.js 16 App Router and Node.js 24 LTS. This baseline was current on 2026-07-26 and must be rechecked before implementation. The architecture deliberately avoids microservices, queues, a dedicated search engine, and AI.

The application is split into domain modules with server-only adapters. Server Components are the default rendering unit. Client Components are limited to workspace interaction, accessible dialogs, and local optimistic form behavior.

## System context

Actors:

- Visitor
- Entitled facilitator
- Editor/publisher/admin
- Product owner/support operator

External systems:

- Amazon Cognito for identity
- S3 for image objects
- Managed PostgreSQL for canonical product data
- CDN/image delivery layer
- Email delivery for contact notifications
- OpenTelemetry-compatible logs, metrics, and traces

See [target system context](../diagrams/target-system-context.mmd).

## Containers

| Container | Responsibility | Data access |
| --- | --- | --- |
| Web application | Routes, Server Components, client workspace island, route handlers | Through application services only |
| Domain/application layer | Use cases, invariants, authorization, DTO mapping | Repository interfaces |
| PostgreSQL | Accounts, entitlements, cards, translations, decks, sessions, audits | Server only |
| S3/CDN | Original and derived media | Signed or public sample variants |
| Cognito | Authentication and account lifecycle | OAuth/OIDC server flow |
| Telemetry backend | Logs, metrics, traces, alerts | Redacted structured telemetry |

## Module boundaries

```text
src/modules/identity
src/modules/library
src/modules/session
src/modules/content-operations
src/modules/support
src/platform/auth
src/platform/db
src/platform/media
src/platform/telemetry
src/app
```

Modules expose application services and DTOs. They do not import route handlers or React. Platform adapters implement module interfaces.

## Rendering and caching

- Marketing and legal pages: static generation or ISR, tagged revalidation after approved content release.
- Public sample: server-rendered current sample deck; public cache with versioned ETag.
- Workspace: dynamic authenticated Server Component shell, no shared user cache.
- Deck media: immutable versioned URLs with long CDN cache; protected variants use short-lived grants.
- Admin: dynamic, no public cache.
- Client workspace state: memory plus optional session storage for recovery; never local storage for tokens.

## Identity and authorization

Cognito remains the identity provider. The target replaces implicit token handling with authorization code plus PKCE. The server validates state, nonce, issuer, audience, and code exchange, then stores a minimal encrypted/signed session in `HttpOnly`, `Secure`, `SameSite=Lax` cookies.

Authorization is application-owned:

- Public sample requires no account.
- Full workspace requires active entitlement.
- Editor actions require role plus resource operation.
- Publish/rollback requires publisher or admin.
- Role and entitlement changes require admin.

No route trusts client claims without server validation.

## Media

Editors upload to a quarantine prefix through a short-lived signed grant. The server verifies metadata, checksum, decoded type, and size, then generates responsive variants and moves approved media into immutable versioned keys. Public sample variants may be CDN-public. Full-deck media uses signed delivery that does not expose S3 credentials.

## Data strategy

PostgreSQL is chosen because cards, translations, rights, immutable versions, entitlements, approvals, and audits are relational and constraint-heavy. Prisma provides the typed schema and migrations. DynamoDB remains read-only during shadow migration and is removed only after reconciliation and rollback expiry.

## Failure handling

- Every request has a request/trace ID.
- External calls have explicit timeout budgets.
- Reads may retry only transient idempotent failures with bounded jitter.
- Mutations use idempotency where specified and do not retry unknown outcomes blindly.
- A loaded workspace may continue with its immutable deck version if publication changes.
- Public pages remain available when identity or admin systems fail.
- Core deck failure uses a cached last-known-good published version only when its rights and withdrawal status remain valid.

## Environments

Local, preview, staging, and production are isolated. Production data and identity are never used in preview. Each environment has distinct database, buckets/prefixes, Cognito client, encryption keys, telemetry namespace, and outbound email sink.

## Deployment

Build once, promote the same immutable artifact. Database migrations run as an explicit pre-deploy job with compatibility checks. The application uses expand/migrate/contract schema changes. Traffic shifts through health-checked canary or provider equivalent. Provider selection is `HUMAN-DECISION-002`; the application must remain standard Node.js and PostgreSQL to avoid lock-in.

## Architecture diagrams

- [Target container architecture](../diagrams/target-container-architecture.mmd)
- [Core component architecture](../diagrams/core-component-architecture.mmd)
- [Main request sequence](../diagrams/main-request-sequence.mmd)
- [Deployment topology](../diagrams/deployment-topology.mmd)

## Major trade-offs

| Decision | Benefit | Cost / consequence |
| --- | --- | --- |
| Modular monolith | Simple deployment and transactions | Requires enforced module boundaries |
| PostgreSQL target | Strong constraints and content relationships | Data migration and new managed datastore |
| Retain Cognito | Lower account migration risk | Cognito UX/config remains a dependency |
| Server-side AWS access | Smaller client and stronger policy | More server runtime responsibility |
| Immutable deck versions | Reproducible sessions and rollback | Additional storage/model complexity |
| No client content capture | Strong privacy and trust | No notes/history feature |

Formal decisions are in [architecture decisions](13-architecture-decisions.md).
