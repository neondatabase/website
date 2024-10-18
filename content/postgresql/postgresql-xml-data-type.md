---
title: 'PostgreSQL XML Data Type'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-xml-data-type/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL XML data type to store XML documents in the database.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL XML data type

<!-- /wp:heading -->

<!-- wp:paragraph -->

PostgreSQL supports built-in `XML` data type that allows you to store XML documents directly within the database.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the syntax for declaring a column with the `XML` type:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
column_name XML
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The XML data type offers the following benefits:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- **Type Safety**: PostgreSQL can validate when inserting/updating data, ensuring XML data conforms to XML standards.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- **Built-in XML functions and operators**: PostgreSQL supports many XML functions and operators to manipulate XML data effectively.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:heading -->

## PostgreSQL XML data type example

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, [create a table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) called `person`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE person(
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    info XML
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this `person` table:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `id` is an [identity column](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-identity-column/) that serves as the [primary key](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-primary-key/) column of the table.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `info` is a column with the type XML that will store the XML data.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

Second, [insert a row](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/) into the `person` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

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

<!-- /wp:code -->

<!-- wp:paragraph -->

In this statement:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `DOCUMENT` indicates that the input string is a complete XML document starting with the XML declaration `<?xml version="1.0" encoding="UTF-8"?>` and having the root element `<person>`
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `XMLPARSE` function converts the string into an XML document.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- The `INSERT` statement inserts the new XML document into the info column of the `persons` table.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

Third, [insert multiple rows](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert-multiple-rows/) into the `person` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

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

<!-- /wp:code -->

<!-- wp:paragraph -->

Fourth, retrieve the names of persons from the XML documents using `xpath()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT xpath('/person/name/text()', info) AS name
FROM person;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
       name
-------------------
 {"John Doe"}
 {"Jane Doe"}
 {"John Smith"}
 {"Alice Johnson"}
(4 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Each row in the result set is an array of XML values representing person names. Since each person has one name, the result array has only one element.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Fourth, retrieve person names as text from the XML documents using `xpath()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT (xpath('/person/name/text()', info))[1]::text AS name
FROM person;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
     name
---------------
 John Doe
 Jane Doe
 John Smith
 Alice Johnson
(4 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

How it works.

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, the XPath `'/person/name/text()'` returns the text of the name node of the XML document. It returns an array that includes all matching values.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, the `[1]` subscript returns the first element of the array.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Third, the `::text` casts the XML value to the text.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

Fifth, retrieve the ages of persons:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT (xpath('/person/age/text()', info))[1]::text::integer AS age
FROM person;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 age
-----
  35
  30
  40
  30
(4 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this query:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- The xpath `/person/age/text()` returns the text of the age nodes as an array of text.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- The `[1]` subscript returns the first element of the array.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- The `::text` cast the element to the text.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- The `::integer` casts the text to an integer.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

In this example, we cast an XML value to text and text to an integer because we cannot cast an XML value directly to an integer.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Sixth, retrieve the name, age, and city from the XML document:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
    (xpath('/person/name/text()', info))[1]::text AS name,
    (xpath('/person/age/text()', info))[1]::text::integer AS age,
    (xpath('/person/city/text()', info))[1]::text AS city
FROM
    person;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
     name      | age |     city
---------------+-----+---------------
 John Doe      |  35 | San Francisco
 Jane Doe      |  30 | San Francisco
 John Smith    |  40 | New York
 Alice Johnson |  30 | Los Angeles
(4 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Seventh, find the person with the name "Jane Doe":

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT *
FROM person
WHERE (xpath('/person/name/text()', info))[1]::text = 'Jane Doe';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

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

<!-- /wp:code -->

<!-- wp:heading -->

## Creating indexes for XML data

<!-- /wp:heading -->

<!-- wp:paragraph -->

If the person table has many rows, finding the person by name will be slow. You can create an expression index for the XML documents to improve the query performance.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, create an [index expression](https://www.postgresqltutorial.com/postgresql-indexes/postgresql-index-on-expression/) that extracts the name of a person as an array of text:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE INDEX person_name
ON person USING BTREE
    (cast(xpath('/person/name', info) as text[])) ;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, create a function that inserts 1000 rows into the `person` table for testing purposes:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

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

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, call the `generate_persons` to insert 1000 rows into the `person` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT generate_persons();
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Fifth, find a person with the name `Jane Doe`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
EXPLAIN ANALYZE
SELECT *
FROM person
WHERE cast(xpath('/person/name', info) as text[]) = '{<name>Jane Doe</name>}';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

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

<!-- /wp:code -->

<!-- wp:paragraph -->

The output indicates that the query utilizes the index expression of the `person` table.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `XML` data type to store XML documents in the database.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `xpath()` function to retrieve a value from XML documents.
- <!-- /wp:list-item -->

<!-- /wp:list -->
