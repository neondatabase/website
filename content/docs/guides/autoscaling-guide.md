---
title: Enable Autoscaling in Neon
subtitle: Learn how to enable Neon's Autoscaling feature to automatically scale compute
  resources on demand
enableTableOfContents: true
updatedOn: '2023-10-17T22:20:03.205Z'
---

Neon's Autoscaling feature dynamically adjusts the amount of compute resources allocated to a Neon compute endpoint in response to the current workload, eliminating the need for manual intervention. This guide demonstrates how to enable _Autoscaling_ in your Neon project.

_Autoscaling_ is a [Neon Pro plan](/docs/introduction/pro-plan) feature. Pro plan users can enable Autoscaling for a new project, for an existing project, or for an individual compute endpoint. _Autoscaling_ is supported with both read-write and read-only compute endpoints. Read-only compute endpoints enable Neon's [Read replica](/docs/introduction/read-replicas) feature.

## Enable Autoscaling for a new project

Enabling Autoscaling when you create a project allows you to set _Autoscaling_ default settings for all compute endpoints created in your project. You can adjust _Autoscaling_ settings for individual compute endpoints afterward, but setting defaults when creating a project saves you from having to configure the settings for each compute endpoint later on.

To enable Autoscaling when you first create your project:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. If you are creating your very first project, click **Create a project**. Otherwise, click **New Project**.
3. Specify a name, a Postgres version, and a region.
4. Under **Compute size**, select the **Autoscaling** option.
5. Using the slider, specify a minimum and maximum compute size.
    ![Autoscaling](/docs/guides/autoscaling_project_creation.png)

    <Admonition type="note">
    You can configure the Auto-suspend setting for your compute endpoint at the same time. The **Suspend compute after a period of inactivity** setting defines the period of inactivity after which a compute endpoint is automatically suspended. This feature is also referred to as "scale-to-zero".
    </Admonition>

6. Click **Create Project**. Your initial compute endpoint is created with the specified settings. All compute endpoints created in the future when creating a branch or adding a compute endpoint to a branch are created with this setting.

## Enable Autoscaling for an existing project

Configuring the _Autoscaling_ setting for an existing project sets the project's default, which is applied to all compute endpoints created from that point forward. Existing compute endpoints are unaffected. You can adjust _Autoscaling_ default or configure the setting for individual compute endpoints later, as necessary.

To configure Autoscaling default settings for an existing project:

1. Select a project in the Neon console.
1. On the Neon **Dashboard**, select **Settings**.
1. Select **Compute** and click **Change**.
1. Under **Compute size**, select the **Autoscaling** option.
1. Using the slider, specify a minimum and maximum compute size.
    ![Autoscaling](/docs/guides/autoscaling_existing_project.png)

    <Admonition type="note">
    You can configure the Auto-suspend setting for your compute endpoint at the same time. The **Suspend compute after a period of inactivity** setting defines the period of inactivity after which a compute endpoint is automatically suspended. This feature is also referred to as "scale-to-zero".
    </Admonition>

6. Click **Save**.

## Enable Autoscaling for a compute endpoint

[Neon Pro plan](/docs/introduction/pro-plan) users can edit an individual compute endpoint to alter the compute endpoint configuration, which includes _Autoscaling_.

To edit a compute endpoint:

1. In the Neon Console, select **Branches**.
1. Select a branch.
1. Click on the compute endpoint you want to edit.
![Edit compute endpoint menu](/docs/guides/autoscaling_edit.png)
1. Under **Compute size**, select the **Autoscaling** option.
1. Using the slider, specify a minimum and maximum compute size.
    ![Autoscaling edit settings](/docs/guides/autoscaling_edit_settings.png)

    Neon scales the compute size up and down within the specified range to meet workload demand. _Autoscaling_ currently supports a range of 1/4 (.25) to 7 vCPUs. One vCPU has 4 GB of RAM, 2 vCPUs have 8 GB of RAM, and so on. The amount of RAM in GBs is always 4 times the number of vCPUs.

    <Admonition type="note">
    You can configure the Auto-suspend setting for your compute endpoint at the same time. The **Suspend compute after a period of inactivity** setting defines the period of inactivity after which a compute endpoint is automatically suspended. This feature is also referred to as "scale-to-zero".
    </Admonition>
1. Click **Save**.

## Monitor Autoscaling

The `neon_utils` extension provides a `num_cpus()` function for monitoring how the _Autoscaling_ feature allocates compute resources in response to workload. For more information, see [The neon_utils extension](/docs/extensions/neon-utils).
