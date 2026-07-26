# Product requirements document

## Executive summary

Vibuco has a valuable product kernel but an unreliable prototype implementation. The redesign will make the curated visual-card method dependable in real coaching, training, and facilitation sessions. A visitor can understand and try the method. An entitled facilitator can open a full multilingual workspace. A small content team can manage rights, translations, publication, and rollback without engineering access.

This PRD consolidates the authoritative product scope. Requirement definitions remain in the linked specifications.

## Problem

Professional facilitators sometimes need a neutral stimulus to help a person or group articulate a feeling, reframe a challenge, or move beyond repetitive reasoning. Physical image cards work, but remote and hybrid sessions need a clean digital equivalent. Generic image search is distracting, rights-uncertain, and not paired with facilitator-ready prompts.

The existing Vibuco prototype proves the interaction, but a failing core route, unclear access, weak mobile/accessibility behavior, stale trust content, and fragile AWS/browser architecture prevent dependable use.

## Solution

A calm workspace built around a curated deck:

- choose a facilitation preset or direct controls
- choose an approved prompt locale
- present cards face up or face down
- show or hide prompts independently
- use deterministic shuffle and clear card numbers
- reveal one card in an accessible focused view
- finish/reset without recording the conversation

## Users and scenarios

| User | Scenario | Success |
| --- | --- | --- |
| Coach | Client is stuck in recurring reasoning | Prompt is introduced without breaking flow |
| Trainer | Remote group needs an opening/closing exercise | Participants can select numbered cards via screen share |
| Facilitator | Workshop needs a visual metaphor | Card can be presented with or without a question |
| Visitor | Evaluating usefulness | Completes a sample in under two minutes |
| Editor | Adding a prompt translation | Can preview, validate, and submit |
| Publisher | Releasing a deck update | Publishes atomically and can roll back |

## Minimum lovable release

The release includes PRD-001 through PRD-010 and all must-priority functional requirements. It contains:

- redesigned home, method, sample, about, contact, legal, and accessibility routes
- Cognito sign-in and explicit workspace entitlement
- full deck workspace and five presets
- approved English, Serbian, and Hungarian prompts
- responsive, keyboard-complete session UI
- rights-cleared optimized media
- card/deck admin, publication, audit, and rollback
- CI/CD, tests, telemetry, SLOs, runbooks, migration, and redirects

## Exclusions

AI, client records, coaching history, participant links, native apps, billing implementation, user uploads, social sharing of protected cards, public card indexing, session replay, and generalized CMS features are not part of this release.

## Trust proposition

The facilitator controls the method. Vibuco does not listen, transcribe, summarize, or store what participants say. It records only the minimum technical and product events needed for reliability and improvement.

## Success targets

Within 60 days of general availability:

- at least 95% of entitled workspace load attempts succeed
- median first reveal is under 30 seconds after workspace load
- at least 40% of weekly active facilitators complete two or more sessions
- at least 25% of sample starters reveal a card
- zero known critical accessibility or rights defects
- availability and latency SLOs meet the targets in the NFR specification

Adoption targets are hypotheses and should be recalibrated after baseline measurement. Reliability, privacy, security, and accessibility gates are commitments.

## Dependencies

- Product owner resolves access and pricing model.
- Legal owner approves rights and policy inventory.
- Content owner reviews source copy and three locales.
- Technical owner documents existing AWS/deployment access.
- Hosting/database provider decision passes cost and security review.

## Release gates

No launch until:

- critical acceptance tests pass
- content reconciliation and rights reports are approved
- auth rollback and data recovery are rehearsed
- synthetic checks and alerts are operational
- policies identify the actual controller and processors
- no browser AWS credentials/direct datastore calls remain
- budget and provider approval are recorded

## Requirement map

- Product: [product charter](00-product-charter.md)
- Functional: [functional requirements](01-functional-requirements.md)
- UX: [UX, UI, and content](03-ux-ui-content.md)
- Data: [domain and data](04-domain-data-model.md)
- API: [API contracts](06-api-contracts.md)
- Security: [trust, security, privacy](09-trust-security-privacy.md)
- Migration: [migration plan](11-migration-and-redesign-plan.md)
- Non-functional: [NFRs and SLOs](21-non-functional-requirements-slos.md)
- Acceptance: [test matrix](12-acceptance-test-matrix.md)
