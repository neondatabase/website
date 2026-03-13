---
title: Reduce network transfer costs
subtitle: Monitor and reduce data egress costs
enableTableOfContents: true
summary: >-
  Covers the monitoring and reduction of network transfer (egress) costs in
  Neon, detailing public and private transfer types, common causes of high
  usage, Console and API monitoring options, and strategies to reduce transfer.
updatedOn: '2026-03-09T20:42:56.530Z'
---

Network transfer is one of the usage metrics that affects your Neon bill. This guide explains what network transfer is, what causes it to increase, how to monitor it, and how to reduce it. For broader cost guidance, see [Cost optimization](/docs/introduction/cost-optimization). For plan allowances and pricing, see [Plans](/docs/introduction/plans).

## What is network transfer?

Neon measures data sent from your databases through the [Neon proxy](/docs/introduction/architecture-overview) to clients. All PostgreSQL connections pass through the proxy, including pooled and direct connections, primary computes, and [read replicas](/docs/introduction/read-replicas). All outbound client traffic counts toward network transfer, also known as egress.

There are two types of network transfer:

- **Public network transfer**: Data sent over the public internet. [Logical replication](/docs/guides/logical-replication-neon) to any destination counts as public network transfer.
  - **Free plan**: 5 GB/month included. Exceeding this suspends your compute until the next billing cycle or you upgrade.
  - **Launch / Scale plans**: 100 GB/month included, then $0.10/GB.
- **Private network transfer**: Traffic routed over AWS PrivateLink. Available on the Scale plan only. Billed at $0.01/GB, bi-directional. Unlike public network transfer, which only counts outbound data, private network transfer counts traffic in both directions: data sent from your database to clients and data sent from clients to your database.

In the Console, these appear as **Public network transfer** and **Private network transfer**. In the Consumption API, the fields are `public_network_transfer_bytes` and `private_network_transfer_bytes`. In project and branch detail API responses, the combined field is `data_transfer_bytes`.

## What causes high network transfer?

The following are common causes of increased network transfer in Neon. See [How to monitor](#how-to-monitor-network-transfer) to identify these patterns and [How to reduce](#how-to-reduce-network-transfer) for solutions.

**Large query result sets.** Using `SELECT *`, fetching entire tables without `LIMIT`, missing pagination, or joins that unintentionally multiply rows sends more data than your application needs. ORM defaults can also pull more rows or columns than necessary. This includes queries against [read replicas](/docs/introduction/read-replicas), which pass through the same proxy and count toward network transfer.

**High-frequency repeated queries.** Querying the database on every page render or API request without caching transfers the same data repeatedly. This is common in serverless environments where each invocation starts fresh. Check the `calls` column in `pg_stat_statements` to spot these patterns (see [Diagnosing a spike](#diagnosing-a-spike)).

**Database exports (pg_dump).** Full database dumps transfer the entire database over the network. Running frequent scheduled dumps multiplies the total. Compression flags like `-Fc` do not reduce the data sent from Neon because compression happens client-side after transfer.

**Logical replication.** Replicating data to external destinations produces a continuous outbound stream. Initial table syncs can create large one-time spikes.

**Log export.** Sending Postgres logs to [Datadog](/docs/guides/datadog), [Grafana Cloud](/docs/guides/grafana-cloud), or [OpenTelemetry](/docs/guides/opentelemetry) collectors counts toward network transfer. Logs contain metadata rather than row data, so the volume is typically small relative to other causes.

## How to monitor network transfer

<Admonition type="important">
The Billing page only displays network transfer when usage exceeds the included allowance. To track usage before it results in charges, check the usage panel on the Organization or Project dashboard, or use the Consumption API.
</Admonition>

Paid plans receive a weekly usage report by email that includes network transfer usage and cost.

### Console organization page

The usage panel on the organization **Projects** page always displays current network transfer usage across all projects. Individual project dashboards show network transfer for that project.

![Organization page usage panel showing network transfer](/docs/introduction/dashboard_org_usage.png)

### Console Billing page

Navigate to **Organization > Billing** to see **Public network transfer** and **Private network transfer**. These metrics only appear when your usage exceeds the included allowance and there is an overage charge. For more on the Billing page, see [Monitor billing and usage](/docs/introduction/monitor-usage).

![Billing page showing network transfer charges](/docs/introduction/dashboard_org_billing.png)

### Consumption API for paid plans

<Admonition type="tip">
On the Free plan? Skip to [Project and branch detail APIs](#project-and-branch-detail-apis) for an API option available on all plans.
</Admonition>

The [`/consumption_history/v2/projects`](https://api-docs.neon.tech/reference/getconsumptionhistoryperprojectv2) endpoint provides programmatic access to network transfer metrics on paid plans.

It supports three granularity levels:

| Granularity | Maximum time range |
| ----------- | ------------------ |
| `hourly`    | Last 7 days        |
| `daily`     | Last 60 days       |
| `monthly`   | Last year          |

Use `hourly` granularity to diagnose recent spikes. Data updates approximately every 15 minutes.

<Admonition type="tip">
Consumption API calls do not wake suspended computes, so polling does not increase your compute usage.
</Admonition>

The following example retrieves hourly public and private network transfer for all projects in an organization over a six-day window:

```bash
curl --request GET \
  --url 'https://console.neon.tech/api/v2/consumption_history/v2/projects?org_id=$ORG_ID&from=2026-02-01T00:00:00Z&to=2026-02-07T00:00:00Z&granularity=hourly&metrics=public_network_transfer_bytes,private_network_transfer_bytes' \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer $NEON_API_KEY'
```

<details>
<summary>Response body (partial)</summary>

The response returns one entry per hour for each project, with the requested metrics in each hourly bucket. Metrics with no usage are omitted from the response.

```json
{
  "projects": [
    {
      "project_id": "delicate-dawn-54854667",
      "periods": [
        {
          "period_id": "90c7f107-3fe7-4652-b1da-c61f71043128",
          "period_plan": "launch",
          "period_start": "2026-02-02T18:04:52Z",
          "consumption": [
            {
              "timeframe_start": "2026-02-04T00:00:00Z",
              "timeframe_end": "2026-02-04T01:00:00Z",
              "metrics": [
                {
                  "metric_name": "public_network_transfer_bytes",
                  "value": 8347291
                }
              ]
            },
            {
              "timeframe_start": "2026-02-04T01:00:00Z",
              "timeframe_end": "2026-02-04T02:00:00Z",
              "metrics": [
                {
                  "metric_name": "public_network_transfer_bytes",
                  "value": 1203477
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "pagination": {
    "cursor": "delicate-dawn-54854667"
  }
}
```

</details>

For full details on parameters, pagination, and polling, see [Querying consumption metrics](/docs/guides/consumption-metrics).

### Project and branch detail APIs

The `data_transfer_bytes` field on the [Get project details](https://api-docs.neon.tech/reference/getproject) and [Get branch details](https://api-docs.neon.tech/reference/getprojectbranch) endpoints returns a running total of network transfer for the current billing period. Unlike the [Consumption API](#consumption-api-for-paid-plans), which provides time-windowed breakdowns, this value resets at the start of each billing cycle and is not broken down by hour or day. These endpoints are available on all plans.

**Get project details:**

```bash
curl --request GET \
  --url https://console.neon.tech/api/v2/projects/$PROJECT_ID \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer $NEON_API_KEY'
```

The response includes `data_transfer_bytes` in the project object:

```json
{
  "project": {
    "data_transfer_bytes": 40821459,
    ...
  }
}
```

**Get branch details:**

```bash
curl --request GET \
  --url https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches/$BRANCH_ID \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer $NEON_API_KEY'
```

The response includes `data_transfer_bytes` in the branch object:

```json
{
  "branch": {
    "data_transfer_bytes": 40820887,
    ...
  }
}
```

### Diagnosing a spike

Neon does not provide per-query or per-connection network transfer breakdowns. To identify the source of a spike, use `hourly` granularity from the Consumption API to narrow down the time window, then correlate it with known operations: scheduled `pg_dump` jobs, logical replication initial syncs, application deployments, or changes to query patterns. If you have multiple projects, compare per-project hourly data to isolate which project is responsible. On the Free plan, compare `data_transfer_bytes` across branches using the branch detail API to identify which branch contributes the most. Once you identify the branch, connect to it and run the `pg_stat_statements` queries below to find the top queries.

To find which queries return the most rows, use the [`pg_stat_statements`](/docs/extensions/pg_stat_statements) extension. The `rows` column is not an exact byte count, but queries returning many rows or wide rows (TEXT, JSONB, BYTEA columns) are the most likely contributors to high network transfer.

<Tabs labels={["Total rows", "Rows per execution", "Most frequent", "Longest running"]}>

<TabItem>

Queries that returned the most total rows across all executions:

```sql
SELECT
  query,
  calls,
  rows AS total_rows,
  rows / calls AS avg_rows_per_call
FROM pg_stat_statements
WHERE calls > 0
ORDER BY rows DESC
LIMIT 10;
```

</TabItem>

<TabItem>

Queries that return the most rows per execution, indicating poorly scoped SELECTs or missing pagination:

```sql
SELECT
  query,
  calls,
  rows AS total_rows,
  rows / calls AS avg_rows_per_call
FROM pg_stat_statements
WHERE calls > 0
ORDER BY avg_rows_per_call DESC
LIMIT 10;
```

</TabItem>

<TabItem>

Queries called most often, which compound transfer through volume:

```sql
SELECT
  query,
  calls,
  rows AS total_rows,
  rows / calls AS avg_rows_per_call
FROM pg_stat_statements
WHERE calls > 0
ORDER BY calls DESC
LIMIT 10;
```

</TabItem>

<TabItem>

Queries consuming the most total execution time. Not a direct measure of network transfer, but helps identify problem queries during a spike window:

```sql
SELECT
  query,
  calls,
  rows AS total_rows,
  round(total_exec_time::numeric, 2) AS total_exec_time_ms,
  round((total_exec_time / calls)::numeric, 2) AS avg_exec_time_ms
FROM pg_stat_statements
WHERE calls > 0
ORDER BY total_exec_time DESC
LIMIT 10;
```

</TabItem>

</Tabs>

<Admonition type="tip">
In Neon, [scaling to zero](/docs/introduction/scale-to-zero) clears [`pg_stat_statements`](/docs/extensions/pg_stat_statements) data, so computes that recently woke up already have fresh statistics. For long-running computes, run `SELECT pg_stat_statements_reset();` to start a clean measurement window. This cannot be undone and resets stats for all database roles.
</Admonition>

For wire-level analysis of exact message sizes, see [Elephantshark](https://neon.com/blog/elephantshark-monitor-postgres-network-traffic), an open-source Postgres traffic monitor from Neon.

## How to reduce network transfer

For broader cost reduction strategies across all billing metrics, see [Cost optimization](/docs/introduction/cost-optimization).

**Optimize query results.** Select only the columns you need. Use pagination (`LIMIT`/`OFFSET` or cursor-based) instead of fetching all rows at once. Use SQL aggregations (`SUM`, `COUNT`, `GROUP BY`) to summarize data in the database rather than returning raw rows to your application.

**Reduce pg_dump frequency.** Use [Neon snapshots](/docs/guides/backup-restore) with [scheduled backups](/docs/guides/backup-restore#create-backup-schedules) as a backup alternative that keeps data within Neon. Reserve `pg_dump` for migrations or situations that require an external copy. When you do run `pg_dump`, use `-t` to dump only specific tables, `--exclude-table` to skip large ones, or `--schema-only` if you only need the schema. Note that compression flags (`-Fc`, `-Z`) compress the output file on the client after the data has already been sent from Neon, so they do not reduce your billed network transfer.

**Manage logical replication.** Initial table syncs can produce large spikes in network transfer. Dropping and re-creating a replication slot forces a new full sync, so avoid resetting slots as a troubleshooting step unless necessary. Replicate only the tables or columns you need by using row filters (WHERE clauses) and column lists on [`CREATE PUBLICATION`](https://www.postgresql.org/docs/current/sql-createpublication.html) (PostgreSQL 15+). Monitor replication lag and throughput to understand ongoing transfer volume.

**Use Private Link for internal traffic.** If your application runs in AWS, [Private Networking](/docs/guides/neon-private-networking) (Scale plan) routes traffic over PrivateLink at $0.01/GB instead of $0.10/GB for public network transfer beyond the included allowance.

<Admonition type="tip">
Building a platform on Neon? You can cap per-project network transfer with [consumption limits](/docs/guides/consumption-limits).
</Admonition>

## References

- [Cost optimization](/docs/introduction/cost-optimization): Broader cost reduction strategies across all billing metrics
- [Querying consumption metrics](/docs/guides/consumption-metrics): Full API reference with pagination, polling, and error handling
- [Building a Usage Dashboard with Neon's Consumption API](/guides/usage-dashboard-consumption-api): Example app for visualizing usage metrics
