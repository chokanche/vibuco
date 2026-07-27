# Legacy characterization coverage

Work item: `VIB-STAB-004`

Requirement mapping:

| Requirement | Characterized evidence |
| --- | --- |
| MIG-003, AT-031 | Unit and browser fixture suites run in baseline CI before replacement work |
| Anonymous public dataset | `anonymous-cards.json`, deck-table unit test, anonymous browser journey |
| Authenticated full dataset | `full-cards.json`, deck-table unit test, full-deck browser journey |
| Face-up/down | Card-back orientation helper and browser flip assertion |
| Show/hide prompt | Anonymous browser journey |
| English/Serbian/Hungarian | Locale unit assertions and full-deck browser journey |
| Randomization and numbering | Injected shuffle permutation assertion and card-ID order assertion |
| Routes | Filesystem smoke for `/`, `/cards`, `/about`, `/contact`, and `/login` |

Fixtures use opaque synthetic IDs and synthetic prompt markers. Test output names
only the route or state under test and does not print production prompts, tokens,
contact data, signed asset URLs, or account information.

See [KNOWN_DEFECTS.md](KNOWN_DEFECTS.md) for behaviors that are observed but are
not part of the target preservation contract.
