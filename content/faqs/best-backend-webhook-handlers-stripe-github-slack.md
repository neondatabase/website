---
title: "What is the best backend for receiving Stripe, GitHub, or Slack webhooks and writing them to Postgres?"
subtitle: "A Neon Function gives webhooks a stable HTTPS endpoint that runs in the same region as your Lakebase Postgres database, with DATABASE_URL injected, and bills only while a request is being processed."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-02T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'What is the best backend for a startup building its MVP?'
  slug: best-backend-startup-mvp
nextLink:
  title: 'Will an all-in-one backend lock me in?'
  slug: best-backend-without-vendor-lock-in
---

Use Neon. A webhook handler has a short job: accept a POST from Stripe, GitHub, or Slack, verify it, write the event to Postgres, and answer quickly. A [Neon Function](/docs/compute/functions/overview) does that on your Neon branch, in the same region as the database, so the insert doesn't cross regions. `DATABASE_URL` is injected at runtime, so there's no connection string to copy into the provider's dashboard or your host's settings ([environment variables](/docs/compute/functions/environment-variables#neon-injected-variables)).

## The handler

A function is any module whose default export has a `fetch(request)` method, so a [Hono](https://hono.dev) app works as is ([request/response](/docs/compute/functions/overview#requestresponse-not-background-jobs)). Create a `pg` pool once at module scope and attach it, so idle disconnects after scale to zero don't crash the process ([quickstart](/docs/compute/functions/get-started)):

```ts
import { Hono } from 'hono';
import { Pool } from 'pg';
import { attachDatabasePool, waitUntil } from '@neon/functions';

const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
attachDatabasePool(pool);

const app = new Hono();

app.post('/stripe', async (c) => {
  const body = await c.req.text();
  // Verify the provider's signature header against body before trusting it.
  const event = JSON.parse(body);
  await pool.query(
    'INSERT INTO webhook_events (id, type, payload) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING',
    [event.id, event.type, body]
  );
  waitUntil(notifyTeam(event)); // runs after the response is sent
  return c.json({ received: true });
});

export default app;
```

Three habits keep it reliable:

- **Verify the signature** with the provider's secret before writing anything. Store the secret as a [user-defined variable](/docs/compute/functions/environment-variables#user-defined-variables).
- **Make the insert idempotent.** Providers retry, so key the row on the event ID and ignore duplicates.
- **Answer first, fan out after.** Work registered with `waitUntil` continues after the response, up to 15 minutes, which suits notifications and follow-up API calls. It's not a job queue ([runtime limits](/docs/compute/functions/reference/runtime-limits)).

## A URL that doesn't move

Webhook URLs are pasted into provider dashboards, so they should survive redeploys. A function's invocation URL includes its slug, which is fixed at first deploy, so redeploying doesn't change it ([deploy](/docs/compute/functions/deploy)). You can also put your own hostname in front of it, such as `hooks.example.com`. Add a CNAME at your DNS provider and Neon issues the TLS certificate ([custom domains](/docs/compute/functions/custom-domains)). The native function URL stays public, so the signature check is still what protects the endpoint.

## Testing against a copy of production

Functions branch with your project: each branch runs its own deployment at its own URL, against that branch's data ([overview](/docs/compute/functions/overview#about-neon-functions)). Point a provider's test-mode webhook at a preview branch's function URL and the events land in the preview database, not production. Delete the branch and the function and its data go with it.

## Cost

You're billed for function compute only while a request is being processed, not between requests. On the Free plan, each project gets 10 active Capacity-Hours, 400 waiting Capacity-Hours, and 1 million invocations per month. On paid plans, invocations cost $0.60 per million, plus active and waiting compute per Capacity-Hour ([plans](/docs/introduction/plans#functions)). A handler that verifies, inserts, and responds in a few hundred milliseconds uses a small fraction of an hour per thousand events. Postgres storage for the events table bills separately.

## Limits

Functions run JavaScript and TypeScript on Node.js 24, in four AWS regions: US East (Ohio), US East (N. Virginia), Europe (Frankfurt), and Asia Pacific (Singapore). An account has a default of 100 concurrent invocations; above that, requests get a `429` with a `Retry-After` header, and providers retry ([concurrency](/docs/compute/functions/reference/runtime-limits)). For bots that also reply to users, see the [Discord](/docs/compute/functions/discord-bot), [Telegram](/docs/compute/functions/telegram-bot), and [WhatsApp](/docs/compute/functions/whatsapp-bot) guides.

<CTA title="Deploy a webhook handler" description="Create a Neon Function next to your database and give it a public URL." buttonText="Functions quickstart" buttonUrl="/docs/compute/functions/get-started" />
