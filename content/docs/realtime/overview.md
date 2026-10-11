---
title: 'Neon Realtime'
subtitle: 'Realtime live SQL and reactive DX for building apps and agents.'
summary: >-
  Neon's Realtime makes any SQL query live. Subscribe in realtime to your Lakebase Postgres. Develop apps and agents with end-to-end reactivity using type-safe live queries and optimistic mutations.
enableTableOfContents: true
titleWidth: '530'
---

<div className="mb-6">
  <FeatureBetaProps feature_name="Realtime" />
</div>

Realtime makes [any SQL query](./guides/queries) live. [Subscribe in realtime](./guides/subscribing) to your [Lakebase Postgres](/docs/postgres/overview). Develop apps and agents with end-to-end, type-safe reactivity using [live queries](./guides/reactivity) and [optimistic mutations](./guides/mutations).

## Get started

[Get started](./quickstart) with Realtime and learn about [how it works](./how-it-works).

```bash filename="Terminal"
npx neon@latest init --realtime
```

<DetailIconCards cols={2} theme="green-flat">

<a href="/docs/realtime/quickstart" description="Fire up Realtime and run your first live queries." icon="rocket">Quickstart</a>

<a href="/docs/realtime/how-it-works" description="Learn how it works and how the layers compose." icon="cards">How it works</a>

</DetailIconCards>

See examples of how to build full-stack, reactive apps with [Next.js](./examples/nextjs) and [TanStack](./examples/tanstack) and how to [drive live agent workflows](./examples/mastra) with Mastra.

<DetailIconCards cols={3} theme="green-dotted">

<a href="/docs/realtime/examples/nextjs" description="Build a realtime, reactive app using Next.js with SSR support." icon="next-js">Next.js</a>

<a href="/docs/realtime/examples/tanstack" description="Build a realtime, reactive app using TanStack Start and DB." icon="tanstack">TanStack</a>

<a href="/docs/realtime/examples/mastra" description="Drive agent workflows directly from Lakebase Postgres." icon="mastra">Mastra</a>

</DetailIconCards>

## Realtime live SQL

Realtime offers [arbitrary live SQL](./reference/api) with [full reactivity](./guides/reactivity) on Lakebase Postgres. It allows you to build realtime, reactive apps and agents:

1. without using a second or bespoke realtime system
1. without changing your schema, queries, ORM or reactivity system
1. without contorting your application around the limitations of your sync engine

There is no need to use a different database for realtime sync. You can reuse your existing query code and data loading patterns. This is full reactivity, on standard Postgres, with live SQL that just&nbsp;works.

## Integrated reactive DX

[Define](./guides/queries) and [subscribe&nbsp;to&nbsp;queries](./guides/subscribing) directly. Or use the batteries included: [end-to-end, type-safe reactivity](./guides/reactivity) and [mutation](./guides/mutations) primitives that integrate into your framework of choice.

<Steps>

In your backend, [define live&nbsp;queries](./guides/queries) using raw SQL or your ORM&nbsp;of&nbsp;choice (in this case [Drizzle](./examples/drizzle)):

```ts filename="your-api-server.ts"
import { createRealtime } from "@neon/realtime/server"
import { drizzleAdapter } from "@neon/realtime-drizzle"

const realtime = createRealtime({
  secret: process.env.NEON_REALTIME_SECRET!,
  db: "neondb",
  adapter: drizzleAdapter()
})

// This can be any SQL query, including joins, aggregates, ordering, etc.
const query = db.select().from(messages)
```

---

[Seal the live queries](./guides/queries#sealing-queries) to safely [expose them to your frontend](./guides/queries#exposing-queries):

```ts filename="your-api-server.ts"
const sealedQuery = await realtime.seal({ query })
```

---

Subscribe directly [using a low&#8209;level&nbsp;client](./guides/subscribing):

```ts filename="client-or-server.ts"
import { createRealtimeClient } from "@neon/realtime/client"

const client = createRealtimeClient({ url: "wss://realtime.neon.tech/..." })

const subscription = client.subscribe(sealedQuery)
subscription.onChange(console.log)
```

---

Or, in your app, use the [higher-level reactivity primitives](./guides/reactivity) to bind live queries to your component&nbsp;state:

```tsx filename="App.tsx"
import { useLiveQuery } from "@neon/realtime-react"
import { type SealedLiveQuery } from "@neon/realtime/client"

type Props = {
  sealedQuery: SealedLiveQuery<Message>
  initialData?: Message[]
}

export function Messages({ sealedQuery, initialData }: Props) {
  const { data } = useLiveQuery(sealedQuery, { initialData })

  return (
    <ul>
      {(data ?? []).map((message) => (
        <li key={message.id}>{ ... }</li>
      ))}
    </ul>
  )
}
```

---

Optionally passing in the `initialData` from SSR (e.g.: with [TanStack&nbsp;Start](./examples/tanstack)):

```tsx filename="routes/messages.tsx"
import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"

const loadMessages = createServerFn({ method: "GET" }).handler(async () => {
  const [initialData, sealedQuery] = await Promise.all([query, realtime.seal({ query })])

  return { initialData, sealedQuery }
})

export const Route = createFileRoute("/messages")({
  loader: () => loadMessages(),
  component: () => <Messages {...Route.useLoaderData()} />,
})
```

---

Or for more [advanced use](./guides/reactivity#tanstack-db), sync the live query into a [TanStack&nbsp;DB&nbsp;collection](https://tanstack.com/db/latest/docs/overview):

```ts filename="db/collections.ts"
import { createCollection } from "@tanstack/db"
import { realtimeCollectionOptions } from "@neon/realtime-tanstack"

export const messagesCollection = createCollection(
  realtimeCollectionOptions({
    id: "messages",
    client,
    query: sealedQuery,
    ...,
    onUpdate: async ({ transaction, collection }) => {
      const { original, changes } = transaction.mutations[0]
      const { txid } = await api.messages.update(original.id, changes)

      await collection.utils.awaitTxId(txid)
    }
  })
)
```

---

Bind that to your components and benefit from instant local writes using [optimistic&nbsp;mutations](./guides/mutations):

```tsx filename="App.tsx"
import { useLiveQuery } from "@tanstack/react-db"

export function Messages() {
  const { data } = useLiveQuery({
    query: (q) => q.from({ messagesCollection })
  })

  function star(message) {
    messagesCollection.update(message.id, (draft) => {
      draft.starred = true
    })
  }

  return (
    <ul>
      {(data ?? []).map((message) => (
        <li key={message.id} onClick={() => star(message)}>{ ... }</li>
      ))}
    </ul>
  )
}
```

---

That's it. You get [live SQL](./guides/queries#defining-live-queries) and [end-to-end reactivity](./guides/reactivity) on standard Postgres. With full type-safety and support for [SSR](./guides/ssr), [instant local writes](./guides/mutations), [multi-user, multi-device sync](./how-it-works) and [local offline persistence](https://tanstack.com/blog/tanstack-db-0.6-app-ready-with-persistence-and-includes).

</Steps>

## Agent skills and MCP

Install the [Neon MCP server](/docs/ai/neon-mcp-server). Or [use the CLI](/docs/cli) to install the Realtime skill:

```bash filename="Terminal"
neon skills -s neon-realtime
```

<CopyPrompt src="/prompts/neon-realtime.md"
    description="Copy this to your coding agent to get started with Realtime."
    buttonText="Copy prompt"
/>

## Frequently asked questions

Answers to frequently asked questions about Realtime:

<Faq>

<FaqItem question="What's in the BETA and what's not?">

Functionally, Realtime already supports:

- arbitrary live SQL (any [read-only, deterministic `SELECT`](./guides/queries#defining-live-queries))
- [end-to-end, type-safe reactivity](./guides/reactivity)
- [SSR](./guides/ssr) and [Neon Auth](./guides/queries#authorization) support
- initial [ORM, query builder](guides/queries#using-a-query-builder-or-orm) and [framework integrations](./guides/reactivity#react)
- support for branching and scale-to-zero

Realtime **does not** yet support:

- billing (Realtime is free to use during the BETA)
- RLS (we [aim to support it by GA](./guides/queries#why-not-row-level-security), if priorities allow)
- enterprise Lakebase (Realtime is Neon only for now)

The transport protocol is not yet stable and we aim to add wider client and framework integrations for GA.

The BETA also makes no performance guarantees. We have very ambitious performance goals but there's lots of optimization work still to do.

</FaqItem>

<FaqItem question="How much does it cost? Is billing enabled?">

Realtime is free to use during the BETA. Neon does not charge for the live query engine compute or the Live SQL API service.

Using Realtime can still cause usage on your database:

- database compute: starting a live query may wake the database compute endpoint, which is billed according to your plan
- data transfer: outbound data transfer is measured as egress and is subject to your plan's data-transfer allowance and applicable overage charges

The BETA waiver applies to the Realtime service itself. It does not waive database compute or network-transfer charges generated by your workload.

</FaqItem>

<FaqItem question="What's the performance impact on my database?">

Realtime switches the cost of queries from "query-execution on read" to "incremental cost on write". However that cost is incurred on a replica, which means Realtime has zero impact on the write-latency, write-throughput or write-compute of your primary database.

Realtime does require logical replication to be enabled. Technically, this adds a small metadata overhead to the Postgres WAL. Note that setting `REPLICA IDENTITY FULL` on the tables your live queries read will result in better performance.

</FaqItem>

<FaqItem question="Can I use my ORM / query-builder?">

Yes. Realtime works with SQL, so any library that generates SQL can work with it. There are built-in adapters for [Drizzle](./examples/drizzle) and [Kysely](./examples/kysely), and you can write your own for other libraries.

See [Using a query builder or ORM](./guides/queries#using-a-query-builder-or-orm) for how to set one up, and the [`RealtimeAdapter`](./sdks/typescript#backend-realtimeadapter) reference for the interface.

</FaqItem>

<FaqItem question="What SQL features are supported? Are there limitations?">

Realtime supports any read-only, deterministic SQL query that [Postgres supports](/postgresql/tutorial/select), including joins, aggregates, window functions and [sub-queries](/postgresql/tutorial/subquery).

Queries can't have side effects, and any functions they use must be deterministic, so you can't use `now()` or `gen_random_uuid()`. Complex queries add write-processing latency, especially on larger datasets.

See [Defining live queries](./guides/queries#defining-live-queries) for the details.

</FaqItem>

<FaqItem question="Is Realtime enabled by default?">

No. You enable it per project and branch. Child branches created from a Realtime-enabled branch have it enabled automatically.

Use `neon init --realtime` to create a new project with Realtime enabled. Or `neon realtime enable` to enable Realtime on an existing project. See the [Quickstart](./quickstart) for more details.

</FaqItem>

<FaqItem question="Which regions is it enabled in?">

For BETA, Realtime is available in:

```text
aws-ap-southeast-1
aws-eu-central-1
aws-us-east-1
aws-us-east-2
```

</FaqItem>

<FaqItem question="Does Realtime support RLS?">

Not yet. Realtime has been architected to support RLS and we aim to add it by GA if priorities allow. However, it's not yet been implemented and isn't the [recommended approach to auth](./guides/queries#authorization).

See [Why not row-level security](./guides/queries#why-not-row-level-security) for more details.

</FaqItem>

<FaqItem question="Does Realtime support branching?">

Yes, Realtime supports branching. Realtime is enabled at the branch level.

Branches support live queries and Realtime-enabled branches can be branched. Child branches of a Realtime-enabled branch automatically have Realtime enabled.

</FaqItem>

<FaqItem question="Does Realtime support scale-to-zero?">

Yes, using Realtime does not prevent your database from scaling to zero. Initiating live queries will wake your database. Holding subscriptions open does not.

</FaqItem>

<FaqItem question="Do live queries use up database connections?">

No. Realtime query connections from clients are terminated at the Live SQL API, which then speaks to the live query engine over a single TCP connection.

</FaqItem>

<FaqItem question="Is there a risk of write-lag / WAL build-up?">

No. There's no impact on write-throughput and no risk of WAL build-up.

</FaqItem>

<FaqItem question="What about thundering herds?">

Realtime has built-in protection from thundering herds in the client and the Live SQL API. There's no risk of a large spike of client-reconnections taking your database down.

</FaqItem>

<FaqItem question="How does Neon Realtime compare with alternatives?">

We don't speak for other systems. However, we have tried to articulate the key differences with some alternative realtime systems below.

<Steps>

#### Supabase

<a className="group inline text-pretty" href="https://supabase.com/docs/guides/realtime" target="_blank" rel="nofollow noopener noreferrer">Supabase Realtime<span className="whitespace-nowrap no-underline"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14" className="ml-1 inline-block size-3.5 shrink-0 align-[-0.125em]"><path fill="currentColor" d="M0 0h14v14H0z" opacity="0.2"></path><path stroke="currentColor" strokeLinecap="square" d="M9.915 8.885V4.08H5.11M9.625 4.375 4.083 9.917"></path></svg></span></a> is a pubsub system with replay. It pushes messages and database changes to connected clients. Subscriptions can filter on column values but can't join, aggregate, order, limit or run arbitrary queries.

Neon Realtime is a sync engine that supports [arbitrary live SQL queries](./guides/queries#defining-live-queries), including joins, aggregates, ordering and limits. The system keeps live query results consistently in sync with the database and provides type-safe primitives for [end-to-end reactivity](./guides/reactivity) and [instant local writes](./guides/mutations).

---

#### Convex

Compared with <a className="group inline text-pretty" href="https://www.convex.dev" target="_blank" rel="nofollow noopener noreferrer">Convex<span className="whitespace-nowrap no-underline"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14" className="ml-1 inline-block size-3.5 shrink-0 align-[-0.125em]"><path fill="currentColor" d="M0 0h14v14H0z" opacity="0.2"></path><path stroke="currentColor" strokeLinecap="square" d="M9.915 8.885V4.08H5.11M9.625 4.375 4.083 9.917"></path></svg></span></a>, Neon Realtime supports similar [end-to-end reactivity](./guides/reactivity) but on standard Postgres and with standard web frameworks and build tooling. Realtime also uses delta-sync rather than query-invalidation, which is more efficient over the wire.

---

#### Materialize

Compared with <a className="group inline text-pretty" href="https://materialize.com" target="_blank" rel="nofollow noopener noreferrer">Materialize<span className="whitespace-nowrap no-underline"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14" className="ml-1 inline-block size-3.5 shrink-0 align-[-0.125em]"><path fill="currentColor" d="M0 0h14v14H0z" opacity="0.2"></path><path stroke="currentColor" strokeLinecap="square" d="M9.915 8.885V4.08H5.11M9.625 4.375 4.083 9.917"></path></svg></span></a>, Neon Realtime is a similarly expressive incremental view engine with live SQL support. However, Realtime is designed and optimized for serving live data to apps and agents, with efficient data matching and support for large numbers of concurrent clients.

---

#### Zero

<a className="group inline text-pretty" href="https://zero.rocicorp.dev" target="_blank" rel="nofollow noopener noreferrer">Zero<span className="whitespace-nowrap no-underline"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14" className="ml-1 inline-block size-3.5 shrink-0 align-[-0.125em]"><path fill="currentColor" d="M0 0h14v14H0z" opacity="0.2"></path><path stroke="currentColor" strokeLinecap="square" d="M9.915 8.885V4.08H5.11M9.625 4.375 4.083 9.917"></path></svg></span></a> is an open-source sync engine with expressive sync and reactivity using a custom query language. Zero also provides advanced client-side data management. Realtime is built into Lakebase Postgres and the Neon platform and provides similar sync and reactivity on standard SQL. Both systems are composable with your existing schema and auth.

</Steps>

</FaqItem>

<FaqItem question="Is Realtime compatible with, or based on, Electric?">

Realtime isn't based on [Electric](/blog/electric-joins-neon), but it **is a drop-in replacement** for Electric's role in your stack. We recommend that teams using Electric migrate to Realtime.

Live SQL queries replace shapes. For TanStack DB users, [`realtimeCollectionOptions()`](./sdks/typescript#tanstack-db-realtimecollectionoptions) replaces `electricCollectionOptions()`.

</FaqItem>

</Faq>

## Next steps

[Get started](./quickstart) with Realtime and learn more about [how it works](./how-it-works).

<DetailIconCards cols={2} theme="green-flat">

<a href="/docs/realtime/quickstart" description="Fire up Realtime and run your first live queries." icon="rocket">Quickstart</a>

<a href="/docs/realtime/how-it-works" description="Learn how it works and how the layers compose." icon="cards">How it works</a>

</DetailIconCards>

<NeedHelp/>
