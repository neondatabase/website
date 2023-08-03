---
title: AI & embeddings
subtitle: Build AI applications with Neon serverless Postgres as your vector database
enableTableOfContents: true
isDraft: true
---

Vector databases enable efficient storage and retrieval of vector data, which is an essential component in building AI applications that leverage Large Language Models (LLMs) such as OpenAI.

Neon supports the `pg_embedding` and `pgvector` open-source extensions, either of which all allow you to enable Postgres as a vector database for storing and querying vector embeddings.

By enabling Postgres as a vector database, you can keep your data in the open source database that you know and trust. There's no need for data migration or a proprietary vector storage solution.

## Vector extensions

Neon supports the following extensions for enabling PostgreSQL as your vector database.

### pg_embedding

`pg_embedding` is an open-source extension that enables storing vector embeddings and graph-based vector similarity search in Postgres using the Hierarchical Navigable Small World (HNSW) algorithm. It supports HNSW indexes, which unlock new levels of efficiency in high-dimensional similarity search compared in `ivfflat` indexes, enabling you to scale your AI applications to millions of rows. To get started, see [The pg_embedding extension](/docs/extensions/pg_embedding).

If you are currently using `pgvector` and want to try `pg_embedding`, refer to [Migrating to pg_embedding](/docs/extensions/pg_embedding#migrate-from-pgvector-to-pgembedding).

### pgvector

`pgvector` is an open-source extension that enables storing vector embeddings and vector similarity search in Postgres. It supports `ivfflat` indexes. To get started, see [The pgvector extension](/docs/extensions/pgvector).

## Example applications

Check out the following AI application examples to start building your AI application with Neon.

<DetailIconCards>

<a href="https://github.com/neondatabase/yc-idea-matcher" description="Build an AI-powered semantic search application" icon="github">Semantic search app</a>

<a href="https://github.com/neondatabase/ask-neon" description="Build aan AI-powered chatbot" icon="github">Chatbot app</a>

<a href="https://vercel.com/templates/next.js/postgres-pgvector" description="Collaborate on open-source projects" icon="github">Vercel Postgres pgvector Starter</a>

<a href="https://github.com/neondatabase/postgres-ai-playground" description="Build an AI-enabled SQL playground for natural language queries" icon="github">Web-based AI SQL Playground</a>

</DetailIconCards>
