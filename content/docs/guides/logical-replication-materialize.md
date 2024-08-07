---
title: Replicate data to Materialize
subtitle: Learn how to replicate data from Neon to Materialize
enableTableOfContents: true
isDraft: false
updatedOn: '2024-08-07T11:38:14.264Z'
---

Neon's logical replication feature allows you to replicate data from your Neon Postgres database to external destinations.

[Materialize](https://materialize.com/) is a data warehouse for operational workloads, purpose-built for low-latency applications. You can use it to process data at speeds and scales not possible in traditional databases, but without the cost, complexity, or development time of most streaming engines.

In this guide, you will learn how to stream data from your Neon Postgres database to Materialize using the Materialize [PostgreSQL source](https://materialize.com/docs/sql/create-source/postgres/).

## Prerequisites

- A [Materialize account](https://materialize.com/register/)
- A [Neon account](https://console.neon.tech/)
- Optionally, you can install the [psql](https://www.postgresql.org/docs/current/logical-replication.html) command line utility for running commands in both Neon and Materialize. Alternatively, you can run commands from the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) and Materialize **SQL Shell**, which require no installation or setup.

<Admonition type="important">
To prevent storage bloat, **Neon automatically removes _inactive_ replication slots after a period of time if there are other _active_ replication slots**. If you have or intend on having more than one replication slot, please see [Unused replication slots](/docs/guides/logical-replication-neon#unused-replication-slots) to learn more.
</Admonition>

## Enable logical replication

<Admonition type="important">
Enabling logical replication modifies the PostgreSQL `wal_level` configuration parameter, changing it from `replica` to `logical` for all databases in your Neon project. Once the `wal_level` setting is changed to `logical`, it cannot be reverted. Enabling logical replication also restarts all computes in your Neon project, meaning that active connections will be dropped and have to reconnect.
</Admonition>

To enable logical replication in Neon:

1. Select your project in the Neon Console.
2. On the Neon **Dashboard**, select **Settings**.
3. Select **Logical Replication**.
4. Click **Enable** to enable logical replication.

You can verify that logical replication is enabled by running the following query:

```sql
SHOW wal_level;
 wal_level
-----------
 logical
```

## Create a publication

After logical replication is enabled in Neon, the next step is to create a publication for the tables that you want to replicate to Materialize.

1. From a `psql` client connected to your Neon database or from the **Neon SQL Editor**, set the [replica identity](https://www.postgresql.org/docs/current/sql-altertable.html#SQL-ALTERTABLE-REPLICA-IDENTITY) to `FULL` for each table that you want to replicate to Materialize:

   ```sql
   ALTER TABLE <table1> REPLICA IDENTITY FULL;
   ```

   `REPLICA IDENTITY FULL` ensures that the replication stream includes the previous data of changed rows, in the case of `UPDATE` and `DELETE` operations. This setting allows Materialize to ingest Postgres data with minimal in-memory state.

2. Create a [publication](https://www.postgresql.org/docs/current/logical-replication-publication.html) with the tables you want to replicate:

   For specific tables:

   ```sql
   CREATE PUBLICATION mz_source FOR TABLE <table1>, <table2>;
   ```

   The `mz_source` publication will contain the set of change events generated from the specified tables and will later be used to ingest the replication stream.

   Be sure to include only the tables you need. If the publication includes additional tables, Materialize wastes resources on ingesting and then immediately discarding the data from those tables.

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
3. Select **Roles**.
4. Select the branch where you want to create the role.
5. Click **New Role**.
6. In the role creation dialog, specify a role name.
7. Click **Create**. The role is created, and you are provided with the password for the role.

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

## Allow inbound traffic

If you use Neon's **IP Allow** feature to limit IP addresses that can connect to Neon, you will need to allow inbound traffic from Materize IP addresses. If you are currently not limiting IP address access in Neon, you can skip this step.

1. From a `psql` client connected to Materialize or from the Materialize **SQL Shell**, run this command to find the static egress IP addresses for the Materialize region you are running in:

   ```sql
   SELECT * FROM mz_egress_ips;
   ```

2. In your Neon project, add the IPs to your **IP Allow** list, which you can find in your project's settings. For instructions, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow).

## Create an ingestion cluster

In Materialize, a [cluster](https://materialize.com/docs/get-started/key-concepts/#clusters) is an isolated environment, similar to a virtual warehouse in Snowflake. When you create a cluster, you choose the size of its compute resource allocation based on the work you need the cluster to do, whether ingesting data from a source, computing always-up-to-date query results, serving results to clients, or a combination.

In this case, you’ll create 1 new cluster containing 1 medium replica for ingesting source data from your Neon Postgres database.

From a `psql` client connected to Materialize or from the Materialize **SQL Shell**, run the `CREATE CLUSTER` command to create the new cluster:

```sql
CREATE CLUSTER ingest_postgres SIZE = 'medium';
```

Materialize recommends starting with a medium [size](https://materialize.com/docs/sql/create-cluster/#size) replica or larger. This helps Materialize quickly process the initial snapshot of the tables in your publication. Once the snapshot is finished, you can right-size the cluster.

## Start ingesting data

Now that you’ve configured your database network and created an ingestion cluster, you can connect Materialize to your Neon Postgres database and start ingesting data.

1. From a `psql` client connected to Materialize or from the Materialize **SQL Shell**, use the [CREATE SECRET](https://materialize.com/docs/sql/create-secret/) command to securely store the password for the Postgres role you created earlier:

   ```sql
   CREATE SECRET pgpass AS '<PASSWORD>';
   ```

   You can access the password for your Neon Postgres role from the **Connection Details** widget on the Neon **Dashboard**.

2. Use the [CREATE CONNECTION](https://materialize.com/docs/sql/create-connection/) command to create a connection object with access and authentication details for Materialize to use:

   ```sql
   CREATE CONNECTION pg_connection TO POSTGRES (
   HOST '<host>',
   PORT 5432,
   USER '<role_name>',
   PASSWORD SECRET pgpass,
   SSL MODE 'require',
   DATABASE '<database>'
   );
   ```

   You can find the connection details for your replication role in the **Connection Details** widget on the Neon **Dashboard**. A Neon connection string looks like this:

   ```text shouldWrap
   postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```

   - Replace `<host>` with your Neon hostname (e.g., `ep-cool-darkness-123456.us-east-2.aws.neon.tech`)
   - Replace `<role_name>` with the name of your Postgres role (e.g., `alex`)
   - Replace `<database>` with the name of the database containing the tables you want to replicate to Materialize (e.g., `dbname`)

3. Use the [CREATE SOURCE](https://materialize.com/docs/sql/create-source/) command to connect Materialize to your Neon Postgres database and start ingesting data from the publication you created earlier:

   ```sql
   CREATE SOURCE mz_source
   IN CLUSTER ingest_postgres
   FROM POSTGRES CONNECTION pg_connection (PUBLICATION 'mz_source')
   FOR ALL TABLES;
   ```

   <Admonition type="tip" title="Tips">
   - To ingest data from specific schemas or tables in your publication, you can use `FOR SCHEMAS (<schema1>,<schema2>)` or `FOR TABLES (<table1>, <table2>)` instead of `FOR ALL TABLES`.
   - After creating a source, you can incorporate upstream schema changes for specific replicated tables using the `ALTER SOURCE...{ADD | DROP} SUBSOURCE` syntax.
   </Admonition>

## Check the ingestion status

Before Materialize starts consuming a replication stream, it takes a snapshot of the tables in your publication. Until this snapshot is complete, Materialize won’t have the same view of your data as your Postgres database.

In this step, you’ll verify that the source is running and then check the status of the snapshotting process.

1.  From a `psql` client connected to Materialize or from the Materialize **SQL Shell**, use the [mz_source_statuses](https://materialize.com/docs/sql/system-catalog/mz_internal/#mz_source_statuses) table to check the overall status of your source:

        ```sql
        WITH
        source_ids AS
        (SELECT id FROM mz_sources WHERE name = 'mz_source')
        SELECT *
        FROM
        mz_internal.mz_source_statuses
            JOIN
            (
                SELECT referenced_object_id
                FROM mz_internal.mz_object_dependencies
                WHERE
                object_id IN (SELECT id FROM source_ids)
                UNION SELECT id FROM source_ids
            )
            AS sources
            ON mz_source_statuses.id = sources.referenced_object_id;
            ```

        For each subsource, make sure the status is running. If you see stalled or failed, there’s likely a configuration issue for you to fix. Check the error field for details and fix the issue before moving on. If the status of any subsource is starting for more than a few minutes, contact [Materialize support](https://materialize.com/docs/support/).

2.  Once the source is running, use the [mz_source_statistics](https://materialize.com/docs/sql/system-catalog/mz_internal/#mz_source_statistics) table to check the status of the initial snapshot:

        ```sql
        WITH
        source_ids AS
        (SELECT id FROM mz_sources WHERE name = 'mz_source')
        SELECT sources.object_id, bool_and(snapshot_committed) AS snapshot_committed
        FROM
        mz_internal.mz_source_statistics
            JOIN
            (
                SELECT object_id, referenced_object_id
                FROM mz_internal.mz_object_dependencies
                WHERE
                object_id IN (SELECT id FROM source_ids)
                UNION SELECT id, id FROM source_ids
            )
            AS sources
            ON mz_source_statistics.id = sources.referenced_object_id
        GROUP BY sources.object_id;
        object_id | snapshot_committed
        ----------|------------------
        u144     | t
        (1 row)
        ```

    Once `snapshot_commited` is `t`, move on to the next step. Snapshotting can take between a few minutes to several hours, depending on the size of your dataset and the size of the cluster replica you chose for your `ingest_postgres` cluster.

## Right-size the cluster

After the snapshotting phase, Materialize starts ingesting change events from the Postgres replication stream. For this work, Materialize generally performs well with an `xsmall` replica, so you can resize the cluster accordingly.

1.  From a `psql` client connected to Materialize or from the Materialize **SQL Shell**, use the [ALTER CLUSTER](https://materialize.com/docs/sql/alter-cluster/) command to downsize the cluster to `xsmall`:

    ```sql
    ALTER CLUSTER ingest_postgres SET (SIZE 'xsmall');
    ```

    Behind the scenes, this command adds a new `xsmall` replica and removes the `medium` replica.

2.  Use the [SHOW CLUSTER REPLICAS](https://materialize.com/docs/sql/show-cluster-replicas/) command to check the status of the new replica:

    ```sql
    SHOW CLUSTER REPLICAS WHERE cluster = 'ingest_postgres';
        cluster     | replica |  size  | ready
    -----------------+---------+--------+-------
    ingest_postgres | r1      | xsmall | t
    (1 row)
    ```

3.  Going forward, you can verify that your new replica size is sufficient as follows:

    a. From a `psql` client connected to Materialize or from the Materialize **SQL Shell**, get the replication slot name associated with your Postgres source from the [mz_internal.mz_postgres_sources](https://materialize.com/docs/sql/system-catalog/mz_internal/#mz_postgres_sources) table:

        ```sql
        SELECT
            d.name AS database_name,
            n.name AS schema_name,
            s.name AS source_name,
            pgs.replication_slot
        FROM
            mz_sources AS s
            JOIN mz_internal.mz_postgres_sources AS pgs ON s.id = pgs.id
            JOIN mz_schemas AS n ON n.id = s.schema_id
            JOIN mz_databases AS d ON d.id = n.database_id;
        ```

    b. From a `psql` client connected to your Neon database or from the **Neon SQL Editor**, check the replication slot lag, using the replication slot name from the previous step:

        ```sql
        SELECT
            pg_size_pretty(pg_current_wal_lsn() - confirmed_flush_lsn)
            AS replication_lag_bytes
        FROM pg_replication_slots
        WHERE slot_name = '<slot_name>';
        ```

        The result of this query is the amount of data your Postgres cluster must retain in its replication log because of this replication slot. Typically, this means Materialize has not yet communicated back to your Neon Postgres database that it has committed this data. A high value can indicate that the source has fallen behind and that you might need to scale up your ingestion cluster.

## Next steps

With Materialize ingesting your Postgres data into durable storage, you can start exploring the data, computing real-time results that stay up-to-date as new data arrives, and serving results efficiently.

- Explore your data with [SHOW SOURCES](https://materialize.com/docs/sql/show-sources) and [SELECT](https://materialize.com/docs/sql/select/).
- Compute real-time results in memory with [CREATE VIEW](https://materialize.com/docs/sql/create-view/) and [CREATE INDEX](https://materialize.com/docs/sql/create-index/) or in durable storage with [CREATE MATERIALIZED VIEW](https://materialize.com/docs/sql/create-materialized-view/).
- Serve results to a Postgres-compatible SQL client or driver with [SELECT](https://materialize.com/docs/sql/select/) or [SUBSCRIBE](https://materialize.com/docs/sql/subscribe/) or to an external message broker with [CREATE SINK](https://materialize.com/docs/sql/create-sink/).
- Check out the [tools and integrations](https://materialize.com/docs/integrations/) supported by Materialize.

<NeedHelp/>
