---
title: Neon CLI commands - projects
subtitle: Use the Neon CLI to manage your Neon project directly from your terminal
enableTableOfContents: true
isDraft: true
---

## Get started

Make sure that you [install the Neon CLI](../neon-cli/get-started) first. Once you have done that, you can manage your Neon projects from the command line.

## The `projects` command

The `projects` command allows you to list, create, update, delete, and get Neon projects.

### Usage

```bash
neonctl projects <sub-command> [options]
```

### Sub-commands

| Sub-command  | Description      |
|---------|------------------|
| [list](#list)    | List projects    |
| [create](#create)  | Create a project |
| [update](#update)  | Update a project |
| [delete](#delete)  | Delete a project |
| [get](#get)     | Get a project    |

### list

This command allows you to list projects that belong to your account.

#### Usage

```bash
neonctl projects list [options]
```

#### Options

Only [global options](../neon-cli/global-options) apply.

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

Create a project. You are prompted for a project name, which is optional. Press the **Enter** key to have a project name generated for you.

```bash
neonctl projects create
? Project name (optional) 

┌────────────────────┬────────────────────┬───────────────┬──────────────────────┐
│ Id                 │ Name               │ Region Id     │ Created At           │
├────────────────────┼────────────────────┼───────────────┼──────────────────────┤
│ silent-dawn-084646 │ silent-dawn-084646 │ aws-us-east-2 │ 2023-06-19T18:27:57Z │
└────────────────────┴────────────────────┴───────────────┴──────────────────────┘
```

#### Options

| Option                                | Description                                                                                               | Type    | Default                               |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------- | ------------------------------------- |
| --project.settings.quota.active_time_seconds | The total amount of wall-clock time allowed to be spent by project's compute endpoints               | number  |                                       |
| --project.settings.quota.compute_time_seconds | The total amount of CPU seconds allowed to be spent by project's compute endpoints                   | number  |                                       |
| --project.settings.quota.written_data_bytes | Total amount of data written to all project's branches                                                | number  |                                       |
| --project.settings.quota.data_transfer_bytes | Total amount of data transferred from all project's branches using proxy                              | number  |                                       |
| --project.settings.quota.logical_size_bytes | Limit on the logical size of every project's branch                                                    | number  |                                       |
| --project.name                        | The project name                                                                                          | string  |                                       |
| --project.branch.name                 | The branch name. If not specified, the default branch name will be used                                   | string  |                                       |
| --project.branch.role_name            | The role name. If not specified, the default role name will be used                                       | string  |                                       |
| --project.branch.database_name        | The database name. If not specified, the default database name will be used                               | string  |                                       |
| --project.provisioner                 | The Neon compute provisioner                                                                              | string  |                                       |
| --project.region_id                   | The region identifier. See [the documentation](https://neon.tech/docs/introduction/regions) for the list of supported regions | string  |                                       |
| --project.pg_version                  | The major PostgreSQL version number. Currently supported version are `14` and `15`                        | number  |                                       |
| --project.store_passwords             | Whether or not passwords are stored for roles in the Neon project. Storing passwords facilitates access to Neon features that require authorization | boolean |                                       |
| --project.history_retention_seconds   | The number of seconds to retain PITR backup history for this project. Defaults to 7 days                  |         |                                       |

#### Example

### update

Update a project.

```bash
neonctl projects update --project.id silent-dawn-084646 --project.name mynewproject
┌────────────────────┬──────────────┬───────────────┬──────────────────────┐
│ Id                 │ Name         │ Region Id     │ Created At           │
├────────────────────┼──────────────┼───────────────┼──────────────────────┤
│ silent-dawn-084646 │ mynewproject │ aws-us-east-2 │ 2023-06-19T18:27:57Z │
└────────────────────┴──────────────┴───────────────┴──────────────────────┘
```

#### Options

| Option                                           | Description                                                                                               | Type    | Default                               |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------- | ------- | ------------------------------------- |
| --project.id                                     | Project ID                                                                                                | string  | Required                              |
| --project.settings.quota.active_time_seconds     | The total amount of wall-clock time allowed to be spent by project's compute endpoints                   | number  |                                       |
| --project.settings.quota.compute_time_seconds    | The total amount of CPU seconds allowed to be spent by project's compute endpoints                       | number  |                                       |
| --project.settings.quota.written_data_bytes      | Total amount of data written to all project's branches                                                    | number  |                                       |
| --project.settings.quota.data_transfer_bytes     | Total amount of data transferred from all project's branches using proxy                                  | number  |                                       |
| --project.settings.quota.logical_size_bytes      | Limit on the logical size of every project's branch                                                       | number  |                                       |
| --project.name                                   | The project name                                                                                          | string  |                                       |
| --project.branch.name                            | The branch name. If not specified, the default branch name will be used                                   | string  |                                       |
| --project.branch.role_name                       | The role name. If not specified, the default role name will be used                                       | string  |                                       |
| --project.branch.database_name                   | The database name. If not specified, the default database name will be used                               | string  |                                       |
| --project.provisioner                            | The Neon compute provisioner                                                                              | string  |                                       |
| --project.region_id                              | The region identifier. See [the documentation](https://neon.tech/docs/introduction/regions) for the list of supported regions | string  |                                       |
| --project.pg_version                             | The major PostgreSQL version number. Currently supported version are `14` and `15`                        | number  |                                       |
| --project.store_passwords                        | Whether or not passwords are stored for roles in the Neon project. Storing passwords facilitates access to Neon features that require authorization | boolean |                                       |
| --project.history_retention_seconds              | The number of seconds to retain PITR backup history for this project. Defaults to 7 days                  | number  |                                       |

#### Example

### delete

Delete a project. The deleted project is displayed as output. You can verify that the project was deleted by running `neonctl projects list`.

```bash
neonctl projects delete --project.id silent-dawn-084646
┌────────────────────┬──────────────┬───────────────┬──────────────────────┐
│ Id                 │ Name         │ Region Id     │ Created At           │
├────────────────────┼──────────────┼───────────────┼──────────────────────┤
│ silent-dawn-084646 │ mynewproject │ aws-us-east-2 │ 2023-06-19T18:27:57Z │
└────────────────────┴──────────────┴───────────────┴──────────────────────┘
```

#### Options

| Option       | Description   | Type   | Default  |
| ------------ | ------------- | ------ | -------- |
| --project.id | Project ID    | string | Required |

#### Example

### get

```bash
neonctl projects get --project.id spring-sky-578180
┌───────────────────┬───────────────────┬───────────────┬──────────────────────┐
│ Id                │ Name              │ Region Id     │ Created At           │
├───────────────────┼───────────────────┼───────────────┼──────────────────────┤
│ spring-sky-578180 │ spring-sky-578180 │ aws-us-east-2 │ 2023-06-19T18:27:19Z │
└───────────────────┴───────────────────┴───────────────┴──────────────────────┘
```

#### Options

| Option       | Description   | Type   | Default  |
| ------------ | ------------- | ------ | -------- |
| --project.id | Project ID    | string | Required |

#### Example

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
