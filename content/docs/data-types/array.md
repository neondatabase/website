---
title: Postgres Array data type
subtitle: Manage collections of elements using arrays
enableTableOfContents: true
updatedOn: '2024-06-14T07:55:54.365Z'
---

In Postgres, the `ARRAY` data type is used to store and manipulate collections of elements in a single column. An array can have variable length and one or more dimensions, but must hold elements of the same data type. Postgres provides a variety of functions and operators for working with arrays.

Arrays are particularly useful when dealing with multiple values that are logically related. For instance, they can store a list of phone numbers for a contact, product categories for an e-commerce item, or even multi-dimensional data for scientific or analytical computations.

<CTA />

## Storage and syntax

Arrays in Postgres are declared by specifying the element type followed by square brackets. For example,

- `INTEGER[]` defines an array of integers.
- `TEXT[][]` defines a two-dimensional array of text values.
- `NUMERIC[3]` defines an array of three numeric values. However, note that Postgres doesn't enforce the specified size of an array.

Array literals in Postgres are written within curly braces `{}` and separated by commas. For instance,

- An array of integers might look like `{1, 2, 3}`.
- Multidimensional arrays use nested curly braces, like `{{1, 2, 3}, {4, 5, 6}}`.

The `ARRAY` constructor syntax can also be used to create arrays. For example,

- `ARRAY[1, 2, 3]` creates an array of integers.
- `ARRAY[[1, 2, 3], [4, 5, 6]]` creates a two-dimensional array.

## Example usage

Consider the case of maintaining a product catalog for an online store. The same product may belong to multiple categories. For example, an iPad could be tagged as 'Electronics', 'Computer', or 'Mobile'. In this case, we can use an array to store the categories for each product.

First, let's create a `products` table with some sample data:

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    categories TEXT[],
    units_sold INTEGER[][]
);

INSERT INTO products (name, categories, units_sold)
VALUES
    ('Laptop', '{"Electronics","Computer","Office"}', '{{3200, 3300, 3400, 3500}, {3600, 3700, 3800, 3900}}'),
    ('Headphones', '{"Electronics","Audio"}', '{{2400, 2500, 2600, 2700}, {2800, 2900, 3000, 3100}}'),
    ('Table', '{"Furniture","Office"}', '{{900, 950, 1000, 1050}, {1100, 1150, 1200, 1250}}'),
    ('Keyboard', '{"Electronics","Accessories"}', '{{4100, 4200, 4300, 4400}, {4500, 4600, 4700, 4800}}');
```

The `units_sold` column is a two-dimensional array that stores the number of units sold for each product. The first dimension represents the year, and the second dimension represents the quarter.

Now, we can access the values in the array column `categories`, and use it in our queries. For example, the query below finds products belonging to the `Electronics` category.

```sql
SELECT name, categories
FROM products
WHERE 'Electronics' = ANY (categories);
```

Note that the `ANY` operator checks if the value specified exists in the array.
This query returns the following result:

```text
| id | name       | categories                      |
|----|------------|---------------------------------|
| 1  | Laptop     | {Electronics, Computer, Office} |
| 2  | Headphones | {Electronics, Audio}            |
| 4  | Keyboard   | {Electronics, Accessories}      |
```

## Other examples

### Indexing arrays

Elements in an array can be accessed by their index. Postgres arrays are 1-based, meaning indexing starts at 1.

For example, to get the first category of each product:

```sql
SELECT name, categories[1] AS first_category
FROM products;
```

This query returns the following result:

```text
| name       | first_category |
|------------|----------------|
| Laptop     | Electronics    |
| Headphones | Electronics    |
| Table      | Furniture      |
| Keyboard   | Electronics    |
```

Multiple elements can be accessed using the `SLICE` operator. For example, to get the first three categories of each product:

```sql
SELECT name, categories[1:3] AS first_three_categories
FROM products;
```

This query returns the following result:

```text
| name       | first_three_categories          |
|------------|---------------------------------|
| Laptop     | {Electronics, Computer, Office} |
| Headphones | {Electronics, Audio}            |
| Table      | {Furniture, Office}             |
| Keyboard   | {Electronics, Accessories}      |
```

Multidimensional arrays can be accessed using multiple indices. For example, to get the number of units sold in the last quarter of the first year for each product, we can use the query:

```sql
SELECT name, units_sold[1][4] AS units_sold_last_quarter
FROM products;
```

This query returns the following:

```text
| name       | units_sold_last_quarter |
|------------|-------------------------|
| Laptop     | 3500                    |
| Headphones | 2700                    |
| Table      | 1050                    |
| Keyboard   | 4400                    |
```

### Modifying arrays

Array values can be modified using functions or by directly indexing into the array. You can change specific elements of an array, add or remove elements, or even replace the entire array.

For example, the query below replaces the `Audio` category across all products with `Sound`.

```sql
UPDATE products
SET categories = array_replace(categories, 'Audio', 'Sound')
WHERE 'Audio' = ANY (categories)
RETURNING *;
```

This query returns the following result:

```text
| id | name       | categories            | units_sold                                   |
|----|------------|-----------------------|----------------------------------------------|
| 2  | Headphones | {Electronics,Sound}   | {{2400,2500,2600,2700},{2800,2900,3000,3100}} |
```

### Array functions and operators

Postgres provides a variety of functions and operators for working with arrays. You can find the full list of functions and operators in the [Postgres documentation](#resources).

We'll look at some commonly used functions below.

**Length of an array**

We can query the number of categories each product has been tagged with:

```sql
SELECT name, array_length(categories, 1) as category_count
FROM products;
```

This query returns the following result:

```text
| name       | category_count |
|------------|----------------|
| Laptop     | 3              |
| Headphones | 3              |
| Table      | 2              |
| Keyboard   | 2              |
```

The `array_length` function returns the length of the array in the specified dimension. In this case, we specified the first dimension, which is the number of categories for each product.

**Expanding an array into rows**

We can use the `unnest` function to expand an array into rows. For example, to get the number of laptops sold in each quarter, we can use the query:

```sql
SELECT name, unnest(units_sold) AS units_sold
FROM products
WHERE name = 'Laptop';
```

This query returns the following result:

```text
| name   | units_sold |
|--------|------------|
| Laptop | 3200       |
| Laptop | 3300       |
| Laptop | 3400       |
| Laptop | 3500       |
| Laptop | 3600       |
| Laptop | 3700       |
| Laptop | 3800       |
| Laptop | 3900       |
```

We could use the output of `unnest` to calculate the total number of units sold for each product; for example:

```sql
WITH table_units AS (
  SELECT name, unnest(units_sold) AS total_units_sold
  FROM products
)
SELECT name, sum(total_units_sold)
FROM table_units
GROUP BY name;
```

This query returns the following result:

```text
| name       | sum   |
|------------|-------|
| Keyboard   | 35600 |
| Table      | 8600  |
| Laptop     | 28400 |
| Headphones | 22000 |
```

**Concatenating arrays**

We can concatenate two arrays using the `||` operator. For example, the query below produces a list of all categories across all products.

```sql
SELECT ARRAY[1,2,3] || ARRAY[4,5] as concatenated_array;
```

This query returns the following result:

```text
| concatenated_array |
|--------------------|
| {1,2,3,4,5}        |
```

**Aggregating values into an array**

We can use the `array_agg` function to produce an array from a set of rows. For example, to get a list of all products that are in the `Electronics` category, we can use the query:

```sql
SELECT array_agg(name) AS product_names
FROM products
WHERE 'Electronics' = ANY (categories);
```

This query returns the following result:

```text
| product_names                |
|------------------------------|
| {Laptop,Headphones,Keyboard} |
```

## Additional considerations

- **Performance and UX**: While arrays provide flexibility, they can be less performant than normalized data structures for large datasets. Compared to a set of rows, arrays can also be more tedious to work with for complex queries.

- **Indexing**: Postgres lets you create indexes on array elements for faster searches. Specifically, an inverted index like `GIN` creates an entry for each element in the array. This allows for fast lookups but can be expensive to maintain for large arrays.

- **No type enforcement**: Postgres supports defining the size of an array or the number of dimensions in the schema. However, Postgres does not enforce these definitions. For example, the query below works successfully:

  ```sql
  CREATE TABLE test_size (
    id SERIAL PRIMARY KEY,
    arr1 INTEGER[3]
  );
  INSERT INTO test_size (arr1)
  VALUES (ARRAY[1,2,3]), (ARRAY[1,2]);
  ```

  It is therefore up to the application to ensure data integrity.

## Resources

- [PostgreSQL documentation - Array Types](https://www.postgresql.org/docs/current/arrays.html)
- [PostgreSQL documentation - Array Functions](https://www.postgresql.org/docs/current/functions-array.html)

<NeedHelp />
