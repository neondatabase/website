---
title: 'Neon CLI command: realtime'
subtitle: Manage Neon Realtime and subscribe to live queries from the CLI
summary: >-
  The Neon CLI `neon realtime` command enables and disables Neon Realtime on a
  database branch and subscribes to live SQL queries.
enableTableOfContents: true
updatedOn: '2026-10-14T02:37:05.711Z'
---

The `realtime` command enables and disables [Neon Realtime](/docs/realtime/overview) on a branch. Once Realtime is on, you can stream a live SQL query's results with [`neon realtime subscribe`](/docs/cli/subscribe), and [`neon env pull`](/docs/cli/env) writes the branch's `NEON_REALTIME_URL` and `NEON_REALTIME_SECRET` to your `.env`. To manage Realtime declaratively instead, add it to your `neon.ts` with [`neon config add realtime`](/docs/cli/config#add-realtime).

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

## neon realtime subscribe (#subscribe)

Streams a live SQL query's results until interrupted. See the [`neon realtime subscribe` reference](/docs/cli/subscribe) for its output modes and examples.

<CliUsage command="realtime subscribe" />

<CliOptions command="realtime subscribe" />
