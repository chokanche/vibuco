# Current production topology

Status: Read-only baseline for `VIB-STAB-001`
Evidence captured: 2026-07-26T15:58:02Z

This document describes the observable legacy production path. It does not grant
permission to change Netlify, DNS, Cognito, DynamoDB, S3, or their credentials.
All identifiers below are public DNS names, repository-defined logical resource
names, or redacted request-correlation values.

## Bounded diagnosis

`www.vibuco.com` currently fails before an application route is reached because
the edge presents a certificate for `*.netlify.app`. Standard HTTPS clients
reject the connection with curl code 60 and the diagnostic classification
`TLS_HOSTNAME_MISMATCH`.

When certificate validation is bypassed for anonymous read-only probes, Netlify
returns HTTP 200 HTML for every required route. This proves that the sampled
static route artifacts are available behind the edge. It does not prove that
authenticated Cognito, DynamoDB, or S3 behavior is healthy.

The smallest recommended corrective action is for the Netlify and DNS owners to
verify the custom-domain attachment and DNS state, then re-provision a
certificate covering `www.vibuco.com`. That production change belongs to
`VIB-STAB-002` after its owner and rollback authority are confirmed.

## Public edge

| Layer | Observed state | Evidence |
| --- | --- | --- |
| Canonical host | `www.vibuco.com` | Repository metadata and production probes |
| DNS alias | `practical-austin-91bfaf.netlify.app` | Public CNAME response |
| DNS address response | `63.176.8.218`, `35.157.26.135` | Public A response |
| Authoritative DNS | `ns1.domain.com`, `ns2.domain.com` | Public NS response |
| Hosting | Netlify static edge | Response `Server` and request-ID headers |
| Presented certificate | `CN=*.netlify.app` | TLS handshake |
| Certificate issuer | DigiCert Global G2 TLS RSA SHA256 2020 CA1 | TLS handshake |
| Certificate validity | 2026-02-16 through 2027-03-19 UTC | TLS handshake |
| Standard HTTPS result | Rejected before HTTP | curl code 60 on all sampled routes |

## Anonymous route evidence

The bypass below was used only to separate TLS failure from upstream HTTP
availability. No credentials, cookies, tokens, forms, or authenticated routes
were used.

| Route | Standard HTTPS | Certificate-bypassed HTTP | Provider correlation |
| --- | --- | --- | --- |
| `/` | curl 60, HTTP 000 | 200 HTML | Netlify request ID captured |
| `/cards` | curl 60, HTTP 000 | 200 HTML | Netlify request ID captured |
| `/about` | curl 60, HTTP 000 | 200 HTML | Netlify request ID captured |
| `/contact` | curl 60, HTTP 000 | 200 HTML | Netlify request ID captured |
| `/login` | curl 60, HTTP 000 | 200 HTML | Netlify request ID captured |

Request IDs are intentionally not retained in this repository. The capture
timestamp and route are the safe correlation keys until provider log access is
granted.

## Build and runtime path

The repository contains a Next.js 9 Pages Router application exported as static
HTML and assets. `package.json` defines:

- `npm run build` through `scripts/run-next.js build`
- `npm run export` as build followed by Next.js export
- `npm run start` for the legacy Next.js server path

The public responses expose a Netlify-hosted static Next.js build. The exact
Netlify build command, publish directory, source commit, production branch, and
previous immutable deploy are not stored in the repository. Access request
`ACCESS-VIB-STAB-001-001` covers those deployment facts.

## Identity and content path

The legacy browser path is:

1. `_app.js` configures Amplify Auth from public runtime configuration.
2. Cognito supplies identity credentials to the browser.
3. `actions/getDataFromDDBTable.js` scans `vibuco-photos-public` for anonymous
   metadata or `vibuco-photos` for authenticated metadata.
4. Anonymous cards combine DynamoDB metadata with checked-in static images.
5. Authenticated cards read objects from the configured common S3 bucket and
   convert complete object bodies to browser data URLs.

Repository configuration names the Cognito region, user pool, app client,
identity pool, redirect URLs, and public/common bucket names through environment
variables. Values are not repeated here. AWS configuration and dependency logs
remain unverified pending `ACCESS-VIB-STAB-001-003`.

## Failure boundaries

| Boundary | Signal | Current conclusion |
| --- | --- | --- |
| DNS | CNAME, A, and NS answers | DNS resolves to Netlify; zone intent is unverified |
| TLS/custom domain | Hostname verification | Confirmed public blocker |
| Netlify platform | Bypassed status and provider headers | Sampled static artifacts are reachable |
| Application route | Route-specific HTTP response | No separate anonymous route failure observed behind bypass |
| Cognito | Auth start/callback logs | Unverified |
| DynamoDB | Scan success/failure and latency | Unverified |
| S3 | Object-read success/failure and latency | Unverified |

## Ownership and rollback

Provider, DNS, AWS, deployment, and rollback owners are not represented in the
repository. Exact escalation requests and unblock conditions are maintained in
[production access and ownership](production-access-ownership.md).

The current rollback target is also unknown. No production change should be
approved until the previous Netlify deploy, previous DNS/custom-domain state,
verification probes, change approver, and maximum rollback decision time are
recorded.

