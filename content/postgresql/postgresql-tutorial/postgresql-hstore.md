---
title: 'PostgreSQL hstore'
page_title: 'PostgreSQL hstore Tutorial'
page_description: 'We introduce you to PostgreSQL hstore data type. You will learn know how to perform practical and useful operations on PostgreSQL hstore columns.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-hstore/'
ogImage: '/postgresqltutorial/postgresql-hstore-query.jpg'
updatedOn: '2024-02-01T12:53:20+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL Array'
  slug: 'postgresql-tutorial/postgresql-array'
nextLink:
  title: 'PostgreSQL JSON'
  slug: 'postgresql-tutorial/postgresql-json'
---

**Summary**: in this tutorial, you’ll learn how to work with **PostgreSQL hstore** data type.

The hstore module implements the hstore data type for storing key\-value pairs in a single value. The keys and values are text strings only.

In practice, you can find the hstore data type useful in some cases, such as semi\-structured data or rows with many attributes that are rarely queried.

## Enable PostgreSQL hstore extension

Before working with the hstore data type, you need to enable the hstore extension which loads the **contrib** module to your PostgreSQL instance.

The following statement creates the hstore extension:

```sql
CREATE EXTENSION hstore;
```

## Create a table with hstore data type

We create a table named `books` that has three columns:

- `id` is the primary key that identifies the book.
- `title` is the title of the products
- `attr` stores attributes of the book such as ISBN, weight, and paperback. The data type of the `attr` column is hstore.

We use the [CREATE TABLE statement](postgresql-create-table) to create the `books` table as follows:

```sql
CREATE TABLE books (
	id serial primary key,
	title VARCHAR (255),
	attr hstore
);
```

## Insert data into the PostgreSQL hstore column

The following [`INSERT`](postgresql-insert) statement inserts data into the hstore column:

```sql
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

The data that we insert into the hstore column is a list of comma\-separated key \=\>value pairs. Both keys and values are quoted using double quotes (“”).

Let’s insert one more row.

```sql
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

## Query data from an hstore column

Querying data from an hstore column is similar to querying data from a column with native data type using the [`SELECT`](postgresql-select) statement as follows:

```sql
SELECT attr FROM books;
```

[![postgresql hstore query](/postgresqltutorial/postgresql-hstore-query.jpg)](/postgresqltutorial/postgresql-hstore-query.jpg)

## Query value for a specific key

Postgresql hstore provides the `->` operator to query the value of a specific key from an hstore column. For example, if we want to know ISBN\-13 of all available books in the `books` table, we can use the `->` operator as follows:

```sql
SELECT
	attr -> 'ISBN-13' AS isbn
FROM
	books;
```

![postgresql hstore query key](/postgresqltutorial/postgresql-hstore-query-key.jpg)

## Use value in the WHERE clause

You can use the `->` operator in the [`WHERE`](postgresql-where) clause to filter the rows whose values of the hstore column match the input value. For example, the following  query retrieves the `title` and `weight` of a book that has `ISBN-13` value matches `978-1449370000:`

```sql
SELECT
	title, attr -> 'weight' AS weight
FROM
	books
WHERE
	attr -> 'ISBN-13' = '978-1449370000';

```

![postgresql hstore WHERE clause](/postgresqltutorial/postgresql-hstore-WHERE-clause.jpg)

## Add key\-value pairs to existing rows

With a hstore column, you can easily add a new key\-value pair to existing rows e.g., you can add a free shipping key to the `attr` column of the `books` table as follows:

```sql
UPDATE books
SET attr = attr || '"freeshipping"=>"yes"' :: hstore;
```

Now, you can check to see if the `"freeshipping" => "yes"` pair has been added successfully.

```sql
SELECT
	title,
        attr -> 'freeshipping' AS freeshipping
FROM
	books;
```

![postgresql hstore add key-value](/postgresqltutorial/postgresql-hstore-add-key-value.jpg)

## Update existing key\-value pair

You can update the existing key\-value pair using the [`UPDATE`](postgresql-update) statement. The following statement updates the value of the `"freeshipping"` key to `"no"`.

```sql
UPDATE books
SET attr = attr || '"freeshipping"=>"no"' :: hstore;
```

## Remove existing key\-value pair

PostgreSQL allows you to remove existing key\-value pair from an hstore column. For example, the following statement removes the `"freeshipping"=>"no"` key\-value pair in the `attr` column.

```sql
UPDATE books
SET attr = delete(attr, 'freeshipping');
```

## Check for a specific key in hstore column

You can check for a specific key in an hstore column using the `?` operator in the `WHERE` clause. For example, the following statement returns all rows with attr contains key `publisher`.

```sql
SELECT
  title,
  attr->'publisher' as publisher,
  attr
FROM
	books
WHERE
	attr ? 'publisher';
```

![postgesql hstore check key](/postgresqltutorial/postgesql-hstore-check-key.jpg)

## Check for a key\-value pair

You can query based on the hstore key\-value pair using the @\> operator. The following statement retrieves all rows whose `attr` column contains a key\-value pair that matches `"weight"=>"11.2 ounces"`.

```sql
SELECT
	title
FROM
	books
WHERE
	attr @> '"weight"=>"11.2 ounces"' :: hstore;
```

![postgresql hstore check key-pair](/postgresqltutorial/postgresql-hstore-check-key-pair.jpg)

## Query rows that contain multiple specified keys

You can query the rows whose hstore column contains multiple keys using `?&` operator. For example, you can get books where `attr` column contains both `language` and `weight` keys.

```sql
SELECT
	title
FROM
	books
WHERE
	attr ?& ARRAY [ 'language', 'weight' ];
```

![postgresql hstore check multiple keys](/postgresqltutorial/postgresql-hstore-check-multiple-keys.jpg)
To check if a row whose hstore column contains any key from a list of keys, you use the `?|` operator instead of the `?&` operator.

## Get all keys from an hstore column

To get all keys from an hstore column, you use the `akeys()` function as follows:

```sql
SELECT
	akeys (attr)
FROM
	books;
```

![postgresql hstore akeys function](/postgresqltutorial/postgresql-hstore-akeys-function.jpg)
Or you can use the `skey()` function if you want PostgreSQL to return the result as a set.

```sql
SELECT
	skeys (attr)
FROM
	books;
```

![postgresql hstore skeys function](/postgresqltutorial/postgresql-hstore-skeys-function.jpg)

## Get all values from an hstore column

Like keys, you can get all values from an hstore column using the  `avals()` function in the form of arrays.

```sql
SELECT
	avals (attr)
FROM
	books;
```

[![postgresql hstore avals function](/postgresqltutorial/postgresql-hstore-avals-function.jpg)](/postgresqltutorial/postgresql-hstore-avals-function.jpg)Or you can use the  `svals()` function if you want to get the result as a set.

```sql
SELECT
	svals (attr)
FROM
	books;
```

![postgresql hstore svals](/postgresqltutorial/postgresql-hstore-svals.jpg)

## Convert hstore data to JSON

PostgreSQL provides the `hstore_to_json()` function to convert hstore data to [JSON](postgresql-json). See the following statement:

```sql
SELECT
  title,
  hstore_to_json (attr) json
FROM
  books;
```

![postgresql hstore to json](/postgresqltutorial/postgresql-hstore-to-json.jpg)

## Convert hstore data to sets

To convert hstore data to sets, you use the  `each()` function as follows:

```
SELECT
	title,
	(EACH(attr) ).*
FROM
	books;
```

![postgresql hstore to sets](/postgresqltutorial/postgresql-hstore-to-sets.jpg)
In this tutorial, we have shown you how to work with the PostgreSQL hstore data type and introduced you to the most useful operations that you can perform against the hstore data type.
