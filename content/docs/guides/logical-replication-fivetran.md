---
title: Replicate data with Fivetran
subtitle: Learn how to replicate data from Neon with Fivetran
enableTableOfContents: true
isDraft: true
updatedOn: '2023-12-21T15:11:12.212Z'
---

Neon's logical replication feature allows you to replicate data from your Neon Postgres database to external destinations. 

[Fivetran](https://fivetran.com/) is an automated data movement platform that helps you centralize data from disparate sources, which you can manage directly from your browser. Fivetran extracts your data and loads it into your data destination.

In this guide, you will learn how to define a Neon Postgres database as a data source in Fivetran so that you can move your data to one or more of Fivetran's supported destinations.

## Prerequisites

- A [Fivetran account](https://fivetran.com/)
- A [Neon account](https://console.neon.tech/)

## Enable logical replication in Neon

<Admonition type="important">
Enabling logical replication modifies the Postgres `wal_level` configuration parameter, changing it from `replica` to `logical` for all databases in your Neon project. Once the `wal_level` setting is changed to `logical`, it cannot be reverted. Enabling logical replication also restarts all computes in your Neon project, meaning active connections will be dropped and have to reconnect.
</Admonition>

To enable logical replication in Neon:

1. Select your project in the Neon console.
2. On the Neon **Dashboard**, select **Settings**.
3. Select **Beta**.
4. Click **Enable** to enable logical replication.

You can verify that logical replication is enabled by running the following query from the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor):

```sql
SHOW wal_level;
 wal_level 
-----------
 logical
```

## Create a Postgres role for replication

It is recommended that you create a dedicated Postgres role for replicating data. The role must have the `REPLICATION` privilege. The default Postgres role created with your Neon project and roles created using the Neon Console, CLI, or API are granted membership in the [neon_superuser](/docs/manage/roles#the-neonsuperuser-role) role, which has the required `REPLICATION` privilege.

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

## Grant schema access to your Postgres role

If your replication role does not own the schemas and tables you are replicating from, make sure to grant access. Run these commands for each schema:

```sql
GRANT USAGE ON SCHEMA <schema_name> TO <role_name>;
GRANT SELECT ON ALL TABLES IN SCHEMA <schema_name> TO <role_name>;
ALTER DEFAULT PRIVILEGES IN SCHEMA <schema_name> GRANT SELECT ON TABLES TO <role_name>;
```

Granting `SELECT ON ALL TABLES IN SCHEMA` instead of naming the specific tables avoids having to add privileges later if you add tables to your publication in the future.

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

`fivetran_pgoutput_slot` is the name assigned to the replication slot. You will need to provide this name when you set up your Fivetran source.

## Create a Postgres source in Fivetran

1. Log in to your [Fivetran](https://fivetran.com/) account.
1. On the **Select your datasource** page, search for the **PostgreSQL** source and click **Set up**.
1. In your connector setup form, enter value for **Destination Schema Prefix**. This prefix applies to each replicated schema and cannot be changed once your connector is created. In this example, we'll use `neon` as the prefix.
1. Enter the connection details for your Neon database. You can get these details from your Neon connection string, which you'll find in the **Connection Details** widget on the **Dashboard** of your Neon project. 
    For example, given a connection string like this:

    <CodeBlock shouldWrap>

    ```bash
    postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
    ```

    </CodeBlock>

    Enter the details in the Fivetran **Create a source** dialog as shown below. Your values will differ, with the exception of the port number.

    - **Host**: ep-cool-darkness-123456.us-east-2.aws.neon.tech
    - **Port**: 5432 (Neon uses the default Postgres port, `5432`)
    - **Username**: alex
    - **Password**: AbC123dEf
    - **Database Name**: dbname

1. For **Connection Method**, select **Logical replication of the WAL using the pgoutput plugin**, enter the name of your database's replication slot. Enter both the name of your database's replication slot and publication name accordingly.

    ![Fivetran connector setup](fivetran_connector_setup.png)

1. If you are using Neon's **IP Allow** feature to limit IP addresses that can connect to Neon, add Fivetran's IPs to your allowlist in Neon. 

    ![Fivetran IP addresses](fivetran_ips.png)

For instructions, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow). You'll need to do this before you can validate your connection in the next step. If you are not using Neon's **IP Allow** feature, you can skip this step.

1. Click **Save & Test**. Fivetran tests and validates our connection to your database. Upon successful completion of the setup tests, you can sync your data using Fivetran.

During the test, Fivetran will fetch the TLS certificate and ask you to confirm the certificate chain. Neon uses certificates published by Let's Encrypt. You can verify the certificate chain by selecting the Neon domain, which will look similar to this: `CN =*.us-east-2.aws.neon.tech`. The will differ depending on the region where you set up your Neon project.

    ![Fivetran confirm certificate chain](fivetran_cert_chain.png)

When the connect test is completed, you should see an **All connection tests passed!** message in Fivetran, as shown below:

    ![Fivetran all connections passed message](fivetran_connection_test.png)

1. Click **Continue**.
1. On the **Select Data to Sync** page, review the connector schema and select columns to block or hash.

    ![Fivetran select data to sync page](fivetran_select_data.png)

1. Click **Save & Continue**.

1. On the **How would you like to handle changes?** page, specify how you would like to handle future schema changes. For this example, we'll select **We will allow all new schemas, tables and columns**. Choose the option that best fits your organization's requirements.

    ![Fivetran how to handle changes](fivetran_changes.png)

1. Click **Continue**. Your data is now ready to sync. 

    ![Fivetran data is ready to sync page](fivetran_ready_to_sync.png)

1. Click **Start Initial Sync** to enable syncing.

## References

- [Fivetran Generic PostgreSQL Setup Guide](https://fivetran.com/docs/databases/postgresql/setup-guide)


<NeedHelp/>