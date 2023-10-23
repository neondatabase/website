---
title: AI & embeddings
subtitle: Build AI applications with Neon serverless Postgres as your vector database
enableTableOfContents: true
updatedOn: '2023-10-07T10:43:33.361Z'
---

Vector databases enable efficient storage and retrieval of vector data, which is an essential component in building AI applications that leverage Large Language Models (LLMs) such as OpenAI.

Neon supports the `pgvector` open-source extension, which enables Postgres as a vector database for storing and querying vector embeddings. By enabling Postgres as a vector database, you can keep your data in the open source database that you know and trust. There's no need for data migration or a proprietary vector storage solution.

To get started, see [The pgvector extension](/docs/extensions/pgvector).

## Example applications

Check out the following AI application examples built with Neon.

<DetailIconCards>
<a href="https://github.com/neondatabase/yc-idea-matcher" description="Build an AI-powered semantic search application" icon="github">Semantic search app</a>
<a href="https://github.com/neondatabase/ask-neon" description="Build an AI-powered chatbot with pgvector" icon="github">Chatbot app</a>
<a href="https://vercel.com/templates/next.js/postgres-pgvector" description="Enable vector similarity search with Vercel Postgres" icon="github">Vercel Postgres pgvector Starter</a>
<a href="https://github.com/neondatabase/postgres-ai-playground" description="Build an AI-enabled SQL playground for natural language queries" icon="github">Web-based AI SQL Playground</a>
<a href="https://github.com/neondatabase/neon-vector-search-openai-notebooks" description="Jupyter Notebook for vector search with Neon, pgvector, and OpenAI" icon="github">Jupyter Notebook for vector search with Neon</a>
</DetailIconCards>
