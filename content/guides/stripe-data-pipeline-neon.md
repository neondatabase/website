---
title: 'Sync Stripe data to Lakebase Postgres with Stripe Data Pipeline'
subtitle: 'Connect Stripe to Neon with OAuth and query your live Stripe data with SQL'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-10-10T00:00:00.000Z'
updatedOn: '2026-10-10T16:22:40.442Z'
---

Most teams that want their Stripe data in a database end up building the same plumbing twice. Webhooks deliver a stream of event notifications, and every one of those events is yours to store, version, and backfill yourself. You write a handler, a table schema, and a retry path, and you still don't have the current state of a customer until you've replayed enough events to reconstruct it.

[Stripe Data Pipeline](https://docs.stripe.com/data/data-pipeline/real-time-sync-to-postgres) takes a different approach. It maintains a continuously synchronized copy of your Stripe data in a Postgres database you own. Every listable Stripe resource, from charges to subscriptions, lands as a table with typed columns, and changes in Stripe appear in Postgres within a few seconds. You get the current state without writing event handlers or managing a data store of your own.

Neon is one of the partners Stripe supports for this, and the setup is about as short as it gets. You authorize your Neon account with OAuth in the Stripe Dashboard, and Stripe configures the database connection for you. There's no connection string to paste, no dedicated database user to create, no certificate to upload, and no IP allowlist to maintain. Stripe creates the schema, creates and manages the tables, backfills your existing data, and then streams changes into them.

In this guide, you'll connect a Stripe account to a Neon project with Data Pipeline:

- Request access to the public preview for real-time sync to Postgres
- Create a Neon project sized for your Stripe data
- Connect your Neon account to Stripe with OAuth
- Create a pipeline and choose which Stripe tables to sync
- Verify the backfill and query your Stripe data from the Neon SQL Editor
- Adjust the Neon settings that affect the sync, from storage to compute

## How it works

Stripe owns the pipeline, you own the database. The sync writes into its own schema in your Neon project, and everything outside that schema is yours to do what you want with:

```mermaid
flowchart LR
    A[Stripe account] -->|events and API changes| B[Stripe Data Pipeline]
    B -->|OAuth authorization| C[Neon project]
    B -->|creates schema, tables, backfill, streaming sync| D[Stripe-managed schema]
    C --> D
    D --> E[Neon SQL Editor]
    D --> F[Your app or BI tool]
```

1. **Stripe is the source.** The pipeline reads your Stripe account through the public API, so anything the public API can list is available to sync. See the [real-time sync schema](https://docs.stripe.com/data/data-pipeline/real-time-sync-to-postgres/schema) for the full list of tables and columns.
2. **You authorize Neon with OAuth.** Stripe uses that authorization to reach your project. When you create the pipeline, you either point it at an existing project or have Stripe provision a new one for you.
3. **Stripe creates and owns one schema.** In your project, Stripe creates a schema, `stripe` by default, and owns everything in it. It creates a table for every object you enabled, backfills it, and then keeps it current.
4. **You read, Stripe writes.** Run queries against the synced tables, connect a BI tool to them, and join them against your own tables in other schemas. Just don't write to the Stripe-managed schema yourself. External writes cause sync errors and data inconsistencies.

Each synced table has an `id` column plus three sync metadata columns: `_account_id`, `_updated_at`, and `_raw_data`. The `_raw_data` column holds the complete JSON representation of the Stripe object, so anything the typed columns don't expose is still there, one `->>` away.

## Prerequisites

- **A Stripe account with preview access.** Real-time sync to Postgres is in public preview, so you need to request access before the pipeline options show up in your dashboard. The first step below covers how.
- **A Neon account** with permission to create projects. Sign up at [console.neon.tech](https://console.neon.tech/signup) if you don't have one. If you let Stripe provision a project during setup, the Neon user who completes the OAuth flow needs to be able to create one.
- **Rough idea of your data volume.** Stripe's rule of thumb is about 1 GB of database storage for every 100,000 charges you've processed. Use that to pick a plan before you start, as covered in [Storage and sizing](#storage-and-sizing).

You don't need to worry about Stripe's Postgres version requirement. Stripe requires Postgres 13 or later, and Neon always runs a [supported major version](/docs/postgresql/postgres-version-support) well above that.

<Steps>

## Request preview access

Real-time sync to Postgres is in public preview, so the first thing to do is request access for your Stripe account. Replace `EMAIL` with the email address on your Stripe account:

```bash filename="Terminal"
curl https://docs.stripe.com/preview/register \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Referer: https://docs.stripe.com/data/data-pipeline/real-time-sync-to-postgres" \
  -d '{"email": "EMAIL", "preview": "data_pipeline_next_gen_preview"}'
```

Stripe confirms preview access by email. Until then, the **Pipelines** page in the Stripe Dashboard won't offer the Postgres sync options. The rest of this guide assumes you have access, so wait for the confirmation before continuing.

Because this is a preview, treat it as an evaluation rather than production infrastructure. The [limitations](#preview-limitations) section lists the delays that apply while the feature is in preview.

## Create a Neon project

Create the project the pipeline writes into. Pick the region closest to where your queries run, since Neon doesn't move data between regions after the fact:

1. In the [Neon Console](https://console.neon.tech), click **New Project**.
2. Enter a **Project name**, such as `stripe-sync`, and choose a **Region**. AWS US East (Ohio) (`aws-us-east-2`) is a good default if your queries run in the US.
3. Click **Create project**.

<Admonition type="note" title="Skip this if Stripe provisions the project">
During the OAuth flow, Stripe can create a Neon project for you instead of using an existing one. That's fine for evaluating the feature, and it takes about the same number of clicks. If you'd rather control the project name, region, and plan from the start, create it yourself as shown here.
</Admonition>

## Connect your Neon account to Stripe

With a project in place, connect your accounts:

1. Open the [Pipelines](https://dashboard.stripe.com/data-management/pipelines) page in the Stripe Dashboard.
2. Select **Neon**, then click **Connect your Neon account**.
3. Complete the OAuth authorization in the window that opens. Review the scopes Stripe asks for, then approve.
4. You're returned to the pipeline setup with your Neon account connected.

That authorization is the whole configuration step. Stripe doesn't ask for a connection string, a database user, or a CA certificate on the Neon path, and you don't need to open any network access. Everything the manual Postgres path asks for (dedicated user, SSL verification, firewall rules) is handled through the connection Stripe establishes with OAuth.

## Create the pipeline

Now create the pipeline itself:

1. On the **Pipelines** page, select **Neon** and click **Connect your Neon account** if you haven't already.
2. Choose whether to use an existing Neon project or have Stripe provision a new one on your behalf.
3. Select the tables to sync. Only the tables you pick are synced, and you can enable or disable individual tables at any time from the same page.
4. Click **Create pipeline**.

A good starting set for most teams is `customers`, `charges`, `invoices`, `subscriptions`, `payment_intents`, `payouts`, and `balance_transactions`. Add more later if you need them. Every table you add has to be backfilled, and the backfill is what takes the longest on a large account, so start with the tables you'll actually query.

When Stripe confirms connectivity, it creates the schema, creates a table for each object you enabled, backfills those tables, and then starts syncing changes. On a large account, the backfill can take a while. The pipeline page shows its progress.

## Verify the backfill

Once the pipeline reports that the backfill is done, check that the data is really there. Open the [SQL Editor](/docs/get-started/query-with-neon-sql-editor) for the project the pipeline is writing to and list the schemas:

```sql
SELECT schema_name FROM information_schema.schemata ORDER BY schema_name;
```

You should see a `stripe` schema alongside the default `public` schema. Then check the tables inside it:

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
Stripe owns the tables in that schema, and external writes cause sync errors and data inconsistencies. Read-only queries, BI tool connections, and joins from your own schemas are all fine. To build your own models on top of the synced data, do it in a separate schema, as covered in [Branch for your own models](#branch-for-your-own-models).
</Admonition>

## Query the synced data

The synced tables are plain Postgres tables, so anything you'd normally do with SQL works. Two things about the schema are worth knowing before you write your first query:

- Money amounts are integers in the smallest currency unit, so `amount` is in cents for USD charges.
- `created` is a Unix timestamp in seconds stored as a `bigint`, so wrap it with `to_timestamp()` to get a timestamp.

Here's monthly gross volume for the last 12 months:

```sql
SELECT date_trunc('month', to_timestamp(created)) AS month,
       sum(amount) / 100.0 AS gross_usd
FROM stripe.charges
WHERE captured
  AND NOT refunded
  AND currency = 'usd'
GROUP BY 1
ORDER BY 1 DESC
LIMIT 12;
```

Nested objects are typed columns where Stripe models them as such, and JSON everywhere else. The `metadata` column, for example, is `jsonb`, so you can filter on keys you set yourself:

```sql
SELECT id, amount, metadata->>'team' AS team
FROM stripe.charges
WHERE metadata ? 'team'
ORDER BY created DESC
LIMIT 10;
```

And when a column doesn't exist for something you need, `_raw_data` has the full object:

```sql
SELECT id,
       _raw_data->'outcome'->>'network_status' AS network_status
FROM stripe.charges
WHERE status = 'failed'
ORDER BY created DESC
LIMIT 5;
```

For revenue questions that span more than one resource, join the tables. This one pairs failed charges with the dispute records Stripe created for them:

```sql
SELECT c.id AS charge_id,
       c.amount,
       d.reason AS dispute_reason
FROM stripe.charges AS c
JOIN stripe.disputes AS d ON d.charge = c.id
ORDER BY c.created DESC
LIMIT 20;
```

See the [real-time sync schema](https://docs.stripe.com/data/data-pipeline/real-time-sync-to-postgres/schema) for the columns available on each table, and [Query with the Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) for how to work with query results.

## Connect your own tools

Anything that speaks Postgres can read the synced tables. To connect an application, a notebook, or a BI tool, copy the connection string from the **Connect** modal on your project dashboard in the Neon Console. Neon requires SSL, so the string includes `sslmode=require`:

```text shouldWrap
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

Use the pooled endpoint if the tool opens many short-lived connections, and the direct endpoint for long-running analytical queries. See [Connection pooling](/docs/connect/connection-pooling) for when to use which. For a reporting workload that runs against the tables all day, add a [read replica](/docs/introduction/read-replicas) so the queries don't compete with the sync for compute.

Keep your own tables out of the Stripe-managed schema. A clean pattern is to create a schema of your own for your models and join to `stripe.*` at read time.

</Steps>

## Neon settings worth knowing

The OAuth setup means the connection itself needs no configuration on your side. These settings on the Neon project are what affect how well the sync behaves.

### Storage and sizing

Stripe's sizing guidance is about 1 GB of database storage for every 100,000 charges you've processed, and actual usage varies with how many tables you sync and how much JSON those objects carry.

That number is worth checking against your plan before you create the pipeline. Neon's Free plan includes 1 GB of Postgres storage per project and 20 GB across all your projects, which a real Stripe account can fill on its own. On Launch and Scale, storage is unlimited and grows with your usage, so a paid plan is the right choice for anything beyond a quick evaluation. See [Plans](/docs/introduction/plans) for the details.

### Scale to zero and compute

Neon computes suspend after 5 minutes of inactivity. An active pipeline prevents that, since Stripe writes to the tables continuously, but there are two moments where compute matters:

- **During the backfill.** Stripe writes the full history of every table you enabled in a short window. That's the heaviest write load the project sees, and a compute that's scaling up and down underneath it slows the backfill down.
- **Right after you create the pipeline.** A suspended compute takes a moment to resume, which shows up as a delay before the first writes land.

On Free, scale to zero is always on and can't be disabled. On paid plans, you can turn it off to keep the compute always active, and [autoscaling](/docs/introduction/autoscaling) adjusts the compute size between your minimum and maximum as the load changes. See [Scale to zero](/docs/introduction/scale-to-zero) for how to change the setting.

### IP Allow

Neon's [IP Allow](/docs/introduction/ip-allow) feature restricts connections to IP addresses you specify, and it's available on the Scale plan. If it's enabled on the project the pipeline writes to, add Stripe's addresses or the sync can't connect.

Stripe might connect from any of these, so all of them need to be allowed:

<details>
<summary>Stripe IP addresses and ranges</summary>

```text
65.87.128.0/20
3.18.12.63
3.130.192.231
13.235.14.237
13.235.122.149
18.211.135.69
35.154.171.200
52.15.183.38
54.88.130.119
54.88.130.237
54.187.174.169
54.187.205.235
54.187.216.72
35.157.207.129
3.69.109.8
3.120.168.93
```

</details>

Add them under **Settings** > **IP Allow** for the project. Note that the list replaces your existing configuration rather than appending to it, so include any addresses you already rely on. Because IP Allow applies to all branches by default, the same list has to allow your own tooling. See [Configure IP Allow](/docs/manage/projects#configure-ip-allow) for the options, including applying the restriction to protected branches only.

<Admonition type="note" title="Only needed if you enabled IP Allow">
IP Allow is off by default, so most projects don't need this step. Check it if your organization requires it for compliance.
</Admonition>

### Branch for your own models

Branches are the natural way to build on top of the synced data without touching it. Create a branch from the project holding the Stripe-managed tables, and the branch gets a copy of that schema at the moment you branch. From there you can create your own schemas, views, and materialized tables, and nothing you do on the branch can affect the sync on the parent.

Because a branch is a copy, its data goes stale as Stripe keeps syncing to the parent. So develop and test your models against the branch copy, then apply the same schema changes on the branch the pipeline writes to. See [Branching](/docs/introduction/branching) for the workflow.

### Read replicas for analytics

If your reporting queries are heavy enough to matter, add a read replica to the project and point the BI tool at it instead. The replica serves reads from its own compute, so the sync keeps running uninterrupted on the primary. See [Read replicas](/docs/introduction/read-replicas) for setup.

## Preview limitations

<Admonition type="warning" title="Delays during the public preview">
While the feature is in public preview, some changes can take up to 10 minutes to appear in your database. Don't build anything that assumes the synced data is current to the second.
</Admonition>

During public preview:

- Updates to `payment_intents`, `invoiceitems`, `setup_intents`, `identity_verification_sessions`, `topups`, `quotes`, and `climate_orders`, including status changes, can lag by up to 10 minutes. Creates for those tables sync in real time.
- Creates in `checkout_sessions` can lag by up to 10 minutes. Updates to that table sync in real time.

Everything else syncs in real time.

Two other limits aren't preview-specific:

- **Only listable resources sync.** Every resource with a public list endpoint is available. Resources that return a single object rather than a list, such as [Balance](https://docs.stripe.com/api/balance), can't be synced.
- **Only public API data is included.** If a field isn't exposed through the public API, it isn't in the synced tables. Check the [real-time sync schema](https://docs.stripe.com/data/data-pipeline/real-time-sync-to-postgres/schema) before you count on a column being there.

## Troubleshooting

**The pipeline stays pending after you create it.** Check that the pipeline is writing to the project you're looking at, then confirm Stripe can reach the database at all. If the project has IP Allow enabled, the most likely cause is a missing address in the allowlist. See [IP Allow](#ip-allow).

**The backfill takes a long time or never finishes.** Large accounts take a while, so check the pipeline's progress in the Stripe Dashboard first. If the project is on the Free plan, scale to zero can pause the compute between backfill batches, which stretches the whole job out. See [Scale to zero and compute](#scale-to-zero-and-compute).

**You don't see the tables in the SQL Editor.** Confirm which project and database the pipeline is writing to. Stripe can create its own project during the OAuth flow, so the tables may not be in the project you created. List the schemas with `SELECT schema_name FROM information_schema.schemata;` to check.

**Your queries are slow.** Use the pooled endpoint for short queries and the direct endpoint for analytical ones, and add a read replica if the reporting load is constant. See [Connect your own tools](#connect-your-own-tools).

## Next steps

You now have your Stripe data in Lakebase Postgres, refreshing continuously, with all the flexibility that comes with owning the database. A few directions from here:

- **Sync more tables.** Enable additional tables on the **Pipelines** page whenever you need them. Each new table is backfilled before it starts syncing.
- **Model the data your way.** Build your own tables and views on a branch, then apply the same schema changes on the branch the pipeline writes to. Join `stripe.*` against your application tables for reporting that needs both.
- **Scale the read path.** Add a read replica for your BI tool so analytics and the sync never share a compute.
- **Automate on data changes.** Use [Neon Functions](/docs/compute/functions/overview) to run code when something in your database needs a reaction, like flagging a subscription that's about to churn.

## Resources

- [Real-time sync to Postgres](https://docs.stripe.com/data/data-pipeline/real-time-sync-to-postgres) (Stripe)
- [Configure Postgres for real-time sync](https://docs.stripe.com/data/data-pipeline/real-time-sync-to-postgres/configure) (Stripe)
- [Real-time sync schema](https://docs.stripe.com/data/data-pipeline/real-time-sync-to-postgres/schema) (Stripe)
- [Neon plans](/docs/introduction/plans)
- [Neon IP Allow](/docs/introduction/ip-allow)
- [Neon branching](/docs/introduction/branching)
- [Neon read replicas](/docs/introduction/read-replicas)
- [Query with the Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor)

<NeedHelp/>
