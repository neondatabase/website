---
title: 'PostgreSQL NUMERIC Type'
redirectFrom: 
            - /docs/postgresql/postgresql-numeric
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---


**Summary**: in this tutorial, you will learn about the PostgreSQL `NUMERIC` type for storing numeric data.





## Introduction to PostgreSQL NUMERIC data type





The `NUMERIC` type can store numbers with a lot of digits. Typically, you use the `NUMERIC` type for storing numbers that require exactness such as monetary amounts or quantities.





Here's the syntax for declaring a column with the `NUMERIC` type:





```
column_name NUMERIC(precision, scale)
```





In this syntax:





- 
- The `precision` is the total number of digits
- 
-
- 
- The `scale` is the number of digits in the fraction part.
- 





The storage type of the numeric type depends on the `precision` and `scale`.





The `NUMERIC` type can hold a value of up to `131,072` digits before the decimal point `16,383` digits after the decimal point.





The scale of the `NUMERIC` type can be zero, positive, or negative.





PostgreSQL 15 or later allows you to declare a numeric column with a negative scale.





The following declares the price column with the numeric type that can store total numbers with 7 digits, 5 before the decimal points and 2 digits after the decimal point:





```
price NUMERIC(7,2)
```





If you use a negative scale, you can store up to precision + scale digits on the left and no digits on the right of the decimal point. For example:





```
amount NUMERIC(5,-2)
```





In this example, you can store up to 7 digits before and 0 digits after the decimal point.





The following example shows how to declare a column of type numeric with a zero scale:





```
quantity NUMERIC(5, 0)
```





It's equivalent to the following declaration that does not explicitly specify the zero scale:





```
quantity NUMERIC(5)
```





If you omit precision and scale, they will default to 131072 and 16383, respectively.





```
NUMERIC
```





### NUMERIC, DECIMAL, and DEC types





In PostgreSQL, the `NUMERIC` and `DECIMAL` types are synonyms so you can use them interchangeably:





```
DECIMAL(p,s)
```





If you prefer a shorter name, you can use the name DEC because DEC and DECIMAL are the same type:





```
DEC(p,s)
```





If precision is not required, you should not use the `NUMERIC` type because calculations on `NUMERIC` values are typically slower than [integers](/docs/postgresql/postgresql-integer), float, and double precisions.





### Special values





Besides the ordinal numeric values, the `numeric` type has several special values:





- 
- `Infinity`
- 
-
- 
- `-Infinity`
- 
-
- 
- `NaN`
- 





These values represent “infinity”, “negative infinity”, and “not-a-number”, respectively.





## PostgreSQL NUMERIC data type examples





Let's take some examples of using the PostgreSQL `NUMERIC` type.





### 1) Storing numeric values





If you store a value with a scale greater than the declared scale of the `NUMERIC` column, PostgreSQL will [round](/docs/postgresql/postgresql-round) the value to a specified number of fractional digits. For example:





First, [create a new table](/docs/postgresql/postgresql-create-table) called `products`:





```
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(5,2)
);
```





Second, [insert ](https://www.postgresqltutorial.com/postgresql-python/insert/)some products with prices whose scales exceed the scale declared in the `price` column:





```
INSERT INTO products (name, price)
VALUES ('Phone',500.215),
       ('Tablet',500.214);
```





Because the scale of the `price` column is 2, PostgreSQL rounds the value `500.215` up to `500.22` and rounds the value `500.214` down to `500.21` :





The following [query](/docs/postgresql/postgresql-select) returns all rows of the `products` table:





```
SELECT * FROM products;
```





Output:





```
 id |  name  | price
----+--------+--------
  1 | Phone  | 500.22
  2 | Tablet | 500.21
(2 rows)
```





If you store a value whose precision exceeds the declared precision, PostgreSQL will raise an error as shown in the following example:





```
INSERT INTO products (name, price)
VALUES('Phone',123456.21);
```





PostgreSQL issued the following error:





```
ERROR:  numeric field overflow
DETAIL:  A field with precision 5, scale 2 must round to an absolute value less than 10^3.
```





### 2) PostgreSQL NUMERIC type and NaN





In addition to holding numeric values, the `NUMERIC` type can also hold a special value called `NaN` which stands for not-a-number.





The following example updates the price of product id 1 to `NaN` :





```
UPDATE products
SET price = 'NaN'
WHERE id = 1;
```





Notice that you must use single quotes to wrap the `NaN` as shown in the [`UPDATE`](/docs/postgresql/postgresql-update) statement above.





The following query returns the data of the `products` table:





```
SELECT * FROM products;
```





Output:





```
 id |  name  | price
----+--------+--------
  2 | Tablet | 500.21
  1 | Phone  |    NaN
(2 rows)
```





Typically, the `NaN` is not equal to any number including itself. It means that the expression `NaN = NaN` returns `false`. You'll find this implementation [in JavaScript for ](https://www.javascripttutorial.net/javascript-nan/)[NaN](https://www.javascripttutorial.net/javascript-nan/).





But in PostgreSQL, two `NaN` values are equal. Also, `NaN` values are greater than regular numbers such as 1, 2, 3. This implementation allows PostgreSQL to sort `NUMERIC` values and use them in tree-based [indexes](https://www.postgresqltutorial.com/postgresql-indexes/).





The following query [sorts](/docs/postgresql/postgresql-order-by) the products based on prices from high to low:





```
SELECT * FROM products
ORDER BY price DESC;
```





Output:





```
 id |  name  | price
----+--------+--------
  1 | Phone  |    NaN
  2 | Tablet | 500.21
(2 rows)
```





The output indicates that the `NaN` is greater than `500.21`





## Summary





- 
- Use the PostgreSQL `NUMERIC` data type to store numbers that require exactness.
- 


