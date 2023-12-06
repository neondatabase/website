---
title: Get started with logical replication
subtitle: Learn how to enable Neon's logical replication feature and configure subscribers
enableTableOfContents: true
isDraft: true
---

In this guide, you will learn how to enable logical replication in Neon, create publications, and configure subscribers to recieve replicated data.

## Enable logical replication

Neon's logical replication feature allows for replication of data to external subscribers. These subscribers might include platforms for operational data warehousing, analytical database services, real-time stream processing systems, scalable messaging and event-streaming technologies, change data capture (CDC) ecosystems, data pipeline orchestrators, among others.

To enable the logical replication for your project:

1. Select your project in the Neon console.
2. On the Neon **Dashboard**, select **Settings**.
3. Select **Replication**.
4. Tick the **Enable logical replication** checkbox.

Ticking this box initiates the setting of the `wal_level` configuration parameter to `logical`, which is the first step in setting up logical replication. Deselecting the checkbox returns the `wal_level` to the default `replica` setting.

After enabling logical replication, the next steps involve creating publications on your replication source database in Neon and configuring subscriptions on the destination system or service. These processes are the same as those you would perform in a standalone Postgresql environment. 

## Create publications

Publications in PostgreSQL are a fundamental part of logical replication. They allow you to specify a set of database changes that can be replicated to subscribers. For Neon users, setting up a publication is an essential step towards synchronizing data with other systems. This section will walk you through creating a publication for a users table, which contains standard columns and a primary key.

Let's start by creating a table we can use in this guide:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

After your users table is set up, you can create a publication with the following steps:

1. Open the SQL Editor in the Neon console or connect with a client such as psql.
2. Enter the SQL command to create a publication:

```sql
CREATE PUBLICATION users_publication FOR TABLE users;
```

This command creates a publication named `users_publication` which will include all changes to the users table.

<Admonition type="note">
In addition to creating a publication for a specific table, Postgres allows you to create a publication for all tables within your database by using CREATE PUBLICATION all_tables_publication FOR ALL TABLES;. This command is particularly useful when you need to replicate the entire database. Furthermore, PostgreSQL allows for fine-tuning your publications. For instance, you can create a publication for a subset of tables or configure publications to only replicate certain types of data changes, such as inserts, updates, or deletes. This level of customization ensures that your replication strategy aligns precisely with your data management and integration requirements.
</Admonition>

With your publication created, you're now set to configure subscribers that will receive the data changes from this publication. These steps lay the groundwork for more complex replication setups and will be covered in subsequent topics.

## Configure subscribers

Having established a publication with the `users` table in your Neon database, the next step is configuring subscribers. Subscribers are destinations that receive data changes from your publications. 

In general, configuring a subscriber involves setting up a connection to the Neon database and specifying which publication's data it should receive. 

Subscribers can range from other Postgres instances to a variety of data services and platforms, each serving different roles within your data infrastructure.

The configuration process for each type of subscriber will have its differences. Below, you will find setup guides for various subscribers:

- [Configuring PostgreSQL as a Subscriber](tbd): Steps to connect a standalone Postgres database to your Neon publication.
- [Configuring Service A as a Subscriber](tbd): Instructions for integrating a data warehousing platform to synchronize with your Neon data changes.
- [Configuring Service B as a Subscriber](tbd): How to connect real-time stream processing systems to receive updates from Neon.
- [Configuring Service C as a Subscriber](tbd): Guidance on setting up scalable messaging and event-streaming service as a subscribers to your Neon publication.

These resources are designed to provide you with the necessary instructions to expand your data's reach, ensuring that regardless of where your data needs to go, you have the knowledge and tools to get it there effectively.

## Monitor logical replication

Monitoring is a critical component of managing logical replication in your Neon environment. It ensures that the publications defined on your source server are being replicated to subscribers without issues. Effective monitoring helps in proactively identifying and resolving replication lag or errors, maintaining data integrity, and ensuring high availability.

### Monitoring replication lag and status

To monitor the replication lag and the status of your replication processes, you would use the `pg_stat_replication` view. Here’s how to query it:

```sql
SELECT * FROM pg_stat_replication;
```

This query returns a table with multiple columns providing details such as:

- pid: The process ID of the walsender process.
- state: The current state of the replication, e.g., streaming, backup, or catchup.
- application_name: The name of the replication application.
- sync_state: Synchronization state of the standby servers.
- replication_lag: The time difference between the last WAL entry received and the last WAL entry applied.

### Monitoring replication slots

Replication slots ensure that the master retains the WAL logs needed by the subscribers. To check the status of your replication slots, use the `pg_replication_slots` view:

```sql
SELECT slot_name, plugin, slot_type, datoid, database, active, pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) AS replication_lag
FROM pg_replication_slots;
```

This will provide information on:

- slot_name: The name of the replication slot.
- plugin: The output plugin used for logical decoding.
- slot_type: The type of slot (logical or physical).
- datoid: The OID of the database this slot is associated with.
- database: The database name this slot is associated with.
- active: Whether the slot is currently being used.
- replication_lag: The lag in terms of WAL data that has not yet been sent to the subscriber.