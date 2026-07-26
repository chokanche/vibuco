# Observability and reliability

## Observability requirements

| ID | Requirement | Verification |
| --- | --- | --- |
| OBS-001 | Every inbound request receives and returns a valid request ID and participates in a trace. | Integration test |
| OBS-002 | Logs are structured JSON with timestamp, severity, service, environment, route, outcome, duration, request/trace ID, and safe actor class. | Schema test |
| OBS-003 | Logs, metrics, and traces exclude secrets, tokens, cookies, contact content, signed URLs, client data, and prompt text. | Redaction test |
| OBS-004 | Core product, API, auth, media, publication, and migration operations emit RED metrics. | Dashboard review |
| OBS-005 | Product events are separated from operational telemetry and use the approved analytics allowlist. | Event contract test |
| OBS-006 | Errors use stable codes and report stack/cause internally with user-safe reference IDs. | Fault-injection test |
| OBS-007 | Traces propagate through database, identity, object storage, email, and media operations where supported. | Trace review |
| OBS-008 | Dashboards show user journey health, API health, dependency health, publication, migration, and cost/capacity. | Operational review |
| OBS-009 | Synthetics cover home, sample reveal, sign-in redirect, entitled workspace load, and readiness. | Scheduled evidence |
| OBS-010 | Alerts are symptom-based, actionable, deduplicated, and linked to an owner and runbook. | Alert game day |
| OBS-011 | SLO burn-rate alerts use fast and slow windows instead of single static thresholds. | Alert config test |
| OBS-012 | Deploy markers, deck publications, flag changes, and migrations annotate dashboards. | Staging verification |
| OBS-013 | Telemetry failure never blocks the user journey and exposes a loss counter. | Dependency fault test |
| OBS-014 | Production access to logs and rights evidence follows least privilege and is audited. | Access review |
| OBS-015 | Every severity-1/2 incident produces a timeline, impact, root cause, and tracked corrective actions. | Incident review |

## Signals

Core metrics:

- `http.server.requests` by route template, method, status class
- `http.server.duration`
- `workspace.load.success`, `workspace.load.duration`
- `deck.fetch.success`, `deck.version`
- `auth.start`, `auth.callback.success`, `auth.callback.failure`
- `media.delivery.failure`
- `publication.success`, `publication.failure`, `publication.duration`
- `contact.accepted`, `contact.rejected`
- `migration.reconciliation.mismatch`
- `telemetry.dropped`

Do not label metrics with user ID, session ID, card ID, request ID, URL, email, or arbitrary error message. Use bounded labels.

## Dashboards

1. Executive product health: active facilitators, completed sessions, successful loads.
2. Core journey: home/sample/sign-in/workspace funnels and failures.
3. Service health: request rate, errors, p50/p95/p99 latency, saturation.
4. Identity/media/dependency: Cognito, database, S3/CDN, email.
5. Content operations: draft age, validation failures, publication/rollback.
6. Migration: source/target compare, flag cohort, error/latency differential.
7. Cost/capacity: egress, image transforms, database connections/storage, logs.

## Alert policy

Page:

- multi-window availability/error-budget burn
- workspace synthetic fails from two locations/intervals
- authentication completion collapse
- unauthorized-access or secret-leak signal
- publication corrupts active deck or no valid version resolves

Ticket:

- rising p95 below burn threshold
- stale translation/publication backlog
- dependency deprecation or certificate expiry
- cost forecast anomaly

## Runbooks

Required runbooks:

- core workspace unavailable
- Cognito callback/sign-in failure
- protected media access failure
- database saturation/failover
- bad content publication and rollback
- migration mismatch
- contact/email failure
- suspected credential/token exposure
- prohibited telemetry data
- CDN/DNS rollback

Each runbook contains symptoms, impact, dashboards, immediate checks, safe mitigation, rollback, escalation, verification, and follow-up.

## Incident response

See [incident response diagram](../diagrams/incident-response.mmd). Severity is based on user/security impact, not error count alone. The incident commander and communications owner are separate for severity 1. Evidence uses UTC.
