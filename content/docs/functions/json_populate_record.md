---
title: Postgres json_populate_record() function
subtitle: Casts a JSON object to a record
enableTableOfContents: true
updatedOn: '2024-06-14T07:55:54.375Z'
---

The `json_populate_record` function is used to populate a record type with values from a `JSON` object. It is useful for parsing `JSON` data received from external sources, particularly when merging it into an existing record.

<CTA />

## Function signature

```sql
json_populate_record(base_record ANYELEMENT, json JSON)
```

This function takes two arguments: a base record of a row type (which can even be a `NULL` record) and a `JSON` object. It returns the record updated with the `JSON` values.

## Example usage

Consider a database table that tracks employee information. When you receive employee information as `JSON` records, you can use `json_populate_record` to ingest the data into the table.

Here we create the `employees` table with some sample data.

```sql
CREATE TABLE employees (
    id INT,
    name TEXT,
    department TEXT,
    salary NUMERIC
);
```

To illustrate, we start with a `NULL` record and cast the input `JSON` payload to the `employees` record type.

```sql
INSERT INTO employees
SELECT *
FROM json_populate_record(
    NULL::employees,
    '{"id": "123", "name": "John Doe", "department": "Engineering", "salary": "75000"}'
)
RETURNING *;
```

This query returns the following result:

```text
| id | name     | department  | salary |
|----|----------|-------------|--------|
| 123| John Doe | Engineering | 75000  |
```

## Advanced examples

### Handling partial data with `json_populate_record`

For data points where the `JSON` objects have missing keys, `json_populate_record` can still cast them into legible records.

Say we receive records for a bunch of employees who are known to be in Sales, but the `department` field is missing from the `JSON` payload. We can use `json_populate_record` with the default value specified for a field while the other fields are populated from the `JSON` payload, as in this example:

```sql
INSERT INTO employees
SELECT *
FROM json_populate_record(
    (1, 'ABC', 'Sales', 0)::employees,
    '{"id": "124", "name": "Jane Smith", "salary": "68000"}'
)
RETURNING *;
```

This query returns the following:

```text
| id | name       | department | salary |
|----|------------|------------|--------|
| 124| Jane Smith | Sales      | 68000  |
```

### Working with custom types in `json_populate_record`

The base record doesn't need to have the type of a table row and can be a [custom Postgres type](https://www.postgresql.org/docs/current/sql-createtype.html) too. For example, here we first define a custom type `address` and use `json_populate_record` to cast a `JSON` object to it:

```sql
CREATE TYPE address AS (
    street TEXT,
    city TEXT,
    zip TEXT
);

SELECT *
FROM json_populate_record(
    NULL::address,
    '{"street": "123 Main St", "city": "San Francisco", "zip": "94105"}'
);
```

This query returns the following result:

```text
| street     | city          | zip   |
|------------|---------------|-------|
| 123 Main St| San Francisco | 94105 |
```

## Additional considerations

### Alternative options

- [json_to_record](/docs/functions/json_to_record) - It can be used similarly, with a couple differences. `json_populate_record` can be used with a base record of a pre-defined type, whereas `json_to_record` needs the record type defined inline in the `AS` clause. Further, `json_populate_record` can specify default values for missing fields through the base record, whereas `json_to_record` must assign them NULL values.
- `json_populate_recordset` - It can be used similarly to parse `JSON`, the difference being that it returns a set of records instead of a single record. For example, if you have an array of `JSON` objects, you can use `json_populate_recordset` to convert each object into a new row.
- [jsonb_populate_record](/docs/functions/jsonb_populate_record) - It has the same functionality to `json_populate_record`, but accepts `JSONB` input instead of `JSON`.

## Resources

- [Postgres documentation: JSON functions](https://www.postgresql.org/docs/current/functions-json.html)
