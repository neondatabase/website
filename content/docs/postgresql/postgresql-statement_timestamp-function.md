---
title: 'PostgreSQL STATEMENT_TIMESTAMP() Function'
redirectFrom:
            - /docs/postgresql/postgresql-statement_timestamp 
            - /docs/postgresql/postgresql-date-functions/postgresql-statement_timestamp
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `STATEMENT_TIMESTAMP()` function to retrieve the start time of the current statement.

## Introduction to the PostgreSQL STATEMENT_TIMESTAMP() function

The `STATEMENT_TIMESTAMP()` function returns the start time of the current statement.

Here's the syntax of the `STATEMENT_TIMESTAMP()` function:

```
STATEMENT_TIMESTAMP()
```

The `STATEMENT_TIMESTAMP()` function doesn't accept any argument. It returns a value of the type `TIMESTAMP WITH TIME ZONE`, representing a [timestamp](/docs/postgresql/postgresql-timestamp) at the start of the current statement.

## PostgreSQL STATEMENT_TIMESTAMP() function examples

Let's take some examples of using the `STATEMENT_TIMESTAMP()` function.

### 1) Basic statement_timestamp() function example

The following statement uses the `STATEMENT_TIMESTAMP()` function to retrieve the start time of the current statement:

```
SELECT STATEMENT_TIMESTAMP();
```

Output:

```
      statement_timestamp
-------------------------------
 2024-03-20 11:30:47.001021-07
(1 row)
```

The output indicates that the `STATEMENT_TIMESTAMP()` function returns a timestamp with a time zone of the start time when the statement is executed.

### 2) Using the statement_timestamp() within a transaction

The following example calls the `STATEMENT_TIMESTAMP()` function within a transaction multiple times and log the result into a table:

```
-- create a new table for logging
CREATE TABLE logs(
   id SERIAL PRIMARY KEY,
   started_at TIMESTAMP WITH TIME ZONE
);

-- start a transaction
BEGIN;

INSERT INTO logs(started_at) VALUES(statement_timestamp());
SELECT pg_sleep(3);

INSERT INTO logs(started_at) VALUES(statement_timestamp());
SELECT pg_sleep(3);

INSERT INTO logs(started_at) VALUES(statement_timestamp());
END;

-- retrieve data from the logs table
SELECT * FROM logs;
```

Output:

```
 id |          started_at
----+-------------------------------
  1 | 2024-03-20 13:22:13.056783+07
  2 | 2024-03-20 13:22:16.228492+07
  3 | 2024-03-20 13:22:19.390211+07
(3 rows)
```

In this example, we use the `pg_sleep()` function to delay the execution of each [INSERT](/docs/postgresql/postgresql-insert) statement.

Since we invoke the `STATEMENT_TIMESTAMP()` function in its own SQL statement, it returns a timestamp differently with each call.

Notice that the `STATEMENT_TIMESTAMP()` function is unlike the `TRANSACTION_TIMESTAMP()` function which does not change with each statement. The `TRANSACTION_TIMESTAMP()` will return the same start time of the transaction.

### 3) Call the statement_timestamp() function multiple times within a statement

The following example calls the `STATEMENT_TIMESTAMP()` function multiple times within a single statement:

```
SELECT
  statement_timestamp(),
  pg_sleep(3),
  statement_timestamp(),
  pg_sleep(3),
  statement_timestamp();
```

Output:

```
-[ RECORD 1 ]-------+------------------------------
statement_timestamp | 2024-03-20 13:52:55.861004-07
pg_sleep            |
statement_timestamp | 2024-03-20 13:52:55.861004-07
pg_sleep            |
statement_timestamp | 2024-03-20 13:52:55.861004-07
```

Note that to display vertical results in psql, you execute the \\x command first.

In this example, the `STATEMENT_TIMESTAMP()` function returns the same values for all three calls, even though we call the `pg_sleep()` to delay execution between each call.

It is important to notice that this behavior contrasts with the `CLOCK_TIMESTAMP()` function, which continues to change as it progresses through the statement.

## Summary

- Use the `STATEMENT_TIMESTAMP()` function to retrieve the start time of the current statement.
