---
title: 'RAG With Autoscaling: Better Performance With Lower Costs For pgvector'
description: How Neon dynamically extends memory for HNSW index build
excerpt: >-
  Neon’s autoscaling, now GA and available in all pricing plans, enables
  Postgres instances to dynamically scale up for the high memory and CPU demands
  of HNSW index builds, avoiding constant overprovisioning. With memory
  extension through disk swaps, Neon efficiently handles large...
date: '2024-08-27T15:17:26'
updatedOn: '2024-08-27T15:17:29'
category: ai
categories:
  - ai
authors:
  - raouf-chebri
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/rag-with-autoscaling/cover.png
  alt: null
isFeatured: false
seo:
  title: >-
    RAG With Autoscaling: Better Performance With Lower Costs For pgvector -
    Neon
  description: >-
    Neon’s autoscaling enables pgvector to dynamically scale up memory and CPU
    for HNSW index builds, avoiding constant overprovisioning.
  keywords: []
  noindex: false
  ogTitle: >-
    RAG With Autoscaling: Better Performance With Lower Costs For pgvector -
    Neon
  ogDescription: >-
    Neon’s autoscaling enables pgvector to dynamically scale up memory and CPU
    for HNSW index builds, avoiding constant overprovisioning.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/rag-with-autoscaling/social.png
source:
  wpId: 6815
  wpSlug: rag-with-autoscaling
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/rag-with-autoscaling/image-3-1024x576-ca9bd983.png)

**Neon’s autoscaling, [now GA and available in all pricing plans](https://neon.tech/blog/neon-autoscaling-is-generally-available), enables Postgres instances to dynamically scale up for the high memory and CPU demands of HNSW index builds, avoiding constant overprovisioning. With memory extension through disk swaps, Neon efficiently handles large index builds even with lower resource limits, ensuring optimal performance.** **[Start using Neon autoscaling by creating a free account.](https://console.neon.tech/signup)**

Querying large datasets is slow at scale because scanning entire databases could be more efficient. Take, for example, running a vector similarity search operation on a 1 million-row dataset on an 8-CPU Neon instance. The query takes approximately 3 seconds to complete.

```bash
SELECT _id from documents order by embeddings <=> '[ 0.002297497,... ,-0.0027592175]' LIMIT 100;
```

Vector similarity search is essential for Retrieval-Augmented Generation (RAG) apps and allows large language models (LLM) to generate a better-quality output. However, a 3-second query execution time can negatively impact user experience.

This article explores the challenges of scaling vector similarity searches and how to optimize for them using pgvector and Neon’s autoscaling capabilities.

If we EXPLAIN ANALYZE the above query, we observe that the query performs a sequential scan (Seq Scan), meaning that the database calculates the distances between my query vector and all the vectors present in my database before returning the correct values. It’s like asking a person to read the entire dictionary whenever they’re looking for a specific word.

```bash
Limit  (cost=75633.07..75644.74 rows=100 width=37) (actual time=3129.293..3132.399 rows=100 loops=1)
  ->  Gather Merge  (cost=75633.07..172862.16 rows=833334 width=37) (actual time=3129.291..3132.390 rows=100 loops=1)
        Workers Planned: 2
        Workers Launched: 2
        ->  Sort  (cost=74633.05..75674.71 rows=416667 width=37) (actual time=3126.507..3126.515 rows=80 loops=3)
              Sort Key: ((embeddings <=> '[0.002297497,-0.009297881,... ,-0.0027592175]'::vector))
              Sort Method: top-N heapsort  Memory: 38kB
              Worker 0:  Sort Method: top-N heapsort  Memory: 39kB
              Worker 1:  Sort Method: top-N heapsort  Memory: 37kB
              ->  Parallel Seq Scan on documents  (cost=0.00..58708.33 rows=416667 width=37) (actual time=0.124..3075.654 rows=333333 loops=3)
Planning Time: 0.106 ms
Execution Time: 3132.427 ms
```

## Speeding up queries with efficient HNSW index builds

Luckily for us, Postgres and pgvector come with indexes such as HNSW, which, in this example, speed up vector similarity search queries by a factor of 3,000.

```bash
Limit  (cost=388.72..594.43 rows=100 width=37) (actual time=0.873..1.148 rows=40 loops=1)
  ->  Index Scan using documents_embeddings_idx1 on documents  (cost=388.72..2057516.72 rows=1000000 width=37) (actual time=0.872..1.143 rows=40 loops=1)
        Order By: (embeddings <=> '[0.002297497,...,-0.0027592175]'::vector)
Planning Time: 0.059 ms
Execution Time: 1.164 ms
```

To help speed up vector similarity search queries, the HNSW creates a multi-layer graph by calculating the distances among all vectors. However, the index build operation requires a large amount of memory and multiple CPUs for parallelization. In the example below, we used 8 (7+1) workers and 8GB of `maintenance_work_mem` to fit and build the index.

```bash
SET max_parallel_maintenance_workers = 7;
SET maintenance_work_mem = '8GB';
CREATE INDEX ON documents USING hnsw (embeddings vector_cosine_ops);
```

Note that pgvector can build the index despite having insufficient `maintenance_work_mem`. However, this will take significantly longer to complete.

Using the query below, we confirm that the index size is approximately 8GB.

```bash
SELECT pg_size_pretty(pg_relation_size('documents_embeddings_idx')) AS index_size;
 index_size
------------
 7813 MB
(1 row)
```

Index build operations are essential, but they are only run to initialize and maintain the index in case of heavy updates. HNSW’s dependence on CPU and memory resources for infrequent index build operations makes scaling vector similarity search and RAG quite expensive. An ideal scenario is to scale up your Postgres instance to build the index, then scale it back down to serve your customers cost-efficiently.

This is why we implemented Index Build operations to Neon Autoscaling.

## How Neon’s autoscaling optimizes HNSW index builds

[Neon Autoscaling](https://neon.tech/blog/neon-autoscaling-is-generally-available) dynamically resizes your Postgres instance based on load, allowing you to constantly meet your application demands and saving you cost. In the previous example, we must allocate a minimum of 8GB of memory and 2 CPUs. With Neon, all I need to do is specify the minimum and maximum resources the application needs and leave it to the Autoscaling feature to handle the resizing. I can allocate as few as ¼ shared CPUs to a maximum 8 CPUs.

![Image](https://lh7-rt.googleusercontent.com/docsz/AD_4nXfxLfBKiKqEwdBn4wp_ZAh2-mnIJwt1V7DALj8Fa4L91gsbFUNJyDq7TimhAAov14sqKC9-WfVR4vg0VdzXKPWszNB58-LnExgYoAYcPrE2sty9xqWN1aoesPzvG5I18n6WTSkKkZB4aIDfADkQnybOlnvp?key=Zzky4o4tmZ1ay0Wg6zTUZg)

Using the index build query below, we inform Postgres we want to use 8 workers and allocate 8GB of `maintenance_work_mem`. Consequently, the autoscaler-agent will detect the load on CPU usage and allocate additional resources.

```bash
SET max_parallel_maintenance_workers = 7;
SET maintenance_work_mem = '8GB';
CREATE INDEX ON documents USING hnsw (embeddings vector_cosine_ops);
```

However, on Neon, CPU and memory scale together and are measured by compute units (CU). For example, 1CU = 1vCPU and 4GB of memory. 2CU = 2vCPUs and 8GB of memory.

The challenge with scaling index build such as pgvector’s is that `maintenance_work_mem` is allocated upfront. So how do we fit 8GB of memory in 1GB? To overcome this, Neon uses disk swaps, a technique to extend the apparent amount of physical memory size by using disk storage. This means that when we run `SET maintenance_work_mem = '8GB'` with ¼ CU, we let Postgres “believe” it has access to 8GB of memory by allocating disk swaps, eventhough its current limit is 1GB. As the index build progresses, we save the articfacts on disk at every CU increment and swap them back to memory.

![Image](https://lh7-rt.googleusercontent.com/docsz/AD_4nXepnPYLL7NAF8aiKWWC6h_4VfxkIx3AMA849Ds9cw84d-KD0pNVUhu1Qlzl-wXZ27_f0B4F0Ko3Crvk6Cio8ObcAgtP7S6DHa9n1A67jM_pnnJFGUmSZUCB18f5rJ-GWFZnyND7B9VACXdca1H9Lmqqcxo?key=Zzky4o4tmZ1ay0Wg6zTUZg)

## Conclusion

Neon’s autoscaling feature is beneficial for handling the intensive resource demands of index build operations. It allows for dynamic resizing of Postgres instances based on load, optimizing both performance and cost. The ability to scale up for resource-heavy tasks, like creating an HNSW index, and scale down during normal operations ensures that the system remains cost-efficient without compromising on performance.

Autoscaling is available for all Neon databases, [including the Free plan](https://neon.tech/pricing). [Create a Neon account today if you haven’t already](https://console.neon.tech/signup). Join us on [Discord](https://neon.tech/discord), follow us on [X](https://x.com/neondatabase), and let us know what you think.
