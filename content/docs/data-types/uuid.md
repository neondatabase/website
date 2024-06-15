---
title: Postgres UUID data type
subtitle: Work with UUIDs in Postgres
enableTableOfContents: true
updatedOn: '2024-06-14T07:55:54.367Z'
---

`UUID` stands for `Universally Unique Identifier`. A `UUID` is a 128-bit value used to ensure global uniqueness across tables and databases.

In Postgres, the UUID data type is ideal for assigning unique identifiers to entities such as users, orders, or products. They are particularly useful in distributed scenarios, where the system is spread across different databases or services, and unique keys need to be generated independently.

<CTA />

## Storage and syntax

UUIDs are stored as 128-bit values, represented as a sequence of hexadecimal digits. They are typically formatted in five groups, of sizes 8, 4, 4, 4 and 12, separated by hyphens. For example:

- `123e4567-e89b-12d3-a456-426655440000`, or
- `a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11`

Postgres accepts UUID values in the above format, while also allowing uppercase letters and missing hyphen separators. You can also generate them using functions like `gen_random_uuid()` which is available natively in Postgres, or the `uuid_generate_v4()` function which requires the `uuid-ossp` extension.

## Example usage

Consider a scenario where we track user sessions in a web application. UUIDs are commonly used to identify sessions due to their uniqueness.

The query below creates a table and inserts some sample session data:

```sql
CREATE TABLE sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INT,
    activity TEXT
);

INSERT INTO sessions (user_id, activity)
VALUES
    (1, 'login'),
    (2, 'view'),
    (1, 'view'),
    (1, 'logout'),
    (3, 'write')
RETURNING *;
```

This query returns the following:

```text
| session_id                             | user_id | activity |
|----------------------------------------|---------|----------|
| b148aab2-5a03-4d96-a119-c32fc8a4bfaa   | 1       | login    |
| 72be2042-0072-4858-b090-cb27c31e44b1   | 2       | view     |
| e817b187-aba3-4b0d-a34e-a1d82319627c   | 1       | view     |
| a940a06a-a8d4-4e90-a90c-d8fa096e620f   | 1       | logout   |
| df56fbf8-1fcd-408a-a1c6-4e18e35b8349   | 3       | write    |
```

To retrieve a specific session, we can query by its UUID:

```sql
SELECT *
FROM sessions
WHERE session_id = 'e817b187-aba3-4b0d-a34e-a1d82319627c';
```

This query returns the following:

```text
| session_id                             | user_id | activity |
|----------------------------------------|---------|----------|
| e817b187-aba3-4b0d-a34e-a1d82319627c   | 1       | view     |
```

## Other examples

### Using UUID column as primary key

Using UUIDs as primary keys is common since the likelihood of the same UUID value being generated twice is very small. This is helpful in distributed systems or when merging data from different sources.

For example, we can create a table to store products and use a UUID column as the primary key.

```sql
CREATE TABLE products (
    product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    price NUMERIC
);

INSERT INTO products (name, price)
VALUES
    ('Apple', 1.99),
    ('Banana', 2.99),
    ('Orange', 3.99)
RETURNING *;
```

This query returns the following:

```text
| product_id                             | name   | price |
|----------------------------------------|--------|-------|
| ce3b39d8-1bae-4ed3-b4db-2a74658f0d85   | Apple  | 1.99  |
| 14c18af1-a352-45e6-976e-3c194bdc6ee8   | Banana | 2.99  |
| f303866d-d08a-48a7-81c3-c30486149d87   | Orange | 3.99  |
```

### Avoiding data leakage

In systems where data security is a concern, using non-sequential IDs like UUIDs can help obscure the total number of records, preventing potential information leaks. This is in contrast to the sequential IDs provided by the `SERIAL` data type, which can inadvertently reveal information about the number of users, orders, etc.

For example, the query below creates a table that tracks users of an API with some sample data:

```sql
CREATE TABLE api_users (
    serial_id SERIAL PRIMARY KEY,
    uuid_id UUID DEFAULT gen_random_uuid(),
    username TEXT NOT NULL
);

INSERT INTO api_users (username)
VALUES
    ('user1'),
    ('user2'),
    ('user3')
RETURNING *;
```

This query returns the following:

```text
| serial_id | uuid_id                              | username |
|-----------|--------------------------------------|----------|
| 1         | e5836695-f2d0-47f4-86e8-d0dbaae4031a | user1    |
| 2         | d22ec671-806a-4db2-8c60-f0f8754f9b7b | user2    |
| 3         | 108eb93a-071e-4407-8b78-a73aabd9e803 | user3    |
```

Notice that the `serial_id` column hints at the number of rows already present in the table.

## Additional considerations

- **Randomness and uniqueness**: UUIDs are designed to be globally unique, but there's an extremely small probability of generating a duplicate UUID. If you're automatically generating UUIDs at insertion, and a duplicate UUID is generated, the insertion will fail. In the rare event that a collision occurs, applications that generate UUIDs should implement a retry mechanism.
- **Performance and indexing**: UUIDs are larger than traditional integer IDs, requiring more storage space. Index structures on UUID columns therefore consume more storage as well. However, in terms of performance for read-heavy workloads, leveraging indexed UUID columns for filtering or sorting can significantly improve query performance. In this context, you have to evaluate the tradeoff between storage efficiency and query performance.
- **Readability**: UUIDs are not human-readable, which can make debugging or manual inspection of data more challenging.

## Resources

- [PostgreSQL UUID Type documentation](https://www.postgresql.org/docs/current/datatype-uuid.html)

<NeedHelp />
