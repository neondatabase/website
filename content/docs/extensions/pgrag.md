---
title: The pgrag extension
subtitle: Deprecated experimental RAG extension
summary: >-
  pgrag is a deprecated experimental Postgres extension for building
  Retrieval-Augmented Generation (RAG) pipelines in SQL. It uses small local
  embedding and reranking models and is not recommended for new projects. For
  search and RAG on Neon, use Lakebase Search with AI Gateway embeddings instead.
tag: deprecated
updatedOn: '2026-09-27T23:19:01.102Z'
---

<Admonition type="warning" title="The pgrag extension is deprecated">

`pgrag` is a deprecated experimental extension and is not recommended for new projects. It runs small local models directly on your Postgres server: `rag_bge_small_en_v15` for embedding and `rag_jina_reranker_v1_tiny_en` for reranking.

For search and RAG on Neon, use these instead:

- **[Lakebase Search](/docs/ai/lakebase-search)**: vector, keyword, and hybrid search for Postgres, built on the `lakebase_vector` and `lakebase_text` extensions. Start with the [Get started guide](/docs/ai/lakebase-search-get-started).
- **[AI Gateway embeddings](/docs/ai-gateway/embeddings)**: generate high-quality embeddings from frontier and open-source models through a single API.

</Admonition>

The `pgrag` extension was an experimental way to build end-to-end Retrieval-Augmented Generation (RAG) pipelines in SQL, using local models for embedding and reranking alongside `pgvector` for storage. It remains available on existing projects, but it's no longer recommended for new work.

## Source code

The `pgrag` source remains available in the [pgrag GitHub repository](https://github.com/neondatabase-labs/pgrag).

<NeedHelp/>
