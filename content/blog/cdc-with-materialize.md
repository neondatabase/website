---
title: Change Data Capture with Neon and Materialize
description: 'Replicate Neon data in real time to build better, faster products'
excerpt: >-
  Now that Neon supports logical replication, your head might be filled with
  questions about how to turn this new feature into interactive data apps,
  better customer experiences, and other use cases ripe for fresh data. Do you
  need to rethink your architecture? Does your team need...
date: '2023-12-21T12:23:12'
updatedOn: '2024-03-01T14:00:38'
category: community
categories:
  - community
authors:
  - marta-paes
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/cdc-with-materialize/cover.png
  alt: null
isFeatured: false
seo:
  title: Change Data Capture with Neon and Materialize - Neon
  description: 'Replicate Neon data in real time to build better, faster products'
  keywords: []
  noindex: false
  ogTitle: Change Data Capture with Neon and Materialize - Neon
  ogDescription: >-
    Now that Neon supports logical replication, your head might be filled with
    questions about how to turn this new feature into interactive data apps,
    better customer experiences, and other use cases ripe for fresh data. Do you
    need to rethink your architecture? Does your team need to catch up with all
    the streaming jargon? In […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/cdc-with-materialize/social.jpg
source:
  wpId: 4095
  wpSlug: cdc-with-materialize
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/cdc-with-materialize/image-10-1024x576-8d261962.png)

Now that [Neon supports logical replication](https://neon.tech/blog/change-data-capture-with-serverless-postgres), your head might be filled with questions about how to turn this new feature into interactive data apps, better customer experiences, and other use cases ripe for **fresh data**. Do you need to rethink your architecture? Does your team need to catch up with all the streaming jargon? In this blog post, we’ll walk through how you can use Materialize to replicate data from Neon in real-time without needing to rethink much.

## Why Materialize?

[Logical replication](https://neon.tech/docs/guides/logical-replication-materialize) allows capturing `INSERT` s, `UPDATE` s, and `DELETE` s as these operations happen in your Neon database, making this data available to an external system for processing — a pattern known as Change Data Capture (CDC). If your use case requires more than simple mirroring, Materialize can help you transform the replicated data into **actionable results** that are **always fresh and consistent**.

Materialize shines at [operational use cases](https://materialize.com/blog/operational-data-warehouse/), where an analytical data warehouse would be too slow or too costly, and a stream processor would introduce too much complexity. It can handle arbitrarily complex transformations on changing data using — you’ve guessed it — just SQL. For CDC from a PostgreSQL database like Neon, it has the added benefit of requiring **no additional infrastructure** (_e.g._ Debezium), while guaranteeing **transactional consistency**.

Enough talk!

Let’s see what it takes to build a CDC pipeline to replicate data from Neon to Materialize in real time. If you want to follow along, sign up for a [Materialize free trial](https://materialize.com/register/)!

## Get started with Neon + Materialize

### Configure logical replication in Neon

**1.** First, enable logical replication for your Neon project:

1. Select your project in the [Neon Console](https://console.neon.tech/app/projects).
2. On the Neon Dashboard, select Settings.
3. Select Beta.
4. Click Enable to enable logical replication.

>

> 🖐️ It’s important to note that enabling logical replication in Neon cannot be reverted, and triggers a restart of all active compute endpoints in your Neon project. Any active connections will be dropped and have to reconnect.

**2.** Double check that logical replication is enabled by running the following query:

```sql
SHOW wal_level;

 wal_level
-----------
 logical
```

Once logical replication is enabled, the next step is to create a publication with the tables that you want to replicate to Materialize. It’s also recommended to [create a dedicated user](https://neon.tech/docs/manage/roles) for replication.

**4.** Grant the replication user the required permissions on the tables you want to replicate:

```sql
GRANT CONNECT ON DATABASE neon_demo TO neon_repl;
GRANT USAGE ON SCHEMA public TO neon_repl;
GRANT SELECT ON playing_with_lr TO neon_repl;
```

For each table that you want to replicate to Materialize, set the [replica identity](https://www.postgresql.org/docs/current/sql-altertable.html#SQL-ALTERTABLE-REPLICA-IDENTITY) to FULL:

```sql
ALTER TABLE playing_with_lr REPLICA IDENTITY FULL;
```

`REPLICA IDENTITY FULL` ensures that the replication stream includes the previous data of changed rows, in the case of `UPDATE` and `DELETE` operations, and enables Materialize to ingest Neon data with minimal in-memory state.

**5.** Create a [publication](https://www.postgresql.org/docs/current/logical-replication-publication.html) with the tables you want to replicate:

```sql
CREATE PUBLICATION mz_demo FOR TABLE playing_with_lr;
```

The mz_demo publication will contain the set of changes generated for the specified table, and will be used to ingest the replication stream into Materialize next!

### Create a source in Materialize

Logical replication in Neon follows PostgreSQL’s native replication protocol, so you can jump straight into action using Materialize’s [direct PostgreSQL source](https://materialize.com/docs/sql/create-source/postgres/).

**1.** Log in to Materialize. You’ll be dropped into the **SQL shell**, which you can use to run the commands in the next steps.

**2.** Use the connection details of your Neon endpoint to create a [connection](https://materialize.com/docs/sql/create-source/postgres/#creating-a-connection):

```sql
-- Your Neon password goes here
CREATE SECRET neonpass AS 'safe12345';
CREATE CONNECTION neon TO POSTGRES (
  -- Your Neon endpoint goes here
  HOST 'ep-dry-bread-********.eu-central-1.aws.neon.tech',
  PORT 5432,
  -- Your Neon replication user goes here
  USER 'neon_repl',
  PASSWORD SECRET neonpass,
  SSL MODE 'require',
  DATABASE 'neondb_cdc'
  );
```

**2.** Create a [PostgreSQL source](https://materialize.com/docs/sql/create-source/postgres/) using the connection you just created, as well as the publication you created upstream:

```sql
CREATE SOURCE neon_demo
  IN CLUSTER default
  FROM POSTGRES CONNECTION neon (PUBLICATION 'mz_demo')
  FOR ALL TABLES;
```

Materialize will create a subsource for each table in the publication, which will first get hydrated with a snapshot of the existing data, and then carry on receiving new data as it arrives:

```sql
SHOW SUBSOURCES ON neon_demo;

        name        |   type
--------------------+-----------
 neon_demo_progress | progress
 playing_with_lr    | subsource

SELECT * FROM playing_with_lr;

     col
-------------
 hello
 logical
 replication
```

### Transform data in Materialize

To get a quick taste of what Materialize can do, let’s keep track of the row count in `playing_with_lr`, and see how adding and deleting data in Neon immediately affects the results in Materialize.

**1.** In Materialize, create a view with a count aggregate function:

```sql
CREATE VIEW lr_cnt AS
SELECT COUNT(*)
FROM playing_with_lr;

SELECT * FROM lr_cnt;

count
-------
     3
```

**2.** Switch back to Neon, and insert some new data into the `playing_with_lr` table. Then, query the `lr_cnt` view in Materialize one more time:

![Image](https://lh7-us.googleusercontent.com/6SX5Jhn-BZOgQnHvZ4MfQVJiPW_iH28e59UHgju7Xs5_SxEpICIVHijlNMpk2mc_gT5MJZhlCuZX102x_M7WyZ3QqnMjuijA7dErfdprn51d4_KFktnzFrB02bL5EexSaAnA6GqB-ZU_Yi4JmPrj3cM)

This isn’t a very complex task, but…it’s still somewhat magic to see the count instantly update, no? Hopefully, your use case will be strictly more complex than this, and Materialize will make you Ooh! and Aah! at how efficiently it can handle CDC pipelines (which can be…[surprisingly costly](https://materialize.com/blog/capturing-cdc-data/)).

### What’s next?

If you’re as excited as we are about logical replication support in Neon, we encourage you to learn more about Materialize and how it can help you **build better products, faster**. Check out the [Materialize customer stories](https://materialize.com/customer-stories/) to see operational use cases in the wild, and [reach out](https://materialize.com/demo/) if you’d like to get a hands-on walkthrough with our team.
