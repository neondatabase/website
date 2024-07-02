---
title: Neon CLI commands — roles
subtitle: Use the Neon CLI to manage Neon directly from the terminal
enableTableOfContents: true
updatedOn: '2024-06-30T14:35:12.897Z'
---

## Before you begin

- Before running the `roles` command, ensure that you have [installed the Neon CLI](/docs/reference/cli-install).
- If you have not authenticated with the [neon auth](/docs/reference/cli-auth) command, running a Neon CLI command automatically launches the Neon CLI browser authentication process. Alternatively, you can specify a Neon API key using the `--api-key` option when running a command. See [Connect](/docs/reference/neon-cli#connect).

For information about roles in Neon, see [Manage roles](/docs/manage/roles).

## The `roles` command

The `roles` command allows you to list, create, and delete roles in a Neon project.

### Usage

```bash
neon roles <subcommand> [options]
```

| Subcommand        | Description   |
| ----------------- | ------------- |
| [list](#list)     | List roles    |
| [create](#create) | Create a role |
| [delete](#delete) | Delete a role |

### list

This subcommand allows you to list roles.

#### Usage

```bash
neon roles list [options]
```

#### Options

In addition to the Neon CLI [global options](/docs/reference/neon-cli#global-options), the `list` subcommand supports these options:

| Option           | Description                                                                                   | Type   |                      Required                       |
| ---------------- | --------------------------------------------------------------------------------------------- | ------ | :-------------------------------------------------: |
| `--context-file` | [Context file](/docs/reference/cli-set-context#using-a-named-context-file) path and file name | string |                                                     |
| `--project-id`   | Project ID                                                                                    | string | Only if your Neon account has more than one project |
| `--branch`       | Branch ID or name                                                                             | string |                                                     |

If a branch ID or name is not provided, the command lists roles for the default branch of the project.

#### Examples

```bash
neon roles list
┌────────┬──────────────────────┐
│ Name   │ Created At           │
├────────┼──────────────────────┤
│ daniel │ 2023-06-19T18:27:19Z │
└────────┴──────────────────────┘
```

List roles with the `--output` format set to `json`:

```bash
neon roles list --output json
[
  {
    "branch_id": "br-odd-frog-703504",
    "name": "daniel",
    "protected": false,
    "created_at": "2023-06-28T10:17:28Z",
    "updated_at": "2023-06-28T10:17:28Z"
  }
```

### create

This subcommand allows you to create a role.

#### Usage

```bash
neon roles create [options]
```

#### Options

In addition to the Neon CLI [global options](/docs/reference/neon-cli#global-options), the `create` subcommand supports these options:

| Option           | Description                                                                                   | Type   |                      Required                       |
| ---------------- | --------------------------------------------------------------------------------------------- | ------ | :-------------------------------------------------: |
| `--context-file` | [Context file](/docs/reference/cli-set-context#using-a-named-context-file) path and file name | string |                                                     |
| `--project-id`   | Project ID                                                                                    | string | Only if your Neon account has more than one project |
| `--branch`       | Branch ID or name                                                                             | string |                                                     |
| `--name`         | The role name. Cannot exceed 63 bytes in length.                                              | string |                       &check;                       |

If a branch ID or name is not provided, the command creates a role in the default branch of the project.

#### Example

```bash shouldWrap
neon roles create --name sally
┌───────┬──────────────────────┐
│ Name  │ Created At           │
├───────┼──────────────────────┤
│ sally │ 2023-06-20T00:43:17Z │
└───────┴──────────────────────┘
```

### delete

This subcommand allows you to delete a role.

#### Usage

```bash
neon roles delete <role> [options]
```

#### Options

In addition to the Neon CLI [global options](/docs/reference/neon-cli#global-options), the `delete` subcommand supports these options:

| Option           | Description                                                                                   | Type   |                      Required                       |
| ---------------- | --------------------------------------------------------------------------------------------- | ------ | :-------------------------------------------------: |
| `--context-file` | [Context file](/docs/reference/cli-set-context#using-a-named-context-file) path and file name | string |                                                     |
| `--project-id`   | Project ID                                                                                    | string | Only if your Neon account has more than one project |
| `--branch`       | Branch ID or name                                                                             | string |                                                     |

If a branch ID or name is not provided, the command assumes the role resides in the default branch of the project.

#### Example

```bash shouldWrap
neon roles delete sally
┌───────┬──────────────────────┐
│ Name  │ Created At           │
├───────┼──────────────────────┤
│ sally │ 2023-06-20T00:43:17Z │
└───────┴──────────────────────┘
```

<NeedHelp/>
