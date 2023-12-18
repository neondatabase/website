---
title: Replicate data with Airbyte
subtitle: Learn how to replicate data from Neon with Airbyte
enableTableOfContents: true
isDraft: true
---

Neon's logical replication feature allows you to replicate data from your Neon Postgres database to external destinations. 

[Airbyte](https://airbyte.com/) is an open-source data integration platform that moves data from a source system to a destination system. Airbyte offers a large library of connectors for various data sources and destinations.

In this guide, you will learn how to define your Neon Postgres database as a data source in Airbyte so that you can stream data to one or more of Airbyte's many supported destinations.

## Prerequisites

- An [Airbyte account](https://airbyte.com/)
- A [Neon account](https://console.neon.tech/)

## Enable logical replication in Neon

<Admonition type="important">
Enabling logical replication modifies the PostgreSQL `wal_level` configuration parameter, changing it from `replica` to `logical` for all databases in your Neon project. Once the `wal_level` setting is changed to `logical`, it cannot be reverted.

Since logical replication requires more detailed logging to the Write-Ahead Log (WAL) for write transactions, it consumes additional storage.
</Admonition>

To enable logical replication in Neon:

1. Select your project in the Neon console.
2. On the Neon **Dashboard**, select **Settings**.
3. Select **Beta**.
4. Click **Enable** to enable logical replication.

The new setting is applied the next time your compute restarts. By default, the compute that runs your Neon Postgres intance automatically suspends after five minutes of inactivity and restarts on the next access. To force an immediate restart, refer to [Restart a compute endpoint](/docs/manage/endpoints/).

You can verify that logical replication is enabled by running the following query from the the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor):

```sql
SHOW wal_level;
 wal_level 
-----------
 logical
```

## Grant schema access to your Postgres role

The role you use for replication requires the `REPLICATION` privilege. Currently, only the default Postgres role created with your Neon project has this privilege and it cannot be granted to other roles. This is the role that is named for the email, Google, GitHub, or partner account you signed up with. For example, if you signed up as `alex@example.com`, you should have a default Postgres uers named `alex`. You can verify your user has this privilege by running the follow query: 

```sql
SELECT rolname, rolreplication 
FROM pg_roles 
WHERE rolname = '<role_name>';
```

If the schemas and tables you are replicating from are not owned by this role, make sure to grant this role access. Run these commands for each schema you expect to replicate data from:

```sql
GRANT USAGE ON SCHEMA <schema_name> TO <role_name>;
GRANT SELECT ON ALL TABLES IN SCHEMA <schema_name> TO <role_name>;
ALTER DEFAULT PRIVILEGES IN SCHEMA <schema_name> GRANT SELECT ON TABLES TO <role_name>;
```

Granting `SELECT ON ALL TABLES IN SCHEMA` instead of naming the specific tables avoids having to add privileges later if you add tables to your publication in the future.

## Create a replication slot

Airbyte requires a dedicated replication slot. Only one source should be configured to use this replication slot.

Airbyte uses the `pgoutput` plugin in Postgres for decoding WAL changes into a logical replication stream. To create a replication slot called `airbyte_slot` that uses the `pgoutput` plugin, run the following command on your database using your dedicated `REPLICATION` role:

```sql
SELECT pg_create_logical_replication_slot('airbyte_slot', 'pgoutput');
```

`airbyte_slot` is the name assigned to the replication slot. You will need to provide this name when you set up your Airbyte source. 

## Create a publication

Perform the following steps for each table you want to replicate data from:

1. Add the replication identity (the method of distinguishing between rows) for each table you want to replicate:

    ```sql
    ALTER TABLE tbl1 REPLICA IDENTITY DEFAULT;
    ```

    In rare cases, if your tables use data types that support [TOAST](https://www.postgresql.org/docs/current/storage-toast.html) or have very large field values, consider using `REPLICA IDENTITY FULL` instead: 

    ```sql
    ALTER TABLE tbl1 REPLICA IDENTITY FULL;
    ```

2. Create the Postgres publication. Include all tables you want to replicate as part of the publication:

    ```sql
    CREATE PUBLICATION airbyte_publication FOR TABLE <tbl1, tbl2, tbl3>;
    ```

    The publication name is customizable. Refer to the [Postgres docs](https://www.postgresql.org/docs/current/logical-replication-publication.html) if you need to add or remove tables from your publication in the future.


<Admonition type="note">
The Airbyte UI currently allows selecting any tables for Change Data Capture (CDC). If a table is selected that is not part of the publication, it will not be replicated even though it is selected. If a table is part of the publication but does not have a replication identity, the replication identity will be created automatically on the first run if the Postgres role you defined for use with Airbyte has the necessary permissions.
</Admonition>

## Create a Postgres source in Airbyte

1. From your Airbyte Cloud account, select **Sources** from the left navigation bar, search for **Postgres**, and then create a new Postgres source.
2. Enter the connection details for your Neon database. You can get these details from your Neon connection string, which you'll find in the **Connection Details** widget on the **Dashboard** of your Neon project. 
    For example, given a connection string like this:

    <CodeBlock shouldWrap>

    ```bash
    postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
    ```

    </CodeBlock>

    Enter the details in the Airbyte **Create a source** dialog as shown below. Your values will differ.

    - **Host**: ep-cool-darkness-123456.us-east-2.aws.neon.tech
    - **Port**: 5432
    - **Database Name**: dbname
    - **Username**: alex
    - **Password**: AbC123dEf

    ![Airbyte Create a source](/docs/guides/airbyte_create_source.png)

3. Under **Optional fields**, list the schemas you want to sync. Schema names are case-sensitive, and multiple schemas may be entered. By default, `public` is the only selected schema.
4. Select an SSL mode. You will most frequently choose `require` or `verify-ca`. Both of these options always require encryption. The `verify-ca` mode requires a certificate. Refer to [Connect securely](/docs/connect/connect-securely) for information about the location of certificate files you can use with Neon.
5. Under **Advanced**:
    
    - Select **Logical Replication (CDC)** from available replication methods.
    - In the **Replication Slot** field, enter the name of the replication slot you created previosly: `airbyte_slot`.
    - In the **Publication** field, enter the name of the publication you created previously: `airbyte_publication`.
    ![Airbyte advanced fields](/docs/guides/airbyte_cdc_advanced_fields.png)

## Allow inbound traffic

If you are on Airbyte Cloud, and you are using Neon's **IP Allow** feature in to limit IP address that can connect to Neon, you will need to allow inbound traffic from Airbyte's IP addresses. You can find a list of IPs that need to be allowlisted in the [Airbyte Security docs](https://docs.airbyte.com/operating-airbyte/security). For information about configuring allowed IPs in Neon, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow).

## Complete the source setup

To complete your source setup, click **Set up source** in the Airbyte UI. Airbyte will test the connection to your database. Once this succeeds, you've successfully configured an Airbyte Postgres source for your Neon database.

## Configure a destination

To complete your data integration setup, you can now add one of Airbyte's many supported destinations, such as Snowflake, BigQuery, or Kafka, to name a few. After configuring a destination, you'll need to set up a connection between your Neon source database and your chosen destination. Refer to the Airbyte documentation for instructions:

- [Add a destination](https://docs.airbyte.com/using-airbyte/getting-started/add-a-destination)
- [Set up a connection](https://docs.airbyte.com/using-airbyte/getting-started/set-up-a-connection)

## References

- [What is an ELT data pipeline?](https://airbyte.com/blog/elt-pipeline)
- [Logical replication - PostgreSQL documentation](https://www.postgresql.org/docs/current/logical-replication.html)
- [Publications - PostgreSQL documentation](https://www.postgresql.org/docs/current/logical-replication-publication.html)

<NeedHelp/>