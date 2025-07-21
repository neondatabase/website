---
title: 'PostgreSQL MERGE Statement'
page_title: 'PostgreSQL MERGE Statement'
page_description: 'In this tutorial, you will learn how to use the PostgreSQL MERGE statement to conditionally insert, update, and delete rows of a table.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-merge/'
ogImage: ''
updatedOn: '2024-03-27T06:10:50+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL UPSERT using INSERT ON CONFLICT Statement'
  slug: 'postgresql-tutorial/postgresql-upsert'
nextLink:
  title: 'PostgreSQL Transaction'
  slug: 'postgresql-tutorial/postgresql-transaction'
tag: new
---

**Summary**: In this tutorial, you will learn how to use the PostgreSQL `MERGE` statement to conditionally insert, update, and delete rows of a table.

## Introduction to the PostgreSQL MERGE statement

Have you ever needed to update a table but weren't sure whether to insert new records or update existing ones? PostgreSQL's `MERGE` command solves this common problem. Think of `MERGE` as a smart helper that can look at your data and decide whether to add new records, update existing ones, or even delete records, all in a single command.

## Basic Concepts

Before we dive into `MERGE`, let's understand some basic terms:

- **Target Table**: The table you want to modify
- **Source Table**: The table containing your new or updated data
- **Match Condition**: The rule that determines if records match between your tables

## Basic MERGE Syntax

Here's the basic structure of a `MERGE` command:

```sql
MERGE INTO target_table
USING source_table
ON match_condition
WHEN MATCHED AND condition THEN
    UPDATE SET column1 = value1, column2 = value2
WHEN MATCHED AND NOT condition THEN
    DELETE
WHEN NOT MATCHED THEN
    INSERT (column1, column2) VALUES (value1, value2)
RETURNING merge_action(), target_table.*;
```

This `MERGE` statement performs three conditional actions on `target_table` based on rows from `source_table`:

1. **Update rows**: If a match is found (`ON match_condition`) and `condition` is true, it updates `column1` and `column2` in `target_table`.
2. **Delete rows**: If a match is found but `condition` is false, it deletes the matching rows in `target_table`.
3. **Insert rows**: If no match is found, it inserts new rows into `target_table` using values from `source_table`.
4. The `RETURNING` clause provides details of the operation (`merge_action()`) and the affected rows.

## Key Features in PostgreSQL 17

The new RETURNING clause support in PostgreSQL 17 offers several advantages:

1. **Action Tracking**: The `merge_action()` function tells you exactly what happened to each row
2. **Complete Row Access**: You can return both old and new values for affected rows
3. **Immediate Feedback**: No need for separate queries to verify the results

## Setting Up Our Example

Let's create a sample database tracking a company's products and their inventory status:

```sql
-- Create the main products table
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name TEXT UNIQUE,
    price DECIMAL(10,2),
    stock INTEGER,
    status TEXT,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some initial data
INSERT INTO products (name, price, stock, status) VALUES
    ('Laptop', 999.99, 50, 'active'),
    ('Keyboard', 79.99, 100, 'active'),
    ('Mouse', 29.99, 200, 'active');

-- Create a table for our updates
CREATE TABLE product_updates (
    name TEXT,
    price DECIMAL(10,2),
    stock INTEGER,
    status TEXT
);

-- Insert mixed update data (new products, updates, and discontinuations)
INSERT INTO product_updates VALUES
    ('Laptop', 1099.99, 75, 'active'),      -- Update: price and stock change
    ('Monitor', 299.99, 30, 'active'),      -- Insert: new product
    ('Keyboard', NULL, 0, 'discontinued'),  -- Delete: mark as discontinued
    ('Headphones', 89.99, 50, 'active');    -- Insert: another new product
```

## Using MERGE with RETURNING

Now let's see how PostgreSQL 17's enhanced `MERGE` command can handle all three operations (`INSERT`, `UPDATE`, `DELETE`) while providing detailed feedback through the `RETURNING` clause:

```sql
MERGE INTO products p
USING product_updates u
ON p.name = u.name
WHEN MATCHED AND u.status = 'discontinued' THEN
    DELETE
WHEN MATCHED AND u.status = 'active' THEN
    UPDATE SET
        price = COALESCE(u.price, p.price),
        stock = u.stock,
        status = u.status,
        last_updated = CURRENT_TIMESTAMP
WHEN NOT MATCHED AND u.status = 'active' THEN
    INSERT (name, price, stock, status)
    VALUES (u.name, u.price, u.stock, u.status)
RETURNING
    merge_action() as action,
    p.product_id,
    p.name,
    p.price,
    p.stock,
    p.status,
    p.last_updated;
```

## Understanding the Output

The `RETURNING` clause will provide detailed information about each operation:

```
 action  | product_id |    name    |  price   | stock |   status    |      last_updated
---------+------------+------------+----------+-------+-------------+------------------------
 UPDATE  |     1      | Laptop     | 1099.99  |   75  | active      | 2024-12-04 17:41:58.226807
 INSERT  |     4      | Monitor    |  299.99  |   30  | active      | 2024-12-04 17:41:58.226807
 DELETE  |     2      | Keyboard   |   79.99  |  100  | active      | 2024-12-04 17:41:47.816064
 INSERT  |     5      | Headphones |   89.99  |   50  | active      | 2024-12-04 17:41:58.226807
```

Let's break down what happened:

1. **`UPDATE`**: The Laptop's price and stock were updated
2. **`DELETE`**: The Keyboard is deleted from the products table
3. **`INSERT`**: New Monitor and Headphones products were added

We can confirm the changes by querying the products table:

```sql
SELECT * FROM products
ORDER BY product_id;
```

```
 product_id |    name    |  price   | stock |   status    |      last_updated
------------+------------+----------+-------+-------------+------------------------
          1 | Laptop     | 1099.99  |   75  | active      | 2024-12-04 17:41:58.226807
          3 | Mouse      |   29.99  |  200  | active      | 2024-12-04 17:41:47.816064
          4 | Monitor    |  299.99  |   30  | active      | 2024-12-04 17:41:58.226807
          5 | Headphones |   89.99  |   50  | active      | 2024-12-04 17:41:58.226807
```

## Advanced Usage with Conditions

You can add more complex conditions to your `MERGE` statement:

```sql
MERGE INTO products p
USING (
    SELECT
        name,
        price,
        stock,
        status,
        CASE
            WHEN price IS NULL AND status = 'discontinued' THEN 'DELETE'
            WHEN stock = 0 THEN 'OUT_OF_STOCK'
            ELSE status
        END as action_type
    FROM product_updates
) u
ON p.name = u.name
WHEN MATCHED AND u.action_type = 'DELETE' THEN
    DELETE
WHEN MATCHED AND u.action_type = 'OUT_OF_STOCK' THEN
    UPDATE SET
        status = 'inactive',
        stock = 0,
        last_updated = CURRENT_TIMESTAMP
WHEN MATCHED THEN
    UPDATE SET
        price = COALESCE(u.price, p.price),
        stock = u.stock,
        status = u.status,
        last_updated = CURRENT_TIMESTAMP
WHEN NOT MATCHED AND u.action_type != 'DELETE' THEN
    INSERT (name, price, stock, status)
    VALUES (u.name, u.price, u.stock, u.status)
RETURNING
    merge_action() as action,
    p.*,
    u.action_type;
```

## Best Practices

1. **Handle Source Data Carefully**:
   - Validate input data before the `MERGE`
   - Use subqueries to transform or clean data
   - Consider using CTEs for complex data preparation

2. **Leverage RETURNING for Validation**:
   - Include the `merge_action()` for operation tracking
   - Consider returning both old and new values for logging purposes and validation

## Common Pitfalls to Avoid

1. **Ambiguous Matches**: Ensure your `ON` clause creates unique matches
2. **NULL Handling**: Use `COALESCE` or `IS NOT DISTINCT FROM` for `NULL` values
3. **Missing Conditions**: Always handle all possible cases in your `WHEN` clauses

## Conclusion

PostgreSQL 17's enhanced `MERGE` command with `RETURNING` clause support provides a powerful tool for data synchronization and maintenance. The ability to perform multiple operations in a single statement while getting immediate feedback makes it an invaluable feature for modern applications.

## Frequently Asked Questions (FAQ)

<DefinitionList>
What is the purpose of the `MERGE` statement in PostgreSQL?
: The `MERGE` statement allows you to conditionally `INSERT`, `UPDATE`, or `DELETE` rows in a target table based on the presence of matching records in a source table. This consolidates multiple operations into a single, efficient command.

When was the `MERGE` statement introduced in PostgreSQL?
: The `MERGE` statement was officially introduced in PostgreSQL version 15, released in October 2022.

How does the `MERGE` statement determine which operation to perform?
: The `MERGE` statement uses a specified `ON` condition to match rows between the source and target tables. Based on whether a match is found (`MATCHED`) or not (`NOT MATCHED`), and any additional conditions, it executes the corresponding `INSERT`, `UPDATE`, `DELETE`, or `DO NOTHING` actions.

Can I use the `MERGE` statement with views in PostgreSQL?
: Yes, starting from PostgreSQL 17, the `MERGE` command can be used with updatable views. For `MERGE` to work with views, the views must be consistent:
: Trigger-updatable views need `INSTEAD OF` triggers for all actions.
: Auto-updatable views cannot have any triggers.
: Mixing types of views or using rule-updatable views is not allowed.

What privileges are required to execute a `MERGE` statement?
: To execute a `MERGE` statement, you need:
: `SELECT` privilege on the source table or query.
: Appropriate privileges on the target table:
: `INSERT` privilege for insert actions.
: `UPDATE` privilege for update actions.
: `DELETE` privilege for delete actions.

Is the `MERGE` statement atomic in PostgreSQL?
: Yes, the `MERGE` statement in PostgreSQL is atomic. This means all specified actions (`INSERT`, `UPDATE`, `DELETE`) are performed as a single unit. If an error occurs during execution, the entire operation is rolled back, ensuring data integrity.

Can I use the `RETURNING` clause with the `MERGE` statement?
: Yes, starting from PostgreSQL 17, the `MERGE` statement supports the `RETURNING` clause. This allows you to retrieve information about the rows affected by the `MERGE` operation, including the specific action performed (`INSERT`, `UPDATE`, or `DELETE`) on each row.

How does the `MERGE` statement handle concurrent data modifications?
: The `MERGE` statement ensures data consistency during concurrent operations by acquiring the necessary locks on the target table. This prevents other transactions from modifying the same rows simultaneously, thereby avoiding conflicts.

Are there any performance considerations when using the `MERGE` statement?
: While the `MERGE` statement simplifies complex operations into a single command, it's essential to ensure that the `ON` condition is well-optimized, typically by indexing the columns involved. Proper indexing can significantly enhance performance.

Can I perform different actions based on additional conditions within the `MERGE` statement?
: Yes, the `MERGE` statement allows for multiple `WHEN` clauses with additional conditions. This enables you to specify different actions (`INSERT`, `UPDATE`, `DELETE`, or `DO NOTHING`) based on various criteria, providing fine-grained control over the operation.
</DefinitionList>
