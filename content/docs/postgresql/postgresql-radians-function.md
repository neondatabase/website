---
title: 'PostgreSQL RADIANS() Function'
redirectFrom: 
            - /docs/postgresql/postgresql-radians
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `RADIANS()` function to convert degrees to radians.





## Introduction to the PostgreSQL RADIANS() function





The `RADIANS()` function converts degrees to radians.





Here's the basic syntax of the `RADIANS()` function:





```
RADIANS(degrees_value)
```





In this syntax, the `degrees_value` is a value in degrees that you want to convert to radians. The function returns the `degrees_value` converted to radians.





If the `degrees_value` is `NULL`, the function returns `NULL`.





## PostgreSQL RADIANS() function examples





Let's explore some examples of using the `RADIANS()` function.





### 1) Basic RADIANS() function example





The following example uses the `RADIANS()` function to convert 180 degrees to its equivalent in radians, resulting in `PI` value:





```
SELECT RADIANS(180);
```





Output:





```
      radians
-------------------
 3.141592653589793
(1 row)
```





### 2) Using the RADIANS() function with table data





We'll show you how to use the `RADIANS` with data in a table.





First, [create a new table](/docs/postgresql/postgresql-create-table) called `angles` to store angle data in radians:





```
CREATE TABLE angles (
    id SERIAL PRIMARY KEY,
    angle_degrees NUMERIC
);
```





Second, [insert some rows](/docs/postgresql/postgresql-insert-multiple-rows) into the `angles` table:





```
INSERT INTO angles (angle_degrees)
VALUES
    (45),
    (60),
    (90),
    (NULL)
RETURNING *;
```





Output:





```
 id | angle_degrees
----+---------------
  1 |            45
  2 |            60
  3 |            90
  4 |          null
(4 rows)
```





Third, use the `RADIANS()` function to convert the values in the `angle_degrees` column to radians:





```
SELECT
    id,
    angle_degrees,
    RADIANS(angle_degrees) AS angle_radians
FROM
    angles;
```





Output:





```
 id | angle_degrees |   angle_radians
----+---------------+--------------------
  1 |            45 | 0.7853981633974483
  2 |            60 | 1.0471975511965976
  3 |            90 | 1.5707963267948966
  4 |          null |               null
(4 rows)
```





## Summary





- 
- Use the PostgreSQL `RADIANS()` function to convert degrees to radians.
- 

