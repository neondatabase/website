---
title: 'Receive webhooks exactly once with Next.js, Drizzle, and Neon'
subtitle: 'Verify the signature, record every delivery under a unique index, and make processing safe to repeat, so provider retries and simultaneous deliveries never create duplicate rows or lose an event.'
author: aymen-ben-mehrez
enableTableOfContents: true
createdAt: '2026-11-24T00:00:00.000Z'
---

To receive webhooks exactly once, do three things: verify the signature on the raw request body, insert each delivery into a table with a unique index and `ON CONFLICT DO NOTHING`, and write the processing step so that running it twice gives the same result. Then a retry of a delivery you have already handled is a no-op, and a retry of one you only half handled finishes the job.

Webhook providers deliver at least once. They retry when your endpoint is slow or returns an error, and they sometimes send the same event twice at the same moment. This guide builds a Next.js route handler that stays correct in each of those cases, with [Drizzle ORM](https://orm.drizzle.team) and the [Neon serverless driver](/docs/serverless/serverless-driver).

We use this pattern in production at [SocialDesk](https://socialdesk.ai), a social media inbox where every incoming Instagram and Facebook message arrives as a webhook. The example below uses the same idea with a simplified payload.

You'll build five files:

```text
db/schema.ts                     the two tables and their unique indexes
db/index.ts                      the Drizzle client over HTTP
lib/signature.ts                 HMAC-SHA256 signature check
lib/process-event.ts             the repeatable processing step
app/api/webhooks/meta/route.ts   the webhook endpoint
```

## Install the packages

Start from a Next.js app with the App Router and TypeScript (`npx create-next-app@latest`), then install Drizzle and the Neon serverless driver. The file paths below assume the default `@/*` import alias that points at the project root; if you chose a `src/` directory, put the files under it.

```bash
npm install drizzle-orm@0.45 @neondatabase/serverless
npm install -D drizzle-kit@0.31
```

## Set the environment variables

```ini filename=".env.local"
DATABASE_URL="postgresql://[user]:[password]@[endpoint]-pooler.[region].aws.neon.tech/[dbname]?sslmode=require&channel_binding=require"
DATABASE_URL_UNPOOLED="postgresql://[user]:[password]@[endpoint].[region].aws.neon.tech/[dbname]?sslmode=require&channel_binding=require"
WEBHOOK_SECRET="the signing secret from your provider"
```

Copy both connection strings from the Neon Console: click **Connect**. The app uses `DATABASE_URL`, and migrations use the direct `DATABASE_URL_UNPOOLED`, as described in [Connect from Drizzle to Neon](/docs/guides/drizzle).

## Create the tables

Two tables do the work. `webhook_events` records every delivery you accept. `messages` holds what the events turn into.

```typescript filename="db/schema.ts"
import { sql } from 'drizzle-orm';
import { index, jsonb, pgTable, serial, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

// Every delivery we accept, exactly once per (provider, account, event).
export const webhookEvents = pgTable(
  'webhook_events',
  {
    id: serial('id').primaryKey(),
    provider: text('provider').notNull(),
    accountId: text('account_id').notNull(),
    eventId: text('event_id').notNull(),
    payload: jsonb('payload').notNull(),
    receivedAt: timestamp('received_at', { withTimezone: true }).notNull().defaultNow(),
    processedAt: timestamp('processed_at', { withTimezone: true }),
  },
  (t) => [
    uniqueIndex('webhook_events_dedupe_idx').on(t.provider, t.accountId, t.eventId),
    index('webhook_events_unprocessed_idx').on(t.receivedAt).where(sql`${t.processedAt} IS NULL`),
  ],
);

// What the events turn into: one row per message, per account.
export const messages = pgTable(
  'messages',
  {
    id: serial('id').primaryKey(),
    accountId: text('account_id').notNull(),
    messageId: text('message_id').notNull(),
    senderId: text('sender_id').notNull(),
    body: text('body').notNull(),
    sentAt: timestamp('sent_at', { withTimezone: true }).notNull(),
  },
  (t) => [uniqueIndex('messages_account_message_idx').on(t.accountId, t.messageId)],
);
```

Three details matter here:

- **The unique index is the deduplication.** Postgres enforces it even when two requests arrive in the same millisecond, which no check in application code can do.
- **The key includes the account.** The same event ID can legitimately reach you for more than one account, for example when one social account is connected in two workspaces. A unique index on the event ID alone silently drops every copy after the first. We had this bug in production: the messages were stored for the first workspace only, and the second one saw empty conversations.
- **`processed_at` separates "received" from "done".** The partial index on rows where it is `NULL` keeps the lookup for unfinished events small, however large the table grows.

Point Drizzle Kit at the schema, then generate and apply the migration:

```typescript filename="drizzle.config.ts"
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL_UNPOOLED! },
});
```

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

## Connect Drizzle to Neon

A route handler runs once per request, so there is no long-lived connection pool to keep. The Neon serverless driver sends each query over HTTP, which fits that model.

```typescript filename="db/index.ts"
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

export const db = drizzle(neon(process.env.DATABASE_URL!));
```

## Verify the signature

Providers sign the request body with a secret you share. Meta and GitHub both send the result in an `X-Hub-Signature-256` header, as `sha256=` followed by the hex digest. Compute the same HMAC over the raw body and compare the two in constant time.

```typescript filename="lib/signature.ts"
import { createHmac, timingSafeEqual } from 'node:crypto';

/** True when `header` ("sha256=<hex>") is the HMAC-SHA256 of the raw body. */
export function isValidSignature(rawBody: string, header: string | null, secret: string): boolean {
  if (!header?.startsWith('sha256=')) return false;
  const expected = createHmac('sha256', secret).update(rawBody).digest();
  const received = Buffer.from(header.slice('sha256='.length), 'hex');
  return received.length === expected.length && timingSafeEqual(received, expected);
}
```

The length check comes first because `timingSafeEqual` throws when the two buffers differ in size.

## Make processing repeatable

The processing step writes the message and marks the event as done. Both statements go to Neon in one [`db.batch()`](https://orm.drizzle.team/docs/batch-api) call, which the HTTP driver runs as a single transaction: if either statement fails, neither is kept.

```typescript filename="lib/process-event.ts"
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { messages, webhookEvents } from '@/db/schema';

export type MessageEvent = {
  accountId: string;
  messageId: string;
  senderId: string;
  text: string;
  timestamp: number;
};

/** Safe to run any number of times for the same event. */
export async function processEvent(eventRowId: number, event: MessageEvent) {
  await db.batch([
    db
      .insert(messages)
      .values({
        accountId: event.accountId,
        messageId: event.messageId,
        senderId: event.senderId,
        body: event.text,
        sentAt: new Date(event.timestamp),
      })
      .onConflictDoNothing({ target: [messages.accountId, messages.messageId] }),
    db.update(webhookEvents).set({ processedAt: new Date() }).where(eq(webhookEvents.id, eventRowId)),
  ]);
}
```

`onConflictDoNothing` on the message is what makes a second run harmless. Apply the same rule to anything else you do here: use upserts for writes, and pass the event ID as an idempotency key to any API you call.

## Write the route handler

```typescript filename="app/api/webhooks/meta/route.ts"
import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { webhookEvents } from '@/db/schema';
import { processEvent, type MessageEvent } from '@/lib/process-event';
import { isValidSignature } from '@/lib/signature';

const PROVIDER = 'meta';

export async function POST(request: Request) {
  // 1. Verify the signature against the raw body, before parsing anything.
  const rawBody = await request.text();
  if (!isValidSignature(rawBody, request.headers.get('x-hub-signature-256'), process.env.WEBHOOK_SECRET!)) {
    return new Response('Invalid signature', { status: 401 });
  }

  const event = JSON.parse(rawBody) as MessageEvent;

  // 2. Record the delivery. The unique index makes a repeat insert a no-op.
  const [inserted] = await db
    .insert(webhookEvents)
    .values({ provider: PROVIDER, accountId: event.accountId, eventId: event.messageId, payload: event })
    .onConflictDoNothing({ target: [webhookEvents.provider, webhookEvents.accountId, webhookEvents.eventId] })
    .returning({ id: webhookEvents.id });

  let eventRowId = inserted?.id;

  if (!eventRowId) {
    // 3. Seen before. Only skip it if the first attempt finished.
    const [existing] = await db
      .select({ id: webhookEvents.id, processedAt: webhookEvents.processedAt })
      .from(webhookEvents)
      .where(
        and(
          eq(webhookEvents.provider, PROVIDER),
          eq(webhookEvents.accountId, event.accountId),
          eq(webhookEvents.eventId, event.messageId),
        ),
      );
    if (existing.processedAt) return Response.json({ status: 'duplicate' });
    eventRowId = existing.id;
  }

  // 4. Do the work. A failure here returns 500, so the provider retries.
  await processEvent(eventRowId, event);
  return Response.json({ status: 'processed' });
}
```

Read the body with `request.text()`, not `request.json()`. The signature covers the exact bytes the provider sent, and parsing then re-serializing can change them.

Step 3 is the part that is easy to get wrong. If you answer "duplicate" to every delivery whose insert conflicted, an event that was recorded but failed during processing is lost: the provider retries, you see the existing row, and you skip it. Checking `processed_at` turns that retry into the second attempt it was meant to be.

`.returning()` tells you which case you are in. With `ON CONFLICT DO NOTHING`, Postgres returns the new row when the insert happened and no rows when it was skipped.

## What happens in each case

| Delivery | Insert | `processed_at` | Result |
| --- | --- | --- | --- |
| New event | Inserts a row | `NULL` | Processed |
| Retry after success | Skipped | Set | `duplicate`, nothing written |
| Retry after a failed attempt | Skipped | `NULL` | Processed now |
| Same message ID, another account | Inserts a row | `NULL` | Processed |
| Several copies at the same moment | One inserts, the others are skipped | `NULL` until the first one finishes | Each copy may run the processing step; one message row exists |

In the last case several requests can process the same event at once. That is safe because the processing step is repeatable, and it is why the step has to be written that way.

## Re-run events that never finished

A provider stops retrying after a while. If your processing was failing for longer than that, some events stay recorded and unprocessed. Because every payload is stored, you can finish them yourself:

```typescript filename="lib/sweep.ts"
import { and, isNull, lt, sql } from 'drizzle-orm';
import { db } from '@/db';
import { webhookEvents } from '@/db/schema';
import { processEvent, type MessageEvent } from './process-event';

/** Re-run events that were recorded but never finished. Call it from a scheduled job. */
export async function sweepUnprocessedEvents(limit = 100) {
  const stuck = await db
    .select({ id: webhookEvents.id, payload: webhookEvents.payload })
    .from(webhookEvents)
    .where(and(isNull(webhookEvents.processedAt), lt(webhookEvents.receivedAt, sql`now() - interval '5 minutes'`)))
    .orderBy(webhookEvents.receivedAt)
    .limit(limit);

  for (const row of stuck) {
    await processEvent(row.id, row.payload as MessageEvent);
  }
  return stuck.length;
}
```

The five-minute delay leaves events alone while the provider may still be retrying them. This query uses the partial index from the schema, so it reads only the unfinished rows.

## Test it with curl

Start the app with `npm run dev`, then send a signed request twice:

```bash
BODY='{"accountId":"acct_1","messageId":"mid.100","senderId":"user_9","text":"Do you ship to Geneva?","timestamp":1763971200000}'
SIG=$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "$WEBHOOK_SECRET" | sed 's/^.* //')

curl -X POST http://localhost:3000/api/webhooks/meta \
  -H "content-type: application/json" \
  -H "x-hub-signature-256: sha256=$SIG" \
  -d "$BODY"
```

The first call returns `{"status":"processed"}` and the second returns `{"status":"duplicate"}`. Change one character of `SIG` and the endpoint answers `401`.

## Test schema changes on a branch

Deduplication depends on the unique indexes, so a migration that changes them deserves a rehearsal. Create a [branch](/docs/introduction/branching) of your database, point `DATABASE_URL_UNPOOLED` at it, run `npx drizzle-kit migrate`, and replay a few stored payloads from `webhook_events` against the branch before you apply the migration to production.

## Things to watch for

- **Scope the key to the account.** If the same event can be delivered for several of your account records, the event ID alone is not a safe unique key.
- **Answer fast.** Providers treat a slow answer as a failed delivery and send the event again. If processing is slow, return `200` after step 2 and let a scheduled job run the processing step from `webhook_events`.
- **The HTTP driver has no interactive transactions.** `db.batch()` covers statements you can list in advance. If one statement needs the result of another inside the same transaction, use the driver's WebSocket `Pool` with `drizzle-orm/neon-serverless` instead ([Neon serverless driver](/docs/serverless/serverless-driver)).
- **Some providers verify the endpoint first.** Meta sends a one-time `GET` request with a challenge when you register the URL. Add a `GET` handler for it as described in the [provider's documentation](https://developers.facebook.com/docs/graph-api/webhooks/getting-started).
- **Keep the raw payloads for a while, not forever.** They are what lets you replay events, and they may contain personal data. Delete processed rows after a retention period that suits you.

## Related resources

- [Connect from Drizzle to Neon](/docs/guides/drizzle)
- [Neon serverless driver](/docs/serverless/serverless-driver)
- [Connect a Next.js application to Neon](/docs/guides/nextjs)
- [Branching](/docs/introduction/branching)
- [Drizzle: insert with `onConflictDoNothing`](https://orm.drizzle.team/docs/insert)
- [Drizzle: batch API](https://orm.drizzle.team/docs/batch-api)

<NeedHelp/>
