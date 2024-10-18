---
title: 'PostgreSQL JUSTIFY_DAYS() Function'
redirectFrom:
            - /docs/postgresql/postgresql-justify_days 
            - /docs/postgresql/postgresql-date-functions/postgresql-justify_days/
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `JUSTIFY_DAYS()` function to adjust 30-day intervals as months.





## Introduction to the PostgreSQL JUSTIFY_DAYS() function





The `JUSTIFY_DAYS()` function allows you to normalize an [interval](/docs/postgresql/postgresql-interval) by converting days exceeding 30 days into months and remaining days.





Here's the basic syntax of the `JUSTIFY_DAYS()` function:





```
JUSTIFY_DAYS ( value) → interval
```





In this syntax:





- 
- `value` is an interval value you want to justify.
- 





The `JUSTIFY_DAYS()` function returns an adjusted interval with:





- 
- Days exceeding 30 converted to months.
- 
-
- 
- The remaining days are kept as days.
- 
-
- 
- Hours, minutes, and seconds remain intact.
- 





If the input interval (`value`) is `NULL`, the function returns `NULL`.





## PostgreSQL JUSTIFY_DAYS() function examples





Let's explore some examples of using the PostgreSQL `JUSTIFY_DAYS()` function.





### 1) Basic PostgreSQL JUSTIFY_DAYS() function example





The following statement uses the `JUSTIFY_DAYS()` function to adjust intervals that are multiples of 30 days:





```
SELECT JUSTIFY_DAYS(INTERVAL '30 days'),
       JUSTIFY_DAYS(INTERVAL '60 days'),
       JUSTIFY_DAYS(INTERVAL '90 days');
```





Output:





```
 justify_days | justify_days | justify_days
--------------+--------------+--------------
 1 mon        | 2 mons       | 3 mons
(1 row)
```





### 2) Using JUSTIFY_DAYS() function with intervals that are not multiple of 30 days





The following example uses the `JUSTIFY_DAYS()` function to adjust intervals that are not multiples of 30 days:





```
SELECT JUSTIFY_DAYS(INTERVAL '15 days'),
       JUSTIFY_DAYS(INTERVAL '45 days'),
       JUSTIFY_DAYS(INTERVAL '75 days');
```





Output:





```
 justify_days | justify_days  |  justify_days
--------------+---------------+----------------
 15 days      | 1 mon 15 days | 2 mons 15 days
(1 row)
```





### 3) Using JUSTIFY_DAYS() function with intervals that include hours





The following example uses the `JUSTIFY_DAYS()` function to adjust intervals that include hours, minutes, and seconds:





```
SELECT JUSTIFY_DAYS(INTERVAL '15 days 2 hours'),
       JUSTIFY_DAYS(INTERVAL '55 days 30 minutes'),
       JUSTIFY_DAYS(INTERVAL '75 days 45 seconds');
```





Output:





```
   justify_days   |      justify_days      |      justify_days
------------------+------------------------+-------------------------
 15 days 02:00:00 | 1 mon 25 days 00:30:00 | 2 mons 15 days 00:00:45
(1 row)
```





The output indicates that the adjusted intervals have the time parts.





## Summary





- 
- Use the `JUSTIFY_DAYS()` function to normalize an interval by converting days exceeding 30 days as months.
- 


