---
title: Store AutoSend webhook events in Neon
subtitle: Receive AutoSend delivery, bounce, spam, and unsubscribe events in a Neon Function and write them to Lakebase Postgres on Neon
author: rishi-raj-jain
enableTableOfContents: true
createdAt: '2026-11-27T00:00:00.000Z'
updatedOn: '2026-11-27T05:28:08.327Z'
---

[AutoSend](https://autosend.com) can send a [webhook](https://docs.autosend.com/others/webhooks/introduction) when an email is delivered, bounces, or is reported as spam, when a recipient unsubscribes, and when a contact changes. In this guide, you'll receive those webhooks in a [Neon Function](/docs/compute/functions/overview) and write each one to Postgres. With the events in your database, you can join email outcomes with your own users and stop emailing addresses that bounce or complain.

The function runs on the same branch as the database it writes to, so a test branch gets its own function URL and its own copy of the table.

## Prerequisites

- Node.js 22 or later
- The [Neon CLI](/docs/cli/install), with your directory [linked](/docs/cli/link) to the project
- A [Neon](https://console.neon.tech/signup) project in a region where [Neon Functions are available](/docs/compute/functions/overview)
- An [AutoSend](https://autosend.com) account with a [verified sending domain](https://docs.autosend.com/domain) and a project API key

<Steps>

## Create the events table

Run this in the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) or with [`neon psql`](/docs/cli/psql):

```sql
CREATE TABLE autosend_events (
  delivery_id text PRIMARY KEY,
  event_type  text NOT NULL,
  event_time  timestamptz NOT NULL,
  email_id    text,
  email       text,
  contact_id  text,
  payload     jsonb NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX autosend_events_email_id_idx ON autosend_events (email_id);
CREATE INDEX autosend_events_email_idx ON autosend_events (email, event_time DESC);
```

Every attempt of a delivery has the same `X-Webhook-Delivery-Id` header, which becomes the primary key, so a retry after a successful insert adds no row. `email` holds the recipient of an email event or the address of a contact event, in lowercase, and `payload` keeps the full event. `email.unsubscribed` events have no address, only the `emailId` of the email, so the queries in this guide look up the address by `email_id`.

## Write the function

Install the dependencies:

```bash
npm install pg @neon/functions @neon/config
npm install -D @types/pg
```

Create `functions/autosend-events.ts`. It checks the signature, then inserts the event:

```ts filename="functions/autosend-events.ts" shouldWrap
import crypto from 'node:crypto';
import { attachDatabasePool } from '@neon/functions';
import { Pool } from 'pg';

// Create the pool once at module scope so it's reused across requests.
const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
attachDatabasePool(pool);

type AutoSendEvent = {
  type: string;
  createdAt: string;
  data: {
    emailId?: string;
    contactId?: string;
    email?: string;
    to?: { email: string; name?: string };
  };
};

// AutoSend signs the raw body with HMAC-SHA256, using the webhook secret as the key.
function isValidSignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  const given = Buffer.from(signature);
  return given.length === expected.length && crypto.timingSafeEqual(given, Buffer.from(expected));
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST') return new Response('Use POST', { status: 405 });

    const secret = process.env.AUTOSEND_WEBHOOK_SECRET;
    if (!secret) return Response.json({ error: 'AUTOSEND_WEBHOOK_SECRET is not set' }, { status: 500 });

    const rawBody = await request.text();
    if (!isValidSignature(rawBody, request.headers.get('x-webhook-signature'), secret)) {
      return Response.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    const deliveryId = request.headers.get('x-webhook-delivery-id');
    if (!deliveryId) return Response.json({ error: 'Missing X-Webhook-Delivery-Id' }, { status: 400 });

    const event = JSON.parse(rawBody) as AutoSendEvent;
    const { data } = event;

    // AutoSend retries a failed delivery with the same X-Webhook-Delivery-Id.
    // It's the primary key, so a retry that arrives after a successful insert is a no-op.
    await pool.query(
      `INSERT INTO autosend_events
         (delivery_id, event_type, event_time, email_id, email, contact_id, payload)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (delivery_id) DO NOTHING`,
      [
        deliveryId,
        event.type,
        event.createdAt,
        data.emailId ?? null,
        (data.to?.email ?? data.email ?? null)?.toLowerCase() ?? null,
        data.contactId ?? null,
        rawBody,
      ]
    );

    return new Response(null, { status: 200 });
  },
};
```

The function verifies the raw body before parsing it, because AutoSend signs the exact bytes it sent, as a hex HMAC-SHA256 keyed with the webhook secret. If the insert fails, the function returns an error and AutoSend retries the delivery twice, about 5 and then 10 seconds later. After that, AutoSend marks the delivery failed and doesn't send it again. `DATABASE_URL` is injected for you. See [Environment variables](/docs/compute/functions/environment-variables).

## Declare the function

Add the function to [`neon.ts`](/docs/reference/neon-ts):

```ts filename="neon.ts"
import { defineConfig } from '@neon/config/v1';

export default defineConfig({
  functions: {
    autosendevents: {
      name: 'AutoSend events',
      source: './functions/autosend-events.ts',
      env: {
        AUTOSEND_WEBHOOK_SECRET: { value: process.env.AUTOSEND_WEBHOOK_SECRET, required: false },
      },
    },
  },
});
```

`AUTOSEND_WEBHOOK_SECRET` is optional here because AutoSend creates the secret when you create the webhook, and the webhook needs the function URL from the first deploy. Until the secret is set, the function returns `500` and stores nothing. If you already have a `neon.ts`, add the `autosendevents` entry to its `functions`.

## Deploy and create the webhook

Deploy and get the function URL:

```bash
neon deploy
neon functions get autosendevents
```

In AutoSend, open [Webhooks](https://autosend.com/webhooks) and click **New Webhook**. Give it a name, paste the function URL into **Endpoint URL**, and turn on the events to store:

- **Delivered** (`email.delivered`)
- **Bounced** (`email.bounced`)
- **Spam Reported** (`email.spam_reported`)
- **Unsubscribed** (`email.unsubscribed`)
- **Contact Updated** (`contact.updated`)

[Event types](https://docs.autosend.com/others/webhooks/event-type) describes the payload of each one.

![The Create New Webhook dialog in AutoSend, with the function URL as the endpoint URL and the Delivered, Bounced, Contact Updated, Unsubscribed, and Spam Reported events highlighted](/guides/images/autosend-webhooks/autosend-create-webhook.png)

Click **Create Webhook**. To copy the webhook's secret, open the webhook's menu on the **Webhooks** page, select **Edit**, and click **Reveal** next to **Secret Token**.

![The Secret Token field in the AutoSend webhook dialog, with the hidden secret and the Reveal button highlighted](/guides/images/autosend-webhooks/autosend-webhook-secret.png)

You can also create the webhook with the [Create Webhook API](https://docs.autosend.com/api-reference/webhooks/create-webhook), which returns the secret in `data.webhook.secret`:

```bash shouldWrap
curl -s https://api.autosend.com/v1/webhooks \
  -H "Authorization: Bearer $AUTOSEND_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
    "url": "https://<function-url>/",
    "events": ["email.delivered", "email.bounced", "email.spam_reported", "email.unsubscribed", "contact.updated"]
  }'
```

Add the secret to `.env.local`:

```bash filename=".env.local"
AUTOSEND_WEBHOOK_SECRET=your-webhook-secret
```

Deploy again so the function has the secret:

```bash
neon deploy --env .env.local
```

Requests can reach the previous deployment for about a minute after a deploy, so wait a minute before you send a test event.

## Send a test event

The [Resend Webhook API](https://docs.autosend.com/api-reference/webhooks/resend-webhook) sends a test delivery of any event the webhook subscribes to, with the `data` you pass. Use the webhook ID from the [Webhooks](https://autosend.com/webhooks) page or from the Create Webhook response:

```bash shouldWrap
curl -s https://api.autosend.com/v1/webhooks/<webhook-id>/resend \
  -H "Authorization: Bearer $AUTOSEND_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
    "event": "email.delivered",
    "data": { "emailId": "test-email-1", "to": { "email": "grace@example.com", "name": "Grace" } }
  }'
```

A row appears in the table:

```sql
SELECT delivery_id, event_type, email, event_time
FROM autosend_events
ORDER BY received_at DESC
LIMIT 5;
```

Then send an email through AutoSend, from the [Send Email API](https://docs.autosend.com/api-reference/mails/send) or the [`autosend-email` Function template](/functions/templates/autosend-email). `email.delivered` arrives a few seconds later.

If no row appears, list the webhook's recent attempts with the [List Delivery Logs API](https://docs.autosend.com/api-reference/webhooks/list-delivery-logs) (`GET /v1/webhooks/<webhook-id>/logs`), which returns the status code of each attempt. The function logs are in the Neon Console under **Monitoring** > **Functions**. A `401` with `Invalid webhook signature` means `AUTOSEND_WEBHOOK_SECRET` belongs to a different webhook, and a `500` means the secret isn't set on the deployment.

</Steps>

## Query the events

Find the addresses to stop emailing. AutoSend sends `email.unsubscribed` after a hard bounce or a spam report too, so most of these addresses also have an unsubscribe event. The query looks up the address of each `email.unsubscribed` event from the other events for the same `email_id`:

```sql
WITH resolved AS (
  SELECT e.event_type,
         e.event_time,
         e.payload,
         coalesce(e.email, sent.email) AS email
  FROM autosend_events e
  LEFT JOIN LATERAL (
    SELECT s.email
    FROM autosend_events s
    WHERE s.email_id = e.email_id AND s.email IS NOT NULL
    LIMIT 1
  ) sent ON true
)
SELECT DISTINCT ON (email) email, event_type, event_time
FROM resolved
WHERE email IS NOT NULL
  AND (event_type IN ('email.spam_reported', 'email.unsubscribed')
       OR (event_type = 'email.bounced' AND payload->'data'->>'bounceType' = 'Permanent'))
ORDER BY email, event_time DESC;
```

An unsubscribe is found only if the table also stores another event for that email, such as `email.delivered`.

Count deliveries, bounces, and spam reports per day over the last week:

```sql
SELECT date_trunc('day', event_time)::date AS day,
       count(*) FILTER (WHERE event_type = 'email.delivered')     AS delivered,
       count(*) FILTER (WHERE event_type = 'email.bounced')       AS bounced,
       count(*) FILTER (WHERE event_type = 'email.spam_reported') AS spam_reports
FROM autosend_events
WHERE event_time > now() - interval '7 days'
GROUP BY 1
ORDER BY 1 DESC;
```

If you sync users to AutoSend contacts, set each contact's `userId` to your app's user ID with the [Upsert Contact API](https://docs.autosend.com/api-reference/contacts/upsert-contact). `contact.updated` events then include `userId` in `payload->'data'`, so you can join them with your users table.

## Test on a branch

Each Neon branch has its own database and its own function URLs, so you can test changes without touching production data. An AutoSend project can have more than one webhook, so the branch gets its own.

<Steps>

Create a branch and switch to it. The CLI pulls the branch's `DATABASE_URL` into your local env file:

```bash
neon branches create --name preview/autosend-webhooks
neon checkout preview/autosend-webhooks
```

The branch starts with a copy of the `autosend_events` table and its data.

---

Deploy to the branch and get the branch's function URL:

```bash
neon deploy
neon functions get autosendevents
```

---

Create a webhook in AutoSend for that URL, copy its secret into `.env.local`, and deploy again:

```bash
neon deploy --env .env.local
```

---

Send a test event to the branch webhook with the Resend Webhook API. The row appears in the branch's `autosend_events` table, not in production. AutoSend sends each event to every webhook in the project that subscribes to it, so the branch also receives events from your production emails while its webhook exists.

---

When you're done, delete the branch webhook in AutoSend, or with `DELETE /v1/webhooks/<webhook-id>`. Then switch back to your production branch and delete the test branch, which also deletes its copy of `autosend_events`:

```bash
neon checkout production
neon branches delete preview/autosend-webhooks
```

`neon checkout` pulls the production `DATABASE_URL` back into your local env file. Set `AUTOSEND_WEBHOOK_SECRET` in `.env.local` back to your production webhook's secret before you deploy to production again.

</Steps>

If you create a branch for each pull request, deploy the function to each one the same way.

<NeedHelp/>
