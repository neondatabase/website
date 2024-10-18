---
title: 'PostgreSQL JSON'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-json/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn about JSON and how to work with JSON data in PostgreSQL using the PostgreSQL JSON and JSONB data types.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## What is JSON

<!-- /wp:heading -->

<!-- wp:paragraph -->

JSON stands for JavaScript Object Notation. JSON is a lightweight data interchange format that is readable for humans and simple for computers to parse.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

JSON is based on two main data structures **objects** and **arrays**:

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### Objects

<!-- /wp:heading -->

<!-- wp:paragraph -->

An object is defined as an unordered collection of key-value pairs enclosed in curly braces `{}`. Each pair includes:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- A key which is a string surrounded by double quotes (").
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- A colon `:` that separates the key and value.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- A value that can be a string, a number, or even an object.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

For example, the following illustrates a JSON object that represents a film:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
{"title": "Chamber Italian", "release_year": 2006, "length": 117}
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The film object has three keys `title`, `release_year`, and `length` with associated values.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### Arrays

<!-- /wp:heading -->

<!-- wp:paragraph -->

An array is an ordered list of values enclosed in square brackets `[]`. The values do not have to be the same type. Additionally, an array may contain values of any valid JSON data type including objects and arrays.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

For example, the following shows an array that stores three film titles as strings:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
["Chamber Italian","Grosse Wonderful"," Airport Pollock"]
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### Data types in JSON

<!-- /wp:heading -->

<!-- wp:paragraph -->

JSON supports some data types including:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- String: "Joe"
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Number: 100, 9.99, ...
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Boolean: true and false.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Null: null
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

JSON data can be particularly useful for creating configuration files or exchanging data between a client and a server.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL JSON data types

<!-- /wp:heading -->

<!-- wp:paragraph -->

PostgreSQL offers two data types for storing JSON:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- JSON - store an exact copy of the JSON text.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- JSONB - store the JSON data in binary format.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:heading {"level":3} -->

### JSON vs. JSONB

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following table illustrates the key differences between JSON and JSONB types:

<!-- /wp:paragraph -->

<!-- wp:table -->

| Feature           | JSON                                                            | JSONB                                                                |
| ----------------- | --------------------------------------------------------------- | -------------------------------------------------------------------- |
| Storage           | Textual representation (verbatim)                               | Binary storage format                                                |
| Size              | Typically larger because it retains the whitespace in JSON data | Typically smaller                                                    |
| Indexing          | Full-text search indexes                                        | Binary indexes                                                       |
| Performance       | Slightly slower                                                 | Generally faster                                                     |
| Query performance | Slower due to parsing                                           | Faster due to binary storage                                         |
| Parsing           | Parse each time                                                 | Parse once, store in binary format                                   |
| Data manipulation | Simple and easy                                                 | More complex                                                         |
| Ordering of keys  | Preserved                                                       | Not preserved                                                        |
| Duplicate keys    | Allow duplicate key, the last value is retained                 | Do not allow duplicate keys.                                         |
| Use cases         | Storing configuration data, log data, simple JSON documents     | Storing JSON documents where fast querying and indexing are required |

<!-- /wp:table -->

<!-- wp:paragraph -->

In practice, you should use JSONB to store JSON data unless you have specialized requirements such as retaining the ordering of keys in the JSON documents.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL JSON examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's take some examples of storing JSON data in the PostgreSQL database.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Storing JSON objects example

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, [create a new table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) called `products`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE products(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    properties JSONB
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `products` table includes three columns:

<!-- /wp:paragraph -->

<!-- wp:list {"ordered":true} -->

1. <!-- wp:list-item -->
2. The `id` column is the primary key column that uniquely identifies the product.
3. <!-- /wp:list-item -->
4.
5. <!-- wp:list-item -->
6. The `name` column stores the product name.
7. <!-- /wp:list-item -->
8.
9. <!-- wp:list-item -->
10. The `properties` column stores various properties of a product such as size, and color.
11. <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

Second, insert JSON data into the `products` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO products(name, properties)
VALUES('Ink Fusion T-Shirt','{"color": "white", "size": ["S","M","L","XL"]}')
RETURNING *;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 id |        name        |                    properties
----+--------------------+---------------------------------------------------
  1 | Ink Fusion T-Shirt | {"size": ["S", "M", "L", "XL"], "color": "white"}
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, [insert multiple rows](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert-multiple-rows/) into the `products` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO products(name, properties)
VALUES('ThreadVerse T-Shirt','{"color": "black", "size": ["S","M","L","XL"]}'),
      ('Design Dynamo T-Shirt','{"color": "blue", "size": ["S","M","L","XL"]}')
RETURNING *;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 id |        name         |                    properties
----+---------------------+---------------------------------------------------
  2 | ThreadVerse T-Shirt | {"size": ["S", "M", "L", "XL"], "color": "white"}
  3 | Design Dynamo       | {"size": ["S", "M", "L", "XL"], "color": "blue"}
(2 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Fourth, retrieve JSON data from the `products` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT id, name, properties
FROM products;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 id |         name          |                    properties
----+-----------------------+---------------------------------------------------
  1 | Ink Fusion T-Shirt    | {"size": ["S", "M", "L", "XL"], "color": "white"}
  2 | ThreadVerse T-Shirt   | {"size": ["S", "M", "L", "XL"], "color": "black"}
  3 | Design Dynamo T-Shirt | {"size": ["S", "M", "L", "XL"], "color": "blue"}
(3 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Fifth, retrieve the product with the colors extracted from the JSON data in the `properties` column:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  id,
  name,
  properties -> 'color' color
FROM
  products;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 id |         name          |  color
----+-----------------------+---------
  1 | Ink Fusion T-Shirt    | "white"
  2 | ThreadVerse T-Shirt   | "black"
  3 | Design Dynamo T-Shirt | "blue"
(3 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `->` operator extracts a JSON object field by a key. In this example, we use the -> operator `->` to extract the color of the properties object:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
properties -> 'color'
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The values in the color column are surrounded by double quotes (").

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To extract a JSON object field by a key as text, you can use the `->>` operator. For example:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  id,
  name,
  properties ->> 'color' color
FROM
  products;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 id |         name          | color
----+-----------------------+-------
  1 | Ink Fusion T-Shirt    | white
  2 | ThreadVerse T-Shirt   | black
  3 | Design Dynamo T-Shirt | blue
(3 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Sixth, retrieve the products with the colors black and white using the `->>` operator in the [WHERE](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-where/) clause:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  id,
  name,
  properties ->> 'color' color
FROM
  products
WHERE
  properties ->> 'color' IN ('black', 'white');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 id |        name         | color
----+---------------------+-------
  1 | Ink Fusion T-Shirt  | white
  2 | ThreadVerse T-Shirt | black
(2 rows)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Storing JSON arrays example

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, create a table called `contacts` for storing the contact persons:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE contacts(
   id SERIAL PRIMARY KEY,
   name VARCHAR(255) NOT NULL,
   phones JSONB
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `phones` column has the JSONB data type. We'll store both work phone and personal number numbers in a JSON array in the `phones` column.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, insert new rows into the `contacts` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO contacts(name, phones)
VALUES
   ('John Doe','["408-111-2222", "408-111-2223"]'),
   ('Jane Doe','["212-111-2222", "212-111-2223"]')
RETURNING *;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 id |   name   |              phones
----+----------+----------------------------------
  1 | John Doe | ["408-111-2222", "408-111-2223"]
  2 | Jane Doe | ["212-111-2222", "212-111-2223"]
(2 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, retrieve the contacts with the work phone numbers from the `contacts` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  name,
  phones ->> 0 "work phone"
FROM
  contacts;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
   name   |  work phone
----------+--------------
 John Doe | 408-111-2222
 Jane Doe | 212-111-2222
(2 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `->> index` extract the index element in an array. In this example, we use the `->> 0` to extract the first elements in the `phones` array as text.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

[Check JSON functions to process JSON data](https://www.postgresqltutorial.com/postgresql-json-functions/).

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- JSON stands for JavaScript Object Notation.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use JSONB data type to store JSON data.
- <!-- /wp:list-item -->

<!-- /wp:list -->
