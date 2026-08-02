# Legacy defects excluded from the preservation contract

`VIB-STAB-004` records behavior needed during replacement. The suite does not
turn the following current defects into target requirements:

- The production card lightbox is not exposed as a named dialog and does not
  demonstrate a focus trap, Escape close, or focus restoration.
- Gallery images do not consistently expose useful alternative text before the
  reveal view.
- Random order is delegated to unseeded `lodash.shuffle`, so an individual
  order cannot be reproduced.
- The authenticated browser downloads complete protected image objects and
  converts them to data URLs.
- The legacy language control and switch do not yet meet the target component
  contracts.
- The legacy route remains large and combines authentication, data access,
  transforms, state, and rendering.

Target behavior remains authoritative in the product, accessibility, security,
architecture, and interaction specifications.
