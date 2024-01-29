---
title: Postgres JSON Data Types
subtitle: Modeling JSON data in Postgres
enableTableOfContents: true
---

Postgres supports JSON (JavaScript Object Notation) data types, providing a flexible way to store and manipulate semi-structured data. The two JSON data types are `JSON` and `JSONB`. They mostly work similarly, but trade off ingestion vs querying performance. 

JSON and JSONB are ideal for storing data that doesn't fit neatly into traditional relational model -  configurations, user preferences or application settings, since new fields can be added without altering the database schema. Additionally, they can also be used to model document-like data typically stored in NoSQL databases, with Postgres. 

<CTA />

## Storage and syntax

### JSON
- The `JSON` data type stores JSON data in text format.
- It preserves an exact copy of the original JSON input, including whitespace and ordering of object keys.
- An advantage over storing JSON data in a `TEXT` column is that Postgres validates the JSON data at ingestion time, ensuring it is well-formed. 

### JSONB
- The `JSONB` (JSON Binary) data type stores JSON data in a decomposed binary format.
- Unlike JSON, JSONB does not preserve whitespace or the order of object keys. For duplicate keys, only the last value is stored. 
- JSONB is more efficient for querying, as it doesn't require re-parsing the JSON data every time it is accessed. 

JSON values can be created from string literals by casting. For example:

```sql
SELECT
    '{"name": "Alice", "age": 30}'::JSON as col_json,
    '[1, 2, "foo", null]'::JSONB as col_jsonb;
```

This query returns the following:
```text
           col_json           |      col_jsonb
------------------------------+---------------------
 {"name": "Alice", "age": 30} | [1, 2, "foo", null]
```

## Example usage

Consider the case of managing user profiles for a social media application. Profile data is semi-structured, with a set of fields common to all users, while other fields are optional and may vary across users. JSONB is a good fit for this use case. 

Using the query below, we can create a table to store user profiles:

```sql
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    profile JSONB NOT NULL
);

INSERT INTO user_profiles (profile)
VALUES
    ('{"name": "Alice", "age": 30, "interests": ["music", "travel"], "settings": {"privacy": "public", "notifications": true, "theme": "light"}}'),
    ('{"name": "Bob", "age": 25, "interests": ["photography", "cooking"], "settings": {"privacy": "private", "notifications": false}, "city": "NYC"}'),
    ('{"name": "Charlie", "interests": ["music", "cooking"], "settings": {"privacy": "private", "notifications": true, "language": "English"}}');
```

With JSONB, we can directly query and manipulate elements within the JSON structure. For example, to find all the users interested in music, we can run the query:

```sql
SELECT 
    id, 
    profile -> 'name' as name, 
    profile -> 'interests' as interests
FROM user_profiles
WHERE profile @> '{"interests":["music"]}'::JSONB;
```

The `@>` operator checks if the left JSONB operand contains the right JSONB operand as a subset. While the `->` operator extracts the value of a JSON key as a JSON value.

This query returns the following:

```text
 id |   name    |      interests
----+-----------+----------------------
  1 | "Alice"   | ["music", "travel"]
  3 | "Charlie" | ["music", "cooking"]
```

Note that the `name` values returned are still in JSON format. To extract the value as text, we can use the `->>` operator instead:

```sql
SELECT 
    id, 
    profile ->> 'name' as name
FROM user_profiles;
```

This query returns the following:

```text
 id |  name
----+---------
  1 | Alice
  2 | Bob
  3 | Charlie
```

## Other examples

Postgres implements a number of functions and operators to query and manipulate JSON data. Please refer to the [Neon documentation](/docs/functions/) of Postgres functions for more details. 

### Nested data 

Postgres supports storing nested JSON values. For example, in the user profile table, the `settings` field is a JSON object itself. The nested values can be extracted by chaining the `->` operator. 

For example, to access the `privacy` setting for all users, we can run the query:

```sql
SELECT 
    id, 
    profile -> 'name' as name, 
    profile -> 'settings' ->> 'privacy' as privacy
FROM user_profiles;
```

This query returns the following:

```text
 id |   name    | privacy
----+-----------+---------
  1 | "Alice"   | public
  2 | "Bob"     | private
  3 | "Charlie" | private
```

### Modifying JSONB data

The JSONB type supports updating individual fields. For example, the query below sets the `privacy` setting for all public users to `friends-only`:

```sql
UPDATE user_profiles
SET profile = jsonb_set(profile, '{settings, privacy}', '"friends-only"')
WHERE profile -> 'settings' ->> 'privacy' = 'public';
```

`jsonb_set` is a Postgres function that takes a JSONB value, a path to the field to update, and the new value. The path is specified as an array of keys.

Field updates are not supported for the JSON type.

### Indexing JSONB data

Postgres supports GIN (Generalized Inverted Index) indexes for JSONB data, which can improve query performance significantly.

```sql
CREATE INDEX idxgin ON user_profiles USING GIN (profile);
```

This makes evaluation of the `key-exists (?)` and `containment (@>)` operators efficient. For example, the query to fetch all users who have music as an interest can leverage this index. 

```sql
SELECT *
FROM user_profiles
WHERE profile @> '{"interests":["music"]}';
```

## Additional considerations

### JSON vs JSONB

JSONB is the recommended data type for storing JSON data in Postgres for a few reasons.

- **Indexing**: JSONB allows for the creation of GIN (Generalized Inverted Index) indexes, which makes searching within JSONB columns faster.
- **Performance**: JSONB's binary format is more efficient for querying and manipulating, as it doesn't require re-parsing the JSON data for each access. It also supports in-place updates to individual fields.
- **Data integrity**: JSONB ensures that keys in an object are unique. 

There might be some legacy use cases where preserving the exact format of the JSON data is important. In such cases, the JSON data type can be used.

## Resources

- [PostgreSQL documentation - JSON Types](https://www.postgresql.org/docs/current/datatype-json.html)
- [PostgreSQL documentation - JSON Functions](https://www.postgresql.org/docs/current/functions-json.html)

<NeedHelp />