---
title: 'Quickstart'
subtitle: 'Get started with Realtime.'
summary: >-
  Enable Realtime, run your first live SQL queries, build an app with realtime reactivity, or add Realtime to an existing Next.js app with raw SQL.
enableTableOfContents: true
redirectFrom:
  - /docs/realtime/get-started
updatedOn: '2026-11-17T23:36:26.452Z'
---

[Enable Realtime](#enable-realtime), run your [first live SQL queries](#subscribe-to-a-live-query) and [build an app with realtime&nbsp;reactivity](#build-a-realtime-app), or [add Realtime to an existing&nbsp;app](#add-realtime-to-an-existing-app).

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

## Add Realtime to an existing app

To make an app you already have live, seal a query on your server and subscribe to it in the browser. This example adds a live task list to a [Next.js](https://nextjs.org) App Router app with raw SQL and no ORM. The file paths assume the `@/` import alias that `create-next-app` sets up.

Run these steps in your app's directory. Link it with `neon link`, as in [Link a project](#link-a-project), which works in a directory that already has code, and [enable Realtime](#enable-realtime) first.

### Install the SDK

```bash filename="Terminal"
npm install @neon/realtime @neon/realtime-react
```

`@neon/realtime` has two dedicated entry points: `@neon/realtime/server` seals queries on your server, and `@neon/realtime/client` subscribes to them from the browser. `@neon/realtime-react` provides `RealtimeProvider` and the `useLiveQuery()` hook.

### Pull the environment variables

```bash filename="Terminal"
neon env pull --service postgres --service realtime
```

This writes `DATABASE_URL`, `NEON_REALTIME_URL` and `NEON_REALTIME_SECRET` to `.env`, or to `.env.local` if there's no `.env`. Only server code reads them. The page passes `NEON_REALTIME_URL` to the browser as a prop, so you don't need a `NEXT_PUBLIC_` copy, and the secret never leaves the server.

By default, any browser origin can connect. If your branch [restricts origins](/docs/cli/realtime#enable), add `http://localhost:3000` with `neon realtime enable --allowed-origin`, or the subscription stays `connecting` without an error. Each run replaces the list, so repeat the flag for every origin you keep.

### Create a table

Live queries need a table with a [stable replica identity](./guides/queries#table-requirements), and a primary key is enough:

```bash filename="Terminal"
neon psql -- -c "CREATE TABLE tasks (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now())"
```

### Seal a raw SQL query on the server

Create the Realtime server with [`createRealtime()`](./sdks/typescript#backend-createrealtime) and define the query with [`rawSql`](./sdks/typescript#backend-rawsql). Without an ORM adapter, `createRealtime()` takes only your secret and the database name. `import "server-only"` makes the build fail if a Client Component imports this file, and Next.js resolves it without an install:

```ts filename="lib/realtime.ts"
import "server-only"
import { createRealtime, rawSql } from "@neon/realtime/server"

export interface Task {
  id: string
  title: string
}

let realtime: ReturnType<typeof createRealtime> | undefined

// Created on first use, because `next build` imports this module without your env vars
function getRealtime() {
  return (realtime ??= createRealtime({
    secret: process.env.NEON_REALTIME_SECRET!,
    db: new URL(process.env.DATABASE_URL!).pathname.slice(1)
  }))
}

export function sealTasks() {
  return getRealtime().seal({
    query: rawSql<Task>("SELECT id, title FROM tasks ORDER BY created_at DESC LIMIT 100")
  })
}
```

Sealed queries are [short-lived](./guides/queries#renewing-sealed-queries), so the browser renews them through a [Route Handler](https://nextjs.org/docs/app/building-your-application/routing/route-handlers). Use a Route Handler, not a server action, because Next.js runs server actions one at a time:

```ts filename="app/api/tasks/live/route.ts"
import { sealTasks } from "@/lib/realtime"

export async function POST() {
  // Check your app's session here: anyone who can call this route can read the tasks
  return Response.json(await sealTasks(), { headers: { "Cache-Control": "private, no-store" } })
}
```

A sealed query is a bearer token for the rows it selects. For per-user data, check the session and put the user's id into the query before you seal it, as [authorization](./guides/queries#authorization) explains.

### Create the browser client

The client runs in the browser, so create it in a Client Component, a file that starts with `"use client"`. `@neon/realtime-react` ships without that directive, so import it only from Client Components:

```tsx filename="app/realtime-root.tsx"
"use client"

import { createRealtimeClient } from "@neon/realtime/client"
import { RealtimeProvider } from "@neon/realtime-react"
import { type ReactNode, useState } from "react"

export function RealtimeRoot({ url, children }: { url: string; children: ReactNode }) {
  // One client per page load. Creating it doesn't connect, so it's safe during the server render
  const [client] = useState(() => createRealtimeClient({ url }))
  return <RealtimeProvider client={client}>{children}</RealtimeProvider>
}
```

### Subscribe with `useLiveQuery()`

```tsx filename="app/task-list.tsx"
"use client"

import type { SealedLiveQuery } from "@neon/realtime/client"
import { useLiveQuery } from "@neon/realtime-react"
import { useState } from "react"

import type { Task } from "@/lib/realtime"

async function refreshQuery(): Promise<SealedLiveQuery<Task>> {
  const response = await fetch("/api/tasks/live", { method: "POST", cache: "no-store" })
  if (!response.ok) throw new Error(`Couldn't renew the live query (${response.status})`)
  return response.json()
}

export function TaskList({ sealedQuery }: { sealedQuery: SealedLiveQuery<Task> }) {
  // Keep the first sealed query: every server re-render sends a new one, which would restart the subscription
  const [query] = useState(sealedQuery)
  const { data, status, error } = useLiveQuery(query, { refreshQuery })

  if (status === "error") return <p role="alert">Live updates stopped: {error.message}</p>
  if (data === undefined) return <p>Loading tasks</p>

  return (
    <ul>
      {data.map((task) => (
        <li key={task.id}>{task.title}</li>
      ))}
    </ul>
  )
}
```

### Render the page

The page is a Server Component. `Tasks` seals the query for each request and passes the sealed query and the Realtime URL to the Client Components. The `<Suspense>` boundary around it lets the rest of the page prerender, which `next build` requires when [Cache Components](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) is on:

```tsx filename="app/page.tsx"
import { connection } from "next/server"
import { Suspense } from "react"

import { sealTasks } from "@/lib/realtime"
import { RealtimeRoot } from "./realtime-root"
import { TaskList } from "./task-list"

export default function Page() {
  return (
    <Suspense fallback={<p>Loading tasks</p>}>
      <Tasks />
    </Suspense>
  )
}

async function Tasks() {
  // Request time only: a sealed query from the build would have expired
  await connection()
  const sealedQuery = await sealTasks()

  return (
    <RealtimeRoot url={process.env.NEON_REALTIME_URL!}>
      <TaskList sealedQuery={sealedQuery} />
    </RealtimeRoot>
  )
}
```

Start the app with `npm run dev` and open [http://localhost:3000](http://localhost:3000) in two windows. Then add a task from a terminal:

```bash filename="Terminal"
neon psql -- -c "INSERT INTO tasks (title) VALUES ('Write the docs')"
```

The task appears in both windows without a reload. Writes from your app's own forms and server actions update every open window the same way.

From here:

- show a write before it syncs, with [optimistic mutations](./guides/mutations)
- render the first rows on the server, with [server-side rendering](./guides/ssr)
- write live queries with [Drizzle or Kysely](./guides/queries#using-a-query-builder-or-orm) instead of raw SQL
- in a single-page app without server rendering, such as Vite, create the client once at module level, as the [subscribing guide](./guides/subscribing#subscribe-to-the-sealed-query) does

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
