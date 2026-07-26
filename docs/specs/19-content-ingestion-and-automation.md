# Content ingestion and automation

## Scope

This specification covers the one-time legacy import and the ongoing controlled ingestion of Vibuco-owned or licensed cards. It does not authorize web scraping, bulk third-party imports, AI generation, or user uploads.

## Legacy import

Inputs:

- DynamoDB `vibuco-photos-public`
- DynamoDB `vibuco-photos`
- referenced public/common S3 objects
- checked-in `static` and `public` images
- existing English, Serbian, and Hungarian prompt fields

Steps:

1. Export point-in-time table data and object manifest.
2. Normalize each source record without mutation.
3. Resolve card identity across public/full tables using checksum plus reviewed mapping.
4. Decode image and verify actual media type, dimensions, checksum, and corruption.
5. Map prompt fields to locale records.
6. Attach source table/key as migration provenance.
7. Quarantine image until rights evidence is approved.
8. Produce exception report for duplicates, missing objects, missing translation, and mismatch.
9. Import idempotently into draft entities.
10. Reconcile counts/checksums/membership.
11. Editorially approve and publish initial immutable sample/full versions.

No source item is silently dropped. Exceptions are approved or resolved.

## Ongoing asset ingestion

1. Admin requests a short-lived upload grant with expected file metadata.
2. Browser uploads to quarantine.
3. Server retrieves, scans where available, decodes, verifies, strips unsafe metadata, and re-encodes.
4. Server generates responsive AVIF/WebP/JPEG fallback variants.
5. Editor supplies provenance, rights evidence, creator credit, and alt text.
6. Publisher approves rights.
7. Asset becomes eligible for card publication.

Limits are configurable. Initial maximum original is 15 MB and 8000 by 8000 pixels. SVG is not accepted for photographic cards.

## Prompt and translation ingestion

English is source. Prompt text is plain text with normalized Unicode and bounded length. No HTML is accepted. Serbian target is `sr-Latn`; Hungarian is `hu`. Each translation records translator/reviewer attribution and status. CSV import may create drafts only and returns row-level errors; it cannot approve or publish.

## Automation

Allowed:

- checksum and duplicate detection
- image validation and variant generation
- link checking
- spelling/lint suggestions
- required-field/publication validation
- retention cleanup and orphan quarantine cleanup
- cache invalidation after commit

Not allowed without a new decision:

- automated scraping
- automated rights classification
- machine translation publication
- AI prompt/image generation
- automatic publication based only on validation

## Idempotency and recovery

Imports use source system, source key, and checksum as idempotency identity. Each batch records started/completed/failed counts and resumable cursor. Failed records do not roll back successful independent drafts, but publication waits for complete reconciliation. Binaries remain quarantined until database commit.

## Observability

Track batch duration, records by result, duplicates, missing assets, invalid media, translation gaps, rights gaps, and orphan cleanup. Do not log prompt text, signed URLs, or rights-document content.
