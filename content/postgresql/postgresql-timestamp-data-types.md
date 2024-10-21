---
modifiedAt: 2024-01-31 19:32:23
prevPost: postgresql-date-data-type
nextPost: postgresql-interval-data-type
createdAt: 2016-06-23T04:58:51.000Z
title: 'PostgreSQL Timestamp Data Types'
redirectFrom: 
            - /postgresql/postgresql-tutorial/postgresql-timestamp
            - /postgresql/postgresql-timestamp
ogImage: /postgresqltutorial_data/wp-content-uploads-2016-06-PostgreSQL-Timestamp-300x171.jpg
tableOfContents: true
---

**Summary**: in this tutorial, you will learn about the PostgreSQL timestamp data types including `timestamp` and `timestamptz`. You will also learn how to use some handy functions to handle timestamp data effectively.

## Introduction to PostgreSQL timestamp

![PostgreSQL Timestamp](/postgresqltutorial_data/wp-content-uploads-2016-06-PostgreSQL-Timestamp-300x171.jpg)

PostgreSQL provides you with two temporal [data types](/postgresql/postgresql-data-types) for handling timestamps:

- `timestamp`: a timestamp without a timezone one.
- `timestamptz`: timestamp with a timezone.

The `timestamp` datatype allows you to store both [date](/postgresql/postgresql-date) and time. However, it does not have any time zone data. It means that when you change the timezone of your database server, the timestamp value stored in the database will not change automatically.

The `timestamptz` datatype is the timestamp with a timezone. The `timestamptz` data type is a time zone-aware date and time data type.

Internally, PostgreSQL stores the `timestamptz` in UTC value.

- When you insert a value into a `timestamptz` column, PostgreSQL converts the `timestamptz` value into a UTC value and stores the UTC value in the table.
- When you retrieve data from a `timestamptz` column, PostgreSQL converts the UTC value back to the time value of the timezone set by the database server, the user, or the current database connection.

Notice that both `timestamp` and `timestamptz` uses 8 bytes for storing the timestamp values as shown in the following query:

```sql
SELECT
  typname,
  typlen
FROM
  pg_type
WHERE
  typname ~ '^timestamp';
```

Output:

```
   typname   | typlen
-------------+--------
 timestamp   |      8
 timestamptz |      8
(2 rows)
```

It's important to note that PostgreSQL stores `timestamptz` values in the database using UTC values. It does not store any timezone data with the `timestamptz` value.

## PostgreSQL timestamp example

Let's take a look at an example of using the `timestamp` and `timestamptz`to have a better understanding of how PostgreSQL handles them.

First, [create a table](/postgresql/postgresql-create-table) that consists of both `timestamp` the `timestamptz` columns.

```sql
CREATE TABLE timestamp_demo (
    ts TIMESTAMP,
    tstz TIMESTAMPTZ
);
```

Next, set the time zone of the database server to `America/Los_Angeles`.

```sql
SET timezone = 'America/Los_Angeles';
```

By the way, you can see the current time zone using the `SHOW TIMEZONE` command:

```sql
SHOW TIMEZONE;
```

```
      TimeZone
---------------------
 America/Los_Angeles
(1 row)
```

Then, [insert a new row](/postgresql/postgresql-insert)into the `timstamp_demo`table:

```sql
INSERT INTO timestamp_demo (ts, tstz)
VALUES('2016-06-22 19:10:25-07','2016-06-22 19:10:25-07');
```

After that, [query data](/postgresql/postgresql-select) from the `timestamp` and `timestamptz` columns.

```sql
SELECT
   ts, tstz
FROM
   timestamp_demo;
```

```
         ts          |          tstz
---------------------+------------------------
 2016-06-22 19:10:25 | 2016-06-22 19:10:25-07
(1 row)
```

The query returns the same timestamp values as the inserted values.

Finally, change the timezone of the current session to `America/New_York` and query data again.

```sql
SET timezone = 'America/New_York';
```

```sql
SELECT
  ts,
  tstz
FROM
  timestamp_demo;
```

```
         ts          |          tstz
---------------------+------------------------
 2016-06-22 19:10:25 | 2016-06-22 22:10:25-04
(1 row)
```

The value in the `timestamp` column does not change whereas the value in the `timestamptz` column is adjusted to the new time zone of `'America/New_York'`.

Generally, it is a good practice to use the `timestamptz` data type to store the timestamp data.

## PostgreSQL timestamp functions

To handle timestamp data effectively, PostgreSQL provides some handy functions as follows:

### Getting the current time

To get the current timestamp you use the `NOW()` function as follows:

```sql
SELECT NOW();
```

Output:

```
              now
-------------------------------
 2024-01-31 21:01:58.985943-05
(1 row)
```

Alternatively, you can use the `CURRENT_TIMESTAMP` function:

```sql
SELECT CURRENT_TIMESTAMP;
```

Output:

```
       current_timestamp
-------------------------------
 2024-01-31 21:02:04.715486-05
(1 row)
```

To get the current time without a date, you use the `CURRENT_TIME` function:

```sql
SELECT CURRENT_TIME;
```

Output:

```
    current_time
--------------------
 21:02:13.648512-05
(1 row)
```

Note that both `CURRENT_TIMESTAMP` and `CURRENT_TIME` return the current time with the time zone.

To get the time of day in the string format, you use the `timeofday()` function.

```sql
SELECT TIMEOFDAY();
```

```
              timeofday
-------------------------------------
 Wed Jan 31 21:02:20.840159 2024 EST
(1 row)
```

### Convert between timezones

To convert a timestamp to another time zone, you use the `timezone(zone, timestamp)`function.

```sql
SHOW TIMEZONE;
```

```
     TimeZone
------------------
 America/New_York
(1 row)
```

The current timezone is `America/New_York`.

To convert `2016-06-01 00:00` to `America/Los_Angeles` timezone, you use the `timezone()` function as follows:

```sql
SELECT timezone('America/Los_Angeles','2016-06-01 00:00');
```

```
      timezone
---------------------
 2016-05-31 21:00:00
(1 row)
```

Note that we pass the timestamp as a string to the `timezone()` function, PostgreSQL casts it to `timestamptz` implicitly. It is better to cast a timestamp value to the `timestamptz` data type explicitly as the following statement:

```sql
SELECT timezone('America/Los_Angeles','2016-06-01 00:00'::timestamptz);
```

Output:

```
      timezone
---------------------
 2016-05-31 21:00:00
(1 row)
```

## Using default values for timestamp columns

First, create a new table called `department`:

```sql
CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

The default values for the `created_at` and `updated_at` columns are the current timestamp provided by the `CURRENT_TIMESTAMP` function.

Second, insert a new row into the `department` table without specifying the values for the `created_at` and `updated_at` columns:

```sql
INSERT INTO department(name)
VALUES('IT')
RETURNING *;
```

Output:

```
 id | name |          created_at           |          updated_at
----+------+-------------------------------+-------------------------------
  1 | IT   | 2024-01-31 21:25:31.162808-05 | 2024-01-31 21:25:31.162808-05
(1 row)
```

The output indicates that PostgreSQL uses the current time to insert into the `created_at` and `updated_at` columns.

When you update a row in the `department` table, the `updated_at` column will not be updated to the current time automatically.

To update the value in the updated_at column to the time the row is updated, you can create a `BEFORE UPDATE` trigger to change the value in the `updated_at` column.

Note that MySQL offers the `ON UPDATE CURRENT_TIMESTAMP` to automatically update a `TIMESTAMP` column to the current timestamp. PostgreSQL does not support this feature at the moment.

Third, create a `BEFORE UPDATE` trigger to update the `updated_at` column of the `department` table:

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = current_timestamp;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER department_updated_at_trigger
BEFORE UPDATE ON department
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
```

Fourth, update the name of the IT department to ITD without specifying a value for the `updated_at` column:

```sql
UPDATE department
SET name = 'ITD'
WHERE id = 1
RETURNING *;
```

Output:

```
 id | name |          created_at           |          updated_at
----+------+-------------------------------+-------------------------------
  1 | ITD  | 2024-01-31 21:25:31.162808-05 | 2024-01-31 21:25:51.318803-05
(1 row)
```

The output indicates that the value in the `updated_at` column has been updated automatically by the trigger.

## Summary

- Use `timestamp` and `timestamptz` to store timestamp data.
- PostgreSQL stores the `timestamptz` values in the database as UTC values.
