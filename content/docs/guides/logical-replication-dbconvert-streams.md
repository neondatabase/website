---
title: Replicate data with DBConvert Streams
subtitle: Learn how to replicate data from Neon with DBConvert Streams
summary: >-
  DBConvert Streams reads changes from a Lakebase Postgres database using
  Postgres logical replication and applies them to MySQL, Postgres, and other
  destinations, with an optional initial snapshot before change data capture
  begins. Use this guide when you need continuous replication out of Neon
  without writing pipeline code. The replication role needs the REPLICATION
  privilege and SELECT on the replicated tables; DBConvert Streams creates the
  publication and the replication slot itself from the tables you select. Use a
  direct connection string with sslmode=require (no connection pooler) when
  configuring the Postgres source.
enableTableOfContents: true
isDraft: false
updatedOn: '2026-08-18T00:00:00.000Z'
---

Neon's logical replication feature allows you to replicate data from your Lakebase Postgres database to external destinations.

[DBConvert Streams](https://streams.dbconvert.com) captures row-level changes from Postgres through logical decoding. You run it yourself — as a desktop app on Windows, macOS, or Linux, or in Docker on a server — so the rows go from Neon straight to your destination without passing through a third-party service. Its SQL IDE is free and connects to Neon directly, so you can browse schemas and run queries before setting up any replication; the migration and CDC engine is the paid part.

In this guide, you will configure DBConvert Streams to replicate data from your Lakebase Postgres database to a destination such as MySQL or another Postgres instance.

## Prerequisites

- A [DBConvert Streams installation](https://streams.dbconvert.com/install) — desktop app, Docker, or binary
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

![Neon dashboard settings with option to enable logical replication](/docs/guides/neon-console-settings-logical-replication.png)

You can verify that logical replication is enabled by running the following query from the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor):

```sql
SHOW wal_level;
 wal_level
-----------
 logical
```

### Create a Postgres role for replication

It is recommended that you create a dedicated Postgres role for replicating data. The role must have the `REPLICATION` privilege. The default Postgres role created with your Neon project and roles created using the Neon CLI, Console, or API are granted membership in the [neon_superuser](/docs/manage/roles#the-neonsuperuser-role) role, which has the required `REPLICATION` privilege and can create publications.

<Tabs labels={["CLI", "Console", "API"]}>

<TabItem>

The following CLI command creates a role. To view the CLI documentation for this command, see [Neon CLI commands — roles](/docs/cli/roles)

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

The following Neon API method creates a role. To view the API documentation for this method, refer to the [Neon API Reference](/docs/reference/api/branches/create-project-branch-role).

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

Granting `SELECT ON ALL TABLES IN SCHEMA` instead of naming the specific tables avoids having to add privileges later if you widen the stream to more tables.

## Create a Neon connection in DBConvert Streams

1. In the Neon Console, click **Connect** on your **Project Dashboard**, select the replication role you created earlier, and copy the connection string. It has this shape:

   ```text
   postgres://replication_user:<password>@<endpoint>.<region>.aws.neon.tech/<dbname>?sslmode=require
   ```

   Use a direct connection string; the hostname must not include `-pooler`. Logical replication is not compatible with connection poolers.

1. In DBConvert Streams, create a new connection and select **PostgreSQL** as the database type.
1. Enter the host, port `5432`, database, and the credentials of the replication role. Pasting the connection string into **Quick fill** populates these fields for you.

   ![DBConvert Streams PostgreSQL connection configured for Neon](/docs/guides/dbconvert-streams-neon-connection.png)

1. Open the **SSL** tab and set **SSL Mode** to `Require`. Neon does not accept unencrypted connections. No certificate files are needed.

   ![SSL Mode set to Require in DBConvert Streams](/docs/guides/dbconvert-streams-neon-ssl.png)

1. Test the connection, then open the database in **Data Explorer**. The **CDC readiness** card reports `wal_level`, available replication slots, and WAL senders — it should show `logical`.

   ![CDC readiness card in DBConvert Streams showing wal_level logical](/docs/guides/dbconvert-streams-cdc-readiness.png)

## Allow inbound traffic

If you are using Neon's **IP Allow** feature to limit the IP addresses that can connect to Neon, you will need to allow inbound traffic from your DBConvert Streams deployment. Because DBConvert Streams is self-hosted, the address to allowlist is the public IP of the machine or cloud instance you deployed it on. For information about configuring allowed IPs in Neon, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow).

## Create a replication stream

1. In DBConvert Streams, create a new stream and select the Neon connection as the source.
1. On the **Structure and Data** step, set the **Data Transfer Mode** to **Stream (Change Data Capture)**. If that option is disabled, `wal_level` is still `replica` — see [Enable logical replication in Neon](#enable-logical-replication-in-neon).
1. Choose which **Capture Events** to replicate, and select the tables to capture.
1. Leave **Initial Load + CDC** selected to copy existing rows before change data capture begins. Clear it if the stream should carry only the changes made after it starts.
1. Under **Write mode**, use **Upsert**, which matches rows by primary key so that replayed events do not duplicate data.

   ![Stream configured for change data capture in DBConvert Streams](/docs/guides/dbconvert-streams-cdc-mode.png)

1. Select the target connection and start the stream.

<Admonition type="note" title="Publication and replication slot">
You do not create the publication or the replication slot yourself. On the first start, DBConvert Streams creates a publication named `dbconvert-publication` for exactly the tables you selected, and a slot named `<database>_dbconvert_replication_slot`. If you change the table selection later, it runs `ALTER PUBLICATION ... SET TABLE` rather than dropping the publication, so other consumers stay connected. To use your own names, set `publicationName` and `replicationSlot` in the stream's source options — see the [stream configuration reference](https://streams.dbconvert.com/docs/streams/stream-config-reference).
</Admonition>

The stream runs the initial snapshot, hands off at the recorded LSN, and then applies changes continuously:

![A running DBConvert Streams CDC stream replicating from Neon to MySQL](/docs/guides/dbconvert-streams-cdc-running.png)

## References

- [DBConvert Streams Neon connection guide](https://streams.dbconvert.com/docs/connections/neon-database)
- [PostgreSQL CDC source configuration](https://streams.dbconvert.com/docs/integration/postgres-cdc-source-configuration)

<NeedHelp/>
