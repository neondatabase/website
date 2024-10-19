---
title: 'PostgreSQL BYTEA Data Type'
tableOfContents: true
---

**Summary**: in this tutorial, you will learn about PostgreSQL `BYTEA` data type and how to use it to store binary strings in the database.

## Introduction to the PostgreSQL BYTEA data type

In PostgreSQL, `BYTEA` is a binary data type that you can use to store binary strings or byte sequences. `BYTEA` stands for the binary array.

The following shows how to define a table column with the `BYTEA` data type:

```
column_name BYTEA
```

The maximum size of a `BYTEA` column is 1GB. It means you can only store binary data up to 1GB in a single `BYTEA` column. However, storing a large amount of binary data in a `BYTEA` column is not efficient.

If files are larger than a few megabytes, you can store them externally and save the paths to the files in the database.

If you work with PHP or Python and want to know how to store binary data in a `BYTEA` column, you can follow these tutorials:

- [Storing files in a `BYTEA` column using PHP](/postgresql/postgresql-php/postgresql-blob).
- [Storing images in a `BYTEA` column using Python](/postgresql/postgresql-python/blob).

## PostgreSQL BYTEA data type example

First, [create a table](/postgresql/postgresql-create-table) called `binary_data` to store binary strings:

```sql
CREATE TABLE binary_data(
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    data BYTEA
);
```

Second, [insert](/postgresql/postgresql-insert) a binary string into the `binary_data` table:

```sql
INSERT INTO binary_data(data)
VALUES ('\x012345');
```

Third, retrieve data from the `BYTEA` column:

```sql
SELECT * FROM binary_data;
```

Output:

```
 id |   data
----+----------
  1 | \x012345
(1 row)
```

## Summary

- Use the `BYTEA` data type to store small binary data in the database.
