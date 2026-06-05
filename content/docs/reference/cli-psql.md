---
title: 'Neon CLI command: psql'
subtitle: Connect to a Neon database via psql
summary: >-
  Covers the usage of the `psql` command in the Neon CLI to open a psql session
  against a branch in your Neon project, including pooled connections and
  time-travel support.
enableTableOfContents: true
updatedOn: '2026-06-05T12:06:47.985Z'
---

## Before you begin

- Before running the `psql` command, ensure that you have [installed the Neon CLI](/docs/reference/cli-install).
- The `psql` command requires **neonctl 2.22.2** or later. Check your version with `neon --version`.
- The [`psql`](https://www.postgresql.org/docs/current/app-psql.html) client must be installed on your system.
- If you have not authenticated with the [neon auth](/docs/reference/cli-auth) command, running a Neon CLI command automatically launches the Neon CLI browser authentication process. Alternatively, you can specify a Neon API key using the `--api-key` option when running a command. See [Connect](/docs/reference/neon-cli#connect).

## The `psql` command

The `psql` command connects to a database in your Neon project using the `psql` client. It builds a connection string for the specified branch (or the default branch from your [context file](/docs/reference/cli-set-context)) and launches `psql`.

This is equivalent to running [`neon connection-string --psql`](/docs/reference/cli-connection-string), but as a dedicated top-level command.

### Usage

```bash
neon psql [branch] [options] [-- psql-args]
```

`branch` specifies the branch name or ID. If omitted, the default branch from your context (or the project's default branch) is used. You can also use the point-in-time format `branch@timestamp` or `branch@lsn` for [time travel](/docs/guides/time-travel-assist) connections.

Arguments after `--` are forwarded to `psql`.

### Options

In addition to the Neon CLI [global options](/docs/reference/neon-cli#global-options), the `psql` command supports these options:

| Option            | Description                                                                                 | Type    |                      Required                       |
| ----------------- | ------------------------------------------------------------------------------------------- | ------- | :-------------------------------------------------: |
| `--context-file`  | [Context file](/docs/reference/cli-set-context) path and file name                          | string  |                                                     |
| `--project-id`    | Project ID                                                                                  | string  | Only if your Neon account has more than one project |
| `--role-name`     | Role name                                                                                   | string  |     Only if your branch has more than one role      |
| `--database-name` | Database name                                                                               | string  |   Only if your branch has more than one database    |
| `--pooled`        | Use a pooled connection. The default is `false`.                                            | boolean |                                                     |
| `--endpoint-type` | The compute type. The default is `read_write`. The choices are `read_only` and `read_write` | string  |                                                     |
| `--ssl`           | SSL mode. The default is `require`.                                                         | string  |                                                     |

### Examples

Connect to the default branch:

```bash
neon psql
```

Connect to a named branch. New Neon projects create a default branch named `production`:

```bash
neon psql production
```

Run a single query:

```bash
neon psql production -- -c "SELECT version()"
```

Run an SQL file:

```bash
neon psql production -- -f dump.sql
```

Connect to a branch at a specific point in time:

```bash
neon psql production@2024-01-01T00:00:00Z
```

Use a pooled connection:

```bash
neon psql --pooled
```

<NeedHelp/>
