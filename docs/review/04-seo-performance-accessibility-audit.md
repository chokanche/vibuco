# SEO, performance, and accessibility audit

## SEO

| Finding ID | Current evidence | Impact | Severity | Action |
| --- | --- | --- | --- | --- |
| SEOA-001 | Global and partial `next-seo` metadata only | Duplicate or weak titles/descriptions | High | Route metadata contracts |
| SEOA-002 | No sitemap, robots source, or canonical implementation in repository | Crawl and duplicate-control uncertainty | High | Generate all three |
| SEOA-003 | No structured data | Expertise and organization context are opaque | Medium | Add Organization and WebApplication JSON-LD |
| SEOA-004 | Legal links point to `#` | Trust and crawl dead ends | Critical | Publish real legal routes |
| SEOA-005 | Long generic home copy and external blog cards | Weak topical focus and broken-link risk | Medium | Curated content architecture |
| SEOA-006 | Auth and utility routes are indexable by default | Thin/duplicate index risk | Medium | `noindex` utility routes |

## Performance

| Finding ID | Current evidence | Impact | Severity | Action |
| --- | --- | --- | --- | --- |
| PERFA-001 | `/cards` first load is 927 kB JavaScript | Slow interaction on mobile | Critical | Server boundary and client-island budget |
| PERFA-002 | CSS is 293 kB and Tailwind purge is absent | Render delay and unused transfer | High | Replace token pipeline |
| PERFA-003 | Protected images are fetched as full S3 objects and base64 encoded | High memory, no CDN caching | Critical | Responsive variants and signed delivery |
| PERFA-004 | Three animation systems plus sliders/galleries | Main-thread and bundle cost | High | One small motion approach |
| PERFA-005 | Remote and local images lack a unified optimization strategy | Layout shift and waste | High | Image contract with dimensions |
| PERFA-006 | Production core route returns 502 | Availability dominates all speed metrics | Critical | Synthetic checks and rollback |

## Accessibility

| Finding ID | Current evidence | Impact | Severity | Action |
| --- | --- | --- | --- | --- |
| A11Y-001 | Card gallery and dialog are click-only | Core product unusable by keyboard | Critical | Semantic buttons and dialog |
| A11Y-002 | Full-screen motion blocks scroll; no reduced-motion path | Vestibular and control issue | High | Remove and honor preferences |
| A11Y-003 | Form placeholders act as labels | Inputs lack persistent names | High | Explicit labels and errors |
| A11Y-004 | Dialog lacks focus management and Escape | Focus can escape or be lost | Critical | WCAG dialog behavior |
| A11Y-005 | Global `<Html lang="en">` ignores selected prompt locale | Incorrect pronunciation | High | Per-content language attributes |
| A11Y-006 | Generic image alt text and decorative images are not distinguished | No useful nonvisual equivalent | Medium | Editorial alt rules |
| A11Y-007 | No skip link or documented heading contract | Repetitive navigation cost | Medium | Structural navigation requirements |
| A11Y-008 | No automated or manual accessibility tests | Defects cannot be gated | Critical | axe plus keyboard/screen-reader matrix |

## Target budgets

The target budgets and acceptance methods are defined in [non-functional requirements](../specs/21-non-functional-requirements-slos.md). The workspace client JavaScript budget is 220 kB compressed per initial route, excluding framework runtime, and marketing routes target 120 kB. Public LCP must be at most 2.5 seconds at the 75th percentile on mobile.
