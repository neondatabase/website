---
title: Getting ready for production
subtitle: 'Guidelines to optimize price, performance, and reliability'
summary: >-
  A production readiness checklist for Lakebase Postgres on Neon covering plan selection,
  region placement, autoscaling limits, branch protection, and connection
  pooling. Use this page when moving a Neon project out of development. It
  covers scale-to-zero tradeoffs, instant restore history windows, snapshot
  schedules, IP Allow, pg_stat_statements for query monitoring, and metric
  exports to Datadog, Grafana, or any OTEL-compatible platform.
enableTableOfContents: true
redirectFrom:
  - /docs/get-started-with-neon/production-checklist
updatedOn: '2026-11-24T10:56:47.700Z'
---

<CheckList title="Production checklist">

<CheckItem title="1. Use a paid plan for production workloads" href="#use-a-paid-plan-for-production-workloads">
  Paid plans are usage-based, so your app won't stop or be limited as it grows. The Free plan includes compute hour limits, making it better suited for prototyping.
</CheckItem>
<CheckItem title="2. Choose a region close to your application" href="#choose-a-region-close-to-your-application">
  Deploy your Neon project in the nearest available region to your application to minimize network latency.
</CheckItem>
<CheckItem title="3. Keep your production branch as the default" href="#keep-your-production-branch-as-the-default-root-branch">
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
<CheckItem title="8. Size the history window for instant restore" href="#size-the-history-window-for-instant-restore">
  On paid plans, Neon keeps 1 day of change history by default for **instant restore**. Increasing the history window gives more recovery depth, with storage tradeoffs.
</CheckItem>
<CheckItem title="9. Consider snapshot schedules" href="#consider-snapshot-schedules">
  Snapshot schedules provide consistent backups for point-in-time restore, independently of your history window.
</CheckItem>
<CheckItem title="10. Test your restore workflow" href="#test-your-restore-workflow">
  Plan whether you'll restore in place or from a snapshot, and how your application will switch if needed.
</CheckItem>
<CheckItem title="11. Clean up your branches regularly" href="#clean-up-your-branches-regularly">
  Set branch expiration times and add cleanup logic to automated workflows to avoid unnecessary storage costs and stay under the active compute limit.
</CheckItem>
<CheckItem title="12. Use pooled connections where they make sense" href="#use-pooled-connections-where-they-make-sense">
  Connection pooling improves concurrency for web and serverless apps, but may not be appropriate for migrations or long-running tasks.
</CheckItem>
<CheckItem title="13. Set session timeouts" href="#set-session-timeouts">
  Timeouts close abandoned sessions and stop runaway queries before they use up your connection limit.
</CheckItem>
<CheckItem title="14. Restrict access to production data" href="#restrict-access-to-production-data">
  Limit database access to trusted sources using IP Allow to reduce the risk of unauthorized changes.
</CheckItem>
<CheckItem title="15. Install pg_stat_statements" href="#install-pgstatstatements">
  Query execution times and frequency yourself with SQL or `neon inspect`. The Console's Query performance view works without it.
</CheckItem>
<CheckItem title="16. Export metrics and logs, and set alerts" href="#export-metrics-and-logs-and-set-alerts">
  Export Neon metrics and Postgres logs to Datadog, Grafana, or any OTEL-compatible platform, and alert on connection counts before you run out.
</CheckItem>
<CheckItem title="17. Monitor replication slots if you use logical replication" href="#monitor-replication-slots-if-you-use-logical-replication">
  Neon removes inactive replication slots after about 40 hours. Watch slot lag and plan how your CDC tool will resync.
</CheckItem>
<CheckItem title="18. Configure read replicas for long-running queries" href="#configure-read-replicas-for-long-running-queries">
  Set `hot_standby_feedback` or a standby delay on replicas that run long queries, so they aren't canceled by conflicts with recovery.
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

- **Minimum compute size**: Set a minimum high enough so your working set (frequently accessed data) can be fully cached in memory. This is important because Neon's [compute cache](/docs/reference/glossary#compute-cache) is tied to your compute size. When the compute scales down and the cache shrinks, frequently accessed data may be evicted and need to be reloaded from storage, which impacts performance.

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

If occasional cold starts are acceptable for your application (for example, for internal tools), leaving scale-to-zero enabled will be the most cost-effective choice.

Consider disabling scale-to-zero if:

- Your application requires consistently low latency
- Cold-start delays are unacceptable for user-facing requests
- You rely on long-lived sessions or in-memory state

Keep reading: [Scale to zero configuration](/docs/guides/scale-to-zero-guide)

## Test connection retries using the Neon API

In a serverless architecture, brief connection interruptions can occur during scaling events or maintenance. Most database drivers and connection pools already implement retry logic for transient failures, but rather than assuming this works, you should test it.

Our recommended approach:

- Use the Neon Console, CLI, or API to trigger a compute restart
- Observe how your application behaves during the restart
- Confirm that connections are re-established automatically without user-facing errors

```bash
curl --request POST \
     --url https://console.neon.tech/api/v2/projects/{project_id}/endpoints/{endpoint_id}/restart \
     --header 'accept: application/json' \
     --header "authorization: Bearer $NEON_API_KEY"
```

With the Neon CLI:

```bash
neon postgres computes restart <endpoint_id> --project-id <project_id>
```

Keep reading:

- [Restart a compute](/docs/manage/computes#restart-a-compute)
- [Build connection timeout handling into your application](/docs/connect/connection-latency#build-connection-timeout-handling-into-your-application)
- [Maintenance and updates overview](/docs/manage/maintenance-updates-overview)

## Size the history window for instant restore

**[Instant restore](/docs/postgres/backup-restore/branch-restore)** lets you roll a branch's database timeline back in time. How far back you can go depends on the **history window** you configure (under **Settings → Postgres**). On paid plans, the default history window is 1 day, which you can increase up to 7 days on Launch or 30 days on Scale.

A longer history window gives you more flexibility to recover from bugs discovered later or accidental data loss. However, longer windows retain more change history, which increases **History** usage on your bill. Choose a window that balances recovery needs with predictable storage costs.

Keep reading: [Storage and billing for instant restore](/docs/postgres/backup-restore/history-window#storage-and-billing)

## Consider snapshot schedules

Snapshot schedules provide regular, durable restore points taken daily, weekly, or monthly. While **[instant restore](/docs/postgres/backup-restore/branch-restore)** lets you roll back to any moment still inside your **history window**, snapshots capture stable points in time that you can return to later, ensuring that recovery points exist even if they fall outside your chosen history window.

Snapshot schedules are only available on [root branches](/docs/manage/branches#root-branch).

![Snapshot schedule](/docs/guides/backup_restore_ui.png)

Keep reading: [Snapshot schedules](/docs/guides/backup-restore#create-backup-schedules)

## Test your restore workflow

Don't wait for an incident to learn how restore works. Plan and test your recovery process in advance.

**Database restore** (Postgres + Managed Better Auth) uses Neon's built-in capabilities:

- [Instant branch restores](/docs/guides/backup-restore#instantly-restore-a-branch), where the existing branch is restored to a previous state
- [Restore from a snapshot into the same branch](/docs/guides/backup-restore#one-step-restore)
- [Restore from a snapshot into a new branch](/docs/guides/backup-restore#multi-step-restore)

Plan and test which restore method you will use for production incidents, how your application will switch connections if a new branch is created, and how you will validate restored data before resuming traffic.

## Clean up your branches regularly

Neon's branching makes it easy to create preview, test, and temporary environments. Over time, unused branches can accumulate and contribute to unnecessary storage usage. To keep costs and complexity under control:

- Set expiration times for preview and test branches
- Add explicit delete steps to automated branching workflows
- Periodically review and remove branches that are no longer in use

Active computes on non-default branches also count toward your project's [concurrently active compute limit](/docs/manage/computes#concurrently-active-compute-limit). If you create a preview branch per pull request, cleanup keeps new previews from failing when the limit is reached.

Keep reading:

- [Branch expiration](/docs/guides/branch-expiration)
- [Automate branching with GitHub Actions](/docs/guides/branching-github-actions)
- [Plans and billing](/docs/introduction/plans)

## Use pooled connections where they make sense

Connection pooling increases the number of concurrent clients your database can serve (up to 10,000) by reusing a smaller number of backend connections. This reduces connection overhead and improves performance in web and serverless applications.

However, pooled connections are not appropriate for all workloads. Avoid them for:

- Long-running database migrations
- Workloads that rely on session-level state
- Administrative tasks that require persistent connections (for example, `pg_dump`)
- Logical replication (CDC tools like Fivetran, Airbyte)

Keep reading: [Connection pooling](/docs/connect/connection-pooling)

## Set session timeouts

Each compute has a `max_connections` limit based on its size. Sessions that an application opens and never closes, or leaves idle inside a transaction, keep using connection slots. When all slots are in use, new connections fail with `remaining connection slots are reserved` on both direct and pooled connection strings, and you need to restart the compute to get back in.

Set timeouts so Postgres cleans these sessions up for you:

- `idle_in_transaction_session_timeout` closes sessions that sit idle inside an open transaction. Neon sets it to 5 minutes by default.
- `idle_session_timeout` closes sessions that sit idle outside a transaction. Use it for direct connections from apps that leak connections, not for connection pools that keep connections open on purpose.
- `statement_timeout` cancels queries that run longer than you expect.
- `lock_timeout` stops a statement from waiting on a lock indefinitely.

You can set these for a role or database with `ALTER ROLE` or `ALTER DATABASE`, or for the whole compute with the Neon API. For example, to cap queries from your application role at 60 seconds:

```sql
ALTER ROLE app_user SET statement_timeout = '60s';
```

Keep reading:

- [Configure Postgres parameters for a compute](/docs/reference/compatibility#configure-postgres-parameters-for-a-compute)
- [Remaining connection slots are reserved for roles with the SUPERUSER attribute](/docs/connect/connection-errors#remaining-connection-slots-are-reserved-for-roles-with-the-superuser-attribute)

## Restrict access to production data

Neon's IP Allow feature ensures that only trusted IP addresses can connect to your database, preventing unauthorized access and enhancing security. Combine an allowlist with protected branches for enhanced security. IP Allow restricts Postgres connections only: it doesn't protect the Data API, Realtime, Managed Better Auth, Object Storage, the AI Gateway, or Function URLs, and Realtime and Managed Better Auth also stop working while it's enabled. See [IP Allow and other Neon services](/docs/introduction/ip-allow#ip-allow-and-other-neon-services).

![IP Allow settings](/docs/get-started/ip_allow_settings.png)

Keep reading: [IP Allow](/docs/introduction/ip-allow)

## Install pg_stat_statements

The [pg_stat_statements extension](/docs/extensions/pg_stat_statements) tracks how often each query runs and how long it takes. The Console's [Query performance](/docs/introduction/monitor-query-performance) view shows this data without any setup. Install the extension in your database to query the statistics yourself with SQL or to use [`neon inspect`](/docs/cli/inspect):

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

## Export metrics and logs, and set alerts

On the Scale plan, you can export Neon metrics and Postgres logs to an observability platform to monitor database behavior alongside the rest of your system. Set this up before you need it, because the integration only exports logs from the time you turn it on. Exporting helps you:

- Track connection counts and usage patterns
- Monitor compute and storage growth over time
- Correlate database behavior with application-level events
- Keep a record of who connected. Postgres logs every connection and disconnection by default (`log_connections` and `log_disconnections`), and those lines are exported with your other Postgres logs.

Set an alert on the `neon_connection_counts` metric at a threshold below your compute's `max_connections`, so you hear about connection buildup before your application hits the limit. To also log slow queries, set `log_min_duration_statement` for the compute. See [Log slow queries](/docs/reference/metrics-logs#log-slow-queries).

You can export to any OTLP-compatible platform, Datadog, or Grafana Cloud.

Keep reading:

- [OpenTelemetry export guide](/docs/guides/opentelemetry)
- [Datadog export guide](/docs/guides/datadog)
- [Grafana Cloud export guide](/docs/guides/grafana-cloud)
- [Metrics and logs reference](/docs/reference/metrics-logs)

## Monitor replication slots if you use logical replication

If you replicate data out of Neon with a CDC tool, such as Fivetran, Airbyte, or Debezium, each subscriber uses a replication slot. To prevent storage bloat, Neon removes replication slots that are inactive for about 40 hours. If your CDC tool is down for longer than that, for example during a vendor outage, its slot is removed and the tool needs a full resync.

To prepare:

- Monitor replication lag and alert when a slot stops making progress, so you can act before it's removed.
- Remove slots for subscribers you no longer use.
- Know how your CDC tool runs a full resync, and how long it takes for your data size.

Keep reading:

- [Unused replication slots](/docs/guides/logical-replication-neon#unused-replication-slots)
- [Manage logical replication](/docs/guides/logical-replication-manage)

## Configure read replicas for long-running queries

A read replica applies changes from the primary compute as they arrive. If a change conflicts with a query that's running on the replica, such as a vacuum removing rows the query still needs, Postgres cancels the query with `canceling statement due to conflict with recovery`.

If you run long analytical or reporting queries on a replica, set one of these parameters on the replica compute with the Neon API:

- `hot_standby_feedback` set to `on` tells the primary not to remove rows the replica's queries still need. This prevents most cancellations, but can increase table bloat on the primary while long queries run.
- `max_standby_streaming_delay` lets the replica delay applying changes for up to the time you set, so queries can finish first. The replica falls behind the primary during that delay.

Keep reading:

- [Configure Postgres parameters for a compute](/docs/reference/compatibility#configure-postgres-parameters-for-a-compute)
- [Read replicas](/docs/introduction/read-replicas)

</Steps>

<NeedHelp/>
