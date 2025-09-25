---
title: 'PostgreSQL 18 Enhanced Returning'
page_title: 'PostgreSQL 18 Enhanced Returning Clause'
page_description: 'In this tutorial, you will learn about PostgreSQL 18 Enhanced Returning Clause, which allows you to access both old and new values in DML operations, making it easier to track changes and improve data integrity.'
ogImage: ''
updatedOn: '2025-06-22T09:30:00+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL 18 UUIDv7 Support'
  slug: 'postgresql-18/uuidv7-support'
nextLink:
  title: 'PostgreSQL 18 Temporal Constraints'
  slug: 'postgresql-18/temporal-constraints'
---

**Summary**: Learn how PostgreSQL 18 enhances the RETURNING clause to access both old and new values in DML operations, providing capabilities for audit trails, change tracking, and application logic.

## Introduction to Enhanced RETURNING Clause

PostgreSQL 18 introduces a significant improvement to the RETURNING clause that fundamentally changes how you can capture data during DML operations. Prior to this release, the RETURNING clause had a limitation: it could only return one set of values depending on the operation type.

The traditional behavior was straightforward but limiting:

- **INSERT and UPDATE**: returned only the new/current values
- **DELETE**: returned only the old/deleted values
- **MERGE**: returned values based on the specific internal operation executed

This limitation often forced developers to write separate queries, implement complex triggers, or use workarounds when they needed to compare before-and-after values or capture comprehensive change information.

PostgreSQL 18 eliminates this limitation by introducing special aliases `old` and `new` that allow you to explicitly access both the previous state and the current state of data within a single DML statement. This enhancement works across all DML operations: INSERT, UPDATE, DELETE, and MERGE.

## Understanding the Enhancement

The enhanced RETURNING clause provides two special aliases that become available in your DML statements:

- **`old`**: References the row values before the operation
- **`new`**: References the row values after the operation

These aliases behave differently depending on the type of operation you're performing. Understanding this behavior is crucial for effectively using the enhanced RETURNING clause.

For **INSERT** operations, `old` values are typically NULL since no previous row existed, while `new` values contain the inserted data. However, there's an important exception: when using `INSERT ... ON CONFLICT DO UPDATE`, the `old` values will contain the existing row data that conflicted with your insert.

For **UPDATE** operations, `old` contains the row values before the update, and `new` contains the values after the update. This is where the enhancement really shines, as you can now capture both states in a single operation.

For **DELETE** operations, `old` contains the values of the row being deleted, while `new` is typically NULL. However, if a DELETE operation is transformed into an UPDATE by a rewrite rule, `new` values may contain the updated row data.

For **MERGE** operations, the behavior depends on the specific action taken (INSERT, UPDATE, or DELETE) and can include values from both the source and target tables.

## Sample Database Setup

To demonstrate these concepts effectively, let's create a realistic inventory management database that mirrors common business scenarios where change tracking is essential:

```sql
-- Create inventory table for tracking product changes
CREATE TABLE inventory (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    unit_price DECIMAL(10,2) NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(50) DEFAULT CURRENT_USER
);

-- Insert sample data to work with
INSERT INTO inventory (product_name, category, quantity, unit_price)
VALUES
    ('Laptop Computer', 'Electronics', 50, 999.99),
    ('Office Chair', 'Furniture', 75, 249.50),
    ('Wireless Mouse', 'Electronics', 120, 29.95),
    ('Standing Desk', 'Furniture', 30, 399.00),
    ('USB Cable', 'Electronics', 200, 12.99),
    ('Gaming Chair', 'Furniture', 0, 89.99);
```

This setup provides us with a scenario where we might need to track inventory changes, price adjustments, and stock movements—all common requirements that benefit from enhanced change tracking capabilities.

## Basic Usage: INSERT Operations

Let's start with INSERT operations to understand how the enhanced RETURNING clause works in the simplest case. When inserting new data, you typically want to capture the generated values like auto-incremented IDs or default timestamps.

```sql
-- Basic INSERT with enhanced RETURNING
INSERT INTO inventory (product_name, category, quantity, unit_price)
VALUES ('Gaming Keyboard', 'Electronics', 85, 89.99)
RETURNING
    old.product_name AS previous_name,
    new.product_name AS current_name,
    new.product_id,
    new.quantity;
```

In this example, `old.product_name` will be NULL because this is a new insert with no previous row, while `new.product_name` contains the inserted value "Gaming Keyboard". The `new.product_id` gives us the auto-generated ID, which is particularly useful for applications that need to reference the newly created record.

This might seem redundant for simple inserts, but the real usefulness becomes apparent when dealing with complex insert scenarios or when you need to maintain consistency in your audit trail format across different operation types.

## INSERT with ON CONFLICT: Where OLD Values Matter

The enhanced RETURNING clause becomes particularly powerful with `INSERT ... ON CONFLICT` operations, where the `old` alias actually refers to the existing conflicting row. This allows you to update existing records while still capturing the previous state of the data.

Let's say you want to insert a new product but update the existing one if it already exists based on the product name. You can do this with an `ON CONFLICT` clause:

```sql
-- First, add a unique constraint for our demonstration
ALTER TABLE inventory ADD CONSTRAINT unique_product_name UNIQUE (product_name);

-- Now attempt to insert a duplicate
INSERT INTO inventory (product_name, category, quantity, unit_price)
VALUES ('Laptop Computer', 'Electronics', 25, 1099.99)
ON CONFLICT (product_name)
DO UPDATE SET
    quantity = inventory.quantity + EXCLUDED.quantity,
    unit_price = EXCLUDED.unit_price,
    last_updated = CURRENT_TIMESTAMP
RETURNING
    old.quantity AS original_quantity,
    new.quantity AS updated_quantity,
    old.unit_price AS original_price,
    new.unit_price AS updated_price,
    new.quantity - old.quantity AS quantity_added;
```

You will get the following output:

```sql
 original_quantity | updated_quantity | original_price | updated_price | quantity_added
-------------------+------------------+----------------+---------------+----------------
                50 |               75 |         999.99 |       1099.99 |             25
(1 row)
```

This example shows a common scenario: when you receive new stock of an existing product, you want to add to the existing quantity rather than create a duplicate record. The enhanced RETURNING clause lets you see exactly what happened: how much inventory you had before (`old.quantity`), how much you have now (`new.quantity`), and how much was added (`new.quantity - old.quantity`).

Without this enhancement, you would need to write a separate query before the operation to capture the original values, making your code more complex and potentially introducing race conditions in concurrent environments.

## UPDATE Operations: The Primary Use Case

`UPDATE` operations are where the enhanced RETURNING clause truly excels, as this is where you most commonly need to see both the before and after states of your data:

```sql
-- Update prices with a 5% increase for Electronics
UPDATE inventory
SET
    unit_price = unit_price * 1.05,
    last_updated = CURRENT_TIMESTAMP
WHERE category = 'Electronics'
RETURNING
    product_name,
    old.unit_price AS before_price,
    new.unit_price AS after_price,
    ROUND(new.unit_price - old.unit_price, 2) AS price_increase;
```

Output from this query would look like this:

```sql
  product_name   | before_price | after_price | price_increase
-----------------+--------------+-------------+----------------
 Wireless Mouse  |        29.95 |       31.45 |           1.50
 USB Cable       |        12.99 |       13.64 |           0.65
 Gaming Keyboard |        89.99 |       94.49 |           4.50
 Laptop Computer |      1099.99 |     1154.99 |          55.00
(4 rows)
```

This query increases prices for all electronics by 5% and immediately shows you the impact of the change. You can see the original price, the new price, and the calculated increase for each affected product. This is particularly useful for business operations where you need to communicate changes or maintain detailed audit trails without additional queries.

The ability to perform calculations with both old and new values in the RETURNING clause means you can generate rich, informative output without additional queries.

Let's take this a step further by adding conditional logic to the RETURNING clause to provide business intelligence directly in the output:

```sql
-- Reduce inventory for a flash sale
UPDATE inventory
SET
    quantity = GREATEST(quantity - 15, 0),  -- Never go below 0
    unit_price = unit_price * 0.85,        -- 15% discount
    last_updated = CURRENT_TIMESTAMP
WHERE category = 'Electronics' AND quantity > 20
RETURNING
    product_name,
    old.quantity AS stock_before,
    new.quantity AS stock_after,
    old.unit_price AS regular_price,
    new.unit_price AS sale_price,
    CASE
        WHEN old.quantity - new.quantity > 0
        THEN old.quantity - new.quantity
        ELSE 0
    END AS units_sold,
    CASE
        WHEN new.quantity < 10
        THEN 'LOW_STOCK_WARNING'
        ELSE 'NORMAL'
    END AS stock_status;
```

This example showcases how the enhanced RETURNING clause can provide comprehensive business intelligence in a single operation. You're not just updating data; you're generating a detailed report of what changed, including calculated fields and business logic conditions.

## DELETE Operations: Capturing What Was Lost

DELETE operations with enhanced RETURNING are particularly useful for audit trails and "soft delete" implementations.

When deleting data, you often want to preserve information about what was removed:

```sql
-- Remove discontinued products
DELETE FROM inventory
WHERE quantity = 0 AND category = 'Furniture'
RETURNING
    old.product_id,
    old.product_name,
    old.unit_price AS final_price,
    old.last_updated AS last_activity,
    'DELETED' AS status,
    CURRENT_TIMESTAMP AS deletion_time;
```

In this example, `old` contains all the information from the deleted row, while `new` would be NULL. However, you can still use expressions and constants in your RETURNING clause to add context to the deletion.

Another approach might involve implementing a soft delete pattern:

```sql
-- Add a status column for soft deletes
ALTER TABLE inventory ADD COLUMN status VARCHAR(10) DEFAULT 'active';

-- Implement soft delete with change tracking
UPDATE inventory
SET
    status = 'soft_d',
    last_updated = CURRENT_TIMESTAMP
WHERE quantity < 150 AND category = 'Electronics'
RETURNING
    product_name,
    old.status AS previous_status,
    new.status AS current_status,
    old.quantity AS remaining_stock,
    EXTRACT(DAYS FROM (CURRENT_TIMESTAMP - old.last_updated)) AS days_since_last_update;
```

This approach preserves the data while marking it as discontinued, and the enhanced RETURNING clause provides a complete picture of what changed.

## Custom Alias Names

One of the thoughtful design aspects of PostgreSQL 18's enhanced RETURNING clause is the ability to customize the `old` and `new` alias names. This is particularly important when these reserved words conflict with your existing column names or when working within trigger functions where `OLD` and `NEW` already have special meanings.

The syntax for custom aliases uses a `WITH` clause that precedes your RETURNING expressions:

```sql
-- Use custom aliases for clarity
UPDATE inventory
SET quantity = quantity * 2
WHERE product_id = 1
RETURNING WITH (OLD AS before, NEW AS after)
    product_name,
    before.quantity AS previous_amount,
    after.quantity AS current_amount,
    after.quantity - before.quantity AS increase;
```

This feature ensures that the enhanced RETURNING clause doesn't break existing code and provides flexibility in naming that makes your SQL more readable and self-documenting.

Custom aliases are particularly valuable in complex applications where you might have columns named "old" or "new", or when you want to use more domain-specific terminology:

```sql
-- Domain-specific aliases for financial operations
UPDATE inventory
SET unit_price = unit_price * 1.08  -- Add 8% tax
WHERE category = 'Electronics'
RETURNING WITH (OLD AS pre_tax, NEW AS post_tax)
    product_name,
    pre_tax.unit_price AS base_price,
    post_tax.unit_price AS taxed_price,
    post_tax.unit_price - pre_tax.unit_price AS tax_amount;
```

This allows you to maintain clarity in your SQL statements while using the useful capabilities of the improved RETURNING clause.

## Performance Considerations

While the enhanced RETURNING clause is useful, it's important to understand its performance implications. PostgreSQL needs to maintain both the old and new row versions in memory during the operation, which can impact performance for large batch operations.

For operations affecting many rows, consider processing in batches:

```sql
-- Process large updates in batches
UPDATE inventory
SET unit_price = unit_price * 1.05
WHERE product_id BETWEEN 1 AND 1000  -- Process 1000 records at a time
RETURNING old.unit_price, new.unit_price;
```

When using the enhanced RETURNING clause in WHERE clauses or complex expressions, make sure you have appropriate indexes on the columns involved:

```sql
-- Ensure efficient access patterns
CREATE INDEX idx_inventory_category_quantity ON inventory(category, quantity);

-- Efficient query with indexed columns
UPDATE inventory
SET quantity = quantity + 10
WHERE category = 'Electronics' AND quantity < 150
RETURNING old.quantity, new.quantity;
```

This ensures that your DML operations remain performant even as you take advantage of the enhanced RETURNING clause.

## Best Practices

When using the enhanced RETURNING clause, follow these guidelines for optimal results:

**Be selective with returned columns**. While `RETURNING old.*, new.*` is convenient, it can impact performance and memory usage. Return only the columns you actually need:

```sql
-- Good: Specific columns
RETURNING old.quantity, new.quantity, new.unit_price

-- Less optimal for large tables: All columns
RETURNING old.*, new.*
```

**Use meaningful expressions** to add value to your returned data:

```sql
-- Add business logic to your RETURNING clause
RETURNING
    product_name,
    old.quantity,
    new.quantity,
    CASE
        WHEN new.quantity < 10 THEN 'Reorder Required'
        WHEN new.quantity < old.quantity THEN 'Stock Reduced'
        ELSE 'Stock Increased'
    END AS inventory_status;
```

**Handle NULL values appropriately** when working with operations where old or new values might not exist:

```sql
-- Safe handling of potential NULLs
RETURNING
    product_name,
    COALESCE(old.quantity, 0) AS safe_old_quantity,
    new.quantity;
```

## Summary

PostgreSQL 18's enhanced RETURNING clause is a major improvement in data manipulation. It gives you access to both old and new row values in a single statement, removing the need for workarounds like extra queries or complex triggers.

This makes it much easier to build audit logs, track changes, and understand how data evolves over time. Whether you're working on financial systems, inventory tools, or any application that relies on clear change tracking, this feature gives you a clean and efficient solution. It reflects PostgreSQL's ongoing focus on practical, developer-friendly features that solve real problems.
