# Risk and debt register

Scoring uses probability and impact from 1 to 5. Score is their product.

| ID | Risk or debt | P | I | Score | Owner | Mitigation | Trigger / contingency |
| --- | --- | ---: | ---: | ---: | --- | --- | --- |
| RISK-001 | Core card route unavailable in production | 5 | 5 | 25 | Tech lead | Stabilization milestone, synthetic check, rollback | Any two failed probes page on-call |
| RISK-002 | Image licenses or consent cannot be proven | 4 | 5 | Product owner | Rights manifest and legal review | Quarantine or replace uncertain asset |
| RISK-003 | Cognito migration locks users out | 3 | 5 | Identity owner | Preserve user pool, code-flow pilot, rollback | Auth completion drops below SLO |
| RISK-004 | DynamoDB to PostgreSQL migration loses translation or order data | 3 | 5 | Data owner | Reconciled shadow import and checksums | Mismatch blocks cutover |
| RISK-005 | Framework jump creates a long-lived rewrite branch | 4 | 4 | Tech lead | Route-by-route strangler migration | Slice exceeds two weeks without deploy |
| RISK-006 | No clear access or pricing model | 4 | 4 | Product owner | Resolve HUMAN-DECISION-001 before entitlement UI | Block public launch of full access |
| RISK-007 | Existing content quality weakens trust | 4 | 3 | Content owner | Editorial inventory and approval states | Unreviewed locale cannot publish |
| RISK-008 | Hosting choice exceeds small-product budget | 3 | 4 | Product owner | Cost model and budget alarm | Monthly forecast exceeds approved cap |
| RISK-009 | Client-side AWS access remains during partial migration | 4 | 5 | Security owner | Feature flag and deny-by-default policy | Any new client AWS call blocks merge |
| RISK-010 | Telemetry captures coaching or identity data | 2 | 5 | Privacy owner | Event allowlist and log redaction tests | Privacy test failure blocks deploy |
| RISK-011 | Parallel agents change global contracts concurrently | 4 | 3 | TPM | Ownership rules and contract-first tasks | Freeze conflicting work items |
| RISK-012 | No rollback for content publication | 3 | 4 | Content owner | Immutable revisions and instant previous-version restore | Publication error uses rollback action |
| DEBT-001 | No lockfile or reproducible dependency graph | 5 | 4 | Build owner | Pin Node/package manager and commit lockfile | CI rejects lock drift |
| DEBT-002 | Deprecated Next/Webpack/AWS dependencies | 5 | 4 | Platform owner | Milestone-based replacement | Dependency scan tracks residual count |
| DEBT-003 | Mixed styling and animation systems | 5 | 3 | UI owner | Token layer and page-by-page removal | No new legacy imports |
| DEBT-004 | No automated test suite | 5 | 5 | Quality owner | Characterization tests before replacement | No migration slice without tests |
| DEBT-005 | No observability or runbooks | 5 | 5 | Reliability owner | Telemetry foundation before cutover | Launch gate remains closed |
| DEBT-006 | Manual three-location content update | 4 | 4 | Content owner | Admin and migration pipeline | Freeze direct production edits at cutover |

## One-way doors

Changing identity provider, discarding the existing user pool, selecting a new hosting/data vendor, collecting client coaching content, or monetizing access are one-way or high-cost decisions. They require an approved entry in [architecture decisions](../specs/13-architecture-decisions.md) before implementation.
