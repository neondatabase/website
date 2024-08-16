---
title: Postgres array_to_json() function
subtitle: Converts an SQL array to a JSON array
enableTableOfContents: true
updatedOn: '2024-06-14T07:55:54.372Z'
---

You can use the `array_to_json` function to convert a Postgres array into its `JSON` representation, transforming an array of values into a `JSON` array. This helps facilitate integration with web services, APIs, and web frameworks that heavily rely on `JSON`.

<CTA />

## Function signature

```sql
array_to_json(anyarray [, pretty_bool])
```

Line feeds will be added between dimension 1 elements if `pretty_bool` is true.

## `array_to_json` example

Let's consider a scenario where an e-commerce platform stores customer preferences as an array of string values in a `customers` table.

**customers**

```sql
CREATE TABLE customers (
 id SERIAL PRIMARY KEY,
 name TEXT NOT NULL,
 preferences TEXT[]
);

INSERT INTO customers (name, preferences)
VALUES ('John Doe', '{clothing, electronics}');

INSERT INTO customers (name, preferences)
VALUES ('Jane Doe', '{books, music, travel}');
```

```
 id  |   name   |      preferences
----+----------+------------------------
  1 | John Doe | {clothing,electronics}
  2 | Jane Doe | {books,music,travel}
```

You can use the `array_to_json` function as shown to transform the array of string values into a `JSON` array:

```sql
SELECT id, name, array_to_json(preferences) AS json_preferences
FROM customers;
```

This query returns the following result:

```
 id  |   name   |      json_preferences
----+----------+----------------------------
  1 | John Doe | ["clothing","electronics"]
  2 | Jane Doe | ["books","music","travel"]
```

## Advanced examples

Let's now take a look at a few advanced examples.

### Use `array_to_json` with `array_agg`

Imagine you have an e-commerce website with user's shopping cart items, as shown in the following `cart_items` table:

**cart_items**

```sql
CREATE TABLE cart_items (
 id SERIAL PRIMARY KEY,
 user_id INTEGER NOT NULL,
 product_id INTEGER NOT NULL,
 quantity INTEGER NOT NULL
);

INSERT INTO cart_items (user_id, product_id, quantity)
VALUES (1, 123, 1), (1, 456, 2), (1, 789, 3);


INSERT INTO cart_items (user_id, product_id, quantity)
VALUES (2, 123, 2), (2, 456, 3), (2, 789, 4);
```

```
 id  | user_id | product_id | quantity
----+---------+------------+----------
  1 |       1 |        123 |        1
  2 |       1 |        456 |        2
  3 |       1 |        789 |        3
  4 |       2 |        123 |        2
  5 |       2 |        456 |        3
  6 |       2 |        789 |        4
```

You can utilize `array_to_json` to create a clean and efficient `JSON` representation of the cart contents for a specific user.

In the example below, the `row_to_json` function converts each row of the result set into a `JSON` object.

The `array_agg` function is an aggregate function that aggregates multiple values into an array. It is used here to aggregate the `JSON` objects created by `row_to_json` into a `JSON` array.

```sql
SELECT array_to_json(
 array_agg(row_to_json(t))
) AS items
FROM (
     SELECT product_id, quantity FROM cart_items WHERE user_id = 1
   ) t;
```

This query returns the following result:

```shell
                                               items
---------------------------------------------------------------------------------------------------
 [{"product_id":123,"quantity":1},{"product_id":456,"quantity":2},{"product_id":789,"quantity":3}]
```

And this is the resulting `JSON` structure:

```json
[
  {
    "product_id": 123,
    "quantity": 1
  },
  {
    "product_id": 456,
    "quantity": 2
  },
  {
    "product_id": 789,
    "quantity": 3
  }
]
```

### Handling `NULL` in `array_to_json`

The `array_to_json` function handles `NULL` values gracefully, representing them as `JSON` `null` within the resulting array.

Let's consider a `survey_responses` table representing a survey where each participant can provide multiple responses to different questions. Some participants may not answer all questions, leading to `NULL` values in the data.

```sql
CREATE TABLE survey_responses (
   participant_id SERIAL PRIMARY KEY,
   participant_name VARCHAR(50),
   responses VARCHAR(50)[]
);

-- Insert sample data with NULL responses
INSERT INTO survey_responses (participant_name, responses) VALUES
   ('Participant A', ARRAY['Yes', 'No', 'Maybe']),
   ('Participant B', ARRAY['Yes', NULL, 'No']),
   ('Participant C', ARRAY[NULL, 'No', 'Yes']),
   ('Participant D', ARRAY['Yes', 'No', NULL]);
```

```
 participant_id  | participant_name |   responses
----------------+------------------+----------------
              1 | Participant A    | {Yes,No,Maybe}
              2 | Participant B    | {Yes,NULL,No}
              3 | Participant C    | {NULL,No,Yes}
              4 | Participant D    | {Yes,No,NULL}
```

The output correctly represents `NULL` values as `JSON` `null` in the `responses_json` array.

```sql
SELECT
   participant_id,
   participant_name,
   array_to_json(COALESCE(responses, ARRAY[]::VARCHAR[])) AS responses_json
FROM
   survey_responses;
```

This query returns the following result:

```
participant_id | participant_name | responses_json
---------------+-----------------=+---------------------
             1 | Participant A    | ["Yes","No","Maybe"]
             2 | Participant B    | ["Yes",null,"No"]
             3 | Participant C    | [null,"No","Yes"]
             4 | Participant D    | ["Yes","No",null]
```

## Additional considerations

This section outlines additional considerations when using the `array_to_json` function.

### JSON functions

In scenarios where more control over the `JSON` structure is required, consider using the `json_build_array` and `json_build_object` functions. These functions allow for a more fine-grained construction of `JSON` objects and arrays.

### Formatting `array_to_json` output with `pretty_bool`

The `pretty_bool` parameter, when set to `true`, instructs `array_to_json` to format the output with indentation and line breaks for improved readability.

Execute the earlier query with `pretty_bool` as `true`:

```sql
SELECT array_to_json(
 array_agg(row_to_json(t)), true
) AS items
FROM (
     select product_id, quantity from cart_items WHERE user_id = 1
   ) t;
```

This query returns the following result:

```
               items
-----------------------------------
 [{"product_id":123,"quantity":1},+
  {"product_id":456,"quantity":2},+
  {"product_id":789,"quantity":3}]
```

<Admonition type="note">
The output displayed in `psql` might be truncated or wrap long lines for visual clarity.
</Admonition>

## Resources

- [PostgreSQL documentation: JSON Functions and Operators](https://www.postgresql.org/docs/current/functions-json.html)
- [PostgreSQL documentation: JSON Types](https://www.postgresql.org/docs/current/datatype-json.html)
  ß
