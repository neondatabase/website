---
title: Neon CLI
subtitle: Use the Neon CLI to manage Neon projects from the command line
enableTableOfContents: true
isDraft: true
---

Utilizing the Neon Command Line Interface (CLI), you can operate Neon directly from a terminal or via automation. The Neon CLI facilitates numerous functions, such as authentication, project creation and management, role assignment, and more.

## Synopsis

The `neonctl` command can be called from the command line. Without any arguments, it displays command usage and help:

```bash
neonctl --help
usage: neonctl <cmd> [args]

Commands:
  neonctl auth               Authenticate
  neonctl projects           Manage projects
  neonctl me                 Show current user
  neonctl branches           Manage branches
  neonctl endpoints          Manage endpoints
  neonctl databases          Manage databases
  neonctl roles              Manage roles
  neonctl operations         Manage operations
  neonctl connection-string  Get connection string                 [aliases: cs]

Options:
      --version     Show version number                                [boolean]
      --help        Show help                                          [boolean]
  -o, --output      Set output format
                  [string] [choices: "json", "yaml", "table"] [default: "table"]
      --api-host    The API host   [default: "https://console.neon.tech/api/v2"]
      --config-dir  Path to config directory
                             [string] [default: "/home/<user>/.config/neonctl"]
      --oauth-host  URL to Neon OAUTH host [default: "https://oauth2.neon.tech"]
      --client-id   OAuth client id                [string] [default: "neonctl"]
      --api-key     API key                               [string] [default: ""]
```

## Installation

This section describes how to install the `neonctl` command-line interface tool.

### Prerequisites

- Node.js 16.0 or higher. To check if you already have Node.js, run the following command:

    ```shell
    node -v
    ```

- The `npm` package manager.  To check if you already have `npm`, run the following command:

   ```shell
   npm -v
   ```

If you need to install either `Node.js` or `npm`, refer to the instructions for your operating system, which you can find online.

### Install

To download and install Neon CLI, run the following command:

```shell
npm i -g neonctl
```

## Connect

To authenticate to Neon, run the following command:

```bash
neonctl auth
```

The command launches a browser window where you can authorize the Neon CLI to access your Neon account.

Alternatively, you can connect with a Neon API key using the `--api-key` option. For example:

```bash
neonctl <cmd> --api-key <token>
```

For information about obtaining an Neon API key token, see [Authentication](https://api-docs.neon.tech/reference/authentication), in the _Neon API Reference_.

## Global options

- `--version`

  Shows the `neonctl` version number.

  ```bash
  $ neonctl --version
  1.9.3
  ```

- `--help`

  Shows the `neonctl` command-line help. See [Synopsis](#synopsis).

- `--output`

  Sets the output format. Supported options are `json`, `yaml`, and `table`. The default is `table`.

  ```bash
  neonctl me --output json
  ```

- `--api-host`

  Specifies the Neon API host (the base URL for the Neon API) when running a CLI command. The default setting is `https://console.neon.tech/api/v2`. For more information, see [Neon API base URL](https://api-docs.neon.tech/reference/getting-started-with-neon-api#neon-api-base-url).

  ```bash
  neonctl projects list --api-host https://console.neon.tech/api/v2
  ```

- `--config-dir`

  Sets the path to the `neonctl` configuration file. To view the default configuration directory containing you `credentials.json` file, run `neonctl --help`. The credentials file is created when you authenticate using the `neonctl auth` command. This option is only used if you have moved your `neonctl` configuration file to a location other than the default.

- `--oauth-host`

  Sets the URL of Neon OAuth host used to authenticate your neonctl client to Neon. The default is `https://oauth2.neon.tech`. You should need to configure this setting when using the `neonctl` CLI client.

- `--client-id`

  Sets the OAuth client id. For the `neonctl` CLI client, the client id is `neonctl`. You should need to configure this setting when using the `neonctl` CLI client.

- `--api-key`

  Specifies your Neon API key. You can specify an Neon API with your CLI command instead of authenticating using `neonctl auth`. For information about obtaining an Neon API key token, see [Authentication](https://api-docs.neon.tech/reference/authentication), in the _Neon API Reference_.

- `--analytics`

Enables analytics.

## auth

Authenticates the user or caller to Neon.

```bash
neonctl auth
```

The command launches a browser window where you can authorize the Neon CLI to access your Neon account. After granting permission, your credentials are saved locally to a configuration file named `credentials.json`.

```text
/home/<home>/.config/neonctl/credentials.json
```

## me

Returns information about the authenticated user.

```bash
$> neonctl me
┌────────────────┬──────────────────────────┬────────────┬────────────────┐
│ Login          │ Email                    │ Name       │ Projects Limit │
├────────────────┼──────────────────────────┼────────────┼────────────────┤
│ user1          │ user1@example.com        │ User1      │ 1              │
└────────────────┴──────────────────────────┴────────────┴────────────────┘
```

## projects

For creating and managing Neon projects.

### Usage

```bash
neonctl projects <cmd> [args]
```

### Commands

```bash
  neonctl projects list
  neonctl projects create
  neonctl projects update
  neonctl projects delete
  neonctl projects get
```

### projects list

List projects

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

### projects create

Create a project

#### Options

| Option                                | Description                                                                                               | Type    | Default                               |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------- | ------------------------------------- |
| --version                             | Show version number                                                                                       | boolean |                                       |
| --help                                | Show help                                                                                                 | boolean |                                       |
| -o, --output                          | Set output format                                                                                         | string  | "table"                               |
| --api-host                            | The API host                                                                                              |         | "https://console.neon.tech/api/v2"    |
| --config-dir                          | Path to config directory                                                                                  | string  | "/home/dtprice/.config/neonctl"       |
| --oauth-host                          | URL to Neon OAuth host                                                                                    |         | "https://oauth2.neon.tech"            |
| --client-id                           | OAuth client id                                                                                           | string  | "neonctl"                             |
| --api-key                             | API key                                                                                                   | string  | ""                                    |
| --analytics                           | Enable analytics                                                                                          | boolean | true                                  |
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

### update

Update a project

### delete

Delete a project

### get

Get a project

## branches

For creating and managing branches in a Neon project.

### Usage

```bash
neonctl branches <cmd> [args]
```

### Commands

```bash
neonctl branches list
neonctl branches create
neonctl branches update
neonctl branches delete
neonctl branches get
```

### list

List branches

### create

Create a branch

### update

### delete

### get

## endpoints

For creating and managing endpoints in a Neon project.

### Usage

```bash
neonctl endpoints <cmd> [args]
```

### Commands

```bash
neonctl endpoints list
neonctl endpoints create
neonctl endpoints update
neonctl endpoints delete
neonctl endpoints get
```

### list

### create

### update

### delete

### get

## databases

For creating and managing databases in a Neon project.

### Usage

```bash
neonctl databases <cmd> [args]
```

### Commands

```bash
neonctl databases list
neonctl databases create
neonctl databases update
neonctl databases delete
neonctl databases get
```

### list

### create

### delete

## roles

For creating and managing roles in a Neon project.

### Usage

```bash
neonctl roles <cmd> [args]
```

### Commands

```bash
  neonctl roles list
  neonctl roles create
  neonctl roles update
  neonctl roles delete
  neonctl roles get
```

### list

### create

### delete

## operations

For viewing operations in a Neon project.

### Usage

```bash
neonctl operations <cmd> [args]
```

### Commands

```bash
  neonctl operations list
```

### operations list

## connection-string
