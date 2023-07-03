---
title: Working with Neon read replicas 
subtitle: Learn how to create and and manage read replicas in Neon
enableTableOfContents: true
---

Read replicas are supported with the [Neon Pro plan](/docs/introduction/pro-plan). This guide will lead you through the process of creating read replicas. The general methodology of using read replicas to segregate read-only work from your production database operations can be applied to a variety of uses cases such as:

- Offloading analytics or reporting queries
- Distributing read requests to to achieve higher throughput
- Providing read-only data access to specific users or applications who do not need to modify data
- Configuring right-sized read-only compute resources for different users and applications

Regardless of the application, the steps for creating, configuring, and connecting to a read replica are the same. You can follow the steps below to create one or more read replicas. You can create as many read-replicas as you need for any branch in your Neon project, and you can configure each with the required vCPU and memory. You also have the option of configuring autoscaling and auto-suspend for your read replicas, in the same way that you configure those resources for read-write compute instances.

Neon also supports managing read replicas programmatically, which is covered toward the end of the guide.

## Prerequisites

- A Pro plan account. The read replica feature is a Neon Pro plan feature.
- A Neon project.

## Create a read replica

You create a read replica by adding read-only compute endpoint to a branch. This can be any branch in your Neon project. To create a read-only compute:

1. In the Neon Console, select **Branches**.
1. Select the branch where your database resides.
1. Click **Add compute**.
1. On the **Create compute endpoint** dialog, select the **Read-only** as the **Compute type**.
1. Specify the compute size options for your read-only compute. You can set a fixed size (the default) or enable autoscaling and specify your minimum and maximum compute size boundaries. additionally, you can configure the autosuspend delay period, which is the amount of idle time after which your compute is transitioned to an idle state. This value is set to 300 seconds (5 minutes) by default.
1. When you have finished making your selections, click **Create**.

In a few moments, your read-only compute is provisioned. This is your read replica.

## Connect to the read replica

Connecting to a read replica requires connecting to the read-only compute endpoint. You can access the connection string from the **Connection Details** widget on the Neon **Dashboard**.

Users and applications that connect to the read-only compute endpoint are connecting to a read replica.

## Viewing your read replicas

## Delete a read replica

## Manage read replicas programmatically

### Using the Neon API

### Using the Neon CLI

### GitHub Actions
