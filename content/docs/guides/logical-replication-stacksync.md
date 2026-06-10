---
title: Replicate data with Stacksync
subtitle: Learn how to replicate data from Neon with Stacksync
summary: >-
  Stacksync connects a Neon Postgres database to CRMs, ERPs, and other
  destinations via real-time one-way or two-way sync, using Postgres logical
  replication (wal_level=logical) as the change data capture method. Use this
  guide when you need to sync Neon table data to a Stacksync-supported connector
  without a third-party ETL tool. Each synced table must have a single-column
  auto-generated primary key, and you must use a direct connection string (no
  connection pooler) when configuring the Postgres source.
enableTableOfContents: true
isDraft: false
updatedOn: '2026-06-05T17:20:32.620Z'
---

Neon's logical replication feature allows you to replicate data from your Neon Postgres database to external destinations.

[Stacksync](https://www.stacksync.com/) connects databases with CRMs, ERPs, and other systems using real-time, two-way sync. In this guide, you will configure Stacksync to replicate data from your Neon Postgres database to a [supported destination](https://www.stacksync.com/connectors).

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

The following CLI command creates a role. To view the CLI documentation for this command, see [Neon CLI commands — roles](/docs/reference/cli-roles)

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
7. In the role creation dialog, specify a role name, such as `replication_user`.
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

<Admonition type="important">
Stacksync requires every table you sync to have a single-column, auto-generated primary key (for example, a `serial` integer or a `uuid`). Tables with composite primary keys, no primary key, or a primary key without a default value will not appear in Stacksync. See [Stacksync Postgres connector requirements](https://docs.stacksync.com/two-way-sync/connectors/postgres).
</Admonition>

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
1. Enter your Neon database connection details. Click **Connect** on your **Project Dashboard**, select the replication role you created earlier (not the default `neondb_owner` role), and click **Copy snippet**. Use a direct connection string; the hostname must not include `-pooler`. Logical replication is not compatible with connection poolers.

1. If you have disabled **Allow traffic via the public internet** under **Networking** in Neon's **Settings**, select **I confirm I have allowlisted these Stacksync IPs on my side** in Stacksync, and copy the IP addresses into your trusted IP addresses in Neon's settings under **Networking**.
1. In Stacksync, click **Next**.
1. Enter a name for **Connection Name**.
1. Click **Create**.

## Create a connection to your destination in Stacksync

Skip this step if you already have a destination connection configured in Stacksync.

1. Log in to your [Stacksync](https://www.stacksync.com/) account.
1. On the **All Resources** page, click **Create Resource**.
1. Under **Jump right in, create a resource**, click **Connections**.
1. Select the connector for your destination from one of [Stacksync's connectors](https://www.stacksync.com/connectors).
1. Follow the prompt in the **Configure connection** popup.
1. If you have disabled public internet access in Neon, allowlist the Stacksync IPs as described in the [Create a Postgres connection in Stacksync](#create-a-postgres-connection-in-stacksync) section above.
1. In Stacksync, click **Next**.
1. Enter a name for **Connection Name**.
1. Click **Create**.

   <Admonition type="tip">
   There are in-depth connection setup guides on [Stacksync's connector docs](https://docs.stacksync.com/two-way-sync/connectors).
   </Admonition>

## Create a sync

Skip this step if you already have a sync configured.

1. Log in to your [Stacksync](https://www.stacksync.com/) account.
1. On the **All Resources** page, click **Create Resource**.
1. Under **Jump right in, create a resource**, click **Syncs**.
1. Enter a **Sync Name**.
1. Select **Postgres** and choose the saved connection you created in the [Create a Postgres connection in Stacksync](#create-a-postgres-connection-in-stacksync) section.
1. On the schema screen, click the **Postgres** connection and select **Logical replication** under **Change Data Capture Method**.

   ![Stacksync Logical Replication](/docs/guides/stacksync-logical-replication.png)

1. Click one of the apps you have created a connection for in the [Create a connection to your destination in Stacksync](#create-a-connection-to-your-destination-in-stacksync) section.
1. Click **Link Tables**.
1. Select a table you would like to sync under **Postgres**.
1. Select a table you would like to sync the data to under your destination.
1. Select if you would like the sync to be [one-way or two-way](https://www.stacksync.com/data-sync/two-way-vs-one-way-sync).
1. Repeat from the previous step for any additional tables you would like to link.
1. Click **Map Columns** to configure which columns to sync and the sync direction for each. Stacksync auto-maps columns by default; select or deselect columns as needed. See [Stacksync's two-way sync docs](https://docs.stacksync.com/two-way-sync/features/two-way-sync) for details on field selection and sync direction.
1. Click **Create**.
1. On the next page, turn on the sync by clicking the toggle in the top right.
1. Optionally, update the **Data sync frequency** under **Settings**.

## References

- [Stacksync Generic PostgreSQL Setup Guide](https://docs.stacksync.com/two-way-sync/connectors/postgres)

<NeedHelp/>
