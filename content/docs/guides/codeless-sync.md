---
title: Sync Stripe data to Neon with Codeless Sync
subtitle: Copy Stripe, QuickBooks, Xero, or Paddle data into Neon tables and keep them up to date on a schedule
summary: >-
  How to connect a Neon database to Codeless Sync, copy Stripe customers into a
  stripe_customers table, and check the rows with psql or the Neon SQL Editor.
  Covers which Neon connection string to use (pooled or direct), a dedicated
  role and database for the synced tables, how scheduled syncs interact with
  scale to zero, and the paid Codeless Sync plans that include schedules.
enableTableOfContents: true
isDraft: false
updatedOn: '2026-11-25T12:42:50.681Z'
---

[Codeless Sync](https://codelesssync.com) copies data from Stripe, QuickBooks, Xero, and Paddle into tables in your own Postgres database, and can keep those tables up to date on a schedule. With the data in Neon, you can join it with your app's tables and query it with any Postgres client.

In this guide, you connect Codeless Sync to a Neon database, copy your Stripe customers into a `stripe_customers` table, and count the rows with `psql`. QuickBooks, Xero, and Paddle follow the same steps. Paddle uses its own API key in step 3, while QuickBooks and Xero connect with OAuth instead.

## Prerequisites

- A [Neon account](https://console.neon.tech/signup)
- A [Codeless Sync](https://codelesssync.com) account. The free plan covers manual syncs of up to 1,000 rows a month, which is enough for this guide.
- A [Stripe](https://dashboard.stripe.com) account. Test mode data works.
- [`psql`](/docs/connect/query-with-psql-editor) installed, to check the rows in step 6. You can use the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) instead.

## 1. Create a role and a database for the synced tables

Codeless Sync creates its tables outside your schema migrations. If your app manages its schema with a migration tool, keep the synced tables in their own database, or on their own [branch](/docs/introduction/branching), so your migrations don't see tables they didn't create. A dedicated role also lets you revoke Codeless Sync's access without affecting your other apps.

1. In the [Neon Console](https://console.neon.tech), select your project and branch.
2. Under **Postgres database**, select **Roles**, click **Add role**, and create a role such as `codeless_sync`. Copy the password that Neon shows you.
3. Under **Postgres database**, select **Databases**, click **Add database**, name it (for example, `billing`), and select `codeless_sync` as the owner.

For details, see [Manage roles](/docs/manage/roles) and [Manage databases](/docs/manage/databases).

<Admonition type="note">
Roles created in the Console are members of `neon_superuser`, so they can access every database on the branch. To limit a role to one database, create it with SQL and grant only the privileges it needs. Codeless Sync needs to create tables in the `public` schema and insert and update rows in them. See [Manage database access](/docs/manage/database-access).
</Admonition>

## 2. Copy the connection string

Click **Connect** in the Console nav to open the **Connect to your branch** modal. Select your branch, the `billing` database, and the `codeless_sync` role, then copy the connection string.

The **Connection pooling** toggle switches between two hostnames:

- **Pooled**: the hostname contains `-pooler`. Connections go through PgBouncer in transaction mode.
- **Direct**: the hostname has no `-pooler`. Connections go straight to Postgres.

TODO(ilshaad): confirm the pooled string works end to end (Test & Continue, Auto-create Table, Sync Now, and a scheduled run) before opening the PR.

Use the pooled connection string for Codeless Sync. Codeless Sync writes with parameterized `INSERT ... ON CONFLICT DO UPDATE` statements and doesn't use the session features that [transaction mode doesn't support](/docs/connect/connection-pooling#connection-pooling-in-transaction-mode), such as `SET`, `LISTEN`, or SQL-level `PREPARE`. A pooled string looks like this:

```bash
postgresql://codeless_sync:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/billing?sslmode=require&channel_binding=require
```

Keep the direct string for `psql`, schema migrations, and `pg_dump`. For more on when to use each, see [Connection pooling](/docs/connect/connection-pooling#when-to-use-pooled-vs-direct-connections).

## 3. Create a restricted Stripe key

Codeless Sync connects to Stripe with a restricted key, which you can revoke at any time without affecting your other keys. In the [Stripe Dashboard](https://dashboard.stripe.com):

1. Click **Developers**, then select **API keys**.
2. Click **Create Restricted Key**, then choose **Providing this key to another website**.
3. Name the key and enter `https://codelesssync.com` as the URL.
4. Leave **Customize permissions for this key** unticked, and click **Create restricted key**.

Restricted keys start with `rk_test_` or `rk_live_`.

TODO(ilshaad): confirm which Stripe permissions the "Providing this key to another website" option grants, and whether they are read-only.

## 4. Connect Neon to Codeless Sync

Create a sync configuration that points at your Neon database:

1. In the Codeless Sync dashboard, click **Create Sync Configuration**.
2. Choose **Stripe** as the API provider and **Customers** as the data type, then click **Next**.
3. On the **Database Project Setup** step, enter a project name, choose **Neon** as the **Database Platform**, paste the pooled connection string, and click **Test & Continue**.
4. Paste the restricted Stripe key, click **Connect**, then click **Next**.
5. Click **Auto-create Table**. Codeless Sync creates a `stripe_customers` table in your Neon database. Click **Next**.
6. Name the configuration and click **Create Sync Configuration**. Codeless Sync returns you to the dashboard.

![The Codeless Sync database step with Neon selected as the database platform](/docs/guides/codeless-sync-database-step.png)

If you see `Database authentication failed - check username and password`, part of the password was not copied. Copy the connection string from the **Connect to your branch** modal again, or reset the role's password, and paste it again.

## 5. Run the first sync

On the dashboard, click **Sync Now** on the new configuration. Codeless Sync opens the run page, which shows the rows processed as each batch is written.

![A completed Codeless Sync run showing the rows processed](/docs/guides/codeless-sync-first-sync.png)

If the compute was suspended, the first connection wakes it. See [Scheduled syncs and scale to zero](#scheduled-syncs-and-scale-to-zero).

## 6. Check the rows in Neon

<Tabs labels={["psql", "Neon SQL Editor"]}>

<TabItem>

Connect with `psql` using the direct connection string (turn off **Connection pooling** in the **Connect to your branch** modal), then count the rows:

```bash
psql "postgresql://codeless_sync:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/billing?sslmode=require&channel_binding=require"
```

```sql
SELECT count(*) FROM stripe_customers;
```

</TabItem>

<TabItem>

In the Neon Console, select **Postgres database** > **SQL Editor**, select your branch and the `billing` database, and run:

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

The count matches the rows processed on the run page.

## 7. Put the sync on a schedule

A manual sync is enough to try it out. To keep the table current, open the configuration and click **Create Schedule**. Schedules need a paid Codeless Sync plan. The Starter and Pro plans run daily, weekly, or monthly, and the Business plan adds every 12 hours.

TODO(ilshaad): confirm the plan names and frequencies match the live plan_limits table in production, not only Insert-mock-data/plan_limits.sql.

## Scheduled syncs and scale to zero

With [scale to zero](/docs/introduction/scale-to-zero), Neon suspends a compute after 5 minutes of inactivity by default. A scheduled sync connects to the database, so it wakes a suspended compute. The compute reactivates within a few hundred milliseconds, then stays active while the sync runs and suspends again after 5 minutes of inactivity.

Each scheduled sync therefore adds compute time to your usage. A daily or weekly schedule wakes the compute once per run. To see the effect, check your compute usage in the Neon Console after a few scheduled runs.

## Common gotchas

- **SSL mode**: Codeless Sync rewrites `sslmode=require`, `verify-ca`, and `verify-full` to `sslmode=no-verify`. The connection stays encrypted, but Codeless Sync doesn't verify Neon's certificate. See [Connect to Neon securely](/docs/connect/connect-securely).
- **Table names**: Codeless Sync creates tables with `stripe_`, `quickbooks_`, `xero_`, and `paddle_` prefixes. If your app has tables with the same names in the same database, use a separate database as described in step 1.
- **Database Platform**: the **Database Platform** choice is a label in Codeless Sync. The connection string decides which database it connects to.

TODO(ilshaad): confirm you want the SSL mode gotcha stated in the Neon docs, and confirm a string with &channel_binding=require passes Test & Continue as copied.

## Next steps

- [Connection pooling](/docs/connect/connection-pooling) for the limits on pooled and direct connections.
- [Branching](/docs/introduction/branching) to point a test sync configuration at a branch before your production database.
- [Codeless Sync documentation](https://codelesssync.com/docs/guides/database-setup) for the other providers and data types.

<NeedHelp/>
