---
title: Manage billing with consumption limits
subtitle: Learn how to set usage quotas per project with the Neon API
enableTableOfContents: true
isDraft: false
updatedOn: '2023-11-03T14:27:22.130Z'
---

When setting up your billing solution with Neon, you may want to impose some hard limits on how much storage or compute size a given project can consume. For example, you may want to cap how much usage your free tier users can consume versus pro or enterprise users. With the Neon API, you can use the `quota` key to set usage limits for a variety of consumption metrics. These limits act as thresholds after which all active computes for a project are [suspended](#what-happens-when-the-quota-is-met). 

## Metrics and quotas
By default, Neon tracks a variety of consumption metrics at the project level. If you want to set quotas (max limits) for these metrics, you need to explicitly [configure](#configuring-quotas) them. 

### Available metrics

Here are the relevant metrics that you can set project-level quotas for:

* `active_time_seconds`
* `compute_time_seconds`
* `written_data_bytes`
* `data_transfer_bytes` 

These consumption metrics represent total cumulated usage across all branches and computes in a given project, accrued so far in a given monthly billing period. They are refreshed on a set day every month, on whichever date your new billing period starts. 

To find the current usage level for any of these metrics, see [retrieving details about a project](#retrieving-details-about-a-project). You can read more about these metrics and how they impact billing [here](/docs/billing).

### Corresponding quotas

You can set quotas for these consumption metrics per project using the following Neon API URL:

```bash
/projects/{project_id}/settings/quota
```

The `quota` object includes the array of parameters used to set threshold limits. Their names generally match their corresponding metric:

* `active_time_seconds` &#8212; Sets the maximum amount of wall-clock time allowed in total across all of a project's compute endpoints. This means the total elapsed time, in seconds, from start to finish for each transaction handled by the project's endpoints, accumulated before the one-month refresh date.
* `compute_time_seconds` &#8212; Sets the maximum amount of CPU seconds allowed in total across all of a project's compute endpoints. This differs from `active_time_seconds` in that it only counts the time the CPU spends executing a process. It excludes time spent waiting for external resources, I/O operations, or time spent in a blocked or idle state.
* `written_data_bytes` &#8212; Sets the maximum amount of data in total, measured in bytes, that can be written across all of a project's branches for the month.
* `data_transfer_bytes` &#8212; Sets the maximum amount of egress data, measured in bytes, that can be transferred out of Neon from across all of a project's branches using the proxy.

There is one additional `quota` parameter, `logical_size_bytes`, which applies to individual branches, not to the overall project. You can use `logical_size_bytes` to set the maximum size (measured in bytes) that any one individual branch is allowed to reach. Once this threshold is met, the compute for that particular branch (and _only_ that particular branch) is suspended. Note that this limit is _not_ refreshed once per month: it is a strict size limit that applies for the life of the branch.

### Sample quotas

Let's say you want to set limits for an application with two tiers, Trial and Pro, you might set limits like the following:

| Parameter (project)                 | Trial                     | Pro                      |
|------------------------|---------------------------|--------------------------|
| `active_time_seconds`  | 86,400 (1 day)            | 2,592,000 (30 days)      |
| `compute_time_seconds` | 3,600 (1 hour)            | 50,000 (approx. 14 hours)|
| `written_data_bytes`   | 1,000,000,000 (approx. 1 GiB)| 50,000,000,000 (approx. 50 GiB) |
| `data_transfer_bytes`  | 500,000,000 (approx. 500 MiB)| 10,000,000,000 (approx. 10 GiB)  |

| Parameter (branch)             | Trial                    | Pro                      |
|------------------------|---------------------------|--------------------------|
| `logical_size_bytes`   | 100,000,000 (approx. 100 MiB)| 10,000,000,000 (approx. 10 GiB)  |


### Guidelines

Generally, the most effective quotas for controlling spend per project are those controlling maximum compute (`active_time_seconds` and `compute_time_seconds`) and maximum written storage (`written_data_bytes`). In practice, it is possible that `data_transfer_bytes` could introduce unintended logical constraints against your usage. For example, let's say you want to run a cleanup operation to reduce your storage. If part of this cleanup operation involves moving data across the network (for instance, to create an offsite backup before deletion), the `data_transfer_bytes` limit could prevent you from completing the operation &#8212; an undesirable situation where two measures meant to control cost interfere with one another.

## Suspending active computes

_**What happens when the quota is met?**_

When any configured metric reaches its quota limit, all active computes for that project are automatically suspended. It is important to understand, this suspension is persistent. It works differently than the inactivity-based [autosuspend](/docs/guides/auto-suspend-guide), where computes restart at the next interaction: this suspend will _not_ restart at the next API call or incoming proxy connection. Without intervention, the suspension remains in place until the next billing period starts (`quota_reset_at`).

See [Querying metrics and quotas](#querying-metrics-and-quotas) to find your reset date, billing period, and other values related to the project's consumption.

<Admonition type="Note">
Neon tracks these consumption metrics on a monthly cycle. If you want to track metrics based on a different time range, you need to use external storage.
</Admonition>

## Configuring quotas

You can set quotas using the Neon API either in a `POST` when you create a project or a `PATCH` to update an existing project:
* [Set quotas when you create the project](#set-quotas-when-you-create-the-project)
* [Update an existing project](#update-an-existing-project)

### Set quotas when you create the project
For performance reasons, you might want to configure these quotas at the same time that you create a new project for your user, reducing the number of API calls you need to make.

Here is a sample `POST` in `curl` that creates a new project called `UserNew` and sets the `active_time_seconds` quota to a total allowed time of 10 hours (36,000 seconds) for the month, and a total allowed `compute_time_seconds` set to 5 hours (18,000 seconds) for the month.  

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
If you need to change the quota limits for an existing project &#8212; for example, if a user switches their plan to a higher usage tier &#8212; you can reset those limits via `PATCH` request. See [Update a project](https://api-docs.neon.tech/reference/updateproject) in the Neon API.

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

You can get metrics and quota details for a single project or a list of metrics for all projects at once:
* [Per project](#retrieving-details-about-a-project)
* [All projects](#retrieving-metrics-for-all-projects)

### Retrieving details about a project

Using a `GET` request from the Neon API (see [Get project details](https://api-docs.neon.tech/reference/getproject)), you can find the following consumption details for a given project:
* Current consumption metrics accumulated for the billing period
* Start and end dates for the billing period
* Exact date the billing period will reset
* Current usage quotas (max limits) configured for the project

Using these details, you can set up the logic for when to send notification warnings, when to reset a quota, and other possible actions related to the pending or current suspension of a project's active computes.

Here is an example of the `GET` request for an individual project.

```bash
curl --request GET \
     --url https://console.neon.tech/api/v2/projects/[project_ID] \
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
    "data_storage_bytes_hour": 1040,
    "data_transfer_bytes": 680000000,
    "written_data_bytes": 68544000,
    "compute_time_seconds": 68400,
    "active_time_seconds": 75000,
    "cpu_used_sec": 7200,
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

  If today's date is _October 31st, 2023_, and the `quota_reset_at` parameter is _2023-11-01T00:00:00Z_ (November 1st, 2023), then the project has _1 day_ left before all quota parameters (except for `logical_byte_size`) are refreshed.

### Retrieving metrics for all projects

Instead of retrieving metrics for an individual project, you can get a full list of key consumption metrics for all the projects in your Neon integration in a single API request.

<Admonition type="Warning" title="Preview API">
This functionality is part of the preview API and is subject to change in the future.
</Admonition>

Here is the URL in the Neon API where you can get details for all projects in your account:

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

To learn more about using pagination to control large response sizes, the [Keyset pagination](https://learn.microsoft.com/en-us/ef/core/querying/pagination#keyset-pagination) page in the Microsoft docs gives a helpful overview.

Here is an example Neon API `GET` request, with a limit of 2 projects in the response:

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
Generally, projects remain suspended until the next billing period. It is good practice to notify your users when they are close to reaching a limit; if the user is then suspended and loses access to their database, it will not be unexpected. If you have configured no further actions, the user will have to wait until the next billing period starts to resume usage.

Alternatively, you can actively reset a suspended compute by changing the impacted quota to `0`: this effectively removes the limit entirely. You will need to reset this quota at some point if you want to maintain limits.

### Using quotas to actively suspend a user
If you want to suspend a user for any reason &#8212; for example, suspicious activity or payment issues &#8212; you can use these quotas to actively suspend a given user. For example, setting `active_time_limit` to a very low threshold (e.g., `1`) will force a suspension if the user has 1 second of active compute for that month. To remove this suspension, you can set the threshold temporarily to `0` (infinite) or some value larger than their currently consumed usage.
