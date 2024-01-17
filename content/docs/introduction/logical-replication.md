---
title: Logical replication
subtitle: Stream data from Neon for Change Data Capture (CDC) and real-time analytics
enableTableOfContents: true
updatedOn: '2024-01-05T19:45:09.629Z'
---

Neon's logical replication feature, available to all Neon users, allows you to stream data from your Neon database to external destinations, enabling Change Data Capture (CDC) and real-time analytics. These destinations might include data warehouses, analytical database services, real-time stream processing systems, messaging and event-streaming platforms, and external Postgres databases, among others.

![Neon logical replication subscribers image](/docs/guides/logical_replication_subscribers.png)

Logical replication in Neon works in the same way as logical replication on a standard Postgres installation, using a publish and subscribe model to replicate data from the source database to the destination.

To learn more, refer to our [Logical replication guide](/docs/guides/logical-replication-guide).
