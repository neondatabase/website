---
title: Migrate with AWS Database Migration Service (DMS)
enableTableOfContents: true
---

This guide outlines the steps for using the AWS Database Migration Service (DMS) to migrate data to Neon from another hosted database such as PostgreSQL, MySQL, Oracle, Microsoft SQL Server, or some other database migration source supported by AWS DMS.

<Admonition type="note">
For a complete list of data migration sources supported by AWS DMS, see [Source endpoints for data migration](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Introduction.Sources.html#CHAP_Introduction.Sources.DataMigration).
</Admonition>

For additional information about particular steps in the migration process, refer to the [official AWS DMS documentation](https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html). If you are not familiar with AWS DMS, we recommend the [Getting started with AWS Database Migration Service](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_GettingStarted.html) tutorial.

If you encounter problems with AWS DMS that are not related to defining Neon as a data migration target endpoint, please contact [AWS Customer Support](https://aws.amazon.com/contact-us/).

## Before you begin

Complete the following steps before you begin. For the AWS DMS setup prerequisites, you may find it helpful to refer to the [Getting started with AWS Database Migration Service](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_GettingStarted.html) tutorial as you work through these steps.

- Create a [replication instance](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_ReplicationInstance.Creating.html) in AWS DMS.
- Configure a [data migration source](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.html) in AWS DMS.
- If you have not done so already, set up a Neon project and a target database. See [Create a project](/docs/manage/projects#create-a-project), and [Create a database](/docs/manage/databases#delete-a-database) for instructions. Typically, you would create a database in Neon with the same name as the database you are migrating.
- If you are migrating from a database engine other than Postgres, use the [Schema Conversion Tool](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_GettingStarted.SCT.html) or [DMS Schema Conversion](https://docs.aws.amazon.com/dms/latest/userguide/getting-started.html) to convert and export your schema from the source database to the target database. As outlined in the [Getting started with AWS Database Migration Service](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_GettingStarted.html) tutorial, you would perform this step before proceeding with the steps outlined below. If migrating from a Postgre database to Neon, schema conversion is not required.

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
    - **User name**: This is the Neon user you will connect with. In this example, the user name is `daniel`.
    - **Password**: To connection to Neon from AWS DMS, you must specify the password in the following format: `endpoint=<endpoint_id>$<password>`, which will look similar to this when defined:

      ```text
      endpoint=ep-curly-term-54009904$abcd1234efgh5678
      ```

      You can obtain the `endpoint_id` value and password from your Neon connection string. The `endpoint_id` has an `ep-` prefix and appears similar to this: `ep-curly-term-54009904`. For information about why this format is required for the password, see [Connection errors](https://neon.tech/docs/connect/connection-errors#the-endpoint-id-is-not-specified). AWS DMS requires the [Option D workaround](https://neon.tech/docs/connect/connection-errors#d-specify-the-endpoint-id-in-the-password-field) that is described on that page.

    - **Database name**: The name of your Neon database. In this example, we use a database named `neondb`

      When you are finished entering the connection details, your target endpoint configuration should look something like this:
      ![Endpoint configuration dialog](/docs/import/endpoint_configuration.png).

9. Under **Test endpoint connection (optional)**, click **Run test** to test the connection. Running the test creates the endpoint with the details and attempts to connect to it. If the connection fails, you can edit the endpoint definition and test the connection again. Ensuring that the connection is successful here avoids errors later during the database migration.
10. Select **Create endpoint**.

## Create a database migration task

A database migration task defines what data is migrated from the source database to the target database.

1. In AWS DMS, select **Database migration tasks** from the sidebar.
2. Select **Create task** to open a **Create database migration task** page.
3. Enter a **Task identifier** to identify the replication task. In this example, we name the identifier `dms-task`.
4. Select the **Replication instance** you created previously (see [Before you begin](#before-you-begin)).
5. Select the **Source database endpoint** you created previously see [Before you begin](#before-you-begin)).
5. Select the **Target database endpoint** that you created previously. In this example, the target database endpoint identifier is `neon`.  
6. Select a **Migration type**. In this example, we use the default `Migrate existing data` type.
![DMS database migration task configuration](/docs/import/dms_task_configuration.png)

### Task settings

1. For **Editing mode** radio button, select **Wizard**.
2. For Target table preparation mode, select **Do nothing**. This option means that AWS DMS only creates tables at the target endpoint target if they do not exist.
3. For **LOB column** settings, select **Don't include LOB columns**. Neon does not support LOB columns.
4. Optionally, under **Validation**, check **Turn on** to compare the data after the load operation finishes to ensure that data was migrated accurately. For more information about validation, refer to the [AWS data validation documentation](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Validating.html). You can also check **Enable CloudWatch logs** and set **Target Load** to **Debug** or **Detailed debug** to log information during the migration process, which is useful for troubleshooting migration issues.
![DMS database migration task settings](/docs/import/dms_task_settings.png)

### Table mappings

1. For **Editing mode**, select **Wizard**.
2. Under **Selection rules**, click **Add new selection rule**.
3. For **Schema**, select **Enter a schema**.
4. For **Source name**, enter the name of your database schema. In this example, we use the `dms_sample` database, so we specified the `dms_sample` as the schema name. This schema will be created in your Neon database and database objects will be created in this schema.
5. For the Source table name, leave the `%` wildcard character to load all tables in the schema.
6. For **Action**, select **Include** to migrate the objects specified by the selection rule you defined above.
![DMS database migration task table mappings](/docs/import/dms_task_table_mappings.png)

### Migration task startup configuration

1. Under ***Migration task startup configuration**, select **Automatically on create**
2. Click **Start migration task** at the bottom of the page. The data migration tasks is created first and the data migration operation is initiated immediately afterward.
