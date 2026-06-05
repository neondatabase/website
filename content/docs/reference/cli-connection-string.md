---
title: 'Neon CLI command: connection-string'
subtitle: Get Postgres connection strings for branches and databases
summary: >-
  The Neon connection string command (`neon connection-string`) outputs a
  PostgreSQL connection URL for a specified branch, role, and database,
  including the role password.
  Use it to get connection strings for psql, Prisma (--prisma), connection
  pooling (--pooled), read-only replicas (--endpoint-type read_only), or
  time-travel queries targeting a specific timestamp or LSN.
enableTableOfContents: true
updatedOn: '2026-06-05T12:06:47.985Z'
---

## Before you begin

- Before running the `connection-string` command, ensure that you have [installed the Neon CLI](/docs/reference/cli-install).
- If you have not authenticated with the [neon auth](/docs/reference/cli-auth) command, running a Neon CLI command automatically launches the Neon CLI browser authentication process. Alternatively, you can specify a Neon API key using the `--api-key` option when running a command. See [Connect](/docs/reference/neon-cli#connect).

For information about connecting to Neon, see [Connect from any application](/docs/connect/connect-from-any-app).

## The `connection-string` command

This command gets a Postgres connection string for connecting to a database in your Neon project. You can construct a connection string for any database in any branch. The connection string includes the password for the specified role.

<Admonition type="tip" title="Connect with psql">
To open a `psql` session directly, use the dedicated [`neon psql`](/docs/reference/cli-psql) command (requires neonctl 2.22.2+). You can also pass `--psql` to `connection-string` to achieve the same result.
</Admonition>

### Usage

```bash
neon connection-string [branch[@timestamp|@LSN]] [options]
```

`branch` specifies the branch name or ID. If a branch name or ID is omitted, the default branch is used. `@timestamp|@LSN` is used to specify a specific point in the branch's history for time travel connections. If omitted, the current state (HEAD) is used.

### Options

In addition to the Neon CLI [global options](/docs/reference/neon-cli#global-options), the `connection-string` command supports these options:

| Option            | Description                                                                                          | Type    |                      Required                       |
| ----------------- | ---------------------------------------------------------------------------------------------------- | ------- | :-------------------------------------------------: |
| `--context-file`  | [Context file](/docs/reference/cli-set-context#using-a-named-context-file) path and file name        | string  |                                                     |
| `--project-id`    | Project ID                                                                                           | string  | Only if your Neon account has more than one project |
| `--role-name`     | Role name                                                                                            | string  |     Only if your branch has more than one role      |
| `--database-name` | Database name                                                                                        | string  |   Only if your branch has more than one database    |
| `--pooled`        | Construct a pooled connection. The default is `false`.                                               | boolean |                                                     |
| `--prisma`        | Construct a connection string for use with Prisma. The default is `false`.                           | boolean |                                                     |
| `--endpoint-type` | The compute type. The default is `read-write`. The choices are `read_only` and `read_write`          | string  |                                                     |
| `--extended`      | Show extended information. The default is `false`.                                                   | boolean |                                                     |
| `--psql`          | Connect to a database via psql using connection string. `psql` must be installed to use this option. | boolean |                                                     |

### Examples

- Get a basic connection string for the current project, branch, and database:

  ```bash shouldWrap
  neon connection-string mybranch
  postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
  ```

- Get a pooled connection string for the current project, branch, and database with the `--pooled` option. This option adds a `-pooler` flag to the host name which enables connection pooling for clients that use this connection string.

  ```bash shouldWrap
  neon connection-string --pooled
  postgresql://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
  ```

- Get a connection string for use with Prisma for the current project, branch, and database. The `--prisma` options adds `connect_timeout=30` option to the connection string to ensure that connections from Prisma Client do not timeout.

  ```bash shouldWrap
  neon connection-string --prisma
  postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require&connect_timeout=30
  ```

- Get a connection string to a specific point in a branch's history by appending `@timestamp` or `@lsn`. Availability depends on your configured [history window](/docs/introduction/history-window).

  ```bash
  neon connection-string @2024-04-21T00:00:00Z
  ```

  For additional examples, see [How to use Time Travel](/docs/guides/time-travel-assist#how-to-use-time-travel).

- Get a connection string and connect with `psql`.

  ```bash
  neon connection-string --psql
  ```

- Get a connection string, connect with `psql`, and run an `.sql` file.

  ```bash
  neon connection-string --psql -- -f dump.sql
  ```

- Get a connection string, connect with `psql`, and run a query.

  ```bash
  neon connection-string --psql -- -c "SELECT version()"
  ```

<NeedHelp/>
