---
title: Endpoints
enableTableOfContents: true
isDraft: false
---

An endpoint is the compute instance associated with a branch. A single read-write endpoint is created for your project's [root branch](#root-branch) (`main`) by default. You can also create a 

The endpoint hostname is required to connect to a branch from a client or application. An endpoint hostname can be found in the **Connection Details** widget on the Neon **Dashboard** or by selecting the branch on the **Branches** page in the Neon Console. An endpoint hostname starts with an `ep-` prefix, as in this example: `ep-steep-forest-654321.cloud.neon.tech`. For more information, see [Connecting to a branch](https://neon.tech/docs/get-started-with-neon/get-started-branching/#connect-to-a-branch).

## Create an endpoint

To create an endpoint:

1. In the Neon Console, select **Endpoints**.
1. Select **Create endpoint**.
1. On the **Create endpoint** dialog:
    1. Select a branch. An endpoint must be associated with a branch.
    1. Select an endpoint type, read-write or read-only.
    1. Select wether or not to enable [passwordless connect with psql](../../reference/glossary/#passwordless-auth) for the endpoint.
    1. Select whether to enable autoscaling. This option is not yet supported.
    1. Specify the minimum and maximum number of CPU limits for the compute. This option is not yet supported.
1. Click **Create endpoint**.

## View endpoints

To view the endpoints, select **Endpoints** in the Neon Console.

The **Endpoints** page lists the endpoints that belong your Neon project. You can search for endpoints by name and change the view to show only active, idle, or stopped endpoints.

Endpoint details include:

- **Name**: The endpoint name.
- **Region**: The regions in which the endpoint was created.
- **Min/max compute units**: The maximum and minimum number of CPUs allocated to the compute unit.
- **Type**: The type of endpoint. Neon supports read-write and read-only endpoints.
- **Branch**: The name of the branch that the endpoint is associated with..
- **State**: The endpoint state (`Active`, `Idle`, or `Stopped`)
- **Last activity**: The last time the endpoint was active.
- **Created**: The data and time the endpoint was created.

## Edit an endpoint

You can edit an endpoint to change the branch that the endpoint is associated with, the endpoint type (Read-write or read-only), enabled or disable passwordless connect, enable or disable autoscaling, or change minimum and maximum number of CPU units.

To edit an endpoint:

1. In the Neon Console, select **Endpoints**.
1. Fnd the endpoint you want to edit, click the kebab (&#8942;) menu, and select **Edit**.
1. Edit the endpoint and click **Save changes**.

## Delete an endpoint

Deleting an endpoint is a permanent action.

To delete an endpoint:

1. In the Neon Console, select **Endpoints**.
1. Fnd the endpoint you want to delete, click the kebab (&#8942;) menu, and select **Delete**.
1. On the **Delete the endpoint** dialog, click **Delete**.
