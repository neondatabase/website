---
title: 'Optimistic mutations'
subtitle: 'Make apps and agents super fast, with instant local writes.'
summary: >-
  Write through your own backend, return the transaction id, apply the change optimistically and drop the optimistic state once the change arrives on the live query. Without a framework, with React useOptimistic or with TanStack DB.
enableTableOfContents: true
---

Apply instant local writes using [optimistic mutations](#how-optimistic-mutations-work) that [automatically discard their optimistic state](#automatic-management-of-optimistic-state) when the changes [sync in through your live&nbsp;query subscriptions](./subscribing#listen-for-changes).

## How optimistic mutations work

Normally, with online systems, you first send writes to the server and then display them to the user once the server has written to the database and responded successfully. Depending on network connectivity and system uptime, this can be slow or broken.

With optimistic mutations, you first display the write to the user and only then send to the server in the background. This makes apps feel super-fast and responsive, as well as resilient to connectivity or downtime issues.

### Automatic management of optimistic state

Realtime allows you to automate the management and lifecycle of your optimistic state, by monitoring the transactions coming through your live query subscriptions. For each write:

1. apply the change to local, optimistic state, so the UI updates straight away
2. send the write through your backend, with your normal validation, authorization and backend logic, which returns the [ID of the transaction](https://www.postgresql.org/docs/current/transaction-id.html) that made it
3. wait for that transaction ID to arrive on the subscription using [`awaitTxId()`](../sdks/typescript#client-materializedlivequerysubscriptionawaittxid)
4. drop the optimistic state
5. if the write fails, or its transaction ID doesn't arrive before the timeout, drop the optimistic state and show an error

`awaitTxId()` remembers recently seen transaction IDs, so it resolves even when the change arrives before your backend's HTTP response. It also resolves after the subscription's `onChange`, so the synced rows already include the change when the optimistic state drops, which means nothing flickers.

## Running example

Let's return to our running example, flesh out the backend server, call its new routes from the frontend and add some shared frontend helpers.

### Returning the `txid` from your backend

Each write route runs its write in a Drizzle transaction and reads the transaction's id before it commits. That's why the [queries guide](./queries#setup) set up `backend/db.ts` with the `neon-serverless` driver, which can run interactive transactions.

Add the three write routes to `backend/server.ts`, chained onto the same app so `AppType` carries them to the frontend. They follow the `/api/v1/messages/live` route from the [queries guide](./queries#exposing-an-endpoint) and the `/api/v1/inbox/live` route from the [reactivity guide](./reactivity#seal-a-broader-query):

```ts filename="backend/server.ts"
import { and, eq, ne, sql } from "drizzle-orm"
import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import { validator } from "hono/validator"

import { requireUser } from "./auth"
import { db } from "./db"
import { channelMembers, messages } from "./schema"

export type MutationResponse =
  | { readonly kind: "committed"; readonly txid: string }
  | { readonly kind: "unchanged" }

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0]

// Must run inside the write transaction, so it returns that transaction's id
async function currentTxId(tx: Transaction): Promise<string> {
  const result = await tx.execute<{ txid: string }>(sql`select pg_current_xact_id()::text as txid`)

  return result.rows[0]!.txid
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID.test(value)
}

const messageId = validator("param", (value, c) => {
  const id: unknown = value.id

  if (!isUuid(id)) {
    return c.json({ error: "id must be a uuid" }, 400)
  }

  return { id }
})

const app = new Hono()
  // ...the sealing routes: /api/v1/messages/live and /api/v1/inbox/live
  .post(
    "/api/v1/messages",
    validator("json", (value, c) => {
      const id: unknown = value?.id
      const channelId: unknown = value?.channelId
      const body: unknown = value?.body

      if (!isUuid(id)) {
        return c.json({ error: "id must be a uuid" }, 400)
      }

      if (typeof channelId !== "number" || !Number.isInteger(channelId)) {
        return c.json({ error: "channelId must be an integer" }, 400)
      }

      if (typeof body !== "string" || body.trim() === "") {
        return c.json({ error: "body must be a non-empty string" }, 400)
      }

      return { id, channelId, body }
    }),
    async (c) => {
      const user = await requireUser(c)
      const { id, channelId, body } = c.req.valid("json")

      const result = await db.transaction(async (tx): Promise<MutationResponse> => {
        const [membership] = await tx
          .select({ user_id: channelMembers.user_id })
          .from(channelMembers)
          .where(and(eq(channelMembers.channel_id, channelId), eq(channelMembers.user_id, user.id)))

        if (!membership) {
          throw new HTTPException(403, { message: "Not a member of this channel" })
        }

        await tx.insert(messages).values({ id, channel_id: channelId, author_id: user.id, body })

        return { kind: "committed", txid: await currentTxId(tx) }
      })

      return c.json(result)
    }
  )
  .patch(
    "/api/v1/messages/:id",
    messageId,
    validator("json", (value, c) => {
      const body: unknown = value?.body

      if (typeof body !== "string" || body.trim() === "") {
        return c.json({ error: "body must be a non-empty string" }, 400)
      }

      return { body }
    }),
    async (c) => {
      const user = await requireUser(c)
      const { id } = c.req.valid("param")
      const { body } = c.req.valid("json")

      const result = await db.transaction(async (tx): Promise<MutationResponse> => {
        const updated = await tx
          .update(messages)
          .set({ body })
          .where(and(eq(messages.id, id), eq(messages.author_id, user.id), ne(messages.body, body)))
          .returning({ id: messages.id })

        if (updated.length === 0) {
          return { kind: "unchanged" }
        }

        return { kind: "committed", txid: await currentTxId(tx) }
      })

      return c.json(result)
    }
  )
  .delete("/api/v1/messages/:id", messageId, async (c) => {
    const user = await requireUser(c)
    const { id } = c.req.valid("param")

    const result = await db.transaction(async (tx): Promise<MutationResponse> => {
      const deleted = await tx
        .delete(messages)
        .where(and(eq(messages.id, id), eq(messages.author_id, user.id)))
        .returning({ id: messages.id })

      if (deleted.length === 0) {
        return { kind: "unchanged" }
      }

      return { kind: "committed", txid: await currentTxId(tx) }
    })

    return c.json(result)
  })

export type AppType = typeof app

export default app
```

Call [`pg_current_xact_id()`](https://www.postgresql.org/docs/current/functions-info.html#FUNCTIONS-INFO-SNAPSHOT) inside the write's transaction. The `::text` cast returns the txid as a decimal string, so its 64-bit value stays exact in JavaScript.

Each route also checks what the user can change. Sending looks up the sender's `channel_members` row inside the transaction and throws a 403 without one. Editing and deleting restrict the write to messages the user wrote, so only the author can change a message.

When an edit or a delete matches no rows, the route returns `{ kind: "unchanged" }` instead of a txid. That happens when an edit leaves the text as it was, when the message doesn't exist or when someone else wrote it. Nothing changed, so there's nothing to wait for.

<Admonition type="important" title="Always pass a timeout">
`awaitTxId()` doesn't reject when the subscription errors, so without a timeout it keeps waiting until you unsubscribe. With one, it rejects, the optimistic change drops and the UI shows that the change couldn't be confirmed.
</Admonition>

### Calling the routes from the frontend

Add a helper for each route to `frontend/api.ts`, next to `fetchSealedMessages()` from the [subscribing guide](./subscribing#fetch-from-an-api-endpoint). Add `MutationResponse` to the file's type import from `../backend/server`, so each helper returns the route's own response type:

```ts filename="frontend/api.ts"
import type { AppType, MutationResponse } from "../backend/server"

export async function sendMessage({
  id,
  channel_id,
  body
}: Pick<Message, "id" | "channel_id" | "body">): Promise<MutationResponse> {
  const res = await server.api.v1.messages.$post({ json: { id, channelId: channel_id, body } })

  if (!res.ok) {
    throw new Error(`Could not send the message (${res.status})`)
  }

  return res.json()
}

export async function editMessage(id: string, body: string): Promise<MutationResponse> {
  const res = await server.api.v1.messages[":id"].$patch({ param: { id }, json: { body } })

  if (!res.ok) {
    throw new Error(`Could not edit the message (${res.status})`)
  }

  return res.json()
}

export async function deleteMessage(id: string): Promise<MutationResponse> {
  const res = await server.api.v1.messages[":id"].$delete({ param: { id } })

  if (!res.ok) {
    throw new Error(`Could not delete the message (${res.status})`)
  }

  return res.json()
}
```

The `hc` client types each call from its route's validators, so a wrong field or a missing param is a compile error.

### Shared mutation helpers

All three approaches below share the helpers in `frontend/mutations.ts`: the mutation and message types, `newMessage()`, the `applyMutation()` reducer and `writeMutation()`, which calls the route helpers you just added to `frontend/api.ts`:

```ts filename="frontend/mutations.ts"
import type { Message } from "../backend/schema"
import type { MutationResponse } from "../backend/server"
import { deleteMessage, editMessage, sendMessage } from "./api"

export type MessageMutation =
  | { readonly type: "send"; readonly message: Message }
  | { readonly type: "edit"; readonly id: string; readonly body: string }
  | { readonly type: "delete"; readonly id: string }

export type OptimisticMessage = Message & {
  readonly pending?: boolean;
}

// The server sets its own author and timestamp, but keeps the client's id
export function newMessage(channelId: number, authorId: string, body: string): Message {
  return { id: crypto.randomUUID(), channel_id: channelId, author_id: authorId, body, created_at: new Date() }
}

export function applyMutation(
  messages: readonly OptimisticMessage[],
  mutation: MessageMutation
): readonly OptimisticMessage[] {
  switch (mutation.type) {
    case "send":
      // Once the sent message has synced, show the synced row only
      if (messages.some((message) => message.id === mutation.message.id)) {
        return messages
      }

      // Newest first, to match the query's order
      return [{ ...mutation.message, pending: true }, ...messages]
    case "edit":
      return messages.map((message) =>
        message.id === mutation.id ? { ...message, body: mutation.body, pending: true } : message
      )
    case "delete":
      return messages.filter((message) => message.id !== mutation.id)
  }
}

export function writeMutation(mutation: MessageMutation): Promise<MutationResponse> {
  switch (mutation.type) {
    case "send":
      return sendMessage(mutation.message)
    case "edit":
      return editMessage(mutation.id, mutation.body)
    case "delete":
      return deleteMessage(mutation.id)
  }
}
```

A send carries the whole new row, with an id the client picks with `crypto.randomUUID()`. The synced row has the same id, so the optimistic row never needs swapping for a real one, and `applyMutation()` skips a pending send once the synced rows include it. That way, a sent message never shows twice.

## Using optimistic mutations

Pick [without a framework](#without-a-framework) to see the mechanism or for apps that don't use React, [React's `useOptimistic` hook](#with-reacts-useoptimistic-hook) for React apps that keep optimistic state locally in a component, or [TanStack&nbsp;DB collections](#with-tanstack-db-collections) for apps that sync into a normalized client store.

### Without a framework

Without a framework, you keep the optimistic state yourself. `frontend/messages.ts` keeps an overlay of pending mutations on top of the subscription's synced rows, and merges the two every time either side changes:

```ts filename="frontend/messages.ts"
import type { LiveQueryState, MaterializedLiveQuerySubscription } from "@neon/realtime/client"

import type { Message } from "../backend/schema"
import { applyMutation, type MessageMutation, type OptimisticMessage, writeMutation } from "./mutations"

export function optimisticMessages(
  subscription: MaterializedLiveQuerySubscription<Message>,
  render: (messages: readonly OptimisticMessage[], state: LiveQueryState, error: string | undefined) => void
) {
  // A Map keeps insertion order, so mutations apply in the order they were made
  const pending = new Map<number, MessageMutation>()
  let nextKey = 0
  let error: string | undefined
  let stopped = false

  function update() {
    if (stopped) {
      return
    }

    const snapshot = subscription.getSnapshot()
    const synced: readonly OptimisticMessage[] = snapshot.data ?? []

    render([...pending.values()].reduce(applyMutation, synced), snapshot, error)
  }

  async function mutate(mutation: MessageMutation) {
    const key = nextKey++

    error = undefined
    pending.set(key, mutation)
    update()

    try {
      const result = await writeMutation(mutation)

      if (result.kind === "committed") {
        await subscription.awaitTxId(result.txid, 10_000)
      }
    } catch {
      error = "Couldn't confirm the change"
    } finally {
      pending.delete(key)
      update()
    }
  }

  const unsubscribe = subscription.onChange(update)

  update()

  return {
    mutate,
    stop: () => {
      stopped = true
      unsubscribe()
    }
  }
}
```

Each mutation leaves the overlay once its txid arrives, or once it fails. Either way, the list falls back to the synced rows, which by then either include the change or show that it didn't happen.

Call `optimisticMessages()` with the subscription you created in the [subscribing guide](./subscribing#subscribe-to-the-sealed-query) and a function that draws the list. It replaces `subscription.onChange(render)` from that guide, and passes the subscription's state through, so the page can show its status line as before. Call `mutate()` from your UI, with `newMessage()` for a send. It needs the signed-in user's id, which you read from the [Neon Auth](/docs/auth/overview) session, as `frontend/main.tsx` does in the [TanStack&nbsp;DB section](#with-tanstack-db-collections). Show Edit and Delete only on the user's own messages, and disable them on pending messages, so you don't start a new change on a message whose last change isn't confirmed yet. The routes still enforce authorship. Call `stop()` before you unsubscribe.

### With React's `useOptimistic` hook

In React, `useOptimistic` holds the overlay for you and each write runs in its own transition. This is the optimistic version of `frontend/Messages.tsx` from the [reactivity guide](./reactivity#uselivequery). It runs the same live query and takes the same props, plus `channelId` and the signed-in user's `userId`, which `Channel` passes in (shown after the component). It reuses the types and helpers from `frontend/mutations.ts`, and `LocalTime` from the same guide:

```tsx filename="frontend/Messages.tsx"
import { type FormEvent, startTransition, useEffect, useOptimistic, useState } from "react"
import { useLiveQuery } from "@neon/realtime-react"
import type { SealedLiveQuery } from "@neon/realtime/client"

import type { Message } from "../backend/schema"
import { LocalTime } from "./LocalTime"
import {
  applyMutation,
  type MessageMutation,
  newMessage,
  type OptimisticMessage,
  writeMutation
} from "./mutations"

const NO_MESSAGES: readonly OptimisticMessage[] = []

interface Props {
  sealedQuery: SealedLiveQuery<Message>;
  refreshQuery: () => Promise<SealedLiveQuery<Message>>;
  initialData?: readonly Message[];
  channelId: number;
  userId: string;
}

export function Messages({ sealedQuery, refreshQuery, initialData, channelId, userId }: Props) {
  const { data, status, error, utils } = useLiveQuery(sealedQuery, { refreshQuery, initialData })

  const [messages, addOptimistic] = useOptimistic<readonly OptimisticMessage[], MessageMutation>(
    data ?? NO_MESSAGES,
    applyMutation
  )

  const [mutationError, setMutationError] = useState<string>()

  useEffect(() => {
    return utils.onBatch((changes, batch) => {
      console.debug(`Applied ${changes.length} changes from transactions ${batch.txids.join(", ")}`)
    })
  }, [utils])

  function mutate(mutation: MessageMutation) {
    setMutationError(undefined)

    startTransition(async () => {
      addOptimistic(mutation)

      try {
        const result = await writeMutation(mutation)

        if (result.kind === "committed") {
          await utils.awaitTxId(result.txid, 10_000)
        }
      } catch {
        setMutationError("Couldn't confirm the change")
      }
    })
  }

  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const body = String(new FormData(form).get("body") ?? "").trim()

    if (body) {
      form.reset()
      mutate({ type: "send", message: newMessage(channelId, userId, body) })
    }
  }

  function edit(message: OptimisticMessage) {
    const body = window.prompt("Edit message", message.body)?.trim()

    if (body) {
      mutate({ type: "edit", id: message.id, body })
    }
  }

  if (status === "error") {
    return <p role="alert">Live updates stopped: {error.message}</p>
  }

  if (data === undefined) {
    return <p>Loading messages</p>
  }

  return (
    <section>
      <form onSubmit={send}>
        <input name="body" placeholder="Message" required />
        <button type="submit">Send</button>
      </form>

      {status === "stale" && <p role="status">Updating</p>}
      {mutationError && <p role="alert">{mutationError}</p>}

      <ul>
        {messages.map((message) => (
          <li key={message.id} aria-busy={message.pending}>
            <LocalTime date={message.created_at} />
            <p>{message.body}</p>
            {message.author_id === userId && (
              <>
                <button disabled={message.pending} onClick={() => edit(message)} type="button">
                  Edit
                </button>
                <button
                  disabled={message.pending}
                  onClick={() => mutate({ type: "delete", id: message.id })}
                  type="button"
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
```

`mutate()` runs each mutation in its own transition, so independent writes run concurrently. The transition applies the mutation optimistically, writes through your backend and, if the write committed, waits for its txid with [`utils.awaitTxId()`](../sdks/typescript#react-uselivequeryutils). When the transition ends, React drops its optimistic change. By then the change is in `data`, with the same id for a sent message, so the list doesn't flicker. If the write fails or isn't confirmed in time, the optimistic change drops the same way, the message reverts and the error line shows.

Edit and Delete show only on the user's own messages, and the routes still enforce authorship. They're disabled on pending messages, so you don't start a new change on a message whose last change isn't confirmed yet.

In `frontend/Channel.tsx` from the [reactivity guide](./reactivity#changing-query-parameters), give `Channel` a `userId` prop and pass it to `Messages` with `channelId`. Read `userId` from the [Neon Auth](/docs/auth/overview) session where you render `Channel`, as `frontend/main.tsx` does in the [TanStack&nbsp;DB section](#with-tanstack-db-collections):

```tsx filename="frontend/Channel.tsx"
// ...imports and useSealedQuery() as in the reactivity guide

export function Channel({ channelId, userId }: { channelId: number; userId: string }) {
  const sealed = useSealedQuery(channelId)
  // Renewals must be for the same query, so refresh with the same channel
  const refreshQuery = useCallback(() => fetchSealedMessages(channelId), [channelId])

  if (sealed?.sealedQuery) {
    return (
      <Messages
        sealedQuery={sealed.sealedQuery}
        refreshQuery={refreshQuery}
        channelId={channelId}
        userId={userId}
      />
    )
  }

  if (sealed?.error) {
    return <p role="alert">Couldn't open this channel</p>
  }

  return <p>Loading messages</p>
}
```

### With TanStack DB collections

For more control, keep optimistic state in a [TanStack&nbsp;DB](https://tanstack.com/db/latest/docs/overview) collection. Every query and component that reads the collection then sees the same optimistic changes, and they stay consistent across client-side joins. Failed writes roll back automatically, and one transaction can span several collections.

Add mutation handlers to `createMessagesCollection()` in `frontend/collections.ts`, from the [reactivity guide](./reactivity#create-the-collection). Each handler calls your backend and, if the write committed, waits for its txid before it returns, so TanStack&nbsp;DB keeps the optimistic state until the change has synced:

```ts filename="frontend/collections.ts"
import { createCollection } from "@tanstack/react-db"
import { realtimeCollectionOptions } from "@neon/realtime-tanstack"
import type { SealedLiveQuery } from "@neon/realtime/client"

import type { Message } from "../backend/schema"
import { deleteMessage, editMessage, fetchSealedInbox, sendMessage } from "./api"
import { client } from "./client"

export function createMessagesCollection(sealedQuery: SealedLiveQuery<Message>) {
  return createCollection(
    realtimeCollectionOptions({
      id: "messages",
      client,
      query: sealedQuery,
      refreshQuery: fetchSealedInbox,
      getKey: (message) => message.id,
      onInsert: async ({ transaction, collection }) => {
        const result = await sendMessage(transaction.mutations[0].modified)

        if (result.kind === "committed") {
          await collection.utils.awaitTxId(result.txid, 10_000)
        }
      },
      onUpdate: async ({ transaction, collection }) => {
        const { id, body } = transaction.mutations[0].modified
        const result = await editMessage(id, body)

        if (result.kind === "committed") {
          await collection.utils.awaitTxId(result.txid, 10_000)
        }
      },
      onDelete: async ({ transaction, collection }) => {
        const result = await deleteMessage(transaction.mutations[0].original.id)

        if (result.kind === "committed") {
          await collection.utils.awaitTxId(result.txid, 10_000)
        }
      }
    })
  )
}

export type MessagesCollection = ReturnType<typeof createMessagesCollection>
```

While a handler runs, TanStack&nbsp;DB holds back synced changes. When the handler returns, it drops the optimistic state and applies the synced rows together, so a sent message's optimistic row gives way to its synced row, which has the same id, in a single step. If a handler throws, the optimistic change rolls back. [`collection.utils.awaitTxId()`](../sdks/typescript#tanstack-db-realtimecollectionutilsawaittxid) resolves once the transaction has entered TanStack&nbsp;DB's sync queue, and it takes the same explicit timeout.

Then write through the collection. This is the optimistic version of `frontend/Inbox.tsx` from the [reactivity guide](./reactivity#query-the-collection). It runs the same local query, and its `insert()`, `update()` and `delete()` calls apply each change locally at once and call the matching handler:

```tsx filename="frontend/Inbox.tsx"
import type { FormEvent } from "react"
import { eq, useLiveQuery as useCollectionQuery } from "@tanstack/react-db"

import type { Message } from "../backend/schema"
import type { MessagesCollection } from "./collections"
import { newMessage } from "./mutations"

interface Props {
  messagesCollection: MessagesCollection;
  channelId: number;
  userId: string;
}

export function Inbox({ messagesCollection, channelId, userId }: Props) {
  const { data, isReady, isError } = useCollectionQuery({
    query: (q) =>
      q
        .from({ message: messagesCollection })
        .where(({ message }) => eq(message.channel_id, channelId))
        .orderBy(({ message }) => message.created_at, "desc")
  })

  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const body = String(new FormData(form).get("body") ?? "").trim()

    if (body) {
      form.reset()
      messagesCollection.insert(newMessage(channelId, userId, body))
    }
  }

  function edit(message: Message) {
    const body = window.prompt("Edit message", message.body)?.trim()

    if (body) {
      messagesCollection.update(message.id, (draft) => {
        draft.body = body
      })
    }
  }

  if (isError) {
    return <p role="alert">Couldn't sync messages</p>
  }

  if (!isReady) {
    return <p>Loading messages</p>
  }

  return (
    <section>
      <form onSubmit={send}>
        <input name="body" placeholder="Message" required />
        <button type="submit">Send</button>
      </form>

      <ul>
        {data.map((message) => (
          <li key={message.id} aria-busy={!message.$synced}>
            {message.body}
            {message.author_id === userId && (
              <>
                <button disabled={!message.$synced} onClick={() => edit(message)} type="button">
                  Edit
                </button>
                <button
                  disabled={!message.$synced}
                  onClick={() => messagesCollection.delete(message.id)}
                  type="button"
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
```

`$synced` is `false` while a row has a pending optimistic change, which disables its buttons, so you don't start a new change on a message whose last change isn't confirmed yet. Edit and Delete show only on the user's own messages, and the routes still enforce authorship. Each call returns a TanStack&nbsp;DB transaction, and its `isPersisted.promise` rejects if the write fails, so you can await it to show an error.

An optimistic insert needs a whole `Message`, so the component also takes the signed-in user's id. It only fills in the optimistic row, because the server takes the author from the verified token. Read it from the [Neon Auth](/docs/auth/overview) session in `frontend/main.tsx`, where the app creates the collection:

```tsx filename="frontend/main.tsx"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { fetchSealedInbox } from "./api"
import { authClient } from "./auth"
import { createMessagesCollection } from "./collections"
import { Inbox } from "./Inbox"

const { data: session } = await authClient.getSession()

if (!session) {
  throw new Error("Sign in before loading messages")
}

const messagesCollection = createMessagesCollection(await fetchSealedInbox())

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Inbox messagesCollection={messagesCollection} channelId={2} userId={session.user.id} />
  </StrictMode>
)
```

The [TanStack example](../examples/tanstack) puts these handlers into a full app with server-side rendering, and the [Next.js example](../examples/nextjs) shows the React binding in a server-rendered app.

<NeedHelp/>
