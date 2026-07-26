# Executive audit

Date: 2026-07-26
Repository baseline: `master` at `181a4ba`
Production evidence: `https://www.vibuco.com/`

## What Vibuco is today

Vibuco is a visual facilitation tool built around curated photographs and coaching questions. Coaches, trainers, and facilitators can show a grid of cards, hide or reveal the photographs, show or hide a question, and use the result during a live conversation. The public site explains the method, presents testimonials, and links to a card trial.

The product idea remains distinctive and credible. Its strongest assets are the concrete card interaction, a facilitator-led method, multilingual prompt content, and the founder's coaching expertise. Those assets should be preserved.

## Main problems

The current product is not operationally trustworthy. Standard production probes returned a 502 during this audit. A follow-up read-only check at 2026-07-26T14:48Z found that browsers reject `www.vibuco.com` because it presents a `*.netlify.app` certificate, while certificate-bypassed requests returned HTTP 200 for the sampled routes. This bounds the immediate public failure to TLS/custom-domain configuration; deployment logs are still required to exclude a separate application defect. The repository has no automated tests, CI, lockfile, analytics, error reporting, or infrastructure definition. Protected content is read by the browser through Cognito identity credentials, a DynamoDB table scan, and S3 object downloads. The card route ships 927 kB of first-load JavaScript, while the global CSS bundle is 293 kB because Tailwind purging is not configured.

The experience also reads as an unfinished 2021 prototype. Important footer legal links point to `#`, the copyright is stale, registration and login forms do not submit, repeated testimonials and template copy reduce trust, and the contact implementation depends on undocumented hosting behavior. The full-screen entrance animation blocks scrolling and lacks reduced-motion behavior. The card lightbox has no dialog semantics, keyboard close, focus management, or visible close control.

## Target product

Vibuco should become a session-ready visual coaching workspace:

- A public explanation and ten-card sample that proves the method.
- A protected workspace with the full curated deck in English, Serbian, and Hungarian.
- A focused presentation mode for live coaching, training, and workshops.
- A facilitator playbook explaining the existing five exercise patterns.
- A controlled admin workflow for assets, prompts, translations, preview, publication, and rollback.

The redesign deliberately excludes AI coaching, client profiles, notes, recordings, real-time collaboration, a marketplace, and user uploads from v1. It must not store clients' reflections or sensitive coaching content.

## Most important decisions

1. Preserve the core photo-and-question method and the three existing languages.
2. Make the workspace the product center, not a long marketing template.
3. Move authentication, authorization, database, and protected-media access behind server boundaries.
4. Use a TypeScript modular monolith rather than microservices.
5. Migrate content from DynamoDB to a canonical PostgreSQL model after a verified shadow import.
6. Keep Cognito and S3 during migration to reduce identity and asset risk.
7. Treat accessibility, content rights, legal pages, observability, and rollback as launch gates.

## Recommended sequence

Stabilize production first, establish quality gates and contracts, build the new public shell and sample, migrate authentication and the workspace, introduce the content model and admin path, then cut over content and retire direct browser AWS access. The critical path is detailed in [the master plan](../implementation/MASTER_IMPLEMENTATION_PLAN.md).

## Human approvals required

- `HUMAN-DECISION-001`: confirm whether full-deck access is invite-only, paid, or free.
- `HUMAN-DECISION-002`: approve the hosting and managed PostgreSQL provider after a cost review.
- `HUMAN-DECISION-003`: approve an asset-rights inventory and replacement plan before publication.
- `HUMAN-DECISION-004`: confirm the legal entity, controller contact, and final policy text.
- `HUMAN-DECISION-005`: confirm whether Hungarian remains launch-critical and fund professional language review.

## Audit evidence

Evidence was gathered from repository source, the March 2026 refresh plan and PR history, a successful local production build on Node.js 24, production page output, and previously documented Vibuco product decisions. Findings are separated from proposed target behavior throughout this package.
