---
title: '[TBC] nextjs'
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
- TBC

<Steps>

## [TBC] create-the-client

Lorem ipsum dolor sit amet, consectetur adipiscing elit. TBC.

```ts
import {
  createRealtimeClient,
  type SealedLiveQuery,
} from "@neon/realtime/client";

const client = createRealtimeClient({ url: "wss://realtime.neon.tech/..." });
```

## [TBC] Authentication

Lorem ipsum dolor sit amet, consectetur adipiscing elit. TBC.

## [TBC] seal-and-fetch-initial-rows

A route loader, Server
Component, or parent obtains the initial sealed query; the hook does not fetch
it itself.

```ts
// TBC. This fence must show:
// - import specifier: @neon/realtime/server
// - createRealtime<Query>({ secret, db }): RealtimeServer<Query>, server-only, secret from
//   NEON_REALTIME_SECRET, db the PostgreSQL database name
// - the query built once and used twice in the same render pass
// - the initial rows read from that query
// - realtime.seal({ query }): Promise<SealedLiveQuery<Row>>
// - seal() does local Web Crypto work and no network I/O, and the secret, the SQL and the
//   parameters never enter browser-readable sealedQuery metadata
```

## [TBC] provide-the-client

`RealtimeProvider` receives an already-created client and does not configure the
backend or obtain sealed queries. Create one client for the browser application
and close it only when the application itself is disposed.

```tsx
import {
  RealtimeProvider,
  useLiveQuery,
} from "@neon/realtime-react";

export function Root({ children }: { children: React.ReactNode }) {
  return <RealtimeProvider client={client}>{children}</RealtimeProvider>;
}

// TBC. This fence must also show:
// - the SealedLiveQuery<Row> and the initial rows passed through to the client
// - SealedLiveQuery<Row> carries the inferred row type as phantom TypeScript
//   information, so Hono RPC, tRPC, ts-rest or a shared type-only export preserve it across the
//   HTTP boundary with no code generation
```

## [TBC] read-in-a-component

For SSR, pass the server-executed rows as `initialData`. React renders them
immediately as stale data and Realtime's first authoritative reset reconciles
changes made since the server read.

```tsx
interface MessagesProps {
  channelId: string
  sealedQuery: SealedLiveQuery<Message>
  initialRows?: readonly Message[]
}

export function Messages(props: MessagesProps) {
  const { data, status, error, utils } = useLiveQuery(props.sealedQuery, {
    initialData: props.initialRows,
    refreshQuery: () => sealMessages(props.channelId)
  })

  useEffect(() => utils.onBatch((_changes, batch) => {
    console.debug("Applied transaction", batch.txids)
  }), [utils])

  if (data === undefined) return <p>Loading…</p>
  if (error) return <p>{error.message}</p>

  return (
    <>
      {status === "stale" && <p>Updating…</p>}
      <ul>{data.map((message) => <li key={message.id}>{message.body}</li>)}</ul>
    </>
  )
}

// TBC. This fence must also show:
// - useLiveQuery<Row>(sealedQuery: SealedLiveQuery<Row>, options:
//   UseLiveQueryOptions<Row> = {}): UseLiveQueryResult<Row>, with O6 open on whether options is
//   optional
// - the LiveQueryState values: connecting, live, stale, error, closed
```

</Steps>

## [TBC] show-off-example

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. TBC.

```tsx
// TBC. Human work. Do not fill this in from the context docs.
// This fence must show:
// - import specifiers: @neon/realtime/server on the server and @neon/realtime-react in the
//   component
// - one server render pass that produces both the sealedQuery and the initial rows
// - the same query reused for both
// - a client component reading the live rows with useLiveQuery
// - the initialData rows reporting status stale until the first reset makes it live
```

## Next steps

- [[TBC] sdks/typescript#react](/docs/realtime/sdks/typescript#react): TBC
- [[TBC] guides/queries](/docs/realtime/guides/queries): TBC
- [[TBC] tanstack](/docs/realtime/examples/tanstack): TBC

<NeedHelp/>
