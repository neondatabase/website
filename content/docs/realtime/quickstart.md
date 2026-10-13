---
title: 'Quickstart'
subtitle: 'Get started with Realtime.'
summary: >-
  Enable Realtime, run your first live SQL queries and build an app with realtime reactivity.
enableTableOfContents: true
---

[Enable Realtime](#enable-realtime), run your [first live SQL queries](#subscribe-to-a-live-query) and [build an app with realtime&nbsp;reactivity](#build-a-realtime-app).

<Admonition type="important" title="Create your project in a supported region">
Realtime is currently [available in limited regions](./overview#which-regions-is-it-enabled-in). Support is expanding toward [all regions](/docs/introduction/regions).

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

The page shows your:

- **NEON_REALTIME_URL**: your [Live SQL API](./how-it-works#live-sql-api) endpoint URL
- **NEON_REALTIME_SECRET**: to use when [sealing queries](./guides/queries#sealing-queries)

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

Then [`subscribe`](/docs/cli/subscribe) to a live query:

```bash filename="Terminal"
neon subscribe "SELECT * FROM items"
```

This keeps running until you stop it with `Ctrl+C`. To see the result update, open a second terminal in the same directory and insert another row:

```bash filename="Terminal"
neon psql -- -c "INSERT INTO items (value) VALUES ('bar')"
```

By default, `neon subscribe` prints the full query result every time it changes. To see the underlying delta sync instead, subscribe to the raw changes:

```bash filename="Terminal"
neon subscribe --changes "SELECT * FROM items"
```

See [`neon subscribe`](/docs/cli/subscribe) for JSON output and the other options.

</Steps>

## Build a realtime app

The `realtime-react` starter template is a shared todo app built with React, Vite, a Hono API and Drizzle, with optimistic updates.

Scaffold it with [`neon bootstrap`](/docs/cli/bootstrap):

```bash filename="Terminal"
neon bootstrap my-app --template realtime-react
```

Bootstrap scaffolds the app, installs the dependencies and links the new `my-app` directory to a Neon project via `neon.ts` config.

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

## Next steps

- learn [how Realtime works](./how-it-works) and how the layers fit together
- read the guides on [defining](./guides/queries) and [subscribing](./guides/subscribing) to queries, [reactivity](./guides/reactivity), [optimistic mutations](./guides/mutations) and [server-side rendering](./guides/ssr)
- see the [Next.js](./examples/nextjs) and [TanStack](./examples/tanstack) examples showing how to build full-stack reactive apps with auth and SSR support
- see the [Mastra](./examples/mastra) example showing how to drive reactive agent workflows directly from Postgres

<NeedHelp/>
