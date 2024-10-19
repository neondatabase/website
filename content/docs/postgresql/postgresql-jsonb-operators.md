---
title: 'PostgreSQL JSONB Operators'
redirectFrom: 
            - /docs/postgresql/postgresql-json-functions/postgresql-jsonb-operators/
tableOfContents: true
---

**Summary**: in this tutorial, you will learn about the PostgreSQL JSONB operators and how to use them to process JSONB data effectively.

## Introduction to PostgreSQL JSONB operators

JSONB type allows you to store and query [JSON](/docs/postgresql/postgresql-json) data efficiently. JSONB type supports a wide range of operators that help you manipulate and query JSON documents effectively.

The following table illustrates the JSONB operators:

| Operator | Syntax                        | Meaning                                                                                                                                        |
| -------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `->`     | `jsonb->'key'`                | Extract the value of the 'key' from a JSON object as a JSONB value                                                                             |
| `->>`    | `jsonb->>'key'`               | Extract the value of the 'key' from a JSON object as a text string                                                                             |
| `@>`     | `jsonb @> jsonb → boolean`    | Return true if the first JSONB value contains the second JSONB value or false otherwise.                                                       |
| `<@`     | `jsonb <@ jsonb → boolean`    | Return true if the first JSONB value is contained in the second one or false otherwise.                                                        |
| `?`      | `jsonb ? text → boolean`      | Return true if a text string exists as a top-level key of a JSON object or as an element of a JSON array or false otherwise.                   |
| `?|`     | `jsonb ?| text[] → boolean`   | Return true if any text string in an array exists as top-level keys of a JSON object or as elements of a JSON array.                           |
| `?&`     | `jsonb ?& text[] → boolean`   | Return true if all text strings in an array exist as top-level keys of a JSON object or as elements of a JSON array.                           |
| `||`     | `jsonb || jsonb → jsonb`      | Concatenate two JSONB values into one.                                                                                                         |
| `-`      | `jsonb - text → jsonb`        | Delete a key (and its value) from a JSON object, or matching string value(s) from a JSON array.                                                |
| `-`      | `jsonb - text[] → jsonb`      | Delete all matching keys or array elements from the left operand.                                                                              |
| `-`      | `jsonb - integer → jsonb`     | Delete the array element with specified index (negative integers count from the end of the array).                                             |
| `#-`     | `jsonb #- text[] → jsonb`     | Delete the field or array element at the specified path.                                                                                       |
| `@?`     | `jsonb @? jsonpath → boolean` | Return true if a JSON path returns any item for the specified JSONB value.                                                                     |
| `@@`     | `jsonb @@ jsonpath → boolean` | Evaluate a JSON path against a JSONB value and return a boolean result based on whether the JSON path matches any items within the JSONB value |

## PostgreSQL JSONB operators examples

Let's set up a sample table and take some examples of using PostgreSQL JSONB operators.

### Setting up a table

First, [create a table](/docs/postgresql/postgresql-create-table) called `products` that has a JSONB column to store JSON data:

```
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    data JSONB
);
```

Second, [insert rows](/docs/postgresql/postgresql-insert-multiple-rows) into the `products` table:

```
INSERT INTO products (data)
VALUES
    ('{
        "name": "iPhone 15 Pro",
        "category": "Electronics",
        "description": "The latest iPhone with advanced features.",
        "brand": "Apple",
        "price": 999.99,
        "attributes": {
            "color": "Graphite",
            "storage": "256GB",
            "display": "6.1-inch Super Retina XDR display",
            "processor": "A15 Bionic chip"
        },
        "tags": ["smartphone", "iOS", "Apple"]
    }'),
    ('{
        "name": "Samsung Galaxy Watch 4",
        "category": "Electronics",
        "description": "A smartwatch with health tracking and stylish design.",
        "brand": "Samsung",
        "price": 349.99,
        "attributes": {
            "color": "Black",
            "size": "42mm",
            "display": "AMOLED display",
            "sensors": ["heart rate monitor", "ECG", "SpO2"]
        },
        "tags": ["smartwatch", "wearable", "Samsung"]
    }'),
    ('{
        "name": "Leather Case for iPhone 15 Pro",
        "category": "Accessories",
        "description": "Premium leather case for iPhone 15 Pro.",
        "brand": "Apple",
        "price": 69.99,
        "attributes": {
            "color": "Saddle Brown",
            "material": "Genuine leather",
            "compatible_devices": ["iPhone 15 Pro", "iPhone 15 Pro Max"]
        },
        "tags": ["phone case", "accessory", "Apple"]
    }'),
    ('{
        "name": "Wireless Charging Pad",
        "category": "Accessories",
        "description": "Fast wireless charger compatible with smartphones and smartwatches.",
        "brand": "Anker",
        "price": 29.99,
        "attributes": {
            "color": "White",
            "compatible_devices": ["iPhone", "Samsung Galaxy", "Apple Watch", "Samsung Galaxy Watch"]
        },
        "tags": ["accessory", "wireless charger"]
    }')
RETURNING *;
```

Output:

```
                          data

----+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  1 | {"name": "iPhone 15 Pro", "tags": ["smartphone", "iOS", "Apple"], "brand": "Apple", "price": 999.99, "category": "Electronics", "attributes": {"color": "Graphite", "display": "6.1-inch Super Retina XDR display", "storage": "256GB", "processor": "A15 Bionic chip"}, "description": "The latest iPhone with advanced features."}
  2 | {"name": "Samsung Galaxy Watch 4", "tags": ["smartwatch", "wearable", "Samsung"], "brand": "Samsung", "price": 349.99, "category": "Electronics", "attributes": {"size": "42mm", "color": "Black", "display": "AMOLED display", "sensors": ["heart rate monitor", "ECG", "SpO2"]}, "description": "A smartwatch with health tracking and stylish design."}
  3 | {"name": "Leather Case for iPhone 15 Pro", "tags": ["phone case", "accessory", "Apple"], "brand": "Apple", "price": 69.99, "category": "Accessories", "attributes": {"color": "Saddle Brown", "material": "Genuine leather", "compatible_devices": ["iPhone 15 Pro", "iPhone 15 Pro Max"]}, "description": "Premium leather case for iPhone 15 Pro."}
  4 | {"name": "Wireless Charging Pad", "tags": ["accessory", "wireless charger"], "brand": "Anker", "price": 29.99, "category": "Accessories", "attributes": {"color": "White", "compatible_devices": ["iPhone", "Samsung Galaxy", "Apple Watch", "Samsung Galaxy Watch"]}, "description": "Fast wireless charger compatible with smartphones and smartwatches."}
(4 rows)
```

### 1) Operator (->) example

The operator `->` allows you to [extract a field as a JSONB value](/docs/postgresql/postgresql-json-functions/postgresql-json-extract) from a JSON object by a key:

```
jsonb -> 'key' → jsonb
```

Note that the `key` is surrounded by a single quote because the key in a JSON object is a text string.

For example, the following query uses the operator `->` to get the product names from the `products` table:

```
SELECT
  data -> 'name' AS product_name
FROM
  products;
```

Output:

```
           product_name
----------------------------------
 "iPhone 15 Pro"
 "Samsung Galaxy Watch 4"
 "Leather Case for iPhone 15 Pro"
 "Wireless Charging Pad"
(4 rows)
```

The return values are JSONB values.

### 2) Operator (->>)

The operator `->>` allows you to [extract a field value as text](https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-json-extract/) from a JSON object by a specified key:

```
jsonb ->> 'key' → text
```

For example, the following statement uses the operator `->>` to get the product names as text:

```
SELECT
  data ->> 'name' AS product_name
FROM
  products;
```

Output:

```
          product_name
--------------------------------
 iPhone 15 Pro
 Samsung Galaxy Watch 4
 Leather Case for iPhone 15 Pro
 Wireless Charging Pad
(4 rows)
```

### 3) Operator (#>)

The operator `#>` extracts a JSON object or an element at the specified path:

```
jsonb #> 'path' → jsonb
```

For example, the following statement uses the operator `#>` to extract the `attributes` object from the JSON object in the `data` column of the `products` table:

```
SELECT
  data #>'{attributes}' AS attributes
FROM
  products;
```

Output:

```
                                                        attributes
---------------------------------------------------------------------------------------------------------------------------
 {"color": "Graphite", "display": "6.1-inch Super Retina XDR display", "storage": "256GB", "processor": "A15 Bionic chip"}
 {"size": "42mm", "color": "Black", "display": "AMOLED display", "sensors": ["heart rate monitor", "ECG", "SpO2"]}
 {"color": "Saddle Brown", "material": "Genuine leather", "compatible_devices": ["iPhone 15 Pro", "iPhone 15 Pro Max"]}
 {"color": "White", "compatible_devices": ["iPhone", "Samsung Galaxy", "Apple Watch", "Samsung Galaxy Watch"]}
(4 rows)
```

The following example uses the operator `#>` to extract the `color` field of the `attributes` object from the `data` column of the `products` table:

```
SELECT
  data #>'{attributes, color}' AS colors
FROM
  products;
```

Output:

```
     colors
----------------
 "Graphite"
 "Black"
 "Saddle Brown"
 "White"
(4 rows)
```

### 4) Operator (#>>)

The operator `#>>` extracts a JSON object or element at a specified path as text:

```
json #>> text[] → text
```

For example, the following statement uses the operator (`#>>`) to extract the `color` from the `attributes` subobject of the `data` object as text strings:

```
SELECT
  data #>>'{attributes, color}' AS colors
FROM
  products;
```

Output:

```
    colors
--------------
 Graphite
 Black
 Saddle Brown
 White
(4 rows)
```

### 5) Operator @>

The operator `@>` return true if a JSONB value contains another JSONB value or false otherwise:

```
jsonb @> jsonb → boolean
```

For example, the following statement uses the operator `@>` to retrieve the `products` in the `Electronics` category:

```
SELECT
  id,
  data ->> 'name' product_name
FROM
  products
WHERE
  data @> '{"category": "Electronics"}';
```

Output:

```
 id |      product_name
----+------------------------
  1 | iPhone 15 Pro
  2 | Samsung Galaxy Watch 4
(2 rows)
```

### 6) Operator &lt;@

The operator `<@` returns true if a JSON value is contained within the another JSONB value or false otherwise:

```
jsonb <@ jsonb → boolean
```

For example:

```
SELECT
  data ->> 'name' name,
  data ->> 'price' price
FROM
  products
WHERE
  '{"price": 999.99}' :: jsonb <@ data;
```

Output:

```
     name      | price
---------------+--------
 iPhone 15 Pro | 999.99
(1 row)
```

### 7) Operator ||

The operator `||` concatenates two JSONB values into a single one:

```
jsonb || jsonb → jsonb
```

For example, the following statement uses the operator `||` to concatenate two JSONB values into a single JSONB value:

```
SELECT
  '{"name": "iPad"}' :: jsonb ||
   '{"price": 799}' :: jsonb
AS product;
```

Output:

```
            product
--------------------------------
 {"name": "iPad", "price": 799}
(1 row)
```

In this example, we use the [cast operator](/docs/postgresql/postgresql-cast)(`::`) to convert text strings into JSONB values before concatenating them into a single JSONB value.

### 8) Operator (?)

The operator `?` returns true if a text string exists as a top-level key of a JSON object or as an array element of a JSON array, or false otherwise:

```
jsonb ? text → boolean
```

For example, the following statement uses the operator (`?`) to retrieve the products whose `price` key exists as the top-level key of the JSON object stored in the `data` column of the `products` table:

```
SELECT
  id,
  data ->> 'name' product_name,
  data ->> 'price' price
FROM
  products
WHERE
  data ? 'price';
```

Output:

```
 id |          product_name          | price
----+--------------------------------+--------
  1 | iPhone 15 Pro                  | 999.99
  2 | Samsung Galaxy Watch 4         | 349.99
  3 | Leather Case for iPhone 15 Pro | 69.99
  4 | Wireless Charging Pad          | 29.99
(4 rows)
```

The following example uses the operator `?` to retrieve all products whose tags have the text `Apple`:

```
SELECT
  data ->> 'name' product_name,
  data ->> 'tags' tags
FROM
  products
WHERE
  data-> 'tags' ? 'Apple'
```

Output:

```
          product_name          |                 tags
--------------------------------+--------------------------------------
 iPhone 15 Pro                  | ["smartphone", "iOS", "Apple"]
 Leather Case for iPhone 15 Pro | ["phone case", "accessory", "Apple"]
(2 rows)
```

### 9) Operator (?|)

The operator `?|` returns true if any elements in a text array exist as top-level keys of a JSON object or as elements of a JSON array, or false otherwise:

```
jsonb ?| text[] → boolean
```

For example, the following statement uses the operator `?|` to retrieve products whose `attributes` have either the `storage` or `size` keys:

```
SELECT
  data ->> 'name' product_name,
  data ->> 'attributes' attributes
FROM
  products
WHERE
  data -> 'attributes' ?| array ['storage', 'size'];
```

Output:

```
      product_name      |                                                        attributes
------------------------+---------------------------------------------------------------------------------------------------------------------------
 iPhone 15 Pro          | {"color": "Graphite", "display": "6.1-inch Super Retina XDR display", "storage": "256GB", "processor": "A15 Bionic chip"}
 Samsung Galaxy Watch 4 | {"size": "42mm", "color": "Black", "display": "AMOLED display", "sensors": ["heart rate monitor", "ECG", "SpO2"]}
(2 rows)
```

### 10) Operator (?&)

The operator `?&` returns true if all elements in a text array exist as the top-level keys of a JSON object or as elements of a JSON array, or false otherwise:

```
jsonb ?& text[] → boolean
```

For example, the following statement uses the operator `?&` to retrieve the products whose `attributes` have both `color` or `storage` keys:

```
SELECT
  data ->> 'name' product_name,
  data ->> 'attributes' attributes
FROM
  products
WHERE
  data -> 'attributes' ?& array ['color', 'storage'];
```

Output:

```
 product_name  |                                                        attributes
---------------+---------------------------------------------------------------------------------------------------------------------------
 iPhone 15 Pro | {"color": "Graphite", "display": "6.1-inch Super Retina XDR display", "storage": "256GB", "processor": "A15 Bionic chip"}
(1 row)
```

### 11) Operator (-)

The operator `-` allows you to delete a key/value pair from a JSON object or a matching string value from a JSON array:

```
jsonb - text → jsonb
```

The following example uses the operator (`-`) to remove the `name` key and its value from a JSONB object:

```
SELECT
  '{"name": "John Doe", "age": 22}' :: jsonb - 'name' result;
```

Output:

```
   result
-------------
 {"age": 22}
(1 row)
```

The following example uses the operator (`-`) to remove the element `"API"` from a JSON array:

```
SELECT
  '["PostgreSQL", "API", "Web Dev"]' :: jsonb - 'API' result;
```

Output:

```
          result
---------------------------
 ["PostgreSQL", "Web Dev"]
(1 row)
```

### 12) Operator (-)

The operator `-` also allows you to delete all matching keys (with their values) from a JSON object or matching elements from a JSON array:

```
jsonb - text[] → jsonb
```

The following example uses the operator (`-`) to remove the `age` and `email` keys and their values from a JSONB object:

```
SELECT
  '{"name": "John Doe", "age": 22, "email": "john.doe@test.com"}' :: jsonb - ARRAY[ 'age',
  'email' ] result;
```

Output:

```
        result
----------------------
 {"name": "John Doe"}
(1 row)
```

The following example uses the operator (`-`) to remove the element `"API"` and`"Web Dev"` from a JSON array:

```
SELECT
  '["PostgreSQL", "API", "Web Dev"]' :: jsonb - ARRAY['API','Web Dev'] result;
```

Output:

```
     result
----------------
 ["PostgreSQL"]
(1 row)
```

### 13) Operator (@?)

The operator `@?` returns true if a [JSON path](/docs/postgresql/postgresql-json-functions/postgresql-json-path) returns any items for the specified JSONB value:

```
jsonb @? jsonpath → boolean
```

For example, the following uses the @? operator to retrieve the products whose prices are greater than `999`:

```
SELECT
  data ->> 'name' product_name
FROM
  products
WHERE
  data @? '$.price ? (@ > 999)';
```

Output:

```
 product_name
---------------
 iPhone 15 Pro
(1 row)
```

In this example, we use the operator `@?` to check if the JSON path `'$.price ? (@ > 999)'` returns any element in the JSONB value of the data column.

### 14) Operator (@@)

The operator (`@@`) evaluates a [JSON path](https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-json-path/) against a JSONB value and returns a boolean result based on whether the JSON path matches any items within the JSONB value. If the result is not a boolean, then the `@@` operator returns `NULL`.

```
jsonb @@ jsonpath → boolean
```

For example, the following example returns null because the JSON path `'$.scores'` returns an array, not a boolean result:

```
SELECT ('{"scores": [1,2,3,4,5]}'::jsonb @@ '$.scores') result;
```

Output:

```
 result
--------
 null
(1 row)
```

However, the following statement returns true because the JSON path `'$.scores[*] > 2'` matches the elements that are greater than 2.

```
SELECT ('{"scores": [1,2,3,4,5]}'::jsonb @@ '$.scores[*] > 2') result;
```

Output:

```
 result
--------
 t
(1 row)
```

Notice that the `'$.scores[*] > 2'` matches 3, 4, and 5 but it only considers the result of the first matched item, which is 3.
