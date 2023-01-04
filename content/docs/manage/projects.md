---
title: Manage projects
enableTableOfContents: true
isDraft: false
redirectFrom:
  - /docs/get-started-with-neon/projects
---

A project is the top-level object in the Neon object hierarchy. Tier limits define how many projects you can create. Neon's free tier permits one project per Neon account.

A Neon project is created with the following resources by default:

- A root branch called `main`. You can create child branches from the root branch or from a previously created branch. For more information, see [Branches](../branches).
- A single read-write endpoint. An endpoint is the compute instance associated with a branch. For more information, see [Endpoints](../branches).
- A default database, called `neondb`, which resides in the project's root branch.
- A default PostgreSQL user that takes its name from your Neon account (the Google, GitHub, or partner account that you registered with).
- A `web_access` PostgreSQL user, which is used by the Neon [SQL Editor](../../get-started-with-neon/query-with-neon-sql-editor) and for [passwordless connections](../../connect/passwordless-connect).

## Create a project

To create a Neon project:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. If you are creating your very first project, click **Create your first project**. Otherwise, click **New Project**.
3. Specify a name, a PostgreSQL version, a region, and click **Create Project**.

Upon creating a project, you are presented with a dialog that provides your connection details for the project, including your password. The password is required to connect to databases in the project from a client or application. Store your password in a safe location.

<Admonition type="important">
After closing the connection information dialog, your password is no longer accessible. If you forget or misplace your password, your only option is to reset it. For password reset instructions, see [Users](../users).
</Admonition>

## Edit a project

Only changing the project name and enabling or disabling connection pooling are permitted when editing a project.

To edit a Neon project:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. Select the project that you want to edit.
3. Select **Settings** > **General**.
4. Make your changes and click **Save**.

## Delete a project

Deleting a project is a permanent action, which also deletes any endpoints, branches, databases, and users that belong to the project.

To delete a project:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. Select the project that you want to delete.
3. Select **Settings** > **General**.
4. Click **Delete project.**
5. On the confirmation dialog, click **Delete**.

## Manage projects with the Neon API

Project actions performed in the Neon Console can be performed using the [Neon API](https://neon.tech/api-reference/v2/). The following examples demonstrate how to create, view, and delete projects using the Neon API. For other project-related API methods, refer to the [Neon API reference](https://neon.tech/api-reference/v2/).

### Prerequisites

A Neon API request requires an API key. For information about obtaining an API key, see [Create an API key](../../manage/#create-an-api-key). In the cURL examples shown below, `$NEON_API_KEY` is specified in place of an actual API key, which you must supply when making an Neon API request.

### Create a project with the API

The following Neon API method creates a project. The Neon Free Tier permits one project per account. The `myproject` name value is a user-specified name for the project. The response includes information about the roles, the default database, the root branch, and the read-write endpoint that is created with the project by default.  

```text
POST /projects 
```

The API method appears as follows when specified in a cURL command:

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

The following Neon API method lists projects for your Neon account.

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

The following Neon API method updates the specified project.

```text
PATCH /projects/{project_id}
```

The API method appears as follows when specified in a cURL command:

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

In the example above changes the project name to `project1`.

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

The following Neon API method deletes the specified project.

```text
DELETE /projects/{project_id}
```

The API method appears as follows when specified in a cURL command:

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
