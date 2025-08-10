---
title: Manage projects
enableTableOfContents: true
isDraft: false
subtitle: Learn how to manage Neon projects from the Neon Console or the Neon API.
redirectFrom:
  - /docs/get-started/projects
updatedOn: '2025-08-02T10:33:29.300Z'
---

In Neon, the project is your main workspace. Within a project, you create branches for different workflows, like environments, features, or previews. Each branch contains its own databases, roles, computes, and replicas. Your [Neon Plan](/docs/introduction/plans) determines how many projects you can create and the resource limits within those projects.

## Default resources

When you add a new project, Neon creates the following resources by default:

- Two branches are created for you by default: `production` (your main branch for production workloads) and `development` (a child branch for development work). You can create additional child branches from either of these, or from any other branch. For more information, see [Manage branches](/docs/manage/branches).
- A single primary read-write compute. This is the compute associated with the branch. For more information, see [Manage computes](/docs/manage/computes).
- A Postgres database that resides on the project's default branch. If you did not specify your own database name when creating the project, the database created is named `neondb`.
- A Postgres role that is named for your database. For example, if your database is named `neondb`, the project is created with a default role named `neondb_owner`.
- Each [Neon plan](/docs/introduction/plans) comes with a specific storage allowance. Beyond this allowance on paid plans, extra usage costs apply. Billing-related allowances aside, Neon projects can support data sizes up to 4 TiB. To increase this limit, [contact the Neon Sales team](/contact-sales).

## Create a project

The following instructions describe how to create additional Neon projects. If you are creating your very first Neon project, refer to the instructions in [Playing with Neon](/docs/get-started/signing-up).

To create a Neon project:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. Click **New Project**.
3. Specify values for **Project Name**, **Postgres version**, **Cloud service provider**, and **Region**. Project names are limited to 64 characters.
4. Click **Create Project**.

After creating a project, you are directed to the **Project Dashboard**.

<Admonition type="tip">
You can also use [pg.new](https://pg.new) to create a new Neon Postgres project. Simply visit [pg.new](https://pg.new) and you'll be taken directly to the **Create project** page where you can create your new project.
</Admonition>

## View projects

To view your projects:

1. Navigate to the [Neon Console](https://console.neon.tech).
1. From the breadcrumb navigation menu at the top-left of the console, select your organization.
1. The **Projects** page lists your projects, including any projects that have been shared with you.

## Project settings

Once you open a project, you can use the **Settings** page to manage your project and configure any defaults.

![Project Settings page](/docs/manage/settings_page.png)

The **Settings** page includes these sub-pages:

- **General** — Change the name of your project or copy the project ID.
- **Compute** — Set the scale to zero and sizing defaults for any new computes you create when branching.
- **Instant restore** — Set the restore window to enable instant restore, time travel queries, and branching from past states.
- **Updates** — Schedule a time for Postgres and Neon updates.
- **Collaborators** — Invite external collaborators to join your Neon project.
- **Network security** — Configure Neon's IP and Private Networking features for secure access.
- **RLS** — Configure Neon Row-Level Security (RLS) to apply row-level security policies to your Neon project.
- **Logical replication** — Enable logical replication to replicate data from your Neon project to external data services and platforms.
- **Transfer** — Transfer your project from the current organization to another organization you are a member of.
- **Delete** — Use with care! This action deletes your entire project and all its objects, and is irreversible.

### General project settings

On the **General** page, you are permitted to change the name of your project or copy the project ID. The project ID is permanent and cannot be changed.

### Change your project's default compute settings

You can change your project's default compute settings on the **Compute** page. These settings determine the compute resources allocated to any new branches or read replicas you create.

![default_compute_settings](/docs/manage/default_compute_settings.png)

<Admonition type="important">
Changes to default compute settings only affect **newly created computes**. Existing computes, including those on your primary branch and read replicas, will not be automatically updated. To change settings for existing computes, you need to update them individually through the **Branches** page.
</Admonition>

A Compute Unit (CU) represents 1 vCPU with 4 GB of RAM. New branches inherit compute settings from your first branch, but you can change these defaults to:

- Set smaller compute sizes for preview deployments and development branches
- Standardize settings across read replicas
- Optimize resource usage and costs for non-production workloads

Neon supports two compute configurations:

- **Fixed size:** Select a fixed compute size ranging from .25 CUs to 56 CUs
- **Autoscaling:** Specify minimum and maximum compute sizes (from .25 CU to 16 CUs) to automatically scale based on workload. Note: When setting maximum above 10 CUs, the minimum must be at least max/8. For more information, see [Autoscaling](/docs/introduction/autoscaling)

### Configure your restore window

By default, Neon retains a history of changes for all branches in your project, enabling features like:

- [Instant restore](/docs/introduction/branch-restore) for recovering lost data
- [Time Travel](/docs/guides/time-travel-assist) queries for investigating data issues

The default retention window is **1 day** across all plans to help avoid unexpected storage costs. If you extend this restore window, you'll expand the range of data recovery and query options, but note that this will also increase your [storage](/docs/introduction/usage-metrics#storage) usage, especially with multiple active branches.

Also note that adjusting the restore window affects _all_ branches in your project.

To configure the restore window for a project:

1. Select a project in the Neon Console.
2. On your **Project Dashboard**, select **Settings**.
3. Select **Restore window**.
   ![Restore window configuration](/docs/manage/instant_restore_setting.png)
4. Use the slider to select the restore window.
5. Click **Save**.

For more information about plan limits, see [Neon plans](/docs/introduction/plans).

### Schedule updates for your project

To keep your Neon computes and Postgres instances up to date, Neon automatically applies scheduled updates that include Postgres minor version upgrades, security patches, and new features. Updates are applied to the computes within your project. They require a quick compute restart, take only a few seconds, and typically occur weekly.

On the Free Plan, updates are automatically scheduled. On paid plans, you can set a preferred day and time for updates. Restarts occur within your selected time window and take only a few seconds.

To set your project's update schedule or view currently scheduled updates:

1. Go to **Settings** > **Updates**.
1. Choose a day of the week and an hour. Updates will occur within this time window and take only a few seconds.

For more information, see [Updates](/docs/manage/updates).

### Invite collaborators to a project

Neon's project collaboration feature allows you to invite external Neon accounts to collaborate on a Neon project.

<Admonition type="note">
Organization members cannot be added as collaborators to organization-owned projects since they already have access to all projects through their organization membership.
</Admonition>

To invite collaborators to a Neon project:

1. In the Neon Console, select a project.
1. Select **Settings**.
1. Select **Collaborators**.
1. Select **Invite** and enter the email address of the account you want to collaborate with.
1. Click **Invite**.

The email you specify is added to the list of **Collaborators**. The Neon account associated with that email address is granted full access to the project, with the exception of privileges required to delete the project. This account can also invite other Neon users to the project. When that user logs in to Neon, the project they were invited to is listed on their **Projects** page under **Shared with you**.

The costs associated with projects being collaborated on are charged to the Neon account that owns the project. For example, if you invite another Neon user account to a project you own, any usage incurred by that user within your project is billed to your Neon account, not theirs.

For additional information, refer to our [Project collaboration guide](/docs/guides/project-collaboration-guide).

### Configure IP Allow

Available to Neon [Scale](/docs/introduction/plans#scale) and [Business](/docs/introduction/plans#business) plan users, the IP Allow feature provides an added layer of security for your data, restricting access to the branch where your database resides to only those IP addresses that you specify. In Neon, the IP allowlist is applied to all branches by default.

Optionally, you can allow unrestricted access to your project's [non-default branches](/docs/manage/branches#non-default-branch). For instance, you might want to restrict access to the default branch to a handful of trusted IPs while allowing unrestricted access to your development branches.

By default, Neon allows IP addresses from `0.0.0.0`, which means that Neon accepts connections from any IP address. Once you configure IP Allow by adding IP addresses or ranges, only those IP addresses will be allowed to access Neon.

<Admonition type="note">
Neon projects provisioned on AWS support both [IPv4](https://en.wikipedia.org/wiki/Internet_Protocol_version_4) and [IPv6](https://en.wikipedia.org/wiki/IPv6) addresses. Neon project provisioned on Azure currently on support IPv4.
</Admonition>

<Tabs labels={["Neon Console", "CLI", "API"]}>

<TabItem>

To configure an allowlist:

1. Select a project in the Neon Console.
2. On the **Project Dashboard**, select **Settings**.
3. Select **Network security**.
   ![IP Allow configuration](/docs/manage/ip_allow.png)
4. Under **IP Allow**, specify the IP addresses you want to permit. Separate multiple entries with commas.
5. Optionally, under **Branch access**, select **Restrict IP Access to protected branches only** to restrict access to only the branches you have designated as protected.
6. Click **Save changes**.

</TabItem>

<TabItem>

The [Neon CLI ip-allow command](/docs/reference/cli-ip-allow) supports IP Allow configuration. For example, the following `add` command adds IP addresses to the allowlist for an existing Neon project. Multiple entries are separated by a space. No delimiter is required.

```bash
neon ip-allow add 203.0.113.0 203.0.113.1
┌─────────────────────┬─────────────────────┬──────────────┬─────────────────────┐
│ Id                  │ Name                │ IP Addresses │ default branch Only │
├─────────────────────|─────────────────────┼──────────────┼─────────────────────┤
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

- **Use IPv6 addresses**: Neon projects provisioned on AWS also support specifying IPv6 addresses. For example:

  <Admonition type="note">
  IPv6 is not yet supported for projects provisioned on Azure.
  </Admonition>

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
2. On the **Project Dashboard**, select **Settings**.
3. Select **IP Allow**.
4. Clear the **Allowed IP addresses and ranges** field.
5. If applicable, clear the **Restrict IP Access to protected branches only** checkbox.
6. Click **Save changes**.

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

### Enable Row-Level Security (RLS)

Neon RLS lets you integrate a JWT-based auth provider (such as Clerk, Auth0, or Azure AD) so Postgres can validate user identity and enforce row-level access with database policies. Configure your provider’s JWKS URL in the project’s Settings > RLS page, optionally set an expected audience (aud) when required, and use the `authenticated@` connection for client or server access. For setup steps and examples, see [About Neon RLS](/docs/guides/neon-rls) and the [Neon RLS Tutorial](/docs/guides/neon-rls-tutorial).

### Enable logical replication

Logical replication lets you replicate data changes from Neon to external data services and platforms, including data warehouses, analytical database services, messaging platforms, event-streaming platforms, and external Postgres databases.

<Admonition type="important">
Enabling logical replication modifies the PostgreSQL `wal_level` configuration parameter, changing it from `replica` to `logical` for all databases in your Neon project. Once the `wal_level` setting is changed to `logical`, it cannot be reverted. Enabling logical replication also restarts all computes in your Neon project, meaning that active connections will be dropped and have to reconnect.
</Admonition>

To enable logical replication in Neon:

1. Select your project in the Neon Console.
2. On the **Project Dashboard**, select **Settings**.
3. Select **Logical replication**.
4. Click **Enable** to enable logical replication.

You can verify that logical replication is enabled by running the following query:

```sql
SHOW wal_level;
wal_level
-----------
logical
```

After enabling logical replication, the next steps involve creating publications on your replication source database in Neon and configuring subscriptions on the destination system or service. To get started, refer to our [logical replication guides](/docs/guides/logical-replication-guide).

### Delete a project

Deleting a project is a permanent action, which also deletes any computes, branches, databases, and roles that belong to the project.

To delete a project:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. Select the project that you want to delete.
3. Select **Settings**.
4. Select **Delete**.

<Admonition type="important">
If you are any of Neon's paid plans, deleting all your Neon projects won't stop monthly billing. To avoid charges, you also need to downgrade to the Free plan. You can do so from the [Billing](https://console.neon.tech/app/billing#change_plan) page in the Neon Console.
</Admonition>

## Manage projects with the Neon API

Project actions performed in the Neon Console can also be performed using the Neon API. The following examples demonstrate how to create, view, and delete projects using the Neon API. For other project-related API methods, refer to the [Neon API reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api).

<Admonition type="note">
The API examples that follow may not show all of the user-configurable request body attributes that are available to you. To view all attributes for a particular method, refer to method's request body schema in the [Neon API reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api).
</Admonition>

The `jq` option specified in each example is an optional third-party tool that formats the `JSON` response, making it easier to read. For information about this utility, see [jq](https://stedolan.github.io/jq/).

### Prerequisites

A Neon API request requires an API key. For information about obtaining an API key, see [Create an API key](/docs/manage/api-keys#create-an-api-key). In the cURL examples shown below, `$NEON_API_KEY` is specified in place of an actual API key, which you must provide when making a Neon API request.

<LinkAPIKey />

### Create a project with the API

The following Neon API method creates a project. To view the API documentation for this method, refer to the [Neon API reference](https://api-docs.neon.tech/reference/createproject).

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
    "data_storage_bytes_hour": 0,
    "data_transfer_bytes": 0,
    "written_data_bytes": 0,
    "compute_time_seconds": 0,
    "active_time_seconds": 0,
    "cpu_used_sec": 0,
    "id": "ep-cool-darkness-123456",
    "platform_id": "aws",
    "region_id": "aws-us-east-1",
    "name": "myproject",
    "provisioner": "k8s-neonvm",
    "default_endpoint_settings": {
      "autoscaling_limit_min_cu": 0.25,
      "autoscaling_limit_max_cu": 0.25,
      "suspend_timeout_seconds": 0
    },
    "settings": {
      "allowed_ips": {
        "ips": [],
        "protected_branches_only": false
      },
      "enable_logical_replication": false,
      "maintenance_window": {
        "weekdays": [7],
        "start_time": "06:00",
        "end_time": "07:00"
      },
      "block_public_connections": false,
      "block_vpc_connections": false,
      "hipaa": false
    },
    "pg_version": 17,
    "proxy_host": "c-2.us-east-1.aws.neon.tech",
    "branch_logical_size_limit": 512,
    "branch_logical_size_limit_bytes": 536870912,
    "store_passwords": true,
    "creation_source": "console",
    "history_retention_seconds": 86400,
    "created_at": "2025-08-04T05:15:41Z",
    "updated_at": "2025-08-04T05:15:41Z",
    "consumption_period_start": "0001-01-01T00:00:00Z",
    "consumption_period_end": "0001-01-01T00:00:00Z",
    "owner_id": "91cbdacd-06c2-49f5-bacf-78b9463c81ca"
  },
  "connection_uris": [
    {
      "connection_uri": "postgresql://alex:AbC123dEf@ep-cool-darkness-123456.c-2.us-east-1.aws.neon.tech/dbname?sslmode=require&channel_binding=require",
      "connection_parameters": {
        "database": "dbname",
        "password": "AbC123dEf",
        "role": "alex",
        "host": "ep-cool-darkness-123456.c-2.us-east-1.aws.neon.tech",
        "pooler_host": "ep-cool-darkness-123456-pooler.c-2.us-east-1.aws.neon.tech"
      }
    }
  ],
  "roles": [
    {
      "branch_id": "br-gentle-salad-ad7v90qq",
      "name": "neondb_owner",
      "password": "npg_Se0ECYqaJ5jA",
      "protected": false,
      "created_at": "2025-08-04T05:15:41Z",
      "updated_at": "2025-08-04T05:15:41Z"
    }
  ],
  "databases": [
    {
      "id": 5140981,
      "branch_id": "br-gentle-salad-ad7v90qq",
      "name": "neondb",
      "owner_name": "neondb_owner",
      "created_at": "2025-08-04T05:15:41Z",
      "updated_at": "2025-08-04T05:15:41Z"
    }
  ],
  "operations": [
    {
      "id": "cacca1d4-ad0e-46dc-ae82-886ffb96889d",
      "project_id": "ep-cool-darkness-123456",
      "branch_id": "br-gentle-salad-ad7v90qq",
      "action": "create_timeline",
      "status": "running",
      "failures_count": 0,
      "created_at": "2025-08-04T05:15:41Z",
      "updated_at": "2025-08-04T05:15:41Z",
      "total_duration_ms": 0
    },
    {
      "id": "1df43d11-5c07-4de1-9440-ac09d305fdf3",
      "project_id": "ep-cool-darkness-123456",
      "branch_id": "br-gentle-salad-ad7v90qq",
      "endpoint_id": "ep-cool-darkness-123456",
      "action": "start_compute",
      "status": "scheduling",
      "failures_count": 0,
      "created_at": "2025-08-04T05:15:41Z",
      "updated_at": "2025-08-04T05:15:41Z",
      "total_duration_ms": 0
    }
  ],
  "branch": {
    "id": "br-gentle-salad-ad7v90qq",
    "project_id": "ep-cool-darkness-123456",
    "name": "main",
    "current_state": "init",
    "pending_state": "ready",
    "state_changed_at": "2025-08-04T05:15:41Z",
    "creation_source": "console",
    "primary": true,
    "default": true,
    "protected": false,
    "cpu_used_sec": 0,
    "compute_time_seconds": 0,
    "active_time_seconds": 0,
    "written_data_bytes": 0,
    "data_transfer_bytes": 0,
    "created_at": "2025-08-04T05:15:41Z",
    "updated_at": "2025-08-04T05:15:41Z",
    "init_source": "parent-data"
  },
  "endpoints": [
    {
      "host": "ep-cool-darkness-123456.c-2.us-east-1.aws.neon.tech",
      "id": "ep-cool-darkness-123456",
      "project_id": "ep-cool-darkness-123456",
      "branch_id": "br-gentle-salad-ad7v90qq",
      "autoscaling_limit_min_cu": 0.25,
      "autoscaling_limit_max_cu": 0.25,
      "region_id": "aws-us-east-1",
      "type": "read_write",
      "current_state": "init",
      "pending_state": "active",
      "settings": {},
      "pooler_enabled": false,
      "pooler_mode": "transaction",
      "disabled": false,
      "passwordless_access": true,
      "creation_source": "console",
      "created_at": "2025-08-04T05:15:41Z",
      "updated_at": "2025-08-04T05:15:41Z",
      "proxy_host": "c-2.us-east-1.aws.neon.tech",
      "suspend_timeout_seconds": 0,
      "provisioner": "k8s-neonvm"
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
      "id": "frosty-tree-10754091",
      "platform_id": "aws",
      "region_id": "aws-ap-southeast-1",
      "name": "personal_projects",
      "provisioner": "k8s-neonvm",
      "default_endpoint_settings": {
        "autoscaling_limit_min_cu": 0.25,
        "autoscaling_limit_max_cu": 2,
        "suspend_timeout_seconds": 0
      },
      "settings": {
        "allowed_ips": {
          "ips": [],
          "protected_branches_only": false
        },
        "enable_logical_replication": false,
        "maintenance_window": {
          "weekdays": [4],
          "start_time": "15:00",
          "end_time": "16:00"
        },
        "block_public_connections": false,
        "block_vpc_connections": false,
        "hipaa": false
      },
      "pg_version": 17,
      "proxy_host": "ap-southeast-1.aws.neon.tech",
      "branch_logical_size_limit": 512,
      "branch_logical_size_limit_bytes": 536870912,
      "store_passwords": true,
      "active_time": 1260,
      "cpu_used_sec": 319,
      "creation_source": "console",
      "created_at": "2024-11-08T17:20:01Z",
      "updated_at": "2025-08-03T01:16:18Z",
      "synthetic_storage_size": 96929448,
      "quota_reset_at": "2025-09-01T00:00:00Z",
      "owner_id": "91cbdacd-06c2-49f5-bacf-78b9463c81ca",
      "compute_last_active_at": "2025-08-03T01:16:18Z",
      "history_retention_seconds": 86400
    },
    {
      "id": "lingering-grass-54827563",
      "platform_id": "aws",
      "region_id": "aws-ap-southeast-1",
      "name": "brizai",
      "provisioner": "k8s-neonvm",
      "default_endpoint_settings": {
        "autoscaling_limit_min_cu": 0.25,
        "autoscaling_limit_max_cu": 2,
        "suspend_timeout_seconds": 0
      },
      "settings": {
        "allowed_ips": {
          "ips": [],
          "protected_branches_only": false
        },
        "enable_logical_replication": false,
        "maintenance_window": {
          "weekdays": [1],
          "start_time": "16:00",
          "end_time": "17:00"
        },
        "block_public_connections": false,
        "block_vpc_connections": false,
        "hipaa": false
      },
      "pg_version": 17,
      "proxy_host": "ap-southeast-1.aws.neon.tech",
      "branch_logical_size_limit": 512,
      "branch_logical_size_limit_bytes": 536870912,
      "store_passwords": true,
      "active_time": 0,
      "cpu_used_sec": 0,
      "creation_source": "console",
      "created_at": "2024-10-28T16:26:49Z",
      "updated_at": "2025-08-01T00:34:48Z",
      "synthetic_storage_size": 31082816,
      "quota_reset_at": "2025-09-01T00:00:00Z",
      "owner_id": "91cbdacd-06c2-49f5-bacf-78b9463c81ca",
      "compute_last_active_at": "2025-02-14T09:51:30Z",
      "history_retention_seconds": 86400
    }
  ],
  "unavailable_project_ids": [],
  "pagination": {
    "cursor": "lingering-grass-54827563"
  },
  "applications": {
    "frosty-tree-10754091": ["vercel"]
  },
  "integrations": {
    "frosty-tree-10754091": ["vercel"]
  }
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
curl -X PATCH 'https://console.neon.tech/api/v2/projects/ep-cool-darkness-123456' \
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
    "data_storage_bytes_hour": 35697544,
    "data_transfer_bytes": 13444,
    "written_data_bytes": 34595496,
    "compute_time_seconds": 89,
    "active_time_seconds": 348,
    "cpu_used_sec": 89,
    "id": "ep-cool-darkness-123456",
    "platform_id": "aws",
    "region_id": "aws-us-east-1",
    "name": "project1",
    "provisioner": "k8s-neonvm",
    "default_endpoint_settings": {
      "autoscaling_limit_min_cu": 0.25,
      "autoscaling_limit_max_cu": 0.25,
      "suspend_timeout_seconds": 0
    },
    "settings": {
      "allowed_ips": {
        "ips": [],
        "protected_branches_only": false
      },
      "enable_logical_replication": false,
      "maintenance_window": {
        "weekdays": [7],
        "start_time": "06:00",
        "end_time": "07:00"
      },
      "block_public_connections": false,
      "block_vpc_connections": false,
      "hipaa": false
    },
    "pg_version": 17,
    "proxy_host": "c-2.us-east-1.aws.neon.tech",
    "branch_logical_size_limit": 512,
    "branch_logical_size_limit_bytes": 536870912,
    "store_passwords": true,
    "creation_source": "console",
    "history_retention_seconds": 86400,
    "created_at": "2025-08-04T05:15:41Z",
    "updated_at": "2025-08-04T05:55:58Z",
    "synthetic_storage_size": 35697544,
    "consumption_period_start": "0001-01-01T00:00:00Z",
    "consumption_period_end": "0001-01-01T00:00:00Z",
    "owner_id": "91cbdacd-06c2-49f5-bacf-78b9463c81ca",
    "compute_last_active_at": "2025-08-04T05:15:47Z"
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
    "data_storage_bytes_hour": 35697544,
    "data_transfer_bytes": 13444,
    "written_data_bytes": 34595496,
    "compute_time_seconds": 89,
    "active_time_seconds": 348,
    "cpu_used_sec": 89,
    "id": "ep-cool-darkness-123456",
    "platform_id": "aws",
    "region_id": "aws-us-east-1",
    "name": "project2",
    "provisioner": "k8s-neonvm",
    "default_endpoint_settings": {
      "autoscaling_limit_min_cu": 0.25,
      "autoscaling_limit_max_cu": 0.25,
      "suspend_timeout_seconds": 0
    },
    "settings": {
      "allowed_ips": {
        "ips": [],
        "protected_branches_only": false
      },
      "enable_logical_replication": false,
      "maintenance_window": {
        "weekdays": [7],
        "start_time": "06:00",
        "end_time": "07:00"
      },
      "block_public_connections": false,
      "block_vpc_connections": false,
      "hipaa": false
    },
    "pg_version": 17,
    "proxy_host": "c-2.us-east-1.aws.neon.tech",
    "branch_logical_size_limit": 512,
    "branch_logical_size_limit_bytes": 536870912,
    "store_passwords": true,
    "creation_source": "console",
    "history_retention_seconds": 86400,
    "created_at": "2025-08-04T05:15:41Z",
    "updated_at": "2025-08-04T06:10:55Z",
    "synthetic_storage_size": 35697544,
    "consumption_period_start": "0001-01-01T00:00:00Z",
    "consumption_period_end": "0001-01-01T00:00:00Z",
    "owner_id": "91cbdacd-06c2-49f5-bacf-78b9463c81ca",
    "compute_last_active_at": "2025-08-04T05:15:47Z"
  }
}
```

</details>

<NeedHelp/>
