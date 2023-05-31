---
title: Read replicas
enableTableOfContents: true
isDraft: true
---

A read replica is a copy of your data that resides on a read-only compute instance. Neon uses the native replication mechanisms of PostgreSQL to keep read replicas up to date with the latest changes.

Read replicas are a Neon [Pro plan](/docs/introduction/pro-plan) feature. Read replicas are not available with the [Neon Free Tier](/docs/introduction/technical-preview-free-tier).

You can only create read replicas in the same region as your Neon project. Support for creating read replicas in a different region will be added in a future release.

The read replica feature offers several advantages. With read replicas, you can:

- Add dedicated compute resources to achieve higher read throughput.
- Direct analytical workloads to a read replica with its own compute resources to  avoid impacting the performance of your application workload
- Provide read-only database access to specific users or applications
- Configure right-sized compute resources for different users and applications

## Creating a read replica

A read replica is created when you add a read-only compute endpoint to a database branch, which you can do in just a few clicks.

To create a read-only compute endpoint:

1. In the Neon Console, select **Branches**.
1. Select the branch where your database resides.
1. Click **Add new compute endpoint**.
1. On the **Create compute endpoint** dialog, select the **Read-only** option.

Your read replica is created with the read-only endpoint.

## Connecting to a read replica

Connecting to a read replica requires connecting to the read-only compute endpoint. You can access the connection string from the **Connection Details** widget on the Neon **Dashboard**.

Users and applications that connect to the read-only compute endpoint are connecting to a read replica.
