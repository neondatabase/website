---
title: AI & embeddings
subtitle: Build AI applications with Neon serverless Postgres as your vector database
enableTableOfContents: true
updatedOn: '2023-10-07T10:43:33.361Z'
---

Vector databases enable efficient storage and retrieval of vector data, which is an essential component in building AI applications that leverage Large Language Models (LLMs) such as OpenAI.

Neon supports the `pgvector` open-source extension, which enables Postgres as a vector database for storing and querying vector embeddings. By enabling Postgres as a vector database, you can keep your data in the open-source database that you know and trust. There's no need for data migration or a 3rd-party vector storage solution.

<CTA title="Neon AI Starter Kit" description="Get a headstart on your AI app with the Neon AI Starter Kit. Tools, starter apps, and step-by-step instructions to get you up and running in minutes." buttonText="Sign Up" buttonUrl="https://console.neon.tech/signup" />

The **Neon AI Starter Kit** includes:

- Neon Postgres with the latest version of the Postgres [pgvector](https://neon.tech/docs/extensions/pgvector) extension for storing vector embeddings
- Hackable, fully-featured [starter apps](#ai-starter-apps) to get you up and running:
  - Chatbot starter apps
  - RAG chatbot starter apps
  - Semantic search starter apps
  - Hybrid search starter app
  - Reverse image search starter apps
  - Chat with PDF starter apps
- The [Neon AI scaling guide](/docs/ai/ai-scale-with-neon) &#8212; scale your app with Neon's Autoscaling, Read Replica, and serverless driver features
- The Neon AI go-live checklist &#8212; make sure you are ready for production with our go-live checklist
- A collection of [AI apps built with Neon](#ai-apps-built-with-neon) for your reference

## AI basics

<DetailIconCards>
<a href="/docs/ai/ai-concepts" description="The basics of building AI applications with Postgres" icon="openai">AI concepts</a>

<a href="/docs/extensions/pgvector" description="Learn about the pgvector Postgres extension" icon="openai">The pgvector extension</a>

<a href="/docs/ai/rag" description="What's Retrieval Augemented Generation (RAG) and how does it work?" icon="openai">RAG applications explained</a>
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

## AI apps built with Neon

Check out these AI applications built with Neon Postgres.

<Admonition type="note" title="Feature your app here">
To have your AI app built with Neon Postgres featured here, post it to our **#showcase** channel on [Discord](https://discord.gg/92vNTzKDGp) for consideration.
</Admonition>

<DetailIconCards>

<a href="https://neon.tech/guides/chatbot-astro-postgres-llamaindex" description="Build a RAG chatbot in an Astro application with LlamaIndex and Postgres" icon="openai">Build a RAG chatbot</a>

<a href="https://neon.tech/guides/llamaindex-postgres-search-images" description="Using LlamaIndex with Postgres to Build your own Reverse Image Search Engine" icon="openai">Build a Reverse Image Search Engine</a>

<a href="https://github.com/neondatabase/ask-neon" description="An Ask Neon AI-powered chatbot built with pgvector" icon="github">Ask Neon Chatbot</a>

<a href="https://vercel.com/templates/next.js/postgres-pgvector" description="Enable vector similarity search with Vercel Postgres powered by Neon" icon="github">Vercel Postgres pgvector Starter</a>

<a href="https://github.com/neondatabase/yc-idea-matcher" description="YCombinator semantic search application" icon="github">YCombinator Semantic Search App</a>

<a href="https://github.com/neondatabase/postgres-ai-playground" description="An AI-enabled SQL playground application for natural language queries" icon="github">Web-based AI SQL Playground</a>

<a href="https://github.com/neondatabase/neon-vector-search-openai-notebooks" description="Jupyter Notebook for vector search with Neon, pgvector, and OpenAI" icon="github">Jupyter Notebook for vector search with Neon</a>

<a href="https://github.com/ItzCrazyKns/Neon-Image-Search" description="An image serch app built with Neon and Vertex AI" icon="github">Image search with Neon and Vertex AI</a>

<a href="https://github.com/mistralai/cookbook/blob/main/third_party/Neon/neon_text_to_sql.ipynb" description="A Text-to-SQL conversion app built with Mistral AI, Neon, and LangChain" icon="github">Text-to-SQL conversion with Mistral + LangChain</a>

<a href="https://github.com/neondatabase/neon-postgresql-expert" description="Create and publish a custom Postgres GPT Expert using OpenAI's GPT" icon="github">Postgres GPT Expert</a>

</DetailIconCards>

## AI tools and platforms

Learn about popular AI tools and how to use them with Neon Postgres.

<DetailIconCards>

<a href="https://docs.chainlit.io/get-started/overview" description="An open-source Python package to build production ready Conversational AI" icon="openai">Chainlit</a>

<a href="/docs/ai/ai-google-colab" description="A cloud-based environment to write and execute Python code, perfect for machine learning and data science tasks" icon="openai">Google Colab</a>

<a href="https://jupyter.org/" description="An open-source web application for creating and sharing documents that contain live code, equations, visualizations, and narrative text" icon="openai">Jupyter Notebook</a>

<a href="https://notebooks.azure.com/" description="A cloud-based Jupyter notebook service integrated with Azure machine learning services for creating, running, and sharing notebooks" icon="openai">Microsoft Azure Notebooks</a>

<a href="https://modal.com/" description="A serverless platform for running generative AI models, large-scale batch jobs, job queues, and much more" icon="openai">Modal</a>

<a href="https://www.gradio.app/" description="Build & share machine learning apps with anyone" icon="openai">Gradio</a>

<a href="https://www.kaggle.com/kernels" description="Hosted Jupyter notebooks provided by Kaggle, enabling data analysis and machine learning model building using Kaggle datasets" icon="openai">Kaggle Kernels</a>

<a href="https://aws.amazon.com/sagemaker/notebooks/" description="Managed Jupyter notebooks provided by AWS as part of the SageMaker suite, designed for building, training, and deploying machine learning models" icon="openai">Amazon SageMaker Notebooks</a>

</DetailIconCards>
