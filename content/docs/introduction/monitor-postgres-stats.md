---
title: Monitor Postgres statistics
subtitle: Monitor your database with the Postgres Cumulative Statistics System and the pg_stat_statements extension
enableTableOfContents: true
---

You can use the [Postgres Cumulative Statistics System](https://www.postgresql.org/docs/current/monitoring-stats.html) and the [pg_stat_statements] extension to monitor what's happening with your database and queries.

- [pg_stat_activity](#pg_stat_activity)
- [pg_stat_statements](#pg_stat_statements)

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