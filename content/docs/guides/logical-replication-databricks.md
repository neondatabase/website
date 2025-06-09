---
title: Replicate data to Databricks with Airbyte
subtitle: Learn how to replicate data from Neon to Databricks Lakehouse with Airbyte
enableTableOfContents: true
isDraft: false
updatedOn: '2025-06-09T00:00:00.000Z'
---

Neon's logical replication feature allows you to replicate data from your Neon Postgres database to external destinations. In this guide, you will learn how to define your Neon Postgres database as a data source in Airbyte so that you can stream data to Databricks Lakehouse.

[Airbyte](https://airbyte.com) is an open-source data integration platform that moves data from a source to a destination system. Airbyte offers a large library of connectors for various data sources and destinations.

[Databricks](https://databricks.com) is a unified, open analytics platform that combines the best of data lakes and data warehouses into a "lakehouse" architecture. Databricks allows organizations to build, deploy, and manage data, analytics, and AI solutions at scale.

## Prerequisites

- A source [Neon project](/docs/manage/projects#create-a-project) with a database containing the data you want to replicate. If you're just testing this out and need some data to play with, you run the following statements from the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or an SQL client such as [psql](/docs/connect/query-with-psql-editor) to create a table with sample data:

  ```sql shouldWrap
  CREATE TABLE IF NOT EXISTS playing_with_neon(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);
  INSERT INTO playing_with_neon(name, value)
  SELECT LEFT(md5(i::TEXT), 10), random() FROM generate_series(1, 10) s(i);
  ```

- An [Airbyte cloud account](https://airbyte.com/) or a self-hosted Airbyte instance
- A [Databricks account](https://databricks.com/try-databricks) with an active workspace.
- Read the [important notices about logical replication in Neon](/docs/guides/logical-replication-neon#important-notices) before you begin.

## Prepare your source Neon database

This section describes how to prepare your source Neon database (the publisher) for replicating data.

### Enable logical replication in Neon

<Admonition type="important">
Enabling logical replication modifies the Postgres `wal_level` configuration parameter, changing it from `replica` to `logical` for all databases in your Neon project. Once the `wal_level` setting is changed to `logical`, it cannot be reverted. Enabling logical replication also restarts all computes in your Neon project, meaning active connections will be dropped and have to reconnect.
</Admonition>

To enable logical replication in Neon:

1. Select your project in the Neon Console.
2. On the Neon **Dashboard**, select **Settings**.
3. Select **Logical Replication**.
4. Click **Enable** to enable logical replication.

You can verify that logical replication is enabled by running the following query from the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or an SQL client such as [psql](/docs/connect/query-with-psql-editor):

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

### Grant schema access to your Postgres role

If your replication role does not own the schemas and tables you are replicating from, make sure to grant access. For example, the following commands grant access to all tables in the `public` schema to Postgres role `replication_user`:

```sql
GRANT USAGE ON SCHEMA public TO replication_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO replication_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO replication_user;
```

Granting `SELECT ON ALL TABLES IN SCHEMA` instead of naming the specific tables avoids having to add privileges later if you add tables to your publication.

### Create a replication slot

Airbyte requires a dedicated replication slot. Only one source should be configured to use this replication slot.

Airbyte uses the `pgoutput` plugin in Postgres for decoding WAL changes into a logical replication stream. To create a replication slot called `airbyte_slot` that uses the `pgoutput` plugin, run the following command on your database using your replication role:

```sql
SELECT pg_create_logical_replication_slot('airbyte_slot', 'pgoutput');
```

`airbyte_slot` is the name assigned to the replication slot. You will need to provide this name when you set up your Airbyte source.

### Create a publication

Perform the following steps for each table you want to replicate data from:

1. Add the replication identity (the method of distinguishing between rows) for each table you want to replicate:

   ```sql
   ALTER TABLE <table_name> REPLICA IDENTITY DEFAULT;
   ```

   In rare cases, if your tables use data types that support [TOAST](https://www.postgresql.org/docs/current/storage-toast.html) or have very large field values, consider using `REPLICA IDENTITY FULL` instead:

   ```sql
   ALTER TABLE <table_name> REPLICA IDENTITY FULL;
   ```

2. Create the Postgres publication. Include all tables you want to replicate as part of the publication:

   ```sql
   CREATE PUBLICATION airbyte_publication FOR TABLE <tbl1, tbl2, tbl3>;
   ```

   The publication name is customizable. Refer to the [Postgres docs](https://www.postgresql.org/docs/current/logical-replication-publication.html) if you need to add or remove tables from your publication.

<Admonition type="note">
The Airbyte UI currently allows selecting any table for Change Data Capture (CDC). If a table is selected that is not part of the publication, it will not be replicated even though it is selected. If a table is part of the publication but does not have a replication identity, the replication identity will be created automatically on the first run if the Postgres role you use with Airbyte has the necessary permissions.
</Admonition>

## Create a Postgres source in Airbyte

1. From your Airbyte Cloud account, or your self-hosted Airbyte instance, select **Sources** from the left navigation bar, search for **Postgres**, and then create a new Postgres source.
2. Enter the connection details for your Neon database. You can find your database connection details by clicking the **Connect** button on your **Project Dashboard**.

   > Make sure to select the `replication_user` role you created earlier when connecting to your Neon database. This role must have the `REPLICATION` privilege and access to the schemas and tables you want to replicate.

   For example, given a connection string like this:

   ```bash shouldWrap
   postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```

   Enter the details in the Airbyte **Create a source** dialog as shown below. Your values will differ.

   - **Host**: ep-cool-darkness-123456.us-east-2.aws.neon.tech
   - **Port**: 5432
   - **Database Name**: dbname
   - **Username**: replication_user
   - **Password**: AbC123dEf

   ![Airbyte Create a source](/docs/guides/airbyte_create_source.png)

3. Under **Optional fields**, list the schemas you want to sync. Schema names are case-sensitive, and multiple schemas may be specified. By default, `public` is the only selected schema.
4. Select an SSL mode. You will most frequently choose `require` or `verify-ca`. Both of these options always require encryption. The `verify-ca` mode requires a certificate. Refer to [Connect securely](/docs/connect/connect-securely) for information about the location of certificate files you can use with Neon.
5. Under **Advanced**:

   - Select **Read Changes using Write-Ahead Log (CDC)** from available replication methods.
   - In the **Replication Slot** field, enter the name of the replication slot you created previously: `airbyte_slot`.
   - In the **Publication** field, enter the name of the publication you created previously: `airbyte_publication`.
     ![Airbyte advanced fields](/docs/guides/airbyte_cdc_advanced_fields.png)

### Allow inbound traffic

If you are on Airbyte Cloud, and you are using Neon's **IP Allow** feature to limit IP addresses that can connect to Neon, you will need to allow inbound traffic from Airbyte's IP addresses. You can find a list of IPs that need to be allowlisted in the [Airbyte Security docs](https://docs.airbyte.com/operating-airbyte/security). For self-hosted Airbyte, you will need to allow inbound traffic from the IP address of your Airbyte instance. For information about configuring allowed IPs in Neon, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow).

### Complete the source setup

To complete your source setup, click **Set up source** in the Airbyte UI. Airbyte will test the connection to your database. Once this succeeds, you've successfully configured an Airbyte Postgres source for your Neon database.

## Configure Databricks Lakehouse as a destination

To complete your data integration setup, you can now add Databricks Lakehouse as your destination.

### Prerequisites

- **Databricks Server Hostname**: The hostname of your Databricks SQL Warehouse or All-Purpose Cluster (e.g., `adb-xxxxxxxxxxxxxxx.x.azuredatabricks.net` or `dbc-xxxxxxxx-xxxx.cloud.databricks.com`). You can find this in the Connection Details of your SQL Warehouse or Cluster.
- **Databricks HTTP Path**: The HTTP Path for your SQL Warehouse or Cluster. Found in the Connection Details.
- **Databricks Personal Access Token (PAT)**: A token used to authenticate. You can generate it from the same connection details page in Databricks.
- **Databricks Unity Catalog Name**: The name of the Unity Catalog you wish to use.
- **(Optional) Default Schema**: The schema within the Unity Catalog where tables will be created if not otherwise specified.

<Admonition type="important">
Ensure the Databricks SQL Warehouse or Cluster is running and accessible. The PAT must have sufficient permissions within the specified Unity Catalog and for the operations Airbyte will perform (e.g., `CREATE TABLE`, `CREATE SCHEMA` if the `Default Schema` doesn't exist, `INSERT data`).
</Admonition>

### Set up Databricks Lakehouse as a destination

1.  Navigate to Airbyte.
2.  Select **Destinations** from the left navigation bar, search for **Databricks Lakehouse**, and then select it.
3.  Click **+ New destination** and choose **Databricks Lakehouse**.
4.  Configure the Databricks Lakehouse destination:

    | Field                                                | Description                                                                                                                   | Example (Illustrative)                   |
    | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
    | **Destination name**                                 | A descriptive name for your destination in Airbyte.                                                                           | `Databricks Lakehouse`                   |
    | **Server Hostname**                                  | The Server Hostname of your Databricks SQL Warehouse or cluster.                                                              | `dbc-a1b2345c-d6e7.cloud.databricks.com` |
    | **HTTP Path**                                        | The HTTP Path from your Databricks SQL Warehouse or cluster's connection details.                                             | `/sql/1.0/warehouses/1234567890abcdef`   |
    | **Databricks Unity Catalog Name** (Required)         | The name of the Unity Catalog where data will be written.                                                                     | `workspace`                              |
    | **Authentication**                                   | Choose **Personal Access Token**.                                                                                             | `Personal Access Token`                  |
    | _Personal Access Token_                              | Enter your Databricks PAT.                                                                                                    | `dapi1234567890abcdef1234567890abcd`     |
    | **Port** (Optional Fields)                           | The port for the Databricks connection.                                                                                       | `443` (Default)                          |
    | **Default Schema** (Optional Fields)                 | The default schema within the Unity Catalog to write to. Airbyte will create this schema if it doesn't exist.                 | `airbyte_neon_data`                      |
    | **Purge Staging Files and Tables** (Optional Fields) | Enable to automatically clean up temporary staging files and tables used during the replication process. Usually recommended. | `Enabled` (Default)                      |
    | **Raw Table Schema Name** (Optional Fields)          | Schema used for storing raw data tables (_airbyte_raw_\*).                                                                    | `airbyte_internal` (Default)             |

    ![Airbyte Databricks Lakehouse destination setup](/docs/guides/airbyte_databricks_destination.png)

5.  When you're finished filling in the fields, click **Set up destination**. Airbyte will test the connection to your Databricks Lakehouse environment.

## Set up a connection

In this step, you'll set up a connection between your Neon Postgres source and your Databricks Lakehouse destination.

To set up a new connection:

1.  Navigate to Airbyte.
2.  Select **Connections** from the left navigation bar, then click **+ New connection**.
3.  Select the existing Postgres source you created earlier.
4.  Select the existing Databricks Lakehouse destination you created earlier.
5.  For the **Sync Mode**, select **Replicate Source**. Then, choose the specific tables from your Neon Postgres source that you want to replicate. Ensure you only select tables that are part of the PostgreSQL publication you created earlier (e.g., `playing_with_neon`).
6.  Click **Next**.
    ![Airbyte Neon Databricks connection setup](/docs/guides/airbyte_neon_databricks_connection_setup.png)
7.  Configure the sync frequency and other settings as needed. Select **Source defined** for the **Destination Namespace**.
    ![Airbyte Neon Databricks connection sync settings](/docs/guides/airbyte_neon_databricks_sync_settings.png)

Your first sync will start automatically soon, or you can initiate it manually if you opted for a manual schedule. Airbyte will then replicate data from Neon Postgres to your Databricks Lakehouse. The time this initial sync takes will depend on the amount of data.

## Verify the replication

After the sync operation is complete, you can verify the replication by navigating to your Databricks workspace.

1.  Go to your Databricks workspace.
2.  Navigate to **SQL Editor** from the left sidebar.
3.  Run the following SQL query to check the replicated data:

    ```sql
    SELECT * FROM workspace.public.playing_with_neon;
    ```

    > In the query, substitute `workspace` with the Databricks Unity Catalog Name you configured in Airbyte. The schema `public` should be replaced with the Default Schema you specified in the destination settings. Similarly, replace `playing_with_neon` with the name of the table you replicated.

    ![Databricks SQL Editor showing replicated data](/docs/guides/databricks_sql_editor_replicated_data.png)

This will display the data replicated from your Neon Postgres into your Databricks Lakehouse.

## References

- [Airbyte Documentation](https://docs.airbyte.com/)
- [Airbyte Databricks Lakehouse Destination Connector](https://docs.airbyte.com/integrations/destinations/databricks)
- [Databricks Documentation](https://docs.databricks.com/)
- [Databricks Unity Catalog documentation](https://docs.databricks.com/aws/en/data-governance/unity-catalog)
- [Neon Logical Replication](/docs/guides/logical-replication-neon)
- [Logical replication - PostgreSQL documentation](https://www.postgresql.org/docs/current/logical-replication.html)
- [Publications - PostgreSQL documentation](https://www.postgresql.org/docs/current/logical-replication-publication.html)

<NeedHelp/>
