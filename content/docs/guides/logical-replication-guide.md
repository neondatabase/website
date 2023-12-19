---
title: Get started with logical replication
subtitle: Learn how to replicate data from Neon to external data platforms and services
enableTableOfContents: true
isDraft: true
---

Neon's logical replication feature allows you to replicate data from your Neon database to external destinations. These destinations might include data warehouses, analytical database services, real-time stream processing systems, messaging and event-streaming platforms, change data capture (CDC) ecosystems, or external Postgres databases, among others.

Logical replication in Neon works in the same way as logical replication on a standard Postgres installation. It uses a publish and subscribe model to replicate data from the source database to the destination, or in Postgres terms, from the publisher to the subscriber.

Replication starts by copying a snapshot of the data from the publisher to the subscriber. Once this is done, subsequent changes are sent to the subscriber as they occur in real-time. Replicated changes are then applied in the order they were committed on the publisher in order to maintain transactional consistency on the subscriber.

To learn more about Postgres logical replication concepts and syntax, see [Logical replication basics](/docs/guides/logical-replication-basics). For the specifics and limitations of logical replication in Neon, see [Logical replication in Neon](/docs/guides/logical-replication-neon). If you just want to get started, jump into one of our step-by-step [logical replication guides](#logical-replication-guides).

## Learn about logical replication

<DetailIconCards>

<a href="/docs/guides/logical-replication-basics" description="Learn about Postgres logical replication concepts and syntax" icon="scale-up">Logical replication basics</a>

<a href="/docs/guides/logical-replication-neon" description="Learn about logical replicatiion specifics and limitations in Neon" icon="screen">Logical replication in Neon</a>

</DetailIconCards>

## Logical replication guides

<TechnologyNavigation>

<img src="/images/technology-logos/airbyte-logo.svg" width="36" height="36" alt="Airbyte" href="/docs/guides/logical-replication-airbyte" title="Replicate data from Neon with Airbyte" />

<img src="/images/technology-logos/confluent-logo.svg" width="36" height="36" alt="Confluent" href="/docs/guides/logical-replication-confluent" title="Replicate data from Neon to Confluent" />

<img src="/images/technology-logos/materialize-logo.svg" width="36" height="36" alt="Materialize" href="/docs/guides/logical-replication-materialize" title="Replicate data from Neon to Materialize" />

<img src="/images/technology-logos/postgresql-logo.svg" width="36" height="36" alt="Postgres" href="/docs/guides/logical-replication-postgres" title="Replicate data from Neon to PostgreSQL" />

</TechnologyNavigation>