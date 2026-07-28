---
title: Escaping the AWS RDS Cost Spiral
description: 'RDS starts cheap, but its rigid architecture drives up costs at scale'
excerpt: >-
  If you look at RDS pricing, everything looks quite affordable (storage,
  compute, backups) – so how are so many teams spending six figures on it? Usage
  is part of the story, of course, but those bills are also very inflated. At
  scale, there’s more going on. Scaling a database does...
date: '2025-05-23T18:16:19'
updatedOn: '2025-07-01T18:35:33'
category: postgres
categories:
  - postgres
  - product
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/escaping-the-aws-rds-cost-spiral-a-better-way-to-scale-postgres/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Escaping the AWS RDS Cost Spiral - Neon
  description: >-
    As you scale, RDS starts getting expensive - not because of unit prices but
    because of architectural traps most teams don’t see coming.
  keywords: []
  noindex: false
  ogTitle: Escaping the AWS RDS Cost Spiral - Neon
  ogDescription: >-
    As you scale, RDS starts getting expensive - not because of unit prices but
    because of architectural traps most teams don’t see coming.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/escaping-the-aws-rds-cost-spiral-a-better-way-to-scale-postgres/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/escaping-the-aws-rds-cost-spiral-a-better-way-to-scale-postgres/neon-cost-spiral-1024x576-815e734b.jpg)

If you look at RDS pricing, everything looks quite affordable (storage, compute, backups) – so how are so many teams [spending six figures on it](https://www.reddit.com/r/devops/comments/1gyjwoj/postgres_rds_is_too_expensive/)? Usage is part of the story, of course, but those bills are also very inflated. At scale, there’s more going on. Scaling a database doesn’t just mean more usage, it also means more regions, more environments, stricter recovery policies. That’s when costs really start climbing in AWS.

RDS’s rigid architecture locks you into structural patterns that quietly inflate your bill as you grow.

## The 4 Forces Behind the AWS RDS Cost Spiral

The true cost of RDS reveals itself not in pricing tables, but in how its architecture behaves at scale. Here are four common patterns we’ve seen inflate bills of otherwise well-designed systems.

### Every environment becomes a full-blown instance

Most teams don’t just have one production database. They also run staging, development, region-specific mirrors. In RDS, each environment requires a completely separate instance: separate compute, separate storage, separate snapshots. Teams pay for all those environments in full. Add terabytes of data, and the costs multiply fast.

<blockquote>
<p><strong>“We need multi-terabyte dev environments to mirror prod. In RDS, that means duplicating storage, and the costs are ridiculous.”</strong><em> </em><br></br><br></br><em>Engineer at a logistics company. Migrated TB-size workload from RDS to Neon</em></p>
</blockquote>

### Storage volumes only go up

In RDS, you have to provision storage in advance. You can scale a volume up once every six hours if you need more space. And here’s the catch – RDS doesn’t let you shrink a storage volume once it’s been scaled. Even if you move cold data to S3, the EBS volume stays large, and you keep paying for the peak. The result for most teams is half-empty, multi-terabyte storage volumes on their bill.

### Compute is provisioned for peak and paid for 24/7

Another consequence of RDS’s rigid architecture is that you have to provision fixed compute capacity. **But your traffic likely isn’t constant (it rarely is).** Most real-world systems follow usage patterns – daytime spikes, nighttime lulls, weekend dips. RDS doesn’t account for that. You pick an instance size big enough to handle your peak load, and that’s what you pay for. This also applies to non-prod environments that may only be used for a few hours each day. The meter keeps running.

### Snapshots are the only realistic backup, but they’re costly (and slow)

Once your Postgres instance in RDS reaches a certain size, full logical backups become impractical. It’d be too slow to recover from them, the downtime would be many hours or even days. That leaves snapshots as the only viable recovery option for instances at scale, but RDS snapshots come with a cost. You pay to store them, you pay to retain them… And restoring from them is still anything but fast (it can still take hours to restore from a multi-TB snapshot).

<blockquote>
<p><strong>“We kept snapshots just in case in RDS, but knew we’d lose hours restoring from them”</strong></p>
</blockquote>

## A Better Architecture for Scaling Postgres

When storage and compute are tightly coupled, when environments are full instance clones, and when scaling is manual, costs naturally spiral as you scale – there’s no other way around it. [Neon](https://neon.tech/home) was built to break this pattern.

If you’re new here: Neon is a [serverless Postgres platform](https://neon.tech/docs/get-started-with-neon/why-neon) built to fix all the inefficiencies of traditional managed databases. By [separating storage and compute](https://neon.tech/docs/introduction/architecture-overview) and implementing an innovative storage design with [copy-on-write branching](https://neon.tech/blog/instantly-copy-tb-size-datasets-the-magic-of-copy-on-write), Neon enables a more flexible and efficient way to manage Postgres at scale.

### Create branches instead of full instances

_**No more duplicating multi-terabyte volumes just to test a migration.**_

Neon lets you spin up [copy-on-write branches](https://neon.tech/flow) of your database in a second, even if you’re working with tens of terabytes. Branches act like fully isolated environments that don’t duplicate storage and reflect their parent perfectly, but they have their own compute endpoint to avoid interfering with production in any way. Whether you need a dev environment, a test sandbox, or a point-in-time clone, you can spin up a branch. They’re instant and lightweight, and can also be handled programmatically via CI/CD or API.

### Autoscale compute and storage

_**You only pay for the compute and storage that your databases actually use.**_

[Neon automatically scales compute up or down based on workload](https://neon.tech/use-cases/serverless-apps). If a dev database is not being used, it scales to zero. When demand spikes in production, it scales up in real time, both connections and throughput. Storage also scales dynamically, up or down, with no manual provisioning required. There’s no need to pick an instance size or preallocate storage. Usage drives cost directly, not guesses about peak traffic.

### Restore from any point in time in seconds

_**Restores become economical, fast at scale, and testable.**_

Neon implements [point-in-time restore (PITR](https://neon.tech/blog/recover-large-postgres-databases)) as a native part of its branching model. You can restore from any historical point instantly (no matter how large your database is) by creating a branch from that point. You can query that branch directly, test migrations against it, or promote it to production. This model avoids the operational and cost overhead of traditional snapshot-based recovery.

## Summary: How Neon Breaks the AWS RDS Cost Spiral

**Via branches,**

- There’s no need to provision full-size instances for staging or QA
- Shared, copy-on-write storage makes dev environments affordable, even at TB scale

**Via autoscaling,**

- Compute costs shrink during off-hours, weekends, or idle dev time
- There’s no getting stuck in large storage volumes that cannot be resized down

**With instant restores built on branching**,

- There’s no need to retain and store large, infrequent RDS snapshots
- Inspecting or debugging historical data becomes fast and inexpensive

| Cost driver                     | AWS RDS                                                  | Neon                                                             |
| ------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------- |
| **Multiple environments**       | Requires full-size instances per env (compute + storage) | Lightweight branches reuse storage, created instantly            |
| **Storage growth**              | Volumes only grow, can’t shrink after scaling            | Storage scales up and down automatically                         |
| **Idle compute**                | Compute is always-on, even when traffic drops            | Compute autoscales and scales to zero when idle                  |
| **Dev/prod parity**             | Duplicating large datasets for dev is costly             | Dev branches match prod instantly, no extra storage cost         |
| **Backup and recovery**         | Snapshots are expensive and slow to restore              | Branches enable instant recovery at any point in time            |
| **Inspecting historical data**  | Requires restoring and provisioning a new instance       | Just branch from a timestamp and query directly                  |
| **Overprovisioning for spikes** | Must provision for peak load, pay for it 24/7            | Compute scales up and down with demand, no need to overprovision |

## If You’re Running Into These Walls…

You’re not alone. Neon offers a modern alternative for scaling Postgres without the architectural baggage that translates not only in a cost spiral but also on a degraded developer experience. [Start a free Neon project](https://neon.tech/) to get a feel for the platform, or [book a call with our team](https://neon.tech/contact-sales) to see if we can help reduce your AWS RDS bill.
