---
title: Replicate data with Airbyte
subtitle: Learn how to replicate data from Neon with Airbyte
enableTableOfContents: true
isDraft: true
---

Neon's logical replication feature, which is currently in **Beta**, allows for replication of data to external subscribers. With Airbyte, you can define a Neon database as a replication source and replicate data to any of numerous destinations supported by Airbyte.  

## Enable logical replication in Neon

<Admonition type="important">
Enabling logical replication in Neon permanently modifies the PostgreSQL `wal_level` configuration parameter, changing it from `replica` to `logical` for all compute endpoints in your Neon project, which means it's enabled for al branches and databases. This change increases the amount of data written to the WAL (Write-Ahead Logging), which will increase your storage consumption. It's important to note that once the `wal_level` setting is changed to `logical`, it cannot be reverted.
</Admonition>

To enable logical replication for your Neon project:

1. Select your project in the Neon console.
2. On the Neon **Dashboard**, select **Settings**.
3. Select **Beta**.
4. Click **Enable** to enable logical replication.

The new setting is applied to your compute endpoint the next time is restarts. To force an immediate restart, refer to [Restart a compute endpoint](/docs/manage/endpoints/).

You can verify that Neon is enabled for logical replication by running the following query from the the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or from an SQL client such as [psql](/docs/connect/query-with-psql-editor). The wal_level should be set to `logical`.

```sql
SHOW wal_level;
 wal_level 
-----------
 logical
```

### Create a dedicated Postgres role in Neon

Create a dedicated Postgres role in Neon for replicating data. The Neon role must be created using the Neon Console, CLI, or API. These roles are granted the membership in the [neon_superuser](/docs/manage/roles#the-neonsuperuser-role) role, which has the required `REPLICATION` privilege. Alternatively, you can use an existing role. The default role created with each Neon project has [neon_superuser](/docs/manage/roles#the-neonsuperuser-role) privileges.

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


Make sure this users has read-only access to relevant schemas and tables. Re-run this command for each schema you expect to replicate data from:

```sql
GRANT USAGE ON SCHEMA <schema_name> TO <role_name>;
GRANT SELECT ON ALL TABLES IN SCHEMA <schema_name> TO <role_name>;
ALTER DEFAULT PRIVILEGES IN SCHEMA <schema_name> GRANT SELECT ON TABLES TO <role_name>;
```

### Create a replication slot in your Postgres database

Airbyte requires a replication slot configured only for its use. Only one source should be configured that uses this replication slot.

For this step, Airbyte requires use of the `pgoutput` plugin in Postgres. To create a replication slot called `airbyte_slot` that uses the `pgoutput` plugin, run the following command on your database using your dedicated `REPLICATION` role:

```sql
SELECT pg_create_logical_replication_slot('airbyte_slot', 'pgoutput');
```

The output of this command will include the name of the replication slot (`airbyte_slot`) to fill into the Airbyte source setup page. 

### Create publication and replication identities for each Postgres table

For each table you want to replicate with CDC, follow the steps below:

1. Add the replication identity (the method of distinguishing between rows) for each table you want to replicate:

    ```sql
    ALTER TABLE tbl1 REPLICA IDENTITY DEFAULT;
    ```

    In rare cases, if your tables use data types that support TOAST or have very large field values, consider instead using replica identity type full: 

    ```sql
    ALTER TABLE tbl1 REPLICA IDENTITY FULL;
    ```

2. Create the Postgres publication. You should include all tables you want to replicate as part of the publication:

    ```sql
    CREATE PUBLICATION airbyte_publication FOR TABLE <tbl1, tbl2, tbl3>;
    ```

    The publication name is customizable. Refer to the Postgres docs if you need to add or remove tables from your publication in the future.


<Admonition type="note">
The Airbyte UI currently allows selecting any tables for CDC. If a table is selected that is not part of the publication, it will not be replicated even though it is selected. If a table is part of the publication but does not have a replication identity, that replication identity will be created automatically on the first run if the Airbyte user has the necessary permissions.
</Admonition>

### Create a new Postgres source in Airbyte UI

1. From your Airbyte Cloud or Airbyte Open Source account, select **Sources** from the left navigation bar, search for **Postgres**, then create a new Postgres source.
2. Enter the connection details for the Neon database that will your replication source. You can obtain your Neon connection string from the **Connection Details** widget on the **Dashboard** of your Neon project. For example, given a connection string like this:

    ```bash
    postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
    ```

    You would enter the details in the Airbyte **Create a source** dialog as shown:

    - **Host**: ep-cool-darkness-123456.us-east-2.aws.neon.tech
    - **Port**: 5432
    - **Database Name**: dbname
    - **Username**: alex
    - **Password**: AbC123dEf

    ![Airbyte Create a source](/docs/guides/airbyte_create_source.png)

3. Under **Optional fileds**, you can list each of the schemas you want to sync. These are case-sensitive, and multiple schemas may be entered. By default, `public` is the only selected schema.
4. Select an SSL mode. You will most frequently choose `require` or `verify-ca`. Both of these always require encryption. The `verify-ca` mode  requires a certificate. Refer to [Connect securely](/docs/connect/connect-securely) for information about the location of certificate files that you can use with Neon.
5. Select **Logical Replication (CDC)** from available replication methods, and enter the replication slot and publication you just created.
6. In the **Replication Slot** field, enter the name of the replication slot you created previosly (`airbyte_slot`).
7. In the **Publication** field, enter the name of the publication you created previously (`airbyte_publication`).
    ![Airbyte advanced fields](/docs/guides/airbyte_cdc_advanced_fields.png)

### Allow inbound traffic from Airbyte IPs (Airbyte Cloud Only)

If you are on Airbyte Cloud, and you are using Neon's **IP Allow** feature in to limit IP address that can connect to Neon, you will need to allow inbound traffic from Airbyte's IP addresses. You can find a list of IPs that need to be allowlisted in the [Airbyte Security docs](https://docs.airbyte.com/operating-airbyte/security). For information about configuring allowed IPs in Neon, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow).

### Complete the source set up

To complete your source setup, click **Set up source** in the Airbyte UI. Airbyte will test connecting to your database. Once this succeeds, you've successfully configured an Airbyte Postgres source for your Neon database.

### Define a destination and configure a connection

To complete you replication setup, you can now add a destination from one of Airbyte's 30+ supported destinations and then create a connection. Refer to the Airbyte documentation for instructions.

![Airbyte destinations](/docs/guides/airbyte_destinations.png)