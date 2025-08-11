---
title: Neon plans
enableTableOfContents: true
isDraft: false
redirectFrom:
  - /docs/introduction/billing#neon-plans
  - /docs/introduction/billing-calculators
  - /docs/introduction/billing-rates
  - /docs/introduction/free-tier
  - /docs/introduction/pro-plan
  - /docs/introduction/custom-plan
  - /docs/introduction/usage-metrics
  - /docs/reference/technical-preview-free-tier
  - /docs/reference/pricing-estimation-guide
  - /docs/reference/billing-sample
updatedOn: '2025-05-30T16:54:40.485Z'
---

Neon offers plans to support you at every stage—from your first prototype to production at scale.
Start for free, then **pay only for what you use** as your needs grow.

<Admonition type="note">
These are Neon's new usage-based pricing plans, released in August, 13, 2025. If you signed up earlier on a paid plan, you may still be on a [legacy plan](/docs/introduction/legacy-plans). To move to a different plan, see [Change your plan](/docs/introduction/manage-billing#change-your-plan). Free plan users were automatically migrated to the new Free plan described below.
</Admonition>

---

## Plan overview

Compare Neon's **Free**, **Launch**, and **Enterprise** plans.

| Plan feature                                  | **Free**                                            | **Launch**                                                      | **Enterprise**                        |
| ----------------------------------------------| --------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------- |
| [Price](#price)                               | $0/month                                            | $5/month minimum                                                | $5/month minimum                      |
| [Who it's for](#who-its-for)                  | Prototypes and side projects                        | Startups and growing teams                                      | Production-grade workloads & larger companies |
| [Projects](#projects)                         | 10                                                  | 100                                                             | 1,000 (may be increased on request)   |
| [Branches](#branches)                    | 10/project                                          | 10/project                                                      | 25/project                            |
| [Extra branches](#extra-branches)             | —                                                   | $1.50/branch-month (prorated hourly)                            | $1.50/branch-month (prorated hourly)  |
| [Compute](#compute)                           | 50 CU-hours                                         | $0.14/CU-hour                                                   | $0.26/CU-hour                         |
| [Autoscaling](#autoscaling)                   | Up to 2 CU (2 vCPU / 8 GB RAM)                      | Up to 16 CU (16 vCPU / 64 GB RAM)                               | Up to 16 CU (fixed size computes up to 56 vCPU / 224 GB RAM)    |
| [Scale to zero](#scale-to-zero)               | After 5 min                                         | After 5 min, can be disabled                                    | Configurable (from 5 seconds -> always on) |
| [Storage](#storage)                           | 0.5 GB per branch                                   | $0.35 per GB-month                                              | $0.35 per GB-month                    |
| [Public data transfer (egress)](#public-data-transfer-egress) | 5 GB included                 | 100 GB included, then $0.10/GB                                  | 100 GB included, then $0.10/GB        |
| [Monitoring](#monitoring)                     | 1 day                                           | 3 days                                                          | 14 days                               |
| [Metrics/logs export](#metricslogs-export) | —                         | —                                                               | ✅                              |
| [Restore window](#restore-window)             | 6 hours, up to 1 GB-month                           | Up to 7 days                                                    | Up to 30 days                         |
| [Instant restore](#instant-restore)           | —                                                   | $0.20/GB-month                                                  | $0.20/GB-month                        |
| [Private data transfer](#private-ndata-transfer) | —             | —                                                               | $0.01/GB                              |
| [Support](#support)                           | Community                                           | Billing                                                 | Production                    |
| [Compliance and security](#compliance-and-security)| —                                                   | Protected branches | SOC 2, ISO, GDPR, HIPAA (extra), Protected branches, IP Allow, Private Networking                          | 
| [Uptime SLA](#uptime-sla)                     | —                                                   | —                                                               | ✅                                |

## Plan features

This section describes the features listed in the [Plan overview](#plan-overview) table.

### ☑ Price

**Price** is the minimum monthly fee for the plan before usage-based charges are applied.

For **Launch** and **Enterprise** plans, there is a $5/month minimum monthly fee. Additional usage for compute, storage, extra branches, and other features, is billed at published rates (see the [Plan overview](#plan-overview) table).

On the **Free** plan, there is no monthly cost, you get free usage allowances for projects, branches, compute, storage, and more — for $0/month.

> If you sign up for a paid plan part way through the monthly billing period, the minimum monthly fee is prorated. For example, if you sign up exactly halfway through the month, your monthly base cost will be $2.50 (half of the $5.00 monthly fee).

### ☑ Who it's for

Which plan is right for you?

- The **Free** plan is ideal for prototypes, side projects, and quick experiments. You get 10 projects, 50 CU-hours/month, 0.5 GB of storage per branch, 5 GB of egress, and more. If you require additioanal resources, consider a paid plan, which offers usage-based pricing.
- The **Launch** plan is designed for startups and growing teams that need more resources, features, and flexibility. It offers usage-based pricing, starting at $5/month. If you would be constrained by the Free plan, start here.
- The **Enterprise** plan is built for production-grade workloads and larger teams, offering higher limits, advanced features, full support, compliance, additional security options, and SLAs. This plan is also usage-based, starting at $5/month.

  > Paid plans do not include Free plan compute, storage, and instant restore allowances.

### ☑ Projects

A project is a container for your database environment. Each project includes your database, database branches, compute resources, and more. Similar to an application's Git repository that contains the app's code, artifacts, and branches, you can think of a project as a container for all of your database resources. Learn more about [Neon’s object hierarchy](/docs/manage/overview).

> For most use cases, we recommend creating a project for each app or customer to isolate data and manage database resources.

Each plan includes a number of projects:

- **Free**: 10 projects.
- **Launch**: 100 projects.
- **Enterprise**: 1,000 projects, with potential for more upon request. The 1000 project limit on the Enterprise plan is a _soft limit_. We understand that certain use cases may require more projects. If this is you, reach out to our [support team](/docs/introduction/support) to request more.

### ☑ Branches

Each project is created with a **root branch**. In Git terms, you can think of it as your `main` branch.

Postgres databases, schemas, tables, records, indexes, roles — all of the things that comprise data in a Postgres instance — are created on a branch.

You can create **child branches**, which are copies of your root branch — ideal for testing, previews, or development.

Each plan includes a number of branches per project at no additional cost:

- **Free**: 10 branches per project.
- **Launch**: 10 branches per project.
- **Enterprise**: 25 branches per project.

> Your project's root branch counts toward the per-project branch limit.

For information about the cost for additional branches, see [Extra branches](#extra-branches). For information about how branch storage is billed, see [Storage](#storage).

### ☑ Extra branches

On paid plans, you can create as many branches as you need. Extra branches beyond your plan's branch limit are billed in **branch-months**, metered by the hour.

```text
1 additional branch × 1 month = 1 branch-month
```

The cost on paid plans is **$1.50 per branch-month**. Metered by the hour, this works out to about $0.002 per hour for each extra branch.

**Example:** If your plan includes 10 branches per-project and you create 2 extra branches in your project (for a total of 12 branches), and those 2 branches exist for 5 hours each, that’s 10 hours of extra branches billed at the hourly rate derived from $1.50 per branch-month.

> Extra branches are not available on the Free plan. If you need more branches, you can either delete existing branches or upgrade to a paid plan. Your project's root branch counts toward the per-project branch limit.

### ☑ Compute

Your monthly compute usage depends on how long your compute runs and the size of your compute.

- Compute usage is measured in **CU-hours** (Compute Unit hours).
- A CU defines how much vCPU and memory your database uses at any moment.
- **1 CU = 1 vCPU + 4 GB RAM**
- RAM scales with vCPU size at a 1:4 ratio — for every 1 vCPU in a Compute Unit, you get 4 GB of RAM.
- Compute sizes all the way up to 56 CU are supported, depending on your plan — larger computes provide more processing power, more RAM, and higher connection limits.

  ```
  | Compute Unit | vCPU | RAM    |
  | ------------ | ---- | ------ |
  | .25          | .25  | 1 GB   |
  | .5           | .5   | 2 GB   |
  | 1            | 1    | 4 GB   |
  | 2            | 2    | 8 GB   |
  | 3            | 3    | 12 GB  |
   up to ...
  | 56           | 56   | 224 GB |
  ```

Compute usage is compute size multiplied by how long your compute runs:

```text
compute size × number of hours running = CU-hours
```

Here are a few examples that illustrate compute usage in CU-hours:

- A 0.25 CU compute running for 4 hours = 1 CU-hour
- A 2 CU compute running for 3 hours = 6 CU-hours
- An 8 CU compute running for 2 hours = 16 CU-hours

**On the Free plan, you get 50 CU-hours per month** — this lets you run a 0.25 CU compute for 200 hours per month. Together with [scale-to-zero](#scale-to-zero), this is sufficient for most prototypes and side-projects. If you need more compute hours, consider upgrading to a paid plan.

**Paid plan compute cost is usage-based:**

- **Launch**: $0.14/CU-hour, pay-as-you-go.
- **Enterprise**: $0.26/CU-hour, pay-as-you-go.

**Why do CU-hours cost more on the Enterprise plan?** — the Enterprise plan offers higher allowances and more features (see the [Plan overview](#plan-overview) table above).

> All computes across all of your projects contribute to your compute usage. By default, each branch is created with a read-write compute. Creating a read replica adds a read-only compute to a branch.

#### Compute usage with autoscaling

Autoscaling adjusts compute size up and down within your defined minimum and maximum compute size settings, based on demand. To estimate compute hour usage with autoscaling, you can estimate an **average compute size** and modify the CU-hours formula as follows:

```text
average compute size * number of hours running = CU-hours
```

To estimate an average compute size, start with a minimum compute size that can hold your data or working set (see [How to size your compute](/docs/manage/endpoints#how-to-size-your-compute)). Pick a maximum compute size that can handle your peak loads. Try estimating an average compute size between those thresholds based on a workload profile for a typical day.

#### Compute usage with scale to zero

Scale to zero places your compute into an idle state when it's not being used, which helps minimize compute usage. When scale-to-zero is enabled, computes are suspended after 5 minutes of inactivity. On Neon's paid plans, you can configure scale to zero. See [Scale to Zero](/docs/introduction/scale-to-zero).

### ☑ Autoscaling

Autoscaling adjusts compute size up and down within your defined minimum and maximum compute size settings based on demand, optimizing for performance and cost-efficiency.

Autoscaling is available on all plans, but the maximum compute size each plan can scale to differs by plan:

- **Free**: Up to 2 CU (2 vCPU / 8 GB RAM).
- **Launch**: Up to 16 CU (16 vCPU / 64 GB RAM).
- **Enterprise**: Up to 16 CU for on-demand autoscaling; fixed-size computes available up to 56 vCPU / 224 GB RAM.

> Currently, you can autoscale up to 16 CU — this is the maximum setting on both paid plans. The Enterprise plan supports larger compute sizes but not for autoscaling.

For information about estimating compute usage when autoscaling is enabled, see [CU-hour usage with autoscaling](#cu-hour-usage-with-autoscaling).

To learn more about autoscaling, see [Autoscaling](/docs/introduction/autoscaling).

### ☑ Scale to zero

The **scale-to-zero** feature suspends a compute after a period of inactivity, which minimizes costs for databases that aren’t always active, such as development or test environment databases — and even production databases that aren't used 24/7.

- **Free plan**: Computes scale to zero after 5 minutes of inactivity – **cannot be disabled**
- **Launch plan**: Computes scale to zero after 5 minutes of inactivity — **can be disabled**
- **Enterprise**: Fully configurable — **can be disabled, configurable from 5 seconds to always-on**

Learn more about our [scale-to-zero](/docs/introduction/scale-to-zero) feature.

### ☑ Storage

Data storage is billed based on actual usage, not allocated capacity. On paid plans, we measure storage usage in **GB-months**:

**1 GB-month = 1 GB stored for 1 month**

Storage is metered hourly and summed over the month.

On the **Launch** and **Enterprise** plans, storage is billed at $0.35/GB-month.

For [root](/docs/reference/glossary#root-branch) branches, it's your actual data size (also referred to as _[logical data size](/docs/reference/glossary#logical-data-size)_) that's metered.

For child branches, only the delta from the parent branch is counted. For example, when you first create a branch, it adds no storage–the branch's data is shared with its parent, but once you start performing write operations on the the branch, you've created a delta, which counts toward storage.

**Storage on child branches never decreases—the delta only grows with each write operation (insert, update, or delete)**, so it's important to manage your branches and remove them when no longer needed.

> On the **Free** plan, you get 0.5 GB on the root branch and 0.5 GB of storage on child branches at no cost.

### ☑ Public data transfer (egress)

Public data transfer is the total volume of data transferred out of your database over the public internet during the monthly billing period.

> Public data transfer also includes data transferred from your database via Postgres logical replication to any destination, including other Neon databases.

**Launch** and **Enterprise** plans have an allowance of 100 GB of public data transfer per project per month. Thereafter, there is a $0.10/GB cost for public data transfer.

**Free** plan projects are limited to 5 GB of public data transfer per month. If a project exceeds this limit, its compute is suspended and the following error is shown:

```text shouldWrap
Your project has exceeded the data transfer quota. Upgrade your plan to increase limits.
```

### ☑ Monitoring

Database metrics are retained on the **Monitoring** dashboard in the Neon Console. The retention period differs by plan:

- **Free**: 1 day.
- **Launch**: 3 days.
- **Enterprise**: 14 days.

For information about database metrics, see [Monitoring dashboard](/docs/introduction/monitoring-page).

### ☑ Metrics/logs export

Neon supports exporting metrics and Postgres logs to [Datadog](/docs/guides/datadog) or any [OTel-compatible observability platform](/docs/guides/opentelemetry).

Metrics and log export is only supported on the **Enterprise** plan.

### ☑ Restore window

Neon retains a history of changes for all branches in your project, enabling [instant restore](#instant-restore).

The maximum time span for instant restore depends on your plan:

- **Free**: Up to 6 hours, capped at 1 GB-month of changes.
- **Launch**: Up to 7 days.
- **Enterprise**: Up to 30 days.

The restore window is configurable. You can extend or reduce it based on your restore requirements. See [Configure your restore window](/docs/manage/projects#configure-your-restore-window). Reducing your restore window can reduce instant restore storage costs but also limits how far back you can restore.

### ☑ Instant restore

Neon stores a change history for all branches in your project to support instant restore. The change history is a log of write operations. The cost for storing the history of changes:

- **Free**: No charge, you get 6 hours, capped at 1 GB of change history
- **Launch** and **Enterprise** plans support longer [restore windows](#restore-window), and the stored change history billed at $0.20/GB-month.

> Change history is stored as Postgres [Write-Ahead Log (WAL)](/docs/reference/glossary#write-ahead-logging-wal) records.

For more information about this feature, see [Instant restore](/docs/introduction/branch-restore).

### ☑ Private data transfer

The **Enterprise** plan supports [Private Networking](/docs/guides/neon-private-networking), which enables connecting to your Neon databases via [AWS PrivateLink](https://docs.aws.amazon.com/vpc/latest/privatelink/concepts.html), bypassing the open internet.

Network data transfer between Neon and private network services is billed at $0.01/GB. Data transferred **to and from Neon** is billed — it's bidirectional.

### ☑ Support

The level of support differs by plan:

- **Free**: Community support.
- **Launch**: Billing support.
- **Enterprise**: Production support.

Please refer to our [Support](/docs/introduction/support) page for details.

### ☑ Compliance and security

Neon supports several key [compliances](/docs/security/compliance), available on the **Enterprise** plan:

- SOC 2
- SOC 3
- ISO 27001
- ISO 27701
- GDPR
- CCPA
- HIPAA (additional charges apply)

> Additional charges apply for [HIPAA](/docs/security/hipaa) support. Contact [Sales](/contact-sales) for details.

Security features include:

-  [Protected branches](/docs/guides/protected-branches) — a series of protections for securing your critical data
-  [IP Allow](/docs/introduction/ip-allow) — for limiting access to trusted IP addresses
-  [Private Networking](/docs/guides/neon-private-networking) — enables secure connections to your Neon databases via [AWS PrivateLink](https://docs.aws.amazon.com/vpc/latest/privatelink/concepts.html)

### ☑ Uptime SLAs

Guaranteed service availability is available on the **Enterprise** plan. Contact [Sales](/contact-sales) for details.

## Questions

Got questions about Neon pricing? Join us on our [Discord server](https://discord.gg/92vNTzKDGp) or [contact our sales team](https://neon.tech/contact-sales).

<NeedHelp/>
