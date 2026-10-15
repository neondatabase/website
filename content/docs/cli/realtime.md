---
title: 'Neon CLI command: realtime'
subtitle: Manage Neon Realtime and subscribe to live queries from the CLI
summary: >-
  The Neon CLI `neon realtime` command manages Neon Realtime on a database
  branch. Use `enable` to provision Realtime and set the browser origins allowed
  to connect, `rotate-secret` to replace its shared secret, `disable` to remove
  it, and `subscribe` to stream a live SQL query.
enableTableOfContents: true
updatedOn: '2026-10-15T00:31:32.385Z'
redirectFrom:
  - /docs/cli/subscribe
---

The `realtime` command enables and disables [Neon Realtime](/docs/realtime/overview) on a branch, rotates its shared secret, and subscribes to live queries. Once Realtime is on, you can stream a live SQL query's results with `neon realtime subscribe`, and [`neon env pull`](/docs/cli/env) writes the branch's `NEON_REALTIME_URL` and `NEON_REALTIME_SECRET` to your `.env`. To manage Realtime declaratively instead, add it to your `neon.ts` with [`neon config add realtime`](/docs/cli/config#add-realtime).

<CliSubcommands command="realtime" />

If `--project-id` is omitted, the CLI reads it from your [context file](/docs/cli/link) or auto-selects your only project. If `--branch` is omitted, it uses the context file's branch, or the project's default branch.

## neon realtime enable (#enable)

Requests Realtime provisioning for a branch. Provisioning finishes in the background, usually within a few seconds. Run it again on a branch that already has Realtime to replace its allowed origins with the ones you pass. Without `--allowed-origin`, a re-run keeps the existing origins.

<CliUsage command="realtime enable" />

<CliOptions command="realtime enable" />

`--allowed-origin` sets the browser origins allowed to connect. Repeat the flag for each origin, up to 16. Each value must be `*`, which allows every origin, or an `http` or `https` origin with no path, query, or fragment, such as `https://app.example.com`. `*` can't be combined with other origins. The CLI checks the values before it sends the request.

By default, any browser origin can connect. Pass `--allowed-origin` to limit connections to the origins you list. A new branch starts with its parent's list. Child branches created from a Realtime-enabled branch have Realtime enabled automatically. A new list can take about a minute to apply after the change finishes. Allowed origins only restrict browsers: a client that sends no `Origin` header, such as a server, can connect either way.

```bash
neon realtime enable --allowed-origin https://app.example.com --allowed-origin http://localhost:3000
```

```text
Realtime enable requested for branch br-cool-darkness-123456.
```

## neon realtime disable (#disable)

Requests Realtime deprovisioning for a branch.

<CliUsage command="realtime disable" />

<CliOptions command="realtime disable" />

```bash
neon realtime disable
```

```text
Realtime disable requested for branch br-cool-darkness-123456.
```

Disabling also discards the branch's Realtime secret, so apps using that branch's `NEON_REALTIME_SECRET` stop working. If you enable Realtime again later, the branch gets a new secret, so pull the env vars again.

After you disable Realtime, `neon realtime subscribe` on that branch fails with an error that points you back to `neon realtime enable`.

## neon realtime rotate-secret (#rotate-secret)

Requests replacement of a branch's Realtime shared secret. Rotation finishes in the background. The existing secret keeps working while the change is pending and stops working after the new secret is active.

<CliUsage command="realtime rotate-secret" />

<CliOptions command="realtime rotate-secret" />

```bash
neon realtime rotate-secret
```

```text
Realtime secret rotation requested for branch br-cool-darkness-123456.
```

The command doesn't print the new secret. Run `neon env pull --service realtime` after requesting rotation. The env pull waits for the pending change to finish, then writes the new `NEON_REALTIME_SECRET` to your env file. Update every backend that seals Realtime queries with the old secret.

Each successful `rotate-secret` request replaces the secret again, so don't repeat the command unless you intend to start another rotation.

## neon realtime subscribe (#subscribe)

Runs a `SELECT` query as a live subscription and prints its results as they change. Use it to watch a table while you develop, or to check what a Realtime client would receive. For a guided walkthrough, see the [Realtime quickstart](/docs/realtime/quickstart). The branch needs Realtime enabled first: run `neon realtime enable`, or declare it in `neon.ts` with [`neon config add realtime`](/docs/cli/config#add-realtime) and apply.

<CliUsage command="realtime subscribe" />

<CliOptions command="realtime subscribe" />

The CLI resolves the branch's Realtime URL, secret, and database name for you, the same values [`neon env pull`](/docs/cli/env) writes, so you don't need a `.env` file first. If Realtime is still provisioning, it waits until it's ready. Quote the query so your shell passes it as one argument. If `--project-id` is omitted, it reads it from your [context file](/docs/cli/link) or auto-selects your only project. If `--branch` is omitted, it uses the context file's branch, or the project's default branch.

The subscription runs until you press Ctrl+C, or until the server closes it or reports an error.

### Output

The default table output is an append-only log, so it doesn't take over your terminal. It opens with a header naming the project, branch, database, mode, and query, then prints:

- The initial result once, as a table.
- One entry per transaction, labeled with its transaction ID and a `+inserted ~updated -deleted` count, listing each changed row with its change type. A deleted row shows its last known values.
- Connection state changes, such as connecting, live, and stale.

Every entry starts with a UTC timestamp. The server can send a complete `rows` replacement instead of incremental `changes` at any point, and then `realtime subscribe` prints the full result again. Some queries, such as ones with `ORDER BY`, can get a complete replacement for a change.

With `--changes`, it prints the raw events instead: a `rows` event with the complete current result, each row carrying a row ID, followed by `changes` events that list each change's type (`upsert` or `remove`), row ID, and row. A `rows` event replaces the full row set and invalidates earlier row IDs.

With `--output json`, each event is one JSON object per line. With `--output yaml`, each event is a separate YAML document. Each event has a `type` of `snapshot` (the default mode), or `rows` or `changes` (with `--changes`). Machine-readable output carries only the events: the header and connection states are terminal-only.

### Examples

Print the initial result, then a log of each transaction:

```bash
neon realtime subscribe "SELECT * FROM items"
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

Print the raw `rows` and `changes` events:

```bash
neon realtime subscribe --changes "SELECT * FROM items"
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

[2026-10-13T13:48:41.461Z] Rows · 2 rows
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
neon realtime subscribe "SELECT * FROM items ORDER BY id" --output json
```

```json
{"type":"snapshot","rows":[{"id":1,"name":"apple"},{"id":2,"name":"banana"}]}
{"type":"snapshot","rows":[{"id":1,"name":"apple"},{"id":2,"name":"banana"},{"id":3,"name":"cherry"}]}
{"type":"snapshot","rows":[{"id":1,"name":"apple"},{"id":2,"name":"blueberry"},{"id":3,"name":"cherry"}]}
```
