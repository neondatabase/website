---
title: Stream changes from your Neon database to anywhere
subtitle: Learn how to capture and stream changes and rows from your database to anywhere with Sequin
enableTableOfContents: true
updatedOn: '2024-09-05T16:01:18.419Z'
---

Neon's Logical Replication features makes it possible to detect every change in your database. It can be used to power read-replicas and backups, but can also be used to add streaming characteristics to Neon.

[Sequin](https://github.com/sequinstream/sequin) uses Neon's logical replication to sends records and changes in your database to your applications and services, in real-time. It's designed to never miss an `insert`, `update`, or `delete` and provide exactly-once processing of all changes.

Changes are sent as messages via HTTP push (webhooks) or pull (SQS-like, with Sequin SDKs). Out of the box, you can start triggering side-effects when a new record is created, fan out work to cloud functions, or activate workflows in services like trigger.dev.

In this guide, we'll show you how to connect your Neon database to Sequin to start sending changes anywhere you need.

## Prerequisites

- A [Sequin account](https://console.sequinstream.com/register)
- A [Neon account](https://console.neon.tech/)
- Read the [important notices about logical replication in Neon](/docs/guides/logical-replication-neon#important-notices) before you begin

## Enable logical replication in Neon

Sequin uses the Write Ahead Log (WAL) to capture changes from your Postgres database. In this step, we'll enable logical replication for your Neon Postgres project.

<Admonition type="important">
Enabling logical replication modifies the Postgres `wal_level` configuration parameter, changing it from replica to logical for all databases in your Neon project. Once the `wal_level` setting is changed to logical, it cannot be reverted. Enabling logical replication also restarts all computes in your Neon project, meaning active connections will be dropped and have to reconnect.
</Admonition>

To enable logical replication in Neon:

1. Select your project in the Neon Console.
2. On the Neon **Dashboard**, select **Settings**.
3. Select **Logical Replication**.
4. Click **Enable** to enable logical replication.

You can verify that logical replication is enabled by running the following query from the [Neon SQL Editor](https://neon.tech/docs/get-started-with-neon/query-with-neon-sql-editor):

```sql
SHOW wal_level;
wal_level
-----------
logical
```

## Connect your Neon database to Sequin

After enabling logical replication on Neon, you'll now connect your Neon database to Sequin. Follow these steps:

1. In Neon, copy your database connection string from the **Connection Details** section on the **Project Dashboard**, which will look similar to this:

   ```sql shouldWrap
   postgresql://neondb_owner:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

2. In the Sequin Console, click on the **Connect Database** button, and then auto-complete your database credentials by clicking the **Autofill with URL** button and pasting in your database connection string.

3. Use the SQL Editor in your Neon project to create a replication slot by executing the following SQL query:

   ```sql
   SELECT pg_create_logical_replication_slot('sequin_slot', 'pgoutput');
   ```

   This creates a replication slot named `sequin_slot`.

4. Create a publication to indicate which tables will publish changes to the replication slot. Run the following SQL command:

   ```sql
   CREATE PUBLICATION sequin_pub FOR ALL TABLES;
   ```

   This will publish changes from all tables. If you want to publish changes from specific tables only, you can use:

   ```sql
   CREATE PUBLICATION sequin_pub FOR TABLE table1, table2, table3;
   ```

5. Back in the Sequin Console, enter the name of the replication slot (`sequin_slot`) and publication (`sequin_pub`) you just created. Then, name your database (e.g. `neondb`) and click **Create Database**.

With these steps completed, your Neon database is now connected to Sequin via a replication slot and publication. Sequin is now detecting changes to your tables.

## Create a consumer

Set up a consumer in Sequin to stream changes from your database.

1. In the Sequin Console, navigate to the **Consumers** page and click **Create Consumer**.

2. Select the Neon database you just created and then select the specific table you want to process changes for.

3. Define any filters for the changes you want to capture. For example, you might want to only process orders with a value greater than a certain amount, or accounts with a certain status.

4. Choose whether you want your consumer to process [rows or changes](https://sequinstream.com/docs/core-concepts#rows-and-changes):
   - **Rows**: Captures the latest state of records when a row is inserted or updated.
   - **Changes**: Captures every `insert`, `update`, and `delete`, including `OLD` values for updates and deletes.

5. Select your preferred method for [receiving changes](https://sequinstream.com/docs/core-concepts#consumption):
   - **HTTP Push** (Webhooks): Sequin sends changes to your specified endpoint.
   - **HTTP Pull** (similar to SQS): Your application pulls changes from Sequin.

6. Enter the final details for your consumer:
   - Give your consumer a name (e.g., `neon-changes-consumer`).
   - If using HTTP Push, provide the endpoint URL where Sequin should send the changes. You can also provide encrypted headers.
   - Optionally, set a timeout and add an endpoint path.

7. Click **Create Consumer** to finalize the setup.

Your consumer is now created and will start processing changes from your Neon database according to your specified configuration.

## Where to next?

You're now using Sequin with Neon to capture and stream changes from your database. From here, you can tailor your implementation for your use case:

* Use Sequin to trigger workflows in tools like Inngest or trigger.dev, activate side-effects in your app, setup audit logs, or generate denormalized views.
* Tailor your consumer's [filtering](https://sequinstream.com/docs/core-concepts#filtering) and settings to meet your requirements.
* Try a [pull consumer](https://sequinstream.com/docs/core-concepts#pull-consumers) with [our SDKs](https://sequinstream.com/docs/sdks) to completely manage how you retrieve changes at scale.
* Use Sequins [observability and monitoring](https://console.sequinstream.com/consumers) to debug and keep production humming.

Learn more in our [docs](https://sequinstream.com/docs/introduction). And if you need anything, Sequin is open source - just open an issue or reach out to us: <a href="mailto:founders@sequinstream.com">founders@sequinstream.com</a>.
