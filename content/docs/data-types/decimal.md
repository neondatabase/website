---
title: Postgres Decimal data types
subtitle: Work with exact numerical values in Postgres
enableTableOfContents: true
updatedOn: '2024-06-14T07:55:54.366Z'
---

In Postgres, decimal data types are used to represent numbers with arbitrarily high precision. They are crucial in financial applications and scientific computation, where exact precision is required for numerical calculations.

<CTA />

## Storage and syntax

Postgres provides a single decimal/numeric type referred to as `DECIMAL` or `NUMERIC`. It offers user-defined precision and can represent numbers exactly up to a certain number of digits.

The syntax for defining a decimal column is `DECIMAL(precision, scale)` or `NUMERIC(precision, scale)`, where:

- `precision` is the total count of significant digits in the number (both to the left and right of the decimal point).
- `scale` is the count of decimal digits in the fractional part.

Declaring a column as `NUMERIC` without specifying precision and scale, stores numbers of any precision exactly (up to the implementation limit).

We illustrate the behavior of `NUMERIC` with the following example:

```sql
SELECT 1234.56::NUMERIC(10, 4) AS num_A,
       1234.56::NUMERIC(10, 1) AS num_B,
       1234.56789::NUMERIC AS num_C;
```

This query yields the following output:

```text
num_a     | num_b  |   num_c
----------+--------+------------
1234.5600 | 1234.6 | 1234.56789
```

The number `1234.56` is represented exactly in all three cases. However, the `NUMERIC(10, 4)` type rounds the number to 4 decimal places, while `NUMERIC(10, 1)` rounds to 1 decimal place. When no precision and scale are specified, the number is stored exactly.

## Example usage

Consider a financial application managing user portfolios. Here, `DECIMAL` is ideal for storing currency values to avoid rounding errors. For example, representing the price of a stock or the total value of a portfolio.

The following SQL creates a `portfolios` table:

```sql
CREATE TABLE portfolios (
    portfolio_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    stock_symbol TEXT NOT NULL,
    shares_owned DECIMAL(10, 4),
    price_per_share DECIMAL(10, 2)
);

INSERT INTO portfolios (user_id, stock_symbol, shares_owned, price_per_share)
VALUES
    (101, 'AAPL', 150.1234, 145.67),
    (102, 'MSFT', 200.000, 214.53);
```

## Other examples

### Arithmetic operations

Postgres allows various arithmetic operations on decimal types. These operations maintain precision and are critical in contexts where rounding errors could be costly.

For example, the following query calculates the total value of each stock holding:

```sql
SELECT price_per_share * shares_owned AS total_value
FROM portfolios;
```

This query yields the following output:

```text
total_value
--------------
21868.475678
42906.000000
```

This query calculates the total value of each stock holding with precise decimal representation.

## Differences from floating-point

It's important to differentiate `DECIMAL`/`NUMERIC` from floating-point types (`REAL`, `DOUBLE PRECISION`):

- **Precision**: `DECIMAL`/`NUMERIC` types maintain exact precision, while floating-point types are approximate and can introduce rounding errors.
- **Performance**: Operations on `DECIMAL`/`NUMERIC` types are generally slower than floating-point types due to the precision and complexity of calculations.

## Additional considerations

- **Range and Precision**: Always define `DECIMAL`/`NUMERIC` with an appropriate range and precision based on the application's requirements. Overestimating precision can lead to unnecessary storage and performance overhead.

## Resources

- [PostgreSQL documentation - Numeric Types](https://www.postgresql.org/docs/current/datatype-numeric.html)

<NeedHelp />
