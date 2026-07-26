# Delivery, CI/CD, and environments

## Delivery requirements

| ID | Requirement | Verification |
| --- | --- | --- |
| OPS-001 | The repository pins Node.js 24 LTS, package manager version, and a committed lockfile. | Clean install in CI |
| OPS-002 | Pull requests run build, type, lint, tests, accessibility, spec, security, dependency, and migration checks. | Required-check policy |
| OPS-003 | Builds produce an immutable artifact with source revision and dependency manifest. | Artifact inspection |
| OPS-004 | The same artifact is promoted from staging to production. | Deployment provenance |
| OPS-005 | Local, preview, staging, and production use isolated identity, data, media, secrets, email, and telemetry. | Environment review |
| OPS-006 | Preview environments never use production credentials or personal data. | Secret/policy test |
| OPS-007 | Database changes use reviewed migrations and expand/migrate/contract compatibility. | Migration CI |
| OPS-008 | Production deploys use health-checked canary or equivalent progressive delivery. | Deployment exercise |
| OPS-009 | Automated rollback occurs on critical health regression and remains manually available. | Game day |
| OPS-010 | Feature flags have owner, purpose, safe default, expiry, audit, and removal task. | Flag inventory |
| OPS-011 | Infrastructure configuration is versioned and reviewed after provider approval. | Repository check |
| OPS-012 | Production changes and content publications annotate telemetry. | Dashboard check |
| OPS-013 | Dependabot/Renovate-equivalent updates are grouped, tested, and reviewed weekly. | Operational review |
| OPS-014 | Release notes map changes to work items and requirements. | Release audit |

## Branch and merge strategy

Use trunk-based development with short-lived `agent/<work-item>-<slug>` branches. Pull requests are small, reviewed, and squash-merged. Contract-first tasks land before implementations. Release branches are not used. Production tags identify promoted artifacts.

## Pipeline

1. Validate work-item/requirement references.
2. Install from lockfile.
3. Generate Prisma client and validate schema.
4. Format, lint, and strict type check.
5. Unit/integration/contract tests.
6. Build and bundle budget.
7. E2E/accessibility/visual tests on preview.
8. Secret, dependency, license, static security, and artifact scans.
9. Migration compatibility/dry run where applicable.
10. Publish immutable artifact and provenance.
11. Deploy staging, run synthetics and smoke.
12. Approval gate, progressive production deploy, verify, promote or roll back.

## Environment policy

| Environment | Purpose | Data | Access |
| --- | --- | --- | --- |
| Local | Development | Seeded synthetic | Developer |
| Preview | Pull request review | Ephemeral synthetic | Team/reviewer |
| Staging | Release and migration rehearsal | Production-shaped synthetic | Team |
| Production | User service | Real accounts/content/contact | Least privilege |

## Secrets

Secrets come from the selected platform's secret manager, never `.env` committed files. CI uses workload identity where supported. Rotation is rehearsed. Public runtime configuration is limited to explicitly reviewed non-sensitive values.

## Schema delivery

Additive schema is deployed before code that uses it. Backfills are bounded, resumable, observable, and separate from request handling. Code stops reading old fields before contraction. Destructive migration requires backup and explicit approval.

## Release strategy

Release slices follow the migration plan. Canary comparisons include error rate, p95, auth completion, workspace load success, synthetic status, and database saturation. A deck publication is a content release with independent rollback, not an application deploy.
