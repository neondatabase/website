---
title: Postgres current_timestamp() function
subtitle: Get the current date and time
enableTableOfContents: true
updatedOn: '2024-03-04T10:00:00.000Z'
---

The Postgres `current_timestamp()` function returns the current date and time with timezone. The `now()` function is an alias.

This function is particularly useful for timestamping database entries, calculating time differences, or implementing time-based business logic. For example, you can use it to record the time a user logs in, or when the status of a purchase order changes. Fetching the current time information can also be used to calculate time-based metrics and schedule periodic tasks.

<CTA />

## Function signature

The `current_timestamp()` function has two forms:

```sql
current_timestamp -> timestamp with timezone
```

This form returns the current timestamp with timezone at the start of the current transaction. Note that there are no parentheses in this form.

```sql
current_timestamp(precision) -> timestamp with timezone
```

- `precision` (optional): An integer specifying the number of fractional digits in the seconds field. It can range from 0 to 6. If omitted, the result has the full available precision.

## Example usage

Let's consider a table called `user_logins` that tracks user login activity. We can use `current_timestamp` to record the exact time a user logs in.

```sql
CREATE TABLE user_logins (
  user_id INT,
  login_time TIMESTAMP WITH TIME ZONE
);
```

This `INSERT` query adds a new login record with the current timestamp.

```sql
INSERT INTO user_logins (user_id, login_time)
VALUES (1, current_timestamp);

SELECT * FROM user_logins;
```

The `SELECT` query retrieves the login record, showing the user ID and the timestamp of the login.

```text
 user_id |          login_time
---------+------------------------------
       1 | 2024-06-25 07:31:32.85829+00
(1 row)
```

We can also specify `current_timestamp` as the default value for a timestamp column when creating the table. For example, consider the query below, where we set up a table to track purchase orders and add some records:

```sql
CREATE TABLE purchase_orders (
  order_id SERIAL PRIMARY KEY,
  order_date TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp
);

INSERT INTO purchase_orders (order_id)
VALUES (1);
INSERT INTO purchase_orders (order_id)
VALUES (2);
```

This query creates a table to store purchase orders, with the `order_date` column set to the current timestamp by default. When inserting new records, the `order_date` column will automatically be populated with the current timestamp.

```sql
SELECT * FROM purchase_orders;
```

This query retrieves all purchase orders, showing the order ID and the timestamp when each order was created.

```text
 order_id |          order_date
----------+-------------------------------
        1 | 2024-06-25 07:39:15.241256+00
        2 | 2024-06-25 07:39:15.307045+00
(2 rows)
```

## Advanced examples

### Use `current_timestamp` to query recent data

We can use `current_timestamp` in a `SELECT` statement to compare with stored timestamps and fetch recent records. For example, to retrieve all login records from the past 6 hours, you can use `current_timestamp` in the `WHERE` clause:

```sql
WITH user_logins(user_id, login_time) AS (
  VALUES
    (1, current_timestamp - INTERVAL '2 hours'),
    (2, current_timestamp - INTERVAL '12 hours'),
    (3, current_timestamp - INTERVAL '23 hours'),
    (4, current_timestamp - INTERVAL '1 day 2 hours'),
    (5, current_timestamp - INTERVAL '30 minutes'),
    (1, current_timestamp - INTERVAL '45 minutes'),
    (2, current_timestamp - INTERVAL '18 hours'),
    (6, current_timestamp - INTERVAL '5 minutes')
)
SELECT
  user_id,
  login_time,
  current_timestamp - login_time AS time_since_login
FROM user_logins
WHERE login_time > current_timestamp - INTERVAL '6 hours';
```

This query retrieves all logins from the past 6 hours and calculates how long ago each login occurred.

```text
 user_id |          login_time           | time_since_login
---------+-------------------------------+------------------
       1 | 2024-06-25 05:48:53.094862+00 | 02:00:00
       5 | 2024-06-25 07:18:53.094862+00 | 00:30:00
       1 | 2024-06-25 07:03:53.094862+00 | 00:45:00
       6 | 2024-06-25 07:43:53.094862+00 | 00:05:00
(4 rows)
```

### Specify timestamp precision for `current_timestamp`

You can specify the precision of the timestamp when needed:

```sql
SELECT
    current_timestamp(3) AS ts_with_milliseconds,
    current_timestamp(6) AS ts_with_microseconds,
    current_timestamp(0) AS ts_without_fraction;
```

This query computes the current timestamp value with different levels of precision: milliseconds, microseconds, and without fractional seconds.

```text
    ts_with_milliseconds    |     ts_with_microseconds      |  ts_without_fraction
----------------------------+-------------------------------+------------------------
 2024-06-25 07:52:14.903+00 | 2024-06-25 07:52:14.903483+00 | 2024-06-25 07:52:15+00
(1 row)
```

### Use `current_timestamp` with triggers

You can use `current_timestamp` in combination with a default value and an update trigger to automatically maintain creation and modification timestamps for records. For example, run the following query to create a table storing articles for a blog:

```sql
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title TEXT,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp(3),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp(3)
);

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = current_timestamp(3);
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_article_modtime
BEFORE UPDATE ON articles
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

INSERT INTO articles (title, content) VALUES ('First Article', 'Content here');
INSERT INTO articles (title, content) VALUES ('Second Article', 'Content here');
```

This query creates a table to store articles, with columns for the title, content, and creation and update timestamps. It also defines a trigger that updates the `updated_at` column whenever an article is modified. To verify, run the following query that updates the content for the first article:

```sql
SELECT pg_sleep(1); -- simulate some delay before update

UPDATE articles SET content = 'Updated content' WHERE id = 1;
SELECT * FROM articles;
```

This query returns the following output, showing the updated content and the update timestamp for the first article:

```text
 id |     title      |     content     |         created_at         |         updated_at
----+----------------+-----------------+----------------------------+----------------------------
  2 | Second Article | Content here    | 2024-06-25 08:04:50.343+00 | 2024-06-25 08:04:50.343+00
  1 | First Article  | Updated content | 2024-06-25 08:04:50.277+00 | 2024-06-25 08:04:57.297+00
(2 rows)
```

## Additional considerations

### Timezone awareness

`current_timestamp` returns a value in the timezone of the current session, which defaults to the server's timezone unless explicitly set in the session. This is important to note when working with timestamps across different timezones.

### Alternative functions

- `now()` - An alias for `current_timestamp`.
- `transaction_timestamp()` - Returns the current timestamp at the start of the current transaction. Equivalent to `current_timestamp`.
- `statement_timestamp()` - Returns the current timestamp at the start of the current statement.
- `clock_timestamp()` - Returns the current timestamp, changing even within a single SQL statement.

## Resources

- [PostgreSQL documentation: Date/Time Functions and Operators](https://www.postgresql.org/docs/current/functions-datetime.html)
- [PostgreSQL documentation: Date/Time Types](https://www.postgresql.org/docs/current/datatype-datetime.html)
