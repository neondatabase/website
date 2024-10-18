---
title: 'PostgreSQL AT TIME ZONE Operator'
redirectFrom: 
            - /docs/postgresql/postgresql-date-functions/postgresql-at-time-zone/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `AT TIME ZONE` operator to convert a timestamp or a timestamp with time zone to a different time zone.





## Introduction to the PostgreSQL AT TIME ZONE operator





In PostgreSQL, the `AT TIME ZONE` is an operator that allows you to convert a [timestamp](/docs/postgresql/postgresql-timestamp) or a timestamp with time zone to a different time zone.





The `AT TIME ZONE` operator can be useful when you want to perform timezone conversions within your SQL queries.





Here's the syntax of the `AT TIME ZONE` operator:





```
timestamp_expression AT TIME ZONE target_timezone
```





In this syntax:





- 
- timestamp_expression is a timestamp or timestamp with time zone value that you want to convert.
- 
-
- 
- target_timezone is the target time zone to which you want to convert. This can be either a time zone name or an expression that evaluates to a time zone name.
- 





The `AT TIME ZONE` operator always returns a value of type `TIMESTAMP WITH TIME ZONE`.





## PostgreSQL AT TIME ZONE operator examples





Let's explore some examples of using the `AT TIME ZONE` operator. It is assumed that the server's time zone is `'America/Los_Angeles'`.





If you want to have consistent results like the following examples, you can set the PostgreSQL server's timezone to `'America/Los_Angeles'` by executing the following statement in any PostgreSQL client (such as pgAdmin or psql):





```
set timezone to 'America/Los_Angeles'
```





Once you execute the command, you can verify it by showing the current timezone:





```
show timezone;
```





Output:





```
      TimeZone
---------------------
 America/Los_Angeles
(1 row)
```





### 1) Basic AT TIME ZONE operator example





The following example uses the `AT TIME ZONE` operator to convert a timestamp to Coordinated Universal time (UTC):





```
SELECT TIMESTAMP '2024-03-21 10:00:00' AT TIME ZONE 'UTC';
```





Output:





```
        timezone
------------------------
 2024-03-21 03:00:00-07
(1 row)
```





### 2) Converting timestamp with time zone





The following example uses the `AT TIME ZONE` operator to convert a timestamp with time zone to UTC:





```
SELECT TIMESTAMP WITH TIME ZONE '2024-03-21 10:00:00-04' AT TIME ZONE 'UTC';
```





Output:





```
      timezone
---------------------
 2024-03-21 14:00:00
(1 row)
```





### 3) Using the AT TIME ZONE operator with time zone abbreviation





The following query uses the `AT TIME ZONE` operator to convert a timestamp to Pacific Standard Time (PST) from the default time zone:





```
SELECT TIMESTAMP '2024-03-21 10:00:00' AT TIME ZONE 'PST';
```





Output:





```
        timezone
------------------------
 2024-03-21 11:00:00-07
(1 row)
```





### 4) Converting a timestamp using a time zone offset





The following example uses the `AT TIME ZONE` operator to convert a timestamp using a time zone offset:





```
SELECT TIMESTAMP '2024-03-21 10:00:00' AT TIME ZONE '-08:00';
```





Output:





```
        timezone
------------------------
 2024-03-20 19:00:00-07
(1 row)
```





### 5) Converting a timestamp using named time zones





The following example uses the `AT TIME ZONE` operator to convert a timestamp using a named time zone:





```
SELECT TIMESTAMP '2024-03-21 10:00:00' AT TIME ZONE 'America/New_York';
```





Output:





```
        timezone
------------------------
 2024-03-21 07:00:00-07
(1 row)
```





Please note that PostgreSQL uses the [IANA time zone database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) for time zone information.





## Summary





- 
- Use the `AT TIME ZONE` operator to convert a timestamp to a different time zone.
- 


