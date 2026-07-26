# Search and ranking

## Decision

Vibuco v1 does not need a search engine. The curated library is small and bounded. PostgreSQL queries plus client-side filtering of the already authorized deck are sufficient.

## Supported discovery

Facilitators can narrow the loaded deck by:

- approved locale
- theme
- prompt visibility suitability
- orientation suitability, when editorially tagged

No public global card search is exposed. Protected card metadata must not leak through search or indexing.

## Card order

Deck publication stores an explicit editorial order. Workspace default order uses a deterministic Fisher-Yates shuffle seeded by the workspace session. This provides:

- reproducible troubleshooting
- unbiased selection
- stable face-down numbers for a session
- no database-random-order performance cost

The seed is opaque and cannot encode identity.

## Filter behavior

- Filters combine with AND across dimensions and OR within a dimension.
- Filtering does not mutate the canonical deck.
- Clearing filters restores the same seeded order.
- Locale fallback is approved English with a visible disclosure.
- An empty result offers "Clear filters" and retains selected locale.

## Ranking policy

There is no behavioral personalization, sponsored ranking, popularity ranking, or AI recommendation in v1. Public sample membership and order are editorial decisions captured in a published deck version.

## Performance

- Server deck query uses deck-version and locale indexes.
- The server returns only authorized DTO fields.
- A full deck response target is at most 100 cards and 250 kB JSON uncompressed.
- Image bytes are never embedded in JSON.
- Any future library above 500 active cards requires a new architecture review before introducing full-text search.

## Analytics safeguards

Selection frequency may be aggregated by card and deck version for editorial quality, but events do not include client identity, prompt response, or free text. Low-volume reports must suppress identifiable facilitator-level breakdowns.
