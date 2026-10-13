---
title: 'Neon CLI command: subscribe'
subtitle: Stream a live SQL query's results from the terminal with Neon Realtime
summary: >-
  The Neon CLI `neon subscribe` command subscribes to a live SQL query with Neon
  Realtime and prints the full result each time it changes, or the raw reset and
  transaction batch events with `--changes`. Output is a table, newline-delimited
  JSON, or YAML.
enableTableOfContents: true
updatedOn: '2026-10-13T00:11:48.345Z'
---

The `subscribe` command runs a `SELECT` query as a live subscription with Neon Realtime and prints its results as they change. Use it to watch a table while you develop, or to check what a Realtime client would receive. The branch needs Realtime enabled first: run [`neon realtime enable`](/docs/cli/realtime#enable), or declare it in `neon.ts` with [`neon config add realtime`](/docs/cli/config#add-realtime) and apply.

<Admonition type="comingSoon" title="Coming soon">
Neon Realtime isn't available yet. The `realtime` and `subscribe` commands ship in Neon CLI 8.4.1 but stay hidden and print "Neon Realtime is coming soon!" until Realtime launches.
</Admonition>

## Usage

<CliUsage command="subscribe" />

## Options

<CliOptions command="subscribe" />

The CLI resolves the branch's Realtime URL, secret, and database name for you, the same values [`neon env pull`](/docs/cli/env) writes. If `--project-id` is omitted, it reads it from your [context file](/docs/cli/link) or auto-selects your only project. If `--branch` is omitted, it uses the context file's branch, or the project's default branch.

The subscription runs until you press Ctrl+C, or until the server closes it or reports an error.

## Output

By default, `subscribe` prints the full query result as a table when the subscription starts and again after every change. With `--changes`, it prints the raw events instead: a reset with the current rows, each with a row ID, and then one batch per transaction listing each change's type (`upsert` or `remove`), row ID, and row. The server can send a new reset at any point instead of a batch. A reset replaces the full row set and invalidates earlier row IDs.

With `--output json`, each event is one JSON object per line. With `--output yaml`, each event is a separate YAML document. Each event has a `type` of `snapshot` (the default mode), or `reset` or `batch` (with `--changes`).

## Examples

Print the full result whenever it changes. `ORDER BY` keeps the rows in a stable order between frames:

```bash
neon subscribe "SELECT * FROM items ORDER BY id"
```

Here, a row is inserted and then another is renamed while the subscription runs:

```text
Query result
ID  Name
1   apple
2   banana

Query result
ID  Name
1   apple
2   banana
3   cherry

Query result
ID  Name
1   apple
2   blueberry
3   cherry
```

Print the raw reset and transaction batch events:

```bash
neon subscribe --changes "SELECT * FROM items"
```

Here, a row is inserted, updated, and then deleted, one transaction each:

<details>
<summary>Show output</summary>

```text
Reset
Row ID                                                            Row
006722e9b9e49b81274c8805cc134836a9892ea5dbe86231a37d0c5915245761  {"id":3,"name":"cherry"}
3011f41a263e1f0f53e37c346ac80887d8d8f300b79048db6a7b56ddda623403  {"id":2,"name":"blueberry"}

Batch (txids: 1059)
Type    Row ID                                                            Row
upsert  e873de7799382fbeb7d09a5c320572c50ea7d2a9454244a19ea8a70ac09cbbb6  {"id":4,"name":"date"}

Batch (txids: 1060)
Type    Row ID                                                            Row
upsert  006722e9b9e49b81274c8805cc134836a9892ea5dbe86231a37d0c5915245761  {"id":3,"name":"cranberry"}

Batch (txids: 1061)
Type    Row ID
remove  e873de7799382fbeb7d09a5c320572c50ea7d2a9454244a19ea8a70ac09cbbb6
```

</details>

Stream events as newline-delimited JSON, for example to pipe into another tool:

```bash
neon subscribe "SELECT * FROM items ORDER BY id" --output json
```

```json
{"type":"snapshot","rows":[{"id":1,"name":"apple"},{"id":2,"name":"banana"}]}
{"type":"snapshot","rows":[{"id":1,"name":"apple"},{"id":2,"name":"banana"},{"id":3,"name":"cherry"}]}
```
