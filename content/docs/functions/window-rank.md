---
title: Postgres rank() window function
subtitle: Use rank() to assign ranks to rows within a result set
enableTableOfContents: true
updatedOn: '2024-06-27T14:57:35.907Z'
---

The `rank()` window function computes a ranking for each row within a partition of the result set. The rank is determined by the order of rows specified in the `ORDER BY` clause of the `OVER` clause. Rows with equal values for the ranking criteria receive the same rank, with the next rank(s) skipped.

This function is useful in scenarios such as finding the top N rows per group, calculating percentiles, or generating leaderboards.

<CTA />

## Function signature

The `rank()` function has the following form:

```sql
rank() OVER ([PARTITION BY partition_expression] ORDER BY order_expression)
```

The `OVER` clause defines the window frame for the function.

- The `ORDER BY` clause specifies the order in which ranks are assigned to rows.
- The `PARTITION BY` clause is optional - if specified, it divides the result set into partitions and ranks are assigned within each partition. Otherwise, ranks are computed for each row over the entire result set.

## Example usage

Consider an `employees` table with columns for employee ID, name, department, and salary. We can use `rank()` to rank employees within each department by their salary.

```sql
WITH sample_data AS (
    SELECT *
    FROM (
        VALUES
            ('Alice', 'Sales', 50000),
            ('Bob', 'Marketing', 55000),
            ('Charlie', 'Sales', 52000),
            ('David', 'IT', 60000),
            ('Eve', 'Marketing', 55000),
            ('Frank', 'IT', 62000)
    ) AS t(employee_name, department, salary)
)
SELECT
    employee_name,
    department,
    salary,
    RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_salary_rank
FROM sample_data
ORDER BY department, dept_salary_rank;
```

This query ranks employees within each department based on their salary in descending order. Employees with the same salary within a department receive the same rank.

```text
 employee_name | department | salary | dept_salary_rank
---------------+------------+--------+------------------
 Frank         | IT         |  62000 |                1
 David         | IT         |  60000 |                2
 Bob           | Marketing  |  55000 |                1
 Eve           | Marketing  |  55000 |                1
 Charlie       | Sales      |  52000 |                1
 Alice         | Sales      |  50000 |                2
(6 rows)
```

## Advanced examples

### Top N per group

You can use `rank()` in a subquery to find the top N rows per group.

```sql
WITH products AS (
    SELECT *
    FROM (
        VALUES
            (1, 'A', 100),
            (2, 'A', 80),
            (3, 'B', 200),
            (4, 'B', 180),
            (5, 'B', 150),
            (6, 'C', 120)
    ) AS t(product_id, category, price)
)
SELECT *
FROM (
    SELECT
        product_id,
        category,
        price,
        rank() OVER (PARTITION BY category ORDER BY price DESC) AS rank
    FROM products
) ranked
WHERE rank <= 2;
```

This query finds the top 2 most expensive products in each category. The subquery ranks products within each category by price, and the outer query filters for rows with a rank less than or equal to 2.

```text
 product_id | category | price | rank
------------+----------+-------+------
          1 | A        |   100 |    1
          2 | A        |    80 |    2
          3 | B        |   200 |    1
          4 | B        |   180 |    2
          6 | C        |   120 |    1
(5 rows)
```

### Percentile calculation

You can calculate percentiles using the `rank()` function with some arithmetic.

```sql
WITH scores AS (
	SELECT *
	FROM (
        VALUES
            ('Student 1', 85),
            ('Student 2', 92),
            ('Student 3', 78),
            ('Student 4', 90),
            ('Student 5', 88)
	) AS t(student, score)
)
SELECT
	student,
	score,
	rank() OVER (ORDER BY score) AS rank,
	round(100.0 * rank() OVER (ORDER BY score) / (SELECT count(*) FROM scores), 2) AS percentile
FROM scores;
```

This query calculates the percentile rank for each student based on their score. The percentile is calculated by dividing the rank of each row by the total number of rows and multiplying by 100.

```text
  student  | score | rank | percentile
-----------+-------+------+------------
 Student 3 |    78 |    1 |      20.00
 Student 1 |    85 |    2 |      40.00
 Student 5 |    88 |    3 |      60.00
 Student 4 |    90 |    4 |      80.00
 Student 2 |    92 |    5 |     100.00
(5 rows)
```

## Alternative functions

### dense_rank

The `dense_rank()` function is similar to `rank()`, but it does not skip ranks when there are ties. If multiple rows have the same rank, the next rank will be the next consecutive integer.

```sql
WITH scores AS (
    SELECT *
    FROM (
        VALUES
            ('Player 1', 100),
            ('Player 2', 95),
            ('Player 3', 95),
            ('Player 4', 90)
    ) AS t(player, score)
)
SELECT
    player,
    score,
    rank() OVER (ORDER BY score DESC) AS rank,
    dense_rank() OVER (ORDER BY score DESC) AS dense_rank
FROM scores;
```

This query demonstrates the difference between `rank()` and `dense_rank()`. While `rank()` skips rank 3 due to the tie at rank 2, `dense_rank()` assigns consecutive ranks.

```text
  player  | score | rank | dense_rank
----------+-------+------+------------
 Player 1 |   100 |    1 |          1
 Player 2 |    95 |    2 |          2
 Player 3 |    95 |    2 |          2
 Player 4 |    90 |    4 |          3
(4 rows)
```

### row_number

The `row_number()` function assigns a unique, sequential integer to each row within the partition of a result set. Unlike `rank()` and `dense_rank()`, it does not handle ties.

```sql
WITH sales AS (
    SELECT date '2023-01-01' AS sale_date, 1000 AS amount
    UNION ALL
    SELECT date '2023-01-01', 1500
    UNION ALL
    SELECT date '2023-01-02', 1200
    UNION ALL
    SELECT date '2023-01-02', 1200
)
SELECT
    sale_date,
    amount,
    row_number() OVER (PARTITION BY sale_date ORDER BY amount DESC) AS row_num
FROM sales;
```

This query assigns a unique row number to each sale within a date, ordered by the sale amount descending. Even though there are ties for the date `2023-01-02`, each row receives a distinct row number.

```text
 sale_date  | amount | row_num
------------+--------+---------
 2023-01-01 |   1500 |       1
 2023-01-01 |   1000 |       2
 2023-01-02 |   1200 |       1
 2023-01-02 |   1200 |       2
(4 rows)
```

## Additional considerations

### Handling ties

The `rank()` and `dense_rank()` functions handle ties differently. `rank()` assigns the same rank to tied rows and skips the next rank(s), while `dense_rank()` assigns the same rank to tied rows but does not skip ranks. Choose the appropriate function based on your requirements.

### Performance implications

Like other window functions, `rank()` performs calculations across a set of rows defined by the `OVER` clause. This can be computationally expensive, especially for large datasets or complex window definitions.

To optimize performance:

- Include an `ORDER BY` clause in the `OVER` clause to avoid sorting the entire dataset.
- Use partitioning (`PARTITION BY`) to divide the data into smaller chunks when possible.
- Create appropriate indexes on the columns used in the `OVER` clause.

## Resources

- [PostgreSQL documentation: Window functions](https://www.postgresql.org/docs/current/functions-window.html)
- [PostgreSQL documentation: Tutorial on window functions](https://www.postgresql.org/docs/current/tutorial-window.html)
