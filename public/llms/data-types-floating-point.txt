# Postgres Floating-point data types

> The document details the implementation and usage of floating-point data types in Neon, specifically focusing on the `float4` and `float8` types within PostgreSQL, including their precision, storage requirements, and applicable use cases.

## Source

- [Postgres Floating-point data types HTML](https://neon.com/docs/data-types/floating-point): The original HTML version of this documentation

In Postgres, floating point data types are used to represent numbers that might have a fractional part. These types are essential for situations where precision is key, such as scientific calculations, financial computations, and more.



## Storage and syntax

Postgres supports two primary floating-point types:

1. `REAL`: Also known as "single precision," `REAL` occupies 4 bytes of storage. It offers a precision of at least 6 decimal digits.
2. `DOUBLE PRECISION`: Known as "double precision," this type uses 8 bytes of storage and provides a precision of at least 15 decimal digits.

Both types are approximate numeric types, meaning they may have rounding errors and are not recommended for storing exact decimal values, like monetary data.

## Example usage

For a weather data application, `REAL` might be used for storing temperature readings, where extreme precision isn't critical, as in the following example:

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

For more complex scientific calculations involving extensive decimal data, `DOUBLE PRECISION` would be more appropriate, as in this example:

```sql
CREATE TABLE scientific_data (
    measurement_id SERIAL PRIMARY KEY,
    precise_temperature DOUBLE PRECISION NOT NULL,
    co2_levels DOUBLE PRECISION NOT NULL,
    measurement_time TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

INSERT INTO scientific_data (precise_temperature, co2_levels, measurement_time)
VALUES
    (23.456789, 415.123456789, '2024-02-03 10:00:00'),
    (20.123456, 417.123789012, '2024-02-03 11:00:00'),
    (22.789012, 418.456123789, '2024-02-03 12:00:00');
```

## Other examples

### Arithmetic operations

Floating-point types support the standard arithmetic operations: addition, subtraction, multiplication, division, and modulus. However, operations like division might lead to potential rounding errors and precision loss.

```sql
SELECT 10.0 / 3.0;
```

This query yields `3.3333333333333333`, which does not represent the quantity `10 / 3` exactly, but rather rounded to the nearest representable value. When performing a series of operations, these rounding errors can accumulate and lead to significant precision loss.

### Special Floating-point values

Postgres floating-point types can represent special values like `'infinity'`, `'-infinity'`, and `'NaN'` (not a number). These values can be useful in certain mathematical or scientific computations.

Consider a table named `calculations`, which might store the results of various scientific computations, including temperature changes, pressure levels, and calculation errors that could potentially result in `'infinity'`, `'-infinity'`, or `'NaN'` values:

```sql
CREATE TABLE calculations (
    calculation_id SERIAL PRIMARY KEY,
    temperature_change DOUBLE PRECISION,
    pressure_level DOUBLE PRECISION,
    error_margin DOUBLE PRECISION
);

-- Inserting special floating-point values
INSERT INTO calculations (temperature_change, pressure_level, error_margin)
VALUES
    ('infinity', 101.325, 0.001), -- An example where temperature change is beyond measurable scale
    ('-infinity', 0.0, 0.0001),   -- An example with a negative infinite value
    ('NaN', 101.325, 'NaN');      -- Examples of undefined results or unmeasurable quantities
```

Notice that you must use single quotes to wrap these values as shown above.

## Additional considerations

- **Accuracy and rounding**: Be aware of rounding errors. For applications requiring exact decimal representation (like financial calculations), consider using `NUMERIC` or `DECIMAL` types instead.
- **Performance**: While `DOUBLE PRECISION` offers more precision, it might not be as performant due to the larger storage size.

## Resources

- [PostgreSQL documentation - Numeric Types](https://www.postgresql.org/docs/current/datatype-numeric.html)
