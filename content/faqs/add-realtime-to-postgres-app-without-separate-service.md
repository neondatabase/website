---
title: "How do I add realtime updates to a Postgres app without running a separate realtime service?"
subtitle: "Neon Realtime (public beta) runs live queries inside Lakebase Postgres, so you keep your schema, ORM, and auth, and there's no second system to mirror the database. It's enabled per branch and doesn't stop the database from scaling to zero."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-03T23:21:47.530Z'
isDraft: false
previousLink:
  title: ''
  slug: ''
nextLink:
  title: 'Which managed Postgres options are affordable for early-stage startups that need a production database but have unpredictable traffic?'
  slug: affordable-managed-postgres-options-startups
---

Use [Neon Realtime](/docs/realtime/overview) (public beta). It installs an incremental live query engine inside Lakebase Postgres that reads logical replication, matches each write to the live queries it affects, and streams the changes to clients through the Live SQL API ([how it works](/docs/realtime/how-it-works)). Your app keeps its existing tables and query code. You enable Realtime on a branch and subscribe to the queries you already run.

## Where bolt-on realtime breaks

Realtime usually lives outside the backend, as a separate service that has to mirror what's in the database. The [launch post](/blog/neon-now-has-realtime) lists where that goes wrong:

- **Drift.** Every change has to reach every client in order and survive dropped connections and reconnects. When that slips, screens quietly show stale data.
- **No shared context.** The realtime service has its own permissions model, its own connections, and no idea which branch it's pointed at, so a preview branch can end up wired to production's realtime.
- **One more system.** Someone, often a coding agent, has to set it up, configure it, and keep it consistent with everything else.

## How Realtime avoids each one

- **No mirror.** Live queries run against the database itself, and each change batch carries the IDs of the transactions it covers and applies atomically, so rows never show a half-applied write ([subscriptions and consistency](/docs/realtime/how-it-works#subscriptions-and-consistency)).
- **Same schema, same ORM.** Any read-only, deterministic `SELECT` works, including joins and aggregates. Tables need a stable replica identity, which a primary key gives you. Drizzle and Kysely have built-in adapters ([defining queries](/docs/realtime/guides/queries#defining-live-queries), [table requirements](/docs/realtime/guides/queries#table-requirements)).
- **Same auth.** Your request handler authenticates the user, builds the query with parameters from the session, and seals it. The sealed query is the authorization, so you reuse your existing middleware, for example [Managed Better Auth](/docs/auth/overview). Row-level security isn't supported yet ([authorization](/docs/realtime/guides/queries#authorization)).
- **Branch-aware.** Realtime is enabled per branch, and child branches of a Realtime-enabled branch have it automatically. A preview branch gets live queries against its own data, with its own URL and secret ([Realtime FAQ](/docs/realtime/overview#frequently-asked-questions)).

## Enable it in an existing app

On a linked branch, enable Realtime and pull its URL and secret into `.env.local` ([quickstart](/docs/realtime/quickstart)):

```bash
neon realtime enable
neon env pull --service realtime
```

If you manage your project with `neon.ts`, declare it instead with `neon config add realtime` and apply it with `neon deploy` ([config reference](/docs/cli/config#add-realtime)). The same file can declare Managed Better Auth, so one config sets up both on every branch you deploy to:

```ts filename="neon.ts"
import { defineConfig } from "@neon/config/v1"

export default defineConfig({
  auth: true,
  preview: { realtime: { allowedOrigins: ["http://localhost:5173"] } }
})
```

`allowedOrigins` limits which browser origins can connect. Without it, any origin can ([`neon realtime enable`](/docs/cli/realtime#enable)).

## What it does to your database

Subscribers connect to the Live SQL API, not to Postgres, so they don't use database connections. The incremental work runs on a replica, which leaves your primary's write latency and throughput alone. Starting a live query can wake a suspended compute, but open subscriptions don't keep it awake, so an idle app still scales to zero ([Realtime FAQ](/docs/realtime/overview#frequently-asked-questions)).

<Admonition type="note" title="Beta scope">
Realtime is free during the beta. Compute that a live query wakes and outbound data transfer still bill as usual. It's available in AWS us-east-1, us-east-2, eu-central-1, and ap-southeast-1, with support expanding toward [all regions](/docs/introduction/regions). The transport protocol isn't stable yet, so use the SDKs rather than the Live SQL API directly ([what's in the beta](/docs/realtime/overview#frequently-asked-questions), [Live SQL API](/docs/realtime/how-it-works#live-sql-api)).
</Admonition>

If you need a custom protocol instead, such as typing indicators that never touch the database, you can run a WebSocket server on a [Neon Function](/docs/compute/functions/websockets) next to the same branch.

<CTA title="Add Realtime to your app" description="Enable Realtime on a branch and subscribe to your first live query." buttonText="Realtime quickstart" buttonUrl="/docs/realtime/quickstart" />
