---
title: Enabling Autoscaling in Neon
subtitle: Learn how to enable Neon's Autoscaling feature to automatically scale compute resources on demand
enableTableOfContents: true
---

Neon's Autoscaling feature dynamically adjusts the amount of compute resources allocated to a Neon compute endpoint in response to the the current workload, eliminating the need for manual intervention. This guide walks you through enabling _Autoscaling_ for a compute endpoint.

_Autoscaling_ is a [Neon Pro plan](/docs/introduction/pro-plan) feature. Pro plan users can enable Autoscaling for any compute endpoint in a Neon project, including compute endpoints associated with primary and non-primary branches. _Autoscaling_ is also support with read-only compute endpoints, which enable Neon's read replica feature.

Autoscaling can be enabled when you create a project or afterward by editing a compute endpoint.

## Enable Autoscaling when creating a project

Neon Pro plan users can create multiple Neon projects. A project is the top-level object in the Neon object hierarchy. You can think of it as a container for all other objects. Branches and compute endpoints belong to a project. A Neon project defines the region where project resources reside, and are often used to isolate resources for management or billing purposes.

The Autoscaling settings you define at project creation time become the default settings for any compute endpoints created in the project, including the compute endpoint created with the root branch of your Neon project.

## Enable Autoscaling by editing a compute endpoint

Neon paid plan users can edit a compute endpoint to change the compute configuration, which includes Autoscaling settings.
To edit a compute endpoint:

1. In the Neon Console, select **Branches**.
1. Select a branch.
1. Click the compute endpoint kebab menu, and select **Edit**.
1. Specify your changes and click **Save**.

### Compute size and Autoscaling configuration

Neon [Pro plan](/docs/introduction/pro-plan) users can change compute size settings when [editing a compute endpoint](#edit-a-compute-endpoint).

_Compute size_ is the number of Compute Units (CUs) assigned to a Neon compute endpoint. The number of CUs determines the processing capacity of the compute endpoint. One CU has 1 vCPU and 4 GB of RAM, 2 CUs have 2 vCPUs and 8 GB of RAM, and so on. The amount of RAM in GBs is always 4 times the number of CUs, as shown in the table below. Currently, a Neon compute can have anywhere from 1/4 (.25) to 7 CUs.

| Compute Units | vCPU | RAM    |
|:--------------|:-----|:-------|
| .25           | .25  | 1 GB   |
| .5            | .5   | 2 GB   |
| 1             | 1    | 4 GB   |
| 2             | 2    | 8 GB   |
| 3             | 3    | 12 GB  |
| 4             | 4    | 16 GB  |
| 5             | 5    | 20 GB  |
| 6             | 6    | 24 GB  |
| 7             | 7    | 28 GB  |

Neon supports two compute size configuration options:

- **Fixed Size:** This option allows you to select a fixed compute size ranging from .25 CUs to 7 CUs. A fixed-size compute does not scale to meet workload demand.
- **Autoscaling:** This option allows you to specify a minimum and maximum compute size. Neon scales the compute size up and down within the selected compute size boundaries to meet workload demand. _Autoscaling_ currently supports a range of 1/4 (.25) to 7 CUs. For information about how Neon implements the _Autoscaling_ feature, see [Autoscaling](/docs/introduction/autoscaling).

<Admonition type="info">
The `neon_utils` extension provides a `num_cpus()` function you can use to monitor how the _Autoscaling_ feature allocates compute resources in response to workload. For more information, see [The neon_utils extension](/docs/extensions/neon-utils).
</Admonition>
