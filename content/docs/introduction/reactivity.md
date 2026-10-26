---
title: 'Reactivity'
subtitle: 'Build reactive apps with end-to-end, type-safe live queries and optimistic mutations.'
summary: >-
  Realtime's reactive client primitives bind live SQL queries to your app state, with type-safe useLiveQuery hooks, TanStack DB collections and optimistic mutations on standard Postgres.
enableTableOfContents: true
---

A reactive app updates itself when its data changes. Your components declare the data they need, and the system keeps that data in sync, so there's no fetch-and-refresh code to write.

[Realtime](/docs/realtime/overview) builds this on [live SQL queries](/docs/introduction/live-sql-queries). Its reactive client primitives bind each live query to your application state, end to end and type-safe, on standard Lakebase Postgres.

## Reactive client primitives

- **Type-safe live queries:** `useLiveQuery` binds a sealed query to your component state, with the row type carried from your backend query.
- **TanStack DB collections:** sync a live query into a [TanStack DB](https://tanstack.com/db/latest/docs/overview) collection for more advanced client-side data management.
- **Optimistic mutations:** apply writes locally first for instant feedback. The synced result replaces the optimistic state once the write lands.

## Bind a live query to a component

In a React app, `useLiveQuery` binds a sealed query to your component, optionally starting from `initialData` loaded during SSR:

```tsx filename="YourApp.tsx"
import { useLiveQuery } from "@neon/realtime-react"
import type { SealedLiveQuery } from "@neon/realtime/client"

interface Props {
  sealedQuery: SealedLiveQuery<Message>
  initialData?: Message[]
}

export function Messages({ sealedQuery, initialData }: Props) {
  const { data } = useLiveQuery(sealedQuery, { initialData })

  return (
    <ul>
      {data.map((message) => (
        <li key={message.id}>{message.body}</li>
      ))}
    </ul>
  )
}
```

The component re-renders whenever a write changes the query's results.

## Next steps

- [Client-side reactivity](/docs/realtime/guides/reactivity): bind live queries to your app state
- [Optimistic mutations](/docs/realtime/guides/mutations): apply writes locally while they sync
- [Next.js example](/docs/realtime/examples/nextjs): build a reactive app with Next.js and SSR
- [TanStack example](/docs/realtime/examples/tanstack): build a reactive app with TanStack Start and DB
- [TypeScript SDK](/docs/realtime/sdks/typescript): reference for the React and TanStack DB integrations
