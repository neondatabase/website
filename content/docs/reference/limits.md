---
title: Usage limits
subtitle: Reference for Neon platform limits by plan
enableTableOfContents: true
updatedOn: '2026-01-06T00:00:00.000Z'
---

Find all Neon platform limits below, organized by category. Limits vary by [plan](/docs/introduction/plans) unless otherwise noted.

## Project and branch limits

| Limit                           | Free | Launch | Scale | Notes                                                                 |
| :------------------------------ | :--- | :----- | :---- | :-------------------------------------------------------------------- |
| Projects per account            | 100  | 100    | 1,000 | Scale is a soft limit; contact Support to increase                    |
| Branches per project (included) | 10   | 10     | 25    | Additional branches billed separately on paid plans                   |
| Max branches per project        | 10   | 5,000  | 5,000 | Can be increased on request                                           |
| Root branches per project       | 3    | 5      | 25    | Includes production branch, backup branches, and schema-only branches |
| Protected branches              | N/A  | 2      | 5     | -                                                                     |
| Snapshots                       | 1    | 10     | 10    | Point-in-time copies of root branches                                 |

For more information, see [Neon plans](/docs/introduction/plans) and [Manage branches](/docs/manage/branches).

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
| Fixed compute max            | 2 CU (8 GB RAM)            | 16 CU (64 GB RAM) | 56 CU (224 GB RAM) | -                                                  |
| Compute hours                | 100 CU-hours/project/month | Usage-based       | Usage-based        | Free plan limit resets monthly                     |

Each Compute Unit (CU) provides approximately 4 GB of RAM. For more information, see [Compute](/docs/introduction/plans#compute) and [Manage computes](/docs/manage/computes).

## Connection limits

| Limit                          | Value                 | Notes                                         |
| :----------------------------- | :-------------------- | :-------------------------------------------- |
| Postgres `max_connections`     | 104–4,000             | Varies by compute size                        |
| Pooled connections (PgBouncer) | 10,000 concurrent     | Across all connections to the pooler endpoint |
| default_pool_size              | 0.9 × max_connections | Per user/database pair                        |
| max_prepared_statements        | 1,000                 | PgBouncer setting                             |
| query_wait_timeout             | 120 seconds           | Max time queries wait in PgBouncer queue      |

### Connection type comparison

| Connection Type | Max Connections | Notes                                         |
| :-------------- | :-------------- | :-------------------------------------------- |
| Direct          | 104–4,000       | Standard Postgres TCP; varies by compute size |
| Pooled          | 10,000          | Via PgBouncer                                 |

Direct connections are limited by the Postgres `max_connections` parameter, which scales with compute size. For the formula and detailed breakdown, see [Parameter settings that differ by compute size](/docs/reference/compatibility#parameter-settings-that-differ-by-compute-size).

For more information, see [Connection pooling](/docs/connect/connection-pooling).

## Database object limits

| Limit                | Value |
| :------------------- | :---- |
| Databases per branch | 500   |
| Roles per branch     | 500   |

For more information, see [Manage databases](/docs/manage/databases) and [Manage roles](/docs/manage/roles).

## Time-based limits

| Limit                 | Free               | Launch              | Scale              | Notes                                               |
| :-------------------- | :----------------- | :------------------ | :----------------- | :-------------------------------------------------- |
| Restore window        | 6 hours (1 GB cap) | Up to 7 days        | Up to 30 days      | Configurable; controls how far back you can restore |
| Monitoring retention  | 1 day              | 3 days              | 14 days            | Metrics history in the Monitoring dashboard         |
| Scale to zero timeout | 5 min (fixed)      | 5 min (can disable) | 1 min to always-on | Time before idle compute suspends                   |

For more information, see [Restore window](/docs/introduction/restore-window), [Monitoring dashboard](/docs/introduction/monitoring-page), and [Scale to zero](/docs/introduction/scale-to-zero).

## Network transfer limits

| Limit                            | Free       | Launch                | Scale                 | Notes                           |
| :------------------------------- | :--------- | :-------------------- | :-------------------- | :------------------------------ |
| Public network transfer (egress) | 5 GB/month | 100 GB/month included | 100 GB/month included | Overage: $0.10/GB on paid plans |

Public network transfer includes data sent via logical replication to any destination, including other Neon databases.

For more information, see [Public network transfer](/docs/introduction/plans#public-network-transfer).

## Read replica limits

| Limit                     | Free | Launch   | Scale    | Notes                              |
| :------------------------ | :--- | :------- | :------- | :--------------------------------- |
| Read replicas per project | 3    | No limit | No limit | Each replica is a separate compute |

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

## Authentication limits (Neon Auth)

| Limit                      | Free   | Launch    | Scale     | Notes                                            |
| :------------------------- | :----- | :-------- | :-------- | :----------------------------------------------- |
| Monthly Active Users (MAU) | 60,000 | 1,000,000 | 1,000,000 | Contact [Sales](/contact-sales) if you need more |

An MAU is a unique user who authenticates at least once during a monthly billing period.

For more information, see [Neon Auth](/docs/auth/overview).

## Serverless driver limits

| Limit                      | Value | Notes                                           |
| :------------------------- | :---- | :---------------------------------------------- |
| HTTP request/response size | 64 MB | Queries over HTTP only; WebSockets not affected |

For more information, see [Neon serverless driver](/docs/serverless/serverless-driver).

## Configurable quotas

If you need to set your own resource limits (for example, to control costs or manage sub-users in a multi-tenant application), see [Configure consumption limits](/docs/guides/consumption-limits).

---

## Agent plan limits

The [Agent plan](/docs/introduction/agent-plan) is designed for AI agent platforms that provision thousands of databases. It includes custom limits and dedicated support. For Agent plan limits, see [Agent plan](/docs/introduction/agent-plan).

<NeedHelp/>
