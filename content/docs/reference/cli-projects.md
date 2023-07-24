---
title: Neon CLI commands — projects
subtitle: Use the Neon CLI to manage Neon projects directly from your terminal
enableTableOfContents: true
---

## Before you begin

- Before running the `projects` command, ensure that you have [installed the Neon CLI](/docs/reference/neon-cli#install-the-neon-cli).
- If you have not authenticated with the [neonctl auth](/docs/reference/cli-auth) command, running a Neon CLI command automatically launches the Neon CLI browser authentication process. Alternatively, you can specify a Neon API key using the `--api-key` option when running a command. See [Connect](/docs/reference/neon-cli#connect).

For information about projects in Neon, see [Projects](/docs/manage/projects).

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

Only [global options](/docs/reference/neon-cli#global-options) apply.

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

This subcommand allows you to create a Neon project.

The [Neon Free Tier](../introduction/free-tier) supports creating a single project. The [Neon Pro plan](../introduction/pro-plan) allows creating multiple projects.

#### Usage

```bash
neonctl projects create [options]
```

#### Options

In addition to the Neon CLI [global options](/docs/reference/neon-cli#global-options), the `create` subcommand supports these options:

| Option                                | Description                                                                                               | Type    | Required                               |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------- | :-----------------------------------: |
| `--name` | The project name. The project ID is used if a name is not specified.               | string  |                                       |
| `--region-id` | The region ID. Possible values: `aws-us-west-2`, `aws-ap-southeast-1`, `aws-eu-central-1`, `aws-us-east-2`, `aws-us-east-1`. Defaults to `aws-us-east-2` if not specified. | string number  |                                       |

#### Example

```bash
neonctl projects create --name mynewproject --region-id aws-us-west-2
┌───────────────────┬──────────────┬───────────────┬──────────────────────┐
│ Id                │ Name         │ Region Id     │ Created At           │
├───────────────────┼──────────────┼───────────────┼──────────────────────┤
│ muddy-wood-859533 │ mynewproject │ aws-us-west-2 │ 2023-07-09T17:04:29Z │
└───────────────────┴──────────────┴───────────────┴──────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────┐
│ Connection Uri                                                                       │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ postgres://daniel:<password>@ep-bitter-field-476253.us-west-2.aws.neon.tech/neondb   │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

### update

This subcommand allows you to update a Neon project.

#### Usage

```bash
neonctl projects update <id> [options]
```

The `id` is the project ID, which you can obtain by listing your projects or from the **Settings** page in the Neon console.

#### Options

In addition to the Neon CLI [global options](/docs/reference/neon-cli#global-options), the `update` subcommand supports this option:

| Option                                | Description                                                                                               | Type    | Required                               |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------- | :-----------------------------------: |
| `--name` | The project name. The value cannot be empty.               | string  |             &check;                          |

#### Example

```bash
neonctl projects update muddy-wood-859533 --name dev_project_1
┌───────────────────┬───────────────┬───────────────┬──────────────────────┐
│ Id                │ Name          │ Region Id     │ Created At           │
├───────────────────┼───────────────┼───────────────┼──────────────────────┤
│ muddy-wood-859533 │ dev_project_1 │ aws-us-west-2 │ 2023-07-09T17:04:29Z │
└───────────────────┴───────────────┴───────────────┴──────────────────────┘
```

### delete

This subcommand allows you to delete a Neon project.

```bash
neonctl projects delete <id> [options]
```

The `id` is the project ID, which you can obtain by listing your projects or from the **Settings** page in the Neon console.

#### Options

Only [global options](/docs/reference/neon-cli#global-options) apply.

#### Example

```bash
neonctl projects delete muddy-wood-859533
┌───────────────────┬───────────────┬───────────────┬──────────────────────┐
│ Id                │ Name          │ Region Id     │ Created At           │
├───────────────────┼───────────────┼───────────────┼──────────────────────┤
│ muddy-wood-859533 │ dev_project_1 │ aws-us-west-2 │ 2023-07-09T17:04:29Z │
└───────────────────┴───────────────┴───────────────┴──────────────────────┘
```

Information about the deleted project is displayed. You can verify that the project was deleted by running `neonctl projects list`.

### get

This subcommand allows you to retrieve details about a Neon project.

#### Usage

```bash
neonctl projects get <id> [options]
```

The `id` is the project ID, which you can obtain by listing your projects or from the **Settings** page in the Neon console.

#### Options

Only [global options](/docs/reference/neon-cli#global-options) apply.

#### Example

```bash
neonctl projects get muddy-wood-859533
┌───────────────────┬───────────────┬───────────────┬──────────────────────┐
│ Id                │ Name          │ Region Id     │ Created At           │
├───────────────────┼───────────────┼───────────────┼──────────────────────┤
│ muddy-wood-859533 │ dev_project_1 │ aws-us-west-2 │ 2023-07-09T17:04:29Z │
└───────────────────┴───────────────┴───────────────┴──────────────────────┘
```

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
