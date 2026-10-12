---
title: 'Neon CLI command: realtime'
subtitle: Enable and disable Neon Realtime on a branch from the CLI
summary: >-
  Covers the usage of the `realtime` command in the Neon CLI to enable and
  disable Neon Realtime on a branch, set the browser origins allowed to
  connect, and manage Realtime declaratively in neon.ts.
enableTableOfContents: true
---

The `realtime` command enables and disables [Neon Realtime](/docs/realtime/overview) on a branch. Realtime makes your SQL queries live: clients subscribe to a query and receive updates as the data changes. Child branches created from a Realtime-enabled branch have Realtime enabled automatically.

<CliSubcommands command="realtime" />

If `--project-id` or `--branch` are omitted, the CLI uses the project and branch from your [context file](/docs/cli/link) (`.neon`). Without a context file, it selects your project automatically when you have only one, and uses the project's default branch. `--branch` accepts a branch ID or name.

## neon realtime enable (#enable)

Enables Realtime on a branch.

<CliUsage command="realtime enable" />

<CliOptions command="realtime enable" />

```bash
neon realtime enable
```

Enabling is asynchronous: the command returns as soon as the request is accepted, without waiting for provisioning to finish. [`neon env pull --service realtime`](/docs/cli/env#pull) and [`neon subscribe`](/docs/cli/subscribe) wait until Realtime is ready, so you can run them straight away.

### Allowed origins

Pass `--allowed-origin` to set the browser origins allowed to connect. Repeat the flag for each origin:

```bash
neon realtime enable --allowed-origin https://app.example.com --allowed-origin http://localhost:3000
```

The CLI checks origins before it sends the request, using the same rules as `neon.ts`:

- Each origin is `http` or `https` with a host and an optional port, and no path, query, or fragment.
- You can set up to 16 origins.
- `*` allows every origin, and can't be combined with other origins.

Run `neon realtime enable` again with new `--allowed-origin` values to update the origins on a branch that already has Realtime. Without `--allowed-origin`, a branch that's enabling Realtime for the first time allows every origin, and a branch that already has Realtime keeps its current or inherited origins.

## neon realtime disable (#disable)

Disables Realtime on a branch.

<CliUsage command="realtime disable" />

<CliOptions command="realtime disable" />

```bash
neon realtime disable
```

Like `enable`, the command returns once the request is accepted. Disabling also discards the branch's Realtime secret, so apps using that branch's `NEON_REALTIME_SECRET` stop working. If you enable Realtime again later, the branch gets a new secret, so pull the env vars again.

## Manage Realtime in neon.ts

If you manage your project with a [`neon.ts`](/docs/reference/neon-ts) policy, declare Realtime there instead of enabling it imperatively. [`neon config add realtime`](/docs/cli/config#add-realtime) writes `preview.realtime` into `neon.ts` (creating the file if needed), and [`neon deploy`](/docs/cli/deploy) enables it on the branch:

```bash
neon config add realtime --allowed-origin http://localhost:5173
neon deploy
```

By default, `neon deploy` then pulls the branch's env vars into your local env file, waiting until Realtime is ready, so the Realtime [env vars](#env-vars) are written for you.

When the branch's allowed origins differ from the ones in `neon.ts`, `neon deploy` asks before changing them. Pass `--update-existing` to apply them without asking. To disable Realtime declaratively, set `realtime: false` under `preview` in `neon.ts` and run `neon deploy`.

## Env vars

Apps connect to Realtime with two env vars:

- `NEON_REALTIME_URL`: the WebSocket endpoint your clients connect to.
- `NEON_REALTIME_SECRET`: the server-only key your backend uses. Never expose it to browser code.

Write them to your local env file with [`neon env pull`](/docs/cli/env#pull). Add `--service postgres` to pull `DATABASE_URL` in the same run, since `--service realtime` on its own doesn't write it:

```bash
neon env pull --service postgres --service realtime
```

There's no separate variable for the database name. Take it from `DATABASE_URL`.

## Claimable projects

Realtime isn't available on [Claimable projects](/docs/reference/claimable-neon) until they're claimed. Claim the project first, then enable Realtime.
