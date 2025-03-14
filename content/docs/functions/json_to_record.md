---
title: Postgres json_to_record() function
subtitle: Converts a JSON object to a record
enableTableOfContents: true
updatedOn: '2024-06-14T07:55:54.375Z'
---

You can use the `json_to_record` function to convert a top-level `JSON` object into a row, with the type specified by the `AS` clause.

This function is useful when you need to parse `JSON` data received from external sources, such as APIs or file uploads, and store it in a structured format. By using `json_to_record`, you can easily extract values from `JSON` and map them to the corresponding columns in your database table.

<CTA />

## Function signature

```sql
json_to_record(json JSON) AS (column_name column_type [, ...])
```

The function's definition includes a column definition list, where you specify the name and data type of each column in the resulting record.

## Example usage

Consider a scenario in which you have `JSON` data representing employee information, and you want to ingest it for easier processing later. The `JSON` data looks like this:

```json
{
  "id": "123",
  "name": "John Doe",
  "department": "Engineering",
  "salary": "75000"
}
```

The table you want to insert data into is defined as follows:

```sql
CREATE TABLE employees (
    id INT,
    name TEXT,
    department TEXT,
    salary NUMERIC
);
```

Using `json_to_record`, you can insert the input data into the `employees` table as shown:

```sql
INSERT INTO employees
SELECT *
FROM json_to_record('{"id": "123", "name": "John Doe", "department": "Engineering", "salary": "75000"}') AS x(id INT, name TEXT, department TEXT, salary NUMERIC);
```

To verify the data was inserted, you can run the following query:

```sql
SELECT * FROM employees;
```

This query returns the following result:

```text
| id | name     | department   | salary |
|----|----------|--------------|--------|
| 123| John Doe | Engineering  | 75000  |
```

## Advanced examples

This section provides advanced `json_to_record` examples.

### Handling partial data with `json_to_record`

For datapoints where the `JSON` objects have missing keys, `json_to_record` can still cast them into records, producing `NULL` values for the unmatched columns. For example:

```sql
INSERT INTO employees
SELECT *
FROM json_to_record('{
  "id": "124",
  "name": "Jane Smith"
}') AS x(id INT, name TEXT, department TEXT, salary NUMERIC)
RETURNING *;
```

This query returns the following result:

```
| id | name       | department   | salary |
|----|------------|--------------|--------|
| 124| Jane Smith |              |        |
```

### Handling nested data with `json_to_record`

`json_to_record` can also be used to handle nested `JSON` input data (i.e., keys with values that are `JSON` objects themselves). You need to first define a [custom Postgres type](https://www.postgresql.org/docs/current/sql-createtype.html). The newly created type can then be used in the column definition list along with the other columns.

In the following example, we handle the `address` field by creating an `ADDRESS_TYPE` type first.

```sql
CREATE TYPE ADDRESS_TYPE AS (
  street TEXT,
  city TEXT
);

SELECT *
FROM json_to_record('{
  "id": "125",
  "name": "Emily Clark",
  "department": "Marketing",
  "salary": "68000",
  "address": {
    "street": "123 Elm St",
    "city": "Springfield"
  }
}') AS x(id INT, name TEXT, department TEXT, salary NUMERIC, address ADDRESS_TYPE);
```

This query returns the following result:

```text
| id | name        | department | salary | address                     |
|----|-------------|------------|--------|-----------------------------|
| 1  | Emily Clark | Marketing  | 68000  | ("123 Elm St", Springfield) |
```

### Alternative functions

- [json_populate_record](/docs/functions/json_populate_record): This function can also be used to create records using values from a `JSON` object. The difference is that `json_populate_record` requires the record type to be defined beforehand, while `json_to_record` needs the type definition inline.
- [json_to_recordset](https://www.postgresql.org/docs/current/functions-json.html): This function can be used similarly to parse `JSON`, the difference being that it returns a set of records instead of a single record. For example, if you have an array of `JSON` objects, you can use `json_to_recordset` to convert each object into a new row.
- [jsonb_to_record](https://www.postgresql.org/docs/current/functions-json.html): This function provides the same functionality as `json_to_record`, but accepts `JSONB` input instead of `JSON`. In cases where the input payload type isn't exactly specified, either of the two functions can be used. For example, take this `json_to_record` query:

  ```sql
  SELECT *
  FROM json_to_record('{"id": "123", "name": "John Doe", "department": "Engineering"}')
  AS x(id INT, name TEXT, department TEXT);
  ```

  It works just as well as this `JSONB` variant (below) since Postgres casts the literal `JSON` object to `JSON` or `JSONB` depending on the context.

  ```sql
  SELECT *
  FROM jsonb_to_record('{"id": "123", "name": "Sally", "department": "Engineering"}')
  AS x(id INT, name TEXT, department TEXT);
  ```

## Resources

- [PostgreSQL documentation: JSON functions](https://www.postgresql.org/docs/current/functions-json.html)
