# Platform shell baseline

Work item: `VIB-PLAT-001`
Requirements: ADR-001, ADR-002, ADR-005, MIG-001

## Version verification

The implementation baseline was rechecked on 2026-07-27 before the upgrade:

- Next.js `16.2.12`
- React and React DOM `18.3.1`
- TypeScript `5.9.3`
- Node.js `24.14.0`
- npm `11.9.0`

Next.js 16 supports incremental App Router adoption beside the Pages Router and
requires Node.js 20.9 or newer and TypeScript 5.1 or newer. React 18 remains
within the Next.js 16 peer range and reduces the compatibility blast radius for
the legacy application.

## Coexistence boundary

Next.js requires `app` and `pages` to share a source root. The legacy page entry
files therefore moved mechanically from `pages` to `src/pages`; their route
names and behavior did not change. The target shell lives in `src/app`.

`src/app` intentionally contains no `page.tsx`. The production build manifest
continues to expose the legacy `/`, `/cards`, `/about`, `/contact`, and `/login`
routes, while the App Router manifest is empty. Future work enables target
routes one completed route at a time.

The root Server Component layout supplies English document language, a
keyboard-visible skip link, a focusable main landmark, and an opaque request
correlation context ready for a telemetry adapter.

## Boundaries and compatibility

- Strict TypeScript applies to `src`, while legacy JavaScript remains allowed
  and unchecked during incremental migration.
- Privileged platform entrypoints import `server-only`.
- Static checks reject framework imports from future domain modules and
  server-boundary imports from Client Components.
- Environment validation rejects private credential names exposed with a
  `NEXT_PUBLIC_` prefix.
- Target shell source and emitted route manifests are scanned for route and
  client-boundary violations.
- The existing Babel and webpack pipeline remains enabled for legacy SVG and
  styled-components behavior.
- Next.js static export remains enabled for the current Netlify artifact; the
  provider-neutral server runtime decision remains a later approved cutover.
- The existing transitive `react-is` compatible with styled-components is
  resolved explicitly until the legacy styling stack is replaced.

The legacy client still contains browser AWS access. That known defect is not
part of this shell and remains scheduled for the server-adapter migration under
ADR-005 and MIG-011.

## Rollback

Rollback is the previous immutable branch layer
`agent/vib-stab-004-characterization`. Reverting this work restores Next.js 9,
the root `pages` directory, and the prior JavaScript configuration. No target
route, database, identity setting, DNS record, or production deploy is changed
by this work item.
