### We are sunsetting pg_embedding in favor of pgvector

Neon's `pg_embedding` extension was the first to introduce the Hierarchical Navigable Small World (HNSW) index to Postgres, but with the recent addition of HNSW to `pgvector`, we see little benefit to the Postgres community in continuing development of the `pg_embedding` extension`.

After careful consideration, we believe it is in the best interest of our users and the broader Postgres community to sunset `pg_embedding` and continue our effort in the vector search space by contributing to `pgvector`.

As a result, we will no longer be committing to `pg_embedding` and will direct our efforts toward `pgvector` instead.

For those of you who are using `pg_embedding`, rest assured you will still be able to continue using it on Neon. However, we strongly encourage you to migrate to `pgvector`. You can find the migration instructions in our documentation. See [Migrate from pg_embedding to pgvector](https://neon.tech/docs/extensions/pg_embedding#migrate-from-pgembedding-to-pgvector).

For more about our decision to sunset `pg_embedding` and what comes next for Neon in the vector search space, please refer to our blog post: [We’re sunsetting pg_embedding in favor of pgvector](https://neon.tech/blog/sunset-pgembedding).

### Fixes & improvements

- Compute: With the announcement regarding sunsetting of `pg_embedding` in favor of `pgvector`, Neon does not support new installations of the `pg_embedding` extension.
- Proxy: The timing of connection retries from Neon proxy was adjusted to reduce connection wait times. The previous retry timing configuration could have resulted in making clients wait hundreds of milliseconds longer than necessary.
