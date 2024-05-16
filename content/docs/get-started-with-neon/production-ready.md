---
title: Ready for production
subtitle: Key features that will get you production ready with Neon
enableTableOfContents: true
---

This topic introduces Neon features and settings to consider when you are getting ready to deploy an application to production.

- [x] [Select the right compute size](#select-the-right-compute-size)
- [x] [Configure Autoscaling](#configure-autoscaling)
- [x] [Configure Autosuspend](#configure-autosuspend)
- [x] [Use a pooled connection](#use-a-pooled-connection)
- [x] [Configure your history retention period](#configure-your-history-retention-period)
- [x] [Configure IP Allow](#configure-ip-allow)
- [x] [Configure a protected branch](#configure-a-protected-branch)
- [x] [Monitoring](#monitoring)
- [x] [Create staging or test branches](#create-staging-or-test-branches)

## Select the right compute size

In a development environment, your application may function perfectly well with a small compute size, but before your application goes live, you should make sure that your database has enough vCPU and memory to handle the expected load.

Your compute size determines the vCPU and memory your database has to work with. Neon supports computes up to 8 Compute Units (CUs) in size. Larger computes provide more memory. The compute sizes that are available to you depend on your Neon plan: 

- **Free Tier**: 0.25 CUs (0.25 vCPU, 1 GB RAM)
- **Launch**: Up to 4 CUs (4 vCPU, 16 GB RAM)
- **Scale**: Up to 8 CUs (8 vCPU, 16 GB RAM)
- **Enterprise**: Larger sizes

Generally, you'll want to start with a compute size that can hold your data or at least your most frequently accessed data (your "working set") in memory. If you are using Neon's _Autoscaling_ feature, we recommend the same for your **minimum compute size** setting (see [Enable Autoscaling](#enable-autoscaling)).

For a table showing the vCPU and memory per compute size and a discussion about how to select the right compute size, see [How to size your compute](docs/manage/endpoints#how-to-size-your-compute). 

## Enable Autoscaling

Neon's _Autoscaling_ feature dynamically adjusts the amount of compute resources allocated to a Neon compute endpoint in response to the current workload, eliminating the need for manual intervention.

Typically, Autoscaling is most effective when your data (either your full dataset or your working set) is fully cached in memory on the **minimum compute size** in your autoscaling configuration. The **maximum compute size** in your configuration can then be set to handle peak or above-normal demand.

To get started with Autoscaling, read:

- [Enable Autoscaling in Neon](/docs/guides/autoscaling-guide)
- [How to size your compute](docs/manage/endpoints#how-to-size-your-compute), including the [Autoscaling considerations](/docs/manage/endpoints#autoscaling-considerations) section.

## Configure Autosuspend

Neon's Autosuspend feature automatically transitions a compute endpoint into an `Idle` state after a period of inactivity, also known as "scale-to-zero". By default, suspension occurs after 5 minutes of inactivity, but this delay can be adjusted on Neon's paid plans.

For a busy production system that is always active, this setting may not matter much, as your compute will not remain idle long enough for autosuspension to occur. But if your application has any idle periods or inconsistent usage patterns, a proper setting can help minimize cost or ensure application responsiveness. To learn more about configuring Autosuspend, [Configuring Autosuspend for Neon computes](/docs/guides/auto-suspend-guide).

## Use a pooled connection

The Postgres `max_connections` setting defines your basic maximum simultaneous connection limit and is also set according to your compute size. Larger computes support higher maximum connection limits. However, Neon supports connection pooling with PgBouncer, which lets you increase your connection limit up to 10,000 simultaneous connections. Enabling connection pooling is easy. You simply use a pooled connection string instead of the standard non-pooled string. A pooled connection string includes `-pooled` in the Neon hostname, as shown in this example:

```bash
postgres://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require
```

The `-pooled` flag directs connections to a connection pooling port at the Neon proxy. Unless you have a specific reason to avoid connection pooling, we recommend using it. You can grab a pooled connection string from the **Connectin Details** widget on your project's **Dashboard** in the Neon Console. Select **Pooled connection**. For more information, see [Connection pooling](/docs/connect/connection-pooling).

## Configure your history retention period

Neon retains a history of changes for all branches. This history enables point-in-time restore and time travel queries among other development-focussed features. Keeping a history enables recovering lost data or viewing the past state of your database, which is helpful when trying to identify when an issue occurred or a desired restore point. Neon's history can also function as a database backup strategy.

The history retention limit is 24 hours for Neon Free Tier users, 7 days for Launch plan users, and 30 days for Scale plan users. Before going into production, select a history retention period that suits your operational requirements. A longer history retention period expands your point-in-time restore and time travel query horizons at the cost of increased storage usage. 

For more, see [Branch reset and restore](/docs/introduction/point-in-time-restore).

## Configure IP Allow

Neon's IP Allow feature, available with the Neon [Scale](/docs/introduction/plans#scale) plan, ensures that only trusted IP addresses can connect to the project where your database resides, preventing unauthorized access and helping maintain overall data security. You can limit access to individual IP addresses, IP ranges, or IP addresses and ranges defined with [CIDR notation](/docs/reference/glossary#cidr-notation). 

You can configure **IP Allow** in your Neon project's settings. To get started, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow).

## Configure a protected branch

Noen's protected branches feature allows you to apply IP restrictions more precisely by designating specific branches in your Neon project as protected and enabling the **Restrict IP access to protected branches only** option. This will apply your IP allowlist to protected branches only with no IP restrictions on other branches in your project. Typically, branches that contain production or sensitive data are marked as protected. For step-by-step instructions, refer to our [Protected branches guide](/docs/guides/protected-branches).

## Monitoring

Monitoring is an important consideration as you prepare for production. Neon offers several monitoring resources and metrics, including a **Monitoring Dashboard** in Neon Console, where you can view graphs for system and database metrics like CPU, RAM, and connections.

![Monitoring page connections graph](/docs/introduction/monitor_connections.jpg)

For query performance and statistics in Postgres, we also recommend installing the [pg_stat_statements extension](/docs/extensions/pg_stat_statements).

To learn more about monitoring resources and metrics in Neon, check out our [Monitoring](/docs/introduction/monitoring) page.

## Create staging or test branches

With Neon branching, you can easily set up a staging or testing environment that mirrors the production environment for testing changes and updates. To get an idea of how easy it is to create a branch of your production database for testing, see our [Branching — Testing queries](/docs/guides/branching-test-queries) guide.

With branching, you can instantly create an isolated copy of your database for testing schema changes and application updates before deploying to production. Neon's CLI and API support using automated testing and CI/CD pipelines to streamline the your testing processes.
