---
title: Migrate with AWS Database Migration Service (DMS)
enableTableOfContents: true
---

This guide outlines the steps for using the AWS Database Migration Service (DMS) to migrate data to Neon from another hosted database, which may be running on platforms like PostgreSQL, MySQL, Oracle, or Microsoft SQL Server.

For an in-depth AWS DMS tutorial or additional information about particular migration steps, please refer to the [official documentation provided by AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html).

If you encounter problems with AWS DMS that are not related to Neon as a data migration target, it is recommended to reach out to [AWS Customer Support](https://aws.amazon.com/contact-us/).

## Before you begin

Complete the following steps before you begin:

- Create a [replication instance](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_ReplicationInstance.Creating.html) in AWS.
- Configure a [data migration source](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.html) in AWS. For supported data migration sources, see [Source endpoints for data migration](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Introduction.Sources.html#CHAP_Introduction.Sources.DataMigration).
- If you have not done so already, set up a Neon project and a target database. See [Create a project](/docs/manage/projects#create-a-project), and [Create a database](/docs/manage/databases#delete-a-database) for instructions.
- If you are migrating from PostgreSQL, MySQL, Oracle, or Microsoft SQL Server, use the Schema Conversion Tool to convert and export your schema.

## Create a target endpoint for your Neon database

1. In the AWS Console, open AWS DMS.
2. Open Endpoints in the sidebar. A list of endpoints will display, if any exist.
3. In the top-right portion of the window, click **Create endpoint**. A configuration page will open.
4. In the Endpoint type section, select Target endpoint.
5. Supply an Endpoint identifier to identify the new target endpoint.
6. In the Target engine dropdown, select PostgreSQL.
7. Under Access to endpoint database, select Provide access information manually.
8. For information about where to find CockroachDB connection parameters, see Connect to a CockroachDB Cluster.
8. Enter the Server name and Port of your CockroachDB cluster.
9. Supply a User name, Password, and Database name for your Neon database. You can find those details in the **Connection Details** widget on the Neon **Dashboard**. For more infomration, see [Connect from any application](/docs/connect/connect-from-any-app).
10. If needed, you can test the connection under Test endpoint connection (optional).
11. To create the endpoint, select Create endpoint.

## Create a database migration task

A database migration task defines what data is migrated from the source database to the target database.

1. While in AWS DMS, select Database migration tasks in the sidebar. A list of database migration tasks will display, if any exist.
2. In the top-right portion of the window, select Create task. A configuration page will open.
Supply a Task identifier to identify the replication task.
3. Select the Replication instance and Source database endpoint you created prior to starting this tutorial.
4. For the Target database endpoint dropdown, select the CockroachDB endpoint created in the previous section.
5. Select the appropriate Migration type based on your needs.

### Task settings

1. For the Editing mode radio button, keep Wizard selected.
2. To preserve the schema you manually created, select Truncate or Do nothing for the Target table preparation mode.
3. Optionally check Enable validation to compare the data in the source and target rows, and verify that the migration succeeded. You can view the results in the Table statistics for your migration task. 4. For more information about data validation, see the AWS documentation.
Check the Enable CloudWatch logs option. We highly recommend this for troubleshooting potential migration issues.
5. For the Target Load, select Detailed debug.

### Table mappings

When specifying a range of tables to migrate, the following aspects of the source and target database schema must match unless you use transformation rules:

- Column names must be identical.
- Column types must be compatible.
- Column nullability must be identical.

1. For the Editing mode radio button, keep Wizard selected.
2. Select Add new selection rule.
3. In the Schema dropdown, select Enter a schema.
4. Supply the appropriate Source name (schema name), Table name, and Action.

Note:
Use % as an example of a wildcard for all schemas in a PostgreSQL database. However, in MySQL, using % as a schema name imports all the databases, including the metadata/system ones, as MySQL treats schemas and databases as the same.

## Verify the migration

Data should now be moving from source to target. You can analyze the Table Statistics page for information about replication.

1. In AWS DMS, open Database migration tasks in the sidebar.
2. Select the task you created in Step 2.
3. Select Table statistics below the Summary section.

If your migration failed for some reason, you can check the checkbox next to the table(s) you wish to re-migrate and select Reload table data.
