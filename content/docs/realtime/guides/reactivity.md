---
title: 'Client-side reactivity'
subtitle: 'Bind live queries to component and agent state.'
summary: >-
  Bind live queries to React component state with useLiveQuery, change their parameters and handle errors, or sync a broader live query into a TanStack DB collection and derive instant, local queries from it.
enableTableOfContents: true
---

Build reactive apps and agents using higher-level reactivity primitives that manage live query [subscriptions](./subscribing) for you.

<Admonition type="important" title="Framework support">
Realtime [currently](#other-frameworks) has integrations for [React](#react) and [TanStack&nbsp;DB](#tanstack-db).

The [React binding](#react) keeps a component's state in step with a live query, and the [TanStack&nbsp;DB binding](#tanstack-db) syncs live queries into a [reactive client-side store](https://tanstack.com/db).
</Admonition>

This page continues the running example from the [queries](./queries) and [subscribing](./subscribing) guides. It uses the `client` from `frontend/client.ts` and `fetchSealedMessages()` from `frontend/api.ts`.

## React

The `@neon/realtime-react` binding exports a [`RealtimeProvider`](../sdks/typescript#react-realtimeprovider), a [`useLiveQuery()` hook](../sdks/typescript#react-uselivequery) and a [`useRealtimeClient()` hook](../sdks/typescript#react-userealtimeclient) that returns the provider's client. It works with React 18 and 19.

Install it alongside the client SDK:

```bash filename="Terminal"
npm install @neon/realtime-react
```

### RealtimeProvider

Wrap your app in `<RealtimeProvider>`. This allows all of your `useLiveQuery()` subscriptions to use the same [`RealtimeClient`](../sdks/typescript#client-realtimeclient) and WebSocket connection.

```tsx filename="frontend/main.tsx"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RealtimeProvider } from "@neon/realtime-react"

import { client } from "./client"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RealtimeProvider client={client}>
      {/* Your app here */}
    </RealtimeProvider>
  </StrictMode>
)
```

`client` is the module singleton from `frontend/client.ts`, created once for the whole app. If you render on the server, create the client in the browser instead, as the [server-side rendering guide](./ssr#open-the-connection-in-the-browser) explains.

### useLiveQuery

[`useLiveQuery()`](../sdks/typescript#react-uselivequery) takes a `sealedQuery` and a `refreshQuery` (and, optionally, [`initialData` from SSR](./ssr)) and returns the query's current rows and state.

For example, here we define a `Messages` component with `useLiveQuery`:

```tsx filename="frontend/Messages.tsx"
import { useEffect } from "react"
import { useLiveQuery } from "@neon/realtime-react"
import type { SealedLiveQuery } from "@neon/realtime/client"

import type { Message } from "../backend/schema"
import { LocalTime } from "./LocalTime"

interface Props {
  sealedQuery: SealedLiveQuery<Message>;
  refreshQuery: () => Promise<SealedLiveQuery<Message>>;
  initialData?: readonly Message[];
}

export function Messages({ sealedQuery, refreshQuery, initialData }: Props) {
  const { data, status, error, utils } = useLiveQuery(sealedQuery, { refreshQuery, initialData })

  useEffect(() => {
    return utils.onBatch((changes, batch) => {
      console.debug(`Applied ${changes.length} changes from transactions ${batch.txids.join(", ")}`)
    })
  }, [utils])

  if (status === "error") {
    return <p role="alert">Live updates stopped: {error.message}</p>
  }

  if (data === undefined) {
    return <p>Loading messages</p>
  }

  return (
    <section>
      {status === "stale" && <p role="status">Updating</p>}
      <ul>
        {data.map((message) => (
          <li key={message.id}>
            <LocalTime date={message.created_at} />
            <p>{message.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
```

Which uses this `LocalTime` component to format the time [after hydration](./ssr#keep-row-shapes-identical):

```tsx filename="frontend/LocalTime.tsx"
import { useEffect, useState } from "react"

export function LocalTime({ date }: { date: Date }) {
  const [formatted, setFormatted] = useState<string>()
  useEffect(() => setFormatted(date.toLocaleTimeString()), [date])

  return <time dateTime={date.toISOString()}>{formatted}</time>
}
```

`useLiveQuery` subscribes when the component mounts, re-renders it whenever the results change and unsubscribes when it unmounts.

In this example, the sealed query is a `SealedLiveQuery<Message>`, so `data` is a `readonly Message[]`, with `created_at` decoded to a `Date`. It's `undefined` until the first result arrives. `status` is the subscription's [state](./subscribing#listen-for-changes): the component shows a loading line until the first result and a small indicator while it's `stale`.

#### refreshQuery

`refreshQuery` is how the `useLiveQuery` hook [renews the sealed query](./subscribing#renew-the-sealed-query).

Sealed queries are [short-lived](./queries#renewing-sealed-queries), so the hook calls it 10 seconds before `expiresAt`. If a call fails, the hook retries every second until one succeeds. The callback has to return a sealed query for the same exact query, so `Channel` builds it from the same `channelId` the sealed query was sealed with, as [changing query parameters](#changing-query-parameters) shows. Changing only the callback doesn't restart the subscription, and `useCallback` keeps it stable across renders. Without `refreshQuery`, nothing renews the sealed query, and the rows go `stale` when it expires.

#### initialData

The hook also accepts an optional `initialData` parameter, for example from a server render. See the [server-side rendering guide](./ssr#render-the-initial-rows-straight-away) for more details.

#### utils

The `utils` in the return value give you access to the hook's underlying [materialized subscription](../sdks/typescript#react-uselivequeryutils).

This provides `getSnapshot()`, `getState()`, `awaitRows()`, the `onChange`, `onReset`, `onBatch` and `onStateChange` listeners, `renew()` and `awaitTxId()`. It's stable for the life of the subscription, so register listeners in an effect and return the remover, as the `onBatch` listener does.

Note that a batch has already been applied by the time its listener runs, and it [carries the txids](../sdks/typescript#client-livequerybatchinfo) of the transactions in it, which the [mutations guide](./mutations#how-optimistic-mutations-work) uses to confirm optimistic writes.

`utils` omits `unsubscribe()`, because React owns cleanup. The hook unsubscribes when the component unmounts or its sealed query changes. `getState()` and the listeners report the state of the underlying subscription, so they can differ from the hook's `status`.

### Changing query parameters

The hook takes a sealed query, not parameters. Parameters are sealed into the query on the server, where the client can't change them. To show a different channel, fetch a new sealed query for it and pass that in. A new `sealedQuery` is a new logical subscription: the hook cleans up the old one and subscribes to the new one.

Fetch the sealed query in the component that owns the parameter. `useSealedQuery()` fetches one whenever `channelId` changes, and `Channel` renders `Messages` once it has one:

```tsx filename="frontend/Channel.tsx"
import { useCallback, useEffect, useState } from "react"
import type { SealedLiveQuery } from "@neon/realtime/client"

import type { Message } from "../backend/schema"
import { fetchSealedMessages } from "./api"
import { Messages } from "./Messages"

interface SealedChannel {
  channelId: number;
  sealedQuery?: SealedLiveQuery<Message>;
  error?: unknown;
}

function useSealedQuery(channelId: number): SealedChannel | undefined {
  const [sealed, setSealed] = useState<SealedChannel>()

  useEffect(() => {
    let cancelled = false

    fetchSealedMessages(channelId).then(
      (sealedQuery) => {
        if (!cancelled) setSealed({ channelId, sealedQuery })
      },
      (error: unknown) => {
        if (!cancelled) setSealed({ channelId, error })
      }
    )

    return () => {
      cancelled = true
    }
  }, [channelId])

  // Never hand the previous channel's sealed query to the new channel
  return sealed?.channelId === channelId ? sealed : undefined
}

export function Channel({ channelId }: { channelId: number }) {
  const sealed = useSealedQuery(channelId)
  // Renewals must be for the same query, so refresh with the same channel
  const refreshQuery = useCallback(() => fetchSealedMessages(channelId), [channelId])

  if (sealed?.sealedQuery) {
    return <Messages sealedQuery={sealed.sealedQuery} refreshQuery={refreshQuery} />
  }

  if (sealed?.error) {
    return <p role="alert">Couldn't open this channel</p>
  }

  return <p>Loading messages</p>
}
```

When the channel changes, `sealed` still holds the previous channel's sealed query until the new one arrives. Without the `channelId` check, `Messages` would get the old channel's sealed query with a `refreshQuery` for the new channel. That `refreshQuery` would then fetch the new channel's query to renew the old subscription, and the renewal would be rejected with status `error`. The `cancelled` flag covers a second race. It drops a response that arrives after the channel has changed, or after Strict Mode's extra effect run in development.

### Handling errors

`useLiveQuery()` doesn't throw for subscription errors, and it doesn't suspend. It reports everything through `status`. Render loading and error states from it, as `Messages` does. The hook throws only when it's used outside a `<RealtimeProvider>`, when the sealed query is malformed or when the client is closed. Those errors reach the nearest error boundary, not `status`.

A failed renewal doesn't end in `error`. If your endpoint can't return a sealed query, for example because the user has signed out and it answers 401, the hook keeps retrying and the status stays `stale`. So drive sign-out from your auth state: when the user signs out, unmount the components that subscribe. The status becomes `error` only when a renewal returns a malformed response or a sealed query for a different query. To recover, fetch a new sealed query and pass it in.

As with a parameter change, the new sealed query restarts the subscription. The [subscribing guide](./subscribing#handle-errors) covers recovery at the subscription level.

## TanStack DB

Each `useLiveQuery()` above subscribes to one sealed query, so each view of the data needs its own sealed query and its own round trip to your server.

With [TanStack&nbsp;DB](https://tanstack.com/db/latest/docs/overview), you can oversync a broader live query into a client-side collection, such as every message in every channel the user belongs to, and then derive as many local live queries from it as you need: [filters, sorts and joins across collections](https://tanstack.com/db/latest/docs/guides/live-queries).

Install the TanStack binding and TanStack&nbsp;DB's React package:

```bash filename="Terminal"
npm install @neon/realtime-tanstack @tanstack/react-db
```

### Seal a broader query

Add `inboxQuery()` to `backend/queries.ts`. It's `messagesQuery()`, with the same membership join but no channel filter. So it returns the newest 500 messages across every channel that the user belongs to:

```ts filename="backend/queries.ts"
export function inboxQuery(userId: string) {
  return db
    .select(getTableColumns(messages))
    .from(messages)
    .innerJoin(channelMembers, eq(channelMembers.channel_id, messages.channel_id))
    .where(eq(channelMembers.user_id, userId))
    .orderBy(desc(messages.created_at))
    .limit(500)
}
```

Then expose it. In `backend/server.ts`, import `inboxQuery` alongside `messagesQuery` and chain one more route onto the app. It takes no body, because its only parameter comes from the verified token:

```ts filename="backend/server.ts"
  .post("/api/v1/inbox/live", async (c) => {
    const user = await requireUser(c)

    const sealedQuery = await realtime.seal({ query: inboxQuery(user.id) })

    return c.json(sealedQuery)
  })
```

### Create the collection

On the frontend, add `fetchSealedInbox()` to `frontend/api.ts`, next to `fetchSealedMessages()`. As before, the `as` restores the row type:

```ts filename="frontend/api.ts"
export async function fetchSealedInbox(): Promise<SealedLiveQuery<Message>> {
  const res = await server.api.v1.inbox.live.$post()

  if (!res.ok) {
    throw new Error(`Could not fetch the inbox query (${res.status})`)
  }

  return (await res.json()) as SealedLiveQuery<Message>
}
```

Then create the collection. `realtimeCollectionOptions()` takes the standard TanStack&nbsp;DB collection options plus the Realtime client and a sealed query, and returns options for `createCollection()`:

```ts filename="frontend/collections.ts"
import { createCollection } from "@tanstack/react-db"
import { realtimeCollectionOptions } from "@neon/realtime-tanstack"
import type { SealedLiveQuery } from "@neon/realtime/client"

import type { Message } from "../backend/schema"
import { fetchSealedInbox } from "./api"
import { client } from "./client"

export function createMessagesCollection(sealedQuery: SealedLiveQuery<Message>) {
  return createCollection(
    realtimeCollectionOptions({
      id: "messages",
      client,
      query: sealedQuery,
      refreshQuery: fetchSealedInbox,
      getKey: (message) => message.id
    })
  )
}

export type MessagesCollection = ReturnType<typeof createMessagesCollection>
```

`getKey` returns each message's primary key. TanStack&nbsp;DB keys rows by it, so use a stable, unique column, never a subscription's `rowId`. `refreshQuery` renews the sealed query the same way [the React hook does](#refreshquery). While renewals fail, the collection stays `ready` with its last rows. See the [`realtimeCollectionOptions()` reference](../sdks/typescript#tanstack-db-realtimecollectionoptions) for the rest of the options.

The collection starts syncing as soon as a live query using it is mounted. It's in the `loading` state until the first result arrives, and `ready` from then on, with each committed transaction applied atomically. A `ready` collection stays ready while the subscription is `stale`, so there's no stale flag to render. If the subscription ends in `error`, so does the collection.

### Query the collection

Create the collection once, when the app starts. It takes the Realtime client directly, so this version of `frontend/main.tsx` doesn't need `<RealtimeProvider>`:

```tsx filename="frontend/main.tsx"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { fetchSealedInbox } from "./api"
import { createMessagesCollection } from "./collections"
import { Inbox } from "./Inbox"

const messagesCollection = createMessagesCollection(await fetchSealedInbox())

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Inbox messagesCollection={messagesCollection} channelId={2} />
  </StrictMode>
)
```

Then read from it with TanStack's own `useLiveQuery()`. It shares a name with the Realtime hook, so import it under an alias that won't clash in an app that uses both. This view shows one channel, newest first:

```tsx filename="frontend/Inbox.tsx"
import { eq, useLiveQuery as useCollectionQuery } from "@tanstack/react-db"

import type { MessagesCollection } from "./collections"

interface Props {
  messagesCollection: MessagesCollection;
  channelId: number;
}

export function Inbox({ messagesCollection, channelId }: Props) {
  const { data, isReady, isError } = useCollectionQuery({
    query: (q) =>
      q
        .from({ message: messagesCollection })
        .where(({ message }) => eq(message.channel_id, channelId))
        .orderBy(({ message }) => message.created_at, "desc")
  })

  if (isError) {
    return <p role="alert">Couldn't sync messages</p>
  }

  if (!isReady) {
    return <p>Loading messages</p>
  }

  return (
    <ul>
      {data.map((message) => (
        <li key={message.id}>{message.body}</li>
      ))}
    </ul>
  )
}
```

Pass a different `channelId` and the query re-runs in the browser, against the rows the collection already holds. Local queries only see what the collection holds, so a channel whose messages fall outside the newest 500 shows fewer rows, or none. There's no new sealed query and no round trip to your server, unlike [changing the parameters](#changing-query-parameters) of a `useLiveQuery()` hook. Every view you add, like an unread count or a search across channels, is another local query over the same synced rows.

For server rendering, the [server-side rendering guide](./ssr#with-tanstack-db) seeds a collection on the server and hydrates it in the browser, and the [TanStack example](../examples/tanstack) builds a full app with TanStack&nbsp;Start.

### Manage optimistic state

Once you have a TanStack DB collection defined, you can also use it for local optimistic writes. It's often easier in a complex app to normalize data loading into a collection which can have optimistic state applied to it once, than to have to remember to apply optimistic state to a range of different live query subscriptions.

For writes through the collection, with optimistic state, see the [mutations guide](./mutations#with-tanstack-db-collections).

## Other frameworks

Bindings for other frameworks are coming. Until then, you can use the current implementations as a reference to write your own.

The React binding is a thin layer over the client subscription: `useSyncExternalStore` plus the [`QueryRefreshController`](../sdks/typescript#client-queryrefreshcontroller). Point a coding agent at [its source](https://github.com/neondatabase/neon-pkgs/tree/main/packages/realtime-react) and it can reproduce the binding for other frameworks, such as Solid, Svelte or Vue.

You can also see the [source code for the TanStack DB collection here](https://github.com/neondatabase/neon-pkgs/blob/main/packages/realtime-tanstack/src/collection-options.ts).

<NeedHelp/>
