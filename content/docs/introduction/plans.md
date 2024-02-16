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

Neon's plans are designed to meet different user requirements, ranging from hobby projects to enterprise-level production workloads. We also offer custom enterprise plans with volume-based discounts for large teams or database fleets. Refer to our [pricing](https://neon.tech/pricing) page for an overview of our plans and pricing. 

This page provides additional information to help you understand our plans and find the one that's right for you.

## Pricing plans

Neon offers four pricing plans: [Free Tier](#free-tier), [Launch](#launch), [Scale](#scale), and [Enterprise](#enterprise).

### Free Tier

Neon's Free Tier plan is best for hobby projects, prototypes, and learning Neon. It includes the following usage:

|                                         |                                                               |
|-----------------------------------------|---------------------------------------------------------------|
| **Projects**                            | 1 Neon project                                                |
| **Branches**                            | 10 branches                                                   |
| **Databases**                           | Unlimited                                                     |
| **Storage**                             | 0.5 GiB                                                       |
| **Compute**                             | 24/7 usage on the primary branch compute (~750 compute hours/month), 20 _active hours_/month on branch computes. Free Tier computes have 0.25 vCPU with 1GB RAM |

In addition, Free Tier users have access to the following Neon features:

- [Autosuspend](#autosuspend): Compute scales to zero after 5 minutes of inactivity.
- [Region availabilty](#region-availability): The Free Tier is available in all supported regions.
- [Project sharing](#project-sharing): Share your project with any Neon user account.
- [All advanced Postgres features](#advanced-postgres-features): Connection pooling, logical replication, Postgres extensions, and custom extensions.
- [All additional features](#additional-features): Includes [point-in-time restore](#point-in-time-recovery) up to **24 hours** in the past.
- [Community support](/docs/introduction/support): Free Tier plan users have access to **Community** support, which includes the [Neon Discord Server](/discord) or the [Neon Discourse Community](https://community.neon.tech/).

### Launch

The Launch plan provides all of the resources, features, and support you need to launch your application. It's ideal for startups and growing businesses and applications. It includes the following usage:

|                                         |                                                               |
|-----------------------------------------|---------------------------------------------------------------|
| **Projects**                            | 10 Neon projects                                              |
| **Branches**                            | 500                                                  |
| **Databases**                           | Unlimited                                                     |
| **Storage**                             | Up to 10 GiB of data storage                                  |
| **Compute**                             | Up to 1,200 _active hours_/month (300 compute hours/month) for all computes in all projects |

Launch plan users can access extra compute hours beyond the 1200 compute hours/month included in the Launch plan. Extra compute hours are billed automatically. Please refer to our [pricing](https://neon.tech/pricing) page for the per-hour cost.

In addition, Launch plan users have access to the following Neon features:

- [All compute features](#compute-features): Includes [compute sizes](#compute-size) up to 4 vCPUs and 16 GB RAM
- [All advanced Postgres features](#advanced-postgres-features): Connection pooling, logical replication, Postgres extensions, and custom extensions
- [All additional features](#additional-features): Includes [point-in-time restore](#point-in-time-recovery) up to **7 days** in the past
- [Extra usage](/docs/introduction/billing-overview#extra-usage): Scale plan users can access extra compute usage. Extra compute usage is billed automatically. Please refer to our [pricing](https://neon.tech/pricing) page for the per-hour compute cost.
- [Expert support](/docs/introduction/support): Launch plan users have access to **Expert** Neon support, which includes access to the Neon Support team via support tickets.

### Scale

The Scale plan provides full platform and support access, and is designed for scaling production workloads. It includes the following usage:

|                                         |                                                               |
|-----------------------------------------|---------------------------------------------------------------|
| **Projects**                            | Up to 50 Neon projects                                        |
| **Branches**                            | 500                                                           |
| **Databases**                           | Unlimited                                                     |
| **Storage**                             | Up to 50 GiB of data storage                                  |
| **Compute**                             | Up to 3,000 _active hours_/month (750 compute hours/month) for all computes in all projects |

In addition, Sacle plan users have access to the following Neon features:

- [All compute features](#compute-features): Includes [compute sizes](#compute-size) up to 4 vCPUs and 16 GB RAM.
- [All advanced Postgres features](#advanced-postgres-features): Connection pooling, logical replication, Postgres extensions, and custom extensions.
- [All additional features](#additional-features): Includes [point-in-time restore](#point-in-time-recovery) up to **30 days** in the past.
- [Extra usage](/docs/introduction/billing-overview#extra-usage): Scale plan users can access extra compute and storage usage, which billed automatically. Please refer to our [pricing](https://neon.tech/pricing) page for the per-hour compute and extra storage costs.
- [Expert support](/docs/introduction/support): Scale plan users have access to **Priority** Neon support, which includes _priority_ access to the Neon Support team via support tickets.

### Enterprise

The Enterprise plan is a custom plan intended for large teams, enterprises requiring database fleets, or SaaS vendors interested in reselling Neon or integrating Neon into their service.

Enterprise plan usage is entirely customizable and can support large data sizes.

|                                         |                                                               |
|-----------------------------------------|---------------------------------------------------------------|
| **Projects**                            | Unlimited                                        |
| **Branches**                            | Custom                                                           |
| **Databases**                           | Unlimited                                                     |
| **Storage**                             | Large data sizes                                  |
| **Compute**                             | Custom |

Additionally, the _Enterprise_ plan can be tailored to your specific requirements with:

- Custom pricing with discounts
- Higher resource allowances for projects, branches, storage, and compute
- Customer-owned S3

Enterprise plan users have access to **Enterprise** support, which includes everything offered with the **Priority** plan plus retail customer support, Customer Success Team support, and SLAs. For more information, Neon support plans are outlined on our [Support](/docs/introduction/support) page.

If you are interested in exploring an _Enterprise_ plan with Neon, please reach out to our [Sales team](https://neon.tech/contact-sales).

## Features

This section describes the features available with one or more of the Neon plans outlined above. 

### Compute features

#### Compute size

Neon supports compute sizes from .25 vCPU with 1 GB RAM up to 7 vCPU with 28 GB RAM.

#### Read replicas

Neon read replicas let you instantly scale your application by offloading read-only workloads to independent read-only compute instances. To learn more, see [Read replicas](/docs/introduction/read-replicas).

#### Autoscaling

Neon's _Autoscaling_ feature dynamically adjusts the amount of compute resources allocated to a Neon compute endpoint in response to the current workload, eliminating the need for manual intervention. For more information, refer to our [Autoscaling](/docs/introduction/autoscaling-guide) guide.

#### Autosuspend

Neon's _Autosuspend_ feature controls when a Neon compute instance transitions to an Idle state (scales to zero) due to inactivity. By default, a Neon compute instance scales to zero after 5 minutes of inactivity. For [Neon Free Tier](#free-tier) users, this setting is fixed. Users on paid plans can increase, decrease, or disable the autosuspend setting, controlling when or if a compute scales to zero.

#### Region availability

Neon supports project deployment in several regions. All Neon users have access to all regions that Neon supports. To learn more, see [Regions](/docs/introduction/regions).

#### Max concurrent connections

Neon can support up to 10,000 concurrent connections. See [Connection pooling](/docs/connect/connection-pooling).

#### Tenant isolation

The Neon Enterprise plan offers tenant isolation, segregating your data resources from other tenants. If you are interested in this feature, please contact [Sales](https://neon.tech/contact-sales).

### Advanced Postgres features

#### Connection pooling

Neon uses [PgBouncer](https://www.pgbouncer.org/) to offer connection pooling support.

#### Logical replication

Logical replication enables replicating data from your Neon database to external destinations, allowing for Change Data Capture (CDC) and real-time analytics. Stream your data to data warehouses, analytical database services, messaging platforms, event-streaming platforms, external Postgres databases, and more. To learn more, see [Get started with logical replication](/docs/guides/logical-replication-guide).

#### Postgres extensions

Neon supports a large number of Postgres extensions letting you extend the capabilities of Postgres. See [Supported extensions](/docs/extensions/pg-extensions).

#### Custom extensions

Neon supports custom-built Postgres extensions for exclusive use with your Neon account. See [Custom-built extensions](/docs/extensions/pg-extensions#custom-built-extensions).

### Security features

#### IP Allow

Neon's _IP Allow_ feature, ensures that only trusted IP addresses can connect to the project where your database resides, preventing unauthorized access and helping maintain overall data security. You can limit access to individual IP addresses, IP ranges, or IP addresses and ranges defined with [CIDR notation](/docs/reference/glossary#cidr-notation). To learn more, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow).

#### SOC 2 Report

Paid plan users can request access to Neon's SOC 2 report on our [Neon Trust Center](https://trust.neon.tech/).

#### Customer-owned S3

The Neon Enterprise plan supports data storage on customer-owned S3. If you are interested in this feature, please contact [Sales](https://neon.tech/contact-sales).

### Additional features

#### Point-in-time restore

Neon's _Point-in-time Restore_ capability lets you instantly restore your database to a point in time in the past. To learn more, see [Branch reset and restore](/docs/introduction/point-in-time-restore).

#### Time Travel Assist

Neon's Time Travel Assist feature lets you connect to any selected point in time within your history retention window and run queries against that connection, allowing you to query into the past. See [Time Travel Assist](/docs/guides/branch-restore#time-travel-assist).

#### Web console

Neon's easy-to-use web console allows you to manage Neon from a browser. 

#### Neon CLI

The Neon CLI is a command-line interface that lets you manage Neon directly from the terminal. See [The Neon CLI](/docs/reference/neon-cli).

#### Management API

The Neon API is a RESTful API that lets you manage Neon programmatically. See [Get started with the Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api).

#### Project sharing

All Neon plans support sharing your Neon project with other Neon users, giving them access to your Neon project from all supported interfaces, including the Neon Console, Neon API, and Neon CLI. To learn more, refer to our [Project sharing](/docs/guides/project-sharing-guide) guide.

#### Branching

Neon's branching feature lets you branch your data the same way you branch your code. You can instantly create full database copies for development, testing, or any other purpose that requires a database copy. You can easily automate database branching using the Neon API, CLI, or GitHub Actions, enabling you to add database branching to your CI/CD pipeline. Branching is often used with deployment platforms such as Vercel to create a database branch for each preview deployment. To learn more, see [Get started with branching](/docs/guides/branching-intro).

## Notes

- Paid plans have a default limit of 20 simultaneously active computes to protect against unintended usage. To increase this limit, please [open a support ticket](/docs/introduction/support). The simultaneously active compute limit does not affect the primary branch compute, which always remains available.
- Active time: On the Free Tier, your primary branch is available 24/7 (~750 compute hours/month). Branch computes have a 20 hours/month active time allowance. If your branch computes exceed this allowance, they will be suspended until the allowance resets at the beginning of the month. You can monitor _active time_ on the **Usage** widget on the Neon **Dashboard**. The _active time_ allowance resets at the beginning of each month. For instance, if you enroll in the Neon Free Tier on January 15th, your _active time_ limit will reset on February 1st.


