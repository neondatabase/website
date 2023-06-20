---
title: Neon CLI commands — branches
subtitle: Use the Neon CLI to manage your Neon project directly from your terminal
enableTableOfContents: true
isDraft: true
---

## Get started

Ensure that you have [installed the Neon CLI](../neon-cli/get-started). Once you have done that, you can use the `branches` command manage branches from the command line.

## The `branches` command

The `branches` command allows you to list, create, update, delete, and retrieve information about branches in your Neon project.

### Usage

```bash
neonctl branches <sub-command> [options]
```

### Sub-commands

| Sub-command  | Description      |
|---------|------------------|
| [list](#list)    | List branches    |
| [create](#create)  | Create a branch |
| [update](#update)  | Update a branch |
| [delete](#delete)  | Delete a branch |
| [get](#get)     | Get a branch    |

### list

This sub-command allows you to list branches in a Neon project.

#### Usage

```bash
neonctl branches list [options]
```

#### Options

In addition to the Neon CLI [global options](../neon-cli/global-options), the `list` sub-command supports this option:

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

This sub-command allows you to create a branch in a Neon project.

#### Usage

```bash
neonctl branches create [options]
```

#### Options

In addition to the Neon CLI [global options](../neon-cli/global-options), the `create` sub-command supports these options:

| Option                                    | Description                                                                               | Type    | Required                               |
| ----------------------------------------- | ----------------------------------------------------------------------------------------- | ------- | :------: |
| --project.id                              | Project ID                                                                                | string  | &check;                              |
| --branch.parent_id                        | The `branch_id` of the parent branch                                                      | string  |                                       |
| --branch.name                             | The branch name                                                                           | string  |                                       |
| --branch.parent_lsn                       | A Log Sequence Number (LSN) on the parent branch. The branch will be created with data from this LSN | string  |                                       |
| --branch.parent_timestamp                 | A timestamp identifying a point in time on the parent branch. The branch will be created with data starting from this point in time. | string  |                                       |
| --endpoint.type                           | The compute endpoint type. Either `read_write` or `read_only`. The `read_only` compute endpoint type is not yet supported. The default value is `read_write`. | string  |              |
| --endpoint.provisioner                    | The Neon compute provisioner. Supported values are `k8s-pod` and `k8s-neonvm`. The later is required to use _Autoscaling_.                                                               | string  |      |
| --endpoint.suspend_timeout_seconds        | Duration of inactivity in seconds after which endpoint will be automatically suspended. Value `0` means use global default, `-1` means never suspend. Maximum value is 1 week in seconds. | number  |                                       |

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

This sub-command allows you to update a branch in a Neon project.

#### Usage

```bash
neonctl branches update [options]
```

#### Options

In addition to the Neon CLI [global options](../neon-cli/global-options), the `update` sub-command supports these options:

#### Options

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

This sub-command allows you to delete a branch in a Neon project.

#### Usage

```bash
neonctl branches delete [options]
```

#### Options

In addition to the Neon CLI [global options](../neon-cli/global-options), the `delete` sub-command supports this option:

#### Options

| Option        | Description | Type   | Required  |
| ------------- | ----------- | ------ | :------: |
| --project.id  | Project ID  | string | Required |
| --branch.id   | Branch ID   | string | Required |

#### Example

```bash
neonctl branches delete --project.id spring-sky-578180 --branch.id br-withered-king-763176
┌─────────────────────────┬─────────────┬──────────────────────┐
│ Id                      │ Name        │ Created At           │
├─────────────────────────┼─────────────┼──────────────────────┤
│ br-withered-king-763176 │ mynewbranch │ 2023-06-19T22:35:25Z │
└─────────────────────────┴─────────────┴──────────────────────┘
```

### get

This sub-command allows you to retrieve details about a branch.

#### Usage

```bash
neonctl branches get [options]
```

#### Options

In addition to the Neon CLI [global options](../neon-cli/global-options), the `get` sub-command supports this option:

#### Options

| Option        | Description | Type   | Required |
| ------------- | ----------- | ------ | :------: |
| --project.id  | Project ID  | string | &check; |
| --branch.id   | Branch ID   | string | &check; |

#### Example

```bash
neonctl branches get --project.id spring-sky-578180 --branch.id br-sweet-sun-522796 
┌─────────────────────┬─────────────────────┬──────────────────────┐
│ Id                  │ Name                │ Created At           │
├─────────────────────┼─────────────────────┼──────────────────────┤
│ br-sweet-sun-522796 │ br-sweet-sun-522796 │ 2023-06-19T22:35:20Z │
└─────────────────────┴─────────────────────┴──────────────────────┘
```

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
