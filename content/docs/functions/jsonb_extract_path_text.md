---
title: Postgres jsonb_extract_path_text() Function
subtitle: Extracts a JSON sub-object at the specified path as text
enableTableOfContents: true
updatedOn: '2024-06-14T07:55:54.377Z'
---

The `jsonb_extract_path_text` function is designed to simplify extracting text from `JSONB` data in Postgres. This function is similar to `jsonb_extract_path` — it also produces the value at the specified path from a `JSONB` object but casts it to plain text before returning. This makes it more straightforward for text manipulation and comparison operations.

<CTA />

## Function signature

```sql
jsonb_extract_path_text(from_json JSONB, VARIADIC path_elems text[]) -> TEXT
```

The function accepts a `JSONB` object and a variadic list of elements that specify the path to the desired value.

## Example usage

Let's consider a `users` table with a `JSONB` column named `profile` containing various user details.

Here's how we can create the table and insert some sample data:

```sql
CREATE TABLE users (
    id INT,
    profile JSONB
);

INSERT INTO users (id, profile)
VALUES
    (1, '{"name": "Alice", "contact": {"email": "alice@example.com", "phone": "1234567890"}, "hobbies": ["reading", "cycling", "hiking"]}'),
    (2, '{"name": "Bob", "contact": {"email": "bob@example.com", "phone": "0987654321"}, "hobbies": ["gaming", "cooking"]}');
```

To extract and view the email addresses of all users, we can run the following query:

```sql
SELECT id, jsonb_extract_path_text(profile, 'contact', 'email') as email
FROM users;
```

This query returns the following:

```text
| id | email              |
|----|--------------------|
| 1  | alice@example.com  |
| 2  | bob@example.com    |
```

## Advanced examples

### Use output of `jsonb_extract_path_text` in a `JOIN` clause

Let's say we have another table, `hobbies`, that includes additional information such as difficulty level and the average cost to practice each hobby.

We can create the `hobbies` table with some sample data with the following statements:

```sql
CREATE TABLE hobbies (
   hobby_id SERIAL PRIMARY KEY,
   hobby_name VARCHAR(255),
   difficulty_level VARCHAR(50),
   average_cost VARCHAR(50)
);

INSERT INTO hobbies (hobby_name, difficulty_level, average_cost)
VALUES
    ('Reading', 'Easy', 'Low'),
    ('Cycling', 'Moderate', 'Medium'),
    ('Gaming', 'Variable', 'High'),
    ('Cooking', 'Variable', 'Low');
```

The `users` table we created previously has a `JSONB` column named `profile` that contains information about each user's preferred hobbies. A fun exercise could be to find if a user has any hobbies that are easy to get started with. Then we can recommend they engage with it more often.

To fetch this list, we can run the query below.

```sql
SELECT
  jsonb_extract_path_text(u.profile, 'name') as user_name,
  h.hobby_name
FROM users u
JOIN hobbies h
ON jsonb_extract_path_text(u.profile, 'hobbies') LIKE '%' || lower(h.hobby_name) || '%'
WHERE h.difficulty_level = 'Easy';
```

We use `jsonb_extract_path_text` to extract the list of hobbies for each user, and then check if the name of an easy hobby is present in the list.

This query returns the following:

```text
| user_name | hobby_name |
|-----------|------------|
| Alice     | Reading    |
```

### Extract values from JSON array with `jsonb_extract_path_text`

`jsonb_extract_path_text` can also be used to extract values from `JSONB` arrays.

For instance, to extract the first and second hobbies for everyone, we can run the following query:

```sql
SELECT
    jsonb_extract_path_text(profile, 'name') as name,
    jsonb_extract_path_text(profile, 'hobbies', '0') as first_hobby,
    jsonb_extract_path_text(profile, 'hobbies', '1') as second_hobby
FROM users;
```

This query returns the following:

```text
| name  | first_hobby | second_hobby |
|-------|-------------|--------------|
| Alice | reading     | cycling      |
| Bob   | gaming      | cooking      |
```

## Additional considerations

### Performance and indexing

Performance considerations for `jsonb_extract_path_text` are similar to those for `json_extract_path`. It is efficient for extracting data but can be impacted by large `JSONB` objects or complex queries. Indexing the `JSONB` column can improve performance in some cases.

### Alternative functions

- [jsonb_extract_path](/docs/functions/jsonb_extract_path) - This is a similar function that can extract data from a `JSONB` object at the specified path. The difference is that it returns a `JSONB` object, while `jsonb_extract_path_text` always returns text. The right function to use depends on what you want to use the output data for.
- [json_extract_path_text](/docs/functions/json_extract_path_text) - This is a similar function that can extract data from a `JSON` object, (instead of `JSONB`) at the specified path.

## Resources

- [PostgreSQL Documentation: JSON Functions and Operators](https://www.postgresql.org/docs/current/functions-json.html)
- [PostgreSQL Documentation: JSON Types](https://www.postgresql.org/docs/current/datatype-json.html)

<NeedHelp />
