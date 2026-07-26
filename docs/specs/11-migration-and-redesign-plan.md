# Migration and redesign plan

## Strategy

Use a route-by-route and boundary-by-boundary strangler migration. Keep the site deployable after every slice. Preserve Cognito and S3 initially, replace browser access with server adapters, introduce PostgreSQL through a reconciled shadow import, then retire DynamoDB reads.

## Migration requirements

| ID | Requirement | Verification |
| --- | --- | --- |
| MIG-001 | Every migration slice must deploy independently and include rollback instructions. | Release checklist |
| MIG-002 | The production card-route failure must be stabilized before redesign cutover. | Synthetic SLO |
| MIG-003 | Legacy behavior to preserve must have characterization tests before replacement. | Test report |
| MIG-004 | Public URL changes use tested one-hop redirects and preserve canonical signals. | Redirect crawler |
| MIG-005 | Cognito user pool identities must be preserved unless a separate approved migration exists. | Auth reconciliation |
| MIG-006 | New auth flow must run behind a flag and support immediate return to legacy flow during pilot. | Rollback rehearsal |
| MIG-007 | DynamoDB import must be repeatable, checksum-based, and idempotent. | Migration test |
| MIG-008 | Source/target counts, card identity, translations, dimensions, and deck membership must reconcile before read cutover. | Reconciliation report |
| MIG-009 | PostgreSQL reads must shadow production reads before serving users. | Comparison dashboard |
| MIG-010 | Content writes must freeze or use one authoritative writer during final data cutover. | Cutover checklist |
| MIG-011 | Direct browser DynamoDB/S3 access must be removed before credentials/policies are revoked. | Bundle/network scan |
| MIG-012 | Every published image must pass rights review before target publication. | Rights report |
| MIG-013 | Old code, tables, roles, and bucket policies are removed only after the rollback window. | Decommission checklist |
| MIG-014 | Deployment and schema changes use backward-compatible expand/migrate/contract sequencing. | Migration CI |
| MIG-015 | Launch requires tested database, content, identity, and application rollback paths. | Game-day evidence |

## Phases

### M0: emergency stabilization

- Add production synthetic checks and request correlation.
- Identify `/cards` 502 cause and restore the existing core route.
- Document current deployment, environment variables, Cognito clients, buckets, tables, DNS, and rollback.
- Do not redesign during incident repair.

Exit: core route meets the stabilization SLO for seven days.

### M1: reproducible baseline

- Pin Node.js 24 LTS and package manager.
- Commit a lockfile.
- Add CI, lint, formatting, tests, secret/dependency scans.
- Record legacy characterization tests and route inventory.

Exit: unchanged legacy app builds and critical tests pass in CI.

### M2: target shell and public routes

- Introduce TypeScript and App Router alongside Pages Router.
- Add target tokens, accessible components, headers, metadata, legal routes, and sample shell.
- Redirect only routes fully replaced.

Exit: public pages meet accessibility and performance budgets.

### M3: server identity and content boundary

- Add code-flow authentication and server sessions behind a flag.
- Introduce server-only Cognito, DynamoDB, and S3 adapters.
- Serve deck DTOs and optimized media without client credentials.
- Pilot with internal accounts.

Exit: full workspace works with existing content and no AWS credentials in the browser.

### M4: canonical data and admin

- Provision managed PostgreSQL.
- Apply Prisma schema.
- Import and reconcile cards, translations, assets, rights evidence, and decks.
- Run shadow reads.
- Add content admin, review, publish, and rollback.

Exit: reconciliation is exact or every exception is approved; editors publish without direct AWS/database access.

### M5: workspace cutover

- Launch target workspace by percentage/account flag.
- Monitor auth, load, reveal, error, and latency metrics.
- Promote the target read path and immutable deck versions.
- Keep legacy route and datastore available for rollback.

Exit: SLOs and product metrics hold through the rollback window.

### M6: decommission

- Make one-hop legacy redirects permanent.
- Revoke browser identity permissions.
- Remove AWS SDK v2, Pages routes, legacy CSS/components, direct table reads, and duplicated static assets.
- Archive DynamoDB export and remove tables/policies after approval.

Exit: no production traffic or code uses retired paths; recovery evidence is retained.

## Parallel run

For a sampled request, the authoritative legacy result is served while the target repository computes a normalized result asynchronously within the request budget or controlled background comparison. Compare card IDs, locale availability, sample/full membership, and asset checksum. Do not compare signed URLs or random order.

## Rollback

| Failure | Rollback |
| --- | --- |
| New public route | Route flag to legacy page |
| Auth code flow | Account cohort flag to legacy hosted flow |
| Server content adapter | Read-path flag to legacy adapter |
| PostgreSQL reads | Return to server-side DynamoDB adapter |
| New deck publication | Restore previous immutable version |
| Application deploy | Promote previous immutable artifact |
| Compatible schema expansion | Leave additive schema, roll app back |

Destructive schema contraction and source-policy revocation occur only after rollback expiry.

## Approval gates

Hosting/database selection, access model, legal text, rights-cleared inventory, and launch locales require the human decisions listed in the executive audit.
