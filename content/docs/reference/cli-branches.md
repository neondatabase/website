---
title: Neon CLI commands — branches
subtitle: Use the Neon CLI to manage Neon directly from the terminal
enableTableOfContents: true
updatedOn: '2024-02-21T19:34:16.276Z'
---

## Before you begin

- Before running the `branches` command, ensure that you have [installed the Neon CLI](/docs/reference/cli-install).
- If you have not authenticated with the [neonctl auth](/docs/reference/cli-auth) command, running a Neon CLI command automatically launches the Neon CLI browser authentication process. Alternatively, you can specify a Neon API key using the `--api-key` option when running a command. See [Connect](/docs/reference/neon-cli#connect).

## The `branches` command

The `branches` command allows you to list, create, rename, delete, and retrieve information about branches in your Neon project. It also permits setting a branch as the primary branch and adding a compute endpoint to a branch. You can create a [read replica](/docs/introduction/read-replicas) by adding a read-only compute endpoint.

## Usage

```bash
neonctl branches <subcommand> [options]
```

| Subcommand                  | Description                                  |
| --------------------------- | -------------------------------------------- |
| [list](#list)               | List branches                                |
| [create](#create)           | Create a branch                              |
| [reset](#reset)             | Reset data to parent                         |
| [restore](#restore)         | Restore a branch to a selected point in time |
| [rename](#rename)           | Rename a branch                              |
| [set-primary](#set-primary) | Set a primary branch                         |
| [add-compute](#add-compute) | Add replica to a branch                      |
| [delete](#delete)           | Delete a branch                              |
| [get](#get)                 | Get a branch                                 |

## list

This subcommand allows you to list branches in a Neon project.

#### Usage

```bash
neonctl branches list [options]
```

#### Options

In addition to the Neon CLI [global options](/docs/reference/neon-cli#global-options), the `list` subcommand supports these options:

| Option           | Description                                                                                   | Type   |                      Required                       |
| ---------------- | --------------------------------------------------------------------------------------------- | ------ | :-------------------------------------------------: |
| `--context-file` | [Context file](/docs/reference/cli-set-context#using-a-named-context-file) path and file name | string |                                                     |
| `--project-id`   | Project ID                                                                                    | string | Only if your Neon account has more than one project |

#### Examples

- List branches with the default `table` output format. The information provided with this output format is limited compared to other formats, such as `json`.

  ```bash
  neonctl branches list --project-id solitary-leaf-288182
  ┌────────────────────────┬──────────┬──────────────────────┬──────────────────────┐
  │ Id                     │ Name     │ Created At           │ Updated At           │
  ├────────────────────────┼──────────┼──────────────────────┼──────────────────────┤
  │ br-small-meadow-878874 │ main     │ 2023-07-06T13:15:12Z │ 2023-07-06T14:26:32Z │
  ├────────────────────────┼──────────┼──────────────────────┼──────────────────────┤
  │ br-round-queen-335380  │ mybranch │ 2023-07-06T14:45:50Z │ 2023-07-06T14:45:50Z │
  └────────────────────────┴──────────┴──────────────────────┴──────────────────────┘
  ```

- List branches with the `json` output format. This format provides more information than the default `table` output format.

  ```bash
  neonctl branches list --project-id solitary-leaf-288182 --output json
  [
  {
      "id": "br-wild-boat-648259",
      "project_id": "solitary-leaf-288182",
      "name": "main",
      "current_state": "ready",
      "logical_size": 29515776,
      "creation_source": "console",
      "primary": true,
      "cpu_used_sec": 78,
      "compute_time_seconds": 78,
      "active_time_seconds": 312,
      "written_data_bytes": 107816,
      "data_transfer_bytes": 0,
      "created_at": "2023-07-09T17:01:34Z",
      "updated_at": "2023-07-09T17:15:13Z"
  },
  {
      "id": "br-shy-cake-201321",
      "project_id": "solitary-leaf-288182",
      "parent_id": "br-wild-boat-648259",
      "parent_lsn": "0/1E88838",
      "name": "mybranch",
      "current_state": "ready",
      "creation_source": "console",
      "primary": false,
      "cpu_used_sec": 0,
      "compute_time_seconds": 0,
      "active_time_seconds": 0,
      "written_data_bytes": 0,
      "data_transfer_bytes": 0,
      "created_at": "2023-07-09T17:37:10Z",
      "updated_at": "2023-07-09T17:37:10Z"
  }
  ]
  ```

## create

This subcommand allows you to create a branch in a Neon project.

#### Usage

```bash
neonctl branches create [options]
```

#### Options

In addition to the Neon CLI [global options](/docs/reference/neon-cli#global-options), the `create` subcommand supports these options:

| Option              | Description                                                                                                                                                                                                                                                                    | Type    |                      Required                       |
| :------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------ | :-------------------------------------------------: |
| `--context-file`    | [Context file](/docs/reference/cli-set-context#using-a-named-context-file) path and file name                                                                                                                                                                                  | string  |                                                     |
| `--project-id`      | Project ID                                                                                                                                                                                                                                                                     | string  | Only if your Neon account has more than one project |
| `--name`            | The branch name                                                                                                                                                                                                                                                                | string  |                                                     |
| `--parent`          | Parent branch name, id, timestamp, or LSN. Defaults to the primary branch                                                                                                                                                                                                      | string  |                                                     |
| `--compute`         | Create a branch with or without a compute. By default, the branch is created with a read-write endpoint. The default value is `true`. To create a branch without a compute, use `--no-compute`                                                                                 | boolean |                                                     |
| `--type`            | Type of compute to add. Choices are `read_write` (the default) or `read_only`. A branch with a read-only compute endpoint is also referred to as a [read replica](/docs/introduction/read-replicas).                                                                           | string  |                                                     |
| `--suspend-timeout` | Duration of inactivity in seconds after which the compute endpoint is automatically suspended. The value `0` means use the global default. The value `-1` means never suspend. The default value is `300` seconds (5 minutes). The maximum value is `604800` seconds (1 week). | number  |                                                     |
| `--psql`            | Connect to a new branch via `psql`. `psql` must be installed to use this option.                                                                                                                                                                                               | boolean |                                                     |

#### Examples

- Create a branch:

  ```bash
  neonctl branches create
  ┌─────────────────────────┬─────────────────────────┬─────────┬──────────────────────┬──────────────────────┐
  │ Id                      │ Name                    │ Primary │ Created At           │ Updated At           │
  ├─────────────────────────┼─────────────────────────┼─────────┼──────────────────────┼──────────────────────┤
  │ br-mute-sunset-67218628 │ br-mute-sunset-67218628 │ false   │ 2023-08-03T20:07:27Z │ 2023-08-03T20:07:27Z │
  └─────────────────────────┴─────────────────────────┴─────────┴──────────────────────┴──────────────────────┘
  endpoints
  ┌───────────────────────────┬──────────────────────┐
  │ Id                        │ Created At           │
  ├───────────────────────────┼──────────────────────┤
  │ ep-floral-violet-94096438 │ 2023-08-03T20:07:27Z │
  └───────────────────────────┴──────────────────────┘
  connection_uris
  ┌──────────────────────────────────────────────────────────────────────────────────────────┐
  │ Connection Uri                                                                           │
  ├──────────────────────────────────────────────────────────────────────────────────────────┤
  │ postgres://[user]:[password]@[neon_hostname]/[dbname]                                    │
  └──────────────────────────────────────────────────────────────────────────────────────────┘
  ```

    <Admonition type="tip">
    The Neon CLI provides a `neonctl connection-string` command you can use to extract a connection uri programmatically. See [Neon CLI commands — connection-string](https://neon.tech/docs/reference/cli-connection-string).
    </Admonition>

- Create a branch with the `--output` format of the command set to `json`. This output format returns all of the branch response data, whereas the default `table` output format (shown in the preceding example) is limited in the information it can display.

  ```bash
  neonctl branches create --output json
  ```

    <details>
    <summary>Example output</summary>
    ```json 
    {
    "branch": {
        "id": "br-frosty-art-30264288",
        "project_id": "polished-shape-60485499",
        "parent_id": "br-polished-fire-02083731",
        "parent_lsn": "0/1E887C8",
        "name": "br-frosty-art-30264288",
        "current_state": "init",
        "pending_state": "ready",
        "creation_source": "neonctl",
        "primary": false,
        "cpu_used_sec": 0,
        "compute_time_seconds": 0,
        "active_time_seconds": 0,
        "written_data_bytes": 0,
        "data_transfer_bytes": 0,
        "created_at": "2023-08-03T20:12:24Z",
        "updated_at": "2023-08-03T20:12:24Z"
    },
    "endpoints": [
        {
        "host": "@ep-cool-darkness-123456.us-east-2.aws.neon.tech",
        "id": "@ep-cool-darkness-123456",
        "project_id": "polished-shape-60485499",
        "branch_id": "br-frosty-art-30264288",
        "autoscaling_limit_min_cu": 1,
        "autoscaling_limit_max_cu": 1,
        "region_id": "aws-us-east-2",
        "type": "read_write",
        "current_state": "init",
        "pending_state": "active",
        "settings": {},
        "pooler_enabled": false,
        "pooler_mode": "transaction",
        "disabled": false,
        "passwordless_access": true,
        "creation_source": "neonctl",
        "created_at": "2023-08-03T20:12:24Z",
        "updated_at": "2023-08-03T20:12:24Z",
        "proxy_host": "us-east-2.aws.neon.tech",
        "suspend_timeout_seconds": 0,
        "provisioner": "k8s-pod"
        }
    ],
    "connection_uris": [
        {
        "connection_uri": "postgres://alex:AbC123dEf@@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname",
        "connection_parameters": {
            "database": "dbname",
            "password": "AbC123dEf",
            "role": "alex",
            "host": "@ep-cool-darkness-123456.us-east-2.aws.neon.tech",
            "pooler_host": "@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech"
        }
        }
    ]
    }
    ```
    </details>

- Create a branch with a user-defined name:

  ```bash
  neonctl branches create --name mybranch
  ```

- Create a branch with a read-only compute endpoint (a [read replica](/docs/introduction/read-replicas))

  ```bash
  neonctl branches create --name my_read_replica_branch --type read_only
  ```

- Create a branch from a parent branch other than your `main` branch

  ```bash
  neonctl branches create --name my_child_branch --parent mybranch
  ```

- Create a point-in-time restore branch by specifying the `--parent` option with a timestamp:

  ```bash
  neonctl branches create --name data_recovery --parent 2023-07-11T10:00:00Z
  ```

  The timestamp must be provided in ISO 8601 format. You can use this [timestamp converter](https://www.timestamp-converter.com/). For more information about point-in-time restore, see [Branching — Point-in-time restore (PITR)](/docs/guides/branching-pitr).

- Create a branch and connect to it with `psql`.

  ```bash
  neonctl branch create --psql
  ```

- Create a branch, connect to it with `psql`, and run an `.sql` file.

  ```bash
  neonctl branch create --psql -- -f dump.sql
  ```

- Create a branch, connect to it with `psql`, and run a query.

  ```bash
  neonctl branch create --psql -- -c "SELECT version()"
  ```

## reset

This command resets a child branch to the latest data from its parent.

#### Usage

```bash
neonctl branches reset <id|name> --parent
```

`<id|name>` refers to the branch ID or branch name. You can use either one for this operation.

`--parent` specifies the type of reset operation. Currently, Neon only supports reset from parent. This parameter is required for the operation to work. In the future, Neon might add support for other reset types: for example, rewinding a branch to an earlier period in time.

#### Options

In addition to the Neon CLI [global options](/docs/reference/neon-cli#global-options), the `reset` subcommand supports these options:

| Option                  | Description                                                                                   | Type    |                                 Required                                  |
| ----------------------- | --------------------------------------------------------------------------------------------- | ------- | :-----------------------------------------------------------------------: |
| `--context-file`        | [Context file](/docs/reference/cli-set-context#using-a-named-context-file) path and file name | string  |                                                                           |
| `--project-id`          | Project ID                                                                                    | string  | Only if your Neon account has more than one project or context is not set |
| `--parent`              | Reset to a parent branch                                                                      | boolean |                                                                           |
| `--preserve-under-name` | The name under which to preserve the old branch                                               | string  |                                                                           |

#### Example

```bash
neonctl branches reset dev/alex --parent
┌──────────────────────┬──────────┬─────────┬──────────────────────┬──────────────────────┐
│ Id                   │ Name     │ Primary │ Created At           │ Last Reset At        │
├──────────────────────┼──────────┼─────────┼──────────────────────┼──────────────────────┤
│ br-aged-sun-a5qowy01 │ dev/alex │ false   │ 2024-05-07T09:31:59Z │ 2024-05-07T09:36:32Z │
└──────────────────────┴──────────┴─────────┴──────────────────────┴──────────────────────┘
```

## restore

This command restores a branch to a specified point in time in its own or another branch's history.

#### Usage

```bash
neonctl branches restore <target-id|name> <source>[@(timestamp|lsn)]
```

`<target-id|name>` specifies the ID or name of the branch that you want to restore.

`<source>` specifies the source branch you want to restore from. Options are:

- `^self` &#8212; restores the selected branch to an earlier point in its own history. You must select a timestamp or LSN for this option (restoring to head is not an option). You also need to include a name for the backup branch using the parameter `preserve-under-name`.
- `^parent` &#8212; restores the target branch to its parent. By default the target is restored the latest (head) of its parent. Append `@timestamp` or `@lsn` to restore to an earlier point in the parent's history.
- `source branch ID` or `source branch name` &#8212; restores the target branch to the selected source branch. It restores the latest (head) by default. Append `@timestamp` or `@lsn` to restore to an earlier point in the source branch's history.

#### Options

In addition to the Neon CLI global options, the `restore` subcommand supports these options:

| Option                  | Description                                 | Type   |                                 Required                                  |
| ----------------------- | ------------------------------------------- | ------ | :-----------------------------------------------------------------------: |
| `--context-file`        | Context file path and file name             | string |                                                                           |
| `--project-id`          | Project ID                                  | string | Only if your Neon account has more than one project or context is not set |
| `--preserve-under-name` | Name for the backup created during restore. | string |                         When restoring to `^self`                         |

#### Examples

Examples of the different kinds of restore operations you can do:

- [Restoring a branch to an earlier point in its history](#restoring-a-branch-to-an-earlier-point-in-its-own-history-with-backup)
- [Restoring to another branch's head](#restoring-a-branch-target-to-the-head-of-another-branch-source)
- [Restoring a branch to its parent](#restoring-a-branch-to-its-parent-at-an-earlier-point-in-time)

#### Restoring a branch to an earlier point in its own history (with backup)

This command restores the branch `main` to an earlier timestamp, saving to a backup branch called `main_restore_backup_2024-02-20`

```bash shouldWrap
neonctl branches restore main ^self@2024-05-06T10:00:00.000Z --preserve-under-name main_restore_backup_2024-05-06
```

Results of the operation:

```bash shouldWrap
INFO: Restoring branch br-purple-dust-a5hok5mk to the branch br-purple-dust-a5hok5mk timestamp 2024-05-06T10:00:00.000Z
Restored branch
┌─────────────────────────┬──────┬──────────────────────┐
│ Id                      │ Name │ Last Reset At        │
├─────────────────────────┼──────┼──────────────────────┤
│ br-purple-dust-a5hok5mk │ main │ 2024-05-07T09:45:21Z │
└─────────────────────────┴──────┴──────────────────────┘
Backup branch
┌─────────────────────────┬────────────────────────────────┐
│ Id                      │ Name                           │
├─────────────────────────┼────────────────────────────────┤
│ br-flat-forest-a5z016gm │ main_restore_backup_2024-05-06 │
└─────────────────────────┴────────────────────────────────┘
```

#### Restoring a branch (target) to the head of another branch (source)

This command restores the target branch `dev/alex` to latest data (head) from the source branch `main`.

```bash shouldWrap
neonctl branches restore dev/alex main
```

Results of the operation:

```bash shouldWrap
INFO: Restoring branch br-restless-frost-69810125 to the branch br-curly-bar-82389180 head
Restored branch
┌────────────────────────────┬──────────┬──────────────────────┐
│ Id                         │ Name     │ Last Reset At        │
├────────────────────────────┼──────────┼──────────────────────┤
│ br-restless-frost-69810125 │ dev/alex │ 2024-02-21T15:42:34Z │
└────────────────────────────┴──────────┴──────────────────────┘
```

#### Restoring a branch to its parent at an earlier point in time

This command restores the branch `dev/alex` to a selected point in time from its parent branch.

```bash shouldWrap
neonctl branches restore dev/alex ^parent@2024-02-21T10:30:00.000Z
```

Results of the operation:

```bash shouldWrap
INFO: Restoring branch br-restless-frost-69810125 to the branch br-patient-union-a5s838zf timestamp 2024-02-21T10:30:00.000Z
Restored branch
┌────────────────────────────┬──────────┬──────────────────────┐
│ Id                         │ Name     │ Last Reset At        │
├────────────────────────────┼──────────┼──────────────────────┤
│ br-restless-frost-69810125 │ dev/alex │ 2024-02-21T15:55:04Z │
└────────────────────────────┴──────────┴──────────────────────┘
```

## rename

This subcommand allows you to update a branch in a Neon project.

#### Usage

```bash
neonctl branches rename <id|name> <new-name> [options]
```

`<id|name>` refers to the Branch ID and branch name. You can specify one or the other.

#### Options

In addition to the Neon CLI [global options](/docs/reference/neon-cli#global-options), the `rename` subcommand supports these options:

| Option           | Description                                                                                   | Type   |                      Required                       |
| ---------------- | --------------------------------------------------------------------------------------------- | ------ | :-------------------------------------------------: |
| `--context-file` | [Context file](/docs/reference/cli-set-context#using-a-named-context-file) path and file name | string |                                                     |
| `--project-id`   | Project ID                                                                                    | string | Only if your Neon account has more than one project |

#### Example

```bash
neonctl branches rename mybranch teambranch
┌───────────────────────┬────────────┬──────────────────────┬──────────────────────┐
│ Id                    │ Name       │ Created At           │ Updated At           │
├───────────────────────┼────────────┼──────────────────────┼──────────────────────┤
│ br-rough-sound-590393 │ teambranch │ 2023-07-09T20:46:58Z │ 2023-07-09T21:02:27Z │
└───────────────────────┴────────────┴──────────────────────┴──────────────────────┘
```

## set-primary

This subcommand allows you to set a branch as the primary branch in your Neon project.

#### Usage

```bash
neonctl branches set-primary <id|name> [options]
```

`<id|name>` refers to the Branch ID and branch name. You can specify one or the other.

#### Options

In addition to the Neon CLI [global options](/docs/reference/neon-cli#global-options), the `set-primary` subcommand supports this option:

| Option           | Description                                                                                   | Type   |                      Required                       |
| ---------------- | --------------------------------------------------------------------------------------------- | ------ | :-------------------------------------------------: |
| `--context-file` | [Context file](/docs/reference/cli-set-context#using-a-named-context-file) path and file name | string |                                                     |
| `--project-id`   | Project ID                                                                                    | string | Only if your Neon account has more than one project |

#### Example

```bash
neonctl branches set-primary mybranch
┌────────────────────┬──────────┬─────────┬──────────────────────┬──────────────────────┐
│ Id                 │ Name     │ Primary │ Created At           │ Updated At           │
├────────────────────┼──────────┼─────────┼──────────────────────┼──────────────────────┤
│ br-odd-frog-703504 │ mybranch │ true    │ 2023-07-11T12:22:12Z │ 2023-07-11T12:22:59Z │
└────────────────────┴──────────┴─────────┴──────────────────────┴──────────────────────┘
```

## add-compute

This subcommand allows you to add a compute endpoint to an existing branch in your Neon project.

#### Usage

```bash
neonctl branches add-compute <id|name>
```

`<id|name>` refers to the Branch ID and branch name. You can specify one or the other.

#### Options

In addition to the Neon CLI [global options](/docs/reference/neon-cli#global-options), the `add-compute` subcommand supports these options:

| Option           | Description                                                                                                                                                                                                                                                                          | Type   |                      Required                       |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ | :-------------------------------------------------: |
| `--context-file` | [Context file](/docs/reference/cli-set-context#using-a-named-context-file) path and file name                                                                                                                                                                                        | string |                                                     |
| `--project-id`   | Project ID                                                                                                                                                                                                                                                                           | string | Only if your Neon account has more than one project |
| `--type`         | Type of compute to add. Choices are `read_only` (the default) or `read_write`. A branch with a read-only compute endpoint is also referred to as a [read replica](/docs/introduction/read-replicas). A branch can have a single read-write and multiple read-only compute endpoints. | string |                                                     |

#### Example

```bash
neonctl branches add-compute mybranch --type read_only
┌─────────────────────┬──────────────────────────────────────────────────┐
│ Id                  │ Host                                             │
├─────────────────────┼──────────────────────────────────────────────────┤
│ ep-rough-lab-865061 │ ep-rough-lab-865061.ap-southeast-1.aws.neon.tech │
└─────────────────────┴──────────────────────────────────────────────────┘
```

## delete

This subcommand allows you to delete a branch in a Neon project.

#### Usage

```bash
neonctl branches delete <id|name> [options]
```

`<id|name>` refers to the Branch ID and branch name. You can specify one or the other.

#### Options

In addition to the Neon CLI [global options](/docs/reference/neon-cli#global-options), the `delete` subcommand supports this option:

| Option           | Description                                                                                   | Type   |                      Required                       |
| ---------------- | --------------------------------------------------------------------------------------------- | ------ | :-------------------------------------------------: |
| `--context-file` | [Context file](/docs/reference/cli-set-context#using-a-named-context-file) path and file name | string |                                                     |
| `--project-id`   | Project ID                                                                                    | string | Only if your Neon account has more than one project |

#### Example

```bash
neonctl branches delete br-rough-sky-158193
┌─────────────────────┬─────────────────┬──────────────────────┬──────────────────────┐
│ Id                  │ Name            │ Created At           │ Updated At           │
├─────────────────────┼─────────────────┼──────────────────────┼──────────────────────┤
│ br-rough-sky-158193 │ my_child_branch │ 2023-07-09T20:57:39Z │ 2023-07-09T21:06:41Z │
└─────────────────────┴─────────────────┴──────────────────────┴──────────────────────┘
```

## get

This subcommand allows you to retrieve details about a branch.

#### Usage

```bash
neonctl branches get <id|name> [options]
```

#### Options

In addition to the Neon CLI [global options](/docs/reference/neon-cli#global-options), the `get` subcommand supports this option:

#### Options

| Option           | Description                                                                                   | Type   |                      Required                       |
| ---------------- | --------------------------------------------------------------------------------------------- | ------ | :-------------------------------------------------: |
| `--context-file` | [Context file](/docs/reference/cli-set-context#using-a-named-context-file) path and file name | string |                                                     |
| `--project-id`   | Project ID                                                                                    | string | Only if your Neon account has more than one project |

#### Examples

```bash
neonctl branches get main
┌────────────────────────┬──────┬──────────────────────┬──────────────────────┐
│ Id                     │ Name │ Created At           │ Updated At           │
├────────────────────────┼──────┼──────────────────────┼──────────────────────┤
│ br-small-meadow-878874 │ main │ 2023-07-06T13:15:12Z │ 2023-07-06T13:32:37Z │
└────────────────────────┴──────┴──────────────────────┴──────────────────────┘
```

A `get` example with the `--output` format option set to `json`:

```bash
neonctl branches get main --output json
{
  "id": "br-lingering-bread-896475",
  "project_id": "noisy-rain-039137",
  "name": "main",
  "current_state": "ready",
  "logical_size": 29769728,
  "creation_source": "console",
  "primary": false,
  "cpu_used_sec": 522,
  "compute_time_seconds": 522,
  "active_time_seconds": 2088,
  "written_data_bytes": 174433,
  "data_transfer_bytes": 20715,
  "created_at": "2023-06-28T10:17:28Z",
  "updated_at": "2023-07-11T12:22:59Z"
```

<NeedHelp/>
