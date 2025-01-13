---
title: Querying consumption metrics
subtitle: Learn how to get a variety of consumption metrics using the Neon API
redirectFrom:
  - /docs/guides/metrics-api
enableTableOfContents: true
updatedOn: '2024-12-17T13:59:40.781Z'
---

Using the Neon API, you can query a range of account-level and project-level metrics to help gauge your resource consumption.

To learn more about which metrics you can get reports on, see [Available metrics](/docs/guides/partner-consumption-limits#available-metrics) on the [Configure consumption limits](/docs/guides/partner-consumption-limits) page.

Here are the different ways to retrieve these metrics, depending on how you want them aggregated or broken down:

| Endpoint                                                                                                 | Description                                                                                                              | Plan Availability            |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------- |
| [Account-level cumulative metrics](https://api-docs.neon.tech/reference/getconsumptionhistoryperaccount) | Aggregates all metrics from all projects in an account into a single cumulative number for each metric                   | Scale and Business plan only |
| [Granular project-level metrics](https://api-docs.neon.tech/reference/getconsumptionhistoryperproject)   | Provides detailed metrics for each project in an account at a specified granularity level (e.g., hourly, daily, monthly) | Scale and Business plan only |

## Get account-level aggregated metrics

Using the [Get account consumption metrics API](https://api-docs.neon.tech/reference/getconsumptionhistoryperaccount), you can find total usage across all projects in your organization. This provides a comprehensive view of consumption metrics accumulated for the billing period.

Here is the URL in the Neon API where you can get account-level metrics:

```bash
https://console.neon.tech/api/v2/consumption_history/account
```

This API endpoint accepts the following query parameters: `from`, `to`, `granularity`, `org_id`, and `include_v1_metrics`.

### Choosing your account

Include the unique `org_id` for your organization to retrieve account metrics for that specific organization. If not specified, metrics for your personal account will be returned.

For more information about this upcoming feature, see [Organizations](/docs/manage/organizations).

### Set a date range for granular results

You can set `from` and `to` query parameters, plus a level of granularity to define a time range that can span across multiple billing periods.

- `from` — Sets the start date and time of the time period for which you are seeking metrics.
- `to` — Sets the end date and time for the interval for which you desire metrics.
- `granularity` — Sets the level of granularity for the metrics, such as `hourly`, `daily`, or `monthly`.

The response is organized by periods and consumption data within the specified time range.

See [Details on setting a date range](#details-on-setting-a-date-range) for more info.

## Get granular project-level metrics for your account

You can also get similar daily, hourly, or monthly metrics across a selected time period, but broken out for each individual project that belongs to your organization.

Using the endpoint `GET /consumption_history/projects`, let's use the same start date, end date, and level of granularity as our account-level request: hourly metrics between June 30th and July 2nd, 2024.

```shouldWrap
curl --request GET \
     --url 'https://console.neon.tech/api/v2/consumption_history/projects?limit=10&from=2024-06-30T00%3A00%3A00Z&to=2024-07-02T00%3A00%3A00Z&granularity=hourly&org_id=org-ocean-art-12345678' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY'
```

<details>
<summary>Response body</summary>

```shouldWrap
{
  "projects": [
    {
      "project_id": "random-project-123456",
      "periods": [
        {
          "period_id": "random-period-abcdef",
          "consumption": [
            {
              "timeframe_start": "2024-06-30T00:00:00Z",
              "timeframe_end": "2024-06-30T01:00:00Z",
              "active_time_seconds": 147472,
              "compute_time_seconds": 43222,
              "written_data_bytes": 112730864,
              "synthetic_storage_size_bytes": 37000959232
            },
            {
              "timeframe_start": "2024-07-01T00:00:00Z",
              "timeframe_end": "2024-07-01T01:00:00Z",
              "active_time_seconds": 1792,
              "compute_time_seconds": 533,
              "written_data_bytes": 0,
              "synthetic_storage_size_bytes": 0
            }
            // ... More consumption data
          ]
        },
        {
          "period_id": "random-period-ghijkl",
          "consumption": [
            {
              "timeframe_start": "2024-07-01T09:00:00Z",
              "timeframe_end": "2024-07-01T10:00:00Z",
              "active_time_seconds": 150924,
              "compute_time_seconds": 44108,
              "written_data_bytes": 114912552,
              "synthetic_storage_size_bytes": 36593552376
            }
            // ... More consumption data
          ]
        }
        // ... More periods
      ]
    }
    // ... More projects
  ]
}
```

</details>

The response is organized by periods and consumption data within the specified time range.

See [Details on setting a date range](#details-on-setting-a-date-range) for more info.

### Pagination

To control pagination (number of results per response), you can include these query parameters:

- `limit` — sets the number of project objects to be included in the response.
- `cursor` — by default, the response uses the project `id` from the last project in the list as the `cursor` value (included in the `pagination` object at the end of the response). Generally, it is up to the application to collect and use this cursor value when setting up the next request.

See [Details on pagination](#details-on-pagination) for more info.


## Details on setting a date range

This section applies to the following metrics output types: [Account-level aggregated metrics](#get-account-level-aggregated-metrics), and [Granular project-level metrics for your account](#get-granular-project-level-metrics-for-your-account).

You can set `from` and `to` query parameters, plus a level of granularity to define a time range that can span across multiple billing periods.

- `from` — Sets the start date and time of the time period for which you are seeking metrics.
- `to` — Sets the end date and time for the interval for which you desire metrics.
- `granularity` — Sets the level of granularity for the metrics, such as `hourly`, `daily`, or `monthly`.

The response is organized by periods and consumption data within the specified time range.

Here is an example query that returns metrics from June 30th to July 2nd, 2024. Time values must be provided in ISO 8601 format. You can use this [timestamp converter](https://www.timestamp-converter.com/).

```bash shouldWrap
curl --request GET \
     --url 'https://console.neon.tech/api/v2/consumption_history/account?from=2024-06-30T15%3A30%3A00Z&to=2024-07-02T15%3A30%3A00Z&granularity=hourly&org_id=org-ocean-art-12345678' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY'
```

And here is a sample response:

<details>
<summary>Response body</summary>

```json
{
  "periods": [
    {
      "period_id": "random-period-abcdef",
      "consumption": [
        {
          "timeframe_start": "2024-06-30T15:00:00Z",
          "timeframe_end": "2024-06-30T16:00:00Z",
          "active_time_seconds": 147452,
          "compute_time_seconds": 43215,
          "written_data_bytes": 111777920,
          "synthetic_storage_size_bytes": 41371988928
        },
        {
          "timeframe_start": "2024-06-30T16:00:00Z",
          "timeframe_end": "2024-06-30T17:00:00Z",
          "active_time_seconds": 147468,
          "compute_time_seconds": 43223,
          "written_data_bytes": 110483584,
          "synthetic_storage_size_bytes": 41467955616
        }
        // ... More consumption data
      ]
    },
    {
      "period_id": "random-period-ghijkl",
      "consumption": [
        {
          "timeframe_start": "2024-07-01T00:00:00Z",
          "timeframe_end": "2024-07-01T01:00:00Z",
          "active_time_seconds": 145672,
          "compute_time_seconds": 42691,
          "written_data_bytes": 115110912,
          "synthetic_storage_size_bytes": 42194712672
        },
        {
          "timeframe_start": "2024-07-01T01:00:00Z",
          "timeframe_end": "2024-07-01T02:00:00Z",
          "active_time_seconds": 147464,
          "compute_time_seconds": 43193,
          "written_data_bytes": 110078200,
          "synthetic_storage_size_bytes": 42291858520
        }
        // ... More consumption data
      ]
    }
    // ... More periods
  ]
}
```

</details>

## Details on pagination

This section applies to the following metrics output: [Granular project-level metrics for your account](#get-granular-project-level-metrics-for-your-account).

To control pagination (number of results per response), you can include these query parameters:

- `limit` &#8212; sets the number of project objects to be included in the response
- `cursor` &#8212; by default, the response uses the project `id` from the last project in the list as the `cursor` value (included in the `pagination` object at the end of the response). Generally, it is up to the application to collect and use this cursor value when setting up the next request.

Here is an example `GET` request asking for the next 10 projects, starting with project id `divine-tree-77657175`:

```bash shouldWrap
curl --request GET \
     --url 'https://console.neon.tech/api/v2/consumption_history/projects?cursor=divine-tree-77657175&limit=100&granularity=daily' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' | jq
```

<Admonition type="note">
To learn more about using pagination to control large response sizes, the [Keyset pagination](https://learn.microsoft.com/en-us/ef/core/querying/pagination#keyset-pagination) page in the Microsoft docs gives a helpful overview.
</Admonition>

## Consumption polling FAQ

As an Neon partner or paid plan customer, you may have questions related to polling Neon's consumption APIs. We've provided answers to frequently asked questions here.

### How often can you poll consumption data for usage reporting and billing?

Neon's consumption data is updated approximately every 15 minutes, so a minimum interval of 15 minutes between calls to our consumption APIs is recommended.

### How often should consumption data be polled to report usage to customers?

As mentioned above, usage data can be pulled every 15 minutes, but partners are free to choose their own reporting interval based on their requirements.

### How often should consumption data be polled to invoice end users?

Neon does not dictate how partners bill their users. Partners can use the data retrieved from the consumption API to generate invoices according to their own billing cycles and preferences.

### Does consumption polling wake up computes?

Neon's consumption polling APIs do not wake computes that have been suspended due to inactivity. Therefore, calls to Neon's consumption APIs will not increase your users' consumption.
