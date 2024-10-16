---
title: Replicate Data with Estuary Flow
subtitle: Learn how to replicate data from Neon with Estuary Flow
enableTableOfContents: true
isDraft: false
updatedOn: '2024-10-12T11:16:13.586Z'
---

Neon's logical replication feature allows you to replicate data from your Neon Postgres database to external destinations.

[Estuary Flow](https://estuary.dev/) is a real-time data streaming platform that allows you to connect, transform, and move data from various sources to destinations with sub-100ms latency.

In this guide, you will learn how to configure a Postgres source connector in Estuary Flow for ingesting changes from your Neon database, enabling you to replicate data from Neon to any of Estuary Flow's [supported destinations](https://docs.estuary.dev/reference/Connectors/materialization-connectors/#available-materialization-connectors), with optional transformations along the way.

## Prerequisites

- An [Estuary Flow account](https://dashboard.estuary.dev/register) (start free, no credit card required)
- A [Neon account](https://console.neon.tech/)
- Read the [important notices about logical replication in Neon](/docs/guides/logical-replication-neon#important-notices) before you begin

## Enable Logical Replication in Neon

<Admonition type="important">
Enabling logical replication modifies the Postgres `wal_level` configuration parameter, changing it from `replica` to `logical` for all databases in your Neon project. Once the `wal_level` setting is changed to `logical`, it cannot be reverted. Enabling logical replication also restarts all computes in your Neon project, meaning active connections will be dropped and have to reconnect.
</Admonition>

To enable logical replication in Neon:

1. Select your project in the Neon Console.
2. On the Neon **Dashboard**, select **Project settings**.
3. Select **Beta**.
4. Click **Enable** to enable logical replication.

You can verify that logical replication is enabled by running the following query from the [Neon SQL Editor](https://docs.neon.tech/docs/query-with-neon-sql-editor):

```sql
SHOW wal_level;
 wal_level
-----------
 logical
```

## Create a Postgres Role for Replication

It is recommended that you create a dedicated Postgres role for replicating data. The role must have the `REPLICATION` privilege. The default Postgres role created with your Neon project and roles created using the Neon Console, CLI, or API are granted membership in the [neon_superuser](https://docs.neon.tech/docs/manage/roles#the-neonsuperuser-role) role, which has the required `REPLICATION` privilege.

<Tabs labels={["CLI", "Console", "API"]}>

<TabItem>

The following CLI command creates a role. To view the CLI documentation for this command, see [Neon CLI commands — roles](https://api-docs.neon.tech/reference/createprojectbranchrole)

```bash
neon roles create --name cdc_role
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
7. In the role creation dialog, specify a role name (e.g., `cdc_role`).
8. Click **Create**. The role is created, and you are provided with the password for the role.

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
    "name": "cdc_role"
  }
}' | jq
```

</TabItem>

</Tabs>

## Grant Schema Access to Your Postgres Role

If your replication role does not own the schemas and tables you are replicating from, make sure to grant access. Run these commands for each schema:

```sql
GRANT USAGE ON SCHEMA public TO cdc_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO cdc_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO cdc_role;
```

Granting `SELECT ON ALL TABLES IN SCHEMA` instead of naming the specific tables avoids having to add privileges later if you add tables to your publication.

## Create a Publication

Create a [publication](https://www.postgresql.org/docs/current/sql-createpublication.html) with the name `estuary_publication`. Include all the tables you would like to ingest into Estuary Flow.

```sql
CREATE PUBLICATION estuary_publication FOR TABLE <tbl1, tbl2, tbl3>;
```

Refer to the [Postgres docs](https://www.postgresql.org/docs/current/sql-alterpublication.html) if you need to add or remove tables from your publication. Alternatively, you also can create a publication `FOR ALL TABLES`.

Upon startup, the Estuary Flow connector for Postgres will automatically create the [replication slot](https://www.postgresql.org/docs/current/logicaldecoding-explanation.html#LOGICALDECODING-REPLICATION-SLOTS) required for ingesting data change events from Postgres. The slot's name will be prefixed with `estuary_`, followed by a unique identifier.

## Allow Inbound Traffic

If you are using Neon's **IP Allow** feature to limit the IP addresses that can connect to Neon, you will need to allow inbound traffic from Estuary Flow's IP addresses.
Refer to the [Estuary Flow documentation](https://docs.estuary.dev/reference/regions-and-ip-addresses) for the list of IPs that need to be allowlisted for the Estuary Flow region of your account.
For information about configuring allowed IPs in Neon, see [Configure IP Allow](https://docs.neon.tech/docs/manage/projects#configure-ip-allow).

## Create a Postgres Source Connector in Estuary Flow

1. In the Estuary Flow web UI, select **Sources** from the left navigation bar and click **New Capture**.
2. In the connector catalog, choose **Neon PostgreSQL** and click **Connect**.
3. Enter the connection details for your Neon database. You can get these details from your Neon connection string, which you'll find in the **Connection Details** widget on the **Dashboard** of your Neon project. Your connection string will look like this:

   ```bash shouldWrap
   postgres://cdc_role:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```

   ![Creating a Neon capture connector in Estuary Flow](/docs/guides/estuary_flow_create_neon_capture.png)

   Enter the details for **your connection string** into the source connector fields. Based on the sample connection string above, the values would be specified as shown below. Your values will differ.

   - **Name:**: Name of the Capture connector
   - **Server Address**: ep-cool-darkness-123456.us-east-2.aws.neon.tech:5432
   - **User**: cdc_role
   - **Password**: Click **Add a new secret...**, then specify a name for that secret and `AbC123dEf` as its value
   - **Database**: dbname

   ![Configuring Neon capture in Estuary Flow](/docs/guides/estuary_flow_configure_neon_capture.png)

4. Click **Next**. Estuary Flow will now scan the source database for all the tables that can be replicated. Select one or more tables by checking the checkbox next to their name.
   Optionally, you can change the name of the destination name for each table. You can also take a look at the schema of each stream by clicking on the **Collection** tab.

   ![Selecting collections for replication in Estuary Flow](/docs/guides/estuary_flow_configure_collections.png)

5. Click **Save and Publish** to provision the connector and kick off the automated backfill process.

## Previewing the Data

Once the connector is up and running state, navigate to the Collections page in the Estuary Flow dashboard and click on the collection being filled by your capture.

![Preview data in Estuary Flow](/docs/guides/estuary_flow_preview_collections.png)
