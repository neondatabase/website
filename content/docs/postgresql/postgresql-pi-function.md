---
title: 'PostgreSQL PI() Function'
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `PI()` function to return the pi value.



## Introduction to the PostgreSQL PI() function



In PostgreSQL, the `PI()` function returns the value of pi denoted by the Greek letter (π), which is approximately equal to `3.14`



Here's the syntax of the `PI()` function:



```
PI()
```



The `PI`() function takes no arguments and returns the constant value of `PI`, which is `3.141592653589793`.



## PostgreSQL PI() function examples



Let's take some examples of using the `PI()` function examples.



### 1) Basic PI() function examples



The following statement uses the `PI()` function to return the constant `PI` value:



```
SELECT PI();
```



Output:



```
        pi
-------------------
 3.141592653589793
```



The following example uses the `PI()` function to calculate the area of a circle with a radius of 10:



```
SELECT PI() * 10 * 10 area;
```



Output:



```
       area
-------------------
 314.1592653589793
(1 row)
```



### 2) Using the PI() function with table data



First, [create a table](/docs/postgresql/postgresql-create-table) called `circles` that stores the radiuses of circles:



```
CREATE TABLE circles(
   id INT GENERATED ALWAYS AS IDENTITY,
   radius DEC(19,2) NOT NULL,
   PRIMARY KEY(id)
);
```



Second, [insert rows](/docs/postgresql/postgresql-insert) into the `circles` table:



```
INSERT INTO circles(radius)
VALUES(10), (20), (25)
RETURNING *;
```



Output:



```
 id | radius
----+--------
  1 |  10.00
  2 |  20.00
  3 |  25.00
(3 rows)
```



Third, calculate the areas of circles using the `PI()` function:



```
SELECT id, radius, PI() * radius * radius area
FROM circles;
```



Output:



```
 id | radius |        area
----+--------+--------------------
  1 |  10.00 |  314.1592653589793
  2 |  20.00 | 1256.6370614359173
  3 |  25.00 | 1963.4954084936207
(3 rows)
```



To make the area more readable, you can use the `ROUND()` function:



```
SELECT
  id,
  RADIUS,
  ROUND((PI() * RADIUS * RADIUS)::NUMERIC, 2) AREA
FROM
  circles;
```



Output:



```
 id | radius |  area
----+--------+---------
  1 |  10.00 |  314.16
  2 |  20.00 | 1256.64
  3 |  25.00 | 1963.50
(3 rows)
```



## Summary



- Use the `PI()` function to return the pi value.
- 
