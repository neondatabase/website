---
title: 'PostgreSQL Boolean Data Type with Practical Examples'
redirectFrom: 
            - /docs/postgresql/postgresql-boolean
ogImage: /postgresqltutorial_data/wp-content-uploads-2016-06-PostgreSQL-Boolean-300x146.png
tableOfContents: true
---


**Summary**: in this tutorial, you will learn about the PostgreSQL Boolean data type and how to use it in designing database tables.





## Introduction to the PostgreSQL Boolean type





![PostgreSQL Boolean](/postgresqltutorial_data/wp-content-uploads-2016-06-PostgreSQL-Boolean-300x146.png)





PostgreSQL supports a single Boolean [data type](/docs/postgresql/postgresql-data-types): `BOOLEAN` that can have three values: `true`, `false` and `NULL`.





PostgreSQL uses one byte for storing a boolean value in the database. The `BOOLEAN` can be abbreviated as `BOOL`.





In standard SQL, a Boolean value can be `TRUE`, `FALSE`, or `NULL`. However, PostgreSQL is quite flexible when dealing with `TRUE` and `FALSE` values.





The following table shows the valid literal values for `TRUE` and `FALSE` in PostgreSQL.





| True   | False   |
| ------ | ------- |
| true   | false   |
| 't'    | 'f '    |
| 'true' | 'false' |
| 'y'    | 'n'     |
| 'yes'  | 'no'    |
| '1'    | '0'     |





Note that the leading or trailing whitespace does not matter and all the constant values except for `true` and `false` must be enclosed in single quotes.





## PostgreSQL Boolean examples





Let's take a look at some examples of using the PostgreSQL Boolean data type.





First, [create a new table](/docs/postgresql/postgresql-create-table) called `stock_availability` to log which products are available.





```
CREATE TABLE stock_availability (
   product_id INT PRIMARY KEY,
   available BOOLEAN NOT NULL
);
```





Second, [insert some sample data](/docs/postgresql/postgresql-insert) into the `stock_availability` table. We use various literal values for the boolean values.





```
INSERT INTO stock_availability (product_id, available)
VALUES
  (100, TRUE),
  (200, FALSE),
  (300, 't'),
  (400, '1'),
  (500, 'y'),
  (600, 'yes'),
  (700, 'no'),
  (800, '0');
```





Third, check for the availability of products:





```
SELECT *
FROM stock_availability
WHERE available = 'yes';
```





```
 product_id | available
------------+-----------
        100 | t
        300 | t
        400 | t
        500 | t
        600 | t
(5 rows)
```





You can imply the true value by using the Boolean column without any operator. For example, the following query returns all available products:





```
SELECT *
FROM stock_availability
WHERE available;
```





Similarly, if you want to look for `false` values, you compare the value of the Boolean column against any valid Boolean constants.





The following query returns the products that are not available.





```
SELECT
  *
FROM
  stock_availability
WHERE
  available = 'no';
```





```
 product_id | available
------------+-----------
        200 | f
        700 | f
        800 | f
(3 rows)
```





Alternatively, you can use the `NOT` operator to check if values in the Boolean column are false like this:





```
SELECT
  *
FROM
  stock_availability
WHERE
  NOT available;
```





## Set the default values for Boolean columns





To set a default value for an existing Boolean column, you use the `SET DEFAULT` clause in the [ALTER TABLE](/docs/postgresql/postgresql-alter-table) statement.





For example, the following `ALTER TABLE` statement sets the default value for the `available` column in the `stock_availability` table:





```
ALTER TABLE stock_availability
ALTER COLUMN available
SET DEFAULT FALSE;
```





If you insert a row without specifying the value for the `available` column, PostgreSQL will use `FALSE` by default:





```
INSERT INTO stock_availability (product_id)
VALUES (900);
```





```
SELECT *
FROM stock_availability
WHERE product_id = 900;
```





```
 product_id | available
------------+-----------
        900 | f
(1 row)
```





Likewise, if you want to set a default value for a Boolean column when you [create a table](/docs/postgresql/postgresql-create-table), you use the `DEFAULT` constraint in the column definition as follows:





```
CREATE TABLE boolean_demo (
   ...
   is_ok BOOL DEFAULT 't'
);
```





## Summary





- 
- Use the PostgreSQL `BOOLEAN` datatype to store the boolean data.
- 


