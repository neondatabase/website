---
title: Querying consumption metrics with the API
subtitle: Learn how to get a variety of consumption metrics using the Neon API
enableTableOfContents: true
updatedOn: '2024-09-02T13:42:56.655Z'
---

Using the Neon API, you can query a range of account-level and project-level metrics to help gauge your resource consumption.

To learn more about which metrics you can get reports on, see [Available metrics](/docs/guides/partner-billing#available-metrics) on the [Manage billing with consumption limits](/docs/manage/partner-billing) page.

Here are the different ways to retrieve these metrics, depending on how you want them aggregated or broken down:

| Endpoint                                                                                                 | Description                                                                                                              | Plan Availability            |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------- |
| [Account-level cumulative metrics](https://api-docs.neon.tech/reference/getconsumptionhistoryperaccount) | Aggregates all metrics from all projects in an account into a single cumulative number for each metric                   | Scale and Business plan only |
| [Granular project-level metrics](https://api-docs.neon.tech/reference/getconsumptionhistoryperproject)   | Provides detailed metrics for each project in an account at a specified granularity level (e.g., hourly, daily, monthly) | Scale and Business plan only |
| [Billing period project-level metrics](https://api-docs.neon.tech/reference/listprojectsconsumption)     | Offers consumption metrics for each project in an account for the current billing period                                 | All plans                    |
| [Single project metrics](https://api-docs.neon.tech/reference/getproject)                                | Retrieves detailed metrics and quota information for a specific project                                                  | All plans                    |

## Get account-level aggregated metrics

Using the [Get account consumption metrics API](https://api-docs.neon.tech/reference/getconsumptionhistoryperaccount), you can find total usage across all projects in your organization. This provides a comprehensive view of consumption metrics accumulated for the billing period.

Here is the URL in the Neon API where you can get account-level metrics:

```bash
https://console.neon.tech/api/v2/consumption_history/account
```

This API endpoint accepts the following query parameters: `from`, `to`, `granularity`, `org_id`, and `include_v1_metrics`.

### Choosing your account

Include the unique `org_id` for your organization to retrieve account metrics for that specific organization. If not specified, metrics for your personal account will be returned.

<Admonition type="note">
Organizations are currently in private preview. For more information about this upcoming feature, see [Organizations](/docs/manage/organizations).
</Admonition>

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

## Get project-level metrics for your account by billing period

Use the [Consumption API](https://api-docs.neon.tech/reference/listprojectsconsumption) to get a full list of key consumption metrics for all the projects in your Neon account in one request. You can specify a date range to get metrics from across multiple billing periods and control pagination for large result sets.

Here is the URL in the Neon API where you can get details for all projects in your account:

```bash
https://console.neon.tech/api/v2/consumption/projects
```

This API endpoint accepts the following query parameters: `from`, `to`, `limit`, and `cursor`.

### Set a date range across multiple billing periods

You can set `from` and `to` query parameters to define a time range that can span across multiple billing periods.

- `from` — Sets the start date and time of the time period for which you are seeking metrics.
- `to` — Sets the end date and time for the interval for which you desire metrics.

The response is organized by project and billing period: one object per project, per active billing period within the range. For example, if you choose a 6-month time range you will get up to 6 objects for every project active within those months. The response includes any projects deleted within that time range.

If you do not include these parameters, the query defaults to the current consumption period.

Here is an example query that returns metrics from September 1st and December 1st, 2023. Time values must be provided in ISO 8601 format. You can use this [timestamp converter](https://www.timestamp-converter.com/).

```bash shouldWrap
curl --request GET \
     --url 'https://console.neon.tech/api/v2/consumption/projects?limit=10&from=2023-09-01T00%3A00%3A00Z&to=2023-12-01T00%3A00%3A00Z' \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" | jq
```

And here is a sample response (with key lines highlighted):

<details>
<summary>Response body</summary>

```json {5,10,11,13,15,18-20,24,29,30,32,33,35-37,40,42}
{
  "projects": [
    {
      "project_id": "wispy-wind-94231251",
      "period_id": "6fa781c3-fe37-45fa-9987-26a0d06edbd9",
      "data_storage_bytes_hour": 6097554392,
      "data_storage_bytes_hour_updated_at": "2023-11-08T19:07:53Z",
      "synthetic_storage_size": 32616552,
      "synthetic_storage_size_updated_at": "2023-11-08T13:37:53Z",
      "data_transfer_bytes": 0,
      "written_data_bytes": 6296,
      "written_data_bytes_updated_at": "2023-11-08T13:37:53Z",
      "compute_time_seconds": 708,
      "compute_time_seconds_updated_at": "2023-11-07T19:43:17Z",
      "active_time_seconds": 672,
      "active_time_seconds_updated_at": "2023-11-07T19:43:17Z",
      "updated_at": "2023-11-08T19:08:56Z",
      "period_start": "2023-11-01T00:00:00Z",
      "period_end": null,
      "previous_period_id": "4abcae52-490c-4144-a657-ed93139e2b4e"
    },
    {
      "project_id": "divine-tree-77657175",
      "period_id": "f8f50267-69d2-4891-8359-847c138dbf80",
      "data_storage_bytes_hour": 6109745400,
      "data_storage_bytes_hour_updated_at": "2023-11-08T19:07:53Z",
      "synthetic_storage_size": 32673288,
      "synthetic_storage_size_updated_at": "2023-11-06T22:58:17Z",
      "data_transfer_bytes": 0,
      "written_data_bytes": 2256,
      "written_data_bytes_updated_at": "2023-11-06T22:43:17Z",
      "compute_time_seconds": 0,
      "active_time_seconds": 0,
      "updated_at": "2023-11-08T19:08:56Z",
      "period_start": "2023-11-01T00:00:00Z",
      "period_end": null,
      "previous_period_id": "385be9ab-5d6c-493e-b77f-d8f28a5191ca"
    }
  ],
  "periods_in_response": 2,
  "pagination": {
    "cursor": "divine-tree-77657175"
  }
}
```

</details>

Key details:

- The `period_id` key and `previous_period_id` are unique values used to identify and connect periods across the time range.
- The `period_start` and `period_end` keys show the dates for that particular billing period. A `null` value indicates that the object is for the current billing period.
- The `cursor` object under `pagination` shows the last project Id in the response. See [Details on pagination](#details-on-pagination) for more.

## Get metrics for a single specified project

Using a `GET` request from the Neon API (see [Get project details](https://api-docs.neon.tech/reference/getproject)), you can find the following consumption details for a given project:

- Current consumption metrics accumulated for the billing period
- Start and end dates for the billing period
- Current usage quotas (max limits) configured for the project

Using these details, you can set up the logic for when to send notification warnings, when to reset a quota, and other possible actions related to the pending or current suspension of a project's active computes.

Here is an example a `GET` request for an individual project.

```bash
curl --request GET \
     --url https://console.neon.tech/api/v2/projects/[project_ID] \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" | jq
```

And here is what the response might look like.

<details>
<summary>Response body</summary>

```json
{
  "project": {
    "data_storage_bytes_hour": 1040,
    "data_transfer_bytes": 680000000,
    "written_data_bytes": 68544000,
    "compute_time_seconds": 68400,
    "active_time_seconds": 75000,
    "cpu_used_sec": 7200,
    "id": "[project_ID]",
    "platform_id": "aws",
    "region_id": "aws-us-east-2",
    "name": "UserProject",
    "provisioner": "k8s-pod",
    "default_endpoint_settings": {
      "autoscaling_limit_min_cu": 1,
      "autoscaling_limit_max_cu": 1,
      "suspend_timeout_seconds": 0
    },
    "settings": {
      "quota": {
        "active_time_seconds": 108000,
        "compute_time_seconds": 72000
      }
    },
    "pg_version": 15,
    "proxy_host": "us-east-2.aws.neon.tech",
    "branch_logical_size_limit": 204800,
    "branch_logical_size_limit_bytes": 214748364800,
    "store_passwords": true,
    "creation_source": "console",
    "history_retention_seconds": 604800,
    "created_at": "2023-10-29T16:48:31Z",
    "updated_at": "2023-10-29T16:48:31Z",
    "synthetic_storage_size": 0,
    "consumption_period_start": "2023-10-01T00:00:00Z",
    "consumption_period_end": "2023-11-01T00:00:00Z",
    "owner_id": "1232111",
    "owner": {
      "email": "some@email.com",
      "branches_limit": -1,
      "subscription_type": "free"
    }
  }
}
```

</details>

Looking at this response, here are some conclusions we can draw:

- **This project is _1 hour away_ from being suspended.**

  With current `compute_time_seconds` at _68,400_ (19 hours) and the quota for that metric set at _72,000_ (20 hours), the project is only _1 hour_ of compute time away from being suspended.

- **This project is _1 day away_ from a quota refresh.**

  If today's date is _October 31st, 2023_, and the `consumption_period_end` parameter is _2023-11-01T00:00:00Z_ (November 1st, 2023), then the project has _1 day_ left before all quota parameters (except for `logical_byte_size`) are refreshed.

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

This section applies to the following metrics output types: [Granular project-level metrics for your account](#get-granular-project-level-metrics-for-your-account), and [Billing period project-level metrics for your account](#get-project-level-metrics-for-your-account-by-billing-period).

To control pagination (number of results per response), you can include these query parameters:

- `limit` &#8212; sets the number of project objects to be included in the response
- `cursor` &#8212; by default, the response uses the project `id` from the last project in the list as the `cursor` value (included in the `pagination` object at the end of the response). Generally, it is up to the application to collect and use this cursor value when setting up the next request.

Here is an example `GET` request asking for the next 100 projects, starting with project id `divine-tree-77657175`:

```bash shouldWrap
curl --request GET \
     --url https://console.neon.tech/api/v2/consumption/projects?cursor=divine-tree-77657175&limit=100\
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" | jq
```

<Admonition type="note">
To learn more about using pagination to control large response sizes, the [Keyset pagination](https://learn.microsoft.com/en-us/ef/core/querying/pagination#keyset-pagination) page in the Microsoft docs gives a helpful overview.
</Admonition>
