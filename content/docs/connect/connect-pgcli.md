---
title: Connect with pgcli
subtitle: Learn how to connect to Neon using the interactive pgcli client
enableTableOfContents: true
isDraft: false
updatedOn: '2025-02-03T20:41:57.299Z'
---

The `pgcli` client is an interactive command-line interface for Postgres that offers several advantages over the traditional `psql` client, including syntax highlighting, autocompletion, multi-line editing, and query history.

## Installation

For installation instructions, please refer to the `pgcli` [installation documentation](https://www.pgcli.com/install).

## Usage information

To view `pgcli` usage information, run the following command:

```bash
pgcli --help
```

## Connect to Neon

The easiest way to connect to Neon using the `pgcli` client is with a connection string, which you can obtain by clicking the **Connect** button on your **Project Dashboard** to open the **Connect to your database** modal. Select a branch, a role, and the database you want to connect to. A connection string is constructed for you.

![Connection details modal](/docs/connect/connection_details.png)

From your terminal or command prompt, run the `pgcli` client with the connection string. Your command will look something like this:

```bash shouldWrap
pgcli postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname
```

## Run queries

After establishing a connection, try the `pgcli` client by running the following queries. To test the `pgcli` [autocompletion](https://www.pgcli.com/completion) feature, type the `SELECT` query.

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

The `pgcli` [query history](https://www.pgcli.com/history) feature allows you to use the **Up** and **Down** keys on your keyboard to navigate your query history.

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

<NeedHelp/>
