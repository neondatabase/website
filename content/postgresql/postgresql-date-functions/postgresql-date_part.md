---
title: "PostgreSQL DATE_PART() Function"
page_title: "PostgreSQL DATE_PART() Function"
page_description: "Learn how to the PostgreSQL DATE_PART function to extract subfields such as year, month, week, and so on from a timestamp."
prev_url: "https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-date_part/"
ogImage: ""
updatedOn: "2024-03-22T01:10:49+00:00"
enableTableOfContents: true
prev_page: 
  title: "PostgreSQL LOCALTIMESTAMP Function"
  slug: "postgresql-date-functions/postgresql-localtimestamp"
next_page: 
  title: "PostgreSQL EXTRACT() Function"
  slug: "postgresql-date-functions/postgresql-extract"
---




**Summary**: in this tutorial, you will learn how to use the PostgreSQL `DATE_PART()` function to retrieve the subfields such as year, month, and week from a [date](../postgresql-tutorial/postgresql-date) or [time](../postgresql-tutorial/postgresql-time) value.


## Introduction to the PostgreSQL DATE\_PART() function

The `DATE_PART()` function allows you to extract a subfield from a date or time value.

The following illustrates the basic syntax for the `DATE_PART()` function:


```sqlsql
DATE_PART(field, source)
```
The `DATE_PART()` function has two optional parameters `field` and `source`. The `field` is an identifier that determines what to extract from the `source`.

The values of the field must be one of the following permitted values:

* century
* decade
* year
* month
* day
* hour
* minute
* second
* microseconds
* milliseconds
* dow
* doy
* epoch
* isodow
* isoyear
* timezone
* timezone\_hour
* timezone\_minute

The `source` is a temporal expression that evaluates to [`TIMESTAMP`](../postgresql-tutorial/postgresql-timestamp), [`TIME`](../postgresql-tutorial/postgresql-time), or [`INTERVAL`](../postgresql-tutorial/postgresql-interval). If the `source` evaluates to `DATE`, the function will be cast to `TIMESTAMP`.

The `DATE_PART()` function returns a value whose type is double precision.


## PostgreSQL DATE\_PART() function examples

Let’s explore some examples of using the `DATE_PART()` function.


### 1\) Basic PostgreSQL DATE\_PART() function example

The following example uses the `DATE_PART()` function to extract the century from a timestamp:


```sql
SELECT date_part('century',TIMESTAMP '2017-01-01');
```
Output:


```sql
 date_part
-----------
        21
(1 row)
```

### 2\) Extracting the year from a timestamp

To extract the year from the same timestamp, you pass the year to the `field` argument:


```sql
SELECT date_part('year',TIMESTAMP '2017-01-01');
```
Output:


```sql
 date_part
-----------
      2017
(1 row)
```

### 3\) Extracting the quarter from a timestamp

The following example uses the `DATE_PART()` function to extract the quarter from a timestamp:


```
SELECT date_part('quarter',TIMESTAMP '2017-01-01');
```
Output:


```sql
 date_part
-----------
         1
(1 row)  
```

### 4\) Extracting month from a timestamp

The following example uses the `DATE_PART()` function to extract the month from a timestamp:


```
SELECT date_part('month',TIMESTAMP '2017-09-30');
```
Output:


```sql
 date_part
-----------
         9
(1 row)
```

### 5\) Extracting a decade from a timestamp

The following example uses the `DATE_PART()` function to extract the decade from a timestamp:


```sql
 SELECT date_part('decade',TIMESTAMP '2017-09-30');
```
Output:


```sql
 date_part
-----------
       201
(1 row)
```

### 6\) Extracting a week number from a timestamp

To extract the week number from a time stamp, you pass the week as the first argument:


```
SELECT date_part('week',TIMESTAMP '2017-09-30');
```
Output:


```sql
 date_part
-----------
        39
(1 row)
```

### 7\) Extracting a week number from a timestamp

To get the current millennium, you use the `DATE_PART()` function with the [`NOW()`](postgresql-now) function as follows:


```sql
SELECT date_part('millennium',now());
```
Output:


```sql
 date_part
-----------
         3
(1 row)
```

### 8\) Extracting day from a timestamp

To extract the day part from a timestamp, you pass the `day` string to the `DATE_PART()` function:


```sql
SELECT date_part('day',TIMESTAMP '2017-03-18 10:20:30');
```
Output:


```sql
 date_part
-----------
        18
(1 row)
```

### 9\) Extracting hour, minute, and second from a timestamp

To extract the hour, minute, and second, from a time stamp, you pass the corresponding value hour, minute, and second to the `DATE_PART()` function:


```
SELECT date_part('hour',TIMESTAMP '2017-03-18 10:20:30') h,
       date_part('minute',TIMESTAMP '2017-03-18 10:20:30') m,
       date_part('second',TIMESTAMP '2017-03-18 10:20:30') s;
```
Output:


```
 h  | m  | s
----+----+----
 10 | 20 | 30
(1 row)
```

### 10\) Extracting hour, minute, and second from a timestamp

To extract the day of the week and or day of the year from a time stamp, you use the `dow` and `doy` arguments:


```sql
SELECT date_part('dow',TIMESTAMP '2017-03-18 10:20:30') dow,
       date_part('doy',TIMESTAMP '2017-03-18 10:20:30') doy;
```
Output:


```
 dow | doy
-----+-----
   6 |  77
(1 row)
```

## Summary

* Use the PostgreSQL `DATE_PART()` function to extract a subfield of a timestamp.

