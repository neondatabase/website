---
modifiedAt: 2024-04-21 07:05:08
redirectFrom:
    - /postgresql/postgresql-tutorial/postgresql-composite-types
prevPost: postgresql-bytea-data-type
nextPost: how-to-compare-two-tables-in-postgresql
createdAt: 2024-04-21T14:03:47.000Z
title: 'PostgreSQL Composite Types'
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to define PostgreSQL composite types to represent the structure of a row or record.

In PostgreSQL, composite types allow you to define [custom data types](/postgresql/postgresql-user-defined-data-types) with multiple fields. These fields can be any built-in or user-defined types, including other composite types.

## Defining PostgreSQL composite types

To define a composite type, use the `CREATE TYPE` statement followed by the type name and a list of fields with their corresponding data types.

Here's the basic syntax for defining a composite type:

```sql
CREATE TYPE type_name AS (
    field1 data_type1,
    field2 data_type2,
    ...
);
```

In this syntax:

- First, specify the name of the composite type (`type_name`) after the `CREATE TYPE` keywords.
- Second, define a list of fields of the composite type along with their respective data types.

For example, the following statement defines the address type that stores address information including street, city, state, zip code, and country:

```sql
CREATE TYPE address_type AS(
   street text,
   city text,
   state text,
   zip_code integer,
   country text
);
```

After defining a composite type, you can use it as a data type of a table column.

For example, the following statement [creates a table](/postgresql/postgresql-create-table) called `contacts` whose type of `address` column is the `address_type`:

```sql
CREATE TABLE contacts(
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address address_type
);
```

Please note that when creating a table, PostgreSQL implicitly creates a corresponding composite type. In this example, PostgreSQL automatically creates the `contacts` composite type.

## Inserting values into a composite column

To construct a composite value, you use the `ROW` expression syntax:

```sql
ROW(value1, value2, ...)
```

In this syntax, the `ROW` keyword is optional when you have multiple fields in the expression. Therefore, you can simplify the composite value as follows:

```
(value1, value2, ...)
```

To indicate a `NULL`, you can use the `NULL` keyword:

```
(value1, NULL, value3, ...)
```

Alternatively, you can omit it in the expression:

```
(value1,, value3, ...)
```

For example, the following statement inserts a new row into the `contacts` table:

```sql
INSERT INTO contacts (name, address)
VALUES (
    'John Smith',
    ROW('123 St', 'Houston', 'TX', 77001, 'USA')
);
```

In this example, we use the following composite value to insert into the `address` column:

```sql
ROW('123 St', 'Houston', 'TX', 77001, 'USA')
```

The following statement inserts a value into individual fields of the `address` column:

```sql
INSERT INTO contacts (
    name,
    address.street,
    address.city,
    address.state,
    address.zip_code
  )
VALUES
  ('Jane Doe', '4000 N. 1st Street', 'San Jose', 'CA', 95134);
```

In this statement, we use the column name, followed by a dot, and field name to indicate the field of a composite type.

## Querying composite values

The following statement retrieves the rows from the `contacts` table:

```sql
SELECT * FROM contacts;
```

Output:

```
 id |    name    |                   address
----+------------+---------------------------------------------
  1 | John Smith | ("123 St",Houston,TX,77001,USA)
  2 | Jane Doe   | ("4000 N. 1st Street","San Jose",CA,95134,)
(2 rows)
```

To query individual fields of a composite type, you use the following syntax:

```
(column_name).field_name
```

For example, the following statement retrieves the id, name, city, state, and zip code of contacts:

```sql
SELECT
  id,
  name,
  (address).city,
  (address).state,
  (address).zip_code
FROM
  contacts;
```

Output:

```
 id |    name    |   city   | state | zip_code
----+------------+----------+-------+----------
  1 | John Smith | Houston  | TX    |    77001
  2 | Jane Doe   | San Jose | CA    |    95134
(2 rows)
```

If you retrieve all fields from a composite value, you can use the asterisk (`*`) shorthand:

```sql
SELECT
  id,
  name,
  (address).*
FROM
  contacts;
```

Output:

```
 id |    name    |       street       |   city   | state | zip_code | country
----+------------+--------------------+----------+-------+----------+---------
  1 | John Smith | 123 St             | Houston  | TX    |    77001 | USA
  2 | Jane Doe   | 4000 N. 1st Street | San Jose | CA    |    95134 | null
(2 rows)
```

## Updating composite values

The following example [updates](/postgresql/postgresql-update) the country of the contact id 2 to `USA`:

```sql
UPDATE contacts
SET
  address.country= 'USA'
WHERE
  id = 2
RETURNING *;
```

Output:

```
 id |   name   |                    address
----+----------+------------------------------------------------
  2 | Jane Doe | ("4000 N. 1st Street","San Jose",CA,95134,USA)
(1 row)
```

In this example, you cannot put the parentheses around the column name of the composite type after the `SET` keyword.

## Summary

- Composite types allow you to define custom data types that include multiple fields.
