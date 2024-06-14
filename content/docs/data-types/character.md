---
title: Postgres Character data types
subtitle: Work with text data in Postgres
enableTableOfContents: true
updatedOn: '2024-06-14T07:55:54.365Z'
---

In Postgres, character data types are used to store strings. There are three primary character types: `CHAR(n)`, `VARCHAR(n)`, and `TEXT`. `CHAR(n)` and `VARCHAR(n)` types are suitable for strings with known or limited length; for example, usernames and email addresses. Whereas `TEXT` is ideal for storing large variable-length strings, such as blog posts or product descriptions.

<CTA />

## Storage and syntax

- `VARCHAR(n)` allows storing any string up to `n` characters.
- `CHAR(n)` stores strings in a fixed length. If a string is shorter than `n`, it is padded with spaces.
- `TEXT` has no length limit, making it ideal for large texts.

Storing strings requires one or a few bytes of overhead over the actual string length. `CHAR` and `VARCHAR` columns need an extra check at input time to ensure the string length is within the specified limit. Most Postgres string functions take and return `TEXT` values.

String values are represented as literals in single quotes. For example, `'hello'` is a string literal.

## Example usage

Consider a database tracking data for a library. We have books with titles and optional descriptions. Titles are usually of a similar length, so they can be modeled with a `CHAR` type. However, descriptions can vary significantly in length, so they are assigned the `TEXT` type.

The query below creates a `books` table and inserts some sample data:

```sql
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title CHAR(50),
    description TEXT
);

INSERT INTO books (title, description)
VALUES
    ('Postgres Guide', 'A comprehensive guide to PostgreSQL.'),
    ('Data Modeling Essentials', NULL),
    ('SQL for Professionals', 'An in-depth look at advanced SQL techniques.');
```

To find books with descriptions, you can use the following query:

```sql
SELECT title
FROM books
WHERE description IS NOT NULL;
```

This query returns the following:

```text
                       title
----------------------------------------------------
 Postgres Guide
 SQL for Professionals
```

## Other examples

### String functions and operators

Postgres provides various functions and operators for manipulating character data. For instance, the `||` operator concatenates strings.

The query below joins the title and description columns together:

```sql
SELECT title || ' - ' || description AS full_description
FROM books;
```

This query returns the following:

```text
                           full_description
----------------------------------------------------------------------
 Postgres Guide - A comprehensive guide to PostgreSQL.

 SQL for Professionals - An in-depth look at advanced SQL techniques.
```

For more string functions and operators, see [PostgreSQL String Functions and Operators](https://www.postgresql.org/docs/current/functions-string.html).

### Pattern matching

With `VARCHAR` and `TEXT`, you can use pattern matching to find specific text. The `LIKE` operator is commonly used for this purpose.

```sql
SELECT id, title
FROM books
WHERE title LIKE 'Data%';
```

This returns books whose titles start with "Data".

```text
 id |                       title
----+----------------------------------------------------
  2 | Data Modeling Essentials
```

## Additional considerations

- **Performance**: There are no significant performance differences between any of the types. Using fixed/limited length types, `CHAR` and `VARCHAR` can be useful for data validation.
- **Function Support**: All character types support a wide range of functions and operators for string manipulation and pattern matching.

## Resources

- [PostgreSQL Character Types documentation](https://www.postgresql.org/docs/current/datatype-character.html)

<NeedHelp />
