---
title: The xml2 extension
subtitle: Perform XPath querying and XSLT transformations on XML data in Postgres.
enableTableOfContents: true
updatedOn: '2025-05-27T19:40:34.757Z'
tag: new
---

The `xml2` extension for Postgres provides functions to parse XML data, evaluate XPath queries against it, and perform XSLT transformations. This can be useful for applications that need to process or extract information from XML documents stored within the database.

<CTA />

## Enable the `xml2` extension

You can enable the extension by running the following `CREATE EXTENSION` statement in the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or from a client such as [psql](/docs/connect/query-with-psql-editor) that is connected to your Neon database.

```sql
CREATE EXTENSION IF NOT EXISTS xml2;
```

**Version availability:**

Please refer to the [list of all extensions](/docs/extensions/pg-extensions) available in Neon for up-to-date extension version information.

<Admonition type="note">
The `xml2` extension was developed to provide robust XML processing capabilities within Postgres before the SQL/XML standard features were fully integrated. While it offers useful functions for XPath querying and XSLT, the SQL/XML standard now provides a more comprehensive and standardized approach to XML manipulation. 
</Admonition>

## `xml2` functions

The `xml2` module provides functions for XML parsing, XPath querying, and XSLT transformations.

### XML parsing and validation

- **`xml_valid(document text) → boolean`**
  Parses the given XML document string and returns `true` if it is well-formed XML, `false` otherwise.

  ```sql
  SELECT xml_valid('<book><title>My Book</title></book>');
  -- true

  SELECT xml_valid('<book><title>My Book</title>');
  -- false (not well-formed)
  ```

### XPath querying functions

These functions evaluate an XPath expression on a given XML document.

- **`xpath_string(document text, query text) → text`**
  Evaluates the XPath query and casts the result to a text string.

  ```sql
  SELECT xpath_string('<book><title>My Adventures</title></book>', '/book/title/text()');
  -- My Adventures
  ```

- **`xpath_number(document text, query text) → real`**
  Evaluates the XPath query and casts the result to a real number.

  ```sql
  SELECT xpath_number('<book><price>19.95</price></book>', '/book/price/text()');
  -- 19.95
  ```

- **`xpath_bool(document text, query text) → boolean`**
  Evaluates the XPath query and casts the result to a boolean.

  ```sql
  SELECT xpath_bool('<book available="true"></book>', '/book/@available="true"');
  -- true
  ```

- **`xpath_nodeset(document text, query text, toptag text, itemtag text) → text`**
  Evaluates the query and wraps the resulting nodeset in the specified `toptag` and `itemtag` XML tags. If `toptag` or `itemtag` is an empty string, the respective tag is omitted.
  There are also two-argument and three-argument versions:

  - `xpath_nodeset(document text, query text)`: Omits both `toptag` and `itemtag`.
  - `xpath_nodeset(document text, query text, itemtag text)`: Omits `toptag`.

  ```sql
  SELECT xpath_nodeset(
      '<books><book><title>Book A</title></book><book><title>Book B</title></book></books>',
      '//title',
      'results',
      'entry'
  );
  -- <results><entry><title>Book A</title></entry><entry><title>Book B</title></entry></results>

  SELECT xpath_nodeset(
      '<books><book><title>Book A</title></book></books>',
      '//title/text()'
  );
  -- Book A

  -- To get XML nodes:
  SELECT xpath_nodeset(
      '<books><book><title>Book A</title></book><book><title>Book B</title></book></books>',
      '//title'
  );
  -- <title>Book A</title><title>Book B</title>
  ```

- **`xpath_list(document text, query text, separator text) → text`**
  Evaluates the query and returns multiple text values separated by the specified `separator`.
  There is also a two-argument version `xpath_list(document text, query text)` which uses a comma (`,`) as the separator.

  ```sql
  SELECT xpath_list(
      '<books><book><author>Author 1</author><author>Author 2</author></book></books>',
      '//author/text()',
      '; '
  );
  -- Author 1; Author 2
  ```

### `xpath_table` function

The `xpath_table` function is a powerful tool for extracting data from a set of XML documents and returning it as a relational table.

`xpath_table(key text, document text, relation text, xpaths text, criteria text) returns setof record`

**Parameters:**

- `key`: The name of the "key" field from the source table. This field identifies the record from which each output row came and is returned as the first column.
- `document`: The name of the field in the source table containing the XML document.
- `relation`: The name of the table or view containing the XML documents.
- `xpaths`: One or more XPath expressions, separated by `|`, to extract data.
- `criteria`: The content of a `WHERE` clause to filter rows from the `relation`. This cannot be omitted; use `true` to process all rows.

The function constructs and executes a SQL `SELECT` statement internally. The `key` and `document` parameters must resolve to exactly two columns in this internal select.

`xpath_table` must be used in a `FROM` clause, and an `AS` clause is required to define the output column names and types. The first column in the `AS` clause corresponds to the `key`.

**Example:**

Suppose you have a table `catalog_items`:

```sql
CREATE TABLE catalog_items (
    item_sku TEXT PRIMARY KEY,
    item_details XML,
    added_on_date DATE
);

INSERT INTO catalog_items (item_sku, item_details, added_on_date) VALUES
('WDGT-001', XMLPARSE(DOCUMENT '<item><name>Super Widget</name><stock_level>150</stock_level><category>Gadgets</category></item>'), '2025-03-10'),
('TOOL-005', XMLPARSE(DOCUMENT '<item><name>Mega Wrench</name><stock_level>75</stock_level><category>Tools</category></item>'), '2025-04-02');
```

You can use `xpath_table` to extract data:

```sql
SELECT * FROM
    xpath_table(
        'item_sku',         -- The key column from catalog_items
        'item_details',     -- The XML column from catalog_items
        'catalog_items',    -- The source table
        '/item/name/text()|/item/stock_level/text()|/item/category/text()', -- XPath expressions
        'added_on_date >= ''2025-01-01'''  -- Criteria for filtering
    ) AS extracted_data(     -- Alias for the output table and its columns
        product_sku TEXT,
        product_name TEXT,
        current_stock INTEGER,
        product_category TEXT
    );
```

**Output:**

| product_sku | product_name | current_stock | product_category |
| :---------- | :----------- | :------------ | :--------------- |
| WDGT-001    | Super Widget | 150           | Gadgets          |
| TOOL-005    | Mega Wrench  | 75            | Tools            |

**Data type conversion:**
`xpath_table` internally deals with string representations of XPath results. When you specify a data type (e.g., `INTEGER`) in the `AS` clause, Postgres attempts to convert the string to that type. If conversion fails (e.g., an empty string or non-numeric text to `INTEGER`), an error occurs. It might be safer to extract as `TEXT` and then cast explicitly if data quality is uncertain.

### XSLT functions

The `xml2` extension provides functions for XSLT (Extensible Stylesheet Language Transformations).

- **`xslt_process(document text, stylesheet text, paramlist text) returns text`**
  Applies the XSL `stylesheet` to the XML `document` and returns the transformed text. The `paramlist` argument accepts a string containing parameter assignments for the transformation, formatted as key-value pairs separated by commas (e.g., `'name=value,debug=1'`). It's important to note that due to the straightforward parsing mechanism, individual parameter values within this list cannot themselves contain commas.

- **`xslt_process(document text, stylesheet text) returns text`**
  A two-parameter version that applies the stylesheet without passing any external parameters.

**Example:**

Let's say you have an XML document `my_data.xml`:

```xml
<data><item>Hello</item></data>
```

And `my_stylesheet.xsl` contains an XSLT to transform `<data><item>Hello</item></data>` into `<message>Hello</message>`:

```xml
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/data/item">
    <message><xsl:value-of select="."/></message>
  </xsl:template>
</xsl:stylesheet>
```

You can apply the XSLT transformation using `xslt_process`. Here's an example of how to do this in Postgres:

```sql
DO $$
DECLARE
  xml_doc TEXT := '<data><item>Hello</item></data>';
  xslt_style TEXT := '<?xml version="1.0"?><xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:output omit-xml-declaration="yes"/><xsl:template match="/data/item"><message><xsl:value-of select="."/></message></xsl:template></xsl:stylesheet>';
  transformed_xml TEXT;
BEGIN
  transformed_xml := xslt_process(xml_doc, xslt_style);
  RAISE NOTICE '%', transformed_xml;
END $$;
-- Output: <message>Hello</message>
```

## Conclusion

The `xml2` extension provides powerful tools for working with XML data in Postgres. It allows you to parse, query, and transform XML documents using XPath and XSLT. This can be particularly useful for applications that need to handle XML data efficiently within the database.

## Resources

- [PostgreSQL `xml2` documentation](https://www.Postgres.org/docs/current/xml2.html)
- [PostgreSQL XML Data Type](/postgresql/postgresql-tutorial/postgresql-xml-data-type)

<NeedHelp />
