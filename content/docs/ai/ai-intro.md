---
title: AI & embeddings
subtitle: Build AI applications with Neon serverless Postgres as your vector database
enableTableOfContents: true
updatedOn: '2023-10-07T10:43:33.361Z'
---

Vector databases enable efficient storage and retrieval of vector data, which is an essential component in building AI applications that leverage Large Language Models (LLMs) such as OpenAI.

Neon supports the `pgvector` open-source extension, which enables Postgres as a vector database for storing and querying vector embeddings. By enabling Postgres as a vector database, you can keep your data in the open-source database that you know and trust. There's no need for data migration or a 3rd-party vector storage solution.

Neon's AI Starter Kit provides resources, starter apps, and examples to help get you started.

<CTA title="Neon AI Starter Kit" description="Sign up for Neon Postgres and get a headstart on your AI app with the Neon AI Starter Kit. Starter apps and resources to help you get up and running in minutes." buttonText="Sign Up" buttonUrl="https://console.neon.tech/signup" />

The **Neon AI Starter Kit** includes:

- Neon Postgres with the latest version of the Postgres [pgvector](https://neon.tech/docs/extensions/pgvector) extension for storing vector embeddings
- Hackable, fully-featured [starter apps](#ai-starter-apps) to get you up and running:
  - Chatbot starter apps
  - RAG chatbot starter apps
  - Semantic search starter apps
  - Hybrid search starter app
  - Reverse image search starter apps
  - Chat with PDF starter apps
- The [Neon vector search optimization guide](/docs/ai/ai-vector-search-optimization) to help you optimize vector search for better application performance
- The [Neon AI scaling guide](/docs/ai/ai-scale-with-neon) showing how to scale your app with Neon's Autoscaling, Read Replica, and serverless driver features
- A collection of [AI apps built with Neon](#ai-apps-built-with-neon) that you can reference while building your own app

## AI basics

<DetailIconCards>
<a href="/docs/ai/ai-concepts" description="The basics of building AI applications with Postgres" icon="openai">AI concepts</a>

<a href="/docs/extensions/pgvector" description="Learn about the pgvector Postgres extension" icon="openai">The pgvector extension</a>

</DetailIconCards>

## Preparing your AI app for production

<DetailIconCards>

<a href="ai-vector-search-optimization" description="Optimize vector search for better application performance" icon="openai">Vector search optimization</a>

<a href="/docs/ai/ai-scale-with-neon" description="Scale your app with Neon's Autoscaling, Read Replica, and serverless driver features" icon="openai">Neon AI scaling guide</a>

</DetailIconCards>

## AI starter apps

Hackable, fully-featured, pre-built [starter apps](#ai-starter-apps) to get you up and running.

<DetailIconCards>

<a href="https://github.com/neondatabase/examples/tree/main/ai/llamaindex/chatbot-nextjs" description="A fully-featured, hackable Netx.js AI chatbot built with OpenAI and LlamaIndex" icon="openai">AI chatbot (OpenAI + LllamIndex)</a>

<a href="https://github.com/neondatabase/examples/tree/main/ai/langchain/chatbot-nextjs" description="A fully-featured, hackable Netx.js AI chatbot built with OpenAI and LangChain" icon="openai">AI chatbot (OpenAI + LangChain)</a>

<a href="https://github.com/neondatabase/examples/tree/main/ai/llamaindex/rag-nextjs" description="A fully-featured, hackable Next.js RAG chatbot built with OpenAI and LlamaIndex" icon="openai">RAG chatbot (OpenAI + LlamaIndex)</a>

<a href="https://github.com/neondatabase/examples/tree/main/ai/langchain/rag-nextjs" description="A fully-featured, hackable Next.js RAG chatbot built with OpenAI and LangChain" icon="openai">RAG chatbot (OpenAI + LangChain)</a>

<a href="https://github.com/neondatabase/examples/tree/main/ai/llamaindex/semantic-search-nextjs" description="A fully-featured, hackable Next.js Semantic Search chatbot built with OpenAI and LlamaIndex" icon="openai">Semantic search chatbot (OpenAI + LlamaIndex)</a>

<a href="https://github.com/neondatabase/examples/tree/main/ai/langchain/semantic-search-nextjs" description="A fully-featured, hackable Next.js Semantic Search chatbot built with OpenAI and LangChain" icon="openai">Semantic search chatbot (OpenAI + LangChain)</a>

<a href="https://github.com/neondatabase/examples/tree/main/ai/hybrid-search-nextjs" description="A full-featured, hackable Next.js Hybrid Search built with OpenAI" icon="openai">Hybrid search (OpenAI)</a>

<a href="https://github.com/neondatabase/examples/tree/main/ai/llamaindex/reverse-image-search-nextjs" description="A fully-featured, hackable Next.js Reverse Image Search Engine built with OpenAI and LlamaIndex" icon="openai">Reverse image search (OpenAI + LlamaIndex)</a>

<a href="https://github.com/neondatabase/examples/tree/main/ai/langchain/reverse-image-search-nextjs" description="A full-featured, hackable Next.js Reverse Image Search Engine built with OpenAI and LangChain" icon="openai">Reverse image search (OpenAI + LangChain)</a>

<a href="https://github.com/neondatabase/examples/tree/main/ai/llamaindex/chat-with-pdf-nextjs" description="A fully-featured, hackable Next.js Chat with PDF chatbot built with OpenAI and LlamaIndex" icon="openai">Chat with PDF (OpenAI + LlamaIndex)</a>

<a href="https://github.com/neondatabase/examples/tree/main/ai/langchain/chat-with-pdf-nextjs" description="A fully-featured, hackable Next.js Chat with PDF chatbot built with OpenAI and LangChain" icon="openai">Chat with PDF (OpenAI + LangChain)</a>

</DetailIconCards>

## AI integrations

Learn how to integrate Neon Postgres with various LLMs and AI platforms.

<DetailIconCards>

<a href="/docs/ai/tbd" description="Discover OpenAI's models and their wide-ranging applications" icon="openai">OpenAI</a>

<a href="/docs/ai/tbd" description="Utilize LlamaIndex models for efficient text processing and analysis" icon="openai">LangChain</a>

<a href="/docs/ai/tbd" description="Utilize LlamaIndex models for efficient text processing and analysis" icon="openai">LlamaIndex</a>

<a href="/docs/ai/ollama" description="Learn how to run open-source large language models, such as Llama 2, locally" icon="openai">Ollama</a>

</DetailIconCards>

## AI apps built with Neon

AI applications built with Neon Postgres that you can reference as code examples or inspiration.

<Admonition type="note" title="Feature your app here">
To have your AI app featured here, post it to our **#showcase** channel on [Discord](https://discord.gg/92vNTzKDGp) for consideration.
</Admonition>

<DetailIconCards>

<a href="https://neon.tech/guides/chatbot-astro-postgres-llamaindex" description="Build a RAG chatbot in an Astro application with LlamaIndex and Postgres" icon="openai">Guide: Build a RAG chatbot</a>

<a href="https://neon.tech/guides/llamaindex-postgres-search-images" description="Using LlamaIndex with Postgres to Build your own Reverse Image Search Engine" icon="openai">Guide: Build a Reverse Image Search Engine</a>

<a href="https://github.com/neondatabase/ask-neon" description="An Ask Neon AI-powered chatbot built with pgvector" icon="github">Ask Neon Chatbot</a>

<a href="https://vercel.com/templates/next.js/postgres-pgvector" description="Enable vector similarity search with Vercel Postgres powered by Neon" icon="github">Vercel Postgres pgvector Starter</a>

<a href="https://github.com/neondatabase/yc-idea-matcher" description="YCombinator semantic search application" icon="github">YCombinator Semantic Search App</a>

<a href="https://github.com/neondatabase/postgres-ai-playground" description="An AI-enabled SQL playground application for natural language queries" icon="github">Web-based AI SQL Playground</a>

<a href="https://github.com/neondatabase/neon-vector-search-openai-notebooks" description="Jupyter Notebook for vector search with Neon, pgvector, and OpenAI" icon="github">Jupyter Notebook for vector search with Neon</a>

<a href="https://github.com/ItzCrazyKns/Neon-Image-Search" description="An image serch app built with Neon and Vertex AI" icon="github">Image search with Neon and Vertex AI</a>

<a href="https://github.com/mistralai/cookbook/blob/main/third_party/Neon/neon_text_to_sql.ipynb" description="A Text-to-SQL conversion app built with Mistral AI, Neon, and LangChain" icon="github">Text-to-SQL conversion with Mistral + LangChain</a>

<a href="https://neon.tech/blog/openais-gpt-store-is-live-create-and-publish-a-custom-postgres-gpt-expert" description="Blog + repo: Create and publish a custom Postgres GPT Expert using OpenAI's GPT" icon="openai">Postgres GPT Expert</a>

</DetailIconCards>

## AI tools

Learn about popular AI tools and how to use them with Neon Postgres.

<DetailIconCards>

<a href="/docs/ai/ai-google-colab" description="A cloud-based environment to write and execute Python code, perfect for machine learning and data science tasks" icon="openai">Google Colab</a>

<a href="https://jupyter.org/" description="An open-source web application for creating and sharing documents that contain live code, equations, visualizations, and narrative text" icon="openai">Jupyter Notebook</a>

<a href="https://notebooks.azure.com/" description="A cloud-based Jupyter notebook service integrated with Azure machine learning services for creating, running, and sharing notebooks" icon="openai">Microsoft Azure Notebooks</a>

<a href="https://aws.amazon.com/sagemaker/notebooks/" description="Managed Jupyter notebooks provided by AWS as part of the SageMaker suite, designed for building, training, and deploying machine learning models" icon="openai">Amazon SageMaker Notebooks</a>

</DetailIconCards>
