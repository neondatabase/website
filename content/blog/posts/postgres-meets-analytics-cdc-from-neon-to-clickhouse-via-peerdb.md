---
title: 'Postgres Meets Analytics: CDC From Neon to ClickHouse Via PeerDB'
description: Combining ClickHouse and Neon for real-time analytics on transactional data
excerpt: >-
  If you’re building a data-driven application that handles large amounts of
  data, you may need to balance two different types of databases: a
  purpose-built operational DB for your transactions, and an analytical database
  for large-scale data analysis. A purpose-built analytical da...
date: '2024-10-02T16:39:48'
updatedOn: '2024-10-02T16:39:50'
category: community
categories:
  - community
authors:
  - sai-srirampur
  - bryan-clark
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/postgres-meets-analytics-cdc-from-neon-to-clickhouse-via-peerdb/cover.jpg
  alt: null
isFeatured: false
seo:
  title: 'Postgres Meets Analytics: CDC From Neon to ClickHouse Via PeerDB - Neon'
  description: >-
    You can combine Neon Postgres (for your transactional data) with ClickHouse
    (for your analytics) via PeerDB for your CDC pipelines.
  keywords: []
  noindex: false
  ogTitle: 'Postgres Meets Analytics: CDC From Neon to ClickHouse Via PeerDB - Neon'
  ogDescription: >-
    You can combine Neon Postgres (for your transactional data) with ClickHouse
    (for your analytics) via PeerDB for your CDC pipelines.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/postgres-meets-analytics-cdc-from-neon-to-clickhouse-via-peerdb/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/postgres-meets-analytics-cdc-from-neon-to-clickhouse-via-peerdb/neon-clickhouse-1-1024x576-bec8630e.jpg)

If you’re building a data-driven application that handles large amounts of data, you may need to balance two different types of databases: a purpose-built operational DB for your transactions, and an analytical database for large-scale data analysis. A purpose-built analytical database can handle the fast analytical processing you may need (e.g., for real-time dashboards) without burdening the transactional database, which remains optimized for quick and precise row-level operations.

## Combining Neon and ClickHouse: operational efficiency with large-scale analytics

A nice pair to know are [Neon](https://neon.tech) and [ClickHouse](https://clickhouse.cloud/). Neon is a serverless Postgres service that excels at handling transactional workloads with cost-efficiency thanks to features like autoscaling, scale-to-zero, and branching. On the other hand, ClickHouse is a high-performance columnar database optimized for real-time analytics and handling large volumes of data with no compromise on speed and efficiency. Both Neon and ClickHouse evolve from the same ethos of open source, which makes this combination even more compelling.

By combining Neon and ClickHouse, you get the best of both worlds—Neon for building low-latency transactional web applications (OLTP) and ClickHouse for blazing-fast analytics (OLAP). Here are a couple important use cases that this combination enables:

- **Real-time customer facing analytics**: You can continuously sync data from Neon to ClickHouse using [Change Data Capture](https://en.wikipedia.org/wiki/Change_data_capture) (CDC) and use ClickHouse to run real-time customer-facing analytics on your transactional data.
- **Application source of truth + Data Warehousing**: By sending CDC to a data warehouse like ClickHouse, Neon can serve as the system of record for your web application. This keeps your application code simpler and Postgres lightweight, ensuring super low latency for your transactional applications. Simpler code and you still benefit from the analytical power of ClickHouse.

## PeerDB brings Neon and ClickHouse closer together

Now that we understand Neon and ClickHouse can be a great duo for developers, let’s see how we can bring them together. The answer is [PeerDB](https://www.peerdb.io/) – PeerDB is a leading provider of Change Data Capture (CDC) solutions for Postgres. Their technology enables real-time data replication and synchronization, helping businesses keep their data up-to-date and accessible for analytics and decision-making.

A few months ago, ClickHouse [acquired](https://clickhouse.com/blog/clickhouse-welcomes-peerdb-adding-the-fastest-postgres-cdc-to-the-fastest-olap-database) PeerDB to make it seamless for customers to move data from their Postgres databases to ClickHouse and power real-time analytics and data warehousing use cases.

PeerDB natively supports Neon Postgres as a source. This enables customers to replicate their transactional data from Neon to ClickHouse for real-time analytics.

Under the hood, PeerDB relies on Postgres logical replication for CDC. It implements multiple Postgres native optimizations to provide a 10x faster and more reliable replication experience to ClickHouse. The good news is that Neon supports Postgres logical replication out-of-the-box. Hence all the PeerDB optimizations can be extended to Neon out-of-the-box.

PeerDB is available in both [open source](https://github.com/PeerDB-io/peerdb) and [cloud](https://peerdb.cloud/) offerings, and the ClickHouse team is actively working on integrating PeerDB into [ClickPipes](https://clickhouse.com/cloud/clickpipes), the native ingestion service for ClickHouse. PeerDB will power the Postgres CDC connector in ClickPipes. Neon is planned to be supported as a source in ClickPipes.

## Streaming data from Neon to ClickHouse using PeerDB

<YoutubeIframe embedId="7Yk5_8oJapo" isDocPost={false} />

Now, let’s quickly walk through how easy it is to set up replication from Neon to ClickHouse using PeerDB. Visit [the PeerDB docs](https://docs.peerdb.io/mirror/cdc-neon-clickhouse) for a complete step-by-step walkthrough.

### Configuring Neon (origin)

_Detailed instructions_ [here](https://docs.peerdb.io/connect/postgres/neon_postgres)

**Create a user and publication in Neon**

In the Neon SQL console, create a user for PeerDB with the necessary permissions and set up a publication to start tracking data changes:

```sql
  CREATE USER peerdb_user PASSWORD 'peerdb_password';
  GRANT USAGE ON SCHEMA "public" TO peerdb_user;
  GRANT SELECT ON ALL TABLES IN SCHEMA "public" TO peerdb_user;
  ALTER DEFAULT PRIVILEGES IN SCHEMA "public" GRANT SELECT ON TABLES TO peerdb_user;

-- Give replication permission to the USER
  ALTER USER peerdb_user REPLICATION;

-- Create a publication. We will use this when creating the mirror
  CREATE PUBLICATION peerdb_publication FOR ALL TABLES;
```

**Enable logical replication in Neon**

Go to your Neon project settings in the console, and enable logical replication. Also, verify the settings for `wal_level`, `max_wal_senders`, and `max_replication_slots`:

![Image](https://cdn.neonapi.io/public/images/pages/blog/postgres-meets-analytics-cdc-from-neon-to-clickhouse-via-peerdb/ad4nxdakeqfj6qgpf5zarnhp635vrrg6bcohedbnp5ntjo9lk6rrppydsg315jdzdi6m9pgfbdoqmtf20x6fnbwpg4jgjcmis1ovh8rabd0shq4um5gp91wzrmtilsnk5le-lgqian-6ba2tpfd1y1am3a5vw-d2552f03.png)

```sql
SHOW wal_level; -- should be logical
SHOW max_wal_senders; -- should be 10
SHOW max_replication_slots; -- should be 10
```

**Get connection details**

Copy the connection string details from your Neon dashboard:

![Image](https://cdn.neonapi.io/public/images/pages/blog/postgres-meets-analytics-cdc-from-neon-to-clickhouse-via-peerdb/ad4nxfmnnkn8wuci9dnwbzpwisnu5oxzfg1qzghvunhxb7kywakfvlasfapcxu1urov2bsxrtjkvklw4igrhj2ylnsrdk0kicxciix8lez-1qujkps2u3f1nh4x4xtwbcxbu1dkqryw6nur6gb2zle7oou-644de4bf.png)

### Creating a Neon peer

In PeerDB’s UI, create a Neon Postgres peer using the connection details. Validate and create the peer:

![Image](https://cdn.neonapi.io/public/images/pages/blog/postgres-meets-analytics-cdc-from-neon-to-clickhouse-via-peerdb/ad4nxfvbbtovalngjq-vfy0fonxdjkjpj1fstgjrl85mmct17gghn8df1iywtxikjamxvhnb9ep49ze7e3nibpbzj-zin0odejtde3oovd1aegrpk-sdf2acrp-o3kc5pdp5s9pk3k5nf1aa6ocufpsgj8-d0ce2bf0.png)

![Image](https://cdn.neonapi.io/public/images/pages/blog/postgres-meets-analytics-cdc-from-neon-to-clickhouse-via-peerdb/ad4nxcmwv9wut4hllozamllvco2wtozeair8vpzluchuwksk9k4n3pwwuw57npcnh8w2khruwuqc3a5aqyh3top2lj-auijo1wrtnyfopre-hzqonfz9et6adxncedwhy6qz6ewowgko9hagtnwfuyy4us-0dd07f24.png)

### Configuring ClickHouse (destination)

_Detailed instructions_ [here](https://docs.peerdb.io/connect/clickhouse/clickhouse-cloud)

**Create a destination database**

Via the ClickHouse SQL Console, create a database for syncing:

```sql
CREATE DATABASE peerdb;
```

![Image](https://cdn.neonapi.io/public/images/pages/blog/postgres-meets-analytics-cdc-from-neon-to-clickhouse-via-peerdb/ad4nxclbuix8fcvhyj-qpjpl7036yodxkuvizaqie95klwhoscjnbh3m1glpuhtvth3ijopdfqd6etk50rrq8q0dbnn1xaieiehqsxq3aqykev7ecnwzm3fgmpzjxl256aybt1qp5sawfqp7dj8ay3ipx4xol-a40c5b3d.png)

**Create a ClickHouse user with the necessary permissions**

Set up a `peerdb_user` with permissions for `INSERT`, `SELECT`, `DROP`, and `ALTER`:

```sql
CREATE USER peerdb_user IDENTIFIED BY '<password>';
GRANT INSERT, SELECT, DROP, CREATE TABLE, ALTER ADD COLUMN ON peerdb.* TO peerdb_user;
GRANT CREATE TEMPORARY TABLE, s3 ON *.* TO peerdb_user;
```

### Create a ClickHouse peer

In PeerDB UI, configure the peer with your connection details, and click “Create” once validating the connection:

![Image](https://cdn.neonapi.io/public/images/pages/blog/postgres-meets-analytics-cdc-from-neon-to-clickhouse-via-peerdb/ad4nxdoxtl9rqd8xdf9xxjvoxmjp8chiaogrdrahrmkq-vhftrmjkkqlqjup-rlmytcppcjlity3fpzenak4feb6eeq7ke7bg82n4gxe1u19l6hp0hjvqxjnefvb5brdcgtu81zdzgls3qytt6fjwcpcgg-d9146f8e.png)

### Setting up CDC from Neon to ClickHouse

_Detailed instructions_ [here](https://docs.peerdb.io/mirror/cdc-neon-clickhouse)

Once you’ve configured Neon and ClickHouse in PeerDB, the data synchronization follows these steps:

1- **Go to the Mirrors tab** in the PeerDB UI:

![Image](https://cdn.neonapi.io/public/images/pages/blog/postgres-meets-analytics-cdc-from-neon-to-clickhouse-via-peerdb/ad4nxeg4laskz8vuc2stdwc4snyi4j1lw1fgccgnmn3a-xf4ztsicewykwve8n5qgasx2i0hrxprrgbt6wqgvzdnivnbkle6kjlercwaffgfl-czepw0imcdidnec3hpkmqsertewzufmha6yrwwbgr54-ddeb0dc5.png)

2- **Create a new Mirror** and select **CDC** as the mirror type for real-time replication

3- **Name the Mirror** (e.g., `neon_to_clickhouse`)

4- **Select the source and destination peers** you configured for Neon and ClickHouse

![Image](https://cdn.neonapi.io/public/images/pages/blog/postgres-meets-analytics-cdc-from-neon-to-clickhouse-via-peerdb/ad4nxdmfmo1opexaguji-fuldjjyb6wrxky5dyshowcfgpqvgpr8hho5vwgqvmp7cpflbznaoyco2m0vqr3fbxblrhrhekdlonkbb4vjo1fsekg8zacfzku8idxhckxlfptdlmgzgimt3aahj-77afpd8sui-5bab11ce.png)

5- **Configure sync settings** according to the instructions [here](https://docs.peerdb.io/mirror/cdc-neon-clickhouse) (e.g., initial snapshot, publication, and replication slot names)

6- **Select the Postgres tables** you want to replicate

![Image](https://cdn.neonapi.io/public/images/pages/blog/postgres-meets-analytics-cdc-from-neon-to-clickhouse-via-peerdb/ad4nxfc08ctoskscruzbns7xg9phdwjnardw8wth9nwnwwbrhauvfaksevz-0o5rd0asctpd6vtqvn3rigf7g4xyfaympkd-usjq-89ijqvinhpmxj9hrsrp-0bsazdy8oz96nbvmagmdrw-dadx4lhra3vygl-32183d6b.png)

**7- Validate and Create** the mirror. This will start the continuous sync between Neon and ClickHouse, ensuring real-time data updates.

## Getting started

To get started:

- Create accounts with [Neon](https://neon.tech/docs/get-started-with-neon/signing-up) and [ClickHouse](https://clickhouse.com/docs/en/cloud-quick-start).
- Sign up [PeerDB Cloud](https://peerdb.cloud/) for seamless CDC from Neon to ClickHouse.

If you have any questions, we’ll be happy to help in the [ClickHouse Slack](https://clickhouse.com/slack) and the [Neon Discord](https://discord.gg/92vNTzKDGp).
