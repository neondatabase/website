---
title: Graph queries in Postgres
subtitle: Use ltree and pgRouting to analyze graph data in Postgres
author: vkarpov15
enableTableOfContents: true
createdAt: '2025-02-28T13:24:36.612Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

Graph databases store and analyze data connected in a network-like structure.
For example, cities connected by roads, people in a social network, or category hierarchies where categories have sub-categories.
While there are dedicated graph databases, extensions like [ltree](https://www.postgresql.org/docs/current/ltree.html) and [pgRouting](https://pgrouting.org/) add graph functionality to Postgres.

## Steps

- Enable the `ltree`, `postgis`, and `pgrouting` extensions
- Create a table to store hierarchical data
- Insert and retrieve hierarchical data
- Perform hierarchical queries using ltree
- Create a table to store network data
- Insert and query network data

## Enable ltree and pgRouting

`ltree` adds a new `LTREE` type to Postgres for storing hierarchies, like categories.
On Neon, `ltree` is available to enable with the following command.

```sql
CREATE EXTENSION IF NOT EXISTS ltree;
```

`pgrouting` is a separate extension for routing and shortest path calculations in network data, like finding the shortest path between two cities. On Neon, `pgrouting` requires the `postgis` extension, so enable `postgis` first ([Supported extensions](/docs/extensions/pg-extensions)).

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
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
For example, the following table stores a graph of roads.
Each road has a source, a target, and an associated `cost`.

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

You can then find the minimal cost path between two nodes using the `pgr_dijkstra()` function, which is an implementation of [Dijkstra's algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm).

```sql
SELECT * FROM pgr_dijkstra(
  'SELECT id, source, target, cost FROM roads',
  1, 4, false
);
```

The above query returns the following, which shows that the shortest path from node 1 to node 4 visits each node in order (1, 2, 3, 4) with an aggregate cost of 9.5. The `-1` edge on the last row marks the end of the path.

| seq | path_seq | node | edge | cost | agg_cost |
| --- | -------- | ---- | ---- | ---- | -------- |
| 1   | 1        | 1    | 1    | 4    | 0        |
| 2   | 2        | 2    | 2    | 3    | 4        |
| 3   | 3        | 3    | 3    | 2.5  | 7        |
| 4   | 4        | 4    | -1   | 0    | 9.5      |
