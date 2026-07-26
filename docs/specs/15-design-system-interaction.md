# Design system and interaction

## Design principles

Calm, focused, human, legible, and session-ready. Photography is the visual emphasis. Interface chrome is quiet. Decorative novelty never delays an exercise.

## Tokens

### Color roles

| Token | Value | Use |
| --- | --- | --- |
| `canvas` | `#FAF8F2` | App background |
| `surface` | `#FFFFFF` | Cards, dialogs, fields |
| `ink` | `#17332D` | Primary text |
| `muted` | `#5F716B` | Secondary text |
| `brand` | `#167C68` | Primary controls and links |
| `brand-strong` | `#0C5F50` | Hover/pressed and high-contrast text |
| `accent` | `#B9532F` | Warm highlight, not default action |
| `border` | `#D6E0DC` | Dividers and input borders |
| `focus` | `#1B6FC2` | Focus ring |
| `success` | `#26734D` | Success status |
| `warning` | `#8A5A00` | Warning status |
| `danger` | `#A83232` | Destructive/error status |

All text/background combinations require measured WCAG AA contrast. Do not infer contrast from token names.

### Typography

- Display: self-hosted Newsreader variable, fallback Georgia/serif.
- UI/body: self-hosted Inter variable, fallback system sans-serif.
- Body: 16/24 px, 18/28 on long-form desktop.
- Small: 14/20 px; never smaller for interactive/help text.
- H1: clamp 40-64 px, 1.05 line height.
- H2: clamp 30-44 px.
- H3: 24-30 px.
- Use sentence case. Avoid all caps for sentences.

### Spacing and layout

Base unit: 4 px. Named scale: 4, 8, 12, 16, 24, 32, 48, 64, 96.
Public max width: 1200 px. Workspace max width: 1440 px.
Grid: 4 columns mobile, 8 tablet, 12 desktop with 16/24/32 px gutters.

### Shape and elevation

- Control radius: 10 px
- Card radius: 16 px
- Dialog radius: 20 px desktop, 0-16 px mobile depending on viewport
- Border: 1 px
- Shadows: only `sm` for raised toolbar and `md` for dialog; never encode status

### Motion

- Fast 120 ms, standard 180 ms, deliberate 240 ms
- Ease: `cubic-bezier(.2,.8,.2,1)`
- Animate opacity/transform only
- No page-covering intro, parallax, autoplay carousel, or scroll lock
- Reduced motion removes transforms and uses immediate/short opacity changes

## Component hierarchy

Foundations: text, icon, divider, surface, stack, grid.
Controls: button, icon button, link, input, textarea, select, switch, segmented control, checkbox.
Product: card tile, face-down tile, prompt panel, session toolbar, preset picker, locale picker, focused-card dialog, deck status.
Feedback: field error, alert, toast, progress, skeleton, empty state, error state.
Navigation: public header/footer, product bar, breadcrumbs, skip link.
Admin: validation summary, lifecycle badge, revision timeline, rights panel, publication dialog.

## Control states

Every control defines default, hover, focus-visible, active, disabled, loading, error where relevant, and selected where applicable. Disabled controls retain readable contrast and explain why when the reason is not obvious.

## Card tile

Face up:

- semantic button
- fixed aspect-ratio media container from asset metadata
- optional unobtrusive card number
- alt text announced only when selected unless editorially necessary in grid
- selected/focus state does not obscure image

Face down:

- no hidden image in accessibility tree
- large readable number
- accessible name "Card {n}, face down"
- identical hit target and layout to face up

## Focused-card dialog

- `role="dialog"`, `aria-modal="true"`, title/description association
- visible close button first or last in logical focus order
- focus starts at heading or close based on context
- Tab/Shift+Tab remain inside
- Escape closes; backdrop click may close but is never the only mechanism
- closing restores focus to originating card
- portrait images use side-by-side prompt on wide screens; landscape images stack
- `lang` applies to prompt text

## Session toolbar

Desktop: sticky horizontal surface with preset, locale, orientation, prompt, shuffle, presentation, and overflow/reset.
Mobile: sticky compact summary plus bottom sheet.
State changes announce briefly without stealing focus. Controls remain available in presentation mode through a revealable bar.

## Forms

Persistent label above control, optional concise hint, required marker explained once, inline error linked with `aria-describedby`, error summary on submit, and server errors preserved. Success uses an inline confirmation with reference ID. Placeholder is an example, not a label.

## Notifications

Use inline alerts for persistent/actionable state, toast for noncritical completion, and modal confirmation only for high-impact action. Toasts do not contain the only error recovery control.

## Iconography

Use one outlined icon set with consistent 1.5-2 px stroke. Icons supplement text. Icon-only controls require accessible names and tooltips that do not block touch.

## Content and visual QA

Every component story includes light theme, 320 px, 200% zoom, keyboard focus, reduced motion, long Serbian/Hungarian strings, error, loading, and empty states where applicable. Dark mode is out of scope for v1.
