---
title: Manage billing for your customers
subtitle: Learn how to set usage quotas per Neon project using the Neon API
enableTableOfContents: true
isDraft: false
updatedOn: '2023-10-30T17:57:11.976Z'
---

When setting up your billing solution with Neon, you may want to impose some hard limits on how much storage or compute size a given project can consume. Using the `quota` key in the Neon API, you can set a number of usage limits for key consumptoin metrics. These limits act as thresholds after which all active computes for a project are [suspended](#what-happens-when-the-quota-is-met). 

These `quota` parameters let you set the balance between providing a flexible and scalable service while preventing potential abuses and maintaining cost control.

## Available metrics

Neon supports consumption tracking at the project level. These consumption metrics represent total cumulated usage across all branches and computes in a given project, accrued so far in a given monthly billing period. They are refreshed on a set day every month, on whichever date your new billing period starts. 

Here are the relevant metrics that you can set quotas for:

* `active_time_seconds`
* `compute_time_seconds`
* `written_data_bytes`
* `data_transfer_bytes` 

To find the current usage level for any of these metrics, see see [how to `GET` current usage](#retrieving-details-about-a-project). You can read more about these metrics and how they impact billing in the [docs](/docs) and [API reference](API).

## About Quota keys

You can set quotas for all of these consumption metrics in the `quota` object in the following API path:

```bash
/projects/{project_id}/settings/quota
```

The main parameters used to set these quotas use the the same names as their corresponding metrics:

* `active_time_seconds` &#8212; Sets the maximum amount of wall-clock time allowed in total across all of a project's compute endpoints. This means the total elapsed time, in seconds, from start to finish for each transaction handled by the project's endpoints, accumulated before the one-month refresh date.
* `compute_time_seconds` &#8212; Sets the maximum amount of CPU seconds allowed in total across all of a project's compute endpoints. This differs from `active_time_seconds` in that it only counts the time the CPU spends executing a process or a thread. It excludes time spent waiting for external resources, I/O operations, or time spent in a blocked or idle state.
* `written_data_bytes` &#8212; Sets the maximum amount of data in total, measured in bytes, that can be written across all of a project's branches.
* `data_transfer_bytes` &#8212; Sets the maximum amount of data, measured in bytes, that can be transferred from across all of a project's branches using the proxy.

There is one additional `quota` parameter, `logical_size_bytes` which sets a size limit for any branch created in the project. Measure in bytes, once this threshold is reached only compute for that particular branch is suspended. Note that this limit is not refreshed once per month: it is a strict size limit that applies for the life of the branch.

### Suggested Guidelines

Generally, the most important quotas for controlling spend per project are those controlling maximum compute (`active_time_seconds` and `compute_time_seconds`) and maximum storage size (`written_data_bytes`). In practice, `data_transfer_bytes` is less useful for controlling billing. 


## What happens when the quota is met?
Neon tracks your consumption metrics are on a monthly cycle. When a metric hits the configured limit, all active computes for that project are automatically suspended. It is important to understand that this is not like an inactivity-based suspend, where computes restart at the next interaction: this suspend will not restart at the next API call or incoming proxy connection. Without intervention, the suspend will last until the next quota reset period (`quota_reset_at`).

The quota is once per month. reset every month. You can find that date using...[link]

The only exception to this monthly refresh cycle is for the `logical_size_bytes` limit. This setting places a size limit on each individual branch your users create. It is a strict limit on the total size of data allowed on a branch. There is no monthly refresh; the limit is perpetual.

//So how to restart? is there a recommended way to configure a reset in the application?//


## Setting quotas when you create the project
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


## Updating an already created project
If you need to change the quota limits for an existing project &#8212; for example, if a user switches their plan to a higher usage tier &#8212; you can reset those limits via `PATCH` request using [update](https://api-docs.neon.tech/reference/updateproject) in the Neon API. 

Example: updating the `active_time_seconds` quota to 30 hours (108,000 seconds) and `compute_time_seconds` to 20 hours (72,000 seconds) compute time:

<CodeBlock highlight="12,13">
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

## Retrieving details about a project

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

And here is what the response might look like. Key fields are highlighted in //what color?//.

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

* **This project is 1 hour away from being suspended.**
  
  With current `compute_time_seconds` at _68,400_ (19 hours) and the quota for that metric set at _72,000_ (20 hours), the project is only _1 hour_ of compute time away from being suspended.

* **This project is 1 day away from a quota refresh.**

  If today's date is _October 31th, 2023_, and the `quota_reset_at` parameter is _2023-11-01T00:00:00Z_ (November 1st, 2023), then the project has _1 day_ left before all quota parameters (except for `logical_byte_size`) are refreshed.

## Retrieving metrics for all projects

<Admonition type="Warning" title="Preview API">
This funtionality is part of the preview API and is subject to change in the future.
</Admonition>

You can use this API endpoint to retrieve a list of all consumption metrics in your organization for the current billing period, organized by project.

```bash
https://console.neon.tech/api/v2/consumption/projects
```

curl --request GET \
     --url https://console.neon.tech/api/v2/consumption/projects \
     --header 'accept: application/json' \
     --header 'authorization: Bearer t8zk3xeepaieivirkt2h7dwqdh9k4r7506bfy4vf5j129zvyo8yjn6vc5d9zx5nh'


## Resetting a project after suspend
The simplest reset method is just to wait until the next refresh period.

Another way you can restart a suspended compute is to set the quota to `0`: this effectively removes the limit entirely. You will need to reset this quota at some point if you want to maintain limits.

### Using quotas to actively suspend a user
If you want to suspend a user for any reason &#8212; for example, suspicious activity or payment issues &#8212; you can use these quotas to actively suspend a given user. For example, setting `active_time_limit` to a very low threshold (e.g., `1`) will force a suspend if the user has even 1 second of active compute for that month. To remove this suspend, you can set the threshold temporarily to `0` (infinite) or some value larger than their currently consumed usage.
