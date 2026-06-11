---
title: 'Neon CLI command: psql'
subtitle: Connect to a Neon database via psql
summary: >-
  Covers the usage of the `psql` command in the Neon CLI to open a psql session
  against a branch in your Neon project, including pooled connections and
  time-travel support.
enableTableOfContents: true
updatedOn: '2026-06-11T23:50:21.258Z'
redirectFrom:
  - /docs/reference/cli-psql
---

The `psql` command connects to a database in your Neon project using the `psql` client. It builds a connection string for the specified branch (or the default branch from your [context file](/docs/cli/set-context)) and launches `psql`, equivalent to running [`neonctl connection-string --psql`](/docs/cli/connection-string) as a dedicated top-level command. Requires neonctl 2.22.2 or later. Check your version with `neonctl --version`.

## Usage

<CliUsage command="psql" />

The `[branch]` is the branch name or ID. If omitted, the default branch from your context (or the project's default branch) is used. You can also use the point-in-time format `branch@timestamp` or `branch@lsn` for [time travel](/docs/guides/time-travel-assist) connections. Arguments after `--` are forwarded to `psql`.

## Options

<CliOptions command="psql" />

`neonctl psql` uses the native `psql` binary from your `$PATH` if one is available, and otherwise falls back to a built-in TypeScript implementation, so no PostgreSQL client tools installation is required. The built-in implementation is a full port, not a simplified subset: it supports SCRAM-SHA-256 authentication, backslash commands (`\d`, `\dt`, `\d+`, etc.), tab completion, command history, and COPY. It's verified against Postgres 14 through 18.

To force the built-in implementation in CI or other environments where native `psql` is present but you want consistent behavior, set `NEONCTL_PSQL_FALLBACK=1`.

## Examples

- Connect to the default branch:

  ```bash
  neonctl psql
  ```

- Connect to a named branch. New Neon projects create a default branch named `production`:

  ```bash
  neonctl psql production
  ```

- Run a single query:

  ```bash
  neonctl psql production -- -c "SELECT version()"
  ```

- Run an SQL file:

  ```bash
  neonctl psql production -- -f dump.sql
  ```

- Connect to a branch at a specific point in time:

  ```bash
  neonctl psql production@2024-01-01T00:00:00Z
  ```

- Use a pooled connection:

  ```bash
  neonctl psql --pooled
  ```
