---
title: Postgres indexes
subtitle: Optimize query performance with indexes in Postgres
enableTableOfContents: true
updatedOn: '2024-06-15T09:30:00.000Z'
---

Indexes are a powerful tool to optimize query performance in relational databases like Neon Postgres. They allow the database engine to quickly locate and retrieve specific rows, significantly speeding up data access. In the absence of an index, Postgres must scan the entire table to find the rows that satisfy the query conditions.

<CTA />

This guide explores the most common index types in Postgres, including B-tree, Hash, GiST, GIN, and BRIN indexes. You'll learn how to create these indexes, understand the trade-offs involved with each, and how to use them effectively.

<Admonition type="note">
    While indexes can dramatically improve query performance, they consume additional storage and also add overhead to write operations (since Postgres need to keep them synchronized with the table). It's important to use indexes judiciously and monitor their impact on your database's overall performance.
</Admonition>

## B-tree Indexes

B-tree (Balanced Tree) is the default index type in Postgres and is suitable for most common scenarios. B-tree indexes organize data in a tree structure, allowing for efficient searching, insertion, and deletion. The tree is kept balanced, so all reads need to traverse a similar number of rows, providing consistent performance.

### Create a B-tree Index in Postgres

Consider a simple example using a `users` table, which includes a `username` column that is unique and sortable. We'll create a B-tree index on this column.

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, email) VALUES
    ('john_doe', 'john@example.com'),
    ('jane_smith', 'jane@example.com'),
    ('bob_johnson', 'bob@example.com');

CREATE INDEX idx_users_username ON users USING btree (username);
```

Note that the `USING btree` clause is optional. If you omit it, Postgres will use the default index type, which is B-tree. For example, the following query creates a B-tree index on the `created_at` column:

```sql
CREATE INDEX idx_users_timestamp ON users (created_at);
```

### Use B-tree Indexes in Postgres

B-tree indexes are efficient for both equality and range queries on sortable data. They are particularly useful for columns frequently used in WHERE clauses, JOIN conditions, and ORDER BY clauses.

```sql
-- Equality search
SELECT * FROM users WHERE username = 'john_doe';

-- Range query
SELECT * FROM users WHERE username > 'j' AND username < 'k';

-- Prefix search
SELECT * FROM users WHERE username LIKE 'john%';

-- Sorting
SELECT * FROM users ORDER BY username;
```

For columns with a large number of distinct values, and where queries typically filter for a small set of values, hash indexes can be more efficient than B-tree indexes. Additionally, for tables with a small number of rows, the Postgres query planner may choose to do a sequential scan instead of using the index.

## Hash Indexes

Hash indexes compute a hash value for each row value in the indexed column, and store the hash along with the value in a hash table. This provides constant-time lookup for equality comparisons.

### Create a Hash Index in Postgres

We can create a hash index on the `email` column of our `users` table by running the following query:

```sql
CREATE INDEX idx_users_email_hash ON users USING hash (email);
```

### Use Hash Indexes in Postgres

Hash indexes are most effective for exact match queries on columns with a large number of distinct values:

```sql
SELECT * FROM users WHERE email = 'john@example.com';
```

This is specifically useful for columns that store attributes like a username or email address. However, hash indexes don't support range queries or sorting like B-tree indexes.

## GiST Indexes

GiST (Generalized Search Tree) indexes provide a flexible framework for implementing various indexing strategies. They work by recursively dividing data into nested subsets. While a B-tree index divides data based on comparison semantics (equal-to, less-than, greater-than), the nodes of a GiST tree each define a general boolean predicate, that all entries in its subtree must satisfy.

This makes it useful for complex data types and queries, such as geometric data or full-text search where the regular comparison operators might not make sense. For example, a GiST index can be used to find all locations within a certain distance of a point, or to do a word proximity search over full-text documents.

### Create a GiST Index in Postgres

The following query creates a table for storing geographical locations and indexes it using GiST:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location GEOGRAPHY(POINT, 4326)
);

INSERT INTO locations (name, location) VALUES
    ('Eiffel Tower', ST_MakePoint(2.2945, 48.8584)),
    ('Statue of Liberty', ST_MakePoint(-74.0445, 40.6892)),
    ('Sydney Opera House', ST_MakePoint(151.2153, -33.8568));

CREATE INDEX idx_locations_gist ON locations USING gist (location);
```

### Use GiST Indexes in Postgres

GiST indexes can significantly speed up spatial queries. For example, the following query finds all locations within 5000 meters of a point:

```sql
-- Find locations within 5000 meters of a point
SELECT name, ST_AsText(location)
FROM locations
WHERE ST_DWithin(location, ST_MakePoint(2.3522, 48.8566)::geography, 5000);
```

While highly versatile, especially for spatial and full-text search data, GiST indexes can be slower to build and update compared to more specialized index types.

## GIN Indexes

Generalized Inverted Indexes (GIN) are useful for indexing composite values, such as arrays or full-text search documents. GIN indexes store a separate entry for each component value (e.g., each array element or each word in a text document). This is similar to an `inverted index` typically used in text search engines, except that it can be extended to handle data types other than text.

### Create a GIN Index in Postgres

The following query creates a table with an array column and indexes it using GIN:

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    tags TEXT[]
);

INSERT INTO products (name, tags) VALUES
    ('Smartphone', ARRAY['electronics', 'mobile', 'communication']),
    ('Laptop', ARRAY['electronics', 'computer', 'portable']),
    ('Headphones', ARRAY['electronics', 'audio', 'accessories']);

CREATE INDEX idx_products_tags ON products USING gin (tags);
```

### Use GIN Indexes in Postgres

GIN indexes are particularly effective for `contains` queries on array and full-text data:

```sql
-- Find products with specific tags
SELECT * FROM products WHERE tags @> ARRAY['electronics', 'portable'];

-- Find products with any of the given tags
SELECT * FROM products WHERE tags && ARRAY['audio', 'mobile'];
```

However, GIN indexes can be slower to build/update and require more storage space compared to more specialized index types.

## BRIN Indexes

Block Range Indexes (BRIN) are designed for very large tables where values in a column has some natural ordering. These indexes store summaries for ranges of data blocks, making them extremely compact. At query time, BRIN indexes can be used to quickly locate the blocks containing the values you are looking for.

### Create a BRIN Index in Postgres

The following query creates a table for storing temperature readings and indexes it using BRIN:

```sql
CREATE TABLE temperature_readings (
    id SERIAL PRIMARY KEY,
    sensor_id INT NOT NULL,
    temperature DECIMAL(5,2) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO temperature_readings (sensor_id, temperature, timestamp)
SELECT
    (random() * 100)::int,
    (random() * 50 - 10)::decimal(5,2),
    timestamp '2024-01-01 00:00:00' + (random() * (interval '365 days'))
FROM generate_series(1, 100000);

CREATE INDEX idx_temperature_brin ON temperature_readings USING brin (timestamp);
```

### Use BRIN Indexes in Postgres

BRIN indexes are especially effective for range queries on large datasets, such as the following example:

```sql
-- Find temperature readings within a specific date range
SELECT *
FROM temperature_readings
WHERE timestamp BETWEEN '2024-03-01' AND '2024-03-31';
```

While a BRIN index offers significant space savings and fast index creation, it provides less precise results and may require more disk access during queries compared to other index types.

## Advanced Indexing Strategies

We covered the most common index types in Postgres above, where each index was created on a specific column. Postgres also supports some advanced indexing techniques that can be applied to most of the fundamental index types (primarily B-tree) to further optimize query performance, for specific data access patterns.

### Multicolumn Indexes

Multicolumn indexes can be useful when queries frequently filter or sort by multiple columns together. For example, the following query creates a multicolumn index on the `temperature_readings` table:

```sql
CREATE INDEX idx_temp_sensor_timestamp ON temperature_readings (sensor_id, timestamp);
```

Multicolumn indexes can improve performance for queries that filter on multiple columns:

```sql
-- Find temperature readings from sensor 42 within a specific date range
SELECT *
FROM temperature_readings
WHERE sensor_id = 42
  AND timestamp BETWEEN '2024-03-01' AND '2024-03-31'
ORDER BY timestamp;
```

Note that a multicolumn index is also helpful for queries that filter on a subset of the indexed columns, as long as it is in the same order as the index. For example, the multicolumn index we created above accelerates both queries that filter on `sensor_id` alone, and those that filter on `sensor_id` and `timestamp` together:

```sql
-- Find maximum temperature readings from sensor 42
SELECT MAX(temperature)
FROM temperature_readings
WHERE sensor_id = 42;
```

However, a query that only filters on the `timestamp` column will not benefit from the index. Separate indexes on each column might be more efficient, depending on which queries are more frequent.

### Partial Indexes

Partial indexes cover only a subset of a table's data, which can be useful for frequently queried subsets of data. For example, the following query creates a partial index on the `temperature_readings` table for high temperatures:

```sql
CREATE INDEX idx_high_temp ON temperature_readings (temperature)
WHERE temperature > 30;
```

Partial indexes can significantly speed up queries on the indexed subset:

```sql
SELECT *
FROM temperature_readings
WHERE temperature > 35;
```

This can be useful when creating an index on the full column is too expensive due to the size of the data, and most queries only need to access a subset of it.

### Indexes on Expressions

Postgres also supports creating indexes on expressions, not just raw column values. For example, the following query creates an index on the lowercase version of the `username` in our `users` table:

```sql
CREATE INDEX idx_lower_username ON users (LOWER(username));
```

This index can improve performance for case-insensitive searches:

```sql
SELECT * FROM users WHERE LOWER(username) = 'john_doe';
```

This is useful when you frequently query based on some computation or function of a column. It saves the database engine from having to perform the computation for each row in the table at query time, which can be expensive for large tables.

## Conclusion

Indexes are powerful tools for optimizing query performance in Postgres. By understanding the different types of indexes and their appropriate use cases, you can significantly enhance the efficiency of your database queries. However, remember to monitor the impact of indexes on your overall database performance, as they do introduce some overhead for write operations and storage.

## Resources

- [Postgres Documentation: Index Types](https://www.postgresql.org/docs/current/indexes-types.html)
- [Postgres: Examining Index Usage](https://www.postgresql.org/docs/current/indexes-examine.html)

<NeedHelp/>
