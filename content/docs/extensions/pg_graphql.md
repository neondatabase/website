---
title: The pg_graphql extension
subtitle: Instantly create a GraphQL API for your Postgres database
enableTableOfContents: true
updatedOn: '2025-05-27T19:40:34.754Z'
tag: new
---

The `pg_graphql` extension adds a GraphQL API layer directly to your Postgres database. It introspects your SQL schema, tables, columns, relationships, and functions and automatically generates a corresponding GraphQL schema. This allows you to query your database using GraphQL through a single SQL function call, `graphql.resolve()`, eliminating the need for external GraphQL servers or middleware.

With `pg_graphql`, you can leverage the flexibility of GraphQL for data fetching while keeping your data and API logic tightly coupled within Postgres. It respects existing Postgres roles ensuring data access remains secure and consistent.

<CTA />

## Enable the `pg_graphql` extension

You can enable the extension by running the following `CREATE EXTENSION` statement in the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or from a client such as [psql](/docs/connect/query-with-psql-editor) that is connected to your Neon database.

```sql
CREATE EXTENSION IF NOT EXISTS pg_graphql;
```

**Version availability:**

Please refer to the [list of all extensions](/docs/extensions/pg-extensions) available in Neon for up-to-date extension version information.

## Core concepts

### The `graphql.resolve()` function

The `graphql.resolve()` function is the main entry point for executing GraphQL queries against your Postgres database. It acts as a bridge between your SQL schema and the GraphQL API. You pass your GraphQL query string (and optionally, variables and an operation name) to this function. It executes the query against the auto-generated GraphQL schema based on your database structure and returns the result as a JSONB object.

**Basic signature:**

```sql
graphql.resolve(query TEXT, variables JSONB DEFAULT '{}') RETURNS JSONB;
```

### Schema reflection

`pg_graphql` automatically creates a GraphQL schema from your SQL schema:

- **Tables and views**: Become GraphQL object types.
- **Columns**: Become fields on those types.
- **Foreign keys**: Define relationships between types.
- **Primary keys**: Essential for a table/view to be included. Each type gets a globally unique `nodeId: ID!` field.

### The `Node` interface

`pg_graphql` implements the GraphQL Global Object Identification Specification. Every table type with a primary key implements the `Node` interface and gets a `nodeId: ID!` field. This `nodeId` is a globally unique, opaque identifier for a record, useful for client-side caching and refetching specific objects.

## Querying data (`Query` type)

The `Query` type is the entry point for all read operations.

### Collections

For each accessible table (e.g., `Book`), `pg_graphql` creates a collection field (e.g., `bookCollection`) on the `Query` type. Collections allow you to fetch multiple records and support pagination, filtering, and sorting.

#### Basic collection fetch

Create a `Book` table:

```sql
CREATE TABLE "Book" (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  published_year INT
);

INSERT INTO "Book" (title, author, published_year) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', 1925),
('To Kill a Mockingbird', 'Harper Lee', 1960),
('1984', 'George Orwell', 1949);
```

<Admonition type="info" title="Inflection">
To convert `snake_case` SQL names to `camelCase` (fields) / `PascalCase` (types) GraphQL names, use the `@graphql` comment directive on the schema:

```sql
COMMENT ON SCHEMA public IS '@graphql({"inflect_names": true})';
```

This will convert all table and column names to their GraphQL equivalents. For example:

- `book` table becomes `Book` type
- `book_collection` becomes `bookCollection` field
- `book_authors` table becomes `BookAuthors` type
- `published_at` column becomes `publishedAt` field
- `published_year` column becomes `publishedYear` field

It is optional to use this directive, but it is recommended for consistency and readability. The guide uses the inflected names for clarity. Learn more about Inflection in the [pg_graphql documentation](https://supabase.github.io/pg_graphql/configuration/#inflection).
</Admonition>

#### Fetch all books

To fetch all books, use the `bookCollection` field on the `Query` type. The result is a connection type with `edges` and `node` fields.

Run the following SQL query to fetch all books:

```sql
SELECT graphql.resolve($$
  query GetAllBooks {
    bookCollection {
      edges {
        node {
          id
          title
          author
        }
      }
    }
  }
$$);
```

```json shouldWrap
{
  "data": {
    "bookCollection": {
      "edges": [
        { "node": { "id": 1, "title": "The Great Gatsby", "author": "F. Scott Fitzgerald" } },
        { "node": { "id": 2, "title": "To Kill a Mockingbird", "author": "Harper Lee" } },
        { "node": { "id": 3, "title": "1984", "author": "George Orwell" } }
      ]
    }
  }
}
```

#### Pagination

Use `first` to limit results and `after` with a cursor for pagination.

```sql
SELECT graphql.resolve($$
  query PaginateBooks {
    bookCollection(first: 1) { # Get the first book
      edges {
        cursor # Use this cursor for the 'after' argument next time
        node {
          title
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
$$);
```

```json shouldWrap
{
  "data": {
    "bookCollection": {
      "edges": [{ "node": { "title": "The Great Gatsby" }, "cursor": "<opaqueCursorString>" }],
      "pageInfo": { "endCursor": "<opaqueCursorString>", "hasNextPage": true }
    }
  }
}
```

To get the next page, you'd take `endCursor` from the `pageInfo` and use it as the `after` argument in a subsequent query: `bookCollection(first: 1, after: "opaqueCursorString")`.

#### Filtering

Use the `filter` argument. Filterable fields and operators (`eq`, `gt`, `lt`, `contains`, `and`, `or`, `not`) are generated based on column types.

Find books by George Orwell published after 1940:

```sql
SELECT graphql.resolve($$
  query FilteredBooks {
    bookCollection(filter: {
      and: [
        { author: { eq: "George Orwell" } },
        { publishedYear: { gt: 1940 } }
      ]
    }) {
      edges {
        node {
          title
          publishedYear
        }
      }
    }
  }
$$);
```

```json shouldWrap
{
  "data": {
    "bookCollection": { "edges": [{ "node": { "title": "1984", "published_year": 1949 } }] }
  }
}
```

#### Sorting

Use the `orderBy` argument. The `orderBy` clause takes a list of fields to sort by, each with a direction. Common direction enums are `AscNullsFirst`, `AscNullsLast`, `DescNullsFirst`, and `DescNullsLast`.

```sql
SELECT graphql.resolve($$
  query SortedBooks {
    bookCollection(orderBy: [{ publishedYear: DescNullsLast }]) {
      edges {
        node {
          title
          publishedYear
        }
      }
    }
  }
$$);
```

```json shouldWrap
{
  "data": {
    "bookCollection": {
      "edges": [
        { "node": { "title": "To Kill a Mockingbird", "publishedYear": 1960 } },
        { "node": { "title": "1984", "publishedYear": 1949 } },
        { "node": { "title": "The Great Gatsby", "publishedYear": 1925 } }
      ]
    }
  }
}
```

## Modifying data (`Mutation` type)

The `Mutation` type is the entry point for write operations.

### Inserting records

Use `insertInto<Table>Collection`.

```sql
SELECT graphql.resolve($$
  mutation AddNewBook {
    insertIntoBookCollection(
      objects: [{ title: "Brave New World", author: "Aldous Huxley", publishedYear: 1932 }]
    ) {
      affectedCount
      records { # Returns the inserted records
        id
        title
      }
    }
  }
$$);
```

```json shouldWrap
{
  "data": {
    "insertIntoBookCollection": {
      "records": [{ "id": 4, "title": "Brave New World" }],
      "affectedCount": 1
    }
  }
}
```

### Updating records

Use `update<Table>Collection`. Requires a `filter` to specify which records, a `set` clause for new values, and `atMost` as a safety limit.

```sql
SELECT graphql.resolve($$
  mutation UpdateBookTitle {
    updateBookCollection(
      filter: { id: { eq: 1 } },
      set: { title: "The Great Gatsby (Revised Edition)" },
      atMost: 1
    ) {
      affectedCount
      records {
        id
        title
      }
    }
  }
$$);
```

```json shouldWrap
{
  "data": {
    "updateBookCollection": {
      "records": [{ "id": 1, "title": "The Great Gatsby (Revised Edition)" }],
      "affectedCount": 1
    }
  }
}
```

### Deleting records

Use `deleteFrom<Table>Collection`. Requires a `filter` and `atMost`.

```sql
SELECT graphql.resolve($$
  mutation DeleteBook {
    deleteFromBookCollection(
      filter: { id: { eq: 1 } },
      atMost: 1
    ) {
      affectedCount
      records { # Returns the deleted records
        id
        title
      }
    }
  }
$$);
```

```json shouldWrap
{
  "data": {
    "deleteFromBookCollection": {
      "records": [{ "id": 1, "title": "The Great Gatsby (Revised Edition)" }],
      "affectedCount": 1
    }
  }
}
```

## Relationships

`pg_graphql` automatically infers relationships from foreign key constraints.

**Example: Authors and Books**

```sql
CREATE TABLE "Author" (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE "Book" (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author_id INT REFERENCES "Author"(id) -- Foreign key
);

INSERT INTO "Author" (name) VALUES ('George Orwell');
INSERT INTO "Book" (title, author_id) VALUES ('1984', 1), ('Animal Farm', 1);
```

Query books and their author:

```sql
SELECT graphql.resolve($$
  query BooksWithAuthors {
    bookCollection {
      edges {
        node {
          title
          author { # Field for related Author
            name
          }
        }
      }
    }
  }
$$);
```

```json shouldWrap
{
  "data": {
    "bookCollection": {
      "edges": [
        { "node": { "title": "1984", "author": { "name": "George Orwell" } } },
        { "node": { "title": "Animal Farm", "author": { "name": "George Orwell" } } }
      ]
    }
  }
}
```

Query authors and their books:

```sql
SELECT graphql.resolve($$
  query AuthorsWithBooks {
    authorCollection {
      edges {
        node {
          name
          bookCollection { # Collection of related Books
            edges {
              node {
                title
              }
            }
          }
        }
      }
    }
  }
$$);
```

```json shouldWrap
{
  "data": {
    "authorCollection": {
      "edges": [
        {
          "node": {
            "name": "George Orwell",
            "bookCollection": {
              "edges": [{ "node": { "title": "1984" } }, { "node": { "title": "Animal Farm" } }]
            }
          }
        }
      ]
    }
  }
}
```

## Computed fields

You can add fields that are not directly stored columns.

### Postgres generated columns

```sql
CREATE TABLE "User" (
  id SERIAL PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  full_name TEXT GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED
);

INSERT INTO "User" (first_name, last_name) VALUES ('John', 'Doe');
```

`full_name` will automatically appear in the `User` GraphQL type.

```sql
SELECT graphql.resolve($$
  query UserFullName {
    userCollection {
      edges {
        node {
          firstName
          lastName
          fullName # Computed field
        }
      }
    }
  }
$$);
```

```json shouldWrap
{
  "data": {
    "userCollection": {
      "edges": [{ "node": { "lastName": "Doe", "firstName": "John", "fullName": "John Doe" } }]
    }
  }
}
```

### SQL functions

For more complex logic, create an SQL function that takes the table's row type as input.

```sql
CREATE FUNCTION get_user_initials(u "User")
RETURNS TEXT
STABLE LANGUAGE SQL
AS $$
  SELECT substr(u.first_name, 1, 1) || substr(u.last_name, 1, 1);
$$;
```

This would (by default) add a `getUserInitials` field to the `User` type. Naming can be customized.

**Example:**

```sql
SELECT graphql.resolve($$
  query UserInitials {
    userCollection {
      edges {
        node {
          firstName
          lastName
          getUserInitials # Custom field
        }
      }
    }
  }
$$);
```

```json shouldWrap
{
  "data": {
    "userCollection": {
      "edges": [{ "node": { "lastName": "Doe", "firstName": "John", "getUserInitials": "JD" } }]
    }
  }
}
```

## Configuration via comment directives

Customize `pg_graphql` behavior using comments on SQL objects.
Format: `COMMENT ON ... IS '@graphql({"key": "value"})';`

### Renaming

You can rename tables, columns, and types in the GraphQL schema using the `@graphql` directive.

```sql
COMMENT ON TABLE "Book" IS '@graphql({"name": "Publication"})'; -- Book table -> Publication type
COMMENT ON COLUMN "Book".title IS '@graphql({"name": "headline"})'; -- Book.title -> Publication.headline
```

```sql
SELECT graphql.resolve($$
  query RenamedTypes {
    publicationCollection {
      edges {
        node {
          headline
        }
      }
    }
  }
$$);
```

```json shouldWrap
{
  "data": {
    "publicationCollection": {
      "edges": [{ "node": { "headline": "1984" } }, { "node": { "headline": "Animal Farm" } }]
    }
  }
}
```

### Descriptions

You can add descriptions to tables, columns, and types using the `@graphql` directive. This is useful for documentation and introspection.

```sql
COMMENT ON TABLE "Book" IS '@graphql({"description": "Represents a literary work."})';
```

```sql
SELECT graphql.resolve($$
  query BookDescription {
    __type(name: "Book") {
      description
    }
  }
$$);
```

```json shouldWrap
{ "data": { "__type": { "description": "Represents a literary work." } } }
```

### `totalCount` on collections

Enable the `totalCount` field on a connection type.

```sql
COMMENT ON TABLE "Book" IS '@graphql({"totalCount": {"enabled": true}})';
```

Now `bookCollection` will have `totalCount`.

```sql
SELECT graphql.resolve($$
  query BookTotalCount {
    bookCollection {
      totalCount
    }
  }
$$);
```

```json shouldWrap
{ "data": { "bookCollection": { "totalCount": 2 } } }
```

## Views and foreign tables

Views (and materialized views, foreign tables) can be exposed if they have a "virtual" primary key defined via a comment directive:

```sql
CREATE VIEW "NewUsers" AS
SELECT * FROM "User"; -- optional WHERE clause as per the view definition

COMMENT ON VIEW "NewUsers" IS '@graphql({"primary_key_columns": ["id"]})';
```

Now `NewUsers` will be queryable via GraphQL.

```sql
SELECT graphql.resolve($$
  query NewUsers {
    newUsersCollection {
      edges {
        node {
          id
          firstName
          lastName
        }
      }
    }
  }
$$);
```

```json shouldWrap
{
  "data": {
    "newUsersCollection": {
      "edges": [{ "node": { "id": 1, "lastName": "Doe", "firstName": "John" } }]
    }
  }
}
```

## Security considerations

`pg_graphql` fully respects Postgres's native security:

- **Role permissions**: A user querying via `pg_graphql` can only see/interact with tables, columns, and functions they have SQL permissions for. If a role lacks `SELECT` on a table, that table won't appear in their GraphQL schema.
- **Row-Level Security (RLS)**: All RLS policies are automatically applied.

While this guide provides a solid foundation, `pg_graphql` offers a rich set of advanced features not covered here. For a deeper dive into capabilities like exposing complex SQL functions as queries or mutations, advanced filtering techniques including nested logical operators and array operations, fine-tuning schema generation with more comment directives (e.g., for computed relationships on views or custom naming for all elements), handling transactions, performance optimization strategies, and detailed guides for integrating with client libraries like Apollo and Relay, please refer to the official [`pg_graphql` documentation](https://supabase.github.io/pg_graphql/).

## Conclusion

`pg_graphql` offers an efficient way to generate a GraphQL API directly from your Postgres database. By understanding its schema reflection, the `graphql.resolve()` function, and basic configuration, you can quickly expose your data for flexible querying without needing an external GraphQL server.

## Resources

- [`pg_graphql` official documentation](https://supabase.github.io/pg_graphql/)
- [GraphQL official documentation](https://graphql.org/learn/)

<NeedHelp />
