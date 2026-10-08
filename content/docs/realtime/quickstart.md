---
title: 'Quickstart'
subtitle: 'Get started with Realtime.'
summary: >-
  Enable Realtime, run your first live SQL queries and build an app with realtime reactivity.
enableTableOfContents: true
---

Enable Realtime, run your first live SQL queries and build an app with realtime&nbsp;reactivity.

<Admonition type="important" title="Create your project in a supported region">
Realtime is currently [available in limited regions](./overview#which-regions-is-it-enabled-in). Support is expanding toward [all regions](/docs/introduction/regions).
</Admonition>

## Before you start

You'll need [Node.js 20.19+](https://nodejs.org/) and the [Neon CLI](/docs/cli/install) installed:

```bash filename="Terminal"
npm i -g neon
```

<Steps>

## Enable Realtime

<Admonition type="tip" title="Enable programmatically">
Create a new project using [`neon init --realtime`](/docs/cli/init) or enable Realtime in an existing project with [`neon realtime enable`](/docs/cli/realtime#enable). You can also use the [Neon API](/docs/reference/api) and the [Neon MCP Server](/docs/ai/neon-mcp-server).
</Admonition>

In the Neon Console, select your project and select **Postgres database** > **Realtime** to navigate to the Realtime page.

![Realtime page with enable button](/docs/realtime/realtime-sidebar.png)

Click **Enable Realtime**. Once enabled, you'll see the Realtime page:

![Realtime enabled view](/docs/realtime/realtime-enabled.png)

The page shows your:

- **URL**: your [Live SQL API](./how-it-works#live-sql-api) endpoint URL
- **Secret**: the `NEON_REALTIME_SECRET` to use when [sealing queries](./guides/queries#sealing-queries)

## Subscribe using the CLI

The simplest way to test live queries is [using the Neon CLI](/docs/cli). Make sure you're [logged in and have linked your project](/docs/cli/install#connect).

Copy your secret to set `NEON_REALTIME_SECRET` locally in your shell:

```bash filename="Terminal"
export NEON_REALTIME_SECRET=<your-secret>
```

Then, if you need to, create a table to query and insert some data into it:

```bash filename="Terminal"
neon psql -- -c "CREATE TABLE items (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), value TEXT)"
neon psql -- -c "ALTER TABLE items REPLICA IDENTITY FULL"
neon psql -- -c "INSERT INTO items (value) VALUES ('foo')"
```

Use the CLI to subscribe to a live query:

```bash filename="Terminal"
neon realtime subscribe "SELECT * FROM items"
```

You'll see the initial data and if you insert more data, for example using `neon psql -- -c "INSERT INTO ..."` in another terminal tab, you'll see the live query results update.

By default `neon realtime subscribe` shows the full query result. You can also subscribe to the raw changes to see the underlying delta sync:

```bash filename="Terminal"
neon realtime subscribe --changes "SELECT * FROM items"
```

## Develop a realtime app

If you bootstrap a new project using `neon bootstrap --template realtime`, this scaffolds a basic web app for you using Hono and React:

```bash filename="Terminal"
neon bootstrap my-realtime-app --template realtime
```

</Steps>

## Next steps

- learn [how Realtime works](./how-it-works) and how the layers fit together
- read the guides on [defining](./guides/queries) and [subscribing](./guides/subscribing) to queries, [reactivity](./guides/reactivity), [optimistic mutations](./guides/mutations) and [server-side rendering](./guides/ssr)
- see the [Next.js](./examples/nextjs) and [TanStack](./examples/tanstack) examples showing how to build full-stack reactive apps with auth and SSR support
- see the [Mastra](./examples/mastra) example showing how to drive reactive agent workflows directly from Postgres

<NeedHelp/>
