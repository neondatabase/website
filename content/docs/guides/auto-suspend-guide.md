---
title: Configuring Auto-suspend for Neon computes
subtitle: Learn how to configure Neon's Auto-suspend feature to control when your
  compute scales to zero
enableTableOfContents: true
updatedOn: '2023-10-19T12:56:03.255Z'
---

Neon's [Auto-suspend](/docs/introduction/auto-suspend) feature controls when a Neon compute instance transitions to an `Idle` state (scales to zero) due to inactivity. This guide demonstrates how to configure the _Auto-suspend_ setting in your Neon project.

[Neon Pro plan](/docs/introduction/pro-plan) users can configure the _Auto-suspend_ setting for a new project, for an existing project, or for an individual compute endpoint. Configuring the _Auto-suspend_ setting for a new or existing project sets the project's default Auto-suspend setting, which is used from that point forward when creating new compute endpoints.

### Configure the Auto-suspend setting for a new project

Configuring the _Auto-suspend_ setting for a new project sets the project's default, which is applied to all compute endpoints created from that point forward. You can adjust this _Auto-suspend_ default at any time, or configure the setting for individual compute endpoints later, as necessary.

To configure the _Auto-suspend_ default setting when you first create your project:

1. Navigate to the [Neon Console](https://console.neon.tech).
1. If you are creating your very first project, click **Create a project**. Otherwise, click **New Project**.
1. Specify a name, a Postgres version, and a region.
1. Under **Compute size**, select **Suspend compute after a period of inactivity** and specify your delay period (5 minutes or a custom period). The maximum setting is 7 days. Deselecting **Suspend compute after a period of inactivity** means the compute is always active.

    <Admonition type="note">
    You can configure default **Compute size** settings at the same time.
    </Admonition>

1. Click **Save**.
1. Click **Create Project**. Your initial compute endpoint is created with the specified setting.

### Configure the Auto-suspend setting for an existing project

Configuring the _Auto-suspend_ setting for an existing project sets the project's default, which is applied to all compute endpoints created from that point forward. Existing compute endpoints are unaffected. You can adjust the _Auto-suspend_ default or configure the setting for individual compute endpoints later, as necessary.

To configure the Auto-suspend default for an existing project:

1. Select a project in the Neon console.
1. On the Neon **Dashboard**, select **Settings**.
1. Select **Compute** and click **Change**.
1. Select **Suspend compute after a period of inactivity** and specify your delay period (5 minutes or a custom period). The maximum setting is 7 days. Deselecting **Suspend compute after a period of inactivity** means the compute is always active.

    <Admonition type="note">
    You can configure default **Compute size** settings at the same time.
    </Admonition>

1. Click **Save**.

## Configure Auto-suspend for a compute endpoint

To configure the _Auto-suspend_ setting for an individual compute endpoint:

1. In the Neon Console, select **Branches**.
1. Select a branch.
1. Click the menu in the **Computes** table, and select **Edit**.
![Edit compute endpoint menu](/docs/guides/autoscaling_edit.png)
1. Under **Compute size**, select **Suspend compute after a period of inactivity** and specify your delay period (5 minutes or a custom period). The maximum setting is 7 days. Deselecting **Suspend compute after a period of inactivity** means the compute is always active.

    <Admonition type="note">
    You can configure **Compute size** settings for your compute endpoint at the same time.
    </Admonition>

1. Click **Save**.

## Monitor auto-suspension

You can monitor auto-suspension on the **Branches** page in the Neon Console. A compute reports either an **Active** or **Idle** status.

![Compute endpoint status](/docs/connect/compute_endpoint_state.png)

You can also view compute state transitions in the **Branches** widget on the Neon **Dashboard**.

User actions that activate an idle compute include [connecting from a client such as psql](/docs/connect/query-with-psql-editor), running a query on your database from the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor), or accessing the compute via the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api).

<Admonition type="info">
The Neon API includes [Start endpoint](https://api-docs.neon.tech/reference/startprojectendpoint) and [Suspend endpoint](https://api-docs.neon.tech/reference/startprojectendpoint) APIs for the specific purpose of activating and suspending a compute.
</Admonition>

You can try any of these methods and watch the status of your compute as it transitions from an **Idle** to an **Active** state.
