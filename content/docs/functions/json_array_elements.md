---
title: Postgres json_array_elements function
subtitle: "Expands a JSON array into a set of rows."
enableTableOfContents: true
---




Use `json_array_elements` to expand a JSON array into a set of rows, each containing one element of the array. It is a simpler option compared to complex looping logic. It is also more efficient than executing the same operation on the application side by reducing data transfer and processing overhead.






Function signature:


```sql
json_array_elements(json)
```


## `json_array_elements` example


Suppose you have a table with developers info:


**developers**


| id |  name   |          skills          
|----|---------|---------------------------
| 1  | Alice   | ["Java", "Python", "SQL"]
| 2  | Bob     | ["C++", "JavaScript"]
| 3  | Charlie | ["HTML", "CSS", "React"]


<!--
```sql
CREATE TABLE developers (
 id INT PRIMARY KEY,
 name TEXT,
 skills JSON
);


INSERT INTO developers (id, name, skills) VALUES
 (1, 'Alice', '["Java", "Python", "SQL"]'),
 (2, 'Bob', '["C++", "JavaScript"]'),
 (3, 'Charlie', '["HTML", "CSS", "React"]');
```
-->


Now, let's say you want to extract each individual skill from the skills JSON array. You can use `json_array_elements` for that:


```sql
SELECT id, name, skill
FROM developers,
    json_array_elements(skills) AS skill;
```


Returns:


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


## Advanced examples


### Handling nested data


Let's consider a scenario where we have a table storing information about products:


**products**


| id |  name   |                                details                                
|----|---------|------------------------------------------------------------------------
| 1  | T-Shirt | {"sizes": ["S", "M", "L", "XL"], "colors": ["Red", "Blue", "Green"]}
| 2  | Hoodie  | {"sizes": ["XS", "S", "M", "L", "XL"], "colors": ["Black", "Gray"]}
| 3  | Dress   | {"sizes": ["S", "M", "L"], "colors": ["Pink", "Purple", "Black"]}
| 4  | Jeans   | {"sizes": ["28", "30", "32", "34"], "colors": ["Blue", "Black"]}
| 5  | Jacket  | {"sizes": ["S", "M", "L", "XL"], "colors": ["Black", "Brown", "Navy"]}


<!--
```sql
CREATE TABLE products (
 id INTEGER PRIMARY KEY,
 name TEXT,
 details JSON
);


INSERT INTO products (id, name, details) VALUES
 (1, 'T-Shirt', '{"sizes": ["S", "M", "L", "XL"], "colors": ["Red", "Blue", "Green"]}'),
 (2, 'Hoodie', '{"sizes": ["XS", "S", "M", "L", "XL"], "colors": ["Black", "Gray"]}'),
 (3, 'Dress', '{"sizes": ["S", "M", "L"], "colors": ["Pink", "Purple", "Black"]}'),
 (4, 'Jeans', '{"sizes": ["28", "30", "32", "34"], "colors": ["Blue", "Black"]}'),
 (5, 'Jacket', '{"sizes": ["S", "M", "L", "XL"], "colors": ["Black", "Brown", "Navy"]}');
```
-->


`json_array_elements` is used to get all the combinations of size and color for a specific product:


```sql
SELECT
 id,
 name,
 size,
 color
FROM products AS p,
 json_array_elements(p.details -> 'sizes') AS size,
 json_array_elements(p.details -> 'colors') AS color
WHERE name = 'T-Shirt';
```


Returns:


| id |  name   | size | color  |
|----|---------|------|--------|
| 1  | T-Shirt | "S"  | "Red"  |
| 1  | T-Shirt | "S"  | "Blue" |
| 1  | T-Shirt | "S"  | "Green"|
| 1  | T-Shirt | "M"  | "Red"  |
| 1  | T-Shirt | "M"  | "Blue" |
| 1  | T-Shirt | "M"  | "Green"|
| 1  | T-Shirt | "L"  | "Red"  |
| 1  | T-Shirt | "L"  | "Blue" |
| 1  | T-Shirt | "L"  | "Green"|
| 1  | T-Shirt | "XL" | "Red"  |
| 1  | T-Shirt | "XL" | "Blue" |
| 1  | T-Shirt | "XL" | "Green"|


## Filtering


You can use the `json_array_elements` function to extract the sizes from the JSON data and then filter the products based on a specific color (or size):


```sql
SELECT *
FROM products
WHERE 'Blue' IN (
    SELECT json_array_elements_text(details->'colors')
);
```


Returns:


| id |   name   |                               details                                |
|----|----------|------------------------------------------------------------------------|
|  1 | T-Shirt  | {"sizes": ["S", "M", "L", "XL"], "colors": ["Red", "Blue", "Green"]} |
|  4 | Jeans    | {"sizes": ["28", "30", "32", "34"], "colors": ["Blue", "Black"]}     |




## Handling null


Update the table to insert another product (Socks) with one of the values in the `sizes` as null:


**products**


| id |  name   |                                 details                                 |
|----|---------|-------------------------------------------------------------------------|
|  6 | Socks   | {"sizes": ["S", null, "L", "XL"], "colors": ["White", "Black", "Gray"]}|


<!--
```sql
INSERT INTO products (id, name, details) VALUES (6, 'Socks', '{"sizes": ["S", null, "L", "XL"], "colors": ["White", "Black", "Gray"]}');
```
-->


Querying for Socks shows how null values in an array is handled:


```sql
SELECT
 id,
 name,
 size
FROM products AS p,
 json_array_elements(p.details -> 'sizes') AS size
WHERE name = 'Socks';
```


Returns:


| id | name  | size |
|----|-------|------|
|  6 | Socks | "S"  |
|  6 | Socks | null |
|  6 | Socks | "L"  |
|  6 | Socks | "XL" |


### Nested arrays


You can also handle nested arrays with `json_array_elements`.


Consider a scenario where each product has multiple variants, and each variant has an array of sizes and an array of colours.


**electronics_products**


| id |    name    |                                                                                   details                                                                                   
|----|------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
|  1 | Laptop     | {"variants": [{"model": "A", "sizes": ["13 inch", "15 inch"], "colors": ["Silver", "Black"]}, {"model": "B", "sizes": ["15 inch", "17 inch"], "colors": ["Gray", "White"]}]}
|  2 | Smartphone | {"variants": [{"model": "X", "sizes": ["5.5 inch", "6 inch"], "colors": ["Black", "Gold"]}, {"model": "Y", "sizes": ["6.2 inch", "6.7 inch"], "colors": ["Blue", "Red"]}]}


<!--
```sql
CREATE TABLE electronics_products (
 id INTEGER PRIMARY KEY,
 name TEXT,
 details JSON
);


INSERT INTO electronics_products (id, name, details) VALUES
 (1, 'Laptop', '{"variants": [{"model": "A", "sizes": ["13 inch", "15 inch"], "colors": ["Silver", "Black"]}, {"model": "B", "sizes": ["15 inch", "17 inch"], "colors": ["Gray", "White"]}]}'),
 (2, 'Smartphone', '{"variants": [{"model": "X", "sizes": ["5.5 inch", "6 inch"], "colors": ["Black", "Gold"]}, {"model": "Y", "sizes": ["6.2 inch", "6.7 inch"], "colors": ["Blue", "Red"]}]}');
```
-->


To handle the nested arrays and extract information about each variant:


```sql
SELECT
 id,
 name,
 variant->>'model' AS model,
 size,
 color
FROM
 electronics_products,
  json_array_elements(details->'variants') AS variant,
  json_array_elements_text(variant->'sizes') AS t1(size),
  json_array_elements_text(variant->'colors') AS t2(color);
```


Returns:




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




## Additional considerations


### Alternative options


**jsonb_array_elements**


Consider this variant for performance benefits with `jsonb` data. `jsonb_array_elements` only accepts `jsonb` data, while `json_array_elements` works with both `json` and `jsonb`. It is typically faster, especially for larger arrays, due to its optimization for the binary `jsonb` format.


**json_array_elements_text**


While `json_array_elements` returns each extracted element as a JSON value, `json_array_elements_text` returns each extracted element as a plain text *string*.


Prefer `json_array_elements` when you need to maintain the JSON structure of the elements for further JSON-related operations or analysis and `json_array_elements_text` if you need to work with the extracted elements as plain text for string operations, text analysis, or integration with text-based functions.


### JSON array order


If the order of the elements is important, consider using the `WITH ORDINALITY` option:


```sql
SELECT
   id,
   name,
   skill,
   ordinality
FROM
   developers,
   json_array_elements(skills) WITH ORDINALITY AS t(skill, ordinality);
```


Returns:


| id |  name   |    skill     | ordinality |
|----|---------|--------------|------------|
|  1 | Alice   | "Java"       |          1 |
|  1 | Alice   | "Python"     |          2 |
|  1 | Alice   | "SQL"        |          3 |
|  2 | Bob     | "C++"        |          1 |
|  2 | Bob     | "JavaScript" |          2 |
|  3 | Charlie | "HTML"       |          1 |
|  3 | Charlie | "CSS"        |          2 |
|  3 | Charlie | "React"      |          3 |


`WITH ORDINALITY` option in the query adds `ordinarily` column representing the original order of the skills in the array.

## Resources

- [PostgreSQL Documentation: JSON Functions and Operators](https://www.postgresql.org/docs/current/functions-json.html)
- [PostgreSQL Documentation: JSON Types](https://www.postgresql.org/docs/current/datatype-json.html)
