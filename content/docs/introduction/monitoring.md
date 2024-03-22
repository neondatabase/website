---
title: Monitoring in Neon
subtitle: Available monitoring and observability tools and metrics in Neon
enableTableOfContents: true
updatedOn: '2024-02-22T14:29:54.385Z'
---

## Overview

To find out what's going on with your Neon projects and databases, Neon offers several ways to visualize your usage and track your metrics:
- [Project dashboard](#dashboard) &#8212; Find widgets that display the most recent usage metrics across your project
- [Autoscaling graphs](#autoscaling-graphs) &#8212; a visualization of recent vCPU and RAM usage to help understand your sizing needs.
- [Branch-specific metrics](#branch-specific-metrics) &#8212; View key metrics for all branches in your project on the **Branches** page.
- [API metrics](#api-metrics) &#8212; Use the [Neon API](link) to gather a variety of usage metrics for your project.
- [neon_utils](#the-neon_utils-extension) &#8212; A custom Postgres extension that helps you monitor how autoscaling allocates vCPU in response to workload.
- [Other Postgres options](#other-postgres-options) &#8212; Other extensions and tools like [pg_stat_statements](https://neon.tech/docs/extensions/pg_stat_statements) and [PgHero](https://github.com/ankane/pghero) can provide details about SQL execution counts, totals, average execution time, and other insights into how your database is being used.

## Dashboard

When you open a project in the Neon Console, the Dashboard gives you a snapshot view of the most recent usage metrics for that project:

- **Branches** widget &#8212; Shows how much storage your main branch has currently used. It also lists a subset of other branches.
- **Usage since...** widget  &#8212; Shows a snapshot of your current consumption metrics since your last billing date (the last day of the previous month).
- **Project settings** widget &#8212; Shows current project settings like your compute size default and history retention window.
- **Operations** widget &#8212; Lists a subset of the most recent [Neon operations](/docs/manage/operations) like `create_branch`, `start_compute`, and `suspend_compute`. If there are any critical issues or events, you should see these show up here.

In any of these widgets, you can click the link in the top right corner to get more detail, a wider view, and take various actions.

## Autoscaling graphs

For Pro users, when you edit your compute from the **Branches** page, there is a graph showing your recent vCPU and RAM usage. This can help visualize whether your current minimum and maximum sizes are suitable for your current level of demand.

See [Monitoring Autoscaling](/docs/guides/autoscaling-guide#monitoring-autoscaling) for details.

## Branch-specific metrics

The **Branches** page provides key usage metrics for all your branches, like active hours, compute hours, storage space used, and whether the branch includes a read-write compute, all organized into a table view that lets you scan your list of branches. You can also use search if your list of branches is quite long.

## API metrics

Using the Neon API, you can collect a variety of usage-based consumption metrics like  `data_storage_bytes_hour` and `compute_time_seconds`.

Use this `GET` request to get details from an individual project.

```curl
curl --request GET \
     --url https://console.neon.tech/api/v2/projects/[project_ID] \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" | jq
```

For more details, see [Retrieving details about a project](/docs/guides/partner-billing#retrieving-details-about-a-project).

## The neon_utils extension

The `neon_utils` extension provides a `num_cpus()` function you can use to monitor how Neon's Autoscaling feature allocates vCPU in response to workload. The function returns the current number of allocated vCPUs.

For full details, see [neon_utils](/docs/extensions/neon-utils).

## Other Postgres options

Neon recommends a few tools from the Postgres community that can help you understand what is happening within your database:

- [pg_stat_activity](#pg_stat_activity)
- [pg_stat_statements](#pg_stat_statements)
- [PgHero](#PgHero)

### pg_stat_activity

This system view built into Postgres provides real-time information on current database connections and queries being executed. A helpful for determining who is accessing your database.

Try this query out in the Neon Console:

```sql
SELECT * FROM pg_stat_activity;
```

You should see a range of information about what's currently happening in the selected database. For details, see [pg_stat_activity](https://neon.tech/docs/postgres/monitoring-stats#MONITORING-PG-STAT-ACTIVITY-VIEW).

### pg_stat_statements

A Postgres extension that tracks information such as execution counts, total and average execution times, latency, and so on, which can help you analyze and optimize SQL query performance.

Here are some typical queries that you might find helpful:

- [Monitor slow queries](/docs/extensions/pg_stat_statements#monitor-slow-queries)
- [Find the most frequently executed queries](/docs/extensions/pg_stat_statements#monitor-slow-queries)
- [Find the most time-consuming queries](/docs/extensions/pg_stat_statements#monitor-slow-queries)

For more information, see our [pg_stat_statements](/docs/extensions/pg_stat_statements) documentation page.

<Admonition type="note">
Currently, not all information within `pg_stats_statements` persists when a compute instance is autosuspended (scales-to-zero) due to inactivity. For example, the text of your queries may not survive the restart. Our teams are looking into making all `pg_stat_statements` data persistent across compute restarts.
</Admonition>

### PgHero

[PgHero](https://github.com/pghero/pghero) is an open-source performance tool for Postgres that can help you find and fix data issues, using a dashboard interface.

## Feedback and future improvements

At Neon, we understand that observability and monitoring are critical for running successful applications.

Check out our [roadmap](/docs/introduction/roadmap) to see what's coming next. And if you've got feature requests or feedback about what you'd like to see in Neon observability features, let us know via the [Feedback](https://console.neon.tech/app/projects?modal=feedback) form in the Neon Console or in our [feedback channel](https://discord.com/channels/1176467419317940276/1176788564890112042) on Discord.
