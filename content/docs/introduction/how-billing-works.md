---
title: How billing works
enableTableOfContents: true
subtitle: 'Learn about plan allowances, extra usage, and monitoring usage'
redirectFrom:
  - /docs/introduction/billing-overview
updatedOn: '2024-02-22T14:29:54.384Z'
---

## Usage allowances

Each of Neon's plans includes **Storage**, **Compute**, and **Project** usage allowances as outlined in the following table. 

|            | Free Tier                                                    | Launch          | Scale             | Enterprise       |
|------------|--------------------------------------------------------------|-----------------|-------------------|------------------|
| Monthly fee| $0/month                                                     | $19/month       | $69/month         | Custom           |
| Storage allowance   | 512 MiB                                                      | 10 GiB          | 50 GiB            |  Larger sizes                |
| Compute allowance   | Always-available primary branch compute and 5 compute hours (20 _active hours_)/month on branch computes. | 300 compute hours (1,200 _active hours_)/month | 750 compute hours (3,000 _active hours_)/month  |  Custom                |
| Projects allowance  | 1                                                            | 10              | 50                |  Unlimited                |


These allowances are included in your plan's monthly fee, except for the Free Tier, which is always free. The [Enterprise](/docs/introduction/plans#enterprise) plan is completely customizable with respect to allowances.

<Admonition type="tip" title="What are active hours and compute hours?">

An **active hour** is a measure of the amount of time a compute is active. The time your compute is idle when suspended due to inactivity is not counted. In the table above, _active hours_ are based on a compute with 0.25 vCPU.

A **compute hour** is one _active hour_ for a compute with 1 vCPU. For a compute with .25 vCPU, it takes 4 _active hours_ to use 1 compute hour. On the other hand, if your compute has 4 vCPUs, it takes only 15 minutes to use 1 compute hour.

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

Taking advantage of extra usage requires no user action. Extra usage, if supported with your plan, is available by default. If you use more storage, compute, and projects than your monthly allowance provides, the extra usage is automatically added to your monthly bill. The following sections explain _extra usage_ in more detail.

### Storage

Extra storage is only available with the [Scale](/docs/introduction/plans##scale) plan. Extra storage is billed in units of 10 GiB. For example, the Scale plan includes an allowance of 50 GiB in the plan's monthly fee. If you go over 50 GiB of storage, you are automatically billed for extra storage in increments of 10 GiB at $15 per increment, as mentioned on our [pricing](https://neon.tech/pricing) page. For example, as soon as you go over your allowance, say by 1 GiB, you are billed for one 10 GiB storage unit at $15. If you go over by more than 10 GiB, you will be billed for two 10 GiB units of extra storage (2x $15), and so on.

### Compute

Extra compute usage is available with the [Launch](/docs/introduction/plans##launch) and [Scale](/docs/introduction/plans##scale) plans. Extra compute usage is billed by _compute hour_ at $0.04 per hour. For example, the Launch plan has an allowance of 300 compute hours included in the plan's monthly fee. If you use 100 additional compute hours over the monthly billing period, you are billed an extra $4 (100 x $0.04) for the month.

### Projects

Extra project usage is only available with the [Scale](/docs/introduction/plans##scale) plan. Extra projects are billed in units of 10. For example, the Scale plan has an allowance of 50 projects, which is included in the plan's monthly fee. If you use more than 50 projects, you are automatically billed for an extra package of 10 projects at $50 per package. For example, if you use 51 projects, you are billed for 1 package of 10 projects (an extra $50). If you use 61 projects, you are billed for 2 packages of 10 projects ($100), and so on. 

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

#### Interpreting usage

**Compute** usage is tracked in **compute hours**. A compute hour is 1 active hour for a compute with 1 vCPU. For a compute with .25 vCPU, it takes 4 _active hours_ to use 1 compute hour. On the other hand, if your compute has 4 vCPUs, it takes only 15 minutes to use 1 compute hour. Neon's [Pricing](https://neon.tech/pricing) page outlines monthly compute allowances in both **active hours** and **compute hours**. Active hours are based on a compute with 0.25 vCPU, and compute hours are based on a compute with 1 vCPU, as outlined below. 

<Admonition type="note">
On the Free Tier, the primary branch compute is a 0.25 vCPU compute that is always available, so allowances do not apply. You can run your 0.25 vCPU compute on the Free Tier 24/7. Only branch computes on the Free Tier have an allowance, which is the 5 compute hour/month allowance Free Tier users see on the **Billing** page. On the Free Tier, this is actually 20 hours of usage because Free Tier computes always have 0.25 vCPU. You cannot increase the compute size on the Free Tier.
</Admonition>

| Plan        | Compute hours (based on a 1 vCPU compute) | Active hours (based on a 0.25 vCPU compute) |
|-------------|------------------------|---------------------------|
| Free        | 5 (for branch computes)  | 20                        |
| Launch      | 300                       |  1200                  |
| Scale       | 750                       |  3000                  |
| Enterprise  | Custom                       | Custom              |

Storage and project allowances are straightforward. Refer to the allowances for your chosen [plan](/docs/introductions/plans). 

**What about extra usage?**

If your plan supports extra usage, extra storage, compute, and project allowances are automatically added (and billed for) when you exceed your allowances. See [Extra usage](#extra-usage) for details about the extra usage options for each plan. If extra usage is allocated, it is reflected in your monthly allowances on the **Billing** page. For example, if you are allocated an extra 10 GiB of storage when you exceed your 50 GiB storage allowance on the Scale plan, the extra 10 GiB is added to your **Storage** allowance on the **Billing** page.

## Learn more about usage metrics

To learn more about Neon usage metrics, see [Usage metrics](/docs/introduction/usage-metrics).

## Neon pricing guide

You can use this guide to estimate your monthly bill with Neon based on your selected plan and estimated usage.

1. [Select your plan](#step-1-select-your-plan)
2. [Monthly base fee](#step-2-monthly-base-fee)
3. [Estimate your usage](#step-3-estimate-your-usage)
4. [Calculate extra usage fees (if applicable)](#step-4-calculate-extra-usage-fees-if-applicable)
5. [Total monthly estimate](#step-5-total-monthly-estimate)

### Step 1: Select your plan

First, identify which plan you are using or plan to use. The available plans are:

- Free Tier: $0/month
- Launch: $19/month
- Scale: $69/month
- Enterprise: Custom pricing (contact us for details)

### Step 2: Monthly base fee

Note the base monthly fee associated with your plan from the list above.

### Step 3: Estimate your usage

Estimate your monthly usage in the following areas:

- Storage (GiB): How much storage you expect to use.
- Compute (Hours): How many compute hours you expect to need.
- Projects: The number of projects you will be running.

### Step 4: Calculate extra usage fees (if applicable)

Based on your plan, calculate any extra fees for exceeding your plan's allowances.

#### For the Launch plan:

- Extra Compute: If you exceed 300 compute hours, extra compute is billed at $0.04/hour.

#### For the Scale plan:

- Extra Storage: If you exceed 50 GiB, extra storage is billed in increments of 10 GiB at $15 per increment.
- Extra Compute: If you exceed 750 compute hours, extra compute is billed at $0.04/hour.
- Extra Projects: If you exceed 50 projects, extra projects are billed in units of 10 projects at $50 per unit.

##### Step 5: Total monthly estimate

Add up the base monthly fee and any applicable extra usage fees to estimate your total monthly bill.

```
Total Monthly Estimate = Monthly Base Fee + Extra Storage Fee + Extra Compute Fee + Extra Project Fee
```

**Launch plan example**

- Base Fee: $19
- Compute Usage: 350 hours (50 hours over the allowance)
- Extra Compute Fee: 50 hours * $0.04 = $2

**Total Estimate**: $19 + $2 = $21 per month

**Scale plan example**

- Base Fee: $69
- Storage Usage: 60 GiB (10 GiB over the allowance)
- Compute Usage: 800 hours (50 hours over the allowance)
- Project Usage: 55 projects (5 projects over the allowance)
- Extra Storage Fee: 1 * $15 = $15
- Extra Compute Fee: 50 * $0.04 = $2
- Extra Project Fee: 1 * $50 = $50

**Total Estimate**: $69 + $15 + $2 + $50 = $136 per month

<Admonition type="note" title="Notes">
- Adjust your usage estimates as needed to reflect your actual or projected usage.
- For Enterprise plan users, please contact our sales team for a personalized estimate based on your custom needs.
</Admonition>

<NeedHelp/>
