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

Neon also supports managing read replicas programmatically, which is covered toward the end of this guide.

## Prerequisites

- A Pro plan account. The read replica feature is a Neon Pro plan feature.
- A Neon project.

## Create a read replica

Creating a read replica is a simple process that involves adding read-only compute endpoint to a branch. You can add a read-only endpoint to any branch in your Neon project.

1. In the Neon Console, select **Branches**.
1. Select the branch where your database resides.
1. Click **Add compute**.
1. On the **Create compute endpoint** dialog, select the **Read-only** as the **Compute type**.
1. Specify the compute size options for your read-only compute. You can set a fixed size (the default) or enable **Autoscaling**, specifying your minimum and maximum compute size boundaries. Additionally, you can configure the **Auto-suspend delay** period, which is the amount of idle time after which your compute is transitioned to an idle state. The default setting is 300 seconds (5 minutes), but you can specify up to 7 days. For more information about these settings, see [Edit a compute endpoint](https://neon.tech/docs/manage/endpoints#edit-a-compute-endpoint).
1. When you have finished making your selections, click **Create**.

In a few moments, your read-only compute is provisioned. This is your read replica.

## Connect to a read replica

Connecting to a read replica is the same as connecting to any branch, except you are connecting via a read-only compute instead of a read-write compute.

The following steps describe how to connect to your read replica with connection details obtained from the Neon Console.

1. In the Neon Console, select a project.
1. On the project **Dashboard**, under **Connection Details**, select the branch, the database, and the role you want to connect with.
![Connection details widget](/docs/connect/connection_details.png)
1. Under **Compute**, select a read-only endpoint for the branch. If there are none, see [Create a read replica](#create-a-read-replica).
1. Copy the connection string or a code example with the connection details by selecting from the drop-down. A connection string or code example includes your role name, password, hostname, and database name. A basic connection string appears similar to the following:

  <CodeBlock shouldWrap>

  ```bash
  postgres://daniel:<password>@ep-mute-rain-952417.us-east-2.aws.neon.tech/neondb
  ```

  </CodeBlock>

where:

- role: `daniel`
- hostname: `ep-mute-rain-952417.us-east-2.aws.neon.tech`
- database name: `neondb`

If you require a post number, Neon uses the default port number, `5432`.

<Admonition type="tip">
A compute endpoint hostname, whether read-only or read-write, starts with an `ep-` prefix.
</Admonition>

When you connect to the read-only endpoint, you are connected to your read replica for the branch. No write operations are permitted.

## Viewing read replicas

A read replica is a read-only compute endpoint. To view a compute endpoints, including any read-only compute endpoints, select **Branches** in the Neon Console, and select a branch. If the branch has a read-only compute endpoint, it is shown on the branch page under the **Compute endpoint** heading. Read-only compute endpoints are identified by the **Type** field> They have a `R/O` value instead of `R/W`.

Compute endpoint details shown on the branch page for all compute types include:

- **Host**: The compute endpoint hostname.
- **Type**: The type of compute endpoint. `R/W` for read-write, and `R/O` for read only (read replica)
- **Compute size**: The size of the compute endpoint. Neon [Pro plan](../introduction/pro-plan) users can configure the amount of vCPU and RAM for a compute endpoint when creating or editing a compute endpoint.
- **Compute size (min)**: The minimum compute size for the compute endpoint. This column appears when the [Autoscaling](../introduction/autoscaling) feature is enabled, which is only available to Neon Pro plan users.
- **Compute size (max)**: The maximum compute size for the compute endpoint. This column appears when the Autoscaling feature is enabled, which is only available to Neon Pro plan users.
- **Auto-suspend delay**: The number of seconds of inactivity after which a compute endpoint is automatically suspended. The default is 300 seconds (5 minutes). For more information, see [Auto-suspend configuration](/docs/manage/endpoints#auto-suspend-configuration).
- **Last active**: The date and time the compute was last active.
- **Status**: The compute endpoint status (`Active`, `Idle`, or `Stopped`).

## Edit a read replica

You can edit your read replica read-only compute endpoint to change the [compute size](#compute-size-and-autoscaling-configuration) or [Auto-suspend](#auto-suspend-configuration) configuration.

To edit a read-only compute endpoint:

1. In the Neon Console, select **Branches**.
1. Select a branch.
1. Click the compute endpoint kebab menu, and select **Edit**.
1. Specify your changes and click **Save**.

## Delete a read replica

Deleting a compute endpoint is a permanent action.

To delete a compute endpoint:

1. In the Neon Console, select **Branches**.
1. Select a branch.
1. Click the compute endpoint kebab menu, and select **Delete**.
1. On the confirmation dialog, click **Delete**.

## Manage read replicas programmatically

### Using the Neon API

### Using the Neon CLI

### GitHub Actions
