---
title: 'PostgreSQL ROW_NUMBER Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-window-function/postgresql-row_number/
ogImage: ./img/wp-content-uploads-2016-06-products_product_groups_tables.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `ROW_NUMBER()` function to assign a unique integer value to each row in a result set.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL ROW_NUMBER() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `ROW_NUMBER()` function is a [window function](https://www.postgresqltutorial.com/postgresql-window-function/) that assigns a sequential integer to each row in a result set.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following illustrates the syntax of the `ROW_NUMBER()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ROW_NUMBER() OVER(
    [PARTITION BY column_1, column_2,…]
    [ORDER BY column_3,column_4,…]
)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The set of rows on which the `ROW_NUMBER()` function operates is called a window.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `PARTITION BY` clause divides the window into smaller sets or partitions. If you specify the `PARTITION BY` clause, the row number for each partition starts with one and increments by one.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Because the `PARTITION BY` clause is optional to the `ROW_NUMBER()` function, therefore you can omit it, and `ROW_NUMBER()` function will treat the whole window as a partition.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `ORDER BY` clause inside the `OVER` clause determines the order in which the numbers are assigned.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL ROW_NUMBER() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

We will use the `products` table created in the [PostgreSQL window function tutorial](https://www.postgresqltutorial.com/postgresql-window-function/) to demonstrate the functionality of the `ROW_NUMBER()` function.

<!-- /wp:paragraph -->

<!-- wp:image {"id":2268} -->

![products_product_groups_tables](./img/wp-content-uploads-2016-06-products_product_groups_tables.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

The following shows the data in the `products` table:

<!-- /wp:paragraph -->

<!-- wp:image {"id":4134} -->

![](./img/wp-content-uploads-2019-05-products-table-data.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

See the following query.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
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

<!-- /wp:code -->

<!-- wp:image {"id":4125} -->

![](./img/wp-content-uploads-2019-05-PostgreSQL-ROW_NUMBER-example.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Because we did not use the `PARTITION BY`clause, the `ROW_NUMBER()` function considers the whole result set as a partition.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `ORDER BY` clause sorts the result set by `product_id`, therefore, the `ROW_NUMBER()` function assigns integer values to the rows based on the `product_id` order.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

In the following query, we change the column in the `ORDER BY` clause to product_name, the `ROW_NUMBER()` function assigns the integer values to each row based on the product name order.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
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

<!-- /wp:code -->

<!-- wp:image {"id":4127} -->

![PostgreSQL ROW_NUMBER order by product name](./img/wp-content-uploads-2019-05-PostgreSQL-ROW_NUMBER-order-by-product-name.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

In the following query, we use the `PARTITION BY` clause to divide the window into subsets based on the values in the `group_id` column. In this case, the `ROW_NUMBER()` function assigns one to the starting row of each partition and increases by one for the next row within the same partition.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `ORDER BY` clause sorts the rows in each partition by the values in the `product_name` column.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
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

<!-- /wp:code -->

<!-- wp:image {"id":4128} -->

![PostgreSQL ROW_NUMBER with PARTITION example](./img/wp-content-uploads-2019-05-PostgreSQL-ROW_NUMBER-with-PARTITION-example.png)

<!-- /wp:image -->

<!-- wp:heading -->

## PostgreSQL ROW_NUMBER() function and DISTINCT operator

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following query uses the `ROW_NUMBER()` function to assign integers to the [distinct ](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-select-distinct/)prices from the `products` table.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
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

<!-- /wp:code -->

<!-- wp:image {"id":4129} -->

![PostgreSQL ROW_NUMBER and DISTINCT](./img/wp-content-uploads-2019-05-PostgreSQL-ROW_NUMBER-and-DISTINCT.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

However, the result is not expected because it includes duplicate prices. The reason is that the `ROW_NUMBER()` operates on the result set before the `DISTINCT` is applied.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To solve this problem, we can get a list of distinct prices in a CTE, then apply the `ROW_NUMBER()` function in the outer query as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
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

<!-- /wp:code -->

<!-- wp:image {"id":4130} -->

![PostgreSQL ROW_NUMBER and CTE](./img/wp-content-uploads-2019-05-PostgreSQL-ROW_NUMBER-and-CTE.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Or we can use a [subquery](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-subquery/) in the `FROM` clause to get a list of unique prices, and then apply the `ROW_NUMBER()` function in the outer query.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
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

<!-- /wp:code -->

<!-- wp:image {"id":4131} -->

![PostgreSQL ROW_NUMBER and subquery](./img/wp-content-uploads-2019-05-PostgreSQL-ROW_NUMBER-and-subquery.png)

<!-- /wp:image -->

<!-- wp:heading -->

## Using the ROW_NUMBER() function for pagination

<!-- /wp:heading -->

<!-- wp:paragraph -->

In application development, you use the pagination technique for displaying a subset of rows instead of all rows in a table.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Besides using the [LIMIT](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-limit/) clause, you can use the `ROW_NUMBER()` function for the pagination.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

For example, the following query selects the five rows starting at row number 6:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
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

<!-- /wp:code -->

<!-- wp:image {"id":4132} -->

![PostgreSQL ROW_NUMBER with pagination](./img/wp-content-uploads-2019-05-PostgreSQL-ROW_NUMBER-with-pagination.png)

<!-- /wp:image -->

<!-- wp:heading -->

## Using the ROW_NUMBER() function for getting the nth highest / lowest row

<!-- /wp:heading -->

<!-- wp:paragraph -->

For example, to get the third most expensive products, first, we get the distinct prices from the products table and select the price whose row number is 3. Then, in the outer query, we get the products with the price that equals the 3rd highest price.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
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

<!-- /wp:code -->

<!-- wp:image {"id":4133} -->

![PostgreSQL ROW_NUMBER nth highest lowest example](./img/wp-content-uploads-2019-05-PostgreSQL-ROW_NUMBER-nth-highest-lowest-example.png)

<!-- /wp:image -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `ROW_NUMBER()` function to assign integer values to rows in a result set.
- <!-- /wp:list-item -->

<!-- /wp:list -->
