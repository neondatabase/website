---
title: 'PostgreSQL ISFINITE() Function'
redirectFrom:
            - /docs/postgresql/postgresql-isfinite 
            - /docs/postgresql/postgresql-date-functions/postgresql-isfinite/
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `ISFINITE()` function to determine if a date, a timestamp, or an interval is finite or not.





## Introduction to the PostgreSQL ISFINITE() function





The `ISFINITE()` function accepts a [date](/docs/postgresql/postgresql-date/), a [timestamp](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-timestamp/), or an [interval](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-interval) and returns true if the value is finite.





Here's the syntax of the `ISFINITE()` function:





```
isfinite ( value ) → boolean
```





The `isfinite()` function accepts a value with the type date, timestamp, or interval.





The `isfinite()` function returns true if the value is finite or false otherwise. It returns `NULL` if the value is `NULL`.





## PostgreSQL ISFINITE() function examples





Let's explore some examples of using the `ISFINITE()` function.





### 1) Using the ISFINITE() function with dates





The following example uses the `ISFINITE()` function to check if a date is finite or not:





```
SELECT ISFINITE('2024-03-20'::date) result;
```





Output:





```
 result
--------
 t
(1 row)
```





The result is t, which is true in PostgreSQL.





The following example uses the `ISFINITE()` function to determine whether the date infinity is finite or not:





```
SELECT ISFINITE(DATE 'infinity') result;
```





Output:





```
 result
--------
 f
(1 row)
```





The result is false because the infinity date is not finite.





### 2) Using the ISFINITE() function with intervals





The following statement uses the `ISFINITE()` function to check if an interval is finite or not:





```
SELECT ISFINITE(INTERVAL '1 day') result;
```





Output:





```
 result
--------
 t
(1 row)
```





Since PostgreSQL doesn't support infinity intervals, the `ISFINITE()` function always returns true for an interval.





### 3) Using the ISFINITE() function with timestamps





The following statement uses the `ISFINITE()` function to test for a finite timestamp:





```
SELECT ISFINITE(TIMESTAMP '2024-03-20 00:00:00') result;
```





Output:





```
 result
--------
 t
(1 row)
```





The following statement uses the `ISFINITE()` function to check for an infinite timestamp:





```
SELECT ISFINITE(TIMESTAMP 'infinity') result;
```





Output:





```
 result
--------
 f
(1 row)
```





## Summary





- Use the `ISFINITE()` function to test if a date, a timestamp, or an interval is finite or not.


