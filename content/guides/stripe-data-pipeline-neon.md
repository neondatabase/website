---
title: 'Sync Stripe data to Lakebase Postgres with Stripe Data Pipeline'
subtitle: 'Query your live Stripe data directly in Lakebase Postgres, with no webhooks or ETL pipelines to build'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-10-10T00:00:00.000Z'
updatedOn: '2026-10-19T05:40:44.574Z'
---

Most apps that use Stripe build their own copy of the Stripe data with webhooks. When something happens in Stripe, like a successful payment, Stripe sends a notification to your server, and your app writes a row to a table. That takes setup: an endpoint to receive the notifications, tables to store them, and code to retry failures. You also need a one-time import for the data that already existed. And each notification only describes what changed. To know a customer's current state, your app has to apply every event for that customer in order.

[Stripe Data Pipeline](https://docs.stripe.com/data/data-pipeline/real-time-sync-to-postgres) is a managed service that does all of that for you. It keeps a copy of your Stripe data in a Postgres database that you own, and keeps that copy up to date. Every Stripe resource you can list, from charges to subscriptions, becomes a table with typed columns. Changes show up in the database within a few seconds, though a few tables lag up to 10 minutes during the public preview (see [Preview limitations](#preview-limitations)). You query the current state directly, with no event handlers to write and no extra data store to run.

On Neon, that database is [Lakebase Postgres](/docs/postgres/overview). Stripe supports Neon directly. You connect your Neon account to Stripe with OAuth from the Stripe Dashboard, and Stripe sets up the connection for you. You don't have to configure a Postgres user, create tables, or write any code. The pipeline creates a schema in your project, backfills it with your existing data, and keeps it current.

In this guide, you'll connect a Stripe account to a Neon project with Data Pipeline. Here's what you'll do:

- Request access to the public preview for real-time sync to Postgres
- Create the Neon project the pipeline writes into, or let Stripe create one for you
- Connect your Neon account to Stripe with OAuth
- Create a pipeline and choose which Stripe tables to sync
- Verify the backfill and query your Stripe data from the Neon SQL Editor
- Create a test product and subscription in Stripe, then watch it sync to your database

## Prerequisites

Before you start, make sure you have:

1. **Neon account**: Sign up for a free Neon account at [console.neon.tech](https://console.neon.tech/signup).
2. **Stripe account**: Sign up for a Stripe account at [stripe.com](https://stripe.com) if you don't already have one. You can use a test (sandbox) account for this guide.

<Steps>

## Request preview access

Real-time sync to Postgres is in public preview, so your Stripe account needs access before the pipeline options appear in the Stripe Dashboard. Request it first, either from the Stripe docs site or from the command line:

<Tabs labels={["From the Stripe docs", "From the command line"]}>

<TabItem>

Visit [Real-time sync to Postgres](https://docs.stripe.com/data/data-pipeline/real-time-sync-to-postgres) and submit the preview access form shown there.

</TabItem>

<TabItem>

Send a request with the email address for the Stripe account you want to use. Replace `EMAIL` with that address:

```bash filename="Terminal"
curl https://docs.stripe.com/preview/register \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Referer: https://docs.stripe.com/data/data-pipeline/real-time-sync-to-postgres" \
  -d '{"email": "EMAIL", "preview": "data_pipeline_next_gen_preview"}'
```

</TabItem>

</Tabs>

Stripe confirms preview access by email. Once you have it, the pipeline options appear in the Stripe Dashboard.

## Create a Neon project

The pipeline needs a Neon project to write into. You can use an existing project or create a new one:

1. In the [Neon Console](https://console.neon.tech), click **New Project**.
2. Enter a **Project name**, such as `stripe-sync`, and choose a **Region**.
3. Click **Create project**.

<Admonition type="note" title="Let Stripe create it instead">
During the OAuth flow, Stripe can create a Neon project for you rather than using an existing one. If you want to do that, skip this step and create the project in Stripe instead.
</Admonition>

## Connect your Neon account to Stripe

With a project in place, connect your accounts:

1. Open the [Pipelines](https://dashboard.stripe.com/data-management/pipelines) page in the Stripe Dashboard.
2. Select **Neon**, then click **Connect your Neon account**.
3. Complete the OAuth authorization in the window that opens. Review the scopes Stripe asks for, then approve.
4. You're returned to the pipeline setup with your Neon account connected.

## Create the pipeline

Now that Stripe can reach your Neon project, create the pipeline:

1. On the **Pipelines** page on the Stripe Dashboard, select **Neon**. Your account should already be connected from the previous step.
2. Choose the Neon project you want to write into.
3. Select the tables to sync. Stripe syncs only the tables you pick, and you can enable or disable individual tables at any time from the same page.
4. Click **Create pipeline**.

For example, a good starting set is: `customers`, `charges`, `invoices`, `subscriptions`, `payment_intents`, `payouts`, and `balance_transactions`. Stripe backfills a table when you enable it, so start with the tables you'll actually query and add more later from the same page.

Once Stripe confirms it can connect, it creates the schema and a table for each object you enabled, backfills those tables, and then starts syncing changes. The pipeline page shows the backfill's progress. If the pipeline reports a sync error, or the backfill never finishes, see Stripe's [checklist for connection and sync problems](https://docs.stripe.com/data/data-pipeline/real-time-sync-to-postgres/common-errors) for the fix.

## Verify the backfill

Once the pipeline reports that the backfill is done, check that the data is really there. Open the [SQL Editor](/docs/get-started/query-with-neon-sql-editor) for the project the pipeline is writing to and list the schemas:

```sql
SELECT schema_name FROM information_schema.schemata ORDER BY schema_name;
```

You should see a `stripe` schema alongside your existing schemas. You can specify a different schema name when creating the pipeline. If you do, replace `stripe` with your chosen schema name in the queries below.

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'stripe'
ORDER BY table_name;
```

```text
     table_name
---------------------
 balance_transactions
 charges
 customers
 invoices
 payment_intents
 payouts
 subscriptions
```

Your list depends on which tables you enabled. Finally, count the rows in one of them and compare the result with what the Stripe Dashboard shows for the same object:

```sql
SELECT count(*) FROM stripe.charges;
```

<Admonition type="important" title="Don't write to the Stripe-managed schema">
Stripe manages the tables in this schema. Writing to them externally can cause sync errors and data inconsistencies, so **never write directly to the Stripe-managed schema**.

You can run read-only queries, use BI tools, and join Stripe-managed tables with your own tables on the Stripe IDs they share (for example, match `stripe.customers.id` with the customer ID your app stores). To build custom models on top of the synced data, create them in a schema of your own in the same project, and leave the `stripe` schema read-only.
</Admonition>

## Sync a test subscription

You can verify that the pipeline is working by creating a test product and subscription in Stripe. The new records should appear in your database within a few seconds.

1. In the Stripe Dashboard, open **Products** and click **Add product**.
2. Enter a name, such as `Stripe sync demo`, and add a recurring price, for example `$20` per month.
3. Click **Add product**, then on the product page click **Create payment link** and copy the link.
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

The new customer and subscription should appear in your database within a few seconds. Once checkout is complete in Stripe, you can query the customer and subscription records directly in your database. No webhook handler or scheduled import is required.

## Query the synced data

Now that the pipeline is syncing data, query the synced tables like any other Postgres table.

- Each table has an `id` column plus three sync metadata columns: `_account_id`, `_updated_at`, and `_raw_data`. `_raw_data` holds the complete JSON object for the row, so you can read any field that doesn't have a typed column.
- Money amounts are integers in the smallest currency unit. For USD charges, `amount` is in cents.
- `created` is a Unix timestamp in seconds, stored as a `bigint`. Wrap it with `to_timestamp()` to read it as a timestamp.

### Example queries

This query sums the total USD captured by month for the last year:

```sql
SELECT date_trunc('month', to_timestamp(created)) AS month,
       sum(amount_captured - amount_refunded) / 100.0 AS captured_usd
FROM stripe.charges
WHERE captured
  AND currency = 'usd'
  AND created >= extract(epoch FROM now() - interval '1 year')
GROUP BY 1
ORDER BY 1 DESC;
```

Columns such as `metadata` are `jsonb`, so you can read individual keys with the `->>` operator. This query lists the last ten charges that have a `team` key in their metadata:

```sql
SELECT id, amount, metadata->>'team' AS team
FROM stripe.charges
WHERE metadata ? 'team'
ORDER BY created DESC
LIMIT 10;
```

`outcome` is also `jsonb`. For a field without its own column, read the full object from `_raw_data`. This query lists the network status for the five most recent failed charges:

```sql
SELECT id,
       outcome->>'network_status' AS network_status
FROM stripe.charges
WHERE status = 'failed'
ORDER BY created DESC
LIMIT 5;
```

To answer questions that span more than one resource, join the tables. If you enabled the `disputes` table, this query lists charges alongside any disputes Stripe created for them:

```sql
SELECT c.id AS charge_id,
       c.amount,
       d.reason AS dispute_reason
FROM stripe.charges AS c
JOIN stripe.disputes AS d ON d.charge = c.id
ORDER BY c.created DESC
LIMIT 20;
```

For the columns available on each table, see the [real-time sync schema](https://docs.stripe.com/data/data-pipeline/real-time-sync-to-postgres/schema).

## Connect your own tools

The synced tables work with any Postgres client. To connect an app, notebook, or BI tool, open your project in the [Neon Console](https://console.neon.tech), click **Connect**, and copy the connection string from the **Connect to your branch** modal.

Use it wherever the client asks for Postgres connection details. For client-specific setup, see [Connect from any application](/docs/connect/connect-from-any-app).

</Steps>

## IP Allow

Neon's [IP Allow](https://neon.com/docs/introduction/ip-allow) feature restricts database connections to specified IP addresses and is available on the Scale plan. If IP Allow is enabled for the Neon project your pipeline writes to, you must add Stripe's IP addresses to the project's allowlist. Otherwise, Stripe won't be able to connect, and the pipeline won't work.

Stripe can connect from any IP address in its published list of addresses and ranges. Find the current list in Stripe's [Allow incoming connections from Stripe](https://docs.stripe.com/data/data-pipeline/real-time-sync-to-postgres/configure#source-ip-addresses) documentation, and add all listed addresses and ranges to your Neon project's allowlist.

To configure the allowlist, open the project in the Neon Console and go to **Settings** > **Networking** > **Public internet access**. Select **Only addresses on the allowlist** and add Stripe's IP addresses and ranges.

IP Allow applies to all branches by default. See [Configure IP Allow](/docs/manage/projects#configure-ip-allow) for the options, including applying the restriction to protected branches only.

<Admonition type="note" title="Only needed if you enabled IP Allow">
IP Allow is off by default, so most projects don't need this step. Check it if your organization requires it for compliance.
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

You now have your Stripe data in Lakebase Postgres, and it stays up to date on its own. That also means you no longer have to build your own copy of the Stripe data with webhooks. You have no endpoint to host, no retries to replay, no event ordering to get right, and no separate import for the records that existed before your app.

Put that data to work in your application: query `stripe.subscriptions`, `stripe.invoices`, and `stripe.customers` next to your own tables to gate features on a customer's plan, show invoice history in your UI, or reach customers before a charge fails. The synced tables stay up to date in the background, so your billing code reads a table instead of consuming events.

If you're shipping a SaaS product, [Postgres for SaaS](/use-cases/postgres-for-saas) covers branching, autoscaling, and database-per-tenant setups for the rest of your stack.

## Resources

- [Real-time sync to Postgres](https://docs.stripe.com/data/data-pipeline/real-time-sync-to-postgres)
- [Real-time sync schema](https://docs.stripe.com/data/data-pipeline/real-time-sync-to-postgres/schema)
- [IP Allow](/docs/introduction/ip-allow)
- [Neon branching](/docs/introduction/branching)

<NeedHelp/>
