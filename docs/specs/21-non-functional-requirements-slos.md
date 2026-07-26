# Non-functional requirements and SLOs

## Requirements

| ID | Requirement | Target | Acceptance |
| --- | --- | --- | --- |
| NFR-001 | Public mobile LCP | <= 2.5 s p75 | RUM and lab |
| NFR-002 | Public/workspace INP | <= 200 ms p75 | RUM |
| NFR-003 | Public/workspace CLS | <= 0.1 p75 | RUM |
| NFR-004 | Deck API latency | Public p95 <= 400 ms; entitled p95 <= 700 ms | Load test/APM |
| NFR-005 | Mutation latency | p95 <= 800 ms excluding media processing | Load test/APM |
| NFR-006 | Core product availability | 99.9% monthly for sample and entitled workspace load | SLI |
| NFR-007 | Authentication completion availability | 99.5% monthly excluding Cognito declared outage | SLI |
| NFR-008 | Publication integrity | 99.99% successful atomic active-version resolution | SLI |
| NFR-009 | Accessibility | WCAG 2.2 AA, no critical axe/manual blocker | Audit |
| NFR-010 | Recovery | RPO <= 15 min; RTO <= 2 h for data service | Restore exercise |
| NFR-011 | Deployment rollback | Previous application artifact restored <= 15 min | Game day |
| NFR-012 | Content rollback | Previous deck version active <= 5 min | Admin E2E |
| NFR-013 | Client JavaScript | Marketing <= 120 kB; workspace <= 220 kB compressed, excluding framework runtime | Bundle CI |
| NFR-014 | Deck payload | <= 250 kB uncompressed for <= 100 cards, no image bytes | Contract test |
| NFR-015 | Image delivery | Responsive variants, explicit dimensions, no original by default | Network test |
| NFR-016 | Scalability | 50 concurrent sessions and 10x current unknown baseline without SLO breach | Load test |
| NFR-017 | Browser support | Latest two stable Chrome, Safari, Firefox, Edge; current iOS/Android browser | Cross-browser E2E |
| NFR-018 | Data integrity | Foreign keys/checks/unique constraints plus daily backup validation | DB test |
| NFR-019 | Security patching | Critical actionable dependency issue <= 48 h; high <= 14 days | Security SLA |
| NFR-020 | Cost control | Monthly forecast and anomaly alert; cap approved under HUMAN-DECISION-002 | FinOps review |

## Service-level indicators

Successful sample load:

`valid sample responses / eligible sample requests`

Successful workspace load:

`authorized responses resolving a valid deck / eligible authorized workspace requests`

Authentication completion:

`valid session establishments / valid callback attempts`

Publication integrity:

`active deck resolutions returning a complete immutable version / active deck resolution attempts`

User validation errors, denied unauthorized access, robots, and planned maintenance windows announced at least 72 hours ahead are excluded only according to an approved SLO policy. Dependency failures are not automatically excluded.

## Error budgets

At 99.9%, the monthly core-product error budget is about 43.8 minutes in a 30.4-day month. Fast burn pages when 2% of monthly budget is consumed in one hour; slow burn alerts when 5% is consumed over six hours. Exact multi-window ratios are configured from the selected telemetry platform.

If 50% of the monthly error budget is consumed, freeze non-reliability releases. If exhausted, only incident, security, recovery, or approved risk-reduction changes may deploy until review.

## Capacity assumptions

The current product has no reliable traffic baseline. Initial testing assumes 50 concurrent active sessions, 100-card decks, 15 session events/minute/session, five admin users, and two publications/day. Instrument production before revising capacity. Design does not pre-provision for speculative mass scale.

## Graceful degradation

- Public marketing remains available when Cognito is unavailable.
- Loaded immutable sessions remain interactive during brief server/network failure.
- Analytics loss does not block the session.
- Contact notification loss does not lose an accepted durable submission.
- Admin and publication may be unavailable without affecting current workspace reads.
- Protected full content never degrades into unauthorized public access.

## Backup and disaster recovery

Use point-in-time database recovery, daily backup validation, versioned/replicated media according to provider capability, exported infrastructure/configuration, and immutable application artifacts. Quarterly restore exercises verify a fresh environment, data point, media access, active deck, and authentication configuration.
