---
title: Monitoring in Neon
subtitle: Available monitoring tools and metrics in Neon
enableTableOfContents: true
---

## Overview
[Blurb about monitoring in general for saas serverless db.]

With Neon as your serverless database, we understand the importance of robust monitoring features, not only to provide insight into the status of your database, but you also need to understand how your computes are performing

## Current state of monitoring features

[Politely explain we don't have monitoring but plan to soon]

As of now, Neon is light on built-in monitoring features. We know their importance and monitoring features are in our roadmap. Whether through integration with third-party tools like Datadog, autoscaling visualizations in the Neon Console, monitoring tools are coming.

## Roadmap and future developments

[detail what is def in the roadmap, and what types of monitoring features we are thinking about adding]

## Native Postgres options for monitoring your database

[detail some stuff you can do in postgres in the meantime]

from vadim: Can you also look at the pg_stat_statements extension and pg_buffer_cache? (If I'm correct, it doesn't provide hit/miss ratio, but it can help you to understand what kind of data is stored in it.)

Active connections are possible to get from pg_stat_activity.

Replication lag - we don't have in in-regional replication. It will be an issue with cross-regional replication.

As a user, I always looked at slow_query.log, but it can also be achieved by observing pg_stat_statements.

## Feedback and support

[ask for input on shaping these monitoring features]

