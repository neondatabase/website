---
title: 'PostgreSQL jsonb_extract_path_text() Function'
page_title: 'PostgreSQL jsonb_extract_path_text() Function'
page_description: 'You will learn how to use the PostgreSQL jsonb_extract_path_text() function to extract a JSON subobject at the specified path.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_extract_path_text/'
ogImage: ''
updatedOn: '2024-02-25T00:07:27+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL jsonb_extract_path() Function'
  slug: 'postgresql-json-functions/postgresql-jsonb_extract_path'
nextLink:
  title: 'PostgreSQL JSON Extract'
  slug: 'postgresql-json-functions/postgresql-json-extract'
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `jsonb_extract_path_text()` function to extract a JSON subobject at the specified path.

## Introduction to the PostgreSQL jsonb_extract_path_text() function

The `jsonb_extract_path_text()` function allows you to extract a [JSON](../postgresql-tutorial/postgresql-json) subobject as text from a JSONB value at a specified path.

The following shows the basic syntax of the `jsonb_extract_path_text()` function:

```sql
jsonb_extract_path_text(
    target jsonb,
    VARIADIC path_elems text[]
)
```

In this syntax:

- `target` is a JSONB data from which you want to extract data as text.
- `path_elems` is a list of paths that you want to locate the elements in the JSONB data for extraction.

Here's the syntax for the `path_elems` parameter:

- `'key'`: Access a specific key in a JSON object.
- '`array_index`': Access an element in a JSON array using its index.

Additionally, you can chain these path components together to navigate through the nested objects or arrays.

For example, suppose you have the following JSON object:

```sql
{
  "employee": {
    "name": "John Doe",
    "age": 22,
    "contacts": [
      {"type": "email", "value": "john.doe@example.com"},
      {"type": "phone", "value": "408-123-456"}
    ]
  }
}
```

Here are some examples of the path expressions:

- `'employee'` returns the entire `employee` object.
- `['employee', 'name']` returns the name within the employee object, which is `"John Doe"`.
- `['employee', 'contacts', '0', 'value']` returns the value in the first element of the `contacts` array, which is `john.doe@example.com`

## PostgreSQL jsonb_extract_path_text() function examples

Let's explore some examples of using the `jsonb_extract_path_text()` function.

### Setting up a sample table

First, [create a new table](../postgresql-tutorial/postgresql-create-table) called `documents`:

```sql
CREATE TABLE documents(
   id SERIAL PRIMARY KEY,
   data JSONB
);
```

Second, [insert two rows](../postgresql-tutorial/postgresql-insert) into the `documents` table:

```sql
INSERT INTO documents(data)
VALUES
  ('{"employee":{"name":"John Doe","age":22,"contacts":[{"type":"email","value":"john.doe@example.com"},{"type":"phone","value":"408-123-456"}]}}'),
  ('{"employee":{"name":"Jane Doe","age":21,"contacts":[{"type":"email","value":"jane.doe@example.com"},{"type":"phone","value":"408-123-789"}]}}');
```

### Basic jsonb_extract_path_text() function examples

The following example uses the `jsonb_extract_path_text()` function to extract the employee object:

```sql
SELECT
  jsonb_extract_path_text(data, 'employee') employee
FROM
  documents;
```

Output:

```text
                                                                 employee
-------------------------------------------------------------------------------------------------------------------------------------------
 {"age": 22, "name": "John Doe", "contacts": [{"type": "email", "value": "john.doe@example.com"}, {"type": "phone", "value": "408-123-456"}]}
 {"age": 21, "name": "Jane Doe", "contacts": [{"type": "email", "value": "jane.doe@example.com"}, {"type": "phone", "value": "408-123-789"}]}
(2 rows)
```

The following example uses the `jsonb_extract_path_text()` function to extract the names of employees:

```sql
SELECT
  jsonb_extract_path_text(data, 'employee', 'name') name
FROM
  documents;
```

Output:

```text
   name
----------
 John Doe
 Jane Doe
(2 rows)
```

The following example uses the `jsonb_extract_path_text()` function to extract the emails of employees:

```sql
SELECT
  jsonb_extract_path_text(
    data, 'employee', 'contacts', '0',
    'value'
  ) email
FROM
  documents;
```

Output:

```text
       email
-------------------
 john.doe@example.com
 jane.doe@example.com
(2 rows)

```

## Summary

- Use the `jsonb_extract_path_text()` function to extract JSON subobject as text at the specified path.
