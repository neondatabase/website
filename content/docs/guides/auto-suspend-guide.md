---
title: Configurable auto-suspend
subtitle: Learn how to configure Neon's auto-suspend feature to control when your compute scales to zero 
enableTableOfContents: true
---

Neon's _Auto-suspend_ feature controls when a Neon compute instance transitions to an `Idle` state (scales to zero) due to inactivity. This guide demonstrates how to configure the _Auto-suspend_ setting in your Neon project.

Reasons for adjusting the _Auto-suspend_ setting might include:

- Avoiding cold starts. When a compute scales to zero, it is placed into an idle state. Restarting a compute transitions the compute to an active state, which can take anywhere from anywhere from 500 ms to a few seconds, depending on the region where your Neon project is deployed. At the cost of an always-active compute, you can disable the _Auto-suspend_ feature to completely avoid cold starts.
- Reducing the number of cold starts.
- Suspending a compute more quickly to save on compute costs.

By default, a Neon compute instance scales to zero after 300 seconds (5 minutes) of inactivity. For Neon [Free Tier](/docs/introduction/free-tier) users, this setting is fixed. [Neon Pro plan](/docs/introduction/pro-plan) users, on the other hand, can increase, decrease, or disable the _Auto-suspend_ setting, controlling when or if a compute scales to zero.

You can configure the _Auto-suspend_ setting in an existing project by editing a compute endpoint. You can also configure it when you first create a project in Neon, which also sets the _Auto-suspend_ default for the project. Both methods are described below.

## Configure auto-suspend for a compute endpoint

[Neon Pro plan](/docs/introduction/pro-plan) users can edit an individual compute endpoint to adjust the _Auto-suspend_ configuration.

To edit a compute endpoint:

1. In the Neon Console, select **Branches**.
1. Select a branch.
1. Click the compute endpoint kebab menu, and select **Edit**.
![Edit compute endpoint menu](/docs/guides/autoscaling_edit.png)
1. Under **Compute size**, enter the desired **Auto-suspend delay** setting. The value is specified in seconds. The maximum setting is `604800` seconds (7 days). A value of `0` is equivalent to the global default value of `300` seconds (5 minutes). A value of `-1` disables the _Auto-suspend_ feature, which means that the compute does not suspend (it remains active at all times).
1. Click **Save**.

## Set the auto-suspend default when creating a project

A project is a top-level object in the Neon object hierarchy. You can think of it as a container for all other objects, including branches and compute endpoints.

Enabling _Auto-suspend_ when you create a project allows you to set _Auto-suspend_ default setting for all compute endpoints created in your project. You can adjust _Auto-suspend_ setting for individual compute endpoints afterward, but setting desired default when creating a project will save you from having to configure this settings for each compute later on.

To configure the _Auto-suspend_ default setting at project creation time:

1. Navigate to the [Neon Console](https://console.neon.tech).
1. If you are creating your very first project, click **Create a project**. Otherwise, click **New Project**.
1. Specify a name, a Postgres version, and a region.
1. Under **Compute size**, enter the desired **Auto-suspend delay** setting. The value is specified in seconds. The maximum setting is `604800` seconds (7 days). A value of `0` is equivalent to the global default value of `300` seconds (5 minutes). A value of `-1` disables the _Auto-suspend_ feature, which means that the compute does not suspend (it remains active at all times).
![Auto-suspend delay settings](/docs/guides/autosuspend_delay.png)
1. Click **Save**.
1. Click **Create Project**. Your initial compute endpoint is created with the specified settings. All compute endpoints created in the future when creating a branch or adding a compute endpoint to a branch are created with the settings you specified.

## Monitor compute suspension

You can monitor the status of a compute on the **Branches** page in the Neon Console. A compute will report either an **Active** or **Idle** status.

![Compute endpoint status](/docs/connect/compute_endpoint_state.png)

You can also view compute state transitions in the **Branches** widget on the Neon **Dashboard**.

User actions that activate an idle compute include [connecting from a client such as psql](/docs/connect/query-with-psql-editor), running a query on your database from the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor), or accessing the compute via the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api).

<Admonition type="info">
The Neon API includes [Start endpoint](https://api-docs.neon.tech/reference/startprojectendpoint) and [Suspend endpoint](https://api-docs.neon.tech/reference/startprojectendpoint) APIs for the specific purpose of activating and suspending a compute.
</Admonition>

You can try any of these methods and watch the status of your compute as it changes from an **Idle** to an **Active** state.
