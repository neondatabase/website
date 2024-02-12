---
title: Neon plans
subtitle: Learn about the different plans offered by Neon
enableTableOfContents: true
isDraft: false
redirectFrom:
  - /docs/introduction/billing#neon-plans
  - /docs/introduction/billing-calculators
  - /docs/introduction/billing-rates
updatedOn: '2024-01-23T17:45:24.329Z'
---

Neon pricing plans are designed to meet different user requirements, ranging from small personal projects to enterprise production workloads. Refer to our [pricing](https://neon.tech/pricing) page for an overview of our plans. This page provides additional information to help you understand the pricing structure and features of each plan so that you can find the plan that best meets your needs.

## Pricing plans

Neon offers four pricing plans: [Free Tier](#free-tier), [Launch](#launch), [Scale](#scale), and [Enterprise](#enterprise).

### Free Tier

The Free Tier plan is best for hobby projects, prototypes, and learning Neon and Postgres.

**Included usage:**

- **Storage**: You can store up to 500 MiB of data (0.5 GiB) on the Free Tier.
- **Active Compute Time**: You get 750 hours/month on your primary branch compute, and 20 hours/month for your branch computes.
- **Projects**:	1 Neon project

**Support**: Free Tier users have access to **Community** support, which includes the [Neon Discord Server](/discord) or the [Neon Discourse Community](https://community.neon.tech/). For more information, Neon plans are outlined on our [Support](/docs/introduction/support) page.

**Features:**

- [Compute size](#compute-size): A Free Tier compute has 0.25 vCPU with 1GB RAM
- [Branching](#branching): You can create up to 10 branches
- [Point-in-time Recovery](#point-in-time-recovery): You can recover your data to a point in time up to **24 hours** in the past
- [Autosuspend](#autosuspend): Your compute is automatically suspended after 5 minutes of inactivity
- [Regions](#regions): The Free Tier plan is available in all supported regions
- [Project sharing](#project-sharing): You can share your project with any Neon user account
- [Logical replication](#logical-replication): You can replicate your data from Neon to other data services and platforms

### Launch

The Launch plan provides the resources, features, and support you need to launch your application.

**Included usage:**

- **Storage**: You can store up to 10 GiB of data on the Launch plan.
- **Active Compute Time**: You get 1200 hours/month for all computes in all projects
- **Projects**:	Up to 10 Neon project

**Support**: Launch plan users have access to **Standard** Neon support, which includes access to the Neon Support team via support tickets. For more information, Neon plans are outlined on our [Support](/docs/introduction/support) page.

**Extra usage**: 

- **Active Compute Time**: You can purchase extra compute hours. Please refer to our [pricing](https://neon.tech/pricing) page for the per-hour cost.

**Features:**

- [Compute size](#compute-size): The Launch plan supports compute size up to 4 vCPUs with 16GB RAM.
- [Autoscaling](#autoscaling): Scale your compute size on demand
- [Branching](#branching): You get the maximum number of branches supported by Neon (100 soft limit, 500 hard limit). If you need more than 100 branches, contact [Neon Support](/docs/introduction/support).
- [Point-in-time Recovery](#point-in-time-recovery): Recover your data to a point in time up to **7 days** in the past
- [IP Allow](#ip-allow): Restrict access to your database to specific IP addresses or ranges
- [SOC 2 Report](#soc-2-report): Access to Neon's SOC 2 Report
- [Autosuspend](#autosuspend): Autosuspend is configurable.
- [Regions](#regions): The Launch plan is available in all supported regions
- [Project sharing](#project-sharing): Share your project with any Neon user account
- [Read replicas](#read-replicas): Scale your application with read replicas
- [Logical replication](#logical-replication): Replicate your data from Neon with Postgres logical replication support

### Scale

The Scale plan provides full platform and support access and is designed for businesses scaling production workloads.

**Included usage:**

- **Storage**: You can store up to 50 GiB of data on the Launch plan.
- **Active Compute Time**: You get 3000 hours/month for all computes in all projects
- **Projects**:	Up to 50 Neon project

**Support**: Launch plan users have access to **Priority** Neon support, which includes priority access to the Neon Support team via support tickets. For more information, Neon plans are outlined on our [Support](/docs/introduction/support) page.

**Extra usage**: 

- **Active Compute Time**: You can purchase extra compute hours. Please refer to our [pricing](https://neon.tech/pricing) page for the per-hour cost.
- **Storage**: You can purchase extra storage at $15 per 10 GiB

**Features:**

- [Compute size](#compute-size): The Scale plan supports compute size up to 7 vCPUs with 16GB RAM.
- [Autoscaling](#autoscaling): Scale your compute size on demand
- [Branching](#branching): You get the maximum number of branches supported by Neon (100 soft limit, 500 hard limit). If you need more than 100 branches, contact [Neon Support](/docs/introduction/support).
- [Point-in-time Recovery](#point-in-time-recovery): Recover your data to a point in time up to **7 days** in the past
- [IP Allow](#ip-allow): Restrict access to your database to specific IP addresses or ranges
- [SOC 2 Report](#soc-2-report): Access to Neon's SOC 2 Report
- [Autosuspend](#autosuspend): Autosuspend is configurable
- [Regions](#regions): The Scale plan is available in all supported regions
- [Project sharing](#project-sharing): Share your project with any Neon user account
- [Read replicas](#read-replicas): Scale your application with read replicas
- [Logical replication](#logical-replication): Replicate your data from Neon with Postgres logical replication support

### Enterprise

The Enterprise plan is a custom volume-based plan intended for medium to large teams, enterprises requiring database fleets, or SaaS vendors interested in reselling Neon or integrating serverless Postgres into their own service.

The _Enterprise_ plan can be tailored to your specific requirements with:

- A custom contract
- Volume-based discounts
- Prepaid or integrated billing
- Access to all Neon features available with the [Scale](#scale) plan.
- Tailored features and solutions
- Custom support options. Neon support plans are outlined on our [Support](/docs/introduction/support) page.

If you are interested in exploring an _Enterprise_ plan with Neon, please reach out to our [Sales team](https://neon.tech/contact-sales).

## Features

## Compute size

Neon's standard compute sizes are outlined in the table below. The Freet Tier provides a compute with .25 vCPU and 1 GB of RAM. Neon Launch, Scale, and Enterprise plans support larger compute sizes.

| Compute size (in CUs)  | vCPU | RAM    |
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

## Autoscaling

Neon's _Autoscaling_ feature dynamically adjusts the amount of compute resources allocated to a Neon compute endpoint in response to the current workload, eliminating the need for manual intervention. For more information, refer to our [Autoscaling](/docs/introduction/autoscaling-guide) guide.

## Branching

Neon's branching feature lets you branch your data the same way you branch your code. You can instantly create full database copies for development, testing, or any other purpose that requires a database copy. You can easily automate database branching using the Neon API, CLI, or GitHub Actions, enabling you to add database branching to your CI/CD pipeline. Branching is often used with deployment platforms such as Vercel to create a database branch for each preview deployment. To learn more, see [Get started with branching](/docs/guides/branching-intro).

## Point-in-time Recovery

Neon's _Point-in-time Restore_ capability lets you instantly restore your database to a point in time in the past. To learn more, see [Branch reset and restore](/docs/introduction/point-in-time-restore).

## IP Allow

Neon's _IP Allow_ feature, ensures that only trusted IP addresses can connect to the project where your database resides, preventing unauthorized access and helping maintain overall data security. You can limit access to individual IP addresses, IP ranges, or IP addresses and ranges defined with [CIDR notation](/docs/reference/glossary#cidr-notation). To learn more, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow).

## SOC 2 Report

Paid plan users can request access to Neon's SOC 2 report on our [Neon Trust Center](https://trust.neon.tech/).

## Autosuspend

Neon's _Autosuspend_ feature controls when a Neon compute instance transitions to an Idle state (scales to zero) due to inactivity. By default, a Neon compute instance scales to zero after 5 minutes of inactivity. For [Neon Free Tier](#free-tier) users, this setting is fixed. Paying users can increase, decrease, or disable the autosuspend setting, controlling when or if a compute scales to zero.

## Regions

Neon supports project deployment in several regions. All Neon users have access to all regions that Neon supports. To learn more, see [Regions](/docs/introduction/regions).

## Project sharing

All Neon plans support sharing your Neon project with other Neon users, giving them access to your Neon project from all supported interfaces, including the Neon Console, Neon API, and Neon CLI. To learn more, refer to our [Project sharing](/docs/guides/project-sharing-guide) guide.

## Read replicas

_Read replicas_ allow you to instantly scale your application by offloading read-only workloads to independent read-only compute instances. To learn more, see [Read replicas](/docs/introduction/read-replicas).

## Logical replication

Logical replication enables replicating data from your Neon database to external destinations, allowing for Change Data Capture (CDC) and real-time analytics. Stream your data to data warehouses, analytical database services, messaging platforms, event-streaming platforms, external Postgres databases, and more. To learn more, see [Get started with logical replication](/docs/guides/logical-replication-guide).

## Plan notes

- Paid plans have a default limit of 20 simultaneously active computes to protect against unintended usage. To increase this limit, please [open a support ticket](/docs/introduction/support). The simultaneously active compute limit does not affect the primary branch compute, which always remains available.
- Active Compute Time: On the Free Tier, your primary branch compute is allotted 750 hours a month, which means your primary branch is always available. Branch computes have a 20 hours/month Active Compute Time limit. If your branch computes exceed this limit, they will be suspended until the limit resets. You can monitor _Active Compute Time_ on the **Usage** widget on the Neon **Dashboard**. The _Active Compute Time_ limit resets at the beginning of each month. For instance, if you enroll in the Neon Free Tier on January 15th, your _Active Compute Time_ limit will reset on February 1st.

## FAQ

<DefinitionList>

Can I upgrade or downgrade my plan later?
: Yes. You can upgrade from Free Tier to our Pro plan by selecting Upgrade to Pro. To upgrade to an Enterprise plan, contact Sales. For downgrade instructions, see Downgrade your plan.

Does Neon charge for storage in database branches?
: Neon charges for unique storage. Data that a branch shares in common with a parent branch is not considered unique, but data changes to a branch are counted toward storage. Read more about project storage.

Can I upgrade or downgrade my plan later?
: Yes. You can upgrade from Free Tier to our Pro plan by selecting Upgrade to Pro. To upgrade to a custom Enterprise or Platform Partnership plan, contact Sales. For downgrade instructions, see Downgrade your plan.

What payment methods do you accept?
: Neon accepts payment by credit card for the Pro plan. For the Enterprise & Platform Partnership plans, Neon accepts payment by ACH and Wire.

When will I be billed?
: Neon bills for the past month's usage at the beginning of each month. For more information, see Manage billing.

Is there a discount for annual plan subscriptions?
: Discounts are applied for longer duration contracts as well as bulk consumption purchases.

Are there any limits or restrictions on usage?
: Neon implements limits to protect against unintended usage. For example, a usage-based plan may offer unlimited projects, compute, and storage, but Neon places default limits on those resources to protect your account. For more information, see Plans.

Is there a minimum commitment period?
: The Neon Pro plan is usage-based and has no commitment period. You can downgrade to the at Free Tier at any time. For more information, see Downgrade your plan.

How secure is the payment process?
: Neon payment processing is powered by Stripe, which is a certified PCI Service Provider Level 1. For more information, refer to Security at Stripe.

Where should I direct pricing-related questions?
: Please contact Sales with any questions about plans or pricing.

</DefinitionList>


