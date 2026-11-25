---
title: Sync Stripe data to Neon with Codeless Sync
subtitle: Copy Stripe, QuickBooks, Xero, or Paddle data into Neon tables and keep them up to date on a schedule
summary: >-
  How to connect a Neon database to Codeless Sync, copy Stripe customers into a
  stripe_customers table, and check the rows with psql or the Neon SQL Editor.
  Covers which Neon connection string to use (pooled or direct), how scheduled
  syncs interact with scale to zero, the paid Codeless Sync plans that include
  schedules, and an optional dedicated role and database for the synced tables.
enableTableOfContents: true
isDraft: false
updatedOn: '2026-11-25T13:07:53.915Z'
---

[Codeless Sync](https://codelesssync.com) copies data from Stripe, QuickBooks, Xero, and Paddle into tables in your own Postgres database, and can keep those tables up to date on a schedule. With the data in Neon, you can join it with your app's tables and query it with any Postgres client.

In this guide, you connect Codeless Sync to a Neon database, copy your Stripe customers into a `stripe_customers` table, and count the rows with `psql`. QuickBooks, Xero, and Paddle follow the same steps. Paddle connects with its own API key, while QuickBooks and Xero connect with OAuth.

## Prerequisites

- A [Neon account](https://console.neon.tech/signup) with a project
- A [Codeless Sync](https://codelesssync.com) account. The free plan covers manual syncs of up to 1,000 rows a month, which is enough for this guide.
- A [Stripe](https://dashboard.stripe.com) account. Test mode data works.
- [`psql`](/docs/connect/query-with-psql-editor) installed, to check the rows in step 5. You can use the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) instead.

## 1. Copy the connection string

In the Neon Console, open your project's connection details and copy the connection string for the database you want to sync to. For details, see [Connect from any application](/docs/connect/connect-from-any-app).

Neon offers two kinds of connection string:

- **Pooled**: the hostname contains `-pooler`. Connections go through PgBouncer in transaction mode.
- **Direct**: the hostname has no `-pooler`. Connections go straight to Postgres.

TODO(ilshaad): confirm the pooled string works end to end (connection test, table creation, a manual sync, and a scheduled run) before opening the PR.

Use the pooled connection string for Codeless Sync. Codeless Sync writes with parameterized `INSERT ... ON CONFLICT DO UPDATE` statements and doesn't use the session features that [transaction mode doesn't support](/docs/connect/connection-pooling#connection-pooling-in-transaction-mode), such as `SET`, `LISTEN`, or SQL-level `PREPARE`. A pooled string looks like this:

```bash
postgresql://neondb_owner:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

Keep the direct string for `psql`, schema migrations, and `pg_dump`. For more on when to use each, see [Connection pooling](/docs/connect/connection-pooling#when-to-use-pooled-vs-direct-connections).

## 2. Create a restricted Stripe key

Create a restricted key in the Stripe Dashboard for Codeless Sync to use. A restricted key can be revoked at any time without affecting your other keys. Restricted keys start with `rk_test_` or `rk_live_`. For the steps, see the [Codeless Sync Stripe setup guide](https://codelesssync.com/docs/guides/stripe-setup).

## 3. Connect Neon to Codeless Sync

In Codeless Sync, create a new sync configuration:

1. Choose **Stripe** as the provider and **Customers** as the data type.
2. Add a database project, choose **Neon** as the platform, and paste the pooled connection string. Codeless Sync tests the connection before you continue.
3. Paste your restricted Stripe key.
4. Let Codeless Sync create the `stripe_customers` table in your Neon database. You can also copy its SQL template and run it yourself.
5. Name the configuration and save it.

![The Codeless Sync database step with Neon selected as the database platform](/docs/guides/codeless-sync-database-step.png)

If the connection test reports `Database authentication failed - check username and password`, part of the password was not copied. Copy the connection string from the Neon Console again and paste it again.

## 4. Run the first sync

Start a manual sync of the new configuration. Codeless Sync shows the rows processed as each batch is written.

![A completed Codeless Sync run showing the rows processed](/docs/guides/codeless-sync-first-sync.png)

If the compute was suspended, the first connection wakes it. See [Scheduled syncs and scale to zero](#scheduled-syncs-and-scale-to-zero).

## 5. Check the rows in Neon

<Tabs labels={["psql", "Neon SQL Editor"]}>

<TabItem>

Connect with `psql` using the direct connection string, then count the rows:

```bash
psql "postgresql://neondb_owner:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

```sql
SELECT count(*) FROM stripe_customers;
```

</TabItem>

<TabItem>

Open the SQL Editor in the Neon Console, select your branch and database, and run:

```sql
SELECT count(*) FROM stripe_customers;
```

See [Query with Neon's SQL Editor](/docs/get-started/query-with-neon-sql-editor).

</TabItem>

</Tabs>

TODO(ilshaad): set the count below to the number shown in codeless-sync-first-sync.png. 117 is the count from the Prisma guide's test account.

```text
 count
-------
   117
(1 row)
```

The count matches the rows processed in the sync.

## 6. Put the sync on a schedule

A manual sync is enough to try it out. To keep the table current, add a schedule to the configuration. Schedules need a paid Codeless Sync plan. The Starter and Pro plans run daily, weekly, or monthly, and the Business plan adds every 12 hours.

TODO(ilshaad): confirm the plan names and frequencies match the live plan_limits table in production, not only Insert-mock-data/plan_limits.sql.

## Scheduled syncs and scale to zero

With [scale to zero](/docs/introduction/scale-to-zero), Neon suspends a compute after 5 minutes of inactivity by default. A scheduled sync connects to the database, so it wakes a suspended compute. The compute reactivates within a few hundred milliseconds, then stays active while the sync runs and suspends again after 5 minutes of inactivity.

Each scheduled sync therefore adds compute time to your usage. A daily or weekly schedule wakes the compute once per run. To see the effect, check your compute usage in the Neon Console after a few scheduled runs.

## Optional: use a dedicated role and database

The default role and database work with Codeless Sync. For more control, you can give Codeless Sync its own:

- **Database or branch**: Codeless Sync creates its tables outside your schema migrations. If your app manages its schema with a migration tool, keep the synced tables in their own database, or on their own [branch](/docs/introduction/branching), so your migrations don't see tables they didn't create.
- **Role**: a role used only by Codeless Sync can be removed without affecting your other apps. Codeless Sync needs to create tables in the `public` schema and to insert and update rows in them.

See [Manage roles](/docs/manage/roles), [Manage databases](/docs/manage/databases), and [Manage database access](/docs/manage/database-access).

## Common gotchas

- **SSL mode**: Codeless Sync rewrites `sslmode=require`, `verify-ca`, and `verify-full` to `sslmode=no-verify`. The connection stays encrypted, but Codeless Sync doesn't verify Neon's certificate. See [Connect to Neon securely](/docs/connect/connect-securely).
- **Table names**: Codeless Sync creates tables with `stripe_`, `quickbooks_`, `xero_`, and `paddle_` prefixes. If your app has tables with the same names in the same database, use a separate database.
- **Platform choice**: the platform you pick in Codeless Sync is a label. The connection string decides which database it connects to.

TODO(ilshaad): confirm you want the SSL mode gotcha stated in the Neon docs, and confirm a string with &channel_binding=require passes the connection test as copied.

## Next steps

- [Connection pooling](/docs/connect/connection-pooling) for the limits on pooled and direct connections.
- [Branching](/docs/introduction/branching) to point a test sync configuration at a branch before your production database.
- [Codeless Sync documentation](https://codelesssync.com/docs/guides/database-setup) for the other providers and data types.

<NeedHelp/>
