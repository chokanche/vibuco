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

