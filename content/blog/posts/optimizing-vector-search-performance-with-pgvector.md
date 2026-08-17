---
title: Optimizing vector search performance with pgvector
description: >-
  A Guide to Fine-Tuning Parameters for Efficient and Accurate Similarity
  Searches in Postgres
excerpt: >-
  According to the StackOverflow Survey 2023, nearly half of professional
  developers use Postgres. It’s natural then that the Postgres extension for
  vector similarity search, pgvector, is one of the most popular options for
  prototyping AI-powered applications. But how to properly u...
date: '2023-06-28T16:01:07'
updatedOn: '2025-10-14T05:53:42'
category: community
categories:
  - community
  - product
authors:
  - raouf-chebri
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/optimizing-vector-search-performance-with-pgvector/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Optimizing vector search performance with pgvector - Neon
  description: >-
    A Guide to Fine-Tuning Parameters for Efficient and Accurate Similarity
    Searches in Postgres
  keywords: []
  noindex: false
  ogTitle: Optimizing vector search performance with pgvector - Neon
  ogDescription: >-
    According to the StackOverflow Survey 2023, nearly half of professional
    developers use Postgres. It’s natural then that the Postgres extension for
    vector similarity search, pgvector, is one of the most popular options for
    prototyping AI-powered applications. But how to properly use pgvector? Is it
    the right tool for your dataset? Do you need an exact […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/optimizing-vector-search-performance-with-pgvector/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/optimizing-vector-search-performance-with-pgvector/neon-pgvector-1024x576-0b60c837.jpg)

According to the [StackOverflow Survey 2023](https://survey.stackoverflow.co/2023/#most-popular-technologies-database-prof), nearly half of professional developers use Postgres. It’s natural then that the Postgres extension for vector similarity search, [pgvector](https://github.com/pgvector/pgvector), is one of the most popular options for prototyping AI-powered applications.

But how to properly use pgvector? Is it the right tool for your dataset? Do you need an exact or approximate nearest neighbor (ANN) search? What parameters yield the best performance?

In this article, we explore the questions above to determine how you should use pgvector in your applications.

## Sequential scans with pgvector

You can add pgvector extension to your Neon project using the following query:

CREATE EXTENSION vector;

By default, pgvector performs a sequential scan on the database and calculates the distance between the query vector and all vectors in the table. This approach does an exact search and guarantees 100% recall, but it can become costly with large datasets.

The query below uses EXPLAIN ANALYZE to generate the execution plan and displays the performance of the similarity search query.

```sql
EXPLAIN ANALYZE SELECT * FROM documents ORDER BY embedding <-> '[0.011699999682605267,..., 0.008700000122189522]' LIMIT 100;
```

This is what the result looks like:

```bash
Limit  (cost=748.19..748.44 rows=100 width=173) (actual time=39.475..39.487 rows=100 loops=1)

  ->  Sort  (cost=748.19..773.19 rows=10000 width=173) (actual time=39.473..39.480 rows=100 loops=1)

        Sort Key: ((vec <-> ' [0.0117,..., 0.0866]'::vector))

        Sort Method: top-N heapsort  Memory: 70kB

        ->  Seq Scan on items  (cost=0.00..366.00 rows=10000 width=173) (actual time=0.087..37.571 rows=10000 loops=1)

Planning Time: 0.213 ms

Execution Time: 39.527 ms
```

Note the `Seq Scan on items` means that the query compares the query vector against all vectors in the documents table.

To understand how queries perform at scale, we ran sequential scan vector searches with pgvector on subsets of the GIST-960 dataset with 10k, 50k, 100k, 500k, and 1M rows using a Neon database instance with 4 vCPUs and 16 GB of RAM.

![Image](https://cdn.neonapi.io/public/images/pages/blog/optimizing-vector-search-performance-with-pgvector/sequential-scans-with-pgvector-1024x633-9187be6d.png)

The sequential scan searchperforms reasonably well for tables with 10k rows (~36ms). However, sequential scans start to become costly at 50k rows. For tables of this size and larger, you might consider adding an index to for better performance.

## Indexing with IVFFlat

pgvector uses the Inverted File Index ([ivfflat](https://github.com/pgvector/pgvector#indexing)) for approximate nearest neighbor (ANN) search. ivfflat creates k-means centroids and partitions the dataset into clusters (also called lists) to optimize for vector search.

ANNs are faster than sequential table scans because they perform the search on a subset of the table, which is usually about the square root of the number of vectors in size. For example, for 1M rows, the ivfflat will analyze 10,000 vectors. This makes the index error-prone, which can affect recall.

You can create an index to optimize for vector search using the query below:

```sql
CREATE INDEX documents_embedding_cosine_idx ON documents USING ivfflat (embedding vector_l2_ops) WITH (lists = 1000);
```

ivfflat in pgvector has two parameters:

- Lists: the number of [k-means](https://en.wikipedia.org/wiki/K-means_clustering) clusters
- Probes: the number of lists to be explored during the search

By default, the probes parameter is set to 1 in ivfflat. This means that during search, only one cluster is explored. This approach is fine if your query vector is close to the centroid. However, if the query vector is located near the edge of the cluster, closer neighbors in adjacent clusters will not be included in the search, which can result in a lower recall.

You must specify the number of probes in the same connection as the search query. We also set `enable_seqscan`=`off` to force Postgres to use index scans.

```sql
SET ivfflat.probes = 100;
SET enable_seqscan=off;
SELECT * FROM documents ORDER BY embedding <-> ' [0.011699999682605267,..., 0.008700000122189522]' LIMIT 100;
```

Output:

```bash
Limit  (cost=1971.50..1982.39 rows=100 width=173) (actual time=4.500..5.738 rows=100 loops=1)

  ->  Index Scan using documents_embedding_idx on vectors  (cost=1971.50..3060.50 rows=10000 width=173) (actual time=4.499..5.726 rows=100 loops=1)

        Order By: (vec <-> ' [0.0117, ...,0.0866]'::vector)

Planning Time: 0.295 ms

Execution Time: 5.867 ms
```

Note that we are now using `Index Scan` and execution time is ~6ms which is faster than the 39ms we obtained using sequential scan.

We experimented with lists equal to 1000, 2000, and 4000, and probes equal to 1, 2, 10, 50, 100, 200.

Although there is a substantial gain in recall for increasing the number of probes, we reach a point of diminishing returns when recall plateaus and execution time increases.

![Image](https://cdn.neonapi.io/public/images/pages/blog/optimizing-vector-search-performance-with-pgvector/indexing-with-ivfflat-1024x633-796852f7.png)

![Image](https://cdn.neonapi.io/public/images/pages/blog/optimizing-vector-search-performance-with-pgvector/execution-time-1024x633-eb680206.png)

Therefore, we encourage you to experiment with different values for the number of probes and list sizes to achieve optimal search performance for your queries. Good places to start are:

- Use a list size equal to rows / 1000 for tables with up to 1 million rows and sqrt(rows) for larger datasets.
- For probes, start with a value equal to lists / 10 for tables up to 1 million rows and sqrt(lists) for larger datasets.

## Conclusion

In conclusion, pgvector is a powerful tool for vector similarity searches in Postgres. The sequential scan approach of pgvector performs well for small datasets but can be costly for larger ones.

We explored how you can optimize your searches by utilizing the Inverted File Index (ivfflat) for approximate nearest neighbor (ANN) searches. By creating an index with ivfflat, and tuning the parameters for lists and probes, you can strike a balance between search speed and recall.

It is important to experiment with these parameters to find the sweet spot that provides the best performance for your specific use case and dataset. Through informed experimentation and optimization, pgvector can empower AI-powered applications with efficient and reliable vector similarity searches.<br />_Thanks to_ [Noé Achache](https://twitter.com/noe_achache) _for his feedback on drafts of this post._
