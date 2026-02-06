---
title: Querying consumption metrics
subtitle: Learn how to query project and account consumption metrics using the Neon API
summary: >-
  How to query account and project consumption metrics using the Neon API,
  including methods for retrieving aggregated and detailed metrics without
  activating compute endpoints.
redirectFrom:
  - /docs/guides/metrics-api
  - /docs/guides/partner-consumption-metrics
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.944Z'
---

Using the Neon API, you can query consumption metrics to track your resource usage on Neon's paid plans.

| API                                     | Endpoint                           | Description                                                                                                                                                        | Plan availability                |
| --------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------- |
| **Project metrics (usage-based plans)** | `/consumption_history/v2/projects` | Returns metrics aligned with [usage-based billing](/docs/introduction/plans): compute units, storage (root, child, instant restore), data transfer, extra branches | Launch, Scale, Agent, Enterprise |
| **Project metrics (legacy)**            | `/consumption_history/projects`    | Returns legacy metrics: active time, compute time, written data, synthetic storage                                                                                 | Scale, Business, Enterprise      |
| **Account metrics (legacy)**            | `/consumption_history/account`     | Aggregates legacy metrics across all projects in an account                                                                                                        | Scale, Business, Enterprise      |

<Admonition type="tip">
**Which API should I use?** If you're on a usage-based plan (Launch, Scale, Agent, or Enterprise), use the [project metrics API for usage-based plans](#get-project-level-metrics-for-usage-based-plans) to get metrics that match your invoice. The legacy APIs return metrics that don't map directly to usage-based billing line items.
</Admonition>

Issuing calls to these APIs does not wake a project's compute endpoints.

<Admonition type="info">
**Date format:** Both endpoints require timestamps in RFC 3339 format, which looks like `2024-06-30T15:30:00Z`. This format includes the date, time, and timezone (the `Z` indicates UTC). You can use this [timestamp converter](https://it-tools.tech/date-converter) to generate RFC 3339 formatted timestamps.

**Important:** Consumption history is available starting from March 1, 2024, at 00:00:00 UTC. You cannot query consumption data before this date.
</Admonition>

## Get account-level aggregated metrics (legacy plans)

Using the [Get account consumption metrics API](https://api-docs.neon.tech/reference/getconsumptionhistoryperaccount), you can find total usage across all projects in your organization. This endpoint is available for Scale, Business, and Enterprise plan accounts.

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

- **`org_id`** (string) — Specify the organization for which consumption metrics should be returned. If not provided, returns metrics for the authenticated user's account.

- **`metrics`** (array of strings) — Specify which metrics to include in the response. If omitted, `active_time_seconds`, `compute_time_seconds`, `written_data_bytes`, and `synthetic_storage_size_bytes` are returned.

  Available metrics:
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

## Get project-level metrics (legacy plans)

Using the [Retrieve project consumption metrics](https://api-docs.neon.tech/reference/getconsumptionhistoryperproject) endpoint, you can get detailed metrics for each project in your account, broken down by the specified granularity level. This endpoint is available for Scale, Business, and Enterprise plan accounts.

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

- **`org_id`** (string) — Specify the organization for which project consumption metrics should be returned. If not provided, returns metrics for the authenticated user's projects.

- **`metrics`** (array of strings) — Specify which metrics to include. If omitted, `active_time_seconds`, `compute_time_seconds`, `written_data_bytes`, and `synthetic_storage_size_bytes` are returned.

  Available metrics:
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

## Get project-level metrics for usage-based plans

This endpoint returns metrics that align directly with Neon's usage-based billing. It's available on **Launch, Scale, Agent, and Enterprise** plans. History begins at the time of upgrade.

API endpoint:

```bash
GET https://console.neon.tech/api/v2/consumption_history/v2/projects
```

### Metrics

This endpoint provides metrics that map directly to usage-based billing line items:

| Metric                           | Description                                                 |
| -------------------------------- | ----------------------------------------------------------- |
| `compute_unit_seconds`           | Compute usage measured in compute unit seconds              |
| `root_branch_bytes_month`        | Storage consumed by root branches                           |
| `child_branch_bytes_month`       | Storage consumed by child branches (delta from parent)      |
| `instant_restore_bytes_month`    | Change history storage for point-in-time restore            |
| `public_network_transfer_bytes`  | Data transfer over the public internet                      |
| `private_network_transfer_bytes` | Data transfer over private networks (e.g., AWS PrivateLink) |
| `extra_branches_month`           | Extra branches beyond your plan's included allowance        |

### Required parameters

- **`from`** (date-time, required) — Start date-time for the consumption period in RFC 3339 format. The value is rounded according to the specified granularity. Consumption history is available starting from March 1, 2024.
- **`to`** (date-time, required) — End date-time for the consumption period in RFC 3339 format.
- **`granularity`** (string, required) — The granularity of consumption metrics: `hourly` (last 168 hours), `daily` (last 60 days), or `monthly` (last year).
- **`org_id`** (string, required) — The organization ID to query metrics for.

### Optional parameters

- **`metrics`** (array of strings) — Specify which metrics to include in the response. If omitted, all metrics are returned.
- **`project_ids`** (array of strings, 0-100 items) — Filter to specific project IDs.
- **`limit`** (integer, 1-100) — Number of projects per response. Default: `10`.
- **`cursor`** (string) — Cursor for pagination.

### Example

This example retrieves month-to-date usage for all metrics. Replace `$ORG_ID` with your organization ID and `$NEON_API_KEY` with your API key.

```bash shouldWrap
curl --request GET \
  --url 'https://console.neon.tech/api/v2/consumption_history/v2/projects?from=2026-02-01T00:00:00Z&to=2026-02-06T00:00:00Z&granularity=daily&org_id=$ORG_ID&metrics=compute_unit_seconds,root_branch_bytes_month,child_branch_bytes_month,instant_restore_bytes_month,public_network_transfer_bytes,private_network_transfer_bytes,extra_branches_month' \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer $NEON_API_KEY' | jq
```

<Admonition type="tip">
You can also query individual metrics by specifying only the ones you need in the `metrics` parameter.
</Admonition>

For full API details including all parameters and response schema, see [Retrieve project consumption metrics](https://api-docs.neon.tech/reference/getconsumptionhistoryperprojectv2).

### Try it with your AI agent

<CopyPrompt src="/prompts/consumption-api-prompt.md" description="Copy this prompt to have an AI assistant help you build the curl command for your desired time period." />

### Example response

<details>
<summary>Response body</summary>

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
              "timeframe_end": "2026-02-05T00:00:00Z",
              "metrics": [
                {
                  "metric_name": "compute_unit_seconds",
                  "value": 84
                },
                {
                  "metric_name": "root_branch_bytes_month",
                  "value": 758513664
                },
                {
                  "metric_name": "instant_restore_bytes_month",
                  "value": 98344
                },
                {
                  "metric_name": "public_network_transfer_bytes",
                  "value": 1414
                }
              ]
            },
            {
              "timeframe_start": "2026-02-05T00:00:00Z",
              "timeframe_end": "2026-02-06T00:00:00Z",
              "metrics": [
                {
                  "metric_name": "compute_unit_seconds",
                  "value": 236
                },
                {
                  "metric_name": "root_branch_bytes_month",
                  "value": 758611968
                },
                {
                  "metric_name": "instant_restore_bytes_month",
                  "value": 983488
                },
                {
                  "metric_name": "public_network_transfer_bytes",
                  "value": 2184
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

## Metric definitions

### Usage-based plan metrics

These metrics are returned by the [project metrics API for usage-based plans](#get-project-level-metrics-for-usage-based-plans) and align directly with billing line items:

| Metric                           | Unit    | Description                                                 |
| -------------------------------- | ------- | ----------------------------------------------------------- |
| `compute_unit_seconds`           | Seconds | Compute usage measured in compute unit seconds              |
| `root_branch_bytes_month`        | Bytes   | Storage consumed by root branches                           |
| `child_branch_bytes_month`       | Bytes   | Storage consumed by child branches (delta from parent)      |
| `instant_restore_bytes_month`    | Bytes   | Change history storage for point-in-time restore            |
| `public_network_transfer_bytes`  | Bytes   | Data transfer over the public internet                      |
| `private_network_transfer_bytes` | Bytes   | Data transfer over private networks (e.g., AWS PrivateLink) |
| `extra_branches_month`           | Count   | Extra branches beyond your plan's included allowance        |

### Legacy plan metrics

These metrics are returned by the [legacy API](#get-project-level-metrics-legacy-plans) and align with legacy billing plans:

**Default metrics:**

- **active_time_seconds** — Seconds. The amount of time the compute endpoints have been active.
- **compute_time_seconds** — Seconds. The number of CPU seconds used by compute endpoints, including compute endpoints that have been deleted. For example:
  - A compute that uses 1 CPU for 1 second equals `compute_time=1`
  - A compute that uses 2 CPUs simultaneously for 1 second equals `compute_time=2`
- **written_data_bytes** — Bytes. The total amount of data written to all of a project's branches.
- **synthetic_storage_size_bytes** — Bytes. The space occupied in storage. Synthetic storage size combines the logical data size and Write-Ahead Log (WAL) size for all branches.

**Additional metrics:**

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

Both consumption API endpoints share the same rate limiter and are limited to approximately 50 requests per minute per account.

Neon uses a **token bucket** rate-limiting approach, which refills at a steady rate while allowing short bursts within the bucket size. This behaves more like a sliding window rather than a fixed reset every minute. For more details, see [Token bucket](https://en.wikipedia.org/wiki/Token_bucket).

### How often should consumption data be polled for reporting or invoicing?

Usage data can be pulled every 15 minutes, but integrators and customers are free to choose their own reporting and billing intervals based on their requirements. Neon does not dictate how integrators bill their users.

### Does consumption polling wake up computes?

No. Neon's consumption APIs do not wake computes that have been suspended due to inactivity. Therefore, calls to these APIs will not increase consumption.

### Do the consumption APIs provide all the metrics for usage-based plan billing?

**Yes.** The [project metrics endpoint for usage-based plans](#get-project-level-metrics-for-usage-based-plans) returns metrics that align directly with usage-based billing, including separate storage metrics (`root_branch_bytes_month`, `child_branch_bytes_month`, `instant_restore_bytes_month`) and network transfer metrics (`public_network_transfer_bytes`, `private_network_transfer_bytes`).

The legacy APIs return metrics that don't map directly to usage-based billing line items. For detailed information, see [Usage-based pricing and legacy API limitations](#usage-based-pricing-and-legacy-api-limitations).

## Usage-based pricing and legacy API limitations

<Admonition type="tip">
For usage-based plan billing metrics, use the [project metrics endpoint for usage-based plans](#get-project-level-metrics-for-usage-based-plans), which returns metrics that map directly to your invoice line items.
</Admonition>

The legacy consumption APIs (account-level and project-level endpoints) were designed for Neon's legacy billing plans and do not fully align with the [usage-based plan](/docs/introduction/plans) structure.

### Storage metrics differences

**Legacy API:**

The legacy API uses `synthetic_storage_size_bytes`, which combines logical data size and Write-Ahead Log (WAL) data for all branches into a single metric.

**Usage-based plans API:**

The usage-based plans API returns separate metrics that match your invoice:

- **`root_branch_bytes_month`** — Storage for root branches
- **`child_branch_bytes_month`** — Storage for child branches (delta from parent)
- **`instant_restore_bytes_month`** — Change history (WAL data) for point-in-time restore

### Metrics only available in usage-based plans API

The legacy APIs do not provide the following metrics. Use the [project metrics endpoint for usage-based plans](#get-project-level-metrics-for-usage-based-plans) to retrieve these:

- **`compute_unit_seconds`** — Compute usage in compute unit seconds
- **`instant_restore_bytes_month`** — Separately billed change history for point-in-time restore
- **`public_network_transfer_bytes`** — Data egress over the public internet
- **`private_network_transfer_bytes`** — Data transfer over AWS PrivateLink
- **`extra_branches_month`** — Branches beyond your plan's included allowance

## Error responses

Common error responses you may encounter:

- **403 Forbidden** — This endpoint is only available for Scale and Enterprise plan accounts, and for legacy Scale, Business, and Enterprise plan accounts.
- **404 Not Found** — Account is not a member of the organization specified by `org_id`.
- **406 Not Acceptable** — The specified date-time range is outside the boundaries of the specified granularity. Adjust your `from` and `to` values or select a different granularity.
- **429 Too Many Requests** — You've exceeded the rate limit. Wait before retrying.
