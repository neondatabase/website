---
title: 'PostgreSQL DATE_PART() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-date_part/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `DATE_PART()` function to retrieve the subfields such as year, month, and week from a [date](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-date/) or [time](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-time/) value.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL DATE_PART() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `DATE_PART()` function allows you to extract a subfield from a date or time value.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following illustrates the basic syntax for the `DATE_PART()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
DATE_PART(field, source)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `DATE_PART()` function has two optional parameters `field` and `source`. The `field` is an identifier that determines what to extract from the `source`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The values of the field must be one of the following permitted values:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- century
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- decade
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- year
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- month
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- day
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- hour
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- minute
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- second
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- microseconds
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- milliseconds
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- dow
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- doy
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- epoch
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- isodow
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- isoyear
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- timezone
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- timezone_hour
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- timezone_minute
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The `source` is a temporal expression that evaluates to [`TIMESTAMP`](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-timestamp/), [`TIME`](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-time/), or [`INTERVAL`](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-interval/). If the `source` evaluates to `DATE`, the function will be cast to `TIMESTAMP`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `DATE_PART()` function returns a value whose type is double precision.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL DATE_PART() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's explore some examples of using the `DATE_PART()` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic PostgreSQL DATE_PART() function example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `DATE_PART()` function to extract the century from a timestamp:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT date_part('century',TIMESTAMP '2017-01-01');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 date_part
-----------
        21
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Extracting the year from a timestamp

<!-- /wp:heading -->

<!-- wp:paragraph -->

To extract the year from the same timestamp, you pass the year to the `field` argument:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT date_part('year',TIMESTAMP '2017-01-01');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 date_part
-----------
      2017
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 3) Extracting the quarter from a timestamp

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `DATE_PART()` function to extract the quarter from a timestamp:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT date_part('quarter',TIMESTAMP '2017-01-01');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 date_part
-----------
         1
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 4) Extracting month from a timestamp

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `DATE_PART()` function to extract the month from a timestamp:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT date_part('month',TIMESTAMP '2017-09-30');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 date_part
-----------
         9
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 5) Extracting a decade from a timestamp

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `DATE_PART()` function to extract the decade from a timestamp:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 SELECT date_part('decade',TIMESTAMP '2017-09-30');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 date_part
-----------
       201
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 6) Extracting a week number from a timestamp

<!-- /wp:heading -->

<!-- wp:paragraph -->

To extract the week number from a time stamp, you pass the week as the first argument:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT date_part('week',TIMESTAMP '2017-09-30');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 date_part
-----------
        39
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 7) Extracting a week number from a timestamp

<!-- /wp:heading -->

<!-- wp:paragraph -->

To get the current millennium, you use the `DATE_PART()` function with the [`NOW()`](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-now/) function as follows:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT date_part('millennium',now());
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 date_part
-----------
         3
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 8) Extracting day from a timestamp

<!-- /wp:heading -->

<!-- wp:paragraph -->

To extract the day part from a timestamp, you pass the `day` string to the `DATE_PART()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT date_part('day',TIMESTAMP '2017-03-18 10:20:30');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 date_part
-----------
        18
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 9) Extracting hour, minute, and second from a timestamp

<!-- /wp:heading -->

<!-- wp:paragraph -->

To extract the hour, minute, and second, from a time stamp, you pass the corresponding value hour, minute, and second to the `DATE_PART()` function:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT date_part('hour',TIMESTAMP '2017-03-18 10:20:30') h,
       date_part('minute',TIMESTAMP '2017-03-18 10:20:30') m,
       date_part('second',TIMESTAMP '2017-03-18 10:20:30') s;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 h  | m  | s
----+----+----
 10 | 20 | 30
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 10) Extracting hour, minute, and second from a timestamp

<!-- /wp:heading -->

<!-- wp:paragraph -->

To extract the day of the week and or day of the year from a time stamp, you use the `dow` and `doy` arguments:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT date_part('dow',TIMESTAMP '2017-03-18 10:20:30') dow,
       date_part('doy',TIMESTAMP '2017-03-18 10:20:30') doy;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 dow | doy
-----+-----
   6 |  77
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `DATE_PART()` function to extract a subfield of a timestamp.
- <!-- /wp:list-item -->

<!-- /wp:list -->
