---
title: AI & Embeddings
subtitle: Build AI applications with Neon Postgres as your vector database
enableTableOfContents: true
updatedOn: '2024-11-21T12:45:44.960Z'
---

Vector databases enable efficient storage and retrieval of vector data, which is an essential component in building AI applications that leverage Large Language Models (LLMs).

Neon supports the `pgvector` open-source extension, which enables Postgres as a vector database for storing and querying embeddings. This means you can leverage the open-source database that you trust as your vector store and forget about migrating data or adding a third-party vector storage solution.

Neon's AI Starter Kit provides resources, starter apps, and examples to help get you started.

<CTA title="Ship faster with Neon's AI Starter Kit" description="Sign up for Neon Postgres and jumpstart your AI application. Our starter apps and resources will help you get up and running." buttonText="Sign Up" buttonUrl="https://console.neon.tech/signup" />

The **Neon AI Starter Kit** includes:

- Neon Postgres with the latest version of the Postgres [pgvector](/docs/extensions/pgvector) extension for storing vector embeddings
- A variety of hackable, pre-built [AI starter apps](#ai-starter-apps):
  - AI chat
  - RAG chat
  - Semantic search
  - Hybrid search
  - Reverse image search
  - Chat with PDF
- A [vector search optimization guide](/docs/ai/ai-vector-search-optimization) for better AI application performance
- A [scaling guide](/docs/ai/ai-scale-with-neon) for scaling your app with Neon's Autoscaling and Read Replica features
- A collection of [AI apps built with Neon](#ai-apps-built-with-neon) that you can reference while building your own app

## AI basics

<DetailIconCards>
<a href="/docs/ai/ai-concepts" description="Learn how embeddings are used to build AI applications" icon="openai">AI concepts</a>

<a href="/docs/extensions/pgvector" description="Learn about the pgvector Postgres extension" icon="openai">The pgvector extension</a>

</DetailIconCards>

## AI starter apps

Hackable, fully-featured, pre-built [starter apps](#ai-starter-apps) to get you up and running.

<DetailIconCards>

<a href="https://github.com/neondatabase/examples/tree/main/ai/llamaindex/chatbot-nextjs" description="A Next.js AI chatbot starter app built with OpenAI and LlamaIndex" icon="github">AI chatbot (OpenAI + LllamIndex)</a>

<a href="https://github.com/neondatabase/examples/tree/main/ai/langchain/chatbot-nextjs" description="A Next.js AI chatbot starter app built with OpenAI and LangChain" icon="github">AI chatbot (OpenAI + LangChain)</a>

<a href="https://github.com/neondatabase/examples/tree/main/ai/llamaindex/rag-nextjs" description="A Next.js RAG chatbot starter app built with OpenAI and LlamaIndex" icon="github">RAG chatbot (OpenAI + LlamaIndex)</a>

<a href="https://github.com/neondatabase/examples/tree/main/ai/langchain/rag-nextjs" description="A Next.js RAG chatbot starter app built with OpenAI and LangChain" icon="github">RAG chatbot (OpenAI + LangChain)</a>

<a href="https://github.com/neondatabase/examples/tree/main/ai/llamaindex/semantic-search-nextjs" description="A Next.js Semantic Search chatbot starter app built with OpenAI and LlamaIndex" icon="github">Semantic search chatbot (OpenAI + LlamaIndex)</a>

<a href="https://github.com/neondatabase/examples/tree/main/ai/langchain/semantic-search-nextjs" description="A Next.js Semantic Search chatbot starter app built with OpenAI and LangChain" icon="github">Semantic search chatbot (OpenAI + LangChain)</a>

<a href="https://github.com/neondatabase/examples/tree/main/ai/hybrid-search-nextjs" description="A Next.js Hybrid Search starter app built with OpenAI" icon="github">Hybrid search (OpenAI)</a>

<a href="https://github.com/neondatabase/examples/tree/main/ai/llamaindex/reverse-image-search-nextjs" description="A Next.js Reverse Image Search Engine starter app built with OpenAI and LlamaIndex" icon="github">Reverse image search (OpenAI + LlamaIndex)</a>

<a href="https://github.com/neondatabase/examples/tree/main/ai/llamaindex/chat-with-pdf-nextjs" description="A Next.js Chat with PDF chatbot starter app built with OpenAI and LlamaIndex" icon="github">Chat with PDF (OpenAI + LlamaIndex)</a>

<a href="https://github.com/neondatabase/examples/tree/main/ai/langchain/chat-with-pdf-nextjs" description="A Next.js Chat with PDF chatbot starter app built with OpenAI and LangChain" icon="github">Chat with PDF (OpenAI + LangChain)</a>

</DetailIconCards>

## AI integrations

Learn how to integrate Neon Postgres with LLMs and AI platforms.

<DetailIconCards>

<a href="/docs/ai/langchain" description="Learn how to use LangChain with OpenAI to create AI applications faster" icon="langchain">LangChain (with OpenAI)</a>

<a href="/docs/ai/llamaindex" description="Learn how to use LlamaIndex with OpenAI to create AI applications faster" icon="llamaindex">LlamaIndex (with OpenAI)</a>

</DetailIconCards>

## Preparing your AI app for production

<DetailIconCards>

<a href="ai-vector-search-optimization" description="Optimize pgvector search for better application performance" icon="openai">Optimize pgvector search</a>

<a href="/docs/ai/ai-scale-with-neon" description="Scale your AI app with Neon's Autoscaling and Read Replica features" icon="openai">Scale with Neon</a>

</DetailIconCards>

## AI apps built with Neon

AI applications built with Neon Postgres that you can reference as code examples or inspiration.

<Admonition type="tip" title="Feature your app here">
Share your AI app on our **#showcase** channel on [Discord](https://discord.gg/92vNTzKDGp) for consideration.
</Admonition>

<DetailIconCards>

<a href="https://github.com/neondatabase/ai-vector-db-per-tenant" description="Deploy an AI vector database per-tenant architecture with Neon" icon="github">AI vector database per tenant</a>

<a href="https://neon.tech/guides/chatbot-astro-postgres-llamaindex" description="Build a RAG chatbot in an Astro application with LlamaIndex and Postgres" icon="openai">Guide: Build a RAG chatbot</a>

<a href="https://neon.tech/guides/llamaindex-postgres-search-images" description="Using LlamaIndex with Postgres to Build your own Reverse Image Search Engine" icon="openai">Guide: Build a Reverse Image Search Engine</a>

<a href="https://github.com/neondatabase/ask-neon" description="An Ask Neon AI-powered chatbot built with pgvector" icon="github">Ask Neon Chatbot</a>

<a href="https://vercel.com/templates/next.js/postgres-pgvector" description="Enable vector similarity search with Vercel Postgres powered by Neon" icon="github">Vercel Postgres pgvector Starter</a>

<a href="https://github.com/neondatabase/yc-idea-matcher" description="YCombinator semantic search application" icon="github">YCombinator Semantic Search App</a>

<a href="https://github.com/neondatabase/postgres-ai-playground" description="An AI-enabled SQL playground application for natural language queries" icon="github">Web-based AI SQL Playground</a>

<a href="https://github.com/neondatabase/neon-vector-search-openai-notebooks" description="Jupyter Notebook for vector search with Neon, pgvector, and OpenAI" icon="github">Jupyter Notebook for vector search with Neon</a>

<a href="https://github.com/ItzCrazyKns/Neon-Image-Search" description="Community: An image serch app built with Neon and Vertex AI" icon="github">Image search with Neon and Vertex AI</a>

<a href="https://github.com/mistralai/cookbook/blob/main/third_party/Neon/neon_text_to_sql.ipynb" description="A Text-to-SQL conversion app built with Mistral AI, Neon, and LangChain" icon="github">Text-to-SQL conversion with Mistral + LangChain</a>

<a href="https://neon.tech/blog/openais-gpt-store-is-live-create-and-publish-a-custom-postgres-gpt-expert" description="Blog + repo: Create and publish a custom Postgres GPT Expert using OpenAI's GPT" icon="openai">Postgres GPT Expert</a>

</DetailIconCards>

## AI tools

Learn about popular AI tools and how to use them with Neon Postgres.

<DetailIconCards>

<a href="/docs/ai/ai-google-colab" description="A cloud-based environment to write and execute Python code, perfect for machine learning and data science tasks" icon="openai">Google Colab</a>

<a href="/docs/ai/ai-azure-notebooks" description="A cloud-based Jupyter notebook service integrated with Azure Data Studio for creating, running, and sharing notebooks" icon="openai">Azure Data Studio Notebooks</a>

</DetailIconCards>
