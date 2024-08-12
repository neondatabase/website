---
title: Replicate data with Fivetran
subtitle: Learn how to replicate data from Neon with Fivetran
enableTableOfContents: true
isDraft: false
updatedOn: '2024-08-12T21:44:27.443Z'
---

Neon's logical replication feature allows you to replicate data from your Neon Postgres database to external destinations.

[Fivetran](https://fivetran.com/) is an automated data movement platform that helps you centralize data from disparate sources, which you can then manage directly from your browser. Fivetran extracts your data and loads it into your data destination.

In this guide, you will learn how to define a Neon Postgres database as a data source in Fivetran so that you can replicate data to one or more of Fivetran's supported destinations.

## Prerequisites

- A [Fivetran account](https://fivetran.com/)
- A [Neon account](https://console.neon.tech/)

## Enable logical replication in Neon

<Admonition type="important">
Enabling logical replication modifies the Postgres `wal_level` configuration parameter, changing it from `replica` to `logical` for all databases in your Neon project. Once the `wal_level` setting is changed to `logical`, it cannot be reverted. Enabling logical replication also restarts all computes in your Neon project, meaning active connections will be temporarily dropped before automatically reconnecting.
</Admonition>

To enable logical replication in Neon:

1. Select your project in the Neon Console.
2. On the Neon **Dashboard**, select **Settings**.
3. Select **Logical Replication**.
4. Click **Enable** to enable logical replication.

You can verify that logical replication is enabled by running the following query from the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor):

```sql
SHOW wal_level;
 wal_level
-----------
 logical
```

## Create a Postgres role for replication

It is recommended that you create a dedicated Postgres role for replicating data. The role must have the `REPLICATION` privilege. The default Postgres role created with your Neon project and roles created using the Neon CLI, Console, or API are granted membership in the [neon_superuser](/docs/manage/roles#the-neonsuperuser-role) role, which has the required `REPLICATION` privilege.

<Tabs labels={["CLI", "Console", "API"]}>

<TabItem>

The following CLI command creates a role. To view the CLI documentation for this command, see [Neon CLI commands — roles](https://api-docs.neon.tech/reference/createprojectbranchrole)

```bash
neon roles create --name alex
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

If your replication role does not own the schemas and tables you are replicating from, make sure to grant access. For example, the following commands grant access to all tables in the `public` schema to Postgres role `alex`:

```sql
GRANT USAGE ON SCHEMA public TO alex;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO alex;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO alex;
```

Granting `SELECT ON ALL TABLES IN SCHEMA` instead of naming the specific tables avoids having to add privileges later if you add tables to your publication.

## Create a publication

Create the Postgres publication. Include all tables you want to replicate as part of the publication:

```sql
CREATE PUBLICATION fivetran_pub FOR TABLE <tbl1, tbl2, tbl3>;
```

The publication name is customizable. Refer to the [Postgres docs](https://www.postgresql.org/docs/current/logical-replication-publication.html) if you need to add or remove tables from your publication.

## Create a replication slot

Fivetran requires a dedicated replication slot. Only one source should be configured to use this replication slot.

Fivetran uses the `pgoutput` plugin in Postgres for decoding WAL changes into a logical replication stream. To create a replication slot called `fivetran_slot` that uses the `pgoutput` plugin, run the following command on your database using your replication role:

```sql
SELECT pg_create_logical_replication_slot('fivetran_pgoutput_slot', 'pgoutput');
```

The name assigned to the replication slot is `fivetran_pgoutput_slot`. You will need to provide this name when you set up your Fivetran source.

<Admonition type="important">
To prevent storage bloat, **Neon automatically removes _inactive_ replication slots after a period of time if there are other _active_ replication slots**. If you have or intend on having more than one replication slot, please see [Unused replication slots](/docs/guides/logical-replication-neon#unused-replication-slots) to learn more.
</Admonition>

## Create a Postgres source in Fivetran

1. Log in to your [Fivetran](https://fivetran.com/) account.
1. On the **Select your datasource** page, search for the **PostgreSQL** source and click **Set up**.
1. In your connector setup form, enter a value for **Destination Schema Prefix**. This prefix applies to each replicated schema and cannot be changed once your connector is created. In this example, we'll use `neon` as the prefix.
1. Enter the connection details for your Neon database. You can get these details from your Neon connection string, which you'll find in the **Connection Details** widget on the **Dashboard** of your Neon project.
   For example, let's say this is your connection string:

   ```bash shouldWrap
   postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```

   From this string, the values in the Fivetran **Create a source** dialog would show as below. Your actual values will differ, with the exception of the port number.

   - **Host**: ep-cool-darkness-123456.us-east-2.aws.neon.tech
   - **Port**: 5432
   - **Username**: alex
   - **Password**: AbC123dEf
   - **Database Name**: dbname

1. For **Connection Method**, select **Logical replication of the WAL using the pgoutput plugin** and enter values for the **Replication Slot** and **Publication Name**. You deifned these values earlier (`fivetran_pgoutput_slot` and `fivetran_pub`, respectively).

   ![Fivetran connector setup](/docs/guides/fivetran_connector_setup.png)

1. If you are using Neon's **IP Allow** feature to limit IP addresses that can connect to Neon, add Fivetran's IPs to your allowlist in Neon.

   ![Fivetran IP addresses](/docs/guides/fivetran_ips.png)

   For instructions, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow). You'll need to do this before you can validate your connection in the next step. If you are not using Neon's **IP Allow** feature, you can skip this step.

1. Click **Save & Test**. Fivetran tests and validates the connection to your database. Upon successful completion of the setup tests, you can sync your data using Fivetran.

   During the test, Fivetran asks you to confirm the certificate chain by selecting the certificate to use as the trust anchor. Select the `CN=ISRG Root X1, 0=Internet Security Research Group, C=US` option. This certificate is valid unitl until 2035-06-04.

   When the connection test is completed, you should see an **All connection tests passed!** message in Fivetran, as shown below:

   ![Fivetran all connections passed message](/docs/guides/fivetran_connection_test.png)

1. Click **Continue**.
1. On the **Select Data to Sync** page, review the connector schema and select any columns you want to block or hash.

   ![Fivetran select data to sync page](/docs/guides/fivetran_select_data.png)

1. Click **Save & Continue**.

1. On the **How would you like to handle changes?** page, specify how you would like to handle future schema changes. For this example, we'll select **We will allow all new schemas, tables and columns**. Choose the option that best fits your organization's requirements.

   ![Fivetran how to handle changes](/docs/guides/fivetran_changes.png)

1. Click **Continue**. Your data is now ready to sync.

   ![Fivetran data is ready to sync page](/docs/guides/fivetran_ready_to_sync.png)

1. Click **Start Initial Sync** to enable syncing.

## References

- [Fivetran Generic PostgreSQL Setup Guide](https://fivetran.com/docs/databases/postgresql/setup-guide)

<NeedHelp/>
