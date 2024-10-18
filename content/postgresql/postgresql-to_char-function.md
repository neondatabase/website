---
title: 'PostgreSQL TO_CHAR() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-to_char/
ogImage: ./img/wp-content-uploads-2013-05-payment-table.png
tableOfContents: true
---


The PostgreSQL `TO_CHAR()` function converts a [timestamp](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-timestamp/), an [interval](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-interval/), an [integer](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-integer/), a double-precision, or a [numeric ](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-numeric/)value to a [string](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-char-varchar-text/).





## Syntax





The following illustrates the syntax of the PostgreSQL `TO_CHAR()` function:





```
TO_CHAR(expression, format)
```





## Arguments





The PostgreSQL `TO_CHAR()` function requires two arguments:





### 1) expression





The expression can be a timestamp, an interval, an integer, a double-precision, or a numeric value that is converted to a string according to a specific format.





### 2) format





The format for the result string.





The following table illustrates the valid numeric format strings:





| Format     | Description                                                              |
| ---------- | ------------------------------------------------------------------------ |
| 9          | Numeric value with the specified number of digits                        |
| 0          | Numeric value with leading zeros                                         |
| . (period) | decimal point                                                            |
| D          | decimal point that uses the locale                                       |
| , (comma)  | group (thousand) separator                                               |
| FM         | Fill mode, which suppresses padding blanks and leading zeroes.           |
| PR         | Negative value in angle brackets.                                        |
| S          | Sign anchored to a number that uses locale                               |
| L          | Currency symbol that uses locale                                         |
| G          | Group separator that uses locale                                         |
| MI         | Minus sign in the specified position for numbers that are less than 0.   |
| PL         | Plus sign in the specified position for numbers that are greater than 0. |
| SG         | Plus / minus sign in the specified position                              |
| RN         | Roman numeral that ranges from 1 to 3999                                 |
| TH or th   | Upper case or lower case ordinal number suffix                           |





The following table shows the valid timestamp format strings:





|                          |                                                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------------ |
| **Pattern**              | **Description**                                                                                  |
| Y,YYY                    | year in 4 digits with comma                                                                      |
| YYYY                     | year in 4 digits                                                                                 |
| YYY                      | The last 3 digits of ISO 8601 week-numbering year                                                |
| YY                       | last 3 digits of the year                                                                        |
| Y                        | last 2 digits of the year                                                                        |
| IYYY                     | ISO 8601 week-numbering year (4 or more digits)                                                  |
| IYY                      | The last 2 digits of ISO 8601 week-numbering year                                                |
| IY                       | The last digit of ISO 8601 week-numbering year                                                   |
| I                        | Abbreviated lowercase month name e.g., Jan, feb, etc.                                            |
| BC, bc, AD or ad         | Era indicator without periods                                                                    |
| B.C., b.c., A.D. ora.d.  | Era indicator with periods                                                                       |
| MONTH                    | English month name in uppercase                                                                  |
| Month                    | Full capitalized English month name                                                              |
| month                    | Full lowercase English month name                                                                |
| MON                      | Abbreviated uppercase month name e.g., JAN, FEB, etc.                                            |
| Mon                      | Week number of the year (1-53) (the first week starts on the first day of the year)              |
| mon                      | Abbreviated capitalized month name e.g., Jan, Feb, etc.                                          |
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
| WW                       | Century e.g., 21, 22, etc.                                                                       |
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
| MS                       | Millisecond (000-999)                                                                            |
| US                       | Microsecond (000000-999999)                                                                      |
| SSSS                     | Seconds past midnight (0-86399)                                                                  |
| AM, am, PM or pm         | Meridiem indicator (without periods)                                                             |
| A.M., a.m., P.M. or p.m. | Meridiem indicator (with periods)                                                                |





## Return value





The `TO_CHAR()` function returns a string in `TEXT` data type that represents the first argument formatted according to the specified format.





## Examples





We will use the `payment` table in the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/) for the demonstration.





![payment table](./img/wp-content-uploads-2013-05-payment-table.png)





### 1) Converting a timestamp to a string example





The following statement uses the `TO_CHAR()` function to format the payment date that consists of hours, minutes, and seconds:





```
SELECT
    payment_date,
    TO_CHAR(
        payment_date,
        'HH12:MI:SS'
    ) payment_time
FROM
    payment
ORDER BY
    payment_date;
```





Here is the result:





![PostgreSQL TO_CHAR Function - format timestamp example](./img/wp-content-uploads-2017-08-PostgreSQL-TO_CHAR-Function-format-timestamp-example.png)





### 2) Converting an entire timestamp value into a different format example





The following example converts the payment date into a different format:





```
SELECT
    payment_id,
    payment_date,
    TO_CHAR(
        payment_date,
        'MON-DD-YYYY HH12:MIPM'
    ) payment_time
FROM
    payment
ORDER BY
    payment_date;
```





The output is:





![](./img/wp-content-uploads-2017-08-PostgreSQL-TO_CHAR-Function-format-payment-date-example.png)





### 3) Converting a timestamp literal to a string example





The following statement converts a timestamp literal to a string:





```
SELECT
    TO_CHAR(
        TIMESTAMP '2017-08-18 22:30:59',
        'HH24:MI:SS'
    );
```





The result is:





```
22:30:59
```





### 4) Adding currency symbol to the amount example





The following example adds US dollar to the paid amounts:





```
SELECT
    payment_id,
    amount,
    TO_CHAR(
        amount,
        'l99999D99'
    ) amount_format
FROM
    payment
ORDER BY
    payment_date;
```





The following picture illustrates the output:





![PostgreSQL TO_CHAR Function - add currency symbol example](./img/wp-content-uploads-2017-08-PostgreSQL-TO_CHAR-Function-add-currency-symbol-example.png)





### 5) Converting an integer to a string example





The following example converts an integer to a string:





```
SELECT
    TO_CHAR(
        2017,
        '9,999'
    );
```





Result





```
  2,017
```





### 6) Putting it all together example





The following example converts a numeric and timestamp to a string:





```
SELECT
    first_name || ' ' || last_name
    || ' paid ' ||
    TO_CHAR(
        amount,
        'l99D99'
    )
    || ' at ' ||
    TO_CHAR(
        payment_date,
        'HH24:MI:SS'
    )
    || ' on ' ||
    TO_CHAR(
        payment_date,
        'Mon-DD-YYYY'
    ) payment_info
FROM
    payment
INNER JOIN customer USING(customer_id)
ORDER BY
    rental_id;
```





The result is





![PostgreSQL TO_CHAR Function - example](./img/wp-content-uploads-2017-08-PostgreSQL-TO_CHAR-Function-example.png)





Summary





- 
- Use the PostgreSQL `TO_CHAR()` function to convert a timestamp or a numeric value to a string.
- 


