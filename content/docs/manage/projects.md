---
title: Manage projects
enableTableOfContents: true
isDraft: false
redirectFrom:
  - /docs/get-started-with-neon/projects
---

A project is the top-level object in the [Neon object hierarchy](/docs/manage/overview). Tier limits define how many projects you can create. Neon's Free Tier permits one project per Neon account.

A Neon project is created with the following resources, by default:

- A primary branch called `main`. You can create child branches from the primary branch or from a previously created branch. For more information, see [Manage branches](/docs/manage/branches).
- A single read-write compute endpoint, which is the compute instance associated with a branch. For more information, see [Manage computes](/docs/manage/endpoints).
- A default database, called `neondb`, which resides in the project's primary branch.
- A default PostgreSQL role that takes its name from your Neon account (the Google, GitHub, or partner account that you registered with).

## Create a project

Neon Free Tier users can create a single project. Support for multiple projects is available to Neon [Pro plan](/docs/introduction/pro-plan) users.

To create a Neon project:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. If you are creating your very first project, click **Create a project**. Otherwise, click **New Project**.
3. Specify a name, a PostgreSQL version, and a region. Project names are limited to 64 characters. If you are a Neon [Pro plan](/docs/introduction/pro-plan) user, you can specify **Compute size** settings when creating a project. The settings you specify become the default setting for all compute endpoints created in your project

    - Neon supports fixed size computes and _Autoscaling_. For more information, see [Compute size and Autoscaling configuration](/docs/manage/endpoints#compute-size-and-autoscaling-configuration).
    - The **Auto-suspend delay** setting defines the period of inactivity after which a compute endpoint is automatically suspended. For more information, see [Auto-suspend configuration](/docs/manage/endpoints#auto-suspend-configuration).
  
4. Click **Create Project**.

Upon creating a project, you are presented with a dialog that provides your connection details for the default `neondb` database, including your password.

## Compute size configuration with Autoscaling

Neon [Pro plan](/docs/introduction/pro-plan) users can configure compute size settings when [creating a project](#create-a-project).

_Compute size_ is the number of Compute Units (CUs) assigned to a Neon compute endpoint. The number of CUs determines the processing capacity of the compute endpoint. One CU is equal to 1 vCPU with 4 GBs of RAM. Currently, a Neon compute endpoint can have anywhere from .25 CUs to 7 CUs. Larger compute sizes will be supported in a future release.

Neon supports two compute size configuration options:

- **Fixed Size:** This option allows you to select a fixed compute size ranging from .25 CUs to 7 CUs. A fixed-size compute does not scale to meet workload demand.
- **Autoscaling:** This option allows you to specify a minimum and maximum compute size. Neon scales the compute size up and down within the selected compute size boundaries in response to the current load. Currently, _Autoscaling_ supports a range of 1 to 7 CUs. The 1/4 CU and 1/2 CU settings, called _shared compute_, will be supported with _Autoscaling_ in a future release. For information about how Neon implements the _Autoscaling_ feature, see [Autoscaling](/docs/introduction/autoscaling).

## View projects

To view your projects:

1. Navigate to the [Neon Console](https://console.neon.tech).
1. Select **Home** or the Neon logo at the top left of the Console.
1. The **Projects** page lists your projects, including any projects that have been shared with you.

## Edit a project

You are permitted to change the project name when editing a project.

To edit a Neon project:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. Select the project that you want to edit.
3. Select **Settings**.
4. Make your change and click **Save**.

## Delete a project

Deleting a project is a permanent action, which also deletes any compute endpoints, branches, databases, and roles that belong to the project.

To delete a project:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. Select the project that you want to delete.
3. Select **Settings**.
4. Click **Delete project.**
5. On the confirmation dialog, click **Delete**.

## Share a project

Project sharing is a Neon Pro plan feature that allows you to share your project with other Neon accounts.

To share a project:

1. In the Neon Console, select a project.
1. Select **Settings**.
1. Under **Grant access to your project**, enter the email address of the account you want to share access with.
1. Click **Grant access**.

The email you specify is added to the list of **People who have access to the project**. The Neon account associated with that email address is granted full access to the project with the exception privileges required to rename or delete the project. When that user logs in to Neon, the shared project is listed on their **Projects** page, under **Shared with me**.

The costs associated with a shared project are charged to the Neon account that owns the project. To illustrate, if you were to share your project with another Neon user account, any usage incurred by that user within your project is billed to your Neon account, not theirs.

## Manage projects with the Neon API

Project actions performed in the Neon Console can also be performed using the Neon API. The following examples demonstrate how to create, view, and delete projects using the Neon API. For other project-related API methods, refer to the [Neon API reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api).

<Admonition type="note">
The API examples that follow may not show all of the user-configurable request body attributes that are available to you. To view all attributes for a particular method, refer to method's request body schema in the [Neon API reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api).
</Admonition>

The `jq` option specified in each example is an optional third-party tool that formats the `JSON` response, making it easier to read. For information about this utility, see [jq](https://stedolan.github.io/jq/).

### Prerequisites

A Neon API request requires an API key. For information about obtaining an API key, see [Create an API key](/docs/manage/api-keys#create-an-api-key). In the cURL examples shown below, `$NEON_API_KEY` is specified in place of an actual API key, which you must provide when making a Neon API request.

### Create a project with the API

The following Neon API method creates a project. The [Neon Free Tier](/docs/introduction/free-tier) permits one project per account. To view the API documentation for this method, refer to the [Neon API reference](https://api-docs.neon.tech/reference/createproject).

```text
POST /projects
```

The API method appears as follows when specified in a cURL command. The `myproject` name value is a user-specified name for the project.

```bash
curl 'https://console.neon.tech/api/v2/projects' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer $NEON_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
  "project": {
    "name": "myproject"
  }
}' | jq
```

Response:

The response includes information about the roles, the default database, the primary branch (`main`), and the read-write compute endpoint that is created with the project.

```json
{
  "project": {
    "cpu_used_sec": 0,
    "id": "odd-cell-528527",
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
      "connection_uri": "postgres://casey:kFbAy47krZeV@odd-cell-528527.us-east-2.aws.neon.tech/neondb"
    }
  ],
  "roles": [
    {
      "branch_id": "br-falling-frost-286006",
      "name": "casey",
      "password": "kFbAy47krZeV",
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
      "name": "neondb",
      "owner_name": "casey",
      "created_at": "2023-01-04T17:33:11Z",
      "updated_at": "2023-01-04T17:33:11Z"
    }
  ],
  "operations": [
    {
      "id": "b7c32d83-6402-49c8-b40b-0388309549da",
      "project_id": "odd-cell-528527",
      "branch_id": "br-falling-frost-286006",
      "action": "create_timeline",
      "status": "running",
      "failures_count": 0,
      "created_at": "2023-01-04T17:33:11Z",
      "updated_at": "2023-01-04T17:33:11Z"
    },
    {
      "id": "756f2b87-f45c-4a61-9b21-6cd3f3c48c68",
      "project_id": "odd-cell-528527",
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
    "project_id": "odd-cell-528527",
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
      "project_id": "odd-cell-528527",
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

### List projects with the API

The following Neon API method lists projects for your Neon account. To view the API documentation for this method, refer to the [Neon API reference](https://api-docs.neon.tech/reference/listprojects).

```text
GET /projects
```

The API method appears as follows when specified in a cURL command:

```bash
curl 'https://console.neon.tech/api/v2/projects' \
 -H 'Accept: application/json' \
 -H 'Authorization: Bearer $NEON_API_KEY' | jq
```

Response:

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

### Update a project with the API

The following Neon API method updates the specified project. To view the API documentation for this method, refer to the [Neon API reference](https://api-docs.neon.tech/reference/updateproject).

```text
PATCH /projects/{project_id}
```

The API method appears as follows when specified in a cURL command. The `project_id` is a required parameter. The example changes the project `name` to `project1`.

```bash
curl 'https://console.neon.tech/api/v2/projects/odd-cell-528527' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer $NEON_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
  "project": {
    "name": "project1"
  }
}'
```

Response:

```json
{
  "project": {
    "cpu_used_sec": 0,
    "id": "odd-cell-528527",
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

### Delete a project with the API

The following Neon API method deletes the specified project. To view the API documentation for this method, refer to the [Neon API reference](https://api-docs.neon.tech/reference/deleteproject).

```text
DELETE /projects/{project_id}
```

The API method appears as follows when specified in a cURL command. The `project_id` is a required parameter.

```bash
curl -X 'DELETE' \
  'https://console.neon.tech/api/v2/projects/odd-cell-528527' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer $NEON_API_KEY'
```

Response:

```json
{
  "project": {
    "cpu_used_sec": 0,
    "id": "odd-cell-528527",
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

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
