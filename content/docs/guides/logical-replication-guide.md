---
title: Get started with logical replication
subtitle: Learn how to replicate data to and from your Neon Postgres database
enableTableOfContents: true
isDraft: false
redirectFrom:
  - /docs/introduction/logical-replication
updatedOn: '2024-08-21T16:47:59.615Z'
---

<LRBeta/>

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

<a href="/docs/guides/logical-replication-manage" description="Commands for managing your logical replication configuration" icon="cli">Logical replication commands</a>

<a href="/docs/guides/logical-replication-neon" description="Information about logical replication specific to Neon" icon="screen">Logical replication in Neon</a>

</DetailIconCards>

To get started, jump into one of our step-by-step logical replication guides.

## Replicate data from Neon

<TechnologyNavigation open>

<a href="/docs/guides/logical-replication-airbyte" title="Airbyte" description="Replicate data from Neon with Airbyte" icon="airbyte"></a>

<a href="/docs/guides/bemi" title="Bemi" description="Create an automatic audit trail with Bemi" icon="bemi"></a>

<a href="https://docs.peerdb.io/mirror/cdc-neon-clickhouse" title="ClickHouse" description="Change Data Capture from Neon to ClickHouse with PeerDB (PeerDB docs)" icon="clickhouse"></a>

<a href="https://docs.peerdb.io/connect/postgres/neon_postgres" title="ClickHouse" description="Create a Neon Postgres peer for replication with PeerDB (PeerDB docs)" icon="clickhouse"></a>

<a href="/docs/guides/logical-replication-clickhouse" title="DoubleCloud" description="Replicate data from Neon to ClickHouse with DoubleCloud" icon="neon"></a>

<a href="/docs/guides/logical-replication-kafka-confluent" title="Confluent (Kafka)" description="Replicate data from Neon with Confluent (Kafka)" icon="confluent"></a>

<a href="/docs/guides/logical-replication-decodable" title="Decodable" description="Replicate data from Neon with Decodable" icon="decodable"></a>

<a href="/docs/guides/logical-replication-fivetran" title="Fivetran" description="Replicate data from Neon with Fivetran" icon="fivetran"></a>

<a href="/docs/guides/logical-replication-materialize" title="Materialize" description="Replicate data from Neon to Materialize" icon="materialize"></a>

<a href="/docs/guides/logical-replication-neon-to-neon" title="Neon to Neon" description="Replicate data from Neon to Neon" icon="neon"></a>

<a href="/docs/guides/logical-replication-postgres" title="Neon to PostgreSQL" description="Replicate data from Neon to PostgreSQL" icon="postgresql"></a>

<a href="/docs/guides/logical-replication-airbyte-snowflake" title="Snowflake" description="Replicate data from Neon to Snowflake with Airbyte" icon="snowflake"></a>

</TechnologyNavigation>

## Replicate data to Neon

<TechnologyNavigation open>

<a href="/docs/guides/logical-replication-alloydb" title="AlloyDB" description="Replicate data from AlloyDB to Neon" icon="alloydb"></a>

<a href="/docs/guides/logical-replication-aurora-to-neon" title="Aurora" description="Replicate data from Aurora to Neon" icon="aws-rds"></a>

<a href="/docs/guides/logical-replication-cloud-sql" title="Cloud SQL" description="Replicate data from Cloud SQL to Neon" icon="google-cloud-sql"></a>

<a href="/docs/guides/logical-replication-neon-to-neon" title="Neon to Neon" description="Replicate data from Neon to Neon" icon="neon"></a>

<a href="/docs/guides/logical-replication-postgres-to-neon" title="PostgreSQL to Neon" description="Replicate data from PostgreSQL to Neon" icon="postgresql"></a>

<a href="/docs/guides/sequin" title="Sequin" description="Stream data from platforms like Stripe, Linear, and GitHub to Neon" icon="sequin"></a>

<a href="/docs/guides/logical-replication-rds-to-neon" title="AWS RDS" description="Replicate data from AWS RDS PostgreSQL to Neon" icon="aws-rds"></a>

</TechnologyNavigation>
