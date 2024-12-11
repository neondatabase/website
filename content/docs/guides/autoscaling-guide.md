---
title: Enable Autoscaling in Neon
enableTableOfContents: true
updatedOn: '2024-11-20T12:37:42.223Z'
---

<InfoBlock>
<DocsList title="What you will learn:">
<p>Enable autoscaling for a compute</p>
<p>Configure autoscaling defaults for your project</p>
</DocsList>

<DocsList title="Related topics" theme="docs">
<a href="/docs/introduction/autoscaling">About autoscaling</a>
<a href="/docs/guides/autoscaling-algorithm">How the algorithm works</a>
</DocsList>
</InfoBlock>

This guide demonstrates how to enable autoscaling in your Neon project and how to [visualize](#monitor-autoscaling) your usage.

<Admonition type="tip" title="Did you know?">
Neon's autoscaling feature instantly scales your compute and memory resources. **No manual intervention or restarts are required.** 
</Admonition>

## Enable autoscaling for a compute

You can edit an individual compute to alter the compute configuration, which includes autoscaling.

To edit a compute:

1. In the Neon Console, select **Branches**.
1. Select a branch.
1. On the **Compute** tab, identify the compute you want to configure and click **Edit**.
   ![Edit compute menu](/docs/guides/autoscaling_edit.png)
1. On the **Edit compute** settings drawer, toggle **Enable autoscaling** to enable it and use the slider to specify a minimum and maximum compute size.
   ![Autoscaling edit settings](/docs/introduction/autoscaling_config.png)

   Neon scales the compute size up and down within the specified range to meet workload demand. Autoscaling currently supports a range of 1/4 (.25) to 16 vCPUs. One vCPU has 4 GB of RAM, 2 vCPUs have 8 GB of RAM, and so on. The amount of RAM in GB is always 4 times the number of vCPUs. For an overview of available compute sizes, see [Compute size and autoscaling configuration](/docs/manage/endpoints#compute-size-and-autoscaling-configuration). The maximum autoscaling setting cannot be more than 8 times the minimum setting when your maximum compute size is greater than 10.

   <Admonition type="note">
   You can configure the scale to zero setting for your compute at the same time. The scale to zero setting defines the period of inactivity after which a compute is automatically suspended. For more, see [Scale to Zero](/docs/introduction/scale-to-zero).
   </Admonition>

1. Click **Save**.

## Configure autoscaling defaults for your project

You can configure autoscaling configuration defaults for your project so that **newly created computes** (including those created when you create a new branch or add read replica) are created with the same autoscaling configuration. This will save your from having to configure autoscaling each time, assuming you want the same settings for all of your computes.

<Admonition type="note">
Changing your autoscaling default settings does not alter the autoscaling configuration for existing computes.
</Admonition>

To configure autoscaling defaults:

1. Navigate to your Project Dashboard and select **Settings** from the sidebar.
2. Select **Compute**.
3. Select **Change** to open the **Change default compute settings** modal.
   ![Edit autoscaling defaults](/docs/guides/autoscaling_defaults.png)
4. Use the slider to specify a minimum and maximum compute size and **Save** your changes.

The next time you create a compute, these settings will be applied to it.

## Monitor autoscaling

From the Neon Console, you can view how your vCPU and RAM usage scales over time (last hour, day, and week). From the **Branches** page, open the branch you want to inspect, then open the **Edit** modal for its compute.

![autoscaling graph example](/docs/guides/autoscaling_graphs_sample.png 'no-border')

Some key points about this Autoscaling view:

- Allocation refers to the vCPU and memory size provisioned to handle current demand; autoscaling automatically adjusts this allocation, increasing or decreasing the allocated vCPU and memory size in a step-wise fashion as demand fluctuates, within your minimum and maximum limits.
- Your minimum and maximum limits are shown as solid horizontal lines. This represents the allocation boundary: the size of your allocated vCPU/memory stays within this range so long as your compute remains active. It scales to zero after the defined period of inactivity.
- A re-activated compute scales up immediately to your minimum allocation, ensuring adequate performance for your anticipated demand.

Place your cursor anywhere in the graph to get more usage detail about that particular point in time.

![autoscaling graph detail](/docs/guides/autoscaling_graph_detail.png 'no-border')

<Admonition type="note">
To refresh the graph, close the **Edit compute settings** drawer and reopen it.
</Admonition>

See below for some rules of thumb on actions you might want to take based on trends you see in this view.

### Start with a good minimum

Ideally, for smaller datasets, you want to keep as much of your dataset in memory (RAM) as possible. This improves performance by minimizing I/O operations. We recommend setting a large enough minimum limit to fit your full dataset in memory. For larger datasets and more sizing advice, see [how to size your compute](/docs/manage/endpoints#how-to-size-your-compute).

### Setting your maximum

If your autoscaling graphs show regular spikes that hit your maximum setting, consider increasing your maximum. However, because these spikes plateau at the maximum setting, it can be difficult to determine your actual demand.

Another approach is to set a higher threshold than you need and monitor usage spikes to get a sense of where your typical maximum demand reaches; you can then throttle the maximum setting down closer to anticipated/historical demand. Either way, with autoscaling you only use what's necessary; a higher setting does not translate to increased usage unless there's demand for it.

### The neon_utils extension

Another tool for understanding usage, the `neon_utils` extension provides a `num_cpus()` function that helps you monitor how the _Autoscaling_ feature allocates compute resources in response to workload. For more information, see [The neon_utils extension](/docs/extensions/neon-utils).
