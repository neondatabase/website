---
title: Postgres lower() function
subtitle: Convert strings to lowercase
enableTableOfContents: true
updatedOn: '2024-06-27T15:05:08.274Z'
---

The `lower()` function in Postgres is used to convert a string to lowercase.

It's commonly used for search functionality where you want case-insensitivity or when you need to standardize user input for storage or comparison purposes. For example, `lower()` can be used to normalize email addresses or usernames in a user management system.

<CTA />

## Function signature

The `lower()` function has a simple signature:

```sql
lower(string text) -> text
```

- `string`: The input string to be converted to lowercase.

## Example usage

Consider a table `products` with a `product_name` column that contains product names with inconsistent capitalization. We can use `lower()` to standardize these names for comparison or display purposes.

```sql
WITH products AS (
    SELECT *
    FROM (
        VALUES
            ('LAPTOP Pro X'),
            ('SmartPhone Y'),
            ('Tablet ULTRA 2')
    ) AS t(product_name)
)
SELECT lower(product_name) AS standardized_name
FROM products;
```

This query converts all product names to lowercase, making them consistent regardless of their original capitalization. Note that non-alphabetic characters are left unchanged.

```text
 standardized_name
-------------------
 laptop pro x
 smartphone y
 tablet ultra 2
(3 rows)
```

## Advanced examples

### Case-insensitive search

You can use `lower()` in a `WHERE` clause to perform case-insensitive searches:

```sql
WITH customers AS (
  SELECT 'John Doe' AS name, 'JOHN.DOE@EXAMPLE.COM' AS email
  UNION ALL
  SELECT 'Jane Smith' AS name, 'jane.smith@example.com' AS email
  UNION ALL
  SELECT 'Bob Johnson' AS name, 'Bob.Johnson@Example.com' AS email
)
SELECT name, email
FROM customers
WHERE lower(email) LIKE lower('%John.%');
```

This query will find the customer regardless of how the email address was capitalized in the database or search term.

```text
   name   |        email
----------+----------------------
 John Doe | JOHN.DOE@EXAMPLE.COM
(1 row)
```

### Combining with other string functions

`lower()` can be combined with other string functions for more complex operations:

```sql
WITH user_data AS (
  SELECT 'JOHN_DOE_123' AS username
  UNION ALL
  SELECT 'JANE_SMITH_456' AS username
  UNION ALL
  SELECT 'BOB_JOHNSON_789' AS username
)
SELECT
  lower(split_part(username, '_', 1)) AS first_name,
  lower(split_part(username, '_', 2)) AS last_name,
  split_part(username, '_', 3) AS user_id
FROM user_data;
```

This query splits the username into parts, converts the name parts to lowercase, and keeps the user ID as-is.

### Using `lower()` to create indexes

Postgres supports creating a _functional index_ based on the result of a function applied to a column. To optimize case-insensitive searches, we can create an index using the `lower()` function:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE INDEX idx_users_name_lower ON users (lower(name));
```

This index will improve the performance of queries that use `lower(name)` to filter data.

### Normalizing data for uniqueness constraints

When you want to enforce uniqueness regardless of case, you can use `lower()` to create a unique index on the column.

```sql
CREATE TABLE organizations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE UNIQUE INDEX idx_organizations_name_lower ON organizations (lower(name));

INSERT INTO organizations (name) VALUES ('Acme Corp');
INSERT INTO organizations (name) VALUES ('Bailey Inc.');
```

Trying to insert a duplicate organization name with different capitalization will raise an error:

```sql
INSERT INTO organizations (name) VALUES ('ACME CORP');
-- ERROR:  duplicate key value violates unique constraint "idx_organizations_name_lower"
-- DETAIL:  Key (lower(name))=(acme corp) already exists.
```

## Additional considerations

### Performance implications

While `lower()` is generally fast, using it in `WHERE` clauses or `JOIN` conditions on large tables can impact performance, as it prevents the use of standard indexes directly. In such cases, consider using functional indexes as shown in the earlier example.

### Locale considerations

The `lower()` function uses the database's locale setting for its case conversion rules. If your application needs to handle multiple languages, you may need to consider using the `lower()` function with specific collations or implementing custom case-folding logic.

### Alternative functions

- `upper()` - Converts a string to uppercase.
- `initcap()` - Converts the first letter of each word to uppercase and the rest to lowercase.

## Resources

- [PostgreSQL documentation: String functions and operators](https://www.postgresql.org/docs/current/functions-string.html)
- [PostgreSQL documentation: Indexes on expressions](https://www.postgresql.org/docs/current/indexes-expressional.html)
