---
title: Graph Queries in Postgres
subtitle: A step-by-step guide describing how to use ltree and pgRouting for analyzing graph data in Postgres
author: vkarpov15
enableTableOfContents: true
createdAt: '2025-02-28T13:24:36.612Z'
updatedOn: '2025-02-28T13:24:36.612Z'
---

Graph databases are used to store and analyze data that is connected in a network-like structure.
For example, cities connected by roads, people in a social network, or category hierarchies where categories have sub-categories.
While there are dedicated graph databases, extensions like [ltree](https://www.postgresql.org/docs/current/ltree.html) and [pgRouting](https://pgrouting.org/) add graph functionality to Postgres.

## Steps

- Enable the `ltree` and `pgrouting` extensions
- Create a table to store hierarchical data
- Insert and retrieve hierarchical data
- Perform hierarchical queries using ltree
- Create a table to store network data
- Insert and query network data

## Enable ltree and pgRouting

`ltree` adds a new `LTREE` type to Postgres for storing hierarchies, like categories.
In Neon, `ltree` is already installed, you just need to enable it using the following command.

```sql
CREATE EXTENSION IF NOT EXISTS ltree;
```

`pgrouting` is a separate extension that can be used for routing and shortest path calculations in network data, like finding the shortest path between two cities.

```sql
CREATE EXTENSION IF NOT EXISTS pgrouting;
```

## Create a table to store hierarchical data

With `ltree`, you can store hierarchical relationships such as category trees, organizational charts, or file directories.
You can create a table to store a category tree using the following command.

```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  path LTREE
);
```

## Insert and retrieve hierarchical data

The `ltree` type allows inserting hierarchical paths:

```sql
INSERT INTO categories (name, path) VALUES
  ('Electronics', 'Electronics'),
  ('Laptops', 'Electronics.Laptops'),
  ('Gaming Laptops', 'Electronics.Laptops.Gaming');
```

You can retrieve all subcategories under a given path using `<@` as follows.

```sql
SELECT * FROM categories WHERE path <@ 'Electronics.Laptops';
```

| id  | name           | path                       |
| --- | -------------- | -------------------------- |
| 2   | Laptops        | Electronics.Laptops        |
| 3   | Gaming Laptops | Electronics.Laptops.Gaming |

## Create a table to store network data

With `pgrouting`, you can model roads, social networks, or any graph-like data structure.
For example, the following table stores a graph of roads that have an associated `cost`.
Each road has a source and a target, and an associated `cost`.

```sql
CREATE TABLE roads (
  id SERIAL PRIMARY KEY,
  source INT,
  target INT,
  cost FLOAT
);
```

## Insert and query network data

Insert edges representing connections between nodes using the following command.

```sql
INSERT INTO roads (source, target, cost) VALUES
  (1, 2, 4.0),
  (2, 3, 3.0),
  (3, 4, 2.5),
  (1, 4, 10.0);
```

You can then find the minimal cost path between two nodes using the `pgr_dijkstra()` function, which is an implementation of [Dijkstra's Algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm).

```sql
SELECT * FROM pgr_dijkstra(
  'SELECT id, source, target, cost FROM roads',
  1, 4, false
);
```

The above query returns the following, which shows the shortest path from node 1 to node 4 is by visiting each node in order (1, 2, 3, 4) with an aggregate cost of 9.5.

| seq | path_seq | node | edge | cost | agg_cost |
| --- | -------- | ---- | ---- | ---- | -------- |
| 1   | 1        | 1    | 1    | 4    | 0        |
| 2   | 2        | 2    | 2    | 3    | 4        |
| 3   | 3        | 3    | 3    | 2.5  | 7        |
| 4   | 4        | 4    | 4    | 0    | 9.5      |
