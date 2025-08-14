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
updatedOn: '2025-08-14T14:48:02.694Z'
---

Neon offers plans to support you at every stage—from your first prototype to production at scale.
Start for free, then **pay only for what you use** as your needs grow.

<Admonition type="note">
The plans on this page are Neon's usage-based pricing plans, introduced **August 14, 2025**. If you joined earlier, you may still be on a [legacy plan](/docs/introduction/legacy-plans). See [Change your plan](/docs/introduction/manage-billing#change-your-plan) to switch. Free plan users were automatically moved to the new plan described below.
</Admonition>

---

## Plan overview

Compare Neon's **Free**, **Launch**, and **Scale** plans.

| Plan feature                                          | **Free**                       | **Launch**                           | **Scale**                                                                         |
| ----------------------------------------------------- | ------------------------------ | ------------------------------------ | --------------------------------------------------------------------------------- |
| [Price](#price)                                       | $0/month                       | $5/month minimum                     | $5/month minimum                                                                  |
| [Who it's for](#who-its-for)                          | Prototypes and side projects   | Startups and growing teams           | Production-grade workloads and larger companies                                   |
| [Projects](#projects)                                 | 10                             | 100                                  | 1,000 (can be increased on request)                                               |
| [Branches](#branches)                                 | 10/project                     | 10/project                           | 25/project                                                                        |
| [Extra branches](#extra-branches)                     | —                              | $1.50/branch-month (prorated hourly) | $1.50/branch-month (prorated hourly)                                              |
| [Compute](#compute)                                   | 50 CU-hours                    | $0.14/CU-hour                        | $0.26/CU-hour                                                                     |
| [Autoscaling](#autoscaling)                           | Up to 2 CU (2 vCPU / 8 GB RAM) | Up to 16 CU (16 vCPU / 64 GB RAM)    | Up to 16 CU (fixed computes up to 56 vCPU / 224 GB RAM)                           |
| [Scale to zero](#scale-to-zero)                       | After 5 min                    | After 5 min, can be disabled         | Configurable (5 seconds to always on)                                             |
| [Storage](#storage)                                   | 0.5 GB/project                 | $0.35/GB-month                       | $0.35/GB-month                                                                    |
| [Public network transfer](#public-network-transfer)   | 5 GB included                  | 100 GB included, then $0.10/GB       | 100 GB included, then $0.10/GB                                                    |
| [Monitoring](#monitoring)                             | 1 day                          | 3 days                               | 14 days                                                                           |
| [Metrics/logs export](#metricslogs-export)            | —                              | —                                    | ✅                                                                                |
| [Restore window](#restore-window)                     | 6 hours, up to 1 GB-month      | Up to 7 days                         | Up to 30 days                                                                     |
| [Instant restore](#instant-restore)                   | —                              | $0.20/GB-month                       | $0.20/GB-month                                                                    |
| [Private network transfer](#private-network-transfer) | —                              | —                                    | $0.01/GB                                                                          |
| [Compliance and security](#compliance-and-security)   | —                              | Protected branches                   | SOC 2, ISO, GDPR, HIPAA (extra), Protected branches, IP Allow, Private Networking |
| [Uptime SLA](#uptime-sla)                             | —                              | —                                    | ✅                                                                                |
| [Support](#support)                                   | Community                      | Billing                              | Standard                                                                          |

## Plan features

This section describes the features listed in the [Plan overview](#plan-overview) table.

### ☑ Price

**Price** is the minimum monthly fee for the plan before usage-based charges.

For **Launch** and **Scale**, the minimum monthly fee is $5. Additional usage for compute, storage, extra branches, and other features is billed at the published rates (see the [Plan overview](#plan-overview) table).

On the **Free** plan, there is no monthly cost. You get usage allowances for projects, branches, compute, storage, and more — for $0/month.

> If you sign up for a paid plan part way through the monthly billing period, the minimum monthly fee is prorated. For example, signing up halfway through the month results in a $2.50 base cost (half of $5).

### ☑ Who it's for

- **Free** — Prototypes, side projects, and quick experiments. Includes 10 projects, 50 CU-hours/month, 0.5 GB storage per branch, and 5 GB of egress. Upgrade if you need more resources or features.
- **Launch** — Startups and growing teams needing more resources, features, and flexibility. Usage-based pricing starts at $5/month.
- **Scale** — Production-grade workloads and large teams. Higher limits, advanced features, full support, compliance, additional security, and SLAs. Usage-based pricing starts at $5/month.

### ☑ Projects

A project is a container for your database environment. It includes your database, branches, compute resources, and more. Similar to a Git repository that contains code, artifacts, and branches, a project contains all your database resources. Learn more about [Neon's object hierarchy](/docs/manage/overview).

> For most use cases, create a project for each app or customer to isolate data and manage resources.

Included per plan:

- **Free**: 10 projects
- **Launch**: 100 projects
- **Scale**: 1,000 projects (soft limit — request more if needed via [support](/docs/introduction/support))

### ☑ Branches

Each project is created with a [root branch](/docs/reference/glossary#root-branch), like the `main` branch in Git.  
Postgres objects — databases, schemas, tables, records, indexes, roles — are created on a branch.

You can create [child branches](/docs/reference/glossary#child-branch) for testing, previews, or development.

Included per plan:

- **Free**: 10 branches/project
- **Launch**: 10 branches/project
- **Scale**: 25 branches/project

See [Extra branches](#extra-branches) for overage costs and [Storage](#storage) for how branch storage is billed.

> Projects can have multiple root branches, with limits based on your plan. See [Branch types: Root branch](/docs/manage/branches#root-branch) for details.

### ☑ Extra branches

On paid plans, you can create extra child branches. Extra branches beyond your plan's limit are billed in **branch-months**, metered hourly.

1 extra branch × 1 month = 1 branch-month

Cost: **$1.50/branch-month** (~$0.002/hour).

Example: Plan includes 10 branches/project. You create 2 extra branches for 5 hours each → 10 extra branch-hours × $0.002/hour = ~$0.20 total.

> Extra branches are not available on the Free plan. Delete branches or upgrade if you need more.

uBranch maximm:

- **Launch**: 5,000 branches/project
- **Scale**: 5,000 branches/project

### ☑ Compute

Compute usage depends on compute size and runtime.

- Measured in **CU-hours** (Compute Unit hours)
- 1 CU = 1 vCPU + 4 GB RAM
- RAM scales at a 4:1 ratio (4 GB RAM per 1 vCPU)
- Compute sizes up to 56 CU (plan-dependent)

| Compute Unit | vCPU | RAM    |
| ------------ | ---- | ------ |
| .25          | .25  | 1 GB   |
| .5           | .5   | 2 GB   |
| 1            | 1    | 4 GB   |
| 2            | 2    | 8 GB   |
| 3            | 3    | 12 GB  |
| ...          | ...  | ...    |
| 56           | 56   | 224 GB |

Formula:

```
compute size × hours running = CU-hours
```

Examples:

- 0.25 CU for 4 hours = 1 CU-hour
- 2 CU for 3 hours = 6 CU-hours
- 8 CU for 2 hours = 16 CU-hours

**Free**: 50 CU-hours/month (enough for a 0.25 CU compute for 200 hours/month).  
**Launch**: $0.14/CU-hour  
**Scale**: $0.26/CU-hour

> All computes across all projects count toward usage. Each branch has a read-write compute by default; [read replicas](/docs/reference/glossary#read-replica) add read-only computes.

#### Compute with autoscaling

Autoscaling changes compute size between a defined min and max. Estimate usage as:

```
average compute size × hours running = CU-hours
```

#### Compute with scale to zero

Scale to zero suspends computes after inactivity to compute usage and cost.

### ☑ Autoscaling

Adjusts compute size between defined limits based on demand.

- **Free**: Up to 2 CU (2 vCPU / 8 GB RAM)
- **Launch**: Up to 16 CU (16 vCPU / 64 GB RAM)
- **Scale**: Up to 16 CU for autoscaling; fixed sizes up to 56 CU (vCPU / 224 GB RAM)

> Autoscaling is capped at 16 CU. Scale supports fixed computes above 16 CU.

### ☑ Scale to zero

Suspends computes after inactivity.

- **Free**: 5 min inactivity — cannot disable
- **Launch**: 5 min inactivity — can disable
- **Scale**: Fully configurable — 5 seconds to always on

### ☑ Storage

Billed on actual usage in **GB-months**. Measured hourly.

- **Launch**/**Scale**: $0.35/GB-month
- **Root branches**: billed on actual data size (_logical data size_)
- **Child branches**: billed on storage delta from the parent

When a branch is created, it shares data with its parent and adds no storage. Once you make writes (insert, update, delete), the delta grows and counts toward storage.  
Storage on child branches never decreases — it grows as changes accumulate.

> **Free** plan users get 0.5 GB of storage per project

### ☑ Public network transfer

Public network transfer (egress) is the total volume of data sent from your database over the public internet during the monthly billing period.

> Public network transfer includes data sent via [logical replication](/docs/reference/glossary#logical-replication) to any destination, including other Neon databases.

Allowances per plan:

- **Free**: 5 GB/month
- **Launch**: 100 GB/month, then $0.10/GB
- **Scale**: 100 GB/month, then $0.10/GB

### ☑ Monitoring

View metrics such as RAM, CPU, connections, and database size in the **Monitoring** dashboard in the Neon Console.

Retention of metrics data differs by plan:

- **Free**: 1 day
- **Launch**: 3 days
- **Scale**: 14 days

See [Monitoring dashboard](/docs/introduction/monitoring-page) for details.

### ☑ Metrics/logs export

Export metrics and Postgres logs to [Datadog](/docs/guides/datadog) or any [OTel-compatible platform](/docs/guides/opentelemetry).  
Available only on the **Scale** plan.

### ☑ Restore window

Neon retains a history of changes for all branches, enabling [instant restore](#instant-restore).  
The maximum restore window per plan:

- **Free**: Up to 6 hours, capped at 1 GB-month of changes
- **Launch**: Up to 7 days
- **Scale**: Up to 30 days

The restore window is configurable. Shortening it can reduce instant restore costs but limits how far back you can restore. See [Configure your restore window](/docs/manage/projects#configure-your-restore-window).

### ☑ Instant restore

Neon stores a log of write operations (Postgres [Write-Ahead Log](/docs/reference/glossary#write-ahead-logging-wal)) to support instant restore.

- **Free**: No charge, 6-hour limit, capped at 1 GB of change history
- **Launch**: Up to 7 days, billed at $0.20/GB-month
- **Scale**: Up to 30 days, billed at $0.20/GB-month

See [Instant restore](/docs/introduction/branch-restore) for details.

### ☑ Private network transfer

Available on the **Scale** plan with [Private Networking](/docs/guides/neon-private-networking), which uses [AWS PrivateLink](https://docs.aws.amazon.com/vpc/latest/privatelink/concepts.html) to bypass the public internet.

Billed at $0.01/GB for network transferred to and from Neon.

### ☑ Compliance and security

Compliance certifications available on **Scale**:

- SOC 2
- SOC 3
- ISO 27001
- ISO 27701
- GDPR
- CCPA
- HIPAA (additional charge)

> Contact [Sales](/contact-sales) for HIPAA details.

Security features:

- [Protected branches](/docs/guides/protected-branches) — safeguards for critical data (available on **Launch** and **Scale**)
- [IP Allow](/docs/introduction/ip-allow) — restricts access to trusted IPs (available on **Scale**)
- [Private Networking](/docs/guides/neon-private-networking) — secure private connections via AWS PrivateLink (available on **Scale**)

### ☑ Uptime SLA

Guaranteed service availability is offered on the **Scale** plan. Contact [Sales](/contact-sales) for details.

### ☑ Support

Support level by plan:

- **Free**: Community support
- **Launch**: Billing support
- **Scale**: Standard support

See [Support](/docs/introduction/support) for details.

## Usage-based cost examples

The following examples show what your monthly bill might look like on the **Launch** and **Scale** plans at different levels of usage. Each example includes compute, storage (root and child branches), and instant restore history. Your actual costs will depend on your specific workload, usage patterns, and configuration.

> **Note:** The "billable days" shown below refer to **active compute time** — the total hours your compute is actively running in a month. Computes can scale to zero when idle, so you may accumulate these hours in shorter periods of usage throughout the month rather than running continuously.

### Launch plan

- **Example 1**
  - Compute: ~120 CU-hours = 1 CU × 120 hours (about 5 billable days) — **$16.80**  
    _(120 CU-hours × $0.14/CU-hour)_
  - Root branch storage: 20 GB — **$7.00**  
    _(20 GB × $0.35/GB-month)_
  - Child branch storage: 5 GB — **$1.75**  
    _(5 GB × $0.35/GB-month)_
  - Instant restore history: 10 GB — **$2.00**  
    _(10 GB × $0.20/GB-month)_
  - Base fee — **$5.00**  
    **Estimated monthly cost:** **$32.55**

- **Example 2**
  - Compute: ~250 CU-hours = 2 CU × 125 hours (about 5.2 billable days) — **$35.00**  
    _(250 CU-hours × $0.14/CU-hour)_
  - Root branch storage: 40 GB — **$14.00**  
    _(40 GB × $0.35/GB-month)_
  - Child branch storage: 10 GB — **$3.50**  
    _(10 GB × $0.35/GB-month)_
  - Instant restore history: 20 GB — **$4.00**  
    _(20 GB × $0.20/GB-month)_
  - Base fee — **$5.00**  
    **Estimated monthly cost:** **$61.50**

---

### Scale plan

- **Example 1**
  - Compute: ~1,700 CU-hours = 4 CU × 425 hours (about 17.7 billable days) — **$442.00**  
    _(1,700 CU-hours × $0.26/CU-hour)_
  - Root branch storage: 100 GB — **$35.00**  
    _(100 GB × $0.35/GB-month)_
  - Child branch storage: 25 GB — **$8.75**  
    _(25 GB × $0.35/GB-month)_
  - Instant restore history: 50 GB — **$10.00**  
    _(50 GB × $0.20/GB-month)_
  - Base fee — **$5.00**  
    **Estimated monthly cost:** **$500.75**

- **Example 2**
  - Compute: ~2,600 CU-hours = 8 CU × 325 hours (about 13.5 billable days) — **$676.00**  
    _(2,600 CU-hours × $0.26/CU-hour)_
  - Root branch storage: 150 GB — **$52.50**  
    _(150 GB × $0.35/GB-month)_
  - Child branch storage: 40 GB — **$14.00**  
    _(40 GB × $0.35/GB-month)_
  - Instant restore history: 75 GB — **$15.00**  
    _(75 GB × $0.20/GB-month)_
  - Base fee — **$5.00**  
    **Estimated monthly cost:** **$762.50**

## FAQs

<DefinitionList>

What is a CU?
: A CU (Compute Unit) is Neon's measure of compute size. **1 CU = 1 vCPU + 4 GB RAM**. RAM scales with vCPU size at a 4:1 ratio. For example, a 2 CU compute has 2 vCPU and 8 GB RAM.

How is compute usage measured in Neon?
: Compute usage is measured in **CU-hours**:  
 CU-hours = compute size (in CU) × hours running  
 Examples:  
 • 0.25 CU for 4 hours = 1 CU-hour  
 • 2 CU for 3 hours = 6 CU-hours  
 Your plan's compute price per CU-hour depends on whether you are on Launch or Scale. On the Free plan, you have 50 CU-hours/month included.

How is storage usage billed in Neon?
: Storage is billed based on actual usage, measured in **GB-months**:  
 1 GB-month = 1 GB stored for 1 month  
 Storage usage is metered hourly and summed over the month. For child branches, only the storage **delta** (changes from the parent branch) is billed. On the Free plan, you get 0.5 GB per project.

How do branches affect storage?
: Your root branch contains your main data. Child branches share data with the root until changes are made. Only the changed data (delta) is billed for child branches. Delta storage never decreases, so delete unused branches to control storage costs.

How is extra branch usage billed?
: Paid plans include a set number of branches per project. Additional branches are billed at **$1.50/branch-month**, prorated hourly (about $0.002/hour).  
 Example: If your plan includes 10 branches and you run 2 extra branches for 5 hours each, that's 10 branch-hours (~$0.02).

How are instant restores billed?
: Instant restore storage is billed based on the amount of change history retained, not the number of restores performed.  
 • Free: Up to 6 hours of history, capped at 1 GB of changes, no charge.  
 • Launch: Up to 7 days of history, billed at $0.20/GB-month.  
 • Scale: Up to 30 days of history, billed at $0.20/GB-month.  
 Change history is stored as Postgres WAL records.

Can I disable scale-to-zero?
: Free: No, it's always enabled (5 min idle timeout).  
 Launch: Yes, you can disable it.  
 Scale: Yes, fully configurable (5 seconds to always-on). Learn more: [Scale to zero](/docs/introduction/scale-to-zero)

What is autoscaling and how does it work?
: Autoscaling adjusts compute size based on load, between your set min/max limits. All plans support it, but maximum CU differs: Free up to 2 CU, Launch and Scale Scale up to 16 CU. Scale supports up to 56 CU for fixed-size computes. Learn more: [Autoscaling](/docs/introduction/autoscaling)

How are read replicas billed?
: Each read replica is its own compute and contributes to CU-hours.

Do public network transfer limits reset each month?
: Yes. Free plan includes 5 GB/month, Launch and Scale include 100 GB/month. Beyond that, it's $0.10/GB.

How is private network transfer billed?
: Only available on Scale: $0.01/GB, bidirectional, between Neon and private network services.

What happens if I exceed my Free plan limits?
: On the Free plan, compute will suspend when limits are reached (e.g., CU-hours or public network transfer). To continue, upgrade to a paid plan.

Do you charge for idle computes?
: If scale-to-zero is enabled, no. Computes that are suspended do not accrue CU-hours.

What is the difference between root and child branch storage billing?
: Root branches are billed for their full logical data size. Child branches are billed only for changes relative to their parent.

Can I get more than the listed project limit?
: Yes, on Scale you can request increases for projects beyond the listed limit.

Why is the monthly minimum the same for Launch and Scale?
: Both plans have a $5/month minimum, but Scale has a higher CU-hour rate. This keeps fixed costs low while letting usage-based charges reflect the higher availability, security, and features of Scale.

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
