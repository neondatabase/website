---
title: Data anonymization API reference
subtitle: API endpoints for managing anonymized branches and masking rules
summary: >-
  Covers the API endpoints for creating anonymized branches and managing masking
  rules using PostgreSQL Anonymizer, enabling users to handle sensitive data
  effectively within Neon.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:33.152Z'
---

This page provides detailed API documentation for data anonymization. For conceptual overview and usage instructions, see [Data Anonymization](/docs/workflows/data-anonymization).

The Neon API provides comprehensive control over anonymized branches, including access to all PostgreSQL Anonymizer masking functions and the ability to export/import masking rules for management outside of Neon.

## Create anonymized branch

[→ API Reference](https://api-docs.neon.tech/reference/createprojectbranchanonymized)

```
POST /projects/{project_id}/branch_anonymized
```

Creates a new branch with anonymized data using PostgreSQL Anonymizer for static masking.

**Request body parameters:**

- `masking_rules` (optional): Array of masking rules to apply to the branch. Each rule specifies:
  - `database_name`: Target database
  - `schema_name`: Target schema (typically `public`)
  - `table_name`: Table containing sensitive data
  - `column_name`: Column to mask
  - `masking_function` (optional): Dynamic PostgreSQL expression (e.g., `anon.fake_email()` or `pg_catalog.concat(anon.dummy_uuidv4(), '@example.com')`). Use for realistic test data. You can combine `pg_catalog.*` functions with PostgreSQL Anonymizer functions for custom expressions. Mutually exclusive with `masking_value`.
  - `masking_value` (optional): Static literal value (e.g., `'REDACTED'`, `0`, `NULL`). Use for simple redaction. Mutually exclusive with `masking_function`.
- `start_anonymization` (optional): Set to `true` to automatically start anonymization after creation

**Example request:**

```bash
curl -X POST \
  'https://console.neon.tech/api/v2/projects/{project_id}/branch_anonymized' \
  -H 'Authorization: Bearer $NEON_API_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "masking_rules": [
      {
        "database_name": "neondb",
        "schema_name": "public",
        "table_name": "users",
        "column_name": "email",
        "masking_function": "pg_catalog.concat(anon.dummy_uuidv4(), '@example.com')"
      },
      {
        "database_name": "neondb",
        "schema_name": "public",
        "table_name": "users",
        "column_name": "age",
        "masking_function": "anon.random_int_between(25,65)"
      }
    ],
    "start_anonymization": true
  }'
```

<details>
<summary>Response body</summary>

Returns the created branch object with `restricted_actions` indicating operations not allowed on anonymized branches (restore and delete read-write endpoint).

```json
{
  "branch": {
    "id": "br-divine-feather-a1b2c3d4",
    "project_id": "purple-moon-12345678",
    "parent_id": "br-plain-hill-e5f6g7h8",
    "parent_lsn": "0/1C3C998",
    "name": "br-divine-feather-a1b2c3d4",
    "current_state": "init",
    "pending_state": "ready",
    "state_changed_at": "2025-10-16T02:58:58Z",
    "creation_source": "console",
    "primary": false,
    "default": false,
    "protected": false,
    "cpu_used_sec": 0,
    "compute_time_seconds": 0,
    "active_time_seconds": 0,
    "written_data_bytes": 0,
    "data_transfer_bytes": 0,
    "created_at": "2025-10-16T02:58:58Z",
    "updated_at": "2025-10-16T02:58:58Z",
    "init_source": "parent-data",
    "restricted_actions": [
      {
        "name": "restore",
        "reason": "cannot restore anonymized branches"
      },
      {
        "name": "delete-rw-endpoint",
        "reason": "cannot delete read-write endpoints for anonymized branches"
      }
    ]
  },
  "endpoints": [
    {
      "host": "ep-fragrant-breeze-a1b2c3d4.us-east-1.aws.neon.tech",
      "id": "ep-fragrant-breeze-a1b2c3d4",
      "project_id": "purple-moon-12345678",
      "branch_id": "br-divine-feather-a1b2c3d4",
      "autoscaling_limit_min_cu": 1,
      "autoscaling_limit_max_cu": 4,
      "region_id": "aws-us-east-1",
      "type": "read_write",
      "current_state": "init",
      "pending_state": "active",
      "settings": {
        "preload_libraries": {
          "use_defaults": false,
          "enabled_libraries": ["anon"]
        }
      },
      "pooler_enabled": false,
      "pooler_mode": "transaction",
      "disabled": false,
      "passwordless_access": true,
      "creation_source": "console",
      "created_at": "2025-10-16T02:58:58Z",
      "updated_at": "2025-10-16T02:58:58Z",
      "proxy_host": "us-east-1.aws.neon.tech",
      "suspend_timeout_seconds": 0,
      "provisioner": "k8s-neonvm"
    }
  ],
  "operations": [
    {
      "id": "262dc2ba-4d78-4b7b-bb9a-e29532385f3a",
      "project_id": "purple-moon-12345678",
      "branch_id": "br-divine-feather-a1b2c3d4",
      "action": "create_branch",
      "status": "running",
      "failures_count": 0,
      "created_at": "2025-10-16T02:58:58Z",
      "updated_at": "2025-10-16T02:58:58Z",
      "total_duration_ms": 0
    },
    {
      "id": "f9f52b52-9828-47e4-9842-c08c2a9c14d3",
      "project_id": "purple-moon-12345678",
      "branch_id": "br-divine-feather-a1b2c3d4",
      "endpoint_id": "ep-fragrant-breeze-a1b2c3d4",
      "action": "start_compute",
      "status": "scheduling",
      "failures_count": 0,
      "created_at": "2025-10-16T02:58:58Z",
      "updated_at": "2025-10-16T02:58:58Z",
      "total_duration_ms": 0
    }
  ],
  "roles": [
    {
      "branch_id": "br-divine-feather-a1b2c3d4",
      "name": "neondb_owner",
      "protected": false,
      "created_at": "2025-09-12T13:47:59Z",
      "updated_at": "2025-09-12T13:47:59Z"
    }
  ],
  "databases": [
    {
      "id": 21560101,
      "branch_id": "br-divine-feather-a1b2c3d4",
      "name": "neondb",
      "owner_name": "neondb_owner",
      "created_at": "2025-09-12T13:47:59Z",
      "updated_at": "2025-09-12T13:47:59Z"
    }
  ],
  "connection_uris": [
    {
      "connection_uri": "postgresql://neondb_owner:somepass@ep-fragrant-breeze-a1b2c3d4.us-east-1.aws.neon.tech/neondb?sslmode=require",
      "connection_parameters": {
        "database": "neondb",
        "password": "somepass",
        "role": "neondb_owner",
        "host": "ep-fragrant-breeze-a1b2c3d4.us-east-1.aws.neon.tech",
        "pooler_host": "ep-fragrant-breeze-a1b2c3d4-pooler.us-east-1.aws.neon.tech"
      }
    }
  ]
}
```

</details>

## Get anonymization status

[→ API Reference](https://api-docs.neon.tech/reference/getanonymizedbranchstatus)

```
GET /projects/{project_id}/branches/{branch_id}/anonymized_status
```

Retrieves the current status of an anonymized branch, including state and progress information.

**Example request:**

```bash
curl -X GET \
  'https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/anonymized_status' \
  -H 'Authorization: Bearer $NEON_API_KEY' \
  -H 'Accept: application/json'
```

<details>
<summary>Response body</summary>

**State values:** `created`, `initialized`, `initialization_error`, `anonymizing`, `anonymized`, `error`. Response may include `failed_at` timestamp if operation failed.

```json
{
  "branch_id": "br-aged-salad-637688",
  "project_id": "simple-truth-637688",
  "state": "anonymizing",
  "status_message": "Anonymizing table mydb.public.users (3/5)",
  "created_at": "2022-11-30T18:25:15Z",
  "updated_at": "2022-11-30T18:30:22Z"
}
```

</details>

## Start anonymization

[→ API Reference](https://api-docs.neon.tech/reference/startanonymization)

```
POST /projects/{project_id}/branches/{branch_id}/anonymize
```

Starts or restarts the anonymization process for branches in `initialized`, `error`, or `anonymized` state. Applies all defined masking rules.

**Example request:**

```bash
curl -X POST \
  'https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/anonymize' \
  -H 'Authorization: Bearer $NEON_API_KEY' \
  -H 'Accept: application/json'
```

<details>
<summary>Response body</summary>

```json
{
  "branch_id": "br-shiny-butterfly-w4393738",
  "project_id": "wild-sky-00366102",
  "state": "anonymized",
  "status_message": "Anonymization completed successfully (2 tables, 3 masking rules applied)",
  "created_at": "2025-11-01T14:01:39Z",
  "updated_at": "2025-11-01T14:01:41Z"
}
```

</details>

## Get masking rules

[→ API Reference](https://api-docs.neon.tech/reference/getmaskingrules)

```
GET /projects/{project_id}/branches/{branch_id}/masking_rules
```

Retrieves all masking rules defined for the specified anonymized branch.

**Example request:**

```bash
curl -X GET \
  'https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/masking_rules' \
  -H 'Authorization: Bearer $NEON_API_KEY' \
  -H 'Accept: application/json'
```

<details>
<summary>Response body</summary>

```json
{
  "masking_rules": [
    {
      "database_name": "neondb",
      "schema_name": "public",
      "table_name": "users",
      "column_name": "age",
      "masking_function": "anon.random_int_between(25,65)"
    },
    {
      "database_name": "neondb",
      "schema_name": "public",
      "table_name": "users",
      "column_name": "email",
      "masking_function": "anon.dummy_free_email()"
    }
  ]
}
```

</details>

## Update masking rules

[→ API Reference](https://api-docs.neon.tech/reference/updatemaskingrules)

```
PATCH /projects/{project_id}/branches/{branch_id}/masking_rules
```

Updates masking rules for the specified anonymized branch. After updating, use the start anonymization endpoint to apply changes.

<Admonition type="important">
The API replaces all masking rules with the provided array. To add a new rule, include all existing rules in your request.
</Admonition>

**Example request:**

```bash
curl -X PATCH \
  'https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/masking_rules' \
  -H 'Authorization: Bearer $NEON_API_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "masking_rules": [
      {
        "database_name": "neondb",
        "schema_name": "public",
        "table_name": "users",
        "column_name": "email",
        "masking_function": "anon.dummy_free_email()"
      }
    ]
  }'
```

<details>
<summary>Response body</summary>

Returns the updated list of masking rules for the branch.

```json
{
  "masking_rules": [
    {
      "database_name": "neondb",
      "schema_name": "public",
      "table_name": "users",
      "column_name": "email",
      "masking_function": "anon.dummy_free_email()"
    }
  ]
}
```

</details>
