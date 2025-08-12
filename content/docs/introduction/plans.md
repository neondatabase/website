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

| Plan feature                                                  | **Free**                       | **Launch**                           | **Enterprise**                                                                    |
| ------------------------------------------------------------- | ------------------------------ | ------------------------------------ | --------------------------------------------------------------------------------- |
| [Price](#price)                                               | $0/month                       | $5/month minimum                     | $5/month minimum                                                                  |
| [Who it's for](#who-its-for)                                  | Prototypes and side projects   | Startups and growing teams           | Production-grade workloads & larger companies                                     |
| [Projects](#projects)                                         | 10                             | 100                                  | 1,000 (may be increased on request)                                               |
| [Branches](#branches)                                         | 10/project                     | 10/project                           | 25/project                                                                        |
| [Extra branches](#extra-branches)                             | —                              | $1.50/branch-month (prorated hourly) | $1.50/branch-month (prorated hourly)                                              |
| [Compute](#compute)                                           | 50 CU-hours                    | $0.14/CU-hour                        | $0.26/CU-hour                                                                     |
| [Autoscaling](#autoscaling)                                   | Up to 2 CU (2 vCPU / 8 GB RAM) | Up to 16 CU (16 vCPU / 64 GB RAM)    | Up to 16 CU (fixed size computes up to 56 vCPU / 224 GB RAM)                      |
| [Scale to zero](#scale-to-zero)                               | After 5 min                    | After 5 min, can be disabled         | Configurable (from 5 seconds -> always on)                                        |
| [Storage](#storage)                                           | 0.5 GB per project             | $0.35 per GB-month                   | $0.35 per GB-month                                                                |
| [Public data transfer](#public-data-transfer)                 | 5 GB included                  | 100 GB included, then $0.10/GB       | 100 GB included, then $0.10/GB                                                    |
| [Monitoring](#monitoring)                                     | 1 day                          | 3 days                               | 14 days                                                                           |
| [Metrics/logs export](#metricslogs-export)                    | —                              | —                                    | ✅                                                                                |
| [Restore window](#restore-window)                             | 6 hours, up to 1 GB-month      | Up to 7 days                         | Up to 30 days                                                                     |
| [Instant restore](#instant-restore)                           | —                              | $0.20/GB-month                       | $0.20/GB-month                                                                    |
| [Private data transfer](#private-ndata-transfer)              | —                              | —                                    | $0.01/GB                                                                          |
| [Support](#support)                                           | Community                      | Billing                              | Production                                                                        |
| [Compliance and security](#compliance-and-security)           | —                              | Protected branches                   | SOC 2, ISO, GDPR, HIPAA (extra), Protected branches, IP Allow, Private Networking |
| [Uptime SLA](#uptime-sla)                                     | —                              | —                                    | ✅                                                                                |

## Plan features

This section describes the features listed in the [Plan overview](#plan-overview) table.

### ☑ Price

**Price** is the minimum monthly fee for the plan before usage-based charges are applied.

For **Launch** and **Enterprise** plans, there is a $5/month minimum monthly fee. Additional usage for compute, storage, extra branches, and other features, is billed at published rates (see the [Plan overview](#plan-overview) table).

On the **Free** plan, there is no monthly cost, you get free usage allowances for projects, branches, compute, storage, and more — for $0/month.

> If you sign up for a paid plan part way through the monthly billing period, the minimum monthly fee is prorated. For example, if you sign up exactly halfway through the month, your monthly base cost will be $2.50 (half of the $5.00 monthly fee).

### ☑ Who it's for

Which plan is right for you?

- The **Free** plan is ideal for prototypes, side projects, and quick experiments. You get 10 projects, 50 CU-hours/month, 0.5 GB of storage per branch, 5 GB of egress, and more. If you require additional resources, consider a paid plan, which offers usage-based pricing.
- The **Launch** plan is designed for startups and growing teams that need more resources, features, and flexibility. It offers usage-based pricing, starting at $5/month. If you're constrained by the Free plan, start here.
- The **Enterprise** plan is built for production-grade workloads and larger teams, offering higher limits, advanced features, full support, compliance, additional security options, and SLAs. This plan is also usage-based, starting at $5/month.

### ☑ Projects

A project is a container for your database environment. Each project includes your database, database branches, compute resources, and more. Similar to an Git repository that contains an app's code, artifacts, and branches, you can think of a project as a container for all of your database resources. Learn more about [Neon’s object hierarchy](/docs/manage/overview).

> For most use cases, we recommend creating a project for each app or customer to isolate data and manage database resources.

Each plan includes a number of projects:

- **Free**: 10 projects.
- **Launch**: 100 projects.
- **Enterprise**: 1,000 projects, with potential for more upon request. The 1000 project limit on the Enterprise plan is a _soft limit_. We understand that certain use cases may require more projects. If this is you, reach out to our [support team](/docs/introduction/support) to request more.

### ☑ Branches

Each project is created with a [root branch](/docs/reference/glossary#root-branch). In Git terms, you can think of it as your `main` branch.

Postgres databases, schemas, tables, records, indexes, roles — all of the things that comprise data in a Postgres instance — are created on a branch.

You can create **child branches**, which are copies of your root branch — ideal for testing, previews, or development.

Each plan includes a number of child branches per project at no additional cost:

- **Free**: 10 branches per project.
- **Launch**: 10 branches per project.
- **Enterprise**: 25 branches per project.

For information about the cost for additional branches, see [Extra branches](#extra-branches). For information about how branch storage is billed, see [Storage](#storage).

### ☑ Extra branches

On paid plans, you can create as many child branches as you need. Extra child branches beyond your plan's branch limit are billed in **branch-months**, metered by the hour.

```text
1 additional branch × 1 month = 1 branch-month
```

The cost for extra child branches is **$1.50 per branch-month**. Metered by the hour, this works out to about $0.002 per hour for each extra branch.

**Example:** If your plan includes 10 branches per-project and you create 2 extra branches in your project (for a total of 12 branches), and those 2 branches exist for 5 hours each, that’s 10 hours of extra child branches billed at the hourly rate derived from $1.50 per branch-month, which works out to a cost of about $0.20 for the two extra branches.

> Extra branches are not available on the Free plan. If you need more branches, you can either delete existing branches or upgrade to a paid plan.

### ☑ Compute

Your monthly compute usage depends on how long your compute runs and the size of your compute.

- Compute usage is measured in **CU-hours** (Compute Unit hours).
- A CU defines how much vCPU and memory your database uses at any moment.
- **1 CU = 1 vCPU + 4 GB RAM**
- RAM scales with vCPU size at a 4:1 ratio — you get 4 GB of RAM for every 1 vCPU.
- Compute sizes all the way up to 56 CU are supported, depending on your plan.

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

Compute usage is calculated by multiplying compute size by how long the compute runs:

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

> All computes across all of your projects contribute to your compute usage. By default, each branch is created with a read-write compute. Creating a [read replica](/docs/reference/glossary#read-replica) adds a read-only compute to a branch.

#### Compute usage with autoscaling

Autoscaling adjusts compute size up and down within your defined minimum and maximum compute size settings, based on demand. To estimate compute hour usage with autoscaling, you can estimate an **average compute size** and modify the CU-hours formula as follows:

```text
average compute size * number of hours running = CU-hours
```

To estimate an average compute size, start with a minimum compute size that can hold your data or working set (see [How to size your compute](/docs/manage/endpoints#how-to-size-your-compute)). Pick a maximum compute size that can handle your peak loads. Try estimating an average compute size between those thresholds based on a workload profile for a typical day.

#### Compute usage with scale to zero

Scale to zero places your compute into an idle state when it's not being used, which helps minimize compute usage. When scale-to-zero is enabled, computes are suspended after 5 minutes of inactivity. On Neon's paid plans, you can configure scale to zero or disable it. See [Scale to Zero](/docs/introduction/scale-to-zero).

### ☑ Autoscaling

Autoscaling adjusts compute size up and down within your defined minimum and maximum compute size settings based on demand, optimizing for performance and cost-efficiency.

Autoscaling is available on all plans, but the maximum compute size each plan can scale to differs by plan:

- **Free**: Up to 2 CU (2 vCPU / 8 GB RAM).
- **Launch**: Up to 16 CU (16 vCPU / 64 GB RAM).
- **Enterprise**: Up to 16 CU for on-demand autoscaling; fixed-size computes available up to 56 vCPU / 224 GB RAM.

> Currently, you can autoscale up to 16 CU on paid plans — this is the maximum setting for autoscaling. The Enterprise plan supports compute sizes larger than 16 CU but only for fixed-size compute configurations.

For information about estimating compute usage when autoscaling is enabled, see [Compute with autoscaling](#compute-usage-with-autoscaling).

To learn more about autoscaling, see [Autoscaling](/docs/introduction/autoscaling).

### ☑ Scale to zero

The **scale-to-zero** feature suspends a compute after a period of inactivity, which minimizes costs for databases that aren’t always active, such as development or test environment databases — and even production databases that aren't used 24/7.

- **Free plan**: Computes scale to zero after 5 minutes of inactivity – **cannot be disabled**
- **Launch plan**: Computes scale to zero after 5 minutes of inactivity — **can be disabled**
- **Enterprise**: Fully configurable — **can be disabled; configured to scale to zero after after 5 seconds or higher**

Learn more about our [scale-to-zero](/docs/introduction/scale-to-zero) feature.

### ☑ Storage

Data storage is billed based on actual usage, not allocated capacity. On paid plans, we measure storage usage in **GB-months**:

**1 GB-month = 1 GB stored for 1 month**

Storage usage is metered hourly and summed over the month.

On the **Launch** and **Enterprise** plans, storage is billed at $0.35/GB-month.

For [root branches](/docs/reference/glossary#root-branch) branches, it's your actual data size (also referred to as _[logical data size](/docs/reference/glossary#logical-data-size)_) that's metered.

For child branches, only the storage delta from the parent branch is counted. For example, when you first create a branch, it adds no storage – the branch's data is shared with its parent, but once you start performing write operations on the the branch, you've created a delta, which counts toward storage.

**Storage on child branches never decreases — the delta grows with each write operation (insert, update, or delete)**, so it's important to manage your branches and remove them when no longer needed.

> On the **Free** plan, you get 0.5 GB for each of your 10 free projects.

### ☑ Public data transfer

Public data transfer (egress) is the total volume of data transferred out of your database over the public internet during the monthly billing period.

> Public data transfer also includes data transferred from your database via [logical replication](/docs/reference/glossary#logical-replication) to any destination, including other Neon databases.

**Launch** and **Enterprise** plans have an allowance of 100 GB of public data transfer per project per month. Thereafter, public data transfer is billed at **$0.10/GB**.

**Free** plan projects have an allowance of 5 GB of public data transfer per month. If a project exceeds this limit, its compute is suspended and the following error is shown:

```text shouldWrap
Your project has exceeded the data transfer quota. Upgrade your plan to increase limits.
```

### ☑ Monitoring

Database metrics such as RAM, CPU, connections, database size, and more, are available on the **Monitoring** dashboard in the Neon Console. The retention period for database metrics differs by plan:

- **Free**: 1 day
- **Launch**: 3 days
- **Enterprise**: 14 days

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
- **Launch** and **Enterprise** plans support [restore windows](#restore-window) up to 7 days and 30 days, respectively, and the stored change history is billed at $0.20/GB-month.

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

- [Protected branches](/docs/guides/protected-branches) — a series of protections for securing your critical data
- [IP Allow](/docs/introduction/ip-allow) — for limiting access to trusted IP addresses
- [Private Networking](/docs/guides/neon-private-networking) — enables secure connections to your Neon databases via [AWS PrivateLink](https://docs.aws.amazon.com/vpc/latest/privatelink/concepts.html)

### ☑ Uptime SLAs

Guaranteed service availability is available on the **Enterprise** plan. Contact [Sales](/contact-sales) for details.

## Usage-based cost examples

The following examples show what your monthly bill might look like on the Launch and Enterprise plans at different levels of usage. Each example includes compute, storage (root and child branches), and instant restore history. Your actual costs will depend on your specific workload, usage patterns, and configuration.

> **Note:** The “billable days” shown below refer to **active compute time** — the total hours your compute is actively running in a month. Computes can scale to zero when idle, so you may accumulate these hours in shorter bursts throughout the month rather than running continuously.

### Launch plan

1. **Example 1**  
   - Compute: ~120 CU-hours = 1 CU × 120 hours (about 5 billable days) — **$16.80**  
     *(120 CU-hours × $0.14/CU-hour)*  
   - Root branch storage: 20 GB — **$7.00**  
     *(20 GB × $0.35/GB-month)*  
   - Child branch storage: 5 GB — **$1.75**  
     *(5 GB × $0.35/GB-month)*  
   - Instant restore history: 10 GB — **$2.00**  
     *(10 GB × $0.20/GB-month)*  
   - Base fee — **$5.00**  
   **Estimated monthly cost:** **$32.55**

2. **Example 2**  
   - Compute: ~250 CU-hours = 2 CU × 125 hours (about 5.2 billable days) — **$35.00**  
     *(250 CU-hours × $0.14/CU-hour)*  
   - Root branch storage: 40 GB — **$14.00**  
     *(40 GB × $0.35/GB-month)*  
   - Child branch storage: 10 GB — **$3.50**  
     *(10 GB × $0.35/GB-month)*  
   - Instant restore history: 20 GB — **$4.00**  
     *(20 GB × $0.20/GB-month)*  
   - Base fee — **$5.00**  
   **Estimated monthly cost:** **$61.50**

---

### Enterprise plan

1. **Example 1**  
   - Compute: ~1,700 CU-hours = 4 CU × 425 hours (about 17.7 billable days) — **$442.00**  
     *(1,700 CU-hours × $0.26/CU-hour)*  
   - Root branch storage: 100 GB — **$35.00**  
     *(100 GB × $0.35/GB-month)*  
   - Child branch storage: 25 GB — **$8.75**  
     *(25 GB × $0.35/GB-month)*  
   - Instant restore history: 50 GB — **$10.00**  
     *(50 GB × $0.20/GB-month)*  
   - Base fee — **$5.00**  
   **Estimated monthly cost:** **$500.75**

2. **Example 2**  
   - Compute: ~2,600 CU-hours = 8 CU × 325 hours (about 13.5 billable days) — **$676.00**  
     *(2,600 CU-hours × $0.26/CU-hour)*  
   - Root branch storage: 150 GB — **$52.50**  
     *(150 GB × $0.35/GB-month)*  
   - Child branch storage: 40 GB — **$14.00**  
     *(40 GB × $0.35/GB-month)*  
   - Instant restore history: 75 GB — **$15.00**  
     *(75 GB × $0.20/GB-month)*  
   - Base fee — **$5.00**  
   **Estimated monthly cost:** **$762.50**

## FAQs

<DefinitionList>
[comment]: <> (required new line)

What is a project?
: A project in Neon is the top-level container for your database environment. Each project includes your database, its branches, and compute resources. You can think of it like a GitHub repository — one project, many branches. Learn more: [Neon’s object hierarchy](/docs/manage/overview)

What is a CU?
: A CU (Compute Unit) is Neon's measure of compute size. **1 CU = 1 vCPU + 4 GB RAM**. RAM scales with vCPU size at a 4:1 ratio. For example, a 2 CU compute has 2 vCPU and 8 GB RAM.

How is compute usage measured in Neon?
: Compute usage is measured in **CU-hours**:  
  CU-hours = compute size (in CU) × hours running  
  Examples:  
  • 0.25 CU for 4 hours = 1 CU-hour  
  • 2 CU for 3 hours = 6 CU-hours  
  Your plan’s compute price per CU-hour depends on whether you are on Launch or Enterprise. On the Free plan, you have 50 CU-hours/month included.

How is storage usage billed in Neon?
: Storage is billed based on actual usage, measured in **GB-months**:  
  1 GB-month = 1 GB stored for 1 month  
  Storage usage is metered hourly and summed over the month. For child branches, only the storage **delta** (changes from the parent branch) is billed. On the Free plan, you get 0.5 GB per project.

How do branches affect storage?
: Your root branch contains your main data. Child branches share data with the root until changes are made. Only the changed data (delta) is billed for child branches. Delta storage never decreases, so delete unused branches to control storage costs.

How is extra branch usage billed?
: Paid plans include a set number of branches per project. Additional branches are billed at **$1.50/branch-month**, prorated hourly (about $0.002/hour).  
  Example: If your plan includes 10 branches and you run 2 extra branches for 5 hours each, that’s 10 branch-hours (~$0.02).

How are instant restores billed?
: Instant restore storage is billed based on the amount of change history retained, not the number of restores performed.  
  • Free: Up to 6 hours of history, capped at 1 GB of changes, no charge.  
  • Launch: Up to 7 days of history, billed at $0.20/GB-month.  
  • Enterprise: Up to 30 days of history, billed at $0.20/GB-month.  
  Change history is stored as Postgres WAL records.

Can I disable scale-to-zero?
: Free: No, it’s always enabled (5 min idle timeout).  
  Launch: Yes, you can disable it.  
  Enterprise: Yes, fully configurable (5 seconds to always-on). Learn more: [Scale to zero](/docs/introduction/scale-to-zero)

What is autoscaling and how does it work?
: Autoscaling adjusts compute size based on load, between your set min/max limits. All plans support it, but maximum CU differs: Free up to 2 CU, Launch and Enterprise Enterprise up to 16 CU. Enterprise supports up to 56 CU for fixed-size computes. Learn more: [Autoscaling](/docs/introduction/autoscaling)

Are read replicas billed separately?
: Yes. Each read replica is its own compute and contributes to CU-hours.

Do public data transfer limits reset each month?
: Yes. Free plan includes 5 GB/month, Launch and Enterprise include 100 GB/month. Beyond that, it’s $0.10/GB.

How is private data transfer billed?
: Only available on Enterprise: $0.01/GB, bidirectional, between Neon and private network services.

What happens if I exceed my Free plan limits?
: Compute will suspend when limits are reached (e.g., CU-hours or public data transfer). To continue, upgrade to a paid plan.

Do you charge for idle computes?
: If scale-to-zero is enabled, no. Computes that are suspended do not accrue CU-hours.

What is the difference between root and child branch storage billing?
: Root branches are billed for their full logical data size. Child branches are billed only for changes relative to their parent.

Can I get more than the listed project or branch limits?
: Yes, on Enterprise you can request increases for projects and branches beyond listed limits.

Why is the monthly minimum the same for Launch and Enterprise?
: Both plans have a $5/month minimum, but Enterprise has a higher CU-hour rate. This keeps fixed costs low while letting usage-based charges reflect the higher availability, security, and operational resources of Enterprise.

How is the monthly base fee prorated?
: If you upgrade partway through a billing cycle, the $5 minimum is prorated based on the remaining days in the month.

How can I control my costs?
: • Set a maximum autoscaling limit to cap compute size.  
  • Enable scale-to-zero for idle databases.  
  • Delete unused branches to reduce storage costs.  
  • Shorten your restore window to reduce instant restore storage.

Do you offer credits for startups?
: Yes, venture-backed startups may apply for the Neon Startup Program. Learn more: [Startup Program](/startup)

</DefinitionList>


<NeedHelp/>
