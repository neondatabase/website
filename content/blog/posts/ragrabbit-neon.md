---
title: >-
  Building RagRabbit, An Open Source RAG Search with Postgres as the Vector
  Store
description: "pgVector, Neon, and Vercel = the perfect stack for AI search"
excerpt: >-
  “When I started RagRabbit, I did testing on vector databases, but I didn’t see
  a real advantage. Postgres with Pgvector covers everything I need, and it’s
  very performant for the number of rows I handle” (Marco D’Alia, Software
  Architect behind RagRabbit) While experimenting with...
date: "2025-03-17T17:40:19"
updatedOn: "2025-03-24T16:58:23"
category: case-study
categories:
  - case-study
authors:
  - carlota-soto
cover:
  image: "https://cdn.neonapi.io/public/images/pages/blog/ragrabbit-neon/cover.jpg"
  alt: null
isFeatured: true
seo:
  title: >-
    Building RagRabbit, An Open Source RAG Search with Postgres as the Vector
    Store - Neon
  description: >-
    RagRabbit crawls your site, outputs LLM.txt and LLM-full.txt, generates
    pgVector embeddings, and serves doc chunks via MCP. Built on Neon.
  keywords: []
  noindex: false
  ogTitle: >-
    Building RagRabbit, An Open Source RAG Search with Postgres as the Vector
    Store - Neon
  ogDescription: >-
    RagRabbit crawls your site, outputs LLM.txt and LLM-full.txt, generates
    pgVector embeddings, and serves doc chunks via MCP. Built on Neon.
  image: "https://cdn.neonapi.io/public/images/pages/blog/ragrabbit-neon/social.jpg"
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/ragrabbit-neon/neon-ragrabbit-1024x576-ec2fe2ab.jpg)

<blockquote>
<p><strong>“When I started RagRabbit, I did testing on vector databases, but I didn’t see a real advantage. Postgres with Pgvector covers everything I need, and it’s very performant for the number of rows I handle”</strong> (Marco D’Alia, Software Architect behind <a href="https://github.com/madarco/ragrabbit">RagRabbit</a>)</p>
</blockquote>

While experimenting with Retrieval-Augmented Generation (RAG) solutions, [Marco](https://twitter.com/madarco) (Software Architect and 2x founder) found it painful to juggle multiple systems for web scraping, vector search, and AI responses. He wanted a single, open-source toolkit that used Postgres for everything. So, he built [RagRabbit](https://github.com/madarco/ragrabbit/), a tool that crawls your website, converts pages into Markdown (and even outputs handy files like LLM.txt or LLM-full.txt), generates embeddings with pgVector, and offers an MCP server so you can feed relevant doc chunks directly into IDEs or chat apps:

[https://github.com/madarco/ragrabbit](https://github.com/madarco/ragrabbit)

What RagRabbit can do:

1. Crawl any site and automatically convert pages to Markdown
2. Output LLM-friendly text files like LLM.txt
3. Generate vector embeddings in Postgres via pgVector
4. Provide AI Q&A using OpenAI or Claude
5. Use the MCP server to supply read-only doc chunks to Cursor or Claude Desktop
6. Support user/password, GitHub login, or magic link authentication for secure access
7. Deploy on Vercel with Neon as the Postgres host for a quick, serverless setup

<figure>
<video autoPlay muted loop width="1156" height="720" playsInline src="https://cdn.neonapi.io/public/videos/pages/blog/ragrabbit-neon/ragrabbit-neon-9768637e.mp4"></video>
</figure>

## The RagRabbit Workflow

#### Crawl any site and convert pages to Markdown

RAGrabbit lets you specify a URL (and how deeply to follow links). It scrapes the site’s HTML, removes irrelevant tags or scripts, and hands the cleaned text to an LLM (OpenAI or Claude) to convert into Markdown, which is simpler to parse, store, and feed into AI models than raw HTML.

#### Generate LLM-friendly text files

Once the Markdown is ready, RAGrabbit can produce two nice artifacts:

- **`LLM.txt`:** A condensed version that’s chunked and easy to feed into prompts
- **`LLM-full.txt`:** A more comprehensive text dump

These files are easy to review or edit before the actual embedding step, which is great for fine-tuning what information goes into the AI workflow.

#### Store embeddings in Postgres (pgVector)

Behind the scenes, RAGrabbit uses LlamaIndex to split the Markdown into chunks, then calls OpenAI or Claude for embeddings. Instead of relying on an external vector DB, these embeddings are stored in Postgres with the pgVector extension.

#### AI Q&A

With the embeddings in place, RAGrabbit performs similarity searches right in Postgres to retrieve the most relevant chunks of text for any user query. These chunks are then fed to the LLM (OpenAI or Claude) to produce a final answer. Because it references actual docs (rather than the model’s training data alone), it provides grounded responses—plus you can link back to sources in the original Markdown.

#### MCP Server: Read-only retrieval for devs

To make those doc chunks accessible beyond a browser interface, RAGrabbit includes an MCP Server. Tools like Cursor or Claude Desktop can connect to RAGrabbit through this server to reference code or docs without context-swapping.

#### Authentication

RAGrabbit accommodates different authentication setups: user/password, GitHub OAuth, or simple magic links. This ensures that only approved users can view or manage your indexed content.

## Architecture: Neon, pgVector, and Vercel

<blockquote>
<p><strong>“With Neon, I get pgVector for embeddings, plus all the regular Postgres features like full-text search. It’s a single DB for everything—no need for multiple systems”</strong> (Marco D’Alia, Software Architect behind <a href="https://github.com/madarco/ragrabbit">RagRabbit</a>)</p>
</blockquote>

RAGrabbit takes full advantage of Neon and pgVector extension to store embeddings—no separate vector database needed.

### Why Neon vs other Postgres services?

- **Instant provisioning and easy to use.** Neon’s fully managed Postgres spins up in seconds.
- **Serverless scaling with scale-to-zero.** Neon keeps your costs near zero when usage dips, and dynamically allocates resources as queries increase.
- **All Postgres extensions:** You get pgVector plus handy features like full-text search in one place.
- **Branching:** Neon allows creating ephemeral branches for testing migrations or new features. While RAGrabbit’s current focus is primarily read operations, branching remains a powerful option for future expansions.

### Why pgVector vs. a dedicated vector DB?

Marco tested specialized vector stores, but found that using pgVector directly in Postgres was more than enough. It was able to handle all the RAG-specific embedding queries without forcing an extra service into the architecture. Fewer moving parts = simpler deployment and maintenance.

### One-step deployment on Vercel

<blockquote>
<p><strong>“It’s great that Neon is tightly integrated with Vercel. I wanted a one-click deployment approach for users, so having Postgres instantly available without extra infrastructure was huge”<br></br></strong><br></br>(Marco D’Alia, Software Architect) </p>
</blockquote>

RAGrabbit is built to deploy with a single click. Choose Vercel, connect to a Neon Postgres database, and you’re set—no separate vector cluster or additional job workers. This frictionless approach was a key design goal for Marco.

## Wrap up

<blockquote>
<p><strong>“Being able to scale to zero is important for an open-source tool. Neon automatically handles that, so the cost stays low when there’s little traffic, but it can scale up if usage spikes”</strong> (Marco D’Alia, Software Architect behind <a href="https://github.com/madarco/ragrabbit">RagRabbit</a>)</p>
</blockquote>

If you’re ready to experiment building your own RAG project, [get started with Neon’s Free Plan](https://neon.tech/) and see how smoothly serverless Postgres can fit into your stack.

Don’t forget to follow [Marco](https://twitter.com/madarco) on X to stay up to date with RagRabbit’s latest features and other fun projects he’s working on!
