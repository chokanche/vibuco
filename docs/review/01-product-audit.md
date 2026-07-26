# Product audit

## Current proposition

Vibuco helps a facilitator unlock reflection by combining evocative photographs with coaching questions. The current page copy targets coaches, trainers, and facilitators working in coaching sessions, workshops, brainstorming, team meetings, and training.

## Capability disposition

| Capability | Current evidence | Value | Decision |
| --- | --- | --- | --- |
| Visual card gallery | `pages/cards.js` | Core differentiator | Preserve and redesign |
| Face-up / face-down cards | `pages/cards.js` | Supports established exercises | Preserve |
| Show / hide question | `pages/cards.js` | Supports facilitator choice | Preserve |
| Shuffle | Client-side Lodash shuffle | Useful but not reproducible | Improve with seeded shuffle |
| English, Serbian, Hungarian prompts | Card locale branches | Valuable multilingual content | Preserve after language QA |
| Public sample vs authenticated full deck | Two DynamoDB tables and auth branch | Clear acquisition path | Preserve as entitlement |
| Detailed instructions | `pages/instructions.js`, auth-gated | Strong method content | Restructure into playbook |
| Marketing and testimonials | Home page | Trust and explanation | Rewrite and de-duplicate |
| Blog links | Hard-coded external links | Supports expertise | Keep only curated, current links |
| Contact | Netlify-style form | Needed support path | Replace with validated server endpoint |
| Newsletter | External redirect | Conflicts with earlier product decision | Remove |
| Login and registration pages | No-op forms | Misleading | Remove or route to real hosted auth |
| User-uploaded cards | Mentioned only as future intent | High rights/moderation cost | Out of scope for v1 |

## Findings

| Finding ID | Area | Current behavior and evidence | Impact | Severity | Action |
| --- | --- | --- | --- | --- | --- |
| PROD-001 | Reliability | Production `/cards` returned 502 on 2026-07-26 | The core product cannot be trusted | Critical | Stabilize, instrument, replace |
| PROD-002 | Positioning | Home mixes coaching-tool value with generic template claims | Visitors cannot quickly understand outcome or audience | High | Replace copy |
| PROD-003 | Conversion | "Get access" has no pricing, entitlement, or access explanation | Creates uncertainty and abandonment | High | Define access contract |
| PROD-004 | Trust | Legal links are anchors, copyright says 2021, generic copy remains | Product looks abandoned | High | Replace and add legal gate |
| PROD-005 | Workflow | Controls are presented without session framing or onboarding | New facilitators must decode the tool | High | Add workspace onboarding and presets |
| PROD-006 | Content | Testimonials are repeated and some copy contains errors | Reduces credibility | Medium | Editorial review and structured content |
| PROD-007 | Operations | Content requires DynamoDB, S3, and local static updates | Publishing is error-prone and non-auditable | High | Add admin publication workflow |
| PROD-008 | Measurement | No product analytics or success events exist | Cannot validate adoption or value | High | Add privacy-safe events |
| PROD-009 | Scope | Old pages imply registration and future uploads without working flows | Creates false expectations | Medium | Remove until explicitly approved |
| PROD-010 | Content rights | Repository mixes Unsplash and privately supplied imagery without a manifest | Publication and derivative rights are unverifiable | Critical | Complete rights inventory |

## Jobs to be done

- When a client or group is stuck, help me introduce a fresh stimulus without disrupting the session.
- When I facilitate remotely, let me present a clean visual exercise that participants can understand immediately.
- When I prepare a session, help me select a prompt, language, and reveal pattern quickly.
- When I administer Vibuco, let me publish rights-cleared cards and translations safely.

## Product risks

The largest product risk is not lack of features. It is failing to make the core method reliable, trustworthy, and ready inside a live session. The redesign therefore prioritizes low-friction session use, content quality, accessibility, and operational control over expansion.
