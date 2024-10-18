---
title: 'PostgreSQL DEGREES() Function'
redirectFrom: 
            - /docs/postgresql/postgresql-degrees
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `DEGREES()` function to convert radians to degrees.





## Introduction to the PostgreSQL DEGREES() function





The `DEGREES()` function converts radians to degrees. Here's the syntax of the `DEGREES()` function:





```
DEGREES(radians_value)
```





In this syntax, the `radians_value` is a value in radians that you want to convert to degrees.





The `DEGREES()` function returns the value of the `radians_value` in degrees.





If the `radians_value` is `NULL`, the `DEGREES()` function returns `NULL`.





## PostgreSQL DEGREES() function examples





Let's take some examples of using the `DEGREES()` function.





### 1) Basic DEGREES() function examples





The following example uses the `DEGREES()` function to convert 1 radian to its equivalent degrees:





```
SELECT DEGREES(1);
```





Output:





```
      degrees
-------------------
 57.29577951308232
(1 row)
```





The following example uses the `DEGREES()` function to convert the value of π (pi) radians to its equivalent in degrees:





```
SELECT DEGREES(PI());
```





Output:





```
 degrees
---------
     180
(1 row)
```





Note that the `PI()` function returns the value of π (pi) radians.





### 2) Using the DEGREES() function with table data





First, [create a new table](/docs/postgresql/postgresql-create-table) called `angles` to store radian data:





```
CREATE TABLE angles (
    id SERIAL PRIMARY KEY,
    angle_radians NUMERIC
);
```





Second, [insert some rows](/docs/postgresql/postgresql-insert) into the `angles` table:





```
INSERT INTO angles (angle_radians)
VALUES
    (2*PI()),
    (PI()),
    (PI()/2),
    (NULL)
RETURNING *;
```





Third, use the `DEGREES()` function to convert radians to degrees:





```
SELECT
    id,
    angle_radians,
    ROUND(DEGREES(angle_radians)::numeric, 0) AS angle_degrees
FROM
    angles;
```





Output:





```
 id |  angle_radians   | angle_degrees
----+------------------+---------------
  1 | 6.28318530717959 |           360
  2 | 3.14159265358979 |           180
  3 |  1.5707963267949 |            90
  4 |             null |          null
(4 rows)
```





## Summary





- 
- Use the PostgreSQL `DEGREES()` function to convert radians to degrees.
- 


