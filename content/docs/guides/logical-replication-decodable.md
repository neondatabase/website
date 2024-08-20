---
title: Replicate data with Decodable
subtitle: Learn how to replicate data from Neon with Decodable
enableTableOfContents: true
isDraft: false
updatedOn: '2024-08-12T21:44:27.442Z'
---

Neon's logical replication feature allows you to replicate data from your Neon Postgres database to external destinations.

[Decodable](https://www.decodable.co/) is a fully managed platform for ETL, ELT, and stream processing,
powered by Apache Flink® and Debezium.

In this guide, you will learn how to configure a Postgres source connector in Decodable for ingesting changes from your Neon database so that you can replicate data from Neon to any of Decodable's [supported data sinks](https://docs.decodable.co/connect/destinations.html),
optionally processing the data with SQL or custom Flink jobs.

## Prerequisites

- A [Decodable account](https://www.decodable.co/) ([start free](https://app.decodable.co/-/accounts/create), no credit card required)
- A [Neon account](https://console.neon.tech/)

## Enable logical replication in Neon

<Admonition type="important">
Enabling logical replication modifies the Postgres `wal_level` configuration parameter, changing it from `replica` to `logical` for all databases in your Neon project. Once the `wal_level` setting is changed to `logical`, it cannot be reverted. Enabling logical replication also restarts all computes in your Neon project, meaning active connections will be dropped and have to reconnect.
</Admonition>

To enable logical replication in Neon:

1. Select your project in the Neon Console.
2. On the Neon **Dashboard**, select **Settings**.
3. Select **Logical Replication**.
4. Click **Enable** to enable logical replication.

You can verify that logical replication is enabled by running the following query from the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor):

```sql
SHOW wal_level;
 wal_level
-----------
 logical
```

## Create a Postgres role for replication

It is recommended that you create a dedicated Postgres role for replicating data. The role must have the `REPLICATION` privilege. The default Postgres role created with your Neon project and roles created using the Neon CLI, Console, or API are granted membership in the [neon_superuser](/docs/manage/roles#the-neonsuperuser-role) role, which has the required `REPLICATION` privilege.

<Tabs labels={["CLI", "Console", "API"]}>

<TabItem>

The following CLI command creates a role. To view the CLI documentation for this command, see [Neon CLI commands — roles](https://api-docs.neon.tech/reference/createprojectbranchrole)

```bash
neon roles create --name replication_user
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
    "name": "replication_user"
  }
}' | jq
```

</TabItem>

</Tabs>

## Grant schema access to your Postgres role

If your replication role does not own the schemas and tables you are replicating from, make sure to grant access. For example, the following commands grant access to all tables in the `public` schema to Postgres role `replication_user`:

```sql
GRANT USAGE ON SCHEMA public TO replication_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO replication_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO replication_user;
```

Granting `SELECT ON ALL TABLES IN SCHEMA` instead of naming the specific tables avoids having to add privileges later if you add tables to your publication.

## Create a publication

For each table you would like to ingest into Decodable, set its [replica identity](https://www.postgresql.org/docs/current/logical-replication-publication.html) to `FULL`.
To do so, issue the following statement in the **Neon SQL Editor**:

```sql
ALTER TABLE <tbl1> REPLICA IDENTITY FULL;
```

Next, create a [publication](https://www.postgresql.org/docs/current/sql-createpublication.html) with the name `dbz_publication`. Include all the tables you would like to ingest into Decodable.

```sql
CREATE PUBLICATION dbz_publication FOR TABLE <tbl1, tbl2, tbl3>;
```

Refer to the [Postgres docs](https://www.postgresql.org/docs/current/sql-alterpublication.html) if you need to add or remove tables from your publication.
Alternatively, you also can create a publication `FOR ALL TABLES`.

Upon start-up, the Decodable connector for Postgres will automatically create the [replication slot](https://www.postgresql.org/docs/current/logicaldecoding-explanation.html#LOGICALDECODING-REPLICATION-SLOTS) required for ingesting data change events from Postgres.
The slot's name will be prefixed with `decodable_`, followed by a unique identifier.

## Allow inbound traffic

If you are using Neon's **IP Allow** feature to limit the IP addresses that can connect to Neon, you will need to allow inbound traffic from Decodable's IP addresses.
Refer to the [Decodable documentation](https://docs.decodable.co/reference/regions-and-ip-addresses.html#ip-addresses) for the list of IPs that need to be allowlisted for the Decodable region of your account.
For information about configuring allowed IPs in Neon, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow).

## Create a Postgres source connector in Decodable

1. In the Decodable web UI, select **Connections** from the left navigation bar and click **New Connection**.
2. In the connector catalog, choose **Postgres CDC** and click **Connect**.
3. Enter the connection details for your Neon database. You can get these details from your Neon connection string, which you'll find in the **Connection Details** widget on the **Dashboard** of your Neon project.
   Your connection string will look like this:

   ```bash shouldWrap
   postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```

   Enter the details for **your connection string** into the source connector fields. Based on the sample connection string above, the values would be specified as shown below. Your values will differ.

   - **Connection Type**: Source (the default)
   - **Host**: ep-cool-darkness-123456.us-east-2.aws.neon.tech
   - **Port**: 5432
   - **Database**: dbname
   - **Username**: alex
   - **Password**: Click **Add a new secret...**, then specify a name for that secret and `AbC123dEf` as its value
   - **Decoding Plugin Name**: pgoutput (the default)

   ![Creating a source connector in Decodable](/docs/guides/decodable_create_source_connector.png)

4. Click **Next**. Decodable will now scan the source database for all the tables that can be replicated. Select one or more table(s) by checking the **Sync** box next to their name. Optionally, you can change the name of the destination stream for each table, which by default will be in the form of `<database name>__<schema name>__<table_name>`. You can also take a look a the schema of each stream by clicking **View Schema**.

   ![Selecting source tables in Decodable](/docs/guides/decodable_select_source_tables.png)

5. Click **Next** and specify a name for your connection, for instance: `neon-source`.

6. Click **Create and start**. The default start options in the following dialog don't require any changes, so click **Start** to launch the connector.

## Previewing the data

Once the connector is in **Running** state, navigate to the connected Decodable stream, via **Outbound to...** on the connector's overview tab.
By clicking **Run Preview**, you can examine the change events ingested by the connector.

![Preview of ingested data in Decodable](/docs/guides/decodable_preview_ingested_data.png)

## Next steps

At this point, you have a running connector, which continuously ingests changes from a Neon database into Decodable with low latency.
Next, you could set up one of the supported Decodable **sink connectors** which will propagate the data to a wide range of data stores and systems, such as Snowflake, Elasticsearch, Apache Kafka, Apache Iceberg, S3, any many more.

If needed, you also can add a **processing step**, either using SQL or by deploying your own Apache Flink job,
for instance, to filter and transform the data before propagating it to an external system.
Of course, you also can take your processed data back to another Neon database, using the Decodable sink connector for Postgres.

## References

- [Decodable: The Pragmatic Approach to Data Movement](https://www.decodable.co/blog/pragmatic-approach-to-data-movement)
- [Getting Started With Decodable](https://docs.decodable.co/welcome.html)
- [Connecting Decodable to Sources and Destinations](https://docs.decodable.co/connections.html)
- [About Decodable Pipelines](https://docs.decodable.co/pipelines.html)
- [Postgres Documentation: Logical Replication](https://www.postgresql.org/docs/current/logical-replication.html)

<NeedHelp/>
