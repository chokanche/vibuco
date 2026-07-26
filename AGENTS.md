# Coding agent contract

This file is mandatory for every human or AI agent changing Vibuco.

## Required reading

Before accepting work, read in order:

1. `README.md`
2. `AGENTS.md`
3. `docs/specs/00-product-charter.md`
4. `docs/specs/01-functional-requirements.md`
5. The work item's referenced specifications
6. `docs/specs/10-testing-quality-observability.md`
7. `docs/specs/11-migration-and-redesign-plan.md`
8. `docs/implementation/MASTER_IMPLEMENTATION_PLAN.md`

For data or API changes, also read `docs/data/data-dictionary.md`, `docs/data/reference-schema.prisma`, and `docs/api/openapi.yaml`.

## Source of truth

Use the hierarchy in `README.md`. Legacy code proves current behavior, but does not override an explicit target requirement. Do not invent business rules, prices, retention periods, user roles, or new vendors. Mark unresolved choices as `HUMAN-DECISION` and stop before a one-way-door implementation.

## Work-item protocol

1. Select exactly one ready item from `docs/backlog/implementation-work-items.yaml`.
2. Verify every dependency is complete.
3. Create the specified branch name.
4. Restate scope, files, acceptance criteria, risks, and validation before editing.
5. Keep the change within the task boundary.
6. Update requirement mappings when behavior changes.
7. Run all required checks.
8. Hand off using the format below.

Do not change a task to `done` until its acceptance criteria and required tests pass.

## Parallel ownership

- One agent owns a work item and its listed likely files at a time.
- Do not edit high-conflict files without ownership: `package.json`, lockfile, root layouts, global tokens, Prisma schema, auth configuration, OpenAPI, CI workflows, and migration scripts.
- Schema and API contract changes land before dependent consumers.
- Agents may add isolated tests beside owned modules.
- Rebase before handoff. Resolve semantic conflicts against the specifications, not by keeping both implementations.

## Engineering conventions

- Target code is strict TypeScript. Avoid `any`; justify narrow exceptions.
- Use Server Components by default. Add `"use client"` only to the smallest interactive boundary.
- Keep domain logic independent from React, transport, database, and AWS SDK types.
- Validate all untrusted input at the server boundary.
- Return domain/API DTOs, never raw database records.
- Use UTC timestamps and opaque IDs. Do not expose sequential database identifiers.
- Keep modules inside the boundaries defined in `docs/specs/05-system-architecture.md`.
- Do not add microservices, queues, AI, search engines, analytics vendors, or UI libraries without an approved architecture decision.

## UI conventions

- Use the tokens and component contracts in `docs/specs/15-design-system-interaction.md`.
- Meet WCAG 2.2 AA.
- Every interaction must work with keyboard and screen reader.
- Dialogs must trap focus, close with Escape, restore focus, and have an accessible name.
- Honor `prefers-reduced-motion`.
- Provide loading, empty, error, stale, unavailable, and permission states.
- Never block scrolling for decorative animation.
- Do not introduce client-visible copy without updating the relevant page contract.

## Testing and quality

- Unit-test domain rules and deterministic shuffle/filter behavior.
- Integration-test repositories, authorization, and route handlers.
- Contract-test OpenAPI responses and error envelopes.
- End-to-end-test public sample, sign-in, workspace controls, and admin publication.
- Run automated accessibility checks on every target route.
- No merge with failing build, type check, lint, tests, spec validation, dependency scan, or migration check.

## Security and privacy

- Privileged credentials and AWS SDK calls are server-only.
- Deny access by default and verify authorization on every protected operation.
- Do not log tokens, cookies, email addresses, coaching content, or asset URLs containing signatures.
- Vibuco v1 must not collect client names, session notes, answers, recordings, or transcripts.
- Use short-lived upload/download grants and validate MIME type, size, extension, and decoded media.
- Rate-limit authentication-adjacent, contact, session-event, and admin mutations.

## Observability

- Emit structured events with request ID, trace ID, route, outcome, duration, and non-sensitive actor classification.
- Use metric names and SLOs defined in `docs/specs/17-observability-reliability.md`.
- New critical paths need a dashboard signal, actionable alert, and runbook link.
- Logs must distinguish expected user errors from system faults.

## Documentation

Update authoritative requirements, contracts, diagrams, and work-item mappings in the same pull request as behavior changes. Do not duplicate a requirement under a new ID. Add an architecture decision when changing a major approved decision.

## Handoff format

```text
Work item:
Requirements:
Files changed:
Behavior delivered:
Tests and checks:
Observability:
Security/privacy:
Known limitations:
Follow-up work:
```
