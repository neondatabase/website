---
title: "PostgreSQL Uptime"
page_title: "PostgreSQL Uptime"
page_description: "In this tutorial, you will learn how to calculate the PostgreSQL uptime based on the current time and the server's started time."
prev_url: "https://www.postgresqltutorial.com/postgresql-administration/postgresql-uptime/"
ogImage: ""
updatedOn: "2024-02-20T06:03:34+00:00"
enableTableOfContents: true
prev_page: 
  title: "PostgreSQL Password File .pgpass"
  slug: "postgresql-administration/postgresql-password-file-pgpass"
next_page: 
  title: "How to Check PostgreSQL Version"
  slug: "postgresql-administration/postgresql-version"
---




**Summary**: in this tutorial, you will learn how to calculate the PostgreSQL uptime based on the current time and the server’s started time.


## Checking PostgreSQL uptime

First, open the Command Prompt on Windows or Terminal on Unix\-like systems and connect to the PostgreSQL server:


```csssql
psql -U postgres
```
Second, execute the following query to get the PostgreSQL uptime:


```
SELECT 
  date_trunc(
    'second', 
    current_timestamp - pg_postmaster_start_time()
  ) as uptime;
```
How it works

PostgreSQL stores the time when it was started in the database server. To retrieve the start time, you use the `pg_postmaster_start_time()` function as follows:


```sql
SELECT pg_postmaster_start_time();
```
Output:


```sql
   pg_postmaster_start_time
-------------------------------
 2024-02-14 03:41:32.048451-07
(1 row)
```
You can then calculate the uptime based on the current time and the start time returned by the `pg_postmaster_start_time()` function:


```css
SELECT current_timestamp - pg_postmaster_start_time() uptime;
```
Output:


```sql
         uptime
------------------------
 6 days 07:39:06.006459
(1 row)
```
You can truncate the microsecond from the uptime using the [`DATE_TRUNC()`](../postgresql-date-functions/postgresql-date_trunc) function to make the output more human\-readable:


```css
SELECT 
  date_trunc(
    'second', 
    current_timestamp - pg_postmaster_start_time()
  ) as uptime;
```
Output:


```
     uptime
-----------------
 6 days 07:39:24
(1 row)
```

## Summary

* Calculate the PostgreSQL uptime using the current time and start time.

