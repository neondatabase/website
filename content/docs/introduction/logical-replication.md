---
title: Logical replication
subtitle: Replicate data to and from your Neon Postgres database
enableTableOfContents: true
updatedOn: '2024-08-23T13:04:39.055Z'
---

Neon's logical replication feature, available to all Neon users, allows you to replicate data to and from your Neon Postgres database:

- Perform live migrations to Neon from external sources such as AWS RDS and Google Cloud SQL &#8212; or any platform that runs Postgres.
- Stream data from your Neon database to external destinations, enabling Change Data Capture (CDC) and real-time analytics. External sources might include data warehouses, analytical database services, real-time stream processing systems, messaging and event-streaming platforms, and external Postgres databases, among others.
- Replicate data from one Neon project to another for Neon project, account, Postgres version, or region migration.

![Neon logical replication subscribers image](/docs/guides/logical_replication_publishers_subscribers.jpg)

Logical replication in Neon works in the same way as logical replication on a standard Postgres installation, using a publish and subscribe model to replicate data from the source database to the destination.

To learn more, refer to our [Logical replication guide](/docs/guides/logical-replication-guide).
