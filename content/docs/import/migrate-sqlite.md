---
title: Migrate from SQLite to Neon Postgres
enableTableOfContents: true
isDraft: false
updatedOn: '2025-06-27T09:31:11.052Z'
---

This guide describes how to migrate your SQLite database to Neon Postgres using [pgloader](https://pgloader.readthedocs.io/en/latest/intro.html)

`pgloader` is an open-source data loading and migration tool that efficiently transfers data from various sources (like CSV, MySQL, SQLite, MS SQL, etc.) into Postgres, handling schema and data transformations on the fly. We'll use it to migrate a sample SQLite database to Neon Postgres

## Prerequisites

Before you begin, ensure you have the following:

- A Neon account and a project. If you don't have one, see [Sign up](/docs/get-started-with-neon/signing-up).
- A database created in your Neon project. For instructions, see [Create a database](/docs/manage/databases#create-a-database).
- The file path to your source SQLite database file. If you don't have one, you can create a sample database in the next step.
- Neon's Free Plan supports 500 MiB of data. If your data size is more than 500 MiB, you'll need to upgrade to one of Neon's paid plans. See [Neon plans](/docs/introduction/plans) for more information.

A review of the [pgloader SQLite to Postgres Guide](https://pgloader.readthedocs.io/en/latest/ref/sqlite.html) is also recommended. It provides a comprehensive overview of `pgloader`'s capabilities.

## Understanding SQLite and Postgres data types

Before migrating from SQLite to Postgres, it's helpful to understand a key difference in how they handle data types:

- **SQLite** uses a flexible typing system called "type affinity". You can store any type of data in any column, regardless of its declared type. For example, you can store the text "hello" in a column declared as `INTEGER`. The declared type is only a suggestion.
- **Postgres** uses a strict, static typing system. Data inserted into a column must precisely match the column's declared data type. An attempt to store "hello" in an `INTEGER` column will result in an error.

When converting a database, SQLite's type affinities are mapped to appropriate Postgres types. Here is a summary of the common mappings:

| Data Type Category              | SQLite                                  | PostgreSQL                                                                              | Key Differences & Notes                                                                                                                                                                                                                                                                                                   |
| :------------------------------ | :-------------------------------------- | :-------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Integer**                     | `INTEGER`                               | `SMALLINT` (2 bytes)<br/>`INTEGER` (4 bytes)<br/>`BIGINT` (8 bytes)                     | SQLite's `INTEGER` is a flexible-size signed integer, storing values in 1, 2, 3, 4, 6, or 8 bytes depending on the magnitude of the value. PostgreSQL offers fixed-size integers for more granular control over storage and performance.                                                                                  |
| **Auto-incrementing Integer**   | `INTEGER PRIMARY KEY`                   | `SMALLSERIAL` (2 bytes)<br />`SERIAL` (4 bytes)<br />`BIGSERIAL` (8 bytes)              | In SQLite, declaring a column as `INTEGER PRIMARY KEY` automatically makes it an alias for the `rowid` and thus auto-incrementing. PostgreSQL provides the `SERIAL` pseudo-types, which create a sequence object to generate unique identifiers.                                                                          |
| **Floating-Point**              | `REAL`                                  | `REAL` (4 bytes)<br />`DOUBLE PRECISION` (8 bytes)                                      | SQLite's `REAL` is an 8-byte IEEE floating-point number. PostgreSQL offers both single-precision (`REAL`) and double-precision (`DOUBLE PRECISION`) floating-point numbers.                                                                                                                                               |
| **Arbitrary Precision Numeric** | `NUMERIC`                               | `NUMERIC(precision, scale)`<br />`DECIMAL(precision, scale)`                            | SQLite's `NUMERIC` affinity will attempt to store data as `INTEGER` or `REAL`, or as `TEXT` if it cannot be losslessly converted. PostgreSQL's `NUMERIC` and `DECIMAL` types are for exact decimal arithmetic, crucial for financial and scientific applications, allowing for user-defined precision and scale.          |
| **String**                      | `TEXT`<br />`VARCHAR(n)`<br />`CHAR(n)` | `TEXT`<br />`VARCHAR(n)`<br />`CHAR(n)`                                                 | While both databases accept these type names, in SQLite, they all have a `TEXT` affinity. The length `(n)` is not enforced in SQLite. In PostgreSQL, `VARCHAR(n)` enforces a maximum length, and `CHAR(n)` is a fixed-length, blank-padded string. `TEXT` in PostgreSQL has no predefined length limit.                   |
| **Binary Data**                 | `BLOB`                                  | `BYTEA`                                                                                 | Both are used for storing raw binary data.                                                                                                                                                                                                                                                                                |
| **Date & Time**                 | `TEXT`<br />`REAL`<br />`INTEGER`       | `DATE`<br />`TIME`<br />`TIMESTAMP`<br />`TIMESTAMPTZ` (with time zone)<br />`INTERVAL` | SQLite has no dedicated date/time storage class; they are typically stored as `TEXT` (ISO-8601 strings), `REAL` (Julian day numbers), or `INTEGER` (Unix timestamps). PostgreSQL provides a rich set of specific date and time types with built-in functions for complex date and time arithmetic and time zone handling. |
| **Boolean**                     | `INTEGER` (0 for false, 1 for true)     | `BOOLEAN`                                                                               | SQLite does not have a native boolean type and commonly uses `INTEGER` with values 0 and 1. PostgreSQL has a dedicated `BOOLEAN` type that stores `true` or `false`.                                                                                                                                                      |
| **JSON**                        | `TEXT`                                  | `JSON`<br />`JSONB`                                                                     | In SQLite, JSON data is stored as `TEXT`. PostgreSQL offers two dedicated JSON types: `JSON` for storing the raw JSON text and `JSONB` for a decomposed binary format that is more efficient for indexing and querying.                                                                                                   |
| **Unique Identifier**           | -                                       | `UUID`                                                                                  | PostgreSQL has a dedicated `UUID` data type for storing Universally Unique Identifiers, which is not present in SQLite.                                                                                                                                                                                                   |
| **Array**                       | -                                       | `data_type[]`                                                                           | PostgreSQL supports arrays of any built-in or user-defined data type, a powerful feature for storing lists of values in a single column. SQLite does not have a native array type.                                                                                                                                        |

## Create a sample SQLite database (Optional)

If you don't have a database to migrate, you can create a sample database for this tutorial. This requires the `sqlite3` command-line tool, typically pre-installed on macOS and Linux.

1.  Create a file named `seed.sql`. This schema defines `authors` and `books` tables, including a `published_date` column stored as `TEXT` to demonstrate type casting.

    ```sql title="seed.sql"
    -- Create the authors table
    CREATE TABLE authors (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        bio TEXT
    );

    -- Create the books table
    CREATE TABLE books (
        id INTEGER PRIMARY KEY,
        author_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        published_date TEXT,
        rating REAL,
        FOREIGN KEY (author_id) REFERENCES authors (id)
    );

    -- Insert sample data
    INSERT INTO authors (id, name, bio) VALUES
    (1, 'George Orwell', 'Author of dystopian classics.'),
    (2, 'J.R.R. Tolkien', 'Author of high-fantasy epics.'),
    (3, 'Jane Austen', 'Renowned for her romantic fiction.');

    INSERT INTO books (author_id, title, published_date, rating) VALUES
    (1, '1984', '1949-06-08', 4.8),
    (1, 'Animal Farm', '1945-08-17', 4.5),
    (2, 'The Hobbit', '1937-09-21', 4.9),
    (2, 'The Lord of the Rings', '1954-07-29', 5.0),
    (3, 'Pride and Prejudice', '1813-01-28', 4.7);
    ```

2.  Create the SQLite database `sample_library.db` from the schema file:

    ```shell
    sqlite3 sample_library.db < seed.sql
    ```

You now have a `sample_library.db` file ready for migration.

<Admonition type="note" title="Using Turso?">
If you're using Turso, you can dump your database to a SQL file using the [Turso CLI](https://docs.turso.tech/cli/introduction) and then follow the rest of this guide:

```shell
turso db shell <database-name> .dump > seed.sql

# Generate a SQLite database file from the SQL dump
sqlite3 sample_library.db < seed.sql
```

For more details on database dumps, see the [Turso CLI documentation](https://docs.turso.tech/cli/db/shell#database-dump).
</Admonition>

Now that you have your Neon database and SQLite database ready, you can use `pgloader` to migrate the data. Follow these steps:

<Steps>

## Retrieve your Neon database connection string

Log in to the Neon Console. Find the connection string for your database by clicking the **Connect** button on your **Project Dashboard**. It should look similar to this:

```bash shouldWrap
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
```

<Admonition type="important">
You will need to remove `&channel_binding=require` from the connection string, as `pgloader` does not support channel binding and throws an error when it is present.
</Admonition>

Now, modify this connection string to pass your **endpoint ID** (`ep-cool-darkness-123456` in this example) to Neon with your password using the `endpoint` keyword, as shown here:

```bash shouldWrap
postgresql://alex:endpoint=ep-cool-darkness-123456;AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
```

<Admonition type="note">
Passing the `endpoint ID` with your password is a required workaround for some Postgres drivers, including the one used by `pgloader`. For more information, see [Connect with an endpoint ID](/docs/connect/connection-errors#d-specify-the-endpoint-id-in-the-password-field).
</Admonition>

Keep your modified Neon connection string handy.

## Install pgloader

Install the `pgloader` utility using your preferred method:

- For **macOS** with Homebrew: `brew install pgloader`
- For **Debian/Ubuntu**: `sudo apt-get install pgloader`
- For **Docker**: Pull the latest image with `docker pull dimitri/pgloader:latest`

For other systems, see [Installing pgloader](https://pgloader.readthedocs.io/en/latest/install.html).

## Run a simple migration

For a basic migration, you can run `pgloader` directly from the command line. This command uses `pgloader`'s default settings to migrate the `sample_library.db` schema and data.

```shell shouldWrap
pgloader sqlite://sample_library.db "postgresql://alex:endpoint=ep-cool-darkness-123456;AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require"
```

> Make sure to enclose the Postgres connection string in quotes to prevent shell interpretation issues.

The command output will look similar to this:

```bash
2025-06-27T08:26:19.941000Z LOG report summary reset
             table name     errors       rows      bytes      total time
-----------------------  ---------  ---------  ---------  --------------
                  fetch          0          0                     0.000s
        fetch meta data          0          5                     0.204s
         Create Schemas          0          0                     0.108s
       Create SQL Types          0          0                     0.222s
          Create tables          0          4                     1.307s
         Set Table OIDs          0          2                     0.121s
-----------------------  ---------  ---------  ---------  --------------
                authors          0          3     0.1 kB          1.082s
                  books          0          5     0.2 kB          0.993s
-----------------------  ---------  ---------  ---------  --------------
COPY Threads Completion          0          4                     1.080s
 Index Build Completion          0          2                     2.342s
         Create Indexes          0          2                     0.662s
        Reset Sequences          0          0                     1.297s
           Primary Keys          0          2                     0.650s
    Create Foreign Keys          0          1                     0.339s
        Create Triggers          0          0                     0.211s
       Install Comments          0          0                     0.000s
-----------------------  ---------  ---------  ---------  --------------
      Total import time          ✓          8     0.3 kB          6.581s
```

This is quick, but it will create primary key columns as `bigint` rather than `serial`, and the `published_date` column will remain `text`. This is expected behavior, as `pgloader` uses SQLite's type affinities directly.

</Steps>

## Advanced migration with custom casting

For fine-grained control, a `pgloader` load file is the best approach. Here, we'll create a load file that uses the `CAST` clause to:

1.  Convert `INTEGER PRIMARY KEY` columns to `SERIAL`. This makes the Postgres schema cleaner and more idiomatic.
2.  Cast the `TEXT` `published_date` column to the native `DATE` type in Postgres.

Create a file named `sqlite_advanced.load` with the following content. Replace the Neon connection string and file path if necessary.

```sql title="sqlite_advanced.load"
LOAD DATABASE
    FROM sqlite://sample_library.db
    INTO postgresql://alex:endpoint=ep-cool-darkness-123456;AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require

WITH
    include drop,
    create tables,
    create indexes,
    reset sequences,
    downcase identifiers

CAST
    -- Cast specific primary key columns to SERIAL for auto-incrementing
    column authors.id to serial,
    column books.id to serial,

    -- Cast text column to date; pgloader handles ISO 8601 format ('YYYY-MM-DD') automatically
    column books.published_date to date;
```

Now, run the migration using this advanced load file:

```shell
pgloader sqlite_advanced.load
```

The migration will now produce a more refined Postgres schema, with `SERIAL` primary keys and a proper `DATE` column.

## Post-migration verification

After migrating, always verify your data. One critical area is auto-incrementing primary keys.

### Verify sequences

The `reset sequences` option in the load file ensures that auto-incrementing columns start from the correct value. You can verify this manually.

Connect to your Neon database using [`psql`](/docs/connect/query-with-psql-editor) or [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) and check the next value for the `books` table's sequence:

```sql
SELECT nextval(pg_get_serial_sequence('books', 'id'));
```

This should return a value one higher than the max `id` in the `books` table (e.g., `6` for our sample data). If it doesn't, you can reset it manually with this command:

```sql
SELECT setval(
    pg_get_serial_sequence('books', 'id'),
    (SELECT MAX(id) FROM books) + 1
);
```

## Troubleshooting

### SSL verify error with Docker

If you run `pgloader` from a Docker container and encounter an `SSL verify error: 20 X509_V_ERR_UNABLE_TO_GET_ISSUER_CERT_LOCALLY`, you may need to disable SSL certificate verification.

Modify your load file to set `sslmode=allow` in the Postgres connection string.

```sql title="sqlite_advanced.load"
LOAD DATABASE
    FROM sqlite:////data/sample_library.db
    INTO postgresql://.../dbname?sslmode=allow;
...
```

Then, run the Docker command with the `--no-ssl-cert-verification` flag. Mount your database and load files into the container's `/data` directory.

```shell
docker run --rm -v /path/to/your/files:/data
  dimitri/pgloader:latest
  pgloader --no-ssl-cert-verification /data/sqlite_advanced.load
```

## References

- [pgloader Documentation](https://pgloader.readthedocs.io/en/latest/)
- [pgloader Reference: SQLite to Postgres](https://pgloader.readthedocs.io/en/latest/ref/sqlite.html)
- [pgloader CLI Reference](https://pgloader.readthedocs.io/en/latest/pgloader.html)
