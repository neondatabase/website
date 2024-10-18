---
title: 'PostgreSQL UPSERT using INSERT ON CONFLICT Statement'
redirectFrom: 
            - /docs/postgresql/postgresql-upsert
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL upsert feature to insert a new row into a table if the row does not exist, or update an existing row if it already exists.



## Introduction to the PostgreSQL UPSERT Statement



Upsert is a combination of [update](/docs/postgresql/postgresql-update/) and [insert](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert). The upsert allows you to update an existing row or insert a new one if it doesn't exist.



PostgreSQL does not have the `UPSERT` statement but it supports the upsert operation via the `INSERT...ON CONFLICT` statement.



If you use PostgreSQL 15 or later, you can use the [MERGE](/docs/postgresql/postgresql-merge) statement which is equivalent to the `UPSERT` statement.



Here's the basic syntax of the `INSERT...ON CONFLICT` statement:



```
INSERT INTO table_name (column1, column2, ...)
VALUES (value1, value2, ...)
ON CONFLICT (conflict_column)
DO NOTHING | DO UPDATE SET column1 = value1, column2 = value2, ...;
```



In this syntax:



- `table_name`: This is the name of the table into which you want to insert data.
- -
- `(column1, column2, ...)`: The list of columns you want to insert values into the table.
- -
- `VALUES(value1, value2, ...)`: The values you want to insert into the specified columns `(column1, column2, ...)`.
- -
- `ON CONFLICT (conflict_column):` This clause specifies the conflict target, which is the [unique constraint](/docs/postgresql/postgresql-unique-constraint/) or [unique index](https://www.postgresqltutorial.com/postgresql-indexes/postgresql-unique-index) that may cause a conflict.
- -
- `DO NOTHING`: This instructs PostgreSQL to do nothing when a conflict occurs.
- -
- `DO UPDATE`: This performs an update if a conflict occurs.
- -
- `SET column = value1, column = value2, ...`: This list of the columns to be updated and their corresponding values in case of conflict.
- 


How the `INSERT ... ON CONFLICT` statement works.



First, the `ON CONFLICT` clause identifies the conflict target which is usually a unique constraint (or a unique index). If the data that you insert violates the constraint, a conflict occurs.



Second, the `DO UPDATE` instructs PostgreSQL to update existing rows or do nothing rather than aborting the entire operation when a conflict occurs.



Third, the `SET` clause defines the columns and values to update. You can use new values or reference the values you attempted to insert using the `EXCLUDED` keyword.



## PostgreSQL UPSERT examples



The following statements create the `inventory` table and [insert data into it](/docs/postgresql/postgresql-insert):



```
CREATE TABLE inventory(
   id INT PRIMARY KEY,
   name VARCHAR(255) NOT NULL,
   price DECIMAL(10,2) NOT NULL,
   quantity INT NOT NULL
);

INSERT INTO inventory(id, name, price, quantity)
VALUES
	(1, 'A', 15.99, 100),
	(2, 'B', 25.49, 50),
	(3, 'C', 19.95, 75)
RETURNING *;
```



Output:



```
 id | name | price | quantity
----+------+-------+----------
  1 | A    | 15.99 |      100
  2 | B    | 25.49 |       50
  3 | C    | 19.95 |       75
(3 rows)


INSERT 0 3
```



The `inventory` table contains information about various products, including their names, prices, and quantities in stock.



Suppose you've received an updated list of products with new prices, and now you need to update the inventory accordingly.



In this case, the upsert operation can be handy to handle the following situations:



- **Updating existing products**. If a product already exists in the `inventory` table, you want to update its price and quantity with the new information.
- -
- **Insert new products**. If a product is not in the `inventory` table, you want to insert it into the table.
- 


### 1) Basic PostgreSQL INSERT ... ON CONFLICT statement example



The following example uses the `INSERT ... ON CONFLICT` statement to insert a new row into the `inventory` table:




```
INSERT INTO inventory (id, name, price, quantity)
VALUES (1, 'A', 16.99, 120)
ON CONFLICT(id)
DO UPDATE SET
  price = EXCLUDED.price,
  quantity = EXCLUDED.quantity;
```





Output:





```
INSERT 0 1
```





In this example, we attempt to insert a new row into the `inventory` table.





However, the `inventory` table already has a row with id 1, therefore, a conflict occurs.





The `DO UPDATE` changes the price and quantity of the product to the new values being inserted. The `EXCLUDED` allows you to access the new values.





The following statement verifies the update:





```
SELECT * FROM inventory
WHERE id = 1;
```





Output:





```
 id | name | price | quantity
----+------+-------+----------
  1 | A    | 16.99 |      120
(1 row)
```





### 2) Inserting data example





The following example uses the `INSERT ... ON CONFLICT` statement to insert a new row into the `inventory` table:





```
INSERT INTO inventory (id, name, price, quantity)
VALUES (4, 'D', 29.99, 20)
ON CONFLICT(id)
DO UPDATE SET
  price = EXCLUDED.price,
  quantity = EXCLUDED.quantity;
```





Output:





```
INSERT 0 1
```





In this case, the statement [inserts a new row](https://www.postgresqltutorial.com/postgresql-python/insert/) into the `inventory` table because the product id 4 does not exist in the `inventory` table.





The following statement verifies the insert:





```
SELECT * FROM inventory
ORDER BY id;
```





Output:





```
 id | name | price | quantity
----+------+-------+----------
  1 | A    | 16.99 |      120
  2 | B    | 25.49 |       50
  3 | C    | 19.95 |       75
  4 | D    | 29.99 |       20
(4 rows)
```





## Summary





- 
- Use the PostgreSQL upsert to update data if it already exists or insert the data if it does not.
- 
-
- 
- Use the `INSERT...ON CONFLICT` statement for upsert.
- 


