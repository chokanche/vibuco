# Trust, security, and privacy

## Trust principles

- Vibuco supports a professional facilitator and does not claim to provide therapy or automated coaching.
- The product explains what it stores and, importantly, what it does not store.
- Access, card rights, translations, and publications are attributable.
- Security failures fail closed without exposing restricted content.

## Security requirements

| ID | Requirement | Verification |
| --- | --- | --- |
| SEC-001 | OAuth uses authorization code with PKCE, state, nonce, exact redirect allowlists, and issuer/audience validation. | Auth security test |
| SEC-002 | Session cookies are `HttpOnly`, `Secure`, `SameSite=Lax`, host-scoped, rotated after auth, and time-bounded. | Browser/header test |
| SEC-003 | All protected operations authorize actor, entitlement/role, action, and resource on the server. | Negative authorization matrix |
| SEC-004 | AWS credentials, database credentials, signing keys, and privileged SDKs never enter client bundles. | Bundle and static scan |
| SEC-005 | All untrusted input is schema-validated and output is context-encoded. | Fuzz, XSS, injection tests |
| SEC-006 | State-changing cookie-authenticated requests have CSRF protection through SameSite, origin validation, and anti-CSRF token where needed. | CSRF test |
| SEC-007 | Content Security Policy, HSTS, frame-ancestors, referrer policy, and MIME protections are set centrally. | Header scan |
| SEC-008 | Media upload grants are short-lived, size/type constrained, single-purpose, and followed by server-side decoded-file validation. | Upload security test |
| SEC-009 | Public and protected media use separate policy paths; protected object keys and signed grants are never logged. | Access/log tests |
| SEC-010 | Contact, session, auth-adjacent, and admin operations are rate-limited and abuse-monitored. | Rate-limit test |
| SEC-011 | Secrets are environment-scoped, rotated, access-controlled, and absent from repository/history. | Secret scan and runbook |
| SEC-012 | Dependencies, containers/artifacts, and source are scanned in CI with blocking severity policy. | CI evidence |
| SEC-013 | Administrative publication, role, entitlement, and rights changes create immutable audit events. | Audit integration test |
| SEC-014 | Database access uses least-privilege identities and encrypted connections; storage and backups are encrypted at rest. | Infrastructure review |
| SEC-015 | Logs and traces use an explicit allowlist and automated redaction tests. | Telemetry test |
| SEC-016 | Security-sensitive errors return generic user messages and correlated internal details. | Fault-injection test |
| SEC-017 | Account deletion, access requests, and incident response follow documented authenticated workflows. | Operational exercise |
| SEC-018 | The application prevents clickjacking except explicitly approved same-origin presentation contexts. | Header test |

## Threat model

| Threat | Asset | Control |
| --- | --- | --- |
| Stolen auth code/token | Full deck and account | PKCE, nonce/state, short session, secure cookie |
| IDOR against admin/card APIs | Draft/published content | Resource authorization and opaque IDs |
| Browser AWS credential misuse | S3/DynamoDB | Remove client credentials and direct calls |
| XSS from prompt/contact content | Sessions/admin | Validation, contextual encoding, CSP |
| CSRF publication/role mutation | Product integrity | Origin, CSRF controls, re-auth for critical action |
| Malicious upload/polyglot | Users and CDN | Quarantine, decode, re-encode, scan, size/type checks |
| Signed URL leakage | Protected imagery | Short TTL, no logs/referrer, scoped path |
| Contact spam | Support capacity | Honeypot, rate limit, reputation monitoring |
| Supply-chain compromise | Build and users | Lockfile, scans, review, immutable artifact |
| Insider misuse | Content/access | Least privilege, audit, dual approval for publication |
| Telemetry privacy leak | Facilitator/client trust | Event allowlist, no free text, redaction tests |

## Privacy boundary

Vibuco v1 processes facilitator account subject, entitlement, locale preference, limited session interaction events, administrative audit data, and contact data. It does not process client identities, client accounts, answers, notes, session audio/video, transcripts, diagnoses, or inferred traits.

Privacy notices must state controller identity, purposes, legal bases, processors, transfers, retention, rights, and contact channel. `HUMAN-DECISION-004` blocks final legal publication.

## Content rights

Every image must have one of: owned, commissioned with written scope, licensed with archived terms, or approved open-license evidence. "Found on Unsplash" without a recorded source URL and license snapshot is insufficient for migration approval. Assets with uncertain rights are quarantined or replaced.

## Incident priorities

Unauthorized full-deck access, token exposure, protected asset leakage, admin takeover, and prohibited coaching-content capture are severity-1 events. Runbooks must include containment, credential invalidation, evidence preservation, notification assessment, and post-incident actions.
