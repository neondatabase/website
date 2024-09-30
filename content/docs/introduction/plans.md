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
  - /docs/reference/technical-preview-free-tier
updatedOn: '2024-09-30T15:27:16.600Z'
---

Neon's plans are designed to meet different user requirements, ranging from hobby projects to enterprise-level production workloads. We also offer custom enterprise plans with volume-based discounts for large teams or database fleets. Refer to our [Pricing](https://neon.tech/pricing) page for fees and a detailed plan comparison.

Neon offers four plans:

- [Free Plan](#free-plan)
- [Launch](#launch)
- [Scale](#scale)
- [Business](#business)
- [Enterprise](#enterprise)

<Admonition type="tip" title="Plan Allowances and Extra Usage">
Neon plans are structured around **Allowances** and **Extra usage**. Allowances are included in your plan. With Neon's paid plans, you can purchase [extra usage](/docs/introduction/extra-usage) in set increments for when you need to go over your allowance.
</Admonition>

## Free Plan

Neon's Free Plan plan is best for hobby projects, prototypes, and learning Neon.

### Free Plan allowances

The Free Plan includes the following usage allowances:

| Usage type                 | Plan allowance                                                                                                                                           |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Projects**               | 1 Neon project                                                                                                                                           |
| **Branches**               | 10 branches                                                                                                                                              |
| **Databases**              | 500 per branch                                                                                                                                           |
| **Storage**                | 0.5 GiB                                                                                                                                                  |
| **Compute**                | 191.9 compute hours/month&#8212;enough to run a primary 0.25 CU compute 24/7; up to 5 of those compute hours can be used for non-default branch computes |
| **Data transfer (Egress)** | 5 GB per month                                                                                                                                           |

<Admonition type="tip" title="What is a compute hour?">

- A **compute hour** is one _active hour_ for a compute with 1 vCPU. For a compute with .25 vCPU, it takes 4 _active hours_ to use 1 compute hour. On the other hand, if your compute has 4 vCPUs, it takes only 15 minutes to use 1 compute hour.
- An **active hour** is a measure of the amount of time a compute is active. The time your compute is idle when suspended due to inactivity is not counted.
- **Compute hours formula**

  ```
  compute hours = compute size * active hours
  ```

</Admonition>

### Free Plan features

- Autosuspend (after 5 minutes of inactivity)
- Monitoring with 1 day of historical data
- All supported regions
- Project sharing
- Advanced Postgres features such as connection pooling, logical replication, and 60+ Postgres extensions
- Neon features such as branching, point-in-time restore up to **24 hours** in the past, time travel connections, and more
- [Community support](/docs/introduction/support)

For a complete list of features, refer to the **detailed plan comparison** on the [Neon pricing](https://neon.tech/pricing) page.

<Admonition type="tip" title="Free Plan Compute Allowances">
On the Free Plan, you get 191.9 compute hours/month&#8212;enough to run a primary 0.25 CU compute 24/7. Up to 5 of those compute hours can be used for non-default branch computes. Autoscaling up to 2 vCPU with 8 GB RAM is available for extra performance during peak times, but please be aware that autoscaling can consume your compute hours more quickly, potentially impacting the ability to run a primary 0.25 CU compute 24/7. If you use Autoscaling, you'll need to monitor your compute hours to ensure you don't run out before the end of the month.

If you go over the 5 compute hour allowance for non-default branch computes, those computes are suspended until the allowance resets at the beginning of the month. If you go over the 191.9 compute hour allowance, all computes are suspended until the beginning of the month.
</Admonition>

## Launch

The Launch plan provides all of the resources, features, and support you need to launch your application. It's ideal for startups and growing businesses or applications.

### Launch plan allowances

The Launch plan includes the following usage allowances:

| Usage type    | Plan allowance                                                   |
| ------------- | ---------------------------------------------------------------- |
| **Projects**  | 10 Neon projects                                                 |
| **Branches**  | 500 per project                                                  |
| **Databases** | 500 per branch                                                   |
| **Storage**   | 10 GiB of data storage                                           |
| **Compute**   | 300 compute hours per month for all computes across all projects |

### Launch plan extra usage

Launch plan users have access to [extra compute and storage](/docs/introduction/extra-usage), which is allocated and billed automatically when plan allowances are exceeded.

| Extra usage type  | Cost                                                                   |
| ----------------- | ---------------------------------------------------------------------- |
| **Extra Storage** | Billed for in units of 2 GiB at $3.50 per unit, prorated for the month |
| **Extra Compute** | Billed by compute hour at $0.16 per hour                               |

### Launch plan features

- Autoscaling compute size up to 4 vCPUs and 16 GB RAM, _Autosuspend_ (**5 minutes+** to **7 days**)
- Monitoring with 7 days of historical data
- Advanced Postgres features, including connection pooling, logical replication, and 60+ Postgres extensions
- Branch protection (up to 5 branches)
- Neon features such as branching, point-in-time restore up to **7 days** in the past, time travel connections, and more
- [Standard support](/docs/introduction/support)

For a complete list of features, refer to the **detailed plan comparison** on the [Neon pricing](https://neon.tech/pricing) page.

## Scale

The Scale plan provides full platform and support access and is designed for scaling production workloads.

### Scale plan allowances

The Scale plan includes the following usage allowances:

| Usage type    | Plan allowance                                                   |
| ------------- | ---------------------------------------------------------------- |
| **Projects**  | 50 Neon projects                                                 |
| **Branches**  | 500 per project                                                  |
| **Databases** | 500 per branch                                                   |
| **Storage**   | 50 GiB of data storage                                           |
| **Compute**   | 750 compute hours per month for all computes across all projects |

### Scale plan extra usage

Scale plan users have access to [extra compute, storage, and projects](/docs/introduction/extra-usage), which is allocated and billed automatically when plan allowances are exceeded.

| Extra usage type   | Cost                                                              |
| ------------------ | ----------------------------------------------------------------- |
| **Extra Storage**  | Billed in units of 10 GiB at $15 per unit, prorated for the month |
| **Extra Compute**  | Billed by compute hour at $0.16 per hour                          |
| **Extra Projects** | Billed for in units of 10 at $50 per unit                         |

### Scale plan features

- Autoscaling compute up to 8 vCPUs and 32 GB RAM, _Autosuspend_ (**1 minute+** to **7 days**)
- Monitoring with 14 days of historical data
- Advanced Postgres features, including connection pooling, logical replication, 60+ Postgres extensions, and customer-provided custom extensions
- Branch protection (up to 5 branches)
- Monitoring with 7 days of historical data
- Neon features such as branching, point-in-time restore up to **14 days** in the past, time travel connections, and more
- [Standard support](/docs/introduction/support)

For a complete list of features, refer to the **detailed plan comparison** on the [Neon pricing](https://neon.tech/pricing) page.

## Business

The Business plan is designed for mid-to-large enterprises requiring higher compute capacity and advanced security and compliance features.

### Business plan allowances

The Business plan includes the following usage allowances:

| Usage type    | Plan allowance                                                     |
| ------------- | ------------------------------------------------------------------ |
| **Projects**  | 100 Neon projects                                                  |
| **Branches**  | 500 per project                                                    |
| **Databases** | 500 per branch                                                     |
| **Storage**   | 500 GiB of data storage                                            |
| **Compute**   | 1,000 compute hours per month for all computes across all projects |

### Business plan extra usage

Business plan users have access to [extra compute, storage, and projects](/docs/introduction/extra-usage), which are allocated and billed automatically when plan allowances are exceeded.

| Extra usage type   | Cost                                                                    |
| ------------------ | ----------------------------------------------------------------------- |
| **Extra Storage**  | Billed for in units of 10 GiB at $7.50 per unit, prorated for the month |
| **Extra Compute**  | Billed by compute hour at $0.16 per hour                                |
| **Extra Projects** | Billed for in units of 10 at $5 per unit                                |

### Business plan features

- Autoscaling compute up to 10 vCPUs and 40 GB RAM
- Monitoring with 14 days of historical data
- Advanced Postgres features, including connection pooling, logical replication, and 60+ Postgres extensions
- Neon features such as branching, point-in-time restore up to **30 days** in the past, time travel connections, and more
- Enhanced security features including SOC 2 compliance, branch protection, and allowed IP configurations
- [Priority support](/docs/introduction/support)
- [Service SLA of 99.95% uptime](https://neon.tech/neon-business-sla)

For a complete list of features and comparisons with other plans, refer to the **detailed plan comparison** on the [Neon pricing](https://neon.tech/pricing) page.

## Enterprise

The Enterprise plan is a custom plan intended for large teams, enterprises requiring database fleets, or SaaS vendors interested in reselling Neon or integrating Neon into their service.

Enterprise plan usage is entirely customizable and can support large data sizes.

| Usage type    | Plan allowance   |
| ------------- | ---------------- |
| **Projects**  | Custom           |
| **Branches**  | Custom           |
| **Databases** | Custom           |
| **Storage**   | Large data sizes |
| **Compute**   | Custom           |

Additionally, the _Enterprise_ plan can be tailored to your specific requirements with:

- Custom pricing with discounts
- Higher resource allowances for projects, branches, storage, and compute
- _Autosuspend_ (disabled entirely or up to **7 days**)

Enterprise plan users have access to **Enterprise** support, which includes everything offered with the **Priority** plan plus Enterprise-level SLAs. For more information, Neon support plans are outlined on our [Support](/docs/introduction/support) page.

If you are interested in exploring an _Enterprise_ plan with Neon, you can [request an enterprise trial](/enterprise#request-trial) or [get in touch with our sales team](/contact-sales).

## Feedback

We’re always looking for ways to improve our pricing model to make it as developer-friendly as possible. If you have feedback for us, let us know via the [Feedback](https://console.neon.tech/app/projects?modal=feedback) form in the Neon Console or our [feedback channel](https://discord.com/channels/1176467419317940276/1176788564890112042) on Discord. We read and consider every submission.

<NeedHelp/>
