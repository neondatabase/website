---
title: Neon CLI commands — projects
subtitle: Use the Neon CLI to manage Neon directly from the terminal
enableTableOfContents: true
updatedOn: '2024-10-07T13:55:51.300Z'
---

## Before you begin

- Before running the `projects` command, ensure that you have [installed the Neon CLI](/docs/reference/cli-install).
- If you have not authenticated with the [neon auth](/docs/reference/cli-auth) command, running a Neon CLI command automatically launches the Neon CLI browser authentication process. Alternatively, you can specify a Neon API key using the `--api-key` option when running a command. See [Connect](/docs/reference/neon-cli#connect).

For information about projects in Neon, see [Projects](/docs/manage/projects).

## The `projects` command

The `projects` command allows you to list, create, update, delete, and retrieve information about Neon projects.

### Usage

```bash
neon projects <subcommand> [options]
```

| Subcommand        | Description      |
| ----------------- | ---------------- |
| [list](#list)     | List projects    |
| [create](#create) | Create a project |
| [update](#update) | Update a project |
| [delete](#delete) | Delete a project |
| [get](#get)       | Get a project    |

### list

This subcommand allows you to list projects that belong to your Neon account, as well as any projects that were shared with you.

#### Usage

```bash
neon projects list [options]
```

#### Options

In addition to the Neon CLI [global options](/docs/reference/neon-cli#global-options), the `projects` subcommand supports this option:

| Option           | Description                                                                                                              | Type   | Required |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------ | ------ | :------: |
| `--context-file` | [Context file](/docs/reference/cli-set-context#using-a-named-context-file) path and file name                            | string |          |
| `--org-id`       | List all projects belonging to the specified organization. If unspecified, personal account projects are listed instead. | string |          |

#### Examples

- List all projects belonging to your personal acccount

  ```bash
  neon projects list
  Projects
  ┌────────────────────────┬────────────────────┬───────────────┬──────────────────────┐
  │ Id                     │ Name               │ Region Id     │ Created At           │
  ├────────────────────────┼────────────────────┼───────────────┼──────────────────────┤
  │ crimson-voice-12345678 │ frontend           │ aws-us-east-2 │ 2024-04-15T11:17:30Z │
  ├────────────────────────┼────────────────────┼───────────────┼──────────────────────┤
  │ calm-thunder-12121212  │ backend            │ aws-us-east-2 │ 2024-04-10T15:21:01Z │
  ├────────────────────────┼────────────────────┼───────────────┼──────────────────────┤
  │ nameless-hall-87654321 │ billing            │ aws-us-east-2 │ 2024-04-10T14:35:17Z │
  └────────────────────────┴────────────────────┴───────────────┴──────────────────────┘
  Shared with you
  ┌───────────────────┬────────────────────┬──────────────────┬──────────────────────┐
  │ Id                │ Name               │ Region Id        │ Created At           │
  ├───────────────────┼────────────────────┼──────────────────┼──────────────────────┤
  │ noisy-fire-212121 │ API                │ aws-eu-central-1 │ 2023-04-22T18:41:13Z │
  └───────────────────┴────────────────────┴──────────────────┴──────────────────────┘
  ```

- List all projects belonging to the specified organization.

  ```bash
  neon projects list --org-id org-xxxx-xxxx
  Projects
  ┌───────────────────────────┬───────────────────────────┬────────────────────┬──────────────────────┐
  │ Id                        │ Name                      │ Region Id          │ Created At           │
  ├───────────────────────────┼───────────────────────────┼────────────────────┼──────────────────────┤
  │ bright-moon-12345678      │ dev-backend-api           │ aws-us-east-2      │ 2024-07-26T11:43:37Z │
  ├───────────────────────────┼───────────────────────────┼────────────────────┼──────────────────────┤
  │ silent-forest-87654321    │ test-integration-service  │ aws-eu-central-1   │ 2024-05-30T22:14:49Z │
  ├───────────────────────────┼───────────────────────────┼────────────────────┼──────────────────────┤
  │ crystal-stream-23456789   │ staging-web-app           │ aws-us-east-2      │ 2024-05-17T13:47:35Z │
  └───────────────────────────┴───────────────────────────┴────────────────────┴──────────────────────┘
  ```

### create

This subcommand allows you to create a Neon project.

The [Neon Free Plan](/docs/introduction/plans#free-plan) supports creating a single project. Paid plans allow multiple projects.

#### Usage

```bash
neon projects create [options]
```

#### Options

In addition to the Neon CLI [global options](/docs/reference/neon-cli#global-options), the `create` subcommand supports these options:

| Option           | Description                                                                                                                                                                                                       | Type    | Required |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | :------: |
| `--context-file` | [Context file](/docs/reference/cli-set-context#using-a-named-context-file) path and file name.                                                                                                                    | string  |          |
| `--name`         | The project name. The project ID is used if a name is not specified.                                                                                                                                              | string  |          |
| `--region-id`    | The region ID. Possible values: `aws-us-west-2`, `aws-ap-southeast-1`, `aws-ap-southeast-2`, `aws-eu-central-1`, `aws-us-east-1`, `aws-us-east-2`, `azure-eastus2`. Defaults to `aws-us-east-2` if not specified. | string  |          |
| `--org-id`       | The organization ID where you want this project to be created. If unspecified, the project is created in your personal account.                                                                                   | string  |          |
| `--psql`         | Connect to your new project's database via `psql` immediately on project creation.                                                                                                                                | boolean |          |
| `--database`     | The database name. If not specified, the default database name will be used.                                                                                                                                      | string  |          |
| `--role`         | The role name. If not specified, the default role name will be used.                                                                                                                                              | string  |          |
| `--set-context`  | Set the current context to the new project.                                                                                                                                                                       | boolean |          |
| `--cu`           | The compute size for the default branch's primary compute. Could be a fixed size (e.g., "2") or a range delimited by a dash (e.g., "0.5-3").                                                                      | string  |          |

#### Examples

- Create a project with a user-defined name in a specific region:

  ```bash
  neon projects create --name mynewproject --region-id aws-us-west-2
  ┌───────────────────┬──────────────┬───────────────┬──────────────────────┐
  │ Id                │ Name         │ Region Id     │ Created At           │
  ├───────────────────┼──────────────┼───────────────┼──────────────────────┤
  │ muddy-wood-859533 │ mynewproject │ aws-us-west-2 │ 2023-07-09T17:04:29Z │
  └───────────────────┴──────────────┴───────────────┴──────────────────────┘

  ┌──────────────────────────────────────────────────────────────────────────────────────┐
  │ Connection Uri                                                                       │
  ├──────────────────────────────────────────────────────────────────────────────────────┤
  │ postgresql://[user]:[password]@[neon_hostname]/[dbname]                              │
  └──────────────────────────────────────────────────────────────────────────────────────┘
  ```

    <Admonition type="tip">
    The Neon CLI provides a `neon connection-string` command you can use to extract a connection uri programmatically. See [Neon CLI commands — connection-string](https://neon.tech/docs/reference/cli-connection-string).
    </Admonition>

- Create a project with the `--output` format of the command set to `json`. This output format returns all of the project response data, whereas the default `table` output format (shown in the preceding example) is limited in the information it can display.

  ```bash
  neon projects create --output json
  ```

    <details>
    <summary>Example output</summary>
    ```json
    {
    "project": {
        "data_storage_bytes_hour": 0,
        "data_transfer_bytes": 0,
        "written_data_bytes": 0,
        "compute_time_seconds": 0,
        "active_time_seconds": 0,
        "cpu_used_sec": 0,
        "id": "long-wind-77910944",
        "platform_id": "aws",
        "region_id": "aws-us-east-2",
        "name": "long-wind-77910944",
        "provisioner": "k8s-pod",
        "default_endpoint_settings": {
        "autoscaling_limit_min_cu": 1,
        "autoscaling_limit_max_cu": 1,
        "suspend_timeout_seconds": 0
        },
        "pg_version": 15,
        "proxy_host": "us-east-2.aws.neon.tech",
        "branch_logical_size_limit": 204800,
        "branch_logical_size_limit_bytes": 214748364800,
        "store_passwords": true,
        "creation_source": "neonctl",
        "history_retention_seconds": 604800,
        "created_at": "2023-08-04T16:16:45Z",
        "updated_at": "2023-08-04T16:16:45Z",
        "consumption_period_start": "0001-01-01T00:00:00Z",
        "consumption_period_end": "0001-01-01T00:00:00Z",
        "owner_id": "e56ad68e-7f2f-4d74-928c-9ea25d7e9864"
    },
    "connection_uris": [
        {
        "connection_uri": "postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname",
        "connection_parameters": {
            "database": "dbname",
            "password": "AbC123dEf",
            "role": "alex",
            "host": "ep-cool-darkness-123456.us-east-2.aws.neon.tech",
            "pooler_host": "ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech"
        }
        }
    ]
    }
    ```
    </details>

- Create a project and connect to it with `psql`.

  ```bash
  neon project create --psql
  ```

- Create a project, connect to it with `psql`, and run an `.sql` file.

  ```bash
  neon project create --psql -- -f dump.sql
  ```

- Create a project, connect to it with `psql`, and run a query.

  ```bash
  neon project create --psql -- -c "SELECT version()"
  ```

- Create a project and set the Neon CLI project context.

  ```
  neon project create --psql --set-context
  ```

### update

This subcommand allows you to update a Neon project.

#### Usage

```bash
neon projects update <id> [options]
```

The `id` is the project ID, which you can obtain by listing your projects or from the **Project settings** page in the Neon Console.

#### Options

In addition to the Neon CLI [global options](/docs/reference/neon-cli#global-options), the `update` subcommand supports this option:

| Option           | Description                                                                                   | Type   | Required |
| ---------------- | --------------------------------------------------------------------------------------------- | ------ | :------: |
| `--context-file` | [Context file](/docs/reference/cli-set-context#using-a-named-context-file) path and file name | string |          |
| `--name`         | The project name. The value cannot be empty.                                                  | string | &check;  |

#### Examples

Update the project name:

```bash
neon projects update muddy-wood-859533 --name dev_project_1
┌───────────────────┬───────────────┬───────────────┬──────────────────────┐
│ Id                │ Name          │ Region Id     │ Created At           │
├───────────────────┼───────────────┼───────────────┼──────────────────────┤
│ muddy-wood-859533 │ dev_project_1 │ aws-us-west-2 │ 2023-07-09T17:04:29Z │
└───────────────────┴───────────────┴───────────────┴──────────────────────┘
```

### delete

This subcommand allows you to delete a Neon project.

```bash
neon projects delete <id> [options]
```

The `id` is the project ID, which you can obtain by listing your projects or from the **Project settings** page in the Neon Console.

#### Options

Only [global options](/docs/reference/neon-cli#global-options) apply.

#### Example

```bash
neon projects delete muddy-wood-859533
┌───────────────────┬───────────────┬───────────────┬──────────────────────┐
│ Id                │ Name          │ Region Id     │ Created At           │
├───────────────────┼───────────────┼───────────────┼──────────────────────┤
│ muddy-wood-859533 │ dev_project_1 │ aws-us-west-2 │ 2023-07-09T17:04:29Z │
└───────────────────┴───────────────┴───────────────┴──────────────────────┘
```

Information about the deleted project is displayed. You can verify that the project was deleted by running `neon projects list`.

### get

This subcommand allows you to retrieve details about a Neon project.

#### Usage

```bash
neon projects get <id> [options]
```

The `id` is the project ID, which you can obtain by listing your projects or from the **Project settings** page in the Neon Console.

#### Options

In addition to the Neon CLI [global options](/docs/reference/neon-cli#global-options), the `delete` subcommand supports this option:

| Option           | Description                                                                                    | Type   | Required |
| ---------------- | ---------------------------------------------------------------------------------------------- | ------ | :------: |
| `--context-file` | [Context file](/docs/reference/cli-set-context#using-a-named-context-file) path and file name. | string |          |

#### Example

```bash
neon projects get muddy-wood-859533
┌───────────────────┬───────────────┬───────────────┬──────────────────────┐
│ Id                │ Name          │ Region Id     │ Created At           │
├───────────────────┼───────────────┼───────────────┼──────────────────────┤
│ muddy-wood-859533 │ dev_project_1 │ aws-us-west-2 │ 2023-07-09T17:04:29Z │
└───────────────────┴───────────────┴───────────────┴──────────────────────┘
```

<NeedHelp/>
