---
title: Connect with pgcli
enableTableOfContents: true
isDraft: true
---

The following instructions require a working installation of [pgcli](https://www.pgcli.com/). Please refer to the [installation instructions](https://www.pgcli.com/install) in the _pgcli documentation_.

The `pgcli` is a command-line interface for PostgreSQL that offers several advantages over the traditional `psql` client, including syntax highlighting, autocompletion, multi-line editing, and query history.

## pgcli usage information

To view pgcli usage information, run `pgcli --help`:

```bash
$ pgcli --help
Usage: pgcli [OPTIONS] [DBNAME] [USERNAME]
Options:

  -h, --host TEXT            Host address of the postgres database.
  -p, --port INTEGER         Port number at which the postgres instance is
                             listening.
  -U, --username TEXT        Username to connect to the postgres database.
  -u, --user TEXT            Username to connect to the postgres database.
  -W, --password             Force password prompt.
  -w, --no-password          Never prompt for password.
  --single-connection        Do not use a separate connection for completions.
  -v, --version              Version of pgcli.
  -d, --dbname TEXT          database name to connect to.
  --pgclirc FILE             Location of pgclirc file.
  -D, --dsn TEXT             Use DSN configured into the [alias_dsn] section
                             of pgclirc file.
  --list-dsn                 list of DSN configured into the [alias_dsn]
                             section of pgclirc file.
  --row-limit INTEGER        Set threshold for row limit prompt. Use 0 to
                             disable prompt.
  --less-chatty              Skip intro on startup and goodbye on exit.
  --prompt TEXT              Prompt format (Default: "\u@\h:\d> ").
  --prompt-dsn TEXT          Prompt format for connections using DSN aliases
                             (Default: "\u@\h:\d> ").
  -l, --list                 list available databases, then exit.
  --auto-vertical-output     Automatically switch to vertical output mode if
                             the result is wider than the terminal width.
  --warn [all|moderate|off]  Warn before running a destructive query.
  --ssh-tunnel TEXT          Open an SSH tunnel to the given address and
                             connect to the database from it.
  --help                     Show this message and exit.
```

## Connecting to Neon with the pgcli client

The easiest way to connect to Neon using the `pgcli` client is with a connection string. You can obtain a connection string from the **Connection Details** widget on the **Neon Dashboard**. Select a branch, a role, and the database you want to connect to. A connection string is constructed for you.

![Connection details widget](/docs/connect/connection_details.png)

From your terminal or command prompt, run the `psql` client with the connection string copied from the Neon **Dashboard**. Your command will look something like this:

<CodeBlock shouldWrap>

```bash
$ pgcli postgres://<user>:<password>@ep-wispy-firefly-072347.us-west-2.aws.neon.tech/<dbname>
```

</CodeBlock>

## Running queries

After establishing a connection, try the `pgcli` client by running the following queries. To try the `pgcli` [autocompletion](https://www.pgcli.com/completion) feature, type the `SELECT` query.

```sql
CREATE TABLE my_table AS SELECT now();
SELECT * FROM my_table;
```

The following result is returned:

```sql
SELECT 1
+-------------------------------+
| now                           |
|-------------------------------|
| 2023-05-21 09:23:18.086163+00 |
+-------------------------------+
SELECT 1
Time: 0.116s
```

The `pgcli` [query history](https://www.pgcli.com/history) feature allows to you use **Up** and **Down** keys on your keyboard to navigate your query history.

The `pgcli` client also supports [named queries](https://www.pgcli.com/named_queries.md). To save a query, type:

```bash
\ns simple SELECT * FROM my_table;
```

To run a named query, type:

```bash
# Run a named query.
\n simple
> SELECT * FROM my_table
+-------------------------------+
| now                           |
|-------------------------------|
| 2023-05-21 09:23:18.086163+00 |
+-------------------------------+
SELECT 1
Time: 0.051s
```

For more information about `pgcli` features and capabilities, refer to the [pgcli documentation](https://www.pgcli.com/docs).

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
