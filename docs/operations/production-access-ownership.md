# Production access and ownership

Status: Bootstrap checklist for `VIB-STAB-001`

This document separates work that can start safely from production actions that
require an identified owner. Do not place credentials, tokens, signed URLs,
personal data, or private log payloads in this file.

## Known read-only evidence

At 2026-07-26T14:48Z, a read-only production check reported:

- browsers rejected `www.vibuco.com` because it presented a `*.netlify.app`
  certificate
- certificate-bypassed requests returned HTTP 200 from Netlify for `/`,
  `/cards`, `/about`, `/contact`, and `/login`
- the immediate public failure is bounded to custom-domain/TLS configuration
- authenticated behavior and AWS-backed content health remain unverified

At 2026-07-26T21:05Z, authenticated Netlify inspection confirmed:

- the project belongs to Marko's `chokanche` Netlify team
- production deploys map to the `chokanche/vibuco` GitHub repository and
  `master`
- the last published production deploy is source revision `fbaa759`; later
  revisions `962d263` and `660c111` failed during the build stage
- the Let's Encrypt certificate for `*.vibuco.com` and `vibuco.com` expired on
  2025-09-26 because certificate validation found stale challenge records
- public recursive resolvers temporarily disagreed between the old Domain.com
  nameservers and the configured Netlify nameservers, so no DNS mutation is safe
  during propagation

This evidence is a starting point, not permission to mutate Netlify, DNS, or AWS.

## Access matrix

`VIB-STAB-001` must replace every `Unconfirmed` value with a confirmed owner or a
named escalation request. An unconfirmed owner does not block public diagnostics
or documentation. It blocks the corresponding private read or mutation.

| System | Current evidence | Read capability needed | Mutation capability needed | Owner or escalation target | Status |
| --- | --- | --- | --- | --- | --- |
| Netlify site/project | Authenticated project and deploy history | Confirmed | Certificate renewal, deploy, rollback | Marko, `chokanche` team | Confirmed |
| DNS for `vibuco.com` | Split recursive answers during delegation to Netlify DNS | Netlify zone confirmed; registrar state inferred from propagation | No DNS mutation while resolvers disagree | Marko, change approver; registrar access not used | Partially confirmed |
| Certificate/custom domain | Expired Let's Encrypt certificate and stale challenge error | Confirmed | Renew after delegation converges | Marko | Confirmed |
| Source deployment mapping | `chokanche/vibuco`, branch `master`, last published `fbaa759` | Confirmed | Production branch/build settings | Marko, `chokanche` team | Confirmed |
| Cognito | Client configuration exists in legacy repository | Pool/client configuration and auth logs | Client/callback/policy changes | `ACCESS-VIB-STAB-001-003` | Escalation recorded |
| DynamoDB | Browser scan path exists in legacy code | Table description and redacted failure metrics | Table, index, policy, or data changes | `ACCESS-VIB-STAB-001-003` | Escalation recorded |
| S3 | Browser object path exists in legacy code | Bucket policy/CORS and redacted access metrics | Policy, CORS, lifecycle, or object changes | `ACCESS-VIB-STAB-001-003` | Escalation recorded |
| Rollback authority | Last published deploy `fbaa759`; Netlify subdomain remains the fallback verification path | Confirmed for deploy and certificate-retry scope | Promote prior deploy or stop certificate retry; DNS reversal requires registrar evidence | Marko | Confirmed |

## Named escalation requests

| Request | Escalation target | Requested capability | Unblock condition |
| --- | --- | --- | --- |
| `ACCESS-VIB-STAB-001-001` | Product owner to route to the Netlify account owner | Read deployment history, build logs, custom-domain state, source mapping, and previous deploy; identify the mutation owner | Account owner and read evidence are recorded |
| `ACCESS-VIB-STAB-001-002` | Product owner to route to the domain registrant or DNS administrator | Confirm zone ownership, intended records, TTLs, and DNS rollback procedure | DNS owner and intended/previous records are recorded |
| `ACCESS-VIB-STAB-001-003` | Product owner to route to the AWS account owner | Read-only Cognito configuration/auth failures, DynamoDB table status/failures, and S3 policy/access failures | AWS owner and redacted dependency evidence are recorded |
| `ACCESS-VIB-STAB-001-004` | Product owner | Name the incident change approver, rollback operator, previous known-good state, and maximum decision time | Production-change gate is fully assigned |

## Approved certificate change

Change approver and rollback authority: Marko.

The approved change is limited to asking Netlify to renew the automatic
certificate after public nameserver answers converge on the configured Netlify
nameservers. It does not authorize a DNS record, nameserver, deploy, IAM, Cognito,
DynamoDB, S3, or application-data change.

Blast radius is TLS termination for `vibuco.com` and `www.vibuco.com`. The
operation does not alter the published application artifact. Verification starts
immediately after issuance; the maximum decision time is 15 minutes. If renewal
fails or verification regresses, stop retries, make no DNS change, retain the
last published deploy `fbaa759`, and use the Netlify subdomain only for internal
diagnosis while the custom domain remains unavailable.

## Safe diagnostic sequence

1. Record UTC timestamps, DNS answers, certificate subject/SAN/issuer/expiry,
   HTTP status, redirect chain, response headers, and provider identity.
2. Probe `/`, `/cards`, `/about`, `/contact`, and `/login` with normal
   certificate validation.
3. If policy permits, use a certificate-bypassed request only to distinguish
   edge/TLS failure from upstream HTTP behavior. Never use bypassed TLS for
   authenticated requests or credentials.
4. Correlate Netlify deployment/build logs and AWS dependency logs only after
   read access is granted.
5. Update `docs/operations/current-production-topology.md` and
   `docs/runbooks/core-workspace-unavailable.md`.
6. End `VIB-STAB-001` with one bounded diagnosis, explicit unknowns, and the
   smallest recommended corrective action. Do not apply the correction in that
   task.

## Production-change gate

`VIB-STAB-002` may become `ready` only when all of the following are recorded:

- named Netlify/DNS/AWS owner for the diagnosed layer
- person authorized to approve the production change
- exact intended change and blast radius
- previous known-good state or reversal procedure
- verification probes
- maximum rollback decision time

If these are missing, keep `VIB-STAB-002` `planned`; complete
`VIB-STAB-001` with the access request and promote `VIB-STAB-003`.
