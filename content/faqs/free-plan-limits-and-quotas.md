---
title: "What are the limits and quotas for Neon's Free plan?"
subtitle: '100 projects, 10 branches each, 100 CU-hours per project, and 0.5 GB storage per project.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-05-20T14:13:43.586Z'
isDraft: false
redirectFrom: []
---

The Neon Free plan costs $0/month and includes 100 projects, 10 branches per project, 100 CU-hours of compute per project per month, 0.5 GB of storage per project, and 5 GB of public network transfer per project per month. Computes scale to zero after 5 minutes of inactivity and can scale up to 2 CU (≈8 GB RAM) when active. See the [Plans page](/docs/introduction/plans) for the full table.

## What's included

| Resource                | Free plan allowance                             |
| ----------------------- | ----------------------------------------------- |
| Projects                | 100                                             |
| Branches                | 10 per project                                  |
| Compute                 | 100 CU-hours per project per month              |
| Autoscaling             | Up to 2 CU (≈8 GB RAM)                          |
| Scale to zero           | After 5 min inactivity, cannot be disabled      |
| Storage                 | 0.5 GB per project                              |
| Public network transfer | 5 GB per project per month                      |
| Instant restore history | 6 hours, capped at 1 GB-month of change history |
| Manual snapshots        | 1                                               |
| Neon Auth               | Up to 60,000 MAU                                |
| Monitoring history      | 1 day                                           |
| Support                 | Community                                       |

100 CU-hours is enough to run a 0.25 CU (≈1 GB RAM) compute for about 400 hours per project per month. Compute quotas are measured per project, so 100 projects each get their own 100 CU-hour bucket.

## What resets monthly

Compute (CU-hours) and public network transfer reset at the start of each monthly billing period. Storage, branch count, and project count are point-in-time limits: they apply continuously, not by month.

## What happens when you hit a limit

- **CU-hours used up**: the project's compute is suspended until the next billing period or until you upgrade. Existing connections drop and new ones can't open.
- **Network transfer exhausted**: same behavior. Compute suspends.
- **Storage above 0.5 GB**: the project is suspended rather than billed. Delete data or upgrade to continue writing.
- **Branch count at 10**: branch creation fails until you delete one or upgrade.

Suspension doesn't delete data. The project resumes when the next monthly window opens or you move to a paid plan.

<Admonition type="note" title="Storage is not free when idle">
Compute drops to zero CU when suspended, so you don't pay for compute while idle. Storage stays allocated, however. On Free, that storage is included up to the 0.5 GB cap. On paid plans, storage is billed continuously at $0.35/GB-month whether the compute is running or not.
</Admonition>

## When to consider Launch

The Launch plan starts at pay-for-what-you-use pricing ($0.106 per CU-hour, $0.35 per GB-month) and lifts most of the Free caps: autoscaling up to 16 CU, history window up to 7 days, 100 manual snapshots, scale-to-zero can be disabled, and protected branches. For an example bill, see [Usage-based cost examples](/docs/introduction/plans#usage-based-cost-examples) on the Plans page.

<CTA title="See the full plan comparison" description="Compare Free, Launch, and Scale across compute, storage, branching, history, and support." buttonText="View plans" buttonUrl="/docs/introduction/plans" />
