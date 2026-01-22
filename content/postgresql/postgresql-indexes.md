---
title: 'PostgreSQL Indexes'
page_title: 'PostgreSQL Indexes'
page_description: 'In this tutorial, you will learn how to use PostgreSQL indexes to enhance the data retrieval speed and various index types.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-indexes/'
ogImage: ''
updatedOn: '2024-03-06T08:34:51+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL List Views'
  slug: 'postgresql-views/postgresql-list-views'
nextLink:
  title: 'PostgreSQL CREATE INDEX Statement'
  slug: 'postgresql-indexes/postgresql-create-index'
---

**Summary**: in this tutorial, you will learn how to use PostgreSQL indexes to enhance the data retrieval speed and various index types.

## Introduction to PostgreSQL indexes

In PostgreSQL, an **index** is a data structure that speeds up data retrieval. It gives PostgreSQL a quick way to locate rows inside a table without scanning the entire table.

You can think of an index like the **index pages of a book**.
Instead of reading every page to find a topic, you simply check the index, which points you directly to the page you need. PostgreSQL uses indexes in the same way to find data quickly.

Suppose you have a table called `contacts` with the following structure:

```sql
CREATE TABLE contacts (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(10) NOT NULL
);
```

And you issue the following query to find a contact by name:

```sql
SELECT * FROM contacts
WHERE name = 'John Doe';
```

Without an index, PostgreSQL must scan the entire `contacts` table to find `"John Doe"`.
If the table contains many rows, this becomes slow — just like reading a whole book to find a single line.

However, with an index on the `name` column, PostgreSQL can locate the matching rows much faster.

To create an index, you use the [`CREATE INDEX`](postgresql-indexes/postgresql-create-index) statement:

```sql
CREATE INDEX contacts_name
ON contacts(name);
```

This creates an index named `contacts_name` on the `name` column of the `contacts` table.

After creating the index, PostgreSQL extracts all values from the `name` column and stores them in the index data structure.
This process may take some time if the table contains many rows — similar to how building a book’s index takes longer for a thicker book.

By default, PostgreSQL allows **SELECT** operations while creating the index, but it blocks
[`INSERT`](postgresql-tutorial/postgresql-insert),
[`UPDATE`](postgresql-tutorial/postgresql-update), and
[`DELETE`](postgresql-tutorial/postgresql-delete)
operations during that time for safety.

As an alternative, if you cannot block INSERT, UPDATE, or DELETE operations during index creation, you can use the syntax `CREATE INDEX CONCURRENTLY` to create the index without blocking, but at a much slower rate.

When you execute the following `SELECT` statement, PostgreSQL can use the `contacts_name` index to quickly find the matching rows:

```sql
SELECT * FROM contacts
WHERE name = 'John Doe';
```

After the index is created, PostgreSQL must keep it synchronized with the table.

For example, when inserting, updating, or deleting rows in the `contacts` table, PostgreSQL also updates the index so that it remains accurate.

Because of this, indexes **improve read speed** but add a bit of overhead to write operations (inserts, updates, deletes) — similar to how updating a book’s content also requires updating its index.

## Types of PostgreSQL indexes

PostgreSQL offers various index types, each designed to cater to specific data scenarios and query patterns.

By understanding these index types, you can enhance the query performance more effectively.

### B\-tree index

B\-tree is the default index type in PostgreSQL. B\-tree stands for balanced tree. B\-tree indexes maintain the sorted values, making them efficient for exact matches and range queries.

### Hash index

Hash indexes maintain 32\-bit hash code created from values of the indexed columns.

Therefore, hash indexes can only handle simple equality comparisons (\=).

### GIN index

GIN indexes are inverted indexes that are suitable for composite values such as [arrays](postgresql-tutorial/postgresql-array), [JSONB data](postgresql-indexes/postgresql-json-index), and [full\-text search](postgresql-indexes/postgresql-full-text-search).

Since a GIN index stores a separate entry for each component, it can handle queries that check for the existence of a specific component.

### GiST index

GiST indexes are versatile and support a wide range of [data types](postgresql-tutorial/postgresql-data-types), including geometric and full\-text data.

GiST indexes allow various search strategies such as nearest\-neighbor and partial match searches, making them useful for specialized applications.

### SP\-GiST index

SP\-GiST indexes are useful for indexing data with hierarchical structures or complex data types.

SP\-GiST indexes partition the index space into non\-overlapping regions, offering efficient search capabilities for specialized data structures.

### BRIN (Block Range Index) index

BRIN indexes are designed for very large tables where indexing every row is impractical.

A BRIN index divides the table into ranges of pages and stores summarized information about each range, making them efficient for range queries on large datasets while using minimal space.

## PostgreSQL indexes tutorials

- [Create Index](postgresql-indexes/postgresql-create-index) – Show you how to define a new index for a table.
- [Unique Index](postgresql-indexes/postgresql-unique-index) – Provide you with steps for defining unique indexes.
- [Index on Expression](postgresql-indexes/postgresql-index-on-expression) – Guide you on creating an index based on expressions.
- [Partial index](postgresql-indexes/postgresql-partial-index) – Learn about creating partial indexes that include a subset of rows of the indexed columns.
- [Multicolumn Indexes](postgresql-indexes/postgresql-multicolumn-indexes) – Show you how to define indexes that include multiple table columns.
- [Reindex](postgresql-indexes/postgresql-reindex) – Learn how to rebuild indexes.
- [List indexes](postgresql-indexes/postgresql-list-indexes) – Learn how to list all indexes in a table or database.
- [Drop Index](postgresql-indexes/postgresql-drop-index) – Show you how to delete an index.
- [Index Types](postgresql-indexes/postgresql-index-types) – Discuss various PostgreSQL index types in detail.
- [Full Text Search](postgresql-indexes/postgresql-full-text-search) – Show you how to use the GIN index to enable full\-text search in PostgreSQL.
- [JSON index](postgresql-indexes/postgresql-json-index) – Learn how to index a JSONB column for enhanced query performance.
