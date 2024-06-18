---
title: Postgres jsonb_object() function
subtitle: Creates a JSONB object from key-value pairs
enableTableOfContents: true
updatedOn: '2024-06-14T07:55:54.377Z'
---

The `jsonb_object` function in Postgres is used to create a `JSONB` object from a set of key-value pairs. It is particularly useful when you need to generate `JSONB` data dynamically from existing table data or input parameters.

<CTA />

## Function signature

```sql
jsonb_object(keys TEXT[], values TEXT[]) -> JSONB
-- or --
jsonb_object(keys_values TEXT[]) -> JSONB
```

This function takes two text arrays as input: one for keys and one for values. Both arrays must have the same number of elements, as each key is paired with the corresponding value to construct the `JSONB` object.

Alternatively, you can pass a single text array containing both keys and values. In this case, alternate elements in the array are treated as keys and values, respectively.

## Example usage

Consider a scenario where you run a library and have a table that tracks details for each book.

The table with some sample data can be set up as shown:

```sql
-- Test database table for a bookstore inventory
CREATE TABLE book_inventory (
    book_id INT,
    title TEXT,
    author TEXT,
    price NUMERIC,
    genre TEXT
);

-- Inserting some test data into `book_inventory`
INSERT INTO book_inventory VALUES
(101, 'The Great Gatsby', 'F. Scott Fitzgerald', 18.99, 'Classic'),
(102, 'Invisible Man', 'Ralph Ellison', 15.99, 'Novel');
```

When querying this dataset, the frontend client might want to present the data in a different way. Say you want the catalog information just as the list of book names while combining the rest of the fields into a single `metadata` attribute. You can do so as shown here:

```sql
SELECT book_id, title, jsonb_object(
  ARRAY['author', 'genre'],
  ARRAY[author, genre]
) AS metadata
FROM book_inventory;
```

This query returns the following result:

```text
| book_id | title            | metadata                                   |
|---------|------------------|--------------------------------------------|
| 101     | The Great Gatsby | {"author" : "F. Scott Fitzgerald",         |
|         |                  |  "genre" : "Classic"}                      |
| 102     | Invisible Man    | {"author" : "Ralph Ellison",               |
|         |                  |  "genre" : "Novel"}                        |
```

## Advanced examples

### Creating nested JSON objects with `jsonb_object`

You could use `jsonb_object` to create nested `JSONB` objects for representing more complex data. However, since `jsonb_object` only expects text values for each key, we will need to combine it with other `JSONB` functions like `jsonb_build_object`. For example:

```sql
SELECT jsonb_build_object(
  'title', title,
  'author', jsonb_object(ARRAY['name', 'genre'], ARRAY[author, genre])
) AS book_info
FROM book_inventory;
```

This query returns the following result:

```text
| book_info                                                                                        |
|--------------------------------------------------------------------------------------------------|
| {"title" : "The Great Gatsby", "author" : {"name" : "F. Scott Fitzgerald", "genre" : "Classic"}} |
| {"title" : "Invisible Man", "author" : {"name" : "Ralph Ellison", "genre" : "Novel"}}            |
```

## Additional considerations

### Gotchas

- Ensure both keys and values arrays have the same number of elements. Mismatched arrays will result in an error. Or, if passing in a single key-value array, ensure that the array has an even number of elements.
- Be aware of data type conversions. Since `jsonb_object` expects text arrays, you may need to explicitly cast non-text data types to text.

### Alternative options

- [json_object](/docs/functions/json_object) - Same functionality as `jsonb_object`, but returns a `JSON` object instead of `JSONB`.
- [to_jsonb](https://www.postgresql.org/docs/current/functions-json.html) - It can be used to create a `JSONB` object from a table row (or a row of a composite type) without needing to specify keys and values explicitly. Although, it is less flexible than `jsonb_object` since all fields in the row are included in the `JSONB` object.
- [jsonb_build_object](https://www.postgresql.org/docs/current/functions-json.html) - Similar to `jsonb_object`, but allows for more flexibility in constructing the `JSONB` object, as it can take a variable number of arguments in the form of key-value pairs.
- [jsonb_object_agg](https://www.postgresql.org/docs/current/functions-json.html) - It is used to aggregate the key-value pairs from multiple rows into a single `JSONB` object. In contrast, `jsonb_object` outputs a `JSONB` object for each row.

## Resources

- [PostgreSQL documentation: JSON functions](https://www.postgresql.org/docs/current/functions-json.html)
