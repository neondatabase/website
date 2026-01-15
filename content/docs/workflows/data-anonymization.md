---
title: Data anonymization
subtitle: Mask sensitive data in development branches using PostgreSQL Anonymizer
redirectFrom:
  - /docs/concepts/anonymized-data
tag: new
enableTableOfContents: true
updatedOn: '2025-12-23T18:49:15.664Z'
---

<FeatureBeta />

Need to test against production data without exposing sensitive information? Anonymized branches let you create development copies with masked personally identifiable information (PII) - such as emails, phone numbers, and other sensitive data.

Neon uses [PostgreSQL Anonymizer](https://postgresql-anonymizer.readthedocs.io/) for static data masking, and applies masking rules when you create or update the branch. This approach gives you realistic test data while protecting user privacy and supporting compliance requirements like GDPR.

**Key characteristics:**

- **Static masking**: Data is masked once during branch creation or when you rerun anonymization
- **PostgreSQL Anonymizer integration**: Uses the [PostgreSQL Anonymizer extension's](/docs/extensions/postgresql-anonymizer) masking functions
- **Branch-specific rules**: You can define different masking rules for each anonymized Neon branch

<Admonition type="info" title="Static versus dynamic masking">
This feature uses **static masking**, which permanently transforms data in the branch when anonymization runs. Unlike dynamic masking (which masks data during queries), static masking creates an actual masked copy of the data. To get fresh data from the parent, create a new anonymized branch.
</Admonition>

## Create a branch with anonymized data

<Tabs labels={["Console", "API"]}>

<TabItem>

Select **Anonymized data** as the data option when creating a new branch.

1. Navigate to your project in the Neon Console
2. Select **Projects** -> **Branches** from the sidebar
3. Click **New Branch**
4. In the **Create new branch** dialog:
   - Select your **Parent branch** (typically `production` or `main`)
   - (Optional) Enter a **Branch name**
   - (Optional) **Automatically delete branch after** is checked by default with 1 day selected. You can change it, uncheck it, or leave it as is to automatically delete the branch after the specified time.
   - Under data options, select **Anonymized data**
5. Click **Create**

![Neon Console 'Create new branch' dialog with 'Anonymized data' selected](/docs/workflows/anon-create-a-new-branch.png)

After creation, the Console loads the [Data Masking](#manage-masking-rules) page where you define and execute anonymization rules for your branch.
</TabItem>

<TabItem>

Use the [Create anonymized branch](https://api-docs.neon.tech/reference/createprojectbranchanonymized) endpoint, for example:

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
        "masking_function": "anon.dummy_free_email()"
      }
    ],
    "start_anonymization": true
  }'
```

For complete parameter documentation and additional examples, see [Create anonymized branch](#create-anonymized-branch) in the API reference below. The API supports all PostgreSQL Anonymizer masking functions, providing more options than the Console UI. You can also export and import masking rules to manage them outside of Neon.

</TabItem>

</Tabs>

## Manage masking rules

<Tabs labels={["Console", "API"]}>

<TabItem>

From the **Data Masking** page:

1. Select the schema, table, and column you want to mask.
2. Choose a masking function from the dropdown list (e.g., **Dummy Free Email** to execute `anon.dummy_free_email()`). The Console provides a curated list of common functions. For the full set of PostgreSQL Anonymizer functions, you must use the API.

<Admonition type="tip">
For email columns with unique constraints, use **Random Unique Email**, which generates UUID-based emails that maintain uniqueness while preserving the email format.
</Admonition>

<Admonition type="note">
Foreign key columns cannot be masked directly to maintain referential integrity. If you attempt to mask a foreign key column, the Console will display an alert with a "Go to primary key" action that navigates to the corresponding primary key column where you can apply masking rules.
</Admonition>

3. Repeat for all sensitive columns.
4. When you are ready, click **Apply masking rules** to start the anonymization job. You can monitor its progress on this page or via the [API](#get-anonymization-status).

![Neon Console 'data masking' dialog with example masking functions configured](/docs/workflows/anon-data-masking.png)

<Admonition type="important">
Rerunning the anonymization process on the anonymized branch applies rules to previously anonymized data, not fresh data from the parent branch. To start from the parent's original data, create a new anonymized branch.
</Admonition>

</TabItem>

<TabItem>

For complete API documentation with request/response examples, see [Data anonymization APIs](#data-anonymization-apis) below. Note that the Console uses friendly labels for masking functions (e.g., **Random Unique Email**), but the API returns and accepts the underlying PostgreSQL expressions (e.g., `pg_catalog.concat(anon.dummy_uuidv4(), '@example.com')`).

**Get masking rules**

```bash
GET /projects/{project_id}/branches/{branch_id}/masking_rules
```

**Update masking rules**

```bash
PATCH /projects/{project_id}/branches/{branch_id}/masking_rules
```

**Start anonymization**

```bash
POST /projects/{project_id}/branches/{branch_id}/anonymize
```

**Get anonymization status**

```bash
GET /projects/{project_id}/branches/{branch_id}/anonymized_status
```

</TabItem>

</Tabs>

## Common workflow

1. Create an anonymized branch from your production branch.
2. Define masking rules for sensitive columns (emails, names, addresses, etc.).
3. Apply the masking rules.
4. [Connect](/docs/connect/connect-from-any-app) your development environment to the anonymized branch.
5. When you need fresh data, create a new anonymized branch.

## How anonymization works

When you create a branch with anonymized data:

1. Neon creates a new branch with the schema and data from the parent branch.
2. You define masking rules for tables and columns containing sensitive data:
   - **Console**: The Data Masking page opens automatically after branch creation.
   - **API**: Include masking rules in the creation request or add them later via the masking rules endpoint.
3. You apply the masking rules (in Console, click **Apply masking rules**), and the PostgreSQL Anonymizer extension masks the branch data.
4. You can update rules and rerun anonymization on the branch as needed.

The parent branch data remains unchanged. Rerunning anonymization applies rules to the branch's current (already masked) data, not fresh data from the parent.

<Admonition type="note">
The branch is unavailable for connections while anonymization is in progress.
</Admonition>

## Limitations

- Currently cannot reset to parent, restore, or delete the read-write endpoint for anonymized branches.
- Branch is unavailable during anonymization.
- Masking does not fully enforce database constraints, but improvements are ongoing. For example, use **Random Unique Email** for columns with unique constraints on emails.
- **Foreign key columns cannot be masked directly.** To maintain referential integrity, you should mask the corresponding primary key column instead. The Console displays an alert with a "Go to primary key" action that navigates to the relevant primary key column.
- Anonymized branches are not currently supported for projects with [IP restrictions](/docs/introduction/ip-allow) or [private networking](/docs/guides/neon-private-networking) enabled.
- The Console provides a curated subset of masking functions - use the API for all [PostgreSQL Anonymizer masking functions](https://postgresql-anonymizer.readthedocs.io/en/latest/masking_functions/).

## Data anonymization APIs

The Neon API provides comprehensive control over anonymized branches, including access to all PostgreSQL Anonymizer masking functions and the ability to export/import masking rules for management outside of Neon.

### Create anonymized branch

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

### Get anonymization status

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

### Start anonymization

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

### Get masking rules

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

You can also query masking rules directly from the database:

```sql
SELECT * FROM anon.pg_masking_rules;
```

### Update masking rules

[→ API Reference](https://api-docs.neon.tech/reference/updatemaskingrules)

```
PATCH /projects/{project_id}/branches/{branch_id}/masking_rules
```

Updates masking rules for the specified anonymized branch. After updating, use the start anonymization endpoint to apply changes.

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

## Related resources

- [PostgreSQL Anonymizer documentation](https://postgresql-anonymizer.readthedocs.io/)
- [Neon branching overview](/docs/introduction/branching)
- [Neon API reference](https://api-docs.neon.tech/reference/)

---

## Automate data anonymization with GitHub Actions

Automate anonymized branch creation using the [Neon Create Branch Action](https://github.com/neondatabase/create-branch-action). The `masking_rules` input lets you define masking rules directly in your workflow, creating an anonymized branch in a single step.

<Steps>

### Requirements

Before setting up the workflow:

- A **Neon project** with a populated parent branch
- The following GitHub repository secrets:
  - `NEON_PROJECT_ID`
  - `NEON_API_KEY`

<Admonition type="tip">
The Neon GitHub integration configures these secrets automatically. See [Neon GitHub integration](/docs/guides/neon-github-integration).
</Admonition>

### Set up the workflow

Create a file at `.github/workflows/create-anon-branch.yml` with the following content:

```yaml
name: Create Anonymized Branch for PR

on:
  pull_request:
    types: [opened, reopened]

jobs:
  create-anon-branch:
    runs-on: ubuntu-latest
    steps:
      - name: Create anonymized branch
        uses: neondatabase/create-branch-action@v6
        id: create-branch
        with:
          project_id: ${{ secrets.NEON_PROJECT_ID }}
          branch_name: anon-pr-${{ github.event.number }}
          api_key: ${{ secrets.NEON_API_KEY }}
          masking_rules: |
            [
              {
                "database_name": "neondb",
                "schema_name": "public",
                "table_name": "users",
                "column_name": "email",
                "masking_function": "anon.dummy_free_email()"
              },
              {
                "database_name": "neondb",
                "schema_name": "public",
                "table_name": "users",
                "column_name": "first_name",
                "masking_function": "anon.fake_first_name()"
              },
              {
                "database_name": "neondb",
                "schema_name": "public",
                "table_name": "users",
                "column_name": "last_name",
                "masking_function": "anon.fake_last_name()"
              }
            ]

      - name: Output branch details
        run: |
          echo "Branch ID: ${{ steps.create-branch.outputs.branch_id }}"
          echo "Database URL: ${{ steps.create-branch.outputs.db_url }}"
```

The `masking_rules` input accepts a JSON array where each rule specifies:

| Field              | Description                             |
| ------------------ | --------------------------------------- |
| `database_name`    | Target database (e.g., `neondb`)        |
| `schema_name`      | Target schema (typically `public`)      |
| `table_name`       | Table containing sensitive data         |
| `column_name`      | Column to mask                          |
| `masking_function` | PostgreSQL Anonymizer function to apply |

For available masking functions, see [PostgreSQL Anonymizer documentation](https://postgresql-anonymizer.readthedocs.io/en/latest/masking_functions/) or the [Manage masking rules](#manage-masking-rules) section above.

<Admonition type="note">
The `masking_rules` input creates a new anonymized branch. Masking rules cannot be applied to existing branches.
</Admonition>

### Testing the workflow

1. Customize and push the workflow file to your repository
2. Open a new pull request
3. Check the **Actions** tab to monitor workflow execution
4. Verify the anonymized branch in the Neon Console or connect to it to confirm data is masked

### Clean up branches

Clean up anonymized branches when no longer needed. Automate this with the [delete-branch-action](https://github.com/neondatabase/delete-branch-action) when PRs close:

```yaml
name: Delete Branch on PR Close

on:
  pull_request:
    types: closed

jobs:
  delete-branch:
    runs-on: ubuntu-latest
    steps:
      - name: Delete anonymized branch
        uses: neondatabase/delete-branch-action@v3
        with:
          project_id: ${{ secrets.NEON_PROJECT_ID }}
          branch: anon-pr-${{ github.event.number }}
          api_key: ${{ secrets.NEON_API_KEY }}
```

</Steps>
