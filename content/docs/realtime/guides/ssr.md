---
title: 'Server-side rendering'
subtitle: 'Render sealed queries and initial query results on the server.'
summary: >-
  Server-render pages that use live queries. Read and seal the same query for each request, send both to the browser, render the initial rows straight away and let the first reset bring the page live.
enableTableOfContents: true
---

[Server-side rendering (SSR)](https://developer.mozilla.org/en-US/docs/Glossary/SSR) lets a page arrive with its rows already in the HTML, then subscribe to ongoing changes as soon as it hydrates.

Realtime supports SSR, including with [Next.js](../examples/nextjs) and [TanStack&nbsp;Start](../examples/tanstack).

## Return the sealed query and initial results

The pattern is to [build the live query](./queries#defining-live-queries) once and then use it twice in the same request:

1. run the query to get the initial results
2. [seal the query](./queries#sealing-queries) so it can be subscribed to safely on the frontend

Running and sealing the query are both `async`, so do them in parallel using `Promise.all`:

```ts filename="backend/messages-page.ts"
import type { SealedLiveQuery } from "@neon/realtime/server"

import { messagesQuery } from "./queries"
import { realtime } from "./realtime"
import type { Message } from "./schema"

export interface MessagesPageData {
  initialData: Message[];
  sealedQuery: SealedLiveQuery<Message>;
}

// Call this per request. The result belongs to one user and is short-lived.
export async function loadMessagesPage(userId: string, channelId: number): Promise<MessagesPageData> {
  const query = messagesQuery(userId, channelId)

  const [initialData, sealedQuery] = await Promise.all([query, realtime.seal({ query })])

  return { initialData, sealedQuery }
}
```

`messagesQuery()` and `realtime` are the ones from [defining queries](./queries#using-a-query-builder-or-orm). Your Server Component or server function calls `loadMessagesPage()` with the user's id from the [verified auth session](./queries#authorization).

## Send both to the browser

Both values are serializable, so they go into the hydration payload with the rest of the page's props or loader data. The framework serializes them into the HTML it sends, and the browser picks them up when it hydrates.

For example with [Next.js](../examples/nextjs), call `loadMessagesPage()` from a Server Component and pass the results to a Client Component as props. `auth` is the Neon Auth server instance in `lib/auth/server.ts`, set up as in the [Neon Auth Next.js quick start](/docs/auth/quick-start/nextjs-api-only). Neon Auth needs `force-dynamic`, because `auth.getSession()` [reads cookies](/docs/auth/troubleshooting#missing-force-dynamic-on-server-components). If your app enables `cacheComponents`, remove the `dynamic` export and read the session inside a `<Suspense>` boundary instead.

```tsx filename="app/channels/[channelId]/page.tsx"
import { notFound, redirect } from "next/navigation"

import { loadMessagesPage } from "../../../backend/messages-page"
import { auth } from "../../../lib/auth/server"
import { ChannelMessages } from "./ChannelMessages"

export const dynamic = "force-dynamic"

type Props = {
  params: Promise<{ channelId: string }>
}

export default async function MessagesPage({ params }: Props) {
  const { data: session } = await auth.getSession()

  if (!session?.user) {
    redirect("/auth/sign-in")
  }

  const channelId = Number((await params).channelId)

  if (!Number.isInteger(channelId)) {
    notFound()
  }

  const { initialData, sealedQuery } = await loadMessagesPage(session.user.id, channelId)

  return <ChannelMessages channelId={channelId} initialData={initialData} sealedQuery={sealedQuery} />
}
```

`ChannelMessages` is a Client Component. It builds `refreshQuery`, which [renews the sealed query](#renew-from-the-server) through a Route Handler, and renders [`HydratedMessages`](#render-the-initial-rows-straight-away):

```tsx filename="app/channels/[channelId]/ChannelMessages.tsx"
"use client"

import { useCallback } from "react"
import type { SealedLiveQuery } from "@neon/realtime/client"

import type { Message } from "../../../backend/schema"
import { HydratedMessages } from "../../../frontend/HydratedMessages"

interface Props {
  channelId: number;
  initialData: Message[];
  sealedQuery: SealedLiveQuery<Message>;
}

export function ChannelMessages({ channelId, initialData, sealedQuery }: Props) {
  // Renewals must be for the same query, so renew with the same channel
  const refreshQuery = useCallback(async () => {
    const res = await fetch(`/api/messages/${channelId}/live`, { method: "POST" })

    if (!res.ok) {
      throw new Error(`Could not fetch the sealed query (${res.status})`)
    }

    return (await res.json()) as SealedLiveQuery<Message>
  }, [channelId])

  return <HydratedMessages sealedQuery={sealedQuery} refreshQuery={refreshQuery} initialData={initialData} />
}
```

The Route Handler takes the user from the session cookie, not from the request, and validates `channelId`, because the browser controls the URL. Then it seals the same `messagesQuery()` as the page:

```ts filename="app/api/messages/[channelId]/live/route.ts"
import { messagesQuery } from "../../../../../backend/queries"
import { realtime } from "../../../../../backend/realtime"
import { auth } from "../../../../../lib/auth/server"

type Context = {
  params: Promise<{ channelId: string }>
}

export async function POST(_request: Request, { params }: Context) {
  const { data: session } = await auth.getSession()

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const channelId = Number((await params).channelId)

  if (!Number.isInteger(channelId)) {
    return Response.json({ error: "channelId must be an integer" }, { status: 400 })
  }

  const sealedQuery = await realtime.seal({ query: messagesQuery(session.user.id, channelId) })

  return Response.json(sealedQuery, { headers: { "Cache-Control": "no-store" } })
}
```

A server re-render, for example from `router.refresh()` or `revalidatePath()`, sends a new sealed query and initial rows, and the hook restarts its subscription from them.

Or with [TanStack Start](../examples/tanstack), [create server functions](https://tanstack.com/start/latest/docs/framework/react/guide/server-functions) for the loader and the renewal. During SSR, a route loader needs the session from the request's cookies on the server. The queries guide's [bearer-token `authMiddleware`](./queries#using-server-functions) only works for calls from the browser, and Neon Auth's official TanStack&nbsp;Start adapter isn't out yet, so set up the session yourself:

<details>
  <summary>Read the Neon Auth session in TanStack Start</summary>

This setup is built on Neon Auth's beta server toolkit, `@neondatabase/auth/server`. Swap in the official adapter when it ships.

Create the auth server. It reads and sets the session cookies through TanStack&nbsp;Start's request helpers:

```ts filename="src/backend/auth.ts"
import { createAuthServer, extractNeonAuthCookies } from "@neondatabase/auth/server"
import { getRequest, setCookie } from "@tanstack/react-start/server"

export const authConfig = {
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookieSecret: process.env.NEON_AUTH_COOKIE_SECRET! // 32+ characters
}

export const auth = createAuthServer({
  ...authConfig,
  context: () => {
    const request = getRequest()

    return {
      getCookies: () => extractNeonAuthCookies(request.headers),
      setCookie,
      getHeader: (name) => request.headers.get(name),
      getOrigin: () => request.headers.get("origin") ?? new URL(request.url).origin,
      getFramework: () => "tanstack-start"
    }
  }
})
```

Mount Neon Auth's proxy at `/api/auth`, so the session cookie lives on your app's origin:

```ts filename="src/routes/api/auth/$.ts"
import { handleAuthProxyRequest } from "@neondatabase/auth/server"
import { createFileRoute } from "@tanstack/react-router"

import { authConfig } from "../../../backend/auth"

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      ANY: ({ request, params }) =>
        handleAuthProxyRequest({ request, path: params._splat ?? "", ...authConfig })
    }
  }
})
```

`sessionMiddleware` only has a server half, so it reads the session the same way during SSR and for calls from the browser. It puts the user's id on `context`:

```ts filename="src/session-middleware.ts"
import { createMiddleware } from "@tanstack/react-start"

import { auth } from "./backend/auth"

export const sessionMiddleware = createMiddleware({ type: "function" }).server(async ({ next }) => {
  const { data } = await auth.getSession()

  if (!data?.user) {
    throw new Error("Unauthorized")
  }

  return next({ context: { user: { id: data.user.id } } })
})
```

Point the auth client at the proxy. An empty URL makes it use `/api/auth` on the page's origin:

```ts filename="src/frontend/auth.ts"
import { createAuthClient } from "@neondatabase/auth"

export const authClient = createAuthClient("") // same origin: /api/auth
```

</details>

Both server functions use `sessionMiddleware`, so they take the user from the session and only `channelId` from the request:

```tsx filename="src/routes/channels.$channelId.tsx"
import { useCallback } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"

import { loadMessagesPage } from "../backend/messages-page"
import { messagesQuery } from "../backend/queries"
import { realtime } from "../backend/realtime"
import { HydratedMessages } from "../frontend/HydratedMessages"
import { sessionMiddleware } from "../session-middleware"

function validateChannel(data: { channelId: number }) {
  if (!Number.isInteger(data.channelId)) {
    throw new Error("channelId must be an integer")
  }

  return data
}

const loadMessages = createServerFn({ method: "POST" })
  .middleware([sessionMiddleware])
  .validator(validateChannel)
  .handler(({ data, context }) => loadMessagesPage(context.user.id, data.channelId))

const sealMessages = createServerFn({ method: "POST" })
  .middleware([sessionMiddleware])
  .validator(validateChannel)
  .handler(({ data, context }) =>
    realtime.seal({ query: messagesQuery(context.user.id, data.channelId) })
  )

export const Route = createFileRoute("/channels/$channelId")({
  loader: ({ params }) => loadMessages({ data: { channelId: Number(params.channelId) } }),
  component: MessagesRoute
})

function MessagesRoute() {
  const { channelId } = Route.useParams()
  const { initialData, sealedQuery } = Route.useLoaderData()

  // Renewals must be for the same query, so renew with the same channel
  const refreshQuery = useCallback(
    () => sealMessages({ data: { channelId: Number(channelId) } }),
    [channelId]
  )

  return <HydratedMessages initialData={initialData} sealedQuery={sealedQuery} refreshQuery={refreshQuery} />
}
```

<Admonition type="important" title="The sealed query is in your HTML">
Anyone with the page source holds the sealed query until it expires, because [sealed queries are bearer tokens](./queries#sealing-queries). Serve the page over HTTPS, keep it out of shared caches, and keep the sealed query out of URLs and logs.
</Admonition>

## Render the initial rows straight away

Pass the initial rows to [`useLiveQuery()`](./reactivity) as `initialData`. The hook renders them immediately with the status `stale`. When the subscription's first reset arrives, it replaces them atomically and the status becomes `live`. Any change committed between the server read and the subscription is in that reset, so nothing falls into the gap.

Stale rows are real rows. Render them as you would live ones, without a spinner, a loading state or a `stale` indicator. `HydratedMessages` shows the server's rows straight away and swaps in the live rows when the first reset arrives:

```tsx filename="frontend/HydratedMessages.tsx"
"use client"

import { useLiveQuery } from "@neon/realtime-react"
import type { SealedLiveQuery } from "@neon/realtime/client"

import type { Message } from "../backend/schema"
import { LocalTime } from "./LocalTime"

interface HydratedMessagesProps {
  sealedQuery: SealedLiveQuery<Message>;
  refreshQuery: () => Promise<SealedLiveQuery<Message>>;
  initialData: Message[];
}

export function HydratedMessages({ sealedQuery, refreshQuery, initialData }: HydratedMessagesProps) {
  const { data, error } = useLiveQuery(sealedQuery, { refreshQuery, initialData })

  return (
    <>
      {error && <p role="alert">{error.message}</p>}
      <ul>
        {(data ?? initialData).map((message) => (
          <li key={message.id}>
            <LocalTime date={message.created_at} />
            <p>{message.body}</p>
          </li>
        ))}
      </ul>
    </>
  )
}
```

The component takes `refreshQuery` as a prop, so it works with whichever renewal path your framework uses. [Renew from the server](#renew-from-the-server) covers the options. The [reactivity guide](./reactivity#uselivequery) covers the hook itself and defines `LocalTime`.

## Open the connection in the browser

The server render doesn't open a WebSocket. On the server, the hook renders from its initial rows and never subscribes. In the browser, it renders the same rows while React hydrates, so the HTML matches, and subscribes once hydration is done.

So create the client once, inside the React tree, in a `useState` initializer. It runs once per mounted app, and the client it creates during the server render never connects, because nothing subscribes there:

<CodeTabs labels={["Next.js", "TanStack Start"]}>

```tsx filename="frontend/RealtimeRoot.tsx"
"use client"

import { useState, type ReactNode } from "react"
import { createRealtimeClient } from "@neon/realtime/client"
import { RealtimeProvider } from "@neon/realtime-react"

export function RealtimeRoot({ children }: { children: ReactNode }) {
  const [client] = useState(() =>
    createRealtimeClient({ url: process.env.NEXT_PUBLIC_NEON_REALTIME_URL! })
  )

  return <RealtimeProvider client={client}>{children}</RealtimeProvider>
}
```

```tsx filename="frontend/RealtimeRoot.tsx"
"use client"

import { useState, type ReactNode } from "react"
import { createRealtimeClient } from "@neon/realtime/client"
import { RealtimeProvider } from "@neon/realtime-react"

export function RealtimeRoot({ children }: { children: ReactNode }) {
  const [client] = useState(() =>
    createRealtimeClient({ url: import.meta.env.VITE_NEON_REALTIME_URL })
  )

  return <RealtimeProvider client={client}>{children}</RealtimeProvider>
}
```

</CodeTabs>

The [subscribing guide](./subscribing#subscribe-to-the-sealed-query) creates the client at module level in `frontend/client.ts`, which suits a single-page app. In a server-rendered app, create it inside the React tree instead, which keeps browser-only setup out of module scope. Keep the client stable, too. `useLiveQuery()` subscribes per client and sealed query, so a new client on every render means a new subscription on every render.

Render `RealtimeRoot` around everything that calls `useLiveQuery()`, for example in your root layout. `RealtimeRoot`, `ChannelMessages` and `HydratedMessages` start with `"use client"` so that Next.js renders them as Client Components. TanStack&nbsp;Start ignores the directive.

## Keep row shapes identical

The initial rows and the live rows have to have the same shape. If they don't, the page renders one shape until the first reset and another after it.

In the running example, `created_at` is a `Date` on both sides: Drizzle reads `timestamptz` columns as `Date` objects, and so does the Realtime client. The hydration payload has to keep it that way. React Server Component props and TanStack Start's serializer both preserve `Date` values. Plain `JSON.stringify` turns them into strings, so if your payload goes through it, revive the dates in the browser or keep your row types JSON-safe.

Watch numeric types too: `int8` and `numeric` columns [arrive as strings](./subscribing#subscribe-to-the-sealed-query) on the live side, so read them as strings on the server.

Formatted output has to match too, so format dates and numbers for the user's locale after hydration, as `LocalTime` in the reactivity guide does.

## Renew from the server

The sealed query in the payload expires, so pass `refreshQuery`, and the hook renews the sealed query with the same timing as in the [reactivity guide](./reactivity#refreshquery). If the page hydrates late, for example in a tab restored after a few minutes, the sealed query may already have expired, and the hook renews it straight away.

The renewal runs in the browser, so it goes through something that authenticates the user, like the Route Handler or server function above. It has to seal the same query with the same parameters, because a different fingerprint is rejected. Building both from `messagesQuery()` keeps them in step.

If the user has signed out and the renewal fails, the hook keeps retrying and the status stays `stale`. So drive sign-out from your auth state: when the user signs out, unmount the components that subscribe.

## With TanStack DB

With [TanStack&nbsp;DB](./reactivity#tanstack-db), the collection carries the initial rows instead of the hook's `initialData`:

1. on the server, create a request-scoped `DbClient`, seed the collection with the initial rows and dehydrate it into the payload, next to the sealed query
2. in the browser, create the collection with the same collection id and hydrate it
3. the collection starts its live subscription in the browser, and the first reset takes over from the seeded rows

The code below does this with TanStack&nbsp;Start. It syncs the inbox from the [reactivity guide](./reactivity#seal-a-broader-query) into one collection and shows one channel from it. As well as the packages from that guide, it uses TanStack's router integration:

```bash filename="Terminal"
npm install @tanstack/react-router-with-db
```

### Create a `DbClient` per router

TanStack&nbsp;Start calls `getRouter()` once per request on the server and once in the browser, so a `DbClient` created with the router belongs to one request or one browser app. Create the Realtime client next to it and add both to the router context. The server-side Realtime client never connects, because nothing subscribes there. `routerWithDbClient()` wraps the app in `DbProvider`:

```tsx filename="src/router.tsx"
import { DbClient } from "@tanstack/react-db"
import { createRouter } from "@tanstack/react-router"
import { routerWithDbClient } from "@tanstack/react-router-with-db"
import { createRealtimeClient } from "@neon/realtime/client"

import { routeTree } from "./routeTree.gen"

export function getRouter() {
  const dbClient = new DbClient()
  const realtimeClient = createRealtimeClient({ url: import.meta.env.VITE_NEON_REALTIME_URL })
  const router = createRouter({ routeTree, context: { dbClient, realtimeClient } })

  return routerWithDbClient(router, dbClient)
}
```

`routerWithDbClient()` requires `dbClient` in the router's context type, so create the root route with `createRootRouteWithContext<{ dbClient: DbClient; realtimeClient: RealtimeClient }>()`. If the app also uses `useLiveQuery()` from `@neon/realtime-react`, pass the same Realtime client to `RealtimeProvider`.

### Define the collection

Define the collection as a descriptor with `collectionOptions()` around [`realtimeCollectionOptions()`](../sdks/typescript#tanstack-db-realtimecollectionoptions), so that each `DbClient` creates its own instance of it, and give it a stable id. Unlike `createMessagesCollection()` in the reactivity guide, it takes the Realtime client as a parameter: in the browser, that's the one from the router context. `MessagesContext` hands the collection from the layout route to the channel pages:

```ts filename="src/collections.ts"
import { createContext, useContext } from "react"
import { collectionOptions } from "@tanstack/react-db"
import { realtimeCollectionOptions } from "@neon/realtime-tanstack"
import type { RealtimeClient, SealedLiveQuery } from "@neon/realtime/client"

import type { Message } from "./backend/schema"
import { sealInbox } from "./server-functions"

export function messagesCollectionOptions(client: RealtimeClient, sealedQuery: SealedLiveQuery<Message>) {
  return collectionOptions(
    realtimeCollectionOptions({
      id: "messages",
      client,
      query: sealedQuery,
      refreshQuery: () => sealInbox(),
      getKey: (message) => message.id
    })
  )
}

export interface MessagesDbState {
  collections: {
    collectionId: string
    rows: { key: number; value: Message }[]
  }[]
}

export const MessagesContext = createContext<ReturnType<typeof messagesCollectionOptions> | null>(null)

export function useMessages() {
  const messages = useContext(MessagesContext)

  if (!messages) {
    throw new Error("useMessages() must be called inside the channels layout")
  }

  return messages
}
```

`refreshQuery` calls a server function that seals the same `inboxQuery()` for the user in the session:

```ts filename="src/server-functions.ts"
import { createServerFn } from "@tanstack/react-start"

import { inboxQuery } from "./backend/queries"
import { realtime } from "./backend/realtime"
import { sessionMiddleware } from "./session-middleware"

export const sealInbox = createServerFn({ method: "POST" })
  .middleware([sessionMiddleware])
  .handler(({ context }) => realtime.seal({ query: inboxQuery(context.user.id) }))
```

### Seed on the server and hydrate in the browser

A layout route, `src/routes/channels.tsx`, loads the inbox for every channel page. Its loader reads and seals the inbox, seeds the collection in a request-scoped `DbClient` and dehydrates it. It passes the rows to `dbClient.collection()` as `initialData`, which is TanStack&nbsp;DB's option for seeding a collection in one `DbClient`. The collection id is what connects the server's rows to the browser's collection.

The layout's component hydrates the router's `DbClient` during its first render and creates the collection with the Realtime client from the router context. Then it provides the collection to the channel pages, which render in its `<Outlet />`:

```tsx filename="src/routes/channels.tsx"
import { useState } from "react"
import { DbClient } from "@tanstack/react-db"
import type { DehydratedDbState } from "@tanstack/react-db"
import { createFileRoute, Outlet } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { createRealtimeClient } from "@neon/realtime/client"

import { inboxQuery } from "../backend/queries"
import { realtime } from "../backend/realtime"
import { MessagesContext, messagesCollectionOptions, type MessagesDbState } from "../collections"
import { sessionMiddleware } from "../session-middleware"

const loadInbox = createServerFn({ method: "POST" })
  .middleware([sessionMiddleware])
  .handler(async ({ context }) => {
    const query = inboxQuery(context.user.id)
    const [initialData, sealedQuery] = await Promise.all([query, realtime.seal({ query })])

    const client = createRealtimeClient({ url: import.meta.env.VITE_NEON_REALTIME_URL })
    const dbClient = new DbClient()

    try {
      dbClient.collection(messagesCollectionOptions(client, sealedQuery), { initialData })

      return { sealedQuery, dbState: dbClient.dehydrate() as MessagesDbState }
    } finally {
      await dbClient.cleanup()
      client.close()
    }
  })

const hydratedDbClients = new WeakSet<DbClient>()

export const Route = createFileRoute("/channels")({
  loader: () => loadInbox(),
  staleTime: Infinity,
  component: ChannelsLayout
})

function ChannelsLayout() {
  const { dbClient, realtimeClient } = Route.useRouteContext()
  const { sealedQuery, dbState } = Route.useLoaderData()

  const [messages] = useState(() => {
    if (!hydratedDbClients.has(dbClient)) {
      dbClient.hydrate(dbState as DehydratedDbState)
      hydratedDbClients.add(dbClient)
    }

    return messagesCollectionOptions(realtimeClient, sealedQuery)
  })

  return (
    <MessagesContext.Provider value={messages}>
      <Outlet />
    </MessagesContext.Provider>
  )
}
```

`MessagesDbState` is the dehydrated state, narrowed to this collection's rows. `dehydrate()` types row metadata as `unknown`, and TanStack&nbsp;Start won't type-check a loader result that it can't prove serializable, so `loadInbox` casts the state to `MessagesDbState`.

The layout's loader runs once, because `staleTime: Infinity` keeps its data fresh, so switching channels makes no server round trip. On the first load, the loader and the channel page both run on the server, so the HTML has the rows.

The layout hydrates in a `useState` initializer, during its first render, so the rows are there before anything reads the collection. An effect would run too late. `hydratedDbClients` makes it hydrate only once per `DbClient`, because if you navigate away and back, the layout mounts again with the cached loader rows, and hydrating those into the live collection would bring back rows it has since deleted. It doesn't use TanStack&nbsp;DB's `HydrationBoundary`, which hydrates again whenever the loader data changes, because a syncing collection doesn't need the loader's rows again.

The descriptor needs a Realtime client on the server too, but nothing subscribes there, so it never opens a connection. The loader closes it and cleans up its `DbClient` before returning. Never share that `DbClient` between requests, because each one holds one user's rows.

On sign-out, do a full page load, for example to your sign-in page. That drops the browser's `DbClient`, and the previous user's rows with it.

The channel route reads only `channelId`. It queries the collection with TanStack's `useLiveQuery()`, under the same alias as in the reactivity guide:

```tsx filename="src/routes/channels.$channelId.tsx"
import { eq, useLiveQuery as useCollectionQuery } from "@tanstack/react-db"
import { createFileRoute } from "@tanstack/react-router"

import { useMessages } from "../collections"

export const Route = createFileRoute("/channels/$channelId")({
  component: ChannelRoute
})

function ChannelRoute() {
  const { channelId } = Route.useParams()
  const messages = useMessages()

  const { data, isError } = useCollectionQuery({
    query: (q) =>
      q
        .from({ message: messages })
        .where(({ message }) => eq(message.channel_id, Number(channelId)))
        .orderBy(({ message }) => message.created_at, "desc")
  })

  if (isError) {
    return <p role="alert">Couldn't sync messages</p>
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

Render `data` straight away, without waiting for `isReady`. The hydrated rows are there for the first render, but the collection only becomes ready when the first reset arrives.

## Keep secrets on the server

In a server-rendered app, server and browser code live side by side, so it's easy to import a module on the wrong side. Import `backend/realtime.ts` and `backend/db.ts` only from server code: Server Components, server functions and TanStack&nbsp;Start server function handlers. A TanStack&nbsp;Start route loader also runs in the browser on client-side navigation, so it has to call a server function rather than import `backend/` modules.

Mark those modules as server-only, so a client import fails the build. In Next.js, add `import "server-only"` to `backend/realtime.ts` and `backend/db.ts`. In TanStack&nbsp;Start, add `import "@tanstack/react-start/server-only"` to them, or name the files `*.server.ts`. The queries guide explains why you [keep your Realtime secret on the server](./queries#sealing-queries).

## Examples

The examples put these principles into framework code. The Next.js example uses `force-dynamic` and splits the page into a Server Component that reads and seals and a Client Component that subscribes. The TanStack example dehydrates a `DbClient` in a route loader and hydrates it in the browser.

<DetailIconCards cols={2} theme="green-dotted">

<a href="/docs/realtime/examples/nextjs" description="Read and seal in a Server Component, then subscribe in a Client Component." icon="next-js">Next.js</a>

<a href="/docs/realtime/examples/tanstack" description="Dehydrate a TanStack DB collection on the server and hydrate it in the browser." icon="tanstack">TanStack</a>

</DetailIconCards>

<NeedHelp/>
