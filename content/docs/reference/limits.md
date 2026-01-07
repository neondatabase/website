---
title: Usage limits
subtitle: Reference for Neon platform limits by plan
enableTableOfContents: true
updatedOn: '2026-01-06T00:00:00.000Z'
---

This page provides a comprehensive reference of all limits in the Neon platform, organized by category. Limits vary by [Neon plan](/docs/introduction/plans) unless otherwise noted. For [Agent plan](/docs/introduction/agent-plan) specific limits, see the [Agent plan limits](#agent-plan-limits) section.

<Admonition type="tip">
Many limits can be increased on request. Contact [Neon Support](/docs/introduction/support) or [Sales](/contact-sales) if you need higher limits for your use case.
</Admonition>

## Storage limits

| Limit                           | Free                                                      | Launch | Scale | Notes                                                     |
| :------------------------------ | :-------------------------------------------------------- | :----- | :---- | :-------------------------------------------------------- |
| Logical data size per branch    | 0.5 GB (shared across project)                            | 16 TB  | 16 TB | Contact [Sales](/contact-sales) to increase               |
| Local disk space for temp files | 20 GiB or 15 GiB × max compute size (whichever is higher) | same   | same  | Used for temporary files during data-intensive operations |

For more information, see [Storage](/docs/introduction/plans#storage) and [Manage computes](/docs/manage/computes).

## Compute limits

| Limit                        | Free                       | Launch            | Scale              | Notes                                              |
| :--------------------------- | :------------------------- | :---------------- | :----------------- | :------------------------------------------------- |
| Concurrently active computes | 20                         | same              | same               | Default branch exempt; contact Support to increase |
| Autoscaling max              | 2 CU (8 GB RAM)            | 16 CU (64 GB RAM) | 16 CU (64 GB RAM)  | -                                                  |
| Fixed compute max            | 2 CU (8 GB RAM)            | 16 CU (64 GB RAM) | 56 CU (224 GB RAM) |                                                    |
| Compute hours                | 100 CU-hours/project/month | Usage-based       | Usage-based        | Free plan limit resets monthly                     |
| Non-default branch compute   | 5 hours/month              | -                 | -                  | Free plan only; default branch exempt              |

Each Compute Unit (CU) provides approximately 4 GB of RAM. For more information, see [Compute](/docs/introduction/plans#compute), [Manage computes](/docs/manage/computes), and [Non-default branch](/docs/manage/branches#non-default-branch).

## Connection limits

| Limit                          | Value                 | Notes                                         |
| :----------------------------- | :-------------------- | :-------------------------------------------- |
| max_connections                | 104–4,000             | Varies by compute size; see table below       |
| Pooled connections (PgBouncer) | 10,000 concurrent     | Across all connections to the pooler endpoint |
| default_pool_size              | 0.9 × max_connections | Per user/database pair                        |
| max_prepared_statements        | 1,000                 | PgBouncer setting                             |
| query_wait_timeout             | 120 seconds           | Max time queries wait in PgBouncer queue      |

### max_connections by compute size (direct connections)

This table shows the Postgres `max_connections` limit for **direct (non-pooled) connections**. If you need more connections, use [connection pooling](/docs/connect/connection-pooling), which supports up to 10,000 concurrent connections.

| Compute Size (CU) | RAM (GB) | max_connections |
| :---------------- | :------- | :-------------- |
| 0.25              | 1        | 104             |
| 0.50              | 2        | 209             |
| 1                 | 4        | 419             |
| 2                 | 8        | 839             |
| 3                 | 12       | 1,258           |
| 4                 | 16       | 1,678           |
| 5                 | 20       | 2,098           |
| 6                 | 24       | 2,517           |
| 7                 | 28       | 2,937           |
| 8                 | 32       | 3,357           |
| 9–56              | 36–224   | 4,000           |

<Admonition type="note">
Seven connections are reserved for Neon's internal `superuser` account. For autoscaling configurations, `max_connections` is calculated based on the formula: `min(max_compute_size, 8 × min_compute_size)`. See [Parameter settings that differ by compute size](/docs/reference/compatibility#parameter-settings-that-differ-by-compute-size) for details.
</Admonition>

For more information, see [Connection pooling](/docs/connect/connection-pooling).

## Project and branch limits

| Limit                           | Free | Launch | Scale | Notes                                                                 |
| :------------------------------ | :--- | :----- | :---- | :-------------------------------------------------------------------- |
| Projects per account            | 100  | 100    | 1,000 | Scale is a soft limit; contact Support to increase                    |
| Branches per project (included) | 10   | 10     | 25    | -                                                                     |
| Max branches per project        | 10   | 5,000  | 5,000 | Contact [Sales](/contact-sales) to increase                           |
| Root branches per project       | 3    | 5      | 25    | Includes production branch, backup branches, and schema-only branches |
| Protected branches              | -    | 2      | 5     | -                                                                     |
| Snapshots                       | 1    | 10     | 10    | Point-in-time copies of root branches                                 |

For more information, see [Manage branches](/docs/manage/branches) and [Neon plans](/docs/introduction/plans#branches).

## Database object limits

| Limit                | Value |
| :------------------- | :---- |
| Databases per branch | 500   |
| Roles per branch     | 500   |

For more information, see [Manage databases](/docs/manage/databases) and [Manage roles](/docs/manage/roles).

## Read replica limits

| Limit                     | Free | Paid Plans | Notes                              |
| :------------------------ | :--- | :--------- | :--------------------------------- |
| Read replicas per project | 3    | -          | Each replica is a separate compute |

For more information, see [Read replicas](/docs/introduction/read-replicas).

## Replication limits

| Limit                 | Value | Notes                                   |
| :-------------------- | :---- | :-------------------------------------- |
| max_wal_senders       | 10    | Maximum concurrent WAL sender processes |
| max_replication_slots | 10    | Maximum replication slots per branch    |

<Admonition type="important">
Neon automatically removes inactive replication slots after a period of time if there are other active replication slots. See [Unused replication slots](/docs/guides/logical-replication-neon#unused-replication-slots) for details.
</Admonition>

For more information, see [Logical replication](/docs/guides/logical-replication-guide).

## API limits

| Limit                            | Value                | Notes                    |
| :------------------------------- | :------------------- | :----------------------- |
| API requests                     | 700/minute (~11/sec) | Per account              |
| Burst rate                       | 40 requests/sec      | Per route, per account   |
| Recommended API keys per account | Under 10,000         | No strict limit enforced |

If you exceed the rate limit, you'll receive an HTTP 429 (Too Many Requests) error. Contact [Support](/docs/introduction/support) if you need higher limits.

For more information, see [Neon API](/docs/reference/api-reference) and [Manage API keys](/docs/manage/api-keys).

## Network transfer limits

| Limit                            | Free       | Launch                | Scale                 | Notes                           |
| :------------------------------- | :--------- | :-------------------- | :-------------------- | :------------------------------ |
| Public network transfer (egress) | 5 GB/month | 100 GB/month included | 100 GB/month included | Overage: $0.10/GB on paid plans |

Public network transfer includes data sent via logical replication to any destination, including other Neon databases.

For more information, see [Public network transfer](/docs/introduction/plans#public-network-transfer).

## Time-based limits

| Limit                 | Free               | Launch              | Scale              | Notes                                               |
| :-------------------- | :----------------- | :------------------ | :----------------- | :-------------------------------------------------- |
| Restore window        | 6 hours (1 GB cap) | Up to 7 days        | Up to 30 days      | Configurable; controls how far back you can restore |
| Monitoring retention  | 1 day              | 3 days              | 14 days            | Metrics history in the Monitoring dashboard         |
| Scale to zero timeout | 5 min (fixed)      | 5 min (can disable) | 1 min to always-on | Time before idle compute suspends                   |

For more information, see [Restore window](/docs/introduction/restore-window), [Monitoring dashboard](/docs/introduction/monitoring-page), and [Scale to zero](/docs/introduction/scale-to-zero).

## Authentication limits (Neon Auth)

| Limit                      | Free   | Launch    | Scale     | Notes                                            |
| :------------------------- | :----- | :-------- | :-------- | :----------------------------------------------- |
| Monthly Active Users (MAU) | 60,000 | 1,000,000 | 1,000,000 | Contact [Sales](/contact-sales) if you need more |

An MAU is a unique user who authenticates at least once during a monthly billing period.

For more information, see [Neon Auth](/docs/auth/overview).

## Query and request size limits

| Limit                       | Value | Notes                                                          |
| :-------------------------- | :---- | :------------------------------------------------------------- |
| HTTP query request/response | 64 MB | Maximum size for queries over HTTP using the serverless driver |

For more information, see [Neon serverless driver](/docs/serverless/serverless-driver).

## Configurable quotas

These quotas can be configured per project using the [Neon API](/docs/reference/api-reference) to control resource consumption:

| Quota                  | Scope   | Description                                                   |
| :--------------------- | :------ | :------------------------------------------------------------ |
| `active_time_seconds`  | Project | Maximum compute active time per billing period                |
| `compute_time_seconds` | Project | Maximum CPU seconds across all computes                       |
| `written_data_bytes`   | Project | Maximum data written across all branches                      |
| `data_transfer_bytes`  | Project | Maximum egress data transferred                               |
| `logical_size_bytes`   | Branch  | Maximum logical size for a branch (strict limit, not monthly) |

When a quota is reached, active computes for the project are suspended until the next billing period or until the quota is increased.

For more information, see [Configure consumption limits](/docs/guides/consumption-limits).

---

## Agent plan limits

The [Agent plan](/docs/introduction/agent-plan) is designed for AI agent platforms that provision thousands of databases. It includes custom limits and dedicated support.

| Limit                         | Value            | Notes                                   |
| :---------------------------- | :--------------- | :-------------------------------------- |
| Projects per organization     | 30,000 (default) | Can be increased on request             |
| Project transfers per request | 400              | When transferring between organizations |
| Free organization projects    | Up to 30,000     | Sponsored by Neon at no cost            |

### Agent plan organization limits

Agent plan organizations have different limits than standard plans:

| Limit                     | Free Organization | Paid Organization |
| :------------------------ | :---------------- | :---------------- |
| Max branches per project  | 10                | 1,000             |
| Max snapshots per project | 1                 | 10                |
| Compute range             | 0.25–2 CU         | 0.25–16 CU        |
| Restore window            | 1 day             | Up to 7 days      |
| Min autosuspend timeout   | 5 minutes         | 1 minute          |

For more information, see [Agent plan](/docs/introduction/agent-plan) and [AI agent integration](/docs/guides/ai-agent-integration).

<NeedHelp/>
