# VIB-AUTH-001 closeout and successor readiness

Evidence reviewed: 2026-09-17

This record prepares `VIB-AUTH-001` for closeout without enabling target
authentication or provisioning infrastructure. The work item remains
`in_progress` until the post-merge review fixes pass and a valid successor is
promoted to `ready` or is claimed as `in_progress` in the same backlog
transition.

## Pull-request evidence

PR #28 merged commit `1dedfaf` through merge commit `673e92a`. Baseline CI,
Netlify deploy preview, header rules, and redirect rules passed for immutable
preview deploy `6aa302a417fc32000822c782`; the Netlify pages-changed check was
neutral. The preview served the required anonymous routes and proved that
unconfigured target auth fails off to the legacy entry without requiring
database, Cognito, or session secrets.

Two actionable comments arrived after the merge:

- a globally disabled or expired target-auth flag could still load target-only
  runtime configuration before failing off
- an unsafe `returnTo` on the fail-off path could be reported as an internal
  server error instead of `AUTH_START_INVALID`

The scoped follow-up must merge before closeout. Its regression coverage must
prove both behaviors without creating hosted secrets.

## Acceptance and rollback evidence

| Requirement | Evidence | Closeout state |
| --- | --- | --- |
| State, nonce, PKCE, issuer, audience, and exact redirect validation | `code-flow.ts`, `config.ts`, and `cognito.ts`; synthetic signed-token, tamper, replay, state, nonce, audience/issuer code paths, expiry, PKCE, and redirect assertions | Implemented; automated checks pass on the follow-up head |
| Secure host cookie is rotated and time-bounded | `__Host-vibuco-auth` is signed for ten minutes; `__Host-vibuco-session` is freshly AES-GCM sealed for eight hours after successful validation; both use `HttpOnly`, `Secure`, `SameSite=Lax`, path `/`, and no `Domain` | Implemented; target-enabled browser header rehearsal remains a staging gate, not permission to add preview secrets |
| Flagged accounts can roll back to legacy auth | Server-issued pilot grant permits cohort bootstrap; missing, malformed, expired, unusable, or globally-off target-auth configuration redirects to `/login`; the legacy login invokes the retained Cognito hosted flow | Implemented; fail-off route regressions pass on the follow-up head |
| Integration, tamper, replay, expiry, sign-out, and rollback tests | Platform tests cover signed token exchange, transaction/session validation, callback limiting, pilot rollout, fail-off, and safe return paths; route/build checks cover the auth route manifests | Automated evidence is green locally; enabled staging auth and sign-out rehearsal are required before a pilot |
| Auth signals and safe errors | Auth routes use request instrumentation, bounded auth error codes, request/trace correlation, and no token or subject fields | Implemented; provider dashboards and alerts wait for the selected operational telemetry adapter |
| Accessible recovery | `/sign-in` announces generic error and signed-out states; return paths are constrained and protected routes deny by default | Implemented; full browser accessibility rehearsal remains a staging gate |

Rollback changes only the server-owned `target_auth` flag. Set its global value
to `false`, verify `/auth/sign-in?returnTo=%2Fcards` redirects to
`/login?returnTo=%2Fcards`, and run the legacy sign-in synthetic. Existing target
sessions expire naturally within eight hours or are cleared by sign-out. No
Cognito user, database record, DNS record, or production artifact must change.

Before a target-auth pilot, the product owner must name the Identity operator
who may change `AUTH_TARGET_FLAG`, the rollback operator, and the maximum
rollback decision time. Marko's Netlify project ownership proves platform
access but does not by itself record authorization to activate target auth for
users.

## HUMAN-DECISION-002 decision brief

The smallest runtime decision is to approve the existing Netlify project as
the managed Next.js/Node runtime while preserving provider-neutral application
and domain contracts. A broader runtime comparison is unnecessary: the
existing provider has already demonstrated server routes, middleware, deploy
previews, redirects, headers, and rollback to immutable deploys without a
hosting migration.

Netlify is approved for the application runtime. PR #29 records Marko as
decision owner and approver on 2026-09-10. The approval is intentionally
limited to the managed Next.js/Node runtime.

Trade-offs and boundaries:

- Netlify-specific build and routing configuration may exist only at the
  hosting boundary; Node.js and application contracts remain portable.
- Approval does not select PostgreSQL (`HUMAN-DECISION-006`), approve an
  operational telemetry backend (`HUMAN-DECISION-007`), establish a cost cap
  (`HUMAN-DECISION-008`), approve production activation, change DNS, or create
  secrets.
- A staging environment must validate the same immutable artifact, isolated
  identity/data/media/secrets, auth rollback, telemetry, and provider-equivalent
  progressive delivery before production activation.
- Runtime rollback promotes the prior known-good immutable Netlify deploy and
  leaves provider-neutral application/data contracts intact. DNS remains
  unchanged unless separately approved.

## VIB-DATA-001 readiness

`VIB-DATA-001` must remain `planned`. Its code dependencies are complete, but
its Definition of Ready is not.

Required non-production environment:

- one dedicated managed PostgreSQL staging environment, isolated from
  production and from pull-request previews
- standard PostgreSQL compatible with the reviewed Prisma schema, encrypted
  connections, encrypted storage/backups, and connectivity only from approved
  server-side application and migration jobs
- production-shaped synthetic data only; no production identity, contact, or
  coaching data
- separate least-privilege runtime and migration credentials, an environment
  scoped telemetry namespace, and no browser-visible database configuration

Required ownership and access:

- Product owner: approve the managed PostgreSQL provider, region/data-residency
  choice, budget/cost guardrail, and staging creation.
- Named Data/Infrastructure owner: provision staging, own provider
  configuration, migration execution, incident response, and deletion.
- Named secret administrator: place credentials in the selected platform's
  staging secret manager and expose them only to server runtime and explicit
  migration jobs. Pull-request previews and client bundles receive no staging
  database secret.
- Named backup/restore operator: configure and rehearse recovery and record the
  restore evidence.

Backup, migration, and rollback prerequisites:

- point-in-time recovery plus the documented 35-day backup target, encrypted
  at rest, with daily backup validation
- a successful restore into a fresh non-production environment before any
  production database approval
- reviewed additive first migration, schema/constraint/index validation, and
  expand/migrate/contract compatibility checks in CI
- separate resumable migration execution with duration/failure signals and no
  migration hidden inside application request startup
- a pre-migration recovery point, an application rollback compatible with the
  additive schema, and explicit approval before any destructive contraction

Open access requests:

| Request | Owner or escalation target | Required approval/access | Unblock condition |
| --- | --- | --- | --- |
| `ACCESS-VIB-DATA-001-001` | Product owner | Select managed PostgreSQL provider, region, staging budget, and cost alert | Provider decision and approval date are recorded under `HUMAN-DECISION-006`/ADR-003 |
| `ACCESS-VIB-DATA-001-002` | Product owner to name Data/Infrastructure owner | Staging project/database administration and least-privilege role creation | Named owner accepts provisioning, migration, incident, and deletion duties |
| `ACCESS-VIB-DATA-001-003` | Product owner to name secret and restore operators | Staging secret-manager write plus backup/PITR configuration and restore execution | Secret boundary is configured and a fresh-environment restore is evidenced |

The database-provider approval is the provider decision that must happen
before `VIB-DATA-001` may become `ready`; Netlify runtime approval alone does
not satisfy it.

## Recommended single successor

Promote `VIB-WS-001` (workspace state machine and seeded shuffle) to `ready`
when closing `VIB-AUTH-001`. Its only dependency, `VIB-STAB-004`, is done; its
specifications and deterministic acceptance tests resolve; its files are an
isolated session-domain boundary; and it needs no provider, secret, production
access, or unresolved human product decision.

Required human action: the product owner/TPM confirms `VIB-WS-001` as the next
work item and assigns its Workspace owner. After the auth review-fix PR passes
and merges, one status commit may set `VIB-AUTH-001` to `done` and
`VIB-WS-001` to `ready`. Do not start `VIB-DATA-001` as part of that transition.


## 2026-10-05 readiness update

Marko requested incident closure, a separate database approval, and continuation
of one eligible redesign item. The implementing Workspace agent owns
`VIB-WS-001`; its dependency and specification/test-fixture gates were verified
and it was claimed on its specified branch. This authorization satisfies the
successor selection gate above.

`HUMAN-DECISION-006` remains pending. The request to approve a database does not
identify a provider, region, budget or responsible operators. The approval brief
and `ACCESS-VIB-DATA-001-001` through `003` above remain the concrete unblock
checklist. No provider approval is inferred from Netlify hosting approval;
`VIB-DATA-001` stays `planned` until those decisions are recorded. No staging
resource or database credentials were created by this workspace slice.
