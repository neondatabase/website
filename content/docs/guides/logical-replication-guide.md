---
title: Get started with logical replication
subtitle: Learn how to replicate data from Neon to external data platforms and services
enableTableOfContents: true
isDraft: true
---

Neon's logical replication feature allows you to replicate data from your Neon database to external destinations. These destinations might include data warehouses, analytical database services, real-time stream processing systems, messaging and event-streaming platforms, change data capture (CDC) ecosystems, or external Postgres databases, among others.

![Neon logical replication subscribers image](/docs/guides/logical_replication_subscribers.png)

Logical replication in Neon works in the same way as logical replication on a standard Postgres installation, using a publish and subscribe model to replicate data from the source database to the destination.

Replication starts by copying a snapshot of the data from the publisher to the subscriber. Once this is done, subsequent changes are sent to the subscriber as they occur in real-time. Replicated changes are then applied in the order they were committed on the publisher to maintain transactional consistency on the subscriber.

To learn more about Postgres logical replication, see [Logical replication basics](/docs/guides/logical-replication-concepts). For information about managing logical replication in Neon, see [Manage logical replication](/docs/guides/logical-replication-neon). 

If you just want to get started, jump into one of our step-by-step [logical replication guides](#logical-replication-guides).

## Learn about logical replication

<DetailIconCards>

<a href="/docs/guides/logical-replication-concepts" description="Learn about Postgres logical replication concepts" icon="scale-up">Logical replication concepts</a>

<a href="/docs/guides/logical-replication-neon" description="Learn about managing logical replication in Neon" icon="screen">Manage logical replication</a>

</DetailIconCards>

## Logical replication guides

<TechnologyNavigation>

<img src="/images/technology-logos/airbyte-logo.svg" width="36" height="36" alt="Airbyte" href="/docs/guides/logical-replication-airbyte" title="Replicate data from Neon with Airbyte" />

<img src="/images/technology-logos/confluent-logo.svg" width="36" height="36" alt="Kafka" href="/docs/guides/logical-replication-kafka-confluent" title="Replicate data from Neon with Kafka (Confluent)" />

<img src="/images/technology-logos/materialize-logo.svg" width="36" height="36" alt="Materialize" href="/docs/guides/logical-replication-materialize" title="Replicate data from Neon to Materialize" />

<img src="/images/technology-logos/postgresql-logo.svg" width="36" height="36" alt="Postgres" href="/docs/guides/logical-replication-postgres" title="Replicate data from Neon to PostgreSQL" />

</TechnologyNavigation>