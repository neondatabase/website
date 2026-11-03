---
title: "How do I migrate from Electric to Neon Realtime?"
subtitle: "Neon Realtime (public beta) is built by the team behind Electric and is a drop-in replacement for Electric's role in your stack. Shapes become live SQL queries, your auth proxy becomes a sealing endpoint, and electricCollectionOptions() becomes realtimeCollectionOptions()."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-03T23:21:47.530Z'
isDraft: false
previousLink:
  title: 'Is there a managed alternative to running PostgREST myself?'
  slug: managed-postgrest-alternative
nextLink:
  title: 'How do I move a supabase-js app to another backend without rewriting my queries?'
  slug: move-supabase-js-app-without-rewriting-queries
---

Move to [Neon Realtime](/docs/realtime/overview) (public beta). The Electric team [joined Neon](/blog/electric-joins-neon) and built Realtime from what they learned building Electric. Realtime isn't based on Electric's code, but it's a drop-in replacement for Electric's role, and Neon recommends that teams using Electric migrate ([Realtime FAQ](/docs/realtime/overview#frequently-asked-questions), [launch post](/blog/neon-now-has-realtime)).

## What maps to what

| In Electric                                      | In Neon Realtime                                                                                           |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Shape (table, `where`, `columns`)                | [Live SQL query](/docs/realtime/guides/queries#defining-live-queries), raw SQL, Drizzle, or Kysely         |
| Auth proxy or gatekeeper in front of `/v1/shape` | [Sealing endpoint](/docs/realtime/guides/queries#exposing-an-endpoint) that authorizes and seals the query |
| `electricCollectionOptions()` in TanStack DB     | [`realtimeCollectionOptions()`](/docs/realtime/sdks/typescript#tanstack-db) from `@neon/realtime-tanstack` |
| Electric service you run next to Postgres        | Realtime enabled on the branch with `neon realtime enable`                                                 |
| Writes through your API                          | Writes through your API, returning a txid for [`awaitTxId()`](/docs/realtime/guides/mutations)             |

## Shapes become live queries

An Electric shape syncs rows from a single table. You can filter with subqueries against other tables, but the shape only contains rows from the root table, so related data comes from more shapes joined in the client ([Electric shapes](https://electric.ax/docs/guides/shapes)). A Realtime live query is any read-only, deterministic `SELECT`, so the join, aggregate, `ORDER BY`, and `LIMIT` move into the query itself. Two restrictions to check when you port: no non-deterministic functions such as `now()`, and every table needs a stable replica identity, which a primary key provides ([table requirements](/docs/realtime/guides/queries#table-requirements)).

## Your auth proxy becomes a sealing endpoint

Electric serves shapes over HTTP and recommends authorizing them with a proxy or gatekeeper in your stack ([Electric auth](https://electric.ax/docs/guides/auth)). With Realtime, the request handler that used to proxy shape requests authenticates the user, builds the query with parameters from the session, and seals it. The browser gets a short-lived, encrypted capability that it can subscribe to but not read or change, and the Live SQL API verifies it without calling your server ([sealing queries](/docs/realtime/guides/queries#sealing-queries)). Sealed queries expire after 60 seconds, so pass a `refreshQuery` function to the React or TanStack DB bindings and they renew for you ([renewing](/docs/realtime/guides/queries#renewing-sealed-queries)).

## TanStack DB collections

If you use TanStack DB, swap the collection options and keep your components. `realtimeCollectionOptions()` takes a client, a sealed query, a `refreshQuery` function, and the same `onInsert`, `onUpdate`, and `onDelete` handlers. Each handler writes through your backend, gets back the transaction ID from `pg_current_xact_id()`, and waits for it with `collection.utils.awaitTxId()`, so optimistic state drops only once the change has synced ([optimistic mutations with TanStack DB](/docs/realtime/guides/mutations#with-tanstack-db-collections)).

## Retire the sync service

Electric on Neon runs as a separate service, for example in Docker, connected over a direct, unpooled connection ([Electric guide](/guides/electric-sql)). Realtime runs inside Lakebase Postgres: enable it on the branch, pull `NEON_REALTIME_URL` and `NEON_REALTIME_SECRET` with `neon env pull --service realtime`, and there's nothing else to deploy ([quickstart](/docs/realtime/quickstart)). It's enabled per branch, child branches inherit it, subscribers don't use database connections, and open subscriptions don't keep the compute awake ([Realtime FAQ](/docs/realtime/overview#frequently-asked-questions)).

Vendor details verified on 2026-11-02 against the linked pages.

<Admonition type="note" title="Beta scope">
Realtime is free during the beta. Compute that a live query wakes and outbound data transfer still bill as usual. It's available in AWS us-east-1, us-east-2, eu-central-1, and ap-southeast-1, with support expanding toward [all regions](/docs/introduction/regions), doesn't support row-level security yet, and makes no performance guarantees. The SDK APIs and transport protocol can still change, so use the SDKs rather than the Live SQL API directly ([what's in the beta](/docs/realtime/overview#frequently-asked-questions), [TypeScript SDK](/docs/realtime/sdks/typescript)).
</Admonition>

<CTA title="Start your migration" description="Enable Realtime on a branch and port your first shape to a live query." buttonText="Realtime quickstart" buttonUrl="/docs/realtime/quickstart" />
