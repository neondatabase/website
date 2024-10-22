---
title: "PostgreSQL Array"
page_title: "PostgreSQL Array"
page_description: "In this tutorial, we show you how to work with PostgreSQL Array and introduce you to some handy functions for array manipulation."
prev_url: "https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-array/"
ogImage: ""
updatedOn: "2024-02-01T12:38:39+00:00"
enableTableOfContents: true
prev_page: 
  title: "PostgreSQL UUID Data Type"
  slug: "postgresql-tutorial/postgresql-uuid"
next_page: 
  title: "PostgreSQL hstore"
  slug: "postgresql-tutorial/postgresql-hstore"
---




**Summary**: in this tutorial, you will learn how to work with **PostgreSQL array** and how to use some handy functions for array manipulation.


## Introduction to PostgreSQL array data type

In PostgreSQL, an array of a collection of elements that have the same data type.

Arrays can be one\-dimensional, multidimensional, or even nested arrays.

Every [data type](postgresql-data-types) has its companion array type e.g., `integer` has an `integer[]` array type, `character` has `character[]` array type.

If you define a [user\-defined data type](postgresql-user-defined-data-types), PostgreSQL also creates a corresponding array type automatically for you.

To define a column with an array type, you use the following syntax:


```csssql
column_name datatype []
```
In the syntax, we define a one\-dimensional array of the datatype.

For example, the following statement creates a new table called `contacts` with the `phones` column defined with an array of text.


```css
CREATE TABLE contacts (
  id SERIAL PRIMARY KEY, 
  name VARCHAR (100), 
  phones TEXT []
);
```
The `phones` column is a one\-dimensional array that holds various phone numbers that a contact may have.

To define multiple dimensional array, you add the square brackets.

For example, you can define a two\-dimensional array as follows:


```sql
column_name data_type [][]
```

## Inserting data into an array

The following statement inserts a new contact into the `contacts` table.


```
INSERT INTO contacts (name, phones)
VALUES('John Doe',ARRAY [ '(408)-589-5846','(408)-589-5555' ]);
```
In this example, we use the `ARRAY` constructor to construct an array and insert it into the `contacts` table.

Alternatively, you can use curly braces as follows:


```sql
INSERT INTO contacts (name, phones)
VALUES('Lily Bush','{"(408)-589-5841"}'),
      ('William Gate','{"(408)-589-5842","(408)-589-58423"}');
```
In this statement, we insert two rows into the `contacts` table.

Notice that when using curly braces, you use single quotes `'` to wrap the array and double\-quotes `"` to wrap text array items.


## Querying array data

The following statement retrieves data from the `contacts` table:


```sql
SELECT 
  name, 
  phones 
FROM 
  contacts;
```
Output:


```sql
     name     |              phones
--------------+----------------------------------
 John Doe     | {(408)-589-5846,(408)-589-5555}
 Lily Bush    | {(408)-589-5841}
 William Gate | {(408)-589-5842,(408)-589-58423}
(3 rows)
```
To access an array element, you use the subscript within square brackets `[]`.

By default, PostgreSQL uses one\-based numbering for array elements. It means the first array element starts with the number 1\. 

The following statement retrieves the contact’s name and the first phone number:


```
SELECT 
  name, 
  phones [ 1 ] 
FROM 
  contacts;
```
Output:


```sql
     name     |     phones
--------------+----------------
 John Doe     | (408)-589-5846
 Lily Bush    | (408)-589-5841
 William Gate | (408)-589-5842
(3 rows)
```
You can use the array element in the [WHERE clause](postgresql-where) as the condition to filter the rows.

For example, the following query finds the contacts who have the phone number `(408)-589-58423` as the second phone number:


```
SELECT 
  name 
FROM 
  contacts 
WHERE 
  phones [ 2 ] = '(408)-589-58423';
```
Output:


```sql
     name
--------------
 William Gate
(1 row)
```

## Modifying PostgreSQL array

PostgreSQL allows you to update each element of an array or the whole array.

The following statement updates the second phone number of `William Gate`.


```
UPDATE contacts
SET phones [2] = '(408)-589-5843'
WHERE ID = 3
RETURNING *;
```
Output:


```sql
 id |     name     |             phones
----+--------------+---------------------------------
  3 | William Gate | {(408)-589-5842,(408)-589-5843}
(1 row)
```
The following statement updates an array as a whole.


```sql
UPDATE 
  contacts 
SET 
  phones = '{"(408)-589-5843"}' 
WHERE 
  id = 3
RETURNING *;
```
Output:


```sql
 id |     name     |      phones
----+--------------+------------------
  3 | William Gate | {(408)-589-5843}
(1 row)
```

## Searching in PostgreSQL Array

Suppose, you want to know who has the phone number `(408)-589-5555` regardless of the position of the phone number in the `phones` array, you can use `ANY()` function as follows:


```sql
SELECT 
  name, 
  phones 
FROM 
  contacts 
WHERE 
  '(408)-589-5555' = ANY (phones);
```
Output:


```sql
   name   |             phones
----------+---------------------------------
 John Doe | {(408)-589-5846,(408)-589-5555}
(1 row)
```

## Expanding Arrays

PostgreSQL provides the `unnest()` function to expand an array to a list of rows. For example, the following query expands all phone numbers of the `phones` array.


```
SELECT 
  name, 
  unnest(phones) 
FROM 
  contacts;
```
Output:


```
     name     |     unnest
--------------+----------------
 John Doe     | (408)-589-5846
 John Doe     | (408)-589-5555
 Lily Bush    | (408)-589-5841
 William Gate | (408)-589-5843
(4 rows)
```

## Summary

* In PostgreSQL, an array is a collection of elements with the same data type.
* Use the `data_type []` to define a one\-dimensional array for a column.
* Use the `[index]` syntax to access the `index` element of an array. The first element has an index of one.
* Use the `unnest()` function to expand an array to a list of rows.

