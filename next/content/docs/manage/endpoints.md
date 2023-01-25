---
title: Manage endpoints
enableTableOfContents: true
isDraft: false
---

An endpoint is a Neon compute instance. A single read-write endpoint is created for your project's [root branch](../../reference/glossary/#root-branch) (`main`) by default.

To connect to a database that resides in a branch, you must connect via an endpoint that is associated with the branch. The following diagram shows the project's root branch (`main`) and a child branch, both of which have an associated endpoint. Applications and clients connect to a branch via an endpoint.

```text
Project
    |----root branch (main) ---- endpoint (compute) <--- application/client
             |    |
             |    |---- database (neondb)
             |
             ---- child branch ---- endpoint (compute) <--- application/client
                            |
                            |---- database (mydb)
```

Endpoints can be managed independently of branches. For example, you can create and delete endpoints as necessary, assigning them to the branch you want to connect to. However, creating an endpoint is only permitted if you have a branch without an endpoint, as an endpoint must be assigned to a branch. Also, a branch can have only one endpoint. Attempting to create an endpoint for a branch that already has an endpoint results in an error.

Tier limits define the number of endpoints that you can create in a Neon project and the compute resources (vCPUs and RAM) available to an endpoint. The Neon [Free Tier](../../introduction/technical-preview-free-tier) allows up to 3 endpoints.

## Create an endpoint

To create an endpoint:

1. In the Neon Console, select **Endpoints**.
1. Select **New endpoint**.
1. On the **Create endpoint** dialog, select a branch to assign the endpoint to. The branch you select must not have an associated endpoint.
1. Click **Create endpoint**.

## View endpoints

To view the endpoints in your project, select **Endpoints** in the Neon Console.

The **Endpoints** page lists the endpoints that belong your Neon project.

Endpoint details include:

- **Host**: The endpoint name.
- **Branch**: The branch that the endpoint is associated with.
- **State**: The endpoint state (`Active`, `Idle`, or `Stopped`).
- **Last activity**: The last time the endpoint was active.
- **Created**: The date and time the endpoint was created.

## Edit an endpoint

You can edit an endpoint to modify the branch the endpoint is associated with.

To edit an endpoint:

1. In the Neon Console, select **Endpoints**.
1. Fnd the endpoint you want to edit, click the &#8942; menu, and select **Edit**.
1. Select a new branch for the endpoint and click **Save**. The branch you select must not have an associated endpoint.

## Delete an endpoint

Deleting an endpoint is a permanent action.

To delete an endpoint:

1. In the Neon Console, select **Endpoints**.
1. Find the endpoint you want to delete, click the &#8942; menu, and select **Delete**.
1. On the confirmation dialog, click **Delete**.

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
