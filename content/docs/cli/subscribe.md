---
title: 'Neon CLI command: subscribe'
subtitle: Stream a live SQL query's results from the terminal with Neon Realtime
summary: >-
  The Neon CLI `neon subscribe` command subscribes to a live SQL query with Neon
  Realtime and prints the initial result followed by a log of each transaction's
  changes, or the raw reset and transaction batch events with `--changes`. Output
  is a table, newline-delimited JSON, or YAML.
enableTableOfContents: true
updatedOn: '2026-10-13T14:12:17.432Z'
---

The `subscribe` command runs a `SELECT` query as a live subscription with Neon Realtime and prints its results as they change. Use it to watch a table while you develop, or to check what a Realtime client would receive. The branch needs Realtime enabled first: run [`neon realtime enable`](/docs/cli/realtime#enable), or declare it in `neon.ts` with [`neon config add realtime`](/docs/cli/config#add-realtime) and apply.

<Admonition type="comingSoon" title="Coming soon">
Neon Realtime isn't available yet. As of Neon CLI 8.4.1, the `realtime` and `subscribe` commands are included but stay hidden and print "Neon Realtime is coming soon!" until Realtime launches.
</Admonition>

## Usage

<CliUsage command="subscribe" />

## Options

<CliOptions command="subscribe" />

The CLI resolves the branch's Realtime URL, secret, and database name for you, the same values [`neon env pull`](/docs/cli/env) writes. If `--project-id` is omitted, it reads it from your [context file](/docs/cli/link) or auto-selects your only project. If `--branch` is omitted, it uses the context file's branch, or the project's default branch.

The subscription runs until you press Ctrl+C, or until the server closes it or reports an error.

## Output

The default table output is an append-only log, so it doesn't take over your terminal. It opens with a header naming the project, branch, database, mode, and query, then prints:

- The initial result once, as a table.
- One entry per transaction, labeled with its transaction ID and a `+inserted ~updated -deleted` count, listing each changed row with its change type. A deleted row shows its last known values.
- Connection state changes, such as connecting, live, and stale.

Every entry starts with a UTC timestamp. The server can send a reset instead of a transaction at any point, and then `subscribe` prints the full result again. Some queries, such as ones with `ORDER BY`, can get a reset instead of a transaction for a change.

With `--changes`, it prints the raw events instead: a reset with the current rows, each with a row ID, and then one batch per transaction listing each change's type (`upsert` or `remove`), row ID, and row. A reset replaces the full row set and invalidates earlier row IDs.

With `--output json`, each event is one JSON object per line. With `--output yaml`, each event is a separate YAML document. Each event has a `type` of `snapshot` (the default mode), or `reset` or `batch` (with `--changes`). Machine-readable output carries only the events: the header and connection states are terminal-only.

## Examples

Print the initial result, then a log of each transaction:

```bash
neon subscribe "SELECT * FROM items"
```

Here, a row is inserted, another is renamed, the new row is deleted, and then one transaction inserts a row and renames another:

<details>
<summary>Show output</summary>

```text
Live query
Project   cool-darkness-12345678
Branch    dev (br-small-cell-a1b2c3d4)
Database  neondb
Mode      Materialized result
Query     SELECT * FROM items
[2026-10-13T13:49:35.168Z] Connecting…

[2026-10-13T13:49:35.725Z] Initial snapshot · 2 rows
ID  Name
1   apple
2   banana
[2026-10-13T13:49:35.726Z] Live — waiting for changes.

[2026-10-13T13:49:42.349Z] Transaction 15379 · +1 ~0 -0
Change    ID  Name
+ insert  3   cherry

[2026-10-13T13:49:45.992Z] Transaction 15380 · +0 ~1 -0
Change    ID  Name
~ update  2   blueberry

[2026-10-13T13:49:49.636Z] Transaction 15381 · +0 ~0 -1
Change    ID  Name
- delete  3   cherry

[2026-10-13T13:49:53.284Z] Transaction 15382 · +1 ~1 -0
Change    ID  Name
+ insert  4   date
~ update  1   apricot
```

</details>

Print the raw reset and transaction batch events:

```bash
neon subscribe --changes "SELECT * FROM items"
```

Here, a row is inserted, updated, and then deleted, one transaction each:

<details>
<summary>Show output</summary>

```text
Live query
Project   cool-darkness-12345678
Branch    dev (br-small-cell-a1b2c3d4)
Database  neondb
Mode      Raw changes
Query     SELECT * FROM items
[2026-10-13T13:48:40.801Z] Connecting…

[2026-10-13T13:48:41.461Z] Reset · 2 rows
Row ID                                                            Row
97254c8a1b75b7e21a05f98973614ea5af20ae9f4d481389eddb304c9b331ecf  {"id":1,"name":"apple"}
3045adcead9109b462b3c0e501e1c78c48b6cdbeb28bd3d3e01b83a61eaee302  {"id":2,"name":"banana"}
[2026-10-13T13:48:41.462Z] Live — waiting for changes.

[2026-10-13T13:48:48.072Z] Transaction 15370 · 1 upsert, 0 removals
Type    Row ID                                                            Row
upsert  1257d5759a0894512f6859dd60b504e69cbf6f8d9d4d977ee9b3b396661928bf  {"id":3,"name":"cherry"}

[2026-10-13T13:48:51.750Z] Transaction 15371 · 1 upsert, 0 removals
Type    Row ID                                                            Row
upsert  3045adcead9109b462b3c0e501e1c78c48b6cdbeb28bd3d3e01b83a61eaee302  {"id":2,"name":"blueberry"}

[2026-10-13T13:48:55.376Z] Transaction 15372 · 0 upserts, 1 removal
Type    Row ID
remove  1257d5759a0894512f6859dd60b504e69cbf6f8d9d4d977ee9b3b396661928bf
```

</details>

Stream events as newline-delimited JSON, for example to pipe into another tool. Each event is a full snapshot of the result:

```bash
neon subscribe "SELECT * FROM items ORDER BY id" --output json
```

```json
{"type":"snapshot","rows":[{"id":1,"name":"apple"},{"id":2,"name":"banana"}]}
{"type":"snapshot","rows":[{"id":1,"name":"apple"},{"id":2,"name":"banana"},{"id":3,"name":"cherry"}]}
{"type":"snapshot","rows":[{"id":1,"name":"apple"},{"id":2,"name":"blueberry"},{"id":3,"name":"cherry"}]}
```
