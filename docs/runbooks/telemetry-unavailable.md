# Telemetry unavailable

Work item: `VIB-PLAT-003`

## Symptoms and impact

The `telemetry.dropped` counter increases or the telemetry exporter reports an
outage. User requests remain available; operational visibility is reduced.

## Immediate checks

1. Confirm application requests still return their `x-request-id` header.
2. Check the exporter dependency health and recent deploy markers.
3. Inspect only request IDs, trace IDs, route templates, and stable error codes.

## Safe mitigation and rollback

Disable or roll back the exporter adapter only. Do not log raw request headers,
cookies, signed URLs, prompts, client data, or configuration values to replace
the missing telemetry. The provider-neutral foundation can remain enabled.

## Escalation and verification

Escalate to the reliability owner if loss persists through two observation
windows. Verify recovery when exporter delivery succeeds and `telemetry.dropped`
stops increasing for the same request volume.
