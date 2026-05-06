---
title: Replicate data to ClickHouse
subtitle: Learn how to replicate data from Neon to ClickHouse Cloud
summary: >-
  Step-by-step guide for replicating data from a Neon Postgres database to
  ClickHouse Cloud using ClickPipes, ClickHouse's native CDC connector.
enableTableOfContents: true
isDraft: false
updatedOn: '2026-05-03T00:00:00.000Z'
---

Neon's logical replication feature allows you to replicate data from your Neon Postgres database to external destinations.

[ClickHouse](https://clickhouse.com/) is an open-source column-oriented database management system designed for real-time analytical queries on large volumes of data. Using **[ClickPipes](https://clickhouse.com/cloud/clickpipes)**, ClickHouse Cloud's native continuous data ingestion service, you can easily set up Change Data Capture (CDC) from your Neon Postgres database to stream real-time changes directly into ClickHouse.

In this guide, you will learn how to prepare your Neon Postgres database and configure a Postgres CDC ClickPipe to replicate data to ClickHouse Cloud.

## Prerequisites

- A [ClickHouse Cloud account](https://clickhouse.cloud/)
- A [Neon account](https://console.neon.tech/)
- Read the [important notices about logical replication in Neon](/docs/guides/logical-replication-neon#important-notices) before you begin

<Admonition type="important" title="Compute and billing">
Replication keeps compute active (no [scale to zero](/docs/introduction/scale-to-zero)) while subscribers are connected, which can increase your bill. See [Important notices about logical replication in Neon](/docs/guides/logical-replication-neon#important-notices).
</Admonition>

## Prepare your source Neon database

Before setting up the ClickPipe in ClickHouse Cloud, you need to prepare your source Neon Postgres database for logical replication. This involves enabling logical replication, creating a publication, and ensuring your tables are properly configured for replication.

### Enable logical replication in Neon

<Admonition type="important">
Enabling logical replication modifies the Postgres `wal_level` configuration parameter, changing it from `replica` to `logical` for all databases in your Neon project. Once the `wal_level` setting is changed to `logical`, it cannot be reverted. Enabling logical replication also restarts all computes in your Neon project, meaning active connections will be temporarily dropped and have to reconnect.
</Admonition>

To enable logical replication in Neon:

1. Select your project in the Neon Console.
2. On the Neon **Dashboard**, select **Settings**.
3. Select **Logical Replication**.
4. Click **Enable** to enable logical replication.

   ![Neon dashboard settings with option to enable logical replication](/docs/guides/neon-console-settings-logical-replication.png)

You can verify that logical replication is enabled by running the following query from the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor):

```sql
SHOW wal_level;
 wal_level
-----------
 logical
```

### Create a Postgres role for replication

It's recommended that you create a dedicated Postgres role for replicating data. The role must have the `REPLICATION` privilege. The default Postgres role created with your Neon project and roles created using the Neon CLI, Console, or API are granted membership in the [neon_superuser](/docs/manage/roles#the-neonsuperuser-role) role, which has the required `REPLICATION` privilege.

<Tabs labels={["CLI", "Console", "API"]}>

<TabItem>

The following CLI command creates a role. To view the CLI documentation for this command, see [Neon CLI commands - roles](https://api-docs.neon.tech/reference/createprojectbranchrole)

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
7. In the role creation dialog, specify a role name (`replication_user`).
8. Click **Create**. The role is created, and you are provided with the password for the role.

</TabItem>

<TabItem>

The following Neon API method creates a role. To view the API documentation for this method, refer to the [Neon API reference](https://api-docs.neon.tech/reference/createprojectbranchrole).

```bash
curl 'https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/roles' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
  "role": {
    "name": "replication_user"
  }
}' | jq
```

> Replace `{project_id}` and `{branch_id}` with your actual Neon project and branch IDs, and set the `NEON_API_KEY` environment variable with your Neon API key.

</TabItem>

</Tabs>

### Grant schema access to your Postgres role

If your replication role does not own the schemas and tables you are replicating from, make sure to grant the required access. For example, the following commands grant access to all tables in the `public` schema to Postgres role `replication_user`:

```sql
GRANT USAGE ON SCHEMA "public" TO replication_user;
GRANT SELECT ON ALL TABLES IN SCHEMA "public" TO replication_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA "public" GRANT SELECT ON TABLES TO replication_user;
```

Granting `SELECT ON ALL TABLES IN SCHEMA` and using `ALTER DEFAULT PRIVILEGES` ensures that your replication user can read all existing tables and any future tables added to the schema.

### Configure replica identity for tables

For a table to be replicated using ClickPipes, it must have either a `PRIMARY KEY` or a `REPLICA IDENTITY` defined.

If you have tables without a primary key, you must set the replica identity to `FULL` so that `UPDATE` and `DELETE` operations work correctly:

```sql
ALTER TABLE your_table_name REPLICA IDENTITY FULL;
```

<Admonition type="note">
Using `REPLICA IDENTITY FULL` requires more data to be written to the WAL for each change, which can increase WAL storage usage and impact performance. Use primary keys on your tables wherever possible.
</Admonition>

### Create a publication

Create a Postgres publication that includes the tables you want to replicate. It is recommended to create a publication that includes only the tables you want to replicate, rather than using `FOR ALL TABLES`, to minimize unnecessary data replication and reduce the amount of WAL data generated.

To create a publication named `clickpipes_pub` for specific tables, run the following command:

```sql
CREATE PUBLICATION clickpipes_pub FOR TABLE tb1, tb2;
```

> Replace `tb1` and `tb2` with the actual names of the tables you want to replicate. You can include as many tables as needed in the publication.

ClickPipes will use this publication to capture changes from your specified tables. Refer to the [Postgres docs](https://www.postgresql.org/docs/current/logical-replication-publication.html) if you need to add or remove tables from your publication.

### Allow inbound traffic (optional)

If you are using Neon's [**IP Allow**](/docs/introduction/ip-allow) feature to limit IP addresses that can connect to Neon, add ClickHouse's IPs to your allowlist in Neon.

For instructions, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow). You can find the list of IPs that need to be allowlisted in the [ClickHouse Cloud documentation](https://clickhouse.com/docs/integrations/clickpipes#list-of-static-ips).

## Create a ClickPipe in ClickHouse Cloud

Now that your Neon source database is prepared, you can create the CDC integration in ClickHouse.

1.  Log in to your [ClickHouse Cloud account](https://clickhouse.cloud/) and navigate to your service.
2.  Select **Data Sources** on the left-side menu and click **Create ClickPipe**.
    ![ClickHouse Cloud create ClickPipe button](/docs/guides/clickhouse_create_clickpipe.png)
3.  Select the **Neon** tile.
    ![ClickHouse Cloud Neon tile for ClickPipe source selection](/docs/guides/clickhouse_neon_clickpipe_tile.png)
4.  Enter the connection details for your Neon database. You can find these details by clicking the **Connect** button on your Neon **Project Dashboard**. Toggle **Parameters only** to easily copy individual connection values.
    <Admonition type="important">
    Use a **direct connection** to your compute endpoint, not a pooled connection. Logical replication requires a persistent connection and is not compatible with connection poolers. When copying your connection string from Neon, make sure it does not include `-pooler` in the hostname. For more information, see [Connection pooling](/docs/connect/connection-pooling).
    </Admonition>

    Enter the following connection details in ClickHouse Cloud:
    - **Name**: A name for your ClickPipe (e.g., `neon_to_clickhouse`)
    - **Host**: Your Neon database host (e.g., `ep-cool-darkness-123456.us-east-2.aws.neon.tech`)
    - **Port**: 5432
    - **User**: `replication_user` (the dedicated replication user you created earlier)
    - **Password**: The password for your replication user
    - **Database**: The name of the database you are replicating from

    Keep the default replication method, **Initial Load + CDC**, selected. This option first takes a snapshot of your existing data and then continuously replicates any ongoing changes.

    Click **Next** to continue.

5.  **Configure your ClickPipe**: Select the Publication you created earlier (e.g., `clickpipes_pub`) from the dropdown menu. This tells ClickPipes which tables to replicate and ensures that only the necessary WAL data is captured.
6.  **Advanced Settings** (Optional): You can configure the sync interval, batch sizes, or parallel threads for the initial snapshot. The defaults are generally recommended for standard workloads.
7.  **Configure Tables**: Select the tables you want to replicate from the source Postgres database. You can also rename tables for the destination ClickHouse database if desired.
8.  **Permissions**: Review the necessary permissions. Select the "Full access" role from the dropdown, then click **Create ClickPipe**.

ClickPipes will immediately begin provisioning. It will first take a snapshot of the source tables (Initial Load) and then transition to `Running` state, actively streaming Change-Data-Capture (CDC) events from Neon to ClickHouse using the write-ahead log (WAL).

![ClickHouse Cloud ClickPipe running status](/docs/guides/clickhouse_clickpipe_running.png)

## References

- [ClickHouse: Ingesting data from Postgres to ClickHouse (using CDC)](https://clickhouse.com/docs/integrations/clickpipes/postgres)
- [ClickHouse: Neon Postgres source setup guide](https://clickhouse.com/docs/integrations/clickpipes/postgres/source/neon-postgres)
- [ClickHouse: ClickPipes for Postgres FAQ](https://clickhouse.com/docs/integrations/clickpipes/postgres/faq)

<NeedHelp/>
