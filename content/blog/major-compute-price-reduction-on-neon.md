---
title: Major compute price reduction on Neon
description: Reducing cost of compute by 25% as we scale on Databricks
excerpt: >-
  Databases are often one of the biggest infrastructure expenses for any
  company. From day one, Neon’s mission has been to make databases radically
  more efficient through separation of storage and compute, allowing instant
  autoscaling and better unit economics. Now, with Neon runni...
date: '2025-11-03T19:23:07'
updatedOn: '2025-11-04T19:52:12'
category: company
categories:
  - company
authors:
  - nikita-shamgunov
cover:
  image: null
  alt: null
isFeatured: false
seo:
  title: Major compute price reduction on Neon - Neon
  description: >-
    With Neon running on Databricks’ global infrastructure, we’ve taken another
    major step forward: compute on Neon is now up to 25% cheaper across all paid
    plans.
  keywords: []
  noindex: false
  ogTitle: Major compute price reduction on Neon - Neon
  ogDescription: >-
    With Neon running on Databricks’ global infrastructure, we’ve taken another
    major step forward: compute on Neon is now up to 25% cheaper across all paid
    plans.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/major-compute-price-reduction-on-neon/social.jpg
source:
  wpId: 11401
  wpSlug: major-compute-price-reduction-on-neon
  exportedAt: '2026-03-20T13:31:00.745Z'
---

Databases are often one of the biggest infrastructure expenses for any company. From day one, Neon’s [mission](https://neon.com/blog/hello-world#:~:text=We%20realized%20that%20a%20modern%20Postgres%20service%20can%20be%20designed%20differently%20in%20order%20to%20be%20cheaper%20and%20more%20efficient%20in%20cloud%20environments%2C%20but%20it%20will%20require%20some%20real%20systems%20engineering.) has been to make databases radically more efficient through separation of storage and compute, allowing instant autoscaling and better unit economics.

Now, with Neon running on Databricks’ global infrastructure, we’ve taken another major step forward: compute on Neon is now up to 25% cheaper across plans.

## What’s Changing?

Starting today:

- **Launch Plan: $0.14 → $0.106 per CU-hour**
- **Scale Plan: $0.26 → $0.222 per CU-hour**

This continues a series of cost reductions since joining Databricks earlier this year:

- [August](https://neon.com/blog/new-usage-based-pricing): Minimum spend dropped to $5/mo and storage fell from $1.75 → $0.35 per GB-month.
- [September](https://neon.com/blog/why-we-no-longer-lock-premium-features): Enterprise features (Private Link, SLA, SOC 2, HIPAA, SSO, PITR) became part of the Scale Plan. No more $700/mo surcharge.
- [October](https://neon.com/docs/changelog/2025-09-19#free-plan-compute-hours-100): Free Plan compute doubled from 50 → 100 CU-hours.

With these changes, Neon now delivers the best price-performance ratio across every stage of development, from prototype (Free Plan) to production (Launch and Scale Plan).

## Real-world examples

The ownership costs of databases are notoriously difficult to compare because they are highly scenario dependent. It’s even more difficult to compare an autoscaling system like Neon (that can scale up to have larger resources and down to zero in hundreds of milliseconds) with fixed capacity databases.

In this section, we price a few real-world scenarios and compare Neon with two other popular database options on the market: Aurora Serverless v2, which has much slower autoscaling; and Supabase, which is fixed capacity.

**Scenario 1. Entry level database (0.25CU, 1GB, 9h/day usage)**: You are building an application that’s not high stakes and has relatively low usage. This database runs on the leanest compute resources available: 0.25 CU on Neon, Micro on Supabase, and 0.5 ACU on Aurora. Neon’s autoscaling capability can quickly scale the database down to zero when it’s inactive, and scale up in a few hundred milliseconds when load comes in. The cost of running this database on Neon is only $7.66/mo, less than half of Aurora Serverless and 30% of Supabase. In addition to the cost savings, you also get point-in-time recovery, snapshots, and data durability.

**Note**: If your entry-level project needs SOC2 Compliance, the savings are extreme because [we don’t charge a high fixed fee for premium features](https://neon.com/blog/why-we-no-longer-lock-premium-features) while Supabase requires you to opt-in to their $599/month business plan.

![Image](https://cdn.neonapi.io/public/images/pages/blog/major-compute-price-reduction-on-neon/image-f77b6b4b.png)

**Scenario 2. Launching a new product (1 to 4CU, 20GB, always on)**: You are a lean startup launching your new product, you want to guarantee your product is responsive. On Neon, you create a Launch Plan database with 1 to 4 CU autoscaling on Neon, vs 2 to 8 ACU on Aurora _(1 CU in Neon has similar resources to 2 ACU in Aurora)_, and XL instance on Supabase. In this case, Neon is less than 40% of the cost of Aurora, and less than 70% of Supabase.

**Scenario 3. Scaling your business (4 to 10CU, 100GB, always on)**: You’ve found product-market fit for your new product and now is investing in scaling both the company and the product. You start to get compliance requirements because you are getting into that segment of the market. You upgrade to the most expensive tier on Neon that is “all features included”. Even in this case, Neon is substantially cheaper than the other two alternatives.

The scenarios in this section demonstrates that Neon offers the lowest cost no matter where you are. Even better, you can easily transition among these different scenarios with just a few clicks.

## Why we can afford to lower price

You might wonder: How can we make databases this affordable? There’s no catch. As alluded to earlier, there are two fundamental reasons why we can offer the best price-performance.

First, Neon’s separation of storage and compute means your database scales up when it’s busy and down to zero when it’s idle. Data stays safely stored on durable cloud object storage, while compute spins up in milliseconds. You only pay for what you use. Contrast this with other database providers who offer fixed capacity, where you need to provision for your peak workloads and pay for a lot of idle time.

Second, since joining Databricks, Neon runs on one of the world’s largest and most efficient multi-cloud infrastructures. Databricks launches tens of millions of VMs daily, and that scale translates directly into lower costs for Neon users.

## What’s next

Choosing a database is one of the most important architectural decisions. We are humbled by the trust the Neon users have placed on us. With autoscaling, instant branching, and point-in-time recovery, we provide the best developer experience and can dramatically reduce your databases’ operational complexity. With the consecutive price reductions, we now offer the best price-performance option on the database market.

Our work is never finished. We’re building Neon not just to be the best in one metric, but to be the best in all aspects bar none, making Neon and Databricks synonymous with OLTP innovation for years to come.
