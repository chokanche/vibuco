# Legacy dependency baseline

Status: `VIB-STAB-003` reproducibility evidence
Captured: 2026-07-26
Runtime: Node.js 24.14.0, npm 11.9.0

This inventory records the existing dependency risk. `VIB-STAB-003` pins the
graph without upgrading application dependencies because upgrades would combine
reproducibility work with framework migration risk.

## Locked graph

- npm lockfile version: 3
- installed packages reported by `npm ci`: 1,836
- package manager: npm 11.9.0
- install command: `npm ci`
- application build command: `npm run build`

## Security advisory baseline

`npm audit` reported:

| Severity | Count |
| --- | ---: |
| Critical | 19 |
| High | 54 |
| Moderate | 32 |
| Low | 11 |
| Total | 116 |

These are known legacy findings, not an accepted target-state risk. Automated
remediation was not run because `npm audit fix --force` can introduce breaking
framework and build changes. Dependency migration remains required before
launch.

## Deprecation baseline

Direct dependencies with explicit install-time deprecation notices:

- `@zeit/next-css`
- `aws-sdk` version 2
- `wow.js`

Transitive install warnings included:

- `@babel/plugin-proposal-*` packages superseded by transform plugins
- `@npmcli/move-file`
- `copy-concurrently`, `move-concurrently`, and `fs-write-stream-atomic`
- `core-js` version 2
- `figgy-pudding`
- `fsevents` version 1
- `glob` version 7
- `inflight`
- `mkdirp` version 0
- `q`
- `querystring`
- `resolve-url`, `source-map-resolve`, and `source-map-url`
- `rimraf` versions 2 and 3
- `stable`
- `string-similarity`
- `svgo` versions 0 and 1
- `tar` version 6
- `urix`
- `uuid` versions 3 and 8

The build also reports outdated Browserslist data, disabled built-in CSS,
unconfigured Tailwind purging, conflicting CSS order, and AWS SDK v2
end-of-support.

## License declaration inventory

The installed graph reported these declaration counts:

| Declaration | Packages |
| --- | ---: |
| MIT | 1,528 |
| ISC | 132 |
| Apache-2.0 | 84 |
| BSD-3-Clause | 36 |
| BSD-2-Clause | 26 |
| Undeclared | 10 |
| 0BSD | 8 |
| CC0-1.0 | 3 |
| Other combined or package-specific declarations | 19 |

The package-specific group includes a GSAP standard license declaration and a
`SEE LICENSE IN LICENSE.txt` declaration. This is an inventory, not legal
approval. The undeclared and package-specific entries require review before the
launch license gate.

## Secret-pattern scan

A tracked-file scan for common AWS access-key, GitHub token, and private-key
markers returned no matches. Public keys and public runtime identifiers are not
classified as credentials, but the target migration must still remove
client-visible AWS configuration.

## Reproducibility verification

Two separate local clones of commit `4bd8cd2` were verified in parallel with the
pinned runtime:

| Run | `npm ci` | `npm run build` | Lockfile drift |
| --- | --- | --- | --- |
| 1 | Passed in 31.89 seconds | Passed in 8.66 seconds | None |
| 2 | Passed in 32.38 seconds | Passed in 8.87 seconds | None |

Both builds generated the same twelve-route legacy production baseline and the
same reported route bundle sizes. GitHub Actions retains step duration and
failure classification for subsequent pull-request and `master` runs.

## VIB-PLAT-001 framework migration delta

The 2026-07-27 App Router shell migration changed the locked graph to Next.js
16.2.12, React 18.3.1, TypeScript 5.9.3, and 1,409 audited packages. The install
reported 98 known vulnerabilities:

| Severity | Count |
| --- | ---: |
| Critical | 14 |
| High | 48 |
| Moderate | 27 |
| Low | 9 |
| Total | 98 |

This reduces the total count from the initial baseline but does not accept the
remaining findings. No automatic audit fix was run. The legacy AWS SDK,
styling, Babel, SVG, and other transitive chains remain migration debt; the
target shell does not import them.
