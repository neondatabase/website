---
title: Get started with logical replication
subtitle: Learn how to stream data from Neon to external data platforms and services
enableTableOfContents: true
isDraft: false
updatedOn: '2024-08-15T17:23:10.557Z'
---

<Admonition type="note">
Logical replication in Neon is currently in Beta. We welcome your feedback to help improve this feature. You can provide feedback via the [Feedback](https://console.neon.tech/app/projects?modal=feedback) form in the Neon Console or by reaching out to us on [Discord](https://t.co/kORvEuCUpJ).
</Admonition>

Logical replication enables replicating data from your Neon database to external destinations, allowing for Change Data Capture (CDC) and real-time analytics. Stream your data to data warehouses, analytical database services, messaging platforms, event-streaming platforms, external Postgres databases, and more.

![Neon logical replication subscribers image](/docs/guides/logical_replication_subscribers.png)

Logical replication in Neon works like it does on any standard Postgres installation. It uses a publish and subscribe model to replicate data from the source database to the destination.

Replication starts by copying a snapshot of the data from the publisher to the subscriber. Once this is done, subsequent changes are sent to the subscriber as they occur in real-time.

To get started, jump into one of our step-by-step [logical replication guides](#logical-replication-guides).

To learn more about Postgres logical replication, see [Learn about logical replication](#learn-about-logical-replication).

## Logical replication guides

<TechnologyNavigation open>

<a href="/docs/guides/logical-replication-airbyte" title="Airbyte" description="Replicate data from Neon with Airbyte" icon="airbyte"></a>

<a href="/docs/guides/bemi" title="Bemi" description="Create an automatic audit trail with Bemi" icon="bemi"></a>

<a href="/docs/guides/logical-replication-clickhouse" title="ClickHouse" description="Replicate data from Neon to ClickHouse (DoubleCloud)" icon="clickhouse"></a>

<a href="/docs/guides/logical-replication-fivetran" title="Fivetran" description="Replicate data from Neon with Fivetran" icon="fivetran"></a>

<a href="/docs/guides/logical-replication-kafka-confluent" title="Kafka" description="Replicate data from Neon with Kafka (Confluent)" icon="kafka"></a>

<a href="/docs/guides/logical-replication-materialize" title="Materialize" description="Replicate data from Neon to Materialize" icon="materialize"></a>

<a href="/docs/guides/logical-replication-prisma-pulse" title="Prisma Pulse" description="Stream database changes in real-time with Prisma Pulse" icon="prisma"></a>

<a href="/docs/guides/logical-replication-postgres" title="Postgres" description="Replicate data from Neon to PostgreSQL" icon="postgresql"></a>

</TechnologyNavigation>

## Learn about logical replication

<DetailIconCards>

<a href="/docs/guides/logical-replication-concepts" description="Learn about Postgres logical replication concepts" icon="scale-up">Logical replication concepts</a>

<a href="/docs/guides/logical-replication-neon" description="Learn how to manage logical replication in Neon" icon="screen">Manage logical replication</a>

</DetailIconCards>
