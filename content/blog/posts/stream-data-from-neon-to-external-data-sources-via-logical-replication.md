---
title: Stream data from Neon to external data sources via logical replication
description: >-
  Send data to Airbyte, Fivetran, Kafka, and others for real-time analytics and
  Change Data Capture
excerpt: >-
  Outbound logical replication is available in beta for all Neon projects
  (outbound = from Neon to other sources). Inbound logical replication (from
  other sources to Neon) will be available soon. If you want to try it early,
  tell us here or join our Early Access list. Logical repli...
date: '2024-08-09T17:46:00'
updatedOn: '2024-08-09T17:46:03'
category: postgres
categories:
  - postgres
  - workflows
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/stream-data-from-neon-to-external-data-sources-via-logical-replication/cover.jpg
  alt: null
isFeatured: false
seo:
  title: >-
    Stream data from Neon to external data sources via logical replication -
    Neon
  description: >-
    Outbound logical replication is available for all Neon projects. Use it to
    enabling change data capture (CDC) and real-time analytics.
  keywords: []
  noindex: false
  ogTitle: >-
    Stream data from Neon to external data sources via logical replication -
    Neon
  ogDescription: >-
    Outbound logical replication is available for all Neon projects. Use it to
    enabling change data capture (CDC) and real-time analytics.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/stream-data-from-neon-to-external-data-sources-via-logical-replication/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/stream-data-from-neon-to-external-data-sources-via-logical-replication/neon-replication-1024x576-4645a85d.jpg)

<blockquote>
<p>Outbound logical replication is available in beta for all Neon projects (outbound = from Neon to other sources). Inbound logical replication (from other sources to Neon) will be available soon. If you want to try it early, <a href="https://neon.tech/contact-sales">tell us here</a> or join our <a href="https://neon.tech/early-access-program">Early Access list.</a></p>
</blockquote>

Logical replication allows you to replicate data from your Neon database to various external systems, enabling Change Data Capture (CDC) and real-time analytics. You can use logical replication to stream data to data warehouses, analytical databases, messaging platforms, event-streaming platforms, and other Postgres databases.

In this blog post, we introduce you to the main concepts and use cases for logical replication. We provide how-to guides for starting to replicate data from Neon to platforms like Airbyte, Confluent, Materialize, Fivetran, and Decodable.

## Postgres logical replication: crash course

### What is logical replication?

Logical replication allows you to mirror data between a Postgres database and another data source. When you enable logical replication in a Postgres database (a “publisher”), every insert, update, and delete operation is captured and streamed in real-time to another database or data source (the “subscriber”). This ensures that the data in both sources remains synchronized.

### What logical replication is not

When starting with logical replication, it’s important to understand that it focuses exclusively on replicating **data changes** (inserts, updates, deletes), not DDL operations like schema changes or other configuration changes.

In practice, this means if you make changes to the schema in the publisher database (e.g., adding a new column, modifying a table structure, or creating a new index), you will need to manually apply these changes to the subscriber database. The same applies to configuration settings.

### Benefits of logical replication

Even with this limitation, logical replication is useful for many reasons:

- **Selective data sync.** Logical replication allows you to choose specific tables or even individual rows for replication: you can replicate only the data you need, avoiding unnecessary duplication and saving resources. For example, an e-commerce platform can replicate only sales and inventory tables to a reporting database for analytics.
- **Real-time data replication.** Any changes made in the source database are propagated to the target database almost immediately, ensuring your data is always current in both the publisher and subscriber. This is great for customer-facing applications that require real-time data updates, such as new orders or user activity.
- **Production migrations without downtime.** Logical replication can be your best friend while migrating a large production database between different database vendors. Since you can’t shut things off, you can rely on logical replication to ensure that data is continuously synchronized between the old and new databases during the migration. Once everything is ready, you can switch connections.
- **Safer Postgres upgrades in large databases.** Similarly, logical replication can also be useful when handling upgrades of large Postgres databases, ensuring a smooth transition without downtime.

### How is logical replication different vs pg_dump/restore?

Both logical replication and pg_dump/restore are used for “copying data” between databases, but they are significantly different. Pg_dump creates static snapshots of the database or selected tables, but it doesn’t keep the target database up-to-date with ongoing changes. All data is loaded into the source database at once, and depending on the dataset size, this might take time.

In contrast, logical replication continuously streams individual data changes from the publisher to the subscriber in real-time. When you enable logical replication, Postgres uses its own mechanisms to create an initial snapshot of the data; once this initial data synchronization is complete, logical replication then streams changes as they occur, keeping the subscriber always up-to-date with the latest changes from the publisher database.

### When to use pg_dump/restore or logical replication?

This depends on your needs. Some scenarios require both data sources to be completely in sync, while in others, this might not be necessary or desirable.

### How logical replication works in Postgres

📚 [Check out our documentation on logical replication for a deeper dive.](https://neon.tech/docs/guides/logical-replication-concepts)

Logical replication in Neon works similarly to standard Postgres, using a publish-subscribe model where all changes are tracked via Postgres’ Write-Ahead Log (WAL).

- The **publisher**, a Neon database, “publishes” data changes to the subscriber, the data’s destination.
- When a **subscriber** first connects, it takes a snapshot of the data from the publisher and copies it. After this initial transfer, any subsequent changes in the publisher database are sent to the subscriber in real-time.
- **WAL** records every change made to the data in Postgres databases ([WAL plays a core role in the Neon architecture](https://neon.tech/blog/what-you-get-when-you-think-of-postgres-storage-as-a-transaction-journal)). During logical replication, WAL records all data changes in the publisher, which are then decoded and sent to the subscriber.
- **Decoder plugins** convert WAL entries into a format that can be understood and processed by the subscriber. These plugins transform WAL entries into logical change records, creating a logical replication stream that the subscriber processes and applies to its dataset.

To ensure data consistency and prevent potential data loss, Postgres uses **replication slots**. When setting up logical replication, a replication slot is typically created on the publisher database. This slot ensures that the WAL records, containing all changes made to the database, are not deleted until safely replicated to all subscribers. This guarantees that no changes are lost, even if there are network issues or the subscriber is temporarily unavailable.

## Setting up logical replication in Neon

<blockquote>
<p>By now, Neon supports outbound logical replication in beta (Neon as the publisher). We’re working on supporting inbound logical replication soon (Neon as a subscriber). If you are interested in trying it out, <a href="https://neon.tech/contact-sales">tell us here</a> or join our <a href="https://neon.tech/early-access-program">Early Access list. </a></p>
</blockquote>

Enabling logical replication in Neon is done through the Console. Take into account that once enabled, all computes in your project are restarted, meaning active connections will be dropped and need to reconnect.

To enable logical replication in a Neon project, navigate to your project settings, select Logical Replication, and click Enable:

![Image](https://cdn.neonapi.io/public/images/pages/blog/stream-data-from-neon-to-external-data-sources-via-logical-replication/ad4nxchi4zt9yqxum96b1pearyxrkxvstpyohfcil8ayeblug0xdqpiekv2oxrdq3tt53cthafxq8hhxdtzggcd4v1m0z6mpoahtz4r2vcerzoklgsvujxxrthpeliexds3ngnnpvbviwixfzsaqat97a5u-9d8a883f.png)

You can verify that logical replication is enabled by running:

```sql
SHOW wal_level;
```

### Replication roles

Once you enable logical replication, check that the right roles have the `REPLICATION` privilege. The default Postgres role and roles created via the [Neon Console](https://neon.tech/docs/manage/roles#manage-roles-in-the-neon-console), [CLI](https://neon.tech/docs/manage/roles#manage-roles-with-the-neon-cli), or [API](https://api-docs.neon.tech/reference/createprojectbranchrole) have this privilege; [roles created via SQL](https://neon.tech/docs/manage/roles#manage-roles-with-sql) do not, and this privilege cannot be granted manually.

To verify that a role has the `REPLICATION` privilege, run:

```sql
SELECT rolname, rolreplication FROM pg_roles WHERE rolname = '<role_name>';
```

### Publications

Publications define which tables and changes are replicated from the publisher to the subscribers. To create a publication, use the `CREATE PUBLICATION` command. For example, to replicate changes in the `users` table, you would use:

```sql
CREATE PUBLICATION my_publication FOR TABLE users;
```

You could also create a publication that only publishes specific operations, such as inserts and updates:

```sql
CREATE PUBLICATION my_publication FOR TABLE users WITH (publish = 'insert,update');
```

To add or remove tables from a publication, you can use the `ALTER PUBLICATION` command:

```sql
ALTER PUBLICATION my_publication ADD TABLE sales;
ALTER PUBLICATION my_publication DROP TABLE sales;
```

If you need to remove a publication entirely, you would use the `DROP PUBLICATION` command:

```sql
DROP PUBLICATION IF EXISTS my_publication;
```

### Understanding replication slots

As we mentioned earlier, replication slots are crucial for ensuring data consistency and preventing data loss. You can create a replication slot manually using:

```sql
SELECT pg_create_logical_replication_slot('my_replication_slot', 'pgoutput');
```

To remove a replication slot, you can use:

```sql
SELECT pg_drop_replication_slot('my_replication_slot');
```

In Neon, inactive replication slots are automatically removed after 75 minutes if other active slots exist. This helps prevent storage bloat. If your setup requires a longer inactivity period, [reach out to us](https://neon.tech/docs/introduction/support) so we can modify this for you.

📚 [Check out our docs for detailed instructions on setting up logical replication](https://neon.tech/docs/guides/logical-replication-neon)

## Get started with logical replication guides

To help you get started with logical replication in Neon, we have a series of guides with step-by-step instructions to stream data from your Neon database to different external platforms and services, including:

### Airbyte

[Airbyte](https://neon.tech/docs/guides/logical-replication-airbyte) is an open-source data integration platform that moves data from a source to a destination system. [Check out this guide](https://neon.tech/docs/guides/logical-replication-airbyte) to replicate data from a Neon database to Airbyte.

![Image](https://cdn.neonapi.io/public/images/pages/blog/stream-data-from-neon-to-external-data-sources-via-logical-replication/ad4nxcx45zhyofsrllzo73jnugjpspntphxwz-mmiypix4govvggovbefq4dalklee4j4xzedjw6eywtx60rvfsgfjdkdibrcvzgbkm21n-9vuys9vqs7gdvg1dfux4obqkxtt-v8hrushvzgmiiqkyqg7wo-42964092.png)

### Bemi

[Bemi](https://bemi.io/) is an open-source solution that plugs into Postgres and ORMs such as Prisma, TypeORM, SQLAlchemy, and Ruby on Rails to track database changes automatically. [Check out this guide](https://neon.tech/docs/guides/bemi) to replicate data from a Neon database to Bemi.

![Image](https://cdn.neonapi.io/public/images/pages/blog/stream-data-from-neon-to-external-data-sources-via-logical-replication/ad4nxey5gnj1y62pfdivc-ob-lfgki4kmznc9edpgwtqginohkcnr9knrg9wesjwwg6vidvxgi-vx8gpl7kplgrz-hqnqz7tlkvhfhath6kdcktynqkgbetymdeczlrtfu8-xhwigj-kwqhuiaojxhu5g9m8-b8f3be4c.png)

### DoubleCloud

[DoubleCloud](https://double.cloud/) is a managed data platform that helps engineering teams build data infrastructure with open-source technologies. [Check out this guide](https://neon.tech/docs/guides/logical-replication-clickhouse) to replicate data from a Neon database to ClickHouse via DoubleCloud.

![Image](https://cdn.neonapi.io/public/images/pages/blog/stream-data-from-neon-to-external-data-sources-via-logical-replication/ad4nxedlhcqhnwakkigyix1greffqajcq7mizyaz2i3xjhgrp6vwrojgjdupde2kkoub4z1nerlmlis8dgkcso1p5nlvipuwbkk45nbrfgowkml7-k7nxjpzcy4nmxiitg4rdb14obmnnnevmjwtfmq4avaueo-af5d10f2.png)

### Fivetran

[Fivetran](https://www.fivetran.com/) is a data pipeline platform that helps you centralize data from disparate sources. [Check out this guide](https://neon.tech/docs/guides/logical-replication-fivetran) to replicate data from a Neon database to Fivetran.

![Image](https://cdn.neonapi.io/public/images/pages/blog/stream-data-from-neon-to-external-data-sources-via-logical-replication/ad4nxfl1tja1gvmpkf2cp3azjabdzsbv31-rxqvs4zdlaxisktbqqn8f28xu5faqdzcl1y7wtydqcxgve1tlmo46feqen2qzyujki4vdy1p2zmzqwnedpdagbbl-pba25q7ofp6xgvuqb9id06wjp5i8ekkg0t-adc7bc84.png)

### Kafka via Confluent

[Confluent](https://neon.tech/docs/guides/logical-replication-kafka-confluent) is a fully managed, cloud-native real-time data streaming service built on Apache Kafka. [Check out this guide](https://neon.tech/docs/guides/logical-replication-kafka-confluent) to replicate data from a Neon database to Confluent.

![Image](https://cdn.neonapi.io/public/images/pages/blog/stream-data-from-neon-to-external-data-sources-via-logical-replication/ad4nxd9csjurfvsgssbnlojpknjvm7lkikk0cueehgi2uhjpmqd5fvw5vfc-qfpmoti46xmhkylj2efkr4xjcps3odmtkskqpxergwvm2qmuebppnp2bkejyoi0lwdsh0k2t0ovsjq6g2pqhbmfrdfqawoek0-7001418e.png)

### Materialize

[Materialize](https://materialize.com/) is a data warehouse for operational workloads, purpose-built for low-latency applications. [Check out this guide](https://neon.tech/docs/guides/logical-replication-materialize) to replicate data from a Neon database to Materialize.

![Image](https://cdn.neonapi.io/public/images/pages/blog/stream-data-from-neon-to-external-data-sources-via-logical-replication/ad4nxcqnarvkpiqlyofkww1nap-qw-77jbqgqkaad7xvrpaxtjtbech2medlxljioeb8ieaqfclfeewm-r8aqlntrhgya-xpzjuawz31siwzdprazx58gw7a-tapln3tnixsfyvvkvqsdbyucqauoatswpw-e510be23.png)

### Decodable

[Decodable](https://www.decodable.co/) is a fully managed platform for ETL, ELT, and stream processing, powered by Apache Flink® and Debezium. [Check out this guide](https://neon.tech/docs/guides/logical-replication-decodable) to replicate data from a Neon database to Decodable.

![Image](https://cdn.neonapi.io/public/images/pages/blog/stream-data-from-neon-to-external-data-sources-via-logical-replication/ad4nxdmgywpjzcrxjxr1suwklevsmfh2omstkyv2pjecoxt12dbio-4qc1mwozz-kzpv3u0gxp5v-6qzzhqe3ngdwy-qyyldubmvs8mk1clwm4dax54ldpuartumkiszhqsjmo7yqjvq8oazcrgwkkg8fgfl-5afaa096.png)

### Sequin

[Sequin](https://sequin.io/) is a serverless messaging stream for API integrations. [Check out this guide](https://neon.tech/docs/guides/sequin) to replicate data from a Neon database to Sequin.

![Image](https://cdn.neonapi.io/public/images/pages/blog/stream-data-from-neon-to-external-data-sources-via-logical-replication/ad4nxdyow2jhgvhcup0yf6qdbxrjmwkvjignqmcswd-chovrgvwrphthxxojwxyqfyvvdsvjunvwejxy-vlgqio9fkjafkuzhgl7zoykw67n1h9x7njlq6ie4crlq8vp8aacprnqhtcvv5tkekzqv6oeoa3kt-8db63148.png)

## Try it: create a Neon account for free

You can get started with logical replication and Neon right away. [Create an account in our Free Plan](https://console.neon.tech/signup), no credit card required. And [keep an eye on our docs](https://neon.tech/docs/guides/integrations#replicate) for more logical replication guides to come!
