---
title: Postgres json_extract_path_text() Function
subtitle: Extracts a JSON sub-object at the specified path as text
enableTableOfContents: true
updatedOn: '2024-06-14T07:55:54.375Z'
---

The `json_extract_path_text` function is designed to simplify extracting text from `JSON` data in Postgres. This function is similar to `json_extract_path` — it also produces the value at the specified path from a `JSON` object but casts it to plain text before returning. This makes it more straightforward for text manipulation and comparison operations.

<CTA />

## Function signature

```sql
json_extract_path_text(from_json json, VARIADIC path_elems text[]) -> TEXT
```

The function accepts a `JSON` object and a variadic list of elements that specify the path to the desired value.

## Example usage

Let's consider a `users` table with a `JSON` column named `profile` containing various user details.

Here's how we can create the table and insert some sample data:

```sql
CREATE TABLE users (
    id INT,
    profile JSON
);

INSERT INTO users (id, profile)
VALUES
    (1, '{"name": "Alice", "contact": {"email": "alice@example.com", "phone": "1234567890"}, "hobbies": ["reading", "cycling", "hiking"]}'),
    (2, '{"name": "Bob", "contact": {"email": "bob@example.com", "phone": "0987654321"}, "hobbies": ["gaming", "cooking"]}');
```

To extract and view the email addresses of all users, we can run the following query:

```sql
SELECT id, json_extract_path_text(profile, 'contact', 'email') as email
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

### Use `json_extract_path_text` in Joins

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

The `users` table we created previously has a `JSON` column named `profile` that contains information about each user's preferred hobbies. A fun exercise could be to find if a user has any hobbies that are easy to get started with. Then we can recommend they engage with it more often.

To fetch this list, we can run the query below.

```sql
SELECT
  json_extract_path_text(u.profile, 'name') as user_name,
  h.hobby_name
FROM users u
JOIN hobbies h
ON json_extract_path_text(u.profile, 'hobbies') LIKE '%' || lower(h.hobby_name) || '%'
WHERE h.difficulty_level = 'Easy';
```

We use `json_extract_path_text` to extract the list of hobbies for each user, and then check if the name of an easy hobby is present in the list.

This query returns the following:

```text
| user_name | hobby_name |
|-----------|------------|
| Alice     | Reading    |
```

### Extracting values from JSON arrays with `json_extract_path_text`

`json_extract_path_text` can also be used to extract values from `JSON` arrays.

For instance, to extract the first and second hobbies for everyone, we can run the following query:

```sql
SELECT
    json_extract_path_text(profile, 'name') as name,
    json_extract_path_text(profile, 'hobbies', '0') as first_hobby,
    json_extract_path_text(profile, 'hobbies', '1') as second_hobby
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

Performance considerations for `json_extract_path_text` are similar to those for `json_extract_path`. It is efficient for extracting data but can be impacted by large `JSON` objects or complex queries. Indexing `JSON` fields can improve performance in some cases.

### Alternative functions

- [json_extract_path](/docs/functions/json_extract_path) - This is a similar function that can extract data from a `JSON` object at the specified path. The difference is that it returns a `JSON` object, while `json_extract_path_text` always returns text. The right function to use depends on what you want to use the output data for.
- [jsonb_extract_path_text](/docs/functions/jsonb_extract_path_text) - This is a similar function that can extract data from a `JSON` object at the specified path. It is more efficient but works only with data of the type `JSONB`.

## Resources

- [PostgreSQL Documentation: JSON Functions and Operators](https://www.postgresql.org/docs/current/functions-json.html)
- [PostgreSQL Documentation: JSON Types](https://www.postgresql.org/docs/current/datatype-json.html)

<NeedHelp />
