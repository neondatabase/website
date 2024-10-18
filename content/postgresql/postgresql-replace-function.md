---
title: 'PostgreSQL REPLACE() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-replace/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `REPLACE()` function to replace a substring with a new one.



## Introduction to PostgreSQL REPLACE() function



The `REPLACE()` function replaces all occurrences of a substring with a new one in a string.



Here's the syntax of the PostgreSQL `REPLACE()` function:



```
REPLACE(source, from_text, to_text);
```



The `REPLACE()` function accepts three arguments:



- - `source`: This is an input string that you want to replace.
- -
- - `from_text`: This is the substring that you want to search and replace. If the `from_text` appears multiple times in the `source` string, the function will replace all the occurrences.
- -
- - `to_text`: This is the new substring that you want to replace the `from_text`.
- 


## PostgreSQL REPLACE() function examples



Let's explore some examples of using the `REPLACE()` function.



### 1) Basic PostgreSQL REPLACE() function example



The following example uses the `REPLACE()` function to replace the string `'A'` in the string `'ABC AA'` with the string `'Z'`:



```
SELECT REPLACE ('ABC AA', 'A', 'Z');
```



Output:



```
 replace
---------
 ZBC ZZ
(1 row)
```



In this example, the `REPLACE()` function replaces all the characters `'A'` with the character `'Z'` in a string.



### 2) Using the PostgreSQL REPLACE() function with table data



If you want to search and replace a substring in a table column, you use the following syntax:



```
UPDATE
  table_name
SET
  column_name = REPLACE(column, old_text, new_text)
WHERE
  condition;
```



Let's see the following example.



First, [create a new table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) called `posts` that has three columns `id`, `title`, and `url`:



```
CREATE TABLE posts(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL
);

INSERT INTO posts(title, url)
VALUES
('PostgreSQL Tutorial', 'http://www.postgresqltutorial.com'),
('PL/pgSQL', 'http://www.postgresqltutorial.com/postgresql-plpgsql/'),
('PostgreSQL Administration
', 'http://www.postgresqltutorial.com/postgresql-administration/')
RETURNING *;
```



Output:



```
 id |           title           |                             url
----+---------------------------+--------------------------------------------------------------
  1 | PostgreSQL Tutorial       | http://www.postgresqltutorial.com
  2 | PL/pgSQL                  | http://www.postgresqltutorial.com/postgresql-plpgsql/
  3 | PostgreSQL Administration+| http://www.postgresqltutorial.com/postgresql-administration/
    |                           |
(3 rows)


INSERT 0 3
```



Second, replace the `http` in the `url` column with the `https` using the `REPLACE()` function:



```
UPDATE posts
SET url = REPLACE(url, 'http','https');
```



Output:



```
UPDATE 3
```



The output indicates that three rows were updated.



Third, verify the update by retrieving data from the `customer` table:



```
SELECT * FROM posts;
```



Output:



```
 id |           title           |                              url
----+---------------------------+---------------------------------------------------------------
  1 | PostgreSQL Tutorial       | https://www.postgresqltutorial.com
  2 | PL/pgSQL                  | https://www.postgresqltutorial.com/postgresql-plpgsql/
  3 | PostgreSQL Administration+| https://www.postgresqltutorial.com/postgresql-administration/
    |                           |
(3 rows)
```



The output indicates that the `http` in the `url` column were replaced by the `https`.



## Summary



- - Use the PostgreSQL `REPLACE()` function to replace all occurrences of a substring in a string with another a new substring.
- 
