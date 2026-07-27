# Core workspace unavailable

Status: Validated during the 2026-07-27 legacy production recovery
Primary diagnostic code: `TLS_HOSTNAME_MISMATCH`

## Symptoms

- A standard browser refuses to open `https://www.vibuco.com`.
- curl returns code 60 and HTTP 000 with a certificate hostname mismatch.
- The presented certificate identifies `*.netlify.app`, not `www.vibuco.com`.
- A certificate-bypassed anonymous probe may still receive HTTP 200 from
  Netlify.

Do not ask a user to bypass the browser warning. Do not use bypassed TLS with
credentials, cookies, tokens, contact data, or authenticated routes.

## Impact

All users are blocked before Vibuco can present its own error or recovery state.
The browser security warning is understandable as a safety failure, but it is
not a product-controlled accessible recovery experience. Anonymous route
availability behind the edge does not reduce the user impact.

## Correlation signals

Record all times in UTC:

- affected hostname and route
- standard-client error and HTTP status
- DNS CNAME, A, and authoritative NS answers
- certificate subject, issuer, validity, and subject alternative names
- Netlify request ID from an anonymous bypassed probe, when policy permits
- latest production deploy ID and timestamp, when provider access exists
- bounded outcome: DNS, TLS/custom domain, platform, route, Cognito, DynamoDB,
  or S3

Never record tokens, cookies, email addresses, contact content, prompt text,
account data, signed URLs, or raw authenticated responses.

## Immediate checks

1. Run a standard HTTPS request to `/` and record the UTC timestamp.
2. Repeat for `/cards`, `/about`, `/contact`, and `/login`.
3. Inspect public DNS CNAME, A, and NS answers.
4. Inspect the certificate presented with SNI for `www.vibuco.com`.
5. If permitted, issue one anonymous certificate-bypassed request per route to
   determine whether Netlify returns an HTTP response.
6. If standard TLS succeeds but a route fails, capture its status, safe
   provider request ID, and retry behavior.
7. Use provider or AWS logs only with approved read access.

## Decision tree

| Observation | Classification | Next owner |
| --- | --- | --- |
| DNS does not resolve or points away from intended provider | DNS | DNS administrator |
| Certificate does not cover `www.vibuco.com` | TLS/custom domain | Netlify and DNS owners |
| TLS succeeds but Netlify returns platform 5xx for all routes | Hosting platform | Netlify owner |
| Only one static route fails | Application artifact/route | Deployment owner |
| Auth start or callback fails | Cognito | AWS identity owner |
| Workspace loads indefinitely during metadata fetch | DynamoDB/browser adapter | AWS data owner |
| Metadata loads but protected images fail | S3/browser adapter | AWS media owner |

## Safe mitigation

Before any production change, record:

- named system owner and incident change approver
- exact intended change and blast radius
- current DNS and Netlify custom-domain state
- previous known-good deploy or configuration state
- reversal steps
- verification probes
- maximum rollback decision time

For the confirmed current symptom, the candidate mitigation is to correct the
Netlify custom-domain/DNS association and provision a certificate covering
`www.vibuco.com`. This runbook does not authorize that change.

Do not widen IAM, expose new runtime configuration, disable certificate
validation, publish a temporary insecure endpoint, or redesign the cards route
during incident repair.

## Rollback

The change owner must choose the rollback that matches the approved change:

- DNS: restore the recorded prior record and TTL.
- Netlify custom domain: restore the prior domain attachment and certificate
  configuration.
- Deploy: promote the recorded previous immutable Netlify deploy.
- Application-only fix: restore the previous production artifact.

If no previous state or immutable artifact has been confirmed, stop before
mutation and escalate. DNS propagation is not proof of recovery; use standard
TLS and route probes.

### 2026-07-27 change record

Approved change: remove `ns1.domain.com` and `ns2.domain.com` from the registrar
delegation while preserving all four `dns*.p05.nsone.net` nameservers, then ask
Netlify to renew the existing certificate. Marko was the change approver and
rollback authority.

The pre-change six-server list was captured in both the registrar and the
`.com` registry response. The registrar accepted the four-server replacement,
the registry then returned only the four Netlify nameservers, and Netlify
installed a valid certificate. No DNS records, IAM policies, deploys, runtime
configuration, or application content were changed.

Rollback was verified as an available, bounded registrar operation using the
captured values and the same nameserver editor used for the repair. It was not
executed because restoring the two Domain.com authorities would deliberately
reintroduce split authority and the confirmed certificate outage. If a Netlify
DNS fault requires rollback, Marko may restore the exact six-server list below
within the 15-minute decision window and must rerun every verification probe:

- `ns1.domain.com`
- `ns2.domain.com`
- `dns1.p05.nsone.net`
- `dns2.p05.nsone.net`
- `dns3.p05.nsone.net`
- `dns4.p05.nsone.net`

Prefer repairing the four-server Netlify authority over rollback when it remains
reachable, because the prior mixed delegation is known-bad.

## Verification

Recovery requires all of the following:

1. Standard certificate validation succeeds for `www.vibuco.com`.
2. `/`, `/cards`, `/about`, `/contact`, and `/login` return their expected
   public responses without a TLS bypass.
3. The browser displays the Vibuco response without a security warning.
4. The anonymous `/cards` experience reaches its content-ready state.
5. An approved authenticated synthetic verifies workspace load and one reveal
   without recording coaching content. Until an approved non-human test account
   exists, the scheduled guard covers the anonymous public sample and the
   authenticated dependency path is exercised with synthetic fault fixtures.
6. Error and latency signals remain within the stabilization thresholds.

## Escalation

Use the requests in
[production access and ownership](../operations/production-access-ownership.md):

- `ACCESS-VIB-STAB-001-001` for Netlify deployment, domain, and rollback facts
- `ACCESS-VIB-STAB-001-002` for DNS zone ownership and intended records
- `ACCESS-VIB-STAB-001-003` for Cognito, DynamoDB, and S3 read-only evidence
- `ACCESS-VIB-STAB-001-004` for the production change approver and rollback
  decision authority

Escalate immediately if a certificate or DNS change was unexpected, provider
logs indicate unauthorized access, or evidence contains prohibited data.

## Follow-up

- Repair and monitor public availability in `VIB-STAB-002` after its production
  change gate is satisfied.
- Establish the reproducible build baseline in `VIB-STAB-003`.
- Add scheduled synthetics, structured correlation, and stable user-safe errors
  without freezing legacy accessibility defects.

## Scheduled guard

`.github/workflows/cards-synthetic.yml` runs every 15 minutes and can also be
started manually. It opens the production `/cards` route in Chromium, waits for
the anonymous gallery, reveals one card, and emits only structured status,
duration, route, request/trace ID, and actor classification. It never prints
prompt text, image URLs, credentials, or contact data.

The route adapter rejects missing AWS configuration, credential failures,
DynamoDB errors, and a 10-second dependency timeout. The page replaces the
indefinite loader with a named alert and keyboard-reachable retry action.
