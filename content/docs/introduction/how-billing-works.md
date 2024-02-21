---
title: How billing works
enableTableOfContents: true
subtitle: Learn about plan allowances, extra usage, and monitoring usage
redirectFrom:
  - /docs/introduction/billing-overview
updatedOn: '2024-01-23T17:45:24.326Z'
---

## Usage allowances

Each of Neon's plans includes **Storage**, **Compute**, and **Project** usage allowances as outlined in the following table.

|            | Free Tier                                                    | Launch          | Scale             | Enterprise       |
|------------|--------------------------------------------------------------|-----------------|-------------------|------------------|
| Storage    | 512 MiB                                                      | 10 GiB          | 50 GiB            |  Larger sizes                |
| Compute    | Always-available primary branch compute, 20 _active hours_ (5 compute hours)/month on branch computes. | Up to 1,200 _active hours_/month (300 compute hours) | Up to 3,000 _active hours_/month (750 compute hours)  |  Custom                |
| Projects   | 1                                                            | 10              | 50                |  Unlimited                |


These allowances are included in your plan's monthly fee, except for the Free Tier, which is always free. You can find the monthly fees for the [Launch](/docs/introduction/plans#launch) and [Scale](/docs/introduction/plans#scale) plans on our [pricing](https://neon.tech/pricing) page. The [Enterprise](/docs/introduction/plans#enterprise) plan is completely customizable with respect to allowances.

<Admonition type="tip" title="What is a compute hour?">
A **compute hour** is 1 hour of _active time_ for a compute with 1 vCPU. If you have a compute with .25 vCPU, as you would on the Neon Free Tier, it would take 4 hours of _active time_ to use 1 compute hour. On the other hand, If you have a compute with 4 vCPU, it would only take 15 minutes of _active time_ to use 1 compute hour.

**Active hours** is the amount of time a compute is active as opposed to being idle due to being suspended due to inactivity. The time that your compute is idle is not counted toward compute usage.
</Admonition>

## Extra usage

The [Launch](/docs/introduction/plans##launch) and [Scale](/docs/introduction/plans##scale) plans permit extra usage above and beyond the allowances included with the monthly fee. The extra usage types that are available differ by plan, as outlined below:  

|                | Launch   | Scale    |
|----------------|----------|----------|
| Extra Compute  | &check;  | &check;  |
| Extra Projects |          | &check;  |
| Extra Storage  |          | &check;  |

The Launch plan only supports extra compute usage. If you are on the Launch plan and require extra projects or storage, you must upgrade to the Scale plan, which provides higher storage and project allowances. Once on the Scale plan, you have access to all extra usage types (storage, compute, and project) should you require it.

## How does extra usage work?

Taking advantage of extra usage requires no user action. Extra usage, if supported with your plan, is available by default. If you use more storage, compute, and projects than your allowance provides, the extra usage is automatically added to your monthly bill. The following sections explain _extra usage_ in more detail.

### Storage

Extra storage is only available with the [Scale](/docs/introduction/plans##scale) plan. Extra storage is billed in units of 10 GiB. For example, the Scale plan includes an allowance of 50 GiB in the plan's monthly fee. If you go over 50 GiB of storage, you are automatically billed for extra storage in increments of 10 GiB for the price stated on our [pricing](https://neon.tech/pricing) page. For example, as soon as you go over your allowance, say by 1 GiB, you are billed for one 10 GiB storage unit. If you go over by more than 10 GiB, you will be billed for two 10 GiB units of extra storage, and so on.

### Compute

Extra compute usage is available with the [Launch](/docs/introduction/plans##launch) and [Scale](/docs/introduction/plans##scale) plans. Extra compute usage is billed by _compute hour_. For example, the Launch plan has an allowance of 1200 compute hours included in the plan's monthly fee. If you use additional compute hours, you are billed for those at the compute-hour price stated on our [pricing](https://neon.tech/pricing) page.

### Projects

Extra project usage is only available with the [Scale](/docs/introduction/plans##scale) plan. Extra projects are billed in units of 10. For example, the Scale plan has an allowance of 50 projects, which is included in the plan's monthly fee. If you use more than 50 projects, you are automatically billed for an extra package of 10 projects at the price stated on our [pricing](https://neon.tech/pricing) page. For example, if you use 51 projects, you are billed for a package of 10 projects. If you use 61 projects, you are billed for two packages of 10 projects, and so on. 


## Monitoring billing and usage

You can monitor billing and usage for all projects in your Neon account from the **Billing** page in the Neon Console.

1. Navigate to the Neon Console.
1. Select your Profile.
1. Select **Billing** from the menu.

Here you will find the current bill and your current usage for all projects in your Neon account. Usage is reset to zero at the beginning of each month. 

![Monitor billing and usage](/docs/introduction/monitor_billing_usage.png)

### Monitor usage for a project

You can monitor usage for a single project from the **Usage** widget on your project's **Dashboard** in the Neon Console.

![Monitor usage widget](/docs/introduction/monitor_usage_widget.png)

Here you will find storage and compute usage for the project among other project usage metrics.

## Learn more about usage metrics

To learn more about Neon usage metrics, see [Usage metrics](/docs/introduction/usage-metrics).

<NeedHelp/>
