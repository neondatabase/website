---
title: Create an automatic audit trail with Bemi
subtitle: Learn how to replicate data from Neon with Bemi
enableTableOfContents: true
isDraft: false
---

<LRNotice/>

[Bemi](https://bemi.io/) is an open-source solution that plugs into PostgreSQL and ORMs to track database changes automatically. It unlocks robust context-aware audit trails and time travel querying inside your application.

Designed with simplicity and non-invasiveness in mind, Bemi doesn't require any alterations to your existing database structure. It operates in the background, empowering you with data change tracking features.

In this guide, we'll show you how to replicate data from Neon with Bemi to create an automatic audit trail.

## Prerequisites

- A [Bemi account](https://bemi.io/).
- A [Neon account](https://console.neon.tech/).

## Enable logical replication in Neon

<Admonition type="important">
Enabling logical replication modifies the Postgres `wal_level` configuration parameter, changing it from replica to logical for all databases in your Neon project. Once the `wal_level` setting is changed to logical, it cannot be reverted. Enabling logical replication also restarts all computes in your Neon project, meaning active connections will be dropped and have to reconnect.
</Admonition>

To enable logical replication in Neon:

1. Select your project in the Neon Console.
2. On the Neon **Dashboard**, select **Project settings**.
3. Select **Beta**.
4. Click **Enable** to enable logical replication.

You can verify that logical replication is enabled by running the following query from the [Neon SQL Editor](https://neon.tech/docs/get-started-with-neon/query-with-neon-sql-editor):

```sql
SHOW wal_level;
wal_level
-----------
logical
```

## Create a Postgres role for replication

It is recommended that you create a dedicated Postgres role for replicating data. The role must have the `REPLICATION` privilege. The default Postgres role created with your Neon project and roles created using the Neon Console, CLI, or API are granted membership in the [neon_superuser](https://neon.tech/docs/manage/roles#the-neonsuperuser-role) role, which has the required `REPLICATION` privilege.

<Tabs labels={["Neon Console", "CLI", "API"]}>

<TabItem>

To create a role in the Neon Console:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. Select a project.
3. Select **Roles**.
4. Select the branch where you want to create the role.
4. Click **New Role**.
5. In the role creation dialog, specify a role name.
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

If you won’t be using the default [neon_superuser](https://neon.tech/docs/manage/roles#the-neonsuperuser-role) to connect to Bemi or your replication role does not own the schemas and tables you are tracking, make sure to grant access. Run these commands in your Neon SQL Editor for each schema:

```sql
GRANT USAGE ON SCHEMA public TO <role_name>;

-- Grant SELECT access to tables for selective tracking
GRANT SELECT ON ALL TABLES IN SCHEMA public TO <role_name>;

-- Grant SELECT access to new tables created in the future for selective tracking
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO <role_name>;
```

## Create a replication slot and publication

If you won’t be using the default [neon_superuser](https://neon.tech/docs/manage/roles#the-neonsuperuser-role) role to connect to Bemi, run these commands to create a Postgres publication and add the required replication identity:

```sql
-- Create "bemi" PUBLICATION to enable logical replication
CREATE PUBLICATION bemi FOR ALL TABLES;

-- Create a procedure to set REPLICA IDENTITY FULL for tables to track the "before" state on DB row changes
CREATE OR REPLACE PROCEDURE _bemi_set_replica_identity() AS $$ DECLARE current_tablename TEXT;
BEGIN
  FOR current_tablename IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('ALTER TABLE %I REPLICA IDENTITY FULL', current_tablename);
  END LOOP;
END $$ LANGUAGE plpgsql;
-- Call the created procedure
CALL _bemi_set_replica_identity();
```

## Create a Postgres connection to Bemi

1. Create a [new database connection](https://dashboard.bemi.io/databases/source/new) by entering the connection details for your Neon database. You can get these details from your Neon connection string, which you'll find in the **Connection Details** widget on the **Dashboard** of your Neon project. For example, given a connection string like this:

    ```sql
    postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
    ```

    Enter the details in the **Connect PostgreSQL Database** dialog as shown below. Your values will differ.

    - **Host**: ep-cool-darkness-123456.us-east-2.aws.neon.tech
    - **Port**: 5432
    - **Database Name**: dbname
    - **Username**: alex
    - **Password**: AbC123dEf

    ![Bemi Connect PostgreSQL Database](/docs/guides/bemi_connect_postgres.png)

2. During the connection setup or any time after, you can configure the tables you want to track:

    ![Bemi Tracked Tables](/docs/guides/bemi_tracked_tables.png)

3. Please wait a few minutes while Bemi provisions the infrastructure. Once this succeeds, you’ve successfully configured a Bemi Postgres source for your Neon database.

## Allow inbound traffic

If you’re using Neon's IP Allow feature to limit IP addresses that can connect to Neon, you will need to allow inbound traffic from Bemi. [Contact Bemi](mailto:hi@bemi.io) to get the static IPs that need to be allowlisted. For information about configuring allowed IPs in Neon, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow).

 ## **References**

- [The ultimate guide to PostgreSQL data change tracking](https://blog.bemi.io/the-ultimate-guide-to-postgresql-data-change-tracking/)
- [Logical replication - PostgreSQL documentation](https://www.postgresql.org/docs/current/logical-replication.html)
- [Publications - PostgreSQL documentation](https://www.postgresql.org/docs/current/logical-replication-publication.html)
