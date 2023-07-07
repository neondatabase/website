---
title: Manage databases
enableTableOfContents: true
isDraft: false
---

A database is a container for SQL objects such as schemas, tables, views, functions, and indexes. In the [Neon object hierarchy](/docs/manage/overview), a database exists within a branch of a project. There is no limit on the number of databases you can create.

A Neon project's primary branch is created with a default database called `neondb`, which is owned by your project's default role (see [Manage roles](/docs/manage/roles) for more information). You can create your own databases in a project's primary branch or in a child branch.

All databases in Neon are created with a `public` schema. SQL objects are created in the `public` schema, by default. For more information about the `public` schema, refer to [The Public schema](https://www.postgresql.org/docs/current/ddl-schemas.html#DDL-SCHEMAS-PUBLIC), in the _PostgreSQL documentation_.

Databases belong to branch. If you create a child branch, databases from the parent branch are copied to the child branch. For example, if database `mydb` exists in the parent branch, it will be copied to the child branch. The only time this does not occur is when you create a branch that only includes data up to a particular point in time. If a database was created in the parent branch after that point in time, it is not duplicated in the child branch.

Neon supports creating and managing databases from the following interfaces:

- [Neon console](#manage-databases-in-the-neon-console)
- [SQL](#manage-databases-with-sql) (from a client or the using the Neon SQL Editor)
- [Neon API](#manage-databases-with-the-neon-api)

## Manage databases in the Neon console

This section describes how to create, view, and delete databases in the Neon Console.

The role that creates a database is automatically made the owner of that database. The `neon_superuser` role is also granted all privileges on databases created in the Neon consoles. For information about this role, see [The neon_superuser role](/docs/manage/roles/the-neon_superuser-role).

### Create a database

To create a database:

1. Navigate to the [Neon Console](https://console.neon.tech).
1. Select a project.
1. Select **Databases**.
1. Select the branch where you want to create the database.
1. Click **New Database**.
1. Enter a database name, and select a database owner.
1. Click **Create**.

### View databases

To view databases:

1. Navigate to the [Neon Console](https://console.neon.tech).
1. Select a project.
1. Select **Databases**
1. Select a branch to view the databases in the branch.

### Delete a database

Deleting a database is a permanent action. All database objects belonging to the database such as schemas, tables, and roles are also deleted.

To delete a database:

1. Navigate to the [Neon Console](https://console.neon.tech).
1. Select a project.
1. Select **Databases**.
1. Select a branch to view the databases in the branch.
1. For the database you want to delete, click the delete icon.
1. In the confirmation dialog, click **Delete**.

## Manage databases with SQL

You can create and manage databases in Neon with SQL, as you can with any stand-alone PostgreSQL instance.

To create a database with SQL, issue a `CREATE DATABASE` statement from a client such as [psql](/docs/connect/query-with-psql-editor) or from the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor). For example:

```sql
CREATE DATABASE testdb;
```

Most standard [PostgreSQL CREATE DATABASE parameters](https://www.postgresql.org/docs/current/sql-createdatabase.html) are supported with the exception of `TABLESPACE`. This parameter requires access to the local file system, which is not supported.

The role that creates a database is automatically made the owner of the database and has all of the expected PostgreSQL privileges on the database, including the ability to `DROP` the database, `CONNECT` to the database, and create new `SCHEMAS` in it. For more information about database object privileges in PostgreSQL, see [Privileges](https://www.postgresql.org/docs/current/ddl-priv.html). [The neon_superuser role](/docs/manage/roles/the-neon_superuser-role) is not automatically granted access on databases created with SQL.

For an example of creating a database with SQL, refer to the [Manage databases access with SQL guide](/docs/guides/manage-database-access).

## Manage databases with the Neon API

Database actions performed in the Neon Console can also be also performed using the Neon API. The following examples demonstrate how to create, view, update, and delete databases using the Neon API. For other database-related methods, refer to the [Neon API reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api).

In Neon, a database belongs to a branch, which means that when you create a database, it is created in a branch. Database-related requests are therefore performed using branch API methods.

<Admonition type="note">
The API examples that follow may not show all user-configurable request body attributes that are available to you. To view all  attributes for a particular method, refer to method's request body schema in the [Neon API reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api).
</Admonition>

The `jq` option specified in each example is an optional third-party tool that formats the `JSON` response, making it easier to read. For information about this utility, see [jq](https://stedolan.github.io/jq/).

### Prerequisites

A Neon API request requires an API key. For information about obtaining an API key, see [Create an API key](/docs/manage/api-keys#create-an-api-key). In the cURL examples below, `$NEON_API_KEY` is specified in place of an actual API key, which you must provide when making a Neon API request.

### Create a database with the API

The following Neon API method creates a database. To view the API documentation for this method, refer to the [Neon API reference](https://api-docs.neon.tech/reference/createprojectbranchdatabase).

The role specified by `owner_name` is the owner of that database. The `neon_superuser` role is also granted all privileges on databases created with the Neon API. For information about this role, see [The neon_superuser role](/docs/manage/roles/the-neon_superuser-role).

```text
POST /projects/{project_id}/branches/{branch_id}/databases
```

The API method appears as follows when specified in a cURL command. The `project_id` and `branch_id` are required parameters, and a database `name` and `owner` are required attributes.

```bash
curl 'https://console.neon.tech/api/v2/projects/hidden-cell-763301/branches/br-blue-tooth-671580/databases' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer $NEON_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
  "database": {
    "name": "mydb",
    "owner_name": "casey"
  }
}' | jq
```

Response:

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

### List databases with the API

The following Neon API method lists databases for the specified branch. To view the API documentation for this method, refer to the [Neon API reference](https://api-docs.neon.tech/reference/listprojectbranchdatabases).

```text
GET /projects/{project_id}/branches/{branch_id}/databases
```

The API method appears as follows when specified in a cURL command. The `project_id` and `branch_id` are required parameters.

```bash
curl 'https://console.neon.tech/api/v2/projects/hidden-cell-763301/branches/br-blue-tooth-671580/databases' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer $NEON_API_KEY' | jq
```

Response:

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

### Update a database with the API

The following Neon API method updates the specified database. To view the API documentation for this method, refer to the [Neon API reference](https://api-docs.neon.tech/reference/updateprojectbranchdatabase).

```text
PATCH /projects/{project_id}/branches/{branch_id}/databases/{database_name}
```

The API method appears as follows when specified in a cURL command. The `project_id` and `branch_id` are required parameters. This example updates the database `name` value to `database1`.

```bash
curl 'https://console.neon.tech/api/v2/projects/hidden-cell-763301/branches/br-blue-tooth-671580/databases/mydb' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer $NEON_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
  "database": {
    "name": "database1"
  }
}' | jq
```

Response:

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

### Delete a database with the API

The following Neon API method deletes the specified database. To view the API documentation for this method, refer to the [Neon API reference](https://api-docs.neon.tech/reference/deleteprojectbranchdatabase).

```text
DELETE /projects/{project_id}/branches/{branch_id}/databases/{database_name}
```

The API method appears as follows when specified in a cURL command. The `project_id`, `branch_id`, and `database_name` are required parameters.

```bash
curl -X 'DELETE' \
  'https://console.neon.tech/api/v2/projects/hidden-cell-763301/branches/br-blue-tooth-671580/databases/database1' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer $NEON_API_KEY' | jq
```

Response:

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

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
