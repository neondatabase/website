---
title: 'Mastra example'
subtitle: 'Using Realtime with Mastra to keep users and agents in sync.'
summary: >-
  Use Mastra with Neon Realtime: start agents from your writes, store their memory and traces in Postgres, sync them to the browser and restart them when users edit.
enableTableOfContents: true
isDraft: true
---

To Realtime, a [Mastra](https://mastra.ai) agent is one more writer on your data. This example [triggers agents when users write data](#start-agents-from-your-writes) and [syncs agent activity](#sync-agent-activity-to-the-browser) and [agent sessions](#store-mastras-data-in-your-database) through the database.

<Admonition type="tip" title="Full example on GitHub">
The complete app is in the [`thruflo/livebase`](https://github.com/thruflo/livebase) repository.
</Admonition>

{// Video
}

## Store Mastra's data in your database

Point Mastra's storage at your database, so Realtime can sync agent sessions, memory and traces:

```ts filename="src/server/mastra/mastra.server.ts" {8,13}
import { Agent } from "@mastra/core/agent"
import { Mastra } from "@mastra/core/mastra"
import { Memory } from "@mastra/memory"
import { MastraStorageExporter, Observability } from "@mastra/observability"
import { PostgresStore } from "@mastra/pg"
import { pool } from "~/server/db.server"

const storage = new PostgresStore({ id: "app-storage", pool, schemaName: "public" })
const memory = new Memory({ storage, options: { lastMessages: false } })
const enrichmentAgent = new Agent({
  id: "enrichment-agent", name: "Enrichment agent", instructions: "...", model: "...", memory
})
const exporter = new MastraStorageExporter({ strategy: "batch-with-updates", maxBatchWaitMs: 250 })

export const mastra = new Mastra({
  agents: { enrichmentAgent },
  storage,
  observability: new Observability({ configs: { default: { serviceName: "app", exporters: [exporter] } } })
})
```

`PostgresStore` on your `pg` pool and `public` schema puts `mastra_threads`, `mastra_messages` and `mastra_ai_spans` next to your tables. Use it rather than `PostgresStoreVNext`, because that only stores finished spans. Whereas here, `batch-with-updates` inserts each span when it starts and updates it when it ends, so the browser sees all the agent steps in progress.

## Start agents from your writes

This server function creates a record, then starts its agent:

```ts filename="src/functions/leads.ts" {16,18}
import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"
import { leadInputs, leads } from "~/db/schema"
import { db } from "~/server/db.server"
import { startLead } from "~/server/runner.server"
import { transactionId } from "~/server/txid.server"
import { requireWorkspace } from "~/server/workspace.server"

export const createLead = createServerFn({ method: "POST" })
  .validator(z.object({ leadId: z.uuid(), inputId: z.uuid(), rawText: z.string().min(1) }))
  .handler(async ({ data: { leadId, inputId, rawText } }) => {
    const { workspaceId } = await requireWorkspace()
    const result = await db.transaction(async (tx) => {
      await tx.insert(leads).values({ id: leadId, workspaceId })
      await tx.insert(leadInputs).values({ id: inputId, workspaceId, leadId, rawText })
      return transactionId(tx)
    })
    startLead({ leadId, workspaceId })
    return result
  })
```

- `requireWorkspace()` stands in for your auth check
- `transactionId(tx)` reads `pg_current_xact_id()` inside the transaction, and the client waits for that txid to [confirm its optimistic insert](../guides/mutations#returning-the-txid-from-your-backend)
- `startLead()` runs after the commit, so the agent reads committed rows, and returns without holding up the response

## Run the agent on a thread

Each run is one `generate()` call on the record's thread:

```ts filename="src/server/pipeline.server.ts" {12,17}
import type { LeadRef } from "~/lib/types"
import { enrichmentPrompt } from "~/server/enrichment/prompt"
import { recordTools } from "~/server/enrichment/record-tools.server"
import { mastra } from "~/server/mastra/mastra.server"

import { loadEnrichmentSnapshot, setLeadStatus } from "./persist.server"

export async function runEnrichment({ leadId, workspaceId, signal }: LeadRef & { signal: AbortSignal }) {
  const snapshot = await loadEnrichmentSnapshot({ leadId, workspaceId })
  await setLeadStatus({ leadId, workspaceId, status: "enriching" })
  await mastra.getAgent("enrichmentAgent").generate(enrichmentPrompt(snapshot), {
    memory: { thread: leadId, resource: workspaceId },
    toolsets: { enrichment: recordTools({ leadId, workspaceId, signal }) },
    savePerStep: true,
    abortSignal: signal
  })
  signal.throwIfAborted()
  await setLeadStatus({ leadId, workspaceId, status: "ready" })
}
```

- Mastra stores `thread` and `resource` on every thread, message and span row, and live queries filter on them. Here the thread is the record and the resource is the workspace
- `savePerStep: true` saves messages after each step, so they reach the browser while the agent works
- `generate()` can resolve after an abort, so `throwIfAborted()` keeps an aborted run from marking the record `ready`
- `recordTools()` returns Mastra `createTool()` tools that write domain rows with `updatedBy: "agent"`

## Sync agent activity to the browser

Seal Mastra's tables the way you [seal your own](../guides/queries#sealing-queries).

### Seal the spans on the server

This server function seals the workspace's spans. Records, threads and messages seal the same way:

```ts filename="src/functions/seal.ts" {14-15,19}
import { createServerFn } from "@tanstack/react-start"
import { eq, getTableColumns, sql } from "drizzle-orm"

import { mastraAiSpans } from "~/db/mastra-schema"
import { db } from "~/server/db.server"
import { realtime } from "~/server/realtime.server"
import { requireWorkspace } from "~/server/workspace.server"

export const sealSpans = createServerFn({ method: "POST" }).handler(async () => {
  const { workspaceId } = await requireWorkspace()
  const query = db
    .select({
      ...getTableColumns(mastraAiSpans),
      startedAt: sql<Date | null>`${mastraAiSpans.startedAt}`.as("startedAt"),
      endedAt: sql<Date | null>`${mastraAiSpans.endedAt}`.as("endedAt")
    })
    .from(mastraAiSpans)
    .where(eq(mastraAiSpans.resourceId, workspaceId))
  return realtime.seal({ query })
})
```

- `mastraAiSpans` declares only the columns you sync. Mastra creates and migrates the table, so keep it out of your Drizzle migrations
- Mastra's timestamp column names differ from their Drizzle field names, so `startedAt` and `endedAt` need an [SQL alias](./drizzle#alias-renamed-and-computed-fields)
- [`realtime.seal()`](../sdks/typescript#backend-realtimeserverseal) seals the server's `workspaceId`, so a browser only gets its own workspace's spans

### Filter the spans in the browser

A TanStack&nbsp;DB collection holds the sealed spans, and `useLiveQuery` narrows them to one record's thread:

```ts filename="src/realtime/activity.ts" {11-12}
import { eq, useLiveQuery } from "@tanstack/react-db"

import { useRealtime } from "~/realtime/RealtimeProvider"

export function useLeadActivity(leadId: string) {
  const { descriptors } = useRealtime()
  const { data: spans } = useLiveQuery({
    query: (q) =>
      q
        .from({ span: descriptors.spans })
        .where(({ span }) => eq(span.threadId, leadId))
        .orderBy(({ span }) => span.startedAt, "asc")
  })
  return spans
}
```

- `descriptors.spans` comes from [`realtimeCollectionOptions()`](../sdks/typescript#tanstack-db-realtimecollectionoptions) with `refreshQuery: () => sealSpans()`. Its `getKey` returns `` `${span.traceId}:${span.spanId}` ``, for the table's composite primary key
- the sealed query has no `ORDER BY`, so order the spans in `useLiveQuery`

See the [TanStack example](./tanstack) for collections, SSR and optimistic writes.

## Restart agents when users edit

When a user edits a record, commit the update, then call `restartEnrichment()`. The runner keeps one `AbortController` per record:

```ts filename="src/server/runner.server.ts" {11,17}
import type { LeadRef } from "~/lib/types"
import { markLeadFailed, runEnrichment } from "./pipeline.server"

const jobs = new Map<string, { controller: AbortController }>()
const restartTimers = new Map<string, ReturnType<typeof setTimeout>>()
export function startLead(ref: LeadRef) {
  const job = { controller: new AbortController() }
  jobs.set(ref.leadId, job)
  runEnrichment({ ...ref, signal: job.controller.signal })
    .catch((error) => job.controller.signal.aborted || markLeadFailed(ref, String(error)))
    .finally(() => jobs.get(ref.leadId) === job && jobs.delete(ref.leadId))
}

export function restartEnrichment(ref: LeadRef) {
  clearTimeout(restartTimers.get(ref.leadId))
  jobs.get(ref.leadId)?.controller.abort()
  restartTimers.set(ref.leadId, setTimeout(() => startLead(ref), 1_500))
}
```

- `restartEnrichment()` aborts the running job and starts a new one after 1.5 seconds. Each edit resets the timer, so a burst of edits restarts once
- the `jobs.get(ref.leadId) === job` check keeps an aborted run that settles late from removing its replacement

The abort reaches `generate()` through its `abortSignal` and the tools check the same signal before each write. Agents only write fields that are empty or still hold the agent's own earlier value, so a user's edit always wins. Each run starts with a fresh read, so the restarted run works from the user's values.

## Next steps

- read the guides on [queries](../guides/queries), [subscribing](../guides/subscribing) and [optimistic mutations](../guides/mutations)
- look up `realtime.seal()` and `realtimeCollectionOptions()` in the [SDK reference](../sdks/typescript)
- see the [Drizzle](./drizzle) and [TanStack](./tanstack) examples
- read Mastra's docs on [storage](https://mastra.ai/docs/storage), [memory](https://mastra.ai/docs/memory/overview) and [tracing](https://mastra.ai/docs/observability/tracing/overview)
- browse the [full source on GitHub](https://github.com/thruflo/livebase)

<NeedHelp/>
