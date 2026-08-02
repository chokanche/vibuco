# Current production topology

Status: Recovered production baseline for `VIB-STAB-001` and `VIB-STAB-002`
Evidence captured: 2026-07-26T15:58:02Z; recovery verified 2026-07-27T20:49Z

This document describes the observable legacy production path. It does not grant
permission to change Netlify, DNS, Cognito, DynamoDB, S3, or their credentials.
All identifiers below are public DNS names, repository-defined logical resource
names, or redacted request-correlation values.

## Bounded diagnosis

As of 2026-07-27, `www.vibuco.com` passes standard certificate validation and
serves the existing application routes from Netlify. Before the repair, the
failure occurred before an application route was reached because the edge
presented a certificate for `*.netlify.app`. Standard HTTPS clients rejected
the connection with curl code 60 and the diagnostic classification
`TLS_HOSTNAME_MISMATCH`.

When certificate validation is bypassed for anonymous read-only probes, Netlify
returned HTTP 200 HTML for every required route. This proved that the sampled
static route artifacts are available behind the edge. It does not prove that
authenticated Cognito, DynamoDB, or S3 behavior is healthy.

The smallest corrective action was to remove the stale Domain.com delegation
and re-provision the existing Netlify certificate for `www.vibuco.com`. That
owner-approved production change was completed under `VIB-STAB-002`.

## Recovery evidence

At 2026-07-27 20:49 UTC, the `.com` registry delegated `vibuco.com` only to:

- `dns1.p05.nsone.net`
- `dns2.p05.nsone.net`
- `dns3.p05.nsone.net`
- `dns4.p05.nsone.net`

The stale `ns1.domain.com` and `ns2.domain.com` delegations were removed at the
registrar. Netlify then renewed and installed the Let's Encrypt certificate for
`*.vibuco.com` and `vibuco.com`; its dashboard reported HTTPS enabled and an
update time of 2026-07-27 20:49 UTC.

After CDN propagation, standard TLS validation returned result `0`. The apex
returned HTTP 301 to the `www` host, and `/`, `/cards`, `/about`, `/contact`,
and `/login` each returned HTTP 200 without a TLS bypass. A standard browser
loaded 16 anonymous cards and revealed one prompt.

## Public edge

| Layer | Observed state | Evidence |
| --- | --- | --- |
| Canonical host | `www.vibuco.com` | Repository metadata and production probes |
| DNS alias | `practical-austin-91bfaf.netlify.app` | Public CNAME response |
| DNS address response | `63.176.8.218`, `35.157.26.135` | Public A response |
| Authoritative DNS | Four Netlify/nsone nameservers | `.com` registry response |
| Hosting | Netlify static edge | Response `Server` and request-ID headers |
| Presented certificate | Let's Encrypt for `*.vibuco.com` and `vibuco.com` | Netlify certificate status and standard TLS validation |
| Certificate update | 2026-07-27 20:49 UTC | Netlify certificate status |
| Standard HTTPS result | Healthy after repair | curl code 0 and HTTP 200 on all sampled routes |

## Anonymous route evidence

The bypass below was used only to separate TLS failure from upstream HTTP
availability. No credentials, cookies, tokens, forms, or authenticated routes
were used.

| Route | Standard HTTPS | Certificate-bypassed HTTP | Provider correlation |
| --- | --- | --- | --- |
| `/` | 200 after repair | 200 before repair | Netlify request ID captured |
| `/cards` | 200 after repair | 200 before repair | Netlify request ID captured |
| `/about` | 200 after repair | 200 before repair | Netlify request ID captured |
| `/contact` | 200 after repair | 200 before repair | Netlify request ID captured |
| `/login` | 200 after repair | 200 before repair | Netlify request ID captured |

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
| DNS | CNAME, A, and NS answers | Registry delegates only to the intended Netlify authority |
| TLS/custom domain | Hostname verification | Healthy after certificate renewal |
| Netlify platform | Standard status and provider headers | Sampled static artifacts are reachable |
| Application route | Route-specific HTTP response | Anonymous load and reveal pass |
| Cognito | Auth start/callback logs | Unverified |
| DynamoDB | Scan success/failure and latency | Unverified |
| S3 | Object-read success/failure and latency | Unverified |

## Ownership and rollback

Marko is the confirmed Netlify project owner, certificate-change approver, and
rollback authority. AWS ownership remains an open escalation. Exact access
requests and unblock conditions are maintained in
[production access and ownership](production-access-ownership.md).

The last published Netlify deploy is source revision `fbaa759`. The approved
certificate-only retry does not change that artifact or DNS. Its fallback is to
stop retries and retain the published deploy while the custom domain remains
unavailable. A DNS reversal remains prohibited until registrar evidence is
captured.
