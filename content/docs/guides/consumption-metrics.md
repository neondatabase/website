---
title: Querying consumption metrics
subtitle: Learn how to query project consumption metrics for usage-based plans using the
  Neon API
summary: >-
  How to query project consumption metrics for usage-based plans using the Neon
  API. Retrieve compute, storage, and data transfer metrics without activating
  compute endpoints.
redirectFrom:
  - /docs/guides/metrics-api
  - /docs/guides/partner-consumption-metrics
enableTableOfContents: true
updatedOn: '2026-02-16T13:09:07.969Z'
---

Using the Neon API, you can query consumption metrics to track your resource usage. This page describes the **project metrics** endpoint, which returns metrics that align with [usage-based billing](/docs/introduction/plans) and match your invoice on usage-based plans.

| API                               | Endpoint                           | Description                                                                                                                            | Plan availability                |
| --------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| **Project metrics (usage-based)** | `/consumption_history/v2/projects` | Returns metrics aligned with usage-based billing: compute units, storage (root, child, instant restore), data transfer, extra branches | Launch, Scale, Agent, Enterprise |

Issuing calls to this API does not wake a project's compute endpoints.

<Admonition type="tip">
**Which API should I use?** If you're on a usage-based plan (Launch, Scale, Agent, or Enterprise), use the [project metrics API](#request-overview) below; it is the only endpoint that returns metrics matching your invoice. You can also call the [legacy APIs](/docs/guides/consumption-metrics-legacy) (account and project) on usage-based or legacy plans, but they only return legacy metrics and will not match your invoice on a usage-based plan.
</Admonition>

## Request overview

Retrieves consumption metrics for Launch, Scale, Agent, and Enterprise plan projects. Returns metrics that align with usage-based billing. History begins at the time of upgrade. Results are ordered by time in ascending order (oldest to newest). Issuing a call to this API does not wake a project's compute endpoint.

**Endpoint:**

```bash
GET https://console.neon.tech/api/v2/consumption_history/v2/projects
```

### Metrics

The response includes metrics that map directly to usage-based billing line items:

| Metric                           | Unit    | Description                                                        |
| -------------------------------- | ------- | ------------------------------------------------------------------ |
| `compute_unit_seconds`           | Seconds | Compute usage measured in compute unit seconds                     |
| `root_branch_bytes_month`        | Bytes   | Storage consumed by root branches                                  |
| `child_branch_bytes_month`       | Bytes   | Storage consumed by child branches (delta from parent)             |
| `instant_restore_bytes_month`    | Bytes   | Change history storage for point-in-time restore                   |
| `public_network_transfer_bytes`  | Bytes   | Data transfer over the public internet                             |
| `private_network_transfer_bytes` | Bytes   | Data transfer over private networks (for example, AWS PrivateLink) |
| `extra_branches_month`           | Count   | Extra branches beyond your plan's included allowance               |

### Required parameters

- **`from`** (date-time, required): Start date-time for the consumption period in RFC 3339 format. The value is rounded according to the specified granularity. Consumption history is available from March 1, 2024, at 00:00:00 UTC. The range must respect the granularity limits (hourly: last 168 hours; daily: last 60 days; monthly: last year).
- **`to`** (date-time, required): End date-time for the consumption period in RFC 3339 format. The value is rounded according to the specified granularity. The range must respect the same granularity limits as `from`.
- **`granularity`** (string, required): Granularity of consumption metrics. Hourly, daily, and monthly metrics are available for the last 168 hours, 60 days, and 1 year, respectively.
- **`org_id`** (string, required): Organization for which the project consumption metrics should be returned.

### Date format, range, and granularity

The API requires timestamps in RFC 3339 format (for example, `2024-06-30T15:30:00Z`), including date, time, and timezone; the `Z` indicates UTC. You can use a [timestamp converter](https://it-tools.tech/date-converter) to generate RFC 3339 formatted timestamps. Consumption history is available starting from March 1, 2024, at 00:00:00 UTC; you cannot query data before this date.

When setting `from` and `to`, keep these limits in mind based on your chosen granularity:

| Granularity | Maximum time range      | Rounding behavior                |
| ----------- | ----------------------- | -------------------------------- |
| `hourly`    | Last 168 hours (7 days) | Rounds to the nearest hour       |
| `daily`     | Last 60 days            | Rounds to the start of the day   |
| `monthly`   | Last year               | Rounds to the start of the month |

Date-time values are automatically rounded according to the specified granularity. For example, `2024-03-15T15:30:00Z` with daily granularity becomes `2024-03-15T00:00:00Z`.

### Optional parameters

- **`metrics`** (array of strings): List of metrics to include in the response. If omitted, all metrics are returned. Possible values: `compute_unit_seconds`, `root_branch_bytes_month`, `child_branch_bytes_month`, `instant_restore_bytes_month`, `public_network_transfer_bytes`, `private_network_transfer_bytes`, `extra_branches_month`. Can be an array of parameter values or a comma-separated list in a single parameter value.
- **`project_ids`** (array of strings, 0-100 items): Filter to specific project IDs. If omitted, the response contains all projects. Can be an array of parameter values or a comma-separated list in a single parameter value.
- **`limit`** (integer, 1-100): Number of projects in the response. Default: `10`.
- **`cursor`** (string): Cursor value from the previous response to get the next batch of projects.

## Example request and response

Replace `$ORG_ID` and `$NEON_API_KEY` with your organization ID and API key, then run the following to retrieve daily metrics for a date range.

```bash shouldWrap
curl --request GET \
  --url 'https://console.neon.tech/api/v2/consumption_history/v2/projects?from=2026-02-01T00:00:00Z&to=2026-02-06T00:00:00Z&granularity=daily&org_id=$ORG_ID&metrics=compute_unit_seconds,root_branch_bytes_month,child_branch_bytes_month,instant_restore_bytes_month,public_network_transfer_bytes,private_network_transfer_bytes,extra_branches_month' \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer $NEON_API_KEY' | jq
```

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

<Admonition type="tip">
You can also query individual metrics by specifying only the ones you need in the `metrics` parameter.
</Admonition>

For full API details including all parameters and response schema, see [Retrieve project consumption metrics](https://api-docs.neon.tech/reference/getconsumptionhistoryperprojectv2). To build a request for a custom time range, use the prompt below with an AI assistant.

<CopyPrompt src="/prompts/consumption-api-prompt.md" description="Copy this prompt to have an AI assistant help you build the curl command for your desired time period." />

The following sections cover paging through many projects, polling behavior, and handling errors.

## Pagination

The project consumption metrics endpoint uses cursor-based pagination. The response includes a `pagination` object with a `cursor` value (the project ID of the last project in the list). To get the next page, send another request with that `cursor` in the query string and the same `from`, `to`, and `granularity` as your first request.

Example request for the next page (using the `cursor` from the previous response):

```bash shouldWrap
curl --request GET \
     --url 'https://console.neon.tech/api/v2/consumption_history/v2/projects?cursor=divine-tree-77657175&limit=10&from=2024-06-30T00%3A00%3A00Z&to=2024-07-02T00%3A00%3A00Z&granularity=daily&org_id=$ORG_ID' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY'
```

In the URL above, the **`cursor`** parameter is `cursor=divine-tree-77657175`. Replace that value with the `cursor` from your previous response's `pagination` object.

## Consumption polling

Neon's consumption data is updated approximately every 15 minutes. A minimum interval of 15 minutes between API calls is recommended. For reporting or invoicing, you can pull usage data at that interval or choose your own; Neon does not dictate how often you poll or how you bill your users.

The consumption API endpoints share a single rate limiter of approximately 50 requests per minute per account. Neon uses a **token bucket** approach, which refills at a steady rate and allows short bursts within the bucket size, so the limit behaves like a sliding window rather than a fixed reset every minute. For more details, see [Token bucket](https://en.wikipedia.org/wiki/Token_bucket).

Calling the consumption APIs does not wake computes that have been suspended due to inactivity, so polling will not increase your consumption.

The [project metrics endpoint](#request-overview) on this page returns metrics that align directly with usage-based billing (including storage and network transfer metrics that match your invoice). The legacy APIs return different metrics that don't map to usage-based line items; see [Query consumption metrics (legacy)](/docs/guides/consumption-metrics-legacy) for those endpoints.

## Error responses

Common error responses you may encounter:

- **403 Forbidden**: This endpoint is not available for your plan. It is only supported with Launch, Scale, Agent, and Enterprise plan accounts.
- **404 Not Found**: Account is not a member of the organization specified by `org_id`.
- **406 Not Acceptable**: The specified date-time range is outside the boundaries of the specified granularity. Adjust your `from` and `to` values or select a different `granularity`.
- **429 Too Many Requests**: Too many requests. Wait before retrying.

## Build a usage dashboard

For a full example that uses this API to build a usage dashboard with Next.js (including charts, project filtering, and reporting), see [Building a Usage Dashboard with Neon's Consumption API](/guides/usage-dashboard-consumption-api). The guide includes a [sample application on GitHub](https://github.com/dhanushreddy291/neon-usage-dashboard) that you can clone and run to visualize your usage-based metrics.
