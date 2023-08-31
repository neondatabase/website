---
title: Migrate with AWS Database Migration Service (DMS)
enableTableOfContents: true
---

This guide outlines the steps for using the AWS Database Migration Service (DMS) to migrate data to Neon from another hosted database, which may be running on platforms like PostgreSQL, MySQL, Oracle, or Microsoft SQL Server.

For an in-depth AWS DMS tutorial or additional information about particular migration steps, please refer to the [official documentation provided by AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html).

If you encounter problems with AWS DMS that are not related to Neon as a data migration traget, it is recommended to reach out to [AWS Customer Support](https://aws.amazon.com/contact-us/).

## Before you begin

Complete the following steps before you begin:

- Create a [replication instance](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_ReplicationInstance.Creating.html) in AWS.
- Configure a [data migration source](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.html) in AWS.
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

## Create a database replication task

A database replication task defines what data is migrated from the source database to the target database.
