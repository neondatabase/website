---
title: Endpoints
enableTableOfContents: true
isDraft: false
---

An endpoint is the compute instance associated with a branch. A single read-write endpoint is created for your project's [root branch](#root-branch) (`main`) by default.

To connect to a database that resides on a branch, you must connect via an endpoint that is associated with the branch. Endpoints can be  managed independently of branches. For example, you can create and delete endpoints as necessary, assigning them to the branch you want to connect to.

Tier limits define the number of endpoints that you can create in a Neon project and the compute resources (vCPUs and RAM) available to an endpoint. Neon free tier users can create up to 3 endpoints.

## Create an endpoint

To create an endpoint:

1. In the Neon Console, select **Endpoints**.
1. Select **Create endpoint**.
1. On the **Create endpoint** dialog, select a branch to assign the endpoint to. An endpoint must be assigned to a branch.
1. Click **Create endpoint**.

## View endpoints

To view the endpoints, select **Endpoints** in the Neon Console.

The **Endpoints** page lists the endpoints that belong your Neon project. You can search for endpoints by name and change the view to show only active, idle, or stopped endpoints.

Endpoint details include:

- **Name**: The endpoint name.
- **Region**: The region in which the endpoint was created.
- **Min/max compute units**: The minimum and maximum number of vCPUs allocated to the compute unit.
- **Type**: The type of endpoint. Neon supports read-write and read-only endpoints.
- **Branch**: The branch that the endpoint is associated with.
- **State**: The endpoint state (`Active`, `Idle`, or `Stopped`).
- **Last activity**: The last time the endpoint was active.
- **Created**: The date and time the endpoint was created.

## Edit an endpoint

You can edit an endpoint to modify the following characteristics:

- The branch the endpoint is associated with
- The endpoint type (read-write or read-only)
- Whether to enable or disable [passwordless connect](../../reference/glossary/#passwordless-auth)
- Whether to enable or disable autoscaling (only available to paid tiers)
- The minimum and maximum number of vCPUs (only available to paid tiers)

To edit an endpoint:

1. In the Neon Console, select **Endpoints**.
1. Fnd the endpoint you want to edit, click the &#8942; menu, and select **Edit**.
1. Edit the endpoint and click **Save changes**.

## Delete an endpoint

Deleting an endpoint is a permanent action.

To delete an endpoint:

1. In the Neon Console, select **Endpoints**.
1. Find the endpoint you want to delete, click the &#8942; menu, and select **Delete**.
1. On the confirmation dialog, click **Delete**.
