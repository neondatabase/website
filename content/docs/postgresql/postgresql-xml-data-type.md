---
title: 'PostgreSQL XML Data Type'
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL XML data type to store XML documents in the database.

## Introduction to the PostgreSQL XML data type

PostgreSQL supports built-in `XML` data type that allows you to store XML documents directly within the database.

Here's the syntax for declaring a column with the `XML` type:

```
column_name XML
```

The XML data type offers the following benefits:

- **Type Safety**: PostgreSQL can validate when inserting/updating data, ensuring XML data conforms to XML standards.
-
- **Built-in XML functions and operators**: PostgreSQL supports many XML functions and operators to manipulate XML data effectively.

## PostgreSQL XML data type example

First, [create a table](/docs/postgresql/postgresql-create-table) called `person`:

```
CREATE TABLE person(
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    info XML
);
```

In this `person` table:

- `id` is an [identity column](/docs/postgresql/postgresql-identity-column/) that serves as the [primary key](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-primary-key) column of the table.
-
- `info` is a column with the type XML that will store the XML data.

Second, [insert a row](/docs/postgresql/postgresql-insert) into the `person` table:

```
INSERT INTO person (info)
VALUES (
    XMLPARSE(DOCUMENT '<?xml version="1.0" encoding="UTF-8"?>
    <person>
        <name>John Doe</name>
        <age>35</age>
        <city>San Francisco</city>
    </person>')
);
```

In this statement:

- `DOCUMENT` indicates that the input string is a complete XML document starting with the XML declaration `<?xml version="1.0" encoding="UTF-8"?>` and having the root element `<person>`
-
- `XMLPARSE` function converts the string into an XML document.
-
- The `INSERT` statement inserts the new XML document into the info column of the `persons` table.

Third, [insert multiple rows](/docs/postgresql/postgresql-insert-multiple-rows) into the `person` table:

```
INSERT INTO person (info)
VALUES
(
    XMLPARSE(DOCUMENT '<?xml version="1.0" encoding="UTF-8"?>
    <person>
        <name>Jane Doe</name>
        <age>30</age>
        <city>San Francisco</city>
    </person>')
),
(
    XMLPARSE(DOCUMENT '<?xml version="1.0" encoding="UTF-8"?>
    <person>
        <name>John Smith</name>
        <age>40</age>
        <city>New York</city>
    </person>')
),
(
    XMLPARSE(DOCUMENT '<?xml version="1.0" encoding="UTF-8"?>
    <person>
        <name>Alice Johnson</name>
        <age>30</age>
        <city>Los Angeles</city>
    </person>')
);
```

Fourth, retrieve the names of persons from the XML documents using `xpath()` function:

```
SELECT xpath('/person/name/text()', info) AS name
FROM person;
```

Output:

```
       name
-------------------
 {"John Doe"}
 {"Jane Doe"}
 {"John Smith"}
 {"Alice Johnson"}
(4 rows)
```

Each row in the result set is an array of XML values representing person names. Since each person has one name, the result array has only one element.

Fourth, retrieve person names as text from the XML documents using `xpath()` function:

```
SELECT (xpath('/person/name/text()', info))[1]::text AS name
FROM person;
```

Output:

```
     name
---------------
 John Doe
 Jane Doe
 John Smith
 Alice Johnson
(4 rows)
```

How it works.

- First, the XPath `'/person/name/text()'` returns the text of the name node of the XML document. It returns an array that includes all matching values.
-
- Second, the `[1]` subscript returns the first element of the array.
-
- Third, the `::text` casts the XML value to the text.

Fifth, retrieve the ages of persons:

```
SELECT (xpath('/person/age/text()', info))[1]::text::integer AS age
FROM person;
```

Output:

```
 age
-----
  35
  30
  40
  30
(4 rows)
```

In this query:

- The xpath `/person/age/text()` returns the text of the age nodes as an array of text.
-
- The `[1]` subscript returns the first element of the array.
-
- The `::text` cast the element to the text.
-
- The `::integer` casts the text to an integer.

In this example, we cast an XML value to text and text to an integer because we cannot cast an XML value directly to an integer.

Sixth, retrieve the name, age, and city from the XML document:

```
SELECT
    (xpath('/person/name/text()', info))[1]::text AS name,
    (xpath('/person/age/text()', info))[1]::text::integer AS age,
    (xpath('/person/city/text()', info))[1]::text AS city
FROM
    person;
```

Output:

```
     name      | age |     city
---------------+-----+---------------
 John Doe      |  35 | San Francisco
 Jane Doe      |  30 | San Francisco
 John Smith    |  40 | New York
 Alice Johnson |  30 | Los Angeles
(4 rows)
```

Seventh, find the person with the name "Jane Doe":

```
SELECT *
FROM person
WHERE (xpath('/person/name/text()', info))[1]::text = 'Jane Doe';
```

Output:

```
 id |                info
----+------------------------------------
  2 |     <person>                      +
    |         <name>Jane Doe</name>     +
    |         <age>30</age>             +
    |         <city>San Francisco</city>+
    |     </person>
(1 row)
```

## Creating indexes for XML data

If the person table has many rows, finding the person by name will be slow. You can create an expression index for the XML documents to improve the query performance.

First, create an [index expression](/docs/postgresql/postgresql-indexes/postgresql-index-on-expression) that extracts the name of a person as an array of text:

```
CREATE INDEX person_name
ON person USING BTREE
    (cast(xpath('/person/name', info) as text[])) ;
```

Second, create a function that inserts 1000 rows into the `person` table for testing purposes:

```
CREATE OR REPLACE FUNCTION generate_persons()
RETURNS void AS
$$
BEGIN
    INSERT INTO person (info)
    SELECT
        XMLPARSE(DOCUMENT '<?xml version="1.0" encoding="UTF-8"?>
        <person>
            <name>' || 'Person' || generate_series || '</name>
            <age>' || (generate_series % 80 + 18) || '</age>
            <city>' || CASE WHEN generate_series % 3 = 0 THEN 'New York'
                            WHEN generate_series % 3 = 1 THEN 'Los Angeles'
                            ELSE 'San Francisco' END || '</city>
        </person>')
    FROM generate_series(1, 1000);
END;
$$ LANGUAGE plpgsql;
```

Third, call the `generate_persons` to insert 1000 rows into the `person` table:

```
SELECT generate_persons();
```

Fifth, find a person with the name `Jane Doe`:

```
EXPLAIN ANALYZE
SELECT *
FROM person
WHERE cast(xpath('/person/name', info) as text[]) = '{<name>Jane Doe</name>}';
```

Output:

```
                                                      QUERY PLAN
-----------------------------------------------------------------------------------------------------------------------
 Bitmap Heap Scan on person  (cost=4.31..17.81 rows=5 width=178) (actual time=0.039..0.040 rows=0 loops=1)
   Recheck Cond: ((xpath('/person/name'::text, info, '{}'::text[]))::text[] = '{"<name>Jane Doe</name>"}'::text[])
   ->  Bitmap Index Scan on person_name  (cost=0.00..4.31 rows=5 width=0) (actual time=0.036..0.037 rows=0 loops=1)
         Index Cond: ((xpath('/person/name'::text, info, '{}'::text[]))::text[] = '{"<name>Jane Doe</name>"}'::text[])
 Planning Time: 0.144 ms
 Execution Time: 0.069 ms
(6 rows)
```

The output indicates that the query utilizes the index expression of the `person` table.

## Summary

- Use the `XML` data type to store XML documents in the database.
-
- Use the `xpath()` function to retrieve a value from XML documents.
