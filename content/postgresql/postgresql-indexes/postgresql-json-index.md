---
title: 'PostgreSQL JSON Index'
page_title: 'PostgreSQL JSON Index'
page_description: 'In this tutorial, you will learn how to create a PostgreSQL JSON index for a JSONB column to improve query performance.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-indexes/postgresql-json-index/'
ogImage: ''
updatedOn: '2024-03-06T08:18:53+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL Full Text Search'
  slug: 'postgresql-indexes/postgresql-full-text-search'
nextLink:
  title: 'PostgreSQL Administration'
  slug: 'postgresql-indexes/../postgresql-administration'
---

**Summary**: in this tutorial, you will learn how to create a PostgreSQL JSON index for a JSONB column to improve query performance.

## Introduction to PostgreSQL JSON index

JSONB (binary JSON) is a data type that allows you to store JSON data and query it efficiently.

When a JSONB column has a complex JSON structure, utilizing an index can significantly improve query performance.

PostgreSQL uses the `GIN` index type for indexing a column with JSONB data type. `GIN` stands for Generalized Inverted Index.

Note that you can utilize the GIN index for tsvector or array columns.

To create a `GIN` index for a JSONB column, you can use the following `CREATE INDEX` statement:

```sql
CREATE INDEX index_name
ON table_name
USING GIN(jsonb_column);
```

This statement creates a `GIN` index on the `jsonb_column`. This `GIN` index is suitable for general\-purpose queries on JSONB data.

When creating a `GIN` index on a JSONB column, you can use a specific `GIN` operator class.

The operator class determines how PostgreSQL builds the index and how it optimizes the queries on the indexed column.

For example, The following `CREATE INDEX` statement creates a `GIN` index on the `jsonb_coumn` with `jsonb_path_ops` operator class:

```sql
CREATE INDEX index_name
ON table_name
USING GIN(jsonb_column jsonb_path_ops);
```

This index is optimized for the queries that use the @\> (contains), ? (exists), and @@ JSONB operators. It can be useful for searches involving keys or values within JSONB documents.

The following table displays the `GIN` operator classes:

| Name                     | Indexable Operators      |
| ------------------------ | ------------------------ |
| `array_ops`              | `&& (anyarray,anyarray)` |
| `@> (anyarray,anyarray)` |
| `<@ (anyarray,anyarray)` |
| `= (anyarray,anyarray)`  |
| `jsonb_ops`              | `@> (jsonb,jsonb)`       |
| `@? (jsonb,jsonpath)`    |
| `@@ (jsonb,jsonpath)`    |
| `? (jsonb,text)`         |
| `?                       | (jsonb,text[])`          |
| `?& (jsonb,text[])`      |
| `jsonb_path_ops`         | `@> (jsonb,jsonb)`       |
| `@? (jsonb,jsonpath)`    |
| `@@ (jsonb,jsonpath)`    |
| `tsvector_ops`           | `@@ (tsvector,tsquery)`  |
| `@@@ (tsvector,tsquery)` |

Note that if you don’t explicitly specify a `GIN` operator class, the statement will use the `jsonb_ops` operator by default, which is suitable for most cases.

Additionally, PostgreSQL allows you to create a `GIN` index for a specific field in JSON documents as follows:

```sql
CREATE INDEX index_name
ON table_name
USING GIN ((data->'field_name') jsonb_path_ops);
```

This index can improve the queries that involve searching values within the `field_name` of JSON documents stored in the JSONB column (data).

## PostgreSQL JSON index examples

We’ll use the tables in the [sample database](../postgresql-getting-started/postgresql-sample-database).

### 1\) Setting up a sample table

First, [create a new table](../postgresql-tutorial/postgresql-create-table) called `customer_json` that stores the customer information in JSON format:

```sql
CREATE TABLE customer_json(
   id SERIAL PRIMARY KEY,
   data JSONB NOT NULL
);
```

Second, insert data from the `customer`, `address`, `city`, and `country` tables into the `customer_json` table:

```sql
WITH json_cte AS(
  SELECT
    jsonb_build_object(
      'first_name',  first_name,
      'last_name',  last_name,
      'email',  email,
      'phone',  a.phone,
      'address',
      jsonb_build_object(
        'address', a.address,
        'city', i.city,
        'postal_code', a.postal_code,
        'district',  a.district,
        'country', o.country
      )
    ):: jsonb AS data
  FROM
    customer c
    INNER JOIN address a ON a.address_id = c.address_id
    INNER JOIN city i ON i.city_id = a.city_id
    INNER JOIN country o ON o.country_id = i.country_id
)
INSERT INTO customer_json(data)
SELECT
  data
FROM
  json_cte;
```

Third, retrieve the email of the customer whose first name is `John`:

```sql
SELECT
   data ->> 'first_name' first_name,
   data ->> 'last_name' last_name,
   data ->> 'phone' phone
FROM
   customer_json
WHERE
   data @> '{"first_name": "John"}';
```

Output:

```sql
 first_name | last_name  |    phone
------------+------------+-------------
 John       | Farnsworth | 51917807050
(1 row)
```

Finally, explain and analyze the above query:

```sql
EXPLAIN ANALYZE
SELECT
   data ->> 'first_name' first_name,
   data ->> 'last_name' last_name,
   data ->> 'phone' phone
FROM
   customer_json
WHERE
   data @> '{"first_name": "John"}';
```

Output:

```sql
                                               QUERY PLAN
---------------------------------------------------------------------------------------------------------
 Seq Scan on customer_json  (cost=0.00..31.50 rows=1 width=96) (actual time=0.063..0.118 rows=1 loops=1)
   Filter: (data @> '{"first_name": "John"}'::jsonb)
   Rows Removed by Filter: 598
 Planning Time: 1.109 ms
 Execution Time: 0.128 ms
(5 rows)
```

The output indicates that PostgreSQL has to scan the entire `customer_json` table to search for the customer.

To improve the performance of the query, you can create a `GIN` index on the data column of the `customer_json` table.

### 2\) Creating an index on the JSONB column

First, [create an index](postgresql-create-index) on the `data` column of the `customer_json` table:

```sql
CREATE INDEX customer_json_index
ON customer_json
USING GIN(data);
```

Second, execute the query that searches for the customer whose first name is `John`:

```sql
EXPLAIN ANALYZE
SELECT
   data ->> 'first_name' first_name,
   data ->> 'last_name' last_name,
   data ->> 'phone' phone
FROM
   customer_json
WHERE
   data @> '{"first_name": "John"}';
```

Output:

```sql
                                                         QUERY PLAN
-----------------------------------------------------------------------------------------------------------------------------
 Bitmap Heap Scan on customer_json  (cost=21.51..25.53 rows=1 width=96) (actual time=0.024..0.024 rows=1 loops=1)
   Recheck Cond: (data @> '{"first_name": "John"}'::jsonb)
   Heap Blocks: exact=1
   ->  Bitmap Index Scan on customer_json_index  (cost=0.00..21.51 rows=1 width=0) (actual time=0.014..0.014 rows=1 loops=1)
         Index Cond: (data @> '{"first_name": "John"}'::jsonb)
 Planning Time: 0.164 ms
 Execution Time: 0.045 ms
(7 rows)
```

The query plan indicates that PostgreSQL uses the `customer_json_index` to improve the performance.

This time, the execution time is significantly smaller `0.045ms` vs. `0.128` ms, about 2 – 3 times faster than a query without using the `GIN` index.

### 3\) Creating an index on the JSONB column with the GIN operator class

First, [drop](postgresql-drop-index) the `customer_json_index` index:

```sql
DROP INDEX customer_json_index;
```

Second, create a `GIN` index on the data column of the `customer_json` table with a `GIN` operator class:

```sql
CREATE INDEX customer_json_index
ON customer_json
USING GIN(data jsonb_path_ops);
```

Third, explain the query that finds the customer whose first name is `John`:

```sql
EXPLAIN ANALYZE
SELECT
   data ->> 'first_name' first_name,
   data ->> 'last_name' last_name,
   data ->> 'phone' phone
FROM
   customer_json
WHERE
   data @> '{"first_name": "John"}';
```

Output:

```sql
                                                         QUERY PLAN
-----------------------------------------------------------------------------------------------------------------------------
 Bitmap Heap Scan on customer_json  (cost=12.82..16.84 rows=1 width=96) (actual time=0.014..0.015 rows=1 loops=1)
   Recheck Cond: (data @> '{"first_name": "John"}'::jsonb)
   Heap Blocks: exact=1
   ->  Bitmap Index Scan on customer_json_index  (cost=0.00..12.82 rows=1 width=0) (actual time=0.008..0.008 rows=1 loops=1)
         Index Cond: (data @> '{"first_name": "John"}'::jsonb)
 Planning Time: 0.120 ms
 Execution Time: 0.034 ms
(7 rows)
```

The query plan shows that the query does use the `customer_json_index` for improved performance.

Finally, explain the query that searches for the customer where the value in the `first_name` field within the data column is John:

```sql
EXPLAIN ANALYZE
SELECT * FROM customer_json
WHERE data->>'first_name' = 'John';
```

Output:

```sql
                                                QUERY PLAN
----------------------------------------------------------------------------------------------------------
 Seq Scan on customer_json  (cost=0.00..32.98 rows=3 width=275) (actual time=0.161..0.284 rows=1 loops=1)
   Filter: ((data ->> 'first_name'::text) = 'John'::text)
   Rows Removed by Filter: 598
 Planning Time: 0.085 ms
 Execution Time: 0.298 ms
(5 rows)
```

In this plan, the query cannot fully utilize the `GIN` index `customer_json_index`. The reason is that the query does not use the JSONB operator (`@`, `@?`, `@@`) that the `jsonb_path_ops` operator class is optimized for.

### 4\) Creating an index on a specific field of a JSONB column

First, drop the `customer_json_index` index:

```sql
DROP INDEX customer_json_index;
```

Second, create a `GIN` index on the `first_name` field of the `customer_json` table using the `GIN` operator class:

```sql
CREATE INDEX customer_json_index
ON customer_json
USING GIN((data->'first_name'));
```

Third, explain the query that finds the rows where the “`first_name`” field in the `data` JSONB column contains the value `"John"`:

```sql
EXPLAIN ANALYZE
SELECT
   data ->> 'first_name' first_name,
   data ->> 'last_name' last_name,
   data ->> 'phone' phone
FROM
   customer_json
WHERE
   data->'first_name' @> '"John"';
```

Output:

```sql
                                                         QUERY PLAN
----------------------------------------------------------------------------------------------------------------------------
 Bitmap Heap Scan on customer_json  (cost=8.58..23.72 rows=6 width=96) (actual time=0.031..0.032 rows=1 loops=1)
   Recheck Cond: ((data -> 'first_name'::text) @> '"John"'::jsonb)
   Heap Blocks: exact=1
   ->  Bitmap Index Scan on customer_json_index  (cost=0.00..8.58 rows=6 width=0) (actual time=0.015..0.015 rows=1 loops=1)
         Index Cond: ((data -> 'first_name'::text) @> '"John"'::jsonb)
 Planning Time: 0.167 ms
 Execution Time: 0.133 ms
(7 rows)
```

The output indicates that the query uses the `customer_json_index` index.

## Summary

- Use the `GIN` index to create an index for a JSONB column of a table to improve query performance.
