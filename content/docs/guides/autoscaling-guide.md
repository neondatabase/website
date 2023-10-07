---
title: Enable Autoscaling in Neon
subtitle: Learn how to enable Neon's Autoscaling feature to automatically scale compute
  resources on demand
enableTableOfContents: true
updatedOn: '2023-10-07T08:16:00.559Z'
---

Neon's Autoscaling feature dynamically adjusts the amount of compute resources allocated to a Neon compute endpoint in response to the current workload, eliminating the need for manual intervention. This guide demonstrates how to enable _Autoscaling_ in your Neon project.

_Autoscaling_ is a [Neon Pro plan](/docs/introduction/pro-plan) feature. Pro plan users can enable Autoscaling for any compute endpoint in a Neon project. _Autoscaling_ is supported with both read-write and read-only compute endpoints. Read-only compute endpoints enable Neon's [Read replica](/docs/introduction/read-replicas) feature.

You can enable _Autoscaling_ in an existing project by editing a compute endpoint. You can also enable it when you first create a Neon project, which sets the _Autoscaling_ defaults for your project. Both methods are described below.

## Enable Autoscaling for a compute endpoint

[Neon Pro plan](/docs/introduction/pro-plan) users can edit an individual compute endpoint to alter the compute endpoint configuration, which includes _Autoscaling_.

To edit a compute endpoint:

1. In the Neon Console, select **Branches**.
1. Select a branch.
1. Click the compute endpoint kebab menu, and select **Edit**.
![Edit compute endpoint menu](/docs/guides/autoscaling_edit.png)
1. Under **Compute size**, select the **Autoscaling** option.
1. Using the slider, specify a minimum and maximum compute size.
    ![Autoscaling edit settings](/docs/guides/autoscaling_edit_settings.png)

    Neon scales the compute size up and down within the specified range to meet workload demand. _Autoscaling_ currently supports a range of 1/4 (.25) to 7 vCPUs. One vCPU has 4 GB of RAM, 2 vCPUs have 8 GB of RAM, and so on. The amount of RAM in GBs is always 4 times the number of vCPUs.

    <Admonition type="note">
    You can configure the **Auto-suspend delay** setting for your compute endpoint at the same time. The **Auto-suspend delay** setting defines the number of seconds of inactivity after which a compute endpoint is automatically suspended. This feature is also referred to as "scale-to-zero".
    </Admonition>
1. Click **Save**.

## Set Autoscaling defaults when creating a project

A project is a top-level object in the Neon object hierarchy. You can think of it as a container for all other objects, including branches and compute endpoints.

Enabling Autoscaling when you create a project allows you to set _Autoscaling_ default settings for all compute endpoints created in your project. You can adjust _Autoscaling_ settings for individual compute endpoints afterward, but setting defaults when creating a project saves you from having to configure the settings for each compute later on.

To configure Autoscaling default settings at project creation time:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. If you are creating your very first project, click **Create a project**. Otherwise, click **New Project**.
3. Specify a name, a Postgres version, and a region.
4. Under **Compute size**, select the **Autoscaling** option.
5. Using the slider, specify a minimum and maximum compute size.
    ![Autoscaling](/docs/guides/autoscaling_project_creation.png)

    <Admonition type="note">
    You can also specify a default **Auto-suspend delay** setting at project creation time. The **Auto-suspend delay** setting defines the number of seconds of inactivity after which a compute endpoint is automatically suspended. This feature is also referred to as "scale-to-zero". The setting specified at project creation time becomes the default setting for newly created compute endpoints.
    </Admonition>

6. Click **Create Project**. Your initial compute endpoint is created with the specified settings. All compute endpoints created in the future when creating a branch or adding a compute endpoint to a branch are created with this setting.

## Monitor Autoscaling

The `neon_utils` extension provides a `num_cpus()` function for monitoring how the _Autoscaling_ feature allocates compute resources in response to workload. For more information, see [The neon_utils extension](/docs/extensions/neon-utils).
