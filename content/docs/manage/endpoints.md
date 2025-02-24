---
title: Manage computes
enableTableOfContents: true
isDraft: false
updatedOn: '2025-02-21T15:22:59.788Z'
---

A compute is a virtualized service that runs applications. In Neon, a compute runs Postgres.

Each project has a primary read-write compute for its [default branch](/docs/reference/glossary#default-branch). Neon supports both read-write and [read replica](/docs/introduction/read-replicas) computes. A branch can have one primary (read-write) compute and multiple read replica computes. A compute is required to connect to a Neon branch (where your database resides) from a client or application.

To connect to a database in a branch, you must use a compute associated with that branch. The following diagram illustrates how an application connects to a branch via its compute:

```text
Project
    |---- default branch (main) ---- compute <--- application/client
             |    |
             |    |---- database
             |
             ---- child branch ---- compute <--- application/client
                            |
                            |---- database
```

Your Neon plan determines the resources (vCPUs and RAM) available to a compute. The [Neon Free Plan](/docs/introduction/plans#free-plan) supports computes with up to 2 vCPUs and 8 GB of RAM. Paid plans offer larger compute sizes. Larger computes consume more compute hours over the same period of active time than smaller computes.

## View a compute

A compute is associated with a branch. To view a compute, select **Branches** in the Neon Console, and select a branch. If the branch has a compute, it is shown on the **Computes** tab on the branch page.

Compute details shown on the **Computes** tab include:

- The type of compute, which can be **Primary** (read-write) or **Read Replica** (read-only).
- The compute status, typically **Active** or **Idle**.
- **Compute ID**: The compute ID, which always starts with an `ep-` prefix; for example: `ep-quiet-butterfly-w2qres1h`
- **Size**: The size of the compute. Shows autoscaling minimum and maximum vCPU values if autoscaling is enabled.
- **Last active**: The date and time the compute was last active.

**Edit**, **Monitor**, and **Connect** actions for a compute can be accessed from the **Computes** tab.

## Create a compute

You can only create a single primary read-write compute for a branch that does not have a compute, but a branch can have multiple read replica computes.

To create an endpoint:

1. In the Neon Console, select **Branches**.
1. Select a branch.
1. On the **Computes** tab, click **Add a compute** or **Add Read Replica** if you already have a primary read-write compute.
1. On the **Add new compute** drawer or **Add read replica** drawer, specify your compute settings, and click **Add**. Selecting the **Read replica** compute type creates a [read replica](/docs/introduction/read-replicas).

## Edit a compute

You can edit a compute to change the [compute size](#compute-size-and-autoscaling-configuration) or [scale to zero](#scale-to-zero-configuration) configuration.

To edit a compute:

1. In the Neon Console, select **Branches**.
1. Select a branch.
1. From the **Computes** tab, select **Edit** for the compute you want to edit.

   The **Edit** drawer opens, letting you modify settings such as compute size, the autoscaling configuration (if applicable), and your scale to zero setting.

1. Once you've made your changes, click **Save**. All changes take immediate effect.

For information about selecting an appropriate compute size or autoscaling configuration, see [How to size your compute](#how-to-size-your-compute).

### What happens to the compute when making changes

Some key points to understand about how your endpoint responds when you make changes to your compute settings:

- Changing the size of your fixed compute restarts the endpoint and _temporarily disconnects all existing connections_.
  <Admonition type="note">
  When your compute resizes automatically as part of the autoscaling feature, there are no restarts or disconnects; it just scales.
  </Admonition>

* Editing minimum or maximum autoscaling sizes also requires a restart; existing connections are temporarily disconnected.
* If you disable scale to zero, you may need to restart your compute manually to get the latest compute-related release updates from Neon if updates are not applied automatically by a [scheduled update](/docs/manage/updates). Scheduled updates are applied according to certain criteria, so not all computes receive these updates automatically. See [Restart a compute](#restart-a-compute).

To avoid prolonged interruptions resulting from compute restarts, we recommend configuring your clients and applications to reconnect automatically in case of a dropped connection. See [Handling connection disruptions](/docs/manage/updates#handling-connection-disruptions).

### Compute size and autoscaling configuration

You can change compute size settings when [editing a compute](#edit-a-compute).

_Compute size_ is the number of Compute Units (CUs) assigned to a Neon compute. The number of CUs determines the processing capacity of the compute. One CU has 1 vCPU and 4 GB of RAM, 2 CUs have 2 vCPUs and 8 GB of RAM, and so on. The amount of RAM in GB is always 4 times the vCPUs, as shown in the table below.

| Compute Units | vCPU | RAM    |
| :------------ | :--- | :----- |
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
| 9             | 9    | 36 GB  |
| 10            | 10   | 40 GB  |
| 11            | 11   | 44 GB  |
| 12            | 12   | 48 GB  |
| 13            | 13   | 52 GB  |
| 14            | 14   | 56 GB  |
| 15            | 15   | 60 GB  |
| 16            | 16   | 64 GB  |
| 18            | 18   | 72 GB  |
| 20            | 20   | 80 GB  |
| 22            | 22   | 88 GB  |
| 24            | 24   | 96 GB  |
| 26            | 26   | 104 GB |
| 28            | 28   | 112 GB |
| 30            | 30   | 120 GB |
| 32            | 32   | 128 GB |
| 34            | 34   | 136 GB |
| 36            | 36   | 144 GB |
| 38            | 38   | 152 GB |
| 40            | 40   | 160 GB |
| 42            | 42   | 168 GB |
| 44            | 44   | 176 GB |
| 46            | 46   | 184 GB |
| 48            | 48   | 192 GB |
| 50            | 50   | 200 GB |
| 52            | 52   | 208 GB |
| 54            | 54   | 216 GB |
| 56            | 56   | 224 GB |

Neon supports fixed-size and autoscaling compute configurations.

- **Fixed size:** Select a fixed compute size ranging from .25 CUs to 56 CUs. A fixed-size compute does not scale to meet workload demand.
- **Autoscaling:** Specify a minimum and maximum compute size. Neon scales the compute size up and down within the selected compute size boundaries in response to the current load. Currently, the _Autoscaling_ feature supports a range of 1/4 (.25) CU to 16 CUs. The 1/4 CU and 1/2 CU settings are _shared compute_. For information about how Neon implements the _Autoscaling_ feature, see [Autoscaling](/docs/introduction/autoscaling).

<Admonition type="info" title="monitoring autoscaling">
For information about monitoring your compute as it scales up and down, see [Monitor autoscaling](/docs/guides/autoscaling-guide#monitor-autoscaling).
</Admonition>

### How to size your compute

The size of your compute determines the amount of frequently accessed data you can cache in memory and the maximum number of simultaneous connections you can support. As a result, if your compute size is too small, this can lead to suboptimal query performance and connection limit issues.

In Postgres, the `shared_buffers` setting defines the amount of data that can be held in memory. In Neon, the `shared_buffers` parameter [scales with compute size](/docs/reference/compatibility#parameter-settings-that-differ-by-compute-size) and Neon also uses a Local File Cache (LFC) to extend the amount of memory available for caching data. The LFC can use up to 75% of your compute's RAM.

The Postgres `max_connections` setting defines your compute's maximum simultaneous connection limit and is set according to your compute size configuration.

The following table outlines the vCPU, RAM, LFC size (75% of RAM), and the `max_connections` limit for each compute size that Neon supports. To understand how `max_connections` is determined for an autoscaling configuration, see [Parameter settings that differ by compute size](/docs/reference/compatibility#parameter-settings-that-differ-by-compute-size).

<Admonition type="note">
Compute size support differs by [Neon plan](https://neon.tech/docs/introduction/plans). Autoscaling is supported up to 16 CU. Neon supports fixed compute sizes (no autoscaling) for computes sizes larger than 16 CU.
</Admonition>

| Compute Size (CU) | vCPU | RAM (GB) | LFC size (GB) | max_connections |
| :---------------- | :--- | :------- | :------------ | :-------------- |
| 0.25              | 0.25 | 1        | 0.75          | 112             |
| 0.50              | 0.50 | 2        | 1.5           | 225             |
| 1                 | 1    | 4        | 3             | 450             |
| 2                 | 2    | 8        | 6             | 901             |
| 3                 | 3    | 12       | 9             | 1351            |
| 4                 | 4    | 16       | 12            | 1802            |
| 5                 | 5    | 20       | 15            | 2253            |
| 6                 | 6    | 24       | 18            | 2703            |
| 7                 | 7    | 28       | 21            | 3154            |
| 8                 | 8    | 32       | 24            | 3604            |
| 9                 | 9    | 36       | 27            | 4000            |
| 10                | 10   | 40       | 30            | 4000            |
| 11                | 11   | 44       | 33            | 4000            |
| 12                | 12   | 48       | 36            | 4000            |
| 13                | 13   | 52       | 39            | 4000            |
| 14                | 14   | 56       | 42            | 4000            |
| 15                | 15   | 60       | 45            | 4000            |
| 16                | 16   | 64       | 48            | 4000            |
| 18                | 18   | 72       | 54            | 4000            |
| 20                | 20   | 80       | 60            | 4000            |
| 22                | 22   | 88       | 66            | 4000            |
| 24                | 24   | 96       | 72            | 4000            |
| 26                | 26   | 104      | 78            | 4000            |
| 28                | 28   | 112      | 84            | 4000            |
| 30                | 30   | 120      | 90            | 4000            |
| 32                | 32   | 128      | 96            | 4000            |
| 34                | 34   | 136      | 102           | 4000            |
| 36                | 36   | 144      | 108           | 4000            |
| 38                | 38   | 152      | 114           | 4000            |

|

When selecting a compute size, ideally, you want to keep as much of your dataset in memory as possible. This improves performance by reducing the amount of reads from storage. If your dataset is not too large, select a compute size that will hold the entire dataset in memory. For larger datasets that cannot be fully held in memory, select a compute size that can hold your [working set](/docs/reference/glossary#working-set). Selecting a compute size for a working set involves advanced steps, which are outlined below. See [Sizing your compute based on the working set](#sizing-your-compute-based-on-the-working-set).

Regarding connection limits, you'll want a compute size that can support your anticipated maximum number of concurrent connections. If you are using **Autoscaling**, it is important to remember that your `max_connections` setting is based on both your minimum and the maximum compute size. See [Parameter settings that differ by compute size](/docs/reference/compatibility#parameter-settings-that-differ-by-compute-size) for details. To avoid any `max_connections` constraints, you can use a pooled connection with your application, which supports up to 10,000 concurrent user connections. See [Connection pooling](/docs/connect/connection-pooling).

#### Sizing your compute based on the working set

If it's not possible to hold your entire dataset in memory, the next best option is to ensure that your working set is in memory. A working set is your frequently accessed or recently used data and indexes. To determine whether your working set is fully in memory, you can query the cache hit ratio for your Neon compute. The cache hit ratio tells you how many queries are served from memory. Queries not served from memory bypass the cache to retrieve data from Neon storage (the [Pageserver](#docs/reference/glossary#pageserver)), which can affect query performance.

As mentioned above, Neon computes use a Local File Cache (LFC) to extend Postgres shared buffers. You can monitor the Local File Cache hit rate and your working set size from Neon's **Monitoring** page, where you'll find the following charts:

- [Local file cache hit rate](/docs/introduction/monitoring-page#local-file-cache-hit-rate)
- [Working set size](/docs/introduction/monitoring-page#working-set-size)

Neon also provides a [neon](/docs/extensions/neon) extension with a `neon_stat_file_cache` view that you can use to query the cache hit ratio for your compute's Local File Cache. For more information, see [The neon extension](/docs/extensions/neon).

#### Autoscaling considerations

Autoscaling is most effective when your data (either your full dataset or your working set) can be fully cached in memory on the minimum compute size in your autoscaling configuration.

Consider this scenario: If your data size is approximately 6 GB, starting with a compute size of .25 CU can lead to suboptimal performance because your data cannot be adequately cached. While your compute _will_ scale up from .25 CU on demand, you may experience poor query performance until your compute scales up and fully caches your working set. You can avoid this issue if your minimum compute size can hold your working set in memory.

As mentioned above, your `max_connections` setting is based on both your minimum and maximum compute size settings. To avoid any `max_connections` constraints, you can use a pooled connection for your application. See [Connection pooling](/docs/connect/connection-pooling).

### Scale to zero configuration

Neon's _Scale to Zero_ feature automatically transitions a compute into an idle state after 5 minutes of inactivity. You can disable scale to zero to maintain an "always-active" compute. An "always-active" configuration eliminates the few hundred milliseconds seconds of latency required to reactivate a compute but is likely to increase your compute time usage on systems where the database is not always active.

For more information, refer to [Configuring scale to zero for Neon computes](/docs/guides/scale-to-zero-guide).

<Admonition type="important">
If you disable scale to zero, you may need to restart your compute manually to get the latest compute-related release updates from Neon if updates are not applied automatically by a [scheduled update](/docs/manage/updates). Scheduled updates are applied according to certain criteria, so not all computes receive these updates automatically. See [Restart a compute](#restart-a-compute).
</Admonition>

## Restart a compute

It is sometimes necessary to restart a compute. Reasons for restarting a compute might include:

- Applying upgraded limits after upgrading to a paid plan
- Picking up the latest compute-related updates, which Neon typically releases weekly
- Picking up a new Postgres extension or extension version released by Neon
- Resolving performance issues or unexpected behavior

Restarting ensures your compute is running with the latest configurations and improvements.

<Admonition type="important">
Restarting a compute interrupts any connections currently using the compute. To avoid prolonged interruptions resulting from compute restarts, we recommend configuring your clients and applications to reconnect automatically in case of a dropped connection.
</Admonition>

You can restart a compute using one of the following methods:

- Issue a [Restart endpoint](https://api-docs.neon.tech/reference/restartprojectendpoint) call using the Neon API. You can do this directly from the Neon API Reference using the **Try It!** feature or via the command line with a cURL command similar to the one shown below. You'll need your [project ID](/docs/reference/glossary#project-id), compute [endpoint ID](/docs/reference/glossary#endpoint-id), and an [API key](/docs/manage/api-keys#create-an-api-key).
  ```bash
  curl --request POST \
     --url https://console.neon.tech/api/v2/projects/cool-forest-86753099/endpoints/ep-calm-flower-a5b75h79/restart \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY'
  ```
- Stop activity on your compute (stop running queries) and wait for your compute to suspend due to inactivity. By default, Neon suspends a compute after 5 minutes of inactivity. You can watch the status of your compute on the **Branches** page in the Neon Console. Select your branch and monitor your compute's **Status** field. Wait for it to report an `Idle` status. The compute will restart the next time it's accessed, and the status will change to `Active`.

## Delete a compute

A branch can have a single read-write compute and multiple read replica computes. You can delete any of these computes from a branch. However, be aware that a compute is required to connect to a branch and access its data. If you delete a compute and add it back later, the new compute will have different connection details.

To delete a compute:

1. In the Neon Console, select **Branches**.
1. Select a branch.
1. On the **Computes** tab, click **Edit** for the compute you want to delete.
1. At the bottom of the **Edit compute** drawer, click **Delete compute**.

## Manage computes with the Neon API

Compute actions performed in the Neon Console can also be performed using the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api). The following examples demonstrate how to create, view, update, and delete computes using the Neon API. For other compute-related API methods, refer to the [Neon API reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api).

<Admonition type="note">
The API examples that follow may not show all of the user-configurable request body attributes that are available to you. To view all attributes for a particular method, refer to method's request body schema in the [Neon API reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api).
</Admonition>

The `jq` option specified in each example is an optional third-party tool that formats the `JSON` response, making it easier to read. For information about this utility, see [jq](https://stedolan.github.io/jq/).

### Prerequisites

A Neon API request requires an API key. For information about obtaining an API key, see [Create an API key](/docs/manage/api-keys#create-an-api-key). In the cURL examples below, `$NEON_API_KEY` is specified in place of an actual API key, which you must provide when making a Neon API request.

<LinkAPIKey />
### Create a compute with the API

The following Neon API method creates a compute.

```http
POST /projects/{project_id}/endpoints
```

The API method appears as follows when specified in a cURL command. The branch you specify cannot have an existing compute. A compute must be associated with a branch. Neon supports read-write and read replica compute. A branch can have a single primary read-write compute but supports multiple read replica computes.

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

### List computes with the API

The following Neon API method lists computes for the specified project. A compute belongs to a Neon project. To view the API documentation for this method, refer to the [Neon API reference](https://api-docs.neon.tech/reference/listprojectendpoints).

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

### Update a compute with the API

The following Neon API method updates the specified compute. To view the API documentation for this method, refer to the [Neon API reference](https://api-docs.neon.tech/reference/updateprojectendpoint).

```http
PATCH /projects/{project_id}/endpoints/{endpoint_id}
```

The API method appears as follows when specified in a cURL command. The example reassigns the compute to another branch by changing the `branch_id`. The branch that you specify cannot have an existing compute. A compute must be associated with a branch, and a branch can have only one primary read-write compute. Multiple read-replica computes are allowed.

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

### Delete a compute with the API

The following Neon API method deletes the specified compute. To view the API documentation for this method, refer to the [Neon API reference](https://api-docs.neon.tech/reference/deleteprojectendpoint).

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

## Compute-related issues

This section outlines compute-related issues you may encounter and possible resolutions.

### No space left on device

You may encounter an error similar to the following when your compute's local disk storage is full:

```bash shouldWrap
ERROR: could not write to file "base/pgsql_tmp/pgsql_tmp1234.56.fileset/o12of34.p1.0": No space left on device (SQLSTATE 53100)
```

Neon computes allocate 20 GiB of local disk space or 15 GiB x the maximum compute size (whichever is highest) for temporary files used by Postgres. Data-intensive operations can sometimes consume all of this space, resulting in `No space left on device` errors.

To resolve this issue, you can try the following strategies:

- **Identify and terminate resource-intensive processes**: These could be long-running queries, operations, or possibly sync or replication activities. You can start your investigation by [listing running queries by duration](/docs/postgresql/query-reference#list-running-queries-by-duration).
- **Optimize queries to reduce temporary file usage**.
- **Adjust pipeline settings for third-party sync or replication**: If you're syncing or replicating data with an external service, modify the pipeline settings to control disk space usage.

If the issue persists, refer to our [Neon Support channels](/docs/introduction/support#support-channels).

### Compute is not suspending

In some cases, you may observe that your compute remains constantly active for no apparent reason. Possible causes for a constantly active compute when not expected include:

- **Connection requests**: Frequent connection requests from clients, applications, or integrations can prevent a compute from suspending automatically. Each connection resets the scale to zero timer.
- **Background processes**: Some applications or background jobs may run periodic tasks that keep the connection active.

Possible steps you can take to identify the issues include:

1. **Checking for active processes**

   You can run the following query to identify active sessions and their states:

   ```sql
   SELECT
     pid,
     usename,
     query,
     state,
     query_start
   FROM
     pg_stat_activity
   WHERE
     query_start >= now() - interval '24 hours'
   ORDER BY
     query_start DESC;
   ```

   Look for processes initiated by your users, applications, or integrations that may be keeping your compute active.

2. **Review connection patterns**

   - Ensure that no applications are sending frequent, unnecessary connection requests.
   - Consider batching connections if possible, or use [connection pooling](/docs/connect/connection-pooling) to limit persistent connections.

3. **Optimize any background jobs**

   If background jobs are needed, reduce their frequency or adjust their timing to allow Neon's scale to zero feature to activate after the defined period of inactivity (the default is 5 minutes). For more information, refer to our [Scale to zero guide](/docs/guides/scale-to-zero-guide).

<NeedHelp/>
