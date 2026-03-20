---
title: Change Data Capture with Serverless Postgres
description: Announcing Logical Replication in Neon
excerpt: >-
  Modern applications often require loosely coupled components and services that
  help teams and systems to scale. These data pipelines generate continuous data
  streams that need to be replicated, processed, or analyzed. However, moving
  data between different data stores can serious...
date: '2023-12-21T12:23:07'
updatedOn: '2024-03-27T11:38:57'
category: community
categories:
  - community
authors:
  - raouf-chebri
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/change-data-capture-with-serverless-postgres/cover.png
  alt: null
isFeatured: false
seo:
  title: Change Data Capture with Serverless Postgres - Neon
  description: Announcing Logical Replication in Neon
  keywords: []
  noindex: false
  ogTitle: Change Data Capture with Serverless Postgres - Neon
  ogDescription: >-
    Modern applications often require loosely coupled components and services
    that help teams and systems to scale. These data pipelines generate
    continuous data streams that need to be replicated, processed, or analyzed.
    However, moving data between different data stores can seriously compromise
    the quality and reliability of your decisions because inconsistent data or
    corruption occurs during […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/change-data-capture-with-serverless-postgres/social.jpg
source:
  wpId: 4090
  wpSlug: change-data-capture-with-serverless-postgres
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/change-data-capture-with-serverless-postgres/image-8-1024x576-cd71c190.png)

Modern applications often require loosely coupled components and services that help teams and systems to scale. These data pipelines generate continuous data streams that need to be replicated, processed, or analyzed.

However, moving data between different data stores can seriously compromise the quality and reliability of your decisions because inconsistent data or corruption occurs during transformation. This is why [Change Data Capture (CDC)](https://en.wikipedia.org/wiki/Change_data_capture) has emerged as one of the most popular methods to synchronize data across multiple data stores. One way to use CDC in Postgres is with [logical replication](https://www.postgresql.org/docs/current/logical-replication.html#:~:text=Logical%20replication%20is%20a%20method,byte%2Dby%2Dbyte%20replication.).

Today, we’re excited to announce the release of logical replication in beta on Neon. This feature lets you stream your data hosted on Neon to external data stores, allowing for change data capture and real-time analytics.

## Why CDC matters?

CDC refers to the process of capturing changes made to data in a database – such as inserts, updates, and deletes – and then delivering these changes to downstream processes or systems.

CDC operates by monitoring and capturing data changes in a source database as they occur. This is a departure from traditional batch processing, where data updates are transferred at scheduled intervals. CDC ensures that every change is captured and can be acted upon almost instantaneously.

Why CDC Matters

- **Data synchronization**: In a distributed system architecture, keeping data synchronized across various platforms and services is critical. CDC facilitates this by providing a mechanism for real-time data replication.
- **Minimizing Latency**: By capturing changes as they happen, CDC minimizes the latency in data transfer. This is essential for applications where even a slight delay in data availability can lead to significant issues, such as financial trading systems.
- **Enabling Event-Driven Architectures**: CDC is a cornerstone for building event-driven systems. In such architectures, actions are triggered in response to data changes, making real-time data capture essential.
- **Data warehousing and real-time analytics**: For organizations relying on data warehouses and analytics tools for decision-making, CDC ensures that the data in these systems is current, enhancing the accuracy of insights.

Now that we understand it better, let’s explore the technical mechanics of how CDC is implemented in Postgres through logical replication.

## Logical replication: under the hood

In Postgres, logical replication is one of the methods of implementing CDC and streaming data from your database to an external source. It uses a publisher-subscriber model.

Your Neon database works as a publisher, copying first a snapshot of the data and then streaming changes to one or more target data stores (subscribers). This model allows for selective replication, where only specified tables or even specific columns within a table can be replicated.

![Image](https://lh7-us.googleusercontent.com/tGCgBjbl_y0o7rrz31mcfNf1cp5POGasm-v_k9S0WHM7ojA_zYv6bYKiPHr1JmYFV3s1yiQREORWwsGd2Qtz_THLp1LNBzgkpFkkJoJWqLiMSw3wcdKLyOhpIAbhPoLFUda9tN_PTlcchyYoLJdMfZg)

Learn more about connecting [Neon to different data stores](https://neon.tech/docs/guides/logical-replication-guide) in the documentation.

The [Write-Ahead-Log (WAL)](https://www.postgresql.org/docs/current/wal-intro.html) is a fundamental component in Postgres, designed to ensure data integrity and facilitate recovery. It records every change made to the database, including transactions and their states.

For logical replication, the WAL serves as the primary data source. The WAL captures the comprehensive sequence of data changes, which are then decoded for replication purposes. Logical replication transforms the WAL to a format accepted by the subscriber through logical decoding, and the `walsender` then streams the transformed data using the replication protocol.

The `walsender` initiates the logical decoding of the WAL using an output plugin. Postgres ships with several logical decoding plugins that can output the data in various formats. In addition, new plugins can be developed.

For instance, in a Postgres-to-Postgres logical replication, the standard `pgoutput` plugin transforms the data changes to the logical replication protocol. The transformed data is subsequently streamed using the replication protocol, which maps it to local tables and applies the changes in the exact sequence of the original transactions. However, integrations with non-Postgres systems require an output format different from the standard one specifically designed for Postgres-to-Postgres logical replication.

Today’s data pipelines involve more than one data store type. For example, you can integrate all your Postgres databases into a data warehouse or streaming platform, such as [Materialize](https://materialize.com/) or [Kafka](https://kafka.apache.org/), to process and analyze data at higher scales. This is why, with the release of logical replication on Neon, we added support for [wal2json](https://github.com/eulerto/wal2json), which outputs changes in the JSON format to be easily consumed by other systems and data stores.

You can read more on [Change Data Capture using Neon and Materialize](https://neon.tech/blog/cdc-with-materialize) by our friend Marta Paes, to learn how to integrate your database with external systems.

## Logical vs. physical replication

Logical replication differs from physical replication in that it replicates changes at the data level (row-level changes) rather than replicating the entire database block. This allows for more selective replication and reduces the amount of data transferred. Unlike snapshot replication, which provides a full copy of the data at a specific point in time, logical replication ensures continuous streaming of changes, making it more suitable for applications that require near real-time data availability.

This comparison highlights the distinct characteristics, advantages, and applications of logical and physical replication.

| **Logical Replication**                                                                                                                          | **Physical Replication**                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Row-Level Changes**: focuses on replicating specific row-level changes (INSERT, UPDATE, DELETE) in selected tables.                            | **Block-Level Replication**: replicates the entire database at the block level. It creates an exact copy of the source database, including all tables and system catalogs. |
| **Flexibility**: Offers the flexibility to replicate specific tables and even specific columns within tables.                                    | **Limitations**: Doesn’t allow for selective table replication and requires the same PostgreSQL version on both the primary and standby servers.                           |
| **WAL-based**: Uses the WAL for capturing changes, but with logical decoding to convert these changes into a readable format for the subscriber. | **Streaming Replication**: Changes are streamed as they are written to the WAL, minimizing lag.                                                                            |
| **Use Cases**: Ideal for situations requiring selective replication, minimal impact on the source database, or cross-version compatibility.      | **Use Cases**: Best suited for creating read-only replicas for load balancing, high availability, and disaster recovery solutions.                                         |

## Get started with logical replication

To enable logical replication, navigate to your project’s settings in the console and click on the “Beta” tab, locate Logical Replication then on the “Enable” button.

Note that enabling logical replication will restart your compute instance, which will drop existing connections. A subscriber may also keep the connection to your Neon database active, preventing your Neon instance from scaling to zero.

This action is also irreversible, and you will not be able to disable logical replication for your project.

<video autoPlay muted loop width="1796" height="1080">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/change-data-capture-with-serverless-postgres/logical-replication-6fb5add7.mp4" />
</video>

Ensure that logical replication is enabled by running the following query in the [SQL Editor](https://neon.tech/docs/get-started-with-neon/query-with-neon-sql-editor) within the Neon console or using `psql` on your terminal.

```sql
SHOW wal_level;

 wal_level
-----------
 logical
```

### Create a publication

Let’s assume you have the following users table:

```sql
CREATE TABLE users (

  id SERIAL PRIMARY KEY,

  username VARCHAR(50) NOT NULL,

  email VARCHAR(100) NOT NULL

);
```

Execute the following query to create a publication for the users table:

```sql
CREATE PUBLICATION users_publication FOR TABLE users;
```

Learn more about [how to connect Neon to different data stores](https://neon.tech/docs/guides/logical-replication-guide) in the documentation.

## Limitations

While logical replication in Neon Postgres offers numerous benefits for real-time data synchronization and flexibility, it has some limitations:

**Publisher, not a subscriber**

This release of logical replication on Neon is in beta, and for security reasons, it does not include subscriber capabilities at the moment. We are currently working on these security constraints, which should be supported in future releases.

**Logical replication and Auto-suspend**

In a logical replication setup, a subscriber may keep the connection to your Neon publisher database active to poll for changes or perform sync operations, preventing your Neon compute instance from scaling to zero. Some subscribers allow you to configure connection or sync frequency, which may be necessary to continue taking advantage of Neon’s Auto-suspend feature. Please refer to your subscriber’s documentation or contact their support team for details.

**Data Definition Language (DDL) Operations**

Logical replication in Postgres primarily handles Data Manipulation Language (DML) operations like INSERT, UPDATE, and DELETE. However, it does not automatically replicate Data Definition Language (DDL) operations such as CREATE TABLE, ALTER TABLE, or DROP TABLE. This means that schema changes in the publisher database are not directly replicated to the subscriber database.

Manual intervention is required to replicate DDL changes. This can be done by applying the DDL changes separately in both the publisher and subscriber databases or by using third-party tools that can handle DDL replication.

**Replication Lag**

In high-volume transaction environments, there is potential for replication lag. This is the time delay between a transaction being committed on the publisher and the same transaction being applied on the subscriber.

It’s important to monitor replication lag and understand its impact, especially for applications that require near-real-time data consistency. Proper resource allocation and optimizing the network can help mitigate this issue.

## Conclusion

Logical replication is undoubtedly one of the most important features for modern applications. As we continue to develop its capabilities, we encourage you to test, experiment, and push the boundaries of what logical replication can do. Join us on [Discord](https://neon.tech/discord), and share your experiences, suggestions, and challenges with us.

We can’t wait to see what you build with Neon.
