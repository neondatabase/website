---
title: 'Sync Stripe data to Lakebase Postgres on Neon with Stripe Data Pipeline'
subtitle: 'Query your live Stripe data in Postgres on Neon, with no webhooks or ETL pipelines to build'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-10-10T00:00:00.000Z'
updatedOn: '2026-10-19T06:43:09.621Z'
---

Most apps that use Stripe build their own copy of the Stripe data with webhooks. When something happens in Stripe, like a successful payment, Stripe sends a notification to your server, and your app writes a row to a table. That takes setup: an endpoint to receive the notifications, tables to store them, and code to retry failures. You also need a one-time import for the data that already existed. And each notification only describes what changed. To know a customer's current state, your app has to apply every event for that customer in order.

[Stripe Data Pipeline](https://docs.stripe.com/data/data-pipeline/real-time-sync-to-postgres) is a managed service that does all of that for you. It keeps a copy of your Stripe data in a Postgres database that you own, and keeps that copy up to date. Every Stripe resource you can list, from charges to subscriptions, becomes a table with typed columns. Changes show up in the database within a few seconds, though a few tables lag up to 10 minutes during the public preview (see [Preview limitations](#preview-limitations)). You query the current state directly, with no event handlers to write and no extra data store to run.

On Neon, that database is [Lakebase Postgres](/docs/postgres/overview). Stripe supports Neon directly. You connect your Neon account to Stripe with OAuth from the Stripe Dashboard, and Stripe sets up the connection for you. You don't have to configure a Postgres user, create tables, or write any code. The pipeline creates a schema in your project, backfills it with your existing data, and keeps it current.

In this guide, you'll connect a Stripe account to a Neon project with Data Pipeline. Here's what you'll do:

- Create the Neon project the pipeline writes into, or let Stripe create one for you
- Connect your Neon account to Stripe with OAuth and create the pipeline, choosing which Stripe tables to sync
- Verify the backfill and query your Stripe data from the Neon SQL Editor
- Create a test product and subscription in Stripe, then watch it sync to your database

## Prerequisites

Before you start, make sure you have:

1. **Neon account**: Sign up for a free Neon account at [console.neon.tech](https://console.neon.tech/signup).
2. **Stripe account**: Sign up for a Stripe account at [stripe.com](https://stripe.com) if you don't already have one. You can use a test (sandbox) account for this guide.

<Steps>

## Create a Neon project

The pipeline needs a Neon project to write to. You can use an existing project or create a new one:

1. In the [Neon Console](https://console.neon.tech), click **New Project**.
2. Enter a **Project name**, such as `stripe-sync`, and choose a **Region**.
3. Click **Create project**.

<Admonition type="note" title="Let Stripe create it instead">
During the OAuth flow, Stripe can create a Neon project for you rather than using an existing one. If you want to do that, skip this step and create the project in Stripe instead.
</Admonition>

## Connect Neon and create the pipeline

With a Neon project ready, you can connect it to Stripe and create the pipeline:

1. Open the [Pipelines](https://dashboard.stripe.com/data-management/pipeline) page in the Stripe Dashboard.
2. Click **+ Add pipeline**.
3. Select **Neon**, enter a name for the pipeline (for example, `stripe-sync`), and click **Connect your Neon account**.
4. Complete the OAuth authorization flow to connect your Neon account.
5. Select the Neon project where you want to sync your data, or let Stripe create a new project for you.
6. Specify the schema name, or keep the default `stripe`. Stripe creates this schema in your Neon project and writes all synced tables to it.
7. Choose which tables to sync. All tables are enabled by default, so you can keep them all or clear the ones you don't need yet. You can enable or disable individual tables later from the same page.
8. Click **Create pipeline**.

Stripe syncs only the tables you select. If you'd rather start small, common tables are `customers`, `charges`, `invoices`, `subscriptions`, `payment_intents`, and `payouts`. Stripe backfills a table when you enable it, so you can add more later without recreating the pipeline.

Once Stripe confirms it can connect, it creates the schema and a table for each object you enabled, backfills those tables, and then starts syncing changes. The pipeline page shows the backfill's progress. If the pipeline reports a sync error, or the backfill never finishes, see Stripe's [checklist for connection and sync problems](https://docs.stripe.com/data/data-pipeline/real-time-sync-to-postgres/common-errors) for the fix.

## Verify the backfill

Once the pipeline reports that the backfill is done, check that the data is really there. Open the [SQL Editor](/docs/get-started/query-with-neon-sql-editor) for the project the pipeline is writing to and list the schemas:

```sql
SELECT schema_name FROM information_schema.schemata ORDER BY schema_name;
```

You should see a `stripe` schema alongside your existing schemas. If the synced tables live in a different schema, replace `stripe` with that schema name in the queries below.

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'stripe'
ORDER BY table_name;
```

```text
     table_name
---------------------
 charges
 customers
 invoices
 payment_intents
 payouts
 subscriptions
```

Your list depends on which tables you enabled. If you synced every table, the output is much longer than this trimmed example. Count the rows in one of them and compare the result with what the Stripe Dashboard shows for the same object:

```sql
SELECT count(*) FROM stripe.charges;
```

<Admonition type="important" title="Don't write to the Stripe-managed schema">
Stripe manages the tables in this schema. Writing to them can cause sync errors and data inconsistencies.

You can run read-only queries, use BI tools, and join Stripe-managed tables with your own tables on the Stripe IDs they share (for example, match `stripe.customers.id` with the customer ID your app stores). To build custom models on top of the synced data, create them in a schema of your own in the same project, and leave the `stripe` schema read-only.
</Admonition>

## Sync a test subscription

You can verify that the pipeline is working by creating a test product and subscription in Stripe. The new records should appear in your database within a few seconds.

1. In the Stripe Dashboard, open **Product catalog** and click **+ Create product**.
2. Enter a name, such as `Stripe sync demo`, and add a recurring price, for example `$20` per month.
3. Click **Add product** to create a product. Once the product appears in the list, click the three-dot menu (**⋯**) on its row and select **Create payment link** for the **$20.00 USD / month** price.
4. Open the payment link in a new tab and complete the checkout with a test card:
   - Card number: `4242 4242 4242 4242`
   - Expiry: any future date
   - CVC: any three digits
   - Email: `alex@example.com`

Stripe processes the payment and creates a customer, a subscription, and an invoice. Open the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) and run these queries to verify that the new customer and subscription appear in your database:

```sql filename="List the last five customers"
SELECT id, email, created
FROM stripe.customers
ORDER BY created DESC
LIMIT 5;
```

```sql filename="List the last five subscriptions"
SELECT id, status, customer, created
FROM stripe.subscriptions
ORDER BY created DESC
LIMIT 5;
```

## Query the synced data

Now that the pipeline is syncing data, query the synced tables like any other Postgres table.

- Each table has an `id` column plus three sync metadata columns: `_account_id`, `_updated_at`, and `_raw_data`. `_raw_data` holds the complete JSON object for the row, so you can read any field that doesn't have a typed column.
- Money amounts are integers in the smallest currency unit. For USD charges, `amount` is in cents.
- `created` is a Unix timestamp in seconds, stored as a `bigint`. Wrap it with `to_timestamp()` to read it as a timestamp.

### Example queries

You can use the synced tables to answer questions about your Stripe data. For example, this query shows the total USD captured each month for the trailing 12 months:

```sql
SELECT date_trunc('month', to_timestamp(created)) AS month,
       sum(amount_captured - amount_refunded) / 100.0 AS captured_usd
FROM stripe.charges
WHERE captured
  AND currency = 'usd'
  AND to_timestamp(created) >= now() - interval '1 year'
GROUP BY 1
ORDER BY 1 DESC;
```

Only months where you captured at least one USD charge show up.

Columns such as `metadata` are `jsonb`, so you can pull out individual keys with the `->>` operator. This query lists the last ten charges that have a `team` key in their metadata:

```sql
SELECT id, amount, metadata->>'team' AS team
FROM stripe.charges
WHERE metadata ? 'team'
ORDER BY created DESC
LIMIT 10;
```

`outcome` is `jsonb` too, so you can read the fields nested inside it. This query shows the network status for your five most recent failed charges:

```sql
SELECT id,
       outcome->>'network_status' AS network_status
FROM stripe.charges
WHERE status = 'failed'
ORDER BY created DESC
LIMIT 5;
```

Some values live inside nested objects rather than in a column of their own. Read the full Stripe object from `_raw_data` and pull out the value with the `->>` operator. For example, `_raw_data->'payment_method_details'->'card'->>'brand'` returns the card brand Stripe recorded for the charge.

To answer questions that span more than one resource, join the tables. If you enabled `disputes`, this query lists charges next to any disputes Stripe created for them:

```sql
SELECT c.id AS charge_id,
       c.amount,
       d.reason AS dispute_reason
FROM stripe.charges AS c
JOIN stripe.disputes AS d ON d.charge = c.id
ORDER BY c.created DESC
LIMIT 20;
```

For the columns each table has, see the [real-time sync schema](https://docs.stripe.com/data/data-pipeline/real-time-sync-to-postgres/schema).

## Connect your own tools

The synced tables work with any Postgres client. To connect an app, notebook, or BI tool, open your project in the [Neon Console](https://console.neon.tech), click **Connect**, and copy the connection string from the **Connect to your branch** modal.

Use it wherever the client asks for Postgres connection details. For client-specific setup, see [Connect from any application](/docs/connect/connect-from-any-app).

</Steps>

## IP Allow

Neon's [IP Allow](/docs/introduction/ip-allow) feature restricts database connections to specified IP addresses and is available on the Scale plan. If IP Allow is enabled for the Neon project your pipeline writes to, you must add Stripe's IP addresses to the project's allowlist. Otherwise, Stripe won't be able to connect, and the pipeline won't work.

Stripe can connect from any IP address in its published list of addresses and ranges. Find the current list in Stripe's [Allow incoming connections from Stripe](https://docs.stripe.com/data/data-pipeline/real-time-sync-to-postgres/configure#source-ip-addresses) documentation, and add all listed addresses and ranges to your Neon project's allowlist.

To configure the allowlist, open the project in the Neon Console and go to **Settings** > **Networking** > **Public internet access**. Select **Only addresses on the allowlist** and add Stripe's IP addresses and ranges.

IP Allow applies to all branches by default. See [Configure IP Allow](/docs/manage/projects#configure-ip-allow) for the options, including applying the restriction to protected branches only.

<Admonition type="note" title="Only needed if you enabled IP Allow">
IP Allow is off by default, so most projects don't need this step. Follow these steps if your organization requires it for compliance.
</Admonition>

## Preview limitations

<Admonition type="warning" title="Delays during the public preview">
While the feature is in public preview, some changes can take up to 10 minutes to appear in your database. Don't build anything that assumes the synced data is current to the second.
</Admonition>

During public preview:

- Updates to `payment_intents`, `invoiceitems`, `setup_intents`, `identity_verification_sessions`, `topups`, `quotes`, and `climate_orders`, including status changes, can lag by up to 10 minutes. Creates for those tables sync in real time.
- Creates in `checkout_sessions` can lag by up to 10 minutes. Updates to that table sync in real time.

Everything else syncs in real time.

## Next steps

You now have your Stripe data in your database on Neon, and it stays up to date on its own.

Put that data to work in your application. Query `stripe.subscriptions`, `stripe.invoices`, and `stripe.customers` next to your own tables to gate features on a customer's plan, show invoice history in your UI, or follow up when a charge fails. The synced tables stay up to date in the background, so your billing code reads a table instead of consuming events.

If you're shipping a SaaS product, [Postgres for SaaS](/use-cases/postgres-for-saas) covers branching, autoscaling, and database-per-tenant setups for the rest of your stack.

## Resources

- [Real-time sync to Postgres](https://docs.stripe.com/data/data-pipeline/real-time-sync-to-postgres)
- [Real-time sync schema](https://docs.stripe.com/data/data-pipeline/real-time-sync-to-postgres/schema)
- [IP Allow](/docs/introduction/ip-allow)
- [Branching](/docs/introduction/branching)

<NeedHelp/>
