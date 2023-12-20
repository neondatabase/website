---
title: Logical replication
subtitle: Stream data from Neon to other data platforms and service
enableTableOfContents: true
---

Neon's logical replication feature, availableto all Neon users, allows you to replicate data from your Neon database to external destinations. These destinations might include data warehouses, analytical database services, real-time stream processing systems, messaging and event-streaming platforms, change data capture (CDC) ecosystems, or external Postgres databases, among others.

![Neon logical replication subscribers image](/docs/guides/logical_replication_subscribers.png)

Logical replication in Neon works in the same way as logical replication on a standard Postgres installation, using a publish and subscribe model to replicate data from the source database to the destination.

To learn more, refer to our [Logical replication guide](/docs/guides/logical-replication-guide).