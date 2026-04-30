---
title: Easier Postgres fine-tuning with online_advisor
description: >-
  A Postgres extension that points out index and stats opportunities based on
  your real workload
excerpt: >-
  You’ve heard this many times before – in order to keep your Postgres database
  working smoothly, you need to have proper index planning. Too few indexes, and
  your query performance suffers. Misestimated row counts can also trick the
  planner into poor choices, and if you’re not usi...
date: '2025-09-16T18:17:18'
updatedOn: '2025-10-06T16:11:03'
category: postgres
categories:
  - postgres
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/easier-postgres-fine-tuning-with-online_advisor/cover.jpg
  alt: null
isFeatured: true
seo:
  title: Easier Postgres fine-tuning with online_advisor - Neon
  description: >-
    online_advisor is a new Postgres extension that recommends indexes, stats,
    and prepared statements to help you optimize performance.
  keywords: []
  noindex: false
  ogTitle: Easier Postgres fine-tuning with online_advisor - Neon
  ogDescription: >-
    online_advisor is a new Postgres extension that recommends indexes, stats,
    and prepared statements to help you optimize performance.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/easier-postgres-fine-tuning-with-online_advisor/social.png
source:
  wpId: 10920
  wpSlug: easier-postgres-fine-tuning-with-online_advisor
  exportedAt: '2026-03-20T13:31:00.745Z'
---

You’ve heard this many times before – in order to keep your Postgres database working smoothly, you need to have proper index planning. Too few indexes, and your query performance suffers. Misestimated row counts can also trick the planner into poor choices, and if you’re not using prepared statements, query planning can add overhead.

The challenge is knowing **where** an index or set of statistics would actually help. That’s where a new Postgres extension can give you a hand: **`online_advisor`**. [https://github.com/knizhnik/online_advisor](https://github.com/knizhnik/online_advisor)

## What online_advisor can do

`online_advisor` analyzes your query workload in real time and points out opportunities for indexes, extended statistics, or prepared statements. It hooks into Postgres’ executor (the same mechanism used by the `auto_explain` extension) to monitor queries as they run. From this execution data, it generates actionable recommendations:

- Suggests indexes when queries filter a lot of rows without one
- Suggests extended statistics when the planner’s row estimates are way off from reality
- Identifies queries for prepared statements when planning time is eating into execution

The extension doesn’t create anything automatically. You review the proposals, decide what to apply, and then analyze the table so the planner can take advantage of the change. Postgres automatically collects statistics for each column, including distinct counts and histograms. What it does _not_ do by default is track correlations between columns. This can lead to serious underestimation when columns are dependent.

## A note on Postgres’ statistics

Postgres automatically collects statistics for each column, including distinct counts and histograms. What it does not do by default is track correlations between columns. This can lead to serious underestimation when columns are dependent.

For example:

```sql
SELECT * FROM cars WHERE company = 'Ford' AND model = 'Mustang';
```

By default, Postgres assumes `company` and `model` are independent. If 10% of rows have `company='Ford'` and 10% have `model='Mustang'`, it estimates that 1% of rows satisfy both conditions. In reality, all `Mustang` rows belong to `Ford`.

Multivariate statistics can capture these correlations, but you have to create them manually.`online_advisor` helps by flagging queries where correlated stats would improve planner estimates.

## How to use online_advisor: Examples

If you’re running Postgres on Neon, you can try it right away. Just run this in your SQL editor to enable it:

```sql
-- Enable the extension in your database
CREATE EXTENSION online_advisor;

-- Start collecting workload stats
SELECT get_executor_stats();
```

Once activated, `online_advisor` observes your workload in real time. As queries run, it tracks which predicates are filtering lots of rows, where the planner is way off in its row estimates, and how much time is being spent on planning. From this, it produces recommendations that you can review.

### Use case 1: Do I need a new index?

Suppose you have a query that frequently filters on customer_id and order_date. Without an index, Postgres might scan the whole table each time. online_advisor notices this if more than 1,000 rows ([the default `online_advisor.filtered_threshold`](https://neon.com/docs/extensions/online_advisor)) are filtered out by a predicate.

You can then check recommendations with:

```sql
SELECT create_index, n_filtered, n_called, elapsed_sec
FROM proposed_indexes
ORDER BY elapsed_sec DESC
LIMIT 5;
```

If you see something like this:

```sql
 create_index                                          | n_filtered | n_called | elapsed_sec
-------------------------------------------------------+------------+----------+------------
 CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_customer_date
   ON orders(customer_id, order_date);                 |    54231   |    320   |     184.5
```

That tells you:

- What to create: an index on `(customer_id, order_date)`
- Why: queries filtered ~54k rows without it
- How often: 320 calls in your workload
- Impact: 184 seconds of total elapsed time could be improved

You can then run the `CREATE INDEX` statement and follow up with:

```sql
VACUUM (ANALYZE) orders;
```

### Use case 2: Why is the planner making bad choices?

Sometimes the planner’s estimates are far from reality, causing it to pick suboptimal plans.`online_advisor` flags any node where actual rows are more than 10× higher than estimated (the default `online_advisor.misestimation_threshold`).

You can check recommendations with:

```sql
SELECT create_statistics, misestimation, n_called, elapsed_sec
FROM proposed_statistics
ORDER BY misestimation DESC
LIMIT 5;
```

You might see an output like:

```sql
 create_statistics                                    | misestimation | n_called | elapsed_sec
------------------------------------------------------+---------------+----------+------------
 CREATE STATISTICS s_customer_order_date
   ON customer_id, order_date FROM orders;            |     15.3      |   102    |     67.2
```

This means the planner underestimated rows by a factor of ~15. Creating extended statistics on (`customer_id`, `order_date`) will help the planner make better choices in the future.

### Use case 3: Should I be using prepared statements?

Planning overhead matters if you’re running lots of short, repetitive queries.`online_advisor` compares planning time to execution time and flags cases where planning takes longer than the query itself (`online_advisor.prepare_threshold` defaults to `1.0`).

```sql
SELECT * FROM get_executor_stats(false);
```

If `avg_planning_overhead` is greater than 1, that’s a sign you could benefit from preparing those queries instead of planning them from scratch every time.

## Try it on Neon

[Check out the docs](https://neon.com/docs/extensions/online_advisor) for all the details on online_advisor, [explore the repository](https://github.com/knizhnik/online_advisor) for more, and [get a Neon free account to try it](https://console.neon.tech/signup) if you’re not a user yet.

<Admonition type="note" title="On Postgres versions">
online_advisor supports Postgres 14–17, but on the Neon platform, it’s available for Postgres 17. (Why are they not supporting older versions: they require adding it to shared_preload_libraries, which is less convenient for cloud users.)
</Admonition>
