# Data dictionary

The executable target model is [reference-schema.prisma](reference-schema.prisma). This dictionary explains semantic and privacy constraints that schema types alone cannot express.

## Global conventions

- IDs are UUIDs serialized as opaque strings.
- Timestamps are UTC with timezone.
- Locale uses constrained BCP 47 values: `en`, `sr-Latn`, `hu`.
- JSON fields accept only schema-validated bounded keys.
- Database field names are internal and never direct API contracts.
- Actor references are Vibuco account IDs, not Cognito subjects in general domain tables.

## Identity

### `user_accounts`

| Field | Meaning | Rules |
| --- | --- | --- |
| `id` | Product account identity | Opaque, immutable |
| `cognito_subject` | OIDC subject | Unique, server-only |
| `status` | Account lifecycle | Deleted account cannot authenticate |
| `preferred_locale` | Workspace prompt preference | Approved locale only |
| `deleted_at` | Deletion completion | Actor references may be anonymized |

Email is deliberately absent. Current email is obtained only when a workflow has an approved need and is not copied into telemetry.

### `role_assignments`

One row per account/role. `revoked_at` makes an assignment inactive. Role claims in a token do not replace this record.

### `entitlements`

Grants full-workspace access. Active means status is `ACTIVE`, `valid_from <= now`, and `valid_until` is null or in the future. `source` is an approved bounded value such as `manual_invite`; it is not payment data.

## Library

### `assets`

| Field | Meaning | Rules |
| --- | --- | --- |
| `object_key` | Private storage identity | Never sent as a client DTO |
| `sha256` | Decoded approved original checksum | Unique |
| `media_type` | Verified decoded type | Not browser-declared type |
| `width`, `height`, `byte_size` | Verified media properties | Positive bounded values |
| `source_type` | Owned/commissioned/licensed/open-license | Controlled vocabulary |
| `source_url` | Original evidence URL | Private admin field |
| `creator_name` | Required credit/provenance | Optional only with reason |
| `license_name` | License/consent descriptor | Required for approval |
| `rights_evidence_object_key` | Private evidence object | Admin-authorized only |
| `rights_status` | Publication eligibility | Must be approved and unexpired |

Derived variants are represented by deterministic object-key convention or a future child table if multiple processors are needed.

### `cards`

Stable conceptual card. `display_asset_id` identifies its visual. Status controls draft/publication eligibility but deck publication is determined by immutable version membership.

### `card_translations`

`prompt` and `alt_text` are plain text. Revision increments per card/locale. The domain service enforces one current approved revision. Source and reviewer attribution can move to a dedicated review entity if workflow complexity grows.

### `themes` and `card_themes`

Small controlled taxonomy for facilitator filtering, not public SEO pages. Theme labels are editorial.

### `decks`, `deck_versions`, `deck_version_cards`

Deck is stable identity. Deck version is immutable after publication. `required_locales` is snapshotted. Membership has explicit unique position. `active_version_id` changes atomically on publish/rollback.

## Session

### `workspace_sessions`

Represents technical/product use of one immutable deck version. Anonymous sample has null `account_id`. Seed is random/opaque. It does not store selected answers, participant details, or coaching notes.

### `session_events`

Sequence is monotonic within a session and enables idempotent batches. Metadata examples:

- `CARD_REVEALED`: `{ "cardId": "<uuid>" }`
- `PRESET_SELECTED`: `{ "preset": "OPEN_REFLECTION" }`
- `ORIENTATION_CHANGED`: `{ "orientation": "FACE_DOWN" }`
- `WORKSPACE_ERROR`: `{ "code": "DECK_UNAVAILABLE" }`

No arbitrary keys or free text are allowed.

## Operations

### `content_revisions`

Immutable snapshot used for review/audit, not as the primary query model. Snapshot must be redacted of signed URLs and secret configuration.

### `audit_events`

Append-only administrative event. `summary` is a bounded field-level action summary, not full PII/content evidence. Account deletion may null/anonymize actor when legally appropriate.

### `contact_submissions`

Contains support PII and message content. Access is restricted. `delete_at` drives retention. Search/indexing by raw message is out of scope.

### `migration_records`

Idempotency and reconciliation bridge from legacy source to target. Removed only after migration audit and rollback retention are approved.

## Legacy mapping and deprecation

| Legacy field/source | Target | Status |
| --- | --- | --- |
| DynamoDB item identity | `migration_records.source_key` plus mapped `cards.id` | Migrate |
| `src` | `assets.object_key` after validation | Replace |
| `txt` | English `card_translations.prompt` | Migrate/review |
| `txt.en` | English prompt | Migrate/review |
| `txt.srb` | Serbian Latin prompt | Migrate/review |
| `txt.hu` | Hungarian prompt | Migrate/review |
| `width`, `height` | Verified asset dimensions | Preserve after verification |
| public/common table membership | sample/full deck version membership | Migrate |
| browser Cognito credentials | None | Remove |
| signed/base64 image body in page state | CDN media URL DTO | Replace |
