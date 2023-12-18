---
title: Replicate data with Confluent (Kafka) and Debezium
subtitle: Learn how to replicate data from Neon with Confluent (Kafka) and Debezium
enableTableOfContents: true
isDraft: true
---

Neon's logical replication feature allows you to replicate data from your Neon Postgres database to external destinations.

Confluent Cloud is a fully managed, cloud-native service for real-time data streaming, built on Apache Kafka. It allows you to stream data from many different sources, including Postgres, and build apps that consume messages from an Apache Kafka cluster.

In this guide, you will learn how to how to stream data from a Neon Postgres database to Confluent Cloud. You will use the [PostgreSQL CDC Source Connector (Debezium) for Confluent Cloud](https://docs.confluent.io/cloud/current/connectors/cc-postgresql-cdc-source-debezium.html) to read Change Data Capture (CDC) events from the Write-Ahead Log (WAL) of your Neon database in real time. The connector will write events to a Kafka stream and auto-generate a Kafka topic. The connector performs an initial snapshot of the table and then streams any futue change events.

<Admonition type="note">
Confluent Cloud Connectors can be set up using the [Confluent Cloud UI](https://confluent.cloud/home) or the [Confluent command-line interface (CLI)](https://docs.confluent.io/confluent-cli/current/overview.html). This guide uses the Confluent Cloud UI.
</Admonition>

## Prerequistes

- A [Confluent Cloud](https://www.confluent.io/confluent-cloud) account
- A [Neon account](https://console.neon.tech/)

## Enable logical replication in Neon

<Admonition type="important">
Enabling logical replication modifies the PostgreSQL `wal_level` configuration parameter, changing it from `replica` to `logical` for all databases in your Neon project. Once the `wal_level` setting is changed to `logical`, it cannot be reverted.

Since logical replication requires more detailed logging to the Write-Ahead Log (WAL) for write transactions, it consumes additional storage.
</Admonition>

To enable logical replication in Neon:

1. Select your project in the [Neon Console](https://console.neon.tech/app/projects).
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

## Create a publication

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

<Admonition type="note">
In addition to creating a publication for a specific table, Postgres allows you to create a publication for all tables within your database by using `CREATE PUBLICATION all_tables_publication FOR ALL TABLES` syntax. This command is particularly useful when you need to replicate the entire database. Furthermore, PostgreSQL allows for fine-tuning your publications. For instance, you can create a publication for a subset of tables or configure publications to only replicate certain types of data changes, such as inserts, updates, or deletes. This level of customization ensures that your replication strategy aligns precisely with your data management and integration requirements.
</Admonition>

## Create a replication slot

The Debezium connector requires a dedicated replication slot. Only one source should be configured to use this replication slot.

To create a replication slot called `debezium`, run the following command on your database using your dedicated `REPLICATION` role:

```sql
SELECT pg_create_logical_replication_slot('debezium', 'pgoutput');
```

- `debezium` is the name assigned to the replication slot. You will need to provide the slot name when you set up your source connector in Confluent. 
- `pgoutput` is the logical decoder plugin used in this example. Neon supports both `pgoutput` and `wal2json` decoders. 


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

## Set up a Confluent Cloud cluster

1. Sign in to Confluent Cloud at https://confluent.cloud.
2. Click **Add cluster**.
3. On the **Create cluster** page, for the **Basic cluster**, select **Begin configuration**.
4. On the **Region/zones** page, choose a cloud provider, a region, and select a single availability zone.
5. Select **Continue**.
6. Specify your payment details. You can select **Skip payment** for now if you're just trying out the setup.
7. Specify a cluster name, review the configuration and cost information, and select **Launch cluster**. In this exmaple, we use `cluster_neon` as the cluster name.
    It may take a few minutes to provision your cluster. After the cluster has provisioned, the **Cluster Overview** page displays.

## Set up a source connector

To set up a Postgres CDC source connector for Confluent Cloud:

1. On the **Cluster Overview** page, under **Set up connector**, select **Get started**.
2. On the **Connector Plaugins** page, enter `Postgres` into the search field.
3. Select the **Postgres CDC Source** connector. This is the [PostgreSQL CDC Source Connector (Debezium) for Confluent Cloud](https://docs.confluent.io/cloud/current/connectors/cc-postgresql-cdc-source-debezium.html). This connector will take a snapshot of the existing data and then monitor and record all subsequent row-level changes to that data.

4. On the **Add Postgres CDC Source connector** page:

    - Select the type of access you want to grant the connector. For the purpose of this guide, we'll select **Global acess**, but if you are configuring a production pipeline, Confluent recommends **Granular access**.
    - Click the **Generate API key & download** button to generate an API key and secret that you connector can use to communicate with your Kafka cluster. Your applications will need this API key and secret to make requests to your Kafka cluster. Store the API key and secret somewhere safe. This is the only time you’ll see the secret.

    Click **Continue**.

5. On the **Add Postgres CDC Source connector** page:

    - Add the connection details for your Neon database. You can obtain the required details from your Neon connection string, which you acn find in the **Connection Details** widget on the Neon **Dashboard**. Your connection string will look something like this:

        ```text
        postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
        ```

        Enter the details for **your connection string** into the source connector fields. Based on the sample connection string above, the values would be specified as shown below. Your values will differ.

        - **Database name**: `dbname` (Your database name will likely differ)
        - **Database server name**: `neon_server` (This is user-specified value that will represent the logical name of your Postgres server. Confluent uses this name as a namespace in all Kafka topic topic and schema names. It is also used Avro schema namespaces if the Avro data format is used. Kafka topic will be created with the prefix `database.server.name`. Only alphanumeric characters, underscores, hyphens, and dots are allowed.)
        - **SSL mode**: `require`
        - **Database hostname** `ep-cool-darkness-123456.us-east-2.aws.neon.tech` (Note that this portion of a Neon connection string forms the database hostname)
        - **Database port**: `5432` (Neon uses the default `5432` Postgres port)
        - **Database username**: `alex`
        - **Database Password** `AbC123dEf`

    - If you are using Neon's **IP Allow** feature to limit IP addresses that can connect to Neon, you will need to add the Confluent cluster static IP addresses to your allowlist. For information about configuring allowed IPs in Neon, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow). If you do not use Neon's **IP Allow** feature, you can skip this step.

    Click **Continue**.

6. Under **Output Kafka record value format**, select an output format for Kafka record values. The default is `JSON`, so we'll use that format in this guide. Other supported values include `AVRO`, `JSON_SR`, and `PROTOBUF`, which are scehma-based message formats. If you use any of these, you will also need to configure a [Confluent Cloud Schema Registry](https://docs.confluent.io/cloud/current/sr/index.html).

    Expand **Show advanced configurations** drop-down and set the following values:
    
    - Under **Advanced confguration**
      - Ensure **Slot name** is set to to `debezium`. This is the name of the replication slot you create earlier.
      - Set the **Publication name** to `users_publication`, which is the name of the publication you created earlier.
      - Set **Publication auto-create** mode to `disabled`. You've already created your publication.
    - Under Database details, set **Tables included** to `public.users`, which is the name of the Neon database table you are replicating from.
    
        While you're here, review the other advanced options and use the tool tips to understand what they are. It will help to understand what they are if you configure a more advanced setup later.

    Click **Continue**.

7. For **Connector sizing**, accept the default for the maximum number of [Tasks](https://docs.confluent.io/platform/current/connect/index.html#tasks). Tasks can be scaled up at a later time for additional throughput capacity. 

    Click **Continue**.

8. Adjust your **Connector name** if desired, and review your **Connector configuration**, which is provided in `JSON` format, as shown below. We'll use the default connector name in this guide.

    ```JSON
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

To verify that events now being published to a Kafka stream in Confluent:

1. Insert a row into your `users` table from the Neon SQL Editor or a `psql` client connect to your Neon database. For example:

    ```sql
    -- Insert a new user
    INSERT INTO users (username, email) VALUES ('Zhang', 'zhang@example.com');
    ```

2. In Confluent Cloud, navigate to your cluster (`cluster_neon` in this guide) and select **Topics** > **neon_server.public.users** > **Messages**. Your newly inserted data should appear at the top of the list of messages.

## Next steps

With events now being published to a Kafka stream in Confluent, you can now set up a connection between Confluent and a supported consumer. This is quite simple using a Confluent Connector. For example, you can stream data to [Databricks](https://docs.confluent.io/cloud/current/connectors/cc-databricks-delta-lake-sink/databricks-aws-setup.html#), [Snowflake](https://docs.confluent.io/cloud/current/connectors/cc-snowflake-sink.html), or one of the many other supported consumers. Refer to the Confluent documentation for connector-specific instructions.

## References

- [Quick Start for Confluent Cloud](https://docs.confluent.io/cloud/current/get-started/index.html#cloud-quickstart)

<NeedHelp/>