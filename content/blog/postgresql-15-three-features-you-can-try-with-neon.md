---
title: 'PostgreSQL 15: Three features you can try with Neon'
description: Announcing support for PostgreSQL 15
excerpt: >-
  Today, we’re pleased to announce support for PostgreSQL 15. PostgreSQL 15
  includes improved sort performance, write-ahead log (WAL) file compression,
  and other improvements. Here are some features you can try using Neon’s SQL
  Editor. SQL MERGE The MERGE query can UPDATE, INSERT,...
date: '2022-10-26T12:09:42'
updatedOn: '2023-08-21T13:10:40'
category: community
categories:
  - community
authors:
  - anastasia-lubennikova
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/postgresql-15-three-features-you-can-try-with-neon/cover.jpg
  alt: null
isFeatured: false
seo:
  title: 'PostgreSQL 15: Three features you can try with Neon - Neon'
  description: Announcing support for PostgreSQL 15
  keywords: []
  noindex: false
  ogTitle: 'PostgreSQL 15: Three features you can try with Neon - Neon'
  ogDescription: >-
    Today, we’re pleased to announce support for PostgreSQL 15. PostgreSQL 15
    includes improved sort performance, write-ahead log (WAL) file compression,
    and other improvements. Here are some features you can try using Neon’s SQL
    Editor. SQL MERGE The MERGE query can UPDATE, INSERT, or DELETE rows with a
    single SQL statement. PostgreSQL will insert a new […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/postgresql-15-three-features-you-can-try-with-neon/social.png
source:
  wpId: 374
  wpSlug: postgresql-15-three-features-you-can-try-with-neon
  exportedAt: '2026-03-20T13:31:00.745Z'
---

Today, we’re pleased to announce support for PostgreSQL 15.

PostgreSQL 15 includes improved sort performance, write-ahead log (WAL) file compression, and other improvements. Here are some features you can try using Neon’s SQL Editor.

## SQL MERGE

The `MERGE` query can `UPDATE`, `INSERT`, or `DELETE` rows with a single SQL statement. PostgreSQL will insert a new row if it doesn’t exist, otherwise, it will `UPDATE`, `DELETE`, or `DO NOTHING` as specified in the query clause.

PostgreSQL supports the `INSERT ON CONFLICT` statement with similar functionality since version 9.5.`INSERT ON CONFLICT` and `MERGE` handle concurrent insertions differently.`INSERT ON CONFLICT DO UPDATE` guarantees either `INSERT` or `UPDATE` outcome, while `MERGE` may fail with a unique violation.

Thus, it is preferred to run `UPDATE` in the case of concurrent `INSERT` statements.

```bash
INSERT INTO table_name(column_list)
VALUES(value_list)
ON CONFLICT target action;
```

Let’s see `MERGE` in action to understand how it works.

<figure>
<video autoPlay playsInline loop width="3548" height="1928">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/postgresql-15-three-features-you-can-try-with-neon/pg15-merge-example-b8cf6505.mp4" />
</video>
<figcaption>Using MERGE in Neon</figcaption>
</figure>

We have created a `hero` table with the following attributes:

```bash
CREATE TABLE hero (
    "id" int4,
    "first_name" text,
    "last_name" text,
    "hero_name" text,
    PRIMARY KEY ("id")
);
```

Since the table is empty, the following query will not find a match. As a result, the query will insert a row with `id=11`.

```bash
MERGE INTO hero c
USING (VALUES(11, 'Bruce', 'Wayne', 'Batman')) v
ON v.column1 = c.id
WHEN MATCHED THEN
  UPDATE SET last_name = v.column3, hero_name = v,column4
WHEN NOT MATCHED THEN
  INSERT (id, first_name, last_name, email)
  VALUES (v.column1, v.column2, v.column3, v.column4);
```

If we run the same query a second time, PostgreSQL will find a match with the same value as before, so it will do nothing.

Let’s make a few changes to the query shown above. We kept the same `id=11` but changed the `last_name` and `hero_name` columns’ respective values. Can you guess what happens when we execute the following query?

```bash
MERGE INTO hero c
USING (VALUES(11, 'Bruce', 'Banner', 'The Hulk')) v
ON v.column1 = c.id
WHEN MATCHED THEN
  UPDATE SET last_name = v.column3, hero_name = v,column4
WHEN NOT MATCHED THEN
  INSERT (id, first_name, last_name, email)
  VALUES (v.column1, v.column2, v.column3, v.column4);
```

You got it! PostgreSQL updates the `last_name` and `hero_name` columns with the values `Banner` and `The Hulk`.

## CREATE privilege on public schema removed

PostgreSQL 15 removes the global write privilege from the public schema to limit possible security issues. For example, if you have a database owned by the user `alice` and connect to it from the user `bob`, you will see `ERROR: permission denied for schema public` when running this query:

```bash
CREATE TABLE bob_table (
    id SERIAL PRIMARY KEY,
    data TEXT
);
```

To enable this functionality, connect from the database owner and run the following statement:

```bash
GRANT CREATE ON SCHEMA public TO bob;
```

Only grant these permissions to trusted users, as those can be exploited. Refer to the [Guide to CVE-2018-1058](https://wiki.postgresql.org/wiki/A_Guide_to_CVE-2018-1058%3A_Protect_Your_Search_Path) for more information about protecting your search path.

## Allow unique constraints and indexes to treat NULL values as not distinct

In previous PostgreSQL versions, you could insert multiple rows with a `NULL` attribute, even if the column is specified as `UNIQUE`.

<figure>
<video autoPlay playsInline loop>
<source src="https://cdn.neonapi.io/public/videos/pages/blog/postgresql-15-three-features-you-can-try-with-neon/pg15-unique-example-1-323a5d21.mp4" />
</video>
<figcaption>Using UNIQUE NULLS NOT DISTINCT</figcaption>
</figure>

Let’s look at an example. Create a table called `superhero` with a unique `hero_name` attribute.

```bash
CREATE TABLE superhero (
    id SERIAL PRIMARY KEY,
    hero_name TEXT,
    UNIQUE (hero_name)
);
```

Superheroes are known to keep their identity secret, so let’s insert their data into the database with the `hero_name` attribute set to `NULL`. Use the following `INSERT` queries to keep the superheroes’ names anonymous.

```bash
INSERT INTO superhero (hero_name) VALUES(NULL);
INSERT INTO superhero (hero_name) VALUES(NULL);
```

Superpowers, on the other hand, have to be specified. I can only allow one type of superpower to be `NULL`. With the change to PostgreSQL 15, we can ensure that only one `NULL` in the `superpower_name` column is permitted:

```bash
CREATE TABLE superpower (
    id SERIAL PRIMARY KEY,
    superpower_name TEXT,
    UNIQUE NULLS NOT DISTINCT (superpower_name)
);
```

If I try to run the following SQL statement a second time, I’ll get `Error: duplicate key value violates unique constraint`.

```bash
INSERT INTO superpower (superpower_name) VALUES(NULL);
```

## Try out Postgres 15

Get started today at [https://neon.tech](https://neon.tech) and create a PostgresSQL 15 project.

<figure>
<video autoPlay playsInline loop>
<source src="https://cdn.neonapi.io/public/videos/pages/blog/postgresql-15-three-features-you-can-try-with-neon/create-pg-15-project-ba9246ab.mp4" />
</video>
<figcaption>Create a PostgreSQL 15 project on Neon</figcaption>
</figure>

Do you want to migrate your current project to PostgreSQL 15 with Neon? Follow the instructions in [import data from PostgreSQL](https://neon.tech/docs/import/import-from-postgres).

Let us know what other features you liked in this release. Share your ideas at [https://community.neon.tech/](https://community.neon.tech/).
