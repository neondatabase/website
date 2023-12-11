---
title: Replicate data to Materialize
subtitle: Learn how to replicate data from Neon to Materialize
enableTableOfContents: true
isDraft: true
---

In this guide, you will learn how to how to replicate data from Neon with Airbyte.

## Set up a connector

### Step 1: Create a dedicated read-only Postgres user

These steps create a dedicated read-only user for replicating data. Alternatively, you can use an existing Postgres user in your database.

The following commands will create a new user:

```sql
CREATE USER <user_name> PASSWORD 'your_password_here';
```

Provide this user with read-only access to relevant schemas and tables. Re-run this command for each schema you expect to replicate data from:

```sql
GRANT USAGE ON SCHEMA <schema_name> TO <user_name>;
GRANT SELECT ON ALL TABLES IN SCHEMA <schema_name> TO <user_name>;
ALTER DEFAULT PRIVILEGES IN SCHEMA <schema_name> GRANT SELECT ON TABLES TO <user_name>;
```

### Step 2: Create a new Postgres source in Airbyte UI

From your Airbyte Cloud or Airbyte Open Source account, select Sources from the left navigation bar, search for Postgres, then create a new Postgres source.

To fill out the required information:

1. Enter the hostname, port number, and name for your Postgres database. You can obtain these details from your Neon Connection string, which you'll find in the **Connection Details** widget on the Dashboard of your Neon project.
2. You may optionally opt to list each of the schemas you want to sync. These are case-sensitive, and multiple schemas may be entered. By default, `public` is the only selected schema.
3. Enter the username and password you created in Step 1.
4. Select an SSL mode. You will most frequently choose require or verify-ca. Both of these always require encryption. verify-ca also requires certificates from your Postgres database. See here to learn about other SSL modes and SSH tunneling.
5. Select Standard (xmin) from available replication methods. This uses the xmin system column to reliably replicate data from your database.
If your database is particularly large (> 500 GB), you will benefit from configuring your Postgres source using logical replication (CDC).

Step 3: (Airbyte Cloud Only) Allow inbound traffic from Airbyte IPs.
If you are on Airbyte Cloud, you will always need to modify your database configuration to allow inbound traffic from Airbyte IPs. You can find a list of all IPs that need to be allowlisted in our Airbyte Security docs.

Now, click Set up source in the Airbyte UI. Airbyte will now test connecting to your database. Once this succeeds, you've configured an Airbyte Postgres source!

## Step 3: (Airbyte Cloud Only) Allow inbound traffic from Airbyte IPs.

If you are on Airbyte Cloud, and you are using the IP Allow feature in None to limit IP address that can connect to Neon, you will always to allow inbound traffic from Airbyte IPs. You can find a list of all IPs that need to be allowlisted in our [Airbyte Security docs](https://docs.airbyte.com/operating-airbyte/security). For information about configuring allowed IPs in Neon, see [Configure IP Allow]().

Now, click **Set up source** in the Airbyte UI. Airbyte will now test connecting to your database. Once this succeeds, you've configured an Airbyte Postgres source!

## Step 4: Configure your Postgres source using CDC

After successfully creating a source, these are the additional steps required to configure your Postgres source using CDC:

Provide additional REPLICATION permissions to read-only user
Enable logical replication in Neon
Create a replication slot on your Postgres database
Create publication and replication identities for each Postgres table
Enable CDC replication in the Airbyte UI

### Step 1: Provide additional permissions to read-only user

