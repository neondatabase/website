---
title: 'PostgreSQL Boolean Data Type with Practical Examples'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-boolean/
ogImage: ./img/wp-content-uploads-2016-06-PostgreSQL-Boolean-300x146.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn about the PostgreSQL Boolean data type and how to use it in designing database tables.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL Boolean type

<!-- /wp:heading -->

<!-- wp:image {"align":"right","id":2294} -->

![PostgreSQL Boolean](./img/wp-content-uploads-2016-06-PostgreSQL-Boolean-300x146.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

PostgreSQL supports a single Boolean [data type](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-data-types/): `BOOLEAN` that can have three values: `true`, `false` and `NULL`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

PostgreSQL uses one byte for storing a boolean value in the database. The `BOOLEAN` can be abbreviated as `BOOL`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

In standard SQL, a Boolean value can be `TRUE`, `FALSE`, or `NULL`. However, PostgreSQL is quite flexible when dealing with `TRUE` and `FALSE` values.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following table shows the valid literal values for `TRUE` and `FALSE` in PostgreSQL.

<!-- /wp:paragraph -->

<!-- wp:table {"className":"table-200"} -->

| True   | False   |
| ------ | ------- |
| true   | false   |
| 't'    | 'f '    |
| 'true' | 'false' |
| 'y'    | 'n'     |
| 'yes'  | 'no'    |
| '1'    | '0'     |

<!-- /wp:table -->

<!-- wp:paragraph -->

Note that the leading or trailing whitespace does not matter and all the constant values except for `true` and `false` must be enclosed in single quotes.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL Boolean examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's take a look at some examples of using the PostgreSQL Boolean data type.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, [create a new table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) called `stock_availability` to log which products are available.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE stock_availability (
   product_id INT PRIMARY KEY,
   available BOOLEAN NOT NULL
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, [insert some sample data](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/) into the `stock_availability` table. We use various literal values for the boolean values.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO stock_availability (product_id, available)
VALUES
  (100, TRUE),
  (200, FALSE),
  (300, 't'),
  (400, '1'),
  (500, 'y'),
  (600, 'yes'),
  (700, 'no'),
  (800, '0');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, check for the availability of products:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT *
FROM stock_availability
WHERE available = 'yes';
```

<!-- /wp:code -->

<!-- wp:code {"language":"sql"} -->

```
 product_id | available
------------+-----------
        100 | t
        300 | t
        400 | t
        500 | t
        600 | t
(5 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

You can imply the true value by using the Boolean column without any operator. For example, the following query returns all available products:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT *
FROM stock_availability
WHERE available;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Similarly, if you want to look for `false` values, you compare the value of the Boolean column against any valid Boolean constants.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following query returns the products that are not available.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  *
FROM
  stock_availability
WHERE
  available = 'no';
```

<!-- /wp:code -->

<!-- wp:code {"language":"sql"} -->

```
 product_id | available
------------+-----------
        200 | f
        700 | f
        800 | f
(3 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Alternatively, you can use the `NOT` operator to check if values in the Boolean column are false like this:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  *
FROM
  stock_availability
WHERE
  NOT available;
```

<!-- /wp:code -->

<!-- wp:heading -->

## Set the default values for Boolean columns

<!-- /wp:heading -->

<!-- wp:paragraph -->

To set a default value for an existing Boolean column, you use the `SET DEFAULT` clause in the [ALTER TABLE](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-alter-table/) statement.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

For example, the following `ALTER TABLE` statement sets the default value for the `available` column in the `stock_availability` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE stock_availability
ALTER COLUMN available
SET DEFAULT FALSE;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

If you insert a row without specifying the value for the `available` column, PostgreSQL will use `FALSE` by default:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO stock_availability (product_id)
VALUES (900);
```

<!-- /wp:code -->

<!-- wp:code {"language":"sql"} -->

```
SELECT *
FROM stock_availability
WHERE product_id = 900;
```

<!-- /wp:code -->

<!-- wp:code {"language":"sql"} -->

```
 product_id | available
------------+-----------
        900 | f
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Likewise, if you want to set a default value for a Boolean column when you [create a table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/), you use the `DEFAULT` constraint in the column definition as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE boolean_demo (
   ...
   is_ok BOOL DEFAULT 't'
);
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `BOOLEAN` datatype to store the boolean data.
- <!-- /wp:list-item -->

<!-- /wp:list -->
