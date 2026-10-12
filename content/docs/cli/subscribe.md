---
title: 'Neon CLI command: subscribe'
subtitle: Subscribe to a live SQL query with Neon Realtime
summary: >-
  The Neon CLI `neon subscribe` command subscribes to a live SQL query with
  Neon Realtime and prints the result every time it changes. Pass --changes to
  print raw reset and transaction batch events instead, and use --output json
  or yaml for machine-readable events. It runs until interrupted.
enableTableOfContents: true
---

The `subscribe` command subscribes to a live SQL query with [Neon Realtime](/docs/realtime/overview) and prints the result every time the data changes. It's a quick way to test a query from your terminal before you build it into an app. For a guided walkthrough, see the [Realtime quickstart](/docs/realtime/quickstart).

Realtime must be enabled on the branch: run [`neon realtime enable`](/docs/cli/realtime#enable) first. `neon subscribe` fetches the branch's `DATABASE_URL`, `NEON_REALTIME_URL` and `NEON_REALTIME_SECRET` from the Neon API, the same values [`neon env pull`](/docs/cli/env#pull) writes, and takes the database name from `DATABASE_URL`. It then subscribes through the Realtime API, so you don't need to set any env vars or pull a `.env` file first. If Realtime is still provisioning, it waits until it's ready.

## Usage

<CliUsage command="subscribe" />

Quote the query so your shell passes it as one argument. Without `--project-id` or `--branch`, the command uses the project and branch from your [context file](/docs/cli/link) (`.neon`), or your only project and its default branch.

## Options

<CliOptions command="subscribe" />

By default, `neon subscribe` prints the full query result when it starts, and again after every change. Pass `--changes` to see what Realtime sends instead: a reset event with the full set of rows, then a batch event each time the result changes, listing its transaction IDs and the rows upserted or removed.

The global `--output` (`-o`) option sets the format:

- `table` (the default) prints a table per event, separated by a blank line.
- `json` prints newline-delimited JSON, one event per line, which suits scripts and agents.
- `yaml` prints one YAML document per event.

The subscription runs until you interrupt it, for example with `Ctrl+C`. If the subscription fails, the command prints the error and exits with a non-zero code.

## Examples

Print the full result whenever it changes:

```bash
neon subscribe "SELECT * FROM items"
```

Print raw reset and batch events:

```bash
neon subscribe --changes "SELECT * FROM items"
```

Print newline-delimited JSON events for a specific branch:

```bash
neon subscribe -o json --branch dev "SELECT * FROM items"
```
