---
title: Using Postgres as a key-value store with hstore and JSONB
subtitle: How to use hstore and JSONB to store key-value pairs in Postgres
author: vkarpov15
enableTableOfContents: true
createdAt: '2025-04-15T13:24:36.612Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

Postgres is well known for its relational features, but it also has tools for working with key-value pairs. If you want to store flexible, schema-less data in a Postgres column, you can use either the [`hstore` extension](https://www.postgresql.org/docs/current/hstore.html) or the built-in [JSONB type](https://www.postgresql.org/docs/current/datatype-json.html).

## Steps

- [Install and enable `hstore`](#install-and-enable-hstore)
- [Create a table with an `hstore` column](#create-a-table-with-an-hstore-column)
- [Insert and query key-value data with `hstore`](#insert-and-query-key-value-data-with-hstore)
- [Using `JSONB`](#using-jsonb)
- [Create a table with a `JSONB` column](#create-a-table-with-a-jsonb-column)
- [Insert and query key-value data with `JSONB`](#insert-and-query-key-value-data-with-jsonb)
- [Index key-value data for performance](#index-key-value-data-for-performance)
- [`hstore` vs `JSONB`](#hstore-vs-jsonb)

### Install and enable `hstore`

To create columns with the `hstore` type, you need the extension. On Neon, `hstore` is already available, so you only need to enable it with the following command.

```sql
CREATE EXTENSION IF NOT EXISTS hstore;
```

### Create a table with an `hstore` column

You can store key-value pairs in a column using the `hstore` type. Here’s an example of a products table with an `attributes` column of type `hstore`.

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  attributes HSTORE
);
```

### Insert and query key-value data with `hstore`

Each row in the `attributes` column can store a map of keys and values as strings as follows. Keep in mind that `hstore` can only store string keys and string values: you can't store numbers or objects as `hstore` values.

```sql
INSERT INTO products (name, attributes)
VALUES ('Backpack', 'color => blue, size => large'),
       ('Jacket', 'color => red, waterproof => yes');
```

You can then query based on the `attributes` column's keys and values using operators like `->` and `?` as follows.

```sql
-- Get products with a 'color' key
SELECT * FROM products WHERE attributes ? 'color';

-- Get products where color is 'blue'
SELECT * FROM products WHERE attributes -> 'color' = 'blue';
```

### Using `JSONB`

The Postgres `JSONB` type stores structured JSON data in a binary format. It supports indexing and nesting, so it fits more complex data structures better than `hstore`.

### Create a table with a `JSONB` column

The following command creates a similar products table where `attributes` has type `JSONB` instead of `hstore`.

```sql
CREATE TABLE products_json (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  attributes JSONB
);
```

### Insert and query key-value data with `JSONB`

You can then insert products with `attributes` using JSON syntax as follows.

```sql
INSERT INTO products_json (name, attributes)
VALUES ('Backpack', '{"color": "blue", "size": "large"}'),
       ('Jacket', '{"color": "red", "waterproof": true}');
```

You can then query the `attributes` column by keys and values using operators like `?`, `@>`, and `->>`.

```sql
-- Get products with a 'waterproof' key
SELECT * FROM products_json WHERE attributes ? 'waterproof';

-- Get products where color is 'blue'
SELECT * FROM products_json
WHERE attributes @> '{"color": "blue"}';

-- Get products where color is 'blue' using `->>`
SELECT * FROM products_json
WHERE attributes->>'color' = 'blue';
```

### Index key-value data for performance

[GIN indexes](https://www.postgresql.org/docs/current/gin-intro.html) let you index `hstore` and `JSONB` columns, which can make your queries faster as your data grows. The following command shows how you can create a GIN index on the `attributes` column in both tables. GIN indexes work on both `hstore` and `JSONB` columns.

```sql
-- hstore
CREATE INDEX idx_hstore_attrs ON products USING GIN (attributes);

-- JSONB
CREATE INDEX idx_jsonb_attrs ON products_json USING GIN (attributes);
```

### `hstore` vs `JSONB`

Both `hstore` and `JSONB` are alternatives to an external key-value store and let you keep your key-value data in the same place as the rest of your data. Which one to choose depends on your data:

- If you need nested data, arrays, or any data type beyond strings, use `JSONB`.
- If you need extra performance and are certain you don't need more complex data types, `hstore` can be faster for very simple key-value lookups and use less disk space.
