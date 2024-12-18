---
title: Query organization usage metrics with the Neon API
enableTableOfContents: true
---

You can use the Neon API to retrieve three types of consumption metrics for your organization:

| Metric                                                                                           | Description                                                                              | Plan Availability |
| ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- | ----------------- |
| [Account-level](https://api-docs.neon.tech/reference/getconsumptionhistoryperaccount)            | Total usage across all projects in your organization                                     | Scale plan only   |
| [Project-level](https://api-docs.neon.tech/reference/getconsumptionhistoryperproject) (granular) | Project-level metrics available at hourly, daily, or monthly level of granularity        | Scale plan only   |
| [Project-level](https://api-docs.neon.tech/reference/listprojectsconsumption) (billing period)   | Consumption metrics for each project in your Organization for the current billing period | All plans         |

## Finding organizations for consumption queries

Before querying consumption metrics, you'll need the `org_id` values for organizations you want to query. Use your personal API key to list all organizations you have access to:

```bash shouldWrap
curl --request GET \
     --url 'https://console.neon.tech/api/v2/users/me/organizations' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $PERSONAL_API_KEY' | jq
```

The response includes details about each organization, including the `org_id` you'll need for consumption queries:

```json
{
  "organizations": [
    {
      "id": "org-morning-bread-81040908",
      "name": "Morning Bread Organization",
      "created_at": "2022-11-23T17:42:25Z",
      "updated_at": "2022-12-04T02:39:25Z"
    }
  ]
}
```

## Account-level metrics

To get global totals for all projects in the organization `org-ocean-art-12345678`, include the `org_id` in the `GET /consumption/projects` request. Required parameters:

- A start date
- An end date
- A level of granularity

The following example requests hourly metrics between June 30th and July 2nd, 2024:

```bash shouldWrap
curl --request GET \
     --url 'https://console.neon.tech/api/v2/consumption_history/account?from=2024-06-30T15%3A30%3A00Z&to=2024-07-02T15%3A30%3A00Z&granularity=hourly&org_id=org-ocean-art-12345678' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $ORG_API_KEY'
```

The response will provide aggregated hourly consumption metrics, including active time, compute time, written data, and synthetic storage size, for each hour between June 30 and July 2.

<details>
<summary>Response</summary>

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

### Project-level metrics (granular)

You can also get similar daily, hourly, or monthly metrics across a selected time period, but broken out for each individual project that belongs to your organization.

Using the endpoint `GET /consumption_history/projects`, let's use the same start date, end date, and level of granularity as our account-level request: hourly metrics between June 30th and July 2nd, 2024.

```bash shouldWrap
curl --request GET \
     --url 'https://console.neon.tech/api/v2/consumption_history/projects?limit=10&from=2024-06-30T00%3A00%3A00Z&to=2024-07-02T00%3A00%3A00Z&granularity=hourly&org_id=org-ocean-art-12345678' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $ORG_API_KEY'
```

<details>
<summary>Response</summary>

```json shouldWrap
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

### Project-level metrics (for the current billing period)

To get basic billing period-based consumption metrics for each project in the organization `org-ocean-art-12345678`, include `org_id` in the `GET /projects` request for consumption metrics:

```bash shouldWrap
curl --request GET \
     --url 'https://console.neon.tech/api/v2/projects?org_id=org-ocean-art-12345678' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $ORG_API_KEY'
```

See more details about using this endpoint on the [Manage billing with consumption limits](/docs/guides/partner-consumption-limits#retrieving-metrics-for-all-projects) page in our Partner Guide.
