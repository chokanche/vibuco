# Architecture decisions

## ADR-001: Modular monolith

Status: Accepted for target specification.

Context: Vibuco is a small product with tightly coupled content, entitlement, session, and publication transactions.
Decision: one deployable Next.js application with enforced modules.
Alternatives: microservices; separate frontend/API repositories.
Rationale: lowest operational cost and simplest consistency model.
Trade-off: module boundaries require lint/review enforcement.
Migration: introduce modules behind existing routes.
Reversal difficulty: medium.

## ADR-002: Next.js App Router, TypeScript, Node.js 24 LTS

Status: Accepted, version check required at implementation.

Context: current Next.js 9/React 16 stack is obsolete.
Decision: migrate incrementally to Next.js 16 App Router with strict TypeScript on Node.js 24 LTS.
Alternatives: upgrade Pages Router only; full new repository.
Rationale: supported platform, server/client boundaries, route coexistence.
Trade-off: large framework gap and training cost.
Migration: App Router and Pages Router coexist route by route.
Reversal difficulty: high after most routes migrate.

## ADR-003: PostgreSQL and Prisma as canonical target

Status: Accepted subject to provider approval.

Context: publication, translations, rights, entitlements, immutable versions, and audits require relationships and constraints.
Decision: managed PostgreSQL with Prisma schema/migrations.
Alternatives: retain DynamoDB; document database.
Rationale: clearer invariants and operational querying.
Trade-off: new datastore and migration.
Migration: repeatable import, shadow read, reversible cutover.
Reversal difficulty: high.

## ADR-004: Retain Cognito, change protocol boundary

Status: Accepted.

Context: existing accounts and user pool have value; current implicit/browser integration is weak.
Decision: retain Cognito and use authorization code with PKCE plus server session.
Alternatives: new identity vendor; custom auth.
Rationale: reduces account migration risk without retaining client credential exposure.
Trade-off: Cognito configuration remains.
Migration: flagged cohort pilot and rollback.
Reversal difficulty: medium.

## ADR-005: Server-only data and AWS access

Status: Accepted.

Context: current browser uses AWS SDK, federated credentials, scans, and S3 object reads.
Decision: all privileged data/media operations occur server-side.
Alternatives: tighter client IAM; GraphQL client gateway.
Rationale: smaller client, stronger authorization, better observability.
Trade-off: more server runtime load.
Migration: server adapter first, then revoke client policy.
Reversal difficulty: low.

## ADR-006: Immutable published deck versions

Status: Accepted.

Context: sessions must remain stable while editors change content.
Decision: publication creates immutable deck snapshots; active pointer changes atomically.
Alternatives: query mutable current card records.
Rationale: reproducibility, cacheability, rollback.
Trade-off: version storage and publishing logic.
Migration: first import becomes version 1 after approval.
Reversal difficulty: medium.

## ADR-007: No coaching-content persistence

Status: Accepted.

Context: reflections can be sensitive and are not needed for the core interaction.
Decision: store no client identity, answer, note, recording, or transcript.
Alternatives: session notes/history.
Rationale: trust, privacy, and reduced regulatory burden.
Trade-off: no continuity/CRM feature.
Migration: telemetry allowlist and schema prohibition.
Reversal difficulty: high because later collection changes product trust.

## ADR-008: No external search engine or queue in v1

Status: Accepted.

Context: curated deck is small and workflows are synchronous.
Decision: PostgreSQL/filtering and synchronous publication, with platform jobs only for bounded media processing/retention.
Alternatives: Elasticsearch/OpenSearch; durable event bus.
Rationale: demonstrated needs do not justify operational cost.
Trade-off: revisit if scale thresholds are crossed.
Migration: none.
Reversal difficulty: low.

## ADR-009: Provider-neutral application with managed runtime

Status: Proposed, `HUMAN-DECISION-002`.

Context: current hosting is undocumented and target needs Node, Postgres, S3/CDN, secrets, canary, and telemetry.
Decision: use a managed Node.js hosting provider selected by cost/security review; keep application contracts provider-neutral.
Alternatives: Vercel, Netlify, AWS managed hosting, self-managed containers.
Rationale: avoids an unsupported assumption in the specification.
Trade-off: exact infrastructure tasks wait for approval.
Migration: deploy staging before DNS cutover.
Reversal difficulty: medium.

## ADR-010: Privacy-safe first-party analytics events

Status: Accepted.

Context: product success is unmeasured, but coaching context is sensitive.
Decision: allowlisted server-received events with opaque identifiers and no free text.
Alternatives: no analytics; broad third-party session replay.
Rationale: enough product evidence without replay/privacy cost.
Trade-off: less granular behavior analysis.
Migration: start after event privacy tests.
Reversal difficulty: low.

## Decision protocol

New decisions use this structure: context, decision, alternatives, rationale, trade-offs, consequences, migration, reversal difficulty, owner, and approval date. A decision that changes product scope, vendors, identity, data collection, or irreversible migration requires human approval.
