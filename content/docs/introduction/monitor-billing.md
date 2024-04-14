---
title: Monitor billing and usage
enableTableOfContents: true
subtitle: Learn how to monitor billing and usage in Neon
redirectFrom:
  - /docs/introduction/billing-overview
---

You can monitor billing and usage for all projects in your Neon account from the **Billing** page in the Neon Console.

1. Navigate to the Neon Console.
1. Select your Profile.
1. Select **Billing** from the menu.

Here you will find the current bill and your current usage for all projects in your Neon account. Usage is reset to zero at the beginning of each month. For example, on the Launch plan, compute usage will be set back to **0/300h** at the beginning of each month.

![Monitor billing and usage](/docs/introduction/monitor_billing_usage.png)

### Monitor usage for a project

You can monitor usage for a single project from the **Usage** widget on your project's **Dashboard** in the Neon Console.

![Monitor usage widget](/docs/introduction/monitor_usage_widget.png)

Here you will find storage and compute usage for the project among other usage metrics. 

#### Interpreting usage

**Compute** usage is tracked in **compute hours**. A compute hour is 1 active hour for a compute with 1 vCPU. For a compute with .25 vCPU, it takes 4 _active hours_ to use 1 compute hour. On the other hand, if your compute has 4 vCPUs, it takes only 15 minutes to use 1 compute hour. 

<Admonition type="note">
On the Free Tier, the primary branch compute is a 0.25 vCPU compute that is always available, so allowances do not apply. You can run your 0.25 vCPU compute on the Free Tier 24/7. Only branch computes on the Free Tier have an allowance, which is the 5 compute hour/month allowance that Free Tier users see on the **Billing** page. On the Free Tier, this is actually 20 hours of usage because Free Tier computes always have 0.25 vCPU. You cannot increase the compute size on the Free Tier.
</Admonition>

**Storage** includes your data size and history. Neon maintains a history of changes to support branching-related features such as _point-in-time restore_. On the Free Tier, your default history retention period is 24 hours. The Launch plan supports up to 7 days of history retention, and the Scale plan supports up to 30 days. Keep in mind that history retention increases storage. More history requires more storage. To manage the amount of history you retain, you can configure the history retention setting for your project. See [Configure history retention](/docs/manage/projects#configure-history-retention).

**What about extra usage?**

The Launch plan supports extra compute and storage usage. The Scale plan supports extra storage, compute, and project usage. Any extra usage allowance is automatically added (and billed for) when you exceed the allowances included in your plan's base fee. Extra storage charges are prorated for the month. See [Extra usage](#extra-usage) for details. If extra usage occurs, it is reflected in your monthly allowance on the **Billing** page. For example, if you purchased an extra 10 GiB of storage when you exceed your 50 GiB storage allowance on the Scale plan, the extra 10 GiB is added to your **Storage** allowance on the **Billing** page.
