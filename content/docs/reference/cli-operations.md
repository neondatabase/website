---
title: Neon CLI commands — operations
subtitle: Use the Neon CLI to manage Neon directly from the terminal
enableTableOfContents: true
updatedOn: '2024-08-09T20:21:45.351Z'
---

## Before you begin

- Before running the `operations` command, ensure that you have [installed the Neon CLI](/docs/reference/cli-install).
- If you have not authenticated with the [neon auth](/docs/reference/cli-auth) command, running a Neon CLI command automatically launches the Neon CLI browser authentication process. Alternatively, you can specify a Neon API key using the `--api-key` option when running a command. See [Connect](/docs/reference/neon-cli#connect).

For information about operations in Neon, see [System operations](/docs/manage/operations).

## The `operations` command

The `operations` command allows you to list operations for a Neon project.

### Usage

```bash
neon operations <subcommand> [options]
```

| Subcommand    | Description     |
| ------------- | --------------- |
| [list](#list) | List operations |

### list

This subcommand allows you to list operations.

#### Usage

```bash
neon operations list [options]
```

#### Options

In addition to the Neon CLI [global options](/docs/reference/neon-cli#global-options), the `list` subcommand supports this option:

| Option           | Description                                                                                   | Type   |                      Required                       |
| ---------------- | --------------------------------------------------------------------------------------------- | ------ | :-------------------------------------------------: |
| `--context-file` | [Context file](/docs/reference/cli-set-context#using-a-named-context-file) path and file name | string |                                                     |
| `--project-id`   | Project ID                                                                                    | string | Only if your Neon account has more than one project |

#### Example

```bash
neon operations list
┌──────────────────────────────────────┬────────────────────┬──────────┬──────────────────────┐
│ Id                                   │ Action             │ Status   │ Created At           │
├──────────────────────────────────────┼────────────────────┼──────────┼──────────────────────┤
│ fce8642e-259e-4662-bdce-518880aee723 │ apply_config       │ finished │ 2023-06-20T00:45:19Z │
├──────────────────────────────────────┼────────────────────┼──────────┼──────────────────────┤
│ dc1dfb0c-b854-474b-be20-2ea1d2172563 │ apply_config       │ finished │ 2023-06-20T00:43:17Z │
├──────────────────────────────────────┼────────────────────┼──────────┼──────────────────────┤
│ 7a83e300-cf5f-4c1a-b9b5-569b6d6feab9 │ suspend_compute    │ finished │ 2023-06-19T23:50:56Z │
└──────────────────────────────────────┴────────────────────┴──────────┴──────────────────────┘
```

<NeedHelp/>
