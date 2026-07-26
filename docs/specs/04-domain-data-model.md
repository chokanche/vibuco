# Domain and data model

## Bounded contexts

- Identity and access: account linkage, roles, entitlements.
- Library: cards, translations, assets, themes, decks, immutable deck versions.
- Session: transient facilitator workspace state and allowlisted events.
- Content operations: drafts, approvals, publication, rollback, audit.
- Support: contact submissions and retention.

## Core entities

| Entity | Purpose | Ownership | Sensitive |
| --- | --- | --- | --- |
| UserAccount | Links a Cognito subject to Vibuco preferences | Identity | Email is not stored in v1 |
| RoleAssignment | Grants `editor`, `publisher`, or `admin` | Identity | Security-sensitive |
| Entitlement | Grants full workspace access for a time/state | Identity | Security-sensitive |
| Asset | Rights-cleared image metadata and object key | Library | Rights evidence may be private |
| Card | Stable visual prompt identity and lifecycle | Library | No |
| CardTranslation | Locale-specific prompt and alt text | Library | No |
| Theme | Controlled classification | Library | No |
| Deck | Stable collection identity | Library | No |
| DeckVersion | Immutable published snapshot | Library | No |
| DeckVersionCard | Ordered card membership in a snapshot | Library | No |
| WorkspaceSession | Short-lived use of one deck version and seed | Session | Pseudonymous actor ID |
| SessionEvent | Allowlisted product event | Session | No free text |
| ContentRevision | Immutable draft/publication payload reference | Operations | Actor ID |
| AuditEvent | Administrative action history | Operations | Actor ID |
| ContactSubmission | Support request | Support | Email/name/message |

## Lifecycle

Card: `draft -> in_review -> approved -> published -> archived`
Asset rights: `pending -> approved | rejected | expired`
Translation: `draft -> in_review -> approved -> superseded`
Entitlement: `pending -> active -> suspended | expired | revoked`
Deck version: `draft -> validating -> published -> superseded | withdrawn`

Only the content-operations service may transition publication states. Direct database edits are prohibited.

## Data requirements

| ID | Requirement | Verification |
| --- | --- | --- |
| DATA-001 | All persisted entities use opaque UUIDs and UTC timestamps. | Schema inspection |
| DATA-002 | Cognito subject is unique and stored separately from product preferences. | Unique-constraint test |
| DATA-003 | Role and entitlement checks use server-side records with explicit status and validity. | Repository tests |
| DATA-004 | Card identity is stable across translations, assets, and deck versions. | Foreign-key tests |
| DATA-005 | Translation uniqueness is `(card_id, locale, revision)`, with one approved current translation per locale. | Constraint/domain tests |
| DATA-006 | Published deck versions and membership are immutable. | Mutation rejection test |
| DATA-007 | Every asset stores checksum, object key, media type, dimensions, provenance, rights status, and alt-text status. | Publication test |
| DATA-008 | Asset object keys are private implementation data and never returned directly to unauthorized clients. | DTO contract test |
| DATA-009 | Workspace sessions store no client identity or coaching free text. | Schema/event allowlist test |
| DATA-010 | Session events are limited to enumerated types and JSON metadata validated per event type. | Validation test |
| DATA-011 | Contact submissions are encrypted at rest, access-restricted, and deleted after the approved retention period. | Retention/security test |
| DATA-012 | Administrative changes append immutable audit records. | Integration test |
| DATA-013 | Soft deletion is not used for immutable publications or audit records; they are superseded or retained. | Repository test |
| DATA-014 | Hard deletion of user accounts anonymizes actor references while retaining required security audit evidence. | Deletion workflow test |
| DATA-015 | Migration records preserve source table/key and import checksum until reconciliation is complete. | Migration test |

## Deletion and retention

| Data | Target retention |
| --- | --- |
| Workspace session | 30 days |
| Session events | 30 days, aggregated metrics may outlive raw events |
| Contact submission | `HUMAN-DECISION-004`, proposed 180 days |
| Security audit event | Proposed 365 days, subject to legal approval |
| Published content revisions | Product lifetime plus backup window |
| Rejected upload binary | 7 days |
| Backups | 35 days |

The final legal retention values require approval. Implementation must use configuration with upper bounds and documented deletion jobs.

## Existing-to-target mapping

| Existing | Target | Treatment |
| --- | --- | --- |
| `vibuco-photos-public` item | Card + translation + asset + sample deck membership | Import and reconcile |
| `vibuco-photos` item | Card + translations + asset + full deck membership | Import and reconcile |
| `src` S3 URI/static filename | Asset object key and checksum | Normalize, never preserve URL as identity |
| `txt` string | English public translation | Preserve after editorial review |
| `txt.en` | English translation | Preserve after review |
| `txt.srb` | `sr-Latn` translation | Preserve and professionally review |
| `txt.hu` | Hungarian translation | Preserve and professionally review |
| `width`, `height` | Asset dimensions | Verify against decoded image |
| Table scan order | None | Do not preserve; deck order is explicit |

The executable reference is [reference-schema.prisma](../data/reference-schema.prisma), with fields explained in [the data dictionary](../data/data-dictionary.md).

## Model diagram

See [data model overview](../diagrams/data-model-overview.mmd).
