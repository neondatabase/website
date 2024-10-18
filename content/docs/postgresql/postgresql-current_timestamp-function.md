---
title: 'PostgreSQL CURRENT_TIMESTAMP Function'
redirectFrom: 
            - /docs/postgresql/postgresql-date-functions/postgresql-current_timestamp/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `CURRENT_TIMESTAMP()` function to get the current date and time with the timezone.



## Introduction to PostgreSQL CURRENT_TIMESTAMP() function



The `CURRENT_TIMESTAMP` function returns the current date and time with the timezone.



Here's the basic syntax of the PostgreSQL `CURRENT_TIMESTAMP()` function:



```
CURRENT_TIMESTAMP(precision)
```



The PostgreSQL `CURRENT_TIMESTAMP()` function accepts one optional argument:



- `precision`: specifies the number of digits in the fractional seconds precision in the second field of the result.
- 


If you omit the `precision` argument, the `CURRENT_TIMESTAMP()` function will return a `TIMESTAMP` with a timezone that includes the full fractional seconds precision available.



The `CURRENT_TIMESTAMP()` function returns a [`TIMESTAMP WITH TIME ZONE`](/docs/postgresql/postgresql-timestamp) representing the date and time at which the transaction started.



## PostgreSQL CURRENT_TIMESTAMP function examples



Let's explore some examples of using the `CURRENT_TIMESTSAMP` function.



### 1) Basic CURRENT_TIMESTSAMP function example



The following example shows how to use the `CURRENT_TIMESTAMP()` function to get the current date and time:



```
SELECT CURRENT_TIMESTAMP;
```



The result is:



```
              now
-------------------------------
 2017-08-15 21:05:15.723336-07
(1 row)
```



Internally, the `CURRENT_TIMESTAMP()` is implemented with the `NOW()` function, therefore, the column alias is `NOW`.



Like the `NOW()` function, the `CURRENT_TIMESTAMP()` function can be used as the default value of a timestamp column.



### 2) Using the PostgreSQL CURRENT_TIMESTSAMP function as the default value of a column



First, [create a table](/docs/postgresql/postgresql-create-table) called `note`:



```
CREATE TABLE note (
    id SERIAL PRIMARY KEY,
    message VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```



The default value of the `created_at` column is provided by the result of the `CURRENT_TIMESTAMP()` function.



Second, [insert a new row](/docs/postgresql/postgresql-insert) into the `note` table:



```
INSERT INTO note(message)
VALUES('Testing current_timestamp function');
```



In this statement, we don't specify the value of the `created_at` column. Therefore, it takes the result of the `CURRENT_TIMESTAMP` at which the transaction started.



Third, verify the insert:



```
SELECT * FROM note;
```



The following picture illustrates the result:



```
 id |              message               |          created_at
----+------------------------------------+-------------------------------
  1 | Testing current_timestamp function | 2024-01-26 15:47:44.199212-07
(1 row)
```



The output indicates that the `created_at` column is populated by the date and time at which the statement was executed.



In PostgreSQL, the `TRANSACTION_TIMESTAMP()` function is synonymous with the `CURRENT_TIMESTAMP` function. However, the name of the function `TRANSACTION_TIMESTAMP` more explicitly conveys the meaning of the return value.



## Summary



- Use the PostgreSQL `CURRENT_TIMESTAMP()` to get the date and time at which the transaction starts.
- 
