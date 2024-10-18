---
title: 'PostgreSQL hstore'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-hstore/
ogImage: ./img/wp-content-uploads-2015-07-postgresql-hstore-query.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you'll learn how to work with **PostgreSQL hstore** data type.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The hstore module implements the hstore data type for storing key-value pairs in a single value. The keys and values are text strings only.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

In practice, you can find the hstore data type useful in some cases, such as semi-structured data or rows with many attributes that are rarely queried.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Enable PostgreSQL hstore extension

<!-- /wp:heading -->

<!-- wp:paragraph -->

Before working with the hstore data type, you need to enable the hstore extension which loads the **contrib** module to your PostgreSQL instance.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following statement creates the hstore extension:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE EXTENSION hstore;
```

<!-- /wp:code -->

<!-- wp:heading -->

## Create a table with hstore data type

<!-- /wp:heading -->

<!-- wp:paragraph -->

We create a table named `books` that has three columns:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `id` is the primary key that identifies the book.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `title` is the title of the products
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `attr` stores attributes of the book such as ISBN, weight, and paperback. The data type of the `attr` column is hstore.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

We use the [CREATE TABLE statement](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) to create the `books` table as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE books (
	id serial primary key,
	title VARCHAR (255),
	attr hstore
);
```

<!-- /wp:code -->

<!-- wp:heading -->

## Insert data into the PostgreSQL hstore column

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following `INSERT` statement inserts data into the hstore column:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO books (title, attr)
VALUES
  (
    'PostgreSQL Tutorial', '"paperback" => "243",
     "publisher" => "postgresqltutorial.com",
     "language"  => "English",
     "ISBN-13"   => "978-1449370000",
     "weight"    => "11.2 ounces"'
  );
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The data that we insert into the hstore column is a list of comma-separated key =>value pairs. Both keys and values are quoted using double quotes ("").

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Let's insert one more row.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO books (title, attr)
VALUES
  (
    'PostgreSQL Cheat Sheet', '
"paperback" => "5",
"publisher" => "postgresqltutorial.com",
"language"  => "English",
"ISBN-13"   => "978-1449370001",
"weight"    => "1 ounces"'
  );
```

<!-- /wp:code -->

<!-- wp:heading -->

## Query data from an hstore column

<!-- /wp:heading -->

<!-- wp:paragraph -->

Querying data from an hstore column is similar to querying data from a column with native data type using the `SELECT` statement as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT attr FROM books;
```

<!-- /wp:code -->

<!-- wp:image {"id":1119,"linkDestination":"custom"} -->

[![postgresql hstore query](https://www.postgresqltutorial.com/wp-content/uploads/2015/07/postgresql-hstore-query.jpg)](./img/wp-content-uploads-2015-07-postgresql-hstore-query.jpg)

<!-- /wp:image -->

<!-- wp:heading -->

## Query value for a specific key

<!-- /wp:heading -->

<!-- wp:paragraph -->

Postgresql hstore provides the `->` operator to query the value of a specific key from an hstore column. For example, if we want to know ISBN-13 of all available books in the `books` table, we can use the `->` operator as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
	attr -> 'ISBN-13' AS isbn
FROM
	books;
```

<!-- /wp:code -->

<!-- wp:image {"id":1120} -->

![postgresql hstore query key](./img/wp-content-uploads-2015-07-postgresql-hstore-query-key.jpg)

<!-- /wp:image -->

<!-- wp:heading -->

## Use value in the WHERE clause

<!-- /wp:heading -->

<!-- wp:paragraph -->

You can use the `->` operator in the `WHERE` clause to filter the rows whose values of the hstore column match the input value. For example, the following query retrieves the `title` and `weight` of a book that has `ISBN-13` value matches `978-1449370000:`

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
	title, attr -> 'weight' AS weight
FROM
	books
WHERE
	attr -> 'ISBN-13' = '978-1449370000';
```

<!-- /wp:code -->

<!-- wp:image {"id":1121} -->

![postgresql hstore WHERE clause](./img/wp-content-uploads-2015-07-postgresql-hstore-WHERE-clause.jpg)

<!-- /wp:image -->

<!-- wp:heading -->

## Add key-value pairs to existing rows

<!-- /wp:heading -->

<!-- wp:paragraph -->

With a hstore column, you can easily add a new key-value pair to existing rows e.g., you can add a free shipping key to the `attr` column of the `books` table as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
UPDATE books
SET attr = attr || '"freeshipping"=>"yes"' :: hstore;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Now, you can check to see if the `"freeshipping" => "yes"` pair has been added successfully.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
	title,
        attr -> 'freeshipping' AS freeshipping
FROM
	books;
```

<!-- /wp:code -->

<!-- wp:image {"id":1122} -->

![postgresql hstore add key-value](./img/wp-content-uploads-2015-07-postgresql-hstore-add-key-value.jpg)

<!-- /wp:image -->

<!-- wp:heading -->

## Update existing key-value pair

<!-- /wp:heading -->

<!-- wp:paragraph -->

You can update the existing key-value pair using the `UPDATE` statement. The following statement updates the value of the `"freeshipping"` key to `"no"`.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
UPDATE books
SET attr = attr || '"freeshipping"=>"no"' :: hstore;
```

<!-- /wp:code -->

<!-- wp:heading -->

## Remove existing key-value pair

<!-- /wp:heading -->

<!-- wp:paragraph -->

PostgreSQL allows you to remove existing key-value pair from an hstore column. For example, the following statement removes the `"freeshipping"=>"no"` key-value pair in the `attr` column.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
UPDATE books
SET attr = delete(attr, 'freeshipping');
```

<!-- /wp:code -->

<!-- wp:heading -->

## Check for a specific key in hstore column

<!-- /wp:heading -->

<!-- wp:paragraph -->

You can check for a specific key in an hstore column using the `?` operator in the `WHERE` clause. For example, the following statement returns all rows with attr contains key `publisher`.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  title,
  attr->'publisher' as publisher,
  attr
FROM
	books
WHERE
	attr ? 'publisher';
```

<!-- /wp:code -->

<!-- wp:image {"id":1123} -->

![postgesql hstore check key](./img/wp-content-uploads-2015-07-postgesql-hstore-check-key.jpg)

<!-- /wp:image -->

<!-- wp:heading -->

## Check for a key-value pair

<!-- /wp:heading -->

<!-- wp:paragraph -->

You can query based on the hstore key-value pair using the @> operator. The following statement retrieves all rows whose `attr` column contains a key-value pair that matches `"weight"=>"11.2 ounces"`.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
	title
FROM
	books
WHERE
	attr @> '"weight"=>"11.2 ounces"' :: hstore;
```

<!-- /wp:code -->

<!-- wp:image {"id":1124} -->

![postgresql hstore check key-pair](./img/wp-content-uploads-2015-07-postgresql-hstore-check-key-pair.jpg)

<!-- /wp:image -->

<!-- wp:heading -->

## Query rows that contain multiple specified keys

<!-- /wp:heading -->

<!-- wp:paragraph -->

You can query the rows whose hstore column contains multiple keys using `?&` operator. For example, you can get books where `attr` column contains both `language` and `weight` keys.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
	title
FROM
	books
WHERE
	attr ?& ARRAY [ 'language', 'weight' ];
```

<!-- /wp:code -->

<!-- wp:image {"id":1125} -->

![postgresql hstore check multiple keys](./img/wp-content-uploads-2015-07-postgresql-hstore-check-multiple-keys.jpg)

<!-- /wp:image -->

<!-- wp:paragraph -->

To check if a row whose hstore column contains any key from a list of keys, you use the `?|` operator instead of the `?&` operator.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Get all keys from an hstore column

<!-- /wp:heading -->

<!-- wp:paragraph -->

To get all keys from an hstore column, you use the `akeys()` function as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
	akeys (attr)
FROM
	books;
```

<!-- /wp:code -->

<!-- wp:image {"id":1127} -->

![postgresql hstore akeys function](./img/wp-content-uploads-2015-07-postgresql-hstore-akeys-function.jpg)

<!-- /wp:image -->

<!-- wp:paragraph -->

Or you can use the `skey()` function if you want PostgreSQL to return the result as a set.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
	skeys (attr)
FROM
	books;
```

<!-- /wp:code -->

<!-- wp:image {"id":1128} -->

![postgresql hstore skeys function](./img/wp-content-uploads-2015-07-postgresql-hstore-skeys-function.jpg)

<!-- /wp:image -->

<!-- wp:heading -->

## Get all values from an hstore column

<!-- /wp:heading -->

<!-- wp:paragraph -->

Like keys, you can get all values from an hstore column using the `avals()` function in the form of arrays.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
	avals (attr)
FROM
	books;
```

<!-- /wp:code -->

<!-- wp:image {"id":1129,"linkDestination":"custom"} -->

[![postgresql hstore avals function](https://www.postgresqltutorial.com/wp-content/uploads/2015/07/postgresql-hstore-avals-function.jpg)](./img/wp-content-uploads-2015-07-postgresql-hstore-avals-function.jpg)

<!-- /wp:image -->

<!-- wp:paragraph -->

Or you can use the `svals()` function if you want to get the result as a set.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
	svals (attr)
FROM
	books;
```

<!-- /wp:code -->

<!-- wp:image {"id":1130} -->

![postgresql hstore svals](./img/wp-content-uploads-2015-07-postgresql-hstore-svals.jpg)

<!-- /wp:image -->

<!-- wp:heading -->

## Convert hstore data to JSON

<!-- /wp:heading -->

<!-- wp:paragraph -->

PostgreSQL provides the `hstore_to_json()` function to convert hstore data to [JSON](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-json/). See the following statement:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
  title,
  hstore_to_json (attr) json
FROM
  books;
```

<!-- /wp:code -->

<!-- wp:image {"id":1131} -->

![postgresql hstore to json](./img/wp-content-uploads-2015-07-postgresql-hstore-to-json.jpg)

<!-- /wp:image -->

<!-- wp:heading -->

## Convert hstore data to sets

<!-- /wp:heading -->

<!-- wp:paragraph -->

To convert hstore data to sets, you use the `each()` function as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
	title,
	(EACH(attr) ).*
FROM
	books;
```

<!-- /wp:code -->

<!-- wp:image {"id":1132} -->

![postgresql hstore to sets](./img/wp-content-uploads-2015-07-postgresql-hstore-to-sets.jpg)

<!-- /wp:image -->

<!-- wp:paragraph -->

In this tutorial, we have shown you how to work with the PostgreSQL hstore data type and introduced you to the most useful operations that you can perform against the hstore data type.

<!-- /wp:paragraph -->
