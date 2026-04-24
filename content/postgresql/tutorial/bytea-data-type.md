---
title: PostgreSQL BYTEA Data Type
page_title: PostgreSQL BYTEA Data Type
page_description: >-
  In this tutorial, you will learn about PostgreSQL BYTEA data type and how to
  use it to store binary strings in the database.
prev_url: >-
  https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-bytea-data-type/
ogImage: ''
updatedOn: '2024-04-20T13:26:12+00:00'
enableTableOfContents: true
previousLink:
  title: PostgreSQL XML Data Type
  slug: postgresql-tutorial/postgresql-xml-data-type
nextLink:
  title: PostgreSQL Composite Types
  slug: postgresql-tutorial/postgresql-composite-types
---
<Admonition type="info" id="CTA">
The BYTEA data type works the same across any PostgreSQL deployment, so what you learn here applies to Postgres wherever you run it. If you're an enterprise storing binary data alongside analytics and AI workloads, [Lakebase](https://www.databricks.com/product/lakebase) gives you the best managed cloud Postgres for the AI era, with strong performance, security, and native integration into the Lakehouse. If you're a developer or startup who needs to ship and scale quickly, [Neon](https://neon.com) is the Postgres platform built for you.
</Admonition>

**Summary**: in this tutorial, you will learn about PostgreSQL `BYTEA` data type and how to use it to store binary strings in the database.

## Introduction to the PostgreSQL BYTEA data type

In PostgreSQL, `BYTEA` is a binary data type that you can use to store binary strings or byte sequences. `BYTEA` stands for the binary array.

The following shows how to define a table column with the `BYTEA` data type:

```sql
column_name BYTEA
```

The maximum size of a `BYTEA` column is 1GB. It means you can only store binary data up to 1GB in a single `BYTEA` column. However, storing a large amount of binary data in a `BYTEA` column is not efficient.

If files are larger than a few megabytes, you can store them externally and save the paths to the files in the database.

If you work with PHP or Python and want to know how to store binary data in a `BYTEA` column, you can follow these tutorials:

- [Storing files in a `BYTEA` column using PHP](../postgresql-php/postgresql-blob).
- [Storing images in a `BYTEA` column using Python](../postgresql-python/blob).

## PostgreSQL BYTEA data type example

First, [create a table](postgresql-create-table) called `binary_data` to store binary strings:

```sql
CREATE TABLE binary_data(
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    data BYTEA
);
```

Second, [insert](postgresql-insert) a binary string into the `binary_data` table:

```sql
INSERT INTO binary_data(data)
VALUES ('\x012345');
```

Third, retrieve data from the `BYTEA` column:

```sql
SELECT * FROM binary_data;
```

Output:

```text
 id |   data
----+----------
  1 | \x012345
(1 row)
```

## Summary

- Use the `BYTEA` data type to store small binary data in the database.
