---
title: Replicate data with Stacksync
subtitle: Learn how to replicate data from Neon with Stacksync
summary: >-
  Step-by-step guide for defining a Neon Postgres database as a data source in
  Stacksync to enable data replication to supported destinations.
enableTableOfContents: true
isDraft: false
updatedOn: '2026-05-11T00:32:14.276Z'
---

Neon's logical replication feature allows you to replicate data from your Neon Postgres database to external destinations.

[Stacksync](https://www.stacksync.com/) is an integration platform designed for real-time, two-way data synchronization. Stacksync extracts your data and loads it into your data destination.

In this guide, you will learn how to define a Neon Postgres database as a data source in Stacksync so that you can replicate data to one or more of Stacksync's supported destinations.

## Prerequisites

- A [Stacksync account](https://www.stacksync.com/)
- A [Neon account](https://console.neon.tech/)
- Read the [important notices about logical replication in Neon](/docs/guides/logical-replication-neon#important-notices) before you begin

<Admonition type="important" title="Compute and billing">
Replication keeps compute active (no [scale to zero](/docs/introduction/scale-to-zero)) while subscribers are connected, which can increase your bill. See [Important notices about logical replication in Neon](/docs/guides/logical-replication-neon#important-notices).
</Admonition>

## Prepare your Neon database

### Enable logical replication in Neon

<Admonition type="important">
Enabling logical replication modifies the Postgres `wal_level` configuration parameter, changing it from `replica` to `logical` for all databases in your Neon project. Once the `wal_level` setting is changed to `logical`, it cannot be reverted. Enabling logical replication also restarts all computes in your Neon project, meaning active connections will be temporarily dropped before automatically reconnecting.
</Admonition>

To enable logical replication in Neon:

1. Select your project in the Neon Console.
2. On the Neon **Dashboard**, select **Settings**.
3. Select **Logical Replication**.
4. Click **Enable** to enable logical replication.

You can verify that logical replication is enabled by running the following query from the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor):

```sql
SHOW wal_level;
 wal_level
-----------
 logical
```

### Create a Postgres role for replication

It is recommended that you create a dedicated Postgres role for replicating data. The role must have the `REPLICATION` privilege. The default Postgres role created with your Neon project and roles created using the Neon CLI, Console, or API are granted membership in the [neon_superuser](/docs/manage/roles#the-neonsuperuser-role) role, which has the required `REPLICATION` privilege.

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
3. Select **Branches**.
4. Select the branch where you want to create the role.
5. Select the **Roles & Databases** tab.
6. Click **Add Role**.
7. In the role creation dialog, specify a role name.
8. Click **Create**. The role is created, and you are provided with the password for the role.

</TabItem>

<TabItem>

The following Neon API method creates a role. To view the API documentation for this method, refer to the [Neon API reference](https://api-docs.neon.tech/reference/createprojectbranchrole).

```bash
curl 'https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/roles' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
  "role": {
    "name": "replication_user"
  }
}' | jq
```

> Replace `{project_id}` and `{branch_id}` with your actual Neon project and branch IDs, and set the `NEON_API_KEY` environment variable with your Neon API key.

</TabItem>

</Tabs>

### Grant schema access to your Postgres role

If your replication role does not own the schemas and tables you are replicating from, make sure to grant access. For example, the following commands grant access to all tables in the `public` schema to Postgres role `replication_user`:

```sql
GRANT USAGE ON SCHEMA public TO replication_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO replication_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO replication_user;
```

Granting `SELECT ON ALL TABLES IN SCHEMA` instead of naming the specific tables avoids having to add privileges later if you add tables to your publication.

### Create a publication

Create the Postgres publication. Include all tables you want to replicate as part of the publication:

```sql
CREATE PUBLICATION stacksync_pub FOR TABLE <tbl1, tbl2, tbl3>;
```

The publication name is customizable. Refer to the [Postgres docs](https://www.postgresql.org/docs/current/logical-replication-publication.html) if you need to add or remove tables from your publication.

## Create a Postgres connection in Stacksync

1. Log in to your [Stacksync](https://www.stacksync.com/) account.
1. On the **All Resources** page, click **Create Resource**.
1. Under **Jump right in, create a resource**, click **Connections**.
1. Select **Postgres**.
1. Enter the connection details for your Neon database. You can find your Neon database connection details by clicking the **Connect** button on your **Project Dashboard** to open the **Connect to your database** popup. Select the role you created earlier and click **Copy snippet**.
1. If you have disabled **Allow traffic via the public internet** under **Networking** in Neon's **Settings**, tick the box in Stacksync for **I confirm I have allowlisted these Stacksync IPs on my side**, and copy the IP addresses into your trusted IP addresses in Neon's settings under **Networking**.
1. In Stacksync, click **Next**.
1. Enter a name for **Connection Name**.
1. Click **Create**.

   <Admonition type="important">
   Use a **direct connection** to your compute endpoint, not a pooled connection. Logical replication requires a persistent connection and is not compatible with connection poolers. When copying your connection string from Neon, make sure it does not include `-pooler` in the hostname. For more information about connection pooling and when to use direct connections, see [Connection pooling](/docs/connect/connection-pooling).
   </Admonition>

## (optional) Create a connection to your destination in Stacksync

1. Log in to your [Stacksync](https://www.stacksync.com/) account.
1. On the **All Resources** page, click **Create Resource**.
1. Under **Jump right in, create a resource**, click **Connections**.
1. Select the connector for your destination from one of [Stacksync's connectors](https://www.stacksync.com/connectors).
1. Follow the prompt in the **Configure connection** popup.
1. If you have disabled **Allow traffic via the public internet** under **Networking** in Neon's **Settings**, tick the box in Stacksync for **I confirm I have allowlisted these Stacksync IPs on my side**, and copy the IP addresses into your trusted IP addresses in Neon's settings under **Networking**.
1. In Stacksync, click **Next**.
1. Enter a name for **Connection Name**.
1. Click **Create**.

   <Admonition type="tip">
   There are in-depth connection setup guides on [Stacksync's connector docs](https://docs.stacksync.com/two-way-sync/connectors).
   </Admonition>

## (optional) Create a sync

1. Log in to your [Stacksync](https://www.stacksync.com/) account.
2. On the **All Resources** page, click **Create Resource**.
3. Under **Jump right in, create a resource**, click **Syncs**.
4. Enter a **Sync Name**.
5. Click **Postgres** and select the saved connection you created in the [Create a Postgres connection in Stacksync step](#create-a-postgres-connection-in-stacksync).
6. Click one of the apps you have created a connection for in the [(optional) Create a destination step](#optional-create-a-destination).
7. Click **Link Tables**.
8. Select a table you would like to sync under **Postgres**.
9. Select a table you would like to sync the data to under your destination.
10. Select if you would like the sync to be [one-way or two-way](https://www.stacksync.com/data-sync/two-way-vs-one-way-sync).
11. Repeat from step 8 for any additional tables you would like to link.
12. Click **Map Columns**.
13. Click **Show columns**.
14. Click **Sync more columns** if there are more fields you want to sync.
15. Remove any fields you do not want to sync.
16. Set the direction you want to sync each field. If you have selected two-way sync, either set one-way sync for read-only fields or remove them.
17. Repeat from step 13 to configure the columns for other tables if desired.
18. Click **Create**.
19. On the next page, turn on the sync by clicking the toggle in the top right.
20. (optional) Update the **Data sync frequency** under **Settings**.

## References

- [Stacksync Generic PostgreSQL Setup Guide](https://docs.stacksync.com/two-way-sync/connectors/postgres)

<NeedHelp/>
