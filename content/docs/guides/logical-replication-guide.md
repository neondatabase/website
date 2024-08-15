---
title: Get started with logical replication
subtitle: Learn how to replicate data to and from your Neon Postgres database
enableTableOfContents: true
isDraft: false
redirectFrom:
  - /docs/introduction/logical-replication
updatedOn: '2024-08-07T11:38:14.263Z'
---

<Admonition type="note">
Logical replication in Neon is currently in Beta. We welcome your feedback to help improve this feature. You can provide feedback via the [Feedback](https://console.neon.tech/app/projects?modal=feedback) form in the Neon Console or by reaching out to us on [Discord](https://t.co/kORvEuCUpJ).
</Admonition>

Neon's logical replication feature, available to all Neon users, allows you to replicate data to and from your Neon Postgres database:

- Perform live migrations to Neon from external sources such as AWS RDS, Aurora, and Google Cloud SQL &#8212; or any platform that runs Postgres.
- Stream data from your Neon database to external destinations, enabling Change Data Capture (CDC) and real-time analytics. External sources might might include data warehouses, analytical database services, real-time stream processing systems, messaging and event-streaming platforms, and external Postgres databases, among others.
- Replicate data from one Neon project to another for Neon project, account, Postgres version, or region migration.

![Neon logical replication subscribers image](/docs/guides/logical_replication_publishers_subscribers.jpg)

Logical replication in Neon works like it does on any standard Postgres installation. It uses a publisher-subscriber model to replicate data from the source database to the destination database. Neon can act as a publisher or subscriber.

Replication starts by copying a snapshot of the data from the publisher to the subscriber. Once this is done, subsequent changes are sent to the subscriber as they occur in real-time.

To learn more about Postgres logical replication, see the following topics.

## Learn about logical replication

<DetailIconCards>

<a href="/docs/guides/logical-replication-concepts" description="Learn about Postgres logical replication concepts" icon="scale-up">Logical replication concepts</a>

<a href="/docs/guides/logical-replication-neon" description="Learn how to manage logical replication in Neon" icon="screen">Manage logical replication</a>

</DetailIconCards>

To get started, jump into one of our step-by-step logical replication guides.

## Replicate from Neon

<TechnologyNavigation open>

<img src="/images/technology-logos/airbyte-logo.svg" width="36" height="36" alt="Airbyte" href="/docs/guides/logical-replication-airbyte" title="Replicate data from Neon with Airbyte" />

<img src="/images/technology-logos/bemi-logo.svg" width="36" height="36" alt="Bemi" href="/docs/guides/bemi" title="Create an automatic audit trail with Bemi" />

<img src="/images/technology-logos/clickhouse-logo.svg" width="36" height="36" alt="ClickHouse" href="/docs/guides/logical-replication-clickhouse" title="Replicate data from Neon to ClickHouse (DoubleCloud)" />

<img src="/images/technology-logos/decodable-logo.svg" width="36" height="36" alt="Decodable" href="/docs/guides/logical-replication-decodable" title="Replicate data from Neon with Decodable" />

<img src="/images/technology-logos/fivetran-logo.svg" width="36" height="36" alt="Fivetran" href="/docs/guides/logical-replication-fivetran" title="Replicate data from Neon with Fivetran" />

<img src="/images/technology-logos/kafka-logo.svg" width="36" height="36" alt="Kafka" href="/docs/guides/logical-replication-kafka-confluent" title="Replicate data from Neon with Kafka (Confluent)" />

<img src="/images/technology-logos/materialize-logo.svg" width="36" height="36" alt="Materialize" href="/docs/guides/logical-replication-materialize" title="Replicate data from Neon to Materialize" />

<img src="/images/technology-logos/postgresql-logo.svg" width="36" height="36" alt="PostgreSQL" href="/docs/guides/logical-replication-postgres" title="Replicate data from Neon to PostgreSQL" />

</TechnologyNavigation>

## Replicate to Neon

<TechnologyNavigation open>

<img src="/images/technology-logos/alloydb-logo.svg" width="36" height="36" alt="AlloyDB" href="/docs/guides/logical-replication-alloydb" title="Replicate data from AlloyDB to Neon" />

<img src="/images/technology-logos/aws-rds-logo.svg" width="36" height="36" alt="Aurora" href="/docs/guides/logical-replication-aurora-to-neon" title="Replicate data from Aurora to Neon" />

<img src="/images/technology-logos/google-cloud-sql-logo.svg" width="36" height="36" alt="Cloud SQL" href="/docs/guides/logical-replication-cloud-sql" title="Replicate data from Cloud SQL to Neon" />

<img src="/images/technology-logos/neon-logo.svg" width="36" height="36" alt="Neon to Neon" href="/docs/guides/logical-replication-neon-to-neon" title="Replicate data from Neon to Neon" />

<img src="/images/technology-logos/postgresql-logo.svg" width="36" height="36" alt="Postgres" href="/docs/guides/logical-replication-postgres" title="Replicate data from PostgreSQL to Neon" />

<img src="/images/technology-logos/sequin-logo.svg" width="36" height="36" alt="Sequin" href="/docs/guides/sequin" title="Stream data from platforms like Stripe, Linear, and GitHub to Neon" />

<img src="/images/technology-logos/aws-rds-logo.svg" width="36" height="36" alt="AWS RDS" href="/docs/guides/logical-replication-rds-to-neon" title="Replicate data from AWS RDS PostgreSQL to Neon" />

</TechnologyNavigation>
