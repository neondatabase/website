---
title: >-
  Build a Real-time Materialized View from Postgres Changes using Confluent’s
  ksqlDB
description: >-
  Learn how to stream Postgres database changes to Apache Kafka and build a
  materialized view that updates in real-time using ksqlDB.
excerpt: >-
  Neon’s support for Postgres’ logical replication features opens up a variety
  of interesting use cases, including for real-time streaming architectures
  based on change data capture. We previously demonstrated how to use Debezium
  to fan-out changes from Postgres by using Redis as a...
date: '2024-02-28T17:33:42'
updatedOn: '2024-02-29T09:42:03'
category: postgres
categories:
  - postgres
  - community
authors:
  - evan-shortiss
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/real-time-materialized-view-postgres-kafka-ksqldb/cover.jpeg
  alt: null
isFeatured: false
seo:
  title: >-
    Build a Real-time Materialized View from Postgres Changes using Confluent's
    ksqlDB - Neon
  description: >-
    Learn how to stream Postgres database changes to Apache Kafka and build a
    materialized view that updates in real-time using ksqlDB.
  keywords: []
  noindex: false
  ogTitle: >-
    Build a Real-time Materialized View from Postgres Changes using Confluent's
    ksqlDB - Neon
  ogDescription: >-
    Neon’s support for Postgres’ logical replication features opens up a variety
    of interesting use cases, including for real-time streaming architectures
    based on change data capture. We previously demonstrated how to use Debezium
    to fan-out changes from Postgres by using Redis as a message broker. Today
    we’ll explore how you can leverage the Apache Kafka and […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/real-time-materialized-view-postgres-kafka-ksqldb/social.jpg
source:
  wpId: 4909
  wpSlug: real-time-materialized-view-postgres-kafka-ksqldb
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/real-time-materialized-view-postgres-kafka-ksqldb/neon-ksqldb-materialized-views-1024x576-45232e8f.jpeg)

Neon’s support for Postgres’ logical replication features opens up a variety of interesting use cases, including for real-time streaming architectures based on [change data capture](https://neon.tech/blog/change-data-capture-with-serverless-postgres#why-cdc-matters). We previously demonstrated how to use [Debezium to fan-out changes](https://neon.tech/blog/fan-out-postgres-changes-using-debezium-and-upstash-redis) from Postgres by using Redis as a message broker.

Today we’ll explore how you can leverage the [Apache Kafka](https://kafka.apache.org/) and [Kafka Connect](https://kafka.apache.org/documentation/#connect) ecosystem to capture and process changes from your Neon Postgres database. Specifically, you’ll learn how to stream changes from Postgres to Apache Kafka and process those changes using [ksqlDB](https://ksqldb.io/) to create a [materialized view](https://en.wikipedia.org/wiki/Materialized_view) that updates in response to database changes.

It’s possible to run Apache Kafka, Kafka Connect, and ksqlDB on your infrastructure; however, this guide will be using [Confluent Cloud](https://confluent.cloud/) to host these components so we can focus on enabling data streaming and building a materialized view instead of managing infrastructure.

## Why Apache Kafka with Postgres for Materialized Views?

Postgres is a mature and battle-tested database solution that [supports materialized views](https://www.postgresql.org/docs/current/rules-materializedviews.html), so why do we need messaging infrastructure like Apache Kafka to process events and create a materialized view? We already explained the importance of avoiding the [dual-write problem](https://neon.tech/blog/fan-out-postgres-changes-using-debezium-and-upstash-redis#the-dual-write-problem) when integrating your application with message brokers, so let’s focus on the data streaming and performance concerns instead.

As a reminder, a materialized view stores the result of a query at a specific point in time. Let’s take a look at an example. Imagine you have a write-heavy application that involves two tables represented by the following SQL:

```sql
CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE player_scores (
    id SERIAL PRIMARY KEY,
    score DECIMAL(10, 2) NOT NULL,
    player_id INTEGER REFERENCES players(id),
    CONSTRAINT fk_player
        FOREIGN KEY(player_id)
        REFERENCES players(id)
        ON DELETE CASCADE
);
```

This database contains a `players` table to store player information and a `player_scores` table to track their scores. You might be required to create a leaderboard table that keeps track of each player’s total score (using a [SUM aggregate function](https://www.postgresql.org/docs/15/functions-aggregate.html)), retain a history of these changes, and notify subscribers about changes to the leaderboard in real-time.

Using a materialized view is one option for keeping track of the total scores. The following SQL would create a materialized view to achieve this functionality in Postgres:

```sql
CREATE MATERIALIZED VIEW player_total_scores AS
SELECT
    p.id AS player_id,
    p.name,
    COALESCE(SUM(s.score), 0) AS total_score
FROM
    players p
LEFT JOIN
    player_scores s ON p.id = s.player_id
GROUP BY
    p.id;
```

Keeping the view current requires issuing a `REFRESH MATERIALIZED VIEW` query after each insert to the `player_scores` table. This could have significant performance implications, doesn’t retain leaderboard history, and you still need to stream the changes to downstream subscribers reliably unless you want them to poll the database for changes.

A more scalable and flexible approach involves a microservices architecture that uses change data capture with logical replication to stream player data and score events to an Apache Kafka cluster for processing, as outlined in the following architecture diagram.

![Image](https://cdn.neonapi.io/public/images/pages/blog/real-time-materialized-view-postgres-kafka-ksqldb/table-d0760e22.jpg)

An Apache Kafka cluster is a collection of brokers (or nodes) that enable parallel processing of records by downstream subscribers such as ksqlDB. Data is organized into topics in Apache Kafka, and topics are split into partitions that are replicated across the brokers in the cluster to enable high availability. The beauty of using Apache Kafka and Kafka Connect is that connectors can source events from one system and sink them to other systems, including back to Postgres, if you want! You could even place Kafka in front of Postgres to insert score events into the database in a controlled manner.

Using ksqlDB with Apache Kafka enables you to process database change events stored in topics, perform aggregation operations, and keep the results of those operations in another Kafka topic to retain leaderboard history.

## Get Started with Neon and Logical Replication

To get started, [sign up for Neon](https://console.neon.tech/) and create a project. This project will contain the Postgres database that holds the `players` and `player_scores` tables:

1. Enter a project name.
2. Use default database name neondb.
3. Choose the region closest to your location.
4. Click **Create project**.

![Creating your first project on https://console.neon.tech](https://cdn.neonapi.io/public/images/pages/blog/real-time-materialized-view-postgres-kafka-ksqldb/create-project-neon-1024x540-6d990421.jpg)

Next, visit the **Beta** section of the **Project settings** screen and enable logical replication. Visit our documentation to view a complete set of [logical replication guides](https://neon.tech/docs/guides/logical-replication-concepts#enabling-logical-replication).

![Enabling logical replication for a project on https://console.neon.tech](https://cdn.neonapi.io/public/images/pages/blog/real-time-materialized-view-postgres-kafka-ksqldb/lr-enable-1024x565-b5c4048d.png)

Use the **SQL Editor** in the Neon console to create two tables in the `neondb` database: one to hold player information and another to hold score records for players. Each row in `player_scores` contains a foreign key referencing a player by their ID.

```sql
CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE player_scores (
    id SERIAL PRIMARY KEY,
    score DECIMAL(10, 2) NOT NULL,
    player_id INTEGER REFERENCES players(id),
    CONSTRAINT fk_player
        FOREIGN KEY(player_id)
        REFERENCES players(id)
        ON DELETE CASCADE
);
```

Create a [publication](https://www.postgresql.org/docs/current/logical-replication-publication.html) for these two tables. The publication defines what operations on those tables are replicated to other Postgres instances or subscribers. You’ll deploy a Debezium connector on Confluent’s cloud that uses this publication to observe changes in the specified tables:

```sql
CREATE PUBLICATION confluent_publication FOR TABLE players, player_scores;
```

Create a [logical replication slot](https://www.postgresql.org/docs/current/logicaldecoding-explanation.html#LOGICALDECODING-REPLICATION-SLOTS) to retain and stream changes in the [write-ahead log (WAL)](https://www.postgresql.org/docs/current/wal-intro.html) to subscribers. The Debezium connector on Confluent’s cloud will use this slot to consume relevant changes from the WAL:

```sql
SELECT pg_create_logical_replication_slot('debezium', 'pgoutput');
```

Use the **Roles** section of the Neon console to [create a new role](https://neon.tech/docs/manage/roles#manage-roles-in-the-neon-console) named `confluent_cdc`. Be sure to save the password for the role someplace safe since it will only be displayed once. With the role in place, grant it permissions on the public schema using the **SQL Editor**:

```sql
GRANT USAGE ON SCHEMA public TO confluent_cdc;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO confluent_cdc;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO confluent_cdc;
```

Now, you’ve got everything in place to start consuming changes from your `players` and `player_scores` tables in your Neon Postgres database.

## Get Started with Apache Kafka and Debezium on Confluent Cloud

This guide assumes you’re new to Confluent Cloud. If you’re an existing user, you can modify the steps to integrate with your existing environments and Apache Kafka cluster(s).

Sign into [https://confluent.cloud](https://confluent.cloud) and follow the onboarding flow to create a basic Apache Kafka cluster. Choose the region that’s closest to your Neon Postgres database region.

![Confluent Cloud showing a basic Apache Kafka cluster.](https://cdn.neonapi.io/public/images/pages/blog/real-time-materialized-view-postgres-kafka-ksqldb/confluent-cluster-created-1-1024x552-2183195e.png)

Once your cluster has been provisioned, click on it in the **Environments** screen, then select the **Connectors** view from the side menu on the next page.

Apache Kafka on Confluent supports a [plethora of connectors](https://www.confluent.io/product/connectors/). Many of these are based on the various open-source [Kafka Connect](https://kafka.apache.org/documentation/#connect) connectors. Find and select the **Postgres CDC Source** connector in the list. This connector is based on the [Debezium project](https://debezium.io/) we wrote about in [our fan-out using Debezium and Upstash Redis article](https://neon.tech/blog/fan-out-postgres-changes-using-debezium-and-upstash-redis).

![The Debezuim-based Postgres CDC Source in Confluent Cloud.](https://cdn.neonapi.io/public/images/pages/blog/real-time-materialized-view-postgres-kafka-ksqldb/confluent-debezium-connector-1024x555-a7dd11f8.jpg)

On the **Add Postgres CDC Source connector** screen:

1. Select **Global Access**.
2. Click the **Generate API key & download** button to generate an API key and secret.
3. Click **Continue**.

Next, configure the connection between the connector and your Postgres database on Neon:

1. Database name: `neondb`
2. Database server name: `neon`
3. SSL mode: `require`
4. Database hostname: Find this on the Neon console. Refer to [our documentation](https://neon.tech/docs/connect/connect-from-any-app).
5. Database port: `5432`
6. Database username: `confluent_cdc`
7. Database password: This is the password for the `confluent_cdc` role you created earlier.
8. Click **Continue**.

Configure the connector properties. The first of these is the Kafka record key and value formats. Select the following options:

1. Output Kafka record value format: `JSON_SR`
2. Output Kafka record key format: `JSON_SR`

The `JSON_SR` option causes change event record schemas to be registered in your Confluent Cloud environment’s [Schema Registry](https://docs.confluent.io/platform/current/schema-registry/index.html). You can think of the schemas as type information for records in your Kafka topics. These are essential to working with the change data event records, as you’ll see shortly.

Expand the advanced configuration and set the following options:

- Slot name: `debezium`
- Publication auto create mode: `disabled`
- Publication name: `confluent_publication`
- Tables included: `public.players,public.player_scores`

Click **Continue**, accept the default values for sizing and tasks, and give your connector a name. Once finished, your connector will be shown on the **Connectors** screen. Confirm that it’s marked as **Running** and not in an error state. If the connector reports an error, check the configuration properties for correctness.

![Confluent Cloud dashboard showing the Postgres CDC Source connector deployed and running.](https://cdn.neonapi.io/public/images/pages/blog/real-time-materialized-view-postgres-kafka-ksqldb/confluent-connector-running-1-1024x551-d439c957.png)

## Confirm Change Data Capture is Working

Use the **SQL Editor** in the Neon console to insert some players and scores into your tables using the following SQL statements:

```sql
INSERT INTO players (name) VALUES ('Mario'), ('Peach'), ('Bowser'), ('Luigi'), ('Yoshi');

INSERT INTO player_scores (player_id, score) VALUES
(1, 0.31),
(3, 0.16),
(4, 0.24),
(5, 0.56),
(1, 0.19),
(2, 0.34),
(3, 0.49),
(5, 0.71);
```

Return to the Confluent Cloud console and select the **Topics** item from the side menu. You will see two topics that correspond to your database tables.

![Apache Kafka topics listed in Confluent Cloud dashboard.](https://cdn.neonapi.io/public/images/pages/blog/real-time-materialized-view-postgres-kafka-ksqldb/confluent-topics-created-1024x577-6e0fd9f9.jpg)

Click on either of the topics, then use the **Messages** tab to view database change events captured by the Debezium connector and streamed to the topic. Each message in Kafka contains a key and value; in this case, these are the database row ID and row contents.

Apache Kafka uses partitions to increase parallelism and replicates partitions across multiple nodes to increase durability. Since Kafka partitions are an ordered immutable sequence of messages, the offset represents the message position in its partition. Topics in a production Kafka environment can be split into 100 or more partitions if necessary, to enable parallel processing by as many consumers as there are partitions.

![Viewing messages in a topic on Confluent Cloud.](https://cdn.neonapi.io/public/images/pages/blog/real-time-materialized-view-postgres-kafka-ksqldb/confluent-messages-in-topic-1024x571-b8673ffe.jpg)

Next, confirm that schemas have been registered for your change records. Select the **Schema Registry** from the bottom left of the side menu in the Confluent Cloud console, and confirm that schemas have been registered for the records in your topics.

![Viewing auto-generated schemas in the Schema Registry on Confluent Cloud.](https://cdn.neonapi.io/public/images/pages/blog/real-time-materialized-view-postgres-kafka-ksqldb/confluent-schemas-created-1024x574-4bdec4ca.jpg)

If you click on the schema entries with a “key” suffix, you notice that the schema simply contains an id property. This property corresponds to the `id` or primary key of the database row. The schema entries with a “value” suffix correspond to the backing table’s schema.

## Create a Materialized View using ksqlDB

With schemas and topics containing messages in place, you can use ksqlDB to create a materialized view that updates in response to database changes.

Select ksqlDB in the side menu for your cluster to provision a new ksqlDB instance with **Global access** enabled, and use the default values for sizing and configuration. The provisioning process can take a couple of minutes, so be patient.

Select your ksqlDB cluster once it’s ready, then navigate to the **Streams** tab and click **Import topics as streams** to import your `player_scores` and `players` topics as [streams](https://docs.ksqldb.io/en/latest/developer-guide/ksqldb-reference/create-stream/) in ksqlDB. Creating a stream from your topic allows you to perform operations such as joins or aggregations on the data contained in the underlying topic, as you’ll see in a moment. Click **Import** to create the streams.

![Importing topics as streams in ksqlDB on Confluent Cloud.](https://cdn.neonapi.io/public/images/pages/blog/real-time-materialized-view-postgres-kafka-ksqldb/confluent-import-streams-1024x552-7588e39d.jpg)

Now, use the **Editor** tab in the ksqlDB cluster UI to create a [table](https://docs.ksqldb.io/en/latest/concepts/tables/) named `player_scores`. The table will store an [aggregation](https://en.wikipedia.org/wiki/Aggregate_function) of your system’s latest state, i.e. a materialized view. In your case, it’ll represent the sum of the score events for each player. Paste the following query into the **Editor** and click **Run query**.

```sql
CREATE TABLE player_scores AS
    SELECT player_id, SUM(score) as total_score
    FROM NEONPUBLICPLAYER_SCORES
    GROUP BY player_id
    EMIT CHANGES;
```

This creates a table in ksqlDB that is continuously updated in response to events in the `NEONPUBLICPLAYER_SCORES` stream. The table will contain a row for each player with their unique ID and the sum of all associated score events.

Confirm the table is working as expected by selecting `PLAYER_SCORES` under the **Tables** heading and clicking **Query table**. A list of records that contain the sum of player scores will be displayed.

![Querying the ksqlDB and viewing results in Confluent Cloud.](https://cdn.neonapi.io/public/images/pages/blog/real-time-materialized-view-postgres-kafka-ksqldb/confluent-ksqldb-table-1024x578-9e2ede3d.jpg)

Return to the Neon console and insert more data into the `player_scores` table. The materialized view will automatically update within a few seconds to reflect the new `total_score` for each player.

The materialized view can be consumed by interacting with the [ksqlDB REST API](https://developer.confluent.io/courses/ksqldb/hands-on-interacting-with-ksqldb/#use-the-ksqldb-rest-api-with-postman). Visit the **API Keys** in your cluster’s UI to create an API key to authenticate against the ksqlDB REST API, and use the settings tab in your ksqlDB cluster UI to find the cluster’s hostname.

You can use the following cURL command to get a stream of changes from the table in your terminal:

```bash
curl --http1.1 -X "POST" "https://$KSQLDB_HOSTNAME/query" \
-H "Accept: application/vnd.ksql.v1+json" \
--basic --user "$API_KEY:$API_SECRET" \
-d $'{
"ksql": "SELECT * FROM PLAYER_SCORES EMIT CHANGES;",
"streamsProperties": {}
}'
```

This command will establish a persistent connection that streams a header followed by changes as they occur in the table in real-time. You can confirm this by using the **SQL Editor** in the Neon console to insert more data into the `player_scores` table and observing the updated total scores being streamed into your terminal:

```bash
[{"header":{"queryId":"transient_PLAYER_SCORES_7047340794163641810","schema":"`PLAYER_ID` INTEGER, `TOTAL_SCORE` DECIMAL(10, 2)"}},
{"row":{"columns":[1,4.50]}},
{"row":{"columns":[2,5.04]}},
{"row":{"columns":[3,5.85]}},
{"row":{"columns":[4,6.12]}},
{"row":{"columns":[5,11.43]}},
{"row":{"columns":[1,5.00]}},
{"row":{"columns":[4,6.80]}},
{"row":{"columns":[5,12.70]}},
{"row":{"columns":[1,5.82]}},
{"row":{"columns":[4,6.92]}}
```

This same stream of events over HTTP can be integrated into your application to enable real-time updates in a UI or to update other components in your application architecture.

## Conclusion

Neon’s support for Postgres’ logical replication enables change data capture, and streaming database changes to Apache Kafka for real-time processing with ksqlDB to create [enriched data streams](https://developer.confluent.io/courses/data-pipelines/hands-on-joining-data-streams/) and materialized views using SQL syntax. If you’re looking for a Postgres database, [sign up and try Neon](https://neon.tech/blog/python-django-and-neons-serverless-postgres#:~:text=sign%20up%20and%20try%20Neon) for free. Join us in our [Discord server](https://neon.tech/discord) to share your experiences, suggestions, and challenges.
