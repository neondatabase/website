---
title: Query consumption metrics (legacy)
subtitle: Legacy account and project consumption APIs for Scale, Business, and
  Enterprise plans
summary: >-
  How to query account and project consumption metrics using the legacy Neon API
  (active time, compute time, written data, synthetic storage). For usage-based
  plans, use Query consumption metrics instead.
enableTableOfContents: true
updatedOn: '2026-02-16T13:09:07.968Z'
---

Using the Neon API, you can query consumption metrics with the legacy endpoints: account-level aggregated metrics and project-level metrics. You can call these endpoints on **legacy plans** (Scale, Business, Enterprise) or **usage-based plans** (Launch, Scale, Agent, Enterprise). The difference is that they only return **legacy metrics** (active time, compute time, written data, synthetic storage). On a usage-based plan, those metrics do not match your invoice; for invoice-aligned metrics use the [project metrics endpoint](/docs/guides/consumption-metrics) in Query consumption metrics instead.

| API                 | Endpoint                        | Description                               | Available on                 |
| ------------------- | ------------------------------- | ----------------------------------------- | ---------------------------- |
| **Account metrics** | `/consumption_history/account`  | Aggregated metrics across all projects    | Legacy and usage-based plans |
| **Project metrics** | `/consumption_history/projects` | Per-project metrics at chosen granularity | Legacy and usage-based plans |

Issuing calls to these APIs does not wake a project's compute endpoints.

<Admonition type="tip">
**Which API should I use?** For metrics that match your **invoice** on a usage-based plan, use the project metrics API in [Query consumption metrics](/docs/guides/consumption-metrics); it is the only endpoint that returns usage-based billing metrics. Use the endpoints on this page when you need **legacy metrics** (for example, on a legacy plan or for compatibility). Legacy endpoints can be called on any paid plan but always return legacy metrics only.
</Admonition>

## Request overview

The legacy endpoints return consumption data for legacy billing plans. Date format, range limits, and granularity are the same as the usage-based endpoint; for details see [Date format, range, and granularity](/docs/guides/consumption-metrics#date-format-range-and-granularity) in Query consumption metrics. Consumption history is available from March 1, 2024, at 00:00:00 UTC.

### Metrics

Both endpoints return metrics that align with legacy billing. Default metrics are returned unless you specify otherwise with the `metrics` parameter:

| Metric                         | Unit       | Description                                                                                         |
| ------------------------------ | ---------- | --------------------------------------------------------------------------------------------------- |
| `active_time_seconds`          | Seconds    | Time compute endpoints have been active                                                             |
| `compute_time_seconds`         | Seconds    | CPU seconds used by compute endpoints (see [Legacy metric definitions](#legacy-metric-definitions)) |
| `written_data_bytes`           | Bytes      | Total data written to all of a project's branches                                                   |
| `synthetic_storage_size_bytes` | Bytes      | Storage used (logical data + WAL for all branches)                                                  |
| `data_storage_bytes_hour`      | Bytes-Hour | Storage consumed hourly (optional)                                                                  |
| `logical_size_bytes`           | Bytes      | Logical size consumed (optional)                                                                    |
| `logical_size_bytes_hour`      | Bytes-Hour | Logical size consumed hourly (optional)                                                             |

### Account-level endpoint

**Endpoint:**

```bash
GET https://console.neon.tech/api/v2/consumption_history/account
```

Retrieves consumption metrics for Scale and Enterprise plan accounts, and for legacy Scale, Business, and Enterprise plan accounts. Returns total usage across all projects in the organization. Consumption history begins at the time the account was upgraded to a supported plan.

#### Required parameters

- **`from`** (date-time, required): Start of the consumption period in RFC 3339 format. The value is rounded according to the specified granularity. Consumption history is available from March 1, 2024, at 00:00:00 UTC. The range must respect the granularity limits (hourly: last 168 hours; daily: last 60 days; monthly: past year).
- **`to`** (date-time, required): End of the consumption period in RFC 3339 format. The value is rounded according to the specified granularity. The range must respect the same granularity limits as `from`.
- **`granularity`** (string, required): Granularity of consumption metrics. `hourly` (last 168 hours), `daily` (last 60 days), or `monthly` (past year).

#### Optional parameters

- **`org_id`** (string): Organization for which to return consumption metrics. If not provided, returns metrics for the authenticated user's account.
- **`metrics`** (array of strings): Metrics to include. If omitted, `active_time_seconds`, `compute_time_seconds`, `written_data_bytes`, and `synthetic_storage_size_bytes` are returned. Possible values: `active_time_seconds`, `compute_time_seconds`, `written_data_bytes`, `synthetic_storage_size_bytes`, `data_storage_bytes_hour`. Can be an array of parameter values or a comma-separated list in a single parameter value.

The **`include_v1_metrics`** parameter is deprecated; use **`metrics`** instead. If `metrics` is specified, `include_v1_metrics` is ignored.

### Project-level endpoint

**Endpoint:**

```bash
GET https://console.neon.tech/api/v2/consumption_history/projects
```

Retrieves consumption metrics per project at the chosen granularity. Results are ordered by time in ascending order (oldest to newest). History begins at the time of upgrade. Issuing a call to this API does not wake a project's compute endpoint.

#### Required parameters

- **`from`** (date-time, required): Start of the consumption period in RFC 3339 format. The value is rounded according to the specified granularity. Consumption history is available from March 1, 2024, at 00:00:00 UTC. The range must respect the granularity limits (hourly: last 168 hours; daily: last 60 days; monthly: last year).
- **`to`** (date-time, required): End of the consumption period in RFC 3339 format. The value is rounded according to the specified granularity. The range must respect the same granularity limits as `from`.
- **`granularity`** (string, required): Granularity of consumption metrics. `hourly` (last 168 hours), `daily` (last 60 days), or `monthly` (last year).

#### Optional parameters

- **`project_ids`** (array of strings, 0-100 items): Filter to specific project IDs. If omitted, the response contains all projects. Can be an array of parameter values or a comma-separated list in a single parameter value.
- **`org_id`** (string): Organization for which to return project consumption metrics. If not provided, returns metrics for the authenticated user's projects.
- **`metrics`** (array of strings): Metrics to include. If omitted, `active_time_seconds`, `compute_time_seconds`, `written_data_bytes`, and `synthetic_storage_size_bytes` are returned. Possible values: `active_time_seconds`, `compute_time_seconds`, `written_data_bytes`, `synthetic_storage_size_bytes`, `data_storage_bytes_hour`, `logical_size_bytes`, `logical_size_bytes_hour`. Can be an array or comma-separated list.
- **`limit`** (integer, 1-100): Number of projects in the response. Default: `10`.
- **`cursor`** (string): Cursor value from the previous response to get the next batch of projects.

The **`include_v1_metrics`** parameter is deprecated; use **`metrics`** instead. If `metrics` is specified, `include_v1_metrics` is ignored.

### Legacy metric definitions

**Default metrics** (returned when `metrics` is omitted):

- **active_time_seconds**: Seconds. The amount of time the compute endpoints have been active.
- **compute_time_seconds**: Seconds. The number of CPU seconds used by compute endpoints, including compute endpoints that have been deleted. For example: 1 CPU for 1 second = 1; 2 CPUs for 1 second = 2.
- **written_data_bytes**: Bytes. The amount of written data for all branches.
- **synthetic_storage_size_bytes**: Bytes. The space occupied in storage. Synthetic storage size combines the logical data size and Write-Ahead Log (WAL) size for all branches.

**Additional metrics** (include via the `metrics` parameter):

- **data_storage_bytes_hour**: Bytes-Hour. The amount of storage consumed hourly.
- **logical_size_bytes**: Bytes. The amount of logical size consumed.
- **logical_size_bytes_hour**: Bytes-Hour. The amount of logical size consumed hourly.

## Example request and response

Replace `$NEON_API_KEY` with your API key and, for the project endpoint, include `org_id` if needed.

### Account-level

```bash shouldWrap
curl --request GET \
  --url 'https://console.neon.tech/api/v2/consumption_history/account?from=2024-06-30T00:00:00Z&to=2024-07-02T00:00:00Z&granularity=daily&org_id=org-ocean-art-12345678' \
  --header 'accept: application/json' \
  --header 'authorization: Bearer $NEON_API_KEY'
```

<details>
<summary>Response body (account)</summary>

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

### Project-level

```bash shouldWrap
curl --request GET \
  --url 'https://console.neon.tech/api/v2/consumption_history/projects?from=2024-06-30T00:00:00Z&to=2024-07-02T00:00:00Z&granularity=daily&org_id=org-ocean-art-12345678&limit=10' \
  --header 'accept: application/json' \
  --header 'authorization: Bearer $NEON_API_KEY'
```

<details>
<summary>Response body (project)</summary>

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

<Admonition type="tip">
You can request specific metrics with the `metrics` parameter (for example, `metrics=active_time_seconds,compute_time_seconds`).
</Admonition>

For full parameter and response details, see [Get account consumption metrics](https://api-docs.neon.tech/reference/getconsumptionhistoryperaccount) and [Retrieve project consumption metrics](https://api-docs.neon.tech/reference/getconsumptionhistoryperproject) in the Neon API Reference.

The following sections cover paging (project endpoint), polling behavior, and handling errors.

## Pagination

The **project-level** endpoint uses cursor-based pagination. The response includes a `pagination` object with a `cursor` value (the project ID of the last project in the list). To get the next page, send another request with that `cursor` in the query string and the same `from`, `to`, and `granularity` as your first request.

Example request for the next page (using the `cursor` from the previous response):

```bash shouldWrap
curl --request GET \
     --url 'https://console.neon.tech/api/v2/consumption_history/projects?cursor=divine-tree-77657175&limit=10&from=2024-06-30T00%3A00%3A00Z&to=2024-07-02T00%3A00%3A00Z&granularity=daily&org_id=org-ocean-art-12345678' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY'
```

In the URL above, the **`cursor`** parameter is `cursor=divine-tree-77657175`. Replace that value with the `cursor` from your previous response's `pagination` object.

## Consumption polling

Neon's consumption data is updated approximately every 15 minutes. A minimum interval of 15 minutes between API calls is recommended. For reporting or invoicing, you can pull usage data at that interval or choose your own; Neon does not dictate how often you poll or how you bill your users.

The legacy and usage-based consumption API endpoints share a single rate limiter of approximately 50 requests per minute per account. Neon uses a **token bucket** approach, which refills at a steady rate and allows short bursts within the bucket size, so the limit behaves like a sliding window rather than a fixed reset every minute. For more details, see [Token bucket](https://en.wikipedia.org/wiki/Token_bucket).

Calling the consumption APIs does not wake computes that have been suspended due to inactivity, so polling will not increase your consumption.

The endpoints on this page return **legacy metrics** only; they can be called on legacy or usage-based plans but will not match your invoice on a usage-based plan. For metrics that match your invoice, see [Query consumption metrics](/docs/guides/consumption-metrics).

## Error responses

Common error responses you may encounter:

- **403 Forbidden**: These endpoints are not available for your plan. They are only supported with Scale, Business, and Enterprise plan accounts.
- **404 Not Found**: Account is not a member of the organization specified by `org_id`.
- **406 Not Acceptable**: The specified date-time range is outside the boundaries of the specified granularity. Adjust your `from` and `to` values or select a different `granularity`.
- **429 Too Many Requests**: Too many requests. Wait before retrying.

## Usage-based pricing and legacy API limitations

The legacy endpoints on this page were designed for Neon's legacy billing plans and do not align with [usage-based plans](/docs/introduction/plans). If you're on a usage-based plan (Launch, Scale, Agent, or Enterprise), use [Query consumption metrics](/docs/guides/consumption-metrics) for metrics that map to your invoice.

**Legacy API:** Uses `synthetic_storage_size_bytes` (logical data + WAL for all branches in one metric).

**Usage-based API:** Returns separate metrics that match your invoice: `root_branch_bytes_month`, `child_branch_bytes_month`, `instant_restore_bytes_month`, `public_network_transfer_bytes`, `private_network_transfer_bytes`, `extra_branches_month`, and `compute_unit_seconds`. The legacy APIs do not provide these. Use the [project metrics endpoint](/docs/guides/consumption-metrics#request-overview) in Query consumption metrics to retrieve them.
