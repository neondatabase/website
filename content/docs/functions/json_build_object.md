---
title: Postgres json_build_object() function
subtitle: Builds a JSON object out of a variadic argument list
enableTableOfContents: true
updatedOn: '2024-06-14T07:55:54.374Z'
---

`json_build_object` is used to construct a JSON object from a set of key-value pairs, creating a JSON representation of a row or set of rows. This has potential performance benefits compared to converting query results to JSON on the application side.

<CTA />

## Function signature

```sql
json_build_object ( VARIADIC "any" ) → json
```

## `json_build_object` example

Let's consider a scenario where we have a table storing information about users:

**users**

```text
| id |   name   | age |   city
|----|----------|-----|----------
| 1  | John Doe |  30 | New York |
| 2  | Jane Doe |  25 | London   |
```

Create the `users` table and insert some data into it:

```sql
CREATE TABLE users (
 id SERIAL PRIMARY KEY,
 name TEXT NOT NULL,
 age INTEGER,
 city TEXT
);

INSERT INTO users (name, age, city)
VALUES ('John Doe', 30, 'New York'),
      ('Jane Doe', 25, 'London');
```

Use `json_build_object` to create a JSON structure with user information:

```sql
SELECT id,
 json_build_object(
   'name', name,
   'age', age,
   'city', city
 ) AS user_data
FROM users;
```

This query returns the following results:

```text
| id |                       user_data
|----|--------------------------------------------------------
| 1  | {"name" : "John Doe", "age" : 30, "city" : "New York"}
| 2  | {"name" : "Jane Doe", "age" : 25, "city" : "London"}
```

## Advanced examples

### Nested objects with `json_build_object`

Let’s say we have a table of products with an `attributes` column containing JSON data:

**products**

```text
| id |    name    | price |            description            | category |                     attributes
|----|------------|-------|-----------------------------------|----------|----------------------------------------------------
| 1  | T-Shirt    | 25.99 | A comfortable cotton T-Shirt      | Clothing | {"size": "Medium", "color": "Blue", "rating": 4.5}
| 2  | Coffee Mug | 12.99 | A ceramic mug with a funny design | Kitchen  | {"size": "Small", "color": "White", "rating": 3.8}
| 3  | Sneakers   | 49.99 | Sporty sneakers for everyday use  | Footwear | {"size": "10", "color": "Black", "rating": 4.2}
```

Create the `products` table and insert some data into it:

```sql
CREATE TABLE products (
   id SERIAL PRIMARY KEY,
   name TEXT NOT NULL,
   price DECIMAL(5, 2) NOT NULL,
   description TEXT,
   category TEXT,
   attributes JSON
);

INSERT INTO products (name, price, description, category, attributes)
VALUES
   ('T-Shirt', 25.99, 'A comfortable cotton T-Shirt', 'Clothing', json_build_object(
       'color', 'Blue',
       'size', 'Medium',
       'rating', 4.5
   )),
   ('Coffee Mug', 12.99, 'A ceramic mug with a funny design', 'Kitchen', json_build_object(
       'color', 'White',
       'size', 'Small',
       'rating', 3.8
   )),
   ('Sneakers', 49.99, 'Sporty sneakers for everyday use', 'Footwear', json_build_object(
       'color', 'Black',
       'size', '10',
       'rating', 4.2
   ));
```

Use `json_build_object` to build a nested JSON object that represents the details of individual products:

```sql
SELECT
   id,
   name,
   price,
   json_build_object(
       'category', category,
       'description', description,
       'attributes', json_build_object(
           'color', attributes->>'color',
           'size', attributes->>'size'
       )
   ) AS details
FROM products;
```

This query returns the following results:

```text
| id |    name     | price |                                                               details
|----|-------------|-------|-------------------------------------------------------------------------------------------------------------------------------------
| 1  | T-Shirt     | 25.99 | {"category" : "Clothing", "description" : "A comfortable cotton T-Shirt", "attributes" : {"color" : "Blue", "size" : "Medium"}}
| 2  | Coffee Mug  | 12.99 | {"category" : "Kitchen", "description" : "A ceramic mug with a funny design", "attributes" : {"color" : "White", "size" : "Large"}}
```

### Order `json_build_object` output

Combine `json_build_object` with `ORDER BY` to sort the results based on a specific attribute within the JSON structure.

For example, you can build a `JSON` structure with `json_build_object` from the contents of the above `products` table, and then order the results based on `rating`.

```sql
SELECT
   id,
   name,
   price,
   json_build_object(
       'category', category,
       'description', description,
       'attributes', json_build_object(
           'color', attributes->>'color',
           'size', attributes->>'size',
           'rating', attributes->>'rating'
       )
   ) AS details
FROM products_with_rating
ORDER BY (attributes->>'rating')::NUMERIC DESC;
```

`ORDER BY` was to order the results based on the descending order of rating.

This query returns the following results:

```text
| id |    name    | price |                                                                        details
|----|------------|-------|-------------------------------------------------------------------------------------------------------------------------------------------------------
| 1  | T-Shirt    | 25.99 | {"category" : "Clothing", "description" : "A comfortable cotton T-Shirt", "attributes" : {"color" : "Blue", "size" : "Medium", "rating" : "4.5"}}
| 3  | Sneakers   | 49.99 | {"category" : "Footwear", "description" : "Sporty sneakers for everyday use", "attributes" : {"color" : "Black", "size" : "10", "rating" : "4.2"}}
| 2  | Coffee Mug | 12.99 | {"category" : "Kitchen", "description" : "A ceramic mug with a funny design", "attributes" : {"color" : "White", "size" : "Small", "rating" : "3.8"}}
```

### Grouped `json_build_object` output

To create a `JSON` object that groups the total price for each category of products in the products table:

```sql
SELECT
   category,
   json_build_object(
       'total_price', sum(price)
   ) AS category_total_price
FROM products
GROUP BY category;
```

This query returns the following results:

```text
| category |  category_total_price
|----------|-------------------------
| Kitchen  | {"total_price" : 12.99}
| Clothing | {"total_price" : 25.99}
```

## Additional considerations

### Performance and indexing

The performance of the `json_build_object` depends on various factors including the number of key-value pairs, nested levels (deeply nested objects can be more expensive to build). Consider using `JSONB` data type with `jsonb_build_object` for better performance.

If your `JSON` objects have nested structures, indexing on specific paths within the nested data can be beneficial for targeted queries.

### Alternative functions

Depending on your requirements, you might want to consider similar functions:

- [json_object](/docs/functions/json_object) - Builds a JSON object out of a text array.
- `json_agg` - Aggregates values, as a JSON array.
- `row_to_json` - Returns a row as a JSON object.
- `json_object_agg` - Aggregates key-value pairs into a JSON object.

## Resources

- [PostgreSQL documentation: JSON Functions and Operators](https://www.postgresql.org/docs/current/functions-json.html)
- [PostgreSQL documentation: JSON Types](https://www.postgresql.org/docs/current/datatype-json.html)
