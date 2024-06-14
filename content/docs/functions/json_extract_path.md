---
title: Postgres json_extract_path() function
subtitle: Extracts a JSON sub-object at the specified path
enableTableOfContents: true
updatedOn: '2024-06-14T07:55:54.374Z'
---

You can use the `json_extract_path` function to extract the value at a specified path within a `JSON` document. This approach is performant compared to querying the entire `JSON` payload and processing it on the application side. It is particularly useful when dealing with nested `JSON` structures.

<CTA />

## Function signature

```sql
json_extract_path(from_json JSON, VARIADIC path_elems TEXT[]) -> JSON
```

## Example usage

To illustrate the `json_extract_path` function in Postgres, let's consider a scenario where we have a table storing information about books. Each book has a `JSON` column containing details such as `title`, `author`, and publication `year`. You can create the `book` table using the SQL statements shown below.

**books**

```sql
CREATE TABLE books (
 id INT,
 info JSON
);

INSERT INTO books (id, info) VALUES
 (1, '{"title": "The Catcher in the Rye", "author": "J.D. Salinger", "year": 1951}'),
 (2, '{"title": "To Kill a Mockingbird", "author": "Harper Lee", "year": 1960}'),
 (3, '{"title": "1984", "author": "George Orwell", "year": 1949}');
```

```text
| id | info                                                                         |
|----|------------------------------------------------------------------------------|
| 1  | {"title": "The Catcher in the Rye", "author": "J.D. Salinger", "year": 1951} |
| 2  | {"title": "To Kill a Mockingbird", "author": "Harper Lee", "year": 1960}     |
| 3  | {"title": "1984", "author": "George Orwell", "year": 1949}                   |
```

Now, let's use the `json_extract_path` function to extract the `title` and `author` of each book:

```sql
SELECT id,
      json_extract_path(info, 'title') as title,
      json_extract_path(info, 'author') as author
FROM books;
```

This query returns the following values:

```text
| id | title                    | author           |
|----|--------------------------|------------------|
| 1  | "The Catcher in the Rye" | "J.D. Salinger"  |
| 2  | "To Kill a Mockingbird"  | "Harper Lee"     |
| 3  | "1984"                   | "George Orwell"  |
```

## Advanced examples

Consider a `products` table that stores information about products in an e-commerce system. The table schema and data are outlined below.

**products**

```sql
CREATE TABLE products (
 id INT,
 attributes JSON
);

INSERT INTO products (id, attributes) VALUES
 (1, '{"name": "Laptop", "specs": {"brand": "Dell", "RAM": "16GB", "storage": {"type": "SSD", "capacity": "512GB"}}, "tags": ["pc"]}'),
 (2, '{"name": "Smartphone", "specs": {"brand": "Google", "RAM": "8GB", "storage": {"type": "UFS", "capacity": "256GB"}}, "tags": ["android",
 "pixel"]}'),
 (3, '{"name": "Smartphone", "specs": {"brand": "Apple", "RAM": "8GB", "storage": {"type": "UFS", "capacity": "128GB"}}, "tags": ["ios", "iphone"]}');
```

```text
| id     | attributes                                                                                                                                        |
|--------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| 1      | {"name": "Laptop", "specs": {"brand": "Dell", "RAM": "16GB", "storage": {"type": "SSD", "capacity": "512GB"}}, "tags": ["pc"]}                    |
| 2      | {"name": "Smartphone", "specs": {"brand": "Google", "RAM": "8GB", "storage": {"type": "UFS", "capacity": "256GB"}}, "tags": ["android", "pixel"]} |
| 3      | {"name": "Smartphone", "specs": {"brand": "Apple", "RAM": "8GB", "storage": {"type": "UFS", "capacity": "128GB"}}, "tags": ["ios", "iphone"]}     |
```

### Extract from nested JSON objects with `json_extract_path`

Let's use `json_extract_path` to retrieve information about the storage type and capacity for each product, demonstrating how to extract values from a nested `JSON` object.

```sql
SELECT
 id,
 json_extract_path(attributes, 'specs', 'storage', 'type') as storage_type,
 json_extract_path(attributes, 'specs', 'storage', 'capacity') as storage_capacity
FROM products;
```

This query returns the following values:

```text
| id | storage_type | storage_capacity |
|----|--------------|------------------|
| 1  | "SSD"        | "512GB"          |
| 2  | "UFS"        | "256GB"          |
| 3  | "UFS"        | "128GB"          |
```

### Extract from array with `json_extract_path`

Now, let's use `json_extract_path` to extract information about the associated tags as well, demonstrating how to extract values from a `JSON` array.

```sql
SELECT
 id,
 json_extract_path(attributes, 'specs', 'storage', 'type') as storage_type,
 json_extract_path(attributes, 'specs', 'storage', 'capacity') as storage_capacity,
 json_extract_path(attributes, 'tags', '0') as first_tag,
 json_extract_path(attributes, 'tags', '1') as second_tag
FROM products;
```

This query returns the following values:

```text
| id | storage_type | storage_capacity | first_tag | second_tag |
|----|--------------|------------------|-----------|------------|
| 1  | "SSD"        | "512GB"          | "pc"      |  null      |
| 2  | "UFS"        | "256GB"          | "android" | "pixel"    |
| 3  | "UFS"        | "128GB"          | "ios"     | "iphone"   |
```

### Use `json_extract_path` in Joins

Let's say you have two tables, `employees` and `departments`, and the `employees` table has a `JSON` column named `details` that contains information about each employee's department. You want to join these tables based on the department information stored in the `JSON` column. The table schemas and data used in this example are shown below.

**departments**

```sql
CREATE TABLE departments (
   department_id SERIAL PRIMARY KEY,
   department_name VARCHAR(255)
);

INSERT INTO departments (department_name) VALUES
   ('IT'),
   ('HR'),
   ('Marketing');
```

```text
| department_id | department_name  |
|---------------|------------------|
|             1 | IT               |
|             2 | HR               |
|             3 | Marketing        |
```

**employees**

```sql
CREATE TABLE employees (
   employee_id SERIAL PRIMARY KEY,
   employee_name VARCHAR(255),
   details JSON
);

INSERT INTO employees (employee_name, details) VALUES
   ('John Doe', '{"department": "IT"}'),
   ('Jane Smith', '{"department": "HR"}'),
   ('Bob Johnson', '{"department": "Marketing"}');
```

```text
| employee_id | employee_name |           details           |
|-------------|---------------|-----------------------------|
|           1 | John Doe      | {"department": "IT"}        |
|           2 | Jane Smith    | {"department": "HR"}        |
|           3 | Bob Johnson   | {"department": "Marketing"} |
```

You can use `JOIN` with `json_extract_path` to retrieve information:

```sql
SELECT
   employees.employee_name,
   departments.department_name
FROM
   employees
JOIN
   departments ON TRIM(BOTH '"' FROM json_extract_path(employees.details, 'department')::TEXT) = departments.department_name;
```

This query returns the following values:

```test
| employee_name | department_name  |
|---------------|------------------|
| John Doe      | IT               |
| Jane Smith    | HR               |
| Bob Johnson   | Marketing        |
```

The `json_extract_path` function extracts the value of the `department` key from the `JSON` column in the `employees` table. The `JOIN` is then performed based on matching department names.

## Additional considerations

### Performance and Indexing

The `json_extract_path` function performs well when extracting data from `JSON` documents, especially compared to extracting data in application code. It allows performing the extraction directly in the database, avoiding transferring entire `JSON` documents to the application.

However, performance can degrade with highly nested `JSON` structures and very long text strings. In those cases, using the binary `JSONB` data type and the `jsonb_extract_path` function will likely offer better performance.

Indexing `JSON` documents can also significantly improve `json_extract_path` query performance when filtering data based on values extracted from `JSON`.

### Alternative functions

- [json_extract_path_text](/docs/functions/json_extract_path_text) - The regular `json_extract_path` function returns the extracted value as a `JSON` object or array, preserving its `JSON` structure, whereas the alternative `json_extract_path_text` function returns the extracted value as a plain text string, casting any `JSON` objects or arrays to their string representations.

  Use the regular `json_extract_path` function when you need to apply `JSON`-specific functions or operators to the extracted value, requiring `JSON` data types. The alternative `json_extract_path_text` function is preferable if you need to work directly with the extracted value as a string, for text processing, concatenation, or comparison.

- `jsonb_extract_path` - The `jsonb_extract_path` function works with the `jsonb` data type, which offers a binary representation of `JSON` data. This alternative function is generally faster than `json_extract_path` for most operations, as it's optimized for the binary `jsonb` format. This difference in performance is often more pronounced with larger `JSON` structures and frequent path extractions.

{/*
This example does not work. It returns empty values.

### Invalid paths

`json_extract_path` handles an invalid path by returning `NULL`, as in the following example:

```sql
SELECT
 id,
 json_extract_path(attributes, 'speks') as storage_type
FROM products;
```

The query above, which specifies an invalid path (`'speks'` instead of `'specs'`), returns `NULL` as shown:

```text
| id | storage_type |
|----|--------------|
|  1 |   (null)     |
|  2 |   (null)     |
|  3 |   (null)     |
```

*/}

## Resources

- [PostgreSQL documentation: JSON Functions and Operators](https://www.postgresql.org/docs/current/functions-json.html)
- [PostgreSQL documentation: JSON Types](https://www.postgresql.org/docs/current/datatype-json.html)

<NeedHelp />
