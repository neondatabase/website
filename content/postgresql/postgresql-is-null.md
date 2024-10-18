---
title: 'PostgreSQL IS NULL'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-is-null/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `IS NULL` operator to check if a value is NULL or not.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to NULL

<!-- /wp:heading -->

<!-- wp:paragraph -->

In the database world, NULL means missing information or not applicable. NULL is not a value, therefore, you cannot compare it with other values like numbers or strings.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The comparison of NULL with a value will always result in NULL. Additionally, NULL is not equal to NULL so the following expression returns NULL:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT null = null AS result;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 result
--------
 null
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading -->

## IS NULL operator

<!-- /wp:heading -->

<!-- wp:paragraph -->

To check if a value is NULL or not, you cannot use the equal to (`=`) or not equal to (`<>`) operators. Instead, you use the `IS NULL` operator.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the basic syntax of the `IS NULL` operator:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
value IS NULL
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `IS NULL` operator returns true if the `value` is NULL or false otherwise.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To negate the `IS NULL` operator, you use the `IS NOT NULL` operator:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
value IS NOT NULL
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `IS NOT NULL` operator returns true if the value is not NULL or false otherwise.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To learn how to deal with NULL in sorting, check out the [ORDER BY tutorial](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-order-by/).

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

PostgreSQL offers some useful functions to handle NULL effectively such as [NULLIF](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-nullif/), [ISNULL](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-isnull/), and [COALESCE](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-coalesce/).

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To ensure that a column does not contain NULL, you use the [NOT NULL constraint](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-not-null-constraint/).

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL IS NULL operator examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

We'll use the `address` table from the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/):

<!-- /wp:paragraph -->

<!-- wp:image {"id":3708,"sizeSlug":"full","linkDestination":"none"} -->

![address table](https://www.postgresqltutorial.com/wp-content/uploads/2018/12/address.png)

<!-- /wp:image -->

<!-- wp:paragraph {"className":"note"} -->

Please note that the `psql` program displays `NULL` as an empty string by default. To change how `psql` shows NULL in the terminal, you can use the command: `\pset null null`. It will display NULL as null.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic IS NULL operator example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `IS NULL` operator to find the addresses from the `address` table that the `address2` column contains `NULL`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  address,
  address2
FROM
  address
WHERE
  address2 IS NULL;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
       address        | address2
----------------------+----------
 47 MySakila Drive    | null
 28 MySQL Boulevard   | null
 23 Workhaven Lane    | null
 1411 Lillydale Drive | null
(4 rows)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Using the IS NOT NULL operator example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `IS NOT NULL` operator to retrieve the address that has the `address2` not NULL:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
  address,
  address2
FROM
  address
WHERE
  address2 IS NOT NULL;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
                address                 | address2
----------------------------------------+----------
 1913 Hanoi Way                         |
 1121 Loja Avenue                       |
 692 Joliet Street                      |
 1566 Inegl Manor                       |
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Notice that the `address2` is empty, not NULL. This is a good example of **bad practice** when it comes to storing empty strings and NULL in the same column.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To fix it, you can use the `UPDATE` statement to change the empty strings to NULL in the `address2` column, which you will learn in the [UPDATE tutorial](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-update/).

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- In databases, NULL means missing information or not applicable.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- The `IS NULL` operator returns true if a value is NULL or false otherwise.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `IS NOT NULL` operator returns true if a value is not NULL or false otherwise.
- <!-- /wp:list-item -->

<!-- /wp:list -->
