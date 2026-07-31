---
title: On-disk HNSW index for Postgres with pg_embedding
description: Learn about pg_embedding's latest updates
excerpt: >-
  A few weeks back, we released pg_embedding, a new extension for Postgres and
  LangChain which introduced Hierarchical Navigable Small Worlds (HNSW) indexes
  for vector similarity search. This new indexing method resulted in 20x faster
  queries at a 99% accuracy compared to tradition...
date: '2023-08-03T16:00:42'
updatedOn: '2023-08-21T10:27:29'
category: engineering
categories:
  - engineering
authors:
  - mahmoud-abdelwahab
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/pg_embedding-on-disk-hnsw-index/cover.jpg
  alt: null
isFeatured: false
seo:
  title: On-disk HNSW index for Postgres with pg_embedding - Neon
  description: Learn about pg_embedding's latest updates
  keywords: []
  noindex: false
  ogTitle: On-disk HNSW index for Postgres with pg_embedding - Neon
  ogDescription: >-
    A few weeks back, we released pg_embedding, a new extension for Postgres and
    LangChain which introduced Hierarchical Navigable Small Worlds (HNSW)
    indexes for vector similarity search. This new indexing method resulted in
    20x faster queries at a 99% accuracy compared to traditional IVFFlat
    indexing. Today, we’re thrilled to announce the newest version of
    pg_embedding, which […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/pg_embedding-on-disk-hnsw-index/cover.jpg
---

![Post image](https://cdn.neonapi.io/public/images/pages/blog/pg_embedding-on-disk-hnsw-index/neon-on-disk-hnsw-index2x-1024x576-5a527d05.jpg)

A few weeks back, we released [pg_embedding](https://github.com/neondatabase/pg_embedding), a new extension for Postgres and LangChain which introduced [Hierarchical Navigable Small Worlds (HNSW)](https://arxiv.org/abs/1603.09320) indexes for vector similarity search. This new indexing method resulted in [20x faster queries at a 99% accuracy compared to traditional IVFFlat indexing](https://neon.tech/blog/pg-embedding-extension-for-vector-search).

Today, we’re thrilled to announce the newest version of pg_embedding, which includes the following improvements:

1. The HNSW index is now constructed on disk instead of in memory.
2. The extension now supports [cosine similarity](https://en.wikipedia.org/wiki/Cosine_similarity), [Manhattan distance](https://en.wikipedia.org/wiki/Taxicab_geometry), and [Euclidean distance](https://en.wikipedia.org/wiki/Euclidean_distance) (also known as L2).

With this new release, you can take full advantage of Neon features which allow your AI and LLM apps to scale to millions of users, including:

1. Autoscaling to meet your application demands
2. Scaling to zero to reduce costs related to your compute nodes
3. Read replicas for read-heavy workloads

## Getting started with pg_embedding

In case you’re unfamiliar, pg_embedding makes it possible to store vector embeddings in Postgres and provides functions to calculate the similarity between vectors. This is incredibly useful because it eliminates the need to introduce an external vector store when building AI and LLM applications. To get started:

1. Enable the extension

```sql
CREATE EXTENSION embedding
```

2\. Create a column for storing vector data

```sql
CREATE TABLE documents(id integer PRIMARY KEY, embedding real[]);
INSERT INTO documents(id, embedding) VALUES (1, '{1.1, 2.2, 3.3}'),(2, '{4.4, 5.5, 6.6}');
```

3\. Run similarity search queries

```bash
SELECT id FROM documents ORDER BY embedding <=> ARRAY[1.1, 2.2, 3.3] LIMIT 1;
```

This query retrieves the ID from the documents table, sorts the results by the shortest distance between the embedding column and the array `[1.1, 2.2, 3.3]`, and returns only the first result.

## Speeding up your queries using HNSW indexing

As the number of embeddings you’re storing grows, running the above query can take a significant amount of time. That’s because the query performs a full table scan and compares the cosine similarity for each row, which is time-consuming and resource-intensive.

To avoid doing a full table scan, you can create an index on the embedding column. This would enable the database to quickly locate and retrieve the necessary data for sorting, resulting in faster query execution.

You can run the following query to create an HNSW index on the embedding column:

```bash
CREATE INDEX ON documents USING hnsw(embedding ann_cos_ops) WITH (dims=3, m=8, efconstruction=8, efsearch=8);
```

The following options allow you to tune the HNSW algorithm when creating an index:

- `dims`: Defines the number of dimensions in your vector data. This is a required parameter.
- `m`: Defines the maximum number of links or “edges” created for each node during graph construction. A higher value increases accuracy (recall) but also increases the size of the index in memory and index construction time.
- `efConstruction`: Influences the trade-off between index quality and construction speed. A high `efConstruction` value creates a higher quality graph, enabling more accurate search results, but a higher value also means that index construction takes longer.
- `efSearch`: Influences the trade-off between query accuracy (recall) and speed. A higher `efSearch` value increases accuracy at the cost of speed. This value should be equal to or larger than k, which is the number of nearest neighbors you want your search to return (defined by the `LIMIT` clause in your `SELECT` query).

After the index is built (which can take some time, depending on the size of your data), you should experience significantly faster queries.

## HNSW Index on-disk vs. in-memory

We tested pg_embedding’s HNSW index in-memory and on-disk implementations on an 8vCPU and 32 GB of RAM, and unsurprisingly, the in-memory index is typically 2x faster than the on-disk one.

![HNSW Index on-disk vs. in-memory](https://cdn.neonapi.io/public/images/pages/blog/pg_embedding-on-disk-hnsw-index/2-1024x572-af3fbcdd.png)

So why do we sacrifice performance by persisting the index? The short answer is to scale your AI applications and take full advantage of Neon’s serverless architecture.

## Scalable vector search on Neon

Neon is a fully managed serverless Postgres. This means you do not have to pick a size for your database upfront, and it will automatically allocate resources to meet your database’s workload. This is possible because [Neon’s architecture separates storage and compute.](https://neon.tech/blog/architecture-decisions-in-neon)

This architecture allows Neon to automatically scale up compute on demand in response to application workload and down to zero on inactivity. Since Neon is serverless, you’re only charged for what you use.

<video autoPlay playsInline muted loop width="1920" height="1080">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/pg_embedding-on-disk-hnsw-index/autoscaling-5bbbc306.mp4" />
</video>

Furthermore, Neon supports [regional read replicas](https://neon.tech/docs/introduction/read-replicas), which are independent read-only compute instances designed to perform read operations on the same data as your read-write computes. Read replicas do not replicate data across database instances since storage and compute are separate. Instead, read requests are directed to a single source.

Since vector similarity search is a read-heavy workload, you can leverage read replicas to offload reads from your read-write compute instance to a dedicated read-only compute instance when building AI and LLM applications.

![Post image](https://cdn.neonapi.io/public/images/pages/blog/pg_embedding-on-disk-hnsw-index/image-1024x453-0eadc1ea.png)

Finally, you can experience reduced query latencies by using the [Neon serverless driver](https://www.npmjs.com/package/@neondatabase/serverless), which makes it possible to achieve [sub-10ms Postgres queries when querying from Edge functions](https://neon.tech/blog/sub-10ms-postgres-queries-for-vercel-edge-functions).

Combining these features enables you to build scalable AI/LLM applications.

## Final thoughts

If you’re already using pg_embedding for your project, first of all, thank you! We appreciate you being an early adopter of the extension. If you would like to use the newest version of the extension, check out the [upgrade guide in our docs](https://neon.tech/docs/extensions/pg_embedding#upgrade-to-pgembedding-for-on-disk-indexes).

We’re excited about this new release of pg_embedding, and we plan on ensuring Neon users have a great experience when building their AI/LLM applications. Feel free to reach out on [Twitter](https://twitter.com/neondatabase) or our [community forum](https://community.neon.tech/) if you have any questions or feedback, we’d love to hear from you.

Also, if you are new to Neon, you can [sign up today](https://console.neon.tech/) for free.
