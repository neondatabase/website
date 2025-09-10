---
title: 'AI Rules: Neon API'
subtitle: Context rules for AI tools to programmatically manage Neon projects, branches, databases, and other resources using the Neon API.
enableTableOfContents: true
updatedOn: '2025-09-09T00:00:00.000Z'
---

## Overview

This document provides a comprehensive set of rules and guidelines for an AI agent to interact with the Neon API. The Neon API is a RESTful service that allows for programmatic management of all Neon resources. Adherence to these rules ensures correct, efficient, and safe API usage.

### General API Guidelines

All Neon API requests must be made to the following base URL:

```
https://console.neon.tech/api/v2/
```

To construct a full request URL, append the specific endpoint path to this base URL.

### Authentication

- All API requests must be authenticated using a Neon API key.
- The API key must be included in the `Authorization` header using the `Bearer` authentication scheme.
- The header should be formatted as: `Authorization: Bearer $NEON_API_KEY`, where `$NEON_API_KEY` is a valid Neon API key.
- A request without a valid `Authorization` header will fail with a `401 Unauthorized` status code.

### API Rate Limiting

- Neon limits API requests to 700 requests per minute (approximately 11 per second).
- Bursts of up to 40 requests per second per route are permitted.
- If the rate limit is exceeded, the API will respond with an `HTTP 429 Too Many Requests` error.
- Your application logic must handle `429` errors and implement a retry strategy with appropriate backoff.

---

## Manage API keys

### Prerequisites

To create new API keys using the API, you must already possess a valid **Personal API Key**. The first key must be created from the Neon Console. You can ask the user to create one for you if you do not have one.

### List API keys

- **Endpoint**: `GET /api_keys`
- **Authorization**: Use a Personal API Key.

**Example request**:

```bash
curl "https://console.neon.tech/api/v2/api_keys" \
  -H "Authorization: Bearer $PERSONAL_API_KEY"
```

**Example response**:

```json
[
  {
    "id": 2291506,
    "name": "my-personal-key",
    "created_at": "2025-09-10T09:44:04Z",
    "created_by": {
      "id": "487de658-08ba-4363-b387-86d18b9ad1c8",
      "name": "<USER_NAME>",
      "image": "<USER_IMAGE_URL>"
    },
    "last_used_at": "2025-09-10T09:44:09Z",
    "last_used_from_addr": "49.43.218.132,34.211.200.85"
  }
]
```

### Create an API key

- **Endpoint**: `POST /api_keys`
- **Authorization**: Use a Personal API Key.
- **Body**: Must include a `key_name`.

**Example request**:

```bash
curl https://console.neon.tech/api/v2/api_keys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $PERSONAL_API_KEY" \
  -d '{"key_name": "my-new-key"}'
```

**Example response**:

```json
{
  "id": 2291515,
  "key": "napi_9tlr13774gizljemrr133j5koy3bmsphj8iu38mh0yjl9q4r1b0jy2wuhhuxouzr",
  "name": "my-new-key",
  "created_at": "2025-09-10T09:47:59Z",
  "created_by": "487de658-08ba-4363-b387-86d18b9ad1c8"
}
```

### Revoke an API Key

- **Endpoint**: `DELETE /api_keys/{key_id}`
- **Authorization**: Use a Personal API Key.

**Example request**:

```bash
curl -X DELETE \
  'https://console.neon.tech/api/v2/api_keys/2291515' \
  -H "Authorization: Bearer $PERSONAL_API_KEY"
```

**Example response**:

```json
{
  "id": 2291515,
  "name": "mynewkey",
  "created_at": "2025-09-10T09:47:59Z",
  "created_by": "487de658-08ba-4363-b387-86d18b9ad1c8",
  "last_used_at": "2025-09-10T09:53:01Z",
  "last_used_from_addr": "2405:201:c01f:7013:d962:2b4f:2740:9750",
  "revoked": true
}
```

---

## Operations

An operation is an action performed by the Neon Control Plane (e.g., `create_branch`, `start_compute`). When using the API programmatically, it is crucial to monitor the status of long-running operations to ensure one has completed before starting another that depends on it. Operations older than 6 months may be deleted from Neon's systems.

### List operations

1.  **Action**: Retrieves a list of operations for the specified Neon project. The number of operations can be large, so pagination is recommended.
2.  **Endpoint**: `GET /projects/{project_id}/operations`
3.  **Path Parameters**:
    - `project_id` (string, **required**): The unique identifier of the project whose operations you want to list.
4.  **Query Parameters**:
    - `limit` (integer, optional): The number of operations to return in the response. Must be between 1 and 1000.
    - `cursor` (string, optional): The cursor value from a previous response to fetch the next page of operations.
5.  **Procedure**:
    - Make an initial request with a `limit` to get the first page of results.
    - The response will contain a `pagination.cursor` value.
    - To get the next page, make a subsequent request including both the `limit` and the `cursor` from the previous response.

**Example request**

```bash
curl 'https://console.neon.tech/api/v2/projects/hidden-river-50598307/operations' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

**Example response**

```json
{
  "operations": [
    {
      "id": "639f7f73-0b76-4749-a767-2d3c627ca5a6",
      "project_id": "hidden-river-50598307",
      "branch_id": "br-long-feather-adpbgzlx",
      "endpoint_id": "ep-round-morning-adtpn2oc",
      "action": "apply_config",
      "status": "finished",
      "failures_count": 0,
      "created_at": "2025-09-10T12:15:23Z",
      "updated_at": "2025-09-10T12:15:23Z",
      "total_duration_ms": 87
    },
    {
      "id": "b5a7882b-a5b3-4292-ad27-bffe733feae4",
      "project_id": "hidden-river-50598307",
      "branch_id": "br-super-wildflower-adniii9u",
      "endpoint_id": "ep-ancient-brook-ad5ea04d",
      "action": "apply_config",
      "status": "finished",
      "failures_count": 0,
      "created_at": "2025-09-10T12:15:23Z",
      "updated_at": "2025-09-10T12:15:23Z",
      "total_duration_ms": 49
    },
    {
      "id": "36a1cba0-97f1-476d-af53-d9e0d3a3606d",
      "project_id": "hidden-river-50598307",
      "branch_id": "br-super-wildflower-adniii9u",
      "endpoint_id": "ep-ancient-brook-ad5ea04d",
      "action": "start_compute",
      "status": "finished",
      "failures_count": 0,
      "created_at": "2025-09-10T12:15:04Z",
      "updated_at": "2025-09-10T12:15:05Z",
      "total_duration_ms": 913
    },
    {
      "id": "409c35ef-cbc3-4f1b-a4ca-f2de319f5360",
      "project_id": "hidden-river-50598307",
      "branch_id": "br-super-wildflower-adniii9u",
      "action": "create_branch",
      "status": "finished",
      "failures_count": 0,
      "created_at": "2025-09-10T12:15:04Z",
      "updated_at": "2025-09-10T12:15:04Z",
      "total_duration_ms": 136
    },
    {
      "id": "274e240f-e2fb-4719-b796-c1ab7c4ae91c",
      "project_id": "hidden-river-50598307",
      "branch_id": "br-long-feather-adpbgzlx",
      "endpoint_id": "ep-round-morning-adtpn2oc",
      "action": "start_compute",
      "status": "finished",
      "failures_count": 0,
      "created_at": "2025-09-10T12:14:58Z",
      "updated_at": "2025-09-10T12:15:03Z",
      "total_duration_ms": 4843
    },
    {
      "id": "22ef6fbd-21c5-4cdb-9825-b0f9afddbb0d",
      "project_id": "hidden-river-50598307",
      "branch_id": "br-long-feather-adpbgzlx",
      "action": "create_timeline",
      "status": "finished",
      "failures_count": 0,
      "created_at": "2025-09-10T12:14:58Z",
      "updated_at": "2025-09-10T12:15:01Z",
      "total_duration_ms": 3096
    }
  ],
  "pagination": {
    "cursor": "2025-09-10T12:14:58.848485Z"
  }
}
```

### Retrieve operation details

1.  **Action**: Retrieves the details and status of a single, specified operation. The `operation_id` is found in the response body of the initial API call that initiated it, or by listing operations.
2.  **Endpoint**: `GET /projects/{project_id}/operations/{operation_id}`
3.  **Path Parameters**:
    - `project_id` (string, **required**): The unique identifier of the project where the operation occurred.
    - `operation_id` (UUID, **required**): The unique identifier of the operation. This ID is returned in the response body of the API call that initiated the operation.

**Example request:**

```bash
curl 'https://console.neon.tech/api/v2/projects/hidden-river-50598307/operations/274e240f-e2fb-4719-b796-c1ab7c4ae91c' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

**Example response**:

```json
{
  "operation": {
    "id": "274e240f-e2fb-4719-b796-c1ab7c4ae91c",
    "project_id": "hidden-river-50598307",
    "branch_id": "br-long-feather-adpbgzlx",
    "endpoint_id": "ep-round-morning-adtpn2oc",
    "action": "start_compute",
    "status": "finished",
    "failures_count": 0,
    "created_at": "2025-09-10T12:14:58Z",
    "updated_at": "2025-09-10T12:15:03Z",
    "total_duration_ms": 4843
  }
}
```

---

## Manage projects

This section provides detailed rules for managing Neon projects, including creation, retrieval, updates, and deletion.

### List projects

1.  **Action**: Retrieves a list of all projects accessible to the account associated with the API key. This is the primary method for obtaining `project_id` values required for other API calls.
2.  **Endpoint**: `GET /projects`
3.  **Query Parameters**:
    - `limit` (optional, integer, default: 10): Specifies the number of projects to return, from 1 to 400.
    - `cursor` (optional, string): Used for pagination. Provide the `cursor` value from a previous response to fetch the next set of projects.
    - `search` (optional, string): Filters projects by a partial match on the project `name` or `id`.
    - `org_id` (optional, string): Filters projects by a specific organization ID.
4.  When iterating through all projects, use a combination of the `limit` and `cursor` parameters to handle pagination correctly.

**Example request**:

```bash
# Retrieve the first 10 projects
curl 'https://console.neon.tech/api/v2/projects?limit=10' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

**Example response**:

```json
{
  "projects": [
    {
      "id": "old-fire-32990194",
      "platform_id": "aws",
      "region_id": "aws-ap-southeast-1",
      "name": "old-fire-32990194",
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
          "weekdays": [5],
          "start_time": "19:00",
          "end_time": "20:00"
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
      "created_at": "2025-09-10T06:58:33Z",
      "updated_at": "2025-09-10T06:58:39Z",
      "synthetic_storage_size": 0,
      "quota_reset_at": "2025-10-01T00:00:00Z",
      "owner_id": "org-royal-sun-91776391",
      "compute_last_active_at": "2025-09-10T06:58:38Z",
      "org_id": "org-royal-sun-91776391",
      "history_retention_seconds": 86400
    }
  ],
  "pagination": {
    "cursor": "old-fire-32990194"
  },
  "applications": {},
  "integrations": {}
}
```

### Create project

1.  **Action**: Creates a new Neon project. You can specify a wide range of settings at creation time, including the region, Postgres version, default branch and compute configurations, and security settings.
2.  **Endpoint**: `POST /projects`
3.  **Body Parameters**: The request body must contain a top-level `project` object with the following nested attributes:

    `project` (object, **required**): The main container for all project settings.
    - `name` (string, optional): A descriptive name for the project (1-256 characters). If omitted, the project name will be identical to its generated ID.
    - `pg_version` (integer, optional): The major Postgres version. Defaults to `17`. Supported versions: 14, 15, 16, 17, 18.
    - `region_id` (string, optional): The identifier for the region where the project will be created (e.g., `aws-us-east-1`).
    - `org_id` (string, optional): The ID of an organization to which the project will belong. Required if using an Organization API key.
    - `store_passwords` (boolean, optional): Whether to store role passwords in Neon. Storing passwords is required for features like the SQL Editor and integrations.
    - `history_retention_seconds` (integer, optional): The duration in seconds (0 to 2,592,000) to retain project history for features like Point-in-Time Restore. Defaults to 86400 (1 day).
    - `provisioner` (string, optional): The compute provisioner. Specify `k8s-neonvm` to enable Autoscaling. Allowed values: `k8s-pod`, `k8s-neonvm`.
    - `default_endpoint_settings` (object, optional): Default settings for new compute endpoints created in this project.
      - `autoscaling_limit_min_cu` (number, optional): The minimum number of Compute Units (CU). Minimum value is `0.25`.
      - `autoscaling_limit_max_cu` (number, optional): The maximum number of Compute Units (CU). Minimum value is `0.25`.
      - `suspend_timeout_seconds` (integer, optional): Duration of inactivity in seconds before a compute is suspended. Ranges from -1 (never suspend) to 604800 (1 week). A value of `0` uses the default of 300 seconds (5 minutes).
    - `settings` (object, optional): Project-wide settings.
      - `quota` (object, optional): Per-project consumption quotas. A zero or empty value means "unlimited".
        - `active_time_seconds` (integer, optional): Wall-clock time allowance for active computes.
        - `compute_time_seconds` (integer, optional): CPU seconds allowance.
        - `written_data_bytes` (integer, optional): Data written allowance.
        - `data_transfer_bytes` (integer, optional): Data transferred allowance.
        - `logical_size_bytes` (integer, optional): Logical data size limit per branch.
      - `allowed_ips` (object, optional): Configures the IP Allowlist.
        - `ips` (array of strings, optional): A list of allowed IP addresses or CIDR ranges.
        - `protected_branches_only` (boolean, optional): If `true`, the IP allowlist applies only to protected branches.
      - `enable_logical_replication` (boolean, optional): Sets `wal_level=logical`.
      - `maintenance_window` (object, optional): The time period for scheduled maintenance.
        - `weekdays` (array of integers, **required** if `maintenance_window` is set): Days of the week (1=Monday, 7=Sunday).
        - `start_time` (string, **required** if `maintenance_window` is set): Start time in "HH:MM" UTC format.
        - `end_time` (string, **required** if `maintenance_window` is set): End time in "HH:MM" UTC format.
    - `branch` (object, optional): Configuration for the project's default branch.
      - `name` (string, optional): The name for the default branch. Defaults to `main`.
      - `role_name` (string, optional): The name for the default role. Defaults to `{database_name}_owner`.
      - `database_name` (string, optional): The name for the default database. Defaults to `neondb`.

**Example request**

```bash
curl -X POST 'https://console.neon.tech/api/v2/projects' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
  "project": {
    "name": "my-new-api-project",
    "pg_version": 17
  }
}'
```

**Example response**

```json
{
  "project": {
    "data_storage_bytes_hour": 0,
    "data_transfer_bytes": 0,
    "written_data_bytes": 0,
    "compute_time_seconds": 0,
    "active_time_seconds": 0,
    "cpu_used_sec": 0,
    "id": "sparkling-hill-99143322",
    "platform_id": "aws",
    "region_id": "aws-us-west-2",
    "name": "my-new-api-project",
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
        "weekdays": [5],
        "start_time": "07:00",
        "end_time": "08:00"
      },
      "block_public_connections": false,
      "block_vpc_connections": false,
      "hipaa": false
    },
    "pg_version": 17,
    "proxy_host": "c-2.us-west-2.aws.neon.tech",
    "branch_logical_size_limit": 512,
    "branch_logical_size_limit_bytes": 536870912,
    "store_passwords": true,
    "creation_source": "console",
    "history_retention_seconds": 86400,
    "created_at": "2025-09-10T07:58:16Z",
    "updated_at": "2025-09-10T07:58:16Z",
    "consumption_period_start": "0001-01-01T00:00:00Z",
    "consumption_period_end": "0001-01-01T00:00:00Z",
    "owner_id": "org-royal-sun-91776391",
    "org_id": "org-royal-sun-91776391"
  },
  "connection_uris": [
    {
      "connection_uri": "postgresql://neondb_owner:npg_N67FDMtGvJke@ep-round-unit-afbn7qv4.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require",
      "connection_parameters": {
        "database": "neondb",
        "password": "npg_N67FDMtGvJke",
        "role": "neondb_owner",
        "host": "ep-round-unit-afbn7qv4.c-2.us-west-2.aws.neon.tech",
        "pooler_host": "ep-round-unit-afbn7qv4-pooler.c-2.us-west-2.aws.neon.tech"
      }
    }
  ],
  "roles": [
    {
      "branch_id": "br-green-mode-afe3fl9y",
      "name": "neondb_owner",
      "password": "npg_N67FDMtGvJke",
      "protected": false,
      "created_at": "2025-09-10T07:58:16Z",
      "updated_at": "2025-09-10T07:58:16Z"
    }
  ],
  "databases": [
    {
      "id": 6677853,
      "branch_id": "br-green-mode-afe3fl9y",
      "name": "neondb",
      "owner_name": "neondb_owner",
      "created_at": "2025-09-10T07:58:16Z",
      "updated_at": "2025-09-10T07:58:16Z"
    }
  ],
  "operations": [
    {
      "id": "08b9367d-6918-4cd5-b4a6-41c8fd984b7e",
      "project_id": "sparkling-hill-99143322",
      "branch_id": "br-green-mode-afe3fl9y",
      "action": "create_timeline",
      "status": "running",
      "failures_count": 0,
      "created_at": "2025-09-10T07:58:16Z",
      "updated_at": "2025-09-10T07:58:16Z",
      "total_duration_ms": 0
    },
    {
      "id": "c6917f04-5cd3-48a2-97c9-186b1d9729f0",
      "project_id": "sparkling-hill-99143322",
      "branch_id": "br-green-mode-afe3fl9y",
      "endpoint_id": "ep-round-unit-afbn7qv4",
      "action": "start_compute",
      "status": "scheduling",
      "failures_count": 0,
      "created_at": "2025-09-10T07:58:16Z",
      "updated_at": "2025-09-10T07:58:16Z",
      "total_duration_ms": 0
    }
  ],
  "branch": {
    "id": "br-green-mode-afe3fl9y",
    "project_id": "sparkling-hill-99143322",
    "name": "main",
    "current_state": "init",
    "pending_state": "ready",
    "state_changed_at": "2025-09-10T07:58:16Z",
    "creation_source": "console",
    "primary": true,
    "default": true,
    "protected": false,
    "cpu_used_sec": 0,
    "compute_time_seconds": 0,
    "active_time_seconds": 0,
    "written_data_bytes": 0,
    "data_transfer_bytes": 0,
    "created_at": "2025-09-10T07:58:16Z",
    "updated_at": "2025-09-10T07:58:16Z",
    "init_source": "parent-data"
  },
  "endpoints": [
    {
      "host": "ep-round-unit-afbn7qv4.c-2.us-west-2.aws.neon.tech",
      "id": "ep-round-unit-afbn7qv4",
      "project_id": "sparkling-hill-99143322",
      "branch_id": "br-green-mode-afe3fl9y",
      "autoscaling_limit_min_cu": 0.25,
      "autoscaling_limit_max_cu": 0.25,
      "region_id": "aws-us-west-2",
      "type": "read_write",
      "current_state": "init",
      "pending_state": "active",
      "settings": {},
      "pooler_enabled": false,
      "pooler_mode": "transaction",
      "disabled": false,
      "passwordless_access": true,
      "creation_source": "console",
      "created_at": "2025-09-10T07:58:16Z",
      "updated_at": "2025-09-10T07:58:16Z",
      "proxy_host": "c-2.us-west-2.aws.neon.tech",
      "suspend_timeout_seconds": 0,
      "provisioner": "k8s-neonvm"
    }
  ]
}
```

### Retrieve project details

1.  **Action**: Retrieves detailed information about a single, specific project.
2.  **Endpoint**: `GET /projects/{project_id}`
3.  **Prerequisite**: You must have the `project_id` of the project you wish to retrieve.
4.  **Path Parameters**:
    - `project_id` (required, string): The unique identifier of the project.

**Example request**:

```bash
curl 'https://console.neon.tech/api/v2/projects/sparkling-hill-99143322' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

**Example response**

```json
{
  "project": {
    "data_storage_bytes_hour": 0,
    "data_transfer_bytes": 0,
    "written_data_bytes": 0,
    "compute_time_seconds": 0,
    "active_time_seconds": 0,
    "cpu_used_sec": 0,
    "id": "sparkling-hill-99143322",
    "platform_id": "aws",
    "region_id": "aws-us-west-2",
    "name": "my-new-api-project",
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
        "weekdays": [5],
        "start_time": "07:00",
        "end_time": "08:00"
      },
      "block_public_connections": false,
      "block_vpc_connections": false,
      "hipaa": false
    },
    "pg_version": 17,
    "proxy_host": "c-2.us-west-2.aws.neon.tech",
    "branch_logical_size_limit": 512,
    "branch_logical_size_limit_bytes": 536870912,
    "store_passwords": true,
    "creation_source": "console",
    "history_retention_seconds": 86400,
    "created_at": "2025-09-10T07:58:16Z",
    "updated_at": "2025-09-10T07:58:25Z",
    "synthetic_storage_size": 0,
    "consumption_period_start": "2025-09-10T06:58:15Z",
    "consumption_period_end": "2025-10-01T00:00:00Z",
    "owner_id": "org-royal-sun-91776391",
    "owner": {
      "email": "<USER_EMAIL>",
      "name": "My Personal Account",
      "branches_limit": 10,
      "subscription_type": "free_v3"
    },
    "compute_last_active_at": "2025-09-10T07:58:21Z",
    "org_id": "org-royal-sun-91776391"
  }
}
```

### Update a project

1.  **Action**: Updates the settings of a specified project. This endpoint is used to modify a wide range of project attributes after creation, such as its name, default compute settings, security policies, and maintenance schedules.
2.  **Endpoint**: `PATCH /projects/{project_id}`
3.  **Path Parameters**:
    - `project_id` (string, **required**): The unique identifier of the project to update.
4.  **Body Parameters**: The request body must contain a top-level `project` object with the attributes to be updated.

    `project` (object, **required**): The main container for the settings you want to modify.
    - `name` (string, optional): A new descriptive name for the project.
    - `history_retention_seconds` (integer, optional): The duration in seconds (0 to 2,592,000) to retain project history.
    - `default_endpoint_settings` (object, optional): New default settings for compute endpoints created in this project.
      - `autoscaling_limit_min_cu` (number, optional): The minimum number of Compute Units (CU). Minimum `0.25`.
      - `autoscaling_limit_max_cu` (number, optional): The maximum number of Compute Units (CU). Minimum `0.25`.
      - `suspend_timeout_seconds` (integer, optional): Duration of inactivity in seconds before a compute is suspended. Ranges from -1 (never suspend) to 604800 (1 week). A value of `0` uses the default of 300 seconds (5 minutes).
    - `settings` (object, optional): Project-wide settings to update.
      - `quota` (object, optional): Per-project consumption quotas.
        - `active_time_seconds` (integer, optional): Wall-clock time allowance for active computes.
        - `compute_time_seconds` (integer, optional): CPU seconds allowance.
        - `written_data_bytes` (integer, optional): Data written allowance.
        - `data_transfer_bytes` (integer, optional): Data transferred allowance.
        - `logical_size_bytes` (integer, optional): Logical data size limit per branch.
      - `allowed_ips` (object, optional): Modifies the IP Allowlist.
        - `ips` (array of strings, optional): The new list of allowed IP addresses or CIDR ranges.
        - `protected_branches_only` (boolean, optional): If `true`, the IP allowlist applies only to protected branches.
      - `enable_logical_replication` (boolean, optional): Sets `wal_level=logical`. This is irreversible.
      - `maintenance_window` (object, optional): The time period for scheduled maintenance.
        - `weekdays` (array of integers, **required** if `maintenance_window` is set): Days of the week (1=Monday, 7=Sunday).
        - `start_time` (string, **required** if `maintenance_window` is set): Start time in "HH:MM" UTC format.
        - `end_time` (string, **required** if `maintenance_window` is set): End time in "HH:MM" UTC format.
      - `block_public_connections` (boolean, optional): If `true`, disallows connections from the public internet.
      - `block_vpc_connections` (boolean, optional): If `true`, disallows connections from VPC endpoints.
      - `audit_log_level` (string, optional): Sets the audit log level. Allowed values: `base`, `extended`, `full`.
      - `hipaa` (boolean, optional): Toggles HIPAA compliance settings.
      - `preload_libraries` (object, optional): Libraries to preload into compute instances.
        - `use_defaults` (boolean, optional): Toggles the use of default libraries.
        - `enabled_libraries` (array of strings, optional): A list of specific libraries to enable.

**Example request**

```bash
curl -X PATCH 'https://console.neon.tech/api/v2/projects/sparkling-hill-99143322' \
  -H 'accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
  "project": {
    "name": "updated-project-name"
  }
}'
```

**Example response**

```json
{
  "project": {
    "data_storage_bytes_hour": 0,
    "data_transfer_bytes": 0,
    "written_data_bytes": 29060360,
    "compute_time_seconds": 79,
    "active_time_seconds": 308,
    "cpu_used_sec": 79,
    "id": "sparkling-hill-99143322",
    "platform_id": "aws",
    "region_id": "aws-us-west-2",
    "name": "updated-project-name",
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
        "weekdays": [5],
        "start_time": "07:00",
        "end_time": "08:00"
      },
      "block_public_connections": false,
      "block_vpc_connections": false,
      "hipaa": false
    },
    "pg_version": 17,
    "proxy_host": "c-2.us-west-2.aws.neon.tech",
    "branch_logical_size_limit": 512,
    "branch_logical_size_limit_bytes": 536870912,
    "store_passwords": true,
    "creation_source": "console",
    "history_retention_seconds": 86400,
    "created_at": "2025-09-10T07:58:16Z",
    "updated_at": "2025-09-10T08:08:23Z",
    "synthetic_storage_size": 0,
    "consumption_period_start": "0001-01-01T00:00:00Z",
    "consumption_period_end": "0001-01-01T00:00:00Z",
    "owner_id": "org-royal-sun-91776391",
    "compute_last_active_at": "2025-09-10T07:58:21Z"
  },
  "operations": []
}
```

### Delete project

1.  **Action**: Permanently deletes a project and all of its associated resources, including all branches, computes, databases, and roles.
2.  **Endpoint**: `DELETE /projects/{project_id}`
3.  **Prerequisite**: You must have the `project_id` of the project you wish to delete.
4.  **Warning**: This is a destructive action that cannot be undone. It deletes all data, databases, and resources in the project. Proceed with extreme caution and confirm with the user before executing this operation.
5.  **Path Parameters**:
    - `project_id` (required, string): The unique identifier of the project to be deleted.

**Example request**:

```bash
curl -X 'DELETE' \
  'https://console.neon.tech/api/v2/projects/sparkling-hill-99143322' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

**Example response**:

```json
{
  "project": {
    "data_storage_bytes_hour": 0,
    "data_transfer_bytes": 0,
    "written_data_bytes": 29060360,
    "compute_time_seconds": 79,
    "active_time_seconds": 308,
    "cpu_used_sec": 79,
    "id": "sparkling-hill-99143322",
    "platform_id": "aws",
    "region_id": "aws-us-west-2",
    "name": "updated-project-name",
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
        "weekdays": [5],
        "start_time": "07:00",
        "end_time": "08:00"
      },
      "block_public_connections": false,
      "block_vpc_connections": false,
      "hipaa": false
    },
    "pg_version": 17,
    "proxy_host": "c-2.us-west-2.aws.neon.tech",
    "branch_logical_size_limit": 512,
    "branch_logical_size_limit_bytes": 536870912,
    "store_passwords": true,
    "creation_source": "console",
    "history_retention_seconds": 86400,
    "created_at": "2025-09-10T07:58:16Z",
    "updated_at": "2025-09-10T08:08:23Z",
    "synthetic_storage_size": 0,
    "consumption_period_start": "0001-01-01T00:00:00Z",
    "consumption_period_end": "0001-01-01T00:00:00Z",
    "owner_id": "org-royal-sun-91776391",
    "compute_last_active_at": "2025-09-10T07:58:21Z",
    "org_id": "org-royal-sun-91776391"
  }
}
```

### Retrieve connection URI

1.  **Action**: Retrieves a ready-to-use connection URI for a specific database within a project.
2.  **Endpoint**: `GET /projects/{project_id}/connection_uri`
3.  **Prerequisites**: You must know the `project_id`, `database_name`, and `role_name`.
4.  **Query Parameters**:
    - `project_id` (path, required): The unique identifier of the project.
    - `database_name` (query, required): The name of the target database.
    - `role_name` (query, required): The role to use for the connection.
    - `branch_id` (query, optional): The branch ID. Defaults to the project's primary branch if not specified.
    - `pooled` (query, optional, boolean): If set to `false`, returns a direct connection URI instead of a pooled one. Defaults to `true`.
    - `endpoint_id` (query, optional): The specific endpoint ID to connect to. Defaults to the `read-write` endpoint_id associated with the `branch_id` if not specified.

**Example request**:

```bash
curl 'https://console.neon.tech/api/v2/projects/old-fire-32990194/connection_uri?database_name=neondb&role_name=neondb_owner' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

**Example response**:

```json
{
  "uri": "postgresql://neondb_owner:npg_IDNnorOST71P@ep-shiny-morning-a1bfdvjs-pooler.ap-southeast-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require"
}
```

---

## Manage Branches

This section provides detailed rules for managing branches within a Neon project.

### Create branch

1.  **Action**: Creates a new branch within a specified project. By default, a branch is created from the project's default branch, but you can specify a parent branch, a point-in-time (LSN or timestamp), and attach compute endpoints.
2.  **Endpoint**: `POST /projects/{project_id}/branches`
3.  **Path Parameters**:
    - `project_id` (string, **required**): The unique identifier of the project where the branch will be created.
4.  **Body Parameters**: The request body is optional. If provided, it can contain `endpoints` and/or `branch` objects.

    `endpoints` (array of objects, optional): A list of compute endpoints to create and attach to the new branch.
    - `type` (string, **required**): The endpoint type. Allowed values: `read_write`, `read_only`.
    - `autoscaling_limit_min_cu` (number, optional): The minimum number of Compute Units (CU). Minimum value is `0.25`.
    - `autoscaling_limit_max_cu` (number, optional): The maximum number of Compute Units (CU). Minimum value is `0.25`.
    - `provisioner` (string, optional): The compute provisioner. Specify `k8s-neonvm` to enable Autoscaling. Allowed values: `k8s-pod`, `k8s-neonvm`.
    - `suspend_timeout_seconds` (integer, optional): Duration of inactivity in seconds before a compute is suspended. Ranges from -1 (never suspend) to 604800 (1 week). A value of `0` uses the default of 300 seconds (5 minutes).

    `branch` (object, optional): Specifies the properties of the new branch.
    - `name` (string, optional): A name for the branch (max 256 characters). If omitted, a name is auto-generated.
    - `parent_id` (string, optional): The ID of the parent branch. If omitted, the project's default branch is used as the parent.
    - `parent_lsn` (string, optional): A Log Sequence Number (LSN) from the parent branch to create the new branch from a specific point-in-time.
    - `parent_timestamp` (string, optional): An ISO 8601 timestamp (e.g., `2025-08-26T12:00:00Z`) to create the branch from a specific point-in-time.
    - `protected` (boolean, optional): If `true`, the branch is created as a protected branch.
    - `init_source` (string, optional): The source for branch initialization. `parent-data` (default) copies schema and data. `schema-only` creates a new root branch with only the schema from the specified parent.
    - `expires_at` (string, optional): An RFC 3339 timestamp for when the branch should be automatically deleted (e.g., `2025-06-09T18:02:16Z`).

**Example: Create a branch from a specific parent with a read-write compute**

```bash
curl 'https://console.neon.tech/api/v2/projects/hidden-river-50598307/branches' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
  "endpoints": [
    {
      "type": "read_write"
    }
  ],
  "branch": {
    "parent_id": "br-super-wildflower-adniii9u",
    "name": "my-new-feature-branch"
  }
}'
```

**Example response**

```json
{
  "branch": {
    "id": "br-damp-glitter-adqd4hk5",
    "project_id": "hidden-river-50598307",
    "parent_id": "br-super-wildflower-adniii9u",
    "parent_lsn": "0/1A7F730",
    "name": "my-new-feature-branch",
    "current_state": "init",
    "pending_state": "ready",
    "state_changed_at": "2025-09-10T16:45:52Z",
    "creation_source": "console",
    "primary": false,
    "default": false,
    "protected": false,
    "cpu_used_sec": 0,
    "compute_time_seconds": 0,
    "active_time_seconds": 0,
    "written_data_bytes": 0,
    "data_transfer_bytes": 0,
    "created_at": "2025-09-10T16:45:52Z",
    "updated_at": "2025-09-10T16:45:52Z",
    "created_by": {
      "name": "<USER_NAME>",
      "image": "<USER_IMAGE_URL>"
    },
    "init_source": "parent-data"
  },
  "endpoints": [
    {
      "host": "ep-raspy-glade-ad8e3gvy.c-2.us-east-1.aws.neon.tech",
      "id": "ep-raspy-glade-ad8e3gvy",
      "project_id": "hidden-river-50598307",
      "branch_id": "br-damp-glitter-adqd4hk5",
      "autoscaling_limit_min_cu": 0.25,
      "autoscaling_limit_max_cu": 2,
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
      "created_at": "2025-09-10T16:45:52Z",
      "updated_at": "2025-09-10T16:45:52Z",
      "proxy_host": "c-2.us-east-1.aws.neon.tech",
      "suspend_timeout_seconds": 0,
      "provisioner": "k8s-neonvm"
    }
  ],
  "operations": [
    {
      "id": "cf5d0923-fc13-4125-83d5-8fc31c6b0214",
      "project_id": "hidden-river-50598307",
      "branch_id": "br-damp-glitter-adqd4hk5",
      "action": "create_branch",
      "status": "running",
      "failures_count": 0,
      "created_at": "2025-09-10T16:45:52Z",
      "updated_at": "2025-09-10T16:45:52Z",
      "total_duration_ms": 0
    },
    {
      "id": "e3c60b62-00c8-4ad4-9cd1-cdc3e8fd8154",
      "project_id": "hidden-river-50598307",
      "branch_id": "br-damp-glitter-adqd4hk5",
      "endpoint_id": "ep-raspy-glade-ad8e3gvy",
      "action": "start_compute",
      "status": "scheduling",
      "failures_count": 0,
      "created_at": "2025-09-10T16:45:52Z",
      "updated_at": "2025-09-10T16:45:52Z",
      "total_duration_ms": 0
    }
  ],
  "roles": [
    {
      "branch_id": "br-damp-glitter-adqd4hk5",
      "name": "neondb_owner",
      "protected": false,
      "created_at": "2025-09-10T12:14:58Z",
      "updated_at": "2025-09-10T12:14:58Z"
    }
  ],
  "databases": [
    {
      "id": 9554148,
      "branch_id": "br-damp-glitter-adqd4hk5",
      "name": "neondb",
      "owner_name": "neondb_owner",
      "created_at": "2025-09-10T12:14:58Z",
      "updated_at": "2025-09-10T12:14:58Z"
    }
  ],
  "connection_uris": [
    {
      "connection_uri": "postgresql://neondb_owner:npg_EwcS9IOgFfb7@ep-raspy-glade-ad8e3gvy.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require",
      "connection_parameters": {
        "database": "neondb",
        "password": "npg_EwcS9IOgFfb7",
        "role": "neondb_owner",
        "host": "ep-raspy-glade-ad8e3gvy.c-2.us-east-1.aws.neon.tech",
        "pooler_host": "ep-raspy-glade-ad8e3gvy-pooler.c-2.us-east-1.aws.neon.tech"
      }
    }
  ]
}
```

### List branches

1.  **Action**: Retrieves a list of branches for the specified project. Supports filtering, sorting, and pagination.
2.  **Endpoint**: `GET /projects/{project_id}/branches`
3.  **Path Parameters**:
    - `project_id` (string, **required**): The unique identifier of the project.
4.  **Query Parameters**:
    - `search` (string, optional): Filters branches by a partial match on name or ID.
    - `sort_by` (string, optional): The field to sort by. Allowed values: `name`, `created_at`, `updated_at`. Defaults to `updated_at`.
    - `sort_order` (string, optional): The sort order. Allowed values: `asc`, `desc`. Defaults to `desc`.
    - `limit` (integer, optional): The number of branches to return (1 to 10000).
    - `cursor` (string, optional): The cursor from a previous response for pagination.

**Example: List all branches sorted by creation date**

```bash
curl 'https://console.neon.tech/api/v2/projects/hidden-river-50598307/branches?sort_by=created_at&sort_order=asc' \
  -H 'accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

**Example response**

```json
{
  "branches": [
    {
      "id": "br-long-feather-adpbgzlx",
      "project_id": "hidden-river-50598307",
      "name": "production",
      "current_state": "ready",
      "state_changed_at": "2025-09-10T12:15:01Z",
      "logical_size": 30785536,
      "creation_source": "console",
      "primary": true,
      "default": true,
      "protected": false,
      "cpu_used_sec": 82,
      "compute_time_seconds": 82,
      "active_time_seconds": 316,
      "written_data_bytes": 29060360,
      "data_transfer_bytes": 0,
      "created_at": "2025-09-10T12:14:58Z",
      "updated_at": "2025-09-10T12:35:33Z",
      "created_by": {
        "name": "<USER_NAME>",
        "image": "<USER_IMAGE_URL>"
      },
      "init_source": "parent-data"
    },
    {
      "id": "br-super-wildflower-adniii9u",
      "project_id": "hidden-river-50598307",
      "parent_id": "br-long-feather-adpbgzlx",
      "parent_lsn": "0/1A33BC8",
      "parent_timestamp": "2025-09-10T12:15:03Z",
      "name": "development",
      "current_state": "ready",
      "state_changed_at": "2025-09-10T12:15:04Z",
      "logical_size": 30842880,
      "creation_source": "console",
      "primary": false,
      "default": false,
      "protected": false,
      "cpu_used_sec": 78,
      "compute_time_seconds": 78,
      "active_time_seconds": 312,
      "written_data_bytes": 310120,
      "data_transfer_bytes": 0,
      "created_at": "2025-09-10T12:15:04Z",
      "updated_at": "2025-09-10T12:35:33Z",
      "created_by": {
        "name": "<USER_NAME>",
        "image": "<USER_IMAGE_URL>"
      },
      "init_source": "parent-data"
    },
    {
      "id": "br-damp-glitter-adqd4hk5",
      "project_id": "hidden-river-50598307",
      "parent_id": "br-super-wildflower-adniii9u",
      "parent_lsn": "0/1A7F730",
      "parent_timestamp": "2025-09-10T12:15:05Z",
      "name": "my-new-feature-branch",
      "current_state": "ready",
      "state_changed_at": "2025-09-10T16:45:52Z",
      "creation_source": "console",
      "primary": false,
      "default": false,
      "protected": false,
      "cpu_used_sec": 0,
      "compute_time_seconds": 0,
      "active_time_seconds": 0,
      "written_data_bytes": 0,
      "data_transfer_bytes": 0,
      "created_at": "2025-09-10T16:45:52Z",
      "updated_at": "2025-09-10T16:45:53Z",
      "created_by": {
        "name": "<USER_NAME>",
        "image": "<USER_IMAGE_URL>"
      },
      "init_source": "parent-data"
    }
  ],
  "annotations": {
    "br-long-feather-adpbgzlx": {
      "object": {
        "type": "console/branch",
        "id": "br-long-feather-adpbgzlx"
      },
      "value": {
        "environment": "production"
      },
      "created_at": "2025-09-10T12:14:58Z",
      "updated_at": "2025-09-10T12:14:58Z"
    },
    "br-super-wildflower-adniii9u": {
      "object": {
        "type": "console/branch",
        "id": "br-super-wildflower-adniii9u"
      },
      "value": {
        "environment": "development"
      },
      "created_at": "2025-09-10T12:15:04Z",
      "updated_at": "2025-09-10T12:15:04Z"
    }
  },
  "pagination": {
    "sort_by": "created_at",
    "sort_order": "ASC"
  }
}
```

### Retrieve branch details

1.  **Action**: Retrieves detailed information about a specific branch, including its parent, creation timestamp, and state.
2.  **Endpoint**: `GET /projects/{project_id}/branches/{branch_id}`
3.  **Path Parameters**:
    - `project_id` (string, **required**): The unique identifier of the project.
    - `branch_id` (string, **required**): The unique identifier of the branch (prefixed with `br-`).

**Example Request:**

```bash
curl 'https://console.neon.tech/api/v2/projects/hidden-river-50598307/branches/br-super-wildflower-adniii9u' \
  -H 'accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

**Example Response:**

```json
{
  "branch": {
    "id": "br-super-wildflower-adniii9u",
    "project_id": "hidden-river-50598307",
    "parent_id": "br-long-feather-adpbgzlx",
    "parent_lsn": "0/1A33BC8",
    "parent_timestamp": "2025-09-10T12:15:03Z",
    "name": "development",
    "current_state": "ready",
    "state_changed_at": "2025-09-10T12:15:04Z",
    "logical_size": 30842880,
    "creation_source": "console",
    "primary": false,
    "default": false,
    "protected": false,
    "cpu_used_sec": 78,
    "compute_time_seconds": 78,
    "active_time_seconds": 312,
    "written_data_bytes": 310120,
    "data_transfer_bytes": 0,
    "created_at": "2025-09-10T12:15:04Z",
    "updated_at": "2025-09-10T12:35:33Z",
    "created_by": {
      "name": "<USER_NAME>",
      "image": "<USER_IMAGE_URL>"
    },
    "init_source": "parent-data"
  },
  "annotation": {
    "object": {
      "type": "console/branch",
      "id": "br-super-wildflower-adniii9u"
    },
    "value": {
      "environment": "development"
    },
    "created_at": "2025-09-10T12:15:04Z",
    "updated_at": "2025-09-10T12:15:04Z"
  }
}
```

### Update branch

1.  **Action**: Updates the properties of a specified branch, such as its name, protection status, or expiration time.
2.  **Endpoint**: `PATCH /projects/{project_id}/branches/{branch_id}`
3.  **Path Parameters**:
    - `project_id` (string, **required**): The unique identifier of the project.
    - `branch_id` (string, **required**): The unique identifier of the branch to update.
4.  **Body Parameters**:
    `branch` (object, **required**): The container for the branch attributes to update.
    - `name` (string, optional): A new name for the branch (max 256 characters).
    - `protected` (boolean, optional): Set to `true` to protect the branch or `false` to unprotect it.
    - `expires_at` (string or null, optional): Set a new RFC 3339 expiration timestamp or `null` to remove the expiration.

**Example: Change branch name**:

```bash
curl -X 'PATCH' \
  'https://console.neon.tech/api/v2/projects/hidden-river-50598307/branches/br-damp-glitter-adqd4hk5' \
  -H 'accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
  "branch": {
    "name": "updated-branch-name"
  }
}'
```

**Example response**:

```json
{
  "branch": {
    "id": "br-damp-glitter-adqd4hk5",
    "project_id": "hidden-river-50598307",
    "parent_id": "br-super-wildflower-adniii9u",
    "parent_lsn": "0/1A7F730",
    "parent_timestamp": "2025-09-10T12:15:05Z",
    "name": "updated-branch-name",
    "current_state": "ready",
    "state_changed_at": "2025-09-10T16:45:52Z",
    "logical_size": 30842880,
    "creation_source": "console",
    "primary": false,
    "default": false,
    "protected": false,
    "cpu_used_sec": 68,
    "compute_time_seconds": 68,
    "active_time_seconds": 268,
    "written_data_bytes": 0,
    "data_transfer_bytes": 0,
    "created_at": "2025-09-10T16:45:52Z",
    "updated_at": "2025-09-10T16:55:30Z",
    "created_by": {
      "name": "<USER_NAME>",
      "image": "<USER_IMAGE_URL>"
    },
    "init_source": "parent-data"
  },
  "operations": []
}
```

### Delete branch

1.  **Action**: Deletes the specified branch from a project. This action will also place all associated compute endpoints into an idle state, breaking any active client connections.
2.  **Endpoint**: `DELETE /projects/{project_id}/branches/{branch_id}`
3.  **Path Parameters**:
    - `project_id` (string, **required**): The unique identifier of the project.
    - `branch_id` (string, **required**): The unique identifier of the branch to delete.
4.  **Constraints**:
    - You cannot delete a project's root or default branch.
    - You cannot delete a branch that has child branches. You must delete all child branches first.

**Example Request:**

```bash
curl -X 'DELETE' \
  'https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}' \
  -H 'accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

**Example Response:**

```json
{
  "branch": {
    "id": "br-damp-glitter-adqd4hk5",
    "project_id": "hidden-river-50598307",
    "parent_id": "br-super-wildflower-adniii9u",
    "parent_lsn": "0/1A7F730",
    "parent_timestamp": "2025-09-10T12:15:05Z",
    "name": "updated-branch-name",
    "current_state": "ready",
    "pending_state": "storage_deleted",
    "state_changed_at": "2025-09-10T16:45:52Z",
    "logical_size": 30842880,
    "creation_source": "console",
    "primary": false,
    "default": false,
    "protected": false,
    "cpu_used_sec": 68,
    "compute_time_seconds": 68,
    "active_time_seconds": 268,
    "written_data_bytes": 0,
    "data_transfer_bytes": 0,
    "created_at": "2025-09-10T16:45:52Z",
    "updated_at": "2025-09-10T16:59:35Z",
    "created_by": {
      "name": "<USER_NAME>",
      "image": "<USER_IMAGE_URL>"
    },
    "init_source": "parent-data"
  },
  "operations": [
    {
      "id": "a1d314dc-2da2-421d-8b9a-6dc9fb5bb440",
      "project_id": "hidden-river-50598307",
      "branch_id": "br-damp-glitter-adqd4hk5",
      "endpoint_id": "ep-raspy-glade-ad8e3gvy",
      "action": "suspend_compute",
      "status": "running",
      "failures_count": 0,
      "created_at": "2025-09-10T16:59:35Z",
      "updated_at": "2025-09-10T16:59:35Z",
      "total_duration_ms": 0
    },
    {
      "id": "668b5854-8951-458c-a567-d265b4cadabe",
      "project_id": "hidden-river-50598307",
      "branch_id": "br-damp-glitter-adqd4hk5",
      "action": "delete_timeline",
      "status": "scheduling",
      "failures_count": 0,
      "created_at": "2025-09-10T16:59:35Z",
      "updated_at": "2025-09-10T16:59:35Z",
      "total_duration_ms": 0
    }
  ]
}
```

### List branch endpoints

1.  **Action**: Retrieves a list of all compute endpoints that are associated with a specific branch.
2.  **Endpoint**: `GET /projects/{project_id}/branches/{branch_id}/endpoints`
3.  **Path Parameters**:
    - `project_id` (string, **required**): The unique identifier of the project.
    - `branch_id` (string, **required**): The unique identifier of the branch whose endpoints you want to list.
4.  A branch can have one `read_write` compute endpoint and multiple `read_only` endpoints. This method returns an array of all endpoints currently attached to the specified branch.

**Example Request:**

```bash
curl 'https://console.neon.tech/api/v2/projects/hidden-river-50598307/branches/br-super-wildflower-adniii9u/endpoints' \
  -H 'accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

**Example Response:**

```json
{
  "endpoints": [
    {
      "host": "ep-dry-cloud-admel5xy.c-2.us-east-1.aws.neon.tech",
      "id": "ep-dry-cloud-admel5xy",
      "project_id": "hidden-river-50598307",
      "branch_id": "br-super-wildflower-adniii9u",
      "autoscaling_limit_min_cu": 0.25,
      "autoscaling_limit_max_cu": 2,
      "region_id": "aws-us-east-1",
      "type": "read_only",
      "current_state": "active",
      "settings": {
        "pg_settings": {}
      },
      "pooler_enabled": false,
      "pooler_mode": "transaction",
      "disabled": false,
      "passwordless_access": true,
      "last_active": "2000-01-01T00:00:00Z",
      "creation_source": "console",
      "created_at": "2025-09-10T17:32:26Z",
      "updated_at": "2025-09-10T17:32:26Z",
      "started_at": "2025-09-10T17:32:26Z",
      "proxy_host": "c-2.us-east-1.aws.neon.tech",
      "suspend_timeout_seconds": 0,
      "provisioner": "k8s-neonvm",
      "compute_release_version": "9509"
    },
    {
      "host": "ep-ancient-brook-ad5ea04d.c-2.us-east-1.aws.neon.tech",
      "id": "ep-ancient-brook-ad5ea04d",
      "project_id": "hidden-river-50598307",
      "branch_id": "br-super-wildflower-adniii9u",
      "autoscaling_limit_min_cu": 0.25,
      "autoscaling_limit_max_cu": 1,
      "region_id": "aws-us-east-1",
      "type": "read_write",
      "current_state": "idle",
      "settings": {
        "pg_settings": {}
      },
      "pooler_enabled": false,
      "pooler_mode": "transaction",
      "disabled": false,
      "passwordless_access": true,
      "last_active": "2025-09-10T12:15:06Z",
      "creation_source": "console",
      "created_at": "2025-09-10T12:15:04Z",
      "updated_at": "2025-09-10T12:35:33Z",
      "suspended_at": "2025-09-10T12:20:22Z",
      "proxy_host": "c-2.us-east-1.aws.neon.tech",
      "suspend_timeout_seconds": 0,
      "provisioner": "k8s-neonvm"
    }
  ]
}
```

### Create database

1.  **Action**: Creates a new database within a specified branch. A branch can contain multiple databases.
2.  **Endpoint**: `POST /projects/{project_id}/branches/{branch_id}/databases`
3.  **Path Parameters**:
    - `project_id` (string, **required**): The unique identifier of the project.
    - `branch_id` (string, **required**): The unique identifier of the branch where the database will be created.
4.  **Body Parameters**:
    `database` (object, **required**): The container for the new database's properties.
    - `name` (string, **required**): The name for the new database.
    - `owner_name` (string, **required**): The name of an existing role that will own the database.

**Example Request:**

```bash
curl 'https://console.neon.tech/api/v2/projects/hidden-river-50598307/branches/br-super-wildflower-adniii9u/databases' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
  "database": {
    "name": "my_new_app_db",
    "owner_name": "app_owner_role"
  }
}'
```

**Example Response:**

```json
{
  "database": {
    "id": 9561265,
    "branch_id": "br-super-wildflower-adniii9u",
    "name": "my_new_app_db",
    "owner_name": "app_owner_role",
    "created_at": "2025-09-10T17:50:07Z",
    "updated_at": "2025-09-10T17:50:07Z"
  },
  "operations": [
    {
      "id": "282aa443-d0a1-412c-8d09-8817bb8bbcdb",
      "project_id": "hidden-river-50598307",
      "branch_id": "br-super-wildflower-adniii9u",
      "endpoint_id": "ep-ancient-brook-ad5ea04d",
      "action": "apply_config",
      "status": "running",
      "failures_count": 0,
      "created_at": "2025-09-10T17:50:07Z",
      "updated_at": "2025-09-10T17:50:07Z",
      "total_duration_ms": 0
    }
  ]
}
```

### List databases

1.  **Action**: Retrieves a list of all databases within a specified branch.
2.  **Endpoint**: `GET /projects/{project_id}/branches/{branch_id}/databases`
3.  **Path Parameters**:
    - `project_id` (string, **required**): The unique identifier of the project.
    - `branch_id` (string, **required**): The unique identifier of the branch.

**Example Request:**

```bash
curl 'https://console.neon.tech/api/v2/projects/hidden-river-50598307/branches/br-super-wildflower-adniii9u/databases' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

**Example Response:**

```json
{
  "databases": [
    {
      "id": 9512268,
      "branch_id": "br-super-wildflower-adniii9u",
      "name": "neondb",
      "owner_name": "neondb_owner",
      "created_at": "2025-09-10T12:14:58Z",
      "updated_at": "2025-09-10T12:14:58Z"
    },
    {
      "id": 9561265,
      "branch_id": "br-super-wildflower-adniii9u",
      "name": "my_new_app_db",
      "owner_name": "app_owner_role",
      "created_at": "2025-09-10T17:50:07Z",
      "updated_at": "2025-09-10T17:50:07Z"
    }
  ]
}
```

### Retrieve database details

1.  **Action**: Retrieves detailed information about a specific database within a branch.
2.  **Endpoint**: `GET /projects/{project_id}/branches/{branch_id}/databases/{database_name}`
3.  **Path Parameters**:
    - `project_id` (string, **required**): The unique identifier of the project.
    - `branch_id` (string, **required**): The unique identifier of the branch.
    - `database_name` (string, **required**): The name of the database.

**Example Request:**

```bash
curl 'https://console.neon.tech/api/v2/projects/hidden-river-50598307/branches/br-super-wildflower-adniii9u/databases/my_new_app_db' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

**Example Response:**

```json
{
  "database": {
    "id": 9561265,
    "branch_id": "br-super-wildflower-adniii9u",
    "name": "my_new_app_db",
    "owner_name": "app_owner_role",
    "created_at": "2025-09-10T17:50:07Z",
    "updated_at": "2025-09-10T17:50:07Z"
  }
}
```

### Update database

1.  **Action**: Updates the properties of a specified database, such as its name or owner.
2.  **Endpoint**: `PATCH /projects/{project_id}/branches/{branch_id}/databases/{database_name}`
3.  **Path Parameters**:
    - `project_id` (string, **required**): The unique identifier of the project.
    - `branch_id` (string, **required**): The unique identifier of the branch.
    - `database_name` (string, **required**): The current name of the database to update.
4.  **Body Parameters**:
    `database` (object, **required**): The container for the database attributes to update.
    - `name` (string, optional): A new name for the database.
    - `owner_name` (string, optional): The name of a different existing role to become the new owner.

**Example: Change the owner of a database**

```bash
curl -X 'PATCH' \
  'https://console.neon.tech/api/v2/projects/hidden-river-50598307/branches/br-super-wildflower-adniii9u/databases/my_new_app_db' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
  "database": {
    "owner_name": "neondb_owner"
  }
}'
```

**Example Response:**

```json
{
  "database": {
    "id": 9561265,
    "branch_id": "br-super-wildflower-adniii9u",
    "name": "my_new_app_db",
    "owner_name": "neondb_owner",
    "created_at": "2025-09-10T17:50:07Z",
    "updated_at": "2025-09-10T17:50:07Z"
  },
  "operations": [
    {
      "id": "f9db8971-2d71-4b3c-84fa-967b99150cb1",
      "project_id": "hidden-river-50598307",
      "branch_id": "br-super-wildflower-adniii9u",
      "endpoint_id": "ep-ancient-brook-ad5ea04d",
      "action": "apply_config",
      "status": "running",
      "failures_count": 0,
      "created_at": "2025-09-10T18:03:58Z",
      "updated_at": "2025-09-10T18:03:58Z",
      "total_duration_ms": 0
    }
  ]
}
```

### Delete database

1.  **Action**: Deletes the specified database from a branch. This action is permanent and cannot be undone.
2.  **Endpoint**: `DELETE /projects/{project_id}/branches/{branch_id}/databases/{database_name}`
3.  **Path Parameters**:
    - `project_id` (string, **required**): The unique identifier of the project.
    - `branch_id` (string, **required**): The unique identifier of the branch.
    - `database_name` (string, **required**): The name of the database to delete.

**Example Request:**

```bash
curl -X 'DELETE' \
  'https://console.neon.tech/api/v2/projects/hidden-river-50598307/branches/br-super-wildflower-adniii9u/databases/my_new_app_db' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

**Example Response:**

```json
{
  "database": {
    "id": 9561265,
    "branch_id": "br-super-wildflower-adniii9u",
    "name": "my_new_app_db",
    "owner_name": "neondb_owner",
    "created_at": "2025-09-10T17:50:07Z",
    "updated_at": "2025-09-10T17:50:07Z"
  },
  "operations": [
    {
      "id": "f2a5fb2d-688c-4851-905f-781f6a338f2f",
      "project_id": "hidden-river-50598307",
      "branch_id": "br-super-wildflower-adniii9u",
      "endpoint_id": "ep-ancient-brook-ad5ea04d",
      "action": "apply_config",
      "status": "running",
      "failures_count": 0,
      "created_at": "2025-09-10T18:05:14Z",
      "updated_at": "2025-09-10T18:05:14Z",
      "total_duration_ms": 0
    }
  ]
}
```
