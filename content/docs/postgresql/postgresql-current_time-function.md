---
title: 'PostgreSQL CURRENT_TIME Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-current_time/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `CURRENT_TIME` function to get the current time with the timezone.





## Introduction to the PostgreSQL CURRENT_TIME function





The following illustrates the syntax of the `CURRENT_TIME` function:





```
CURRENT_TIME(precision)
```





The `CURRENT_TIME` function accepts one optional argument `precision`.





The `precision` specifies the returned fractional seconds precision. If you omit the `precision` argument, the result will include the full available precision.





The `CURRENT_TIME` function returns a `TIME WITH TIME ZONE` value that represents the current time with the timezone.





## PostgreSQL CURRENT_TIME function examples





Let's explore some examples of using the `CURRENT_TIME` function.





### 1) Basic PostgreSQL CURRENT_TIME function example





The following example uses the CURRENT_TIME function to get the current time with the timezone:





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





In this example, we don't specify the precision argument. Therefore, the result includes the full precision available.





### 2) Using the PostgreSQL CURRENT_TIME function with a precision example





The following example shows how to use the `CURRENT_TIME` function with the precision set to 2:





```
SELECT CURRENT_TIME(2);
```





Output:





```
  current_time
----------------
 14:44:35.03-07
(1 row)
```





### 3) Using the CURRENT_TIME function as the default value of a column





The `CURRENT_TIME` function can be used as the default value of `TIME` columns. For example:





First, [create a table](/docs/postgresql/postgresql-create-table) called `log`:





```
CREATE TABLE log (
    id SERIAL PRIMARY KEY,
    message VARCHAR(255) NOT NULL,
    created_at TIME DEFAULT CURRENT_TIME,
    created_on DATE DEFAULT CURRENT_DATE
);
```





The `log` table has the `created_at` column with the default value is the result of the `CURRENT_TIME` function.





Second, [insert a row](/docs/postgresql/postgresql-insert) into the `log` table:





```
INSERT INTO log( message )
VALUES('Testing the CURRENT_TIME function');
```





In the statement, we only specify a value for the `message` column. Therefore, other columns will take the default values.





Third, check whether the row was inserted into the `log` table with the `created_at` column populated correctly by using the following [query](/docs/postgresql/postgresql-select):





```
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





- 
- Use the PostgreSQL `CURRENT_TIME` function to get the current time with the default timezone.
- 


