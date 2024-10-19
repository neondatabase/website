---
title: 'PostgreSQL JSON Functions'
tableOfContents: true
---


This page provides you with the most commonly used PostgreSQL JSON functions that allow you to manage JSON data effectively.

## Section 1. Creating JSON data

This section covers the functions that help you create JSON data in SQL:

- [to_jsonb()](/docs/postgresql/postgresql-json-functions/postgresql-to_jsonb) - Convert an SQL value to a value of JSONB.
-
- [jsonb_build_array()](https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_build_array/) - Construct a JSON array from a list of values or the result of a query.
-
- [jsonb_build_object()](https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_build_object/) - Build a JSON object from a list of alternating keys and values.
-
- [jsonb_object()](/docs/postgresql/postgresql-json-functions/postgresql-jsonb_object) - Build a JSON object from a text array.
-
- [row_to_json()](https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-row_to_json/) - Create a JSON object from a SQL composite value.

## Section 2. Searching JSON data

This section provides you with functions that search for JSON elements based on JSON paths.

- [JSON path](https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-json-path/) - Show you how to construct simple JSON paths to locate values or elements within a JSON document.
-
- [jsonb_path_query()](/docs/postgresql/postgresql-json-functions/postgresql-jsonb_path_query) - Query data on a JSON document based on a JSON path expression and return matched JSONB data.
-
- [jsonb_path_query_array()](https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_path_query_array/) - Query data on a JSON document based on a JSON path expression and return matched elements as a JSON array.
-
- [jsonb_path_query_first()](https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_path_query_first/) - Evaluate a JSON path expression against a JSON document and return the first match.
-
- [jsonb_path_exists()](https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_path_exists/) - Return true if a JSON path returns any elements in a JSON document.
-
- jsonb_path_match() - Return true if any part of a JSON document matches a JSON path expression or false otherwise.

## Section 3. Querying JSON data

This section shows you how to query and extract elements in JSON documents.

- [JSONB operators](/docs/postgresql/postgresql-json-functions/postgresql-jsonb-operators) - Show you how to use JSONB operators to extract and query JSON data effectively.
-
- [Extracting JSON data](https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-json-extract/) - Extract an array element of a JSON array or extract the value associated with a specified key from a JSON object and return the value as a JSONB value or a text string.
-
- [jsonb_extract_path()](https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_extract_path/) - Extract a JSON sub-object from JSONB data at a specified path.
-
- [jsonb_extract_path_text()](https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_extract_path_text/) - Extract a JSON sub-object as text from JSONB data at a specified path.

## Section 4. Modifying JSON data

This section discusses the function that inserts and updates values in JSON documents.

- [jsonb_insert()](https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_insert/) - Insert a new value into a JSON document based on a path and return the modified JSON document.
-
- [jsonb_set()](/docs/postgresql/postgresql-json-functions/postgresql-jsonb_set) - Replace existing values in a JSON document based on a path and return the modified JSON document.
-
- [jsonb_strip_nulls()](https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_strip_nulls/) - Delete all object fields that have null values from a specified JSON document.

## Section 5. Working with JSON arrays

This section introduces you to JSON functions that work with JSON arrays including getting array length and expanding array elements into JSONB values and text.

- [jsonb_array_length()](https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_array_length/) - Return the number of elements in the top-level JSON array.
-
- [jsonb_array_elements()](https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_array_elements/) - Expand the top-level JSON array into a set of JSON values.
-
- [jsonb_array_elements_text()](https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_array_elements_text/) - Expand the top-level JSON array into a set of text values.

## Section 6. Working with JSON objects

This section shows you how to use JSON functions that handle JSON objects.

- [jsonb_each()](/docs/postgresql/postgresql-json-functions/postgresql-jsonb_each) - Expand the keys and values of the top-level JSON object into a set of key/value pairs. The values are JSON values.
-
- [jsonb_each_text()](/docs/postgresql/postgresql-json-functions/postgresql-jsonb_each_text) - Expand the top-level JSON object into a set of key/value pairs. The values are of the text type.
-
- [jsonb_object_keys()](https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_object_keys/) - Return a set of keys in the top-level JSON object.
-
- [jsonb_to_record()](https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_to_record/) - Convert a top-level JSON object into a PostgreSQL record type defined by an AS clause.

## Section 7. Aggregating JSON data

This section shows you how to use JSON aggregate functions that collect data from multiple rows into a JSON array or object.

- [jsonb_agg()](https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_agg/) - aggregate a list of values including NULL into a JSON array.
-
- [jsonb_object_agg()](https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_object_agg/) - aggregate a list of key/value pairs into a JSON object.

## Section 8. JSON utility functions

This section discusses the JSON utility functions for getting types of JSONB values and formats JSON values into a human-readable format.

- [jsonb_typeof()](/docs/postgresql/postgresql-json-functions/postgresql-jsonb_typeof) - Return the type of top-level JSON value as a text string.
-
- [jsonb_pretty()](https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_pretty/) - Format a JSON value into human-readable, indented format, making it easier to read.
