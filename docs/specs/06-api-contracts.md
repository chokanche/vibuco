# API contracts

The canonical HTTP description is [OpenAPI](../api/openapi.yaml). Internal admin mutations may use typed Server Actions, but they must follow the same validation, authorization, audit, idempotency, and error rules.

## API requirements

| ID | Requirement | Verification |
| --- | --- | --- |
| API-001 | All HTTP endpoints are under `/api/v1` and return versioned DTOs, not database records. | Contract test |
| API-002 | JSON responses use UTF-8 and errors use the shared problem envelope. | Contract test |
| API-003 | Every response includes `X-Request-Id`; callers may supply a valid request ID or receive a generated one. | Integration test |
| API-004 | Protected endpoints require a valid server session and explicit authorization. | Negative auth matrix |
| API-005 | Request bodies, path values, query values, and headers are schema-validated before use. | Fuzz and unit tests |
| API-006 | List endpoints use opaque cursor pagination and bounded limits, never unbounded scans. | Contract/performance test |
| API-007 | Mutations with retry risk require an `Idempotency-Key` retained for 24 hours. | Idempotency integration test |
| API-008 | Rate-limit responses use 429 with `Retry-After` and do not reveal account existence. | Security test |
| API-009 | Cacheable reads include ETag and honor `If-None-Match`. | Cache integration test |
| API-010 | API logs redact cookies, authorization, signed URLs, contact content, and PII. | Log-capture test |
| API-011 | External dependency timeouts are bounded within the route latency budget. | Fault-injection test |
| API-012 | Breaking changes require a new API version; additive optional fields are allowed. | Contract governance review |

## Endpoint summary

| Method | Path | Audience | Purpose |
| --- | --- | --- | --- |
| GET | `/api/v1/decks/sample` | Public | Current published sample deck |
| GET | `/api/v1/decks/current` | Entitled | Current full deck for locale |
| POST | `/api/v1/sessions` | Public/entitled | Create short-lived workspace session |
| POST | `/api/v1/sessions/{sessionId}/events` | Session holder | Record allowlisted event batch |
| POST | `/api/v1/contact` | Public | Submit validated support message |
| GET | `/api/v1/health/ready` | Platform | Dependency-aware readiness |

Admin Server Actions:

- create/update card draft
- create/update translation draft
- request/finalize asset upload
- submit card for review
- approve translation/asset/card
- validate/publish deck version
- rollback deck publication
- grant/revoke entitlement or role

## Error envelope

```json
{
  "type": "https://www.vibuco.com/problems/validation",
  "title": "Check the highlighted fields",
  "status": 422,
  "code": "VALIDATION_FAILED",
  "requestId": "req_opaque",
  "errors": [
    { "field": "email", "code": "invalid_email" }
  ]
}
```

Messages are user-safe. Internal causes and stack traces remain in telemetry linked by `requestId`.

## Rate-limit policy

| Operation | Initial policy |
| --- | --- |
| Public deck | 120 requests/minute/IP with CDN protection |
| Create session | 20/hour/IP anonymous, 60/hour/account |
| Session events | 60/minute/session, batch up to 20 |
| Contact | 5/hour/IP and 3/hour/email hash |
| Admin mutation | 120/minute/account plus audit |

Values are configuration, validated in staging, and must not be marketed as abuse guarantees.

## Degraded behavior

- If analytics persistence fails, the user action succeeds and an operational counter records loss.
- If contact email notification fails after durable storage, return accepted and retry notification operationally.
- If current full deck lookup fails, do not silently serve the public sample to an entitled session.
- If session-event ingestion fails, buffer a bounded batch in memory/session storage and retry once; discard safely after expiry.
