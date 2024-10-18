---
title: 'PostgreSQL Character Types: CHAR, VARCHAR, and TEXT'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-char-varchar-text/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---

**Summary**: in this tutorial, you will learn about the PostgreSQL character data types including `CHAR`, `VARCHAR`, and `TEXT`, and how to select the appropriate character types for your tables.



## Introduction to the PostgreSQL character types



PostgreSQL provides three primary character types:



- - `CHARACTER(n)` or `CHAR(n)`
- -
- - `CHARACTER VARYING(n)` or `VARCHAR(n)`
- -
- - `TEXT`
- 


In this syntax, `n` is a positive integer that specifies the number of characters.



The following table illustrates the character types in PostgreSQL:



| **Character Types**                  | **Description**                   |
| ------------------------------------ | --------------------------------- |
| `CHARACTER VARYING(n)`, `VARCHAR(n)` | variable-length with length limit |
| `CHARACTER(n)`, `CHAR(n)`            | fixed-length, blank padded        |
| `TEXT`, `VARCHAR`                    | variable unlimited length         |



Both `CHAR(n)` and `VARCHAR(n)` can store up to `n` characters. If you attempt to store a string that has more than `n` characters, PostgreSQL will issue an error.



However, one exception is that if the excessive characters are all spaces, PostgreSQL truncates the spaces to the maximum length (`n`) and stores the trimmed characters.



If a string explicitly [casts](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-cast/) to a `CHAR(n)` or `VARCHAR(n)`, PostgreSQL will truncate the string to `n` characters before inserting it into the table.



The `TEXT` data type can store a string with unlimited length.



If you do not specify the n integer for the `VARCHAR` data type, it behaves like the `TEXT` datatype. The performance of the `VARCHAR` (without the size `n`) and `TEXT` are the same.



The advantage of specifying the length specifier for the `VARCHAR` data type is that PostgreSQL will issue an error if you attempt to insert a string that has more than `n` characters into the `VARCHAR(n)` column.



Unlike `VARCHAR`, The `CHARACTER` or `CHAR` without the length, specifier (`n`) is the same as the `CHARACTER(1)` or `CHAR(1)`.



Different from other database systems, in PostgreSQL, there is no performance difference among the three character types.



In most cases, you should use `TEXT`or `VARCHAR` and use the `VARCHAR(n)` only when you want PostgreSQL to check the length.



## PostgreSQL character type examples



Let's take a look at an example to understand how the `CHAR`, `VARCHAR`, and `TEXT` data types work.



First, [create a new table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) called `character_tests`:



```
CREATE TABLE character_tests (
  id serial PRIMARY KEY,
  x CHAR (1),
  y VARCHAR (10),
  z TEXT
);
```



Then, [insert a new row](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/) into the `character_tests` table:



```
INSERT INTO character_tests (x, y, z)
VALUES
  (
    'Yes', 'This is a test for varchar',
    'This is a very long text for the PostgreSQL text column'
  );
```



PostgreSQL issued an error:



```
ERROR:  value too long for type character(1)
```



This is because the data type of the `x` column is `char(1)` and we attempted to insert a string with three characters into this column.



Let's fix it:



```
INSERT INTO character_tests (x, y, z)
VALUES
  (
    'Y',
    'This is a test for varchar',
    'This is a very long text for the PostgreSQL text column'
  );
```



PostgreSQL issues a different error:



```
ERROR:  value too long for type character varying(10)
```



This is because we attempted to insert a string with more than 10 characters into the column `y` that has the `varchar(10)` datatype.



The following statement inserts a new row into the `character_tests` table successfully.



```
INSERT INTO character_tests (x, y, z)
VALUES
  (
    'Y',
    'varchar(n)',
    'This is a very long text for the PostgreSQL text column'
  )
RETURNING *;
```



Output:



```
 id | x |     y      |                            z
----+---+------------+---------------------------------------------------------
  1 | Y | varchar(n) | This is a very long text for the PostgreSQL text column
(1 row)
```



## Summary



- - PostgreSQL supports `CHAR`, `VARCHAR`, and `TEXT` data types. The `CHAR` is a fixed-length character type while the `VARCHAR` and `TEXT` are varying length character types.
- -
- - Use `VARCHAR(n)` if you want to validate the length of the string (`n`) before inserting into or updating to a column.
- -
- - `VARCHAR` (without the length specifier) and `TEXT` are equivalent.
- 
