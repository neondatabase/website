---
title: Replicate data to Snowflake with Airbyte
subtitle: Learn how to replicate data from Neon to Snowflake with Airbyte
enableTableOfContents: true
isDraft: false
updatedOn: '2024-08-07T21:36:52.655Z'
---

Neon's logical replication feature allows you to replicate data from your Neon Postgres database to external destinations. In this guide, you will learn how to define your Neon Postgres database as a data source in Airbyte so that you can stream data to Snowflake.

[Airbyte](https://airbyte.com/) is an open-source data integration platform that moves data from a source to a destination system. Airbyte offers a large library of connectors for various data sources and destinations.

[Snowflake](https://www.snowflake.com/) is a cloud-based data warehousing and analytics platform designed to handle large volumes of data. Snowflake allows businesses to store, process, and analyze data from various sources.

## Prerequisites

- A source [Neon project](/docs/manage/projects#create-a-project) with a database containing the data you want to replicate. If you need some data to play with, you run the following statements from the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or an SQL client such as [psql](/docs/connect/query-with-psql-editor) to create a table with sample data:

  ```sql shouldWrap
  CREATE TABLE IF NOT EXISTS playing_with_neon(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);
  INSERT INTO playing_with_neon(name, value)
  SELECT LEFT(md5(i::TEXT), 10), random() FROM generate_series(1, 10) s(i);
  ```

- An [Airbyte account](https://airbyte.com/)
- A [Snowflake account](https://www.snowflake.com/)

## Enable logical replication in Neon

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

## Create a Postgres role for replication

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

## Create a replication slot

Airbyte requires a dedicated replication slot. Only one source should be configured to use this replication slot.

Airbyte uses the `pgoutput` plugin in Postgres for decoding WAL changes into a logical replication stream. To create a replication slot called `airbyte_slot` that uses the `pgoutput` plugin, run the following command on your database using your replication role:

```sql
SELECT pg_create_logical_replication_slot('airbyte_slot', 'pgoutput');
```

`airbyte_slot` is the name assigned to the replication slot. You will need to provide this name when you set up your Airbyte source.

<Admonition type="important">
To prevent storage bloat, **Neon automatically removes _inactive_ replication slots after a period of time if there are other _active_ replication slots**. If you have or intend on having more than one replication slot, please see [Unused replication slots](/docs/guides/logical-replication-neon#unused-replication-slots) to learn more.
</Admonition>

## Create a publication

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
   CREATE PUBLICATION airbyte_publication FOR TABLE <table_name, table_name, table_name>;
   ```

   Alternatively, you can create a publication for all tables:

   ```sql
   CREATE PUBLICATION airbyte_publication FOR ALL TABLES;
   ```

   The publication name is customizable. Refer to the [Postgres docs](https://www.postgresql.org/docs/current/logical-replication-publication.html) if you need to add or remove tables from your publication.

<Admonition type="note">
The Airbyte UI currently allows selecting any table for Change Data Capture (CDC). If a table is selected that is not part of the publication, it will not be replicated even though it is selected. If a table is part of the publication but does not have a replication identity, the replication identity will be created automatically on the first run if the Postgres role you use with Airbyte has the necessary permissions.
</Admonition>

## Create a Postgres source in Airbyte

1. From your Airbyte Cloud account, select **Sources** from the left navigation bar, search for **Postgres**, and then create a new Postgres source.
2. Enter the connection details for your Neon database. You can get these details from your Neon connection string, which you'll find in the **Connection Details** widget on the **Dashboard** of your Neon project.
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

If you are on Airbyte Cloud, and you are using Neon's **IP Allow** feature to limit IP addresses that can connect to Neon, you will need to allow inbound traffic from Airbyte's IP addresses. You can find a list of IPs that need to be allowlisted in the [Airbyte Security docs](https://docs.airbyte.com/operating-airbyte/security). For information about configuring allowed IPs in Neon, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow).

### Complete the source setup

To complete your source setup, click **Set up source** in the Airbyte UI. Airbyte will test the connection to your database. Once this succeeds, you've successfully configured an Airbyte Postgres source for your Neon database.

## Configure Snowflake as a destination

To complete your data integration setup, you can now add Snowflake as your destination.

### Prerequisites

- A Snowflake account with the `ACCOUNTADMIN` role. If you're using a company account, you may need to contact your Snowflake administrator to set one up for you.

### Set up Airbyte entities in Snowflake

To set up the Snowflake destination connector, you first need to create Airbyte entities in Snowflake (a warehouse, database, schema, user, and role) with the `OWNERSHIP` permission to write data to Snowflake.

You can use the following script in a new [Snowflake worksheet](https://docs.snowflake.com/en/user-guide/ui-worksheet) to create the entities. This script is provided as part of [Airbyte's Snowflake connector setup guide](https://docs.airbyte.com/integrations/destinations/snowflake#setup-guide).

<Admonition type="note">
If you want, you can edit the script to change the password to a more secure password and to change the names of other resources. If you do rename entities, make sure to follow [Sbowflake identifier requirements](https://docs.snowflake.com/en/sql-reference/identifiers-syntax).
</Admonition>

```sql
-- set variables (these need to be uppercase)
set airbyte_role = 'AIRBYTE_ROLE';
set airbyte_username = 'AIRBYTE_USER';
set airbyte_warehouse = 'AIRBYTE_WAREHOUSE';
set airbyte_database = 'AIRBYTE_DATABASE';
set airbyte_schema = 'AIRBYTE_SCHEMA';

-- set user password
set airbyte_password = 'password';

begin;

-- create Airbyte role
use role securityadmin;
create role if not exists identifier($airbyte_role);
grant role identifier($airbyte_role) to role SYSADMIN;

-- create Airbyte user
create user if not exists identifier($airbyte_username)
password = $airbyte_password
default_role = $airbyte_role
default_warehouse = $airbyte_warehouse;

grant role identifier($airbyte_role) to user identifier($airbyte_username);

-- change role to sysadmin for warehouse / database steps
use role sysadmin;

-- create Airbyte warehouse
create warehouse if not exists identifier($airbyte_warehouse)
warehouse_size = xsmall
warehouse_type = standard
auto_suspend = 60
auto_resume = true
initially_suspended = true;

-- create Airbyte database
create database if not exists identifier($airbyte_database);

-- grant Airbyte warehouse access
grant USAGE
on warehouse identifier($airbyte_warehouse)
to role identifier($airbyte_role);

-- grant Airbyte database access
grant OWNERSHIP
on database identifier($airbyte_database)
to role identifier($airbyte_role);

commit;

begin;

USE DATABASE identifier($airbyte_database);

-- create schema for Airbyte data
CREATE SCHEMA IF NOT EXISTS identifier($airbyte_schema);

commit;

begin;

-- grant Airbyte schema access
grant OWNERSHIP
on schema identifier($airbyte_schema)
to role identifier($airbyte_role);

commit;
```

### Set up Snowflake as a destination

To set up a new destination:

1. Navigate to Airbyte.
2. Select **New destination**.
3. Select the Snowflake connector.
4. Create the destination by filling in the required fields. You can authenticate using username/password or key pair authentication. We'll authenticate via username/password.

| Field         | Description                                                                                                                              | Example                                              |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **Host**      | The host domain of the Snowflake instance (must include the account, region, cloud environment, and end with `snowflakecomputing.com`).  | `<accountname>.us-east-2.aws.snowflakecomputing.com` |
| **Role**      | The role you created for Airbyte to access Snowflake.                                                                                    | `AIRBYTE_ROLE`                                       |
| **Warehouse** | The warehouse you created for Airbyte to sync data into.                                                                                 | `AIRBYTE_WAREHOUSE`                                  |
| **Database**  | The database you created for Airbyte to sync data into.                                                                                  | `AIRBYTE_DATABASE`                                   |
| **Schema**    | The default schema used as the target schema for all statements issued from the connection that do not explicitly specify a schema name. | -                                                    |
| **Username**  | The username you created to allow Airbyte to access the database.                                                                        | `AIRBYTE_USER`                                       |
| **Password**  | The password associated with the username.                                                                                               | -                                                    |

When you're finished filling in the required fields, click **Set up destination**.

![Airbyte Snowflake destination](/docs/guides/airbyte_snowflake_destination.png)

## Set up a connection

In this step, you'll set up a connection between your Neon Postgres source and your Snowflake destination.

To set up a new destination:

1. Navigate to Airbyte.
2. Select **New connection**.
3. Select the existing Postgres source you created earlier.
4. Select the existing Snowflake destination you created earlier.
5. Select **Replicate source** as the sync mode.
6. Click **Next**.
7. On the **Configure connection** dialog, you can accept the defaults or modify the settings according to your requirements.
8. Click **Finish & sync** to complete the setup.

Your first sync may take a few moments.

## Verify the replication

After the sync operation is complete, you can verify the replication by navigating to Snowflake, opening your Snowflake project, navigating to a worksheet, and querying your database to view the replicated data. For example, if you've replicated the `playing_with_neon` example table, you can run a `SELECT * FROM PLAYING_WITH_NEON;` query to view the replicated data.

![Airbyte Snowflake verify replication](/docs/guides/airbyte_snowflake_verify.png)

## References

- [Setting up the Airbyte destination connector](https://docs.airbyte.com/integrations/destinations/snowflake)
- [Airbyte: Add a destination](https://docs.airbyte.com/using-airbyte/getting-started/add-a-destination)
- [Airbyte: Set up a connection](https://docs.airbyte.com/using-airbyte/getting-started/set-up-a-connection)
- [Airbyte: How to load data from Postgres to Snowflake destination](https://airbyte.com/how-to-sync/postgresql-to-snowflake-data-cloud)
- [What is an ELT data pipeline?](https://airbyte.com/blog/elt-pipeline)
- [Logical replication - PostgreSQL documentation](https://www.postgresql.org/docs/current/logical-replication.html)
- [Publications - PostgreSQL documentation](https://www.postgresql.org/docs/current/logical-replication-publication.html)

<NeedHelp/>
