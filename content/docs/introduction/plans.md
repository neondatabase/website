---
title: Neon plans
summary: >-
  Covers the comparison of Neon's Free, Launch, and Scale plans, detailing
  features, pricing, and target users to support projects from prototypes to
  production at scale.
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
  - /docs/introduction/legacy-plans
  - /docs/introduction/extra-usage
updatedOn: '2026-02-06T22:07:33.097Z'
---

Neon offers plans to support you at every stage—from your first prototype to production at scale.
Start for free, then **pay only for what you use** as your needs grow.

<Admonition type="note">
If you signed up with Neon through **Azure Marketplace**, see [Azure Marketplace](/docs/introduction/billing-azure-marketplace) for plan and billing information specific to Azure users.
</Admonition>

---

## Plan overview

Compare Neon's **Free**, **Launch**, and **Scale** plans.

<Admonition type="comingSoon" title="Building an agent platform?">
For AI agent platforms that provision thousands of databases, Neon offers an **Agent Plan** with custom resource limits and credits for **your** free tier. [Learn more](/docs/introduction/agent-plan)
</Admonition>

| Plan feature                                          | **Free**                     | **Launch**                           | **Scale**                                                                                         |
| ----------------------------------------------------- | ---------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------- |
| [Price](#price)                                       | $0/month                     | Pay for what you use                 | Pay for what you use                                                                              |
| [Who it's for](#who-its-for)                          | Prototypes and side projects | Startups and growing teams           | Production-grade workloads and larger companies                                                   |
| [Projects](#projects)                                 | 100                          | 100                                  | 1,000 (can be increased on request)                                                               |
| [Branches](#branches)                                 | 10/project                   | 10/project                           | 25/project                                                                                        |
| [Extra branches](#extra-branches)                     | —                            | $1.50/branch-month (prorated hourly) | $1.50/branch-month (prorated hourly)                                                              |
| [Compute](#compute)                                   | 100 CU-hours/project         | $0.106/CU-hour                       | $0.222/CU-hour                                                                                    |
| [Autoscaling](#autoscaling)                           | Up to 2 CU (8 GB RAM)        | Up to 16 CU (64 GB RAM)              | Up to 16 CU (fixed computes up to 56 CU / 224 GB RAM)                                             |
| [Scale to zero](#scale-to-zero)                       | After 5 min                  | After 5 min, can be disabled         | Configurable (1 minute to always on)                                                              |
| [Storage](#storage)                                   | 0.5 GB/project               | $0.35/GB-month                       | $0.35/GB-month                                                                                    |
| [Public network transfer](#public-network-transfer)   | 5 GB included                | 100 GB included, then $0.10/GB       | 100 GB included, then $0.10/GB                                                                    |
| [Monitoring](#monitoring)                             | 1 day                        | 3 days                               | 14 days                                                                                           |
| [Metrics/logs export](#metricslogs-export)            | —                            | —                                    | ✅                                                                                                |
| [Instant restore](#instant-restore)                   | —                            | $0.20/GB-month                       | $0.20/GB-month                                                                                    |
| [Restore window](#restore-window)                     | 6 hours, up to 1 GB-month    | Up to 7 days                         | Up to 30 days                                                                                     |
| [Snapshots](#snapshots)                               | 1 snapshot                   | 10 snapshots                         | 10 snapshots                                                                                      |
| [Auth](#auth)                                         | Up to 60k MAU                | Up to 1M MAU                         | Up to 1M MAU                                                                                      |
| [Private network transfer](#private-network-transfer) | —                            | —                                    | $0.01/GB                                                                                          |
| [Compliance and security](#compliance-and-security)   | —                            | Protected branches                   | SOC 2, ISO, GDPR, [HIPAA](/docs/security/hipaa), Protected branches, IP Allow, Private Networking |
| [Uptime SLA](#uptime-sla)                             | —                            | —                                    | ✅                                                                                                |
| [Support](#support)                                   | Community                    | Standard (billing issues only)       | Standard, Business, or Production                                                                 |

## Plan features

This section describes the features listed in the [Plan overview](#plan-overview) table.

<Admonition type="tip" title="Optimize your costs">
Learn how to manage your Neon costs effectively with our [cost optimization guide](/docs/introduction/cost-optimization), which covers strategies for compute, storage, branches, and data transfer.
</Admonition>

### Price

On **Launch** and **Scale** plans, you pay only for what you use — there's no minimum monthly fee. Usage for compute, storage, extra branches, and other features is billed at the published rates (see the [Plan overview](#plan-overview) table).

<Admonition type="note">
Invoices under $0.50 are not collected.
</Admonition>

On the **Free** plan, there is no monthly cost. You get usage allowances for projects, branches, compute, storage, and more — for $0/month.

### Who it's for

- **Free** — Prototypes, side projects, and quick experiments. Includes 100 projects, 100 CU-hours/project, 0.5 GB storage per branch, and 5 GB of egress. Upgrade if you need more resources or features.
- **Launch** — Startups and growing teams needing more resources, features, and flexibility. Pay only for what you use.
- **Scale** — Production-grade workloads and large teams. Higher limits, advanced features, full support, compliance, additional security, and SLAs. Pay only for what you use.

### Projects

A project is a container for your database environment. It includes your database, branches, compute resources, and more. Similar to a Git repository that contains code, artifacts, and branches, a project contains all your database resources. Learn more about [Neon's object hierarchy](/docs/manage/overview).

> For most use cases, create a project for each app or customer to isolate data and manage resources.

Included per plan:

- **Free**: 100 projects
- **Launch**: 100 projects
- **Scale**: 1,000 projects (soft limit — request more if needed via [support](/docs/introduction/support))

### Branches

Each Neon project is created with a [root branch](/docs/reference/glossary#root-branch), like the `main` branch in Git.  
Postgres objects — databases, schemas, tables, records, indexes, roles — are created on a branch.

You can create [child branches](/docs/reference/glossary#child-branch) for testing, previews, or development.

Included per plan:

- **Free**: 10 branches/project
- **Launch**: 10 branches/project
- **Scale**: 25 branches/project

See [Extra branches](#extra-branches) for overage costs and [Storage](#storage) for how branch storage is billed.

> Projects can have multiple root branches, with limits based on your plan. See [Branch types: Root branch](/docs/manage/branches#root-branch) for details.

### Extra branches

On paid plans, you can create extra child branches. Extra branches beyond your plan's branch allowance (outlined [above](#-branches)) are billed in **branch-months**, metered hourly.

1 extra branch × 1 month = 1 branch-month

Cost: **$1.50/branch-month** (~$0.002/hour).

Example: The Launch plan includes 10 branches/project. You create 2 extra branches for 5 hours each → 10 extra branch-hours × $0.002/hour = ~$0.20 total.

> Extra branches are not available on the Free plan. Delete branches or upgrade if you need more.

The maximum number of branches you can have per project:

- **Launch**: 5,000 branches/project
- **Scale**: 5,000 branches/project

If you need more, contact [Sales](/contact-sales).

### Compute

Compute usage depends on compute size and runtime.

- Measured in **CU-hours** (Compute Unit hours)
- Each Compute Unit (CU) allocates approximately 4 GB of RAM, along with associated CPU and local SSD resources
- Compute sizes up to 56 CU (plan-dependent)

| Compute Unit | RAM    |
| ------------ | ------ |
| .25          | 1 GB   |
| .5           | 2 GB   |
| 1            | 4 GB   |
| 2            | 8 GB   |
| 3            | 12 GB  |
| ...          | ...    |
| 56           | 224 GB |

Formula:

```
compute size × hours running = CU-hours
```

Examples:

- 0.25 CU for 4 hours = 1 CU-hour
- 2 CU for 3 hours = 6 CU-hours
- 8 CU for 2 hours = 16 CU-hours

**Free**: 100 CU-hours/project/month (enough to run a 0.25 CU compute in a project for 400 hours/month).  
**Launch**: $0.106/CU-hour  
**Scale**: $0.222/CU-hour

> All computes in your project count toward usage. Each branch has a read-write compute by default; [read replicas](/docs/reference/glossary#read-replica) add read-only computes.

#### Compute with autoscaling

Autoscaling changes compute size between a defined min and max. Estimate usage as:

```
average compute size × hours running = CU-hours
```

#### Compute with scale to zero

Scale to zero suspends computes after inactivity to compute usage and cost.

### Autoscaling

Adjusts compute size between defined limits based on demand.

- **Free**: Up to 2 CU (8 GB RAM)
- **Launch**: Up to 16 CU (64 GB RAM)
- **Scale**: Up to 16 CU for autoscaling; fixed sizes up to 56 CU (224 GB RAM)

> Autoscaling is capped at 16 CU. Scale supports fixed computes above 16 CU.

### Scale to zero

Suspends computes after inactivity.

- **Free**: 5 min inactivity — cannot disable
- **Launch**: 5 min inactivity — can disable
- **Scale**: Fully configurable — 1 minute to always on

### Storage

Storage is your data size, billed on actual usage in **GB-months**, measured hourly.

- **Launch**/**Scale plan storage cost**: $0.35/GB-month
- **[Root branches](/docs/reference/glossary#root-branch)**: billed on actual data size (_logical data size_)
- **[Child branches](/docs/reference/glossary#child-branch)**: billed on the minimum of the data changes since creation or the logical data size

When a child branch is created, it initially consumes no storage. As you make changes (inserts, updates, or deletes) to the child branch, a delta is recorded from the point of branch creation. This delta, a log of all write operations, grows over time and counts toward your storage usage.

Importantly, **child branch storage is capped at your actual data size**: you're billed for the minimum of accumulated changes or logical data size, whichever is lower.

<Admonition type="important" title="Manage child branches to control storage costs">

Even though child branch storage is capped at your logical data size, it's still important to manage branches effectively to minimize storage costs:

- Set a [time to live](/docs/guides/branch-expiration) on development and preview branches
- Delete child branches when they're no longer needed
- For production workloads, use a [root branch](/docs/manage/branches#root-branch) instead — root branches are billed on your actual data size with no delta tracking overhead.

</Admonition>

> **Free** plan users get 0.5 GB of storage per project

**Storage per branch:**

Paid plans (Launch and Scale) support a logical data size of up to **16 TB per branch**. To increase this limit, [contact Sales](/contact-sales).

### Public network transfer

Public network transfer (egress) is the total volume of data sent from your databases over the public internet during the monthly billing period.

> Public network transfer includes data sent via [logical replication](/docs/reference/glossary#logical-replication) to any destination, including other Neon databases.

Allowances per plan:

- **Free**: 5 GB/month
- **Launch**: 100 GB/month, then $0.10/GB
- **Scale**: 100 GB/month, then $0.10/GB

### Monitoring

View metrics such as RAM, CPU, connections, and database size in the **Monitoring** dashboard in the Neon Console.

Retention of metrics data differs by plan:

- **Free**: 1 day
- **Launch**: 3 days
- **Scale**: 14 days

See [Monitoring dashboard](/docs/introduction/monitoring-page) for details.

### Metrics/logs export

Export metrics and Postgres logs to [Datadog](/docs/guides/datadog) or any [OTel-compatible platform](/docs/guides/opentelemetry).  
Available only on the **Scale** plan.

### Instant restore

Neon stores a change history to support point-in-time restore (instant restore). You can only point-in-time restore from **root branches**, so PITR storage is charged only for root branches. Child branches do not add to this charge.

- **Free**: No charge, 6-hour limit, capped at 1 GB of change history
- **Launch**: Up to 7 days, billed at $0.20/GB-month
- **Scale**: Up to 30 days, billed at $0.20/GB-month

You can change your [restore window](#restore-window) to control how much change history you retain. See [Instant restore](/docs/introduction/branch-restore) for details.

> The change history is a log of write operations in the form of Postgres [Write-Ahead Logs](/docs/reference/glossary#write-ahead-logging-wal).

### Restore window

How far back you can restore data.

The maximum restore window per plan:

- **Free**: No charge, 6-hour limit, capped at 1 GB-month of changes
- **Launch**: Up to 7 days
- **Scale**: Up to 30 days

> The restore window defaults are 6 hours for Free plan projects and 1 day for paid plan projects.

The restore window is configurable. Shortening it can reduce [instant restore](#instant-restore) storage costs but limits how far back you can restore. See [Restore window](/docs/introduction/restore-window) for configuration details and more information.

### Snapshots

Snapshots capture the state of your branch at a point in time. You can create snapshots manually or schedule automated backups.

Snapshot limits per plan:

- **Free**: 1 snapshot
- **Launch**: 10 snapshots
- **Scale**: 10 snapshots

**Pricing**: Snapshots are provided free of charge during beta, and will be charged based on GB-month storage at a rate lower than standard project storage after GA.

Automated backup schedules are available on paid plans except for the Agent plan. See [Backup & restore](/docs/guides/backup-restore) for details.

### Auth

Neon Auth is a managed authentication service built on [Better Auth](https://www.better-auth.com/), fully integrated into the Neon platform.

Monthly Active User (MAU) limits per plan:

- **Free**: Up to 60,000 MAU
- **Launch**: Up to 1M MAU (contact [Sales](/contact-sales) if you need more)
- **Scale**: Up to 1M MAU (contact [Sales](/contact-sales) if you need more)

> An MAU (Monthly Active User) is a unique user who authenticates at least once during a monthly billing period.

See [Neon Auth](/docs/auth/overview) for more information.

### Private network transfer

Bi-directional data transfer to and from your databases over private networking.

Private networking is available on the **Scale** plan. It uses [AWS PrivateLink](https://docs.aws.amazon.com/vpc/latest/privatelink/concepts.html) to bypass the public internet.

Billed at $0.01/GB for network transferred to and from Neon. You'll only see this on your bill if you enable this feature.

### Compliance and security

Compliance certifications available on **Scale**:

- SOC 2
- SOC 3
- ISO 27001
- ISO 27701
- GDPR
- CCPA
- HIPAA ([additional charge](/docs/security/hipaa))

Security features:

- [Protected branches](/docs/guides/protected-branches) — safeguards for critical data (available on **Launch** and **Scale**)
- [IP Allow](/docs/introduction/ip-allow) — restricts access to trusted IPs (available on **Scale**)
- [Private Networking](/docs/guides/neon-private-networking) — secure private connections via AWS PrivateLink (available on **Scale**)

### Uptime SLA

Guaranteed service availability is offered on the **Scale** plan. Contact [Sales](/contact-sales) for details.

### Support

Support level by plan:

- **Free**: Community support
- **Launch**: Standard support (billing issues only)
- **Scale**: Standard support, with Business or Production support plans available for an additional fee

See [Support](/docs/introduction/support) for details.

## Usage metrics

The Neon Console displays usage in a simplified view on the [Projects page](https://console.neon.tech/app/), while your invoice shows a detailed breakdown.

![Usage metrics on the Projects page in the Neon Console](/docs/introduction/usage_metrics_console.png)

Use the table below to understand how Console metrics map to invoice line items.

| Console metric       | Invoice line item(s)                                                                                                              |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Compute**          | Compute, CU-hour                                                                                                                  |
| **Storage**          | Storage (root branches), GB-month <br/> Storage (child branches), GB-month                                                        |
| **History**          | Instant restore storage, GB-month                                                                                                 |
| **Network transfer** | Public network transfer <br/> Private network transfer (if [Private Networking](/docs/guides/neon-private-networking) is enabled) |
| —                    | Extra branches, branch-month                                                                                                      |

<Admonition type="note">
**Extra branches** does not appear in the Console usage summary but will appear on your invoice if you exceed your plan's branch allowance.
</Admonition>

### Invoice metrics

The following metrics may appear on your Neon invoice. Each metric represents a specific type of usage that contributes to your monthly bill.

| **Metric**                             | **Description**                                                                                                                                                           |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Compute, CU-hour**                   | Total compute usage in **CU-hours** (Compute Unit hours). [Learn more](/docs/introduction/plans#compute).                                                                 |
| **Extra branches, branch-month**       | Number of extra branches beyond your plan allowance, metered hourly. [Learn more](/docs/introduction/plans#extra-branches).                                               |
| **Instant restore storage, GB-month**  | Storage used for **instant restore**, billed per GB-month. [Learn more](/docs/introduction/plans#instant-restore).                                                        |
| **Storage (root branches), GB-month**  | Data storage for root branches, billed per GB-month. [Learn more](/docs/introduction/plans#storage).                                                                      |
| **Storage (child branches), GB-month** | Data storage for child branches (minimum of delta or logical size), billed per GB-month. [Learn more](/docs/introduction/plans#storage).                                  |
| **Public network transfer**            | Outbound data transfer (egress) from your databases to the public internet. [Learn more](/docs/introduction/plans#public-network-transfer).                               |
| **Private network transfer**           | Bi-directional data transfer to and from your databases over private networking (e.g., AWS PrivateLink). [Learn more](/docs/introduction/plans#private-network-transfer). |

## Usage-based cost examples

The following examples show what your monthly bill might look like on the **Launch** and **Scale** plans at different levels of usage. Each example includes compute, storage (root and child branches), and instant restore history. Your actual costs will depend on your specific workload, usage patterns, and configuration.

> **Note:** The "billable days" shown below refer to **active compute time** — the total hours your compute is actively running in a month. Computes can scale to zero when idle, so you may accumulate these hours in shorter periods of usage throughout the month rather than running continuously.

### Launch plan

- **Example 1 (light usage)**
  - Compute: ~10 CU-hours = 1 CU × 10 hours — **$1.06**  
    _(10 CU-hours × $0.106/CU-hour)_
  - Root branch storage: 2 GB — **$0.70**  
    _(2 GB × $0.35/GB-month)_
  - Child branch storage: 1 GB — **$0.35**  
    _(1 GB × $0.35/GB-month)_
  - Instant restore history: 1 GB — **$0.20**  
    _(1 GB × $0.20/GB-month)_

    **Amount due:** **$2.31**

- **Example 2**
  - Compute: ~120 CU-hours = 1 CU × 120 hours (about 5 billable days) — **$12.72**  
    _(120 CU-hours × $0.106/CU-hour)_
  - Root branch storage: 20 GB — **$7.00**  
    _(20 GB × $0.35/GB-month)_
  - Child branch storage: 5 GB — **$1.75**  
    _(5 GB × $0.35/GB-month)_
  - Instant restore history: 10 GB — **$2.00**  
    _(10 GB × $0.20/GB-month)_

    **Amount due:** **$23.47**

- **Example 3**
  - Compute: ~250 CU-hours = 2 CU × 125 hours (about 5.2 billable days) — **$26.50**  
    _(250 CU-hours × $0.106/CU-hour)_
  - Root branch storage: 40 GB — **$14.00**  
    _(40 GB × $0.35/GB-month)_
  - Child branch storage: 10 GB — **$3.50**  
    _(10 GB × $0.35/GB-month)_
  - Instant restore history: 20 GB — **$4.00**  
    _(20 GB × $0.20/GB-month)_

    **Amount due:** **$48.00**

---

### Scale plan

- **Example 1**
  - Compute: ~1,700 CU-hours = 4 CU × 425 hours (about 17.7 billable days) — **$377.40**  
    _(1,700 CU-hours × $0.222/CU-hour)_
  - Root branch storage: 100 GB — **$35.00**  
    _(100 GB × $0.35/GB-month)_
  - Child branch storage: 25 GB — **$8.75**  
    _(25 GB × $0.35/GB-month)_
  - Instant restore history: 50 GB — **$10.00**  
    _(50 GB × $0.20/GB-month)_

    **Amount due:** **$431.15**

- **Example 2**
  - Compute: ~2,600 CU-hours = 8 CU × 325 hours (about 13.5 billable days) — **$577.20**  
    _(2,600 CU-hours × $0.222/CU-hour)_
  - Root branch storage: 150 GB — **$52.50**  
    _(150 GB × $0.35/GB-month)_
  - Child branch storage: 40 GB — **$14.00**  
    _(40 GB × $0.35/GB-month)_
  - Instant restore history: 75 GB — **$15.00**  
    _(75 GB × $0.20/GB-month)_

    **Amount due:** **$658.70**

## FAQs

<DefinitionList>

What is a CU?
: A CU (Compute Unit) is Neon's measure of compute size. Each CU allocates approximately 4 GB of RAM to the database instance, along with associated CPU and local SSD resources. Scaling up increases these resources linearly. For example, a 2 CU compute has 8 GB RAM.

How is compute usage measured in Neon?
: Compute usage is measured in **CU-hours**:  
 CU-hours = compute size (in CU) × hours running  
 Examples:  
 • 0.25 CU for 4 hours = 1 CU-hour  
 • 2 CU for 3 hours = 6 CU-hours  
 Your plan's compute price per CU-hour depends on whether you are on Launch or Scale. On the Free plan, you have 100 CU-hours/month included.

How is storage usage billed in Neon?
: Storage is billed based on actual usage, measured in **GB-months**:  
 1 GB-month = 1 GB stored for 1 month  
 Storage usage is metered hourly and summed over the month. For child branches, you're billed for the minimum of accumulated changes or logical data size — capped at your actual data size. On the Free plan, you get 0.5 GB per project.

How do branches affect storage?
: Your root branch contains your main data. Child branches share data with the root until changes are made. Child branches are billed for the minimum of accumulated changes or logical data size — you never pay more than your actual data size. Delete unused branches to control storage costs.

How is extra branch usage billed?
: Paid plans include a set number of branches per project. Additional branches are billed at **$1.50/branch-month**, prorated hourly (about $0.002/hour).  
 Example: If your plan includes 10 branches and you run 2 extra branches for 5 hours each, that's 10 branch-hours (~$0.02).

How are instant restores billed?
: Neon charges for PITR (point-in-time restore) storage only for branches you can point-in-time restore from: root branches. The charge is based on the amount of change history retained on those branches, not the number of restores you perform. Child branches do not add to PITR storage charges.  
 • Free: Up to 6 hours of history, capped at 1 GB of changes, no charge.  
 • Launch: Up to 7 days of history, billed at $0.20/GB-month.  
 • Scale: Up to 30 days of history, billed at $0.20/GB-month.  
 Change history is stored as Postgres WAL records.

Is instant restore history accumulated at the project or branch level?
: You can only point-in-time restore from root branches, so only root branches contribute to your billed PITR storage. You set a single restore window (e.g., 7 days or 30 days) for the entire project. You cannot enable, disable, or configure the restore window per branch.

Can I disable scale-to-zero?
: Free: No, it's always enabled (5 min idle timeout).  
 Launch: Yes, you can disable it.  
 Scale: Yes, fully configurable (1 minute to always-on). Learn more: [Scale to zero](/docs/introduction/scale-to-zero)

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
: Root branches are billed for their full logical data size. Child branches are billed for the minimum of accumulated changes since creation or logical data size — ensuring you never pay more than your actual data size.

Can I get more than the listed project limit?
: Yes, on Scale you can request increases for projects beyond the listed limit.

Why is the compute rate higher on Scale than Launch?
: Scale includes higher availability, advanced security features, compliance certifications, and SLAs. The higher CU-hour rate reflects these additional capabilities.

How can I control my costs?
: • Set a maximum autoscaling limit to cap compute size.  
 • Enable scale-to-zero for idle databases.  
 • Delete unused branches to reduce storage costs.  
 • Shorten your restore window to reduce instant restore storage.  
 For more detailed strategies, see our [Cost optimization](/docs/introduction/cost-optimization) guide.

Do you offer credits for startups?
: Yes, venture-backed startups may apply for the Neon Startup Program. Learn more: [Startup Program](/startup)

How is storage charged for snapshots?
: Snapshots are currently free during beta and will be charged based on GB-month storage at a rate lower than standard project storage after general availability.

Is storage cost different for archived branches?
: No. Archived branches are billed at the same rate as active branches. Neon automatically archives inactive branches to optimize storage resources and maintain a cost-efficient storage infrastructure. See [Branch archiving](/docs/guides/branch-archiving) for details on how archiving works.

</DefinitionList>

<NeedHelp/>
