---
title: Monitor query history
subtitle: View and analyze query history for your Neon database
enableTableOfContents: true
updatedOn: '2025-02-03T20:41:57.343Z'
---

<EarlyAccess />

You can monitor query history for your Neon project from the **Monitoring** page in the Neon Console.

1. In the Neon Console, select a project.
2. Go to **Monitoring**.
3. Select the **Query History** tab.

The query history view shows the top 100 previously run queries for the selected **Branch**, **Compute**, and **Database**. Queries can be sorted by **Frequency** or **Average time**. Use the **Refresh** button to load the latest queries.

![Neon query history tab](/docs/introduction/query_history.png)

The **Query History** view is powered by the `pg_stat_statements` Postgres extension. To run custom queries against the data collected by the `pg_stat_statements`, including your query history, you can use the [Neon SQL Editor](<(/docs/get-started-with-neon/query-with-neon-sql-editor)>) or any SQL client, such as [psql](/docs/connect/query-with-psql-editor).

For details on `pg_stat_statements`, including the data it collects and additional queries you can run, refer to our [pg_stat_statements](/docs/extensions/pg_stat_statements) extension guide.

<Admonition type="note" title="query history retention">
In Neon, data collected by the `pg_stat_statements` extension is not retained when your Neon compute (where Postgres runs) is suspended or restarted. For example, if your compute scales down to zero due to inactivity, your query history is lost. New data will be gathered once your compute restarts.
</Admonition>
