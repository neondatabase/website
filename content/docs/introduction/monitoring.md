---
title: Monitoring in Neon
subtitle: Available monitoring and observability tools and metrics in Neon
enableTableOfContents: true
---

## Overview

To find out what's going on with your Neon projects and databases, Neon offers several ways to visualize your usage and track your metrics:
- [Project dashboard](#dashboard) &#8212; widgets that display the most recent usage metrics for your main branch
- [Autoscaling graphs](#autoscaling-graphs) &#8212; a visualization of recent vCPU and RAM usage to help understand your sizing needs
- [Branch-specific metrics](#branch-specific-metrics) &#8212; the **Branches** page lets you view key metrics for all branches in your project
- [API metrics](#api-metrics) &#8212; use the [Neon API](link) to gather a variety of usage metrics for your projects
- [neon_utils](#the-neon_utils-extension) &#8212; a custom Postgres extension that helps you monitor how autoscaling allocates vCPU in response to workload
- [Other Postgres options](#other-postgres-options) &#8212; other extensions and tools like `pg_stat_statements` and the `pg_hero` dashbaord can provide details about the SQL execution counts, totals, average execution time, and other insights into how your database is being used.

## Dashboard

When you open a project in the Neon console, the Dashboard gives you a snapshot view of the most recent usage metrics for that project:

- **Branches**  &#8212; Shows how much storage your main branch has currently used. It also lists a subset of other branches.
- **Usage since...**  &#8212; Shows a snapshot of your current consumption metrics since your last billing date (the last day of the previous month).
- **Project settings** &#8212; Shows current project settings like your sizing defaults and history retention window.
- **Operations** &#8212; Lists a subset of your most recent Neon operations like create_branch and check_availability. If there are any critical issues or events, you should see these show up in here.

In any of these widget, you can click the link in the top right corner to get more detail, a wider view, and take actions.

## Autoscaling graphs

For Pro users, when you edit your compute from the **Branches** page, there is a graph showing your recent vCPU and RAM usage. This can help visualize whether your current minimum and maximum sizes are suitable for your current level of demand.

See [Monitoring Autoscaling](/docs/guides/autoscaling#monitoring-autoscaling) for details.

## Branch-specific metrics

The **Branches** page provides key usage metrics for all your branches in a consolidated view.

[screenshot calling out key metrics]

## API metrics

Using the Neon API, you can collect a variety of usage-based consumption metrics. 

## The neon_utils extension


The neon_utils extension provides a num_cpus() function you can use to monitor how Neon's Autoscaling feature allocates vCPU in response to workload. The function returns the current number of allocated vCPUs.

## Other Postgres options

Neon recommends a few tools from the Postgres community that can help you understand what is happening within your database:

- `pg_stat_activity` &#8212; a system view in Postgres that provides real-time information on current database connections and queries being executed. A helpful for determining who is accessing your database.

    Try this query out in the Neon Console:

    ```sql
    SELECT * FROM pg_stat_activity;
    ```

    You should see a range of information about what's currently happening in the selected database. For detail, see [pg_stat_activity](https://neon.tech/docs/postgres/monitoring-stats#MONITORING-PG-STAT-ACTIVITY-VIEW).
- [pg_stat_statements](/docs/extensions/pg_stat_statements) &#8212; A Postgres extension that tracks information such as execution counts, total and average execution times, latency, and so on, that can help you analyze and optimize SQL query performance.

    <Admonition type="note">
    Currently, not all information within `pg_stats_statements` persists when a compute instance is autosuspended (scales-to-zero) due to inactivity.For example, the text of your queries may not survive the restart. Our teams are looking into making all `pg_stat_statements` data persistent across compute restarts.
    </Admonition>

- [pg_hero](https://github.com/pghero/pghero)  an open-source performance tool for Postgres that can help you find and fix data issues, using a dashboard interface.

## Feedback and future improvements

At Neon, we understand that better observability and monitoring are critical for running successful applications. 

Check out our [roadmap](/docs/introduction/roadmap) to see what's coming next. 

If you've got feature requests or feedback about what you'd like to see in Neon observability features, let us know in our [feedback channel](https://discord.com/channels/1176467419317940276/1176788564890112042).
