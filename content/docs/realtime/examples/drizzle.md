---
title: '[TBC] Drizzle'
subtitle: 'TBC'
summary: >-
  TBC. TBC. TBC. TBC.
enableTableOfContents: true
isDraft: true
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. TBC.

## Prerequisites

- Drizzle ORM 0.45.2 or a later 0.45.x
- `NEON_REALTIME_SECRET`, server-only, never in a browser bundle
- TBC

<Steps>

## [TBC] configure-the-adapter

Lorem ipsum dolor sit amet, consectetur adipiscing elit. TBC.

```ts
// TBC. This fence must show:
// - import specifier: @neon/realtime/server
// - drizzleAdapter(): RealtimeAdapter<ConcretePgSelectQuery>
// - createRealtime<Query>({ secret, db, adapter }): RealtimeServer<Query>
// - RealtimeServerOptions<Query>: secret and db required, adapter optional
// - secret read from NEON_REALTIME_SECRET, server-only
// - Drizzle ORM 0.45.2 or a later 0.45.x
```

## [TBC] build-the-live-query-with-drizzle

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod. TBC.

```ts
// TBC. This fence must show:
// - import specifier: @neon/realtime/server
// - the query built with the Drizzle query builder the app already uses
// - a concrete Drizzle PostgreSQL select, ConcretePgSelectQuery
// - values kept as PostgreSQL bind parameters, type OIDs inferred from Drizzle's encoders
// - result fields derived from directly selected columns
// - realtime.seal({ query }): Promise<SealedLiveQuery<Row>>
// - drizzleParsers from @neon/realtime-drizzle/client (optional, for custom type handling)
```

<Admonition type="tip" title="Column names and casing">
The Drizzle adapter requires each selected key to match the column name Postgres returns, and it rejects a query that doesn't. The schema's snake_case keys mean nothing needs renaming here. If you rename or compute a field, give it a matching SQL alias, as in ``message_id: sql<number>`${messages.id}`.as("message_id")``.
</Admonition>

</Steps>

## Next steps

- [[TBC] tanstack](/docs/realtime/examples/tanstack): TBC
- [[TBC] api](/docs/realtime/reference/api): TBC
- [[TBC] guides/queries](/docs/realtime/guides/queries): TBC

<NeedHelp/>
