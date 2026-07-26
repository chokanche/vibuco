# Technical audit

## Current architecture

The repository is a JavaScript Next.js 9 Pages Router application. Twelve routes are statically generated. `_app.js` initializes Amplify Auth globally. The browser obtains Cognito identity credentials, scans DynamoDB tables by hard-coded name, then reads S3 objects. Unauthenticated content combines DynamoDB metadata with checked-in static images.

There are no API routes, server data layer, automated tests, lint command, CI workflow, lockfile, infrastructure code, migrations, feature flags, or observability integration.

## Verified build baseline

`npm install --ignore-scripts --no-package-lock` and `npm run build` succeeded on Node.js 24.14.0. The build reported:

- deprecated build plugins and AWS SDK v2 end-of-support
- disabled built-in CSS support
- unconfigured Tailwind purging
- conflicting CSS order
- 293 kB global CSS
- 421 kB first-load JavaScript for `/`
- 927 kB first-load JavaScript for `/cards`

## Findings

| Finding ID | Area | Current behavior and evidence | Impact | Severity | Action |
| --- | --- | --- | --- | --- | --- |
| TECH-001 | Framework | Next.js 9, React 16, Webpack 4 plugins | Unsupported and blocks modern security/performance work | Critical | Incremental framework migration |
| TECH-002 | Data boundary | Browser calls DynamoDB scan using AWS SDK v2 | Broad credentials, large bundle, weak policy boundary | Critical | Server-only repository layer |
| TECH-003 | Media | Browser downloads protected S3 bodies and converts to base64 | Memory, latency, caching, and leakage risk | Critical | Signed optimized media delivery |
| TECH-004 | Error handling | Credential and scan errors can log and never reject | Infinite loading and no recovery | High | Typed errors, timeouts, retries |
| TECH-005 | Mutation | Card records are mutated in place | Race and rendering defects | Medium | Immutable domain mapping |
| TECH-006 | Build | No lockfile or CI; multiple deprecated plugins | Non-reproducible supply chain | Critical | Pin runtime and dependencies |
| TECH-007 | Quality | No application tests or lint/type checks | Regression risk is uncontrolled | Critical | Quality gate before migration |
| TECH-008 | Architecture | `pages/cards.js` owns fetch, auth, transforms, state, and rendering | Changes have high blast radius | High | Separate domain, data, and UI |
| TECH-009 | Security | Implicit OAuth token response and client AWS credentials | Increased token and authorization risk | Critical | Authorization-code flow and BFF |
| TECH-010 | Configuration | Sensitive operational topology is public runtime config | Expands client knowledge and coupling | High | Server-side validated config |
| TECH-011 | Deployment | No environment or infrastructure definition | Rollback and recovery are unknown | High | Define environments and release process |
| TECH-012 | Observability | Only one `console.log`; no metrics/traces/errors | Core failures are undetectable | Critical | Structured telemetry and SLOs |
| TECH-013 | Assets | `static`, `images`, and `public` duplicate asset strategies | 27 MB of source assets and unclear ownership | Medium | Migrate to one asset pipeline |
| TECH-014 | Dead code | No-op login/register and unused template components remain | Attack and maintenance surface | Medium | Remove after route inventory |

## Target disposition

The target is a modular monolith. Server Components render read-heavy pages, client components own only workspace interactions, route handlers expose narrow validated contracts, and domain services are independent of persistence. See [system architecture](../specs/05-system-architecture.md).
