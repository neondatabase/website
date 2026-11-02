---
title: "How do I subscribe to a Postgres query and get its results live as the data changes?"
subtitle: "Neon Realtime (public beta) turns any read-only, deterministic SQL query into a live query on Lakebase Postgres. You subscribe to the query once and get the updated result every time a write changes it, with no polling or LISTEN/NOTIFY plumbing."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-02T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'How do I store private user files and share them with expiring links?'
  slug: store-private-user-files-expiring-links
nextLink:
  title: 'Is there a Supabase Realtime alternative that supports live queries with joins and aggregates?'
  slug: supabase-realtime-alternative-live-sql-joins
---

Use [Neon Realtime](/docs/realtime/overview) (public beta). Enable it on a branch, define the query your screen shows, and subscribe to it. The subscription starts with the full result, then receives changes in batches as transactions commit, so the result in your app always matches the database ([how it works](/docs/realtime/how-it-works#subscriptions-and-consistency)).

## Why polling and LISTEN/NOTIFY fall short

The usual ways to keep a query result fresh each push work back onto your app:

- **Polling** re-runs the query on a timer. Most runs return nothing new, each one costs a database round trip, and the screen is only as fresh as the interval.
- **LISTEN/NOTIFY** tells you that something changed, not what your query now returns, so you still refetch. It needs a direct connection, because `LISTEN` doesn't work through the pooler ([connection pooling](/docs/connect/connection-pooling)). Listeners are lost when the compute suspends, so a `LISTEN` feed only works on an always-on compute with scale to zero disabled ([compute lifecycle](/docs/introduction/compute-lifecycle), [LISTEN/NOTIFY on Functions](/docs/compute/functions/websockets)).

With Realtime, the query is the subscription. When a write commits, only the live queries it affects are updated, and the engine sends the delta.

## Example: live unread counts

Take a sidebar that shows each channel you belong to with its unread message count. That's a join and an aggregate, and you can subscribe to it as written ([launch post](/blog/neon-now-has-realtime)):

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

A new message, a changed `last_read_at`, or a new membership updates the count on screen. Realtime supports joins, aggregates, `GROUP BY`, `DISTINCT`, window functions, subqueries, and built-in and user-defined functions. Queries must be read-only and use deterministic functions, so `now()` and `gen_random_uuid()` aren't allowed, and tables need a stable replica identity, which a primary key provides ([defining live queries](/docs/realtime/guides/queries#defining-live-queries), [table requirements](/docs/realtime/guides/queries#table-requirements)).

## How you wire it up

You define the query in your backend with raw SQL, Drizzle, or Kysely, fill in parameters like the user ID from the authenticated request, and seal it. A sealed query is a short-lived, encrypted capability: the browser can subscribe to it but can't read or change the SQL or its parameters ([sealing queries](/docs/realtime/guides/queries#sealing-queries)). In React, `useLiveQuery` binds the result to component state ([reactivity](/docs/realtime/guides/reactivity#uselivequery)).

To try it before writing any code, enable Realtime on a linked branch and subscribe from the terminal ([quickstart](/docs/realtime/quickstart)):

```bash
neon realtime enable
neon realtime subscribe "SELECT * FROM items"
```

Insert a row from a second terminal and the result prints again. Add `--changes` to see the raw delta stream ([CLI reference](/docs/cli/realtime#subscribe)).

## What it costs your database

Clients connect to the Live SQL API, which talks to the live query engine over a single connection, so subscribers don't use database connections. The incremental work runs on a replica, so your primary's write latency and throughput aren't affected. Starting a live query can wake a suspended compute, but holding a subscription open doesn't keep it awake ([Realtime FAQ](/docs/realtime/overview#frequently-asked-questions)).

<Admonition type="note" title="Beta scope">
Realtime is free during the beta. Compute that a live query wakes and outbound data transfer still bill as usual. It's available in AWS us-east-1, us-east-2, eu-central-1, and ap-southeast-1, doesn't support row-level security yet (authorize in your backend before sealing), and isn't available on claimable projects until they're claimed ([what's in the beta](/docs/realtime/overview#frequently-asked-questions)).
</Admonition>

<CTA title="Run your first live query" description="Enable Realtime on a branch and subscribe to a query from the terminal in a few minutes." buttonText="Realtime quickstart" buttonUrl="/docs/realtime/quickstart" />
