---
title: Store Loops webhook events in Postgres
subtitle: Receive Loops delivery, bounce, spam, and unsubscribe events in a Neon Function and write them to Lakebase Postgres on Neon
summary: >-
  How to receive Loops webhooks (email.delivered, email.hardBounced,
  email.spamReported, contact.unsubscribed) in a Neon Function, verify the
  HMAC-SHA256 signature, and store each event in a table in Lakebase Postgres
  on Neon, keyed by Webhook-Id so repeat deliveries are ignored. Includes SQL
  to find addresses to stop emailing and to count deliveries per transactional
  email, and shows how to test the endpoint on a Neon branch with its own
  function URL, database, and Loops team.
enableTableOfContents: true
updatedOn: '2026-11-26T20:10:30.152Z'
---

[Loops](https://loops.so) can send a [webhook](https://loops.so/docs/webhooks) each time something happens to an email or contact: an email is delivered, bounces, or is reported as spam, or a contact unsubscribes. This guide receives those webhooks in a [Neon Function](/docs/compute/functions/overview) and writes each one to Postgres. With the events in your database, you can join email outcomes with your own users and stop emailing addresses that bounce or complain.

The function runs on the same branch as the database it writes to, so a test branch gets its own function URL and its own copy of the table.

## Before you start

You need:

- A [Loops](https://app.loops.so) account
- A [Neon](https://console.neon.tech/signup) project in a region where [Neon Functions are available](/docs/compute/functions/overview): AWS US East (Ohio) (`aws-us-east-2`), AWS US East (N. Virginia) (`aws-us-east-1`), AWS Europe (Frankfurt) (`aws-eu-central-1`), or AWS Asia Pacific (Singapore) (`aws-ap-southeast-1`). In any other region, `neon deploy` fails.
- The [Neon CLI](/docs/cli/install), with your directory [linked](/docs/cli/link) to the project

<Steps>

## Create the events table

Run this in the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) or with [`neon psql`](/docs/cli/psql):

```sql
CREATE TABLE loops_events (
  webhook_id  text PRIMARY KEY,
  event_name  text NOT NULL,
  event_time  timestamptz NOT NULL,
  source_type text,
  email       text,
  contact_id  text,
  user_id     text,
  payload     jsonb NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX loops_events_email_idx ON loops_events (email, event_time DESC);
```

Each Loops event has a unique `Webhook-Id` header, which becomes the primary key. Loops can deliver the same event more than once, and a repeat delivery then inserts nothing. `source_type` is `transactional`, `campaign`, or `loop` (Loops' name for workflow emails), and `payload` keeps the full event.

## Write the function

Install the dependencies:

```bash
npm install pg @neon/functions @neon/config
npm install -D @types/pg
```

Create `functions/loops-events.ts`. It checks the signature, then inserts the event:

```ts filename="functions/loops-events.ts" shouldWrap
import crypto from 'node:crypto';
import { attachDatabasePool } from '@neon/functions';
import { Pool } from 'pg';

// Create the pool once at module scope so it's reused across requests.
const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
attachDatabasePool(pool);

const TOLERANCE_SECONDS = 5 * 60;

type LoopsEvent = {
  eventName: string;
  eventTime?: number;
  sourceType?: string;
  contactIdentity?: { id: string; email: string; userId: string | null };
};

// Checks the request against the signing secret from Loops and returns the Webhook-Id.
function verifyLoopsWebhook(rawBody: string, headers: Headers, secret: string): string {
  const id = headers.get('webhook-id');
  const timestamp = Number(headers.get('webhook-timestamp'));
  const signatures = headers.get('webhook-signature');
  if (!id || !timestamp || !signatures) throw new Error('Missing webhook headers');
  if (Math.abs(Date.now() / 1000 - timestamp) > TOLERANCE_SECONDS) {
    throw new Error('Webhook timestamp is too old');
  }

  const key = Buffer.from(secret.replace(/^whsec_/, ''), 'base64');
  const expected = crypto
    .createHmac('sha256', key)
    .update(`${id}.${timestamp}.${rawBody}`)
    .digest();

  // The header can hold several space-separated signatures, for example during a secret roll.
  const valid = signatures.split(' ').some((entry) => {
    const [version, value] = entry.split(',');
    const given = Buffer.from(value ?? '', 'base64');
    return version === 'v1' && given.length === expected.length && crypto.timingSafeEqual(given, expected);
  });
  if (!valid) throw new Error('Invalid webhook signature');
  return id;
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST') return new Response('Use POST', { status: 405 });

    const secret = process.env.LOOPS_WEBHOOK_SECRET;
    if (!secret) return Response.json({ error: 'LOOPS_WEBHOOK_SECRET is not set' }, { status: 500 });

    const rawBody = await request.text();
    let webhookId: string;
    try {
      webhookId = verifyLoopsWebhook(rawBody, request.headers, secret);
    } catch (error) {
      return Response.json({ error: (error as Error).message }, { status: 401 });
    }

    const event = JSON.parse(rawBody) as LoopsEvent;
    const contact = event.contactIdentity;

    // Loops can deliver the same event more than once. Webhook-Id is the primary key,
    // so a repeat delivery is a no-op.
    await pool.query(
      `INSERT INTO loops_events
         (webhook_id, event_name, event_time, source_type, email, contact_id, user_id, payload)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (webhook_id) DO NOTHING`,
      [
        webhookId,
        event.eventName,
        new Date((event.eventTime ?? Date.now() / 1000) * 1000),
        event.sourceType ?? null,
        contact?.email ?? null,
        contact?.id ?? null,
        contact?.userId ?? null,
        rawBody,
      ]
    );

    return new Response(null, { status: 200 });
  },
};
```

The function verifies the raw body before parsing it, because the signature covers the exact bytes Loops sent. If the insert fails, the function returns an error and Loops retries the event, up to eight attempts over about 28 hours. `DATABASE_URL` is injected for you. See [Environment variables](/docs/compute/functions/environment-variables).

## Declare the function

Add the function to [`neon.ts`](/docs/reference/neon-ts):

```ts filename="neon.ts"
import { defineConfig } from '@neon/config/v1';

export default defineConfig({
  functions: {
    loopsevents: {
      name: 'Loops events',
      source: './functions/loops-events.ts',
      env: {
        LOOPS_WEBHOOK_SECRET: { value: process.env.LOOPS_WEBHOOK_SECRET, required: false },
      },
    },
  },
});
```

`LOOPS_WEBHOOK_SECRET` is optional here because Loops creates the signing secret only after you save the endpoint URL, and you get that URL from the first deploy. Until the secret is set, the function returns `500` and stores nothing. If you already have a `neon.ts`, add the `loopsevents` entry to its `functions`.

## Deploy and connect Loops

Deploy and get the function URL:

```bash
neon deploy
neon functions get loopsevents
```

In Loops, open [Settings > Webhooks](https://app.loops.so/settings?page=webhooks). Paste the function URL into **Endpoint URL** and click **Update URL**. Loops then creates a **Signing Secret** for the endpoint. Copy it into `.env.local`:

```bash filename=".env.local"
LOOPS_WEBHOOK_SECRET=whsec_your-signing-secret
```

Deploy again so the function has the secret, then turn on **Enable webhooks** in Loops:

```bash
neon deploy --env .env.local
```

![The Loops webhook endpoint configuration, with Enable webhooks turned on, the function URL as the endpoint URL, and the signing secret highlighted](/docs/guides/loops-webhooks/loops-webhook-endpoint.png)

Under **Subscribed events**, Loops turns on every event by default, and the function stores any event it receives. The queries in this guide use:

- `email.delivered`
- `email.hardBounced`
- `email.spamReported`
- `contact.unsubscribed`

Turn off the events you don't want to store. You can turn one back on later, such as `email.clicked`, without changing the code.

![The Email events group under Subscribed events in Loops, with email.delivered, email.hardBounced, and email.spamReported highlighted](/docs/guides/loops-webhooks/loops-webhook-email-events.png)

## Send a test event

Under **Send test**, click **Send test event**. Loops sends a `testing.testEvent` event and lists the delivery under **Messages** with its status. A row also appears in the table:

```sql
SELECT webhook_id, event_name, event_time FROM loops_events ORDER BY received_at DESC LIMIT 5;
```

![The Send test panel in Loops and a testing.testEvent delivery marked Success under Messages](/docs/guides/loops-webhooks/loops-webhook-test-event.png)

If a delivery fails, **Messages** marks it as retrying, and Loops sends it again a few minutes later. The function logs are in the Neon Console under **Monitoring** > **Functions**. A `401` with `Invalid webhook signature` usually means `LOOPS_WEBHOOK_SECRET` is from a different endpoint or team.

</Steps>

## Query the events

Find the addresses to stop emailing. A hard bounce also unsubscribes the contact in Loops, so it sends both `email.hardBounced` and `contact.unsubscribed`:

```sql
SELECT DISTINCT ON (email) email, event_name, event_time
FROM loops_events
WHERE email IS NOT NULL
  AND event_name IN ('email.hardBounced', 'email.spamReported', 'contact.unsubscribed')
ORDER BY email, event_time DESC;
```

Count deliveries and bounces per transactional email over the last week. If you send [Managed Better Auth emails through Loops](/docs/guides/loops#send-managed-better-auth-emails-with-loops), this shows whether sign-in codes reach your users:

```sql
SELECT payload->>'transactionalId' AS transactional_id,
       count(*) FILTER (WHERE event_name = 'email.delivered')    AS delivered,
       count(*) FILTER (WHERE event_name = 'email.hardBounced')  AS hard_bounced,
       count(*) FILTER (WHERE event_name = 'email.spamReported') AS spam_reports
FROM loops_events
WHERE source_type = 'transactional'
  AND event_time > now() - interval '7 days'
GROUP BY 1
ORDER BY delivered DESC;
```

The `user_id` column holds the Loops contact's `userId`. If you sync Managed Better Auth users to Loops, that's the Managed Better Auth user ID, so you can join it with `neon_auth.user` or your own users table.

## Test on a branch

Each Neon branch has its own database and its own function URLs, so you can test changes without touching production data. Because Loops allows one webhook endpoint per team, point a second Loops team at the branch. Loops lets you create more than one team with the [team switcher](https://loops.so/docs/account/team-switcher).

<Steps>

Create a branch and switch to it. The CLI pulls the branch's `DATABASE_URL` into your local env file:

```bash
neon branches create --name preview/loops-webhooks
neon checkout preview/loops-webhooks
```

The branch starts with a copy of the `loops_events` table and its data.

---

Deploy to the branch and get the branch's function URL:

```bash
neon deploy
neon functions get loopsevents
```

---

In your test Loops team, open **Settings** > **Webhooks**, save that URL as the **Endpoint URL**, and copy the endpoint's signing secret into `.env.local`. Then deploy again and turn on **Enable webhooks**:

```bash
neon deploy --env .env.local
```

---

Send a test event. The row appears in the branch's `loops_events` table, not in production.

---

When you're done, turn off the test team's endpoint in Loops. Then switch back to your production branch and delete the test branch, which also deletes its copy of `loops_events`:

```bash
neon checkout production
neon branches delete preview/loops-webhooks
```

`neon checkout` pulls the production `DATABASE_URL` back into your local env file. Set `LOOPS_WEBHOOK_SECRET` in `.env.local` back to your production endpoint's secret before you deploy to production again.

</Steps>

If you create a branch for each pull request, deploy the function to each one the same way.

<NeedHelp/>
