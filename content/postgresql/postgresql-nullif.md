---
title: 'PostgreSQL NULLIF'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-nullif/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `NULLIF()` function to handle null values.



## Introduction to PostgreSQL NULLIF function



The `NULLIF()` function is one of the most common conditional expressions provided by PostgreSQL.



Here's the basic syntax of the `NULLIF` function:



```
NULLIF(argument_1,argument_2);
```



The `NULLIF` function returns a null value if `argument_1` equals to `argument_2`, otherwise, it returns `argument_1`.



## PostgreSQL NULLIF function examples



Let's take some examples of using the `NULLIF()` function.



### 1) Basic PostgreSQL NULLIF examples



The following statements illustrate how to use the `NULLIF()` function:



```
SELECT NULLIF (1, 1); -- return NULL
```



Output:



```
 nullif
--------
   null
(1 row)
```



It returns null because the two arguments are equal.



The following example returns the first argument because the two arguments are not equal:



```
SELECT NULLIF (1, 0); -- return 1
```



Output:



```
 nullif
--------
      1
(1 row)
```



The following example uses the `NULLIF()` function with two unequal text arguments:



```
SELECT NULLIF ('A', 'B');
```



Output:



```
 nullif
--------
 A
(1 row)
```



### 2) Using the NULLIF function with table data



First, [create a table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) called `posts`:



```
CREATE TABLE posts (
  id serial primary key,
  title VARCHAR (255) NOT NULL,
  excerpt VARCHAR (150),
  body TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);
```



Second, [insert some sample data](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/) into the `posts` table.



```
INSERT INTO posts (title, excerpt, body)
VALUES
      ('test post 1','test post excerpt 1','test post body 1'),
      ('test post 2','','test post body 2'),
      ('test post 3', null ,'test post body 3')
RETURNING *;
```



Output:



```
 id |    title    |       excerpt       |       body       |         created_at         | updated_at
----+-------------+---------------------+------------------+----------------------------+------------
  1 | test post 1 | test post excerpt 1 | test post body 1 | 2024-02-01 11:28:38.779881 | null
  2 | test post 2 |                     | test post body 2 | 2024-02-01 11:28:38.779881 | null
  3 | test post 3 | null                | test post body 3 | 2024-02-01 11:28:38.779881 | null
(3 rows)
```



The goal is to retrieve data for displaying them on the post overview page that includes the title and excerpt of each post. To achieve this, you can use the first 40 characters of the post body as the excerpt.



Third, use the [COALESCE function](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-coalesce/) to handle `NULL` in the `body` column:



```
SELECT
  id,
  title,
  COALESCE (
    excerpt,
    LEFT(body, 40)
  )
FROM
  posts;
```



Output:



```
 id |    title    |      coalesce
----+-------------+---------------------
  1 | test post 1 | test post excerpt 1
  2 | test post 2 |
  3 | test post 3 | test post body 3
(3 rows)
```



Unfortunately, there is a mix between null value and '' (empty) in the `excerpt` column. To address this issue, you can use the `NULLIF` function:



```
SELECT
  id,
  title,
  COALESCE (
    NULLIF (excerpt, ''),
    LEFT (body, 40)
  )
FROM
  posts;
```



Output:



```
 id |    title    |      coalesce
----+-------------+---------------------
  1 | test post 1 | test post excerpt 1
  2 | test post 2 | test post body 2
  3 | test post 3 | test post body 3
(3 rows)
```



In this statement:



- - First, the `NULLIF` function returns a null value if the excerpt is empty or the excerpt otherwise. The result of the `NULLIF` function is used by the `COALESCE` function.
- -
- - Second, the `COALESCE` function checks if the first argument, which is provided by the `NULLIF` function, if it is null, then it returns the first 40 characters of the body; otherwise, it returns the excerpt in case the excerpt is not null.
- 


## Using NULLIF() function to prevent division-by-zero



Another good example of using the `NULLIF` function is to prevent division-by-zero error.



First, [create a new table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) named members:



```
CREATE TABLE members (
  id serial PRIMARY KEY,
  first_name VARCHAR (50) NOT NULL,
  last_name VARCHAR (50) NOT NULL,
  gender SMALLINT NOT NULL -- 1: male, 2 female
);
```



Second, [insert some rows](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/) for testing:



```
INSERT INTO members (first_name, last_name, gender)
VALUES
  ('John', 'Doe', 1),
  ('David', 'Dave', 1),
  ('Bush', 'Lily', 2)
RETURNING *;
```



Output:



```
 id | first_name | last_name | gender
----+------------+-----------+--------
  1 | John       | Doe       |      1
  2 | David      | Dave      |      1
  3 | Bush       | Lily      |      2
(3 rows)
```



Third, calculate the ratio between male and female members:



```
SELECT
  (
    SUM (CASE WHEN gender = 1 THEN 1 ELSE 0 END) / SUM (CASE WHEN gender = 2 THEN 1 ELSE 0 END)
  ) * 100 AS "Male/Female ratio"
FROM
  members;
```



In this example, we use the [SUM function](https://www.postgresqltutorial.com/postgresql-aggregate-functions/postgresql-sum-function/) and [CASE expression](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-case/) to calculate the total number of male members. Then we divide the total of male members by the total of female members to get the ratio. In this case, it returns 200%:



```
 Male/Female ratio
-------------------
               200
(1 row)
```



Fourth, delete a female member:



```
DELETE FROM members
WHERE gender = 2;
```



And execute the query to calculate the male/female ratio again:



```
SELECT
  (
    SUM (CASE WHEN gender = 1 THEN 1 ELSE 0 END) / SUM (CASE WHEN gender = 2 THEN 1 ELSE 0 END)
  ) * 100 AS "Male/Female ratio"
FROM
  members;
```



We got the following error message:



```
ERROR:  division by zero
```



The reason is that the number of females is zero now. To prevent this division by zero error, you can use the `NULLIF` function as follows:



```
SELECT
  (
    SUM (CASE WHEN gender = 1 THEN 1 ELSE 0 END) / NULLIF (
      SUM (CASE WHEN gender = 2 THEN 1 ELSE 0 END),
      0
    )
  ) * 100 AS "Male/Female ratio"
FROM
  members;
```



Output:



```
 Male/Female ratio
-------------------
              null
(1 row)
```



The `NULLIF` function checks if the number of female members is zero, it returns null. The total of male members is divided by `NULL` will return `NULL` .



## Summary



- - Use the `NULLIF()` function to substitute NULL for displaying data and to prevent division by zero.
- 
