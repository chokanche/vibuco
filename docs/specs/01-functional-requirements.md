# Functional requirements

## Public product and sample

| ID | Requirement | Priority | Verification |
| --- | --- | --- | --- |
| FR-001 | The public home page must state audience, outcome, method, and primary action above the fold. | Must | Content and responsive E2E review |
| FR-002 | The public sample must contain exactly the configured sample deck and work without an account. | Must | API and E2E test |
| FR-003 | The sample must support select, reveal, question visibility, shuffle, reset, and one guided preset. | Must | Interaction E2E |
| FR-004 | Sample use must not create a durable user profile or store free-text coaching content. | Must | Data and telemetry inspection |
| FR-005 | Public pages must provide about, contact, privacy, terms, and accessibility information. | Must | Route and link check |

## Identity and entitlement

| ID | Requirement | Priority | Verification |
| --- | --- | --- | --- |
| FR-006 | Sign-in must use Cognito authorization code with PKCE and secure server-managed session cookies. | Must | Auth integration and security test |
| FR-007 | Protected routes must deny access by default and preserve a safe post-login return path. | Must | Authorization matrix |
| FR-008 | Workspace access must be decided by an explicit entitlement, not merely by account existence. | Must | Domain and route tests |
| FR-009 | Sign-out must invalidate the local session and redirect to a public confirmation state. | Must | Auth E2E |
| FR-010 | Administrators must be authorized by server-side role assignment. | Must | Negative authorization tests |

## Workspace

| ID | Requirement | Priority | Verification |
| --- | --- | --- | --- |
| FR-011 | An entitled facilitator must load the current published full deck in a supported locale. | Must | Contract and E2E test |
| FR-012 | The workspace must support face-up and face-down deck states. | Must | State-machine unit test |
| FR-013 | The facilitator must be able to show or hide the prompt independently of card orientation. | Must | State-machine and E2E test |
| FR-014 | Shuffle must be unbiased, immutable, and reproducible from a session seed. | Must | Statistical/unit tests |
| FR-015 | Selecting a card must open an accessible focused view with image, optional prompt, position, and close action. | Must | Accessibility E2E |
| FR-016 | Presentation mode must maximize the selected card and minimize nonessential navigation without using browser fullscreen permission. | Should | Responsive E2E |
| FR-017 | The workspace must expose five named presets corresponding to the legacy instruction patterns. | Must | Preset matrix |
| FR-018 | The facilitator must be able to reset the workspace after confirmation. | Must | E2E test |
| FR-019 | A transient workspace session may record card IDs and control events, but never client content. | Must | Schema and event allowlist tests |
| FR-020 | A recoverable content failure must offer retry and preserve local control state where safe. | Must | Fault-injection test |

## Content and administration

| ID | Requirement | Priority | Verification |
| --- | --- | --- | --- |
| FR-021 | An editor can create and edit draft cards, prompts, translations, themes, and deck membership. | Must | Admin E2E |
| FR-022 | Asset ingestion must capture source, creator, license/consent evidence, alt text, dimensions, checksum, and rights status. | Must | Publication invariant |
| FR-023 | Publication must require approved content, required locales, rights-cleared assets, and a unique deck version. | Must | Domain test |
| FR-024 | Publication must create an immutable revision and support rollback to the previous valid revision. | Must | Integration/E2E |
| FR-025 | Every admin mutation must create an audit record containing actor, action, target, time, and non-sensitive change summary. | Must | Audit-log integration test |

## Contact and support

| ID | Requirement | Priority | Verification |
| --- | --- | --- | --- |
| FR-026 | Contact submission must validate fields, rate-limit abuse, use a honeypot, and return a reference ID. | Must | Contract/security tests |
| FR-027 | Contact submissions must be retained only for the approved support period and be deletable by administrators. | Must | Retention job test |
| FR-028 | Product errors must show a user-safe reference ID that maps to server telemetry. | Must | Fault-injection E2E |

## Analytics and flags

| ID | Requirement | Priority | Verification |
| --- | --- | --- | --- |
| FR-029 | Analytics must use an allowlisted event schema with no free text, email, token, or client data. | Must | Schema and redaction tests |
| FR-030 | Migration-sensitive capabilities must be controlled by server-evaluated flags with safe defaults and an audit trail. | Must | Flag integration tests |

## Domain invariants

1. A published deck references only published cards.
2. A published card has one approved translation for every required locale.
3. A published card has exactly one active display asset with approved rights.
4. A deck version is immutable after publication.
5. Anonymous sample sessions cannot gain full-deck entitlement.
6. Workspace events accept only enumerated event types and card IDs belonging to the session deck.
7. No entity stores a client or participant identity.
