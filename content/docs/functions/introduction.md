---
title: Postgres functions
enableTableOfContents: false
redirectFrom:
  - /docs/postgres/functions-intro
updatedOn: '2024-06-28T22:29:50.739Z'
---

Get started with commonly-used Postgres functions with Neon's function guides. For other functions that Postgres supports, visit the official Postgres [Functions and Operators](https://www.postgresql.org/docs/current/functions.html) documentation.

## Aggregate functions

<DetailIconCards>

<a href="/docs/functions/array_agg" description="Aggregate elements into an array" icon="app-store">array_agg()</a>

<a href="/docs/functions/avg" description="Calculate the average of a set of values" icon="app-store">avg()</a>

</DetailIconCards>

## JSON functions

<DetailIconCards>

<a href="/docs/functions/array_to_json" description="Convert an SQL array to a JSON array" icon="app-store">array_to_json()</a>

<a href="/docs/functions/json_agg" description="Aggregate values into a JSON array" icon="app-store">json_agg()</a>

<a href="/docs/functions/json_array_elements" description="Expand a JSON array into a set of rows" icon="app-store">json_array_elements()</a>

<a href="/docs/functions/jsonb_array_elements" description="Expand a JSONB array into a set of rows" icon="app-store">jsonb_array_elements()</a>

<a href="/docs/functions/json_build_object" description="Build a JSON object out of a variadic argument list" icon="app-store">json_build_object()</a>

<a href="/docs/functions/json_each" description="Expand JSON into a record per key-value pair" icon="app-store">json_each()</a>

<a href="/docs/functions/jsonb_each" description="Expand JSONB into a record per key-value pair" icon="app-store">jsonb_each()</a>

<a href="/docs/functions/json_extract_path" description="Extract a JSON sub-object at the specified path" icon="app-store">json_extract_path()</a>

<a href="/docs/functions/jsonb_extract_path" description="Extract a JSONB sub-object at the specified path" icon="app-store">jsonb_extract_path()</a>

<a href="/docs/functions/json_extract_path_text" description="Extract a JSON sub-object at the specified path as text" icon="app-store">json_extract_path_text()</a>

<a href="/docs/functions/jsonb_extract_path_text" description="Extract a JSONB sub-object at the specified path as text" icon="app-store">jsonb_extract_path_text()</a>

<a href="/docs/functions/json_object" description="Create a JSON object from key-value pairs" icon="app-store">json_object()</a>

<a href="/docs/functions/jsonb_object" description="Create a JSONB object from key-value pairs" icon="app-store">jsonb_object()</a>

<a href="/docs/functions/json_populate_record" description="Cast a JSON object to a record" icon="app-store">json_populate_record()</a>

<a href="/docs/functions/jsonb_populate_record" description="Cast a JSONB object to a record" icon="app-store">jsonb_populate_record()</a>

<a href="/docs/functions/json_to_record" description="Convert a JSON object to a record" icon="app-store">json_to_record()</a>

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

<a href="/docs/functions/trim" description="Remove leading and trailing characters from a string" icon="app-store">trim()</a>

</DetailIconCards>

## Window functions

<DetailIconCards>

<a href="/docs/functions/dense_rank" description="Return the rank of the current row without gaps" icon="app-store">dense_rank()</a>

<a href="/docs/functions/window-lag" description="Access values from previous rows in a result set" icon="app-store">lag()</a>

<a href="/docs/functions/window-lead" description="Access values from subsequent rows in a result set" icon="app-store">lead()</a>

<a href="/docs/functions/window-rank" description="Assign ranks to rows within a result set" icon="app-store">rank()</a>

</DetailIconCards>
