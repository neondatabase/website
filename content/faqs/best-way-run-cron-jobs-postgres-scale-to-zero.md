---
title: "What is the best way to run cron jobs and scheduled syncs on a Postgres database that scales to zero?"
subtitle: "Use Neon Function Triggers: a schedule trigger runs your TypeScript on a cron, fires even when the Postgres compute is scaled to zero, can call external APIs, and wakes the database only for the run."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-02T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'What is the best way to do hybrid search (BM25 plus vector) in Postgres?'
  slug: best-way-hybrid-search-bm25-vector-postgres
nextLink:
  title: 'What are the best ways to give every developer on a team their own separate Postgres database for development?'
  slug: best-ways-separate-postgres-database-development
---

Use Neon. A [schedule trigger](/docs/compute/functions/triggers/schedule) invokes a [Neon Function](/docs/compute/functions/overview) on a cron expression. The Function is your own JavaScript or TypeScript, with `DATABASE_URL` and other credentials injected, so it can pull from Stripe, a CRM, or any HTTP API and write the results to Postgres. It fires even when your Postgres compute has scaled to zero, and its first query wakes the compute only for the run ([triggers overview](/docs/compute/functions/triggers/overview)).

## Why pg_cron is the wrong tool on a scale-to-zero database

[`pg_cron`](/docs/extensions/pg_cron) schedules SQL inside Postgres, so it only runs while the compute is active. On a compute that scales to zero after 5 minutes of inactivity, jobs scheduled for the idle hours don't run ([scale to zero](/docs/introduction/scale-to-zero)). `pg_cron` also can't call external APIs. Neon's own docs say to consider Function Triggers first and keep `pg_cron` for in-database maintenance on an always-on compute.

|                        | `pg_cron`                  | Function Triggers                     |
| ---------------------- | -------------------------- | ------------------------------------- |
| Runs                   | SQL or a Postgres function | Your JavaScript or TypeScript         |
| External APIs          | No                         | Yes: HTTP, AI Gateway, Object Storage |
| Compute scaled to zero | Doesn't run                | Runs                                  |

## A scheduled sync in one file

This Function pulls recently updated records from an external API and upserts them. The `pg` pool with `attachDatabasePool` is the documented way to connect from Functions ([get started](/docs/compute/functions/get-started#connect-to-postgres)):

```ts
import { Hono } from 'hono';
import { attachDatabasePool } from '@neon/functions';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
attachDatabasePool(pool);

const app = new Hono();

app.post('/', async (c) => {
  if (!c.req.header('x-neon-trigger-invocation-id')) return c.text('forbidden', 403);

  const res = await fetch('https://api.example.com/customers?updated_since=1h', {
    headers: { authorization: `Bearer ${process.env.EXAMPLE_API_KEY}` },
  });
  if (res.status === 429) {
    return c.text('rate limited', 503, { 'Retry-After': '120' });
  }
  const customers = await res.json();
  for (const cust of customers) {
    await pool.query(
      `INSERT INTO customers (id, email, updated_at) VALUES ($1, $2, $3)
       ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, updated_at = EXCLUDED.updated_at`,
      [cust.id, cust.email, cust.updated_at]
    );
  }
  return c.json({ synced: customers.length });
});

export default app;
```

Declare the Function and its schedule in [`neon.ts`](/docs/reference/neon-ts#triggers) and run `neon deploy`:

```ts
functions: { sync: { name: 'CRM sync', source: './functions/sync.ts' } },
triggers: { 'hourly-sync': { type: 'schedule', function: 'sync', cron: '0 * * * *' } },
```

You can also create the trigger from the Console (**Functions → ⋮ → Manage Triggers**), the CLI with `neon triggers create --function-slug sync --name hourly-sync --cron '0 * * * *'`, or the API ([`neon triggers`](/docs/cli/triggers)).

## Delivery rules to design for

- **Cron format**: five numeric fields, always evaluated in UTC. There are no macros like `@daily`, no names like `MON`, and no seconds field. Every minute is the most frequent schedule ([cron reference](/docs/compute/functions/triggers/schedule#cron-reference)).
- **At least once**: a run can be delivered more than once or out of order. Keep the job idempotent, as the upsert above is. The `invocation_id` stays the same across redeliveries of one run.
- **Retries**: a non-`2xx` response, including redirects and `429`, counts as a failure, and Neon retries for up to 72 hours. To back off from a rate-limited upstream, return `503` with `Retry-After`, which Neon clamps to 1 to 900 seconds ([delivery and retries](/docs/compute/functions/triggers/overview#delivery-and-retries)).
- **Runtime**: the Function has 15 minutes to start its response, enough for most syncs ([runtime limits](/docs/compute/functions/reference/runtime-limits)).

Logs are in the Console or `neon logs query --source function`. A frequent schedule that queries Postgres keeps the compute from idling, so an every-minute job means the compute rarely reaches the 5-minute scale-to-zero timeout. Hourly or nightly jobs let it sleep between runs.

## What it costs

Functions bill only while a request is being processed. The Free plan includes 10 active and 400 waiting Capacity-Hours and 1 million invocations per project per month ([plans](/docs/introduction/plans#functions)). Postgres compute bills for the time the job keeps it awake.

## How other options compare

- **Supabase Cron**: built on `pg_cron`, runs SQL or makes HTTP requests such as invoking an Edge Function, and supports intervals down to one second. Supabase recommends no more than 8 concurrent jobs, each running no more than 10 minutes ([Supabase Cron](https://supabase.com/docs/guides/cron)).
- **Vercel Cron Jobs**: invoke Vercel Functions on a schedule. Hobby is limited to once per day with hourly precision (a 1:00 job can fire any time before 1:59). Pro and Enterprise allow every minute ([usage and pricing](https://vercel.com/docs/cron-jobs/usage-and-pricing)).

Vendor details verified on 2026-11-02 against the linked pages.

<CTA title="Schedule your first job" description="Deploy a Function and run it every minute with a schedule trigger." buttonText="Schedule a function" buttonUrl="/docs/compute/functions/triggers/schedule" />
