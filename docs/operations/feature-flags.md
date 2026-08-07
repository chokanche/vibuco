# Feature flags

Work item: `VIB-PLAT-004`

Flags are evaluated only on the server. Every definition has an owner, purpose,
expiry, and safe default. Actor cohorts use opaque server-derived IDs; client
input cannot choose a cohort. Missing, malformed, expired, or unavailable flag
data evaluates off and records a bounded audit outcome. Roll back a migration
path by setting its global value to off or allowing its expiry.
