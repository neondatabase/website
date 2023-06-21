---
title: Neon CLI commands — projects
subtitle: Use the Neon CLI to manage Neon projects directly from your terminal
enableTableOfContents: true
isDraft: true
---

## Before you begin

Ensure that you have [installed the Neon CLI](../reference/neon-cli#install-the-neon-cli).

## The `projects` command

The `projects` command allows you to list, create, update, delete, and retrieve information about Neon projects.

### Usage

```bash
neonctl projects <subcommand> [options]
```

| Subcommand  | Description      |
|---------|------------------|
| [list](#list)    | List projects    |
| [create](#create)  | Create a project |
| [update](#update)  | Update a project |
| [delete](#delete)  | Delete a project |
| [get](#get)     | Get a project    |

### list

This subcommand allows you to list projects that belong to your Neon account.

#### Usage

```bash
neonctl projects list [options]
```

#### Options

Only [global options](../reference/neon-cli/global-options) apply.

#### Example

```bash
neonctl projects list
┌────────────────────────┬────────────────────────┬───────────────┬──────────────────────┐
│ Id                     │ Name                   │ Region Id     │ Created At           │
├────────────────────────┼────────────────────────┼───────────────┼──────────────────────┤
│ late-rain-471577       │ late-rain-471577       │ aws-us-west-2 │ 2023-05-17T17:26:07Z │
├────────────────────────┼────────────────────────┼───────────────┼──────────────────────┤
│ tight-wave-371442      │ tight-wave-371442      │ aws-us-east-2 │ 2023-05-15T12:33:39Z │
├────────────────────────┼────────────────────────┼───────────────┼──────────────────────┤
│ lingering-brook-802958 │ lingering-brook-802958 │ aws-us-east-2 │ 2023-05-11T12:25:22Z │
└────────────────────────┴────────────────────────┴───────────────┴──────────────────────┘
```

### create

This subcommand allows you to create a Neon project. The [Neon Free Tier](../introduction/free-tier) supports creating a single project. The [Neon Pro plan](../introduction/pro-plan) allows creating multiple projects.

You are prompted for a project name, which is optional. Press the **Enter** key to have a project name generated for you.

#### Usage

```bash
neonctl projects create [options]
```

#### Options

In addition to the Neon CLI [global options](../neon-cli/global-options), the `create` subcommand supports these options:

| Option                                | Description                                                                                               | Type    | Required                               |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------- | :-----------------------------------: |
| --project.settings.quota.active_time_seconds | The total amount of time allowed to be spent by project's compute endpoints               | number  |                                       |
| --project.settings.quota.compute_time_seconds | The total amount of CPU seconds allowed to be spent by project's compute endpoints                   | number  |                                       |
| --project.settings.quota.written_data_bytes | Total amount of data written to all project's branches                                                | number  |                                       |
| --project.settings.quota.data_transfer_bytes | Total amount of data transferred from all project's branches using proxy                              | number  |                                       |
| --project.settings.quota.logical_size_bytes | Limit on the logical size of every project's branch                                                    | number  |                                       |
| --project.name                        | The project name. If not specified, one is generated for you.                                                                                          | string  |                                       |
| --project.branch.name                 | The branch name. If not specified, the the branch id is used.                                   | string  |                                       |
| --project.branch.role_name            | The role name. If not specified, the default role name will be used.                                      | string  |                                       |
| --project.branch.database_name        | The database name. If not specified, the default database name will be used.                               | string  |                                       |
| --project.provisioner                 | The Neon compute provisioner. `k8s-pod` or `k8s-neonvm`. The latter is required for _Autoscaling_.                                                                              | string  |                                       |
| --project.region_id                   | The region identifier. See [the documentation](https://neon.tech/docs/introduction/regions) for the list of supported regions. | string  |                                       |
| --project.pg_version                  | The major PostgreSQL version number. Currently supported version are `14` and `15`. The deafult is 15.                        | number  |                                       |
| --project.store_passwords             | Whether or not passwords are stored for roles in the Neon project. Storing passwords facilitates access to Neon features that require authorization. The default is `true`. | boolean |                                       |
| --project.history_retention_seconds   | The number of seconds to retain PITR backup history for this project. The default is 604800 seconds (7 days).                  |  number       |                                       |

#### Example

```bash
neonctl projects create
? Project name (optional) 
┌────────────────────┬────────────────────┬───────────────┬──────────────────────┐
│ Id                 │ Name               │ Region Id     │ Created At           │
├────────────────────┼────────────────────┼───────────────┼──────────────────────┤
│ silent-dawn-084646 │ silent-dawn-084646 │ aws-us-east-2 │ 2023-06-19T18:27:57Z │
└────────────────────┴────────────────────┴───────────────┴──────────────────────┘
```

### update

This subcommand allows you to update a Neon project.

#### Usage

```bash
neonctl projects update [options]
```

#### Options

In addition to the Neon CLI [global options](../neon-cli/global-options), the `update` subcommand supports these options:

| Option                                | Description                                                                                               | Type    | Required                               |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------- | :-----------------------------------: |
| --project.id                          | Project ID                                                                                                | number  | &check;                                      |
| --project.settings.quota.active_time_seconds | The total amount of time allowed to be spent by project's compute endpoints               | number  |                                       |
| --project.settings.quota.compute_time_seconds | The total amount of CPU seconds allowed to be spent by project's compute endpoints                   | number  |                                       |
| --project.settings.quota.written_data_bytes | Total amount of data written to all project's branches                                                | number  |                                       |
| --project.settings.quota.data_transfer_bytes | Total amount of data transferred from all project's branches using proxy                              | number  |                                       |
| --project.settings.quota.logical_size_bytes | Limit on the logical size of every project's branch                                                    | number  |                                       |
| --project.name                        | The project name. If not specified, one is generated for you.                                                                                          | string  |                                       |
| --project.branch.name                 | The branch name. If not specified, the the branch id is used.                                   | string  |                                       |
| --project.branch.role_name            | The role name. If not specified, the default role name will be used.                                      | string  |                                       |
| --project.branch.database_name        | The database name. If not specified, the default database name will be used.                               | string  |                                       |
| --project.provisioner                 | The Neon compute provisioner. `k8s-pod` or `k8s-neonvm`. The latter is required for _Autoscaling_.                                                                              | string  |                                       |
| --project.region_id                   | The region identifier. See [the documentation](https://neon.tech/docs/introduction/regions) for the list of supported regions. | string  |                                       |
| --project.pg_version                  | The major PostgreSQL version number. Currently supported version are `14` and `15`. The deafult is 15.                        | number  |                                       |
| --project.store_passwords             | Whether or not passwords are stored for roles in the Neon project. Storing passwords facilitates access to Neon features that require authorization. The default is `true`. | boolean |                                       |
| --project.history_retention_seconds   | The number of seconds to retain PITR backup history for this project. The default is 604800 seconds (7 days).                  |  number       |                                       |

#### Example

```bash
neonctl projects update --project.id silent-dawn-084646 --project.name mynewproject
┌────────────────────┬──────────────┬───────────────┬──────────────────────┐
│ Id                 │ Name         │ Region Id     │ Created At           │
├────────────────────┼──────────────┼───────────────┼──────────────────────┤
│ silent-dawn-084646 │ mynewproject │ aws-us-east-2 │ 2023-06-19T18:27:57Z │
└────────────────────┴──────────────┴───────────────┴──────────────────────┘
```

### delete

This subcommand allows you to delete a Neon project.

```bash
neonctl projects delete [options]
```

#### Options

In addition to the Neon CLI [global options](../neon-cli/global-options), the `delete` subcommand supports this option:

| Option       | Description   | Type   | Required  |
| ------------ | ------------- | ------ | :------: |
| --project.id | Project ID    | string | &check; |

#### Example

```bash
neonctl projects delete --project.id silent-dawn-084646
┌────────────────────┬──────────────┬───────────────┬──────────────────────┐
│ Id                 │ Name         │ Region Id     │ Created At           │
├────────────────────┼──────────────┼───────────────┼──────────────────────┤
│ silent-dawn-084646 │ mynewproject │ aws-us-east-2 │ 2023-06-19T18:27:57Z │
└────────────────────┴──────────────┴───────────────┴──────────────────────┘
```

Information about the deleted project is displayed. You can verify that the project was deleted by running `neonctl projects list`.

### get

This subcommand allows you to retrieve details about a Neon project.

#### Usage

```bash
neonctl projects get [options]
```

#### Options

In addition to the Neon CLI [global options](../neon-cli/global-options), the `get` subcommand supports the this option:

| Option       | Description   | Type   | Required  |
| ------------ | ------------- | ------ | :------: |
| --project.id | Project ID    | string | &check; |

#### Example

```bash
neonctl projects get --project.id spring-sky-578180
┌───────────────────┬───────────────────┬───────────────┬──────────────────────┐
│ Id                │ Name              │ Region Id     │ Created At           │
├───────────────────┼───────────────────┼───────────────┼──────────────────────┤
│ spring-sky-578180 │ spring-sky-578180 │ aws-us-east-2 │ 2023-06-19T18:27:19Z │
└───────────────────┴───────────────────┴───────────────┴──────────────────────┘
```

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
