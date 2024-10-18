---
title: 'PostgreSQL TO_DATE() Function'
redirectFrom: 
            - /docs/postgresql/postgresql-date-functions/postgresql-to_date/
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `TO_DATE()` function to convert a string to a date.





## Introduction to the PostgreSQL TO_DATE() function





The `TO_DATE()` function converts a [string](/docs/postgresql/postgresql-char-varchar-text/) literal to a [date](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-date) value.





Here's the basic syntax of the `TO_DATE()` function:





```
TO_DATE(text,format);
```





The `TO_DATE()` function accepts two string arguments.





- 
- `text`: is an input string that you want to convert to a date.
- 
-
- 
- `format`: specifies the format of the input string.
- 





The `TO_DATE()` function returns a `DATE` value.





See the following example:





```
SELECT TO_DATE('20170103','YYYYMMDD');
```





Output:





```
  TO_DATE
------------
 2017-01-03
```





In this example, the string `20170103` is converted into a date based on the input format `YYYYMMDD`.





- 
- `YYYY`: year in four digits format.
- 
-
- 
- `MM`: month in two digits format.
- 
-
- 
- `DD`: day in two digits format.
- 





As a result, the function returns `January 3rd 2017`.





The following table illustrates the template patterns for formatting date values:





|                         |                                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------------------ |
| **Pattern**             | **Description**                                                                                  |
| Y,YYY                   | year in 4 digits with comma                                                                      |
| YYYY                    | year in 4 digits                                                                                 |
| YYY                     | last 2 digits of the year                                                                        |
| YY                      | The last digit of the year                                                                       |
| Y                       | The last 3 digits of ISO 8601 week-numbering year                                                |
| IYYY                    | ISO 8601 week-numbering year (4 or more digits)                                                  |
| IYY                     | The last 2 digits of ISO 8601 week-numbering year                                                |
| IY                      | The last digit of ISO 8601 week-numbering year                                                   |
| I                       | Abbreviated capitalized month name e.g., Jan, Feb, etc.                                          |
| BC, bc, AD or ad        | Era indicator without periods                                                                    |
| B.C., b.c., A.D. ora.d. | Era indicator with periods                                                                       |
| MONTH                   | English month name in uppercase                                                                  |
| Month                   | Full capitalized English month name                                                              |
| month                   | Full lowercase English month name                                                                |
| MON                     | Abbreviated uppercase month name e.g., JAN, FEB, etc.                                            |
| Mon                     | Week number of the year (1-53) (the first week starts on the first day of the year)              |
| mon                     | Abbreviated lowercase month name e.g., Jan, Feb, etc.                                            |
| MM                      | month number from 01 to 12                                                                       |
| DAY                     | Full uppercase day name                                                                          |
| Day                     | Full capitalized day name                                                                        |
| day                     | Full lowercase day name                                                                          |
| DY                      | Abbreviated uppercase day name                                                                   |
| Dy                      | Abbreviated capitalized day name                                                                 |
| dy                      | Abbreviated lowercase day name                                                                   |
| DDD                     | Day of year (001-366)                                                                            |
| IDDD                    | Day of ISO 8601 week-numbering year (001-371; day 1 of the year is Monday of the first ISO week) |
| DD                      | Day of month (01-31)                                                                             |
| D                       | Day of the week, Sunday (1) to Saturday (7)                                                      |
| ID                      | ISO 8601 day of the week, Monday (1) to Sunday (7)                                               |
| W                       | Week of month (1-5) (the first week starts on the first day of the month)                        |
| WW                      | Century e.g., 21, 22, etc.                                                                       |
| IW                      | Week number of ISO 8601 week-numbering year (01-53; the first Thursday of the year is in week 1) |
| CC                      | Century e.g, 21, 22, etc.                                                                        |
| J                       | Julian Day (integer days since November 24, 4714 BC at midnight UTC)                             |
| RM                      | Month in uppercase Roman numerals (I-XII; I=January)                                             |
| rm                      | Month in lowercase Roman numerals (i-xii; i=January)                                             |





## PostgreSQL TO_DATE function examples





The following statement converts the string `10 Feb 2017` into a date value:





```
SELECT TO_DATE('10 Feb 2017', 'DD Mon YYYY');
```





The output is:





```
  TO_DATE
------------
 2017-02-10
(1 row)
```





Suppose you want to convert the string `2017 Feb 10` to a date value, you can apply the pattern `YYYY Mon DD` as follows:





```
SELECT TO_DATE('2017 Feb 20','YYYY Mon DD');
```





The function returns the following output:





```
  TO_DATE
------------
 2017-02-20
(1 row)
```





## PostgreSQL TO_DATE() function gotchas





If you pass an invalid date string, the `TO_DATE()` function will try to convert it to a valid date and issue an error if it cannot. For example:





```
SELECT TO_DATE('2017/02/30', 'YYYY/MM/DD');
```





PostgreSQL issued the following error:





```
ERROR:  date/time field value out of range: "2017/02/30"
LINE 1: SELECT '2017/02/30'::date;
```





## Summary





- 
- Use the PostgreSQL `TO_DATE()` function to convert a string literal to a date value.
- 


