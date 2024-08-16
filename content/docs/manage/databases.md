---
title: Manage databases
enableTableOfContents: true
isDraft: false
updatedOn: '2024-08-13T15:31:30.510Z'
---

A database is a container for SQL objects such as schemas, tables, views, functions, and indexes. In the [Neon object hierarchy](/docs/manage/overview), a database exists within a branch of a project. While there is no strict limit on the number of databases you can create, we recommend keeping it under 500 per branch.

If you do not specify your own database name when creating a project, your project's default branch is created with a database called `neondb`, which is owned by your project's default role (see [Manage roles](/docs/manage/roles) for more information). You can create your own databases in a project's default branch or in a child branch.

All databases in Neon are created with a `public` schema. SQL objects are created in the `public` schema, by default. For more information about the `public` schema, refer to [The Public schema](https://www.postgresql.org/docs/current/ddl-schemas.html#DDL-SCHEMAS-PUBLIC), in the _PostgreSQL documentation_.

<Admonition type="note">
As of Postgres 15, only a database owner has the `CREATE` privilege on a database's `public` schema. For other users, the `CREATE` privilege must be granted manually via a `GRANT CREATE ON SCHEMA public TO <username>;` statement. For more information, see [Public schema privileges](/docs/manage/database-access#public-schema-privileges).
</Admonition>

Databases belong to a branch. If you create a child branch, databases from the parent branch are copied to the child branch. For example, if database `mydb` exists in the parent branch, it will be copied to the child branch. The only time this does not occur is when you create a branch that includes data up to a particular point in time. If a database was created in the parent branch after that point in time, it is not duplicated in the child branch.

Neon supports creating and managing databases from the following interfaces:

- [Neon Console](#manage-databases-in-the-neon-console)
- [Neon CLI](#manage-databases-with-the-neon-cli)
- [Neon API](#manage-databases-with-the-neon-api)
- [SQL](#manage-databases-with-sql)

## Manage databases in the Neon Console

This section describes how to create, view, and delete databases in the Neon Console.

The role that creates a database is automatically made the owner of that database. The `neon_superuser` role is also granted all privileges on databases created in the Neon Console. For information about this role, see [The neon_superuser role](/docs/manage/roles#the-neonsuperuser-role).

### Create a database

To create a database:

1. Navigate to the [Neon Console](https://console.neon.tech).
1. Select a project.
1. Select **Branches** from the sidebar.
1. Select the branch where you want to create the database.
1. Select the **Roles** & **Databases** tab.
1. Click **Add Database**.
1. Enter a database name, and select a database owner.
1. Click **Create**.

<Admonition type="note">
Some names are not permitted. See [Protected database names](#protected-database-names).
</Admonition>

### View databases

To view databases:

1. Navigate to the [Neon Console](https://console.neon.tech).
1. Select a project.
1. Select **Branches** from the sidebar.
1. Select the branch where you want to view databases.
1. Select the **Roles** & **Databases** tab.

### Delete a database

Deleting a database is a permanent action. All database objects belonging to the database such as schemas, tables, and roles are also deleted.

To delete a database:

1. Navigate to the [Neon Console](https://console.neon.tech).
1. Select a project.
1. Select **Databases** from the sidebar.
1. Select a branch to view the databases in the branch.
1. For the database you want to delete, click the delete icon.
1. In the confirmation dialog, click **Delete**.

## Manage databases with the Neon CLI

The Neon CLI supports creating and deleting databases. For instructions, see [Neon CLI commands — databases](/docs/reference/cli-databases).

## Manage databases with the Neon API

Database actions performed in the Neon Console can also be also performed using the Neon API. The following examples demonstrate how to create, view, update, and delete databases using the Neon API. For other database-related methods, refer to the [Neon API reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api).

In Neon, a database belongs to a branch, which means that when you create a database, it is created in a branch. Database-related requests are therefore performed using branch API methods.

<Admonition type="note">
The API examples that follow may not show all user-configurable request body attributes that are available to you. To view all  attributes for a particular method, refer to the method's request body schema in the [Neon API reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api).
</Admonition>

The `jq` option specified in each example is an optional third-party tool that formats the `JSON` response, making it easier to read. For information about this utility, see [jq](https://stedolan.github.io/jq/).

### Prerequisites

A Neon API request requires an API key. For information about obtaining an API key, see [Create an API key](/docs/manage/api-keys#create-an-api-key). In the cURL examples below, `$NEON_API_KEY` is specified in place of an actual API key, which you must provide when making a Neon API request.

### Create a database with the API

The following Neon API method creates a database. To view the API documentation for this method, refer to the [Neon API reference](https://api-docs.neon.tech/reference/createprojectbranchdatabase).

The role specified by `owner_name` is the owner of that database.

```http
POST /projects/{project_id}/branches/{branch_id}/databases
```

<Admonition type="note">
Some names are not permitted for databases. See [Protected database names](#protected-database-names).
</Admonition>

The API method appears as follows when specified in a cURL command. The `project_id` and `branch_id` are required parameters, and a database `name` and `owner` are required attributes.

```bash
curl 'https://console.neon.tech/api/v2/projects/hidden-cell-763301/branches/br-blue-tooth-671580/databases' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
  "database": {
    "name": "mydb",
    "owner_name": "casey"
  }
}' | jq
```

<details>
<summary>Response body</summary>

```json
{
  "database": {
    "id": 1140822,
    "branch_id": "br-blue-tooth-671580",
    "name": "mydb",
    "owner_name": "casey",
    "created_at": "2023-01-04T21:17:17Z",
    "updated_at": "2023-01-04T21:17:17Z"
  },
  "operations": [
    {
      "id": "6fc5969a-c445-4bc1-9f94-4dfbab4ad293",
      "project_id": "hidden-cell-763301",
      "branch_id": "br-blue-tooth-671580",
      "endpoint_id": "ep-aged-math-668285",
      "action": "apply_config",
      "status": "running",
      "failures_count": 0,
      "created_at": "2023-01-04T21:17:17Z",
      "updated_at": "2023-01-04T21:17:17Z"
    },
    {
      "id": "a0e78873-399a-45e4-9728-dde0b36f0941",
      "project_id": "hidden-cell-763301",
      "branch_id": "br-blue-tooth-671580",
      "endpoint_id": "ep-aged-math-668285",
      "action": "suspend_compute",
      "status": "scheduling",
      "failures_count": 0,
      "created_at": "2023-01-04T21:17:17Z",
      "updated_at": "2023-01-04T21:17:17Z"
    }
  ]
}
```

</details>

### List databases with the API

The following Neon API method lists databases for the specified branch. To view the API documentation for this method, refer to the [Neon API reference](https://api-docs.neon.tech/reference/listprojectbranchdatabases).

```http
GET /projects/{project_id}/branches/{branch_id}/databases
```

The API method appears as follows when specified in a cURL command. The `project_id` and `branch_id` are required parameters.

```bash
curl 'https://console.neon.tech/api/v2/projects/hidden-cell-763301/branches/br-blue-tooth-671580/databases' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" | jq
```

<details>
<summary>Response body</summary>

```json
{
  "databases": [
    {
      "id": 1139149,
      "branch_id": "br-blue-tooth-671580",
      "name": "neondb",
      "owner_name": "casey",
      "created_at": "2023-01-04T18:38:23Z",
      "updated_at": "2023-01-04T18:38:23Z"
    },
    {
      "id": 1140822,
      "branch_id": "br-blue-tooth-671580",
      "name": "mydb",
      "owner_name": "casey",
      "created_at": "2023-01-04T21:17:17Z",
      "updated_at": "2023-01-04T21:17:17Z"
    }
  ]
}
```

</details>

### Update a database with the API

The following Neon API method updates the specified database. To view the API documentation for this method, refer to the [Neon API reference](https://api-docs.neon.tech/reference/updateprojectbranchdatabase).

```http
PATCH /projects/{project_id}/branches/{branch_id}/databases/{database_name}
```

The API method appears as follows when specified in a cURL command. The `project_id` and `branch_id` are required parameters. This example updates the database `name` value to `database1`.

```bash
curl 'https://console.neon.tech/api/v2/projects/hidden-cell-763301/branches/br-blue-tooth-671580/databases/mydb' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
  "database": {
    "name": "database1"
  }
}' | jq
```

<details>
<summary>Response body</summary>

```json
{
  "database": {
    "id": 1140822,
    "branch_id": "br-blue-tooth-671580",
    "name": "database1",
    "owner_name": "casey",
    "created_at": "2023-01-04T21:17:17Z",
    "updated_at": "2023-01-04T21:17:17Z"
  },
  "operations": [
    {
      "id": "7a3e05b0-385e-490c-a6a3-60bbb8906f57",
      "project_id": "hidden-cell-763301",
      "branch_id": "br-blue-tooth-671580",
      "endpoint_id": "ep-aged-math-668285",
      "action": "apply_config",
      "status": "running",
      "failures_count": 0,
      "created_at": "2023-01-04T21:19:35Z",
      "updated_at": "2023-01-04T21:19:35Z"
    },
    {
      "id": "f2805f7f-4d83-4c58-b3d1-dc678e699106",
      "project_id": "hidden-cell-763301",
      "branch_id": "br-blue-tooth-671580",
      "endpoint_id": "ep-aged-math-668285",
      "action": "suspend_compute",
      "status": "scheduling",
      "failures_count": 0,
      "created_at": "2023-01-04T21:19:35Z",
      "updated_at": "2023-01-04T21:19:35Z"
    }
  ]
}
```

</details>

### Delete a database with the API

The following Neon API method deletes the specified database. To view the API documentation for this method, refer to the [Neon API reference](https://api-docs.neon.tech/reference/deleteprojectbranchdatabase).

```http
DELETE /projects/{project_id}/branches/{branch_id}/databases/{database_name}
```

The API method appears as follows when specified in a cURL command. The `project_id`, `branch_id`, and `database_name` are required parameters.

```bash
curl -X 'DELETE' \
  'https://console.neon.tech/api/v2/projects/hidden-cell-763301/branches/br-blue-tooth-671580/databases/database1' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" | jq
```

<details>
<summary>Response body</summary>

```json
{
  "database": {
    "id": 1140822,
    "branch_id": "br-blue-tooth-671580",
    "name": "database1",
    "owner_name": "casey",
    "created_at": "2023-01-04T21:17:17Z",
    "updated_at": "2023-01-04T21:17:17Z"
  },
  "operations": [
    {
      "id": "1a52afa4-f21b-4ed0-a97f-f7abda9ab49f",
      "project_id": "hidden-cell-763301",
      "branch_id": "br-blue-tooth-671580",
      "endpoint_id": "ep-aged-math-668285",
      "action": "apply_config",
      "status": "running",
      "failures_count": 0,
      "created_at": "2023-01-04T21:20:24Z",
      "updated_at": "2023-01-04T21:20:24Z"
    },
    {
      "id": "f3fe437e-259a-4442-a750-3613d89dbbff",
      "project_id": "hidden-cell-763301",
      "branch_id": "br-blue-tooth-671580",
      "endpoint_id": "ep-aged-math-668285",
      "action": "suspend_compute",
      "status": "scheduling",
      "failures_count": 0,
      "created_at": "2023-01-04T21:20:24Z",
      "updated_at": "2023-01-04T21:20:24Z"
    }
  ]
}
```

</details>

## Manage databases with SQL

You can create and manage databases in Neon with SQL, as you can with any standalone Postgres installation. To create a database, issue a `CREATE DATABASE` statement from a client such as [psql](/docs/connect/query-with-psql-editor) or from the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor).

```sql
CREATE DATABASE testdb;
```

Most standard [Postgres CREATE DATABASE parameters](https://www.postgresql.org/docs/current/sql-createdatabase.html) are supported with the exception of `TABLESPACE`. This parameter requires access to the local file system, which is not permitted in Neon.

The role that creates a database is the owner of the database.

<Admonition type="note">
As of Postgres 15, only a database owner has the `CREATE` privilege on a database's `public` schema. For other users, the `CREATE` privilege on the `public` schema must be granted explicitly via a `GRANT CREATE ON SCHEMA public TO <username>;` statement. For more information, see [Public schema privileges](/docs/manage/database-access#public-schema-privileges).
</Admonition>

For more information about database object privileges in Postgres, see [Privileges](https://www.postgresql.org/docs/current/ddl-priv.html).

## Protected database names

The following names are protected and cannot be given to a database:

- `postgres`
- `template0`
- `template1`

<NeedHelp/>
