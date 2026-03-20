---
title: Build an end-to-end RAG pipeline entirely in psql using pgrag and DeepSeek
description: >-
  Neon’s open-source pgrag extension offers PDF-to-text, local embedding
  generation, AI API requests, and more
excerpt: >-
  Retrieval-Augmented Generation (RAG) works by taking a user’s question,
  searching for information relevant to that question, and then including the
  retrieved information alongside the question in a prompt to an AI chat model:
  ChatGPT/Claude/DeepSeek, please answer question X usin...
date: '2025-01-30T18:00:00'
updatedOn: '2025-01-30T18:00:04'
category: engineering
categories:
  - engineering
  - ai
authors:
  - george-mackerron
cover:
  image: 'https://cdn.neonapi.io/public/images/pages/blog/pgrag-and-deepseek/cover.png'
  alt: null
isFeatured: false
seo:
  title: >-
    Build an end-to-end RAG pipeline entirely in psql using pgrag and DeepSeek -
    Neon
  description: >-
    We've built an open-source Postgres extension (pgrag) offering PDF-to-text,
    local embedding generation, AI API requests, and more.
  keywords: []
  noindex: false
  ogTitle: >-
    Build an end-to-end RAG pipeline entirely in psql using pgrag and DeepSeek -
    Neon
  ogDescription: >-
    We've built an open-source Postgres extension (pgrag) offering PDF-to-text,
    local embedding generation, AI API requests, and more.
  image: 'https://cdn.neonapi.io/public/images/pages/blog/pgrag-and-deepseek/cover.png'
source:
  wpId: 8316
  wpSlug: pgrag-and-deepseek
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/pgrag-and-deepseek/screenshot-2025-01-29-at-113548percente2percent80percentafam-1024x573-a1211222.png)

Retrieval-Augmented Generation (RAG) works by taking a user’s question, searching for information relevant to that question, and then including the retrieved information alongside the question in a prompt to an AI chat model:

> ChatGPT/Claude/DeepSeek, please answer question X using information A, B, C.

It’s a simple enough idea, but it does have a few moving parts. So we created a Postgres extension that can help:

[https://github.com/neondatabase-labs/pgrag](https://github.com/neondatabase-labs/pgrag)

## What a RAG pipeline looks like

![Image](https://cdn.neonapi.io/public/images/pages/blog/pgrag-and-deepseek/diagram-1-10-bd31c0da.svg)

As illustrated in this diagram, there are two main stages of a RAG pipeline.

The first stage is preparing and indexing the information that we want to be used: that’s steps 1 – 4 above. We load and extract text from some documents. We split the text into chunks, so that each chunk (ideally) relates to a single topic. We use an embedding model to turn each chunk into a dense vector or embedding that represents its meaning. And we store those embeddings in a vector database, alongside the chunks themselves, ready for searching.

The second stage is dealing with questions: that’s steps 5 – 10 above. When a question comes in, we generate an embedding from it (just like we did for the document chunks). We use that embedding to identify and retrieve the most relevant chunks based on the shortest vector distances. For best results, we might then rerank the chunks and keep only the top N — not by using the embeddings this time, but by comparing the actual text of the query against the text of each chunk. Finally, we prompt the generative AI chat model of our choice with both the question and the top N chunks, and get back its response.

## Where Postgres, pgvector and pgrag fit in

Clearly, a key part of this RAG pipeline is the vector database. Postgres is widely used in this role, usually with the [pgvector](https://github.com/pgvector/pgvector) extension. pgvector provides vector indexes, enabling blazing-fast search for document chunks in the same semantic neighbourhood as the question. In other words, Postgres + pgvector can support steps 4, 6 and 7 of our diagram.

With that in mind, our aim for the pgrag extension is simple: it’s to help out with all the other steps. pgrag lets you create a complete RAG pipeline without ever leaving psql. You don’t have to pick a programming language, then research the appropriate libraries, then wire it all together with your Postgres back-end. You just write a bit more SQL using pgrag, which is available on Neon right out of the box (or, since it’s open-source, you can just as well compile it for use with your own Postgres servers). It’s an extremely quick and easy way to get started.

## pgrag functions: stage 1

For the first stage, when you’re processing context documents, pgrag has three key features. First, there’s text extraction: it lets you pick out the text from PDF files, Word files and HTML pages.

```bash
rag.text_from_pdf(bytea) —> text
rag.text_from_docx(bytea) —> text
rag.markdown_from_html(text) —> text
```

Second, there’s chunking: you can split your text into chunks using either a character count or a token count.

```bash
rag.chunks_by_character_count(text, max_chars integer, max_overlap integer) —> text[]
rag_bge_small_en_v15.chunks_by_token_count(text, max_tokens integer, max_overlap integer) —> text[]
```

And third, you can generate embeddings. You can do that either using a small but best-in-class model running directly within the Postgres extension and using the server’s CPU …

```bash
rag_bge_small_en_v15.embedding_for_passage(text) —> vector(384)
```

… or by calling out to a third-party service using your own API key.

```bash
rag.openai_text_embedding_3_small(text) —> vector(1536)
rag.voyageai_embedding_3_lite(input_type, text) -> vector(512)
rag.fireworks_nomic_embed_text_v15(text) -> vector(768)
-- ...
```

## pgrag functions: stage 2

At the second stage, when you’re responding to questions, pgrag again has three key features.

First, you can generate an embedding for the question.

```bash
rag_bge_small_en_v15.embedding_for_query(text) —> vector(384)
-- ...
```

Note that with some models, different prefixes should be applied to document chunks and to questions. The `embedding_for_passage` and `embedding_for_query` functions handle that for you in the case of the local model. And for the Voyage AI functions you can specify either `'document'` or `'query'` as the `input_type` parameter.

Second, you can rerank your retrieved document chunks against the question. This can again be done with a small but best-in-class reranking model that runs locally, on the database server.

```bash
rag_jina_reranker_v1_tiny_en.rerank_distance(text, text) —> real
```

Alternatively, you can call out to a third-party API.

```bash
rag.voyageai_rerank_distance(model text, text, text) -> real
-- ...
```

Finally, you can make API calls out to AI models such as DeepSeek or ChatGPT, generating an answer from a prompt combining the question and the chunks together.

```bash
rag.anthropic_messages(version text, body json) -> json
rag.openai_chat_completion(json) —> json
rag.fireworks_chat_completion(body json) -> json
```

One thing you may have noticed is that the local embedding and reranking models are in separate schemas to the other functions (the schemas are `rag_bge_small_en_v15` and `rag_jina_reranker_v1_tiny_en`). That’s because each of these models is bundled as an extension in its own right. We’ve done that because the built-in model data makes them pretty big — over 100MB each — and also because we might want to provide other models in future, so you can mix and match.

## A complete RAG pipeline using pgrag and DeepSeek

Let’s see how to glue these functions together to create a full RAG pipeline in psql.

<Admonition type="tip" title="Note">
If you’re running this on [Neon](https://neon.tech/home), you may need to set the compute size for the relevant branch to 2GB RAM or more in order to use the local embedding and reranking models together.
</Admonition>

The documents we’ll use here are the presenters’ slides from [PGConf EU 2023](https://2023.pgconf.eu/). If you plan to follow along, you can get these PDFs using the following `wget` command:

```bash
wget -r -nH -nd -np -A .pdf \
  'https://www.postgresql.eu/events/pgconfeu2023/sessions/'
```

First, let’s create a database, install the extensions, and set an API key for the service we’re going to use (in this case, [Fireworks AI](https://fireworks.ai)).

```sql
create database pgconf_eu_23_rag;
\c pgconf_eu_23_rag

set neon.allow_unstable_extensions = 'true';  -- if on Neon

create extension rag cascade;  -- `cascade` installs pgvector
create extension rag_bge_small_en_v15 cascade;
create extension rag_jina_reranker_v1_tiny_en cascade;

\set key `cat path/to/secret-fireworks-ai-key.txt`
select rag.fireworks_set_api_key(:'key');
```

Second, we need to define a couple of tables. One will be for our documents; the other will hold the text chunks they get split into and the corresponding embeddings. We also make an index to speed up vector searches over the embeddings.

```sql
create table docs
( id int primary key generated always as identity
, name text not null
, fulltext text not null
);

create table embeddings
( id int primary key generated always as identity
, doc_id int not null references docs(id)
, chunk text not null
, embedding vector(384) not null
);

create index on embeddings
  using hnsw (embedding vector_cosine_ops);
```

Now we’re ready to extract the complete text of our PDFs and insert it in the docs table. In `psql`, we can set a variable to the base64-encoded binary PDF data like so:

```sql
\set contents `base64 < ~/Downloads/pgconf.eu.2023/2023.pgconf.eu\ Zero\ Downtime\ PostgreSQL\ Upgrades.pdf`
```

And then we can get Postgres to decode that base64 data and extract the plain text from the PDF it represents:

```sql
insert into docs (name, fulltext) values (
  '2023.pgconf.eu Zero Downtime PostgreSQL Upgrades.pdf',
  rag.text_from_pdf(decode(:'contents','base64'))
);
```

Let’s see how the extracted text looks. Run:

```sql
select fulltext from docs where name = '2023.pgconf.eu Zero Downtime PostgreSQL Upgrades.pdf';
```

And we get back:

> _Zero Downtime PostgreSQL Upgrades_
>
> _GitLab Copyright_
>
> _Alexander Sosna_
>
> _Senior Database Reliability Engineer_
>
> _GitLab Copyright_
>
> <br />_This talk will discus:_
>
> – _How we execute PostgreSQL major upgrades at GitLab, with zero\* downtime._
>
> _By answering these questions:_
>
> – _PostgreSQL Upgrades – How do they work and why are they hard?_
>
> _…_

That seems about right.

I generated [the SQL to load the other PDFs](https://gist.github.com/jawj/6f47c7eaddef6af9ccdaeb86a5e43d25) using a simple Bash script. If you’re following along, you’ll just need to do a search-and-replace on `path/to/pgconf.eu.2023` before piping it into psql.

With all the PDF files loaded, the next tasks are chunking and embedding generation. We can accomplish those with one further query:

```sql
with chunks as (
  select id, unnest(
      rag_bge_small_en_v15.chunks_by_token_count(fulltext, 192, 8)
    ) as chunk
  from docs
)
insert into embeddings (doc_id, chunk, embedding) (
  select id, chunk,
    rag_bge_small_en_v15.embedding_for_passage(chunk)
  from chunks
);
```

And that’s it for stage 1: that’s all the setup we need.

At stage 2, when questions come in, we can answer them in a single query that has three parts. First, the query finds the top 10 chunks based on vector distances between embeddings. Second, it reranks those chunks and whittles them down to a top 5. Finally, it stitches the chunks and the question together into a query to DeepSeek V3.

````sql
\set query 'did anyone discuss multithreaded Postgres?'

with ranked as (
  select id, doc_id, chunk,
    embedding <=> rag_bge_small_en_v15.embedding_for_query(:'query') as cosine_distance
  from embeddings
  order by cosine_distance limit 10
),
reranked as (
  select *, rag_jina_reranker_v1_tiny_en.rerank_distance(:'query', chunk)
  from ranked
  order by rerank_distance limit 5
)
select rag.fireworks_chat_completion(json_object(
  'model': 'accounts/fireworks/models/deepseek-v3',
  'messages': json_array(
    json_object(
      'role': 'system',
      'content':
        E'The user is a Postgres user or developer. Please try to answer the user''s QUESTION using only the provided CONTEXT. The CONTEXT represents extracts from the presentation slides at PGConf EU 2023. These slides have been selected as most relevant to this question.\n\n'
        'If the context is not relevant or complete enough to confidently answer the question, your best response is: "I''m afraid I don''t have the information to answer that".'
    ),
    json_object(
      'role': 'user',
      'content':
        E'# CONTEXT\n\n```\n' || string_agg(chunk, E'\n\n\n') || E'\n```\n\n'
        '# QUESTION\n\n```\n' || :'query' || E'\n```'
    )
  )
)) -> 'choices' -> 0 -> 'message' -> 'content' as answer
from reranked;
````

Running that query returns the following:

> _Yes, multithreaded PostgreSQL was discussed at PGConf EU 2023. Heikki Linnakangas presented on the topic and shared the current status, previous attempts, and the plan for implementing multi-threading in PostgreSQL.<br />_<br />_The key points he mentioned are:_
>
> – _The idea started as a hallway conversation at PGCon 2023 and was followed up on the mailing list._
>
> – _There is no patch yet, but some preliminary refactoring and work on annotating global variables have been done._
>
> – _The plan involves launching a thread instead of a process for each connection, annotating global variables, adding flags for extensions to declare thread safety, and rewriting some subsystems._
>
> – _Previous attempts at multi-threading PostgreSQL were also mentioned, such as the early Windows port and other projects like Apache2, Oracle, and Firebird that have made the switch to multi-threading._

That checks out! Now, how about:

```sql
\set query 'did AI come up at all?'

-- repeat three-part query ...
```

> _Yes, AI was discussed in the context of the presentation. Specifically, it mentioned **Generative AI**, which is powered by **foundation models (FMs)**, and **Retrieval Augmented Generation (RAG)**, which involves configuring foundation models to interact with data for tasks like answering questions using knowledge bases. Additionally, the role of **vectors** in RAG was highlighted, where embeddings from documents are used by foundation models to generate responses._

Well, wouldn’t you know it? Lastly, what if we set a trap for DeepSeek and ask it something entirely out of scope?

```sql
\set query 'why is the sky blue?'

-- repeat three-part query ...
```

> _I’m afraid I don’t have the information to answer that. The provided context is about PostgreSQL, roaring bitmaps, and database optimization techniques, which doesn’t include any explanation about why the sky is blue._

Good news: DeepSeek has done what we asked in this case too. All in all, it looks like we have a pretty nicely functioning RAG pipeline set up and ready to go.

## What’s next?

We hope you find pgrag useful, and we’d love to hear your feedback. [Log in to Neon](https://console.neon.tech/signup) to use it right away, or check out the repo: [https://github.com/neondatabase-labs/pgrag](https://github.com/neondatabase-labs/pgrag).

You can also check out a more complete example in this blog template: [https://github.com/neondatabase-labs/hanno-blog](https://github.com/neondatabase-labs/hanno-blog).
