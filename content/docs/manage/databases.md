---
title: Manage databases
summary: >-
  Neon databases are Postgres containers for schemas, tables, and indexes that
  exist within a project branch. Use this page to create, rename, or delete
  databases via the Neon Console, CLI, API, or SQL. Note that the TABLESPACE
  parameter is not supported. Because Neon roles are not full Postgres
  superusers, ownership transfers require a group-role workaround using
  ALTER TABLE ... OWNER TO or REASSIGN OWNED.
enableTableOfContents: true
isDraft: false
updatedOn: '2026-08-26T13:16:52.511Z'
---

A database is a container for SQL objects such as schemas, tables, views, functions, and indexes. In the [Neon object hierarchy](/docs/manage/overview), a database exists within a branch of a project. There is a limit of 500 databases per branch.

If you do not specify your own database name when creating a project, your project's default branch is created with a database called `neondb`, which is owned by your project's default role (see [Manage roles](/docs/manage/roles) for more information). You can create your own databases in a project's default branch or in a child branch.

All databases in Neon are created with a `public` schema. SQL objects are created in the `public` schema, by default. For more information about the `public` schema, refer to [The Public schema](https://www.postgresql.org/docs/current/ddl-schemas.html#DDL-SCHEMAS-PUBLIC), in the _PostgreSQL documentation_.

<Admonition type="note">
As of Postgres 15, only a database owner has the `CREATE` privilege on a database's `public` schema. For other users, the `CREATE` privilege must be granted manually via a `GRANT CREATE ON SCHEMA public TO <username>;` statement. For more information, see [Public schema privileges](/docs/manage/database-access#public-schema-privileges).
</Admonition>

Databases belong to a branch. If you create a child branch, databases from the parent branch are copied to the child branch. For example, if database `mydb` exists in the parent branch, it will be copied to the child branch. The only time this does not occur is when you create a branch that includes data up to a particular point in time. If a database was created in the parent branch after that point in time, it is not duplicated in the child branch.

Neon supports creating and managing databases from the Neon Console, CLI, and API, and directly with [SQL](#manage-databases-with-sql).

The role that creates a database is automatically made the owner of that database. The `neon_superuser` role is also granted all privileges on databases created in the Neon Console. For information about this role, see [The neon_superuser role](/docs/manage/roles#the-neonsuperuser-role).

## Create a database

<Tabs labels={["Console", "CLI", "API"]}>

<TabItem>

1. Navigate to the [Neon Console](https://console.neon.tech).
1. Select a project.
1. In the sidebar, select your branch from the **BRANCH** selector.
1. Under **Postgres database**, select **Databases**.
1. Click **Add database**.
1. Enter a database name, and select a database owner.
1. Click **Create**.

</TabItem>

<TabItem>

Create a database with [`neon databases create`](/docs/cli/databases#create). If you omit `--branch`, the CLI uses the project's default branch:

```bash
neon databases create --name mydb --owner-name casey
```

</TabItem>

<TabItem>

Create a database with the [Create database](/docs/reference/api/branches/create-project-branch-database) endpoint. A database `name` and `owner_name` are required:

```bash
curl 'https://console.neon.tech/api/v2/projects/dry-heart-13671059/branches/br-morning-meadow-afu2s1jl/databases' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
  "database": {
    "name": "mydb",
    "owner_name": "casey"
  }
}'
```

<details>
<summary>Response body</summary>

For attribute definitions, find the [Create database](/docs/reference/api/branches/create-project-branch-database) endpoint in the [Neon API Reference](/docs/reference/api). Definitions are provided in the **Responses** section.

```json
{
  "database": {
    "id": 2889509,
    "branch_id": "br-morning-meadow-afu2s1jl",
    "name": "mydb",
    "owner_name": "casey",
    "created_at": "2025-08-04T08:14:14Z",
    "updated_at": "2025-08-04T08:14:14Z"
  },
  "operations": [
    {
      "id": "b51c8ece-b78e-49f7-8ec1-78b37cbae3c4",
      "project_id": "dry-heart-13671059",
      "branch_id": "br-morning-meadow-afu2s1jl",
      "endpoint_id": "ep-holy-heart-afbmgcfx",
      "action": "apply_config",
      "status": "running",
      "failures_count": 0,
      "created_at": "2025-08-04T08:14:14Z",
      "updated_at": "2025-08-04T08:14:14Z",
      "total_duration_ms": 0
    }
  ]
}
```

</details>

</TabItem>

</Tabs>

<Admonition type="note">
Some names are not permitted. See [Reserved database names](#reserved-database-names).
</Admonition>

## View databases

<Tabs labels={["Console", "CLI", "API"]}>

<TabItem>

1. Navigate to the [Neon Console](https://console.neon.tech).
1. Select a project.
1. In the sidebar, select your branch from the **BRANCH** selector.
1. Under **Postgres database**, select **Databases**.

</TabItem>

<TabItem>

List databases with [`neon databases list`](/docs/cli/databases#list). If you omit `--branch`, the CLI uses the project's default branch:

```bash
neon databases list
```

```text filename="Output"
┌────────┬────────────┬──────────────────────┐
│ Name   │ Owner Name │ Created At           │
├────────┼────────────┼──────────────────────┤
│ neondb │ casey      │ 2023-06-19T18:27:19Z │
├────────┼────────────┼──────────────────────┤
│ mydb   │ casey      │ 2023-06-19T18:27:19Z │
└────────┴────────────┴──────────────────────┘
```

</TabItem>

<TabItem>

List databases for a branch with the [List databases](/docs/reference/api/branches/list-project-branch-databases) endpoint:

```bash
curl 'https://console.neon.tech/api/v2/projects/dry-heart-13671059/branches/br-morning-meadow-afu2s1jl/databases' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

<details>
<summary>Response body</summary>

For attribute definitions, find the [List databases](/docs/reference/api/branches/list-project-branch-databases) endpoint in the [Neon API Reference](/docs/reference/api). Definitions are provided in the **Responses** section.

```json
{
  "databases": [
    {
      "id": 1139149,
      "branch_id": "br-morning-meadow-afu2s1jl",
      "name": "neondb",
      "owner_name": "casey",
      "created_at": "2023-01-04T18:38:23Z",
      "updated_at": "2023-01-04T18:38:23Z"
    },
    {
      "id": 1140822,
      "branch_id": "br-morning-meadow-afu2s1jl",
      "name": "mydb",
      "owner_name": "casey",
      "created_at": "2023-01-04T21:17:17Z",
      "updated_at": "2023-01-04T21:17:17Z"
    }
  ]
}
```

</details>

</TabItem>

</Tabs>

## Update a database

Rename a database with the [Update database](/docs/reference/api/branches/update-project-branch-database) endpoint, or with [SQL](#rename-a-database-with-sql). This example renames `mydb` to `database1`:

```bash
curl -X PATCH 'https://console.neon.tech/api/v2/projects/dry-heart-13671059/branches/br-morning-meadow-afu2s1jl/databases/mydb' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
  "database": {
    "name": "database1"
  }
}'
```

<details>
<summary>Response body</summary>

For attribute definitions, find the [Update database](/docs/reference/api/branches/update-project-branch-database) endpoint in the [Neon API Reference](/docs/reference/api). Definitions are provided in the **Responses** section.

```json
{
  "database": {
    "id": 2889509,
    "branch_id": "br-morning-meadow-afu2s1jl",
    "name": "database1",
    "owner_name": "casey",
    "created_at": "2025-08-04T08:14:14Z",
    "updated_at": "2025-08-04T08:14:14Z"
  },
  "operations": [
    {
      "id": "2f8c0a6a-33b5-4d56-964b-739614b699c0",
      "project_id": "dry-heart-13671059",
      "branch_id": "br-morning-meadow-afu2s1jl",
      "endpoint_id": "ep-holy-heart-afbmgcfx",
      "action": "apply_config",
      "status": "running",
      "failures_count": 0,
      "created_at": "2025-08-04T08:17:22Z",
      "updated_at": "2025-08-04T08:17:22Z",
      "total_duration_ms": 0
    }
  ]
}
```

</details>

## Delete a database

Deleting a database is a permanent action. All database objects belonging to the database such as schemas, tables, and roles are also deleted.

<Tabs labels={["Console", "CLI", "API"]}>

<TabItem>

1. Navigate to the [Neon Console](https://console.neon.tech).
1. Select a project.
1. In the sidebar, select your branch from the **BRANCH** selector.
1. Under **Postgres database**, select **Databases**.
1. For the database you want to delete, click the delete icon.
1. In the confirmation dialog, click **Delete**.

</TabItem>

<TabItem>

Delete a database with [`neon databases delete`](/docs/cli/databases#delete):

```bash
neon databases delete database1
```

</TabItem>

<TabItem>

Delete a database with the [Delete database](/docs/reference/api/branches/delete-project-branch-database) endpoint:

```bash
curl -X 'DELETE' \
  'https://console.neon.tech/api/v2/projects/dry-heart-13671059/branches/br-morning-meadow-afu2s1jl/databases/database1' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

<details>
<summary>Response body</summary>

For attribute definitions, find the [Delete database](/docs/reference/api/branches/delete-project-branch-database) endpoint in the [Neon API Reference](/docs/reference/api). Definitions are provided in the **Responses** section.

```json
{
  "database": {
    "id": 2889509,
    "branch_id": "br-morning-meadow-afu2s1jl",
    "name": "database1",
    "owner_name": "casey",
    "created_at": "2025-08-04T08:14:14Z",
    "updated_at": "2025-08-04T08:14:14Z"
  },
  "operations": [
    {
      "id": "4cd4881b-2807-4377-a76d-8e7d39bc5448",
      "project_id": "dry-heart-13671059",
      "branch_id": "br-morning-meadow-afu2s1jl",
      "endpoint_id": "ep-holy-heart-afbmgcfx",
      "action": "apply_config",
      "status": "running",
      "failures_count": 0,
      "created_at": "2025-08-04T08:19:39Z",
      "updated_at": "2025-08-04T08:19:39Z",
      "total_duration_ms": 0
    }
  ]
}
```

</details>

</TabItem>

</Tabs>
## Manage databases with SQL

You can create and manage databases in Neon with SQL, as you can with any standalone Postgres installation. To create a database, issue a `CREATE DATABASE` statement from a client such as [psql](/docs/connect/query-with-psql-editor) or from the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor).

```sql
CREATE DATABASE testdb;
```

Most standard [Postgres CREATE DATABASE parameters](https://www.postgresql.org/docs/current/sql-createdatabase.html) are supported with the exception of `TABLESPACE`. This parameter requires access to the local file system, which is not permitted in Neon.

The role that creates a database is the owner of the database.

<Admonition type="note">
As of Postgres 15, only a database owner has the `CREATE` privilege on a database's `public` schema. For other users, the `CREATE` privilege on the `public` schema must be granted explicitly via a `GRANT CREATE ON SCHEMA public TO <username>;` statement. For more information, see [Public schema privileges](/docs/manage/database-access#public-schema-privileges).
</Admonition>

For more information about database object privileges in Postgres, see [Privileges](https://www.postgresql.org/docs/current/ddl-priv.html).

### Rename a database with SQL

To rename a database, use `ALTER DATABASE`. Postgres won't let you rename a database while you're connected to it, so connect to a different database on the same branch first (for example, the default `neondb`), then run:

```sql
ALTER DATABASE old_db_name RENAME TO new_db_name;
```

If open connections to the database block the rename, terminate them first:

```sql
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'old_db_name'
  AND pid <> pg_backend_pid();
```

The rename is instant, and data, schemas, tables, roles, and grants are unaffected. The database name is part of every connection string for the database, so update any application, script, or stored secret that references the old name. You can also rename a database with the [Neon API](#update-a-database).

### Delete a database with SQL

To delete a database, use `DROP DATABASE`. As with renaming, connect to a different database on the same branch first, since Postgres won't drop the database you're connected to:

```sql
DROP DATABASE old_db_name;
```

Deletion is permanent. All schemas, tables, indexes, and other objects in the database are dropped along with it. You can also delete a database from the [Neon Console, CLI, or API](#delete-a-database).

## Transfer database table ownership between roles

In Neon, roles created via the Console, CLI, or API are members of `neon_superuser` but are not full Postgres superusers. This means you can't directly transfer ownership of a database table from one role to another using `ALTER TABLE ... OWNER TO`.

The workaround is to introduce a shared group role that both roles belong to. You transfer ownership to the group, then the destination role can claim ownership for itself.

<Admonition type="note">
In the example below, `current_owner`, `new_owner`, and `table_owners` are placeholder role and group names. Replace them with names from your own environment.
</Admonition>

1. Connect as the database owner role and run:

   ```sql
   -- Create a group role with no login
   CREATE ROLE table_owners NOLOGIN;

   -- Grant schema access to the group
   GRANT USAGE, CREATE ON SCHEMA public TO table_owners;

   -- Add both roles to the group
   GRANT table_owners TO current_owner;
   GRANT table_owners TO new_owner;
   ```

   Replace `current_owner` and `new_owner` with the actual role names.

2. Still connected as `current_owner`, transfer the table to the group:

   ```sql
   ALTER TABLE your_table OWNER TO table_owners;
   ```

3. Connect as `new_owner`. Transfer ownership from the group to yourself:

   ```sql
   ALTER TABLE your_table OWNER TO new_owner;
   ```

4. Verify ownership:

   ```sql
   \dt your_table
   ```

   The **Owner** column should now show `new_owner`.

5. Leave the `table_owners` group role in place if you need to transfer other tables later, or drop it when you're done:

   ```sql
   DROP ROLE table_owners;
   ```

   `DROP ROLE table_owners` works only after that role no longer owns any objects and has no blocking dependencies.

### Transfer ownership for multiple objects

The numbered steps above show how to transfer one table with `ALTER TABLE ... OWNER TO`.

If you need to transfer ownership for everything a role owns in a database, use `REASSIGN OWNED` instead of running `ALTER ... OWNER TO` for each table.

`REASSIGN OWNED` includes tables and other object types owned by the role, such as views, materialized views, sequences, functions, schemas, and types.

Connect as `current_owner` and move all owned objects to the shared group:

```sql
REASSIGN OWNED BY current_owner TO table_owners;
```

Then connect as `new_owner` and move those objects from the group to the destination role:

```sql
REASSIGN OWNED BY table_owners TO new_owner;
```

`REASSIGN OWNED` applies within the current database context. Run it in each database where you need to transfer ownership.

<Admonition type="note">
- `REASSIGN OWNED` runs in the current database context, so run it in each database where you need to transfer ownership.
- `REASSIGN OWNED` reassigns ownership only. It does not change existing `GRANT` permissions or default privileges.
</Admonition>

## Reserved database names

The following names are reserved and cannot be given to a database:

- `postgres`
- `template0`
- `template1`

<NeedHelp/>
