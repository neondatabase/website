---
modifiedAt: 2024-03-06 01:34:51
prevPost: postgresql-split_part-function
nextPost: postgresql-reindex
createdAt: 2018-12-02T11:46:10.000Z
title: 'PostgreSQL Indexes'
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use PostgreSQL indexes to enhance the data retrieval speed and various index types.

## Introduction to PostgreSQL indexes

In PostgreSQL, an index is a data structure that increases the data retrieval speed by providing a rapid way to locate rows within a table.

An index in PostgreSQL works like an index in a book, providing a quick reference to the page where specific content can be found.

Suppose you have a table called `contacts` with the following structure:

```sql
CREATE TABLE contacts (
    id INT PRIMARY KEY,
    name VACHAR(255) NOT NULL,
    phone VARCHAR(10) NOT NULL
);
```

And you issue the following query to find contacts by name:

```sql
SELECT * FROM contacts
WHERE name = 'John Doe';
```

PostgreSQL must scan the entire `contacts` table to find the matching rows. If the `contacts` table contains many rows, the method of locating relevant rows is inefficient.

However, with an index on the `name` column, PostgreSQL can use a more efficient method to find the relevant rows.

To create an index, you use the [CREATE INDEX](/postgresql/postgresql-indexes/postgresql-create-index) statement:

```sql
CREATE INDEX contacts_name
ON contacts(name);
```

This statement creates an index named `contacts_name` on the `name` column of the `contacts` table.

After creating an index on the `name` column, PostgreSQL extracts data from the `name` column of the `contacts` table and insert it into the index data structure.

This process may take time, depending on the number of rows in the `contacts` table.

By default, PostgreSQL allows data selection from a table during index creation but blocks [insert](/postgresql/postgresql-insert), [update](/postgresql/postgresql-tutorial/postgresql-update), and [delete](/postgresql/postgresql-tutorial/postgresql-delete) operations.

When executing the following `SELECT` statement, PostgreSQL can utilize the `contacts_name` index to quickly find the relevant rows in the `contacts` table:

```sql
SELECT * FROM contacts
WHERE name = 'John Doe';
```

After creating an index, PostgreSQL must keep it synchronized with the table.

For example, when inserting, updating, or deleting data from the `contacts` table, PostgreSQL updates the index to reflect the changes accordingly.

As a result, an index adds write overhead to the data manipulation operations (inserts, updates, deletes).

## Types of PostgreSQL indexes

PostgreSQL offers various index types, each designed to cater to specific data scenarios and query patterns.

By understanding these index types, you can enhance the query performance more effectively.

### B-tree index

B-tree is the default index type in PostgreSQL. B-tree stands for balanced tree. B-tree indexes maintain the sorted values, making them efficient for exact matches and range queries.

### Hash index

Hash indexes maintain 32-bit hash code created from values of the indexed columns.

Therefore, hash indexes can only handle simple equality comparisons (=).

### GIN index

GIN indexes are inverted indexes that are suitable for composite values such as [arrays](/postgresql/postgresql-array), [JSONB data](/postgresql/postgresql-indexes/postgresql-json-index), and [full-text search](/postgresql/postgresql-indexes/postgresql-full-text-search).

Since a GIN index stores a separate entry for each component, it can handle queries that check for the existence of a specific component.

### GiST index

GiST indexes are versatile and support a wide range of [data types](/postgresql/postgresql-data-types), including geometric and full-text data.

GiST indexes allow various search strategies such as nearest-neighbor and partial match searches, making them useful for specialized applications.

### SP-GiST index

SP-GiST indexes are useful for indexing data with hierarchical structures or complex data types.

SP-GiST indexes partition the index space into non-overlapping regions, offering efficient search capabilities for specialized data structures.

### BRIN (Block Range Index) index

BRIN indexes are designed for very large tables where indexing every row is impractical.

A BRIN index divides the table into ranges of pages and stores summarized information about each range, making them efficient for range queries on large datasets while using minimal space.

## PostgreSQL indexes tutorials

- [Create Index](/postgresql/postgresql-indexes/postgresql-create-index) - Show you how to define a new index for a table.
- [Unique Index](/postgresql/postgresql-indexes/postgresql-unique-index) - Provide you with steps for defining unique indexes.
- [Index on Expression](/postgresql/postgresql-indexes/postgresql-index-on-expression) - Guide you on creating an index based on expressions.
- [Partial index](/postgresql/postgresql-indexes/postgresql-partial-index) - Learn about creating partial indexes that include a subset of rows of the indexed columns.
- [Multicolumn Indexes](/postgresql/postgresql-indexes/postgresql-multicolumn-indexes) - Show you how to define indexes that include multiple table columns.
- [Reindex](/postgresql/postgresql-indexes/postgresql-reindex) - Learn how to rebuild indexes.
- [List indexes](/postgresql/postgresql-indexes/postgresql-list-indexes) - Learn how to list all indexes in a table or database.
- [Drop Index](/postgresql/postgresql-indexes/postgresql-drop-index) - Show you how to delete an index.
- [Index Types](/postgresql/postgresql-indexes/postgresql-index-types) - Discuss various PostgreSQL index types in detail.
- [Full Text Search](/postgresql/postgresql-indexes/postgresql-full-text-search) - Show you how to use the GIN index to enable full-text search in PostgreSQL.
- [JSON index](/postgresql/postgresql-indexes/postgresql-json-index) - Learn how to index a JSONB column for enhanced query performance.
