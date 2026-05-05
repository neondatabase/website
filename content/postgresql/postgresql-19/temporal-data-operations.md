---
title: 'PostgreSQL 19 Temporal Data Operations'
page_title: 'PostgreSQL 19 UPDATE/DELETE FOR PORTION OF - Temporal Data Operations'
page_description: 'Learn how to use PostgreSQL 19 UPDATE and DELETE FOR PORTION OF to modify temporal data, automatically splitting rows to preserve history outside the targeted time range.'
ogImage: ''
updatedOn: '2026-04-14T00:00:00+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL 19 ON CONFLICT DO SELECT'
  slug: 'postgresql-19/on-conflict-do-select'
nextLink:
  title: 'PostgreSQL 19 pg_plan_advice'
  slug: 'postgresql-19/pg-plan-advice'
---

**Summary**: PostgreSQL 19 adds `UPDATE ... FOR PORTION OF` and `DELETE ... FOR PORTION OF` to modify temporal data within a specific time range, automatically splitting rows to preserve the untouched portions. This completes the SQL:2011 temporal feature set that began with `WITHOUT OVERLAPS` in PostgreSQL 18.

## Introduction to Temporal Data Operations

PostgreSQL 18 introduced temporal PRIMARY KEY and UNIQUE constraints using [`WITHOUT OVERLAPS`](/postgresql/postgresql-18/temporal-constraints), ensuring that no two rows for the same entity could have overlapping time ranges. That solved the integrity side of temporal data. But modifying temporal data correctly - changing a value for just a portion of a time range while preserving the rest - still required application logic.

PostgreSQL 19 adds the DML side with `FOR PORTION OF`. When you update or delete a row for a specific time range, PostgreSQL automatically splits the row. The targeted portion gets modified, and the untouched parts are preserved as new rows with the original values.

This is the behavior that temporal databases need for booking systems, employee records, insurance policies, and any scenario where data has a validity period.

## Sample Database Setup

Let's create a product pricing table where prices have validity ranges:

```sql
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE product_prices (
    product_id INT NOT NULL,
    valid_range TSTZRANGE NOT NULL DEFAULT tstzrange(now(), 'infinity', '[)'),
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    PRIMARY KEY (product_id, valid_range WITHOUT OVERLAPS)
);

-- Insert some products with validity periods
INSERT INTO product_prices (product_id, valid_range, price) VALUES
    (1, tstzrange('2025-01-01', '2026-01-01', '[)'), 29.99),
    (2, tstzrange('2025-01-01', '2026-01-01', '[)'), 49.99),
    (3, tstzrange('2025-06-01', '2025-12-31', '[)'), 19.99);
```

The `WITHOUT OVERLAPS` constraint ensures that no two price entries for the same product can have overlapping validity periods.

## Basic UPDATE FOR PORTION OF

Suppose you want to increase the price of product 1, but only for Q3 2025. The rest of the year should keep the original price:

```sql
UPDATE product_prices
FOR PORTION OF valid_range FROM '2025-07-01' TO '2025-10-01'
SET price = 34.99
WHERE product_id = 1;
```

PostgreSQL automatically splits the original row into three:

```sql
SELECT product_id, valid_range, price FROM product_prices
WHERE product_id = 1
ORDER BY valid_range;
```

```
 product_id |                    valid_range                     | price
------------+----------------------------------------------------+-------
          1 | ["2025-01-01 00:00:00+00","2025-07-01 00:00:00+00")| 29.99
          1 | ["2025-07-01 00:00:00+00","2025-10-01 00:00:00+00")| 34.99
          1 | ["2025-10-01 00:00:00+00","2026-01-01 00:00:00+00")| 29.99
```

The original row covered the full year at $29.99. After the update:

- **Before the portion** (Jan-Jun): $29.99 preserved automatically
- **The targeted portion** (Jul-Sep): updated to $34.99
- **After the portion** (Oct-Dec): $29.99 preserved automatically

You did not need to manually create the "leftover" rows. PostgreSQL handled the splitting.

## How Row Splitting Works

When PostgreSQL processes a `FOR PORTION OF` update, it follows these steps:

1. Finds the matching row (product 1, whose `valid_range` overlaps with the targeted portion)
2. Updates the matched row, setting its range to the targeted portion
3. Automatically inserts leftover rows for any parts of the original range that fell outside the targeted portion

A row can produce 0, 1, or 2 leftover rows depending on overlap:

- **Portion covers the entire row**: No leftovers (the row is simply updated)
- **Portion aligns with one end**: One leftover row
- **Portion is in the middle**: Two leftover rows (before and after)

## DELETE FOR PORTION OF

The same splitting logic applies to deletes. To remove the pricing for product 2 during August 2025:

```sql
DELETE FROM product_prices
FOR PORTION OF valid_range FROM '2025-08-01' TO '2025-09-01'
WHERE product_id = 2;
```

```sql
SELECT product_id, valid_range, price FROM product_prices
WHERE product_id = 2
ORDER BY valid_range;
```

```
 product_id |                    valid_range                     | price
------------+----------------------------------------------------+-------
          2 | ["2025-01-01 00:00:00+00","2025-08-01 00:00:00+00")| 49.99
          2 | ["2025-09-01 00:00:00+00","2026-01-01 00:00:00+00")| 49.99
```

The August portion is deleted. The periods before and after are preserved.

## Using Unbounded Ranges

You can use `NULL` for unbounded start or end values:

```sql
-- Update all prices for product 3 from September onward
UPDATE product_prices
FOR PORTION OF valid_range FROM '2025-09-01' TO NULL
SET price = 24.99
WHERE product_id = 3;
```

`NULL` as the end value means "no upper bound" - it extends to the end of the row's range.

## Real-world use cases

A few concrete patterns that previously needed helper queries or CTE tricks and now fit into a single `UPDATE` or `DELETE`.

### Employee salary history

A raise that takes effect mid-period needs to preserve the old salary for the months before and the new salary for the months after. `FOR PORTION OF` handles the split in one statement.

```sql
CREATE TABLE employee_salaries (
    employee_id INT NOT NULL,
    valid_range DATERANGE NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    department VARCHAR(50),
    PRIMARY KEY (employee_id, valid_range WITHOUT OVERLAPS)
);

INSERT INTO employee_salaries VALUES
    (101, daterange('2024-01-01', '2026-01-01'), 85000, 'Engineering');

-- Promotion effective July 2025
UPDATE employee_salaries
FOR PORTION OF valid_range FROM '2025-07-01' TO '2026-01-01'
SET salary = 95000
WHERE employee_id = 101;
```

This creates a clean salary history: $85,000 through June 2025, $95,000 from July 2025 onward.

### Hotel Room Bookings

A guest who upgrades their rate for only part of their stay would normally require multiple inserts. With `FOR PORTION OF`, the existing booking row is split cleanly into the old-rate and new-rate intervals.

```sql
CREATE TABLE room_bookings (
    room_id INT NOT NULL,
    booked_range DATERANGE NOT NULL,
    guest_name VARCHAR(100),
    rate DECIMAL(8,2),
    PRIMARY KEY (room_id, booked_range WITHOUT OVERLAPS)
);

INSERT INTO room_bookings VALUES
    (201, daterange('2025-08-01', '2025-08-10'), 'Alice', 150.00);

-- Alice upgrades her rate for the last 3 nights
UPDATE room_bookings
FOR PORTION OF booked_range FROM '2025-08-07' TO '2025-08-10'
SET rate = 200.00
WHERE room_id = 201 AND guest_name = 'Alice';
```

### Insurance Policy Adjustments

Seasonal coverage changes apply to a slice of an annual policy. `FOR PORTION OF` raises coverage during hurricane season while leaving the rest of the year untouched.

```sql
CREATE TABLE policy_coverage (
    policy_id INT NOT NULL,
    coverage_period DATERANGE NOT NULL,
    coverage_amount DECIMAL(12,2),
    deductible DECIMAL(8,2),
    PRIMARY KEY (policy_id, coverage_period WITHOUT OVERLAPS)
);

-- Temporarily increase coverage during hurricane season
UPDATE policy_coverage
FOR PORTION OF coverage_period FROM '2025-06-01' TO '2025-11-30'
SET coverage_amount = coverage_amount * 1.5,
    deductible = deductible * 0.8
WHERE policy_id = 500;
```

## Important Behavior Details

**RETURNING clause**: Only returns the updated or deleted rows, not the automatically inserted leftover rows. If you need to see all resulting rows, query the table afterward.

**Row counts**: The count returned by UPDATE or DELETE reflects only the targeted rows, not the leftover inserts.

**INSERT triggers**: Leftover rows trigger INSERT triggers even though the operation was an UPDATE or DELETE. This is because PostgreSQL implements leftovers as actual INSERT operations internally.

**INSERT privilege**: Not required for leftover rows. Since leftovers preserve existing data rather than adding new information, the operation only requires UPDATE or DELETE privilege.

**Range types**: `FOR PORTION OF` works with both range types (`int4range`, `daterange`, `tstzrange`, etc.) and multirange types. With multiranges, a single leftover row is inserted containing the remaining portions.

## Performance Considerations

Temporal operations with `FOR PORTION OF` are more expensive than regular updates because they involve additional INSERT operations for leftover rows. Each leftover row requires index maintenance and WAL writes.

For bulk temporal modifications, consider processing in batches:

```sql
-- Update prices for many products in a time range
UPDATE product_prices
FOR PORTION OF valid_range FROM '2025-07-01' TO '2025-10-01'
SET price = price * 1.10
WHERE product_id BETWEEN 1 AND 100;
```

Ensure you have appropriate indexes on the range columns, which the `WITHOUT OVERLAPS` constraint in the PRIMARY KEY already provides via a GiST index.

## Summary

`UPDATE/DELETE FOR PORTION OF` completes PostgreSQL's SQL:2011 temporal data support. Combined with the `WITHOUT OVERLAPS` constraints from PostgreSQL 18, you now have a complete toolkit for temporal data: integrity constraints to prevent overlapping periods, and DML operations that correctly split rows when modifying a sub-period.

## References

- [Commit `8e72d914`: Add UPDATE/DELETE FOR PORTION OF](https://git.postgresql.org/gitweb/?p=postgresql.git;a=commit;h=8e72d914)
- [PostgreSQL devel docs: UPDATE](https://www.postgresql.org/docs/devel/sql-update.html)
- [PostgreSQL devel docs: DELETE](https://www.postgresql.org/docs/devel/sql-delete.html)
