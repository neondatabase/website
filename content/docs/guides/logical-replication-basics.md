---
title: PostgreSQL logical replication basics
subtitle: Learn about POstgreSQL logical replication concepts and syntax
enableTableOfContents: true
isDraft: true
---

Logical replication in Postgres involves transferring data changes from a publisher node to a subscriber node. The publisher node hosts publications, which are essentially sets of database changes. On the other hand, the subscriber node hosts subscriptions that receive these changes.

In this model, multiple subscribers can subscribe to various publications on a publisher node. These subscribers actively retrieve data from their respective publications.

## Publications

Publications are defined on the primary node to replicate changes. A publication consists of changes from one or more tables and is unique to a single database. It can be thought of as a change set or replication set.

Tables can be included in multiple publications as required. Currently, publications can only encompass tables or all tables within a schema.

Publications have the flexibility to specify the types of changes they replicate, which can include `INSERT`, `UPDATE`, `DELETE`, and `TRUNCATE` operations. By default, they replicate all these operation types. 

### Defining a publication

You can create a publication for a specific table like this:

```sql
CREATE PUBLICATION users_publication FOR TABLE users;
```

This command creates a publication named `users_publication` that will track changes made to the `users` table.

### Multiple publications for a table

A table can be part of several publications. This is useful in complex replication setups where different subscribers might need different sets of changes from the same table. For instance, alongside the `users_publication`, you might want to create another publication for a different purpose:

```sql
CREATE PUBLICATION audit_publication FOR TABLE users;
```

Here, `audit_publication` could be a separate publication used for auditing purposes, tracking the same `users` table.

### Specifying types of changes

Publications can be configured to replicate specific types of changes: `INSERT`, `UPDATE`, `DELETE`, and `TRUNCATE`. By default, a publication will replicate all these types of operations. However, you can limit the types of changes a publication replicates. For example, to create a publication that only replicates `INSERT` and `UPDATE` operations, you could use:

```sql
CREATE PUBLICATION selective_publication FOR TABLE users WITH (publish = 'insert, update');
```

In this case, `selective_publication` will only replicate insertions and updates made to the `users` table.

### Whole schema publications

Neon currently does not support creating publications that include all tables within a schema using `CREATE PUBLICATION publication_name FOR ALL TABLES` syntax. This requires the PostgreSQL superuser privilege, which is not available in Neon. If you want to include all tables within a schema, specify the table names indivaidually in a comma-separated list using this syntax:

```sql
CREATE PUBLICATION multi_table_publication FOR TABLE users, orders, sales;
```

## Subscriptions

In PostgreSQL's logical replication framework, a subscription represents the downstream side of logical replication. It establishes a connection to the publisher and identifies one or more publications it intends to subscribe to. This setup enables the subscriber database to receive and apply changes from the publisher database.

A single subscriber node can maintain multiple subscriptions, including multiple subscriptions to the same publisher. In scenarios with multiple subscriptions between the same publisher and subscriber, it's important ensure that there is no overlap in the publication objects being subscribed to. This helps avoid conflicts or redundant data replication.

### Replication slots and data synchronization

Each subscription utilizes a replication slot on the publisher side. Replication slots are a feature in PostgreSQL that ensures the database retains all necessary information until it is confirmed to be received by the subscriber. This mechanism is crucial for maintaining data consistency and ensuring that no changes are lost during replication.

For initial data synchronization, especially for pre-existing table data, additional replication slots might be required. These slots are temporary and are typically dropped after the completion of the data synchronization process. This initial synchronization ensures that the subscriber is up-to-date with the publisher before it starts receiving incremental changes.

Example of creating a subscription

Building on the `users_publication`` example above, here’s how you can create a subscription:

```sql
CREATE SUBSCRIPTION users_subscription 
CONNECTION 'postgres://username:password@host:port/dbname' 
PUBLICATION users_publication;
```

In this example, `users_subscription` is the subscription that connects to a publication named `users_publication`. Replace username, password, host, port, and dbname with your specific database details. In Neon, you can replace this with your Neon database connection string.