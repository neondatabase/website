---
title: 'PostgreSQL TO_TIMESTAMP Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-to_timestamp/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `TO_TIMESTAMP()` function to convert a string to a timestamp based on a specified format

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The PostgreSQL `TO_TIMESTAMP()` function converts a string to a [timestamp](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-timestamp/) according to the specified format.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Syntax

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following illustrates the syntax of `TO_TIMESTAMP()` function:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
TO_TIMESTAMP(timestamp, format)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Arguments

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `TO_TIMESTAMP()` function requires two arguments:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

**1) `timestamp`**

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `timestamp` is a string that represents a timestamp value in the format specified by `format`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

**2) `format`**

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The format for `timestamp` argument.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To construct `format` strings, you use the following template patterns for formatting date and time values.

<!-- /wp:paragraph -->

<!-- wp:table -->

|                          |                                                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------------ |
| **Pattern**              | **Description**                                                                                  |
| Y,YYY                    | year in 4 digits with comma                                                                      |
| YYYY                     | year in 4 digits                                                                                 |
| YYY                      | last 3 digits of the year                                                                        |
| YY                       | last 2 digits of the year                                                                        |
| Y                        | The last digit of the year                                                                       |
| IYYY                     | ISO 8601 week-numbering year (4 or more digits)                                                  |
| IYY                      | The last 3 digits of ISO 8601 week-numbering year                                                |
| IY                       | The last 2 digits of ISO 8601 week-numbering year                                                |
| I                        | The last digit of ISO 8601 week-numbering year                                                   |
| BC, bc, AD or ad         | Abbreviated capitalized month name e.g., Jan, Feb, etc.                                          |
| B.C., b.c., A.D. ora.d.  | Era indicator with periods                                                                       |
| MONTH                    | English month name in uppercase                                                                  |
| Month                    | Full capitalized English month name                                                              |
| month                    | Full lowercase English month name                                                                |
| MON                      | Abbreviated uppercase month name e.g., JAN, FEB, etc.                                            |
| Mon                      | Abbreviated capitalized month name e.g, Jan, Feb, etc.                                           |
| mon                      | Abbreviated lowercase month name e.g., jan, feb, etc.                                            |
| MM                       | month number from 01 to 12                                                                       |
| DAY                      | Full uppercase day name                                                                          |
| Day                      | Full capitalized day name                                                                        |
| day                      | Full lowercase day name                                                                          |
| DY                       | Abbreviated uppercase day name                                                                   |
| Dy                       | Abbreviated capitalized day name                                                                 |
| dy                       | Abbreviated lowercase day name                                                                   |
| DDD                      | Day of year (001-366)                                                                            |
| IDDD                     | Day of ISO 8601 week-numbering year (001-371; day 1 of the year is Monday of the first ISO week) |
| DD                       | Day of month (01-31)                                                                             |
| D                        | Day of the week, Sunday (1) to Saturday (7)                                                      |
| ID                       | ISO 8601 day of the week, Monday (1) to Sunday (7)                                               |
| W                        | Week of month (1-5) (the first week starts on the first day of the month)                        |
| WW                       | Week number of the year (1-53) (the first week starts on the first day of the year)              |
| IW                       | Week number of ISO 8601 week-numbering year (01-53; the first Thursday of the year is in week 1) |
| CC                       | Century e.g, 21, 22, etc.                                                                        |
| J                        | Julian Day (integer days since November 24, 4714 BC at midnight UTC)                             |
| RM                       | Month in upper case Roman numerals (I-XII; >                                                     |
| rm                       | Month in lowercase Roman numerals (i-xii; >                                                      |
| HH                       | Hour of day (0-12)                                                                               |
| HH12                     | Hour of day (0-12)                                                                               |
| HH24                     | Hour of day (0-23)                                                                               |
| MI                       | Minute (0-59)                                                                                    |
| SS                       | Second (0-59)                                                                                    |
| MS                       | Millisecond (000-9999)                                                                           |
| US                       | Microsecond (000000-999999)                                                                      |
| SSSS                     | Seconds past midnight (0-86399)                                                                  |
| AM, am, PM or pm         | Meridiem indicator (without periods)                                                             |
| A.M., a.m., P.M. or p.m. | Meridiem indicator (with periods)                                                                |

<!-- /wp:table -->

<!-- wp:heading -->

## Return Value

<!-- /wp:heading -->

<!-- wp:paragraph -->

The PostgreSQL `TO_TIMESTAMP()` function returns a timestamp with the time zone.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following statement uses the `TO_TIMESTAMP()` function to convert a string to a timestamp:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT TO_TIMESTAMP(
    '2017-03-31 9:30:20',
    'YYYY-MM-DD HH:MI:SS'
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
      to_timestamp
------------------------
 2017-03-31 09:30:20-07
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this example:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- YYYY is the four-digit year 2017
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- MM is the month 03
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- DD is the day 31
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- HH is the hour 9
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- MI is the minute 30
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- SS is the second 20
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:heading -->

## Remarks

<!-- /wp:heading -->

<!-- wp:paragraph -->

1. The `TO_TIMESTAMP()` function skips spaces in the input string unless the fixed format global option (`FX` prefix) is used.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

This example uses multiple spaces in the input string:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
    TO_TIMESTAMP('2017     Aug','YYYY MON');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `TO_TIMESTAMP()` function just omits the spaces and returns the correct timestamp value:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
      to_timestamp
------------------------
 2017-08-01 00:00:00-07
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

However, the following example returns an error:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
    TO_TIMESTAMP('2017     Aug','FXYYYY MON');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
ERROR:  invalid value "" for "MON"
DETAIL:  The given value did not match any of the allowed values for this field.
SQL state: 22007
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Because the `FX` option instructs the `TO_TIMESTAMP()` to accept the input string with one space only.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

2. The `TO_TIMESTAMP()` function validates the input string with minimal error checking. It will try to convert the input string to a valid timestamp as much as possible that sometimes yields unexpected results.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following example uses an invalid timestamp value:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
    TO_TIMESTAMP('2017-02-31 30:8:00', 'YYYY-MM-DD HH24:MI:SS');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

It returns an error:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
ERROR:  date/time field value out of range: "2017-02-31 30:8:00"
SQL state: 22008
```

<!-- /wp:code -->

<!-- wp:paragraph -->

3. When converting a string to a timestamp, the `TO_TIMESTAMP()` function treats milliseconds or microseconds as seconds after the decimal point.

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
    TO_TIMESTAMP('01-01-2017 10:2', 'DD-MM-YYYY SS:MS');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The result is:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
to_timestamp
--------------------------
 2017-01-01 00:00:10.2-07
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this example, 2 is not 2 milliseconds but 200. It means that:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
        TO_TIMESTAMP('01-01-2017 10:2', 'DD-MM-YYYY SS:MS');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

and

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
        TO_TIMESTAMP('01-01-2017 10:200', 'DD-MM-YYYY SS:MS');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

returns the same result.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
2017-01-01 00:00:10.2-07
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To get 2 milliseconds, you must use `01-01-2017 10:002`. In this case, `002` is interpreted as `0.002` seconds, equivalent to 2 milliseconds.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

4. If the year is less than four digits, the `TO_TIMESTAMP()` will adjust it to the nearest year e.g., 99 becomes 1999, 17 becomes 2017.

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
    TO_TIMESTAMP('12 31 99 12:45', 'MM DD YY HH:MI');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
      to_timestamp
------------------------
 1999-12-31 00:45:00-07
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Consider the following example:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
      TO_TIMESTAMP('12 31 16 12:45', 'MM DD YY HH:MI');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The nearest year of 16 is 2016, therefore, it returns the following result:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
to_timestamp
------------------------
 2016-12-31 00:45:00-07
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this tutorial, you have learned how to use the PostgreSQL `TO_TIMESTAMP()` function to convert a string to a timestamp.

<!-- /wp:paragraph -->
