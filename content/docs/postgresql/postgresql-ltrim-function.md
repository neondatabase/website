---
title: 'PostgreSQL LTRIM() Function'
redirectFrom: 
            - /docs/postgresql/postgresql-string-functions/postgresql-ltrim/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `LTRIM()` function to remove specified characters from the beginning of a string.





## Introduction to PostgreSQL LTRIM() function





The `LTRIM()` function allows you to remove specified characters from the beginning of a string.





Here's the syntax of the `LTRIM()` function:





```
LTRIM(string, character)
```





In this syntax:





- 
- `string` is the input string that you want to remove characters.
- 
-
- 
- `character` specifies the characters you want to remove from the beginning of the `string`. The `character` parameter is optional. It defaults to space.
- 





The `LTRIM()` function returns the string with all leading characters removed.





To remove both leading and trailing characters from a string, you use the [TRIM()](https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-trim-function/) function.





To remove the trailing characters from a string, you use the [RTRIM()](https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-rtrim/) function.





## PostgreSQL LTRIM() function examples





Let's explore some examples of using the `LTRIM()` function.





### 1) Basic PostgreSQL LTRIM() function example





The following example uses the `LTRIM()` function to remove the `#` from the beginning of the string `#postgres`:





```
SELECT LTRIM('#postgres', '#');
```





Output:





```
  ltrim
----------
 postgres
(1 row)
```





### 2) Using the PostgreSQL LTRIM() function to remove leading spaces





The following example uses the `LTRIM()` function to remove all the spaces from the string `' PostgreSQL'`:





```
SELECT LTRIM('   PostgreSQL');
```





Output:





```
   ltrim
------------
 PostgreSQL
(1 row)
```





Since the default of the second argument of the `LTRIM()` function is space, we don't need to specify it.





### 3) Using the LTRIM() function with table data example





First, [create a new table](/docs/postgresql/postgresql-create-table/) called `articles` and [insert some rows](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert-multiple-rows) into it:





```
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





```
 id |                  title
----+------------------------------------------
  1 |    Mastering PostgreSQL string functions
  2 |  PostgreSQL LTRIM() function
(2 rows)
```





Second, [update](/docs/postgresql/postgresql-update) the titles by removing the leading spaces using the `LTRIM()` function:





```
UPDATE articles
SET title = LTRIM(title);
```





Output:





```
UPDATE 2
```





The output indicates that two rows were updated.





Third, verify the updates:





```
SELECT * FROM articles;
```





Output:





```
 id |                 title
----+---------------------------------------
  1 | Mastering PostgreSQL string functions
  2 | PostgreSQL LTRIM() function
(2 rows)
```





## Summary





- 
- Use `LTRIM()` function to remove all specified characters from the beginning of a string.
- 


