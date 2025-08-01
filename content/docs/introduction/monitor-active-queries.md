---
title: Monitor active queries
subtitle: View and analyze running queries in your database
enableTableOfContents: true
updatedOn: '2025-03-05T21:09:38.753Z'
---

You can monitor active queries for your Neon project from the **Monitoring** page in the Neon Console.

1. In the Neon Console, select a project.
2. Go to **Monitoring**.
3. Select the **Active Queries** tab.

The **Active Queries** view displays up to 100 currently running queries for the selected **Branch**, **Compute**, and **Database**. Use the **Refresh** button to update the list with the latest active queries.

![Neon active queries tab](/docs/introduction/active_queries.png)

The **Active Queries** view is powered by the `pg_stat_activity` Postgres system view, which is available in Neon by default. To run custom queries against the data collected by `pg_stat_activity`, you can use the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) or any SQL client, such as [psql](/docs/connect/query-with-psql-editor).

For details on `pg_stat_activity`, see [pg_stat_activity](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ACTIVITY-VIEW) in the PostgreSQL documentation.

<Admonition type="note" title="active queries retention">
In Neon, the `pg_stat_activity` system view only holds data on currently running queries. Once a query completes, it no longer appears in the **Active Queries** view. If your Neon compute scales down to zero due to inactivity, there will be no active queries until a new connection is established and a query is run.
</Admonition>
