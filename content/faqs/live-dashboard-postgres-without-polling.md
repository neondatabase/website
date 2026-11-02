---
title: "How do I build a live dashboard on Postgres without polling the database?"
subtitle: "With Neon Realtime (public beta), you subscribe to the dashboard's aggregate SQL query and Lakebase Postgres pushes the new result only when a write changes it. The incremental work runs on a replica, so the primary isn't affected."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-02T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'How do I keep Postgres metadata in sync with files in a bucket?'
  slug: keep-postgres-metadata-in-sync-with-bucket
nextLink:
  title: 'Is there an LLM gateway that charges provider prices and puts all model usage on one bill?'
  slug: llm-gateway-provider-prices-single-bill
---

Use [Neon Realtime](/docs/realtime/overview) (public beta). Write each dashboard tile as the SQL query you'd run anyway, including `GROUP BY`, aggregates, and window functions, and subscribe to it. When a write commits, Realtime updates only the live queries that write affects and sends the change to every open dashboard ([defining live queries](/docs/realtime/guides/queries#defining-live-queries), [launch post](/blog/neon-now-has-realtime)).

## Why polling a dashboard gets expensive

A polling dashboard re-runs every tile's query on a timer for every open tab. The cost grows with viewers times tiles times refresh rate, even when nothing changed, and the data is only as fresh as the interval. Shorten the interval and the load goes up. Lengthen it and the numbers lag.

Realtime flips that cost model. Queries move from "query execution on read" to "incremental cost on write", and that work runs on a replica, so it has no impact on the write latency, write throughput, or write compute of your primary ([performance impact](/docs/realtime/overview#frequently-asked-questions)). A write that doesn't affect a tile's query doesn't trigger work for it.

## A live aggregate tile

Define the query in your backend with raw SQL or your ORM, then seal it so the browser can subscribe without seeing or changing the SQL ([sealing queries](/docs/realtime/guides/queries#sealing-queries)):

```ts filename="backend/queries.ts"
import { pgParam, rawSql } from "@neon/realtime/server"

interface RegionTotal {
  region: string;
  orders: string;
  revenue: string;
}

export function revenueByRegion(workspaceId: string, since: Date) {
  return rawSql<RegionTotal>(
    `SELECT region, count(*) AS orders, sum(amount) AS revenue
       FROM orders
      WHERE workspace_id = $1 AND created_at >= $2
      GROUP BY region
      ORDER BY revenue DESC`,
    [workspaceId, pgParam.timestamptz(since)]
  )
}
```

In React, `useLiveQuery` binds the result to the tile, and the server can render the first result so the dashboard doesn't flash empty ([reactivity](/docs/realtime/guides/reactivity#uselivequery), [SSR](/docs/realtime/guides/ssr)). `int8` and `numeric` values such as counts and sums arrive as strings so they stay exact ([decoded types](/docs/realtime/guides/subscribing#subscribe-to-the-sealed-query)).

## Limits to design around

- **No `now()`.** Live queries must be deterministic, so a "last 24 hours" filter can't call `now()` ([defining live queries](/docs/realtime/guides/queries#defining-live-queries)). Pass the window start as a parameter, as above. A sealed query renews only for the same query, so moving the window means sealing a new query and subscribing again ([renewing sealed queries](/docs/realtime/guides/queries#renewing-sealed-queries)).
- **Heavy queries cost on write.** Complex queries add write-processing latency, especially on larger datasets ([SQL limitations](/docs/realtime/overview#frequently-asked-questions)).
- **Ordered results can resend in full.** Some queries, such as ones with `ORDER BY`, can get a complete result replacement for a change instead of a delta ([CLI output](/docs/cli/realtime#subscribe)).
- **Authorization lives in your API.** Row-level security isn't supported yet, so scope each query in the handler that seals it, for example by filtering on the workspace from the verified session ([authorization](/docs/realtime/guides/queries#authorization)).

## Connections and idle cost

Each browser connects to the Live SQL API, which reaches the live query engine over a single connection, so open dashboards don't use database connections. A dashboard left open overnight doesn't keep the compute awake: starting a live query can wake it, but holding the subscription doesn't. You don't pay for compute while it's suspended ([Realtime FAQ](/docs/realtime/overview#frequently-asked-questions)).

For an internal dashboard, sign-in can live in the same project with [Managed Better Auth](/docs/auth/overview). Your API verifies the session and seals each tile's query for that user, as the [Next.js](/docs/realtime/examples/nextjs) and [TanStack](/docs/realtime/examples/tanstack) examples show.

<Admonition type="note" title="Beta scope">
Realtime is free during the beta. Compute that a live query wakes and outbound data transfer still bill as usual. It's available in AWS us-east-1, us-east-2, eu-central-1, and ap-southeast-1, and the beta makes no performance guarantees ([what's in the beta](/docs/realtime/overview#frequently-asked-questions)).
</Admonition>

<CTA title="Make a dashboard live" description="Enable Realtime on a branch and subscribe to your first aggregate query." buttonText="Realtime quickstart" buttonUrl="/docs/realtime/quickstart" />
