---
title: How billing works
enableTableOfContents: true
subtitle: Learn about plan allowances, extra usage, and monitoring usage
redirectFrom:
  - /docs/introduction/billing-overview
updatedOn: '2024-02-22T14:29:54.384Z'
---

## Usage allowances

Each of Neon's plans includes **Storage**, **Compute**, and **Project** usage allowances in the base monthly fee as outlined in the following table.

|            | Free Tier                                                    | Launch          | Scale             | Enterprise       |
|------------|--------------------------------------------------------------|-----------------|-------------------|------------------|
| Monthly fee| $0/month                                                     | $19/month       | $69/month         | Custom           |
| Storage allowance   | 512 MiB                                                      | 10 GiB          | 50 GiB            |  Larger sizes                |
| Compute allowance   | Always-available primary branch compute and 5 compute hours (20 _active hours_)/month on branch computes. | 300 compute hours (1,200 _active hours_)/month | 750 compute hours (3,000 _active hours_)/month  |  Custom                |
| Projects allowance  | 1                                                            | 10              | 50                |  Unlimited                |


The [Enterprise](/docs/introduction/plans#enterprise) plan is fully customizable with respect to allowances. Please contact [Sales](/contact-sales) for more information.

<Admonition type="tip" title="What are active hours and compute hours?">

- An **active hour** is a measure of the amount of time a compute is active. The time your compute is idle when suspended due to inactivity is not counted. In the table above, _active hours_ are based on a 0.25 vCPU compute size.
- A **compute hour** is one _active hour_ for a compute with 1 vCPU. For a compute with .25 vCPU, it takes 4 _active hours_ to use 1 compute hour. On the other hand, if your compute has 4 vCPUs, it takes only 15 minutes to use 1 compute hour.
- **Compute hours formula**

  ```
  compute hours = compute size * active hours
  ```

</Admonition>

## Extra usage

The [Launch](/docs/introduction/plans##launch) and [Scale](/docs/introduction/plans##scale) plans permit extra usage beyond the allowances included with the monthly fee. The extra usage types that are available differ by plan, as outlined below:  

|                | Launch   | Scale    |
|----------------|----------|----------|
| Extra Storage  | &check;  | &check;  |
| Extra Compute  | &check;  | &check;  |
| Extra Projects |          | &check;  |

The Launch plan does not support extra projects. If you are on the Launch plan and require extra projects, you must upgrade to the Scale plan, which provides higher project allowances.

## How does extra usage work?

Taking advantage of extra usage requires no user action. Extra usage, if supported with your plan, is available by default. If you use more storage, compute, or projects than your monthly allowance provides, the extra usage is automatically added to your monthly bill. The following sections explain _extra usage_ in more detail.

### Storage

Extra storage is available with the [Launch](/docs/introduction/plans##launch) and [Scale](/docs/introduction/plans##scale) plans:

| Plan    | Extra Storage Unit Size | Cost per Unit |
|---------|-------------------|---------------|
| Launch  | 2 GiB             | $3.5          |
| Scale   | 10 GiB            | $15           |


For example, the Launch plan includes an allowance of 10 GiB in the plan's monthly fee. If you exceed 10 GiB of storage at any point during the month, you are automatically billed for an extra storage unit of 2 GiB at $3.5 per unit. If you exceed 12 GiB, you are billed for 2 units of 2 GiB (an extra $7), and so on. It works the same way on the Scale plan, but with 10 GiB units of storage at $15 per unit. However, the extra storage charge is prorated for the month. 

<Admonition type="note" title="How extra storage charges are prorated">
The proration formula for calculating the cost of extra storage purchased at some point during a monthly billing period is:

```plaintext
Cost = Units x (Unit Price/Days in Month) x Days Left in Month
```
​
Where:

- **Cost** is the amount charged for an extra unit of storage. 
- **Units** is the number of storage units purchased.
- **Unit Price** is the cost per storage unit. On the Launch plan, it is $3.50 per 2 GiB unit. On the Scale plan, it is $15.00 per 10 GiB unit.
- **Days** is the total number of days in the month.
- **Days Left in Month** is the number of days remaining in the month after going over the storage limit.
</Admonition>

### Compute

Extra compute usage is available with the [Launch](/docs/introduction/plans##launch) and [Scale](/docs/introduction/plans##scale) plans. Extra compute usage is billed by _compute hour_ at $0.16 per hour. For example, the Launch plan has an allowance of 300 compute hours included in the plan's monthly fee. If you use 100 additional compute hours over the billing period, you are billed an extra $16 (100 x $0.16).

### Projects

Extra project usage is available with the [Scale](/docs/introduction/plans##scale) plan. Extra projects are billed in units of 10. For example, the Scale plan has an allowance of 50 projects. If you use more than 50 projects, you are automatically billed for an extra package of 10 projects at $50 per package. For example, if you use 51 projects, you are billed for 1 package of 10 projects (an extra $50). If you use 61 projects, you are billed for 2 packages of 10 projects (an extra $100), and so on. 

## Learn more about usage metrics

To learn more about Neon **Compute**, **Storage**, and **Project** metrics, see [Usage metrics](/docs/introduction/usage-metrics).



## Monitoring billing and usage

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

<NeedHelp/>
