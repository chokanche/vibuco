# Telemetry foundation

Work item: `VIB-PLAT-003`
Requirements: OBS-001 through OBS-007, OBS-013, SEC-015

## Contract

Target route handlers use `instrumentRequest` from
`src/platform/telemetry/request-instrumentation.ts`. It creates or propagates
the request and trace IDs, returns both in response headers, and records a
bounded request-completion signal. The schema contains only timestamp,
severity, service, environment, route template, method, status class, outcome,
duration, correlation IDs, actor class, and an optional stable error code.

The foundation rejects arbitrary routes, methods, durations, and error text.
It has no product-event API; product analytics remains a separate allowlisted
contract.

## Failure behavior

Exporter errors are caught, increment `telemetry.dropped`, and cannot change
the route response. Provider adapters are deferred pending
`HUMAN-DECISION-002`; they receive only the typed signal and must not add raw
request headers, cookies, URLs, identities, or content.

## Rollback

Remove the route wrapper or exporter adapter while retaining correlation
headers. The legacy static routes remain independent. See
[telemetry unavailable](../runbooks/telemetry-unavailable.md) for the
operational response.
