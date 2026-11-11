---
title: 'Neon Realtime'
subtitle: "Live queries that update your app's UI the moment your data changes."
summary: >-
  Neon's Realtime makes any SQL query live. Subscribe in realtime to your Lakebase Postgres database. Develop apps and agents with end-to-end reactivity using type-safe live queries and optimistic mutations.
enableTableOfContents: true
titleWidth: '530'
redirectFrom:
  - /docs/realtime
  - /docs/realtime/introduction
  - /docs/realtime/faq
  - /docs/introduction/realtime
  - /docs/guides/realtime
  - /docs/guides/neon-realtime
updatedOn: '2026-10-30T16:28:20.000Z'
---

<div className="mb-6">
  <FeatureBetaProps feature_name="Realtime" />
</div>

Build apps and agents whose UIs update the moment your data changes. Realtime makes [any SQL query](/docs/realtime/guides/queries) live, so you can [subscribe](/docs/realtime/guides/subscribing) to your [Lakebase Postgres](/docs/postgres/overview) database and get end-to-end, type-safe reactivity with [live queries](/docs/realtime/guides/reactivity) and [optimistic mutations](/docs/realtime/guides/mutations).

<AgentPrompt title="Set up with your agent" src="/prompts/realtime-landing.md" buttonText="Copy prompt" />

## Get started

Starting a new app? Scaffold one from the Realtime template:

```bash filename="Terminal"
npx neon@latest bootstrap my-app --template realtime-react
```

Realtime is available on all Neon plans. To enable it on an existing project, select **Postgres database** > **Realtime** in the Neon Console and click **Enable Realtime**, or run [`neon realtime enable`](/docs/cli/realtime#enable) on a linked project:

```bash filename="Terminal"
neon realtime enable
```

<Admonition type="important" title="Before you enable Realtime">
- Your project must be in a [supported region](#which-regions-is-it-enabled-in).
- Enabling Realtime turns on [logical replication](/docs/guides/logical-replication-neon) for the whole project. This permanently changes `wal_level` to `logical` and suspends every compute in the project, on all branches, which drops active connections. Each compute starts again on its next connection. Disabling Realtime later doesn't turn logical replication off.
</Admonition>

To add Realtime to an app by hand, follow the [Quickstart](/docs/realtime/quickstart). To see how the pieces fit together, read [how it works](/docs/realtime/how-it-works).

<DetailIconCards cols={2} theme="green-flat">

<a href="/docs/realtime/quickstart" description="Fire up Realtime and run your first live queries." icon="rocket">Quickstart</a>

<a href="/docs/realtime/how-it-works" description="Learn how it works and how the layers compose." icon="cards">How it works</a>

</DetailIconCards>

See examples of how to build full-stack, reactive apps with [Next.js](/docs/realtime/examples/nextjs) and [TanStack](/docs/realtime/examples/tanstack) and how to [keep users and agents in sync](/docs/realtime/examples/mastra) with Mastra.

<DetailIconCards cols={3} theme="green-dotted">

<a href="/docs/realtime/examples/nextjs" description="Build a realtime, reactive app using Next.js with SSR support." icon="next-js">Next.js</a>

<a href="/docs/realtime/examples/tanstack" description="Build a realtime, reactive app using TanStack Start and DB." icon="tanstack">TanStack</a>

<a href="/docs/realtime/examples/mastra" description="Keep users and agents in sync on the same data." icon="mastra">Mastra</a>

</DetailIconCards>

## Realtime live SQL

Realtime offers [arbitrary live SQL](/docs/realtime/guides/queries) with [full reactivity](/docs/realtime/guides/reactivity) on Lakebase Postgres. It allows you to build realtime, reactive apps and agents:

- without using a second or bespoke realtime system
- without changing your schema, queries, ORM or reactivity system
- without contorting your application around the limitations of your sync engine

There is no need to use a different database for realtime sync. You can reuse your existing query code and data loading patterns. This is full reactivity, on standard Postgres, with live SQL that just&nbsp;works.

## Integrated reactive DX

[Define](/docs/realtime/guides/queries) and [subscribe&nbsp;to&nbsp;queries](/docs/realtime/guides/subscribing) directly. Or use the batteries included: [end-to-end, type-safe reactivity](/docs/realtime/guides/reactivity) and [mutation](/docs/realtime/guides/mutations) primitives that integrate into your framework of choice.

<Steps>

In your backend, [define live&nbsp;queries](/docs/realtime/guides/queries) using raw SQL or your ORM&nbsp;of&nbsp;choice (in this case [Drizzle](/docs/realtime/examples/drizzle)):

```ts filename="your-api-server.ts"
import { createRealtime } from "@neon/realtime/server"
import { drizzleAdapter } from "@neon/realtime-drizzle"

const realtime = createRealtime({
  secret: process.env.NEON_REALTIME_SECRET!,
  db: "neondb",
  adapter: drizzleAdapter()
})

// `db` is your Drizzle instance and `messages` is a Drizzle table.
// This can be any SQL query, including joins, aggregates, ordering, etc.
const query = db.select().from(messages)
```

---

[Seal the live queries](/docs/realtime/guides/queries#sealing-queries) to safely [expose them to your frontend](/docs/realtime/guides/queries#exposing-queries):

```ts filename="your-api-server.ts"
const sealedQuery = await realtime.seal({ query })
```

---

Subscribe directly [using a low&#8209;level&nbsp;client](/docs/realtime/guides/subscribing):

```ts filename="client-or-server.ts"
import { createRealtimeClient } from "@neon/realtime/client"

const client = createRealtimeClient({ url: process.env.NEON_REALTIME_URL! })

const subscription = client.subscribe(sealedQuery)
subscription.onChange(console.log)
```

---

Or, in your app, use the [higher-level reactivity primitives](/docs/realtime/guides/reactivity) to bind live queries to your component&nbsp;state:

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

Optionally passing in the `initialData` from SSR (e.g.: with [TanStack&nbsp;Start](/docs/realtime/examples/tanstack)):

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

Or for more [advanced use](/docs/realtime/guides/reactivity#tanstack-db), sync the live query into a [TanStack&nbsp;DB&nbsp;collection](https://tanstack.com/db/latest/docs/overview):

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
      const updates = transaction.mutations.map(({ original, changes }) => ({ id: original.id, changes }))
      const { txid } = await api.messages.update(updates)

      await collection.utils.awaitTxId(txid)
    }
  })
)
```

---

Bind that to your components and benefit from instant local writes using [optimistic&nbsp;mutations](/docs/realtime/guides/mutations):

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

That's it. You get [live SQL](/docs/realtime/guides/queries#defining-live-queries) and [end-to-end reactivity](/docs/realtime/guides/reactivity) on standard Postgres. With full type-safety and support for [SSR](/docs/realtime/guides/ssr), [instant local writes](/docs/realtime/guides/mutations), [multi-user, multi-device sync](/docs/realtime/how-it-works) and [local offline persistence](https://tanstack.com/blog/tanstack-db-0.6-app-ready-with-persistence-and-includes).

</Steps>

## Agent skills and MCP

Install the [Neon MCP server](/docs/ai/neon-mcp-server). Or [use the CLI](/docs/cli) to install the Realtime skill:

```bash filename="Terminal"
neon skills -s neon-realtime
```

## Frequently asked questions

Answers to frequently asked questions about Realtime:

<Faq>

<FaqItem question="What's in the beta and what's not?">

Functionally, Realtime already supports:

- arbitrary live SQL (any [read-only, deterministic `SELECT`](/docs/realtime/guides/queries#defining-live-queries))
- [end-to-end, type-safe reactivity](/docs/realtime/guides/reactivity)
- [SSR](/docs/realtime/guides/ssr) and [Managed Better Auth](/docs/realtime/guides/queries#authorization) support
- initial [ORM, query builder](/docs/realtime/guides/queries#using-a-query-builder-or-orm) and [framework integrations](/docs/realtime/guides/reactivity#react)
- support for branching and scale-to-zero

Realtime **does not** yet support:

- billing (Realtime is free to use during the beta)
- RLS (we [aim to support it by GA](/docs/realtime/guides/queries#why-not-row-level-security), if priorities allow)
- Lakebase Postgres on Databricks (Realtime is available only on Neon for now)

The transport protocol is not yet stable and we aim to add wider client and framework integrations for GA.

The beta also makes no performance guarantees. We have very ambitious performance goals but there's lots of optimization work still to do.

</FaqItem>

<FaqItem question="How much does it cost? Is billing enabled?">

Realtime is available on all Neon plans and is free to use during the beta. Neon does not charge for the live query engine compute or the Live SQL API service.

Using Realtime can still cause usage on your database:

- database compute: starting a live query may wake the database compute endpoint, which is billed according to your plan
- data transfer: outbound data transfer is measured as egress and is subject to your plan's data-transfer allowance and applicable overage charges

The beta waiver applies to the Realtime service itself. It does not waive database compute or network-transfer charges generated by your workload.

</FaqItem>

<FaqItem question="What's the performance impact on my database?">

Realtime switches the cost of queries from "query-execution on read" to "incremental cost on write". However that cost is incurred on a replica, which means Realtime has zero impact on the write-latency, write-throughput or write-compute of your primary database.

Realtime does require logical replication to be enabled. Technically, this adds a small metadata overhead to the Postgres WAL. For more information, see [Table requirements](/docs/realtime/guides/queries#table-requirements).

</FaqItem>

<FaqItem question="Can I use my ORM / query-builder?">

Yes. Realtime works with SQL, so any library that generates SQL can work with it. There are built-in adapters for [Drizzle](/docs/realtime/examples/drizzle) and [Kysely](/docs/realtime/examples/kysely), and you can write your own for other libraries.

See [Using a query builder or ORM](/docs/realtime/guides/queries#using-a-query-builder-or-orm) for how to set one up, and the [`RealtimeAdapter`](/docs/realtime/sdks/typescript#backend-realtimeadapter) reference for the interface.

</FaqItem>

<FaqItem question="What SQL features are supported? Are there limitations?">

Realtime supports any read-only, deterministic SQL query that [Postgres supports](/postgresql/tutorial/select), including joins, aggregates, window functions and [sub-queries](/postgresql/tutorial/subquery).

Queries can't have side effects, and any functions they use must be deterministic, so you can't use `now()` or `gen_random_uuid()`. Complex queries add write-processing latency, especially on larger datasets.

See [Defining live queries](/docs/realtime/guides/queries#defining-live-queries) for the details.

</FaqItem>

<FaqItem question="Is Realtime enabled by default?">

No. You enable it per project and branch. Child branches created from a Realtime-enabled branch have it enabled automatically.

Enable it on a branch with [`neon realtime enable`](/docs/cli/realtime#enable). Or, if you manage your project with `neon.ts`, declare it with `neon config add realtime` and apply it with `neon deploy`. You can also enable it in the Neon Console. See the [Quickstart](/docs/realtime/quickstart) for more details.

Realtime isn't available on [Claimable projects](/docs/reference/claimable-neon) until they're claimed.

</FaqItem>

<FaqItem question="Which regions is it enabled in?">

During the beta, Realtime is available in:

```text
aws-ap-southeast-1
aws-eu-central-1
aws-us-east-1
aws-us-east-2
```

See [product availability](/docs/introduction/regions#product-availability) for every region.

</FaqItem>

<FaqItem question="Does Realtime work with IP Allow or Private Networking?">
No. Realtime doesn't support projects with [IP Allow](/docs/introduction/ip-allow#ip-allow-and-other-neon-services) or [Private Networking](/docs/guides/neon-private-networking#private-networking-and-other-neon-services) enabled, and subscriptions fail to connect while either is enabled.
</FaqItem>

<FaqItem question="Does Realtime support RLS?">

Not yet. Realtime has been architected to support RLS and we aim to add it by GA if priorities allow. However, it's not yet been implemented and isn't the [recommended approach to auth](/docs/realtime/guides/queries#authorization).

See [Why not row-level security](/docs/realtime/guides/queries#why-not-row-level-security) for more details.

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

Neon Realtime is a sync engine that supports [arbitrary live SQL queries](/docs/realtime/guides/queries#defining-live-queries), including joins, aggregates, ordering and limits. The system keeps live query results consistently in sync with the database and provides type-safe primitives for [end-to-end reactivity](/docs/realtime/guides/reactivity) and [instant local writes](/docs/realtime/guides/mutations).

---

#### Convex

Compared with <a className="group inline text-pretty" href="https://www.convex.dev" target="_blank" rel="nofollow noopener noreferrer">Convex<span className="whitespace-nowrap no-underline"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14" className="ml-1 inline-block size-3.5 shrink-0 align-[-0.125em]"><path fill="currentColor" d="M0 0h14v14H0z" opacity="0.2"></path><path stroke="currentColor" strokeLinecap="square" d="M9.915 8.885V4.08H5.11M9.625 4.375 4.083 9.917"></path></svg></span></a>, Neon Realtime supports similar [end-to-end reactivity](/docs/realtime/guides/reactivity) but on standard Postgres and with standard web frameworks and build tooling. Realtime also uses delta-sync rather than query-invalidation, which is more efficient over the wire.

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

Live SQL queries replace shapes. For TanStack DB users, [`realtimeCollectionOptions()`](/docs/realtime/sdks/typescript#tanstack-db-realtimecollectionoptions) replaces `electricCollectionOptions()`.

</FaqItem>

</Faq>

## Next steps

[Get started](/docs/realtime/quickstart) with Realtime and learn more about [how it works](/docs/realtime/how-it-works).

<NeedHelp/>
