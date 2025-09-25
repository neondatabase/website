---
title: 'PostgreSQL 18 Virtual Generated Columns: Compute On-Demand'
page_title: 'PostgreSQL 18 Virtual Generated Columns: Compute On-Demand'
page_description: 'In this tutorial, you will learn about PostgreSQL 18 virtual generated columns, which are now the default option. These columns compute their values on-demand during query execution, saving storage space and providing automatic calculations without the overhead of stored values.'
ogImage: ''
updatedOn: '2025-06-29T05:50:00+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL 18 Enhanced EXPLAIN'
  slug: 'postgresql-18/enhanced-explain'
nextLink:
  title: 'PostgreSQL 18 UUIDv7 Support'
  slug: 'postgresql-18/uuidv7-support'
---

**Summary**: Learn how PostgreSQL 18 makes virtual generated columns the default, enabling compute-on-demand columns that save storage space while providing automatic calculations without the overhead of stored values.

## Introduction to Virtual Generated Columns

PostgreSQL 18 introduces a fundamental change to how generated columns work by making **virtual generated columns** the default option. This represents a significant shift from previous versions where generated columns were required to be stored (STORED) and took up disk space like regular columns.

Virtual generated columns compute their values just-in-time during query execution instead of storing pre-calculated values on disk. This approach offers several advantages: reduced storage requirements, faster INSERT and UPDATE operations, and always up-to-date calculated values without the overhead of maintaining stored data.

Additionally, PostgreSQL 18 enables logical replication of stored generated columns, providing enhanced flexibility for replication scenarios where calculated values need to be replicated across database instances.

## Sample Database Setup

Let's create a sample database schema which we can use to demonstrate the capabilities of virtual generated columns in PostgreSQL 18.

```sql
-- Create the main products table
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    weight_kg DECIMAL(6,2),
    length_cm INTEGER,
    width_cm INTEGER,
    height_cm INTEGER,
    tax_rate DECIMAL(5,4) DEFAULT 0.0875,
    discount_rate DECIMAL(5,4) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders and order items for more complex examples
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    order_date DATE DEFAULT CURRENT_DATE,
    shipping_address TEXT,
    order_status VARCHAR(20) DEFAULT 'pending'
);

CREATE TABLE order_items (
    item_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(order_id),
    product_id INTEGER REFERENCES products(product_id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL
);

-- Insert sample data
INSERT INTO products (name, category, base_price, cost, weight_kg, length_cm, width_cm, height_cm, tax_rate, discount_rate)
VALUES
    ('Laptop Pro 15', 'Electronics', 1299.99, 800.00, 2.1, 34, 24, 2, 0.0875, 0.05),
    ('Wireless Mouse', 'Electronics', 49.99, 15.00, 0.15, 12, 7, 4, 0.0875, 0.10),
    ('Desk Chair', 'Furniture', 299.99, 120.00, 15.5, 65, 65, 110, 0.0625, 0.00),
    ('Coffee Mug', 'Kitchen', 12.99, 3.50, 0.4, 10, 10, 12, 0.0875, 0.15),
    ('Book: PostgreSQL Guide', 'Books', 39.99, 8.00, 0.6, 23, 18, 3, 0.00, 0.00);

INSERT INTO orders (customer_id, order_date, shipping_address, order_status)
VALUES
    (1001, '2024-12-01', '123 Main St, City, State', 'shipped'),
    (1002, '2024-12-05', '456 Oak Ave, City, State', 'processing'),
    (1003, '2024-12-07', '789 Pine Rd, City, State', 'pending');

INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES
    (1, 1, 1, 1299.99),
    (1, 2, 2, 49.99),
    (2, 3, 1, 299.99),
    (2, 4, 3, 12.99),
    (3, 5, 2, 39.99);
```

This creates a basic e-commerce schema with products, orders, and order items.

## Understanding Virtual vs Stored Generated Columns

The key difference between virtual and stored generated columns lies in when and where the computation happens.

### Stored Generated Columns (Traditional)

Before PostgreSQL 18, generated columns were required to be STORED, meaning values were calculated during INSERT or UPDATE operations and saved to disk:

```sql
-- Pre-PostgreSQL 18 approach: Required STORED keyword
ALTER TABLE products
ADD COLUMN profit_margin DECIMAL(8,4)
GENERATED ALWAYS AS ((base_price - cost) / base_price) STORED;
```

### Virtual Generated Columns (PostgreSQL 18 Default)

PostgreSQL 18 makes virtual generated columns the default, computing values on-demand during query execution.

In this case, you do not need to specify the STORED keyword, as virtual columns are computed dynamically:

```sql
-- PostgreSQL 18: Virtual is now the default
ALTER TABLE products
ADD COLUMN selling_price DECIMAL(10,2)
GENERATED ALWAYS AS (
    base_price * (1 - discount_rate) * (1 + tax_rate)
);

-- Explicitly specifying virtual (optional in PostgreSQL 18)
ALTER TABLE products
ADD COLUMN profit_amount DECIMAL(10,2)
GENERATED ALWAYS AS (base_price - cost) VIRTUAL;
```

The above example creates a virtual column `selling_price` that calculates the selling price based on the base price, discount rate, and tax rate. The `profit_amount` column is also virtual, calculating the profit based on base price and cost. You can query these columns without any additional storage overhead:

```sql
SELECT
    name,
    base_price,
    selling_price,
    profit_amount
FROM products
WHERE category = 'Electronics';
```

This query will compute the `selling_price` and `profit_amount` dynamically without storing them on disk, saving space and ensuring the values are always current.

### Comparing the Two Approaches

Let's examine how both approaches work with a practical example.

We will add both a stored and a virtual generated column to the `products` table to compare their behavior:

```sql
-- Add both types for comparison
ALTER TABLE products
ADD COLUMN stored_volume_cm3 INTEGER
GENERATED ALWAYS AS (length_cm * width_cm * height_cm) STORED,
ADD COLUMN virtual_volume_cm3 INTEGER
GENERATED ALWAYS AS (length_cm * width_cm * height_cm);
```

The above SQL adds a stored generated column `stored_volume_cm3` that calculates the volume in cubic centimeters and stores it on disk, while `virtual_volume_cm3` is a virtual column that computes the same value on-the-fly.

Now, let's see how they behave:

```sql
-- Check storage impact
SELECT pg_size_pretty(pg_total_relation_size('products')) as table_size;
```

This will show the size of the `products` table, including the storage used by the stored generated column. The virtual column does not contribute to the disk size, as it is computed dynamically.

You can query both columns to see their values:

```sql
-- View the calculated values
SELECT
    name,
    base_price,
    selling_price,
    profit_amount,
    stored_volume_cm3,
    virtual_volume_cm3
FROM products
WHERE category = 'Electronics';
```

## Benefits of Virtual Generated Columns

Now that we understand the basics, let's explore the benefits of using virtual generated columns in PostgreSQL 18.

### Storage Space Savings

Virtual columns consume no disk storage, leading to significant space savings, especially for large datasets with complex calculations. This is particularly useful in scenarios where calculated values are not frequently queried or indexed.

To see the storage impact, let's add some virtual columns to our `products` table:

```sql
-- Add multiple virtual calculations without storage overhead
ALTER TABLE products
ADD COLUMN shipping_weight_lbs DECIMAL(6,2)
GENERATED ALWAYS AS (weight_kg * 2.20462),
ADD COLUMN price_per_kg DECIMAL(10,2)
GENERATED ALWAYS AS (base_price / weight_kg),
ADD COLUMN margin_percentage DECIMAL(5,2)
GENERATED ALWAYS AS (((base_price - cost) / base_price) * 100),
ADD COLUMN discounted_price DECIMAL(10,2)
GENERATED ALWAYS AS (base_price * (1 - discount_rate));

-- Check storage impact - table size remains unchanged!
SELECT pg_size_pretty(pg_total_relation_size('products')) as size;
```

This will show that the size of the `products` table remains unchanged, even after adding multiple virtual columns.

### Always Current Values

Virtual columns automatically reflect changes to underlying data. When you update the base data, the virtual columns are recalculated on-the-fly, ensuring that you always get the most up-to-date values without needing to manage stored data.

You can test this by updating a product's base price and discount rate:

```sql
-- Update base price and see automatic recalculation
UPDATE products
SET base_price = 1399.99, discount_rate = 0.10
WHERE name = 'Laptop Pro 15';

-- Virtual columns automatically show updated values
SELECT
    name,
    base_price,
    discount_rate,
    selling_price,
    profit_amount
FROM products
WHERE name = 'Laptop Pro 15';
```

This query will show the updated `selling_price` and `profit_amount` based on the new base price and discount rate, which are calculated dynamically.

### Faster Data Modification Operations

INSERT and UPDATE operations are faster with virtual columns because calculations are deferred:

```sql
-- Fast insertion - no generation calculations during INSERT
INSERT INTO products (name, category, base_price, cost, weight_kg, length_cm, width_cm, height_cm)
VALUES ('Gaming Keyboard', 'Electronics', 129.99, 45.00, 1.2, 45, 18, 4);

-- Virtual columns are available immediately for queries
SELECT
    name,
    selling_price,
    profit_amount,
    margin_percentage
FROM products
WHERE name = 'Gaming Keyboard';
```

With a small overhead for the first read, subsequent queries will benefit from the fact that no additional storage or recalculation is needed.

## Performance Considerations

While virtual generated columns provide many benefits, there are performance considerations to keep in mind. Since values are computed on-the-fly, complex calculations can impact query performance, especially if they involve multiple columns or subqueries.

Let's explore some examples of how to optimize performance when using virtual generated columns.

### CPU vs Storage Trade-off

Virtual columns trade storage space for computation time. For simple calculations, this is usually beneficial, but complex expressions can impact query performance.

Let's look at an example so we can compare the performance of simple versus complex virtual columns:

```sql
-- Simple calculation (low overhead)
ALTER TABLE products
ADD COLUMN simple_calc DECIMAL(10,2)
GENERATED ALWAYS AS (base_price * 1.1);

-- Complex calculation (higher overhead)
ALTER TABLE products
ADD COLUMN complex_calc DECIMAL(10,2)
GENERATED ALWAYS AS (
    CASE
        WHEN category = 'Electronics' THEN
            base_price * (1 + tax_rate) * (1 - GREATEST(discount_rate, 0.05))
        WHEN category = 'Books' THEN
            base_price * (1 - discount_rate)
        ELSE
            base_price * (1 + tax_rate) * (1 - discount_rate)
    END
);
```

In this example, `simple_calc` is a straightforward calculation that will perform well, while `complex_calc` involves conditional logic and multiple columns, which may slow down queries that access it.

You can analyze the performance impact using the `EXPLAIN` command:

```sql
EXPLAIN (ANALYZE)
SELECT
    name,
    simple_calc,
    complex_calc
FROM products
WHERE category = 'Electronics'
ORDER BY complex_calc DESC;
```

This will show you the execution plan and time taken for the query, allowing you to identify any performance bottlenecks.

## Limitations and Restrictions

### Indexing Limitations

Virtual columns cannot have indexes directly created on them:

```sql
-- This will fail with virtual columns
-- CREATE INDEX idx_virtual_price ON products(selling_price);
```

If you were to try creating an index on a virtual column, PostgreSQL will raise an error indicating that virtual columns cannot be indexed directly.

As a workaround, you can use expression indexes or stored generated columns:

```sql
-- Workaround: Use expression indexes
CREATE INDEX idx_selling_price_expr ON products(
    (base_price * (1 - discount_rate) * (1 + tax_rate))
);

-- Or use stored generated columns when indexing is required
ALTER TABLE products
ADD COLUMN indexed_selling_price DECIMAL(10,2)
GENERATED ALWAYS AS (base_price * (1 - discount_rate) * (1 + tax_rate)) STORED;

CREATE INDEX idx_stored_selling_price ON products(indexed_selling_price);
```

This allows you to index the calculated values while still benefiting from the virtual column's compute-on-demand nature.

### Logical Replication Limitations

Virtual generated columns cannot be replicated through logical replication. However, now stored generated columns can be replicated.

If you need to replicate calculated values, you must use stored generated columns:

```sql
-- Only stored generated columns can be logically replicated
ALTER TABLE products
ADD COLUMN replicable_total DECIMAL(10,2)
GENERATED ALWAYS AS (base_price * (1 - discount_rate) * (1 + tax_rate)) STORED;
```

## Logical Replication of Stored Generated Columns

PostgreSQL 18 introduces the ability to logically replicate stored generated columns:

```sql
-- Create a publication that includes stored generated columns
CREATE PUBLICATION pub_products
FOR TABLE products
WITH (publish_generated_columns = stored);

-- Or specify it for specific tables only
CREATE PUBLICATION pub_products_selective
FOR TABLE products (name, base_price, replicable_total);
```

This flexibility allows you to replicate calculated values to systems that may not support generated columns or need different calculation logic.

## Best Practices and Recommendations

When designing your database schema with virtual generated columns, consider the following best practices:

**Choose virtual columns when:**

- Storage space is a concern
- Calculations are relatively simple
- Values change frequently
- No indexing is required on the calculated values

**Choose stored columns when:**

- You need to create indexes on calculated values
- Calculations are computationally expensive
- Query performance is more critical than storage space
- You need to replicate calculated values

## Summary

PostgreSQL 18 introduces virtual generated columns as the new default, allowing values to be computed at query time instead of being stored on disk. This change improves storage efficiency, keeps calculations always up to date, and reduces overhead on data writes.

While virtual columns can't be indexed or replicated, they offer flexible support for dynamic business logic. For use cases requiring indexing or logical replication, stored generated columns remain available. Together, these enhancements give developers more control over performance, storage, and schema design.
