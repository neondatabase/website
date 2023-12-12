---
title: Replicate data with Airbyte
subtitle: Learn how to replicate data from Neon with Airbyte
enableTableOfContents: true
isDraft: true
---

Neon's logical replication feature, which is currently in **Beta**, allows for replication of data to external subscribers. With Airbyte, you can define a Neon database as a replication source and replicate data to any of Airbyte's over 40 supported destinations.  

## Enable logical replication in Neon

<Admonition type="important">
Enabling logical replication in Neon permanently modifies the PostgreSQL `wal_level` configuration parameter, changing it from `replica` to `logical` for all databases in your Neon project. This change increases the amount of data written to the WAL (Write-Ahead Logging), which will increase your storage consumption. It's important to note that once the `wal_level` setting is changed to `logical`, it cannot be reverted.
</Admonition>

To enable logical replication for your Neon project:

1. Select your project in the Neon console.
2. On the Neon **Dashboard**, select **Settings**.
3. Select **Replication**.
4. Click **Enable**.

After enabling logical replication in Neon, the next step is to set up a connector in Airbyte.

## Set up a connector

The first step is to configure a connector in Airbyte.

### Create a dedicated Postgres role in Neon

These steps create a dedicated Postgres role in Neon for replicating data. The Neon role must be created using the Neon Console, CLI, or API. Only roles created via these methods are granted the required `REPLICATION` privilege. 

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


Provide this user with read-only access to relevant schemas and tables. Re-run this command for each schema you expect to replicate data from:

```sql
GRANT USAGE ON SCHEMA <schema_name> TO <role_name>;
GRANT SELECT ON ALL TABLES IN SCHEMA <schema_name> TO <role_name>;
ALTER DEFAULT PRIVILEGES IN SCHEMA <schema_name> GRANT SELECT ON TABLES TO <role_name>;
```

### Step 2: Create a new Postgres source in Airbyte UI

From your Airbyte Cloud or Airbyte Open Source account, select **Sources** from the left navigation bar, search for Postgres, then create a new Postgres source.

To fill out the required information:

1. Enter the hostname, port number, and name for your Postgres database. You can obtain these details from your Neon connection string, which you'll find in the **Connection Details** widget on the **Dashboard** of your Neon project.
2. Optionally, list each of the schemas you want to sync. These are case-sensitive, and multiple schemas may be entered. By default, `public` is the only selected schema.
3. Enter the username and password for the dedicated Postgres user you created previously.
4. Select an SSL mode. You will most frequently choose `require` or `verify-ca`. Both of these always require encryption. The `verify-ca` mode  requires a certificate. Refer to [Connect securely](/docs/connect/connect-securely) for information about the location of certificate files  you can use with Neon.
5. Select **Standard (xmin)** from available replication methods. This uses the `xmin` system column to reliably replicate data from your database.

<Admonition type="note">
If your database is particularly large (> 500 GB), you will benefit from configuring your Postgres source using logical replication (CDC).
</Admonition>

## Step 3: (Airbyte Cloud Only) Allow inbound traffic from Airbyte IPs.

If you are on Airbyte Cloud, and you are using Neon's **IP Allow** feature in to limit IP address that can connect to Neon, you will need to allow inbound traffic from Airbyte's IP addresses. You can find a list of IPs that need to be allowlisted in the [Airbyte Security docs](https://docs.airbyte.com/operating-airbyte/security). For information about configuring allowed IPs in Neon, see [Configure IP Allow](/docs/manage/projects#ip-allow).

Now, click **Set up source** in the Airbyte UI. Airbyte will now test connecting to your database. Once this succeeds, you've successfully configured an Airbyte Postgres source for yoru Neon database.

## Step 4: Configure your Postgres source using CDC

After successfully creating a source, these are the additional steps required to configure your Postgres source using CDC:

Provide additional REPLICATION permissions to read-only user
Enable logical replication in Neon
Create a replication slot on your Postgres database
Create publication and replication identities for each Postgres table
Enable CDC replication in the Airbyte UI

### Step 1: Provide additional permissions to read-only user

To configure CDC for the Postgres source connector, grant `REPLICATION` permissions to the read-only user created you created previously.

```sql
ALTER USER <user_name> REPLICATION;
```

### Step 2: Create a replication slot on your Postgres database

Airbyte requires a replication slot configured only for its use. Only one source should be configured that uses this replication slot.

For this step, Airbyte requires use of the `pgoutput` plugin. To create a replication slot called `airbyte_slot` using pgoutput, run as the user with the newly granted `REPLICATION` role:

```sql
SELECT pg_create_logical_replication_slot('airbyte_slot', 'pgoutput');
```

The output of this command will include the name of the replication slot to fill into the Airbyte source setup page.

### Step 3: Create publication and replication identities for each Postgres table

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

NOTE
The Airbyte UI currently allows selecting any tables for CDC. If a table is selected that is not part of the publication, it will not be replicated even though it is selected. If a table is part of the publication but does not have a replication identity, that replication identity will be created automatically on the first run if the Airbyte user has the necessary permissions.


### Step 4: Enable CDC replication in Airbyte UI

In your Postgres source, change the replication mode to Logical Replication (CDC), and enter the replication slot and publication you just created.