---
title: AI & embeddings
subtitle: Build AI applications with Neon serverless Postgres as your vector database
enableTableOfContents: true
isDraft: true
---

Vector databases enable efficient storage and retrieval of vector data, which is an essential component in building AI applications that leverage Large Language Models (LLMs) such as OpenAI.

Neon supports the `pg_embedding` and `pgvector` open-source extensions, either of which all allow you to enable Postgres as a vector database for storing and querying vector embeddings.

By enabling Postgres as a vector database, you can keep your data in the open source database that you know and trust. There's no need for data migration or a proprietary vector storage solution.

## pg_embedding

`pg_embedding` is an open-source extension that enables storing vector embeddings and graph-based vector similarity search in Postgres using the Hierarchical Navigable Small World (HNSW) algorithm. It supports HNSW indexes, which unlock new levels of efficiency in high-dimensional similarity search compared in `ivfflat` indexes, enabling you to scale your AI applications to millions of rows. To get started, see [The pg_embedding extension](/docs/extensions/pg_embedding).

If you are currently using `pgvector` and want to try `pg_embedding`, refer to [Migrating to pg_embedding](/docs/extensions/pg_embedding#migrate-from-pgvector-to-pgembedding).

## pgvector

`pgvector` is an open-source extension that enables storing vector embeddings and vector similarity search in Postgres. It supports `ivfflat` indexes. To get started, see [The pgvector extension](/docs/extensions/pgvector).

## Example applications

Check out the following AI application examples to start building your AI application with Neon.

- [Semantic search app](https://github.com/neondatabase/ai-sematic-search)
  
  Demonstrates how to build an AI-powered semantic search application with PostgreSQL and `pg_embedding`. Read the accompanying blog post: [Building an AI-powered Semantic Search App with Vercel, OpenAI, and Postgres with pg_embedding](tbd).

- [Image search app](https://github.com/neondatabase/ai-image-search)

  Demonstrates how to build an image search application using PostgreSQL and `pg_embedding`. Read the accompanying blog post: [Building an AI-powered Image Search App with Vercel, OpenAI, and Postgres with pg_embedding](tbd).

- [Chatbot app](https://github.com/neondatabase/ask-neon)

  Demonstrates how to use word embeddings and PostgreSQL with `pgvector` to build a chatbot. The chatbot is implemented using Vercel Edge Functions and the `@neondatabase/serverless` driver. It relies on OpenAI's GPT-3 API to generate responses. Read the accompanying blog post: [Building an AI-powered ChatBot using Vercel, OpenAI, and Postgres](https://neon.tech/blog/building-an-ai-powered-chatbot-using-vercel-openai-and-postgres).

- [Vercel Postgres pgvector Starter](https://vercel.com/templates/next.js/postgres-pgvector)

  Provides a Next.js template that uses Vercel Postgres (powered by Neon) as the database, Prisma as the ORM with `pgvector` to enable vector similarity search, and OpenAI's `text-embedding-ada-002` model for embeddings.

- [Web-based AI SQL Playground](https://github.com/neondatabase/postgres-ai-playground)

  Demonstrates how to build an SQL playground for Postgres where you can use AI to generate queries using natural language. Read the accompanying blog post: [Web-based AI SQL Playground and connecting to Postgres from the browser](https://neon.tech/blog/postgres-ai-playground). To try the application, see [Postgres AI Playground](https://postgres-ai-playground.vercel.app/).
