---
title: Performance tips for Neon Postgres
description: Good practices to keep your queries and ingests fast
excerpt: >-
  Neon is serverless Postgres. Neon databases elastically scale up and down
  according to load—including scaling to zero—and database operations are
  greatly simplified via robust API support and database branching capabilities.
  But just like every Postgres, to get the most out of Ne...
date: '2024-04-04T16:56:28'
updatedOn: '2025-02-25T14:27:40'
category: postgres
categories:
  - postgres
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/performance-tips-for-neon-postgres/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Performance tips for Neon Postgres - Neon
  description: >-
    Neon simplifies Postgres management due to its serverless nature. Get
    optimal performance by following these simple best practices.
  keywords: []
  noindex: false
  ogTitle: Performance tips for Neon Postgres - Neon
  ogDescription: >-
    Neon simplifies Postgres management due to its serverless nature. Get
    optimal performance by following these simple best practices.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/performance-tips-for-neon-postgres/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/performance-tips-for-neon-postgres/neon-performance-tips-1-1024x576-867903e3.jpg)

[Neon](https://neon.tech/) is serverless Postgres. Neon databases elastically scale up and down according to load—including scaling to zero—and database operations are greatly simplified via [robust API support](https://api-docs.neon.tech/reference/getting-started-with-neon-api?__hstc=4255788.e7f27dd03bdedc4049d0cbd46ad91c27.1705698345533.1712185061623.1712247421502.187&__hssc=4255788.5.1712247421502&__hsfp=1117521915) and [database branching capabilities](https://neon.tech/blog/how-to-copy-large-postgres-databases-in-seconds). But just like every Postgres, to get the most out of Neon’s performance, it’s good to know a few tricks and best practices.

## Compute sizing and connections management

Let’s start by quickly covering some Neon resource sizing essentials:

- If your application handles multiple connections, use [connection pooling](https://neon.tech/docs/connect/connection-pooling).
- In Neon, the system allocates a certain amount of RAM per connection to ensure stable performance. A [general rule of thumb](https://neon.tech/docs/connect/connection-pooling#default-connection-limits) is that Neon allows approximately 100 connections per 1 GB of RAM. You can consider this ratio for planning the scale of your compute resources based on the expected number of concurrent connections.
- The best way to cover this is by taking advantage of Neon’s [autoscaling](https://neon.tech/docs/introduction/autoscaling) to dynamically adjust compute resources based on actual usage patterns. Autoscaling can help manage unexpected spikes in connections or workload, ensuring that your database remains responsive under varying conditions.

While it might be tempting to minimize costs by keeping compute resources limited, under-provisioning can lead to performance issues, especially during peak loads. If you enable autoscaling, you don’t have to worry about this – we highly recommend it.

## Troubleshooting Postgres query performance

As we covered in this [Support Recap](https://neon.tech/blog/postgres-support-recap-investigating-postgres-query-performance) blog post, fixing query performance is something that comes up frequently among Postgres users. Things were looking fast yesterday but are sluggish today: what’s going on?

### Using pg_stat_statements for performance analysis

First, you will want to drill down exactly which queries are problematic. You can use [`pg_stat_statements`](https://www.postgresql.org/docs/current/pgstatstatements.html) for that:

```sql
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

This extension aggregates statistics such as the number of times a query has been executed, the total time spent on execution, or number of rows returned. You can explore the structure and types of data it collects by running:

```sql
\d pg_stat_statements
```

Among other things, `pg_stat_statements` allows you to identify long-running queries. For example, consider this example:

```sql
WITH statements AS (
  SELECT *
  FROM pg_stat_statements pss
  JOIN pg_roles pr ON (userid = oid)
  WHERE rolname = current_user
)
SELECT 
  calls, 
  min_exec_time,
  max_exec_time, 
  mean_exec_time,
  stddev_exec_time,
  (stddev_exec_time / mean_exec_time) AS coeff_of_variance,
  query
FROM 
  statements
WHERE 
  calls > 100
ORDER BY 
  mean_exec_time DESC
LIMIT 10;
```

The output would look similar to this:

```sql
 calls | min_exec_time | max_exec_time | mean_exec_time | stddev_exec_time | coeff_of_variance | query 
-------+---------------+---------------+----------------+------------------+-------------------+---------------------------------------------------------
  150  | 25.6          | 78.3          | 48.9           | 12.5             | 0.26              | SELECT * FROM orders WHERE order_date >= '2023-01-01';
  200  | 15.2          | 120.4         | 45.6           | 22.8             | 0.50              | SELECT customer_id, SUM(price) FROM sales GROUP BY customer_id;
  125  | 30.8          | 65.0          | 40.2           | 10.4             | 0.26              | SELECT name, email FROM customers WHERE signup_date < '2022-01-01';
  175  | 12.0          | 55.7          | 35.5           | 9.9              | 0.28              | UPDATE products SET stock = stock - 1 WHERE product_id = 1234;
  300  | 5.3           | 80.2          | 30.7           | 15.3             | 0.50              | SELECT product_id, COUNT(*) FROM reviews GROUP BY product_id;
```

This output would help you identify queries that could benefit from optimization. For example, queries with high execution times and a significant number of `calls` would be good candidates for review—like this one:

```sql
SELECT customer_id, SUM(price) FROM sales GROUP BY customer_id;
```

### Diving deeper with EXPLAIN ANALYZE

Once you have identified your problematic queries, you can use [EXPLAIN (ANALYZE, BUFFERS)](https://thoughtbot.com/blog/reading-an-explain-analyze-query-plan) on them to dive deeper into why they are slow:

```sql
EXPLAIN (ANALYZE, BUFFERS) SELECT customer_id, SUM(price) FROM sales GROUP BY customer_id;
```

Consider this hypothetical output:

```sql
GroupAggregate  (cost=1000.43..4825.78 rows=1500 width=40) (actual time=10.123..30.567 rows=1500 loops=1)
  Buffers: shared hit=3823 read=29
  ->  Sort  (cost=1000.43..1025.78 rows=10140 width=16) (actual time=10.081..20.125 rows=10140 loops=1)
        Sort Key: customer_id
        Sort Method: quicksort  Memory: 25kB
        Buffers: shared hit=3823 read=29
        ->  Seq Scan on sales  (cost=0.00..577.40 rows=10140 width=16) (actual time=0.013..5.067 rows=10140 loops=1)
              Buffers: shared hit=3823 read=29
Planning Time: 0.067 ms
Execution Time: 31.234 ms
```

This would tell you a lot. For example: the execution plan begins with a [sequential scan](https://www.pgmustard.com/docs/explain/sequential-scan) (`Seq Scan`) of the sales table, followed by sorting (`Sort`) the results on `customer_id`, and then performing a grouping operation (`GroupAggregate`). This indicates that the query scans the entire table to find the relevant rows, which is not efficient – especially if your table is getting large.

## Improving query performance in Neon Postgres

Once you have an idea of where things may be wrong, you can try these tactics:

### Add new indexes (if you need them)

If we go back to the previous example, given the insights from EXPLAIN ANALYZE, you might decide to add an index on `customer_id`, especially if that was a query you run often:

```sql
CREATE INDEX idx_sales_customer_id ON sales(customer_id);
```

After implementing this index, rerunning `EXPLAIN ANALYZE` on the query should show that Postgres now performs an index scan instead of a sequential scan, which should reduce the execution time.

### Reduce bloat

After ruling out indexes, the next thing to consider would be table bloat. Managing bloat can be (unfortunately) [quite a pain in Postgres](https://rbranson.medium.com/10-things-i-hate-about-postgresql-20dbab8c2791), so it really pays off to keep an eye on it. A bloated table not only will be less performant, but it will also need much more storage than a healthy table – [therefore inflating your bill.](https://neon.tech/blog/6-tips-to-optimize-storage-costs-for-your-postgres-databases)

Let’s go back to our previous EXPLAIN example output. Imagine we already had an index in customer_id; its absence in the plan might indicate that the index is inefficient, possibly due to bloat. A bloated index can lead Postgres to default back to a full table scan.

To fix this, you could consider a strategy with two parts:

- First, you would fix your inefficient index by running the [REINDEX](https://www.postgresqltutorial.com/postgresql-indexes/postgresql-reindex/) command. This command will rebuild your index from scratch. Beware: this is an intensive operation, so plan to do this during a maintenance period.
- Second, you would prevent this from happening again by addressing table bloat regularly. Consider [fine-tuning your autovacuum settings](https://www.percona.com/blog/tuning-autovacuum-in-postgresql-and-autovacuum-internals/), for example adjust parameters such as `autovacuum_vacuum_scale_factor` and `autovacuum_vacuum_threshold`. Yon can also schedule regular bloat check-ups as part of your Postgres maintenance routine. For example, the [pgstattuple](https://www.postgresql.org/docs/16/pgstattuple.html) extension provides functions to show table and index bloat levels.

### Cache your data

If you optimize indexes and reduce bloat but still observe suboptimal performance, checking cache usage could be a good next step.

Ensuring that data you frequently access is predominantly served from cache can mitigate performance issues not solved by indexing alone. This is especially important in Neon, [given its unique architecture that extends Postgres shared buffers with a local file cache.](https://neon.tech/blog/architecture-decisions-in-neon) The process of analyzing cache usage therefore looks a bit different in Neon vs in traditional Postgres.

To evaluate caching effectiveness in Neon, you need to look at local file cache hits instead of shared buffer hits. Neon allows you to do this by providing a `neon_stat_file_cache` view. To access this view, you need to install the neon extension first:

```sql
CREATE EXTENSION neon;
```

After your workload has been running and generating data, you can analyze your cache hit ratio by running this command:

```sql
SELECT * FROM neon_stat_file_cache;
```

Your output might look like this:

```sql
file_cache_misses:                 2133643
file_cache_hits:                   108999742
file_cache_used:                   607
file_cache_writes:                 10767410
file_cache_hit_ratio:              98.08
```

If the hit ratio falls below the ideal threshold (99% in Neon), [reconsider your compute configuration – e.g. increase your autoscaling limits.](https://neon.tech/docs/manage/endpoints#how-to-size-your-compute) Often, the reason behind this issue is inefficient memory allocation, which is a simple thing to fix.

## Optimizing ingestion rates in Neon Postgres

Now that we’ve talked about how to diagnose and fix slow queries, it’s time to cover writes. If you care about ingesting as much data as possible into your Postgres database, here are some simple strategies that can get you a long way.

### Make sure your client has enough compute

This is a basic, but it happens. At the start of this post, we mentioned how it is important to make sure your Neon instances have enough resources to enable good performance; but to optimize ingests, the resources available on the client side are also important. Ensure that you have enough CPU, memory, and bandwidth in your client to handle the data load efficiently. Also, try hosting your Neon project as close as possible (geographically) to your client.

### Use read replicas

This tip could also live in the query performance section since it helps both with writes and reads. If your application deals with heavy writes, heavy read queries, or both, Neon allows you to liberate load in your main compute by offloading read queries to a [read-only compute endpoint](https://neon.tech/docs/introduction/read-replicas), which is equivalent to the concept of read replica in other databases.

The main difference between Neon’s implementation and “regular” read replicas resides in the serverless nature of Neon. In Neon, [read replicas are ephemeral](https://neon.tech/blog/white-widgets-secret-to-scalable-postgres-neon): they don’t need their own copy of storage, they’re ready instantly when you need them, and they scale down to zero when traffic slows down. They’re much more affordable than traditional read replicas – [take advantage of them.](https://neon.tech/docs/guides/read-replica-guide)

### Insert data in batches

One of the most simple yet effective strategies for improving ingestion rates is batch insert operations. Instead of inserting rows one by one, group them into larger transactions.

For example, instead of executing individual `INSERT` statements for each row:

```sql
INSERT INTO sales (customer_id, price) VALUES (1, 100); 
INSERT INTO sales (customer_id, price) VALUES (2, 150); 
-- And so on...
```

Combine them into a single statement:

```sql
INSERT INTO sales (customer_id, price) VALUES (1, 100), (2, 150), ..., (N, PriceN);
```

### Clean up old indexes

One last tip. In the section about query performance, we covered why creating new indexes is sometimes a good idea – but with databases, it’s wise to always follow a Goldilocks approach. It’s also important to mention how having many indexes can impact your insert operations, since every time you write data, Postgres has to update all indexes associated with the table, which might introduce latency.

A good practice is to regularly evaluate the indexes on your tables (`\d table_name`) to ensure they are still essential for your queries, deleting the indexes that are no longer needed.

## Safely testing performance improvements

Testing performance improvements in production databases can be challenging due to the risks involved. Neon makes it easy with [database branching](https://neon.tech/docs/guides/branching-test-queries): you can create a full, isolated copy of your database (data and schema) in a separate branch, where you can experiment freely without the risk of disrupting your live operations.

To [create a testing branch](https://neon.tech/docs/guides/branching-test-queries#create-a-test-branch), you can use Neon’s CLI ([or the API](https://api-docs.neon.tech/reference/getting-started-with-neon-api?__hstc=4255788.e7f27dd03bdedc4049d0cbd46ad91c27.1705698345533.1712185061623.1712247421502.187&__hssc=4255788.2.1712247421502&__hsfp=1117521915)), specifying your production branch as the source:

```bash
neonctl branches create --project-id <project-id> --name my_test_branch
```

This creates a new, instantly available database environment that mirrors your production data and structure at the moment of branching, where you can modify indexes, adjust queries, and experiment with different configurations without affecting the production database.

## Wrap up

We hope these strategies help you keep your Neon Postgres as fast as possible, so you can keep scaling your workloads at ease. [Check out our docs](https://neon.tech/docs/postgres/query-performance#use-joins-instead-of-subqueries) for even more performance advice, and if you haven’t tried Neon yet, [create a free account now.](https://console.neon.tech/signup)
