---
title: Postgres Boolean data type
subtitle: Represent truth values in Postgres
enableTableOfContents: true
updatedOn: '2024-06-14T07:55:54.365Z'
---

In Postgres, the Boolean datatype is designed to store truth values. A Boolean column can hold one of three states: `true`, `false`, or `NULL` representing unknown or missing values.

For instance, Boolean values can be used in a dataset to represent the status of an order, whether a user is active, or whether a product is in stock. A Boolean value could also be produced as a result of comparisons or logical operations.

<CTA />

## Storage and syntax

In SQL statements, Boolean values are represented by the keywords `TRUE`, `FALSE`, and `NULL`. Postgres is flexible and allows for various textual representations of these values:

- `TRUE` can also be represented as `t`, `true`, `y`, `yes`, `on`, `1`.
- `FALSE` can also be represented as `f`, `false`, `n`, `no`, `off`, `0`.

A boolean value is stored as a single byte.

## Example usage

Consider a table of users for a web application. We can add a Boolean column to represent whether a user is active or not.

The query below creates a `users` table and inserts some sample data:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    is_active BOOLEAN,
    has_paid_subscription BOOLEAN
);

INSERT INTO users (username, is_active, has_paid_subscription)
VALUES
    ('alice', TRUE, TRUE),
    ('bob', TRUE, FALSE),
    ('charlie', FALSE, TRUE),
    ('david', NULL, NULL),
    ('eve', FALSE, FALSE);
```

Say we want to find all the users currently active on the website. The `WHERE` clause accepts a Boolean expression, so we can filter down to the rows where the `is_active` column is `TRUE`.

```sql
SELECT *
FROM users
WHERE is_active = TRUE;
```

This query returns the following:

```text
| id | username | is_active | has_paid_subscription |
|----|----------|-----------|-----------------------|
| 1  | alice    | t         | t                     |
| 2  | bob      | t         | f                     |
```

## Other examples

### Conditional logic

Boolean data types are commonly used in conditional statements like `WHERE`, `IF`, and `CASE`. For example, the `CASE` statement is a control flow structure that allows you to perform `IF-THEN-ELSE` logic in SQL.

In the query below, we categorize users based on their activity and account type.

```sql
SELECT username,
    CASE
        WHEN is_active = TRUE AND has_paid_subscription = TRUE THEN 'Active Paid'
        WHEN is_active = TRUE AND has_paid_subscription = FALSE THEN 'Active Free'
        WHEN is_active = FALSE AND has_paid_subscription = TRUE THEN 'Inactive Paid'
        WHEN is_active = FALSE AND has_paid_subscription = FALSE THEN 'Inactive Free'
        ELSE 'Unknown'
    END AS user_status
FROM users;
```

This query returns the following:

```text
| username | user_status   |
|----------|---------------|
| alice    | Active Paid   |
| bob      | Active Free   |
| charlie  | Inactive Paid |
| david    | Unknown       |
| eve      | Inactive Free |
```

### Boolean expressions

Boolean expressions combine multiple boolean values using operators like `AND`, `OR`, and `NOT`. These expressions return boolean values and are crucial in complex SQL queries.

For example, we can use a Boolean expression to find all the users who are active but don't have a paid subscription yet.

```sql
SELECT id, username
FROM users
WHERE is_active = TRUE AND has_paid_subscription = FALSE;
```

This query returns the following:

```text
| id | username |
|----|----------|
| 2  | bob      |
```

### Boolean aggregations

Postgres also supports aggregating over a set of Boolean values, using functions like `bool_and()` and `bool_or()`.

For example, we can query to check that no inactive users have a paid subscription.

```sql
SELECT bool_or(has_paid_subscription) AS inactive_paid_users
FROM users
WHERE is_active = FALSE;
```

This query returns the following:

```text
| inactive_paid_users |
|---------------------|
| t                   |
```

This indicates there is at least one inactive user with an ongoing subscription. We should probably email them a reminder to log in.

### Boolean in join conditions

Booleans can be effectively used in the `JOIN` clause to match rows across tables.

In the query below, we join the `users` table with the table containing contact information to send a promotional email to all active users.

```sql
WITH contacts (user_id, email) AS (
    VALUES
    (1, 'alice@email.com'),
    (2, 'bob@email.com'),
    (3, 'charlie@email.com'),
    (4, 'david@email.com'),
    (5, 'eve@email.com')
)
SELECT u.id, u.username, c.email
FROM users u
JOIN contacts c ON u.id = c.user_id AND u.is_active = TRUE;
```

This query returns the following:

```text
| id | username | email           |
|----|----------|-----------------|
| 1  | alice    | alice@email.com |
| 2  | bob      | bob@email.com   |
```

## Additional considerations

- **NULL**: `NULL` in boolean terms indicates an unknown state, which is neither `TRUE` nor `FALSE`. In conditional statements, `NULL` values will not equate to `FALSE`.
- **Type Casting**: Be mindful when converting Booleans to other data types. For instance, casting a Boolean to an integer results in `1` for `TRUE` and `0` for `FALSE`. This behavior is useful in aggregations or mathematical operations.
- **Indexing**: Using Booleans in indexing might not always be efficient, especially if the distribution of true and false values is uneven.

## Resources

- [PostgreSQL Boolean Type documentation](https://www.postgresql.org/docs/current/datatype-boolean.html)

<NeedHelp />
