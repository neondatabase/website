---
title: Querying consumption metrics
subtitle: Learn how to query project and account consumption metrics using the Neon API
redirectFrom:
  - /docs/guides/metrics-api
  - /docs/guides/partner-consumption-metrics
enableTableOfContents: true
updatedOn: '2026-01-07T12:02:47.902Z'
---

Using the Neon API, you can query a range of account-level and project-level metrics to help you track your resource consumption. Issuing calls to these APIs does not wake a project's compute endpoints.

Here are the different ways to retrieve these metrics:

| Endpoint                                                                                                         | Description                                                                                                           | Plan availability                                                  |
| ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| [Get account consumption metrics](https://api-docs.neon.tech/reference/getconsumptionhistoryperaccount)          | Aggregates all metrics from all projects in an account into a single cumulative number for each metric                | Scale, Enterprise and legacy Scale, Business, and Enterprise plans |
| [Get consumption metrics for each project](https://api-docs.neon.tech/reference/getconsumptionhistoryperproject) | Provides detailed metrics for each project in an account at a specified granularity level (hourly, daily, or monthly) | Scale and Enterprise plans                                         |

<Admonition type="info">
**Date format:** Both endpoints require timestamps in RFC 3339 format, which looks like `2024-06-30T15:30:00Z`. This format includes the date, time, and timezone (the `Z` indicates UTC). You can use this [timestamp converter](https://it-tools.tech/date-converter) to generate RFC 3339 formatted timestamps.

**Important:** Consumption history is available starting from March 1, 2024, at 00:00:00 UTC. You cannot query consumption data before this date.
</Admonition>

## Get account-level aggregated metrics

Using the [Get account consumption metrics API](https://api-docs.neon.tech/reference/getconsumptionhistoryperaccount), you can find total usage across all projects in your organization. This endpoint provides a comprehensive view of consumption metrics accumulated for the billing period.

<Admonition type="note">
These metrics are not fully aligned with Neon's current [usage-based pricing plans](/docs/introduction/plans). For pricing metrics that fully align with Neon's usage-based pricing plans, use the [Retrieve project consumption metrics](#get-project-level-metrics-usage-based-pricing-plans) endpoint.
</Admonition>

API endpoint:

```bash
GET https://console.neon.tech/api/v2/consumption_history/account
```

<Admonition type="tip">
You can run this endpoint interactively in the [Neon API Reference](https://api-docs.neon.tech/reference/getconsumptionhistoryperaccount)—just fill in the required parameters and add your API key to see live results.
</Admonition>

This endpoint accepts the following query parameters:

### Required parameters

- **`from`** (date-time, required) — Start date-time for the consumption period in [RFC 3339](https://www.rfc-editor.org/rfc/rfc3339) format. The value is rounded according to the specified granularity.

- **`to`** (date-time, required) — End date-time for the consumption period in RFC 3339 format. The value is rounded according to the specified granularity.

- **`granularity`** (string, required) — The granularity of consumption metrics. Options:
  - `hourly` — Limited to the last 168 hours (7 days)
  - `daily` — Limited to the last 60 days
  - `monthly` — Limited to the past year

### Optional parameters

- **`org_id`** (string, required) — Specify the organization for which consumption metrics should be returned.

- **`metrics`** (array of strings) — Specify which metrics to include in the response. If omitted, `active_time_seconds`, `compute_time_seconds`, `written_data_bytes`, and `synthetic_storage_size_bytes` are returned.

  Available metrics (not fully aligned with usage-based pricing):
  - `active_time_seconds`
  - `compute_time_seconds`
  - `written_data_bytes`
  - `synthetic_storage_size_bytes`
  - `data_storage_bytes_hour`
  - `logical_size_bytes`
  - `logical_size_bytes_hour`

  You can specify metrics as an array or as a comma-separated list:

  ```
  # As an array
  metrics=active_time_seconds&metrics=compute_time_seconds

  # As a comma-separated list
  metrics=active_time_seconds,compute_time_seconds
  ```

### Example request

```bash shouldWrap
curl --request GET \
  --url 'https://console.neon.tech/api/v2/consumption_history/account?from=2024-06-30T00:00:00Z&to=2024-07-02T00:00:00Z&granularity=daily&org_id=org-ocean-art-12345678' \
  --header 'accept: application/json' \
  --header 'authorization: Bearer $NEON_API_KEY'
```

<details>
<summary>Response body</summary>

For attribute definitions, see the [Retrieve account consumption metrics](https://api-docs.neon.tech/reference/getconsumptionhistoryperaccount) endpoint in the [Neon API Reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api).

```json
{
  "periods": [
    {
      "period_id": "random-period-abcdef",
      "period_plan": "scale",
      "period_start": "2024-06-01T00:00:00Z",
      "period_end": "2024-07-01T00:00:00Z",
      "consumption": [
        {
          "timeframe_start": "2024-06-30T00:00:00Z",
          "timeframe_end": "2024-07-01T00:00:00Z",
          "active_time_seconds": 147452,
          "compute_time_seconds": 43215,
          "written_data_bytes": 111777920,
          "synthetic_storage_size_bytes": 41371988928
        },
        {
          "timeframe_start": "2024-07-01T00:00:00Z",
          "timeframe_end": "2024-07-02T00:00:00Z",
          "active_time_seconds": 147468,
          "compute_time_seconds": 43223,
          "written_data_bytes": 110483584,
          "synthetic_storage_size_bytes": 41467955616
        }
      ]
    }
  ]
}
```

</details>

## Get project-level metrics (usage-based pricing plans)

Using the [Retrieve project consumption metrics](https://api-docs.neon.tech/reference/getconsumptionhistoryperproject) endpoint, you can get detailed metrics for each project in your account, broken down by the specified granularity level. This endpoint returns metrics aligned with Neon's current [usage-based pricing plans](/docs/introduction/plans).

API endpoint:

```bash
GET https://console.neon.tech/api/v2/consumption_history/projects
```

<Admonition type="tip">
You can run this endpoint interactively in the [Neon API Reference](https://api-docs.neon.tech/reference/getconsumptionhistoryperproject)—just fill in the required parameters and add your API key to see live results.
</Admonition>

This endpoint accepts the following query parameters:

### Required parameters

- **`from`** (date-time, required) — Start date-time for the consumption period in [RFC 3339](https://www.rfc-editor.org/rfc/rfc3339) format. The value is rounded according to the specified granularity.

- **`to`** (date-time, required) — End date-time for the consumption period in RFC 3339 format. The value is rounded according to the specified granularity.

- **`granularity`** (string, required) — The granularity of consumption metrics. Options:
  - `hourly` — Limited to the last 168 hours (7 days)
  - `daily` — Limited to the last 60 days
  - `monthly` — Limited to the past year

### Optional parameters

- **`project_ids`** (array of strings, 0-100 items) — Filter the response to specific project IDs. If omitted, all projects are included. Can be specified as an array or comma-separated list:

  ```
  # As an array
  project_ids=cold-poetry-09157238&project_ids=quiet-snow-71788278

  # As a comma-separated list
  project_ids=cold-poetry-09157238,quiet-snow-71788278
  ```

- **`org_id`** (string, required) — Specify the organization for which project consumption metrics should be returned.

- **`metrics`** (array of strings) — Specify which metrics to include in the response.

  Available metrics for usage-based pricing plans:
  - `compute_unit_seconds` — Compute usage measured in Compute Unit-seconds
  - `root_branch_bytes_month` — Storage for root (production) branches
  - `child_branch_bytes_month` — Storage for child (development) branches
  - `instant_restore_bytes_month` — Point-in-time restore storage (WAL data)
  - `public_network_transfer_bytes` — Data transfer over public internet
  - `private_network_transfer_bytes` — Data transfer over AWS PrivateLink

  Legacy metrics (for older billing plans):
  - `active_time_seconds`
  - `compute_time_seconds`
  - `written_data_bytes`
  - `synthetic_storage_size_bytes`
  - `data_storage_bytes_hour`
  - `logical_size_bytes`
  - `logical_size_bytes_hour`

- **`limit`** (integer, 1-100) — Number of projects to include in the response. Default: `10`.

- **`cursor`** (string) — Cursor value from the previous response to get the next batch of projects. See [Pagination](#pagination) for details.

### Example request

```shouldWrap
curl --request GET \
  --url 'https://console.neon.tech/api/v2/consumption_history/projects?from=2024-06-30T00:00:00Z&to=2024-07-02T00:00:00Z&granularity=daily&org_id=org-ocean-art-12345678&limit=10' \
  --header 'accept: application/json' \
  --header 'authorization: Bearer $NEON_API_KEY'
```

<details>
<summary>Response body</summary>

For attribute definitions, see the [Retrieve project consumption metrics](https://api-docs.neon.tech/reference/getconsumptionhistoryperproject) endpoint in the [Neon API Reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api).

```json
{
  "projects": [
    {
      "project_id": "random-project-123456",
      "periods": [
        {
          "period_id": "random-period-abcdef",
          "period_plan": "scale",
          "period_start": "2024-06-01T00:00:00Z",
          "period_end": "2024-07-01T00:00:00Z",
          "consumption": [
            {
              "timeframe_start": "2024-06-30T00:00:00Z",
              "timeframe_end": "2024-07-01T00:00:00Z",
              "active_time_seconds": 147472,
              "compute_time_seconds": 43222,
              "written_data_bytes": 112730864,
              "synthetic_storage_size_bytes": 37000959232
            },
            {
              "timeframe_start": "2024-07-01T00:00:00Z",
              "timeframe_end": "2024-07-02T00:00:00Z",
              "active_time_seconds": 1792,
              "compute_time_seconds": 533,
              "written_data_bytes": 0,
              "synthetic_storage_size_bytes": 0
            }
          ]
        }
      ]
    }
  ],
  "pagination": {
    "cursor": "random-project-123456"
  }
}
```

</details>

## Metric definitions

### Usage-based pricing metrics

These metrics align with Neon's current [usage-based pricing plans](/docs/introduction/plans):

- **compute_unit_seconds** — Compute Unit-seconds. Measures compute usage in Compute Units over time. One Compute Unit (CU) equals 1 vCPU and 4 GB of RAM.
- **root_branch_bytes_month** — Byte-months. Storage consumed by root (production) branches, measured monthly.
- **child_branch_bytes_month** — Byte-months. Storage consumed by child (development) branches, measured monthly.
- **instant_restore_bytes_month** — Byte-months. Point-in-time restore storage (Write-Ahead Log data) that enables instant recovery, measured monthly.
- **public_network_transfer_bytes** — Bytes. Data transferred from Neon to the internet over public networks.
- **private_network_transfer_bytes** — Bytes. Data transferred over AWS PrivateLink for private connectivity.

### Legacy metrics

These metrics are used for Neon's [legacy billing plans](/docs/introduction/legacy-plans):

- **active_time_seconds** — Seconds. The amount of time the compute endpoints have been active.
- **compute_time_seconds** — Seconds. The number of CPU seconds used by compute endpoints, including compute endpoints that have been deleted. For example:
  - A compute that uses 1 CPU for 1 second equals `compute_time=1`
  - A compute that uses 2 CPUs simultaneously for 1 second equals `compute_time=2`
- **written_data_bytes** — Bytes. The total amount of data written to all of a project's branches.
- **synthetic_storage_size_bytes** — Bytes. The space occupied in storage. Synthetic storage size combines the logical data size and Write-Ahead Log (WAL) size for all branches.
- **data_storage_bytes_hour** — Bytes-Hour. The amount of storage consumed hourly.
- **logical_size_bytes** — Bytes. The amount of logical size consumed.
- **logical_size_bytes_hour** — Bytes-Hour. The amount of logical size consumed hourly.

## Pagination

The project consumption metrics endpoint uses cursor-based pagination. The response includes a `pagination` object with a `cursor` value (the project ID of the last project in the list).

To retrieve the next page of results, include the cursor value in your next request:

```bash shouldWrap
curl --request GET \
     --url 'https://console.neon.tech/api/v2/consumption_history/projects?cursor=divine-tree-77657175&limit=10&from=2024-06-30T00%3A00%3A00Z&to=2024-07-02T00%3A00%3A00Z&granularity=daily' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY'
```

<Admonition type="note">
To learn more about cursor-based pagination, see [Keyset pagination](https://learn.microsoft.com/en-us/ef/core/querying/pagination#keyset-pagination) in the Microsoft documentation.
</Admonition>

## Date range and granularity guidelines

When setting the `from` and `to` parameters, keep these limits in mind based on your chosen granularity:

| Granularity | Maximum time range      | Rounding behavior                |
| ----------- | ----------------------- | -------------------------------- |
| `hourly`    | Last 168 hours (7 days) | Rounds to the nearest hour       |
| `daily`     | Last 60 days            | Rounds to the start of the day   |
| `monthly`   | Last year               | Rounds to the start of the month |

Date-time values are automatically rounded according to the specified granularity. For example, `2024-03-15T15:30:00Z` with daily granularity becomes `2024-03-15T00:00:00Z`.

## Consumption polling FAQ

### How often can you poll consumption data?

Neon's consumption data is updated approximately every 15 minutes, so a minimum interval of 15 minutes between API calls is recommended.

### What is the rate limit for consumption APIs?

Consumption API endpoints support high-frequency polling designed to handle typical billing and monitoring use cases. The rate limiting uses a token bucket approach, which refills at a steady rate while allowing bursts of requests above the baseline. This means you can poll consistently at regular intervals and still handle temporary spikes in activity.

Updated usage data is available approximately every 15 minutes, but integrators and customers are free to choose their own reporting and billing intervals based on their requirements.

### Does consumption polling wake up computes?

No. Neon's consumption APIs do not wake computes that have been suspended due to inactivity. Therefore, calls to these APIs will not increase consumption.

### Do the consumption APIs provide all the metrics for usage-based Scale plan billing?

Yes. The [Retrieve project consumption metrics](https://api-docs.neon.tech/reference/getconsumptionhistoryperproject) endpoint now returns metrics that align with Neon's current [usage-based pricing plans](/docs/introduction/plans), including:

- Compute usage (`compute_unit_seconds`)
- Root branch storage (`root_branch_bytes_month`)
- Child branch storage (`child_branch_bytes_month`)
- Instant restore storage (`instant_restore_bytes_month`)
- Public network transfer (`public_network_transfer_bytes`)
- Private network transfer (`private_network_transfer_bytes`)

These metrics match the billing line items on usage-based plan invoices. For metric definitions, see [Usage-based pricing metrics](#usage-based-pricing-metrics).

<Admonition type="note">
The endpoint also continues to support legacy metrics for accounts on [older billing plans](/docs/introduction/legacy-plans).
</Admonition>

## Error responses

Common error responses you may encounter:

- **403 Forbidden** — These endpoints are only available for Scale and Enterprise plan accounts, and for legacy Scale, Business, and Enterprise plan accounts.
- **404 Not Found** — Account is not a member of the organization specified by `org_id`.
- **406 Not Acceptable** — The specified date-time range is outside the boundaries of the specified granularity. Adjust your `from` and `to` values or select a different granularity.
- **429 Too Many Requests** — You've exceeded the rate limit. Wait before retrying.
