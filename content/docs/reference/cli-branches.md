---
title: Neon CLI commands — branches
subtitle: Use the Neon CLI to manage Neon projects directly from your terminal
enableTableOfContents: true
isDraft: true
---

## Before you begin

- Ensure that you have [installed the Neon CLI](/docs/reference/neon-cli#install-the-neon-cli).
- If you have not authenticated with the [neonctl auth](/docs/reference/cli-auth) command, running a Neon CLI command automatically launches the Neon CLI browser authentication process. Alternatively, you can specify a Neon API key using the `--api-key` option when running a command. See [Connect](/docs/reference/neon-cli#connect).

## The `branches` command

The `branches` command allows you to list, create, update, delete, and retrieve information about branches in your Neon project.

### Usage

```bash
neonctl branches <subcommand> [options]
```

| Subcommand  | Description      |
|---------|------------------|
| [list](#list)    | List branches    |
| [create](#create)  | Create a branch |
| [rename](#rename)   | Rename a branch |
| [delete>](#delete)  | Delete a branch |
| [get>](#get)     | Get a branch    |

### list

This subcommand allows you to list branches in a Neon project.

#### Usage

```bash
neonctl branches list [options]
```

#### Options

In addition to the Neon CLI [global options](/docs/reference/neon-cli/global-options), the `list` subcommand supports this option:

| Option       | Description   | Type   | Required  |
| ------------ | ------------- | ------ | :------: |
| `--project-id` | Project ID    | string | Only if your Neon account has more than one project |

#### Examples

- List branches with the default Neon CLI output format, which is `table`. The information provided with the `table` output format is limited compared to other formats, such as `json`.

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
    ```

### create

This subcommand allows you to create a branch in a Neon project.

#### Usage

```bash
neonctl branches create [options]
```

#### Options

In addition to the Neon CLI [global options](../neon-cli/global-options), the `create` subcommand supports these options:

| Option    | Description                                                    | Type    |   Required  |
| :-------- | :------------------------------------------------------------- | :------ | :---------: |
| `--project-id` | Project ID    | string | Only if your Neon account has more than one project |
| `--name`    | The branch name                                                | string  |             |
| `--parent`  | Parent branch name or id or timestamp or LSN. Defaults to the primary branch | string  |             |
| `--endpoint`| Create a branch with or without an endpoint. By default, the branch is created with a read-write endpoint. The default value is `true`. To create a branch without an endpoint, use `--no-endpoint` | boolean |    |
| `--readonly`| Create a read-only branch (a branch with a read-only compute endpoint is also referred to as a read replica)                                     | boolean |             |


#### Examples

- Create a branch:

```bash
neonctl branches createbranch
┌───────────────────────────┬───────────────────────────┬──────────────────────┬──────────────────────┐
│ Id                        │ Name                      │ Created At           │ Updated At           │
├───────────────────────────┼───────────────────────────┼──────────────────────┼──────────────────────┤
│ br-tight-waterfall-174832 │ br-tight-waterfall-174832 │ 2023-07-09T20:42:18Z │ 2023-07-09T20:42:18Z │
└───────────────────────────┴───────────────────────────┴──────────────────────┴──────────────────────┘

endpoints

┌─────────────────────┬──────────────────────┐
│ Id                  │ Created At           │
├─────────────────────┼──────────────────────┤
│ ep-cold-star-253608 │ 2023-07-09T20:42:18Z │
└─────────────────────┴──────────────────────┘

connection_uris

┌───────────────────────────────────────────────────────────────────────────────────┐
│ Connection Uri                                                                    │
├───────────────────────────────────────────────────────────────────────────────────┤
│ postgres://daniel:<password>@ep-cold-star-253608.us-east-2.aws.neon.tech/neondb   │
└───────────────────────────────────────────────────────────────────────────────────┘
```

- Create a branch with a user-defined name:

```bash
neonctl branches create --name mybranch
```

- Create a branch with a read-only compute endpoint (a read replica)

```bash
neonctl branches create --name my_read_replica_branch --readonly
```

- Create a branch from a parent branch other than your `main` branch

```bash
neonctl branches create --name my_child_branch --parent mybranch
```

### rename

This subcommand allows you to update a branch in a Neon project.

#### Usage

```bash
neonctl branches rename <id|name> <new-name> [options]
```

`<id|name>` refers to the Branch ID and branch name. You can specify one or the other.

#### Options

In addition to the Neon CLI [global options](../neon-cli/global-options), the `updaterename` subcommand supports this option:

| Option        | Description | Type   | Required  |
| ------------- | ----------- | ------ | :-----: |
| --project-id  | Project ID  | string | Only if your Neon account has more than one project |

#### Example

```bash
neonctl branches rename mybranch teambranch
┌───────────────────────┬────────────┬──────────────────────┬──────────────────────┐
│ Id                    │ Name       │ Created At           │ Updated At           │
├───────────────────────┼────────────┼──────────────────────┼──────────────────────┤
│ br-rough-sound-590393 │ teambranch │ 2023-07-09T20:46:58Z │ 2023-07-09T21:02:27Z │
└───────────────────────┴────────────┴──────────────────────┴──────────────────────┘
```

### delete

This subcommand allows you to delete a branch in a Neon project.

#### Usage

```bash
neonctl branches delete <id|name> [options]
```

`<id|name>` refers to the Branch ID and branch name. You can specify one or the other.

#### Options

In addition to the Neon CLI [global options](../neon-cli/global-options), the `delete` subcommand supports these options:

| Option        | Description | Type   | Required  |
| ------------- | ----------- | ------ | :------: |
| --project-id  | Project ID  | string | Only if your Neon account has more than one project |

#### Example

```bash
neonctl branches delete br-rough-sky-158193
┌─────────────────────┬─────────────────┬──────────────────────┬──────────────────────┐
│ Id                  │ Name            │ Created At           │ Updated At           │
├─────────────────────┼─────────────────┼──────────────────────┼──────────────────────┤
│ br-rough-sky-158193 │ my_child_branch │ 2023-07-09T20:57:39Z │ 2023-07-09T21:06:41Z │
└─────────────────────┴─────────────────┴──────────────────────┴──────────────────────┘
```

### get

This subcommand allows you to retrieve details about a branch.

#### Usage

```bash
neonctl branches get <id|name> [options]
```

#### Options

In addition to the Neon CLI [global options](../neon-cli/global-options), the `get` subcommand supports this option:

#### Options

| Option        | Description | Type   | Required |
| ------------- | ----------- | ------ | :------: |
| --project-id  | Project ID  | string | Only if your Neon account has more than one project |

#### Example

<CodeBlock shouldWrap>

```bash
neonctl branches get main
┌────────────────────────┬──────┬──────────────────────┬──────────────────────┐
│ Id                     │ Name │ Created At           │ Updated At           │
├────────────────────────┼──────┼──────────────────────┼──────────────────────┤
│ br-small-meadow-878874 │ main │ 2023-07-06T13:15:12Z │ 2023-07-06T13:32:37Z │
└────────────────────────┴──────┴──────────────────────┴──────────────────────┘
```

</CodeBlock>

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
