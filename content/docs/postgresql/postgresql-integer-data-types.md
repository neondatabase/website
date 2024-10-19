---
title: 'PostgreSQL Integer Data Types'
redirectFrom: 
            - /docs/postgresql/postgresql-tutorial/postgresql-integer
            - /docs/postgresql/postgresql-integer
ogImage: /postgresqltutorial_data/wp-content-uploads-2017-02-postgresql-integer-300x59.png
tableOfContents: true
---

**Summary**: this tutorial introduces you to various PostgreSQL integer types including `SMALLINT`, `INTEGER`, and `BIGINT`.

## Introduction to PostgreSQL integer types

![postgresql integer](/postgresqltutorial_data/wp-content-uploads-2017-02-postgresql-integer-300x59.png)

To store the whole numbers in PostgreSQL, you can use one of the following integer types:

- `SMALLINT`
- `INTEGER`
- `BIGINT`

The following table illustrates the specification of each integer type:

| Name       | Storage Size | Min                        | Max                        |
| ---------- | ------------ | -------------------------- | -------------------------- |
| `SMALLINT` | 2 bytes      | -32,768                    | +32,767                    |
| `INTEGER`  | 4 bytes      | -2,147,483,648             | +2,147,483,647             |
| `BIGINT`   | 8 bytes      | -9,223,372,036,854,775,808 | +9,223,372,036,854,775,807 |

If you attempt to store a value outside of the permitted ranges, PostgreSQL will issue an error.

Unlike [MySQL integer](https://www.mysqltutorial.org/mysql-basics/mysql-int/), PostgreSQL does not provide unsigned integer types.

### SMALLINT

The `SMALLINT` requires 2 bytes storage size which can store any integer numbers that are in the range of (-32,767, 32,767).

You can use the `SMALLINT` type for storing something like the ages of people, the number of pages of a book, and so on.

The following statement [creates a table](/docs/postgresql/postgresql-create-table) named `books`:

```
CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR (255) NOT NULL,
    pages SMALLINT NOT NULL CHECK (pages > 0)
);
```

In this example, the `pages` column is a `SMALLINT` column. Because the number of pages must be positive, we added a [`CHECK`](/docs/postgresql/postgresql-check-constraint) constraint to enforce this rule.

### INTEGER

The `INTEGER` is the most common choice between integer types because it offers the best balance between storage size, range, and performance.

The `INTEGER` type requires 4 bytes storage size that can store numbers in the range of (-2,147,483,648, 2,147,483,647).

You can use the `INTEGER` type for a column that stores quite big whole numbers like the population of a city or even country as the following example:

```
CREATE TABLE cities (
    city_id serial PRIMARY KEY,
    city_name VARCHAR (255) NOT NULL,
    population INT NOT NULL CHECK (population >= 0)
);
```

Notice that `INT` is the synonym of `INTEGER`.

### BIGINT

If you want to store the whole numbers that are out of the range of the `INTEGER` type, you can use the `BIGINT` type.

The `BIGINT` type requires 8 bytes storage size that can store any number in the range of (-9,223,372,036,854,775,808,+9,223,372,036,854,775,807).

Using `BIGINT` type is not only consuming a lot of storage but also decreasing the performance of the database, therefore, you should have a good reason to use it.

## Summary

- Use `SMALLINT`, `INT`, and `BIGINT` data types to store integers in the database.
