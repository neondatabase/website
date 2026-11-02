---
title: "Is there a Supabase Realtime alternative that supports live queries with joins and aggregates?"
subtitle: "Neon Realtime (public beta) subscribes to any read-only, deterministic SQL query on Lakebase Postgres, joins, aggregates, ordering, and limits included. Supabase Postgres Changes streams row events per table with column filters, and your app rebuilds the view."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-02T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'How do I subscribe to a Postgres query and get its results live as the data changes?'
  slug: subscribe-to-postgres-query-live-results
nextLink:
  title: 'How do I test a different LLM model on a preview branch before switching production?'
  slug: test-different-llm-model-preview-branch
---

Yes. [Neon Realtime](/docs/realtime/overview) (public beta) is a sync engine for live SQL. You subscribe to the query your screen shows, such as a join with a `GROUP BY`, and Realtime keeps that result in sync with Lakebase Postgres as writes commit ([defining live queries](/docs/realtime/guides/queries#defining-live-queries)). Supabase Realtime is built around a different model: messages and row change events pushed to channels.

## The difference in one query

Say the sidebar shows each channel you belong to with its unread count. With Neon Realtime, that's one live query ([launch post](/blog/neon-now-has-realtime)):

```sql
SELECT c.id, c.name, count(m.id) AS unread
  FROM memberships mb
  JOIN channels c ON c.id = mb.channel_id
  LEFT JOIN messages m
    ON m.channel_id = c.id AND m.created_at > mb.last_read_at
 WHERE mb.user_id = $1
 GROUP BY c.id, c.name
 ORDER BY c.name
```

With Supabase Postgres Changes, a client subscribes to `INSERT`, `UPDATE`, or `DELETE` events on a schema or table and can filter each subscription with `column=operator.value` expressions such as `channel_id=eq.7` or `status=in.(open,pending)`, combined with `AND` ([Postgres Changes](https://supabase.com/docs/guides/realtime/postgres-changes#available-filters)). To keep the unread count right, the client subscribes to `messages` and `memberships`, applies each event, and recomputes the count or refetches it.

## Supabase Realtime, from its docs

- **Three features:** Broadcast for low-latency messages between clients, Presence for tracking who's online, and Postgres Changes for database change events ([Realtime](https://supabase.com/docs/guides/realtime)).
- **Filters, not queries:** Postgres Changes filters on column values and can select a subset of columns. Filtering `DELETE` events requires `REPLICA IDENTITY FULL` on the table ([limitations](https://supabase.com/docs/guides/realtime/postgres-changes#limitations)).
- **Scaling:** Postgres Changes runs an authorization check per subscriber for every change and processes changes on a single thread, so larger compute doesn't meaningfully raise its throughput. Above roughly 3,000 concurrent subscribers on the same changes, Supabase recommends broadcasting database changes with triggers instead ([scaling Postgres Changes](https://supabase.com/docs/guides/realtime/postgres-changes#scaling-postgres-changes), [Broadcast from the database](https://supabase.com/docs/guides/realtime/broadcast)).
- **Pricing:** billed on messages and peak connections. Free includes 2 million messages and 200 peak connections. Pro includes 5 million messages, then $2.50 per million, and 500 peak connections, then $10 per 1,000 ([Realtime pricing](https://supabase.com/docs/guides/realtime/pricing)).

Vendor details verified on 2026-11-02 against the linked pages.

## What Neon Realtime does differently

- **Query results, not events.** Any read-only, deterministic `SELECT` works, including window functions and subqueries. Changes arrive as deltas to the result, applied atomically per transaction ([how it works](/docs/realtime/how-it-works#subscriptions-and-consistency)).
- **Live authorization through joins.** Your API seals a query that only matches what the user may see. If the join goes through `channel_members`, removing someone from a channel removes the messages from their result right away ([live authorization](/docs/realtime/guides/queries#live-authorization)).
- **Reactivity built in.** `useLiveQuery` for React, TanStack DB collections, SSR, and optimistic writes that confirm when the transaction ID arrives on the subscription ([reactivity](/docs/realtime/guides/reactivity), [optimistic mutations](/docs/realtime/guides/mutations)).
- **Primary left alone.** The incremental work runs on a replica, subscribers don't use database connections, and open subscriptions don't keep the compute awake, so the database still scales to zero. Realtime is enabled per branch, and child branches inherit it ([Realtime FAQ](/docs/realtime/overview#frequently-asked-questions)).

## Where Supabase is the better fit today

Neon Realtime is in public beta. It's free during the beta (compute that a live query wakes and egress still bill), it runs in four AWS regions, and it doesn't support row-level security yet, so you authorize in your backend before sealing ([what's in the beta](/docs/realtime/overview#frequently-asked-questions)). If your app relies on RLS for realtime access, Supabase checks it on Postgres Changes events, though not on deletes ([receiving old records](https://supabase.com/docs/guides/realtime/postgres-changes#receiving-old-records)). Neon Realtime has no Broadcast or Presence equivalent. For typing indicators or cursors that never touch the database, run a WebSocket server on a [Neon Function](/docs/compute/functions/websockets) next to the same branch.

For a broader comparison of the two backends, see [Neon vs Supabase](/guides/neon-vs-supabase).

<CTA title="Try live SQL" description="Enable Realtime on a branch and subscribe to a join from the terminal." buttonText="Realtime quickstart" buttonUrl="/docs/realtime/quickstart" />
