---
title: Monitoring in Neon
subtitle: Available monitoring and observability tools and metrics in Neon
enableTableOfContents: true
---

## Overview

To find out what's going on with your Neon projects and databases, Neon offers several ways to visualize your usage and track your metrics:
- Project dashboard &#8212; widgets that display the most recent usage metrics for your main branch
- Autoscaling graphs &#8212; a visualization of recent vCPU and RAM usage to help understand your sizing needs
- Branch-specific metrics &#8212; the *Branches* page lets you view key metrics for all branches in your project
- API metrics &#8212; use the [Neon API](link) to gather a variety of usage metrics for your projects
- neon_utils &#8212; a custom Postgres extension that helps you monitor how autoscaling allocates vCPU in response to workload
- Other Postgres extensions &#8212; other extensions like `pg_stat_statements` can provide details about the SQL execution counts, totals, average execution time, and other insights into how your database is being used.

## Dashboard

When you open a project in the Neon console, the Dashboard page gives you a series of widgets detailing recent usage  a project in the Neon console, the 

detailed statistical view of SQL statement execution within a Postgres database. It tracks information such as execution counts, total and average execution times, and more, helping database administrators and developers analyze and optimize SQL query performance.

For understanding key 
- 

The neon_utils extension provides a num_cpus() function you can use to monitor how Neon's Autoscaling feature allocates vCPU in response to workload. The function returns the current number of allocated vCPUs.



[Blurb about monitoring in general for saas serverless db.]



With Neon as your serverless database, we understand the importance of robust monitoring features, not only to provide insight into the status of your database, but you also need to understand how the engine is running: compute usage, etc... computes are performing

"Discover the foundational monitoring and observability features currently available in our product, providing essential insights into system performance and health, and setting the stage for future enhancements."






## Current state of monitoring and observability in Neon

Adding observability features is a priority for our engineering teams. See our roadmap.
While robust monitoring and observability features are not here yet, we do offer a few ways to monitor what's happening in your Neon projects and their databases:
- Dashboard snapshots 
- Autoscaling graphs
- Branch-specific metrics
- API metrics
- Billing page in the console
- neon_utils for monitoring autoscaling
- As well as native Postgres tools for monitoring your database

## Dashboard metrics

The project dashboard 's dashboard, you get a series of widgets that show details and snapshots your projects stats, the compute and storage metrics for your main branch, as well as a snapshot of your latest Neon operations.

a snapshot of the compute and storage metrics for your main branch, as well as and a 

<div>
<div width="50%">
asfd
</div>
<div width="50%">
asfd
</div>
</div>

[Politely explain we don't have monitoring but plan to soon]

As of now, Neon is light on built-in monitoring features. We know their importance and monitoring features are in our roadmap. Whether through integration with third-party tools like Datadog, autoscaling visualizations in the Neon Console, monitoring tools are coming.


We do have a few things to offer for monitoring:
Dashboard metrics
Branch-specific metrics on the branches page
API metrics (all the above via the API)
Billing page in the console for billing metrics
neon_utils for monitoring Autoscaling: https://neon.tech/docs/extensions/neon-utils

## Roadmap and future developments

[detail what is def in the roadmap, and what types of monitoring features we are thinking about adding]

## Native Postgres options for monitoring your database

pg_stats AND pg hero

add indemnification about losing any info that would normally write to storage when the node goes down (autoscaling to zero)

[detail some stuff you can do in postgres in the meantime]

from vadim: Can you also look at the pg_stat_statements extension and pg_buffer_cache? (If I'm correct, it doesn't provide hit/miss ratio, but it can help you to understand what kind of data is stored in it.)

Active connections are possible to get from pg_stat_activity.

Replication lag - we don't have in in-regional replication. It will be an issue with cross-regional replication.

As a user, I always looked at slow_query.log, but it can also be achieved by observing pg_stat_statements.

## Feedback and support

[ask for input on shaping these monitoring features]

