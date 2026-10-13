---
title: 'Neon CLI command: realtime'
subtitle: Enable and disable Neon Realtime on a branch from the CLI
summary: >-
  The Neon CLI `neon realtime` command enables and disables Neon Realtime on a
  database branch. Use `enable` to provision Realtime and set the browser
  origins allowed to connect, and `disable` to remove it.
enableTableOfContents: true
updatedOn: '2026-10-13T00:11:48.345Z'
---

The `realtime` command enables and disables Neon Realtime on a branch. Once Realtime is on, you can stream a live SQL query's results with [`neon subscribe`](/docs/cli/subscribe), and [`neon env pull`](/docs/cli/env) writes the branch's `NEON_REALTIME_URL` and `NEON_REALTIME_SECRET` to your `.env`. To manage Realtime declaratively instead, add it to your `neon.ts` with [`neon config add realtime`](/docs/cli/config#add-realtime).

<Admonition type="comingSoon" title="Coming soon">
Neon Realtime isn't available yet. The `realtime` and `subscribe` commands ship in Neon CLI 8.4.1 but stay hidden and print "Neon Realtime is coming soon!" until Realtime launches.
</Admonition>

<CliSubcommands command="realtime" />

If `--project-id` is omitted, the CLI reads it from your [context file](/docs/cli/link) or auto-selects your only project. If `--branch` is omitted, it uses the context file's branch, or the project's default branch.

## neon realtime enable (#enable)

Requests Realtime provisioning for a branch. Provisioning finishes in the background, usually within a few seconds. Run it again on a branch that already has Realtime to replace its allowed origins with the ones you pass. Without `--allowed-origin`, a re-run keeps the existing origins.

<CliUsage command="realtime enable" />

<CliOptions command="realtime enable" />

`--allowed-origin` sets the browser origins allowed to connect. Repeat the flag for each origin, up to 16. Each value must be `*`, which allows every origin, or an `http` or `https` origin with no path, query, or fragment, such as `https://app.example.com`. `*` can't be combined with other origins. The CLI checks the values before it sends the request.

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

After you disable Realtime, `neon subscribe` on that branch fails with an error that points you back to `neon realtime enable`.
