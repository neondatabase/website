---
title: Migrate with AWS Database Migration Service (DMS)
enableTableOfContents: true
---

This guide outlines the steps for using the AWS Database Migration Service (DMS) to migrate data to Neon from another hosted database such as PostgreSQL, MySQL, Oracle, Microsoft SQL Server, or some other database migration source supported by AWS DMS.

<Admonition type="note">
For a complete list of data migration sources supported by AWS DMS, see [Source endpoints for data migration](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Introduction.Sources.html#CHAP_Introduction.Sources.DataMigration).
</Admonition>

For additional information about particular steps in the migration process, refer to the [official AWS DMS documentation](https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html). If you are not familiar with AWS DMS, we recommend the [Getting started with AWS Database Migration Service](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_GettingStarted.html) tutorial.

This guide uses the [AWS DMS sample Postgres database](https://github.com/aws-samples/aws-database-migration-samples/blob/master/PostgreSQL/sampledb/v1/README.md) for which the schema name is `dms_sample`.

If you encounter problems with AWS DMS that are not related to defining Neon as a data migration target endpoint, please contact [AWS Customer Support](https://aws.amazon.com/contact-us/).

## Before you begin

Complete the following steps before you begin. For the AWS DMS setup prerequisites, you may find it helpful to refer to the [Getting started with AWS Database Migration Service](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_GettingStarted.html) tutorial as you work through these steps.

- Create a [replication instance](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_ReplicationInstance.Creating.html) in AWS DMS. In this guide, the replication instance is named `dms_instance`.
- Configure a [source database endpoint](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.html) in AWS DMS. When configuring the endpoint, we recommend testing the connection to ensure that it succeeds. In this guide, the source database endpoint is named `dms_postgresql`.
- If you have not done so already, set up a Neon project and a target database. See [Create a project](/docs/manage/projects#create-a-project), and [Create a database](/docs/manage/databases#delete-a-database) for instructions. The database used in this guide is named `neondb`. You can create a database and name it whatever you like.
- If you are migrating from a database engine other than Postgres, use the [Schema Conversion Tool](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_GettingStarted.SCT.html) or [DMS Schema Conversion](https://docs.aws.amazon.com/dms/latest/userguide/getting-started.html) to convert and export your schema from the source database to the target database. As outlined in the [Getting started with AWS Database Migration Service](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_GettingStarted.html) tutorial, perform this step before proceeding with the data migration. If migrating from a Postgres database to Neon, schema conversion is not required.

## Create a target endpoint for your Neon database

1. In the AWS Console, select **Database Migration Service**.
2. Select **Endpoints** from the sidebar.
3. Click **Create endpoint**.
4. Select **Target endpoint** as the **Endpoint type**.
5. Provide an **Endpoint identifier** label to identify your new target endpoint. In this example, we use `neon` as the identifier.
6. In the **Target engine** drop-down menu, select `PostgreSQL`.
7. Under **Access to endpoint database**, select **Provide access information manually**.
8. Enter the information outlined below. You can obtain most of this information from your Neon connection string, which you can find in the **Connection Details** widget on the Neon **Dashboard**. Your Neon connection string will look something like this:

    <CodeBlock shouldWrap>

    ````text
    postgres://daniel:<password>@ep-curly-term-54009904.us-east-2.aws.neon.tech/neondb
    ````

    </CodeBlock>

    See [Connect from any application](/docs/connect/connect-from-any-app) for more information about connection strings.

    - **Server name**: This is your Neon hostname, which is this portion of your connection string: `ep-curly-term-54009904.us-east-2.aws.neon.tech`
    - **Port**: `5432`
    - **User name**: This is the Neon user you will connect with. In this example, the user `daniel`.
    - **Password**: To connect to Neon from AWS DMS, you must specify the password in the following format: `endpoint=<endpoint_id>$<password>`, which looks similar to this when defined:

      ```text
      endpoint=ep-curly-term-54009904$abcd1234efgh5678
      ```

      You can obtain the `endpoint_id` value and password from your Neon connection string. The `endpoint_id` has an `ep-` prefix and appears similar to this: `ep-curly-term-54009904`. For information about why this format is required for the password, see [Connection errors](https://neon.tech/docs/connect/connection-errors#the-endpoint-id-is-not-specified). AWS DMS requires the [Option D workaround](https://neon.tech/docs/connect/connection-errors#d-specify-the-endpoint-id-in-the-password-field) that is described on that page.

    - **Database name**: The name of your Neon database. In this example, we use a database named `neondb`

      When you finish entering the connection details, your target endpoint configuration should look similar to this:
      ![Endpoint configuration dialog](/docs/import/endpoint_configuration.png).

9. Under **Test endpoint connection (optional)**, click **Run test** to test the connection. Running the test creates the endpoint with the details and attempts to connect to it. If the connection fails, you can edit the endpoint definition and test the connection again. Ensuring the connection is successful here avoids errors later during the database migration.
10. Select **Create endpoint**.

## Create a database migration task

A database migration task defines what data is migrated from the source database to the target database.

1. In AWS DMS, select **Database migration tasks** from the sidebar.
2. Select **Create task** to open a **Create database migration task** page.
3. Enter a **Task identifier** to identify the replication task. In this example, we name the identifier `dms-task`.
4. Select the **Replication instance** you created previously. In this example, the replication instance is named `dms_instance`.
5. Select the **Source database endpoint** you created previously. In this example, the replication instance is named `dms_postgresql`.
5. Select the **Target database endpoint** you created previously. In this example, the target database endpoint identifier is `neon`.  
6. Select a **Migration type**. In this example, we use the default `Migrate existing data` type.
![DMS database migration task configuration](/docs/import/dms_task_configuration.png)

### Task settings

1. For **Editing mode**, select **Wizard**.
2. For Target table preparation mode, select **Do nothing**. This option means that AWS DMS only creates tables in target database if they do not exist.
3. For the **LOB column** setting, select **Don't include LOB columns**. Neon does not support LOB columns.
4. Optionally, under **Validation**, check **Turn on** to compare the data after the load operation finishes to ensure that data was migrated accurately. For more information about validation, refer to the [AWS data validation documentation](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Validating.html). You can also check **Enable CloudWatch logs** and set **Target Load** to **Debug** or **Detailed debug** to log information during the migration process. This data may be useful for troubleshooting migration issues.
![DMS database migration task settings](/docs/import/dms_task_settings.png)

### Table mappings

1. For **Editing mode**, select **Wizard**.
2. Under **Selection rules**, click **Add new selection rule**.
3. For **Schema**, select **Enter a schema**.
4. For **Source name**, enter the name of your database schema. In this example, `dms_sample` is specified as the schema name, which is the schema used by our sample database. The `dms_sample` schema will be created in your Neon database, and database objects will be created in the schema.
5. For the **Source table name**, leave the `%` wildcard character to load all tables in the schema.
6. For **Action**, select **Include** to migrate the objects specified by your selection rule.
![DMS database migration task table mappings](/docs/import/dms_task_table_mappings.png)

### Migration task startup configuration

1. Under ***Migration task startup configuration**, select **Automatically on create**
2. Click **Start migration task** at the bottom of the page. The data migration tasks is created and the data migration operation is initiated. You can monitor operation progress on the AWS DMS **Database migrations tasks** page.
![DMS database migration task status](/docs/import/dms_migration_status.png)

## Verify the data migration in Neon

To verify the data was migrated to your Neon database:

1. In the Neon Console, select your Neon project.
2. Select **Tables** from the side bar.
3. Select the **Branch**, **Database**, and **Schema** where you imported the data. This example used `main` branch of the Neon project, the `neondb` database, and the schema imported was `dms_sample`.
![Neon Tables view showing imported data](/docs/import/dms_neon_table_data.png).

## Migration notes

This section contains notes from our experience using AWS DMS to migrate data to Neon.

- When testing migration steps, the procedures outlined in the [Getting started with AWS Database Migration Service](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_GettingStarted.html) tutorial were our primary reference. As recommended in the tutorial, we created a VPC and created all resources within the VPC.
- We created all resources in the same region (`aws-us-east-2a`)
- We created an RDS PostgreSQL 15 database called `dms_sample` as the source database. The Neon target database was also Postgres 15, which is the default version for Neon.
- We populated the RDS PostgreSQL source database using the [AWS DMS sample Postgres database](https://github.com/aws-samples/aws-database-migration-samples/blob/master/PostgreSQL/sampledb/v1/README.md). To do this, we created an EC2 instance to connect to the database following these steps: [Create an Amazon EC2 Client](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_GettingStarted.Prerequisites.html#CHAP_GettingStarted.Prerequisites.client).
- The source database was populated using this `psql` command:

  ```bash
  psql -h dms-postgresql.abc123def456hgi.us-east-2.rds.amazonaws.com -p 5432 -U postgres -d dms_sample -a -f ~/aws-database-migration-samples/PostgreSQL/sampledb/v1/postgresql.sql
  ```

- To verify that data was loaded in the source database, we connected using the following `psql` command and issued the following query:

    ```bash
    psql \
    --host=dms-postgresql.abc123def456hgi.us-east-2.rds.amazonaws.com \
    --port=5432 \
    --username=postgres \
    --password \
    --dbname=dms_sample


    dms_sample=> SELECT * from dms_sample.player LIMIT 100;
    ```

- When creating the source database endpoint for the RDS Postgres 15 database, we set **Secure Socket Layer (SSL) mode** to `require`. Without this setting, we encountered the following error: `Test Endpoint failed: Application-Status: 1020912, Application-Message: Failed to connect Network error has occurred, Application-Detailed-Message: RetCode: SQL_ERROR SqlState: 08001 NativeError: 101 Message: FATAL: no pg_hba.conf entry for host "10.0.1.135", user "postgres", database "dms_sample", no encryption`
- When creating the target database endpoint for the Neon database, we encountered the following error when testing the connection: `Endpoint failed: Application-Status: 1020912, Application-Message: Cannot connect to ODBC provider Network error has occurred, Application-Detailed-Message: RetCode: SQL_ERROR SqlState: 08001 NativeError: 101 Message: timeout expired`. Our replication instance, created in the private subnet where the source database resided, could not access the Neon database, which resides outside of the VPC. To allow the replication instance to access the Neon database, we added a NAT Gateway to the public subnet, allocated an Elastic IP address, and modified the **Route Table** associated with the private subnet to add a route via the NAT Gateway.
