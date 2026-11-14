---
updatedOn: '2026-11-13T20:55:00.000Z'
---

<Admonition type="important" title="Before you get started with pgvector, consider Lakebase Search">
[Lakebase Search](/docs/ai/lakebase-search) is built for vector and keyword search at scale. Its vector indexes build 50 to 100 times faster than HNSW, and a single index handles over a billion vectors. It's a good fit if your data is growing or you need keyword and hybrid search too.

Lakebase Search has two extensions:

- [`lakebase_vector`](/docs/extensions/lakebase-vector): a drop-in companion to pgvector. It adds a `lakebase_ann` index to your existing `vector` columns, with no migration and no query changes.
- [`lakebase_text`](/docs/extensions/lakebase-text): BM25 keyword search. It upgrades Postgres full-text search and works with your existing `tsvector` columns.

[Learn more about Lakebase Search](/docs/ai/lakebase-search)
</Admonition>
