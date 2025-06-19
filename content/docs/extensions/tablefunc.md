---
title: The tablefunc extension
subtitle: Reshape data with pivot tables and navigate hierarchical structures in
  Postgres
enableTableOfContents: true
updatedOn: '2025-05-27T19:40:34.756Z'
tag: new
---

The `tablefunc` extension for Postgres provides a powerful set of functions for transforming data directly within your database. Its primary capabilities include creating pivot tables (also known as cross-tabulations) to reshape data, generating sets of normally distributed random numbers, and querying hierarchical or tree-like data structures.

For instance, you can use `tablefunc` to transform a list of quarterly product sales into a summary table where each product is a row and each quarter is a column. Or, you could explore an employee reporting structure to visualize an organization chart.

<CTA />

## Enable the `tablefunc` extension

You can enable the extension by running the following `CREATE EXTENSION` statement in the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or from a client such as [psql](/docs/connect/query-with-psql-editor) that is connected to your Neon database.

```sql
CREATE EXTENSION IF NOT EXISTS tablefunc;
```

**Version availability:**

Please refer to the [list of all extensions](/docs/extensions/pg-extensions) available in Neon for up-to-date extension version information.

## Key functions and usage

The `tablefunc` extension provides the following key functions:

1.  **`normal_rand()`**: Generates a series of random numbers following a normal (Gaussian) distribution.
2.  **`crosstab()`**: Transforms data from a "long" format to a "wide" format, creating pivot tables.
3.  **`connectby()`**: Traverses hierarchical data, such as organizational charts or bill-of-materials structures.

Let's explore each function in detail.

### `normal_rand()`

The `normal_rand()` function is useful for creating sample datasets that mimic real-world measurements often clustering around an average value (mean) with a certain spread (standard deviation).

**Function signature:**

```sql
normal_rand(count INTEGER, mean FLOAT8, stddev FLOAT8) RETURNS SETOF FLOAT8
```

- `count`: The number of random values to generate.
- `mean`: The central value (average) of the distribution.
- `stddev`: The standard deviation, indicating the spread of the numbers.

**Example:**

To generate 5 random numbers with a mean of 10.0 and a standard deviation of 2.0:

```sql
SELECT * FROM normal_rand(5, 10.0, 2.0);
```

**Example output:**

```
 normal_rand
-------------
  9.32020692360359
  11.495399206878934
  7.738467056884886
  9.672348520651616
  7.734973342540705
(5 rows)
```

> Ouput will vary each time you run the function due to the random nature of the data.

**Use case:** Populating tables with realistic-looking sample data for testing or analysis.

### `crosstab()`

The `crosstab()` function is used for reshaping data, particularly for creating pivot tables. It allows you to summarize and reorganize data by transforming rows into columns, making it easier to analyze and visualize.

#### Basic `crosstab()` (single SQL argument)

This version of `crosstab` takes a single SQL query string as input. This query must produce exactly three columns: row identifier, category, and value.

Consider a `product_sales_long` table:

| product | quarter | sales |
| :------ | :------ | :---- |
| Apple   | Q1      | 100   |
| Apple   | Q2      | 120   |
| Banana  | Q1      | 80    |
| Apple   | Q3      | 110   |
| Banana  | Q2      | 95    |

We want to transform it into:

| product | Q1_sales | Q2_sales | Q3_sales |
| :------ | :------- | :------- | :------- |
| Apple   | 100      | 120      | 110      |
| Banana  | 80       | 95       | (null)   |

**Query:**

```sql
CREATE TABLE product_sales_long (
  product TEXT,
  quarter TEXT,
  sales INT
);

INSERT INTO product_sales_long (product, quarter, sales) VALUES
  ('Apple', 'Q1', 100),
  ('Apple', 'Q2', 120),
  ('Banana', 'Q1', 80),
  ('Apple', 'Q3', 110),
  ('Banana', 'Q2', 95);

-- Using crosstab to pivot the product_sales_long table
SELECT *
FROM crosstab(
  'SELECT product, quarter, sales FROM product_sales_long ORDER BY 1, 2'
) AS ct(product TEXT, Q1_sales INT, Q2_sales INT, Q3_sales INT);
```

**Breaking down the query:**

1.  **`crosstab('source_sql_query_as_string')`**:

    The `source_sql_query_as_string` must return three columns:

    - **Row identifier**: Values in this column become distinct rows in the output (e.g., `product`).
    - **Category**: Values in this column become new column headers in the output (e.g., `quarter`).
    - **Value**: Values in this column populate the cells of the new pivot table (e.g., `sales`).

    Crucially, this source query **must** be sorted by the first column, then the second (`ORDER BY 1, 2`). This ensures `crosstab` processes data correctly (e.g., `Q1` comes before `Q2`).

2.  **`AS ct(column_definitions)`**:
    - Because `crosstab` returns a generic `SETOF record`, you must explicitly define the structure of the output table.
    - `ct`: An alias for the resulting table.
    - `product TEXT`: Corresponds to the first column of the `source_sql_query`. Its data type should match.
    - `Q1_sales INT, Q2_sales INT, Q3_sales INT`: These are the new columns derived from the unique values in the 'category' (second) column of your `source_sql_query`. Their data types must match the 'value' (third) column of the `source_sql_query`.
    - If a row identifier/category combination doesn't exist in the source data (e.g., Banana for `Q3`), the corresponding cell in the pivot table will be `NULL`.
    - If the source data contains categories not defined in the `AS ct(...)` clause, those categories will be ignored.

#### `crosstab()` with fixed columns (using two SQL queries)

This version of `crosstab` is used when you know exactly which categories you want as your new columns, and you want them to appear in a specific order. It's perfect for reports where the column layout is fixed, even if some rows don't have data for every column.

Imagine you have a table of `student_test_scores`:

| student_name | subject | score |
| :----------- | :------ | :---- |
| Alice        | Math    | 90    |
| Alice        | Science | 85    |
| Bob          | Math    | 78    |
| Alice        | English | 92    |
| Bob          | Science | 88    |
| Carol        | Math    | 95    |
| Carol        | English | 89    |

We want to transform this into a table where each student is a row, and their scores for 'Math', 'Science', 'English', and 'History' are in separate columns.

**Desired Output:**

| student_name | math_score | science_score | english_score | history_score |
| :----------- | :--------- | :------------ | :------------ | :------------ |
| Alice        | 90         | 85            | 92            | _(null)_      |
| Bob          | 78         | 88            | _(null)_      | _(null)_      |
| Carol        | 95         | _(null)_      | 89            | _(null)_      |

> Notice we want a 'History' column even if no one has a score for it yet – it will just show `(null)`.

**Here's how we do it with `crosstab()`:**

```sql
-- Create the student_test_scores table
CREATE TABLE student_test_scores (
    student_name TEXT,
    subject TEXT,
    score INT
);

INSERT INTO student_test_scores (student_name, subject, score) VALUES
    ('Alice', 'Math', 90),
    ('Alice', 'Science', 85),
    ('Bob', 'Math', 78),
    ('Alice', 'English', 92),
    ('Bob', 'Science', 88),
    ('Carol', 'Math', 95),
    ('Carol', 'English', 89);

-- Now, the crosstab query
SELECT *
FROM crosstab(
  -- Query 1: This is our source data.
  -- It needs: row_identifier, category_for_new_columns, value_for_cells
  'SELECT student_name, subject, score
   FROM student_test_scores
   ORDER BY 1', -- IMPORTANT: Order by the row_identifier (student_name)

  -- Query 2: This query defines our new column headers, in the order we want them.
  -- It must return one column with the list of categories.
  $$SELECT s FROM unnest(ARRAY['Math', 'Science', 'English', 'History']) AS s$$
) AS ct(
    student TEXT,          -- This matches 'student_name' from Query 1
    math_score INT,        -- This matches 'Math' from Query 2
    science_score INT,     -- This matches 'Science' from Query 2
    english_score INT,     -- This matches 'English' from Query 2
    history_score INT      -- This matches 'History' from Query 2
);
```

> `unnest()` is a Postgres function that expands an array into a set of rows. In this case, it generates the list of subjects to be used as column headers in the pivot table. The `ARRAY[...]` syntax creates an array of the specified values, and `unnest()` converts it into a set of rows. This allows you to dynamically define the categories for the pivot table based on the contents of the array. Learn more about the `unnest()` function here: [Expanding an array into rows](/docs/data-types/array#array-functions-and-operators:~:text=Expanding%20an%20array%20into%20rows)

**How the `crosstab(source_sql, category_sql)` works:**

1.  **`source_sql` (the first query string):**

    - This query fetches your raw data.
    - It must provide:
      1.  The column(s) that will identify each row in your final table (here, `student_name`).
      2.  The column whose values will become your new column headers (here, `subject`).
      3.  The column whose values will fill the cells of your new table (here, `score`).
    - It's very important to `ORDER BY` the row identifier column(s) (e.g., `ORDER BY student_name` or `ORDER BY 1`).

2.  **`category_sql` (the second query string):**

    - This query's job is to produce a single column containing the exact list of categories you want as your new column headers.
    - The order of categories returned by this query determines the order of your new columns in the final pivot table.
    - In our example, `$$SELECT s FROM unnest(ARRAY['Math', 'Science', 'English', 'History']) AS s$$` provides the list: 'Math', then 'Science', then 'English', then 'History'.

3.  **`AS ct(student TEXT, math_score INT, ...)`:**
    - This part defines the structure of your final output table.
    - The first column(s) here (`student TEXT`) must match the type and number of your row identifier columns from `source_sql`.
    - The following columns (`math_score INT`, `science_score INT`, etc.) must match, in order, the categories produced by `category_sql`. Their data type should match the `value` column from `source_sql` (the `score` column, which is `INT`).

This two-argument version of `crosstab` is powerful because it guarantees your output table will always have the columns 'Math', 'Science', 'English', and 'History' in that order, filling in `(null)` where a student doesn't have a score for a particular subject.

#### `crosstabN()` functions

For common scenarios where the row identifier is text and you need a fixed number of text value columns (2, 3, or 4), `tablefunc` offers `crosstab2()`, `crosstab3()`, and `crosstab4()`. These are simplified wrappers around the main `crosstab` function, providing predefined output structures for common text-based pivot tables, saving you from writing the full `AS (...)` definition.

These functions are most useful when your source query provides a text row identifier, text categories, and text values (or values castable to text). The `crosstabN` function then produces an output table with a `row_name TEXT` column and `N` additional `category_X TEXT` columns.

For instance, if you use `crosstab3()`, the output table structure will implicitly be:
`(row_name TEXT, category_1 TEXT, category_2 TEXT, category_3 TEXT)`

No explicit `AS (...)` clause is needed. Remember that the source SQL query provided to `crosstabN` must still:

1.  Return three columns: `row_identifier`, `category`, `value`.
2.  Be sorted using `ORDER BY 1, 2`.
3.  The `value` column (third column of the source query) should be `TEXT` or cast to `TEXT`, as it populates the `category_X TEXT` output columns. The `row_identifier` (first column) also populates the `row_name TEXT` output column.

**Example using `crosstab3()`:**

Let's use our `product_sales_long` table again:

| product | quarter | sales |
| :------ | :------ | :---- |
| Apple   | Q1      | 100   |
| Apple   | Q2      | 120   |
| Banana  | Q1      | 80    |
| Apple   | Q3      | 110   |
| Banana  | Q2      | 95    |

To pivot this using `crosstab3()`, ensuring sales are treated as text for the output:

```sql
SELECT *
FROM crosstab3(
  $$SELECT product, quarter, sales::TEXT  -- Cast sales to TEXT
    FROM product_sales_long
    ORDER BY 1, 2$$  -- Important: ORDER BY row_id, category
);
```

**Expected Output:**

The output columns will be `row_name`, `category_1`, `category_2`, and `category_3`. The values from the `quarter` column (`Q1`, `Q2`, `Q3` in sorted order) will determine which `category_X` column receives the sales data.

| row_name | category_1 | category_2 | category_3 |
| :------- | :--------- | :--------- | :--------- |
| Apple    | 100        | 120        | 110        |
| Banana   | 80         | 95         | (null)     |

**Explanation:**

- `crosstab3` automatically defines the output columns as `row_name TEXT`, `category_1 TEXT`, `category_2 TEXT`, and `category_3 TEXT`.
- The `product` column from the source query populates the `row_name` output column. The sorted `quarter` values (`Q1`, `Q2`, `Q3`) correspond to `category_1`, `category_2`, and `category_3` respectively.
- The `ORDER BY 1, 2` clause in the source query is essential for correct processing and mapping of quarter data to category columns.
- `Banana` has sales data only for `Q1` and `Q2`, so its third value column (`category_3`, corresponding to `Q3` for Banana if it existed) is `NULL`.

### `connectby()`

The `connectby()` function is designed to traverse tree-like or hierarchical data structures, such as product category trees, organizational charts, or bill-of-materials.

Consider a `product_categories` table that defines a hierarchy of product categories:

| category_id | category_name | parent_category_id |
| :---------- | :------------ | :----------------- |
| 1           | Electronics   | NULL               |
| 2           | Computers     | 1                  |
| 3           | Laptops       | 2                  |
| 4           | Desktops      | 2                  |
| 5           | Phones        | 1                  |
| 6           | Smartphones   | 5                  |
| 7           | Books         | NULL               |
| 8           | Fiction       | 7                  |

We want to display the hierarchy starting from the 'Electronics' category (ID 1).

**Query:**

```sql
CREATE TABLE product_categories (
  category_id INT PRIMARY KEY,
  category_name TEXT,
  parent_category_id INT
);

INSERT INTO product_categories (category_id, category_name, parent_category_id) VALUES
    (1, 'Electronics', NULL),
    (2, 'Computers', 1),
    (3, 'Laptops', 2),
    (4, 'Desktops', 2),
    (5, 'Phones', 1),
    (6, 'Smartphones', 5),
    (7, 'Books', NULL),
    (8, 'Fiction', 7);

-- Using connectby to traverse the product category hierarchy
SELECT *
FROM connectby(
  'product_categories',   -- 1. Table name
  'category_id',          -- 2. Key field column name
  'parent_category_id',   -- 3. Parent key field column name
  '1',                    -- 4. Start row's key value (e.g., 'Electronics' category_id)
  0,                      -- 5. Maximum depth (0 for all levels)
  '>'                     -- 6. Branch delimiter string for the branch_path
) AS t(
    current_category_id INT, -- Output: Current item's key field
    parent_id INT,           -- Output: Parent item's key field
    level INT,               -- Output: Depth in the hierarchy (0 for start_with row)
    branch_path TEXT         -- Output: Text path from root to current item
);
```

**How `connectby()` works:**

- **Parameters:**

  1.  `table_name TEXT`: Name of the table containing the hierarchy.
  2.  `key_field TEXT`: Name of the column storing the unique ID for each item.
  3.  `parent_key_field TEXT`: Name of the column storing the ID of the parent item.
  4.  `start_with_value TEXT`: The `key_field` value of the item from which to start the traversal (must be provided as text).
  5.  `max_depth INTEGER`: Maximum number of levels to traverse (0 means no limit).
  6.  `branch_delimiter TEXT`: A string used to construct the `branch_path` output column.

- **Output Definition `AS t(...)`**:
  You must define the structure of the output table:
  - `key_field_alias <type>`: The key of the current item. Its data type should match the `key_field` in the source table (e.g., `current_category_id INT`).
  - `parent_key_field_alias <type>`: The key of the parent item. Its data type should match the `parent_key_field` (or `key_field`) in the source table (e.g., `parent_id INT`).
  - `level <INTEGER>`: The depth of the current item in the hierarchy (0 for the starting item, 1 for its direct children, and so on).
  - `branch_path <TEXT>`: If the `branch_delimiter` argument is provided to `connectby`, this column will contain a text representation of the path from the starting item to the current item, using the specified delimiter.

**Example output:**

| current_category_id | parent_id | level | branch_path |
| :------------------ | :-------- | :---- | :---------- |
| 1                   | (null)    | 0     | 1           |
| 2                   | 1         | 1     | 1>2         |
| 3                   | 2         | 2     | 1>2>3       |
| 4                   | 2         | 2     | 1>2>4       |
| 5                   | 1         | 1     | 1>5         |
| 6                   | 5         | 2     | 1>5>6       |

- This output shows `Electronics` (ID 1) at `level` 0 with a `branch_path` of `1`.
- `Computers` (ID 2) is a sub-category of `Electronics`, at `level` 1, with `branch_path` `1>2`.
- `Laptops` (ID 3) is a sub-category of `Computers`, at `level` 2, with `branch_path` `1>2>3`, and so on.

## Important considerations

- **`crosstab()` output definition**: You must always define the output columns and their types using the `AS (...)` clause when calling `crosstab()`. The number and types of these columns must match what your pivoted data will look like.
- **`crosstab()` category ordering**: The order of columns generated by the single-argument `crosstab` depends on the `ORDER BY` clause of your source query and the natural sort order of the category values. For explicit column ordering and to ensure all desired categories appear, use the two-argument version of `crosstab`.
- **Data types**: Pay close attention to data types. The types defined in the `AS (...)` clause for `crosstab` must match the 'value' column of the source query (for the pivoted value columns) and the row identifier column(s). For `connectby`, the key and parent key alias types in the `AS t(...)` clause must match the source table's corresponding column types.

## Conclusion

The `tablefunc` extension in Postgres is a powerful tool for reshaping and analyzing data. It provides essential functions like `normal_rand()` for generating random numbers, `crosstab()` for creating pivot tables, and `connectby()` for traversing hierarchical data structures.

## Resources

- [PostgreSQL `tablefunc` documentation](https://www.postgresql.org/docs/current/tablefunc.html)

<NeedHelp />
