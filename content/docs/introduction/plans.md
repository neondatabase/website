---
title: Neon plans
subtitle: Learn about the different plans offered by Neon
enableTableOfContents: true
isDraft: false
redirectFrom:
  - /docs/introduction/billing#neon-plans
  - /docs/introduction/billing-calculators
  - /docs/introduction/billing-rates
  - /docs/introduction/free-tier
  - /docs/introduction/pro-plan
  - /docs/introduction/custom-plan
updatedOn: '2024-01-23T17:45:24.329Z'
---

Neon's plans are designed to meet different user requirements, ranging from personal projects to enterprise-level production workloads. We also offer a custom plan option for enterprises that require database fleets or SaaS vendors interested in bundling Neon. You can refer to our [pricing](https://neon.tech/pricing) page for an overview of our plans and pricing. This page provides additional information to help you understand our plans and find the one that best meets your needs.

## Pricing plans

Neon offers four pricing plans: [Free Tier](#free-tier), [Launch](#launch), [Scale](#scale), and [Enterprise](#enterprise).

### Free Tier

Neon's Free Tier plan is best for hobby projects, prototypes, and learning Neon and Postgres.

The Free Tier plan includes the following usage:

- 1 Neon project
- Up to 500 MiB of data storage
- 750 _Active Compute Time_ hours per month for your primary branch compute, and 20 hours per month for your non-primary branch computes. Free Tier computes have 0.25 vCPU with 1GB RAM.
- 10 branches

In addition, Free Tier users have access to the following Neon features:

- [Point-in-time restore](#point-in-time-recovery): Restore data to a point in time up to **24 hours** in the past
- [Autosuspend](#autosuspend): Compute scales to zero after 5 minutes of inactivity to save on usage
- [Regions](#regions): The Free Tier is available in all supported regions
- [Project sharing](#project-sharing): Share your project with any Neon user account
- [Logical replication](#logical-replication): Replicate your data from Neon to other data services and platforms

Free Tier users have access to **Community** support, which includes the [Neon Discord Server](/discord) or the [Neon Discourse Community](https://community.neon.tech/). For more information, Neon support plans are outlined on our [Support](/docs/introduction/support) page.

### Launch

The Launch plan provides all of the the resources, features, and support you need to launch your application. It's ideal for startups and growing businesses and applications.

The Launch plan includes the following usage:

- 10 Neon projects
- Up to 10 GiB of data storage
- Up to 1200 compute hours/month for all computes in all projects

Launch plan users can access extra compute hours beyond the 1200 compute hours/month included in the Launch plan. Extra compute hours are billed automatically. Please refer to our [pricing](https://neon.tech/pricing) page for the per-hour cost.

In addition, Launch plan users have access to the following Neon features:

- [Compute sizes](#compute-size): Computes with up to 4 vCPUs and 16 GB RAM.
- [Autoscaling](#autoscaling): Automatically scale your compute size on demand
- [Branching](#branching): The maximum number of branches supported by Neon (100 soft limit, 500 hard limit). If you need more than 100 branches, contact [Neon Support](/docs/introduction/support).
- [Point-in-time restore](#point-in-time-recovery): Recover data to a point in time up to **7 days** in the past
- [IP Allow](#ip-allow): Restrict access to specific IP addresses or ranges
- [SOC 2 Report](#soc-2-report): Access to Neon's SOC 2 Report
- [Autosuspend](#autosuspend): Configure how often a compute scales to zero
- [Regions](#regions): This plan is available in all Neon regions.
- [Project sharing](#project-sharing): Share projects with any Neon user account
- [Read replicas](#read-replicas): Scale applications with read replicas
- [Logical replication](#logical-replication): Replicate data from Neon with Postgres logical replication support

Launch plan users have access to **Standard** Neon support, which includes access to the Neon Support team via support tickets. For more information, Neon support plans are outlined on our [Support](/docs/introduction/support) page.

### Scale

The Scale plan includes everything in the Launch plan plus the following:

- Up to 50 Neon projects
- Up to 50 GiB of data storage
- Up to 3000 compute hours/month for all computes in all projects
- Higher limits for the following Neon features:
  - [Compute sizes](#compute-size): Computes with up to 7 vCPUs and 28 GB RAM
  - [Point-in-time restore](#point-in-time-recovery): Recover data to a point in time up to **30 days** in the past

Scale plan users can access extra compute hours beyond the 3000 compute hours/month and additional storage. Extra compute hours and storage are billed automatically. Please refer to our [pricing](https://neon.tech/pricing) page for the per-hour compute cost and the cost for additional storage.

Scale plan users have access to **Priority** Neon support, which includes priority access to the Neon Support team via support tickets. For more information, Neon support plans are outlined on our [Support](/docs/introduction/support) page.

### Enterprise

The Enterprise plan is a custom volume-based plan intended for medium to large teams, enterprises requiring database fleets, or SaaS vendors interested in reselling Neon or integrating serverless Postgres into their own service.

The _Enterprise_ plan can be tailored to your specific requirements with:

- A custom contract
- Volume-based discounts
- Prepaid or integrated billing
- Full access to all Neon features
- Tailored features and solutions

Enterprise plan users have access to **Enterprise** Neon support, which includes everything offered with the **Priority** plan plus retail customer support, Customer Success Team support, and SLAs. For more information, Neon support plans are outlined on our [Support](/docs/introduction/support) page.

If you are interested in exploring an _Enterprise_ plan with Neon, please reach out to our [Sales team](https://neon.tech/contact-sales).

## Features

This section describes the features available with one or more of the Neon plans outlined above. 

### Compute size

Neon supports compute sizes from .25 vCPU with 1 GB RAM up to 7 vCPU with 28 GB RAM.

### Autoscaling

Neon's _Autoscaling_ feature dynamically adjusts the amount of compute resources allocated to a Neon compute endpoint in response to the current workload, eliminating the need for manual intervention. For more information, refer to our [Autoscaling](/docs/introduction/autoscaling-guide) guide.

### Branching

Neon's branching feature lets you branch your data the same way you branch your code. You can instantly create full database copies for development, testing, or any other purpose that requires a database copy. You can easily automate database branching using the Neon API, CLI, or GitHub Actions, enabling you to add database branching to your CI/CD pipeline. Branching is often used with deployment platforms such as Vercel to create a database branch for each preview deployment. To learn more, see [Get started with branching](/docs/guides/branching-intro).

### Point-in-time Recovery

Neon's _Point-in-time Restore_ capability lets you instantly restore your database to a point in time in the past. To learn more, see [Branch reset and restore](/docs/introduction/point-in-time-restore).

### IP Allow

Neon's _IP Allow_ feature, ensures that only trusted IP addresses can connect to the project where your database resides, preventing unauthorized access and helping maintain overall data security. You can limit access to individual IP addresses, IP ranges, or IP addresses and ranges defined with [CIDR notation](/docs/reference/glossary#cidr-notation). To learn more, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow).

### SOC 2 Report

Paid plan users can request access to Neon's SOC 2 report on our [Neon Trust Center](https://trust.neon.tech/).

### Autosuspend

Neon's _Autosuspend_ feature controls when a Neon compute instance transitions to an Idle state (scales to zero) due to inactivity. By default, a Neon compute instance scales to zero after 5 minutes of inactivity. For [Neon Free Tier](#free-tier) users, this setting is fixed. Paying users can increase, decrease, or disable the autosuspend setting, controlling when or if a compute scales to zero.

### Regions

Neon supports project deployment in several regions. All Neon users have access to all regions that Neon supports. To learn more, see [Regions](/docs/introduction/regions).

### Project sharing

All Neon plans support sharing your Neon project with other Neon users, giving them access to your Neon project from all supported interfaces, including the Neon Console, Neon API, and Neon CLI. To learn more, refer to our [Project sharing](/docs/guides/project-sharing-guide) guide.

### Read replicas

_Read replicas_ allow you to instantly scale your application by offloading read-only workloads to independent read-only compute instances. To learn more, see [Read replicas](/docs/introduction/read-replicas).

### Logical replication

Logical replication enables replicating data from your Neon database to external destinations, allowing for Change Data Capture (CDC) and real-time analytics. Stream your data to data warehouses, analytical database services, messaging platforms, event-streaming platforms, external Postgres databases, and more. To learn more, see [Get started with logical replication](/docs/guides/logical-replication-guide).

## Notes

- Paid plans have a default limit of 20 simultaneously active computes to protect against unintended usage. To increase this limit, please [open a support ticket](/docs/introduction/support). The simultaneously active compute limit does not affect the primary branch compute, which always remains available.
- Active Compute Time: On the Free Tier, your primary branch compute is allotted 750 hours a month, which means your primary branch is always available. Branch computes have a 20 hours/month Active Compute Time limit. If your branch computes exceed this limit, they will be suspended until the limit resets. You can monitor _Active Compute Time_ on the **Usage** widget on the Neon **Dashboard**. The _Active Compute Time_ limit resets at the beginning of each month. For instance, if you enroll in the Neon Free Tier on January 15th, your _Active Compute Time_ limit will reset on February 1st.


