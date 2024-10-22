---
title: "PostgreSQL LTRIM() Function"
page_title: "PostgreSQL LTRIM() Function"
page_description: "In this tutorial, you will learn how to use the PostgreSQL LTRIM() function to remove specified characters from the beginning of a string."
prev_url: "https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-ltrim/"
ogImage: ""
updatedOn: "2024-01-27T13:51:25+00:00"
enableTableOfContents: true
prev_page: 
  title: "PostgreSQL TRIM() Function"
  slug: "postgresql-string-functions/postgresql-trim-function"
next_page: 
  title: "PostgreSQL LOWER() Function"
  slug: "postgresql-string-functions/postgresql-lower"
---




**Summary**: in this tutorial, you will learn how to use the PostgreSQL `LTRIM()` function to remove specified characters from the beginning of a string.


## Introduction to PostgreSQL LTRIM() function

The `LTRIM()` function allows you to remove specified characters from the beginning of a string.

Here’s the syntax of the `LTRIM()` function:


```sql
LTRIM(string, character)
```
In this syntax:

* `string` is the input string that you want to remove characters.
* `character` specifies the characters you want to remove from the beginning of the `string`. The `character` parameter is optional. It defaults to space.

The `LTRIM()` function returns the string with all leading characters removed.

To remove both leading and trailing characters from a string, you use the [TRIM()](postgresql-trim-function) function.

To remove the trailing characters from a string, you use the [RTRIM()](postgresql-rtrim) function.


## PostgreSQL LTRIM() function examples

Let’s explore some examples of using the `LTRIM()` function.


### 1\) Basic PostgreSQL LTRIM() function example

The following example uses the `LTRIM()` function to remove the `#` from the beginning of the string `#postgres`:


```sql
SELECT LTRIM('#postgres', '#');
```
Output:


```sql
  ltrim
----------
 postgres
(1 row)
```

### 2\) Using the PostgreSQL LTRIM() function to remove leading spaces

The following example uses the `LTRIM()` function to remove all the spaces from the string `' PostgreSQL'`:


```sql
SELECT LTRIM('   PostgreSQL');
```
Output:


```sql
   ltrim
------------
 PostgreSQL
(1 row)
```
Since the default of the second argument of the `LTRIM()` function is space, we don’t need to specify it.


### 3\) Using the LTRIM() function with table data example

First, [create a new table](../postgresql-tutorial/postgresql-create-table) called `articles` and [insert some rows](../postgresql-tutorial/postgresql-insert-multiple-rows) into it:


```sql
CREATE TABLE articles(
   id SERIAL PRIMARY KEY,
   title VARCHAR(255) NOT NULL
);

INSERT INTO articles(title)
VALUES
   ('   Mastering PostgreSQL string functions'),
   (' PostgreSQL LTRIM() function')
RETURNING *;
```
Output:


```sql
 id |                  title
----+------------------------------------------
  1 |    Mastering PostgreSQL string functions
  2 |  PostgreSQL LTRIM() function
(2 rows)
```
Second, [update](../postgresql-tutorial/postgresql-update) the titles by removing the leading spaces using the `LTRIM()` function:


```sql
UPDATE articles
SET title = LTRIM(title);
```
Output:


```sql
UPDATE 2
```
The output indicates that two rows were updated.

Third, verify the updates:


```sql
SELECT * FROM articles;
```
Output:


```sql
 id |                 title
----+---------------------------------------
  1 | Mastering PostgreSQL string functions
  2 | PostgreSQL LTRIM() function
(2 rows)
```

## Summary

* Use `LTRIM()` function to remove all specified characters from the beginning of a string.

