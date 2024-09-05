---
title: Manage projects
enableTableOfContents: true
isDraft: false
subtitle: Learn how to manage Neon projects from the Neon Console or the Neon API.
redirectFrom:
  - /docs/get-started-with-neon/projects
updatedOn: '2024-09-05T17:14:45.246Z'
---

With Neon, everything starts with the project. It is the top-level object in the [Neon object hierarchy](/docs/manage/overview). A project can hold as many databases and branches as your application or workflow needs. However, [plan limits](/docs/introduction/plans) define how many projects you can create. The Neon Free Plan limits you to one project per Neon account.

Learn more about projects and how to manage them in these sections:

- [Default resources](#default-resources)
- [Project Settings](#about-the-settings-page)
- [Basic actions](#basic-actions)
- [Advanced settings](#advanced-settings)
- [Manage projects from the API](#manage-projects-with-the-neon-api)

## Default resources

When you add a new project, Neon creates the following resources by default:

- A default branch called `main`. You can create child branches from the default branch or from any previously created branch. For more information, see [Manage branches](/docs/manage/branches).
- A single primary read-write compute. This is the compute associated with the branch. For more information, see [Manage computes](/docs/manage/endpoints).
- A Postgres database that resides on the project's default branch. If you ddid not specify your own database name when creating the project, the database created is named `neondb`.
- A Postgres role that is named for your database. For example, if your database is named `neondb`, the project is created with a default role named `neondb_owner`.

## About the Settings page

Once you open a project, you can use the **Project settings** page to manage that particular project and configure any defaults.

![Project Settings page](/docs/manage/settings_page.png)

You can tab between these sections:

- **General** &#8212; Change the name of your project or copy the project ID.
- **Compute** &#8212; Set the autosuspend and sizing defaults for any new computes you create when branching.
- **Storage** &#8212; Choose how long Neon maintains a history of changes for all branches.
- **Sharing** &#8212; Let other users access your project's databases.
- **Delete** &#8212; Use with care! This action deletes your entire project and all its objects, and is irreversible.

## Basic actions

Here are some basic actions you can take to add or manage projects:

- [Create a project](#create-a-project)
- [View projects](#view-projects)
- [Change a project name](#change-the-name-or-copy-the-id-of-your-project)
- [Delete a project](#delete-a-project)
- [Share a project](#share-a-project)

### Create a project

The following instructions describe how to create additional Neon projects. If you are creating your very first Neon project, refer to the instructions in [Sign up](/docs/get-started-with-neon/signing-up). Neon Free Plan users are limited to a single Neon project. Support for multiple projects is only available to users on paid plans.

To create a Neon project:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. Click **New Project**.
3. Specify values for **Name**, **Postgres version**, and **Region**. Project names are limited to 64 characters. If you are a paying user, you can specify **Compute size** settings when creating a project. The settings you specify become the default settings for computes that you add to your project when creating [branches](/docs/manage/branches#create-a-branch) or [read replicas](/docs/guides/read-replica-guide).

   - Neon supports fixed size computes and autoscaling. For more information, see [Compute size and autoscaling configuration](/docs/manage/endpoints#compute-size-and-autoscaling-configuration).
   - The **Suspend compute after a period of inactivity** setting defines the period of inactivity after which a compute is automatically suspended. For more information, see [Autosuspend configuration](/docs/manage/endpoints#auto-suspend-configuration).

4. Click **Create Project**.

After creating a project, you are presented with a dialog that provides your connection details for a ready-to-use `neondb` database. The connection details include your password.

<Admonition type="tip">
Similar to **docs.new** for instantly creating Google Docs or **repo.new** for adding new GitHub repositories, you can use [pg.new](https://pg.new) to create a new Neon Postgres project. Simply visit [pg.new](https://pg.new) and you'll be taken straight to the **Create project** page where you can create your new project.
</Admonition>

### View projects

To view your projects:

1. Navigate to the [Neon Console](https://console.neon.tech).
1. Select **Home** or the Neon logo at the top left of the Console.
1. The **Projects** page lists your projects, including any projects that have been shared with you.

### Change the name or copy the ID of your project

You are permitted to change the name of your project at any point. The project ID is permanent.

To edit a Neon project:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. Select the project that you want to edit.
3. Select **Project settings**.
4. Select **General**.
5. Make your changes and click **Save**.

### Delete a project

Deleting a project is a permanent action, which also deletes any computes, branches, databases, and roles that belong to the project.

To delete a project:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. Select the project that you want to delete.
3. Select **Project settings**.
4. Select **Delete**.
5. Click **Delete project.**
6. On the confirmation dialog, click **Delete**.

<Admonition type="important">
If you are any of Neon's paid plans, such as our Launch or Scale plan, deleting all your Neon projects won't stop monthly billing. To avoid charges, you also need to downgrade to the Free plan. You can do so from the [Billing](https://console.neon.tech/app/billing#change_plan) page in the Neon Console.
</Admonition>

### Share a project

Neon's project sharing feature allows you to share your project with other Neon accounts.

To share a project:

1. In the Neon Console, select a project.
1. Select **Project settings**.
1. Select **Sharing**.
1. Under **Grant access to your project**, enter the email address of the account you want to share access with.
1. Click **Grant access**.

The email you specify is added to the list of **Users with access to the project**. The Neon account associated with that email address is granted full access to the project with the exception privileges required to delete the project. This account can also share the project with other Neon users. When that user logs in to Neon, the shared project is listed on their **Projects** page, under **Shared with me**.

The costs associated with a shared project are charged to the Neon account that owns the project. For example, if you share your project with another Neon user account, any usage incurred by that user within your project is billed to your Neon account, not theirs.

For additional information, refer to our [Project sharing guide](/docs/guides/project-sharing-guide).

## Advanced settings

From the **Project settings** page, you can also set defaults or apply bulk changes across your Neon objects:

- [Reset default compute size](#reset-the-default-compute-size)
- [Configure history retention range](#configure-history-retention)
- [Enable logical replication](#enable-logical-replication)
- [Configure IP Allow](#configure-ip-allow)

### Reset the default compute size

_Compute size_ is the number of Compute Units (CUs) assigned to a Neon compute. The number of CUs determines the processing capacity of the compute. One CU is equal to 1 vCPU with 4 GB of RAM. Currently, a Neon compute can have anywhere from .25 CUs to 10 CUs. Larger compute sizes will be supported in a future release.

For [Neon Free Plan](/docs/introduction/plans#free-plan) users, Neon sets your compute size to a static shared .25 vCPU, with 1 GB of RAM for each branch (max 10 branches).

By default, new branches inherit the compute size from your first branch (i.e., `main`). However, there may be times when you want to reset this default. For example, if you want to create read replica computes, where each replica requires less compute per branch.

To reset the default compute size, go to **Project settings** > **Compute**.

Using the slider, you can configure a fixed-size compute or enable autoscaling.

- **Fixed size:** Select a fixed compute size ranging from .25 CUs to 10 CUs. A fixed-size compute does not scale to meet workload demand.
- **Autoscaling:** Specify a minimum and maximum compute size. Neon scales the compute size up and down within the selected compute size boundaries in response to the current load. Currently, the _Autoscaling_ feature supports a range of 1/4 (.25) CU to 10 CUs. The 1/4 CU and 1/2 CU settings are _shared compute_. For information about how Neon implements the _Autoscaling_ feature, see [Autoscaling](/docs/introduction/autoscaling).

_Example: default minimum and maximum autoscale settings_

![Default autoscaling min and max](/docs/manage/default_autoscale.png)

### Configure history retention

By default, Neon retains a history of changes for all branches in a Neon project, which allows you to create a branch that restores data to any point within the defined retention period. The supported limits are up to 24 hours for [Neon Free Plan](/docs/introduction/plans#free-plan) users, 7 days for [Launch](/docs/introduction/plans#launch), 14 days for [Scale](/docs/introduction/plans#scale), and 30 days for [Business](/docs/introduction/plans#business) plan users. Please be aware that increasing the history retention period affects all branches in your project and increases [project storage](/docs/introduction/usage-metrics#storage).

To configure the history retention period for a project:

1. Select a project in the Neon Console.
2. On the Neon **Dashboard**, select **Project settings**.
3. Select **Storage**.
   ![History retention configuration](/docs/manage/history_retention.png)
4. Use the slider to select the history retention period.
5. Click **Save**.

## Enable logical replication

Logical replication enables replicating data from your Neon databases to a variety of external destinations, including data warehouses, analytical database services, messaging platforms, event-streaming platforms, and external Postgres databases.

<Admonition type="important">
Enabling logical replication modifies the PostgreSQL `wal_level` configuration parameter, changing it from `replica` to `logical` for all databases in your Neon project. Once the `wal_level` setting is changed to `logical`, it cannot be reverted. Enabling logical replication also restarts all computes in your Neon project, meaning that active connections will be dropped and have to reconnect.
</Admonition>

To enable logical replication in Neon:

1. Select your project in the Neon Console.
2. On the Neon **Dashboard**, select **Settings**.
3. Select **Logical Replication**.
4. Click **Enable** to enable logical replication.

You can verify that logical replication is enabled by running the following query:

```sql
SHOW wal_level;
wal_level
-----------
logical
```

After enabling logical replication, the next steps involve creating publications on your replication source database in Neon and configuring subscriptions on the destination system or service. To get started, refer to our [logical replication guides](/docs/guides/logical-replication-guide).

### Configure IP Allow

Available to Neon [Business](/docs/introduction/plans#business) plan users, the IP Allow feature provides an added layer of security for your data, restricting access to the branch where your database resides to only those IP addresses that you specify. In Neon, the IP allowlist is applied to all branches by default.

Optionally, you can allow unrestricted access to your project's [non-default branches](/docs/manage/branches#non-default-branch). For instance, you might want to restrict access to the default branch to a handful of trusted IPs while allowing unrestricted access to your development branches.

By default, Neon allows IP addresses from `0.0.0.0`, which means that Neon accepts connections from any IP address. Once you configure IP Allow by adding IP addresses or ranges, only those IP addresses will be allowed to access Neon.

<Admonition type="note">
Neon supports both [IPv4](https://en.wikipedia.org/wiki/Internet_Protocol_version_4) and [IPv6](https://en.wikipedia.org/wiki/IPv6) addresses.
</Admonition>

<Tabs labels={["Neon Console", "CLI", "API"]}>

<TabItem>

To configure an allowlist:

1. Select a project in the Neon Console.
2. On the Neon **Dashboard**, select **Project settings**.
3. Select **IP Allow**.
   ![IP Allow configuration](/docs/manage/ip_allow.png)
4. Specify the IP addresses you want to permit. Separate multiple entries with commas.
5. Optionally, select **Allow unrestricted access to non-default branches** to allow full access to your [no default branches](/docs/manage/branches#non-default-branch).
6. Click **Save changes**.

</TabItem>

<TabItem>

The [Neon CLI ip-allow command](/docs/reference/cli-ip-allow) supports IP Allow configuration. For example, the following `add` command adds IP addresses to the allowlist for an existing Neon project. Multiple entries are separated by a space. No delimiter is required.

```bash
neon ip-allow add 203.0.113.0 203.0.113.1
┌─────────────────────┬─────────────────────┬──────────────┬─────────────────────┐
│ Id                  │ Name                │ IP Addresses │ default branch Only │
├─────────────────────┼─────────────────────┼──────────────┼─────────────────────┤
│ wispy-haze-26469780 │ wispy-haze-26469780 │ 203.0.113.0  │ false               │
│                     │                     │ 203.0.113.1  │                     │
└─────────────────────┴─────────────────────┴──────────────┴─────────────────────┘
```

To apply an IP allowlist to the default branch only, use the you can `--protected-only` option:

```bash
neon ip-allow add 203.0.113.1 --protected-only
```

To reverse that setting, use `--protected-only false`.

```bash
neon ip-allow add 203.0.113.1 --protected-only false
```

</TabItem>

<TabItem>

The [Create project](https://api-docs.neon.tech/reference/createproject) and [Update project](https://api-docs.neon.tech/reference/updateproject) methods support **IP Allow** configuration. For example, the following API call configures **IP Allow** for an existing Neon project. Separate multiple entries with commas. Each entry must be quoted. You can set the `"protected_branches_only` option to `true` to apply the allowlist to your default branch only, or `false` to apply it to all branches in your Neon project.

```bash
curl -X PATCH \
     https://console.neon.tech/api/v2/projects/falling-salad-31638542 \
     -H 'accept: application/json' \
     -H 'authorization: Bearer $NEON_API_KEY' \
     -H 'content-type: application/json' \
     -d '
{
  "project": {
    "settings": {
      "allowed_ips": {
        "protected_branches_only": true,
        "ips": [
          "203.0.113.0", "203.0.113.1"
        ]
      }
    }
  }
}
' | jq
```

</TabItem>

</Tabs>

#### How to specify IP addresses

You can define an allowlist with individual IP addresses, IP ranges, or [CIDR notation](/docs/reference/glossary#cidr-notation). A combination of these options is also permitted. Multiple entries, whether they are the same or of different types, must be separated by a comma. Whitespace is ignored.

- **Add individual IP addresses**: You can add individual IP addresses that you want to allow. This is useful for granting access to specific users or devices. This example represents a single IP address:

  ```text
  192.0.2.1
  ```

- **Define IP ranges**: For broader access control, you can define IP ranges. This is useful for allowing access from a company network or a range of known IPs. This example range includes all IP addresses from `198.51.100.20` to `198.51.100.50`:

  ```text
  198.51.100.20-198.51.100.50
  ```

- **Use CIDR notation**: For more advanced control, you can use [CIDR (Classless Inter-Domain Routing) notation](/docs/reference/glossary#cidr-notation). This is a compact way of defining a range of IPs and is useful for larger networks or subnets. Using CIDR notation can be advantageous when managing access to branches with numerous potential users, such as in a large development team or a company-wide network.

  This CIDR notation example represents all 256 IP addresses from `203.0.113.0` to `203.0.113.255`.

  ```text
  203.0.113.0/24
  ```

- **Use IPv6 addresses**: Neon also supports specifying IPv6 addresses. For example:

  ```text
  2001:DB8:5432::/48
  ```

A combined example using all three options above, specified as a comma-separated list, would appear similar to the following:

```text
192.0.2.1, 198.51.100.20-198.51.100.50, 203.0.113.0/24, 2001:DB8:5432::/48
```

This list combines individual IP addresses, a range of IP addresses, a CIDR block, and an IPv6 address. It illustrates how different types of IP specifications can be used together in a single allowlist configuration, offering a flexible approach to access control.

#### Update an IP Allow configuration

You can update your IP Allow configuration via the Neon Console or API as described in [Configure IP Allow](#configure-ip-allow). Replace the current configuration with the new configuration. For example, if your IP Allow configuration currently allows access from IP address `192.0.2.1`, and you want to extend access to IP address `192.0.2.2`, specify both addresses in your new configuration: `192.0.2.1, 192.0.2.2`. You cannot append values to an existing configuration. You can only replace an existing configuration with a new one.

The Neon CLI provides an `ip-allow` command with `add`, `reset`, and `remove` options that you can use to update your IP Allow configuration. For instructions, refer to [Neon CLI commands — ip-allow](/docs/reference/cli-ip-allow).

#### Remove an IP Allow configuration

To remove an IP configuration entirely to go back to the default "no IP restrictions" (`0.0.0.0`) configuration:

<Tabs labels={["Neon Console", "CLI", "API"]}>

<TabItem>

1. Select a project in the Neon Console.
2. On the Neon **Dashboard**, select **Project settings**.
3. Select **IP Allow**.
4. Clear the **Allowed IP addresses and ranges** field.
5. If applicable, clear the **Apply to default branch only** checkbox.
6. Click **Apply changes**.

</TabItem>

<TabItem>

The [Neon CLI ip-allow command](/docs/reference/cli-ip-allow) supports removing an IP Allow configuration. To do so, specify `--ip-allow reset` without specifying any IP address values:

```bash
neon ip-allow reset
```

</TabItem>

<TabItem>

Specify the `ips` option with an empty string. If applicable, also include `"protected_branches_only": false`.

```bash
curl -X PATCH \
     https://console.neon.tech/api/v2/projects/falling-salad-31638542 \
     -H 'accept: application/json' \
     -H 'authorization: Bearer $NEON_API_KEY' \
     -H 'content-type: application/json' \
     -d '
{
  "project": {
    "settings": {
      "allowed_ips": {
        "protected_branches_only": false,
        "ips": []
      }
    }
  }
}
'
```

</TabItem>

</Tabs>

## Manage projects with the Neon API

Project actions performed in the Neon Console can also be performed using the Neon API. The following examples demonstrate how to create, view, and delete projects using the Neon API. For other project-related API methods, refer to the [Neon API reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api).

<Admonition type="note">
The API examples that follow may not show all of the user-configurable request body attributes that are available to you. To view all attributes for a particular method, refer to method's request body schema in the [Neon API reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api).
</Admonition>

The `jq` option specified in each example is an optional third-party tool that formats the `JSON` response, making it easier to read. For information about this utility, see [jq](https://stedolan.github.io/jq/).

### Prerequisites

A Neon API request requires an API key. For information about obtaining an API key, see [Create an API key](/docs/manage/api-keys#create-an-api-key). In the cURL examples shown below, `$NEON_API_KEY` is specified in place of an actual API key, which you must provide when making a Neon API request.

### Create a project with the API

The following Neon API method creates a project. The [Neon Free Plan](/docs/introduction/plans#free-plan) permits one project per account. To view the API documentation for this method, refer to the [Neon API reference](https://api-docs.neon.tech/reference/createproject).

```http
POST /projects
```

The API method appears as follows when specified in a cURL command. The `myproject` name value is a user-specified name for the project.

```bash
curl 'https://console.neon.tech/api/v2/projects' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
  "project": {
    "name": "myproject"
  }
}' | jq
```

The response includes information about the role, the database, the default branch, and the primary read-write compute that is created with the project.

<details>
<summary>Response body</summary>

```json
{
  "project": {
    "cpu_used_sec": 0,
    "id": "ep-cool-darkness-123456",
    "platform_id": "aws",
    "region_id": "aws-us-east-2",
    "name": "myproject",
    "provisioner": "k8s-pod",
    "pg_version": 15,
    "locked": false,
    "created_at": "2023-01-04T17:33:11Z",
    "updated_at": "2023-01-04T17:33:11Z",
    "proxy_host": "us-east-2.aws.neon.tech",
    "branch_logical_size_limit": 3072
  },
  "connection_uris": [
    {
      "connection_uri": "postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname"
    }
  ],
  "roles": [
    {
      "branch_id": "br-falling-frost-286006",
      "name": "alex",
      "password": "AbC123dEf",
      "protected": false,
      "created_at": "2023-01-04T17:33:11Z",
      "updated_at": "2023-01-04T17:33:11Z"
    },
    {
      "branch_id": "br-falling-frost-286006",
      "name": "web_access",
      "protected": true,
      "created_at": "2023-01-04T17:33:11Z",
      "updated_at": "2023-01-04T17:33:11Z"
    }
  ],
  "databases": [
    {
      "id": 1138408,
      "branch_id": "br-falling-frost-286006",
      "name": "dbname",
      "owner_name": "alex",
      "created_at": "2023-01-04T17:33:11Z",
      "updated_at": "2023-01-04T17:33:11Z"
    }
  ],
  "operations": [
    {
      "id": "b7c32d83-6402-49c8-b40b-0388309549da",
      "project_id": "ep-cool-darkness-123456",
      "branch_id": "br-falling-frost-286006",
      "action": "create_timeline",
      "status": "running",
      "failures_count": 0,
      "created_at": "2023-01-04T17:33:11Z",
      "updated_at": "2023-01-04T17:33:11Z"
    },
    {
      "id": "756f2b87-f45c-4a61-9b21-6cd3f3c48c68",
      "project_id": "ep-cool-darkness-123456",
      "branch_id": "br-falling-frost-286006",
      "endpoint_id": "ep-jolly-moon-631024",
      "action": "start_compute",
      "status": "scheduling",
      "failures_count": 0,
      "created_at": "2023-01-04T17:33:11Z",
      "updated_at": "2023-01-04T17:33:11Z"
    }
  ],
  "branch": {
    "id": "br-falling-frost-286006",
    "project_id": "ep-cool-darkness-123456",
    "name": "main",
    "current_state": "init",
    "pending_state": "ready",
    "created_at": "2023-01-04T17:33:11Z",
    "updated_at": "2023-01-04T17:33:11Z"
  },
  "endpoints": [
    {
      "host": "ep-jolly-moon-631024.us-east-2.aws.neon.tech",
      "id": "ep-jolly-moon-631024",
      "project_id": "ep-cool-darkness-123456",
      "branch_id": "br-falling-frost-286006",
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
      "created_at": "2023-01-04T17:33:11Z",
      "updated_at": "2023-01-04T17:33:11Z",
      "proxy_host": "us-east-2.aws.neon.tech"
    }
  ]
}
```

</details>

### List projects with the API

The following Neon API method lists projects for your Neon account. To view the API documentation for this method, refer to the [Neon API reference](https://api-docs.neon.tech/reference/listprojects).

```http
GET /projects
```

The API method appears as follows when specified in a cURL command:

```bash
curl 'https://console.neon.tech/api/v2/projects' \
 -H 'Accept: application/json' \
 -H "Authorization: Bearer $NEON_API_KEY" | jq
```

<details>
<summary>Response body</summary>

```json
{
  "projects": [
    {
      "cpu_used_sec": 0,
      "id": "purple-shape-491160",
      "platform_id": "aws",
      "region_id": "aws-us-east-2",
      "name": "purple-shape-491160",
      "provisioner": "k8s-pod",
      "pg_version": 15,
      "locked": false,
      "created_at": "2023-01-03T18:22:56Z",
      "updated_at": "2023-01-03T18:22:56Z",
      "proxy_host": "us-east-2.aws.neon.tech",
      "branch_logical_size_limit": 3072
    }
  ]
}
```

</details>

### Update a project with the API

The following Neon API method updates the specified project. To view the API documentation for this method, refer to the [Neon API reference](https://api-docs.neon.tech/reference/updateproject).

```http
PATCH /projects/{project_id}
```

The API method appears as follows when specified in a cURL command. The `project_id` is a required parameter. The example changes the project `name` to `project1`.

```bash
curl 'https://console.neon.tech/api/v2/projects/ep-cool-darkness-123456' \
  -H 'accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
  "project": {
    "name": "project1"
  }
}'
```

<details>
<summary>Response body</summary>

```json
{
  "project": {
    "cpu_used_sec": 0,
    "id": "ep-cool-darkness-123456",
    "platform_id": "aws",
    "region_id": "aws-us-east-2",
    "name": "project1",
    "provisioner": "k8s-pod",
    "pg_version": 15,
    "locked": false,
    "created_at": "2023-01-04T17:33:11Z",
    "updated_at": "2023-01-04T17:36:17Z",
    "proxy_host": "us-east-2.aws.neon.tech",
    "branch_logical_size_limit": 3072
  },
  "operations": []
}
```

</details>

### Delete a project with the API

The following Neon API method deletes the specified project. To view the API documentation for this method, refer to the [Neon API reference](https://api-docs.neon.tech/reference/deleteproject).

```http
DELETE /projects/{project_id}
```

The API method appears as follows when specified in a cURL command. The `project_id` is a required parameter.

```bash
curl -X 'DELETE' \
  'https://console.neon.tech/api/v2/projects/ep-cool-darkness-123456' \
  -H 'accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

<details>
<summary>Response body</summary>

```json
{
  "project": {
    "cpu_used_sec": 0,
    "id": "ep-cool-darkness-123456",
    "platform_id": "aws",
    "region_id": "aws-us-east-2",
    "name": "project1",
    "provisioner": "k8s-pod",
    "pg_version": 15,
    "locked": false,
    "created_at": "2023-01-04T17:33:11Z",
    "updated_at": "2023-01-04T17:36:17Z",
    "proxy_host": "us-east-2.aws.neon.tech",
    "branch_logical_size_limit": 3072
  }
}
```

</details>

<NeedHelp/>
