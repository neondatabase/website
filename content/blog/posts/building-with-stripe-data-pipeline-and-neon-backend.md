---
title: Building with Stripe Data Pipeline and the Neon backend
description: Stripe data in Postgres + branching = a debugging machine
excerpt: >-
  Stripe just released real-time sync to Postgres for Stripe Data Pipeline, which
  streams your Stripe data into your own Postgres database within a few seconds.
  We built two example apps on the Neon backend to put it to use.
date: '2026-10-26T12:00:00'
updatedOn: '2026-10-26T12:00:00'
category: product
categories:
  - product
authors:
  - rishi-raj-jain
cover:
  image: '/images/pages/blog/building-with-stripe-data-pipeline-and-neon-backend/cover.png'
  alt: 'Building with Stripe Data Pipeline and the Neon backend'
isFeatured: false
seo:
  title: Building with Stripe Data Pipeline and the Neon backend - Neon
  description: Stripe data in Postgres + branching = a debugging machine
  keywords: []
  noindex: false
  ogTitle: Building with Stripe Data Pipeline and the Neon backend - Neon
  ogDescription: Stripe data in Postgres + branching = a debugging machine
  image: '/images/pages/blog/building-with-stripe-data-pipeline-and-neon-backend/cover.png'
---

![Building with Stripe Data Pipeline and the Neon backend](/images/pages/blog/building-with-stripe-data-pipeline-and-neon-backend/cover.png)

Stripe just released [real-time sync to Postgres for Stripe Data Pipeline](/blog/stripe-data-pipeline-realtime-sync-to-postgres), which streams your Stripe data into your own Postgres database within a few seconds. Every object in the Stripe API with a list endpoint, such as charges, customers, prices, invoices and subscriptions, syncs into a regular table you can join against.

Neon is [one of the supported destinations](https://docs.stripe.com/data/data-pipeline/real-time-sync-to-postgres/configure?postgres-provider=neon), so we built two example apps on it right away: 

- **Headshot Studio:** An AI headshot generator. Users buy credit packs, upload a selfie, and receive professional studio headshots. [Try it](https://neon-stripe-sync-headshot-studio.vercel.app/) · [Code](https://github.com/rishi-raj-jain/neon-stripe-sync-realtime-headshot-studio)
- **Bouncer:** A prepaid content moderation API that bills customers for each item it checks. [Try it](https://neon-stripe-sync-realtime-bouncer.vercel.app/) · [Code](https://github.com/rishi-raj-jain/neon-stripe-sync-realtime-bouncer)

For demo purposes, both apps apply a 100% discount at checkout, so you can complete a purchase without paying anything.

In this post, we walk through how we built both apps, and then show how Stripe Data Pipeline and Neon branches help you debug billing issues in them.

## Billing architecture

Neither app has a Stripe webhook anywhere in its codebase. Both apps write to Stripe through its API and read every Stripe object from Postgres.

### Writing to Stripe and reading from Postgres

Buying credits starts a normal [Checkout Session](https://docs.stripe.com/api/checkout/sessions). The app adds the user ID and credit count as metadata on the payment, and that metadata syncs into Postgres with the charge. Here's the Headshot Studio code:

```ts
const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  customer,
  line_items: [{ price, quantity: 1 }],
  payment_intent_data: { metadata: { user_id: user.id, pack: packId, credits: String(pack.credits) } },
  success_url: `${env.APP_URL}/studio?checkout=success`,
  cancel_url: `${env.APP_URL}/studio?checkout=cancelled`,
})
```

Once the payment goes through, Stripe syncs the charge into `stripe.charges` within a few seconds, and the dashboard polls Postgres until the new credits appear. No webhook handler needs to run in between.

The apps also read prices and promotion codes from the synced tables. Neither app hardcodes a price ID. They look up prices by `lookup_key` in `stripe.prices` and promotion codes by code in `stripe.promotion_codes`, so when you switch from a sandbox to live mode, or to another Stripe account, you don't need to update any IDs in the code.

### Computing credits with a SQL view

Neither app stores a balance. A customer's credits are a SQL view: what they bought (from the synced Stripe tables) minus what they spent (from the app's own tables).

<Tabs labels="Headshot Studio, Bouncer">

<TabItem>

[Headshot Studio](https://neon-stripe-sync-headshot-studio.vercel.app/) counts credits and computes spending from its jobs table:

```sql
create view app.credit_balances as
with purchased as (
  select c.user_id,
         sum(floor(
           coalesce(ch.metadata ->> 'credits', pi.metadata ->> 'credits', '0')::numeric
           * (ch.amount - ch.amount_refunded) / nullif(ch.amount, 0)
         ))::int as credits
    from app.customers c
    join stripe.charges ch on ch.customer = c.stripe_customer_id
    left join stripe.payment_intents pi on pi.id = ch.payment_intent
   where ch.status = 'succeeded' and ch.paid and not ch.disputed
   group by c.user_id
),
spent as (
  select user_id, sum(cost)::int as credits
    from app.jobs
   where status in ('processing', 'succeeded')
   group by user_id
)
select c.user_id,
       coalesce(p.credits, 0) as purchased,
       coalesce(s.credits, 0) as spent,
       coalesce(p.credits, 0) - coalesce(s.credits, 0) as balance
  from app.customers c
  left join purchased p using (user_id)
  left join spent s using (user_id);
```

Reading a customer's credits is then an ordinary query, and the studio page runs it on every load:

```sql
select purchased, spent, balance
  from app.credit_balances
 where user_id = $1;
```

</TabItem>

<TabItem>

[Bouncer](https://neon-stripe-sync-realtime-bouncer.vercel.app/) counts money in micro-dollars and computes spending from its usage ledger, which has one row per moderation request:

```sql
create view app.balances as
with purchased as (
  select a.id as account_id,
         sum((ch.amount - ch.amount_refunded) * 10000)::bigint as micros  -- cents to micro-dollars
    from app.accounts a
    join stripe.charges ch on ch.customer = a.stripe_customer_id
   where ch.status = 'succeeded' and ch.paid and not ch.disputed
   group by a.id
),
spent as (
  select account_id, sum(price_micros)::bigint as micros
    from app.usage_events
   group by account_id
)
select a.id as account_id,
       coalesce(p.micros, 0) - coalesce(s.micros, 0) as balance_micros
  from app.accounts a
  left join purchased p on p.account_id = a.id
  left join spent s on s.account_id = a.id;
```

Because the view is ordinary Postgres, other parts of the app can join against it. Bouncer's auto top-up function finds the accounts that need more credits with one query:

```sql
select a.id, a.stripe_customer_id, a.auto_topup_amount_cents
  from app.accounts a
  join app.balances b on b.account_id = a.id
 where a.auto_topup_enabled
   and b.balance_micros < a.auto_topup_threshold_micros;
```

</TabItem>

</Tabs>

### Handling refunds and chargebacks

Because the app computes credits from Stripe data on every read, the query already handles the edge cases you'd normally write webhook handlers for:

- **Refunds:** Suppose a customer bought the 40-credit Pro pack for \$29 and you refund half of it in the Stripe Dashboard. A few seconds later, `amount_refunded` syncs, and the same query returns the new number:

  ```sql
  select purchased, spent, balance from app.credit_balances where user_id = $1;
  -- before the refund:  purchased 40, spent 4, balance 36
  -- after the refund:   purchased 20, spent 4, balance 16
  ```

- **Chargebacks:** When a charge is disputed, `disputed` is set to `true` in the synced row and the view excludes the charge.
- **Double-crediting:** Nothing can be credited twice, because no write ever adds credits.

## How the apps are built

<Tabs labels="Headshot Studio, Bouncer">

<TabItem>

Headshot Studio is an AI headshot generator paid for with credits. You buy a credit pack (one credit buys one headshot) and upload a selfie directly from the browser to a private bucket. A few moments later, the headshots appear on the studio page.

![Headshot Studio architecture. In the browser, the user buys credits through Stripe Checkout, uploads a selfie to Object Storage with a presigned PUT URL, and views headshots in the studio with presigned GET URLs. Stripe Data Pipeline syncs charges and payment intents into Lakebase Postgres. On the Neon branch, a storage_object_created trigger calls the onupload function, which claims the job against the app.credit_balances view, generates headshots through AI Gateway and writes them to Object Storage.](/images/pages/blog/building-with-stripe-data-pipeline-and-neon-backend/headshot-studio-architecture.png)

The stack:

- [**Stripe Data Pipeline**](https://docs.stripe.com/data/data-pipeline/real-time-sync-to-postgres) syncs `customers`, `charges`, `payment_intents`, `checkout_sessions`, `prices` and `promotion_codes` into a stripe schema.
- [**Lakebase Postgres**](https://neon.com/docs/postgres/overview) holds three schemas: `stripe.*` (owned by the pipeline), `neon_auth.*` (users and sessions) and `app.*` (the app's own tables).
- [**Managed Better Auth**](https://neon.com/docs/auth/overview) handles sign-up and sign-in.
- [**Object Storage**](https://neon.com/docs/storage/overview) has two private buckets, selfies and headshots.
- [**Functions**](https://neon.com/docs/compute/functions/overview) and [**triggers**](https://neon.com/docs/compute/functions/triggers/overview) run `onupload` when a selfie is uploaded, and `sweeper` on a five-minute cron.
- [**AI Gateway**](https://neon.com/docs/ai-gateway/overview) does the image generation, so there are no model provider keys in the app.
- Next.js on Vercel serves the UI.

#### Preventing double spending

If there's no balance column to decrement, what stops someone from spending the same credits twice? Headshot Studio prevents it with four parts of the stack:

**1. Creating the job**

When you click generate, the API inserts a row in `app.jobs` with status `awaiting_upload` and returns a presigned upload URL. The browser uploads the selfie directly to a private [Object Storage](https://neon.com/docs/storage/overview) bucket, without passing through the app's server. The object key includes the user and job IDs (`uploads/{userId}/{jobId}.jpg`).

**2. Calling a function on upload**

Object Storage can call a [Neon Function](https://neon.com/docs/compute/functions/overview) whenever a new object is uploaded, using a [storage trigger](https://neon.com/docs/compute/functions/triggers/object-storage). The trigger sends the bucket and object key to `onupload`, and since the key contains both IDs, the function knows whose job it is without a queue or an extra lookup.

**3. Claiming the job and spending credits**

In one Postgres transaction, `onupload` takes a per-user advisory lock and sets the job to `processing` only if the credits view says the user can afford it:

```sql
select 1 from pg_advisory_xact_lock(hashtextextended($userId, 0));

update app.jobs j
   set status = 'processing', started_at = now()
  from (select coalesce((select balance from app.credit_balances where user_id = $userId), 0) as balance) a
 where j.id = $jobId
   and j.status = 'awaiting_upload'
   and a.balance >= j.cost
returning j.id;
```

The balance it checks comes from `app.credit_balances`, which reads the purchases that [Stripe Data Pipeline](https://docs.stripe.com/data/data-pipeline/real-time-sync-to-postgres) syncs into Postgres. Once the job is `processing`, it counts as spent in that same view, so the update both checks the balance and spends it. 

Because the app computes credits from the jobs table, this design also handles three edge cases:

- Two uploads at once can't overspend. The advisory lock makes one user's claims run one at a time, so the second sees the first one's debit.
- Redeliveries do nothing. A job only leaves `awaiting_upload` once, so a duplicate trigger delivery finds nothing to claim.
- Failed jobs return their credits. The view doesn't count failed jobs as spent, so no refund logic is needed.

After the claim, `onupload` reads the selfie, calls [AI Gateway](https://neon.com/docs/ai-gateway/overview) once per variant, writes the results to the headshots bucket and marks the job succeeded.

**4. Cleaning up stale jobs**

A second function, `sweeper`, runs every five minutes on a [schedule trigger](https://neon.com/docs/compute/functions/triggers/schedule). It fails jobs stuck in `processing` for over 20 minutes and expires jobs that never got an upload, so the view returns those credits to the balance.

</TabItem>

<TabItem>

Bouncer sells an AI-powered service by the unit. It's a content moderation API where customers prepay for credits, create an API key in the dashboard, and send text to `POST /v1/moderate`. The API labels each item allow, review or block and returns a score per category. Pricing is \$1 per 1,000 items. When the balance runs low, auto top-up buys more.

![Bouncer architecture. The customer buys credit packs through Stripe Checkout in the dashboard, and their app sends text to the api function at POST /v1/moderate with a bearer key. The api function authorizes the request and writes a ledger row in Lakebase Postgres, and scores items with gpt-oss-20b through AI Gateway. The topups function runs every 5 minutes, finds accounts below their threshold and creates Stripe invoices. Stripe Data Pipeline syncs checkout sessions, invoices and charges into Postgres, where the app.balances view computes each balance.](/images/pages/blog/building-with-stripe-data-pipeline-and-neon-backend/bouncer-architecture.png)

The stack:

- [**Stripe Data Pipeline**](https://docs.stripe.com/data/data-pipeline/real-time-sync-to-postgres) syncs the same tables as Headshot Studio, plus `invoices` for the top-ups.
- A [**Neon Function**](https://neon.com/docs/compute/functions/overview), `api`, is the public moderation endpoint. It can be served on a [custom domain](https://neon.com/docs/compute/functions/custom-domains) like `api.yourapp.com`.
- A second function, `topups`, runs auto top-ups on a five-minute [schedule trigger](https://neon.com/docs/compute/functions/triggers/schedule).
- [**AI Gateway**](https://neon.com/docs/ai-gateway/overview) scores every item with [gpt-oss-20b](https://neon.com/docs/ai-gateway/models) using a fixed prompt and a strict JSON schema. Callers don't choose the model or write the prompt, and responses don't include token counts.
- [**Lakebase Postgres**](https://neon.com/docs/postgres/overview) holds `stripe.*`, `neon_auth.*` and `app.*`, including the usage ledger and the price list.
- [**Neon Auth**](https://neon.com/docs/auth/overview) handles the dashboard sign-in, and [**Next.js on Vercel**](https://vercel.com/docs/frameworks/full-stack/nextjs) serves the dashboard.

#### Authorizing a request

Every request to `/v1/moderate` starts by counting units (one per item of up to 2,000 characters) and then makes a single round trip to Postgres. The function hashes the bearer key and, in one query, finds the account, reads its balance from the view, and looks up the price per unit:

```sql
with k as (
  select id, account_id from app.api_keys where key_hash = $keyHash and revoked_at is null
)
select k.id as key_id, k.account_id,
       coalesce((select b.balance_micros from app.balances b where b.account_id = k.account_id), 0) as balance_micros,
       (select p.unit_price_micros from app.service_prices p where p.service = 'moderate' and p.active) as unit_price_micros
  from k;
```

The function knows the charge before it does any work: units × unit price. If the balance can't cover it, the API returns `402 insufficient_quota` and never calls the model. The check reads Stripe data directly, so if a customer was refunded a minute ago, the next request already sees the lower balance.

#### Recording and pricing usage

After AI Gateway returns the scores, the function checks the output (one result per item, every score between 0 and 1) and writes one row to `app.usage_events`. The row records the price charged to the customer and the cost of the AI Gateway call, and two SQL functions compute both at insert time:

- `app.price_micros()` computes what Bouncer charges: units × the price in `app.service_prices`.
- `app.cost_micros()` computes what AI Gateway charges Bouncer for the tokens, from `app.model_costs`.

```sql
insert into app.usage_events (account_id, service, units, model, input_tokens, cached_input_tokens, output_tokens, price_micros, cost_micros)
values ($accountId, 'moderate', $units, 'gpt-oss-20b', $in, $cached, $out,
        app.price_micros('moderate', $units),
        app.cost_micros('gpt-oss-20b', $in, $cached, $out))
returning price_micros;
```

#### Automatic top-ups

Auto top-up writes to Stripe and reads the result back from Postgres, again without a webhook:

1. Every five minutes, the `topups` function queries for accounts whose balance (from the view) is under their threshold.
2. For each one, it creates a Stripe invoice for the top-up amount through the Stripe API. With a saved card, it's charged off-session.
3. The invoice and its charge sync back into Postgres within seconds, and the balance view counts them.

SQL queries and Stripe idempotency keys enforce three safety rules:

- **One top-up per account per 15-minute window**, enforced both in the candidate query and by the idempotency key, so a slow sync can't cause a second charge.
- **The "Top up now" button runs the same code**, but waits if the last top-up hasn't synced back yet, so a double click can't add credits twice.
- **A failure switches auto top-up off** and shows the reason in the dashboard, so the function doesn't keep retrying a declined card.

</TabItem>

</Tabs>

## Debugging with Neon branches

Because your Stripe data is in [Lakebase Postgres](https://neon.com/docs/postgres/overview) as part of a Neon backend, you can create a branch that contains both your Stripe data and your app data.

A Neon [branch](https://neon.com/docs/introduction/branching) is an isolated copy of your project, created in seconds without duplicating any data up front. It shares storage with its parent and stores only the changes made on the branch. You can also create a branch from a past point in time within your project's [history window](https://neon.com/docs/postgres/backup-restore/history-window), which lets you inspect production data as it was when a customer reported a bug.

A branch includes the whole backend:

- Postgres, including the `neon_auth` users and the synced `stripe.*` rows. The customer's purchases, refunds and invoices appear in the branch as they were synced at that point in time.
- Object Storage, including the files customers uploaded.
- Triggers, copied but disabled. Inherited triggers don't run on a child branch until you enable them, so a debug branch of Headshot Studio can't process uploads on its own, and a debug branch of Bouncer can't charge anyone's card.

Without Stripe Data Pipeline, you would collect the billing details of a bug report manually from the Stripe Dashboard. With it, the billing data, app data and files are in one place that you can copy, query and modify without affecting production.

### Debugging a failed job after payment

Suppose a customer reports that they bought the Pro pack and uploaded a selfie, but received no headshots. The following steps show how to investigate the issue on a branch:

**1. Locate the failed job:** Each row in `app.jobs` stores the ID of the trigger invocation that claimed it:

```sql
select j.id, j.status, j.error, j.invocation_id, j.created_at
  from app.jobs j
  join neon_auth."user" u on u.id = j.user_id
 where u.email = 'customer@example.com'
 order by j.created_at desc;
```

**2. Review the function logs:** Each log line includes `invocation=… key=…`, so you can filter the logs by the invocation ID from step 1:

```sh
npx neon logs query --source function
```

**3. Create a branch at the time of the failure:** Use the job's timestamp as the branch point, then connect your local environment to the new branch:

```sh
npx neon branches create --name debug/headshots-1042 --parent 2026-10-08T10:42:00Z
npx neon checkout debug/headshots-1042   # pulls that branch's env into .env
```

The branch contains the customer's user record, synced charge, job and uploaded selfie as they existed at 10:42.

**4. Reproduce the failure locally:** [neon dev](https://neon.com/docs/cli/dev) runs `onupload` on your machine against the branch's data and files. A script sends the same JSON payload that the storage trigger sent:

```sh
npx neon dev                                            # serves onupload on :8787
scripts/replay-upload.sh uploads/<userId>/<jobId>.jpg   # in another terminal
```

To run the function again, reset the job's status on the branch:

```sql
update app.jobs
   set status = 'awaiting_upload', error = null, started_at = null, finished_at = null
 where id = '<jobId>';
```

**5. Identify and fix the cause:** In this case, the selfie was an iPhone HEIC photo that the image pipeline couldn't process. The fix adds a check that detects the file type and asks the user to upload a JPEG instead. Rerun the upload until the job succeeds. The function writes the generated headshots to the branch's headshots bucket, so production data isn't affected.

**6. Deploy the fix and delete the branch:** On production, the failed job has already returned its credits, so the customer can upload again.

```sh
npx neon branches delete debug/headshots-1042
```

### Testing refunds against the credit balance

A branch also lets you test the balance view against production data without involving Stripe. On a debug branch, simulate a partial refund by updating the synced charge:

```sql
-- debug branch only: on main, stripe.* belongs to the pipeline
update stripe.charges set amount_refunded = amount / 2 where id = 'ch_…';
select * from app.credit_balances where user_id = '<userId>';
```

The balance decreases by half the pack immediately, with no webhook handler involved. Setting `disputed = true` removes the charge from the view entirely. To confirm the behavior end to end on main, refund a test-mode charge in the Stripe Dashboard, check that `stripe.charges._updated_at` changes, and verify that the balance updates within seconds.

### Debugging a job timeout

Suppose a customer reports that the sweeper marked their job as failed while it was still running. Each sweeper run logs its `scheduledAt` timestamp, so you can create a branch at that timestamp and query the data the sweeper read:

```sh
npx neon branches create --name debug/sweeper --parent 2026-10-08T11:05:00Z
```

```sql
select id, status, started_at, now() - started_at as running_for
  from app.jobs where status = 'processing';
```

If a four-variant job legitimately ran for more than 20 minutes, the timeout is too short. Increase it, run `neon deploy` on the branch to enable its triggers, and confirm that the next scheduled run behaves correctly before you deploy the change to production.

## Building your own app

You can use the same pattern for any product that sells credits, usage or access: write to the Stripe API, read from the synced `stripe.*` tables, and compute billing state with a SQL view.

To build your own app with a coding agent, run `npx neon@latest init` in your project first so the agent has the Neon MCP server and skills. Then paste a prompt like this:

```text
Build a <describe your app> that bills customers through Stripe, using Stripe Data Pipeline's real-time sync to Postgres and the Neon backend. Use these repos as reference for the billing pattern:

- https://github.com/rishi-raj-jain/neon-stripe-sync-realtime-headshot-studio
- https://github.com/rishi-raj-jain/neon-stripe-sync-realtime-bouncer

Follow the same rules:

- No Stripe webhooks. Write to Stripe only through its API, and read every Stripe object from the synced stripe.* tables.
- Keep each customer's balance as a SQL view: purchases from the synced Stripe tables minus usage from the app's own tables. Never store or increment a balance.
- Look up prices and promotion codes in stripe.prices and stripe.promotion_codes by lookup key or code. Don't hardcode IDs.
- Declare the backend in neon.ts (Neon Auth, Functions, triggers, AI Gateway or Object Storage as needed) and provision it with neon deploy.
- Add indexes on the synced Stripe tables for the per-customer lookups the app runs.

Before writing code, list the Stripe objects the app needs synced and sketch the balance view.
```

If you have questions, you can find us on [Discord](https://neon.com/discord).
