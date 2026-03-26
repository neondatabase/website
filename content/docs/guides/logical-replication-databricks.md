---
title: Replicate data to Databricks with Lakeflow Connect
subtitle: Learn how to replicate data from Neon to Databricks Lakehouse using the
  Lakeflow Connect PostgreSQL connector
enableTableOfContents: true
isDraft: false
updatedOn: '2026-03-20T18:41:23.218Z'
---

Neon's logical replication feature lets you stream changes from your Neon Postgres database into external systems. This guide shows how to use Databricks Lakeflow Connect's PostgreSQL connector to replicate data from Neon Postgres into Databricks Lakehouse using PostgreSQL logical replication.

The PostgreSQL connector for Lakeflow Connect is a managed ingestion connector that:

- Connects to PostgreSQL over TLS using a Unity Catalog connection
- Uses logical replication with the `pgoutput` plugin for change data capture (CDC)
- Requires PostgreSQL 13+ on the primary instance (not a read replica)
- Extracts snapshot and change data through an ingestion gateway and loads it into Delta tables via an ingestion pipeline

<Admonition type="important" title="Public Preview">
The PostgreSQL connector for Lakeflow Connect is currently in Public Preview. You must work with your Databricks account team to have it enabled for your workspace.
</Admonition>

## Prerequisites

You need:

- **A Neon project** with a Postgres database containing the data you want to replicate. For test data, you can run the following in the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) or an SQL client such as [psql](/docs/connect/query-with-psql-editor):

  ```sql
  CREATE TABLE IF NOT EXISTS playing_with_neon (
    id    SERIAL PRIMARY KEY,
    name  TEXT NOT NULL,
    value REAL
  );

  INSERT INTO playing_with_neon (name, value)
  SELECT LEFT(md5(i::TEXT), 10), random()
  FROM generate_series(1, 10) s(i);
  ```

- **A Databricks workspace** with Unity Catalog enabled, serverless compute available for Lakeflow Spark Declarative Pipelines, and the Lakeflow Connect PostgreSQL connector enabled (Public Preview)
- **Permissions in Databricks**: `CREATE CONNECTION` on the metastore (if you will create a new Unity Catalog connection); `USE CATALOG` on target and staging catalogs; `USE SCHEMA`, `CREATE TABLE`, and `CREATE VOLUME` on target schemas, or `CREATE SCHEMA` on the catalogs
- **Network connectivity**: Neon must accept inbound connections from your Databricks workspace (or via VPN/PrivateLink, depending on setup). If you use [IP Allow](/docs/manage/projects#configure-ip-allow) in Neon, add the Databricks egress addresses to your allowlist. See [Subscriber access](/docs/guides/logical-replication-neon#subscriber-access)
- **PostgreSQL**: Neon Postgres running v13 or later with logical replication enabled on the primary. The connector does not support logical replication from a read replica

Read the [important notices about logical replication in Neon](/docs/guides/logical-replication-neon#important-notices) before you begin.

## Step 1: Prepare your Neon Postgres database

Configure Neon as a logical replication publisher that Lakeflow Connect can subscribe to.

### Enable logical replication in Neon

<Admonition type="important">
Enabling logical replication sets `wal_level` from `replica` to `logical` for the entire project and restarts all computes in the project, briefly disconnecting clients. Once set to `logical`, it cannot be reverted.
</Admonition>

1. In the Neon Console, open your project.
2. Go to **Settings** → **Logical Replication**.
3. Click **Enable**.

Verify:

```sql
SHOW wal_level;
-- should return: logical
```

### Create a dedicated replication role

Databricks recommends a dedicated database user for ingestion. Create a role in Neon (roles created via the Neon Console, CLI, or API are granted the [neon_superuser](/docs/manage/roles#the-neonsuperuser-role) role, which has the required `REPLICATION` privilege). You can name it `databricks_replication` or reuse an existing replication role.

<Tabs labels={["Console", "CLI", "API"]}>

<TabItem>

1. In the [Neon Console](https://console.neon.tech), select your project and **Branches**.
2. Select the branch, then the **Roles & Databases** tab.
3. Click **Add Role**, enter the role name (e.g. `databricks_replication`), and click **Create**. Save the password.

</TabItem>

<TabItem>

```bash
neon roles create --name databricks_replication
```

</TabItem>

<TabItem>

Set `PROJECT_ID` and `BRANCH_ID` from your Neon project (for example from the project URL in the Console or via the Neon API).

```bash
export PROJECT_ID="your_project_id"
export BRANCH_ID="your_branch_id"

curl "https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches/$BRANCH_ID/roles" \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"role": {"name": "databricks_replication"}}'
```

</TabItem>

</Tabs>

Then grant the role access to the database and tables. Run the following as a user with sufficient privileges (e.g. your primary role):

```sql
GRANT CONNECT ON DATABASE your_database TO databricks_replication;
GRANT USAGE ON SCHEMA public TO databricks_replication;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO databricks_replication;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT ON TABLES TO databricks_replication;
```

Granting `SELECT ON ALL TABLES IN SCHEMA` and `ALTER DEFAULT PRIVILEGES` ensures future tables in the schema are included without re-granting.

### Configure replica identity for tables

Logical replication needs enough row identity to apply updates and deletes. For tables with a primary key and no large TOAST columns, use the default:

```sql
ALTER TABLE public.playing_with_neon REPLICA IDENTITY DEFAULT;
```

For tables without a primary key or with very large variable-length columns (e.g. large TEXT, BYTEA), use `FULL`:

```sql
ALTER TABLE public.some_large_table REPLICA IDENTITY FULL;
```

Repeat for each table you plan to replicate.

### Create a publication

Create a logical replication publication that includes all tables you want to ingest. One publication per database.

```sql
-- Option 1: Explicit list
CREATE PUBLICATION databricks_publication
  FOR TABLE public.playing_with_neon;

-- Option 2: All tables in the database
-- CREATE PUBLICATION databricks_publication FOR ALL TABLES;
```

You can later use `ALTER PUBLICATION` to add or remove tables. Only tables in this publication will be replicated.

### Create a logical replication slot

Lakeflow Connect uses logical replication slots with the `pgoutput` plugin. From your Neon database, connected as your replication role:

```sql
SELECT pg_create_logical_replication_slot('databricks_slot', 'pgoutput');
```

You will use the slot name `databricks_slot` and publication name `databricks_publication` when configuring the Lakeflow gateway.

<Admonition type="tip" title="Replication slots and WAL">
Logical replication slots retain WAL until a subscriber consumes it. If the Lakeflow ingestion gateway is stopped for too long, WAL can accumulate. Keep the gateway running continuously and monitor replication lag. Neon also [removes inactive replication slots](/docs/guides/logical-replication-neon#unused-replication-slots) after approximately 40 hours if progress is not acknowledged.
</Admonition>

At this point Neon is ready: `wal_level = logical`, a dedicated replication user with the required privileges, replica identities set on tables, `databricks_publication` defined, and `databricks_slot` created with `pgoutput`.

## Step 2: Create a Unity Catalog connection to Neon

Lakeflow Connect uses Unity Catalog connections to store JDBC connection details and credentials for PostgreSQL. Create the connection in the Databricks UI or via the CLI.

### Using the Databricks UI (recommended)

1. In your Databricks workspace, open **Catalog** (Catalog Explorer).
2. Click the plus icon (+) and select **Create a connection**.
3. Enter a **Connection name**.
   Choose **PostgreSQL** as the connection type.
4. For Auth type, select `Username and password`.
5. Enter your Neon connection details (from the **Connect** button on your Neon project dashboard):
   - **Host**: your Neon host (e.g. `ep-cool-darkness-123456.us-east-2.aws.neon.tech`)
   - **Port**: 5432
   - **Database**: your Neon database name
   - **User**: `databricks_replication` (or the replication role you created).
   - **Password**: the password for that role. You can obtain the password from the **Connect** modal on the Neon project dashboard.
6. Create the connection.
7. On the **Catalog basics** page, test your connection. You will need to provide the name of your PostgreSQL database.
8. Click next to grant catalog access. Specify the users, groups, and service principals that have privileges on this catalog. Additionally, set up workspace-catalog bindings to isolate user data access.

### Using the Databricks CLI (alternative)

```bash
export CONNECTION_NAME="neon_postgresql_connection"
export DB_HOST="ep-cool-darkness-123456.us-east-2.aws.neon.tech"
export DB_PORT="5432"
export DB_DATABASE="dbname"
export DB_USER="databricks_replication"
export DB_PASSWORD="your_secure_password"

databricks connections create --json "{
  \"name\": \"${CONNECTION_NAME}\",
  \"connection_type\": \"POSTGRESQL\",
  \"options\": {
    \"host\": \"${DB_HOST}\",
    \"port\": \"${DB_PORT}\",
    \"database\": \"${DB_DATABASE}\",
    \"user\": \"${DB_USER}\",
    \"password\": \"${DB_PASSWORD}\"
  }
}"
```

## Step 3: Create the Lakeflow Connect gateway and ingestion pipeline

The Lakeflow PostgreSQL connector uses two pipelines:

- **Gateway pipeline**: Connects to Neon via the Unity Catalog connection, continuously extracts snapshot and CDC data using logical replication, and writes raw data into a staging volume in Unity Catalog.
- **Ingestion pipeline**: Reads from the staging volume and applies changes into destination streaming tables in your target catalog and schema.

### Create the gateway and pipeline in the Databricks UI

1. In the Lakehouse sidebar, click **Data ingestion**.
2. On **Add data**, under Databricks connectors, select **PostgreSQL**.
3. **Connection**: Choose the PostgreSQL connection you created (e.g. `neon_postgresql_connection`), then click **Next**.
4. **Ingestion setup**:
   - Select **Change data capture**.
   - **Ingestion pipeline name**: e.g. `neon_to_lakehouse_ingestion`.
   - **Event log catalog and schema**: Choose where the pipeline event log will be stored.
   - (Optional) Turn **Auto full refresh for all tables** on if you want the pipeline to automatically fix certain schema or log issues via full refreshes.
   - **Gateway name**: e.g. `neon_postgresql_gateway`.
   - **Staging catalog and schema**: Choose where the staging volume for CDC data will live.
   - Click **Create pipeline and continue**.
5. **Source (select tables)**: Databricks introspects Neon via the connection. Select the tables to replicate (e.g. `public.playing_with_neon`). Optionally set a custom **Destination name** per table or configure **History tracking** (SCD type 2). Click **Next**.
6. **Destination**: Choose the Unity Catalog catalog and schema that will hold the replicated Delta tables. Click **Next**.
7. **Database setup (Neon replication config)**: If requested, for each source Neon database, set:
   - **Replication slot name**: `databricks_slot`
   - **Publication name**: `databricks_publication`
     These must match the slot and publication you created in Neon. This step may not be necessary if you have only one replication slot. Optionally, click `Validate` to ensure your database setup is correct. This may take a few minutes. Issues are reported if encountered.
8. **Schedules and notifications** (optional): Set how often the ingestion pipeline runs (e.g. every 5 or 15 minutes) and add email notifications for failures or successful runs.
9. Click **Save and run pipeline** to start the first full snapshot and CDC extraction.

The gateway runs continuously on classic compute to keep up with Neon's WAL stream. The ingestion pipeline runs on serverless compute on the schedule you define.

### Alternative: Declarative Automation Bundles or CLI

If you use code-defined infrastructure, the Databricks PostgreSQL ingestion documentation includes sample bundle YAML and CLI JSON for the gateway and pipeline. Use your `neon_postgresql_connection`, `slot_name`: `databricks_slot`, `publication_name`: `databricks_publication`, and the appropriate source catalog, schema, and table names.

## Step 4: Monitor and maintain the pipeline

- Use the pipeline details page in Databricks to monitor row counts and status (e.g. Upserted and Deleted counts per run).
- Keep the gateway running continuously to avoid WAL buildup on Neon.
- Periodically check replication slots on Neon and [drop unused slots](/docs/guides/logical-replication-manage#remove-a-replication-slot) if you delete pipelines; Databricks does not drop slots automatically.

Databricks recommends limiting each ingestion pipeline to roughly 250 tables or fewer for best performance.

## Step 5: Verify the replication in Databricks

After the initial run completes (full snapshot and any CDC):

1. In your Databricks workspace, open **SQL Editor**.
2. Query the replicated table. For example, if you wrote into catalog `workspace` and schema `public`:

```sql
SELECT * FROM workspace.public.playing_with_neon LIMIT 10;
```

Replace `workspace` with your Unity Catalog name, `public` with the destination schema you chose, and `playing_with_neon` with the destination table name (same as source or the custom name you set). You should see rows from your Neon table in the Delta table.

## Notes and limitations (Lakeflow Connect PostgreSQL)

- **Primary only**: The connector does not support logical replication from read replicas or standbys. Always point Lakeflow Connect at the Neon primary.
- **Authentication**: Username and password only; no IAM-based auth for the PostgreSQL connector.
- **Replication slots**: The gateway must run continuously to prevent WAL bloat. Replication slots are not removed when you delete a pipeline; drop them explicitly in Neon.
- **Replica identity**: Each replicated table must have `REPLICA IDENTITY` set to `DEFAULT` or `FULL` as appropriate.
- **Scale**: Keep each pipeline to about 250 tables or fewer for best performance; there is no hard row or column limit per table.
- **Neon compatibility**: The connector supports PostgreSQL 13+ on various managed and self-hosted sources. Neon is a managed Postgres service that exposes a standard primary with logical replication; validate in a non-production environment and coordinate with Databricks Support for mission-critical use.

For adding tables, monitoring lag, and cleaning up slots, see Databricks' [Maintain PostgreSQL ingestion pipelines](https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/postgresql-maintenance) documentation and [Logical replication in Neon](/docs/guides/logical-replication-neon).

## References

**Databricks**

- [Configure PostgreSQL for ingestion into Databricks](https://docs.databricks.com/en/ingestion/lakeflow-connect/postgresql/configure-postgresql.html) (Lakeflow Connect)
- [Ingest data from PostgreSQL](https://docs.databricks.com/en/ingestion/lakeflow-connect/postgresql/ingest-postgresql.html) (Lakeflow Connect PostgreSQL pipeline)
- [PostgreSQL connector FAQs](https://docs.databricks.com/en/ingestion/lakeflow-connect/postgresql/faq.html)
- [PostgreSQL connector limitations](https://docs.databricks.com/en/ingestion/lakeflow-connect/postgresql/limitations.html)

**Neon**

- [Logical replication in Neon](/docs/guides/logical-replication-neon)
- [Logical replication commands](/docs/guides/logical-replication-manage)

**PostgreSQL**

- [Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)
- [Publications](https://www.postgresql.org/docs/current/logical-replication-publication.html)

<NeedHelp/>
