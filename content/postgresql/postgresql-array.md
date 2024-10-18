---
title: 'PostgreSQL Array'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-array/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to work with **PostgreSQL array** and how to use some handy functions for array manipulation.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL array data type

<!-- /wp:heading -->

<!-- wp:paragraph -->

In PostgreSQL, an array of a collection of elements that have the same data type.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Arrays can be one-dimensional, multidimensional, or even nested arrays.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Every [data type](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-data-types/) has its companion array type e.g., `integer` has an `integer[]` array type, `character` has `character[]` array type.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If you define a [user-defined data type](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-user-defined-data-types/), PostgreSQL also creates a corresponding array type automatically for you.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To define a column with an array type, you use the following syntax:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
column_name datatype []
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In the syntax, we define a one-dimensional array of the datatype.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

For example, the following statement creates a new table called `contacts` with the `phones` column defined with an array of text.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR (100),
  phones TEXT []
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `phones` column is a one-dimensional array that holds various phone numbers that a contact may have.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To define multiple dimensional array, you add the square brackets.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

For example, you can define a two-dimensional array as follows:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
column_name data_type [][]
```

<!-- /wp:code -->

<!-- wp:heading -->

## Inserting data into an array

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following statement inserts a new contact into the `contacts` table.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO contacts (name, phones)
VALUES('John Doe',ARRAY [ '(408)-589-5846','(408)-589-5555' ]);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this example, we use the `ARRAY` constructor to construct an array and insert it into the `contacts` table.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Alternatively, you can use curly braces as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO contacts (name, phones)
VALUES('Lily Bush','{"(408)-589-5841"}'),
      ('William Gate','{"(408)-589-5842","(408)-589-58423"}');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this statement, we insert two rows into the `contacts` table.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Notice that when using curly braces, you use single quotes `'` to wrap the array and double-quotes `"` to wrap text array items.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Querying array data

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following statement retrieves data from the `contacts` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  name,
  phones
FROM
  contacts;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
     name     |              phones
--------------+----------------------------------
 John Doe     | {(408)-589-5846,(408)-589-5555}
 Lily Bush    | {(408)-589-5841}
 William Gate | {(408)-589-5842,(408)-589-58423}
(3 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To access an array element, you use the subscript within square brackets `[]`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

By default, PostgreSQL uses one-based numbering for array elements. It means the first array element starts with the number 1.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following statement retrieves the contact's name and the first phone number:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  name,
  phones [ 1 ]
FROM
  contacts;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
     name     |     phones
--------------+----------------
 John Doe     | (408)-589-5846
 Lily Bush    | (408)-589-5841
 William Gate | (408)-589-5842
(3 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

You can use the array element in the [WHERE clause](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-where/) as the condition to filter the rows.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

For example, the following query finds the contacts who have the phone number `(408)-589-58423` as the second phone number:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  name
FROM
  contacts
WHERE
  phones [ 2 ] = '(408)-589-58423';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
     name
--------------
 William Gate
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Modifying PostgreSQL array

<!-- /wp:heading -->

<!-- wp:paragraph -->

PostgreSQL allows you to update each element of an array or the whole array.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following statement updates the second phone number of `William Gate`.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
UPDATE contacts
SET phones [2] = '(408)-589-5843'
WHERE ID = 3
RETURNING *;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 id |     name     |             phones
----+--------------+---------------------------------
  3 | William Gate | {(408)-589-5842,(408)-589-5843}
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following statement updates an array as a whole.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
UPDATE
  contacts
SET
  phones = '{"(408)-589-5843"}'
WHERE
  id = 3
RETURNING *;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 id |     name     |      phones
----+--------------+------------------
  3 | William Gate | {(408)-589-5843}
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Searching in PostgreSQL Array

<!-- /wp:heading -->

<!-- wp:paragraph -->

Suppose, you want to know who has the phone number `(408)-589-5555` regardless of the position of the phone number in the `phones` array, you can use `ANY()` function as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  name,
  phones
FROM
  contacts
WHERE
  '(408)-589-5555' = ANY (phones);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
   name   |             phones
----------+---------------------------------
 John Doe | {(408)-589-5846,(408)-589-5555}
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Expanding Arrays

<!-- /wp:heading -->

<!-- wp:paragraph -->

PostgreSQL provides the `unnest()` function to expand an array to a list of rows. For example, the following query expands all phone numbers of the `phones` array.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  name,
  unnest(phones)
FROM
  contacts;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
     name     |     unnest
--------------+----------------
 John Doe     | (408)-589-5846
 John Doe     | (408)-589-5555
 Lily Bush    | (408)-589-5841
 William Gate | (408)-589-5843
(4 rows)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- In PostgreSQL, an array is a collection of elements with the same data type.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `data_type []` to define a one-dimensional array for a column.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `[index]` syntax to access the `index` element of an array. The first element has an index of one.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `unnest()` function to expand an array to a list of rows.
- <!-- /wp:list-item -->

<!-- /wp:list -->
