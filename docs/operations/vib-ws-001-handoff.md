# VIB-WS-001 implementation and handoff

Evidence date: 2026-10-05. Owner: implementing Workspace agent.
Branch: `agent/vib-ws-001-state-machine`.

Work item: `VIB-WS-001` remains `in_progress`. All scoped acceptance criteria
pass locally; the repository-wide dependency quality gate remains open.
The first branch commit changes only its status from `ready` to `in_progress`.

Requirements: FR-012, FR-013, FR-014, FR-017, FR-018, FR-019; UX-007, UX-008,
UX-010, UX-011. AT-004 and AT-005 map to
`tests/platform/workspace-domain.test.mjs`; that suite also covers domain
reset, hidden-content visibility, labels and bounded metadata. UI E2E and
screen-reader assertions remain with the dependent workspace UI items.

Files changed:

- `src/modules/session/domain/workspace-state.ts`: immutable workspace controls,
  preset matrix, reveal/presentation/reset transitions, bounded inputs and labels.
- `src/modules/session/domain/shuffle.ts`: deterministic xoshiro128** words,
  rejection-sampled Fisher-Yates, no mutation of the supplied deck.
- `tests/platform/workspace-domain.test.mjs`: nine domain tests included in the
  existing Baseline CI platform test glob, with no CI or package edits.
- `docs/specs/03-ux-ui-content.md`: interaction/reset and state-label contract.
- `docs/operations/vib-auth-001-closeout.md`: successor authorization and the
  still-pending, separate database approval.
- This handoff. The status-only claim also updates the backlog.

Behavior delivered: five exact preset mappings; independent image/prompt
controls; face-down grid content remains hidden while a focused selection
reveals an image; deterministic immutable order; confirmation-gated reset to
initial preset/order while retaining locale; presentation requires selection;
closing selection exits presentation. No target route is enabled.

Tests and checks: pinned Node 24.14.0/npm 11.9.0 clean install, production build,
TypeScript, all 25 platform tests (including nine new domain tests), seven
stability tests, eight legacy unit tests, two legacy browser journeys, module,
shell and built-route checks, all eight specification checks, whitespace and
lockfile-drift checks pass. New domain modules have 100% measured line, branch
and function coverage. The deterministic 24,000-seed corpus covers all 120
five-card permutations and passes positional chi-square checks. Rejection-tail
and malformed-word tests check modulo-bias handling directly; statistical
checks are evidence, not a mathematical proof of PRNG quality. No separate
lint/format command exists in the current baseline. No route, schema or migration
changed, so new route axe tests and migration checks do not apply to this slice.

Observability: pure typed local event intents, no logger or transport. Existing
allowed `preset_selected` and `card_revealed` intents are available to the
future adapter. Shuffle/reset intents provide approved polite-announcement
copy; they do not add analytics event names. No new runtime critical path.

Security/privacy: no new dependencies or external systems; no React, AWS,
database or transport import in the domain; bounded deck IDs, supported locales,
validated opaque seed format and exact action keys. Intents contain no prompts,
URLs, identity, free text or arbitrary metadata. The caller must generate seeds
from random bytes; this domain cannot determine whether bytes encode identity.
Seeds are reproducibility inputs, not security credentials.

Known limitations: `npm audit` exits nonzero for the unchanged committed graph:
92 findings (9 low, 43 moderate, 39 high, 1 critical; critical package
`decompress`). This is a merge/Definition-of-Done blocker under AGENTS.md,
not approval to change the package graph within this task. Keep this PR draft
and the item `in_progress` until the dependency/security gate is resolved and
required PR CI/review passes. The domain is not wired into UI, persistence or
analytics yet. `VIB-DATA-001` remains `planned` pending provider, region,
budget and operator approvals in the auth closeout's readiness checklist.

Follow-up work: build/security owner to remediate the existing dependency
findings; Workspace owner to rerun affected checks and close this item only
after all gates pass. Product owner to resolve `HUMAN-DECISION-006` and name
data, secret and restore owners. `VIB-WS-002` remains planned because its data,
media and UI dependencies are not complete.

Rollback: this isolated module is not reachable from an application route.
Revert the workspace implementation commit to withdraw the domain API; legacy
cards, auth, database and production assets remain unchanged. The Workspace
owner verifies baseline characterization/build checks after a revert. Any
later route integration needs its own rollout and rollback evidence.
