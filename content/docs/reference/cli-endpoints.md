---
title: Neon CLI commands — endpoints
subtitle: Use the Neon CLI to manage your Neon project directly from your terminal
enableTableOfContents: true
isDraft: true
---

## Get started

Ensure that you have [installed the Neon CLI](../reference/neon-cli/get-started). Once you have done that, you can use the `endpoints` command manage your Neon compute endpoints from the command line.

## The `endpoints` command

The `endpoints` command allows you to list, create, update, delete, and retrieve information about compute endpoints in a Neon project.

### Usage

```bash
neonctl endpoints <sub-command> [options]
```

### Sub-commands

| Sub-command  | Description      |
|---------|------------------|
| [list](#list)    | List endpoints    |
| [create](#create)  | Create an endpoint |
| [update](#update)  | Update an endpoint |
| [delete](#delete)  | Delete an endpoint |
| [get](#get)     | Get an endpoint    |

### list

This sub-command allows you to list endpoints in a Neon project.

#### Usage

```bash
neonctl endpoints list [options]
```

#### Options

In addition to the Neon CLI [global options](../neon-cli/global-options), the `list` sub-command supports these options:

| Option        | Description | Type   | Required  |
| ------------- | ----------- | ------ | :------: |
| --project.id  | Project ID  | string | &check; |
| --branch.id   | Branch ID   | string | &check; |

#### Example

```bash
neonctl endpoints list --project.id spring-sky-578180 --branch.id br-autumn-dust-190886
┌──────────────────────┬──────────────────────┬───────────────────────┬────────────┬───────────────┐
│ Id                   │ Created At           │ Branch Id             │ Type       │ Current State │
├──────────────────────┼──────────────────────┼───────────────────────┼────────────┼───────────────┤
│ ep-still-haze-361517 │ 2023-06-19T18:27:19Z │ br-autumn-dust-190886 │ read_write │ idle          │
└──────────────────────┴──────────────────────┴───────────────────────┴────────────┴───────────────┘
```

### create

This sub-command allows you to create endpoints in a Neon project.

#### Usage

```bash
neonctl endpoints create [options]
```

#### Options

In addition to the Neon CLI [global options](../neon-cli/global-options), the `create` sub-command supports these options:

| Option                                     | Description                                                                                                                           | Type    | Required                               |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- | ------- | :------------------------------------: |
| --project.id                               | Project ID                                                                                                                            | string  | &check;                              |
| --endpoint.branch_id                       | The ID of the branch the compute endpoint will be associated with                                                                     | string  | &check;                                |
| --endpoint.region_id                       | The region where the compute endpoint will be created. Only the project's `region_id` is permitted                                    | string  |                                        |
| --endpoint.type                            | The compute endpoint type. Either `read_write` or `read_only`. The `read_only` compute endpoint type is not yet supported.             | string | &check;      |
| --endpoint.provisioner                     | The Neon compute provisioner. `k8s-pod` or `k8s-neonvm`. The latter is required for _Autoscaling_.                                                                     | string  |       |
| --endpoint.pooler_enabled                  | Whether to enable connection pooling for the compute endpoint                                                                         | boolean |                                        |
| --endpoint.pooler_mode                     | The connection pooler mode. Neon supports PgBouncer in `transaction` mode only                                                        | string  |                           |
| --endpoint.disabled                        | Whether to restrict connections to the compute endpoint                                                                               | boolean |                                        |
| --endpoint.passwordless_access             | NOT YET IMPLEMENTED. Whether to permit passwordless access to the compute endpoint                                                    | boolean |                                        |
| --endpoint.suspend_timeout_seconds         | Duration of inactivity in seconds after which endpoint will be automatically suspended. Value `0` means use global default, `-1` means never suspend. Maximum value is 1 week in seconds | number  |                                        |

#### Example

```bash
neonctl endpoints create --project.id spring-sky-578180 --endpoint.branch_id br-sweet-sun-522796 --endpoint.type read_write
┌───────────────────────┬──────────────────────┬─────────────────────┬────────────┬───────────────┐
│ Id                    │ Created At           │ Branch Id           │ Type       │ Current State │
├───────────────────────┼──────────────────────┼─────────────────────┼────────────┼───────────────┤
│ ep-tight-paper-779179 │ 2023-06-19T23:04:27Z │ br-sweet-sun-522796 │ read_write │ init          │
└───────────────────────┴──────────────────────┴─────────────────────┴────────────┴───────────────┘
```

### update

This sub-command allows you to update endpoints in a Neon project.

#### Usage

```bash
neonctl endpoints update [options]
```

#### Options

In addition to the Neon CLI [global options](../neon-cli/global-options), the `update` sub-command supports these options:

#### Options

| Option                                     | Description                                                                                                                           | Type    | Required                                |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- | ------- | :------------------------------------: |
| --project.id                               | Project ID                                                                                                                            | string  | &check;                               |
| --endpoint.id                              | Endpoint ID                                                                                                                           | string  | &check;                               |
| --endpoint.branch_id                       | The destination branch ID. The destination branch must not have an existing read-write endpoint                                       | string  |                                        |
| --endpoint.provisioner                     | The Neon compute provisioner. `k8s-pod` or `k8s-neonvm`. The latter is required for _Autoscaling_.                                                                                                          | string  |       |
| --endpoint.pooler_enabled                  | Whether to enable connection pooling for the compute endpoint                                                                         | boolean |                                        |
| --endpoint.pooler_mode                     | The connection pooler mode. Neon supports PgBouncer in `transaction` mode only                                                        | string  |                           |
| --endpoint.disabled                        | Whether to restrict connections to the compute endpoint                                                                               | boolean |                                        |
| --endpoint.passwordless_access             | NOT YET IMPLEMENTED. Whether to permit passwordless access to the compute endpoint                                                    | boolean |                                        |
| --endpoint.suspend_timeout_seconds         | Duration of inactivity in seconds after which endpoint will be automatically suspended. Value `0` means use global default, `-1` means never suspend. Maximum value is 1 week in seconds | number  |                                        |

#### Example

```bash
neonctl endpoints update --project.id spring-sky-578180 --endpoint.id ep-tight-paper-779179 --endpoint.suspend_timeout_seconds 600
```

### delete

This sub-command allows you to delete endpoints in a Neon project.

#### Usage

```bash
neonctl endpoints delete [options]
```

#### Options

In addition to the Neon CLI [global options](../neon-cli/global-options), the `delete` sub-command supports these options:

| Option       | Description  | Type   | Required  |
| ------------ | ------------ | ------ | -------- |
| --project.id | Project ID   | string | &check; |
| --endpoint.id| Endpoint ID  | string | &check; |

#### Example

```bash
neonctl endpoints delete --project.id spring-sky-578180 --endpoint.id ep-tight-paper-779179
┌───────────────────────┬──────────────────────┬─────────────────────┬────────────┬───────────────┐
│ Id                    │ Created At           │ Branch Id           │ Type       │ Current State │
├───────────────────────┼──────────────────────┼─────────────────────┼────────────┼───────────────┤
│ ep-tight-paper-779179 │ 2023-06-19T23:04:27Z │ br-sweet-sun-522796 │ read_write │ idle          │
└───────────────────────┴──────────────────────┴─────────────────────┴────────────┴───────────────┘
```

### get

This sub-command allows you to retrieve information about a compute endpoint.

#### Usage

```bash
neonctl endpoints get [options]
```

#### Options

In addition to the Neon CLI [global options](../neon-cli/global-options), the `get` sub-command supports these options:

| Option       | Description  | Type   | Required  |
| ------------ | ------------ | ------ | -------- |
| --project.id | Project ID   | string | &check; |
| --endpoint.id| Endpoint ID  | string | &check; |

#### Example

```bash
neonctl endpoints get --project.id spring-sky-578180 --endpoint.id ep-tight-paper-779179
┌───────────────────────┬──────────────────────┬─────────────────────┬────────────┬───────────────┐
│ Id                    │ Created At           │ Branch Id           │ Type       │ Current State │
├───────────────────────┼──────────────────────┼─────────────────────┼────────────┼───────────────┤
│ ep-tight-paper-779179 │ 2023-06-19T23:04:27Z │ br-sweet-sun-522796 │ read_write │ idle          │
└───────────────────────┴──────────────────────┴─────────────────────┴────────────┴───────────────┘
```

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
