---
title: Postgres array_length() function
subtitle: Determine the length of an array
enableTableOfContents: true
updatedOn: '2024-06-30T18:09:08.267Z'
---

The Postgres `array_length()` function is used to determine the length of an array along a specified dimension.

It's particularly useful when working with multi-dimensional arrays or when you need to perform operations based on the size of an array. Examples include data analysis where you might need to filter rows based on the number of elements in an array column. Another use case might be application development where you need to validate the size of array inputs since Postgres doesn't natively have a fixed-size array data type.

<CTA />

## Function signature

The `array_length()` function has the following signature:

```sql
array_length(anyarray, int) -> int
```

- `anyarray`: The input array to measure.
- `int`: The array dimension to measure (1-based index).

## Example usage

Consider a `products` table with a `categories` column that contains arrays of product categories. We can use `array_length()` to find out how many categories each product belongs to.

```sql
WITH products(product_name, categories) AS (
  VALUES
    ('Laptop', ARRAY['Electronics', 'Computers']),
    ('Coffee Maker', ARRAY['Appliances', 'Kitchen', 'Electronics']),
    ('Book', ARRAY['Books'])
)
SELECT
  product_name,
  categories,
  array_length(categories, 1) AS category_count
FROM products;
```

This query returns the product name, the array of categories it is listed in, and the count of categories for each product.

```text
 product_name |            categories            | category_count
--------------+----------------------------------+----------------
 Laptop       | {Electronics,Computers}          |              2
 Coffee Maker | {Appliances,Kitchen,Electronics} |              3
 Book         | {Books}                          |              1
(3 rows)
```

## Advanced examples

### Filter rows based on array length

You can use `array_length()` in a `WHERE` clause to filter rows based on the size of an array.

```sql
WITH orders(order_id, items) AS (
  VALUES
    (1, ARRAY['Shirt', 'Pants', 'Shoes']),
    (2, ARRAY['Book']),
    (3, ARRAY['Laptop', 'Mouse', 'Keyboard', 'Monitor'])
)
SELECT *
FROM orders
WHERE array_length(items, 1) > 2;
```

This query selects all orders that contain more than two items.

```text
 order_id |              items
----------+---------------------------------
        1 | {Shirt,Pants,Shoes}
        3 | {Laptop,Mouse,Keyboard,Monitor}
(2 rows)
```

### Use with multi-dimensional arrays

`array_length()` can be used with multi-dimensional arrays by specifying the dimension to measure.

```sql
WITH matrix AS (
  SELECT ARRAY[[1, 2, 3], [4, 5, 6]] AS data
)
SELECT
  array_length(data, 1) AS rows,
  array_length(data, 2) AS columns,
  array_length(data, 3) AS depth
FROM matrix;
```

This query returns the number of rows and columns in a 2D array. There is no third dimension in this case, so `array_length(data, 3)` returns NULL.

```text
 rows | columns | depth
------+---------+-------
    2 |       3 |
(1 row)
```

### Use in a CHECK constraint

You can use `array_length()` in a `CHECK` constraint to enforce a condition based on the size of an array column. For example, consider a table that stores the starting lineup of basketball teams as an array.

```sql
CREATE TABLE basketball_team (
  team_name TEXT PRIMARY KEY,
  starting_lineup TEXT[],
  CONSTRAINT check_starting_lineup CHECK (array_length(starting_lineup, 1) = 5)
);
```

This constraint ensures that the `starting_lineup` array column always contains exactly five elements.

```sql
INSERT INTO basketball_team (team_name, starting_lineup)
VALUES ('Lakers', ARRAY['LeBron James', 'Anthony Davis', 'Russell Westbrook', 'Carmelo Anthony', 'Dwight Howard']);
-- Success

INSERT INTO basketball_team (team_name, starting_lineup)
VALUES ('Warriors', ARRAY['Stephen Curry', 'Klay Thompson', 'Draymond Green']);
-- ERROR:  new row for relation "basketball_team" violates check constraint "check_starting_lineup"
-- DETAIL:  Failing row contains (Warriors, {"Stephen Curry","Klay Thompson","Draymond Green"}).
```

## Additional considerations

### Null handling

`array_length()` returns NULL if the input array is NULL or if the specified dimension does not exist. Always handle potential NULL values in your queries to avoid unexpected results.

### Indexing

Note that Postgres array dimensions are indexed starting from 1, not 0. If you specify a dimension less than 1, `array_length()` returns NULL.

```sql
SELECT array_length(ARRAY[1, 2, 3], 0);
```

### Performance implications

`array_length()` is generally efficient, but be cautious when using it in `WHERE` clauses on large tables. Consider creating a function index on the array length if you frequently filter based on this condition.

### Alternative functions

- `cardinality()` - Returns the total number of elements in an array, or NULL if the array is NULL. It's equivalent to `array_length(anyarray, 1)` for one-dimensional arrays.
- `array_dims()` - Returns a text representation of the array's dimensions.
- `array_upper()` and `array_lower()` - Return the upper and lower bounds of the specified array dimension.

## Resources

- [PostgreSQL documentation: Array Functions and Operators](https://www.postgresql.org/docs/current/functions-array.html)
- [PostgreSQL documentation: Arrays](https://www.postgresql.org/docs/current/arrays.html)
