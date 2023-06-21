---
title: Neon CLI commands — branches
subtitle: Use the Neon CLI to manage Neon projects directly from your terminal
enableTableOfContents: true
isDraft: true
---

## Before you begin

Ensure that you have [installed the Neon CLI](../reference/neon-cli#install-the-neon-cli).

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
| [update](#update)  | Update a branch |
| [delete](#delete)  | Delete a branch |
| [get](#get)     | Get a branch    |

### list

This subcommand allows you to list branches in a Neon project.

#### Usage

```bash
neonctl branches list [options]
```

#### Options

In addition to the Neon CLI [global options](../neon-cli/global-options), the `list` subcommand supports this option:

| Option       | Description   | Type   | Required  |
| ------------ | ------------- | ------ | :------: |
| --project.id | Project ID    | string | &check; |

#### Example

```bash
neonctl branches list --project.id spring-sky-578180
┌───────────────────────┬──────┬──────────────────────┐
│ Id                    │ Name │ Created At           │
├───────────────────────┼──────┼──────────────────────┤
│ br-autumn-dust-190886 │ main │ 2023-06-19T18:27:19Z │
└───────────────────────┴──────┴──────────────────────┘
```

### create

This subcommand allows you to create a branch in a Neon project.

#### Usage

```bash
neonctl branches create [options]
```

#### Options

In addition to the Neon CLI [global options](../neon-cli/global-options), the `create` subcommand supports these options:

| Option                                    | Description                                                                               | Type    | Required                               |
| ----------------------------------------- | ----------------------------------------------------------------------------------------- | ------- | :------: |
| --project.id                              | Project ID                                                                                | string  | &check;                              |
| --branch.parent_id                        | The `branch_id` of the parent branch                                                      | string  |                                       |
| --branch.name                             | The branch name                                                                           | string  |                                       |
| --branch.parent_lsn                       | A Log Sequence Number (LSN) on the parent branch. The branch will be created with data from this LSN. The expected format is the same as a value returned by `SELECT pg_current_wal_flush_lsn()`. | string  |                                       |
| --branch.parent_timestamp                 | A timestamp identifying a point in time on the parent branch. The branch will be created with data starting from this point in time. The expected format is `MM/DD/YYYY hh:mm:ss a`; for example: `06/13/2023 12:00:00 am` | string  |                                       |
| --endpoint.type                           | The compute endpoint type. Either `read_write` or `read_only`. The `read_only` compute endpoint type is not yet supported. The default value is `read_write`. | string  |              |
| --endpoint.provisioner                    | The Neon compute provisioner. Supported values are `k8s-pod` and `k8s-neonvm`. The later is required to use _Autoscaling_.                                                               | string  |      |
| --endpoint.suspend_timeout_seconds        | Duration of inactivity in seconds after which endpoint will be automatically suspended. Value `0` means use global default, `-1` means never suspend. The maximum value is 604800 seconds (1 week).

#### Example

```bash
neonctl branches create --project.id spring-sky-578180
┌─────────────────────────┬─────────────────────────┬──────────────────────┐
│ Id                      │ Name                    │ Created At           │
├─────────────────────────┼─────────────────────────┼──────────────────────┤
│ br-withered-king-763176 │ br-withered-king-763176 │ 2023-06-19T22:35:25Z │
└─────────────────────────┴─────────────────────────┴──────────────────────┘
```

### update

This subcommand allows you to update a branch in a Neon project.

#### Usage

```bash
neonctl branches update [options]
```

#### Options

In addition to the Neon CLI [global options](../neon-cli/global-options), the `update` subcommand supports these options:

| Option        | Description | Type   | Required  |
| ------------- | ----------- | ------ | :-----: |
| --project.id  | Project ID  | string | &check; |
| --branch.name |             | string |         |
| --branch.id   | Branch ID   | string | &check; |

#### Example

```bash
neonctl branches update --project.id spring-sky-578180 --branch.id br-withered-king-763176 --branch.name mynewbranch
┌─────────────────────────┬─────────────┬──────────────────────┐
│ Id                      │ Name        │ Created At           │
├─────────────────────────┼─────────────┼──────────────────────┤
│ br-withered-king-763176 │ mynewbranch │ 2023-06-19T22:35:25Z │
└─────────────────────────┴─────────────┴──────────────────────┘
```

### delete

This subcommand allows you to delete a branch in a Neon project.

#### Usage

```bash
neonctl branches delete [options]
```

#### Options

In addition to the Neon CLI [global options](../neon-cli/global-options), the `delete` subcommand supports these options:

| Option        | Description | Type   | Required  |
| ------------- | ----------- | ------ | :------: |
| --project.id  | Project ID  | string | &check; |
| --branch.id   | Branch ID   | string | &check; |

#### Example

<CodeBlock shouldWrap>

```bash
neonctl branches delete --project.id spring-sky-578180 --branch.id br-withered-king-763176
┌─────────────────────────┬─────────────┬──────────────────────┐
│ Id                      │ Name        │ Created At           │
├─────────────────────────┼─────────────┼──────────────────────┤
│ br-withered-king-763176 │ mynewbranch │ 2023-06-19T22:35:25Z │
└─────────────────────────┴─────────────┴──────────────────────┘
```

</CodeBlock>

### get

This subcommand allows you to retrieve details about a branch.

#### Usage

```bash
neonctl branches get [options]
```

#### Options

In addition to the Neon CLI [global options](../neon-cli/global-options), the `get` subcommand supports this option:

#### Options

| Option        | Description | Type   | Required |
| ------------- | ----------- | ------ | :------: |
| --project.id  | Project ID  | string | &check; |
| --branch.id   | Branch ID   | string | &check; |

#### Example

<CodeBlock shouldWrap>

```bash
neonctl branches get --project.id spring-sky-578180 --branch.id br-sweet-sun-522796 
┌─────────────────────┬─────────────────────┬──────────────────────┐
│ Id                  │ Name                │ Created At           │
├─────────────────────┼─────────────────────┼──────────────────────┤
│ br-sweet-sun-522796 │ br-sweet-sun-522796 │ 2023-06-19T22:35:20Z │
└─────────────────────┴─────────────────────┴──────────────────────┘
```

</CodeBlock>

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
