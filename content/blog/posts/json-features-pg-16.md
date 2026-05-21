---
title: Understanding the new JSON capabilities in Postgres 16
description: >-
  Learn about the latest new features introduced in Postgres 16 for working with
  JSON data
excerpt: >-
  We’re excited to announce that Neon now supports Postgres 16. This latest
  release includes several performance improvements and developer experience
  enhancements. One of the most anticipated features is the expanded support for
  SQL/JSON syntax, including: In this article, we will...
date: "2023-09-18T15:00:24"
updatedOn: "2023-12-04T12:19:41"
category: community
categories:
  - community
authors:
  - raouf-chebri
  - mahmoud-abdelwahab
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/json-features-pg-16/cover.png
  alt: null
isFeatured: false
seo:
  title: Understanding the new JSON capabilities in Postgres 16 - Neon
  description: >-
    Learn about the latest new features introduced in Postgres 16 for working
    with JSON data
  keywords: []
  noindex: false
  ogTitle: Understanding the new JSON capabilities in Postgres 16 - Neon
  ogDescription: >-
    Learn about the latest new features introduced in Postgres 16 for working
    with JSON data
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/json-features-pg-16/social.png
---

We’re excited to announce that Neon now supports [Postgres 16](https://www.postgresql.org/about/news/postgresql-16-released-2715/). This latest release includes several performance improvements and developer experience enhancements. One of the most anticipated features is the expanded support for SQL/JSON syntax, including:

- `JSON_ARRAY()`: Constructs a JSON array.
- `JSON_ARRAYAGG()`: Aggregates input values into a JSON array.
- `IS JSON`: A predicate to determine if a given value is a valid JSON.

In this article, we will cover these new functions and predicates that you can [try out on Neon today](https://console.neon.tech).

<figure>
<video autoPlay playsInline muted loop width="1920" height="1080" src="https://cdn.neonapi.io/public/videos/pages/blog/json-features-pg-16/pg16-4d83636d.mp4"></video>
</figure>

## JSON_ARRAY

The `json_array()` function is designed for constructing a JSON array. There are two main usages:

**From a series of values:**

```sql
  SELECT json_array(1, true, json '{"a":null}');
```

Output:

```sql
 json_array

[1, true, {"a":null}]
```

From the outcome of a `SELECT` query:

```sql
SELECT json_array(SELECT * FROM (VALUES(1),(2)) t);
```

Output:

```sql
 json_array

[1, 2]
(1 row)
```

## JSON_ARRAYAGG

The `json_arrayagg()` function essentially behaves like the `json_array()` function but is designed to operate as an aggregate function. To understand the difference between `json_arrayagg()` and `json_array()` functions, let’s consider the following example.

```sql
-- Creating the users table
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255)
);

-- Inserting values into the users table
INSERT INTO users (user_id, first_name, last_name, email) VALUES
(1, 'John', 'Doe', 'john@email.com'),
(2, 'Jane', NULL, 'jane@email.com'),
(3, 'Bob', 'Smith', NULL);
```

Using `json_array()`, the query will return a list of arrays that include the last names:

```sql
SELECT json_array(last_name) FROM users;
```

Output:

```sql
 json_array

["Doe"]
[]
["Smith"]
(3 rows)
```

However, with `json_arrayagg()`, the query returns one array of all last names:

```sql
SELECT json_arrayagg(last_name) FROM users;
```

Output:

```sql
 json_arrayagg

["Doe", "Smith"]
```

## IS JSON Predicate

The `IS JSON` predicate is introduced to test if an expression can be parsed as JSON and possibly of a specified type.

Testing various JSON types:

Example:

```sql
 SELECT js,
    js IS JSON "json?",
    js IS JSON SCALAR "scalar?",
    js IS JSON OBJECT "object?",
    js IS JSON ARRAY "array?"
  FROM (VALUES ('123'), ('"abc"'), ('{"a": "b"}'), (' [1,2]'), ('abc')) foo(js);
```

Output:

```sql
     js     | json? | scalar? | object? | array?
------------+-------+---------+---------+--------
 123        | t     | t       | f       | f
 "abc"      | t     | t       | f       | f
 {"a": "b"} | t     | f       | t       | f
 [1,2]      | t     | f       | f       | t
 abc        | f     | f       | f       | f
(5 rows)
```

Testing arrays with unique keys:

Example:

```sql
  SELECT js,
    js IS JSON OBJECT "object?",
    js IS JSON ARRAY "array?",
    js IS JSON ARRAY WITH UNIQUE KEYS "array w. UK?",
    js IS JSON ARRAY WITHOUT UNIQUE KEYS "array w/o UK?"
  FROM (VALUES (' [{"a":"1"}, {"b":"2","b":"3"}]')) foo(js);
```

Output:

```sql
             js               | object? | array? | array w. UK? | array w/o UK?
--------------------------------+---------+--------+--------------+---------------
 [{"a":"1"}, {"b":"2","b":"3"}] | f       | t      | f            | t
(1 row)
```

## Conclusion

Postgres 16 introduces many improvements and features, some of which were contributed by the Neon Postgres team ([Heikki Linnakangas](https://github.com/hlinnaka), [Matthias van de Meent](https://github.com/MMeent), [Tristan Partin](https://github.com/tristan957)). We’re excited about this new version, which you can [try it out on Neon today](https://console.neon.tech/sign_in).

If you have any questions or feedback, please reach out to us in our [community forum](https://community.neon.tech). We’d love to hear from you.

Also, make sure to subscribe below if you would like to be notified of new content we publish on our blog.
