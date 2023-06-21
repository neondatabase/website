---
title: Neon CLI commands — operations
subtitle: Use the Neon CLI to manage Neon projects directly from your terminal
enableTableOfContents: true
isDraft: true
---

## Before you begin

Ensure that you have [installed the Neon CLI](../reference/neon-cli#install-the-neon-cli).

## The `operations` command

The `operations` command allows you to list operations for a Neon project.

### Usage

```bash
neonctl operations <subcommand> [options]
```

| Subcommand  | Description      |
|---------|------------------|
| [list](#list)    | List databases    |

### list

This subcommand allows you to list operations.

#### Usage

```bash
neonctl operations list [options]
```

#### Options

In addition to the Neon CLI [global options](../neon-cli/global-options), the `list` subcommand supports this option:

#### Options

| Option       | Description | Type   | Required  |
| ------------ | ----------- | ------ | :------: |
| --project.id | Project ID  | string | &check; |

#### Example

```bash
neonctl operations list --project.id spring-sky-578180 
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

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
