---
title: Neon CLI commands — vpc endpoint
subtitle: Use the Neon CLI to manage Neon directly from the terminal
enableTableOfContents: true
updatedOn: '2024-10-07T13:55:51.300Z'
---

## Before you begin

- Before running the `vpc endpoint` command, ensure that you have [installed the Neon CLI](/docs/reference/cli-install).
- If you have not authenticated with the [neon auth](/docs/reference/cli-auth) command, running a Neon CLI command automatically launches the Neon CLI browser authentication process. Alternatively, you can specify a Neon API key using the `--api-key` option when running a command. See [Connect](/docs/reference/neon-cli#connect).

## The `vpc endpoint` command

The `vpc endpoint` command enables management of VPC endpoints for [Neon Private Networking](https://neon.tech/docs/guides/neon-private-networking) configurations.

### Usage

The `vpc endpoint` command allows you to list, assign, remove, and get the status of VPC endpoints for a Neon organization.

| Subcommand        | Description                                                               |
| ----------------- | ------------------------------------------------------------------------- |
| [list](#list)     | List configured VPC endpoints for this organization.                      |
| [assign](#assign) | Add or update a VPC endpoint for this organization.                       |
|                   | **Note:** Azure regions are not yet supported. [Aliases: `update`, `add`] |
| [remove](#remove) | Remove a VPC endpoint from this organization.                             |
| [status](#status) | Get the status of a VPC endpoint for this organization.                   |

### Options

In addition to the Neon CLI [global options](/docs/reference/neon-cli#global-options), the `vpc endpoint` subcommand supports these options:

| Option        | Description                                                                                                                                                        | Type   |                                                             Required                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ | :------------------------------------------------------------------------------------------------------------------------------: |
| `--org-id`    | Organization ID                                                                                                                                                    | string | Only if the user has more than on organization. If not specified, and the user has only one organization, that `org_id` is used. |
| `--region-id` | The region ID. Possible values: `aws-us-west-2`, `aws-ap-southeast-1`, `aws-ap-southeast-2`, `aws-eu-central-1`, `aws-us-east-2`, `aws-us-east-1`, `azure-eastus2` | string |                                                               yes                                                                |

### Examples

- **List VPC endpoints**

  Retrieve a list of all configured VPC endpoints for a specific organization.

  ```bash
  neonctl vpc endpoint list --org-id my-org-id
  ```

- **Assign a VPC endpoint**

  Add or update a VPC endpoint for a specific organization and region.

  ```bash
  neonctl vpc endpoint assign vpc-12345678 --org-id my-org-id --region-id aws-us-east-1
  ```

- **Remove a VPC endpoint**

  Delete an existing VPC endpoint from a specific organization.

  ```bash
  neonctl vpc endpoint remove vpc-12345678 --org-id my-org-id
  ```

- **Get the status of a VPC endpoint**

  Check the status of a specific VPC endpoint in an organization.

  ```bash
  neonctl vpc endpoint status vpc-12345678 --org-id my-org-id
  ```

<NeedHelp/>
