---
title: Delayed Start Compute Operations – Triggering Event
description: >-
  This post is part of a series discussing the Neon outages on 2025-05-16 and
  2025-05-19 in the AWS us-east-1 region. In this post, we cover the triggering
  cause of the outage, a change in a Postgres execution plan that ultimately
  caused idle Computes to be unable to be suspended.
excerpt: >-
  For further details, read the top-level Post-Mortem. Summary The Neon Control
  Plane service is backed by a Postgres database. A scheduled job in the Control
  plane, Activity Monitor, is responsible for identifying Computes that are
  ready to be suspended. A Postgres query executed...
date: '2025-05-30T20:24:56'
updatedOn: '2025-05-30T21:10:48'
category: engineering
categories:
  - engineering
authors:
  - mihai-bojin
  - matt-sherman
cover:
  image: null
  alt: null
isFeatured: false
seo:
  title: Delayed Start Compute Operations - Triggering Event - Neon
  description: >-
    This post is part of a series discussing the Neon outages on 2025-05-16 and
    2025-05-19 in the AWS us-east-1 region. In this post, we cover the
    triggering cause of the outage, a change in a Postgres execution plan that
    ultimately caused idle Computes to be unable to be suspended.
  keywords: []
  noindex: false
  ogTitle: Delayed Start Compute Operations - Triggering Event - Neon
  ogDescription: >-
    For further details, read the top-level Post-Mortem. Summary The Neon
    Control Plane service is backed by a Postgres database. A scheduled job in
    the Control plane, Activity Monitor, is responsible for identifying Computes
    that are ready to be suspended. A Postgres query executed by this job
    against the region’s control plane database changed its execution […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/delayed-start-compute-operations-triggering-event/social.png
source:
  wpId: 9833
  wpSlug: delayed-start-compute-operations-triggering-event
  exportedAt: '2026-03-20T13:31:00.745Z'
---

_For further details, read the_ [top-level Post-Mortem](https://neon.com/blog/postmortem-delayed-start-compute-operations)_._

# Summary

The Neon Control Plane service is backed by a Postgres database. A scheduled job in the Control plane, _Activity Monitor,_ is responsible for identifying Computes that are ready to be suspended. A Postgres query executed by this job against the region’s control plane database changed its [execution plan](https://www.postgresql.org/docs/current/using-explain.html).

Different execution plans can cause dramatic performance changes – in this case, using a suboptimal index – which in turn can make a query run slower and consume more resources than before. In turn, this led to database CPU saturation, and caused the _Activity Monitor_ to be unable to suspend _Compute_ VMs, ultimately resulting in a significant increase in concurrently running _Computes_, above the cluster’s planned capacity of 6,000, but below the tested ceiling of 10,000 VMs.

This resulted in IP Allocation failures – the specifics of which are described in the [top-level Postmortem](https://neon.com/blog/postmortem-delayed-start-compute-operations).

# Architecture

Behind the Neon Console is the Neon Control Plane service. It is a regional Golang service which orchestrates many supporting functions, but primarily it starts and suspends Neon Postgres VMs, which we call “_Computes_”. Neon’s Serverless architecture requires the Control Plane to start _Computes_ when customers execute SQL statements, and suspend them if there are no statements executed for a (configurable) period of time. We call this functionality, [scale-to-zero](https://neon.com/docs/guides/scale-to-zero-guide).

The mechanism that suspends _Computes_ is called the “_Activity Monitor_”, a scheduled job running inside the Neon Control Plane that evaluates running computes, and identifies those which can be suspended.

## Chain of events

The _Activity Monitor_ relies on a Postgres SQL query, which contains several joins, including one against the `computes` table. The `computes` table contains rows for every _Compute_ which has been started or made idle.

The triggering event for the 2025-05-16 outage was a change in Postgres execution plan for queries made by the Activity Monitor. This led to a broad scan on the `computes` table, causing CPU saturation on the control plane’s backing Postgres database.

Due to the high CPU usage, all _fetchEndpointWithCompute_ queries’ execution times increased from a few hundred milliseconds to over 100 seconds. In turn, this resulted in the control plane becoming unable to suspend _Compute VMs_, which led to an increase in the number of concurrently running VMs, ultimately resulting in [IP exhaustion](https://neon.com/blog/postmortem-delayed-start-compute-operations) inside the cluster.

The `computes` table has tens of millions of rows, as it holds a recent history of all start and suspend events of Neon _Computes_. However, the number of _active_ _Computes_ (rows) at any given moment is much lower.

When execution plans use the correct indexes, this table can be queried in milliseconds. However, if the wrong index is selected, its performance can fall off a cliff, scanning millions of pages to return a couple thousand rows.

This change in execution plan didn’t uniformly happen in all regions, as the Control Plane and backing databases are region-isolated for resilience. As a result, each database’s planner independently decides the most efficient execution plan for each executed statement. The _us-east-1_ region was the first to be affected by this plan change. In parallel with mitigating the outage in that region, we have taken steps to prevent the same failure pattern from occurring in other regions in the future.

During the incident, and in other regions afterwards:

- We ran `ANALYZE computes`, which refreshed the statistics and brought the execution plan back to normal.
- We refactored _fetchEndpointWithCompute_ to wrap the potentially expensive sub-query in a [materialized CTE](https://www.postgresql.org/docs/current/queries-with.html#QUERIES-WITH-CTE-MATERIALIZATION). The CTE acts as an optimization fence, causing the planner to evaluate it once, use an appropriate index, and return a small set of relevant rows. This prevents the planner from occasionally choosing a suboptimal index and causing poor performance.

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/delayed-start-compute-operations-triggering-event/screenshot-2025-05-30-at-205905-1024x436-275cf2c5.png" alt="Image" />
<figcaption>By using a materialized CTE, we are seeing more stable results from the Postgres query planner.</figcaption>
</figure>

**What other improvements have we considered?**

- We’re implementing a more active Garbage Collection strategy to make future regressions to this query plan less expensive. We expect this change to result in an order of magnitude reduction in rows in this table (from tens of millions, to millions of rows), reducing total index size and reducing the occurrence of dead tuples by enabling `AUTOVACUUM` to run more often.
- In the medium-term, we intend to move all historical data outside of the ‘hot’ control plane OLTP backing database into an OLAP system.
- We have considered moving the _Activity Monitor_ to read from a Postgres read replica. Unfortunately, this is not a viable option due to its need for reading consistent (not stale) results and making transactional writes.

# Next steps

One item we’re currently working on is understanding the exact conditions that lead to a change in execution plan. We observed different behaviours by region, depending on the shape of the `computes` table in each backing database.

We will publish further findings, once we have concluded this investigation.
