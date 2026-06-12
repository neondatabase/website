---
title: 'Neon CLI command: connection-string'
subtitle: Get Postgres connection strings for branches and databases
summary: >-
  The Neon connection string command (`neonctl connection-string`) outputs a
  PostgreSQL connection URL for a specified branch, role, and database,
  including the role password.
  Use it to get connection strings for psql, Prisma (--prisma), connection
  pooling (--pooled), read-only replicas (--endpoint-type read_only), or
  time-travel queries targeting a specific timestamp or LSN.
enableTableOfContents: true
updatedOn: '2026-06-12T00:33:31.980Z'
redirectFrom:
  - /docs/reference/cli-connection-string
---

The `connection-string` command gets a Postgres connection string for any database on any branch in your Neon project. The connection string includes the password for the specified role. For information about connecting to Neon, see [Connect from any application](/docs/connect/connect-from-any-app).

<Admonition type="tip" title="Connect with psql">
To open a `psql` session directly, use the dedicated [`neonctl psql`](/docs/cli/psql) command (requires neonctl 2.22.2+). You can also pass `--psql` to `connection-string` to achieve the same result.
</Admonition>

## Usage

<CliUsage command="connection-string" />

The `[branch]` is the branch name or ID. If omitted, the default branch is used. To connect to a specific point in the branch's history, use the point-in-time format `branch@timestamp` or `branch@lsn`. If no timestamp or LSN is appended, the current state (HEAD) is used.

## Options

<CliOptions command="connection-string" />

The `--endpoint-type` value can be `read_write` (the default) or `read_only`. The `--psql` option doesn't require a psql installation: if `psql` isn't on your `$PATH`, the CLI uses a built-in TypeScript implementation. To save your project context to a file and avoid repeating `--project-id`, see [Using a named context file](/docs/cli/set-context#using-a-named-context-file).

## Examples

Get a connection string for a branch:

```bash
neonctl connection-string mybranch
```

```text filename="Output" shouldWrap
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

- Get a pooled connection string. The `--pooled` option adds a `-pooler` suffix to the host name, which enables connection pooling for clients that use this connection string.

  ```bash
  neonctl connection-string --pooled
  ```

  ```text shouldWrap
  postgresql://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
  ```

- Get a connection string for use with Prisma. The `--prisma` option adds `connect_timeout=30` to the connection string so that connections from Prisma Client don't time out.

  ```bash
  neonctl connection-string --prisma
  ```

  ```text shouldWrap
  postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require&connect_timeout=30
  ```

- Get a connection string to a specific point in a branch's history by appending `@timestamp` or `@lsn`. Availability depends on your configured [history window](/docs/introduction/history-window). For additional examples, see [How to use Time Travel](/docs/guides/time-travel-assist#how-to-use-time-travel).

  ```bash
  neonctl connection-string @2024-04-21T00:00:00Z
  ```

Get a connection string and connect with `psql`:

```bash
neonctl connection-string --psql
```

Get a connection string, connect with `psql`, and run an `.sql` file:

```bash
neonctl connection-string --psql -- -f dump.sql
```

Get a connection string, connect with `psql`, and run a query:

```bash
neonctl connection-string --psql -- -c "SELECT version()"
```
