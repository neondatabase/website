---
title: '[TBC] tanstack'
subtitle: 'TBC'
summary: >-
  TBC. TBC. TBC. TBC.
enableTableOfContents: true
isDraft: true
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. TBC.

## Prerequisites

- TBC
- TBC
- TBC

<Steps>

## [TBC] Authentication

Lorem ipsum dolor sit amet, consectetur adipiscing elit. TBC.

## [TBC] define-the-collection

`client`, `query`, and `getKey` are required. TanStack collections are
keyed sets, so `getKey` must return a stable unique key for every query row. The
config also accepts standard collection options such as `id`, `schema`, garbage
collection, collation, and mutation handlers.

```ts
import { createRealtimeClient } from "@neon/realtime/client"
import { realtimeCollectionOptions } from "@neon/realtime-tanstack"
import { createCollection } from "@tanstack/db"

const client = createRealtimeClient({ url: "wss://realtime.neon.tech/..." })
const query = await sealTodos()

export const todos = createCollection(realtimeCollectionOptions({
  id: "todos",
  client,
  query,
  refreshQuery: sealTodos,
  getKey: (todo) => todo.id
}))
```

## [TBC] read-with-a-live-query

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod. TBC.

```tsx
// TBC. This fence must show:
// - import specifier: @neon/realtime-tanstack
// - a live query over the collection
// - the state mapping: connecting is loading, live is ready, stale stays ready, error is error
// - version 1 exposes no extra stale flag through the collection
```

## [TBC] write-optimistically

Use TanStack DB's normal `onInsert`, `onUpdate`, and `onDelete` handlers. The
application mutation endpoint returns the PostgreSQL transaction ID captured in
the same database transaction as the write. The handler then explicitly waits
for Realtime to observe it:

```ts
const todos = createCollection(realtimeCollectionOptions({
  id: "todos",
  client,
  query,
  getKey: (todo) => todo.id,
  onUpdate: async ({ transaction, collection }) => {
    const todo = transaction.mutations[0].modified

    const response = await fetch(`/api/todos/${todo.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ completed: todo.completed })
    })

    if (!response.ok) throw new Error("Could not update todo")

    const { txid } = (await response.json()) as { txid: string }
    await collection.utils.awaitTxId(txid)
  }
}))
```

`awaitTxId()` also handles the race where the live transaction arrives before
the HTTP response. It resolves once the matching transaction has entered
TanStack DB's causal sync queue and rejects if its timeout elapses.

The backend must obtain the ID inside the write transaction:

```ts
const result = await db.transaction(async (tx) => {
  const [todo] = await tx.update(todosTable).set(changes).returning()

  const txidResult = await tx.execute<{ txid: string }>(
    sql`select pg_current_xact_id()::text as txid`
  )

  return { todo, txid: txidResult.rows[0]!.txid }
})
```

</Steps>

## [TBC] show-off-example

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. TBC.

```tsx
// TBC. Human work. Do not fill this in from the context docs.
// This is the advocacy example. This fence must show:
// - import specifier: @neon/realtime-tanstack
// - a live query with a join
// - an aggregate in the same live query
// - optimistic writes confirmed with awaitTxId on a single txid
```

## Next steps

- [[TBC] sdks/typescript#tanstack-db](/docs/realtime/sdks/typescript#tanstack-db): TBC
- [[TBC] sdks/typescript#client](/docs/realtime/sdks/typescript#client): TBC
- [[TBC] query-builders](/docs/realtime/overview): TBC

<NeedHelp/>
