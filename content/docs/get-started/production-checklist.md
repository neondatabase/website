---
title: Getting ready for production
subtitle: 'Guidelines to optimize price, performance, and reliability'
summary: >-
  Covers the setup of production environments in Neon, including guidelines for
  selecting plans, optimizing performance, managing branches, enabling
  autoscaling, and ensuring reliability through connection testing and restore
  settings.
enableTableOfContents: true
redirectFrom:
  - /docs/get-started-with-neon/production-checklist
updatedOn: '2026-02-06T22:07:32.892Z'
---

<CheckList title="Production checklist">

<CheckItem title="1. Use a paid plan for production workloads" href="#use-a-paid-plan-for-production-workloads">
  Paid plans are usage-based, so your app won't stop or be limited as it grows. The Free plan includes compute hour limits, making it better suited for prototyping.
</CheckItem>
<CheckItem title="2. Choose a region close to your application" href="#choose-a-region-close-to-your-application">
  Deploy your Neon project in the nearest available region to your application to minimize network latency.
</CheckItem>
<CheckItem title="3. Keep your production branch as the default" href="#keep-your-production-branch-as-the-default">
  Your production branch should be a root branch set as the default to ensure compute availability, enable snapshots, and simplify billing.
</CheckItem>
<CheckItem title="4. Protect your production branch" href="#protect-your-production-branch">
  Mark production branches as protected to prevent accidental resets or destructive operations.
</CheckItem>
<CheckItem title="5. Enable autoscaling and set appropriate limits" href="#enable-autoscaling-and-set-appropriate-limits">
  Autoscaling lets your database handle traffic spikes automatically. Set limits that balance performance with cost.
</CheckItem>
<CheckItem title="6. Decide whether scale-to-zero is acceptable" href="#decide-whether-scale-to-zero-is-acceptable">
  Scale-to-zero is great for development and bursty usage. For production, disable it if you need consistently low latency.
</CheckItem>
<CheckItem title="7. Test connection retries using the Neon API" href="#test-connection-retries-using-the-neon-api">
  Brief disconnects can happen during scaling or maintenance. Verify your application reconnects automatically.
</CheckItem>
<CheckItem title="8. Set an appropriate restore window" href="#set-an-appropriate-restore-window">
  Neon keeps 1 day of restore history by default on paid plans. Increasing this gives you more protection, with storage cost tradeoffs.
</CheckItem>
<CheckItem title="9. Consider snapshot schedules" href="#consider-snapshot-schedules">
  Snapshot schedules provide consistent backups for point-in-time restore, independently of your restore window.
</CheckItem>
<CheckItem title="10. Test your restore workflow" href="#test-your-restore-workflow">
  Plan whether you'll restore in place or from a snapshot, and how your application will switch if needed.
</CheckItem>
<CheckItem title="11. Clean up your branches regularly" href="#clean-up-your-branches-regularly">
  Set branch expiration times and add cleanup logic to automated workflows to avoid unnecessary storage costs.
</CheckItem>
<CheckItem title="12. Use pooled connections where they make sense" href="#use-pooled-connections-where-they-make-sense">
  Connection pooling improves concurrency for web and serverless apps, but may not be appropriate for migrations or long-running tasks.
</CheckItem>
<CheckItem title="13. Restrict access to production data" href="#restrict-access-to-production-data">
  Limit database access to trusted sources using IP Allow to reduce the risk of unauthorized changes.
</CheckItem>
<CheckItem title="14. Install pg_stat_statements" href="#install-pgstatstatements">
  Enable query performance monitoring to track execution times and frequency. This helps you troubleshoot performance issues independently.
</CheckItem>
<CheckItem title="15. Integrate with your existing observability stack" href="#integrate-with-your-existing-observability-stack">
  Export Neon metrics to Datadog, Grafana, or any OTEL-compatible platform to monitor usage and capacity alongside your existing systems.
</CheckItem>

</CheckList>

<Steps>

## Use a paid plan for production workloads

Neon's paid plans are fully usage-based, which means your database is never subject to fixed limits that can stop your application as traffic grows. You pay for the compute and storage you use each month, without minimums.

The Free plan is designed to support experimentation and prototyping and includes compute hour limits. It should be avoided for production workloads where uninterrupted availability matters.

If you need technical support beyond billing, the Scale plan includes priority support with access to Neon's support team.

Keep reading: [Neon plans](/docs/introduction/plans)

## Choose a region close to your application

Network latency is one of the most common contributors to database response time: even a well-tuned database will feel slow if it's geographically far from your application servers. When creating a Neon project, choose the region that is closest to where your application runs.

![Region selection](/docs/introduction/project_creation_regions.png)

Keep reading: [Neon regions](/docs/introduction/regions)

## Keep your production branch as the default root branch

Your production database should run on a [root branch](/docs/reference/glossary#root-branch) that is set as the project's [default branch](/docs/reference/glossary#default-branch). Neon projects are configured this way by default. Using a root branch enables [snapshots](/docs/guides/backup-restore), provides simpler billing (based on actual data size rather than accumulated changes), and prevents accidental deletion.

Keep reading: [Manage branches](/docs/manage/branches)

## Protect your production branch

Neon makes it easy to branch, reset, and restore databases. In production, that power should be paired with explicit safeguards. Branch protection helps ensure that powerful features like restore, reset, and snapshot operations are used deliberately when applied to production data. This is especially important in teams or automated environments.

![Protect branch button](/docs/guides/ip_allow_set_as_protected.png)

Keep reading: [Protected branches](/docs/guides/protected-branches)

## Enable autoscaling and set appropriate limits

Neon autoscaling automatically adjusts compute resources based on your workload, allowing your database to absorb traffic spikes without manual intervention. For production workloads:

- **Minimum compute size**: Set a minimum high enough so your working set (frequently accessed data) can be fully cached in memory. This is important because Neon's [Local File Cache (LFC)](/docs/reference/glossary#local-file-cache) allocation is tied to your compute size. When the compute scales down and the LFC shrinks, frequently accessed data may be evicted and need to be reloaded from storage, which impacts performance.

- **Maximum compute size**: Set a maximum that provides enough extra capacity for traffic spikes. The maximum also determines your available local disk space, which is used for things like temporary files, complex queries, [pg_repack](/docs/extensions/pg_repack), and replication.

A safe minimum combined with a sufficiently high maximum will give you the best performance while avoiding unnecessary baseline cost.

![Autoscaling control](/docs/get-started/autoscaling_control.png)

Keep reading:

- [How to size your compute](/docs/manage/computes#how-to-size-your-compute)
- [Autoscaling configuration](/docs/introduction/autoscaling#configuring-autoscaling)
- [Monitor working set size](/docs/introduction/monitoring-page#working-set-size)
- [How the autoscaling algorithm works](/docs/guides/autoscaling-algorithm)

## Decide whether scale-to-zero is acceptable

Scale-to-zero allows Neon to suspend compute after a period of inactivity. This is a highly effective way to save costs in development environments and workloads with intermittent usage. For production workloads, the decision depends on your latency requirements.

If occasional cold starts are acceptable for your application (e.g., for internal tools), leaving scale-to-zero enabled will be the most cost-effective choice.

Consider disabling scale-to-zero if:

- Your application requires consistently low latency
- Cold-start delays are unacceptable for user-facing requests
- You rely on long-lived sessions or in-memory state

**Cache considerations**: When a compute suspends, the cache is cleared. After the compute restarts, rebuilding the cache can take some time and may temporarily degrade query performance. If your workload requires suspension but you want to minimize this impact, consider using the [pg_prewarm](/docs/extensions/pg_prewarm) extension to reload critical data into the cache on startup.

Keep reading: [Scale to zero configuration](/docs/guides/scale-to-zero-guide)

## Test connection retries using the Neon API

In a serverless architecture, brief connection interruptions can occur during scaling events or maintenance. Most database drivers and connection pools already implement retry logic for transient failures, but rather than assuming this works, you should test it.

Our recommended approach:

- Use the Neon API or Console to trigger a compute restart
- Observe how your application behaves during the restart
- Confirm that connections are re-established automatically without user-facing errors

```bash
curl --request POST \
     --url https://console.neon.tech/api/v2/projects/{project_id}/endpoints/{endpoint_id}/restart \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY'
```

Keep reading:

- [Restart a compute](/docs/manage/computes#restart-a-compute)
- [Build connection timeout handling into your application](/docs/connect/connection-latency#build-connection-timeout-handling-into-your-application)
- [Maintenance and updates overview](/docs/manage/maintenance-updates-overview)

## Set an appropriate restore window

Neon retains a history of changes for each project to support branching and instant restores. On paid plans, the default restore window is 1 day, which you can increase up to 30 days.

Increasing the restore window gives you more flexibility to recover from bugs discovered later or accidental data loss. However, longer restore windows retain more historical data, which contributes to storage usage. Choose a window that balances recovery needs with predictable storage costs.

Keep reading: [Storage and billing for restores](/docs/introduction/restore-window#storage-and-billing)

## Consider snapshot schedules

Snapshot schedules provide regular, durable restore points taken daily, weekly, or monthly. While [point-in-time restore](/docs/introduction/branch-restore) lets you roll back to any moment within the restore window, snapshots capture stable points in time that you can return to later — ensuring that recovery points exist even if they fall outside your chosen restore window.

Snapshot schedules are only available on [root branches](/docs/manage/branches#root-branch).

![Snapshot schedule](/docs/guides/backup_restore_ui.png)

Keep reading: [Snapshot schedules](/docs/guides/backup-restore#create-backup-schedules)

## Test your restore workflow

Don't wait for an incident to learn how restore works. Plan and test your recovery process in advance.

Neon supports multiple restore patterns:

- [Instant branch restores](/docs/guides/backup-restore#instantly-restore-a-branch), where the existing branch is restored to a previous state
- [Restore from a snapshot into the same branch](/docs/guides/backup-restore#one-step-restore)
- [Restore from a snapshot into a new branch](/docs/guides/backup-restore#multi-step-restore)

Plan and test which restore method you will use for production incidents, how your application will switch connections if a new branch is created, and how you will validate restored data before resuming traffic.

## Clean up your branches regularly

Neon's branching makes it easy to create preview, test, and temporary environments. Over time, unused branches can accumulate and contribute to unnecessary storage usage. To keep costs and complexity under control:

- Set expiration times for preview and test branches
- Add explicit delete steps to automated branching workflows
- Periodically review and remove branches that are no longer in use

Keep reading:

- [Branch expiration](/docs/guides/branch-expiration)
- [Automate branching with GitHub Actions](/docs/guides/branching-github-actions)
- [Plans and billing](/docs/introduction/plans)

## Use pooled connections where they make sense

Connection pooling increases the number of concurrent clients your database can serve (up to 10,000) by reusing a smaller number of backend connections. This reduces connection overhead and improves performance in web and serverless applications.

However, pooled connections are not appropriate for all workloads. Avoid them for:

- Long-running database migrations
- Workloads that rely on session-level state
- Administrative tasks that require persistent connections (e.g., `pg_dump`)
- Logical replication (CDC tools like Fivetran, Airbyte)

Keep reading: [Connection pooling](/docs/connect/connection-pooling)

## Restrict access to production data

Neon's IP Allow feature ensures that only trusted IP addresses can connect to your database, preventing unauthorized access and enhancing security. Combine an allowlist with protected branches for enhanced security.

![IP Allow settings](/docs/get-started/ip_allow_settings.png)

Keep reading: [IP Allow](/docs/introduction/ip-allow)

## Install pg_stat_statements

The [pg_stat_statements extension](/docs/extensions/pg_stat_statements) provides query performance monitoring to track execution times and frequency. Since Neon doesn't log queries and has limited visibility into query performance, this extension helps you troubleshoot issues independently.

```sql
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

The statistics gathered by this extension require little overhead and let you quickly access metrics like:

- [Most frequently executed queries](/docs/postgresql/query-performance#most-frequently-executed-queries)
- [Longest running queries](/docs/postgresql/query-performance#long-running-queries)
- [Queries that return the most rows](/docs/postgresql/query-performance#queries-that-return-the-most-rows)

You can also use the **Monitoring Dashboard** in the Neon Console to view live graphs for system and database metrics like CPU, RAM, and connections.

![Monitoring page connections graph](/docs/introduction/monitor_connections.png)

Keep reading:

- [Query performance](/docs/postgresql/query-performance)
- [Monitoring](/docs/introduction/monitoring)

## Integrate with your existing observability stack

If you already operate an observability platform, you can export Neon metrics and logs to monitor database behavior alongside the rest of your system. This helps you:

- Track connection counts and usage patterns
- Monitor compute and storage growth over time
- Correlate database behavior with application-level events

You can export to any OTLP-compatible platform, Datadog, or Grafana Cloud.

Keep reading:

- [OpenTelemetry export guide](/docs/guides/opentelemetry)
- [Datadog export guide](/docs/guides/datadog)
- [Grafana Cloud export guide](/docs/guides/grafana-cloud)

</Steps>

<NeedHelp/>
