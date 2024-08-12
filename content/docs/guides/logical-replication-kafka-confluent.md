---
title: Replicate data with Kafka (Confluent) and Debezium
subtitle: Learn how to replicate data from Neon with Kafka (Confluent) and Debezium
enableTableOfContents: true
isDraft: false
updatedOn: '2024-08-07T21:36:52.658Z'
---

Neon's logical replication feature allows you to replicate data from your Neon Postgres database to external destinations.

Confluent Cloud is a fully managed, cloud-native real-time data streaming service, built on Apache Kafka. It allows you to stream data from various sources, including Postgres, and build apps that consume messages from an Apache Kafka cluster.

In this guide, you will learn how to stream data from a Neon Postgres database to a Kafka cluster in Confluent Cloud. You will use the [PostgreSQL CDC Source Connector (Debezium) for Confluent Cloud](https://docs.confluent.io/cloud/current/connectors/cc-postgresql-cdc-source-debezium.html) to read Change Data Capture (CDC) events from the Write-Ahead Log (WAL) of your Neon database in real-time. The connector will write events to a Kafka stream and auto-generate a Kafka topic. The connector performs an initial snapshot of the table and then streams any future change events.

<Admonition type="note">
Confluent Cloud Connectors can be set up using the [Confluent Cloud UI](https://confluent.cloud/home) or the [Confluent command-line interface (CLI)](https://docs.confluent.io/confluent-cli/current/overview.html). This guide uses the Confluent Cloud UI.
</Admonition>

## Prerequisites

- A [Confluent Cloud](https://www.confluent.io/confluent-cloud) account
- A [Neon account](https://console.neon.tech/)

## Enable logical replication in Neon

<Admonition type="important">
Enabling logical replication modifies the PostgreSQL `wal_level` configuration parameter, changing it from `replica` to `logical` for all databases in your Neon project. Once the `wal_level` setting is changed to `logical`, it cannot be reverted. Enabling logical replication also restarts all computes in your Neon project, which means that active connections will be dropped and have to reconnect.
</Admonition>

To enable logical replication in Neon:

1. Select your project in the Neon Console.
2. On the Neon **Dashboard**, select **Settings**.
3. Select **Logical Replication**.
4. Click **Enable** to enable logical replication.

You can verify that logical replication is enabled by running the following query from the the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor):

```sql
SHOW wal_level;
 wal_level
-----------
 logical
```

## Create a publication

In this example, we'll create a publication for a `users` table in the `public` schema of your Neon database.

1. Create the `users` table in your Neon database. You can do this via the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or by connecting to your Neon database from an SQL client such as [psql](/docs/connect/query-with-psql-editor).

   ```sql
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     username VARCHAR(50) NOT NULL,
     email VARCHAR(100) NOT NULL
   );
   ```

2. Create a publication for the `users` table:

   ```sql
   CREATE PUBLICATION users_publication FOR TABLE users;
   ```

This command creates a publication, named `users_publication`, which will include all changes to the `users` table in your replication stream.

## Create a Postgres role for replication

It is recommended that you create a dedicated Postgres role for replicating data. The role must have the `REPLICATION` privilege. The default Postgres role created with your Neon project and roles created using the Neon CLI, Console, or API are granted membership in the [neon_superuser](/docs/manage/roles#the-neonsuperuser-role) role, which has the required `REPLICATION` privilege.

<Tabs labels={["CLI", "Console", "API"]}>

<TabItem>

The following CLI command creates a role. To view the CLI documentation for this command, see [Neon CLI commands — roles](https://api-docs.neon.tech/reference/createprojectbranchrole)

```bash
neon roles create --name alex
```

</TabItem>

<TabItem>

To create a role in the Neon Console:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. Select a project.
3. Select **Branches**.
4. Select the branch where you want to create the role.
5. Select the **Roles & Databases** tab.
6. Click **Add Role**.
7. In the role creation dialog, specify a role name.
8. Click **Create**. The role is created, and you are provided with the password for the role.

</TabItem>

<TabItem>

The following Neon API method creates a role. To view the API documentation for this method, refer to the [Neon API reference](/docs/reference/cli-roles).

```bash
curl 'https://console.neon.tech/api/v2/projects/hidden-cell-763301/branches/br-blue-tooth-671580/roles' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
  "role": {
    "name": "alex"
  }
}' | jq
```

</TabItem>

</Tabs>

## Grant schema access to your Postgres role

If your replication role does not own the schemas and tables you are replicating from, make sure to grant access. For example, the following commands grant access to all tables in the `public` schema to Postgres role `alex`:

```sql
GRANT USAGE ON SCHEMA public TO alex;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO alex;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO alex;
```

Granting `SELECT ON ALL TABLES IN SCHEMA` instead of naming the specific tables avoids having to add privileges later if you add tables to your publication.

## Grant schema access to your Postgres role

If your replication role does not own the schemas and tables you are replicating from, make sure to grant access. For example, the following commands grant access to all tables in the `public` schema to Postgres role `alex`:

```sql
GRANT USAGE ON SCHEMA public TO alex;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO alex;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO alex;
```

Granting `SELECT ON ALL TABLES IN SCHEMA` instead of naming the specific tables avoids having to add privileges later if you add tables to your publication.

## Create a replication slot

The Debezium connector requires a dedicated replication slot. Only one source should be configured to use this replication slot.

To create a replication slot called `debezium`, run the following command on your database using your replication role:

```sql
SELECT pg_create_logical_replication_slot('debezium', 'pgoutput');
```

- `debezium` is the name assigned to the replication slot. You will need to provide the slot name when you set up your source connector in Confluent.
- `pgoutput` is the logical decoder plugin used in this example. Neon supports both `pgoutput` and `wal2json` decoder plugins.

<Admonition type="important">
To prevent storage bloat, **Neon automatically removes _inactive_ replication slots after a period of time if there are other _active_ replication slots**. If you have or intend on having more than one replication slot, please see [Unused replication slots](/docs/guides/logical-replication-neon#unused-replication-slots) to learn more.
</Admonition>

## Set up a Kafka cluster in Confluent Cloud

1. Sign in to Confluent Cloud at [https://confluent.cloud](https://confluent.cloud).
2. Click **Add cluster**.
3. On the **Create cluster** page, for the **Basic cluster**, select **Begin configuration**.
4. On the **Region/zones** page, choose a cloud provider, a region, and select a single availability zone.
5. Select **Continue**.
6. Specify your payment details. You can select **Skip payment** for now if you're just trying out the setup.
7. Specify a cluster name, review the configuration and cost information, and select **Launch cluster**. In this example, we use `cluster_neon` as the cluster name.
   It may take a few minutes to provision your cluster. After the cluster has been provisioned, the **Cluster Overview** page displays.

## Set up a source connector

To set up a Postgres CDC source connector for Confluent Cloud:

1. On the **Cluster Overview** page, under **Set up connector**, select **Get started**.
2. On the **Connector Plugins** page, enter `Postgres` into the search field.
3. Select the **Postgres CDC Source** connector. This is the [PostgreSQL CDC Source Connector (Debezium) for Confluent Cloud](https://docs.confluent.io/cloud/current/connectors/cc-postgresql-cdc-source-debezium.html). This connector will take a snapshot of the existing data and then monitor and record all subsequent row-level changes to that data.

4. On the **Add Postgres CDC Source connector** page:

   - Select the type of access you want to grant the connector. For the purpose of this guide, we'll select **Global access**, but if you are configuring a production pipeline, Confluent recommends **Granular access**.
   - Click the **Generate API key & download** button to generate an API key and secret that your connector can use to communicate with your Kafka cluster. Your applications will need this API key and secret to make requests to your Kafka cluster. Store the API key and secret somewhere safe. This is the only time you’ll see the secret.

   Click **Continue**.

5. On the **Add Postgres CDC Source connector** page:

   - Add the connection details for your Neon database. You can obtain the required details from your Neon connection string, which you can find in the **Connection Details** widget on the Neon **Dashboard**. Your connection string will look something like this:

     ```text
     postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
     ```

     Enter the details for **your connection string** into the source connector fields. Based on the sample connection string above, the values would be specified as shown below. Your values will differ.

     - **Database name**: `dbname`
     - **Database server name**: `neon_server` (This is a user-specified value that will represent the logical name of your Postgres server. Confluent uses this name as a namespace in all Kafka topic and schema names. It is also used for Avro schema namespaces if the Avro data format is used. The Kafka topic will be created with the prefix `database.server.name`. Only alphanumeric characters, underscores, hyphens, and dots are allowed.)
     - **SSL mode**: `require`
     - **Database hostname** `ep-cool-darkness-123456.us-east-2.aws.neon.tech` (this example shows the portion of a Neon connection string forms the database hostname)
     - **Database port**: `5432` (Neon uses port `5432`)
     - **Database username**: `alex`
     - **Database Password** `AbC123dEf`

   - If you use Neon's **IP Allow** feature to limit IP addresses that can connect to Neon, you will need to add the Confluent cluster static IP addresses to your allowlist. For information about configuring allowed IPs in Neon, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow). If you do not use Neon's **IP Allow** feature, you can skip this step.

   Click **Continue**.

6. Under **Output Kafka record value format**, select an output format for Kafka record values. The default is `JSON`, so we'll use that format in this guide. Other supported values include `AVRO`, `JSON_SR`, and `PROTOBUF`, which are schema-based message formats. If you use any of these, you must also configure a [Confluent Cloud Schema Registry](https://docs.confluent.io/cloud/current/sr/index.html).

   Expand the **Show advanced configurations** drop-down and set the following values:

   - Under **Advanced configuration**
     - Ensure **Slot name** is set to `debezium`. This is the name of the replication slot you created earlier.
     - Set the **Publication name** to `users_publication`, which is the name of the publication you created earlier.
     - Set **Publication auto-create** mode to `disabled`. You've already created your publication.
   - Under **Database details**, set **Tables included** to `public.users`, which is the name of the Neon database table you are replicating from.

   Click **Continue**.

7. For **Connector sizing**, accept the default for the maximum number of [Tasks](https://docs.confluent.io/platform/current/connect/index.html#tasks). Tasks can be scaled up at a later time for additional throughput capacity.

   Click **Continue**.

8. Adjust your **Connector name** if desired, and review your **Connector configuration**, which is provided in `JSON` format, as shown below. We'll use the default connector name in this guide.

   ```json
   {
     "connector.class": "PostgresCdcSource",
     "name": "PostgresCdcSourceConnector_0",
     "kafka.auth.mode": "KAFKA_API_KEY",
     "kafka.api.key": "2WY3UABFDN7DDFIV",
     "kafka.api.secret": "****************************************************************",
     "schema.context.name": "default",
     "database.hostname": "ep-cool-darkness-123456.us-east-2.aws.neon.tech",
     "database.port": "5432",
     "database.user": "alex",
     "database.password": "************",
     "database.dbname": "dbname",
     "database.server.name": "neon_server",
     "database.sslmode": "require",
     "publication.name": "users_publication",
     "publication.autocreate.mode": "all_tables",
     "snapshot.mode": "initial",
     "tombstones.on.delete": "true",
     "plugin.name": "pgoutput",
     "slot.name": "debezium",
     "poll.interval.ms": "1000",
     "max.batch.size": "1000",
     "event.processing.failure.handling.mode": "fail",
     "heartbeat.interval.ms": "0",
     "provide.transaction.metadata": "false",
     "decimal.handling.mode": "precise",
     "binary.handling.mode": "bytes",
     "time.precision.mode": "adaptive",
     "cleanup.policy": "delete",
     "hstore.handling.mode": "json",
     "interval.handling.mode": "numeric",
     "schema.refresh.mode": "columns_diff",
     "output.data.format": "JSON",
     "after.state.only": "true",
     "output.key.format": "JSON",
     "json.output.decimal.format": "BASE64",
     "tasks.max": "1"
   }
   ```

   Click **Continue** to provision the connector, which may take a few monents to complete.

## Verify your Kafka stream

To verify that events are now being published to a Kafka stream in Confluent:

1. Insert a row into your `users` table from the Neon SQL Editor or a `psql` client connect to your Neon database. For example:

   ```sql
   -- Insert a new user
   INSERT INTO users (username, email) VALUES ('Zhang', 'zhang@example.com');
   ```

2. In Confluent Cloud, navigate to your cluster (`cluster_neon` in this guide) and select **Topics** > **neon_server.public.users** > **Messages**. Your newly inserted data should appear at the top of the list of messages.

## Next steps

With events now being published to a Kafka stream, you can now set up a connection between Confluent and a supported consumer. This is quite simple using a Confluent Connector. For example, you can stream data to [Databricks](https://docs.confluent.io/cloud/current/connectors/cc-databricks-delta-lake-sink/databricks-aws-setup.html#), [Snowflake](https://docs.confluent.io/cloud/current/connectors/cc-snowflake-sink.html), or one of the other supported consumers. Refer to the Confluent documentation for connector-specific instructions.

## References

- [Quick Start for Confluent Cloud](https://docs.confluent.io/cloud/current/get-started/index.html#cloud-quickstart)
- [Publications - PostgreSQL documentation](https://www.postgresql.org/docs/current/logical-replication-publication.html)

<NeedHelp/>
