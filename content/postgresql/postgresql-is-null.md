---
redirectFrom:
    - /postgresql/postgresql-tutorial/postgresql-is-null
prevPost: postgresql-ln-function
nextPost: plpgsql-while-loop
createdAt: 2019-01-01T14:28:19.000Z
title: 'PostgreSQL IS NULL'
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `IS NULL` operator to check if a value is NULL or not.

## Introduction to NULL

In the database world, NULL means missing information or not applicable. NULL is not a value, therefore, you cannot compare it with other values like numbers or strings.

The comparison of NULL with a value will always result in NULL. Additionally, NULL is not equal to NULL so the following expression returns NULL:

```sql
SELECT null = null AS result;
```

Output:

```
 result
--------
 null
(1 row)
```

## IS NULL operator

To check if a value is NULL or not, you cannot use the equal to (`=`) or not equal to (`<>`) operators. Instead, you use the `IS NULL` operator.

Here's the basic syntax of the `IS NULL` operator:

```
value IS NULL
```

The `IS NULL` operator returns true if the `value` is NULL or false otherwise.

To negate the `IS NULL` operator, you use the `IS NOT NULL` operator:

```
value IS NOT NULL
```

The `IS NOT NULL` operator returns true if the value is not NULL or false otherwise.

To learn how to deal with NULL in sorting, check out the [ORDER BY tutorial](/postgresql/postgresql-order-by).

PostgreSQL offers some useful functions to handle NULL effectively such as [NULLIF](/postgresql/postgresql-nullif), [ISNULL](/postgresql/postgresql-tutorial/postgresql-isnull), and [COALESCE](/postgresql/postgresql-tutorial/postgresql-coalesce).

To ensure that a column does not contain NULL, you use the [NOT NULL constraint](/postgresql/postgresql-not-null-constraint).

## PostgreSQL IS NULL operator examples

We'll use the `address` table from the [sample database](/postgresql/postgresql-getting-started/postgresql-sample-database):

![address table](/postgresqltutorial_data/address.png)

Please note that the `psql` program displays `NULL` as an empty string by default. To change how `psql` shows NULL in the terminal, you can use the command: `\pset null null`. It will display NULL as null.

### 1) Basic IS NULL operator example

The following example uses the `IS NULL` operator to find the addresses from the `address` table that the `address2` column contains `NULL`:

```sql
SELECT
  address,
  address2
FROM
  address
WHERE
  address2 IS NULL;
```

Output:

```
       address        | address2
----------------------+----------
 47 MySakila Drive    | null
 28 MySQL Boulevard   | null
 23 Workhaven Lane    | null
 1411 Lillydale Drive | null
(4 rows)
```

### 2) Using the IS NOT NULL operator example

The following example uses the `IS NOT NULL` operator to retrieve the address that has the `address2` not NULL:

```sql
SELECT
  address,
  address2
FROM
  address
WHERE
  address2 IS NOT NULL;
```

Output:

```
                address                 | address2
----------------------------------------+----------
 1913 Hanoi Way                         |
 1121 Loja Avenue                       |
 692 Joliet Street                      |
 1566 Inegl Manor                       |
```

Notice that the `address2` is empty, not NULL. This is a good example of **bad practice** when it comes to storing empty strings and NULL in the same column.

To fix it, you can use the `UPDATE` statement to change the empty strings to NULL in the `address2` column, which you will learn in the [UPDATE tutorial](/postgresql/postgresql-update).

## Summary

- In databases, NULL means missing information or not applicable.
-
- The `IS NULL` operator returns true if a value is NULL or false otherwise.
-
- Use the `IS NOT NULL` operator returns true if a value is not NULL or false otherwise.
