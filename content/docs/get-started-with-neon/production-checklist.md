---
title: Getting ready for production
subtitle: A checklist of recommended settings to optimize performance, security, and
  reliability
enableTableOfContents: true
updatedOn: '2025-05-11T11:23:50.618Z'
---

<CheckList title="Production checklist">

<CheckItem title="1. Set minimum compute to at least 1 vCPU" href="#set-minimum-compute-to-at-least-1-cu">
  Make sure your default branch can handle production traffic. A higher minimum compute helps you avoid performance bottlenecks.
</CheckItem>
<CheckItem title="2. Set max compute to the highest CU available for your plan" href="#set-max-compute-to-the-highest-cu-available-for-your-plan">
  Set your compute to automatically scale up, allowing your app to handle traffic surges and stay performant without manual scaling.
</CheckItem>
<CheckItem title="3. Disable scale to zero" href="#disable-scale-to-zero">
  Scale to zero turns off your compute after a period of inactivity. Ideal for development or other environments with bursty usage.
</CheckItem>
<CheckItem title="4. Use a pooled connection" href="#use-a-pooled-connection">
  Increase your database's ability to handle concurrent connections by using connection pooling.
</CheckItem>
<CheckItem title="5. Increase your project's restore window to 7 days" href="#increase-your-projects-restore-window-to-7-days">
  Protect your production data from accidental loss. Keep at least a 7-day restore window for quick data recovery and analysis.
</CheckItem>
<CheckItem title="6. Restrict database access to trusted IPs" href="#restrict-database-access-to-trusted-ips">
  Secure your database by limiting connections to trusted IP addresses.
</CheckItem>
<CheckItem title="7. Set up metrics export to Datadog" href="#set-up-metrics-export-to-datadog">
  Export Neon metrics to Datadog and centralize your database monitoring with your existing observability stack.
</CheckItem>
<CheckItem title="8. Install pg_stat_statements" href="#install-pgstatstatements">
  Enable query performance monitoring to track execution times and frequency.
</CheckItem>
<CheckItem title="9. Ensure your app reconnects after your database restarts" href="#ensure-your-app-reconnects-after-your-database-restarts">
  Verify your application handles compute restarts gracefully.
</CheckItem>
<CheckItem title="10. Upgrade to get priority support" href="#upgrade-to-a-neon-business-plan-for-priority-support">
  Get faster support and priority handling for your production database with a Business plan.
</CheckItem>
</CheckList>

<Steps>

## Set minimum compute to at least 1 CU

Before your application goes to prodution, make sure your database has enough vCPU and memory to handle expected production load. See [How to size your compute](/docs/manage/computes#how-to-size-your-compute).

**Recommendation**

We recommend that you **fit your data in memory** and use Neon **autoscaling**:

- Start with a compute size that can hold all your data in memory. Or try to fit at least your most frequently accessed data (your [working set](/docs/reference/glossary#working-set)).
- Once you determine the [right size](/docs/manage/computes#how-to-size-your-compute) for your compute, use that as the **minimum compute size** for [Autoscaling](#set-maximum-compute-to-highest-cu)).

**About compute size**

A Compute Unit (CU) in Neon measures the processing power or "size" of a Neon compute. One CU includes 1 vCPU and 4 GB of RAM. Neon computes can range from **0.25** CUs to **56** CUs, depending on your [Neon plan](/docs/introduction/plans).

## Set max compute to the highest CU available for your plan

Use Neon's [autoscaling](/docs/guides/autoscaling-algorithm) feature to dynamically adjust your compute resources based on your current workload. This means you don't need to scale manually during traffic surges.

**Recommendation**

- **Minimum compute size**: Autoscaling works best if your data can be fully cached in memory.
- **Maximum compute size**: Set this to as a high a limit as your plan allows. You only pay for what you use.

![Autoscaling control](/docs/get-started-with-neon/autoscaling_control.png)

To get started with Autoscaling, read:

- [Enable Autoscaling in Neon](/docs/guides/autoscaling-guide)
- [How to size your compute](/docs/manage/computes#how-to-size-your-compute), including the [Autoscaling considerations](/docs/manage/computes#autoscaling-considerations) section.

## Disable scale to zero

Scale to zero turns off your compute after a period of inactivity. Ideal for development or other environments with bursty usage.

**Recommendation**

Disable scale to zero for production workloads. This ensures your compute is always active, preventing delays and session context resets caused by cold starts.

**Session and latency considerations**

By default, your compute scales to zero after 5 minutes. Restarts are nearly instant, but there may still be some latency (around 500 milliseconds depending on the region). Restarts will reset your session context, affecting in-memory statistics and temporary tables. While typical production loads might never go idle long enough to scale to zero, disabling this feature prevents any possible issues from cold starts or session loss.

Disabling scale to zero is available on paid plans only. See [Configuring Scale to Zero for Neon computes](/docs/guides/scale-to-zero-guide) for more detail.

## Use a pooled connection

Connection pooling with [PgBouncer](https://www.pgbouncer.org/) allows your database to handle up to 10,000 concurrent connections, reducing connection overhead and improving performance.

**Recommendation**

For production environments, enable connection pooling. This increases the number of simultaneous connections your database can handle and optimizes resource usage.

**Connection details**

Use a pooled connection string by adding `-pooler` to your endpoint ID, or simply copy the pooled connection string from the **Connect** widget in your **Project Dashboard**. Use this string as your database connection in your application's environment variables. For more information, see [Connection pooling](/docs/connect/connection-pooling).

Example connection string:

```bash shouldWrap
postgresql://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require
```

## Increase your project's restore window to 7 days

Neon retains a history of changes for all branches, enabling instant restore and time travel queries. This history acts as a backup strategy, allowing recovery of lost data and viewing past database states.

**Recommendation**

Set your restore window to 7 days to ensure data integrity and quick recovery.

**Restore window details**

By default, Neon's restore window is set to **1 day**. Extending it to 7 days helps protect you against data loss, letting you recover from human or application errors that may go unnoticed for days. It can also help you comply with any industry regulations that need longer retention periods. While a longer restore window can increase storage costs, it provides exta security and recoverability for production data.

![Restore window setting](/docs/get-started-with-neon/history_retention_setting.png)

For more info, see [Instant restore](/docs/introduction/branch-restore).

## Restrict database access to trusted IPs

Neon's IP Allow feature ensures that only trusted IP addresses can connect to your database, preventing unauthorized access and enhancing security.

**Recommendation**

Combine an allowlist with protected branches for enhanced security. This setup ensures that only trusted IPs can access critical data, reducing the risk of unauthorized access and safeguarding data integrity.

**Configuration details**

- **IP Allow**: Restricts access to specific, trusted IP addresses, preventing unauthorized connections.
- **Protected branch**: Safeguards critical data from accidental deletions or modifications by designating branches as protected.

Available with the Neon [Scale](/docs/introduction/plans#scale) and [Business](/docs/introduction/plans#business) plans, you can configure **IP Allow** and protected branches in your Neon project's settings. For more information, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow) and [Protected branches guide](/docs/guides/protected-branches).

![IP allow setting settings](/docs/get-started-with-neon/ip_allow_settings.png)

## Set up metrics export to Datadog

Export Neon metrics to DataDog and centralize your database monitoring with your existing observability stack.

**Recommendation**

Set up Datadog integration to monitor and set alerts for key metrics:

- Connection counts (active and idle database connections)
- Database size (total size of all databases)
- Replication delay (lag in bytes and seconds)
- Compute metrics (CPU and memory usage)

For more information, see [The Neon Datadog integration](/docs/guides/datadog).

## Ensure your app reconnects after your database restarts

Verify your application handles compute restarts gracefully. Neon occasionally restarts computes for updates and maintenance.

**Recommendation**

Most database drivers and connection pools handle reconnection automatically, but it's important to test this behavior. You can use the Neon API to trigger a restart and watch your application reconnect:

```bash shouldWrap
curl --request POST \
  --url https://console.neon.tech/api/v2/projects/your_project_id/endpoints/your_endpoint_id/restart \
  --header 'accept: application/json' \
  --header 'authorization: Bearer $NEON_API_KEY'
```

See [Restart compute endpoint](https://api-docs.neon.tech/reference/restartprojectendpoint) for details.

For more information:

- [Build connection timeout handling into your application](/docs/connect/connection-latency#build-connection-timeout-handling-into-your-application)
- [Maintenance & updates overview](/docs/manage/maintenance-updates-overview)

## Install pg_stat_statements

Enable query performance monitoring to track execution times and frequency.

**Recommendation**

Install the `pg_stat_statements` extension to monitor query performance and identify potential bottlenecks.

**Usage**

```sql
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

The statistics gathered by this extension require little overhead and let you quickly access metrics like:

- [Most frequently executed queries](/docs/postgresql/query-performance#most-frequently-executed-queries)
- [Longest running queries](/docs/postgresql/query-performance#long-running-queries)
- [Queries that return the most rows](/docs/postgresql/query-performance#queries-that-return-the-most-rows)

You can also use the **Monitoring Dashboard** in the Neon Console to view live graphs for system and database metrics like CPU, RAM, and connections.

![Monitoring page connections graph](/docs/introduction/monitor_connections.png)

For more information, see [Query performance](/docs/postgresql/query-performance) and [Monitoring](/docs/introduction/monitoring).

## Upgrade to a Neon Business plan for priority support

Support tickets opened by Business and Enterprise support plan customers are given top priority by the Neon Support team.

**Recommendation**

Upgrade to a [Business plan](/docs/introduction/plans#business) to get both [Priority support](/docs/introduction/support#prioritized-support-tickets) and acccess to the [Business SLA](https://neon.tech/neon-business-sla).

For more information, see the [Support documentation](/docs/introduction/support).

</Steps>

<NeedHelp/>
