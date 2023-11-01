---
title: Manage billing for your customers
subtitle: Learn how to set usage quotas per Neon project using the Neon API
enableTableOfContents: true
isDraft: false
updatedOn: '2023-11-01T19:04:17.185Z'
---

When setting up your billing solution with Neon, you may want to impose some hard limits on how much storage or compute size a given project can consume. For example, you may want to cap how much usage your free tier users can consume versus pro or enterprise users. With the Neon API, you can use the `quota` key to set usage limits for a variety of consumption metrics. These limits act as thresholds after which all active computes for a project are [suspended](#what-happens-when-the-quota-is-met). 

These `quota` parameters let you set the balance between providing a flexible and scalable service while preventing potential abuses and maintaining cost control.

## Metrics and quotas
By default, Neon tracks a variety of consumption metrics at the project level. If you want to set quotas (max limits) for these metrics, you need to explictly configure them. 

### Available metrics

Here are the relevant metrics that you can set quotas for:

* `active_time_seconds`
* `compute_time_seconds`
* `written_data_bytes`
* `data_transfer_bytes` 

These consumption metrics represent total cumulated usage across all branches and computes in a given project, accrued so far in a given monthly billing period. They are refreshed on a set day every month, on whichever date your new billing period starts. 

To find the current usage level for any of these metrics, see see [how to `GET` current usage](#retrieving-details-about-a-project). You can read more about these metrics and how they impact billing [here](/docs/billing).

### Corresponding quotas

You can set quotas for all of these consumption metrics in the `quota` object in the Neon API with the following URL:

```bash
/projects/{project_id}/settings/quota
```

The `quota` object includes an array of parameters used to establish threshold limits. Parameter names generally match their corresponding metric. Here are the main parameters:

* `active_time_seconds` &#8212; Sets the maximum amount of wall-clock time allowed in total across all of a project's compute endpoints. This means the total elapsed time, in seconds, from start to finish for each transaction handled by the project's endpoints, accumulated before the one-month refresh date.
* `compute_time_seconds` &#8212; Sets the maximum amount of CPU seconds allowed in total across all of a project's compute endpoints. This differs from `active_time_seconds` in that it only counts the time the CPU spends executing a process or a thread. It excludes time spent waiting for external resources, I/O operations, or time spent in a blocked or idle state.
* `written_data_bytes` &#8212; Sets the maximum amount of data in total, measured in bytes, that can be written across all of a project's branches.
* `data_transfer_bytes` &#8212; Sets the maximum amount of data, measured in bytes, that can be transferred from across all of a project's branches using the proxy.

There is one additional `quota` parameter, `logical_size_bytes` which sets a size limit for any branch created in the project. Measure in bytes, once this threshold is reached only compute for that particular branch is suspended. Note that this limit is not refreshed once per month: it is a strict size limit that applies for the life of the branch.

### Guidelines

Generally, the most important quotas for controlling spend per project are those controlling maximum compute (`active_time_seconds` and `compute_time_seconds`) and maximum storage size (`written_data_bytes`). In practice, `data_transfer_bytes` is less useful for controlling billing. 


## Suspending active computes

### What happens when the quota is met?

When a metric hits the configured limit, all active computes for that project are automatically suspended. It is important to understand that this works differently than the inactivity-based [autosuspend](/docs/guides/auto-suspend-guide), where computes restart at the next interaction: this suspend will _not_ restart at the next API call or incoming proxy connection. Without intervention, the suspend remains in place until the next quota reset period (`quota_reset_at`).

** When does the suspension end? 

Neon tracks your consumption metrics are on a monthly cycle. If you want to track metrics based on a different time range, you need to use external storage. The quota limits are reset once a month, at the start of the next billing period. See [Querying metrics and quotas](#querying-metrics-and-quotas) to find your reset date, billing period, and other values related to the project's consumption.

The quota is once per month. reset every month. You can find that date using...[link]

The only exception to this monthly refresh cycle is for the `logical_size_bytes` limit. This setting places a size limit on each individual branch your users create. It is a strict limit on the total size of data allowed on a branch. There is no monthly refresh; the limit is perpetual.

//So how to restart? is there a recommended way to configure a reset in the application?//

## Configuring quotas

### Set quotas when you create the project
For performance reasons, you might want to configure these quotas at the same time as you create a new project for your user. This reduces the number of API calls you need to make.

Here is an example of a `curl` request that both creates a new project called `UserNew` and sets the `active_time_seconds` quota to a total allowed time of 10 hours (36,000 seconds) for the month, and a total allowed `compute_time_seconds` set to 5 hours (18,000 seconds) for the month.  


<CodeBlock highlight="11,12">
```bash
curl --request POST \
     --url https://console.neon.tech/api/v2/projects \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json' \
     --data '
{
  "project": {
    "settings": {
      "quota": {
        "active_time_seconds": 36000,
        "compute_time_seconds": 18000
      }
    },
    "pg_version": 15,
    "name": "UserProject"
  }
}
' | jq
```
</CodeBlock>


### Update an existing project
If you need to change the quota limits for an existing project &#8212; for example, if a user switches their plan to a higher usage tier &#8212; you can reset those limits via `PATCH` request using [update](https://api-docs.neon.tech/reference/updateproject) in the Neon API. 

Example: updating the `active_time_seconds` quota to 30 hours (108,000 seconds) and `compute_time_seconds` to 20 hours (72,000 seconds) compute time:

<CodeBlock highlight="11,12">
```bash
curl --request PATCH \
     --url https://console.neon.tech/api/v2/projects/[project_ID]\
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json' \
     --data '
{
  "project": {
    "settings": {
      "quota": {
        "active_time_seconds": 108000,
        "compute_time_seconds": 72000
      }
    }
  }
}
' | jq
```
</CodeBlock>

## Querying metrics and quotas



### Retrieving details about a project

Using a `GET` request from the Neon API (see [Get project details]()), you can find all the usage details you need for a given project:
* Current consumption metrics accumulated for the billing period
* Start and end dates for the billing period
* Exact date the billing period will reset
* Current usage quotas configured for the project

Using these details, you can set up the logic for when to send notification warnings, when to reset a quota, and other possible actions related to the pending or current suspension of a project's active computes.

Here is an example of the `GET` request for the `UserProject` we created earlier, with the project Id `wispy-wind-123456`.

```bash
curl --request GET \
     --url https://console.neon.tech/api/v2/projects/wispy-wind-123456 \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' | jq
```

And here is what the response might look like. The key fields are highlighted.

<details>
<summary>Response body</summary>
<CodeBlock highlight="3-7,21-22,35-37">
```json
{
  "project": {
    "data_storage_bytes_hour": 0,
    "data_transfer_bytes": 0,
    "written_data_bytes": 0,
    "compute_time_seconds": 0,
    "active_time_seconds": 0,
    "cpu_used_sec": 0,
    "id": "wispy-wind-123456",
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
    "quota_reset_at": "2023-11-01T00:00:00Z",
    "owner_id": "1232111",
    "owner": {
      "email": "some@email.com",
      "branches_limit": -1,
      "subscription_type": "free"
    }
  }
}
```
</CodeBlock>
</details>

Looking at this response, here are some conclusions we can draw:

* **This project is _1 hour away_ from being suspended.**
  
  With current `compute_time_seconds` at _68,400_ (19 hours) and the quota for that metric set at _72,000_ (20 hours), the project is only _1 hour_ of compute time away from being suspended.

* **This project is _1 day away_ from a quota refresh.**

  If today's date is _October 31th, 2023_, and the `quota_reset_at` parameter is _2023-11-01T00:00:00Z_ (November 1st, 2023), then the project has _1 day_ left before all quota parameters (except for `logical_byte_size`) are refreshed.

### Retrieving metrics for all projects

Instead of retrieving metrics for an individual project, you can get a full list of key consumption metrics for all the projects in your Neon integration in a single API request.

<Admonition type="Warning" title="Preview API">
This funtionality is part of the preview API and is subject to change in the future.
</Admonition>

Here is the URl to get those full details for all projects in your account:

```bash
https://console.neon.tech/api/v2/consumption/projects
```
To control pagination (number of results per response), you can include these query parameters:
* `limit` &#8212; sets the number of projects to be included in the response
* `cursor` &#8212; by default, the response uses the project `id` from the last project in the list as the `cursor` value (included in the `pagination` object at the end of the response). Generally, it is up to the application to collect and use this cursor value when setting up the next request.

Here is a sample URL with both query parameters included, asking for the next 100 projects, starting with project id  `divine-tree-77657175`:
```bash
https://console.neon.tech/api/v2/consumption/projects?cursor=divine-tree-77657175&limit=100
```

To learn more about using pagination to control large response sizes, the [Keyset pagination](https://learn.microsoft.com/en-us/ef/core/querying/pagination#keyset-pagination) page n the Microsoft docs gives a helpful overview.

Here is an example API `GET` that retrieves metric details for details, limited to 2 projects in the list:

```bash
curl --request GET \
     --url https://console.neon.tech/api/v2/consumption/projects?limit=2 \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' | jq'
```
And here is a sample response (with key lines highlighted):
<details>
<summary>Response body</summary>
<CodeBlock highlight="16-17,31,47-48,62,66-67">
```json
{
  "projects": [
    {
      "id": "wispy-wind-94231251",
      "platform_id": "aws",
      "region_id": "aws-us-east-2",
      "name": "UserProjectRenamed",
      "provisioner": "k8s-pod",
      "default_endpoint_settings": {
        "autoscaling_limit_min_cu": 1,
        "autoscaling_limit_max_cu": 1,
        "suspend_timeout_seconds": 0
      },
      "settings": {
        "quota": {
          "active_time_seconds": 200000000,
          "compute_time_seconds": 18000
        }
      },
      "pg_version": 15,
      "proxy_host": "us-east-2.aws.neon.tech",
      "branch_logical_size_limit": 204800,
      "branch_logical_size_limit_bytes": 214748364800,
      "store_passwords": true,
      "active_time": 0,
      "cpu_used_sec": 0,
      "creation_source": "console",
      "created_at": "2023-10-29T16:48:31Z",
      "updated_at": "2023-11-01T11:44:56Z",
      "synthetic_storage_size": 32605352,
      "quota_reset_at": "2023-11-01T00:00:00Z",
      "owner_id": "cf80d675-bb06-4e0c-9327-48ccfe84e7be"
    },
    {
      "id": "divine-tree-77657175",
      "platform_id": "aws",
      "region_id": "aws-us-east-2",
      "name": "RnameII",
      "provisioner": "k8s-pod",
      "default_endpoint_settings": {
        "autoscaling_limit_min_cu": 1,
        "autoscaling_limit_max_cu": 1,
        "suspend_timeout_seconds": 0
      },
      "settings": {
        "quota": {
          "active_time_seconds": 36000,
          "compute_time_seconds": 18000
        }
      },
      "pg_version": 15,
      "proxy_host": "us-east-2.aws.neon.tech",
      "branch_logical_size_limit": 204800,
      "branch_logical_size_limit_bytes": 214748364800,
      "store_passwords": true,
      "active_time": 0,
      "cpu_used_sec": 0,
      "creation_source": "console",
      "created_at": "2023-10-29T16:33:39Z",
      "updated_at": "2023-10-31T17:08:13Z",
      "synthetic_storage_size": 32671528,
      "quota_reset_at": "2023-11-01T00:00:00Z",
      "owner_id": "cf80d675-bb06-4e0c-9327-48ccfe84e7be"
    }
  ],
  "pagination": {
    "cursor": "patient-frost-50125040"
  }
}
```
</CodeBlock>
</details>


## Resetting a project after suspend
If you configured your application to notify your users when they are close to meeting the quota threshold, you may decide to just let any resulting suspensions remain in place until that project's next refresh period.

Another way to restart a suspended account is to actively reset the surpassed quota to `0`: this effectively removes the limit entirely. You will need to reset this quota at some point if you want to maintain limits.

### Using quotas to actively suspend a user
If you want to suspend a user for any reason &#8212; for example, suspicious activity or payment issues &#8212; you can use these quotas to actively suspend a given user. For example, setting `active_time_limit` to a very low threshold (e.g., `1`) will force a suspend if the user has even 1 second of active compute for that month. To remove this suspend, you can set the threshold temporarily to `0` (infinite) or some value larger than their currently consumed usage.
