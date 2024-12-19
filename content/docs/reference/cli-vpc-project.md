---
title: Neon CLI commands — vpc project
subtitle: Use the Neon CLI to manage project-level VPC endpoint restrictions
enableTableOfContents: true
updatedOn: '2024-12-19T13:00:00.000Z'
---

## Before you begin

- Before running the `vpc project` command, ensure that you have [installed the Neon CLI](/docs/reference/cli-install).
- If you have not authenticated with the [neon auth](/docs/reference/cli-auth) command, running a Neon CLI command automatically launches the Neon CLI browser authentication process. Alternatively, you can specify a Neon API key using the `--api-key` option when running a command. See [Connect](/docs/reference/neon-cli#connect).

## The `vpc project` command

The `vpc project` command allows you to manage project-level VPC endpoint restrictions in your Neon organization.

### Usage

The `vpc project` command enables you to list, configure, update, or remove VPC endpoint restrictions for specific Neon projects.

| Subcommand            | Description                                                                          |
| --------------------- | ------------------------------------------------------------------------------------ |
| [list](#list)         | List all VPC endpoint restrictions for a specific project.                          |
| [restrict](#restrict) | Configure or update a VPC endpoint restriction for a project. [Alias: `update`]     |
| [remove](#remove)     | Remove a VPC endpoint restriction from a project.                                   |

### Options

In addition to the Neon CLI [global options](/docs/reference/neon-cli#global-options), the `vpc project` subcommand supports these options:

| Option          | Description                  | Type   | Required |
| --------------- | ---------------------------- | ------ | :------: |
| `--project-id`  | The Project ID.              | string |   yes    |

### Examples

- **List project-level VPC endpoint restrictions**

  Retrieve a list of all VPC endpoint restrictions for a specific project.

  ```bash
  neonctl vpc project list --project-id my-project-id

- **Restrict connections to a specific VPC**

  Configure or update a VPC endpoint restriction for a project.

  ```bash
  neonctl vpc project restrict vpc-12345678 --project-id my-project-id

- **Remove a VPC endpoint restriction**
  Remove a VPC endpoint restriction from a specific project.

  ```bash
  neonctl vpc project remove vpc-12345678 --project-id my-project-id
  ```

  <NeedHelp/>