---
title: Autoscaling
subtitle: An introduction to Neon's autoscaling
enableTableOfContents: true
updatedOn: '2024-11-20T12:37:42.224Z'
---

Neon's _Autoscaling_ feature dynamically adjusts the amount of compute resources allocated to a Neon compute in response to the current load, eliminating the need for manual intervention or restarts.

The following visualization shows how Neon’s autoscaling works throughout a typical day. The compute resources scale up or down based on demand, ensuring that your database has the necessary compute resources when it needs them, while conserving resources during off-peak times.

![visualization for autoscaling](/docs/introduction/autoscaling_intro.png)

To dive deeper into how Neon's autoscaling algorithm operates, visit [Understanding Neon’s autoscaling algorithm](/docs/guides/autoscaling-algorithm).

## Autoscaling benefits

Neon's Autoscaling feature offers the following benefits:

- **On-demand scaling:** Autoscaling helps with workloads that experience variations over time, such as applications with time-based changes in demand or occasional spikes.
- **Cost-effectiveness**: Autoscaling optimizes resource utilization, ensuring that you only use required resources, rather than over-provisioning to handle peak loads.
- **Resource and cost control**: Autoscaling operates within a user-defined range, ensuring that your compute resources and associated costs do not scale indefinitely.
- **No manual intervention or restarts**: After you enable autoscaling and set scaling limits, no manual intervention or restarts are required, allowing you to focus on your applications.

## Configuring autoscaling

You can enable autoscaling for any compute instance, whether it's a primary compute or a read replica. Simply open **Edit compute settings** ([learn how](/docs/guides/autoscaling-guide)) for your compute and set the autoscaling range. This range defines the minimum and maximum compute sizes within which your compute will automatically scale. For example, you might set the minimum to 2 vCPUs with 8 GB of RAM and the maximum to 8 vCPUs with 32 GB of RAM. Your compute resources will dynamically adjust within these limits, never dropping below the minimum or exceeding the maximum, regardless of demand. We recommend regularly [monitoring](/docs/introduction/monitoring-page) your usage from the **Monitoring Dashboard** to determine if adjustments to this range are needed.

![autoscaling configuration](/docs/introduction/autoscaling_config.png)

For full details about enabling and configuring autoscaling, see [Enabling autoscaling](/docs/guides/autoscaling-guide).
