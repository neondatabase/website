---
title: 'PostgreSQL ROW_NUMBER Function'
redirectFrom:
            - /postgresql/postgresql-row_number 
            - /postgresql/postgresql-window-function/postgresql-row_number
ogImage: /postgresqltutorial_data/wp-content-uploads-2016-06-products_product_groups_tables.png
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `ROW_NUMBER()` function to assign a unique integer value to each row in a result set.

## Introduction to the PostgreSQL ROW_NUMBER() function

The `ROW_NUMBER()` function is a [window function](/postgresql/postgresql-window-function) that assigns a sequential integer to each row in a result set.

The following illustrates the syntax of the `ROW_NUMBER()` function:

```sql
ROW_NUMBER() OVER(
    [PARTITION BY column_1, column_2,…]
    [ORDER BY column_3,column_4,…]
)
```

The set of rows on which the `ROW_NUMBER()` function operates is called a window.

The `PARTITION BY` clause divides the window into smaller sets or partitions. If you specify the `PARTITION BY` clause, the row number for each partition starts with one and increments by one.

Because the `PARTITION BY` clause is optional to the `ROW_NUMBER()` function, therefore you can omit it, and `ROW_NUMBER()` function will treat the whole window as a partition.

The `ORDER BY` clause inside the `OVER` clause determines the order in which the numbers are assigned.

## PostgreSQL ROW_NUMBER() function examples

We will use the `products` table created in the [PostgreSQL window function tutorial](/postgresql/postgresql-window-function) to demonstrate the functionality of the `ROW_NUMBER()` function.

![products_product_groups_tables](/postgresqltutorial_data/wp-content-uploads-2016-06-products_product_groups_tables.png)

The following shows the data in the `products` table:

![](/postgresqltutorial_data/wp-content-uploads-2019-05-products-table-data.png)

See the following query.

```sql
SELECT
  product_id,
  product_name,
  group_id,
  ROW_NUMBER () OVER (
    ORDER BY
      product_id
  )
FROM
  products;
```

![](/postgresqltutorial_data/wp-content-uploads-2019-05-PostgreSQL-ROW_NUMBER-example.png)

Because we did not use the `PARTITION BY`clause, the `ROW_NUMBER()` function considers the whole result set as a partition.

The `ORDER BY` clause sorts the result set by `product_id`, therefore, the `ROW_NUMBER()` function assigns integer values to the rows based on the `product_id` order.

In the following query, we change the column in the `ORDER BY` clause to product_name, the `ROW_NUMBER()` function assigns the integer values to each row based on the product name order.

```sql
SELECT
  product_id,
  product_name,
  group_id,
  ROW_NUMBER () OVER (
    ORDER BY
      product_name
  )
FROM
  products;
```

![PostgreSQL ROW_NUMBER order by product name](/postgresqltutorial_data/wp-content-uploads-2019-05-PostgreSQL-ROW_NUMBER-order-by-product-name.png)

In the following query, we use the `PARTITION BY` clause to divide the window into subsets based on the values in the `group_id` column. In this case, the `ROW_NUMBER()` function assigns one to the starting row of each partition and increases by one for the next row within the same partition.

The `ORDER BY` clause sorts the rows in each partition by the values in the `product_name` column.

```sql
SELECT
  product_id,
  product_name,
  group_id,
  ROW_NUMBER () OVER (
    PARTITION BY group_id
    ORDER BY
      product_name
  )
FROM
  products;
```

![PostgreSQL ROW_NUMBER with PARTITION example](/postgresqltutorial_data/wp-content-uploads-2019-05-PostgreSQL-ROW_NUMBER-with-PARTITION-example.png)

## PostgreSQL ROW_NUMBER() function and DISTINCT operator

The following query uses the `ROW_NUMBER()` function to assign integers to the [distinct](/postgresql/postgresql-select-distinct)prices from the `products` table.

```sql
SELECT
  DISTINCT price,
  ROW_NUMBER () OVER (
    ORDER BY
      price
  )
FROM
  products
ORDER BY
  price;
```

![PostgreSQL ROW_NUMBER and DISTINCT](/postgresqltutorial_data/wp-content-uploads-2019-05-PostgreSQL-ROW_NUMBER-and-DISTINCT.png)

However, the result is not expected because it includes duplicate prices. The reason is that the `ROW_NUMBER()` operates on the result set before the `DISTINCT` is applied.

To solve this problem, we can get a list of distinct prices in a CTE, then apply the `ROW_NUMBER()` function in the outer query as follows:

```sql
WITH prices AS (
  SELECT
    DISTINCT price
  FROM
    products
)
SELECT
  price,
  ROW_NUMBER () OVER (
    ORDER BY
      price
  )
FROM
  prices;
```

![PostgreSQL ROW_NUMBER and CTE](/postgresqltutorial_data/wp-content-uploads-2019-05-PostgreSQL-ROW_NUMBER-and-CTE.png)

Or we can use a [subquery](/postgresql/postgresql-subquery) in the `FROM` clause to get a list of unique prices, and then apply the `ROW_NUMBER()` function in the outer query.

```sql
SELECT
  price,
  ROW_NUMBER () OVER (
    ORDER BY
      price
  )
FROM
  (
    SELECT
      DISTINCT price
    FROM
      products
  ) prices;
```

![PostgreSQL ROW_NUMBER and subquery](/postgresqltutorial_data/wp-content-uploads-2019-05-PostgreSQL-ROW_NUMBER-and-subquery.png)

## Using the ROW_NUMBER() function for pagination

In application development, you use the pagination technique for displaying a subset of rows instead of all rows in a table.

Besides using the [LIMIT](/postgresql/postgresql-limit) clause, you can use the `ROW_NUMBER()` function for the pagination.

For example, the following query selects the five rows starting at row number 6:

```sql
SELECT
  *
FROM
  (
    SELECT
      product_id,
      product_name,
      price,
      ROW_NUMBER () OVER (
        ORDER BY
          product_name
      )
    FROM
      products
  ) x
WHERE
  ROW_NUMBER BETWEEN 6 AND 10;
```

![PostgreSQL ROW_NUMBER with pagination](/postgresqltutorial_data/wp-content-uploads-2019-05-PostgreSQL-ROW_NUMBER-with-pagination.png)

## Using the ROW_NUMBER() function for getting the nth highest / lowest row

For example, to get the third most expensive products, first, we get the distinct prices from the products table and select the price whose row number is 3. Then, in the outer query, we get the products with the price that equals the 3rd highest price.

```sql
SELECT
  *
FROM
  products
WHERE
  price = (
    SELECT
      price
    FROM
      (
        SELECT
          price,
          ROW_NUMBER () OVER (
            ORDER BY
              price DESC
          ) nth
        FROM
          (
            SELECT
              DISTINCT (price)
            FROM
              products
          ) prices
      ) sorted_prices
    WHERE
      nth = 3
  );
```

![PostgreSQL ROW_NUMBER nth highest lowest example](/postgresqltutorial_data/wp-content-uploads-2019-05-PostgreSQL-ROW_NUMBER-nth-highest-lowest-example.png)

## Summary

- Use the PostgreSQL `ROW_NUMBER()` function to assign integer values to rows in a result set.
