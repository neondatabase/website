# Postgres Integer data types

> The document details the integer data types available in PostgreSQL, explaining their storage requirements and usage, specifically for Neon users managing database schemas.

## Source

- [Postgres Integer data types HTML](https://neon.com/docs/data-types/integer): The original HTML version of this documentation

In Postgres, integer data types are used for storing numerical values without a fractional component. They are useful as identifiers, counters, and many other common data modeling tasks. Postgres offers multiple integer types, catering to different ranges of values and storage sizes.



## Storage and syntax

Postgres supports three primary integer types. Choosing the appropriate integer type depends on the range of data expected.

1. `SMALLINT`: A small-range integer, occupying 2 bytes of storage. It's useful for columns with a small range of values.
2. `INTEGER`: The standard integer type, using 4 bytes of storage. It's the most commonly used since it balances storage/performance efficiency and range capacity.
3. `BIGINT`: A large-range integer, taking up 8 bytes. It's used when the range of `INTEGER` is insufficient.

Note that Postgres doesn't support unsigned integers. All integer types can store both positive and negative values.

## Example usage

Consider a database for a small online bookstore. Here, `SMALLINT` could be used for storing the number of copies of a book in stock, while `INTEGER` would be appropriate for a unique identifier for each book.

The query below creates a `books` table with these columns:

```sql
CREATE TABLE books (
    book_id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    copies_in_stock SMALLINT
);

INSERT INTO books (book_id, title, copies_in_stock)
VALUES
    (1, 'War and Peach', 50),
    (2, 'The Great Gatsby', 20),
    (3, 'The Catcher in the Rye', 100);
```

## Other examples

### Integer operations

Postgres supports various arithmetic operations on integer types, including addition, subtraction, multiplication, and division.

Note that the division of integers does not yield a fractional result; it truncates the result to an integer.

```sql
SELECT 10 / 4; -- Yields 2, not 2.5
```

## Sequences and auto-Increment

Postgres also provides `SERIAL`, which is a pseudo-type for creating auto-incrementing integers, often used for primary keys. It's effectively an `INTEGER` that automatically increments with each new row insertion.

There is also `BIGSERIAL` and `SMALLSERIAL` for auto-incrementing `BIGINT` and `SMALLINT` columns, respectively.

For example, we can create an `orders` table with an auto-incrementing `order_id` column:

```sql
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    order_details TEXT
);

INSERT INTO orders (order_details)
VALUES ('Order 1'), ('Order 2'), ('Order 3');
RETURNING *;
```

This query returns the following:

```text
 order_id | order_details
----------+---------------
        1 | Order 1
        2 | Order 2
        3 | Order 3
```

The `order_id` column gets a unique integer value for each new order.

## Additional considerations

- **Data integrity**: Integer types strictly store numerical values. Attempting to insert non-numeric data, or a value outside the range of that particular type will result in an error.
- **Performance**: Choosing the correct integer type (`SMALLINT`, `INTEGER`, `BIGINT`) based on the expected value range can optimize storage efficiency and performance.

## Resources

- [PostgreSQL documentation - Numeric Types](https://www.postgresql.org/docs/current/datatype-numeric.html)
