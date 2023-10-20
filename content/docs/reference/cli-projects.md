---
title: Neon CLI commands — projects
subtitle: Use the Neon CLI to manage Neon directly from the terminal
enableTableOfContents: true
updatedOn: '2023-10-20T14:08:54.561Z'
---

## Before you begin

- Before running the `projects` command, ensure that you have [installed the Neon CLI](/docs/reference/neon-cli#install-the-neon-cli).
- If you have not authenticated with the [neonctl auth](/docs/reference/cli-auth) command, running a Neon CLI command automatically launches the Neon CLI browser authentication process. Alternatively, you can specify a Neon API key using the `--api-key` option when running a command. See [Connect](/docs/reference/neon-cli#connect).

For information about projects in Neon, see [Projects](/docs/manage/projects).

## The `projects` command

The `projects` command allows you to list, create, update, delete, and retrieve information about Neon projects.

### Usage

```bash
neonctl projects <subcommand> [options]
```

| Subcommand  | Description      |
|---------|------------------|
| [list](#list)    | List projects    |
| [create](#create)  | Create a project |
| [update](#update)  | Update a project |
| [delete](#delete)  | Delete a project |
| [get](#get)     | Get a project    |

### list

This subcommand allows you to list projects that belong to your Neon account.

#### Usage

```bash
neonctl projects list [options]
```

#### Options

Only [global options](/docs/reference/neon-cli#global-options) apply.

#### Example

```bash
neonctl projects list
┌────────────────────────┬────────────────────────┬───────────────┬──────────────────────┐
│ Id                     │ Name                   │ Region Id     │ Created At           │
├────────────────────────┼────────────────────────┼───────────────┼──────────────────────┤
│ late-rain-471577       │ late-rain-471577       │ aws-us-west-2 │ 2023-05-17T17:26:07Z │
├────────────────────────┼────────────────────────┼───────────────┼──────────────────────┤
│ tight-wave-371442      │ tight-wave-371442      │ aws-us-east-2 │ 2023-05-15T12:33:39Z │
├────────────────────────┼────────────────────────┼───────────────┼──────────────────────┤
│ lingering-brook-802958 │ lingering-brook-802958 │ aws-us-east-2 │ 2023-05-11T12:25:22Z │
└────────────────────────┴────────────────────────┴───────────────┴──────────────────────┘
```

### create

This subcommand allows you to create a Neon project.

The [Neon Free Tier](../introduction/free-tier) supports creating a single project. The [Neon Pro plan](../introduction/pro-plan) allows creating multiple projects.

#### Usage

```bash
neonctl projects create [options]
```

#### Options

In addition to the Neon CLI [global options](/docs/reference/neon-cli#global-options), the `create` subcommand supports these options:

| Option                                | Description                                                                                               | Type    | Required                               |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------- | :-----------------------------------: |
| `--name` | The project name. The project ID is used if a name is not specified.               | string  |                                       |
| `--region-id` | The region ID. Possible values: `aws-us-west-2`, `aws-ap-southeast-1`, `aws-eu-central-1`, `aws-us-east-2`, `aws-us-east-1`. Defaults to `aws-us-east-2` if not specified. | string number  |                                       |

#### Examples

- Create a project with a user-defined name in a specific region:

    ```bash
    neonctl projects create --name mynewproject --region-id aws-us-west-2
    ┌───────────────────┬──────────────┬───────────────┬──────────────────────┐
    │ Id                │ Name         │ Region Id     │ Created At           │
    ├───────────────────┼──────────────┼───────────────┼──────────────────────┤
    │ muddy-wood-859533 │ mynewproject │ aws-us-west-2 │ 2023-07-09T17:04:29Z │
    └───────────────────┴──────────────┴───────────────┴──────────────────────┘

    ┌──────────────────────────────────────────────────────────────────────────────────────┐
    │ Connection Uri                                                                       │
    ├──────────────────────────────────────────────────────────────────────────────────────┤
    │ postgres://[user]:[password]@[neon_hostname]/[dbname]                                │
    └──────────────────────────────────────────────────────────────────────────────────────┘
    ```

    <Admonition type="tip">
    The Neon CLI provides a `neonctl connection-string` command you can use to extract a connection uri programmatically. See [Neon CLI commands — connection-string](https://neon.tech/docs/reference/cli-connection-string).
    </Admonition>

- Create a project with the `--output` format of the command set to `json`. This output format returns all of the project response data, whereas the default `table` output format (shown in the preceding example) is limited in the information it can display.

    ```bash
    neonctl projects create --output json
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
        "connection_uri": "postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname",
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

### update

This subcommand allows you to update a Neon project.

#### Usage

```bash
neonctl projects update <id> [options]
```

The `id` is the project ID, which you can obtain by listing your projects or from the **Settings** page in the Neon console.

#### Options

In addition to the Neon CLI [global options](/docs/reference/neon-cli#global-options), the `update` subcommand supports this option:

| Option                                | Description                                                                                               | Type    | Required                               |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------- | :-----------------------------------: |
| `--name` | The project name. The value cannot be empty.               | string  |             &check;                          |

#### Example

```bash
neonctl projects update muddy-wood-859533 --name dev_project_1
┌───────────────────┬───────────────┬───────────────┬──────────────────────┐
│ Id                │ Name          │ Region Id     │ Created At           │
├───────────────────┼───────────────┼───────────────┼──────────────────────┤
│ muddy-wood-859533 │ dev_project_1 │ aws-us-west-2 │ 2023-07-09T17:04:29Z │
└───────────────────┴───────────────┴───────────────┴──────────────────────┘
```

### delete

This subcommand allows you to delete a Neon project.

```bash
neonctl projects delete <id> [options]
```

The `id` is the project ID, which you can obtain by listing your projects or from the **Settings** page in the Neon console.

#### Options

Only [global options](/docs/reference/neon-cli#global-options) apply.

#### Example

```bash
neonctl projects delete muddy-wood-859533
┌───────────────────┬───────────────┬───────────────┬──────────────────────┐
│ Id                │ Name          │ Region Id     │ Created At           │
├───────────────────┼───────────────┼───────────────┼──────────────────────┤
│ muddy-wood-859533 │ dev_project_1 │ aws-us-west-2 │ 2023-07-09T17:04:29Z │
└───────────────────┴───────────────┴───────────────┴──────────────────────┘
```

Information about the deleted project is displayed. You can verify that the project was deleted by running `neonctl projects list`.

### get

This subcommand allows you to retrieve details about a Neon project.

#### Usage

```bash
neonctl projects get <id> [options]
```

The `id` is the project ID, which you can obtain by listing your projects or from the **Settings** page in the Neon console.

#### Options

Only [global options](/docs/reference/neon-cli#global-options) apply.

#### Example

```bash
neonctl projects get muddy-wood-859533
┌───────────────────┬───────────────┬───────────────┬──────────────────────┐
│ Id                │ Name          │ Region Id     │ Created At           │
├───────────────────┼───────────────┼───────────────┼──────────────────────┤
│ muddy-wood-859533 │ dev_project_1 │ aws-us-west-2 │ 2023-07-09T17:04:29Z │
└───────────────────┴───────────────┴───────────────┴──────────────────────┘
```

## Need help?

Join the [Neon community forum](https://community.neon.tech/) to ask questions or see what others are doing with Neon. [Neon Pro Plan](/docs/introduction/pro-plan) users can open a support ticket from the console. For more detail, see [Getting Support](/docs/introduction/support).
