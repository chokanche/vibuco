# Testing, quality, and observability

## Test strategy

| Layer | Scope | Required examples |
| --- | --- | --- |
| Unit | Pure domain and UI state logic | lifecycle transitions, entitlement, presets, shuffle, locale fallback |
| Integration | Database, auth adapters, media, route handlers | publication transaction, authorization, idempotency, ETag |
| Contract | OpenAPI request/response/error shapes | sample/full decks, sessions, contact, health |
| E2E | Critical user and admin journeys | sample reveal, sign-in, full workspace, publish, rollback |
| Accessibility | Automated plus manual | axe, keyboard, zoom/reflow, screen reader, reduced motion |
| Visual regression | Stable component/page states | toolbar, grid, dialog, forms, admin validation |
| Performance | Route and API budgets | mobile public route, workspace load, image variants |
| Security | Static/dynamic/fuzz/negative tests | auth, IDOR, CSRF, XSS, upload, headers, rate limits |
| Migration | Source reconciliation and rollback | item counts, checksums, translations, deck membership |
| Synthetic | Production journeys | home, sample, sign-in redirect, entitled workspace, admin readiness |

## Characterization before replacement

Before changing legacy card behavior, capture tests for:

- anonymous public dataset behavior
- authenticated full dataset behavior
- face-up/down transitions
- show/hide prompt independence
- English/Serbian/Hungarian lookup
- randomization and card numbering
- route and redirect behavior

Tests should describe preserved behavior without freezing known accessibility, security, or copy defects.

## Quality gates

Pull request:

- specification validation
- formatting, lint, and strict type check
- unit/integration/contract tests
- changed-route E2E and axe tests
- build and bundle-budget check
- secret, dependency, and static security scans
- migration compatibility check when schema changes

Staging:

- full critical E2E matrix
- smoke and synthetic checks
- migration dry run
- visual regression review
- performance test
- rollback rehearsal for risky slices

Production:

- canary health and error/latency comparison
- synthetic sample and workspace checks
- post-deploy data and publication sanity
- automatic rollback thresholds

## Test data

Factories produce synthetic accounts, cards, translations, assets, decks, and sessions. Tests never copy production contact data or real authentication tokens. Test image fixtures have explicit repository-compatible licenses.

## Observability requirements in tests

Every critical integration test asserts:

- request ID propagation
- one expected structured completion event
- no secrets or prohibited fields
- metric outcome label
- error code and trace correlation on failure

## Flake policy

Quarantine is time-bounded, owned, and linked to a work item. A quarantined critical-path test blocks launch. Retries may diagnose infrastructure flake but cannot convert a consistently failing assertion into a pass.

## Coverage policy

Coverage is a guardrail, not the objective. New domain modules target at least 90% branch coverage; adapters and UI target at least 80% meaningful branch coverage. All security and domain invariants require explicit tests regardless of percentage.

## Production validation

Synthetic tests use dedicated non-human accounts and rights-cleared fixtures. They must not publish real content or send real contact email. See [observability and reliability](17-observability-reliability.md) for signals and alerts.
