---
title: "PostgreSQL JUSTIFY_INTERVAL() Function"
page_title: "PostgreSQL JUSTIFY_INTERVAL() Function"
page_description: "How to use the PostgreSQL JUSTIFY_INTERVAL() to normalize an interval by using the JUSTIFY_DAYS() and JUSTIFY_HOURS() functions."
prev_url: "https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-justify_interval/"
ogImage: ""
updatedOn: "2024-03-21T03:47:04+00:00"
enableTableOfContents: true
prev_page: 
  title: "PostgreSQL JUSTIFY_HOURS() Function"
  slug: "postgresql-date-functions/postgresql-justify_hours"
next_page: 
  title: "PostgreSQL MAKE_INTERVAL() Function"
  slug: "postgresql-date-functions/postgresql-make_interval"
---




**Summary**: in this tutorial, you will learn how to use the PostgreSQL `JUSTIFY_INTERVAL()` to adjust an interval.


## Introduction to the PostgreSQL JUSTIFY\_INTERVAL() function

The `JUSTIFY_INTERVAL()` function allows you to adjust an interval by converting days exceeding 30 days into months and hours exceeding 24 hours into days. It essentially normalizes an interval for enhanced readability.

The `JUSTIFY_INTERVAL()` function achieves this by utilizing the `JUSTIFY_DAYS()` and `JUSTIFY_HOURS()` functions, with additional sign adjustments:

* [`JUSTIFY_DAYS()`](postgresql-justify_days): Convert days exceeding 30 days into months and remaining days.
* [`JUSTIFY_HOURS()`](postgresql-justify_hours): Convert hours exceeding 24 hours into days and remaining hours.

Here’s the syntax of the `JUSTIFY_INTERVAL()` function:


```sql
JUSTIFY_INTERVAL( value ) → interval
```
In this syntax, the `value` parameter is an interval value you want to justify.

The `JUSTIFY_INTERVAL()` function returns an adjusted interval by:

* Convert days exceeding 30 days into months and remaining days.
* Convert hours exceeding 24 hours into days and remaining hours.
* Correct signs (positive or negative) for the overall duration.


## PostgreSQL JUSTIFY\_INTERVAL() function examples

Let’s take some examples of using the `JUSTIFY_INTERVAL()` function.


### 1\) Basic JUSTIFY\_INTERVAL() function examples

The following example uses the `JUSTIFY_INTERVAL()` function to justify an interval in days to months:


```sql
SELECT JUSTIFY_INTERVAL('35 days');
```
Output:


```sql
 justify_interval
------------------
 1 mon 5 days
(1 row)
```
The following statement uses the `JUSTIFY_INTERVAL()` function to justify an interval in hours to days:


```sql
SELECT JUSTIFY_INTERVAL('30 hours');
```
Output:


```sql
justify_interval
------------------
 1 day 06:00:00
(1 row)
```

### 2\) Using the JUSTIFY\_INTERVAL() function with negative intervals

The following example uses the `JUSTIFY_INTERVAL()` function to convert a negative interval into hours days and hours:


```sql
SELECT JUSTIFY_INTERVAL('-2 days 5 hours');
```
Output:


```sql
 justify_interval
-------------------
 -1 days -19:00:00
(1 row)
```
In this example:

* \-2 days 5 hours is \-48 hours \+ 5 hours which is 43 hours.
* The function converts – 43 hours to \-24 hours \+ – 19 hours, which results in \-1 days \-19:00:00\.


## Summary

* Use the `JUSTIFY_INTERVAL()` function to normalize an interval by converting days exceeding 30 days into months and hours exceeding 24 hours into days, while maintaining correct signs for positive or negative intervals.

