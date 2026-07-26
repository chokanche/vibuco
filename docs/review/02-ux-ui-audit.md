# UX and UI audit

## Journey summary

The current public journey is home, "Try it out," card grid, and optionally authentication for the full deck. About, contact, instructions, and meet-us pages exist, but navigation changes based on authentication and several routes fail or mislead.

## Findings

| Finding ID | Area | Current behavior and evidence | Impact | Severity | Action |
| --- | --- | --- | --- | --- | --- |
| UXA-001 | First visit | A multi-second GSAP intro covers the viewport and disables body scrolling | Delays value, can trap users, ignores reduced motion | High | Remove |
| UXA-002 | Value hierarchy | Home repeats long feature blocks before showing product interaction | Weak comprehension and conversion | High | Lead with method and sample |
| UXA-003 | Navigation | Desktop/mobile behavior is template-derived and auth-dependent | Orientation is inconsistent | Medium | Replace with stable public/product nav |
| UXA-004 | Card controls | Language, flip, and question controls lack a unified toolbar | High cognitive load during a live session | High | Create session toolbar |
| UXA-005 | Lightbox | Click-only overlay has no role, label, close button, Escape, or focus trap | Keyboard and assistive-tech users are blocked | Critical | Replace with accessible dialog |
| UXA-006 | Card grid | Card images are clickable without semantic buttons or keyboard support | Core action is inaccessible | Critical | Use focusable card buttons |
| UXA-007 | Responsive use | Large fixed widths, 82 px card numbers, and ad hoc margins risk mobile overflow | Poor phone and screen-share use | High | Define responsive compositions |
| UXA-008 | States | Loading exists, but errors, empty results, stale content, and recovery do not | Failures look like hangs | High | Define all state contracts |
| UXA-009 | Forms | Contact inputs rely on placeholders and lack required/error semantics | Low accessibility and validation clarity | High | Add labels, errors, status |
| UXA-010 | Copy | Typos, repeated content, and generic Treact claims remain | Low trust | High | Professional content pass |
| UXA-011 | Visual system | Tailwind tokens, styled components, CSS, and several motion libraries overlap | Inconsistent behavior and high maintenance | High | Consolidate design system |
| UXA-012 | Image use | Generic alt text repeats "motivation, business coaching" | Images are not meaningfully described | Medium | Add editorial alt/decorative rules |

## What should be preserved

The green/teal brand association, photographic focus, simple card metaphor, facilitator freedom, and reveal mechanics are worth preserving. The redesign should feel calm and human rather than dashboard-heavy.

## Target UX direction

The public experience demonstrates one exercise in under a minute. The protected experience opens directly into a distraction-free workspace with a persistent, reachable toolbar. Facilitators can choose a preset, locale, and deck state before screen sharing. Every change has visible feedback and a keyboard equivalent. The detailed behavior is authoritative in [UX, UI, and content](../specs/03-ux-ui-content.md) and [design system](../specs/15-design-system-interaction.md).
