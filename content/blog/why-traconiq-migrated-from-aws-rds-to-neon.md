---
title: Why traconiq Migrated Their Multi-TB Telemetry Dataset to Neon
description: 'As RDS costs grew, traconiq turned to Neon to scale efficiently'
excerpt: >-
  “Our workload ingests hundreds of data points per second and our RDS costs
  were increasing, especially since we had multiple regions and environments.
  With Neon, we found a way to scale our setup more efficiently, using branching
  instead of duplicating instances and autoscaling t...
date: '2025-07-01T16:21:46'
updatedOn: '2025-07-03T16:10:31'
category: case-study
categories:
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/why-traconiq-migrated-from-aws-rds-to-neon/cover.jpg
  alt: null
isFeatured: true
seo:
  title: Why traconiq Migrated Their Multi-TB Telemetry Dataset to Neon - Neon
  description: >-
    As AWS RDS costs grew, traconiq migrated to Neon to scale efficiently,
    taking advantage of branching and autoscaling.
  keywords: []
  noindex: false
  ogTitle: Why traconiq Migrated Their Multi-TB Telemetry Dataset to Neon - Neon
  ogDescription: >-
    As AWS RDS costs grew, traconiq migrated to Neon to scale efficiently,
    taking advantage of branching and autoscaling.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/why-traconiq-migrated-from-aws-rds-to-neon/social.jpg
source:
  wpId: 10199
  wpSlug: why-traconiq-migrated-from-aws-rds-to-neon
  exportedAt: '2026-03-20T13:31:00.745Z'
---

> **“Our workload ingests hundreds of data points per second and our RDS costs were increasing, especially since we had multiple regions and environments. With Neon, we found a way to scale our setup more efficiently, using branching instead of duplicating instances and autoscaling to match our actual load.”** (Thorsten Rieß, Software Architect at [traconiq](https://traconiq.ch/))

[traconiq](https://traconiq.ch/) (previously Kyburz) helps logistics companies manage complex vehicle fleets, from delivery scooters to long-haul trucks, by combining real-time telemetry with administrative tooling. In database-land, this means handling a continuous stream of position and engine data across thousands of vehicles, ingesting hundreds of records per second, and storing several terabytes of Postgres data at any given time.

For years, their infrastructure ran on Amazon RDS. But as the deployment grew, so did the problems.

## The RDS Hidden Costs Spiral

RDS’s unit prices for storage and compute are affordable, and indeed for some workloads (a small dataset, a single instance) RDS can stay quite economical. But for large deployments, RDS hides a cost spiral that only reveals itself at scale.

traconiq experienced this firsthand. At first, their fleet management system ran somewhat comfortably, but over time, RDS started to become a bottleneck, operationally and financially.

### More and more RDS instances are required

traconiq, like most companies, operates in multiple regions, with production and development environments in each. In RDS, that meant four separate instances, each sized for multi-terabyte storage and high-ingestion traffic. Each instance literally multiplies costs.

### Storage volumes only grow in RDS

This is fine print of RDS “scalability” that many teams miss. **Once you scale a storage volume up, you can’t scale it down.** This makes storage optimization efforts pointless from a cost perspective. Even though traconiq moved cold data to S3 after three months, RDS volumes didn’t shrink, and the costs didn’t either.

### Compute stays static, even when traffic doesn’t

Like most workloads, traconiq’s database load is not completely static but follows cycles. Their telemetry loads tend to spike during the day and drop off at night. RDS doesn’t care about this though – compute capacity had to be provisioned for peak traffic, and paid for 24/7.

### Snapshots are the only viable backup, but they’re costly

> **“In RDS, there’s no realistic backup strategy at that scale besides snapshots. But they’re expensive, and restoring still takes a long time”** (Thorsten Rieß, Software Architect at [traconiq](https://traconiq.ch/))

For databases of this size, full backups and restores aren’t practical. That leaves snapshots as the only realistic backup strategy in RDS, but they come at a cost. Multi-terabyte snapshots taken monthly have a significant cost… And restoring from them would still be slow.

## Moving to Neon

[Neon](https://neon.tech/home) is a fully managed Postgres platform with a modern architecture built to solve the scaling and cost issues teams often encounter with Amazon RDS.

It [separates storage and compute](https://neon.tech/docs/introduction/serverless), allowing developers to create [branches](https://neon.tech/docs/introduction/branching) – copy-on-write clones of a database that don’t duplicate storage and can be created or reset in seconds. Each branch has its own compute layer, which can be autoscaled independently based on workload.

This design lets you:

- [Replace heavyweight environments with lightweight branches](https://neon.tech/use-cases/dev-test)
- [Autoscale compute instead of provisioning for peak usage](https://neon.tech/use-cases/serverless-apps)
- Pay for actual usage, not for pre-allocated capacity
- [Restore instantly from any point](https://neon.tech/docs/introduction/branch-restore#how-instant-restore-works) using branches as the underlying primitive

For traconiq, adopting Neon meant a complete makeover for their infrastructure:

- Branching eliminated the need for separate RDS instances across regions and environments
- Autoscaling ensured compute scaled with actual ingestion patterns
- Branch-based recovery meant that restoring from historical states was finally fast and practical

## Inside traconiq’s Neon Architecture: Projects And Branches

Instead of maintaining and paying for multiple full-blown RDS instances, traconiq now runs a leaner setup in Neon, which at a high level looks like this:

- One Neon project per region (i.e. Europe and Australia)
- Each project contains
  - A main production branch
  - A development branch derived directly from production

To test their setup reliably, traconiq needs their dev environments to mirror production, not just the schema, but also the full data volume. That meant dev instances in RDS needed multi-TB storage volumes too. With Neon, this is no longer a problem:

- Branches don’t duplicate storage, thanks to [Neon’s copy-on-write architecture](https://neon.tech/blog/instantly-copy-tb-size-datasets-the-magic-of-copy-on-write)
- Dev environments can be synced with production in one click
- Compute scales to zero when dev branches are idle

All production branches run with [autoscaling](https://neon.tech/docs/introduction/autoscaling) enabled, which allows traconiq to accommodate daytime ingestion spikes of over 100 records per second, and at the same time, scale down automatically during quiet nighttime hours to save compute costs.

<Admonition type="info">
On top of this main workload, traconiq also migrated a geo lookup service based on OpenStreetMap and [PostGIS](https://neon.tech/docs/extensions/postgis). To maximize parallelism and response times, they created multiple Neon branches of the same dataset and run them concurrently, something that would have been cost-prohibitive to replicate in RDS.
</Admonition>

## Final Thoughts

traconiq’s story isn’t unusual. Serverfull Postgres services can get expensive (and inflexible) as real-world production deployments, with multiple instances and TB-size datasets, keep scaling.

If your team is running into the same walls with RDS, we’d love to help. [Book a meeting with our team](https://neon.com/contact-sales) **to see how Neon can simplify your Postgres infra.**

---

_A big thank you to [traconiq](https://traconiq.ch/) for sharing their story and for trusting Neon_.<br />
