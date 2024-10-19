---
prevPost: /postgresql/postgresql-hstore
nextPost: /postgresql/a-look-at-postgresql-user-defined-data-types
createdAt: 2015-07-10T08:53:51.000Z
title: 'PostgreSQL JSON'
tableOfContents: true
---


**Summary**: in this tutorial, you will learn about JSON and how to work with JSON data in PostgreSQL using the PostgreSQL JSON and JSONB data types.

## What is JSON

JSON stands for JavaScript Object Notation. JSON is a lightweight data interchange format that is readable for humans and simple for computers to parse.

JSON is based on two main data structures **objects** and **arrays**:

### Objects

An object is defined as an unordered collection of key-value pairs enclosed in curly braces `{}`. Each pair includes:

- A key which is a string surrounded by double quotes (").
-
- A colon `:` that separates the key and value.
-
- A value that can be a string, a number, or even an object.

For example, the following illustrates a JSON object that represents a film:

```
{"title": "Chamber Italian", "release_year": 2006, "length": 117}
```

The film object has three keys `title`, `release_year`, and `length` with associated values.

### Arrays

An array is an ordered list of values enclosed in square brackets `[]`. The values do not have to be the same type. Additionally, an array may contain values of any valid JSON data type including objects and arrays.

For example, the following shows an array that stores three film titles as strings:

```
["Chamber Italian","Grosse Wonderful"," Airport Pollock"]
```

### Data types in JSON

JSON supports some data types including:

- String: "Joe"
-
- Number: 100, 9.99, ...
-
- Boolean: true and false.
-
- Null: null

JSON data can be particularly useful for creating configuration files or exchanging data between a client and a server.

## PostgreSQL JSON data types

PostgreSQL offers two data types for storing JSON:

- JSON - store an exact copy of the JSON text.
-
- JSONB - store the JSON data in binary format.

### JSON vs. JSONB

The following table illustrates the key differences between JSON and JSONB types:

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

In practice, you should use JSONB to store JSON data unless you have specialized requirements such as retaining the ordering of keys in the JSON documents.

## PostgreSQL JSON examples

Let's take some examples of storing JSON data in the PostgreSQL database.

### 1) Storing JSON objects example

First, [create a new table](/postgresql/postgresql-create-table) called `products`:

```sql
CREATE TABLE products(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    properties JSONB
);
```

The `products` table includes three columns:

1.
2. The `id` column is the primary key column that uniquely identifies the product.
3.
4.
5.
6. The `name` column stores the product name.
7.
8.
9.
10. The `properties` column stores various properties of a product such as size, and color.
11.

Second, insert JSON data into the `products` table:

```sql
INSERT INTO products(name, properties)
VALUES('Ink Fusion T-Shirt','{"color": "white", "size": ["S","M","L","XL"]}')
RETURNING *;
```

Output:

```
 id |        name        |                    properties
----+--------------------+---------------------------------------------------
  1 | Ink Fusion T-Shirt | {"size": ["S", "M", "L", "XL"], "color": "white"}
(1 row)
```

Third, [insert multiple rows](/postgresql/postgresql-insert-multiple-rows) into the `products` table:

```sql
INSERT INTO products(name, properties)
VALUES('ThreadVerse T-Shirt','{"color": "black", "size": ["S","M","L","XL"]}'),
      ('Design Dynamo T-Shirt','{"color": "blue", "size": ["S","M","L","XL"]}')
RETURNING *;
```

Output:

```
 id |        name         |                    properties
----+---------------------+---------------------------------------------------
  2 | ThreadVerse T-Shirt | {"size": ["S", "M", "L", "XL"], "color": "white"}
  3 | Design Dynamo       | {"size": ["S", "M", "L", "XL"], "color": "blue"}
(2 rows)
```

Fourth, retrieve JSON data from the `products` table:

```sql
SELECT id, name, properties
FROM products;
```

Output:

```
 id |         name          |                    properties
----+-----------------------+---------------------------------------------------
  1 | Ink Fusion T-Shirt    | {"size": ["S", "M", "L", "XL"], "color": "white"}
  2 | ThreadVerse T-Shirt   | {"size": ["S", "M", "L", "XL"], "color": "black"}
  3 | Design Dynamo T-Shirt | {"size": ["S", "M", "L", "XL"], "color": "blue"}
(3 rows)
```

Fifth, retrieve the product with the colors extracted from the JSON data in the `properties` column:

```sql
SELECT
  id,
  name,
  properties -> 'color' color
FROM
  products;
```

Output:

```
 id |         name          |  color
----+-----------------------+---------
  1 | Ink Fusion T-Shirt    | "white"
  2 | ThreadVerse T-Shirt   | "black"
  3 | Design Dynamo T-Shirt | "blue"
(3 rows)
```

The `->` operator extracts a JSON object field by a key. In this example, we use the -> operator `->` to extract the color of the properties object:

```
properties -> 'color'
```

The values in the color column are surrounded by double quotes (").

To extract a JSON object field by a key as text, you can use the `->>` operator. For example:

```sql
SELECT
  id,
  name,
  properties ->> 'color' color
FROM
  products;
```

Output:

```
 id |         name          | color
----+-----------------------+-------
  1 | Ink Fusion T-Shirt    | white
  2 | ThreadVerse T-Shirt   | black
  3 | Design Dynamo T-Shirt | blue
(3 rows)
```

Sixth, retrieve the products with the colors black and white using the `->>` operator in the [WHERE](/postgresql/postgresql-where) clause:

```sql
SELECT
  id,
  name,
  properties ->> 'color' color
FROM
  products
WHERE
  properties ->> 'color' IN ('black', 'white');
```

Output:

```
 id |        name         | color
----+---------------------+-------
  1 | Ink Fusion T-Shirt  | white
  2 | ThreadVerse T-Shirt | black
(2 rows)
```

### 2) Storing JSON arrays example

First, create a table called `contacts` for storing the contact persons:

```sql
CREATE TABLE contacts(
   id SERIAL PRIMARY KEY,
   name VARCHAR(255) NOT NULL,
   phones JSONB
);
```

The `phones` column has the JSONB data type. We'll store both work phone and personal number numbers in a JSON array in the `phones` column.

Second, insert new rows into the `contacts` table:

```sql
INSERT INTO contacts(name, phones)
VALUES
   ('John Doe','["408-111-2222", "408-111-2223"]'),
   ('Jane Doe','["212-111-2222", "212-111-2223"]')
RETURNING *;
```

Output:

```
 id |   name   |              phones
----+----------+----------------------------------
  1 | John Doe | ["408-111-2222", "408-111-2223"]
  2 | Jane Doe | ["212-111-2222", "212-111-2223"]
(2 rows)
```

Third, retrieve the contacts with the work phone numbers from the `contacts` table:

```sql
SELECT
  name,
  phones ->> 0 "work phone"
FROM
  contacts;
```

Output:

```
   name   |  work phone
----------+--------------
 John Doe | 408-111-2222
 Jane Doe | 212-111-2222
(2 rows)
```

The `->> index` extract the index element in an array. In this example, we use the `->> 0` to extract the first elements in the `phones` array as text.

[Check JSON functions to process JSON data](/postgresql/postgresql-json-functions).

## Summary

- JSON stands for JavaScript Object Notation.
-
- Use JSONB data type to store JSON data.
