---
title: 'PostgreSQL enum'
page_title: 'PostgreSQL Enum'
page_description: 'In this tutorial, you will learn how to use the PostgreSQL enum data type to define a list of fixed values for a column.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-enum/'
ogImage: ''
updatedOn: '2024-04-19T10:27:07+00:00'
enableTableOfContents: true
previousLink:
  title: 'A Look at PostgreSQL User-defined Data Types'
  slug: 'postgresql-tutorial/postgresql-user-defined-data-types'
nextLink:
  title: 'PostgreSQL XML Data Type'
  slug: 'postgresql-tutorial/postgresql-xml-data-type'
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL enum data type to define a list of fixed values for a column.

## Introduction to the PostgreSQL enum data type

In PostgreSQL, an enum type is a [custom data type](postgresql-user-defined-data-types) that allows you to define a list of possible values for a column.

Here’s the syntax for creating a new enum type:

```sql
CREATE TYPE enum_name
AS
ENUM('value1', 'value2', 'value3', ...);
```

In this syntax:

- First, specify the name of the enum after the `CREATE` `TYPE` keyword.
- Second, provide a list of comma\-separated enum values within the parentheses followed by the `ENUM` keyword. These values are case\-sensitive.

When you define a column with an enum type, you specify that the column can only accept a fixed of values declared in the enum.:

```sql
column_name enum_type
```

If you attempt to [insert](postgresql-insert) or [update](postgresql-update) a row with a value not in the list, PostgreSQL will issue an error.

The ordering of values in an enum is the order in which you list them when you define the enum.

In the syntax, PostgreSQL will place the value1 before the value2, value2 before value3, and so on.

Additionally, you can use all standard comparison operators (\>, \>\=, \=, \<\>, \<, \<\=) and related aggregation functions with enum values.

## PostgreSQL enum data type example

First, create a new enum type called `priority` that includes three possible values ‘low’, ‘medium’, and ‘high’.

```sql
CREATE TYPE priority AS ENUM('low','medium','high');
```

Second, [create a table](postgresql-create-table) called `requests` that has a column using `priority` enum:

```sql
CREATE TABLE requests(
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    priority PRIORITY NOT NULL,
    request_date DATE NOT NULL
);
```

Third, [insert some rows](postgresql-insert) into the `requests` table:

```sql
INSERT INTO requests(title, priority, request_date)
VALUES
   ('Create an enum tutorial in PostgreSQL', 'high', '2019-01-01'),
   ('Review the enum tutorial', 'medium', '2019-01-01'),
   ('Publish the PostgreSQL enum tutorial', 'low', '2019-01-01')
RETURNING *;
```

Output:

```text
 id |                 title                 | priority | request_date
----+---------------------------------------+----------+--------------
  1 | Create an enum tutorial in PostgreSQL | high     | 2019-01-01
  2 | Review the enum tutorial              | medium   | 2019-01-01
  3 | Publish the PostgreSQL enum tutorial  | low      | 2019-01-01
(3 rows)
```

Fourth, retrieve the requests and sort them by priority from low to high:

```sql
SELECT *
FROM requests
ORDER BY priority;
```

Output:

```text
 id |                 title                 | priority | request_date
----+---------------------------------------+----------+--------------
  3 | Publish the PostgreSQL enum tutorial  | low      | 2019-01-01
  2 | Review the enum tutorial              | medium   | 2019-01-01
  1 | Create an enum tutorial in PostgreSQL | high     | 2019-01-01
(3 rows)
```

Fifth, find the requests whose priority is higher than `low`:

```sql
SELECT *
FROM requests
WHERE priority > 'low'
ORDER BY priority;
```

Output:

```text
 id |                 title                 | priority | request_date
----+---------------------------------------+----------+--------------
  2 | Review the enum tutorial              | medium   | 2019-01-01
  1 | Create an enum tutorial in PostgreSQL | high     | 2019-01-01
(2 rows)
```

Note that enum values are case\-sensitive.

Sixth, attempt to find the requests whose priority is ‘`HIGH`‘:

```sql
SELECT *
FROM requests
WHERE priority = 'HIGH'
ORDER BY priority;
```

PostgreSQL issues the following error:

```sql
ERROR:  invalid input value for enum priority: "HIGH"
LINE 3: WHERE priority = 'HIGH'
                         ^
```

Finally, attempt to insert a new row into the `requests` table with an invalid value for the priority column:

```sql
INSERT INTO requests(title, priority, request_date)
VALUES
   ('Revise the enum tutorial', 'urgent', '2019-01-02')
RETURNING *;
```

Error:

```sql
ERROR:  invalid input value for enum priority: "urgent"
LINE 3:    ('Revise the enum tutorial', 'urgent', '2019-01-02')
                                        ^
```

## Adding new values to enums

To add a new value to an enum, you use the `ALTER TYPE ... ADD VALUE` statement:

```sql
ALTER TYPE enum_name
ADD VALUE [IF NOT EXISTS] 'new_value'
[{BEFORE | AFTER } 'existing_enum_value';
```

In this syntax:

- First, specify the name of the enum you want to add a new value after the `ALTER TYPE` keywords.
- Second, specify the new value after the `ADD VALUE` keywords. Use the `IF NOT EXISTS` to conditionally add a new value only if it does not exist.
- Third, specify the position of the new value relative to an existing value. By default, the statement adds the new enum value at the end of the list.

For example, the following statement adds a new value `'urgent'` to the `priority` enum:

```sql
ALTER TYPE priority
ADD VALUE 'urgent';
```

## Retrieving a list of enum values

To get a list of values of an enum, you use the `enum_range()` function:

```sql
enum_range(null::enum_name)
```

It returns a list of values of the `enum_name` as an ordered array

For example, the following statement uses the `enum_range()` function to retrieve a list of enum values from the priority enum:

```sql
SELECT enum_range(null::priority);
```

Output:

```text
        enum_range
--------------------------
 {low,medium,high,urgent}
(1 row)
```

## Getting the first and last values in an enum

To get the first and last values in an enum, you use the `enum_first()` and `enum_last()` functions respectively.

```sql
SELECT
  enum_first(NULL::priority) first_value,
  enum_last(NULL::priority)  last_value;
```

Output:

```text
 first_value | last_value
-------------+------------
 low         | urgent
(1 row)
```

## Renaming an enum value

To rename a value in an enum, you use the `ALTER TYPE ... RENAME VALUE` statement as follows:

```sql
ALTER TYPE enum_name
RENAME VALUE existing_enum_value TO new_enum_value;
```

For example, the following statement changes the `'urgent'` value in the priority enum to `'very high'`:

```sql
ALTER TYPE priority
RENAME VALUE 'urgent' TO 'very high';
```

The following statement verifies the change:

```sql
SELECT enum_range(null::priority);
```

Output:

```text
          enum_range
-------------------------------
 {low,medium,high,"very high"}
(1 row)
```

Notice that if the value has a space, PostgreSQL uses quotes to surround it as indicated in the output.

## When to use enums

There is some similarity between enums and [foreign keys](postgresql-foreign-key). Both allow you to define a set of values for a column.

However, enums have the following advantages:

- **Performance**: you need to query from a single table instead of using join to retrieve data from two tables.
- **Simplicity**: it’s much simpler to write an SQL statement to work with enum values.

But enums also have the following disadvantages:

- **Limited flexibility**: changing enum values requires changing the database schema instead of adding values to the lookup table.
- **Portability**: not all database systems support enum. If you ever want to migrate your PostgreSQL database schema to a database system that does not support enum, you’ll have an issue.

It is recommended to use enums when you have a fixed set of values that are unlikely to change, for example, RGB colors (red, green, blue).

## Summary

- Use enums to define a list of fixed values for a table column.
- Use the `CREATE TYPE` statement to define a new enum data type.
- The order of values in an enum is the order in which you declare them when defining the enum type.
- Use the `ALTER TYPE ... ADD VALUE` to add a new value to an enum.
- Use the `ALTER TYPE ... RENAME VALUE` to rename an enum value.
- Use enum only when you have a small list of fixed values. Otherwise, use a lookup table with foreign keys instead.
