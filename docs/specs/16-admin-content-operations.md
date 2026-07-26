# Admin and content operations

## Roles

| Action | Editor | Publisher | Admin |
| --- | :---: | :---: | :---: |
| Create/edit draft | Yes | Yes | Yes |
| Upload quarantined asset | Yes | Yes | Yes |
| Submit for review | Yes | Yes | Yes |
| Approve translation/content | No | Yes | Yes |
| Approve rights evidence | No | Yes, if designated | Yes |
| Publish/rollback deck | No | Yes | Yes |
| Manage roles/entitlements | No | No | Yes |
| Delete contact submission | No | No | Yes |
| View audit | Own drafts | Yes | Yes |

A publisher cannot approve their own rights evidence when dual approval is enabled. Role evaluation occurs on the server.

## Card workflow

1. Create card draft and stable internal slug.
2. Attach quarantined image.
3. Record creator/source/license/consent, checksum, dimensions, and alt-text status.
4. Create English source prompt and required locale translations.
5. Assign controlled themes.
6. Preview grid, focused view, face-down reveal, and each locale.
7. Submit for review.
8. Resolve validation and review comments.
9. Approve content, translations, and rights.
10. Add card to draft deck version.
11. Validate and publish deck atomically.

## Publication validation

Blocking:

- missing/expired/rejected rights
- missing or unapproved required locale
- missing alt text decision
- duplicate card in version
- missing derived image variants
- checksum mismatch
- invalid or empty prompt
- unpublished card membership
- no rollback predecessor after initial launch

Warnings:

- unusually long prompt
- low-resolution but usable image
- missing optional theme
- large change in sample membership

Warnings require acknowledgment and are recorded.

## Publication

Publication uses one transaction to create/lock the immutable version and update the active deck pointer. Cache invalidation occurs only after commit. If invalidation fails, the published version remains authoritative and operations retries invalidation. Partial publication is impossible.

## Rollback

Rollback selects a previously published valid version, records the reason, atomically updates the active pointer, invalidates affected caches, and emits audit/telemetry events. It does not mutate or delete either version.

## Preview

Preview uses draft DTOs and short-lived media grants available only to authorized editors. Preview pages are noindex, no-store, excluded from analytics, and visibly marked "Draft preview."

## Contact operations

Admins can list status and metadata, open one submission, mark resolved, and delete. List views minimize message exposure. Exports are out of scope. Email notifications contain the reference ID and a safe summary, not the full message where avoidable.

## Audit

Audit views filter by actor, action, target type, target ID, and date. Records show a non-sensitive diff summary. They cannot be edited in the application. Viewing sensitive rights evidence is itself audited.

## Accessibility and operational safety

Admin functions meet the same WCAG target. Validation is usable without color. Publish/rollback dialogs state version, affected deck, change count, and consequence. Long tasks expose progress and safe retry. No operation depends on hovering.
