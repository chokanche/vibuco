# UX, UI, and content specification

## Experience model

Vibuco has three modes:

1. Learn: understand the method and trust the product.
2. Try: complete a safe ten-card exercise.
3. Facilitate: use the full workspace during a real session.

Mode changes must be obvious. Marketing navigation never competes with workspace controls.

## UX requirements

| ID | Requirement | Verification |
| --- | --- | --- |
| UX-001 | Public visitors must see audience, outcome, and sample action at 320 px without horizontal scroll. | Responsive snapshot and manual review |
| UX-002 | Decorative motion must never delay interaction or lock scrolling. | E2E and reduced-motion test |
| UX-003 | The sample must explain the first action in one short sentence and allow dismissal. | Usability test |
| UX-004 | Workspace controls must remain reachable at 200% zoom and on 320 px width. | WCAG reflow test |
| UX-005 | Every card must be a semantic button with a meaningful accessible name. | axe and screen-reader test |
| UX-006 | Card selection must open a modal dialog with focus trap, Escape close, visible close, and focus restoration. | Keyboard E2E |
| UX-007 | Face-down cards must expose number and state without exposing hidden image or prompt to assistive tech. | Screen-reader test |
| UX-008 | Prompt visibility and card orientation must be independent controls with current state announced. | Interaction test |
| UX-009 | The active locale must apply `lang` to prompt content and persist for the facilitator. | DOM and preference test |
| UX-010 | Shuffle and reset must announce completion through a polite live region. | Screen-reader test |
| UX-011 | Reset, publish, rollback, and sign-out must require an explicit or reversible user action appropriate to impact. | E2E |
| UX-012 | Loading states must use stable skeleton dimensions and never replace a focused control unexpectedly. | Visual regression |
| UX-013 | Empty states must explain cause, next step, and whether filters can be cleared. | Content review |
| UX-014 | Recoverable errors must retain safe local state and offer retry with a reference ID. | Fault-injection E2E |
| UX-015 | Permission errors must not reveal the existence of restricted content. | Security UX test |
| UX-016 | Stale deck state must allow the active session to continue and offer refresh after completion. | Concurrency integration test |
| UX-017 | Contact and admin forms must use visible labels, field errors, summary errors, and preserved valid input. | Form accessibility test |
| UX-018 | All status communication must use text and iconography, never color alone. | Visual/accessibility review |
| UX-019 | Motion must be disabled or reduced when `prefers-reduced-motion` is set. | Browser emulation test |
| UX-020 | Touch targets must be at least 44 by 44 CSS pixels. | Automated geometry test |

## Workspace behavior

State:

- `orientation`: `face_up` or `face_down`
- `promptVisibility`: `shown` or `hidden`
- `locale`: `en`, `sr-Latn`, or `hu`
- `seed`: opaque session seed
- `selectedCardId`: optional
- `presentation`: on or off

Presets:

| Preset | Orientation | Prompt | Facilitator instruction |
| --- | --- | --- | --- |
| Resonant question | Face up | Shown | Choose the image that resonates, then explore its prompt. |
| Surprise question | Face down | Shown after reveal | Choose a number without seeing the image. |
| Surprise image | Face down | Hidden | Choose a number, reveal the image, and begin with observation. |
| Open reflection | Face up | Hidden | Choose the image that best expresses the present situation. |
| Facilitator choice | Face up | Hidden | Prepare one image before the session and explore its metaphors. |

Changing a preset updates controls atomically. The facilitator may then adjust individual controls.

## Responsive composition

- 320-639 px: two-column card grid, bottom-sheet controls, full-width focused dialog.
- 640-1023 px: three-column grid, compact sticky toolbar.
- 1024-1439 px: four-column grid with horizontal toolbar.
- 1440 px and above: five-column grid, max content width 1440 px.
- Presentation mode: one focused card with optional prompt panel; controls collapse to a small top bar.

## Empty, loading, error, and unavailable states

| State | Message intent | Action |
| --- | --- | --- |
| Initial loading | Preparing selected deck and locale | Cancel/back only if slow |
| Empty after filters | No cards match the selected filters | Clear filters |
| Deck unavailable | Published deck cannot be loaded | Retry, use cached safe deck if eligible |
| Locale incomplete | Prompt unavailable in chosen language | Fall back to approved English with disclosure |
| Session stale | A new deck was published during the session | Continue current version or refresh after session |
| Offline | Existing loaded session remains usable | Retry telemetry later; no new deck load |
| Permission denied | Access is unavailable | Return to account/support |
| System error | Task could not complete | Retry and show reference ID |

## Content principles

- Write to the facilitator, not the participant.
- Use plain, confident language and short verbs.
- Never promise therapeutic, medical, or guaranteed outcomes.
- Use "prompt" in product controls and "question" where the prompt is interrogative.
- Preserve proper Serbian and Hungarian diacritics.
- Remove generic claims such as "best professional marketing people."
- Testimonials require consent, role accuracy, and one canonical occurrence.
- Do not call the user "traveller."

## Core microcopy

Primary public action: "Try the cards"
Protected action: "Open workspace"
Face state: "Show images" / "Hide images"
Prompt state: "Show prompts" / "Hide prompts"
Shuffle: "Shuffle cards"
Reset: "Reset session"
Completion: "End session"
Privacy disclosure: "Vibuco does not record what you or your client say."
