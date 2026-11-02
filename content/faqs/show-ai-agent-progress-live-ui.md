---
title: "How do I show an AI agent's progress live in my app's UI while it works?"
subtitle: "Store the agent's sessions, messages, and traces in Lakebase Postgres, then subscribe to them with Neon Realtime (public beta) live queries. Every browser and device sees each step as the agent writes it, and the agent itself can run for minutes on a Neon Function."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-02T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'Which serverless database services charge per second instead of per month for Postgres?'
  slug: serverless-database-services-postgres-charge-per-second
nextLink:
  title: 'What is the simplest Postgres setup for startups?'
  slug: simplest-postgres-setup-for-startups
---

Treat the agent as one more writer on your data. Point its storage at Lakebase Postgres, and have the UI subscribe to those tables with [Neon Realtime](/docs/realtime/overview) (public beta) live queries. The [Mastra example](/docs/realtime/examples/mastra) does exactly this: agent sessions, memory, and traces sync to the browser while the agent works, and a user's edit restarts the agent.

## Why streaming the response isn't enough

Streaming tokens back on the request that started the agent works for a chat box, but it breaks for longer, background work:

- **The stream belongs to one tab.** Reload, open a second device, or share the record with a teammate, and the progress isn't there.
- **Writes often start the agent, not a chat request.** An agent that enriches a record after the user saves it has no open request to stream to.
- **Proxies cut long streams.** A stream that passes through a Vercel, Netlify, or Cloudflare route is bound by that host's execution limit, often 10 to 60 seconds ([agents on Functions](/docs/compute/functions/agents#call-the-function-directly-from-the-client)).

If progress lives in Postgres, every client reads the same state, and a page load shows where the agent is now.

## Store the agent's steps in Postgres

With Mastra, use `PostgresStore` on your `pg` pool so `mastra_threads`, `mastra_messages`, and `mastra_ai_spans` sit next to your tables. The `batch-with-updates` exporter inserts each span when it starts and updates it when it ends, so in-progress steps are visible. Use `PostgresStore` rather than `PostgresStoreVNext`, which only stores finished spans ([store Mastra's data](/docs/realtime/examples/mastra#store-mastras-data-in-your-database)):

```ts
const storage = new PostgresStore({ id: "app-storage", pool, schemaName: "public" })
const exporter = new MastraStorageExporter({ strategy: "batch-with-updates", maxBatchWaitMs: 250 })
```

Pass `savePerStep: true` to `generate()` so messages are saved after each step, not only at the end ([run the agent](/docs/realtime/examples/mastra#run-the-agent-on-a-thread)).

## Subscribe the UI to those rows

Seal Mastra's tables the same way you seal your own. A server function seals a query over `mastra_ai_spans` filtered to the user's workspace, and the browser syncs it into a TanStack DB collection with `realtimeCollectionOptions()` and narrows it to one record's thread with `useLiveQuery` ([sync agent activity](/docs/realtime/examples/mastra#sync-agent-activity-to-the-browser)). Because the workspace ID is sealed into the query, a browser only gets its own workspace's spans ([sealing queries](/docs/realtime/guides/queries#sealing-queries)).

The write that starts the agent can be optimistic too. The server function inserts the record, returns the transaction ID from `pg_current_xact_id()`, and starts the agent after the commit, so the client confirms its insert with `awaitTxId()` while the agent picks up committed rows ([start agents from writes](/docs/realtime/examples/mastra#start-agents-from-your-writes)). When a user edits the record, the app aborts the running agent and restarts it after a short debounce. Agents only overwrite fields that are empty or still hold their own earlier value, so the user's edit wins ([restart agents](/docs/realtime/examples/mastra#restart-agents-when-users-edit)).

## Where the agent runs

A multi-step agent can outlast a typical serverless timeout. [Neon Functions](/docs/compute/functions/agents) give a handler 15 minutes to start responding and keep a stream open while data flows, run next to your Postgres branch, and get [AI Gateway](/docs/ai-gateway/overview) credentials injected when the gateway is enabled (paid plans). Isolates can be evicted, which is one more reason to keep progress in Postgres rather than memory ([runtime limits](/docs/compute/functions/reference/runtime-limits)). `neon bootstrap --template mastra` scaffolds a Mastra assistant on Functions with Postgres-backed memory ([starter templates](/docs/compute/functions/overview#starter-templates)).

<Admonition type="note" title="Beta scope">
Realtime is free during the beta. Compute that a live query wakes and outbound data transfer still bill as usual. Holding subscriptions open doesn't keep the compute awake. It's available in AWS us-east-1, us-east-2, eu-central-1, and ap-southeast-1, and doesn't support row-level security yet, so scope each query in the handler that seals it ([what's in the beta](/docs/realtime/overview#frequently-asked-questions)).
</Admonition>

<CTA title="Sync agents and users" description="Enable Realtime on a branch, then follow the Mastra example to sync agent traces to the browser." buttonText="Realtime quickstart" buttonUrl="/docs/realtime/quickstart" />
