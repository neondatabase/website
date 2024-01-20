---
title: Postgres json_to_record function
subtitle: convert JSON object to a record
enableTableOfContents: true
---

You can use the `json_to_record` function to convert a top-level JSON object into a row, with the type specified by the `AS` clause. 

This function is useful when you need to parse JSON data received from external sources, such as APIs or file uploads, and store it in a structured format. By using `json_to_record`, you can easily extract values from JSON and map them to the corresponding columns in your database table. 

**Function Signature**
```sql
json_to_record(json JSON) AS (column_name column_type [, ...])
```

The function's definition includes a column definition list, where you specify the name and data type of each column in the resulting record. 

## Example usage

Consider you have JSON data representing employee information and you want to ingest it for easier processing later. The JSON data looks like this:
```json
{
  "id": "123",
  "name": "John Doe",
  "department": "Engineering",
  "salary": "75000"
}
```

### Test database table
<details>
    <summary>*Creating the test table*</summary>
    ```sql
    CREATE TABLE employees (
        id INT,
        name TEXT,
        department TEXT,
        salary NUMERIC
    );
    ```
</details>

Then, using `json_to_record`, you can insert the input data into the employees table. 
```sql
INSERT INTO employees
SELECT *
FROM json_to_record('{"id": "123", "name": "John Doe", "department": "Engineering", "salary": "75000"}') AS x(id INT, name TEXT, department TEXT, salary NUMERIC);
```

To verify,

Query:
```sql
SELECT * FROM employees;
```

Returns:
```text
| id | name     | department   | salary |
|----|----------|--------------|--------|
| 123| John Doe | Engineering  | 75000  |
```

## Advanced examples

### Handling partial data
For datapoints where the JSON objects have missing keys, `json_to_record` can still cast them into records, producing NULL values for the unmatched columns. 

Query:
```sql
INSERT INTO employees
SELECT *
FROM json_to_record('{
  "id": "124",
  "name": "Jane Smith"
}') AS x(id INT, name TEXT, department TEXT, salary NUMERIC)
RETURNING *;
```

Returns:
```text
| id | name       | department   | salary |
|----|------------|--------------|--------|
| 124| Jane Smith |              |        |
```

### Handling nested data
`json_to_record` can also be used to handle nested JSON input data. 

You'd need to first define a custom type. It can then be used in the column definition list along with the other columns.

Query:
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

Returns:
```text
| id | name        | department | salary | address                     |
|----|-------------|------------|--------|-----------------------------|
| 1  | Emily Clark | Marketing  | 68000  | ("123 Elm St", Springfield) |
```

## Additional considerations

### Alternative options
- `jsonb_to_record` - It has the same functionality to `json_to_record`, but accepts JSONB input instead of JSON. 
- `json_to_recordset` - It can be used similarly to parse JSON, the difference being that it returns a set of records instead of a single record. For example, if you have an array of JSON objects, you can use `json_to_recordset` to convert each object into a new row. 

## Resources
- [Postgres documentation: JSON functions](https://www.postgresql.org/docs/current/functions-json.html)