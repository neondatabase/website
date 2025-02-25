---
title: Neon CLI commands — vpc
subtitle: Use the Neon CLI to manage Neon directly from the terminal
enableTableOfContents: true
updatedOn: '2025-02-20T17:57:40.911Z'
---

## Before you begin

- Before running a `vpc` command, ensure that you have [installed the Neon CLI](/docs/reference/cli-install).
- If you have not authenticated with the [neon auth](/docs/reference/cli-auth) command, running a Neon CLI command automatically launches the Neon CLI browser authentication process. Alternatively, you can specify a Neon API key using the `--api-key` option when running a command. See [Connect](/docs/reference/neon-cli#connect).

## The `vpc` command

You can use the `vpc` CLI command to manage [Private Networking](/docs/guides/neon-private-networking) configurations in Neon.

The `vpc` command includes subcommands for managing VPC endpoints and project-level VPC endpoint restrictions.

| Subcommand                               | Description                                    |
| :--------------------------------------- | :--------------------------------------------- |
| [endpoint](#the-vpc-endpoint-subcommand) | Manage VPC endpoints                           |
| [project](#the-vpc-project-subcommand)   | Manage project-level VPC endpoint restrictions |

## The `vpc endpoint` subcommand

The `vpc endpoint` subcommand lets you to list, assign, remove, and get the status of VPC endpoints for a Neon organization.

### Usage

| Subcommand    | Description                                                                                                                           |
| :------------ | :------------------------------------------------------------------------------------------------------------------------------------ |
| `list`        | List configured VPC endpoints for the Neon organization.                                                                              |
| `assign <id>` | Add or update a VPC endpoint in the Neon organization. The ID is the VPC endpoint ID. Aliases for this command are `add` and `update` |
| `remove <id>` | Remove a VPC endpoint from the Neon organization. The ID is the VPC endpoint ID.                                                      |
| `status <id>` | Get the status of a VPC endpoint for the Neon organization. The ID is the VPC endpoint ID.                                            |

### Options

In addition to the Neon CLI [global options](/docs/reference/neon-cli#global-options), the `vpc endpoint` subcommand supports these options:

| Option           | Description                                                                                                                                                        | Type   | Required                                                                                                                          |
| :--------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----- | :-------------------------------------------------------------------------------------------------------------------------------- |
| `--context-file` | [Context file](/docs/reference/cli-set-context#using-a-named-context-file) path and file name                                                                      | string |                                                                                                                                   |
| `--org-id`       | Organization ID                                                                                                                                                    | string | Only if the user has more than one organization. If not specified, and the user has only one organization, that `org_id` is used. |
| `--region-id`    | The region ID. Possible values: `aws-us-west-2`, `aws-ap-southeast-1`, `aws-ap-southeast-2`, `aws-eu-central-1`, `aws-us-east-2`, `aws-us-east-1`, `azure-eastus2` | string | yes                                                                                                                               |

### Examples

- **List VPC endpoints**

  Retrieve a list of all configured VPC endpoints for a specific Neon organization.

  ```bash
  neon vpc endpoint list --org-id org-bold-bonus-12345678
  ```

- **Assign a VPC endpoint**

  Add or update a VPC endpoint for a specific Neon organization and region.

  ```bash
  neon vpc endpoint assign vpce-1234567890abcdef0 --org-id org-bold-bonus-12345678 --region-id aws-us-east-1
  ```

  After assigning a VPC endpoint to a Neon organization, client connections will be accepted from the corresponding VPC for all projects in the Neon organization, unless restricted. Aliases for this command are `add` and `update`.

- **Remove a VPC endpoint**

  Delete an existing VPC endpoint from a specific Neon organization.

  ```bash
  neon vpc endpoint remove vpce-1234567890abcdef0 --org-id org-bold-bonus-12345678
  ```

- **Get the status of a VPC endpoint**

  Check the status of a specific VPC endpoint in a Neon organization.

  ```bash
  neon vpc endpoint status vpce-1234567890abcdef0 --org-id org-bold-bonus-12345678
  ```

## The `vpc project` subcommand

The `vpc project` subcommand lets you list, configure, or remove VPC endpoint restrictions to prevent access to specific projects in your Neon organization.

### Usage

| Subcommand      | Description                                                                                                    |
| :-------------- | :------------------------------------------------------------------------------------------------------------- |
| `list`          | List all VPC endpoint restrictions for a specific project.                                                     |
| `restrict <id>` | Configure or update a VPC endpoint restriction for a project. The ID is the VPC endpoint ID. [Alias: `update`] |
| `remove <id>`   | Remove a VPC endpoint restriction from a project. The ID is the VPC endpoint ID.                               |

### Options

In addition to the Neon CLI [global options](/docs/reference/neon-cli#global-options), the `vpc project` subcommand supports these options:

| Option           | Description                                                                                   | Type   | Required |
| :--------------- | :-------------------------------------------------------------------------------------------- | :----- | :------- |
| `--context-file` | [Context file](/docs/reference/cli-set-context#using-a-named-context-file) path and file name | string |          |
| `--project-id`   | The Project ID.                                                                               | string | yes      |

### Examples

- **List project-level VPC endpoint restrictions**

  List all VPC endpoint restrictions for the specified Neon project.

  ```bash
  neon vpc project list --project-id orange-credit-12345678
  ```

- **Restrict connections to a specific VPC**

  Configure or update a VPC endpoint restriction for a Neon project. When a VPC endpoint ID is assigned as a restriction, the specified project only accepts connections from the specified VPC.

  ```bash
  neon vpc project restrict vpce-1234567890abcdef0 --project-id orange-credit-12345678
  ```

- **Remove a VPC endpoint restriction**

  Remove a VPC endpoint restriction from a specific Neon project.

  ```bash
  neon vpc project remove vpce-1234567890abcdef0 --project-id orange-credit-12345678
  ```

<NeedHelp/>
