---
title: Get started with logical replication
subtitle: Learn how to replicate data to and from your Neon Postgres database
enableTableOfContents: true
isDraft: false
updatedOn: '2024-08-07T11:38:14.263Z'
---

<Admonition type="note">
Logical replication in Neon is currently in Beta. We welcome your feedback to help improve this feature. You can provide feedback via the [Feedback](https://console.neon.tech/app/projects?modal=feedback) form in the Neon Console or by reaching out to us on [Discord](https://t.co/kORvEuCUpJ).
</Admonition>

Logical replication enables replicating data to and from your Neon database. You can perform live migrations to Neon from external sources such as AWS RDS, Aurora, and Google Cloud SQL, for example. You can also replicate data to external destinations, allowing for Change Data Capture (CDC) and real-time analytics. 

Logical replication in Neon works like it does on any standard Postgres installation. It uses a publisher-subscriber model to replicate data from the source database to the destination database.

Replication starts by copying a snapshot of the data from the publisher to the subscriber. Once this is done, subsequent changes are sent to the subscriber as they occur in real-time.

To learn more about Postgres logical replication, see the following topics.

## Learn about logical replication

<DetailIconCards>

<a href="/docs/guides/logical-replication-concepts" description="Learn about Postgres logical replication concepts" icon="scale-up">Logical replication concepts</a>

<a href="/docs/guides/logical-replication-neon" description="Learn how to manage logical replication in Neon" icon="screen">Manage logical replication</a>

</DetailIconCards>

To get started, jump into one of our step-by-step logical replication guides.

## Logical replication guides

<TechnologyNavigation open>

<img src="/images/technology-logos/airbyte-logo.svg" width="36" height="36" alt="Airbyte" href="/docs/guides/logical-replication-airbyte" title="Replicate data from Neon with Airbyte" />

<img src="/images/technology-logos/bemi-logo.svg" width="36" height="36" alt="Bemi" href="/docs/guides/bemi" title="Create an automatic audit trail with Bemi" />

<img src="/images/technology-logos/clickhouse-logo.svg" width="36" height="36" alt="ClickHouse" href="/docs/guides/logical-replication-clickhouse" title="Replicate data from Neon to ClickHouse (DoubleCloud)" />

<img src="/images/technology-logos/fivetran-logo.svg" width="36" height="36" alt="Fivetran" href="/docs/guides/logical-replication-fivetran" title="Replicate data from Neon with Fivetran" />

<img src="/images/technology-logos/kafka-logo.svg" width="36" height="36" alt="Kafka" href="/docs/guides/logical-replication-kafka-confluent" title="Replicate data from Neon with Kafka (Confluent)" />

<img src="/images/technology-logos/materialize-logo.svg" width="36" height="36" alt="Materialize" href="/docs/guides/logical-replication-materialize" title="Replicate data from Neon to Materialize" />

<img src="/images/technology-logos/postgresql-logo.svg" width="36" height="36" alt="Postgres" href="/docs/guides/logical-replication-postgres" title="Replicate data from Neon to PostgreSQL" />

</TechnologyNavigation>
