---
title: Replicate data to Materialize
subtitle: Learn how to replicate data from Neon to Materialize
enableTableOfContents: true
isDraft: true
---

Neon's logical replication feature allows for replication of data to external subscribers such as [Materialize](https://materialize.com/).

## Enable logical replication in Neon

<Admonition type="important">
Enabling logical replication in Neon permanently changes the PostgreSQL `wal_level` configuration parameter setting from `replica` to `logical` for all databases in your Neon project. This change increases the amount of data written to the WAL (Write-Ahead Logging), which adds to your storage consumption. Once the `wal_level` setting is changed to `logical`, it cannot be reverted.
</Admonition>

To enable logical replication:

1. Select your project in the Neon console.
2. On the Neon **Dashboard**, select **Settings**.
3. Select **Beta**.
4. Click **Enable** to enable logical replication.

The new setting is applied to your compute endpoint the next time is restarts. To force an immediate restart, refer to [Restart a compute endpoint](/docs/manage/endpoints/).

You can verify that Neon is enabled for logical replication by running the following query from the the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor):

```sql
SHOW wal_level;
 wal_level 
-----------
 logical
```



## Create a publication

Once logical replication is enabled, the next step is to create a publication with the tables that you want to replicate to Materialize. You’ll also need a user for Materialize with sufficient privileges to manage replication.

For each table that you want to replicate to Materialize, set the replica identity to FULL:

```sql
ALTER TABLE <table1> REPLICA IDENTITY FULL;
```

```sql
ALTER TABLE <table2> REPLICA IDENTITY FULL;
```

`REPLICA IDENTITY FULL` ensures that the replication stream includes the previous data of changed rows, in the case of `UPDATE` and `DELETE` operations. This setting enables Materialize to ingest PostgreSQL data with minimal in-memory state. However, you should expect increased disk usage in your PostgreSQL database.

Create a publication with the tables you want to replicate:

For specific tables:

```sql
CREATE PUBLICATION mz_source FOR TABLE <table1>, <table2>;
```

For all tables in the database:

```sql
CREATE PUBLICATION mz_source FOR ALL TABLES;
```

The `mz_source` publication will contain the set of change events generated from the specified tables, and will later be used to ingest the replication stream.

Be sure to include only the tables you need. If the publication includes additional tables, Materialize will waste resources on ingesting and then immediately discarding the data.

## Create a Postgres role for replication

It is recommended that you create a dedicated Postgres role for replication. The role must have the `REPLICATION` privilege. Roles created using the Neon Console, CLI, or API are granted the membership in the [neon_superuser](/docs/manage/roles#the-neonsuperuser-role) role, which has the required `REPLICATION` privilege.

<Tabs labels={["Neon Console", "CLI", "API"]}>

<TabItem>

To create a role in the Neon Console:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. Select a project.
3. Select **Roles**.
4. Select the branch where you want to create the role.
4. Click **New Role**.
5. In the role creation dialog, specify a role name. The length of the role name is limited to 63 bytes.
6. Click **Create**. The role is created and you are provided with the password for the role.

</TabItem>

<TabItem>

The following CLI command creates a role. To view the CLI documentation for this command, see [Neon CLI commands — roles](https://api-docs.neon.tech/reference/createprojectbranchrole)

```bash
neonctl roles create --name <role>
```

</TabItem>

<TabItem>

The following Neon API method creates a role. To view the API documentation for this method, refer to the [Neon API reference](/docs/reference/cli-roles).

```bash
curl 'https://console.neon.tech/api/v2/projects/hidden-cell-763301/branches/br-blue-tooth-671580/roles' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer $NEON_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
  "role": {
    "name": "alex"
  }
}' | jq
```

</TabItem>

</Tabs>

## Grant schema access to the Postgres role

Grant your dedicated Postgres replication role read-only access to the relevant schemas and tables. Re-run this command for each schema you expect to replicate data from:

```sql
GRANT USAGE ON SCHEMA <schema_name> TO <role_name>;
GRANT SELECT ON ALL TABLES IN SCHEMA <schema_name> TO <role_name>;
ALTER DEFAULT PRIVILEGES IN SCHEMA <schema_name> GRANT SELECT ON TABLES TO <role_name>;
```

Once connected to your database, Materialize takes an initial snapshot of the tables in your publication. `SELECT` privileges are required for this initial snapshot.

The `SELECT` prvilege on all tables in the schema instead of naming the specific tables is required If you expect to add tables to your publication later.

## Allow inbound traffic from Materialize IPs

If you are using Neon's **IP Allow** feature in to limit IP address that can connect to Neon, you will need to allow inbound traffic from Materize IP addresses. 

1. In the psql shell connected to Materialize, find the static egress IP addresses for the Materialize region you are running in:

    ```sql
    SELECT * FROM mz_egress_ips;
    ```

2. Add the IPs to your Neon IP Allow list. For information about configuring allowed IPs in Neon, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow).


## Create an ingestion cluster

In Materialize, a [cluster](https://materialize.com/docs/get-started/key-concepts/#clusters) is an isolated environment, similar to a virtual warehouse in Snowflake. When you create a cluster, you choose the size of its compute resource allocation based on the work you need the cluster to do, whether ingesting data from a source, computing always-up-to-date query results, serving results to clients, or a combination.

In this case, you’ll create 1 new cluster containing 1 medium replica for ingesting source data from your PostgreSQL database.

From a `psql` shell connected to Materialize or the Material SQL Shell, use the `CREATE CLUSTER` command to create the new cluster:

```sql
CREATE CLUSTER ingest_postgres SIZE = 'medium';
```

Materialize recommends starting with a medium [size](https://materialize.com/docs/sql/create-cluster/#size) replica or larger. This helps Materialize more quickly process the initial snapshot of the tables in your publication. Once the snapshot is finished, you’ll right-size the cluster.

## Start ingesting data

Now that you’ve configured your database network and created an ingestion cluster, you can connect Materialize to your PostgreSQL database and start ingesting data. 

1. In the psql shell connected to Materialize, use the `CREATE SECRET` command to securely store the password for the materialize PostgreSQL user you created earlier:

    ```sql
    CREATE SECRET pgpass AS '<PASSWORD>';
    ```

2. Use the `CREATE CONNECTION` command to create a connection object with access and authentication details for Materialize to use:

    ```sql
    CREATE CONNECTION pg_connection TO POSTGRES (
    HOST '<host>',
    PORT 5432,
    USER 'materialize',
    PASSWORD SECRET pgpass,
    SSL MODE 'require',
    DATABASE '<database>'
    );
    ```

Replace `<host>` with your Neon hostname. 

Replace `<database>` with the name of the database containing the tables you want to replicate to Materialize.

3. Use the `CREATE SOURCE` command to connect Materialize to your Neon Postgres database and start ingesting data from the publication you created earlier:

        ```sql
        CREATE SOURCE mz_source
        IN CLUSTER ingest_postgres
        FROM POSTGRES CONNECTION pg_connection (PUBLICATION 'mz_source')
        FOR ALL TABLES;
        ```

To ingest data from specific schemas or tables in your publication, use `FOR SCHEMAS (<schema1>,<schema2>)` or `FOR TABLES (<table1>, <table2>)` instead of `FOR ALL TABLES`.

After source creation, you can handle upstream schema changes for specific replicated tables using the `ALTER SOURCE...{ADD | DROP} SUBSOURCE` syntax.

## Check the ingestion status

Before it starts consuming the replication stream, Materialize takes a snapshot of the relevant tables in your publication. Until this snapshot is complete, Materialize won’t have the same view of your data as your PostgreSQL database.

In this step, you’ll first verify that the source is running and then check the status of the snapshotting process.

1. Back in the `psql` shell connected to Materialize, use the `mz_source_statuses` table to check the overall status of your source:

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

        For each subsource, make sure the status is running. If you see stalled or failed, there’s likely a configuration issue for you to fix. Check the error field for details and fix the issue before moving on. Also, if the status of any subsource is starting for more than a few minutes, contact our team.


2. Once the source is running, use the `mz_source_statistics` table to check the status of the initial snapshot:

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

After the snapshotting phase, Materialize starts ingesting change events from the PostgreSQL replication stream. For this work, Materialize generally performs well with an xsmall replica, so you can resize the cluster accordingly.

1. Still in the `psql` shell connected to Materialize, use the `ALTER CLUSTER` command to downsize the cluster to `xsmall`:

    ```sql
    ALTER CLUSTER ingest_postgres SET (SIZE 'xsmall');
    ```

Behind the scenes, this command adds a new xsmall replica and removes the medium replica.

2. Use the `SHOW CLUSTER REPLICAS` command to check the status of the new replica:

    ```sql
    SHOW CLUSTER REPLICAS WHERE cluster = 'ingest_postgres';
        cluster     | replica |  size  | ready
    -----------------+---------+--------+-------
    ingest_postgres | r1      | xsmall | t
    (1 row)
    ```

3. Going forward, you can verify that your new replica size is sufficient as follows:

    1. In Materialize, get the replication slot name associated with your PostgreSQL source from the `mz_internal.mz_postgres_sources` table:

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
    
    1. In PostgreSQL, check the replication slot lag, using the replication slot name from the previous step:

        ```sql
        SELECT
            pg_size_pretty(pg_current_wal_lsn() - confirmed_flush_lsn)
            AS replication_lag_bytes
        FROM pg_replication_slots
        WHERE slot_name = '<slot_name>';
        ```

        The result of this query is the amount of data your PostgreSQL cluster must retain in its replication log because of this replication slot. Typically, this means Materialize has not yet communicated back to PostgreSQL that it has committed this data. A high value can indicate that the source has fallen behind and that you might need to scale up your ingestion cluster.

## Next steps

With Materialize ingesting your PostgreSQL data into durable storage, you can start exploring the data, computing real-time results that stay up-to-date as new data arrives, and serving results efficiently.

- Explore your data with `SHOW SOURCES` and `SELECT`.
- Compute real-time results in memory with `CREATE VIEW` and `CREATE INDEX` or in durable storage with `CREATE MATERIALIZED VIEW`.
- Serve results to a PostgreSQL-compatible SQL client or driver with `SELECT` or `SUBSCRIBE` or to an external message broker with `CREATE SINK`.
- Check out the [tools and integrations](https://materialize.com/docs/integrations/) supported by Materialize.