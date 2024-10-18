---
title: 'PostgreSQL enum'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-enum/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL enum data type to define a list of fixed values for a column.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL enum data type

<!-- /wp:heading -->

<!-- wp:paragraph -->

In PostgreSQL, an enum type is a [custom data type](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-user-defined-data-types/) that allows you to define a list of possible values for a column.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the syntax for creating a new enum type:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TYPE enum_name
AS
ENUM('value1', 'value2', 'value3', ...);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, specify the name of the enum after the `CREATE` `TYPE` keyword.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, provide a list of comma-separated enum values within the parentheses followed by the `ENUM` keyword. These values are case-sensitive.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

When you define a column with an enum type, you specify that the column can only accept a fixed of values declared in the enum.:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
column_name enum_type
```

<!-- /wp:code -->

<!-- wp:paragraph -->

If you attempt to [insert](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/) or [update](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-update/) a row with a value not in the list, PostgreSQL will issue an error.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The ordering of values in an enum is the order in which you list them when you define the enum.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

In the syntax, PostgreSQL will place the value1 before the value2, value2 before value3, and so on.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Additionally, you can use all standard comparison operators (>, >=, =, &lt;>, &lt;, &lt;=) and related aggregation functions with enum values.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL enum data type example

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, create a new enum type called `priority` that includes three possible values 'low', 'medium', and 'high'.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TYPE priority AS ENUM('low','medium','high');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, [create a table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) called `requests` that has a column using `priority` enum:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE requests(
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    priority PRIORITY NOT NULL,
    request_date DATE NOT NULL
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, [insert some rows](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/) into the `requests` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO requests(title, priority, request_date)
VALUES
   ('Create an enum tutorial in PostgreSQL', 'high', '2019-01-01'),
   ('Review the enum tutorial', 'medium', '2019-01-01'),
   ('Publish the PostgreSQL enum tutorial', 'low', '2019-01-01')
RETURNING *;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 id |                 title                 | priority | request_date
----+---------------------------------------+----------+--------------
  1 | Create an enum tutorial in PostgreSQL | high     | 2019-01-01
  2 | Review the enum tutorial              | medium   | 2019-01-01
  3 | Publish the PostgreSQL enum tutorial  | low      | 2019-01-01
(3 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Fourth, retrieve the requests and sort them by priority from low to high:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT *
FROM requests
ORDER BY priority;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 id |                 title                 | priority | request_date
----+---------------------------------------+----------+--------------
  3 | Publish the PostgreSQL enum tutorial  | low      | 2019-01-01
  2 | Review the enum tutorial              | medium   | 2019-01-01
  1 | Create an enum tutorial in PostgreSQL | high     | 2019-01-01
(3 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Fifth, find the requests whose priority is higher than `low`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT *
FROM requests
WHERE priority > 'low'
ORDER BY priority;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 id |                 title                 | priority | request_date
----+---------------------------------------+----------+--------------
  2 | Review the enum tutorial              | medium   | 2019-01-01
  1 | Create an enum tutorial in PostgreSQL | high     | 2019-01-01
(2 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Note that enum values are case-sensitive.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Sixth, attempt to find the requests whose priority is '`HIGH`':

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT *
FROM requests
WHERE priority = 'HIGH'
ORDER BY priority;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

PostgreSQL issues the following error:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ERROR:  invalid input value for enum priority: "HIGH"
LINE 3: WHERE priority = 'HIGH'
                         ^
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Finally, attempt to insert a new row into the `requests` table with an invalid value for the priority column:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO requests(title, priority, request_date)
VALUES
   ('Revise the enum tutorial', 'urgent', '2019-01-02')
RETURNING *;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Error:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ERROR:  invalid input value for enum priority: "urgent"
LINE 3:    ('Revise the enum tutorial', 'urgent', '2019-01-02')
                                        ^
```

<!-- /wp:code -->

<!-- wp:heading -->

## Adding new values to enums

<!-- /wp:heading -->

<!-- wp:paragraph -->

To add a new value to an enum, you use the `ALTER TYPE ... ADD VALUE` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TYPE enum_name
ADD VALUE [IF NOT EXISTS] 'new_value'
[{BEFORE | AFTER } 'existing_enum_value';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, specify the name of the enum you want to add a new value after the `ALTER TYPE` keywords.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, specify the new value after the `ADD VALUE` keywords. Use the `IF NOT EXISTS` to conditionally add a new value only if it does not exist.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Third, specify the position of the new value relative to an existing value. By default, the statement adds the new enum value at the end of the list.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

For example, the following statement adds a new value `'urgent'` to the `priority` enum:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TYPE priority
ADD VALUE 'urgent';
```

<!-- /wp:code -->

<!-- wp:heading -->

## Retrieving a list of enum values

<!-- /wp:heading -->

<!-- wp:paragraph -->

To get a list of values of an enum, you use the `enum_range()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
enum_range(null::enum_name)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

It returns a list of values of the `enum_name` as an ordered array

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

For example, the following statement uses the `enum_range()` function to retrieve a list of enum values from the priority enum:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT enum_range(null::priority);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
        enum_range
--------------------------
 {low,medium,high,urgent}
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Getting the first and last values in an enum

<!-- /wp:heading -->

<!-- wp:paragraph -->

To get the first and last values in an enum, you use the `enum_first()` and `enum_last()` functions respectively.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  enum_first(NULL::priority) first_value,
  enum_last(NULL::priority)  last_value;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 first_value | last_value
-------------+------------
 low         | urgent
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Renaming an enum value

<!-- /wp:heading -->

<!-- wp:paragraph -->

To rename a value in an enum, you use the `ALTER TYPE ... RENAME VALUE` statement as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TYPE enum_name
RENAME VALUE existing_enum_value TO new_enum_value;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

For example, the following statement changes the `'urgent'` value in the priority enum to `'very high'`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TYPE priority
RENAME VALUE 'urgent' TO 'very high';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following statement verifies the change:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT enum_range(null::priority);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
          enum_range
-------------------------------
 {low,medium,high,"very high"}
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Notice that if the value has a space, PostgreSQL uses quotes to surround it as indicated in the output.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## When to use enums

<!-- /wp:heading -->

<!-- wp:paragraph -->

There is some similarity between enums and [foreign keys](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-foreign-key/). Both allow you to define a set of values for a column.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

However, enums have the following advantages:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- **Performance**: you need to query from a single table instead of using join to retrieve data from two tables.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- **Simplicity**: it's much simpler to write an SQL statement to work with enum values.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

But enums also have the following disadvantages:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- **Limited flexibility**: changing enum values requires changing the database schema instead of adding values to the lookup table.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- **Portability**: not all database systems support enum. If you ever want to migrate your PostgreSQL database schema to a database system that does not support enum, you'll have an issue.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

It is recommended to use enums when you have a fixed set of values that are unlikely to change, for example, RGB colors (red, green, blue).

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use enums to define a list of fixed values for a table column.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `CREATE TYPE` statement to define a new enum data type.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- The order of values in an enum is the order in which you declare them when defining the enum type.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `ALTER TYPE ... ADD VALUE` to add a new value to an enum.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `ALTER TYPE ... RENAME VALUE` to rename an enum value.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use enum only when you have a small list of fixed values. Otherwise, use a lookup table with foreign keys instead.
- <!-- /wp:list-item -->

<!-- /wp:list -->
