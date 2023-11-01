## F.49. xml2 — XPath querying and XSLT functionality [#](#XML2)

  * *   [F.49.1. Deprecation Notice](xml2.html#XML2-DEPRECATION)
  * [F.49.2. Description of Functions](xml2.html#XML2-FUNCTIONS)
  * [F.49.3. `xpath_table`](xml2.html#XML2-XPATH-TABLE)
  * [F.49.4. XSLT Functions](xml2.html#XML2-XSLT)
  * [F.49.5. Author](xml2.html#XML2-AUTHOR)

The `xml2` module provides XPath querying and XSLT functionality.

### F.49.1. Deprecation Notice [#](#XML2-DEPRECATION)

From PostgreSQL 8.3 on, there is XML-related functionality based on the SQL/XML standard in the core server. That functionality covers XML syntax checking and XPath queries, which is what this module does, and more, but the API is not at all compatible. It is planned that this module will be removed in a future version of PostgreSQL in favor of the newer standard API, so you are encouraged to try converting your applications. If you find that some of the functionality of this module is not available in an adequate form with the newer API, please explain your issue to `<pgsql-hackers@lists.postgresql.org>` so that the deficiency can be addressed.

### F.49.2. Description of Functions [#](#XML2-FUNCTIONS)

[Table F.36](xml2.html#XML2-FUNCTIONS-TABLE "Table F.36. xml2 Functions") shows the functions provided by this module. These functions provide straightforward XML parsing and XPath queries.

**Table F.36. `xml2` Functions**

| FunctionDescription                                                                                                                                                                                                                                                                                                                                                                                                                          |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `xml_valid` ( *`document`* `text` ) → `boolean`Parses the given document and returns true if the document is well-formed XML. (Note: this is an alias for the standard PostgreSQL function `xml_is_well_formed()`. The name `xml_valid()` is technically incorrect since validity and well-formedness have different meanings in XML.)                                                                                                       |
| `xpath_string` ( *`document`* `text`, *`query`* `text` ) → `text`Evaluates the XPath query on the supplied document, and casts the result to `text`.                                                                                                                                                                                                                                                                                         |
| `xpath_number` ( *`document`* `text`, *`query`* `text` ) → `real`Evaluates the XPath query on the supplied document, and casts the result to `real`.                                                                                                                                                                                                                                                                                         |
| `xpath_bool` ( *`document`* `text`, *`query`* `text` ) → `boolean`Evaluates the XPath query on the supplied document, and casts the result to `boolean`.                                                                                                                                                                                                                                                                                     |
| `xpath_nodeset` ( *`document`* `text`, *`query`* `text`, *`toptag`* `text`, *`itemtag`* `text` ) → `text`Evaluates the query on the document and wraps the result in XML tags. If the result is multivalued, the output will look like:     <toptag> <itemtag>Value 1 which could be an XML fragment</itemtag> <itemtag>Value 2....</itemtag> </toptag> If either *`toptag`* or *`itemtag`* is an empty string, the relevant tag is omitted. |
| `xpath_nodeset` ( *`document`* `text`, *`query`* `text`, *`itemtag`* `text` ) → `text`Like `xpath_nodeset(document, query, toptag, itemtag)` but result omits *`toptag`*.                                                                                                                                                                                                                                                                    |
| `xpath_nodeset` ( *`document`* `text`, *`query`* `text` ) → `text`Like `xpath_nodeset(document, query, toptag, itemtag)` but result omits both tags.                                                                                                                                                                                                                                                                                         |
| `xpath_list` ( *`document`* `text`, *`query`* `text`, *`separator`* `text` ) → `text`Evaluates the query on the document and returns multiple values separated by the specified separator, for example `Value 1,Value 2,Value 3` if *`separator`* is `,`.                                                                                                                                                                                    |
| `xpath_list` ( *`document`* `text`, *`query`* `text` ) → `text`This is a wrapper for the above function that uses `,` as the separator.                                                                                                                                                                                                                                                                                                      |

### F.49.3. `xpath_table` [#](#XML2-XPATH-TABLE)

```

xpath_table(text key, text document, text relation, text xpaths, text criteria) returns setof record
```

`xpath_table` is a table function that evaluates a set of XPath queries on each of a set of documents and returns the results as a table. The primary key field from the original document table is returned as the first column of the result so that the result set can readily be used in joins. The parameters are described in [Table F.37](xml2.html#XML2-XPATH-TABLE-PARAMETERS "Table F.37. xpath_table Parameters").

**Table F.37. `xpath_table` Parameters**

| Parameter    | Description                                                                                                                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| *`key`*      | the name of the “key” field — this is just a field to be used as the first column of the output table, i.e., it identifies the record from which each output row came (see note below about multiple values) |
| *`document`* | the name of the field containing the XML document                                                                                                                                                            |
| *`relation`* | the name of the table or view containing the documents                                                                                                                                                       |
| *`xpaths`*   | one or more XPath expressions, separated by `\|`                                                                                                                                                             |
| *`criteria`* | the contents of the WHERE clause. This cannot be omitted, so use `true` or `1=1` if you want to process all the rows in the relation                                                                         |

\

These parameters (except the XPath strings) are just substituted into a plain SQL SELECT statement, so you have some flexibility — the statement is

`SELECT <key>, <document> FROM <relation> WHERE <criteria>`

so those parameters can be *anything* valid in those particular locations. The result from this SELECT needs to return exactly two columns (which it will unless you try to list multiple fields for key or document). Beware that this simplistic approach requires that you validate any user-supplied values to avoid SQL injection attacks.

The function has to be used in a `FROM` expression, with an `AS` clause to specify the output columns; for example

```

SELECT * FROM
xpath_table('article_id',
            'article_xml',
            'articles',
            '/article/author|/article/pages|/article/title',
            'date_entered > ''2003-01-01'' ')
AS t(article_id integer, author text, page_count integer, title text);
```

The `AS` clause defines the names and types of the columns in the output table. The first is the “key” field and the rest correspond to the XPath queries. If there are more XPath queries than result columns, the extra queries will be ignored. If there are more result columns than XPath queries, the extra columns will be NULL.

Notice that this example defines the `page_count` result column as an integer. The function deals internally with string representations, so when you say you want an integer in the output, it will take the string representation of the XPath result and use PostgreSQL input functions to transform it into an integer (or whatever type the `AS` clause requests). An error will result if it can't do this — for example if the result is empty — so you may wish to just stick to `text` as the column type if you think your data has any problems.

The calling `SELECT` statement doesn't necessarily have to be just `SELECT *` — it can reference the output columns by name or join them to other tables. The function produces a virtual table with which you can perform any operation you wish (e.g., aggregation, joining, sorting etc.). So we could also have:

```

SELECT t.title, p.fullname, p.email
FROM xpath_table('article_id', 'article_xml', 'articles',
                 '/article/title|/article/author/@id',
                 'xpath_string(article_xml,''/article/@date'') > ''2003-03-20'' ')
       AS t(article_id integer, title text, author_id integer),
     tblPeopleInfo AS p
WHERE t.author_id = p.person_id;
```

as a more complicated example. Of course, you could wrap all of this in a view for convenience.

#### F.49.3.1. Multivalued Results [#](#XML2-XPATH-TABLE-MULTIVALUED-RESULTS)

The `xpath_table` function assumes that the results of each XPath query might be multivalued, so the number of rows returned by the function may not be the same as the number of input documents. The first row returned contains the first result from each query, the second row the second result from each query. If one of the queries has fewer values than the others, null values will be returned instead.

In some cases, a user will know that a given XPath query will return only a single result (perhaps a unique document identifier) — if used alongside an XPath query returning multiple results, the single-valued result will appear only on the first row of the result. The solution to this is to use the key field as part of a join against a simpler XPath query. As an example:

```

CREATE TABLE test (
    id int PRIMARY KEY,
    xml text
);

INSERT INTO test VALUES (1, '<doc num="C1">
<line num="L1"><a>1</a><b>2</b><c>3</c></line>
<line num="L2"><a>11</a><b>22</b><c>33</c></line>
</doc>');

INSERT INTO test VALUES (2, '<doc num="C2">
<line num="L1"><a>111</a><b>222</b><c>333</c></line>
<line num="L2"><a>111</a><b>222</b><c>333</c></line>
</doc>');

SELECT * FROM
  xpath_table('id','xml','test',
              '/doc/@num|/doc/line/@num|/doc/line/a|/doc/line/b|/doc/line/c',
              'true')
  AS t(id int, doc_num varchar(10), line_num varchar(10), val1 int, val2 int, val3 int)
WHERE id = 1 ORDER BY doc_num, line_num

 id | doc_num | line_num | val1 | val2 | val3
----+---------+----------+------+------+------
  1 | C1      | L1       |    1 |    2 |    3
  1 |         | L2       |   11 |   22 |   33
```

To get `doc_num` on every line, the solution is to use two invocations of `xpath_table` and join the results:

```

SELECT t.*,i.doc_num FROM
  xpath_table('id', 'xml', 'test',
              '/doc/line/@num|/doc/line/a|/doc/line/b|/doc/line/c',
              'true')
    AS t(id int, line_num varchar(10), val1 int, val2 int, val3 int),
  xpath_table('id', 'xml', 'test', '/doc/@num', 'true')
    AS i(id int, doc_num varchar(10))
WHERE i.id=t.id AND i.id=1
ORDER BY doc_num, line_num;

 id | line_num | val1 | val2 | val3 | doc_num
----+----------+------+------+------+---------
  1 | L1       |    1 |    2 |    3 | C1
  1 | L2       |   11 |   22 |   33 | C1
(2 rows)
```

### F.49.4. XSLT Functions [#](#XML2-XSLT)

The following functions are available if libxslt is installed:

#### F.49.4.1. `xslt_process` [#](#XML2-XSLT-XSLT-PROCESS)

```

xslt_process(text document, text stylesheet, text paramlist) returns text
```

This function applies the XSL stylesheet to the document and returns the transformed result. The `paramlist` is a list of parameter assignments to be used in the transformation, specified in the form `a=1,b=2`. Note that the parameter parsing is very simple-minded: parameter values cannot contain commas!

There is also a two-parameter version of `xslt_process` which does not pass any parameters to the transformation.

### F.49.5. Author [#](#XML2-AUTHOR)

John Gray `<jgray@azuli.co.uk>`

Development of this module was sponsored by Torchbox Ltd. (www\.torchbox.com). It has the same BSD license as PostgreSQL.