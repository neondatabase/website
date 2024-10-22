---
title: "PostgreSQL CURRENT_TIME Function"
page_title: "PostgreSQL CURRENT_TIME Function By Examples"
page_description: "This tutorial shows you how to use the PostgreSQL CURRENT_TIME function to get the current time of the database server."
prev_url: "https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-current_time/"
ogImage: ""
updatedOn: "2024-01-26T09:41:35+00:00"
enableTableOfContents: true
prev_page: 
  title: "PostgreSQL CURRENT_DATE Function"
  slug: "postgresql-date-functions/postgresql-current_date"
next_page: 
  title: "PostgreSQL CURRENT_TIMESTAMP Function"
  slug: "postgresql-date-functions/postgresql-current_timestamp"
---




**Summary**: in this tutorial, you will learn how to use the PostgreSQL `CURRENT_TIME` function to get the current time with the timezone.


## Introduction to the PostgreSQL CURRENT\_TIME function

The following illustrates the syntax of the `CURRENT_TIME` function:


```phpsqlsql
CURRENT_TIME(precision)
```
The `CURRENT_TIME` function accepts one optional argument `precision`.

The `precision` specifies the returned fractional seconds precision. If you omit the `precision` argument, the result will include the full available precision.

The `CURRENT_TIME` function returns a [`TIME WITH TIME ZONE`](../postgresql-tutorial/postgresql-time) value that represents the current time with the timezone.


## PostgreSQL CURRENT\_TIME function examples

Let’s explore some examples of using the `CURRENT_TIME` function.


### 1\) Basic PostgreSQL CURRENT\_TIME function example

The following example uses the CURRENT\_TIME function to get the current time with the timezone:


```
SELECT CURRENT_TIME;
```
The output is a `TIME WITH TIME ZONE` value as follows:


```
    current_time
--------------------
 14:42:10.884946-07
(1 row)

```
In this example, we don’t specify the precision argument. Therefore, the result includes the full precision available.


### 2\) Using the PostgreSQL CURRENT\_TIME function with a precision example

The following example shows how to use the `CURRENT_TIME` function with the precision set to 2:


```sql
SELECT CURRENT_TIME(2);
```
Output:


```sql
  current_time
----------------
 14:44:35.03-07
(1 row)
```

### 3\) Using the CURRENT\_TIME function as the default value of a column

The `CURRENT_TIME` function can be used as the default value of `TIME` columns. For example:

First, [create a table](../postgresql-tutorial/postgresql-create-table) called `log`:


```
CREATE TABLE log (
    id SERIAL PRIMARY KEY,
    message VARCHAR(255) NOT NULL,
    created_at TIME DEFAULT CURRENT_TIME,
    created_on DATE DEFAULT CURRENT_DATE
);
```
The `log` table has the `created_at` column with the default value is the result of the `CURRENT_TIME` function.

Second, [insert a row](../postgresql-tutorial/postgresql-insert) into the `log` table:


```
INSERT INTO log( message )
VALUES('Testing the CURRENT_TIME function');
```
In the statement, we only specify a value for the `message` column. Therefore, other columns will take the default values.

Third, check whether the row was inserted into the `log` table with the `created_at` column populated correctly by using the following [query](../postgresql-tutorial/postgresql-select):


```sql
SELECT * FROM log;
```
The following picture shows the result:


```
 id |              message              |   created_at    | created_on
----+-----------------------------------+-----------------+------------
  1 | Testing the CURRENT_TIME function | 14:46:28.188809 | 2024-01-26
(1 row)
```
The output indicates that the `created_at` column is populated with the time at which the `INSERT` statement executed.


## Summary

* Use the PostgreSQL `CURRENT_TIME` function to get the current time with the default timezone.

