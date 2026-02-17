---
title: Replicate data to Databricks with Lakeflow Connect
subtitle: Learn how to replicate data from Neon to Databricks Lakehouse using the Databricks Lakeflow Connect PostgreSQL connector
enableTableOfContents: true
isDraft: false
updatedOn: '2026-02-16T00:00:00.000Z'
---

Neon's logical replication feature allows you to replicate data from your Neon Postgres database to external destinations. In this guide, you will learn how to prepare your Neon database as a source and use [Databricks Lakeflow Connect](https://docs.databricks.com/ingestion/lakeflow-connect/index.html) (LFC) to stream data into Databricks Lakehouse.

Lakeflow Connect provides fully-managed ingestion connectors, including a **PostgreSQL connector** that uses logical replication and change data capture (CDC). Databricks recommends this approach for replicating from databases like Neon into the lakehouse. The connector runs an ingestion gateway that continuously captures changes from your Neon database and an ingestion pipeline that applies them to Unity Catalog tables.

[Databricks](https://databricks.com) is a unified analytics platform that combines data lakes and data warehouses in a "lakehouse" architecture. [Unity Catalog](https://docs.databricks.com/data-governance/unity-catalog/index.html) provides governance for the replicated tables.

## Prerequisites

- A source [Neon project](/docs/manage/projects#create-a-project) with a database containing the data you want to replicate. If you're just testing, run the following from the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or an SQL client such as [psql](/docs/connect/query-with-psql-editor) to create sample data:

  ```sql shouldWrap
  CREATE TABLE IF NOT EXISTS playing_with_neon(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);
  INSERT INTO playing_with_neon(name, value)
  SELECT LEFT(md5(i::TEXT), 10), random() FROM generate_series(1, 10) s(i);
  ```

- A [Databricks account](https://databricks.com/try-databricks) with an active workspace enabled for [Unity Catalog](https://docs.databricks.com/data-governance/unity-catalog/index.html).
- Access to the **Lakeflow Connect PostgreSQL connector**, which is in **Public Preview**. Contact your Databricks account team to enroll.
- Read the [important notices about logical replication in Neon](/docs/guides/logical-replication-neon#important-notices) before you begin.

## Prepare your source Neon database

This section describes how to prepare your Neon database (the publisher) for logical replication. The steps align with what the [Databricks PostgreSQL source setup](https://docs.databricks.com/ingestion/lakeflow-connect/postgresql-source-setup.html) expects. You must create the **publication before the replication slot**.

### Enable logical replication in Neon

<Admonition type="important">
Enabling logical replication modifies the Postgres `wal_level` configuration parameter, changing it from `replica` to `logical` for all databases in your Neon project. Once the `wal_level` setting is changed to `logical`, it cannot be reverted. Enabling logical replication also restarts all computes in your Neon project, meaning active connections will be dropped and have to reconnect.
</Admonition>

To enable logical replication in Neon:

1. Select your project in the Neon Console.
2. On the Neon **Dashboard**, select **Settings**.
3. Select **Logical Replication**.
4. Click **Enable** to enable logical replication.

Verify that logical replication is enabled:

```sql
SHOW wal_level;
 wal_level
-----------
 logical
```

### Create a Postgres role for replication

Create a dedicated Postgres role for the Databricks connector. The role must have the `REPLICATION` privilege. The default Postgres role created with your Neon project and roles created via the Neon CLI, Console, or API are granted membership in the [neon_superuser](/docs/manage/roles#the-neonsuperuser-role) role, which has the required `REPLICATION` privilege.

<Tabs labels={["CLI", "Console", "API"]}>

<TabItem>

```bash
neon roles create --name databricks_replication
```

See [Neon CLI commands — roles](https://api-docs.neon.tech/reference/createprojectbranchrole).

</TabItem>

<TabItem>

1. Navigate to the [Neon Console](https://console.neon.tech).
2. Select a project, then **Branches** and the branch where you want the role.
3. Open the **Roles & Databases** tab and click **Add Role**.
4. Enter a role name (e.g. `databricks_replication`) and click **Create**. Save the password; you will need it for the Databricks connection.

</TabItem>

<TabItem>

See the [Neon API reference](/docs/reference/cli-roles) for creating a role via API.

</TabItem>

</Tabs>

### Grant schema access to your Postgres role

Grant the replication role access to the schemas and tables you will replicate. For example, for the `public` schema:

```sql
GRANT USAGE ON SCHEMA public TO databricks_replication;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO databricks_replication;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO databricks_replication;
```

Granting `SELECT ON ALL TABLES IN SCHEMA` avoids having to add privileges when you add tables to the publication later.

### Set replica identity for tables

For each table you want to replicate, set the replica identity. For tables with a primary key and no large TOASTable columns, use `DEFAULT`:

```sql
ALTER TABLE playing_with_neon REPLICA IDENTITY DEFAULT;
```

For tables with large variable-length columns (e.g. `TEXT`, `BYTEA`) or no primary key, use `FULL`. See [PostgreSQL replica identity](https://www.postgresql.org/docs/current/logical-replication-publication.html#LOGICAL-REPLICATION-PUBLICATION-REPLICA-IDENTITY).

### Create a publication

Create a publication that includes all tables you want to replicate. **Create the publication before creating the replication slot.**

```sql
CREATE PUBLICATION databricks_publication FOR TABLE playing_with_neon;
```

Use a different table list or `FOR ALL TABLES` as needed. The publication name is customizable; you will use it when configuring the Lakeflow Connect pipeline.

### Create a replication slot

The Lakeflow Connect gateway uses one logical replication slot per database, with the `pgoutput` plugin. Create the slot **after** the publication:

```sql
SELECT pg_create_logical_replication_slot('databricks_slot', 'pgoutput');
```

Use this slot name when you configure the ingestion pipeline in Databricks. Only one consumer (the Lakeflow gateway) should use this slot.

<Admonition type="note">
Neon manages replication slot parameters (such as WAL retention) for you. If you use multiple replication slots, ensure you do not exceed Neon's limits. When you delete the ingestion pipeline in Databricks, you must [drop the replication slot](https://docs.databricks.com/ingestion/lakeflow-connect/postgresql-maintenance.html#cleanup-replication-slots) in Neon to avoid leaving an unused slot.
</Admonition>

### Allow inbound traffic (if using Neon IP Allow)

If you use Neon's [IP Allow](/docs/manage/projects#configure-ip-allow) feature to restrict which IPs can connect, you must allow the IPs from which the Databricks ingestion gateway connects. Configure your firewall or security group to allow connections from your Databricks workspace (or the region where the gateway runs). For details, see [Databricks networking](https://docs.databricks.com/ingestion/lakeflow-connect/index.html#networking) and [Configure IP Allow](/docs/manage/projects#configure-ip-allow).

## Create a connection and pipeline in Databricks

In Databricks, you create a **Unity Catalog connection** that stores your Neon credentials, then create an **ingestion gateway** and **ingestion pipeline** that read from Neon and write to Unity Catalog tables. The gateway runs continuously to capture changes; the pipeline runs on a schedule (or on demand) to apply them to destination tables.

Full step-by-step instructions are in the Databricks documentation. Below is a summary with Neon-specific details.

### Connection details from Neon

You need the following from Neon (available from the **Connect** button on your project dashboard):

- **Host**: Your Neon hostname (e.g. `ep-cool-darkness-123456.us-east-2.aws.neon.tech`)
- **Port**: `5432`
- **Database**: Your database name (e.g. `neondb`)
- **User**: The replication role (e.g. `databricks_replication`)
- **Password**: The password for that role

Use **SSL**: Databricks supports secure connections; use `require` or `verify-ca` as appropriate. See [Connect securely](/docs/connect/connect-securely) for Neon certificate options.

### Option 1: Databricks UI

If the [PostgreSQL connector UI](https://docs.databricks.com/ingestion/lakeflow-connect/postgresql-pipeline.html) is available in your workspace:

1. In the sidebar, click **Data Ingestion**, then under **Databricks connectors** click **PostgreSQL**.
2. In the wizard, name the ingestion gateway and choose a catalog and schema for **staging** (where the gateway stores extracted data).
3. Name the pipeline and select the **destination catalog** for ingested tables.
4. Create or select a **connection**: choose **PostgreSQL** and enter the Neon Host, Port, Database, User, and Password from above.
5. Select the **tables** to ingest (only tables that are in your publication will sync).
6. On **Database Setup**, enter the **replication slot name** (`databricks_slot`) and **publication name** (`databricks_publication`) you created in Neon.
7. Optionally add a **schedule** and notifications, then save and run the pipeline.

If the UI is not yet available for PostgreSQL, use the CLI or a notebook as in Option 2.

### Option 2: Databricks CLI or APIs

1. **Create a PostgreSQL connection** in Unity Catalog with the Neon host, port, database, user, and password. See [Connect to managed ingestion sources — PostgreSQL](https://docs.databricks.com/connect/managed-ingestion.html#postgresql).
2. **Create the ingestion gateway and pipeline** using the [Databricks CLI or a notebook](https://docs.databricks.com/ingestion/lakeflow-connect/postgresql-pipeline.html#option-2-other-interfaces). In the pipeline configuration, set:
   - `slot_name` to `databricks_slot`
   - `publication_name` to `databricks_publication`
   - `source_catalog` to your Neon database name
   - `source_schema` (e.g. `public`) and the tables or schema to ingest

The gateway must run **continuously** so that the replication slot is consumed and WAL does not grow unbounded. The pipeline can run on a schedule (e.g. daily) to apply changes to destination tables.

## Verify the replication

After the first pipeline run (or after the initial sync completes):

1. In your Databricks workspace, open **SQL Editor**.
2. Query the destination table using the three-level namespace `catalog.schema.table`:

   ```sql
   SELECT * FROM <your_catalog>.<your_schema>.playing_with_neon;
   ```

   Replace `<your_catalog>` and `<your_schema>` with the destination catalog and schema you chose in the pipeline. This shows the data replicated from Neon into Databricks.

You can also check the pipeline run history and record counts on the pipeline details page in Databricks.

## References

- [Databricks Lakeflow Connect](https://docs.databricks.com/ingestion/lakeflow-connect/index.html)
- [Configure PostgreSQL for ingestion (source setup)](https://docs.databricks.com/ingestion/lakeflow-connect/postgresql-source-setup.html)
- [Ingest data from PostgreSQL (create pipeline)](https://docs.databricks.com/ingestion/lakeflow-connect/postgresql-pipeline.html)
- [PostgreSQL connector reference](https://docs.databricks.com/ingestion/lakeflow-connect/postgresql-reference.html)
- [Connect to managed ingestion sources — PostgreSQL](https://docs.databricks.com/connect/managed-ingestion.html#postgresql)
- [Neon Logical Replication](/docs/guides/logical-replication-neon)
- [Logical replication — PostgreSQL documentation](https://www.postgresql.org/docs/current/logical-replication.html)
- [Publications — PostgreSQL documentation](https://www.postgresql.org/docs/current/logical-replication-publication.html)

<NeedHelp />

