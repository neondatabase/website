---
title: Postgres functions
enableTableOfContents: false
redirectFrom:
  - /docs/postgres/functions-intro
updatedOn: '2024-11-18T22:53:11.098Z'
---

Get started with commonly-used Postgres functions with Neon's function guides. For other functions that Postgres supports, visit the official Postgres [Functions and Operators](https://www.postgresql.org/docs/current/functions.html) documentation.

## Aggregate functions

<DetailIconCards>

<a href="/docs/functions/array_agg" description="Aggregate elements into an array" icon="app-store">array_agg()</a>

<a href="/docs/functions/avg" description="Calculate the average of a set of values" icon="app-store">avg()</a>

<a href="/docs/functions/count" description="Count rows or non-null values in a result set" icon="app-store">count()</a>

<a href="/docs/functions/max" description="Find the maximum value in a set of values" icon="app-store">max()</a>

<a href="/docs/functions/sum" description="Calculate the sum of a set of values" icon="app-store">sum()</a>

</DetailIconCards>

## Array functions

<DetailIconCards>

<a href="/docs/functions/array_length" description="Determine the length of an array" icon="app-store">array_length()</a>

</DetailIconCards>

## Date / Time functions

<DetailIconCards>

<a href="/docs/functions/age" description="Calculate the difference between timestamps or between a timestamp and the current date/time" icon="app-store">age()</a>

<a href="/docs/functions/current_timestamp" description="Get the current date and time" icon="app-store">current_timestamp</a>

<a href="/docs/functions/date_trunc" description="Truncate date/time values to a specified precision" icon="app-store">date_trunc()</a>

<a href="/docs/functions/extract" description="Extract date and time components from timestamps and intervals" icon="app-store">extract()</a>

<a href="/docs/functions/now" description="Get the current date and time" icon="app-store">now()</a>

</DetailIconCards>

## JSON functions

<DetailIconCards>

<a href="/docs/functions/array_to_json" description="Convert an SQL array to a JSON array" icon="app-store">array_to_json()</a>

<a href="/docs/functions/json" description="Transform JSON data into relational views" icon="app-store">json()</a>

<a href="/docs/functions/json_agg" description="Aggregate values into a JSON array" icon="app-store">json_agg()</a>

<a href="/docs/functions/json_array_elements" description="Expand a JSON array into a set of rows" icon="app-store">json_array_elements()</a>

<a href="/docs/functions/jsonb_array_elements" description="Expand a JSONB array into a set of rows" icon="app-store">jsonb_array_elements()</a>

<a href="/docs/functions/json_build_object" description="Build a JSON object out of a variadic argument list" icon="app-store">json_build_object()</a>

<a href="/docs/functions/json_each" description="Expand JSON into a record per key-value pair" icon="app-store">json_each()</a>

<a href="/docs/functions/json_exists" description="Check for Values in JSON Data Using SQL/JSON Path Expressions" icon="app-store">json_exists()</a>

<a href="/docs/functions/json_extract_path" description="Extract a JSON sub-object at the specified path" icon="app-store">json_extract_path()</a>

<a href="/docs/functions/json_extract_path_text" description="Extract a JSON sub-object at the specified path as text" icon="app-store">json_extract_path_text()</a>

<a href="/docs/functions/json_object" description="Create a JSON object from key-value pairs" icon="app-store">json_object()</a>

<a href="/docs/functions/json_populate_record" description="Cast a JSON object to a record" icon="app-store">json_populate_record()</a>

<a href="/docs/functions/json_query" description="Extract and Transform JSON Values with SQL/JSON Path Expressions" icon="app-store">json_query()</a>

<a href="/docs/functions/json_scalar" description="Convert Text and Binary Data to JSON Values" icon="app-store">json_scalar()</a>

<a href="/docs/functions/json_serialize" description="Convert JSON Values to Text or Binary Format" icon="app-store">json_serialize()</a>

<a href="/docs/functions/json_table" description="Transform JSON data into relational views" icon="app-store">json_table()</a>

<a href="/docs/functions/json_to_record" description="Convert a JSON object to a record" icon="app-store">json_to_record()</a>

<a href="/docs/functions/json_value" description="Extract and Convert JSON Scalar Values" icon="app-store">json_value()</a>

<a href="/docs/functions/jsonb_each" description="Expand JSONB into a record per key-value pair" icon="app-store">jsonb_each()</a>

<a href="/docs/functions/jsonb_extract_path" description="Extract a JSONB sub-object at the specified path" icon="app-store">jsonb_extract_path()</a>

<a href="/docs/functions/jsonb_extract_path_text" description="Extract a JSONB sub-object at the specified path as text" icon="app-store">jsonb_extract_path_text()</a>

<a href="/docs/functions/jsonb_object" description="Create a JSONB object from key-value pairs" icon="app-store">jsonb_object()</a>

<a href="/docs/functions/jsonb_populate_record" description="Cast a JSONB object to a record" icon="app-store">jsonb_populate_record()</a>

<a href="/docs/functions/jsonb_to_record" description="Convert a JSONB object to a record" icon="app-store">jsonb_to_record()</a>

</DetailIconCards>

## Mathematical functions

<DetailIconCards>

<a href="/docs/functions/math-abs" description="Calculate the absolute value of a number" icon="app-store">abs()</a>

<a href="/docs/functions/math-random" description="Generate a random number between 0 and 1" icon="app-store">random()</a>

<a href="/docs/functions/math-round" description="Round numbers to a specified precision" icon="app-store">round()</a>

</DetailIconCards>

## String functions

<DetailIconCards>

<a href="/docs/functions/concat" description="Concatenate strings" icon="app-store">concat()</a>

<a href="/docs/functions/lower" description="Convert a string to lowercase" icon="app-store">lower()</a>

<a href="/docs/functions/substring" description="Extract a substring from a string" icon="app-store">substring()</a>

<a href="/docs/functions/regexp_match" description="Extract substrings matching a regular expression pattern" icon="app-store">regexp_match()</a>

<a href="/docs/functions/regexp_replace" description="Replace substrings matching a regular expression pattern" icon="app-store">regexp_replace()</a>

<a href="/docs/functions/trim" description="Remove leading and trailing characters from a string" icon="app-store">trim()</a>

</DetailIconCards>

## Window functions

<DetailIconCards>

<a href="/docs/functions/dense_rank" description="Return the rank of the current row without gaps" icon="app-store">dense_rank()</a>

<a href="/docs/functions/window-lag" description="Access values from previous rows in a result set" icon="app-store">lag()</a>

<a href="/docs/functions/window-lead" description="Access values from subsequent rows in a result set" icon="app-store">lead()</a>

<a href="/docs/functions/window-rank" description="Assign ranks to rows within a result set" icon="app-store">rank()</a>

</DetailIconCards>
