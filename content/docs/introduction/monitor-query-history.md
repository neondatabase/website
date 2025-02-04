---
title: Monitoring query history
subtitle: Monitor query history for your database
enableTableOfContents: true
updatedOn: '2025-02-03T20:41:57.343Z'
---

You can monitor the query history for your Neon project from the **Monitoring** page in the Neon Console.

1. In the Neon Console, select a project.
2. Select **Monitoring**.
3. Select the **Query history** tab.

You can select the **Branch**, **Compute**, and **Database** that you want to view the query history for. Queries can be ordered by **Frequency** or **Average time**. Use the Refresh button the the very latest queries from your history.

![neon query history tab](/docs/inntroduction/query_history.png)

The **Query History** view uses the `pg_stat_statements` Postgres extension, which is installed to your Neon project by default. If you want to run different queries against your query history, you can do so from the Neon SQL Editor or any SQL client.

For information about using the Neon SQL Editor, see [Query with Neon's SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor). For information about using the `psql` client with Neon, see [Connect with psql](/docs/connect/query-with-psql-editor).

For more information about the `pg_stat_statements` Postgres extension, the data it collects, and other queries you can run, see [pg_stat_statements](/docs/extensions/pg_stat_statements) extension.
