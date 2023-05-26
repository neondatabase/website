### What's new

- Compute: Added support for the `pg_prewarm` PostgreSQL extension, which utilizes the above-mentioned sequential scan prefetch feature. The `pg_prewarm` extension provides a convenient way to load data into the PostgreSQL buffer cache after a cold start. For information about PostgreSQL extensions supported by Neon, see [PostgreSQL extensions](/docs/extensions/pg-extensions).
- Compute: Updated supported PostgreSQL versions to 14.6 and 15.1, respectively.
