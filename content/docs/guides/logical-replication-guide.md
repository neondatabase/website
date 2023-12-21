---
title: Get started with logical replication
subtitle: Learn how to replicate data from Neon to external data platforms and services
enableTableOfContents: true
isDraft: true
---

<Admonition type="note">
Logical replication in Neon is currently in Beta. We welcome your feedback to help improve this feature. You can provide feedback via the **Feedback** link in the Neon Console or by reaching out to us on [Discord](https://t.co/kORvEuCUpJ).
</Admonition>

Logical replication enables replicating data from your Neon databases to a variety of external destinations, including data warehouses, analytical database services, messaging platforms, event-streaming platforms, and external Postgres databases.

![Neon logical replication subscribers image](/docs/guides/logical_replication_subscribers.png)

Logical replication in Neon works like it does on any standard Postgres installation. It uses a publish and subscribe model to replicate data from the source database to the destination.

Replication starts by copying a snapshot of the data from the publisher to the subscriber. Once this is done, subsequent changes are sent to the subscriber as they occur in real-time.

To get started, jump into one of our step-by-step [logical replication guides](#logical-replication-guides).

To learn more about Postgres logical replication, see [Learn about logical replication](#learn-about-logical-replication).

## Logical replication guides

<TechnologyNavigation>

<img src="/images/technology-logos/airbyte-logo.svg" width="36" height="36" alt="Airbyte" href="/docs/guides/logical-replication-airbyte" title="Replicate data from Neon with Airbyte" />

<img src="/images/technology-logos/kafka-logo.svg" width="36" height="36" alt="Kafka" href="/docs/guides/logical-replication-kafka-confluent" title="Replicate data from Neon with Kafka (Confluent)" />

<img src="/images/technology-logos/materialize-logo.svg" width="36" height="36" alt="Materialize" href="/docs/guides/logical-replication-materialize" title="Replicate data from Neon to Materialize" />

<img src="/images/technology-logos/postgresql-logo.svg" width="36" height="36" alt="Postgres" href="/docs/guides/logical-replication-postgres" title="Replicate data from Neon to PostgreSQL" />

</TechnologyNavigation>

## Learn about logical replication

<DetailIconCards>

<a href="/docs/guides/logical-replication-concepts" description="Learn about Postgres logical replication concepts" icon="scale-up">Logical replication concepts</a>

<a href="/docs/guides/logical-replication-neon" description="Learn how to manage logical replication in Neon" icon="screen">Manage logical replication</a>

</DetailIconCards>