# SEO, content, and analytics

## SEO requirements

| ID | Requirement | Verification |
| --- | --- | --- |
| SEO-001 | Every indexable route has a unique title, description, canonical URL, and social image. | Rendered metadata test |
| SEO-002 | The application generates valid `robots.txt` and XML sitemap from the route policy. | Parser and E2E test |
| SEO-003 | Auth, workspace, admin, callbacks, errors, and utility routes use `noindex, nofollow`. | Crawler test |
| SEO-004 | Public legacy URLs use one-hop permanent redirects to canonical targets. | Redirect matrix |
| SEO-005 | Public pages emit valid Organization and WebApplication JSON-LD; FAQs are used only when visible content qualifies. | Rich-results/schema test |
| SEO-006 | Public pages have exactly one descriptive H1 and logical heading order. | DOM test |
| SEO-007 | Image metadata includes width, height, meaningful alt text or empty alt for decorative images. | Content validation |
| SEO-008 | Internal links contain crawlable anchors and no `#` placeholders. | Link crawler |
| SEO-009 | Locale expansion must use canonical locale URLs and reciprocal `hreflang`. | International SEO test |
| SEO-010 | Publication must block thin, duplicate, unapproved, or rights-uncleared public content. | Workflow test |
| SEO-011 | Structured content changes invalidate tagged page caches and sitemap when needed. | Publication integration test |
| SEO-012 | Core Web Vitals and indexed-page coverage are reviewed at launch and monthly. | Operational review |

## Content architecture

Authoritative content types:

- Product page section
- Method/exercise summary
- Testimonial
- Team profile
- Curated external article
- Legal page
- Card prompt translation
- Asset metadata

Public content is not edited in source after the admin content system is active. Until then, content changes use reviewed repository pull requests.

## Editorial workflow

Draft, editorial review, legal/rights review where applicable, preview, approve, publish, observe, and optionally roll back. English is the source locale. Translations record reviewer and approval independently. Automated translation may be used only as an unpublished draft and is not part of v1 implementation.

## Analytics event model

Allowed product events:

- `sample_started`
- `sample_card_revealed`
- `sign_in_started`
- `sign_in_completed`
- `workspace_loaded`
- `preset_selected`
- `card_revealed`
- `session_completed`
- `workspace_error`
- `contact_submitted`
- `content_published`
- `content_rolled_back`

Allowed dimensions are event schema version, deck version, card ID where needed, locale, preset, anonymous/authenticated actor class, route, outcome, duration bucket, device class, and error code. No name, email, token, prompt text, signed URL, client information, or arbitrary properties are allowed.

## Measurement definitions

| Metric | Definition |
| --- | --- |
| Weekly active facilitator | Distinct entitled account with `workspace_loaded` in seven days |
| Completed session | Session with reveal and explicit `session_completed` |
| Sample conversion | Visitors with sample reveal divided by sample starts |
| Access conversion | Completed sign-ins divided by sign-in starts |
| First-reveal time | Workspace loaded to first card reveal |
| Successful load rate | `workspace_loaded` divided by workspace load attempts |

Analytics must not block product behavior. Event schema changes require privacy review and a version increment.

## Content migration

Existing homepage, testimonials, team profiles, blog links, five exercises, card prompts, and assets require an inventory. Repetition, template copy, stale roles, broken links, and language issues are fixed before import. No old content is published merely because it exists.
