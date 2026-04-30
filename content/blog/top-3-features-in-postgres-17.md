---
title: Top 3 features in Postgres 17
description: Plus our contributions
excerpt: >-
  One more year, Postgres is the most loved and trusted database in the
  world—and it’s about to get better with Postgres 17. This upcoming release
  comes with improvements both in developer experience and performance. Top 3
  features in Postgres 17 MERGE command with RETURNING suppor...
date: '2024-08-30T16:11:21'
updatedOn: '2024-08-30T16:11:24'
category: postgres
categories:
  - postgres
authors:
  - anastasia-lubennikova
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/top-3-features-in-postgres-17/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Top 3 features in Postgres 17 - Neon
  description: >-
    One more year, Postgres is the most loved and trusted database in the
    world—and it’s about to get better with Postgres 17.
  keywords: []
  noindex: false
  ogTitle: Top 3 features in Postgres 17 - Neon
  ogDescription: >-
    One more year, Postgres is the most loved and trusted database in the
    world—and it’s about to get better with Postgres 17.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/top-3-features-in-postgres-17/social.jpg
source:
  wpId: 6906
  wpSlug: top-3-features-in-postgres-17
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/top-3-features-in-postgres-17/neon-postgres-17-1024x576-43ef1e97.jpg)

One more year, Postgres is the most loved and trusted database in the world—and it’s about to get better with [Postgres 17](https://www.postgresql.org/about/news/postgresql-17-beta-1-released-2865/). This upcoming release comes with improvements both in developer experience and performance.

## Top 3 features in Postgres 17

### MERGE command with RETURNING support

**_Why we like this change: it helps application developers who need to handle conditional data modifications without juggling multiple queries._**

Building on the `MERGE` command [introduced in Postgres 15](https://neon.tech/blog/postgresql-15-three-features-you-can-try-with-neon), Postgres 17 takes it a step further by adding support for the `RETURNING` clause. This improvement allows developers to retrieve and return the rows modified by the `MERGE` operation in a single step, reducing the need for additional queries and simplifying complex workflows. You’ll be able to write more concise and efficient SQL, especially in scenarios involving conditional inserts, updates, or deletions.

Example:

```sql
CREATE TABLE hero (
    id SERIAL PRIMARY KEY,
    first_name text,
    last_name text,
    hero_name text UNIQUE
);

-- Insert new hero or update existing one based on hero_name
MERGE INTO hero h
USING (VALUES ('Wade', 'Wilson', 'Deadpool')) v(first_name, last_name, hero_name)
ON h.hero_name = v.hero_name
WHEN MATCHED THEN
  UPDATE SET first_name = v.first_name, last_name = v.last_name
WHEN NOT MATCHED THEN
  INSERT (first_name, last_name, hero_name)
  VALUES (v.first_name, v.last_name, v.hero_name)
RETURNING merge_action(), *;

-- returns:
-- merge_action | id | first_name | last_name | hero_name
-- -------------|----|------------|-----------|-----------
-- UPDATE       | 1  | Wade       | Wilson    | Deadpool
```

This code either updates the first and last names of an existing hero if the `hero_name` matches, or inserts a new hero if no match is found. The `RETURNING` clause returns the result of the operation along with the hero’s data, making it easier to handle the modified rows in one step.

### Enhanced JSON functions

**_Why we like this change: it caters to the growing demand for managing semi-structured data in Postgres, offering more straightforward ways to work with JSON._**

Postgres 17 improves how you can search, extract, and manipulate JSON data, adding support for new JSON path functions like `JSON_TABLE`. This function allows you to convert JSON data directly into a relational table format, making it easier to use SQL queries on JSON data without first needing to unpack or transform it manually:

```sql
SELECT *
FROM json_table(
  '[
     {"product": "Laptop", "details": {"price": 1200, "stock": 25}},
     {"product": "Smartphone", "details": {"price": 800, "stock": 50}},
     {"product": "Tablet", "details": {"price": 500, "stock": 40}}
   ]',
  '$[*]'
  COLUMNS (
    product_name TEXT PATH '$.product',
    price INT PATH '$.details.price',
    stock INT PATH '$.details.stock'
  )
) AS jt;

 product_name | price | stock
--------------|-------|-------
 Laptop       | 1200  | 25
 Smartphone   | 800   | 50
 Tablet       | 500   | 40
```

### Improved performance

**_Why we like this change: who doesn’t like faster queries? It’s also great to see Postgres addressing some of its weak points, like vacuum operations._**

This release introduces several changes that improve both query performance and operational efficiency, including improvements in parallel query processing, in the vacuum process, and in B-tree index performance. Vacuum now utilizes a new internal data structure that reduces memory usage by up to 20x and allows for greater flexibility by lifting the previous 1GB memory cap. Additionally, B-tree index performance sees a boost with optimized handling of IN clauses, resulting in quicker query execution for operations involving large lists of values.

## Contributions by Neon engineers in Postgres 17

As members of the Postgres community, we’ve also contributed to Postgres 17. Here’s a summary of the commits that we’ve worked on, together with the broader community:

### EXPLAIN (SERIALIZE)

Postgres 17 comes with this new option, which allows for a detailed analysis of the time taken and the data emitted by a query, including the cost of data serialization. This is especially useful for performance tuning, as it provides insights that were previously unavailable without transmitting data to the client. _(Stepan Rutz, Matthias van de Meent)_

### BRIN parallel index builds

Postgres 17 also introduces support for parallel builds of BRIN (Block Range INdex) indexes. This feature significantly reduces the time required to build BRIN indexes on large datasets, particularly in multi-core environments. _(Tomas Vondra, Matthias van de Meent)_

### B-Tree performance improvement for IN-lists

This enhancement optimizes how Postgres handles large IN lists within queries, leading to better performance for queries that use B-tree indexes with such lists. _(Peter Geoghegan, Matthias van de Meent)_

### Vacuum performance

Postgres 17 comes with a better vacuum performance, particularly for large tables with many indexes. This makes vacuuming operations faster and more efficient, especially in high-concurrency environments. _(Melanie Plageman, Heikki Linnakangas)_

### Direct SSL/TLS connections

A new parameter in Postgres 17 allows for direct TLS handshakes, reducing network latency and improving the performance of secure connections. _(Greg Stark, Heikki Linnakangas, Peter Eisentraut, Michael Paquier, Daniel Gustafsson)_

### Source code improvements

We contributed to various optimizations and refactorings in the Postgres codebase, enhancing the overall stability and performance of the system—e.g. by removing AIX support and the configure options –disable-thread-safety and –with-CC. (_Heikki Linnakangas)_

### Improvements in libpq/psql

Postgres 17 also comes with various enhancements to libpq and psql. These improvements mean a more robust and feature-rich developer experience when interacting with Postgres from the command line or via applications. _(Tristan Partin, Tom Lane)_

### Event triggers after client connect

Postgres 17 introduces event triggers that can be fired after a client connection is established. This feature provides more granular control over session-level operations, allowing developers to enforce specific policies or initialize settings dynamically upon connection. _(Konstantin Knizhnik, Mikhail Gribkov)_

### AMCheck validation of B-Tree uniqueness

This feature adds more thorough validation checks for B-tree indexes. It extends the amcheck tool, allowing for deeper verification of index consistency, including parent-child relationships within the B-tree structure and making it easier to detect corruption or logical inconsistencies. _(Anastasia Lubennikova, Pavel Borisov, Maxim Orlov)_

## Coming soon

We’re planning to support Postgres 17 in Neon as soon as it’s GA. To review all changes in Postgres 17, click [here](https://www.postgresql.org/docs/17/release-17.html) or review the [commitfests](https://commitfest.postgresql.org/), and stay tuned for more.
