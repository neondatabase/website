---
title: AI & embeddings
subtitle: Build AI applications with Neon serverless Postgres as your vector database
enableTableOfContents: true
updatedOn: '2023-10-07T10:43:33.361Z'
---

Vector databases enable efficient storage and retrieval of vector data, which is an essential component in building AI applications that leverage Large Language Models (LLMs) such as OpenAI.

Neon supports the `pgvector` open-source extension, which enables Postgres as a vector database for storing and querying vector embeddings. By enabling Postgres as a vector database, you can keep your data in the open-source database that you know and trust. There's no need for data migration or a proprietary vector storage solution.

<CTA title="Neon AI Starter Kit" description="Get a headstart on your AI app with the Neon AI Starter Kit. Tools, starter apps, and step-by-step instructions to get you up and running in minutes." buttonText="Sign Up" buttonUrl="https://console.neon.tech/signup" />

The _Neon AI Starter Kit_ includes:

- Neon Postgres with the latest version of `pgvector` for storing vector embeddings
- The `neon_vecs` Python and JavaScript SDKs for managing and querying vector embeddings in Postgres with the `pgvector` extension
- The `neon_ai` utility for generating vector embeddings with your chosen LLM and storing them in Postgres
- Starter apps to get you up and running in minutes:
  - AI chatbot starter app
  - RAG starter app
  - Semantic search starter app
  - Hybrid search starter app
  - Image search starter app
- The Neon AI scaling guide
- The Neon AI go-live checklist

## AI basics

<DetailIconCards>
<a href="/docs/ai/ai-concepts" description="The basics of building AI applications with Postgres" icon="openai">AI concepts</a>

<a href="/docs/extensions/pgvector" description="Learn about the pgvector Postgres extension" icon="openai">The pgvector extension</a>

<a href="/docs/ai/rag" description="What's Retrieval Augemented Generation (RAG) and how does it work?" icon="openai">RAG applications explained</a>
</DetailIconCards>

## AI starter apps

Each starter app includes a step-by-step guide and starter app repo to get you up and running in just a few minutes.

<DetailIconCards>

<a href="/docs/ai/tbd" description="Learn how to build an AI chatbot for your documentation" icon="openai">Build an AI chatbot</a>

<a href="/docs/ai/tbd" description="Learn how to build a Retrival Augmented Generative (RAG) application" icon="openai">Build a RAG application</a>

<a href="/docs/ai/tbd" description="Learn how to build a semantic search application" icon="openai">Build a semantic search application</a>

<a href="/docs/ai/tbd" description="Learn how to build a hybrid search application" icon="openai">Build a hybrid search application</a>

<a href="/docs/ai/tbd" description="Learn how to build an image search application" icon="openai">Build an image search application</a>

<a href="/docs/ai/tbd" description="Learn how to build a ChatGPT plugin using Neon Postgres as your vector store" icon="openai">Build a ChatGPT plugin</a>

</DetailIconCards>

## AI integrations

Learn how to integrate Neon Postgres with various LLMs and AI platforms.

<DetailIconCards>

<a href="/docs/ai/tbd" description="Learn how to use Neon Postgres as a knowledge base for Amazon Bedrock" icon="openai">Amazon Bedrock</a>

<a href="/docs/ai/amazon-titan" description="Explore Amazon Titan's high-performing foundation models for various applications" icon="openai">Amazon Titan</a>

<a href="/docs/ai/tbd" description="Discover how to integrate Claude models for advanced language processing" icon="openai">Claude</a>

<a href="/docs/ai/tbd" description="Explore Cohere's versatile language models and their applications" icon="openai">Cohere</a>

<a href="/docs/ai/tbd" description="Learn about Fireworks.ai's innovative AI models for natural language and more" icon="openai">Fireworks.ai</a>

<a href="/docs/ai/tbd" description="Dive into Hugging Face's extensive collection of open-source models" icon="openai">Hugging Face</a>

<a href="/docs/ai/tbd" description="Understand how to leverage Jurassic models for large-scale NLP tasks" icon="openai">Jurassic</a>

<a href="/docs/ai/tbd" description="Utilize LlamaIndex models for efficient text processing and analysis" icon="openai">LlamaIndex</a>

<a href="/docs/ai/tbd" description="Implement MemGPT models to enhance memory and context in AI applications" icon="openai">MemGPT</a>

<a href="/docs/ai/tbd" description="Learn how Mistral models deliver top-notch performance in language tasks" icon="openai">Mistral</a>

<a href="/docs/ai/tbd" description="Discover OpenAI's models and their wide-ranging applications" icon="openai">OpenAI</a>

<a href="/docs/ai/tbd" description="Explore how Portkey AI simplifies AI integration across various applications" icon="openai">Portkey AI</a>

<a href="/docs/ai/tbd" description="Utilize Stable Diffusion models for generating realistic images from text" icon="openai">Stable Diffusion</a>

<a href="/docs/ai/tbd" description="Learn about Vertex AI's comprehensive tools for managing machine learning projects" icon="openai">Vertex AI</a>

</DetailIconCards>

## Example apps

Check out these AI applications built with Neon Postgres.

<DetailIconCards>

<a href="https://github.com/neondatabase/yc-idea-matcher" description="Build an AI-powered semantic search application" icon="github">Semantic search app</a>

<a href="https://github.com/neondatabase/ask-neon" description="Build an AI-powered chatbot with pgvector" icon="github">Chatbot app</a>

<a href="https://vercel.com/templates/next.js/postgres-pgvector" description="Enable vector similarity search with Vercel Postgres" icon="github">Vercel Postgres pgvector Starter</a>

<a href="https://github.com/neondatabase/postgres-ai-playground" description="Build an AI-enabled SQL playground for natural language queries" icon="github">Web-based AI SQL Playground</a>

<a href="https://github.com/neondatabase/neon-vector-search-openai-notebooks" description="Jupyter Notebook for vector search with Neon, pgvector, and OpenAI" icon="github">Jupyter Notebook for vector search with Neon</a>

</DetailIconCards>

## AI tools and platforms

Learn about popular AI tools and how to use them with Neon Postgres.

<DetailIconCards>

<a href="https://docs.chainlit.io/get-started/overview" description="An open-source Python package to build production ready Conversational AI" icon="openai">Chainlit</a>

<a href="https://colab.research.google.com/" description="A cloud-based environment to write and execute Python code, perfect for machine learning and data science tasks" icon="openai">Google Colab</a>

<a href="https://jupyter.org/" description="An open-source web application for creating and sharing documents that contain live code, equations, visualizations, and narrative text" icon="openai">Jupyter Notebook</a>

<a href="https://notebooks.azure.com/" description="A cloud-based Jupyter notebook service integrated with Azure machine learning services for creating, running, and sharing notebooks" icon="openai">Microsoft Azure Notebooks</a>

<a href="https://modal.com/" description="A serverless platform for running generative AI models, large-scale batch jobs, job queues, and much more" icon="openai">Modal</a>

<a href="https://www.gradio.app/" description="Build & share machine learning apps with anyone" icon="openai">Gradio</a>

<a href="https://www.kaggle.com/kernels" description="Hosted Jupyter notebooks provided by Kaggle, enabling data analysis and machine learning model building using Kaggle datasets" icon="openai">Kaggle Kernels</a>

<a href="https://aws.amazon.com/sagemaker/notebooks/" description="Managed Jupyter notebooks provided by AWS as part of the SageMaker suite, designed for building, training, and deploying machine learning models" icon="openai">Amazon SageMaker Notebooks</a>

</DetailIconCards>
