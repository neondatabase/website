---
title: The pg_search extension
subtitle: Deprecated BM25 full-text search extension (ParadeDB)
summary: >-
  The `pg_search` extension by ParadeDB added BM25 full-text search to Postgres.
  It was deprecated for new Neon projects on March 19, 2026, and retired from
  existing projects on September 21, 2026. Its replacement for BM25 search is the
  `lakebase_text` extension; other alternatives include tsvector, pg_trgm, and
  pgvector.
tag: deprecated
updatedOn: '2026-09-27T23:19:01.102Z'
redirectFrom:
  - /guides/pg-search
  - /guides/pg-search/
  - /guides/pg-search-vs-tsvector
  - /guides/pg-search-vs-tsvector/
---

<Admonition type="warning" title="Neon's support for pg_search has been removed.">

`pg_search` was deprecated for new Neon projects on March 19, 2026.

**If you used `pg_search`:** the extension was retired from existing projects on September 21, 2026. Its replacement for BM25 search on Neon is `lakebase_text`; see [Migrate from pg_search to lakebase_text](/docs/extensions/migrate-pg-search-to-lakebase-text).

Depending on your use case, consider these alternatives:

- **Full-text search**: PostgreSQL's built-in [`tsvector`/`tsquery`](https://www.postgresql.org/docs/current/textsearch.html)
- **Fuzzy search**: [`pg_trgm`](https://www.postgresql.org/docs/current/pgtrgm.html) for similarity and pattern matching
- **Semantic/vector search**: [`pgvector`](/docs/extensions/pgvector) for embedding-based search
- **BM25 search**: [`lakebase_text`](/docs/extensions/lakebase-text), a BM25 index for Neon, fully compatible with `tsvector`; or [ParadeDB](https://www.paradedb.com/) for continued `pg_search` functionality

</Admonition>

The `pg_search` extension by [ParadeDB](https://www.paradedb.com/) added BM25 full-text search to Postgres, using inverted indexes and the `@@@` operator to run keyword, phrase, fuzzy, and faceted search through SQL and a JSON query DSL. It's no longer available on Neon.

To replace `pg_search` with `lakebase_text` on Neon, see [Migrate from pg_search to lakebase_text](/docs/extensions/migrate-pg-search-to-lakebase-text). For the full `pg_search` feature reference, see the [ParadeDB documentation](https://docs.paradedb.com/welcome/introduction).

<NeedHelp/>
