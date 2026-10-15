---
title: 'Neon now has realtime'
subtitle: Live SQL queries inside Postgres with full end-to-end reactivity
description: >-
  Neon Realtime is live in public beta. Any SQL query can now be a live query. Subscribe to it and the result stays up to date as your data changes. That makes your whole app reactive, with no polling or refetch logic.
date: '2026-10-15T12:00:00'
updatedOn: '2026-10-15T12:00:00.000Z'
category: product
categories:
  - product
authors:
  - james-arthur
cover:
  image: https://cdn.neonapi.io/public/images/pages/blog/neon-now-has-realtime/neon-realtime.jpg
  alt: 'Neon now has realtime'
isFeatured: false
seo:
  title: 'Neon now has realtime - Neon'
  description: >-
    Neon Realtime is live in public beta. Any SQL query can now be a live query. Subscribe to it and the result stays up to date as your data changes. That makes your whole app reactive, with no polling or refetch logic.
  keywords: []
  noindex: false
  ogTitle: 'Neon now has realtime - Neon'
  ogDescription: >-
    Neon Realtime is live in public beta. Any SQL query can now be a live query. Subscribe to it and the result stays up to date as your data changes. That makes your whole app reactive, with no polling or refetch logic.
  image: https://cdn.neonapi.io/public/images/pages/blog/neon-now-has-realtime/neon-realtime.jpg
---

![Neon now has realtime](https://cdn.neonapi.io/public/images/pages/blog/neon-now-has-realtime/neon-realtime.jpg)

[**Neon Realtime**](/docs/realtime/overview) **is live in public beta. Any SQL query can now be a live query. Subscribe to it and the result stays up to date as your data changes. That makes your whole app reactive, with no polling or refetch logic.**

It all runs directly from Lakebase Postgres, so there's no second realtime system to bolt on and it works natively with scale to zero and branching. And it comes out-of-the-box with [type-safe, end-to-end reactivity](/docs/realtime/guides/reactivity), [SSR support](/docs/realtime/guides/ssr) and [instant local writes](/docs/realtime/guides/mutations) for the best possible reactive AX and DX.

It's free during the beta, there's no waitlist, you can [use it right now](/docs/realtime/quickstart) and [your coding agent can set it up in one command](#built-for-coding-agents). Try to break it and [tell us what you find on Discord](https://neon.com/discord) so we can get it to GA fast.

<YoutubeIframe embedId="DgdKM5SHG8M" isDocPost={false} />

Realtime has always had a [reputation for demoing well but falling over in production](/blog/electrifying-neon-building-the-realtime-backend). Especially with the "holy grail" of realtime: live SQL. The idea is so simple. No limitations, just subscribe to any SQL query. But making it real has always been too complex and too hard to scale.

Well, not any more. Our team has spent decades working on this. Building the [Electric](https://electric.ax) sync engine and before that in academic research. But before [joining Neon](/blog/electric-joins-neon) we had never been working with a database with [Neon's unique storage architecture](/docs/introduction/architecture-overview). Now, working inside Neon, we've been able to build fully expressive live SQL queries with no limitations that can scale to the largest enterprise workload.

It's everything we learned building Electric, reimagined and rebuilt to Lakebase engineering standards. The result is [realtime that just works](/docs/realtime/overview). Full reactivity on standard Postgres. With a [batteries-included stack](/docs/realtime/how-it-works) for building reactive apps and agents. That works with your existing [schema, queries, api, auth and frontend code](/docs/realtime/guides/queries).

## Realtime as the default for coding agents

Realtime should be a primitive that agents reach for by default and get right the first time. When a developer asks an agent to build an app, a lot of what the agent builds would be better live:

- The chat panel should show new messages as they arrive
- The notification badge should update its count
- A shared board should show a teammate's edits
- A task list should show an agent's progress as it works

Ideally the agent wires all of this up as realtime from the start, the same way it adds auth or a database table without being asked. In practice it rarely does. Ask a coding agent to build a CRUD app and it usually gets it right. Ask it to build realtime sync and the failure rate goes way up.

A big part of the reason is that realtime usually lives outside the backend. It runs as a separate service that has to mirror what's in the database, and that's where things break:

- It has to stay in sync with the database. Every change has to reach every connected client, in order, and survive dropped connections and reconnects. That's hard to get right, and when it slips, screens quietly show stale data.
- It doesn't share the backend's context. It has its own permissions model, its own connections, and no idea which branch it's pointed at. A preview branch can end up wired to production's realtime.
- It's one more system to operate. The agent has to set it up, configure it, and keep it consistent with everything else, which is exactly where agent-written code tends to go wrong.

Neon Realtime moves realtime inside Postgres. Live queries run [in your database](/docs/realtime/how-it-works), not in a separate service bolted on next to it, so there's no mirror to keep in sync and no second system to drift. It also sits alongside the other Neon backend primitives: [Managed Better Auth](https://neon.com/docs/auth/overview), [Object Storage](https://neon.com/docs/storage/overview), [Functions](https://neon.com/docs/compute/functions/overview), and [AI Gateway](https://neon.com/docs/ai-gateway/overview). It speaks the language agents already use: SQL, the ORM already in the codebase, and the auth the app already has.

And it follows the same principles as the rest of Neon: it's enabled per branch, and it scales to zero.

## Neon Realtime: live queries for Neon apps

<video autoPlay muted loop playsInline width="1920" height="1080" src="https://cdn.neonapi.io/public/images/pages/blog/neon-now-has-realtime/neon-realtime-reel.mp4"></video>

Neon Realtime adds live queries to Lakebase Postgres. Here's what you get:

- **Any SQL query can be live.** Enable Realtime on a branch and any deterministic query against that database can be live, joins and aggregates included. Subscribe from the terminal with `neon realtime subscribe`, from your code with the SDK's `subscribe()`, or from a React component with `useLiveQuery`.
- **Reactive building blocks for your UI.** Bind a React component to a live query with `useLiveQuery`, and it re-renders on its own whenever the result changes. Writes show on screen immediately and are confirmed when the database commits them. SSR and TanStack DB are supported.
- **All inside Postgres.** There's no second realtime system and no separate database to run. Your schema, queries, ORM, and client state library stay the same.
- **A TypeScript SDK for your backend and frontend.** Define queries on your backend with raw SQL, Drizzle, or Kysely, and subscribe to them from a browser, a server, or an agent. It works with Next.js, TanStack Start and TanStack DB, and Mastra.
- **Built for coding agents.** Your agent can enable Realtime in one command, test a live query from the terminal, and use the Realtime skill (`neon skills -s neon-realtime`) or the [Neon MCP server](https://neon.com/docs/ai/connect-mcp-clients-to-neon) to build the app. The Neon API and Console work too.

The fastest way to see it is from the terminal. Enable Realtime on your project (`neon realtime enable`, or `neon bootstrap realtime` or `neon init --service realtime` for a new one), then subscribe to a query.

With a schema like this:

```sh
neon psql -- -c "CREATE TABLE items (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), value TEXT)"
neon psql -- -c "INSERT INTO items VALUES ('foo')"
```

You can subscribe to it like this:

```sh
neon realtime subscribe "SELECT * FROM items"
```

You'll see the current rows. Insert a row from another terminal and the result updates in place:

```sh
neon psql -- -c "INSERT INTO items VALUES ('bar')"
```

Add `--changes` to see the raw delta stream underneath.

### Any query can be a live query

Most realtime systems tell you that a row changed in a table. Then your app has to work out what that means for the screen: what do you need to display, what do you need to refetch? With Neon Realtime, you subscribe to the exact query your screen shows, and that result is what stays live.

For example, say your app needs to show the channel name and unread message count for all of the channels you're a member of. You can just express that in SQL and subscribe to the results:

```sql
SELECT c.id, c.name, count(m.id) AS unread
  FROM memberships mb
  JOIN channels c
    ON c.id = mb.channel_id
  LEFT JOIN messages m
    ON m.channel_id = c.id
   AND m.created_at > mb.last_read_at
  WHERE mb.user_id = $1
  GROUP BY c.id, c.name
  ORDER BY c.name
```

This works for [any read-only, deterministic SQL query](/docs/realtime/guides/queries). You can use joins, aggregates, group by, distinct, window functions, subqueries, built-in and user-defined functions, extensions, etc.

### Reactive UIs, with instant writes

In a reactive UI, what's on screen follows the data: when the result of a query changes, the component re-renders on its own. You don't write refresh buttons, polling intervals, or refetch-after-save logic.

In React, that's [`useLiveQuery`](/docs/realtime/guides/reactivity):

```tsx
// frontend/Sidebar.tsx
import { useLiveQuery } from "@neon/live-react"

export function Sidebar({ sealedQuery }) {
  const { data } = useLiveQuery(sealedQuery)

  return (
    <ul>
      {data.map((channel) => (
        <li key={channel.id}>{channel.name} ({channel.unread})</li>
      ))}
    </ul>
  )
}
```

You can have instant local writes too. Apply the change on screen with React's `useOptimistic`, send it to your API, and [wait for the matching Postgres transaction to come back on the live stream](/docs/realtime/guides/mutations) with `waitForTxId`. Until then, the screen shows the optimistic state. Once the transaction arrives, it shows the confirmed state.

If you use [TanStack DB](https://tanstack.com/db), sync the live query into a collection and TanStack DB [manages the optimistic state for you](/docs/realtime/guides/mutations#with-tanstack-db-collections). [SSR works as well](/docs/realtime/guides/ssr): the page arrives with data from the server, and live updates take over from there.

### All inside Postgres

Realtime runs in your database, not in a separate service bolted on next to it. That means you get realtime, reactive apps and agents:

- Without a second or bespoke realtime system
- Without changing your schema, queries, ORM, or client state library
- Without bending your app around the limits of a sync engine

<video autoPlay muted loop playsInline width="1920" height="1080" src="https://cdn.neonapi.io/public/images/pages/blog/neon-now-has-realtime/neon-realtime-diagram.mp4"></video>

### A TypeScript SDK for your backend and frontend

The SDK splits the work between your backend and whatever is subscribing. You define queries on the backend, where your auth already runs, using raw SQL or your ORM. Drizzle and Kysely adapters ship today. Then you seal them:

```ts
// backend/queries.ts
import { createNeonLive, rawSql } from "@neon/live/server"
import { drizzleAdapter } from "@neon/live-drizzle"

const live = createNeonLive({
  adapter: drizzleAdapter(),
  db: "app",
  secret: process.env.NEON_LIVE_SECRET!,
})

export async function sealUnreadCounts(userId: string) {
  const query = rawSql<UnreadCount>(UNREAD_COUNTS_SQL, [userId])

  return live.seal(query)
}
```

A sealed query can't be forged or modified, so it's safe to hand to a browser or an agent. Expose it from an endpoint, where parameters like the user ID come from the request rather than from the client:

```ts
// backend/server.ts
app.post("/api/v1/unread", async (c) => {
  const user = await requireUser(c)

  return c.json(await sealUnreadCounts(user.id))
})
```

Anything that receives the sealed query can subscribe to it, whether that's a browser tab, another server, or an agent:

```ts
const subscription = client.subscribe(sealedQuery)
subscription.onChange(console.log)
```

The SDK fits into the frameworks you already use:

- **Next.js:** a realtime, reactive app with SSR support
- **TanStack Start and TanStack DB:** live queries synced into TanStack DB collections, with optimistic mutations
- **Mastra:** agent workflows that react to changes in Postgres directly

We'll go deeper on each of these over the next few days.

### Built for coding agents

Agents are a first-class interface of the Neon backend, and Realtime is no exception. Your agent can set all of this up.

To enable Realtime on an existing project:

```sh
neon realtime enable
```

Or create a new project with Realtime already on:

```sh
neon init --service realtime
```

Or to bootstrap a Neon project with a realtime template:

```sh
neon bootstrap realtime
```

Then give your agent context by installing the Realtime skill:

```sh
neon skills -s neon-realtime
```

Or connect the [Neon MCP server](https://neon.com/docs/ai/connect-mcp-clients-to-neon).

### Built as a Neon primitive

Realtime is built into Neon as a backend primitive, so it keeps the properties agents and developers rely on:

- **It scales to zero.** Clients connect to Neon's ingress layer, not to Postgres, so open subscriptions don't keep your database awake.
- **It branches.** Realtime is enabled per branch, and child branches inherit it. A preview branch or an agent's branch gets live queries against its own data.
- **It's cost-efficient.** When a write commits, only the live queries it affects are updated. You stop paying to re-run queries on reads and polls, and pay a small incremental cost on writes instead.
- **It leaves your primary alone.** The incremental work runs on a replica, so your primary's write latency, write throughput, and compute aren't affected. Live queries don't use database connections either.

## Realtime you don't have to work around. Try it

We want [Neon Realtime](/docs/realtime/overview) to be one more primitive you and your agent reach for when building an app. It lives in your Neon backend, works with the rest of it, and gets it right the first time.

**Help us take it to GA.** [Enable Realtime](/docs/realtime/quickstart), build something, push it hard, and tell us what breaks and what's missing on [Discord](https://neon.com/discord).

<Admonition type="note" title="Beta is gonna beta">
We're shipping this early on purpose: the core works and we want you building on it, but we're still building it. Here's what to expect:

- Performance will keep improving: we have a long list of optimizations to work through, which is why we're not publishing benchmarks yet.
- Expect papercuts: the protocol underneath is still changing, so use the SDK rather than the raw API.
- The console experience is minimal for now.
- No row-level security yet.
- Available in us-east-1, us-east-2, eu-central-1, and ap-southeast-1, more regions to come.

The good part: Realtime is free during the beta. Just remember that database compute (starting a live query can wake your database) and egress will be billed as usual.
</Admonition>
