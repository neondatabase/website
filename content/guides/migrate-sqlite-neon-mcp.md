---
title: 'Migrate from SQLite to Neon Postgres with AI coding agents and the Neon MCP Server'
subtitle: 'Drive the migration from an AI coding agent like Claude Code, Cursor, or Codex: provision, load with pgloader, and verify through prompts.'
author: rishi-raj-jain
enableTableOfContents: true
createdAt: '2026-09-08T00:00:00.000Z'
updatedOn: '2026-09-08T14:32:21.747Z'
---

Learn how to migrate a SQLite database to Neon Postgres with an AI coding agent through the [Neon MCP Server](https://github.com/neondatabase/mcp-server-neon). The agent creates the project, returns a connection string, generates the [pgloader](https://pgloader.readthedocs.io/en/latest/intro.html) load file, runs the migration, and checks the result.

The agent uses MCP tool calls to provision and inspect the database, and spawns a terminal to run pgloader for the data transfer. pgloader streams rows over a direct Postgres connection and applies the required type casts for the SQLite migration.

<Admonition type="important" title="Security">
The Neon MCP Server can create and delete Neon resources. Review and authorize each action the agent proposes before it runs. Learn more in our [MCP security guidance](/docs/ai/neon-mcp-server#mcp-security-guidance).
</Admonition>

## Migration overview

| Step                                    | Who does it             | How                                                  |
| :-------------------------------------- | :---------------------- | :--------------------------------------------------- |
| Create the project and database         | Agent, via MCP          | `create_project`                                     |
| Get the connection string               | Agent, via MCP          | `get_connection_string`                              |
| Generate the load file and run pgloader | Agent, via its terminal | pgloader over a direct connection                    |
| Verify tables, types, and sequences     | Agent, via MCP          | `run_sql`, `get_database_tables`, `inspect_database` |

For the full tool list, see the [Neon MCP Server docs](/docs/ai/neon-mcp-server).

## Prerequisites

- A Neon account
- An MCP-capable AI client such as Claude Code, Cursor, Codex, or Windsurf

## Install pgloader

[pgloader](https://github.com/dimitri/pgloader) is an open-source data-loading tool that migrates a database into Postgres in a single command, applying type casts as it streams the rows.

<Tabs labels={["pgloader v4 (JDBC)", "pgloader < v4 (Lisp)"]}>

<TabItem>

The v4 build from [dimitri/pgloader](https://github.com/dimitri/pgloader) comes as a Java jar and runs on any machine with a JVM. Check the version with:

```shell
java -jar pgloader.jar --version
```

It reports `pgloader v4`. Invoke every pgloader command as `java -jar pgloader.jar ...`. Because it connects through the PostgreSQL JDBC driver, it sends the endpoint over SNI, which changes how you prepare the connection string.

</TabItem>

<TabItem>

The classic build is the Lisp pgloader from [dimitri/pgloader](https://github.com/dimitri/pgloader). On macOS, install it with Homebrew:

```shell
brew install pgloader
```

On Debian or Ubuntu:

```shell
sudo apt-get install pgloader
```

For other platforms and build-from-source instructions, see the [pgloader installation docs](https://pgloader.readthedocs.io/en/latest/install.html). Check the version with:

```shell
pgloader --version
```

It reports a `3.x` version. Invoke every pgloader command as `pgloader ...`. Its Postgres driver does not send SNI, which changes how you prepare the connection string.

</TabItem>

</Tabs>

To learn how pgloader handles SQLite specifically, see the [pgloader SQLite reference](https://pgloader.readthedocs.io/en/latest/ref/sqlite.html).

## Connect the Neon MCP Server

The easiest way to setup Neon MCP Server in an AI coding agent is via [`neon init`](/docs/cli/init). It links a Neon project and configures the MCP server for your client:

```bash
npx neon@latest init
```

Start a new session to trigger the OAuth flow, or run `/mcp` to authenticate. For other clients and API-key authentication, see the [Neon MCP Server docs](/docs/ai/neon-mcp-server).

## Create a sample SQLite database (optional)

If you want to try the migration on a sample database first, use the schema below. It uses `INTEGER PRIMARY KEY` columns and stores dates, a boolean, and JSON in `TEXT` and `INTEGER` columns, so it covers the casts pgloader does not apply automatically. For the full type mapping, see [Understanding SQLite and Postgres data types](/docs/import/migrate-sqlite#understanding-sqlite-and-postgres-data-types).

```sql filename="seed.sql"
CREATE TABLE authors (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    bio TEXT
);

CREATE TABLE books (
    id INTEGER PRIMARY KEY,
    author_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    published_date TEXT,
    rating REAL,
    in_stock INTEGER DEFAULT 1,
    price NUMERIC,
    metadata TEXT,
    created_at TEXT,
    FOREIGN KEY (author_id) REFERENCES authors (id)
);

INSERT INTO authors (id, name, bio) VALUES
(1, 'George Orwell', 'Author of dystopian classics.'),
(2, 'J.R.R. Tolkien', 'Author of high-fantasy epics.'),
(3, 'Jane Austen', 'Renowned for her romantic fiction.');

INSERT INTO books (author_id, title, published_date, rating, in_stock, price, metadata, created_at) VALUES
(1, '1984', '1949-06-08', 4.8, 1, 19.99, '{"genre":"dystopian","pages":328}', '2024-01-15 09:30:00'),
(1, 'Animal Farm', '1945-08-17', 4.5, 0, 14.50, '{"genre":"satire","pages":112}', '2024-02-20 14:00:00'),
(2, 'The Hobbit', '1937-09-21', 4.9, 1, 24.00, '{"genre":"fantasy","pages":310}', '2024-03-01 11:15:00'),
(2, 'The Lord of the Rings', '1954-07-29', 5.0, 1, 39.99, '{"genre":"fantasy","pages":1178}', '2024-03-05 16:45:00'),
(3, 'Pride and Prejudice', '1813-01-28', 4.7, 0, 12.99, '{"genre":"romance","pages":432}', '2024-04-10 08:00:00');
```

Ask the agent to write both files and build the database:

```bash shouldWrap filename="Prompt"
Save this schema as seed.sql, then run "sqlite3 sample_library.db < seed.sql" to create the SQLite file.
```

The agent writes the file and runs the command through its terminal. To do it yourself instead:

```shell
sqlite3 sample_library.db < seed.sql
```

With pgloader installed and the MCP server connected, let's start the migration process.

<Steps>

## Create the Neon project

Prompt your agent:

```bash shouldWrap filename="Prompt"
Create a new Neon project named sqlite-migration and tell me the project ID.
```

The agent calls `create_project` and waits until the compute is ready. It reports the project ID, which you can pass to later prompts if you have more than one project.

## Prepare the connection string

Let the agent adjust the string for you. Prompt:

```bash shouldWrap filename="Prompt"
Give me the connection string for the sqlite-migration project, then adjust it for pgloader: use the direct host by removing any -pooler suffix and remove &channel_binding=require. Check my pgloader version, and only if it is a build without SNI support (classic pgloader below v4) also move the endpoint ID into the password field using the endpoint keyword.
```

The agent calls `get_connection_string` and returns the string already transformed. The tool returns a pooled URI like this:

```bash shouldWrap
postgresql://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

It applies the following two changes:

- The `-pooler` suffix is removed from the host because pgloader should load over a direct connection instead of through the pooler
- Channel binding is removed because pgloader does not support it.

The third change though, whether the endpoint ID is used in the password, depends on your pgloader build:

<Tabs labels={["pgloader v4 (JDBC)", "pgloader < v4 (Lisp)"]}>

<TabItem>

The v4 build, invoked as `java -jar pgloader.jar`, connects through the PostgreSQL JDBC driver, which already sends the endpoint over SNI. Leave the endpoint out of the password and use the plain direct string:

```bash shouldWrap
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

If you move the endpoint into the password on this build, the `endpoint=...;` prefix becomes part of the password, and Neon's SCRAM authentication cannot strip it, so the connection fails with `password authentication failed`.

</TabItem>

<TabItem>

The classic Lisp build, installed with `brew install pgloader` or `apt-get install pgloader`, uses a Postgres driver that does not send SNI. Move the endpoint ID into the password field so Neon can route to the right compute. See [Connect with an endpoint ID](/docs/connect/connection-errors#d-specify-the-endpoint-id-in-the-password-field).

```bash shouldWrap
postgresql://alex:endpoint=ep-cool-darkness-123456;AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

If pgloader reports a parse error at the `;` in the load file, URL-encode the semicolon as `%3B`.

</TabItem>

</Tabs>

## Run the migration with pgloader

pgloader uses a load file to control the type casts. Instead of writing the casts yourself, let the agent read your SQLite schema and derive them. Prompt:

```bash shouldWrap filename="Prompt"
Inspect the schema of sample_library.db, then write a pgloader load file named sqlite.load that migrates it into this connection string: <paste the pgloader-ready string from the previous step>. Turn every INTEGER PRIMARY KEY into serial, cast date-only TEXT columns to date and datetime TEXT columns to timestamptz, cast INTEGER columns that hold 0/1 flags to boolean, and cast TEXT columns that hold JSON to jsonb. Include drop, create tables, create indexes, reset sequences, and downcase identifiers. Then run the load file with pgloader and show me the output.
```

The agent inspects the SQLite file, writes the load file, runs pgloader through its terminal, and reads back the result. The data streams directly from SQLite into Postgres.

The load file is identical across builds except for the `INTO` line:

<Tabs labels={["pgloader v4 (JDBC)", "pgloader < v4 (Lisp)"]}>

<TabItem>

The `INTO` line holds the plain direct string with no endpoint prefix:

```sql filename="sqlite.load"
LOAD DATABASE
    FROM sqlite://sample_library.db
    INTO postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require

WITH
    include drop,
    create tables,
    create indexes,
    reset sequences,
    downcase identifiers

CAST
    column authors.id to serial,
    column books.id to serial,
    column books.published_date to date,
    column books.created_at to timestamptz,
    column books.in_stock to boolean,
    column books.metadata to jsonb;
```

Run it with:

```shell
java -jar pgloader.jar sqlite.load
```

</TabItem>

<TabItem>

The `INTO` line holds the endpoint-in-password string:

```sql filename="sqlite.load"
LOAD DATABASE
    FROM sqlite://sample_library.db
    INTO postgresql://alex:endpoint=ep-cool-darkness-123456;AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require

WITH
    include drop,
    create tables,
    create indexes,
    reset sequences,
    downcase identifiers

CAST
    column authors.id to serial,
    column books.id to serial,
    column books.published_date to date,
    column books.created_at to timestamptz,
    column books.in_stock to boolean,
    column books.metadata to jsonb;
```

Run it with:

```shell
pgloader sqlite.load
```

</TabItem>

</Tabs>

The `price` column has no cast because pgloader already maps a SQLite `NUMERIC` column to Postgres `numeric`. Forcing `column books.price to numeric` makes the load fail, so leave numeric columns uncast.

pgloader creates the tables, loads the rows, builds indexes, and resets the sequences. Check the summary it prints for the row counts. For casting options, see the [pgloader SQLite reference](https://pgloader.readthedocs.io/en/latest/ref/sqlite.html).

## Verify the migration

Now, use the following prompts to verify the migration results.

1. Confirm the tables and row counts:

```bash shouldWrap filename="Prompt"
List the tables in the sqlite-migration project and give me the row count for authors and books.
```

The agent uses `get_database_tables` and `run_sql` tools from the Neon MCP Server.

2. Confirm the casts landed:

```bash shouldWrap filename="Prompt"
Show the column types for the books table. I expect id to be an integer with a sequence default, published_date a date, created_at a timestamp with time zone, in_stock a boolean, metadata a jsonb, and price a numeric.
```

The agent uses `inspect_database` or a `run_sql` query against `information_schema`.

3. Confirm the sequence is set past the existing data, so the next insert does not collide:

```bash shouldWrap filename="Prompt"
Run SELECT nextval(pg_get_serial_sequence('books', 'id')) and tell me if it is higher than the current max id. If the books id sequence is behind the max id, reset it with setval so the next insert does not collide.
```

The agent checks the sequence and, if it is behind, runs the reset through `run_sql`:

```sql
SELECT setval(
    pg_get_serial_sequence('books', 'id'),
    (SELECT MAX(id) FROM books)
);
```

</Steps>

## References

- [Neon MCP Server docs](/docs/ai/neon-mcp-server)
- [Neon MCP Server on GitHub](https://github.com/neondatabase/mcp-server-neon)
- [`neon init` CLI command](/docs/cli/init)
- [pgloader documentation](https://pgloader.readthedocs.io/en/latest/) and the [SQLite reference](https://pgloader.readthedocs.io/en/latest/ref/sqlite.html)
