---
title: Replicate data to a ClickHouse database on DoubleCloud
subtitle: Learn how to replicate data from Neon to a ClickHouse database on DoubleCloud
enableTableOfContents: true
isDraft: false
updatedOn: '2024-10-02T13:57:11.420Z'
---

<Admonition type="warning">
**DoubleCloud is winding down operations**. Please see the [DoubleCloud announcement](https://double.cloud/blog/posts/2024/10/doublecloud-final-update/) for details. DoubleCloud will stop creating new accounts on October 1st, and existing DoubleCloud clients will have an opportunity to transition from DoubleCloud until March 1st, 2025.

Neon will remove DoubleCloud documentation from our site in the near future.
</Admonition>

Neon's logical replication feature allows you to replicate data from your Neon Postgres database to external destinations.

ClickHouse is an open-source column-oriented database that allows you to query billions of rows in milliseconds.
Its architecture is designed to handle analytical queries efficiently, which makes it ideal for data warehousing and analytics applications. Thanks to the columnar storage format, data can be compressed and retrieved more efficiently, allowing some analytical queries to execute 100 times faster compared to traditional databases like Postgres.

[DoubleCloud](https://double.cloud/) is a managed data platform that helps engineering teams build data infrastructure with zero-maintenance open-source technologies.

In this guide, you will learn how to replicate data from a Neon Postgres database to a managed ClickHouse cluster with DoubleCloud Transfer — a real-time data replication tool.
It natively supports ClickHouse data types, data mutations, automated migrations (adding columns), as well as emulating insertions and deletions.
With Transfer, you can replicate your data to both managed ClickHouse clusters on DoubleCloud and on-premise ClickHouse instances.

## Prerequisites

- A [DoubleCloud account](https://console.double.cloud/)
- A [Neon account](https://console.neon.tech/)
- Read the [important notices about logical replication in Neon](/docs/guides/logical-replication-neon#important-notices) before you begin

## Enable logical replication in Neon

<Admonition type="important">
Enabling logical replication modifies the Postgres `wal_level` configuration parameter, changing it from `replica` to `logical` for all databases in your Neon project. Once the `wal_level` setting is changed to `logical`, it cannot be reverted. Enabling logical replication also restarts all computes in your Neon project, meaning active connections will be temporarily dropped before automatically reconnecting.
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

Unlike replicating to other destinations, you don't need to configure a publication and replication slot manually. DoubleCloud Transfer does that for you automatically.

## Add DoubleCloud Transfer's IPs to the allowlist

If you are using Neon's **IP Allow** feature to limit IP addresses that can connect to Neon, add DoubleCloud Transfer's IPs to your allowlist in Neon:

```
# IPv6
2a05:d014:e78:3500::/56
```

```
# IPv4
3.77.1.232
3.74.181.206
3.78.156.2
3.77.29.32
3.125.212.122
```

For instructions, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow). You'll need to do this before you can validate your connection in the next step. If you are not using Neon's **IP Allow** feature, you can skip this step.

## Create a managed ClickHouse cluster on DoubleCloud

<Admonition type="tip">
If you already have a ClickHouse instance — for example, an on-premise one — and you want to transfer data there, skip this step and continue with steps described in [Create endpoints in DoubleCloud](#create-endpoints-in-doublecloud).
</Admonition>

1. Log in to the [DoubleCloud console](https://console.double.cloud/).
1. In the left menu, select **Clusters**, click **Create cluster**, and select **ClickHouse**.
1. Select cluster parameters.

<Admonition type="note">
If you're just testing ClickHouse, you can proceed with default parameters that will create a fully functional cluster suitable for testing and development.
For production, make sure to select at least three replicas, 16 GB of RAM, and dedicated Keeper hosts to ensure high availability.
</Admonition>

1. Under **Basic settings**, enter the cluster name, for example `clickhouse-dev`.
1. Click **Submit** at the bottom of the page. Creating a cluster takes around five minutes depending on the provider, region, and settings.
1. After the cluster status changes from _Creating_ to _Alive_, select it in the cluster list.
1. On the **Overview** tab, click **WebSQL** at the top right.

   WebSQL is a DoubleCloud service that allows you to connect to your managed ClickHouse clusters from your browser tab.
   It provides a full-fledged SQL editor that you can use to view databases and execute SQL queries.

1. Select a database in the connection manager on the left to open the query editor.

1. Create a database:

   ```sql
   CREATE DATABASE IF NOT EXISTS <database_name> ON CLUSTER default
   ```

1. Make sure that the database has been created:

   ```sql
   SHOW DATABASES
   ```

   ```bash
   ┌─name───────────────┐
   │ INFORMATION_SCHEMA │
   │ _system            │
   │ default            │
   │ <database_name>    │  // your database
   │ information_schema │
   │ system             │
   └────────────────────┘
   ```

## Create endpoints in DoubleCloud

Before you create a transfer in DoubleCloud, you need to create a source endpoint that fetches data from Neon and a target endpoint that writes the data to ClickHouse.

To create a source endpoint:

1. In the left menu in the console, select **Transfer**.
1. Click **Create** → **Source endpoint**.
1. Under **Basic settings**, select **PostgreSQL** as the source type.
1. Enter a name for your source endpoint, for example `neon`.
1. Under **Endpoint parameters**, enter connection details for your Neon database. You can get these details from your Neon connection string, which you'll find in the **Connection Details** widget on the **Dashboard** of your Neon project.
   For example, let's say this is your connection string:

   ```bash shouldWrap
   postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```

   From this string, the values would show as below. Your actual values will differ, with the exception of the port number.

   - **Host**: ep-cool-darkness-123456.us-east-2.aws.neon.tech
   - **Port**: 5432
   - **Username**: alex
   - **Password**: AbC123dEf
   - **Database Name**: dbname

1. Click **Test connection** and if it's successful, click **Submit**.

To create a target endpoint:

1. In the left menu in the console, select **Transfer**.
1. Click **Create** → **Target endpoint**.
1. Under **Basic settings**, select **ClickHouse** as the target type.
1. Enter a name for your source endpoint, for example `clickhouse`.
1. If you created a managed ClickHouse cluster in DoubleCloud, select it as the target endpoint in **Connection settings** → **Managed cluster**.

   If you want to transfer data to a ClickHouse instance elsewhere, select **On-premise** in **Connection settings** → **Connection type** and specify the connection details.

1. Enter the database name.
1. Click **Test connection** and if it's successful, click **Submit**.

## Create a transfer in DoubleCloud

1. In the left menu in the console, select **Transfer** and click **Create transfer**.
1. Under **Endpoints**, select the source and target endpoints you created in the previous step.
1. Enter the transfer name, for example `neon-to-clickhouse`.
1. Under **Transfer settings**, select **Snapshot and replication** as the transfer type and specify transfer parameters if needed.

<Admonition type="tip">
Even when logical replication isn't available on the Neon side, you can schedule Transfer to copy incremental data from Postgres to ClickHouse at a given interval. For that, enable **Periodic snapshot** and specify the time period.
</Admonition>

1. Click **Submit** to create the transfer.
1. On the transfer page, click **Activate**.

   When the data has transferred, the transfer status changes to _Done_.

## Query the transferred data with WebSQL

<Admonition type="note">
You can use WebSQL only to connect to managed ClickHouse clusters on DoubleCloud.
If you've transferred data to an on-premise ClickHouse cluster,
use the ClickHouse client or a similar tool to connect to it.
</Admonition>

1. In the left menu, select **Clusters** and select your cluster from the list.

1. On the **Overview** tab, click **WebSQL** at the top right.

1. Select the database you created earlier in the connection manager on the left.

1. In the query editor, enter and execute your query.

   The query output will be displayed under the editor.

## References

- [DoubleCloud get started with ClickHouse guide](https://double.cloud/docs/en/managed-clickhouse/get-started)
- [DoubleCloud get started with Transfer guide](https://double.cloud/docs/en/transfers/get-started)

<NeedHelp/>
