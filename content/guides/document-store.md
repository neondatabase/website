---
title: Document Store using JSONB in Postgres
subtitle: A step-by-step guide describing how to use Postgres as a document store using JSONB
author: vkarpov15
enableTableOfContents: true
createdAt: '2024-12-17T13:24:36.612Z'
updatedOn: '2024-12-17T13:24:36.612Z'
---

The JSONB type enables you to store and query nested JSON-like data in Postgres.
With JSONB, you can to store arbitrarily complex objects and arrays in your Postgres tables, as well as query based on properties in those objects and arrays.
You can even use GIN indexes to index nested properties within JSONB objects.

## Steps

* Set up a table with a JSONB column
* Insert and retrieve JSONB data
* Query based on JSONB fields
* Document store using Sequelize ORM
* Query arrays and objects in JSONB
* Type casting in JSONB queries
* Update and modify JSONB data
* Index JSONB fields using GIN indexes

## Set up a table with a JSONB column

To use Postgres as a document store, you can create a table with two columns: an `id` and a `data` property that is of type `JSONB`.
You can run the following `CREATE TABLE` statement in the Neon SQL Editor or from a client such as `psql` that is connected to Neon.

```sql
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  data JSONB
);
```

JSONB columns can store any JSON object, including objects, arrays, and even nested objects.

## Insert and retrieve JSONB data

Run the following SQL to insert two new rows into the `documents` table. These rows will have `data` columns with slightly different properties: the first row has a `steps` property, and the second row has a nested object property, `author`.

```sql
INSERT INTO documents (data)
VALUES (
  '{
    "title": "Neon and JSONB",
    "body": "Using JSONB to store flexible data structures in Postgres.",
    "tags": ["Postgres", "Neon", "JSONB"],
    "steps": ["Set up a table with a JSONB column", "Insert and retrieve JSONB data"]
  }'
),
(
  '{
    "title": "Scaling Neon with Postgres",
    "body": "Learn how to scale your Neon instances with PostgreSQL features.",
    "tags": ["Neon", "Postgres", "scaling"],
    "author": { "name": "John Smith", "age": 30 }
  }'
);
```

You can then load rows from the `documents` collection by `id`. For example, you can load the "Neon and JSONB" row using the following query.

```sql
SELECT * FROM documents WHERE id = 1
```

## Query based on JSONB fields

You can also query based on properties in the JSONB column using the `->>` operator, which extracts values from the JSONB column.
For example, you can load all documents with a given `title` property using the following query.
Note the quotes around `title` in the `WHERE` clause.

```sql
SELECT * FROM documents WHERE data->>'title' = 'Neon and JSONB'
```

You can also query based on nested properties.
For example, the following query returns all documents whose `author` property is an object with a `name` property equal to 'John Smith'.

```sql
SELECT * FROM documents WHERE data->'author'->>'name' = 'John Smith'
```

## Document store using Sequelize ORM

Many developers use Postgres through an ORM, like [Sequelize](https://sequelize.org/) in Node.js.
ORMs often provide neat syntactic shortcuts for working with JSONB.
For example, the following Node.js code shows how you can connect to the existing `documents` table from previous examples using Sequelize.

```javascript
import Sequelize from 'sequelize';
  
const sequelize = new Sequelize(process.env.POSTGRES_CONNECTION_STRING);

const Document = sequelize.define('Document', {
  data: {
    type: Sequelize.DataTypes.JSONB,
    allowNull: false,
  }
}, { tableName: 'documents', timestamps: false });
```

You can then create rows in the `documents` collection using the following:

```javascript
await Document.bulkCreate([
  {
    data: {
      title: "Neon and JSONB",
      body: "Using JSONB to store flexible data structures in Postgres.",
      tags: ["Postgres", "Neon", "JSONB"],
      author: { name: "John Smith", age: 30 },
    }
  }
]);
```

Finally, you can find documents by the author's name using the following query.
Note that Sequelize takes care of converting `data.author.name` to `data->'author'->>'name'` under the hood.

```javascript
const documents = await Document.findAll({
  where: {
    'data.author.name': 'John Smith',
  }
});
```

You can read more about working with JSONB in [Sequelize](https://sequelize.org/docs/v7/querying/json/) [Prisma](https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/working-with-json-fields), and [Objection.js](https://vincit.github.io/objection.js/recipes/json-queries.html) on their respective documentation sites.

## Query arrays and objects in JSONB

Postgres has several operators that are useful for working with JSONB, including the `@>` operator, which checks if a given property contains the given value.
With arrays, `@>` can check whether the array contains a given value.
For example, the following query returns all documents whose `tags` property contains the string "JSONB".

```sql
SELECT * FROM documents WHERE data->'tags' @> '["JSONB"]'
```

Note that the right-hand side of `@>` is a JSON string.

With objects, `@>` can check whether the document contains one or more properties.
For example, the following query returns all documents whose `author` property has `author` equal to 'John Smith' and `age` equal to 30.

```sql
SELECT * FROM documents WHERE data->'author' @> '{"name":"John Smith","age":30}'
```

The query above is equivalent to this query:

```sql shouldWrap
SELECT * FROM documents WHERE data->'author'->>'name' = 'John Smith' AND data->'author'->>'age' = '30'
```

## Type casting in JSONB queries

Operators like `=` and `@>` are fairly easy to work with: they don't throw any errors if the JSONB property has the wrong type.
However, things get a bit more tricky if you want to find all documents whose `author`'s `age` property is greater than 25.
For example, this query throws an "operator does not exist" error:

```sql
SELECT * 
FROM documents 
WHERE (data -> 'author' ->> 'age') > 29;
```

You need to explicitly cast `age` to an `int` type for the above query to run, as shown here:

```sql
SELECT * 
FROM documents 
WHERE (data -> 'author' ->> 'age')::int > 29;
```

Depending on your data, you may need to add extra checks to avoid throwing an error if a document has an `age` property that can't be casted to an int.
The following query explicitly checks if `age` is a numeric string before attempting to cast to an `int`.

```sql
SELECT * 
FROM documents 
WHERE (data -> 'author' ->> 'age') ~ '^\d+$'
  AND (data -> 'author' ->> 'age')::int > 29;
```

## Update and modify JSONB data

You can also update individual properties within your JSONB document without overwriting the entire document using the [`jsonb_set()` function](https://neon.tech/postgresql/postgresql-json-functions/postgresql-jsonb_set).
For example, the following code updates the `author.age` property to 35 for all documents whose `author.name` property is "John Smith".

```sql
UPDATE documents
SET data = jsonb_set(data, '{author,age}', '35'::jsonb)
WHERE data->'author'->>'name' = 'John Smith';
```

Note that `jsonb_set()` expects the nested property name separated by commas (`,`), not dots (`.`).

## Index JSONB fields using GIN indexes

[GIN indexes](https://www.postgresql.org/docs/current/gin-intro.html) allow you to index JSONB properties, which can make your queries faster as your data grows. This query shows how you can create a GIN index on the `data` property:

```sql
CREATE INDEX content_idx ON documents USING GIN (data);
```

To test out the GIN index, let's first insert 100 documents, 1 of which has `author.name` set to "John Smith", and 99 that do not. Sometimes Postgres decides to skip using indexes and use a sequential scan instead when a query matches most of the table.

```sql
DO $$
BEGIN
  FOR i IN 1..100 LOOP
    IF i = 1 THEN
      -- Insert the special document with author name 'John Smith'
      INSERT INTO documents (data)
      VALUES (
        '{
          "title": "Scaling Neon with Postgres",
          "body": "Learn how to scale your Neon instances with PostgreSQL features.",
          "tags": ["Neon", "Postgres", "scaling"],
          "author": { "name": "John Smith", "age": 30 }
        }'::jsonb
      );
    ELSE
      -- Insert general documents for other iterations
      INSERT INTO documents (data)
      VALUES (
        '{
          "title": "Neon and JSONB",
          "body": "Using JSONB to store flexible data structures in Postgres.",
          "tags": ["Postgres", "Neon", "JSONB"],
          "steps": ["Set up a table with a JSONB column", "Insert and retrieve JSONB data"]
        }'::jsonb
      );
    END IF;
  END LOOP;
END $$;
```

Next, you can run an `EXPLAIN ANALYZE` query (or just click the "Explain" button in the Neon SQL Editor) to confirm that Postgres is using your GIN index.

```sql
EXPLAIN ANALYZE
SELECT *
FROM documents
WHERE data @> '{"author": {"name": "John Smith"}}'::jsonb;
```

Note that the query above uses the containment operator `@>`, **not** `WHERE data->'author'->>'name' = 'John Smith'`. [GIN indexes only support certain operators with JSONB data](https://www.postgresql.org/docs/current/datatype-json.html#JSON-INDEXING), including `@>`.

The `EXPLAIN ANALYZE` query should produce output that resembles the following. The Bitmap Index Scan means that Postgres is using a GIN index rather than a sequential scan to answer the query.

```
Bitmap Heap Scan on documents  (cost=8.52..12.54 rows=1 width=245) (actual time=0.014..0.016 rows=3 loops=1)
  Recheck Cond: (data @> '{"author": {"name": "John Smith"}}'::jsonb)
  Heap Blocks: exact=1
  ->  Bitmap Index Scan on idx_documents_data  (cost=0.00..8.52 rows=1 width=0) (actual time=0.007..0.007 rows=3 loops=1)
        Index Cond: (data @> '{"author": {"name": "John Smith"}}'::jsonb)
Planning Time: 0.066 ms
Execution Time: 0.096 ms
```
