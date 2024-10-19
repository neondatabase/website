---
createdAt: 2024-03-30T03:12:49.000Z
title: 'Creating a PostgreSQL Trigger with a When Condition'
redirectFrom: 
            - /postgresql/postgresql-triggers/postgresql-trigger-when-condition
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to create a conditional trigger that fires only when a condition is true.

In PostgreSQL, a trigger is a database object that automatically executes a function when `INSERT`, `UPDATE`, `DELETE`, or `TRUNCATE` event occurs on a table.

Sometimes, you want the trigger to be activated only when a specific condition is met. To do that, you specify a boolean condition in the `WHEN` clause of the [CREATE TRIGGER](/postgresql/postgresql-triggers/creating-first-trigger-postgresql) statement, like so:

```sql
CREATE TRIGGER trigger_name
ON table_name
WHEN condition
EXECUTE FUNCTION function_name(arguments);
```

In this syntax, the `condition` is a boolean expression. If the `condition` is true, the trigger is fired; otherwise, the trigger will not be activated.

In row-level triggers, you can access the old/new values of columns of the row within the condition. However, in statement-level triggers, you do not have access to column values.

## PostgreSQL Trigger When Condition example

First, [create a table](/postgresql/postgresql-create-table) called `orders` to store order data:

```sql
CREATE TABLE orders (
    order_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id INT NOT NULL,
    total_amount NUMERIC NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL
);
```

Second, create another table called `customer_stats` to store the total spent amount by customers:

```sql
CREATE TABLE customer_stats (
    customer_id INT PRIMARY KEY,
    total_spent NUMERIC NOT NULL DEFAULT 0
);
```

Third, create an [AFTER INSERT trigger](/postgresql/postgresql-triggers/postgresql-after-insert-trigger) that inserts a row into the `customer_stats` table when a new row is inserted into the `orders` table:

```sql
CREATE OR REPLACE FUNCTION insert_customer_stats()
RETURNS TRIGGER
AS $$
BEGIN
   INSERT INTO customer_stats (customer_id)
   VALUES (NEW.customer_id);
   RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER insert_customer_stats_trigger
AFTER INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION insert_customer_stats();
```

Fourth, define an `AFTER UPDATE` trigger on the `orders` table with a condition:

```sql
CREATE OR REPLACE FUNCTION update_customer_stats()
RETURNS TRIGGER
AS
$$
BEGIN
    IF NEW.status = 'completed' THEN
        -- Update the total_spent for the customer
        UPDATE customer_stats
        SET total_spent = total_spent + NEW.total_amount
        WHERE customer_id = NEW.customer_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_customer_stats_trigger
AFTER UPDATE ON orders
FOR EACH ROW
WHEN (OLD.status <> 'completed' AND NEW.status = 'completed')
EXECUTE FUNCTION update_customer_stats();
```

The `AFTER UPDATE` trigger fires only when the status of the row changes from non-completed state to completed.

Fifth, [insert some rows](/postgresql/postgresql-insert-multiple-rows) into the `orders` table:

```sql
INSERT INTO orders (customer_id, total_amount, status)
VALUES
    (1, 100, 'pending'),
    (2, 200, 'pending');
```

The `AFTER INSERT` trigger fires and insert rows into the `customer_stats` table.

Sixth, change the order statuses of customer id 1 and 2 to `completed`:

```sql
UPDATE order
SET status = 'completed'
WHERE customer_id IN (1,2);
```

The `AFTER UPDATE` trigger fires and updates the `total_spent` column in the `customer_stats` table.

Finally, retrieve the data from the `customer_stats` table:

```sql
SELECT * FROM customer_stats;
```

Output:

```
 customer_id | total_spent
-------------+-------------
           1 |         100
           2 |         200
(2 rows)
```

## Summary

- Specify a condition in the `WHEN` clause of the `CREATE TRIGGER` statement to instruct PostgreSQL to fire the trigger when the condition is true.
