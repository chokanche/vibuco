# Acceptance test matrix

## Product and functional

| Test ID | Requirements | Scenario | Expected result | Layer |
| --- | --- | --- | --- | --- |
| AT-001 | PRD-001, FR-001 | First-time visitor at 320 px | Audience, outcome, and sample action are clear without overflow | E2E/usability |
| AT-002 | PRD-002, FR-002, FR-003 | Anonymous sample session | Ten-card deck loads; select, reveal, shuffle, reset work | E2E |
| AT-003 | PRD-003, FR-006, FR-008, FR-011 | Entitled sign-in | User reaches full workspace and first reveal within target | E2E/performance |
| AT-004 | PRD-004, FR-012, FR-013, FR-017 | Apply each preset | Orientation and prompt state match preset matrix | Unit/E2E |
| AT-005 | FR-014 | Seeded shuffle | Same seed gives same permutation; statistical checks show no bias | Unit |
| AT-006 | FR-015, UX-005, UX-006 | Keyboard opens/closes focused card | Dialog semantics, focus trap, Escape, restore all pass | Accessibility |
| AT-007 | FR-019, PRD-006, DATA-009, DATA-010 | Inspect session schema/events | No prohibited client fields or arbitrary metadata exist | Contract/privacy |
| AT-008 | PRD-005, DATA-005 | Publish all required locales | Missing or unapproved locale blocks publication | Domain/integration |
| AT-009 | PRD-007, FR-021, FR-023, FR-024 | Editor publishes then rolls back | Immutable versions created and prior version restored | Admin E2E |
| AT-010 | PRD-008, FR-022, DATA-007 | Publish rights-incomplete asset | Action is rejected with actionable validation | Domain/E2E |
| AT-011 | FR-026, FR-027 | Submit valid/invalid/spam contact | Validation, rate limit, reference, retention work | Contract/security |
| AT-012 | FR-029, SEO-012 | Capture product event | Only allowlisted fields persist; report updates | Integration |

## Security and API

| Test ID | Requirements | Scenario | Expected result | Layer |
| --- | --- | --- | --- | --- |
| AT-013 | SEC-001, SEC-002 | Tamper state/nonce/callback | Authentication fails safely and no session is created | Security |
| AT-014 | SEC-003, API-004 | Non-entitled or wrong-role request | 401/403 without restricted-resource disclosure | Security/contract |
| AT-015 | SEC-004, MIG-011 | Inspect client bundles and network | No AWS/database credentials or direct SDK operations | Static/E2E |
| AT-016 | SEC-005, SEC-006 | XSS/injection/CSRF corpus | Inputs are rejected/encoded and mutations are protected | Security |
| AT-017 | SEC-007, SEC-018 | Inspect headers | Approved CSP and browser protections are present | Security |
| AT-018 | SEC-008, SEC-009 | Upload invalid/polyglot and reuse grant | Quarantine rejects file and grant cannot be reused | Security |
| AT-019 | API-003, API-010, SEC-015 | Force route error | Request ID correlates; logs contain no protected data | Integration |
| AT-020 | API-007 | Retry same mutation | One durable effect and same outcome are returned | Integration |
| AT-021 | API-008, SEC-010 | Exceed endpoint policy | 429 and Retry-After occur without identity disclosure | Security |

## SEO, accessibility, performance, reliability

| Test ID | Requirements | Scenario | Expected result | Layer |
| --- | --- | --- | --- | --- |
| AT-022 | SEO-001, SEO-002, SEO-003 | Crawl all target routes | Metadata, sitemap, robots, and noindex policy pass | SEO |
| AT-023 | SEO-004, MIG-004 | Crawl legacy URLs | One-hop redirect to canonical target | SEO |
| AT-024 | SEO-005, SEO-008 | Validate public markup/links | JSON-LD valid and no placeholder/broken internal links | SEO |
| AT-025 | UX-002, UX-019 | Enable reduced motion | No decorative transition blocks or moves content | Accessibility |
| AT-026 | UX-004, UX-020 | 200% zoom and touch audit | Reflow and target sizes pass | Accessibility |
| AT-027 | PRD-009, NFR-001, NFR-002, NFR-003 | Mobile lab and RUM | LCP/INP/CLS meet budgets | Performance |
| AT-028 | NFR-004, NFR-005 | Load sample/full deck API | p95 latency and error rate meet SLO | Performance |
| AT-029 | NFR-006, OBS-009 | Synthetic production journey | Availability objective and alert path pass | Reliability |
| AT-030 | PRD-010, NFR-010, MIG-015 | Restore and rollback exercise | RPO/RTO and application rollback meet targets | Recovery |

## Migration and operations

| Test ID | Requirements | Scenario | Expected result | Layer |
| --- | --- | --- | --- | --- |
| AT-031 | MIG-003 | Run legacy characterization | Preserved card behavior is captured before replacement | CI |
| AT-032 | MIG-007, MIG-008, DATA-015 | Repeat content import | Idempotent results and exact reconciliation | Migration |
| AT-033 | MIG-009 | Shadow-read production sample | Normalized target and source results match | Migration |
| AT-034 | MIG-006, MIG-015 | Auth pilot rollback | Cohort returns to legacy path without account loss | Game day |
| AT-035 | MIG-013 | Decommission readiness | No traffic/code/policy dependency remains | Operational review |

All must-priority requirements must map to at least one test before their implementation work item becomes ready.
