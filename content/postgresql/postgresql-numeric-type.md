---
title: 'PostgreSQL NUMERIC Type'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-numeric/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn about the PostgreSQL `NUMERIC` type for storing numeric data.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL NUMERIC data type

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `NUMERIC` type can store numbers with a lot of digits. Typically, you use the `NUMERIC` type for storing numbers that require exactness such as monetary amounts or quantities.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the syntax for declaring a column with the `NUMERIC` type:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
column_name NUMERIC(precision, scale)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- The `precision` is the total number of digits
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- The `scale` is the number of digits in the fraction part.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The storage type of the numeric type depends on the `precision` and `scale`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `NUMERIC` type can hold a value of up to `131,072` digits before the decimal point `16,383` digits after the decimal point.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The scale of the `NUMERIC` type can be zero, positive, or negative.

<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"note"} -->

PostgreSQL 15 or later allows you to declare a numeric column with a negative scale.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following declares the price column with the numeric type that can store total numbers with 7 digits, 5 before the decimal points and 2 digits after the decimal point:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
price NUMERIC(7,2)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

If you use a negative scale, you can store up to precision + scale digits on the left and no digits on the right of the decimal point. For example:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
amount NUMERIC(5,-2)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this example, you can store up to 7 digits before and 0 digits after the decimal point.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following example shows how to declare a column of type numeric with a zero scale:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
quantity NUMERIC(5, 0)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

It's equivalent to the following declaration that does not explicitly specify the zero scale:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
quantity NUMERIC(5)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

If you omit precision and scale, they will default to 131072 and 16383, respectively.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
NUMERIC
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### NUMERIC, DECIMAL, and DEC types

<!-- /wp:heading -->

<!-- wp:paragraph -->

In PostgreSQL, the `NUMERIC` and `DECIMAL` types are synonyms so you can use them interchangeably:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
DECIMAL(p,s)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

If you prefer a shorter name, you can use the name DEC because DEC and DECIMAL are the same type:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
DEC(p,s)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

If precision is not required, you should not use the `NUMERIC` type because calculations on `NUMERIC` values are typically slower than [integers](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-integer/), float, and double precisions.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### Special values

<!-- /wp:heading -->

<!-- wp:paragraph -->

Besides the ordinal numeric values, the `numeric` type has several special values:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `Infinity`
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `-Infinity`
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `NaN`
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

These values represent “infinity”, “negative infinity”, and “not-a-number”, respectively.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL NUMERIC data type examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's take some examples of using the PostgreSQL `NUMERIC` type.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Storing numeric values

<!-- /wp:heading -->

<!-- wp:paragraph -->

If you store a value with a scale greater than the declared scale of the `NUMERIC` column, PostgreSQL will [round](https://www.postgresqltutorial.com/postgresql-math-functions/postgresql-round/) the value to a specified number of fractional digits. For example:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, [create a new table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) called `products`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(5,2)
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, [insert ](https://www.postgresqltutorial.com/postgresql-python/insert/)some products with prices whose scales exceed the scale declared in the `price` column:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO products (name, price)
VALUES ('Phone',500.215),
       ('Tablet',500.214);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Because the scale of the `price` column is 2, PostgreSQL rounds the value `500.215` up to `500.22` and rounds the value `500.214` down to `500.21` :

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following [query](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-select/) returns all rows of the `products` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT * FROM products;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 id |  name  | price
----+--------+--------
  1 | Phone  | 500.22
  2 | Tablet | 500.21
(2 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

If you store a value whose precision exceeds the declared precision, PostgreSQL will raise an error as shown in the following example:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO products (name, price)
VALUES('Phone',123456.21);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

PostgreSQL issued the following error:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
ERROR:  numeric field overflow
DETAIL:  A field with precision 5, scale 2 must round to an absolute value less than 10^3.
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) PostgreSQL NUMERIC type and NaN

<!-- /wp:heading -->

<!-- wp:paragraph -->

In addition to holding numeric values, the `NUMERIC` type can also hold a special value called `NaN` which stands for not-a-number.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following example updates the price of product id 1 to `NaN` :

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
UPDATE products
SET price = 'NaN'
WHERE id = 1;
```

<!-- /wp:code -->

<!-- wp:paragraph {"className":"note"} -->

Notice that you must use single quotes to wrap the `NaN` as shown in the [`UPDATE`](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-update/) statement above.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following query returns the data of the `products` table:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT * FROM products;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 id |  name  | price
----+--------+--------
  2 | Tablet | 500.21
  1 | Phone  |    NaN
(2 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Typically, the `NaN` is not equal to any number including itself. It means that the expression `NaN = NaN` returns `false`. You'll find this implementation [in JavaScript for ](https://www.javascripttutorial.net/javascript-nan/)[NaN](https://www.javascripttutorial.net/javascript-nan/).

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

But in PostgreSQL, two `NaN` values are equal. Also, `NaN` values are greater than regular numbers such as 1, 2, 3. This implementation allows PostgreSQL to sort `NUMERIC` values and use them in tree-based [indexes](https://www.postgresqltutorial.com/postgresql-indexes/).

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following query [sorts](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-order-by/) the products based on prices from high to low:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT * FROM products
ORDER BY price DESC;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 id |  name  | price
----+--------+--------
  1 | Phone  |    NaN
  2 | Tablet | 500.21
(2 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output indicates that the `NaN` is greater than `500.21`

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `NUMERIC` data type to store numbers that require exactness.
- <!-- /wp:list-item -->

<!-- /wp:list -->
