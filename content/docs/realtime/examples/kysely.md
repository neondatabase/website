---
title: '[TBC] Kysely'
subtitle: 'TBC'
summary: >-
  TBC. TBC. TBC. TBC.
enableTableOfContents: true
isDraft: true
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. TBC.

## Prerequisites

- `NEON_REALTIME_SECRET`, server-only, never in a browser bundle
- TBC

<Steps>

## [TBC] build-the-live-query-with-kysely

Lorem ipsum dolor sit amet, consectetur adipiscing elit. TBC.

```ts
// kyselyAdapter() from @neon/realtime-kysely (peer kysely >=0.28.17 <0.30.0). The extension
// point is the adapter contract below.
// This fence must show:
// - import specifier: @neon/realtime/server
// - a RealtimeAdapter<Query> whose prepare(query) returns a PreparedLiveQuery
// - or the no-adapter path: rawSql<Row>(query: PreparedLiveQuery): RawSqlQuery<Row>
// - one parameterized SELECT, runtime values never interpolated into the SQL string
```

</Steps>

## [TBC] adapter-contract

The backend can encode the core PostgreSQL built-in parameter types and arrays.
The browser currently decodes selected `integer` and `text` columns.
Database-specific enums, domains, extension types, computed expressions, and
unsupported result codecs require an explicit `rawSql()` descriptor or future
adapter work.

```ts
// TBC. This fence must show:
// - import specifier: @neon/realtime/server
// - interface RealtimeAdapter<Query> with prepare: (query: Query) => PreparedLiveQuery
// - PreparedLiveQuery members: sql, parameters, columns, resultFields
// - rawSql<Row>() as the no-adapter path, its descriptor snapshotting caller-owned arrays and
//   byte values
// - LiveQueryResultField.kind is 'string' or 'int4' and nothing else, so enums, domains,
//   extension types, computed expressions and unsupported result codecs need an explicit
//   rawSql() descriptor or future adapter work
```

## Next steps

- [[TBC] tanstack](/docs/realtime/examples/tanstack): TBC
- [[TBC] api](/docs/realtime/reference/api): TBC
- [[TBC] guides/queries](/docs/realtime/guides/queries): TBC

<NeedHelp/>
