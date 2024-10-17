---
title: Manage billing with consumption limits
subtitle: Learn how to set usage quotas per project with the Neon API
enableTableOfContents: true
isDraft: false
updatedOn: '2024-10-05T09:31:59.749Z'
---

When setting up your integration's billing solution with Neon, you may want to impose some hard limits on how much storage or compute resources a given project can consume. For example, you may want to cap how much usage your free plan users can consume versus pro or enterprise users. With the Neon API, you can use the `quota` key to set usage limits for a variety of consumption metrics. These limits act as thresholds after which all active computes for a project are [suspended](#suspending-active-computes).

## Metrics and quotas

By default, Neon tracks a variety of consumption metrics at the project level. If you want to set quotas (max limits) for these metrics, you need to explicitly [configure](#configuring-quotas) them.

### Available metrics

Here are the relevant metrics that you can track in order to understand your users' current consumption levels.

#### Project-level metrics

- `active_time_seconds`
- `compute_time_seconds`
- `written_data_bytes`
- `data_transfer_bytes`

These consumption metrics represent total cumulative usage across all branches and computes in a given project, accrued so far in a given monthly billing period. Metrics are refreshed on the first day of the following month, when the new billing period starts.

#### Branch-level metric

There is an additional value that you also might want to track: `logical_size`, which gives you the current size of a particular branch.

Neon updates all metrics every 15 minutes but it could take up to 1 hour before they are reportable.

To find the current usage level for any of these metrics, see [querying metrics](#querying-metrics-and-quotas). You can read more about these metrics and how they impact billing here: [Usage metrics](/docs/introduction/usage-metrics)

### Corresponding quotas

You can set quotas for these consumption metrics per project using the `quota` settings object in the [Create project](https://api-docs.neon.tech/reference/createproject) or [Update project](https://api-docs.neon.tech/reference/updateproject) API.

The `quota` object includes an array of parameters used to set threshold limits. Their names generally match their corresponding metric:

- `active_time_seconds` &#8212; Sets the maximum amount of time your project's computes are allowed to be active during the current billing period. It excludes time when computes are in an `Idle` state due to [auto-suspension](/docs/reference/glossary#autosuspend).
- `compute_time_seconds` &#8212; Sets the maximum amount of CPU seconds allowed in total across all of a project's computes. This includes any computes deleted during the current billing period. Note that the larger the compute size per endpoint, the faster the project consumes `compute_time_seconds`. For example, 1 second at .25 vCPU costs .25 compute seconds, while 1 second at 4 vCPU costs 4 compute seconds.
  | vCPUs | active_time_seconds | compute_time_seconds |
  |:-------|:----------------------|:-----------------------|
  | 0.25 | 1 | 0.25 |
  | 4 | 1 | 4 |
- `written_data_bytes` &#8212; Sets the maximum amount of data in total, measured in bytes, that can be written across all of a project's branches for the month.
- `data_transfer_bytes` &#8212; Sets the maximum amount of egress data, measured in bytes, that can be transferred out of Neon from across all of a project's branches using the proxy.

There is one additional `quota` parameter, `logical_size_bytes`, which applies to individual branches, not to the overall project. You can use `logical_size_bytes` to set the maximum size (measured in bytes) that any one individual branch is allowed to reach. Once this threshold is met, the compute for that particular branch (and _only_ that particular branch) is suspended. Note that this limit is _not_ refreshed once per month: it is a strict size limit that applies for the life of the branch.

### Sample quotas

Let's say you want to set limits for an application with two tiers, Trial and Pro, you might set limits like the following:

| Parameter (project)  | Trial (.25 vCPU)                 | Pro (max 4 vCPU)                                  |
| -------------------- | -------------------------------- | ------------------------------------------------- |
| active_time_seconds  | 633,600 (business month 22 days) | 2,592,000 (30 days)                               |
| compute_time_seconds | 158,400 (approx 44 hours)        | 10,368,000 (4 times the active hours for 4 vCPUs) |
| written_data_bytes   | 1,000,000,000 (approx. 1 GiB)    | 50,000,000,000 (approx. 50 GiB)                   |
| data_transfer_bytes  | 500,000,000 (approx. 500 MiB)    | 10,000,000,000 (approx. 10 GiB)                   |

| Parameter (branch) | Trial                         | Pro                             |
| ------------------ | ----------------------------- | ------------------------------- |
| logical_size_bytes | 100,000,000 (approx. 100 MiB) | 10,000,000,000 (approx. 10 GiB) |

### Guidelines

Generally, the most effective quotas for controlling spend per project are those controlling maximum compute (`active_time_seconds` and `compute_time_seconds`) and maximum written storage (`written_data_bytes`). In practice, it is possible that `data_transfer_bytes` could introduce unintended logical constraints against your usage. For example, let's say you want to run a cleanup operation to reduce your storage. If part of this cleanup operation involves moving data across the network (for instance, to create an offsite backup before deletion), the `data_transfer_bytes` limit could prevent you from completing the operation &#8212; an undesirable situation where two measures meant to control cost interfere with one another.

### Neon default limits

In addition to the configurable limits that you can set, Neon also sets certain branch size limits by default. You might notice these limits in a [Get Project](#retrieving-details-about-a-project) response:

- `branch_logical_size_limit` (MiB)
- `branch_logical_size_limit_bytes`(Bytes)

These limits are not directly configurable. The Neon Free Plan branch size limit is 512 MiB (0.5 GiB). The Launch, Scale, and Business plans support any data size but have a "failsafe" logical data size limit of 200 GiB to prevent runaway branch size growth due to possible issues with your application. If you require larger limits, you can request it from Neon via your Partners contact at Neon.

The Neon Free Plan logical data size limit is approximately 512 MiB:

- `branch_logical_size_limit`: 512
- `branch_logical_size_limit_bytes`: 536870912

The Neon Launch, Scale, and Business plan failsafe limit is 200 GiB:

- `branch_logical_size_limit`: 204800
- `branch_logical_size_limit_bytes`: 214748364800

## Suspending active computes

_**What happens when a quota is met?**_

When any configured metric reaches its quota limit, all active computes for that project are automatically suspended. It is important to understand, this suspension is persistent. It works differently than the inactivity-based [autosuspend](/docs/guides/auto-suspend-guide), where computes restart at the next interaction: this suspend will _not_ restart at the next API call or incoming connection. If you don't take explicit action otherwise, the suspension remains in place until the end of the current billing period starts (`consumption_period_end`).

See [Querying metrics and quotas](#querying-metrics-and-quotas) to find the reset date, billing period, and other values related to a project's consumption.

<Admonition type="note">
Neon tracks these consumption metrics on a monthly cycle. If you want to track metrics on a different cycle, you need to take snapshots of your metrics at the desired interval and store the data externally. You can also use the  [Consumption API](#retrieving-metrics-for-all-projects) to collect metrics from across a range of billing periods.
</Admonition>

## Configuring quotas

You can set quotas using the Neon API either in a `POST` when you create a project or a `PATCH` to update an existing project:

- [Set quotas when you create the project](#set-quotas-when-you-create-the-project)
- [Update an existing project](#update-an-existing-project)

### Set quotas when you create the project

For performance reasons, you might want to configure these quotas at the same time that you create a new project for your user using the [Create a project](https://api-docs.neon.tech/reference/createproject) API, reducing the number of API calls you need to make.

Here is a sample `POST` in `curl` that creates a new project called `UserNew` and sets the `active_time_seconds` quota to a total allowed time of 10 hours (36,000 seconds) for the month, and a total allowed `compute_time_seconds` set to 2.5 hours (9,000 seconds) for the month. This 4:1 ratio between active and compute time is suitable for a fixed compute size of 0.25 vCPU.

```bash {11,12}
curl --request POST \
     --url https://console.neon.tech/api/v2/projects \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '
{
  "project": {
    "settings": {
      "quota": {
        "active_time_seconds": 36000,
        "compute_time_seconds": 9000
      }
    },
    "pg_version": 15,
    "name": "UserProject"
  }
}
' | jq
```

### Update an existing project

If you need to change the quota limits for an existing project &#8212; for example, if a user switches their plan to a higher usage tier &#8212; you can reset those limits via `PATCH` request. See [Update a project](https://api-docs.neon.tech/reference/updateproject) in the Neon API.

Here is a sample `PATCH` that updates both the `active_time_seconds` and `compute_time_seconds` quotas to 30 hours (108,000):

```bash {11,12}
curl --request PATCH \
     --url https://console.neon.tech/api/v2/projects/[project_ID]\
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '
{
  "project": {
    "settings": {
      "quota": {
        "active_time_seconds": 108000,
        "compute_time_seconds": 108000
      }
    }
  }
}
' | jq
```

## Querying metrics and quotas

You can use the Neon API to retrieve consumption metrics for your organization and projects through various endpoints:

| Endpoint                                                                                             | Description                                                                                                              | Plan Availability            | Docs                                                                                                                  |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| [Aggregated account metrics](https://api-docs.neon.tech/reference/getconsumptionhistoryperaccount)   | Aggregates the metrics from all projects in an account into a single cumulative number for each metric                   | Scale and Business plan only | [Get account-level aggregated metrics](metrics-api#get-account-level-aggregated-metrics)                              |
| [Granular metrics per project](https://api-docs.neon.tech/reference/getconsumptionhistoryperproject) | Provides detailed metrics for each project in an account at a specified granularity level (e.g., hourly, daily, monthly) | Scale and Business plan only | [Get granular project-level metrics for the account](metrics-api#get-granular-project-level-metrics-for-your-account) |
| [Single project metrics](https://api-docs.neon.tech/reference/getproject)                            | Retrieves detailed metrics and quota information for a specific project                                                  | All plans                    | [Get metrics for a single specified project](metrics-api#get-metrics-for-a-single-specified-project)                  |

## Resetting a project after suspend

Projects remain suspended until the next billing period. It is good practice to notify your users when they are close to reaching a limit; if the user is then suspended and loses access to their database, it will not be unexpected. If you have configured no further actions, the user will have to wait until the next billing period starts to resume usage.

Alternatively, you can actively reset a suspended compute by changing the impacted quota to `0`: this effectively removes the limit entirely. You will need to reset this quota at some point if you want to maintain limits.

### Using quotas to actively suspend a user

If you want to suspend a user for any reason &#8212; for example, suspicious activity or payment issues &#8212; you can use these quotas to actively suspend a given user. For example, setting `active_time_limit` to a very low threshold (e.g., `1`) will force a suspension if the user has 1 second of active compute for that month. To remove this suspension, you can set the threshold temporarily to `0` (infinite) or some value larger than their currently consumed usage.

## Other consumption related settings

In addition to setting quota limits against the project as a whole, there are other sizing-related settings you might want to use to control the amount of resources any particular endpoint is able to consume:

- `autoscaling_limit_min_cu` &#8212; Sets the minimium compute size for the endpoint. The default minimum is .25 vCPU but can be increased if your user's project could benefit from a larger compute start size.
- `autoscaling_limit_max_cu` &#8212; Sets a hard limit on how much compute an endpoint can consume in response to increased demand. For more info on min and max cpu limits, see [Autoscaling](/docs/guides/autoscaling-guide).
- `suspend_timeout_seconds` &#8212; Sets how long an endpoint's allotted compute will remain active with no current demand. After the timeout period, the endpoint is suspended until demand picks up. For more info, see [Autosuspend](/docs/guides/auto-suspend-guide).

There are several ways you can set these endpoint settings using the Neon API: you can set project-level defaults that apply for any new computes created in the project, you can define the endpoint settings when creating a new branch, or you can adjust these settings when creating or updating an endpoint for an existing branch.

See these sample CURL requests for each method.

<Tabs labels={["Project", "Branch","Endpoint"]}>

<TabItem>
In this sample, we are setting defaults for all new endpoints created in the project as a whole. The minimum compute size is at **1 vCPU**, the max size at **3 vCPU**, and a 10 minute (**600 seconds**) inactivty period before the endpoint is suspended.

These default values are set in the
`default_endpoint_settings` object.

```bash {9-12}
curl --request POST \
     --url https://console.neon.tech/api/v2/projects \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '
{
  "project": {
    "default_endpoint_settings": {
      "autoscaling_limit_min_cu": 1,
      "autoscaling_limit_max_cu": 3,
      "suspend_timeout_seconds": 600
    },
    "pg_version": 15
  }
}
' | jq
```

</TabItem>
<TabItem>
In this POST request, we are creating a new endpoint at the same time that we create our new branch called `Development`. We've sized the endpoint at **1 vCPU** min, **3 vCPU** max, and with a timeout period of 10 minutes (**600 seconds**).

```bash {14-16}
curl --request POST \
     --url https://console.neon.tech/api/v2/projects/noisy-pond-28482075/branches \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '
{
  "branch": {
    "name": "Development"
  },
  "endpoints": [
    {
      "type": "read_write",
      "autoscaling_limit_min_cu": 1,
      "autoscaling_limit_max_cu": 3,
      "suspend_timeout_seconds": 600
    }
  ]
}
' | jq
```

</TabItem>
<TabItem>
In this example, we are creating a new endpoint for an already existing branch with ID `br-wandering-field-12345678`, with a min compute of **2 vCPU**, a max of **6 vCPU**, and a suspend timeout of 5 minutes (**300** seconds).

```bash {10-13}
curl --request POST \
     --url https://console.neon.tech/api/v2/projects/noisy-pond-28482075/endpoints \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '
{
  "endpoint": {
    "type": "read_write",
    "autoscaling_limit_min_cu": 2,
    "autoscaling_limit_max_cu": 6,
    "suspend_timeout_seconds": 300,
    "branch_id": "br-wandering-field-12345678"
  }
}
' | jq
```

</TabItem>
</Tabs>
