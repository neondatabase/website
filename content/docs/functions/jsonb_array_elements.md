---
title: Postgres jsonb_array_elements() function
subtitle: Expands a JSONB array into a set of rows
enableTableOfContents: true
updatedOn: '2024-06-14T07:55:54.376Z'
---

You can use the `jsonb_array_elements` function to expand a `JSONB` array into a set of rows, each containing one element of the array. It is a simpler option compared to complex looping logic. It is also more efficient than executing the same operation on the application side by reducing data transfer and processing overhead.

<CTA />

## Function signature

```sql
jsonb_array_elements(json)
```

## `jsonb_array_elements` example

Suppose you have a table with information about developers:

**developers**

```sql
CREATE TABLE developers (
 id INT PRIMARY KEY,
 name TEXT,
 skills JSONB
);

INSERT INTO developers (id, name, skills) VALUES
 (1, 'Alice', '["Java", "Python", "SQL"]'),
 (2, 'Bob', '["C++", "JavaScript"]'),
 (3, 'Charlie', '["HTML", "CSS", "React"]');
```

```
| id |  name   |          skills
|----|---------|---------------------------
| 1  | Alice   | ["Java", "Python", "SQL"]
| 2  | Bob     | ["C++", "JavaScript"]
| 3  | Charlie | ["HTML", "CSS", "React"]
```

Now, let's say you want to extract each individual skill from the skills `JSON` array. You can use `jsonb_array_elements` for that:

```sql
SELECT id, name, skill
FROM developers,
    jsonb_array_elements(skills) AS skill;
```

This query returns the following values:

```text
| id |  name   |    skill
|----|---------|--------------
| 1  | Alice   | "Java"
| 1  | Alice   | "Python"
| 1  | Alice   | "SQL"
| 2  | Bob     | "C++"
| 2  | Bob     | "JavaScript"
| 3  | Charlie | "HTML"
| 3  | Charlie | "CSS"
| 3  | Charlie | "React"
```

## Advanced examples

This section shows advanced `jsonb_array_elements` examples.

## Filtering `jsonb_array_elements`

You can use the `jsonb_array_elements` function to extract the sizes from the `JSON` data and then filter the products based on a specific color (or size):

```sql
SELECT *
FROM products
WHERE 'Blue' IN (
 SELECT REPLACE(jsonb_array_elements(details->'colors')::text, '"', '')::text
);
```

This query returns the following values:

```text
| id |   name   |                               details                                  |
|----|----------|------------------------------------------------------------------------|
|  1 | T-Shirt  | {"sizes": ["S", "M", "L", "XL"], "colors": ["Red", "Blue", "Green"]}   |
|  4 | Jeans    | {"sizes": ["28", "30", "32", "34"], "colors": ["Blue", "Black"]}       |
```

## Handling `NULL` in `jsonb_array_elements`

This example updates the table to insert another product (`Socks`) with one of the values in the `sizes` as `null`:

**products**

```text
| id |  name   |                                 details                                 |
|----|---------|-------------------------------------------------------------------------|
|  6 | Socks   | {"sizes": ["S", null, "L", "XL"], "colors": ["White", "Black", "Gray"]} |
```

```sql
INSERT INTO products (id, name, details) VALUES (6, 'Socks', '{"sizes": ["S", null, "L", "XL"], "colors": ["White", "Black", "Gray"]}');
```

Querying for `Socks` shows how null values in an array are handled:

```sql
SELECT
 id,
 name,
 size
FROM products AS p,
 jsonb_array_elements(p.details -> 'sizes') AS size
WHERE name = 'Socks';
```

This query returns the following values:

```
| id | name  | size |
|----|-------|------|
|  6 | Socks | "S"  |
|  6 | Socks | null |
|  6 | Socks | "L"  |
|  6 | Socks | "XL" |
```

### Ordering `json_array_elements` output using `WITH ORDINALITY`

Let's consider a scenario where you have a table named `workflow` with a `JSONB` column `steps` representing sequential steps in a workflow:

**workflow**

```sql
CREATE TABLE workflow (
   id SERIAL PRIMARY KEY,
   workflow_name TEXT,
   steps JSONB
);

INSERT INTO workflow (workflow_name, steps) VALUES
   ('Employee Onboarding', '{"tasks": ["Submit Resume", "Interview", "Background Check", "Offer", "Orientation"]}'),
   ('Project Development', '{"tasks": ["Requirement Analysis", "Design", "Implementation", "Testing", "Deployment"]}'),
   ('Order Processing', '{"tasks": ["Order Received", "Payment Verification", "Packing", "Shipment", "Delivery"]}');
```

```
| id |    workflow_name    |                                          steps                                          |
|----|---------------------|-----------------------------------------------------------------------------------------|
|  1 | Employee Onboarding | {"tasks": ["Submit Resume", "Interview", "Background Check", "Offer", "Orientation"]}   |
|  2 | Project Development | {"tasks": ["Requirement Analysis", "Design", "Implementation", "Testing", "Deployment"]}|
|  3 | Order Processing    | {"tasks": ["Order Received", "Payment Verification", "Packing", "Shipment", "Delivery"]}|
```

Each workflow consists of a series of tasks, and you want to extract and display the tasks along with their order in the workflow.

```sql
SELECT
   workflow_name,
   task.value AS task_name,
   task.ordinality AS task_order
FROM
   workflow,
   jsonb_array_elements(steps->'tasks') WITH ORDINALITY AS task;
```

This query returns the following values:

```
|    workflow_name    |       task_name        | task_order |
|---------------------|------------------------|------------|
| Employee Onboarding | "Submit Resume"        |          1 |
| Employee Onboarding | "Interview"            |          2 |
| Employee Onboarding | "Background Check"     |          3 |
| Employee Onboarding | "Offer"                |          4 |
| Employee Onboarding | "Orientation"          |          5 |
| Project Development | "Requirement Analysis" |          1 |
| Project Development | "Design"               |          2 |
| Project Development | "Implementation"       |          3 |
| Project Development | "Testing"              |          4 |
| Project Development | "Deployment"           |          5 |
| Order Processing    | "Order Received"       |          1 |
| Order Processing    | "Payment Verification" |          2 |
| Order Processing    | "Packing"              |          3 |
| Order Processing    | "Shipment"             |          4 |
| Order Processing    | "Delivery"             |          5 |
```

### Nested arrays in `jsonb_array_elements`

You can also handle nested arrays with `jsonb_array_elements`.

Consider a scenario where each product in an `electronics_products` table has multiple variants, and each variant has an array of sizes and an array of colors.

**electronics_products**

```sql
CREATE TABLE electronics_products (
 id INTEGER PRIMARY KEY,
 name TEXT,
 details JSONB
);


INSERT INTO electronics_products (id, name, details) VALUES
 (1, 'Laptop', '{"variants": [{"model": "A", "sizes": ["13 inch", "15 inch"], "colors": ["Silver", "Black"]}, {"model": "B", "sizes": ["15 inch", "17 inch"], "colors": ["Gray", "White"]}]}'),
 (2, 'Smartphone', '{"variants": [{"model": "X", "sizes": ["5.5 inch", "6 inch"], "colors": ["Black", "Gold"]}, {"model": "Y", "sizes": ["6.2 inch", "6.7 inch"], "colors": ["Blue", "Red"]}]}');
```

```text
| id |    name    |                                                                                   details
|----|------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
|  1 | Laptop     | {"variants": [{"model": "A", "sizes": ["13 inch", "15 inch"], "colors": ["Silver", "Black"]}, {"model": "B", "sizes": ["15 inch", "17 inch"], "colors": ["Gray", "White"]}]}
|  2 | Smartphone | {"variants": [{"model": "X", "sizes": ["5.5 inch", "6 inch"], "colors": ["Black", "Gold"]}, {"model": "Y", "sizes": ["6.2 inch", "6.7 inch"], "colors": ["Blue", "Red"]}]}
```

To handle the nested arrays and extract information about each variant, you can run this query using the `jsonb_array_elements` function:

```sql
SELECT
 id,
 name,
 variant->>'model' AS model,
 size,
 color
FROM
 electronics_products,
  jsonb_array_elements(details->'variants') AS variant,
  jsonb_array_elements_text(variant->'sizes') AS t1(size),
  jsonb_array_elements_text(variant->'colors') AS t2(color);
```

This query returns the following values:

```text
| id |    name    | model |   size   | color  |
|----|------------|-------|----------|--------|
|  1 | Laptop     | A     | 13 inch  | Silver |
|  1 | Laptop     | A     | 13 inch  | Black  |
|  1 | Laptop     | A     | 15 inch  | Silver |
|  1 | Laptop     | A     | 15 inch  | Black  |
|  1 | Laptop     | B     | 15 inch  | Gray   |
|  1 | Laptop     | B     | 15 inch  | White  |
|  1 | Laptop     | B     | 17 inch  | Gray   |
|  1 | Laptop     | B     | 17 inch  | White  |
|  2 | Smartphone | X     | 5.5 inch | Black  |
|  2 | Smartphone | X     | 5.5 inch | Gold   |
|  2 | Smartphone | X     | 6 inch   | Black  |
|  2 | Smartphone | X     | 6 inch   | Gold   |
|  2 | Smartphone | Y     | 6.2 inch | Blue   |
|  2 | Smartphone | Y     | 6.2 inch | Red    |
|  2 | Smartphone | Y     | 6.7 inch | Blue   |
|  2 | Smartphone | Y     | 6.7 inch | Red    |
```

### `jsonb_array_elements` with joins

Let's assume you want to retrieve a list of users along with their roles in each organization. The data is stored in an `organizations` table and a `users` table.

**organizations**

```
| id |                           members                            |
|----|--------------------------------------------------------------|
|  1 | [{"id": 23, "role": "admin"}, {"id": 24, "role": "default"}] |
|  2 | [{"id": 23, "role": "user"}]                                 |
|  3 | [{"id": 24, "role": "admin"}, {"id": 25, "role": "default"}] |
|  4 | [{"id": 25, "role": "user"}]                                 |
```

**users**

```
| id  | name  |      email       |
|-----|-------|------------------|
| 23  | Max   | max@gmail.com    |
| 24  | Joe   | joe@gmail.com    |
| 25  | Alice | alice@gmail.com  |
```

```sql
CREATE TABLE organizations (
   id SERIAL PRIMARY KEY,
   members JSONB
);

CREATE TABLE users (
   id INTEGER PRIMARY KEY,
   name TEXT,
   email TEXT
);

INSERT INTO organizations (members) VALUES
   ('[{ "id": 23, "role": "admin" }, { "id": 24, "role": "default" }]'),
   ('[{ "id": 23, "role": "user" }]'),
   ('[{ "id": 24, "role": "admin" }, { "id": 25, "role": "default" }]'),
   ('[{ "id": 25, "role": "user" }]');

INSERT INTO users (id, name, email) VALUES
   (23, 'Max', 'max@gmail.com'),
   (24, 'Joe', 'joe@gmail.com'),
   (25, 'Alice', 'alice@gmail.com');
```

You can use the `jsonb_array_elements` function to extract the `members` from the `JSONB` array in the `organizations` table and then join with the `users` table.

```sql
SELECT
   o.id AS organization_id,
   u.id AS user_id,
   u.name AS user_name,
   u.email AS user_email,
   m->>'role' AS member_role
FROM
   organizations o
JOIN jsonb_array_elements(o.members) AS m ON true
JOIN users u ON m->>'id' = u.id::TEXT;
```

This query returns the following values:

```
| organization_id | user_id | user_name |   user_email    | member_role |
|-----------------|---------|-----------|-----------------|-------------|
|               2 |      23 | Max       | max@gmail.com   | user        |
|               1 |      23 | Max       | max@gmail.com   | admin       |
|               3 |      24 | Joe       | joe@gmail.com   | admin       |
|               1 |      24 | Joe       | joe@gmail.com   | default     |
|               4 |      25 | Alice     | alice@gmail.com | user        |
|               3 |      25 | Alice     | alice@gmail.com | default     |
```

## Additional considerations

This section outlines additional considerations including alternative functions.

### Alternatives to `jsonb_array_elements`

Use `jsonb_array_elements` when you need to maintain the `JSON` structure of the elements for further `JSON`-related operations or analysis and `jsonb_array_elements_text` if you need to work with the extracted elements as plain text for string operations, text analysis, or integration with text-based functions.

If you want to create a comma-separated list of all skills for each developer in the `developers` table, `jsonb_array_elements_text` can be used along with `string_agg`.

```sql
SELECT name, string_agg(skill, ',') AS skill_list
FROM developers, jsonb_array_elements_text(skills) AS skill
GROUP BY name;
```

This query returns the following values:

```
|  name   |   skill_list    |
|---------|-----------------|
|  Alice  | Java,Python,SQL |
|   Bob   | C++,JavaScript  |
| Charlie | HTML,CSS,React  |
```

Using `jsonb_array_elements` would result in an error because it returns `JSONB` values, which cannot be directly concatenated with the string operator.

```sql
SELECT name, string_agg(skill, ',') AS skill_list
FROM developers, jsonb_array_elements(skills) AS skill
GROUP BY name;
```

**jsonb_path_query**

`jsonb_path_query` uses `JSON` Path expressions for flexible navigation and filtering within `JSONB` structures and returns a `JSONB` array containing matching elements. It supports filtering within the path expression itself, enabling complex conditions and excels at navigating and extracting elements from nested arrays and objects.

If your query involves navigating through multiple levels of nesting, complex filtering conditions, or updates to `JSONB` data, `jsonb_path_query` is often the preferred choice.

Consider a simple example — to extract the first skill of each developer in the `developers` table:

```sql
SELECT jsonb_path_query(skills, '$[0]') AS first_skill
FROM developers;
```

This query returns the following values:

```
| first_skill |
|-------------|
|   "Java"    |
|   "C++"     |
|   "HTML"    |
```

## Resources

- [PostgreSQL documentation: JSON Functions and Operators](https://www.postgresql.org/docs/current/functions-json.html)
- [PostgreSQL documentation: JSON Types](https://www.postgresql.org/docs/current/datatype-json.html)
