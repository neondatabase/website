---
title: Postgres Floating-point Data Types
subtitle: Working with float values in PostgreSQL
enableTableOfContents: true
---

In Postgres, floating point data types are used to represent numbers that might have a fractional part. These types are essential for situations where precision is key, such as scientific calculations, financial computations, and more.

## Storage and syntax

Postgres supports two primary floating-point types:

1. `REAL`: Also known as "single precision," `REAL` occupies 4 bytes of storage. It offers a precision of at least 6 decimal digits.
2. `DOUBLE PRECISION`: Known as "double precision," this type uses 8 bytes of storage and provides a precision of at least 15 decimal digits.

Both types are approximate numeric types, meaning they may have rounding errors and are not recommended for storing exact decimal values, like monetary data.

## Example usage

For a weather data application, `REAL` might be used for storing temperature readings, where extreme precision isn't critical. However, for complex scientific calculations involving extensive decimal data, `DOUBLE PRECISION` would be more appropriate.

Consider the following table creation for weather data:

```sql
CREATE TABLE weather_data (
    reading_id SERIAL PRIMARY KEY,
    temperature REAL NOT NULL,
    humidity REAL NOT NULL
);

INSERT INTO weather_data (temperature, humidity)
VALUES
    (23.5, 60.2),
    (20.1, 65.3),
    (22.8, 58.1);
```

## Other examples

### Arithmetic operations

Floating-point types support the standard arithmetic operations: addition, subtraction, multiplication, division, and modulus. However, operations like division might lead to potential rounding errors and precision loss.

```sql
SELECT 10.0 / 3.0;
```

This query yields `3.3333333333333333`, which does not represent the quantity `10 / 3` exactly, but rather rounded to the nearest representable value. When peerforming a series of operations, these rounding errors can accumulate and lead to significant precision loss.

### Special Floating-point values

PostgreSQL's floating-point types can represent special values like 'Infinity', '-Infinity', and 'NaN' (not a number). These values can be useful in certain mathematical or scientific computations.

## Additional considerations

- **Accuracy and rounding**: Be aware of rounding errors. For applications requiring exact decimal representation (like financial calculations), consider using `NUMERIC` or `DECIMAL` types instead.
- **Performance**: While `DOUBLE PRECISION` offers more precision, it might not be as performant due to larger storage size.

## Resources

- [PostgreSQL documentation - Numeric Types](https://www.postgresql.org/docs/current/datatype-numeric.html)

<NeedHelp />
