---
title: 'Quickstart'
subtitle: 'Get started with Realtime.'
summary: >-
  Enable Realtime, run your first live SQL queries and build an app with realtime reactivity.
enableTableOfContents: true
---

[Enable Realtime](#enable-realtime), run your [first live SQL queries](#subscribe-to-a-live-query) and [build an app with realtime&nbsp;reactivity](#build-a-realtime-app).

<Admonition type="important" title="Create your project in a supported region">
Realtime is currently [available in limited regions](./overview#which-regions-is-it-enabled-in). Support is expanding toward [all regions](/docs/introduction/regions#product-availability).

Realtime isn't available on [Claimable projects](/docs/reference/claimable-neon) until they're claimed.
</Admonition>

## Get started

You'll need [Node.js 22 or later](https://nodejs.org/) and the [Neon CLI](/docs/cli/install):

```bash filename="Terminal"
npm i -g neon
```

<Steps>

## Link a project

Log in to Neon, then link a new, empty directory to a Neon project:

```bash filename="Terminal"
neon login
neon link
```

[`neon link`](/docs/cli/link) asks which project to use. Pick an existing project or create a new one. Either way, it needs to be in a supported region.

## Enable Realtime

You can enable Realtime in the Neon Console or using the CLI.

### In the Neon Console

In the Neon Console, select your project and then **Postgres database** > **Realtime** to navigate to the Realtime page.

![Realtime page with enable button](/docs/realtime/realtime-sidebar.png)

Click **Enable Realtime**. Once enabled, you'll see the Realtime page:

![Realtime enabled view](/docs/realtime/realtime-enabled.png)

The page gives you the two values your app needs:

- **Realtime SQL API endpoint URL**: your [Live SQL API](./how-it-works#live-sql-api) endpoint. Use it as the value for `NEON_REALTIME_URL`.
- **Copy secret**: copies the branch's shared secret, which you use when [sealing queries](./guides/queries#sealing-queries). The Console doesn't display the secret. Use it as the value for `NEON_REALTIME_SECRET`.

### Using the CLI

Run [`neon realtime enable`](/docs/cli/realtime#enable) to enable Realtime for the currently linked project and branch:

```bash filename="Terminal"
neon realtime enable
```

To get the URL and secret that the Console shows, you can run:

```bash filename="Terminal"
neon env pull --service realtime
```

It writes them to `.env.local` as `NEON_REALTIME_URL` and `NEON_REALTIME_SECRET`.

## Subscribe to a live query

The simplest way to try live queries is with the [Neon CLI](/docs/cli). First, if you need to, create a table to query and insert some data into it:

```bash filename="Terminal"
neon psql -- -c "CREATE TABLE items (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), value TEXT)"
neon psql -- -c "INSERT INTO items (value) VALUES ('foo')"
```

Then use [`neon realtime subscribe`](/docs/cli/realtime#subscribe) to start a live query:

```bash filename="Terminal"
neon realtime subscribe "SELECT * FROM items"
```

This keeps running until you stop it with `Ctrl+C`. To see the result update, open a second terminal in the same directory and insert another row:

```bash filename="Terminal"
neon psql -- -c "INSERT INTO items (value) VALUES ('bar')"
```

By default, `neon realtime subscribe` prints the full query result every time it changes. To see the underlying delta sync instead, subscribe to the raw changes:

```bash filename="Terminal"
neon realtime subscribe --changes "SELECT * FROM items"
```

See [`neon realtime subscribe`](/docs/cli/realtime#subscribe) for JSON output and the other options.

</Steps>

## Build a realtime app

The `realtime-react` starter template is a shared todo app built with React, Vite, a Hono API and Drizzle, with optimistic updates.

Scaffold it with [`neon bootstrap`](/docs/cli/bootstrap):

```bash filename="Terminal"
neon bootstrap my-app --template realtime-react
```

Bootstrap scaffolds the app, installs the dependencies and links the new `my-app` directory to a Neon project via `neon.ts` config.

If the branch doesn't have Realtime yet, the link step can't pull the env vars and prints a warning to run `neon deploy`. That's the next step.

Run [`neon deploy`](/docs/cli/deploy) to apply the generated config, enabling Realtime for your project and branch:

```bash filename="Terminal"
cd my-app
neon deploy
```

This automatically writes your `DATABASE_URL`, `NEON_REALTIME_URL` and `NEON_REALTIME_SECRET` to `.env.local`. You can then run migrations and start the app:

```bash filename="Terminal"
npm run db:setup
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. If you open two windows or tabs, as you change data in one, you'll see it update in realtime in the other.

## Agent skills and MCP

Install the [Neon MCP server](/docs/ai/neon-mcp-server). Or [use the CLI](/docs/cli) to install the Realtime skill:

```bash filename="Terminal"
neon skills -s neon-realtime
```

<CopyPrompt src="/prompts/neon-realtime.md"
    description="Copy this to your coding agent to get started with Realtime."
    buttonText="Copy prompt"
/>

## Manage Realtime

On the Realtime page in the Neon Console:

- **Rotate secret** replaces the branch's shared secret. Once rotation finishes, the old secret stops working, so click **Copy secret** and update `NEON_REALTIME_SECRET` in every app that uses it.
- **Disable Realtime** disconnects all Realtime clients on the branch and discards its shared secret.

To do the same from the CLI, and for details on how rotation and disabling work, see [`neon realtime rotate-secret`](/docs/cli/realtime#rotate-secret) and [`neon realtime disable`](/docs/cli/realtime#disable).

## Next steps

- learn [how Realtime works](./how-it-works) and how the layers fit together
- read the guides on [defining](./guides/queries) and [subscribing](./guides/subscribing) to queries, [reactivity](./guides/reactivity), [optimistic mutations](./guides/mutations) and [server-side rendering](./guides/ssr)
- see the [Next.js](./examples/nextjs) and [TanStack](./examples/tanstack) examples showing how to build full-stack reactive apps with auth and SSR support
- see the [Mastra](./examples/mastra) example showing how users and background agents work on the same data in real time
- view Realtime logs in the **Realtime** tab of the [Monitoring page](/docs/introduction/monitor-logs)

<NeedHelp/>
