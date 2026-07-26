# Product charter

Status: Proposed target state
Owner: Product owner
Last updated: 2026-07-26

## Vision

Vibuco is the fastest, calmest way for a professional facilitator to introduce a visual reflection exercise during a live conversation. It turns a proven coaching method into a dependable workspace without attempting to replace the coach.

## Positioning

For coaches, trainers, and facilitators who need to unlock reflection, Vibuco is a session-ready visual coaching workspace that combines rights-cleared photography, expert prompts, and flexible reveal patterns. Unlike generic card galleries or AI chatbots, Vibuco keeps the human facilitator in control and does not capture the client's private reflections.

## Users

Primary users:

- Independent business and performance coaches
- Trainers and workshop facilitators
- Team facilitators using virtual or face-to-face sessions

Secondary users:

- Prospective facilitators evaluating the method
- Vibuco content editors, translators, and administrators
- Clients or participants viewing a facilitator's shared screen, without an account

## Product principles

1. Ready inside a live session.
2. The facilitator remains responsible and in control.
3. Visual and verbal reflection work independently or together.
4. Calm interaction beats decorative motion.
5. No private coaching content is needed to deliver value.
6. Every published image and translation has accountable provenance.
7. Failure states explain recovery without exposing implementation details.

## Product boundaries

In scope for target v1:

- Public product explanation and ten-card sample
- Facilitator authentication and entitlement
- Full curated deck
- English, Serbian, and Hungarian prompts
- Face-up, face-down, show-question, hide-question, shuffle, reveal, and presentation behaviors
- Facilitator playbook
- Admin content, translation, asset, preview, publication, and rollback
- Privacy-safe product analytics and operational telemetry

Out of scope:

- AI-generated coaching, prompts, summaries, or recommendations
- Client accounts, profiles, answers, notes, recordings, or transcripts
- Real-time multi-user sessions or participant links
- User-uploaded cards or public marketplace
- Payments and subscription processing until `HUMAN-DECISION-001`
- Native mobile applications
- External search engine

## Success

North-star metric: completed Vibuco sessions per weekly active entitled facilitator.

A completed session is a workspace session with at least one card reveal and an explicit completion event. It does not contain coaching content.

Supporting measures:

- Public sample start-to-reveal rate
- Sign-in completion rate
- Workspace successful-load rate
- Median time from workspace load to first reveal
- Weekly returning facilitator rate
- Admin publication lead time
- Card and translation error rate
- Accessibility defect escape rate
- Core SLO attainment

## Product requirements

| ID | Requirement | Acceptance signal |
| --- | --- | --- |
| PRD-001 | A visitor can understand Vibuco's audience, method, and value without signing in. | Five-user comprehension test reaches 80% correct responses. |
| PRD-002 | A visitor can complete a meaningful ten-card sample exercise. | Sample start, select, reveal, and reset E2E passes. |
| PRD-003 | An entitled facilitator can open the full workspace and reach the first reveal in under 30 seconds after sign-in. | Moderated task and event timing meet target. |
| PRD-004 | The workspace supports the five established exercise patterns without a page reload. | Preset acceptance matrix passes. |
| PRD-005 | English, Serbian, and Hungarian prompt variants are independently reviewable and publishable. | Publication cannot include an unapproved required locale. |
| PRD-006 | Vibuco does not collect or persist a client's identity, answers, notes, recording, or transcript. | Data inventory and privacy tests find no prohibited field/event. |
| PRD-007 | Editors can publish and roll back a deck without direct database, bucket, or repository access. | Admin E2E publish and rollback passes. |
| PRD-008 | Every published asset has recorded provenance, rights status, and accessibility text. | Publication invariant rejects incomplete assets. |
| PRD-009 | The product meets the launch SLO, performance, security, and WCAG 2.2 AA gates. | Launch-gate report is green. |
| PRD-010 | The redesign remains deployable and reversible throughout migration. | Every migration slice has a tested rollback. |

## Launch assumptions

- The existing Cognito user pool can be retained.
- Existing card metadata and source images can be exported.
- Product ownership can assign a content and legal approver.
- English is the source locale.
- Screen sharing is performed by the facilitator's meeting tool, not by Vibuco.

## Non-goals

Vibuco v1 is not a coaching CRM, learning-management system, video platform, social network, or general content-management product.
