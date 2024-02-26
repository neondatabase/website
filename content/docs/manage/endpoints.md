---
title: Manage computes
enableTableOfContents: true
isDraft: false
updatedOn: '2024-02-26T11:23:38.243Z'
---

A single read-write compute endpoint is created for your project's [primary branch](/docs/reference/glossary#primary-branch), by default.

To connect to a database that resides in a branch, you must connect via a compute endpoint associated with the branch. The following diagram shows the project's primary branch (`main`) and a child branch, both of which have an associated compute endpoint.

```text
Project
    |----primary branch (main) ---- compute endpoint <--- application/client
             |    |
             |    |---- database (neondb)
             |
             ---- child branch ---- compute endpoint <--- application/client
                            |
                            |---- database (mydb)
```

Neon supports both read-write and read-only compute endpoints. Read-only compute endpoints are also referred to as [Read replicas](/docs/introduction/read-replicas). A branch can have a single read-write compute endpoint but supports multiple read-only compute endpoints.

Tier limits define resources (vCPUs and RAM) available to a compute endpoint. The  [Neon Free Tier](/docs/introduction/plans#free-tier) provides a shared vCPU and up to 1 GB of RAM per compute endpoint. Paid plans support larger compute sizes and autoscaling.

## View a compute endpoint

A compute endpoint is associated with a branch. To view a compute endpoint, select **Branches** in the Neon Console, and select a branch. If the branch has a compute endpoint, it is shown on the branch page.

Compute endpoint details shown on the branch page include:

- **Id**: The compute endpoint ID.
-- **Type**: The type of compute endpoint. `R/W` (Read-write) or `R/O` (Read-only).
- **Status**: The compute endpoint status (`Active`, `Idle`, or `Stopped`).
- **Compute size**: The size of the compute endpoint. Users on paid plans can configure the amount of vCPU and RAM for a compute endpoint when creating or editing a compute endpoint. Shows autoscaling minimum and maximum vCPU values if autoscaling is enabled.
- **Auto-suspend delay**: The number of seconds of inactivity after which a compute endpoint is automatically suspended. The default is 300 seconds (5 minutes). For more information, see [Autosuspend configuration](#auto-suspend-configuration).
- **Last active**: The date and time the compute was last active.

## Create a compute endpoint

You can only create a read-write compute endpoint for a branch that does not have one, but a branch can have multiple read-only compute endpoints (referred to as "read replicas"). [Read replicas](/docs/guides/read-replica-guide) are a paid plan feature.

To create an endpoint:

1. In the Neon Console, select **Branches**.
1. Select a branch that does not have an endpoint
1. Click **Add compute**.
1. On the **Create compute endpoint** dialog, specify your settings and click **Create**. Selecting **Read-only** creates a [Read replica](/docs/introduction/read-replicas).

## Edit a compute endpoint

Neon paid plan users can edit a compute endpoint to change the [compute size](#compute-size-and-autoscaling-configuration) or [Autosuspend](#auto-suspend-configuration) configuration.

To edit a compute endpoint:

1. In the Neon Console, select **Branches**.
1. Select a branch.
1. Click the kebab menu in the **Computes** table, and select **Edit**.
   
   The **Edit** window opens, letting you take a range of actions, depending on your tier.
1. Once you've made your changes, click **Save**. All changes take immediate effect.

For information about selecting an appropriate compute size, see [How to size your compute](#how-to-size-your-compute).

### What happens to the compute endpoint when making changes

Some key points to understand about how your endpoint responds when you make changes to your compute settings:

* Changing the size of your fixed compute restarts the endpoint and _temporarily disconnects all existing connections_. 
  <Admonition type="note">
  When your compute resizes automatically as part of the autoscaling feature, there are no restarts or disconnects; it just scales. 
  </Admonition>
* Editing minimum or maximum autoscaling sizes also requires a restart; existing connections are temporarily disconnected.
* Changes to autosuspend settings do not require an endpoint restart; existing connections are unaffected.

### Compute size and autoscaling configuration

Users on paid plans can change compute size settings when [editing a compute endpoint](#edit-a-compute-endpoint).

_Compute size_ is the number of Compute Units (CUs) assigned to a Neon compute endpoint. The number of CUs determines the processing capacity of the compute endpoint. One CU has 1 vCPU and 4 GB of RAM, 2 CUs have 2 vCPUs and 8 GB of RAM, and so on. The amount of RAM in GB is always 4 times the vCPUs, as shown in the table below.

| Compute size (in CUs)  | vCPU | RAM    |
|:--------------|:-----|:-------|
| .25           | .25  | 1 GB   |
| .5            | .5   | 2 GB   |
| 1             | 1    | 4 GB   |
| 2             | 2    | 8 GB   |
| 3             | 3    | 12 GB  |
| 4             | 4    | 16 GB  |
| 5             | 5    | 20 GB  |
| 6             | 6    | 24 GB  |
| 7             | 7    | 28 GB  |
| 8             | 8    | 32 GB  |

Neon supports fixed-size and autoscaling compute configurations.

- **Fixed size:** You can use the slider to select a fixed compute size. A fixed-size compute does not scale to meet workload demand.
- **Autoscaling:** You can also use the slider to specify a minimum and maximum compute size. Neon scales the compute size up and down within the selected compute size boundaries to meet workload demand. For information about how Neon implements the _Autoscaling_ feature, see [Autoscaling](/docs/introduction/autoscaling).

<Admonition type="info">
The `neon_utils` extension provides a `num_cpus()` function you can use to monitor how the _Autoscaling_ feature allocates compute resources in response to workload. For more information, see [The neon_utils extension](/docs/extensions/neon-utils).
</Admonition>

### How to size your compute

The size of your compute determines the amount of memory available to cache your frequently accessed data and the maximum number of simultaneous connections you can support. As a result, if your compute size is too small, this can lead to suboptimal query performance and connection limit issues. 

In Postgres, the `shared_buffers` setting defines the amount of data that can be held in memory. In Neon, the `shared_buffers` parameter is always set to 128 MB, but Neon uses a local file cache to extend the amount of memory allocated to shared buffers to 50% of your compute's RAM. The 50% RAM limit is a guideline rather than an enforced limit, but it's advisable not to exceed this maximum; otherwise, you might encounter out-of-memory errors.

The Postgres `max_connections` setting defines your compute's maximum simultaneous connection limit and is set according to your compute size. Larger computes support higher maximum connection limits.

The following table outlines the vCPU, RAM, `shared_buffer` limit (50 % of RAM), and the `max_connections` limit for each compute size that Neon supports.

| Compute Size (CU) | vCPU | RAM   | shared_buffers | max_connections | 
|--------------|------|-------|----------------|-----------------|
| 0.25         | 0.25 | 1 GB  | 0.5 GB         | 112             |
| 0.50         | 0.50 | 2 GB  | 1 GB           | 225             |
| 1            | 1    | 4 GB  | 2 GB           | 450             |
| 2            | 2    | 8 GB  | 4 GB           | 901             |
| 3            | 3    | 12 GB | 6 GB           | 1351            |
| 4            | 4    | 16 GB | 8 GB           | 1802            |
| 5            | 5    | 20 GB | 10 GB          | 2253            |
| 6            | 6    | 24 GB | 12 GB          | 2703            |
| 7            | 7    | 28 GB | 14 GB          | 3154            |
| 8            | 8    | 32 GB | 16 GB          | 3,604           |


<Admonition type="note">
Users on paid plans can configure the size of their computes. The compute size for Free Tier users is set at .25 CU (.25 vCPU and 1 GB RAM).
</Admonition> 

When selecting a compute size, ideally, you want to keep as much of your dataset in memory as possible. This improves performance by reducing the amount of reads from storage. If your dataset is not too large, select a compute size that will hold the entire dataset in memory. For larger datasets that cannot be fully held in memory, select a compute size that can hold your [working set](/docs/reference/glossary#working-set).

Regarding connection limits, you'll want a compute size that can support your anticipated maximum number of concurrent connections. If you are using _Autoscaling_, it is important to remember that your `max_connections` setting is based on the _minimum compute size_ in your autoscaling configuration. The `max_connections` setting does not scale with your compute. To avoid the `max_connections` constraint, you can use a pooled connection with your application, which supports up to 10,000 concurrent user connections. See [Connection pooling](/docs/connect/connection-pooling).



#### Autoscaling considerations

Autoscaling is most effective when your data (either your full dataset or your working set) can be fully cached in memory on the minimum compute size in your autoscaling configuration.

Consider this scenario: If your data size is approximately 6 GB, starting with a compute size of .25 CU can lead to suboptimal performance because your data cannot be adequately cached. While your compute _will_ scale up from .25 CU on demand, you may experience poor query performance until your compute scales up and fully caches your working set. You can avoid this issue if your minimum compute size can hold your working set in memory.

As mentioned above, your `max_connections` setting is based on the minimum compute size in your autoscaling configuration and does not scale along with your compute. To avoid this `max_connections` constraint, you can use a pooled connection for your application. See [Connection pooling](/docs/connect/connection-pooling).

### Autosuspend configuration

Neon's _Autosuspend_ feature automatically transitions a compute endpoint into an `Idle` state after a period of inactivity, also known as "scale-to-zero". By default, suspension occurs after 5 minutes of inactivity, but this delay can be adjusted. For instance, you can increase the delay to reduce the frequency of suspensions, or you can disable autosuspend completely to maintain an "always-active" compute endpoint. An "always-active" configuration eliminates the few seconds of latency required to reactivate a compute endpoint but is likely to increase your compute time usage.

The maximum **Suspend compute after a period of inactivity** setting is 7 days. To configure a compute as "always-active", deselect **Suspend compute after a period of inactivity**. For more information, refer to [Configuring autosuspend for Neon computes](/docs/guides/auto-suspend-guide).

## Restart a compute endpoint

It is sometimes necessary to restart a compute endpoint. For example, if you upgrade to a paid plan account, you may want to restart your compute endpoint to immediately apply your upgraded limits.

<Admonition type="important">
Please be aware that restarting a compute endpoint interrupts any connections currently using the compute endpoint.
</Admonition>

You can restart a compute endpoint using one of the following methods:

- Stop activity on your compute endpoint (stop running queries) and wait for your compute endpoint to suspend due to inactivity. By default, Neon suspends a compute after 5 minutes of inactivity. You can watch the status of your compute on the **Branches** page in the Neon console. Select your branch and monitor your compute's **Status** field. Wait for it to report an `Idle` status. The compute will restart the next time it's accessed, and the status will change to `Active`. 
- Issue [Suspend endpoint](https://api-docs.neon.tech/reference/suspendprojectendpoint) and [Start endpoint](https://api-docs.neon.tech/reference/startprojectendpoint) API calls. You can do this directly from the [Neon API Reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api), using the **Try It!** feature. You'll need an [API key](https://neon.tech/docs/manage/api-keys#create-an-api-key).
- Users on paid plans can temporarily set a compute's **Suspend compute after a period of inactivity** setting to 1 second to initiate a restart (the default setting is 5 minutes). See [Autosuspend configuration](/docs/manage/endpoints#auto-suspend-configuration) for instructions. After doing so, check the **Operations** page in the Neon Console to see if your compute endpoint restarted. Look for `suspend_compute` and `start_compute` actions.

## Delete a compute endpoint

Deleting a compute endpoint is a permanent action.

To delete a compute endpoint:

1. In the Neon Console, select **Branches**.
1. Select a branch.
1. Click the kebab menu in the **Computes** table, and select **Delete**.
1. On the confirmation dialog, click **Delete**.

## Manage compute endpoints with the Neon API

Compute endpoint actions performed in the Neon Console can also be performed using the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api). The following examples demonstrate how to create, view, update, and delete compute endpoints using the Neon API. For other compute endpoint API methods, refer to the [Neon API reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api).

<Admonition type="note">
The API examples that follow may not show all of the user-configurable request body attributes that are available to you. To view all attributes for a particular method, refer to method's request body schema in the [Neon API reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api).
</Admonition>

The `jq` option specified in each example is an optional third-party tool that formats the `JSON` response, making it easier to read. For information about this utility, see [jq](https://stedolan.github.io/jq/).

### Prerequisites

A Neon API request requires an API key. For information about obtaining an API key, see [Create an API key](/docs/manage/api-keys#create-an-api-key). In the cURL examples below, `$NEON_API_KEY` is specified in place of an actual API key, which you must provide when making a Neon API request.

### Create a compute endpoint with the API

The following Neon API method creates a compute endpoint.

```http
POST /projects/{project_id}/endpoints
```

The API method appears as follows when specified in a cURL command. The branch you specify cannot have an existing compute endpoint. A compute endpoint must be associated with a branch, and a branch can have only one compute endpoint. Neon  supports read-write and read-only compute endpoints. Read-only compute endpoints are for creating [Read replicas](/docs/introduction/read-replicas). A branch can have a single read-write compute endpoint but supports multiple read-only compute endpoints.

```bash
curl -X 'POST' \
  'https://console.neon.tech/api/v2/projects/hidden-cell-763301/endpoints' \
  -H 'accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
  "endpoint": {
    "branch_id": "br-blue-tooth-671580",
    "type": "read_write"
  }
}'
```

<details>
<summary>Response body</summary>

```json
{
  "endpoint": {
    "host": "ep-aged-math-668285.us-east-2.aws.neon.tech",
    "id": "ep-aged-math-668285",
    "project_id": "hidden-cell-763301",
    "branch_id": "br-blue-tooth-671580",
    "autoscaling_limit_min_cu": 1,
    "autoscaling_limit_max_cu": 1,
    "region_id": "aws-us-east-2",
    "type": "read_write",
    "current_state": "init",
    "pending_state": "active",
    "settings": {
      "pg_settings": {}
    },
    "pooler_enabled": false,
    "pooler_mode": "transaction",
    "disabled": false,
    "passwordless_access": true,
    "created_at": "2023-01-04T18:39:41Z",
    "updated_at": "2023-01-04T18:39:41Z",
    "proxy_host": "us-east-2.aws.neon.tech"
  },
  "operations": [
    {
      "id": "e0e4da91-8576-4348-913b-aaf61a46d314",
      "project_id": "hidden-cell-763301",
      "branch_id": "br-blue-tooth-671580",
      "endpoint_id": "ep-aged-math-668285",
      "action": "start_compute",
      "status": "running",
      "failures_count": 0,
      "created_at": "2023-01-04T18:39:41Z",
      "updated_at": "2023-01-04T18:39:41Z"
    }
  ]
}
```

</details>

### List compute endpoints with the API

The following Neon API method lists compute endpoints for the specified project. A compute endpoint belongs to a Neon project. To view the API documentation for this method, refer to the [Neon API reference](https://api-docs.neon.tech/reference/listprojectendpoints).

```http
GET /projects/{project_id}/endpoints
```

The API method appears as follows when specified in a cURL command:

```bash
curl -X 'GET' \
  'https://console.neon.tech/api/v2/projects/hidden-cell-763301/endpoints' \
  -H 'accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

<details>
<summary>Response body</summary>

```json
{
  "endpoints": [
    {
      "host": "ep-young-art-646685.us-east-2.aws.neon.tech",
      "id": "ep-young-art-646685",
      "project_id": "hidden-cell-763301",
      "branch_id": "br-shy-credit-899131",
      "autoscaling_limit_min_cu": 1,
      "autoscaling_limit_max_cu": 1,
      "region_id": "aws-us-east-2",
      "type": "read_write",
      "current_state": "idle",
      "settings": {
        "pg_settings": {}
      },
      "pooler_enabled": false,
      "pooler_mode": "transaction",
      "disabled": false,
      "passwordless_access": true,
      "last_active": "2023-01-04T18:38:25Z",
      "created_at": "2023-01-04T18:38:23Z",
      "updated_at": "2023-01-04T18:43:36Z",
      "proxy_host": "us-east-2.aws.neon.tech"
    },
    {
      "host": "ep-aged-math-668285.us-east-2.aws.neon.tech",
      "id": "ep-aged-math-668285",
      "project_id": "hidden-cell-763301",
      "branch_id": "br-blue-tooth-671580",
      "autoscaling_limit_min_cu": 1,
      "autoscaling_limit_max_cu": 1,
      "region_id": "aws-us-east-2",
      "type": "read_write",
      "current_state": "idle",
      "settings": {
        "pg_settings": {}
      },
      "pooler_enabled": false,
      "pooler_mode": "transaction",
      "disabled": false,
      "passwordless_access": true,
      "last_active": "2023-01-04T18:39:42Z",
      "created_at": "2023-01-04T18:39:41Z",
      "updated_at": "2023-01-04T18:44:48Z",
      "proxy_host": "us-east-2.aws.neon.tech"
    }
  ]
}
```

</details>

### Update a compute endpoint with the API

The following Neon API method updates the specified compute endpoint. To view the API documentation for this method, refer to the [Neon API reference](https://api-docs.neon.tech/reference/updateprojectendpoint).

```http
PATCH /projects/{project_id}/endpoints/{endpoint_id}
```

The API method appears as follows when specified in a cURL command. The example reassigns the compute endpoint to another branch by changing the `branch_id`. The branch that you specify cannot have an existing compute endpoint. A compute endpoint must be associated with a branch, and a branch can have only one compute endpoint.

```bash
curl -X 'PATCH' \
  'https://console.neon.tech/api/v2/projects/hidden-cell-763301/endpoints/ep-young-art-646685' \
  -H 'accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
  "endpoint": {
    "branch_id": "br-green-lab-617946"
  }
}'
```

<details>
<summary>Response body</summary>

```json
{
  "endpoint": {
    "host": "ep-young-art-646685.us-east-2.aws.neon.tech",
    "id": "ep-young-art-646685",
    "project_id": "hidden-cell-763301",
    "branch_id": "br-green-lab-617946",
    "autoscaling_limit_min_cu": 1,
    "autoscaling_limit_max_cu": 1,
    "region_id": "aws-us-east-2",
    "type": "read_write",
    "current_state": "idle",
    "pending_state": "idle",
    "settings": {
      "pg_settings": {}
    },
    "pooler_enabled": false,
    "pooler_mode": "transaction",
    "disabled": false,
    "passwordless_access": true,
    "last_active": "2023-01-04T18:38:25Z",
    "created_at": "2023-01-04T18:38:23Z",
    "updated_at": "2023-01-04T18:47:36Z",
    "proxy_host": "us-east-2.aws.neon.tech"
  },
  "operations": [
    {
      "id": "03bf0bbc-cc46-4863-a5c4-f31fc1881228",
      "project_id": "hidden-cell-763301",
      "branch_id": "br-green-lab-617946",
      "endpoint_id": "ep-young-art-646685",
      "action": "apply_config",
      "status": "running",
      "failures_count": 0,
      "created_at": "2023-01-04T18:47:36Z",
      "updated_at": "2023-01-04T18:47:36Z"
    },
    {
      "id": "c96be00c-6340-4fb2-b80a-5ae96f469969",
      "project_id": "hidden-cell-763301",
      "branch_id": "br-green-lab-617946",
      "endpoint_id": "ep-young-art-646685",
      "action": "suspend_compute",
      "status": "scheduling",
      "failures_count": 0,
      "created_at": "2023-01-04T18:47:36Z",
      "updated_at": "2023-01-04T18:47:36Z"
    }
  ]
}
```

</details>

### Delete a compute endpoint with the API

The following Neon API method deletes the specified compute endpoint. To view the API documentation for this method, refer to the [Neon API reference](https://api-docs.neon.tech/reference/deleteprojectendpoint).

```http
DELETE /projects/{project_id}/endpoints/{endpoint_id}
```

The API method appears as follows when specified in a cURL command.

```bash
curl -X 'DELETE' \
  'https://console.neon.tech/api/v2/projects/hidden-cell-763301/endpoints/ep-young-art-646685' \
  -H 'accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

<details>
<summary>Response body</summary>

```json
{
  "endpoint": {
    "host": "ep-young-art-646685.us-east-2.aws.neon.tech",
    "id": "ep-young-art-646685",
    "project_id": "hidden-cell-763301",
    "branch_id": "br-green-lab-617946",
    "autoscaling_limit_min_cu": 1,
    "autoscaling_limit_max_cu": 1,
    "region_id": "aws-us-east-2",
    "type": "read_write",
    "current_state": "idle",
    "settings": {
      "pg_settings": {}
    },
    "pooler_enabled": false,
    "pooler_mode": "transaction",
    "disabled": false,
    "passwordless_access": true,
    "last_active": "2023-01-04T18:38:25Z",
    "created_at": "2023-01-04T18:38:23Z",
    "updated_at": "2023-01-04T18:47:45Z",
    "proxy_host": "us-east-2.aws.neon.tech"
  },
  "operations": []
}
```

</details>

<NeedHelp/>
