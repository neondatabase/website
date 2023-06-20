---
title: Neon CLI
subtitle: Use the Neon CLI to manage Neon projects from the command line
enableTableOfContents: true
isDraft: true
---

Utilizing the Neon Command Line Interface (CLI), you can operate Neon directly from a terminal or via automation. The Neon CLI facilitates numerous functions, such as authentication, project creation and management, role assignment, and more.

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

Usage:

```bash
neonctl projects <cmd> [args]
```

Commands:

```bash
  neonctl projects list
  neonctl projects create
  neonctl projects update
  neonctl projects delete
  neonctl projects get
```

### projects list

List projects that belong to your account.

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

Create a project. You are prompted for a project name, which is optional. Press the Enter key to have a project name generated for you.

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

### projects update

Update a project

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

### projects delete

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

### projects get

Get project details.

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

## branches

For creating and managing branches in a Neon project.

Usage:

```bash
neonctl branches <cmd> [args]
```

Commands:

```bash
neonctl branches list
neonctl branches create
neonctl branches update
neonctl branches delete
neonctl branches get
```

### branches list

List the branches that belong to a Neon project.

```bash
neonctl branches list --project.id spring-sky-578180
branch
┌───────────────────────┬──────┬──────────────────────┐
│ Id                    │ Name │ Created At           │
├───────────────────────┼──────┼──────────────────────┤
│ br-autumn-dust-190886 │ main │ 2023-06-19T18:27:19Z │
└───────────────────────┴──────┴──────────────────────┘
```

#### Options

| Option       | Description   | Type   | Default  |
| ------------ | ------------- | ------ | -------- |
| --project.id | Project ID    | string | Required |

### branches create

Create a branch in a Neon project.

```bash
neonctl branches create --project.id spring-sky-578180
branch
┌─────────────────────────┬─────────────────────────┬──────────────────────┐
│ Id                      │ Name                    │ Created At           │
├─────────────────────────┼─────────────────────────┼──────────────────────┤
│ br-withered-king-763176 │ br-withered-king-763176 │ 2023-06-19T22:35:25Z │
└─────────────────────────┴─────────────────────────┴──────────────────────┘
```

#### Options

| Option                                    | Description                                                                               | Type    | Default                               |
| ----------------------------------------- | ----------------------------------------------------------------------------------------- | ------- | ------------------------------------- |
| --project.id                              | Project ID                                                                                | string  | Required                              |
| --branch.parent_id                        | The `branch_id` of the parent branch                                                      | string  |                                       |
| --branch.name                             | The branch name                                                                           | string  |                                       |
| --branch.parent_lsn                       | A Log Sequence Number (LSN) on the parent branch. The branch will be created with data from this LSN | string  |                                       |
| --branch.parent_timestamp                 | A timestamp identifying a point in time on the parent branch. The branch will be created with data starting from this point in time | string  |                                       |
| --endpoint.type                           | The compute endpoint type. Either `read_write` or `read_only`. The `read_only` compute endpoint type is not yet supported | string  | "read_only", "read_write"             |
| --endpoint.provisioner                    | The Neon compute provisioner                                                              | string  | "k8s-pod", "k8s-neonvm", "docker"     |
| --endpoint.suspend_timeout_seconds        | Duration of inactivity in seconds after which endpoint will be automatically suspended. Value `0` means use global default, `-1` means never suspend. Maximum value is 1 week in seconds | number  |                                       |

### branches update

Update a branch in a Neon project. Only the branch name can be modified.

```bash
neonctl branches update --project.id spring-sky-578180 --branch.id br-withered-king-763176 --branch.name mynewbranch
┌─────────────────────────┬─────────────┬──────────────────────┐
│ Id                      │ Name        │ Created At           │
├─────────────────────────┼─────────────┼──────────────────────┤
│ br-withered-king-763176 │ mynewbranch │ 2023-06-19T22:35:25Z │
└─────────────────────────┴─────────────┴──────────────────────┘
```

#### Options

| Option        | Description | Type   | Default  |
| ------------- | ----------- | ------ | -------- |
| --project.id  | Project ID  | string | Required |
| --branch.name |             | string |          |
| --branch.id   | Branch ID   | string | Required |

### branches delete

Delete a branch from a Neon project.

```bash
neonctl branches delete --project.id spring-sky-578180 --branch.id br-withered-king-763176
┌─────────────────────────┬─────────────┬──────────────────────┐
│ Id                      │ Name        │ Created At           │
├─────────────────────────┼─────────────┼──────────────────────┤
│ br-withered-king-763176 │ mynewbranch │ 2023-06-19T22:35:25Z │
└─────────────────────────┴─────────────┴──────────────────────┘
```

#### Options

| Option        | Description | Type   | Default  |
| ------------- | ----------- | ------ | -------- |
| --project.id  | Project ID  | string | Required |
| --branch.id   | Branch ID   | string | Required |

### branches get

Get branch details.

```bash
neonctl branches get --project.id spring-sky-578180 --branch.id br-sweet-sun-522796 
┌─────────────────────┬─────────────────────┬──────────────────────┐
│ Id                  │ Name                │ Created At           │
├─────────────────────┼─────────────────────┼──────────────────────┤
│ br-sweet-sun-522796 │ br-sweet-sun-522796 │ 2023-06-19T22:35:20Z │
└─────────────────────┴─────────────────────┴──────────────────────┘
```

#### Options

| Option        | Description | Type   | Default  |
| ------------- | ----------- | ------ | -------- |
| --project.id  | Project ID  | string | Required |
| --branch.id   | Branch ID   | string | Required |

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

### endpoints list

#### Options

| Option        | Description | Type   | Default  |
| ------------- | ----------- | ------ | -------- |
| --project.id  | Project ID  | string | Required |
| --branch.id   | Branch ID   | string | Required |

### endpoints create

```bash
neonctl endpoints create --project.id spring-sky-578180 --endpoint.branch_id br-sweet-sun-522796 --endpoint.type read_write
┌───────────────────────┬──────────────────────┬─────────────────────┬────────────┬───────────────┐
│ Id                    │ Created At           │ Branch Id           │ Type       │ Current State │
├───────────────────────┼──────────────────────┼─────────────────────┼────────────┼───────────────┤
│ ep-tight-paper-779179 │ 2023-06-19T23:04:27Z │ br-sweet-sun-522796 │ read_write │ init          │
└───────────────────────┴──────────────────────┴─────────────────────┴────────────┴───────────────┘
```

#### Options

| Option                                     | Description                                                                                                                           | Type    | Default                                |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- | ------- | -------------------------------------- |
| --project.id                               | Project ID                                                                                                                            | string  | Required                               |
| --endpoint.branch_id                       | The ID of the branch the compute endpoint will be associated with                                                                     | string  | Required                               |
| --endpoint.region_id                       | The region where the compute endpoint will be created. Only the project's `region_id` is permitted                                    | string  |                                        |
| --endpoint.type                            | The compute endpoint type. Either `read_write` or `read_only`. The `read_only` compute endpoint type is not yet supported             | string  | "read_only", "read_write"  Required     |
| --endpoint.provisioner                     | The Neon compute provisioner                                                                                                          | string  | "k8s-pod", "k8s-neonvm", "docker"      |
| --endpoint.pooler_enabled                  | Whether to enable connection pooling for the compute endpoint                                                                         | boolean |                                        |
| --endpoint.pooler_mode                     | The connection pooler mode. Neon supports PgBouncer in `transaction` mode only                                                        | string  | "transaction"                          |
| --endpoint.disabled                        | Whether to restrict connections to the compute endpoint                                                                               | boolean |                                        |
| --endpoint.passwordless_access             | NOT YET IMPLEMENTED. Whether to permit passwordless access to the compute endpoint                                                    | boolean |                                        |
| --endpoint.suspend_timeout_seconds         | Duration of inactivity in seconds after which endpoint will be automatically suspended. Value `0` means use global default, `-1` means never suspend. Maximum value is 1 week in seconds | number  |                                        |

### endpoints update

Update an endpoint in a Neon project.

```bash
neonctl endpoints update --project.id spring-sky-578180 --endpoint.id ep-tight-paper-779179 --endpoint.suspend_timeout_seconds 600
```

#### Options

| Option                                     | Description                                                                                                                           | Type    | Default                                |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- | ------- | -------------------------------------- |
| --project.id                               | Project ID                                                                                                                            | string  | Required                               |
| --endpoint.id                              | Endpoint ID                                                                                                                           | string  | Required                               |
| --endpoint.branch_id                       | The destination branch ID. The destination branch must not have an existing read-write endpoint                                       | string  |                                        |
| --endpoint.provisioner                     | The Neon compute provisioner                                                                                                          | string  | "k8s-pod", "k8s-neonvm", "docker"      |
| --endpoint.pooler_enabled                  | Whether to enable connection pooling for the compute endpoint                                                                         | boolean |                                        |
| --endpoint.pooler_mode                     | The connection pooler mode. Neon supports PgBouncer in `transaction` mode only                                                        | string  | "transaction"                          |
| --endpoint.disabled                        | Whether to restrict connections to the compute endpoint                                                                               | boolean |                                        |
| --endpoint.passwordless_access             | NOT YET IMPLEMENTED. Whether to permit passwordless access to the compute endpoint                                                    | boolean |                                        |
| --endpoint.suspend_timeout_seconds         | Duration of inactivity in seconds after which endpoint will be automatically suspended. Value `0` means use global default, `-1` means never suspend. Maximum value is 1 week in seconds | number  |                                        |

### endpoints delete

Delete an end point from a Neon project.

```bash
neonctl endpoints delete --project.id spring-sky-578180 --endpoint.id ep-tight-paper-779179
┌───────────────────────┬──────────────────────┬─────────────────────┬────────────┬───────────────┐
│ Id                    │ Created At           │ Branch Id           │ Type       │ Current State │
├───────────────────────┼──────────────────────┼─────────────────────┼────────────┼───────────────┤
│ ep-tight-paper-779179 │ 2023-06-19T23:04:27Z │ br-sweet-sun-522796 │ read_write │ idle          │
└───────────────────────┴──────────────────────┴─────────────────────┴────────────┴───────────────┘
```

#### Options

| Option       | Description  | Type   | Default  |
| ------------ | ------------ | ------ | -------- |
| --project.id | Project ID   | string | Required |
| --endpoint.id| Endpoint ID  | string | Required |

### endpoints get

Get endpoint details.

```bash
neonctl endpoints get --project.id spring-sky-578180 --endpoint.id ep-tight-paper-779179
┌───────────────────────┬──────────────────────┬─────────────────────┬────────────┬───────────────┐
│ Id                    │ Created At           │ Branch Id           │ Type       │ Current State │
├───────────────────────┼──────────────────────┼─────────────────────┼────────────┼───────────────┤
│ ep-tight-paper-779179 │ 2023-06-19T23:04:27Z │ br-sweet-sun-522796 │ read_write │ idle          │
└───────────────────────┴──────────────────────┴─────────────────────┴────────────┴───────────────┘
```

#### Options

| Option       | Description  | Type   | Default  |
| ------------ | ------------ | ------ | -------- |
| --project.id | Project ID   | string | Required |
| --endpoint.id| Endpoint ID  | string | Required |

## databases

For creating and managing databases in a Neon project.

Usage:

```bash
neonctl databases <cmd> [args]
```

Commands:

```bash
neonctl databases list
neonctl databases create
neonctl databases update
neonctl databases delete
neonctl databases get
```

### databases list

List the databases in the specified branch.

```bash
```

#### Options

| Option        | Description | Type   | Default  |
| ------------- | ----------- | ------ | -------- |
| --project.id  | Project ID  | string | Required |
| --branch.id   | Branch ID   | string | Required |

### databases create

Create a database in the specified branch.

```bash
neonctl databases create --project.id spring-sky-578180 --branch.id br-autumn-dust-190886 --database.name mynewdb --database.owner_name daniel
┌─────────┬────────────┬──────────────────────┐
│ Name    │ Owner Name │ Created At           │
├─────────┼────────────┼──────────────────────┤
│ mynewdb │ daniel     │ 2023-06-19T23:45:45Z │
└─────────┴────────────┴──────────────────────┘
```

#### Options

| Option               | Description                          | Type   | Default  |
| -------------------- | ------------------------------------ | ------ | -------- |
| --project.id         | Project ID                           | string | Required |
| --branch.id          | Branch ID                            | string | Required |
| --database.name      | The name of the database             | string | Required |
| --database.owner_name| The name of the role that owns the database | string | Required |

### databases delete

Delete the specified database.

```bash
neonctl databases delete --project.id spring-sky-578180 --branch.id br-autumn-dust-190886 --database.name mynewdb
┌─────────┬────────────┬──────────────────────┐
│ Name    │ Owner Name │ Created At           │
├─────────┼────────────┼──────────────────────┤
│ mynewdb │ daniel     │ 2023-06-19T23:45:45Z │
└─────────┴────────────┴──────────────────────┘
```

#### Options

| Option           | Description  | Type   | Default  |
| ---------------- | ------------ | ------ | -------- |
| --project.id     | Project ID   | string | Required |
| --branch.id      | Branch ID    | string | Required |
| --database.name  | Database name| string | Required |

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

### roles list

```bash
neonctl roles list --project.id spring-sky-578180 --branch.id br-autumn-dust-190886 
┌────────┬──────────────────────┐
│ Name   │ Created At           │
├────────┼──────────────────────┤
│ daniel │ 2023-06-19T18:27:19Z │
└────────┴──────────────────────┘
```

#### Options

| Option        | Description | Type   | Default  |
| ------------- | ----------- | ------ | -------- |
| --project.id  | Project ID  | string | Required |
| --branch.id   | Branch ID   | string | Required |

### roles create

```bash
neonctl roles create --project.id spring-sky-578180 --branch.id br-autumn-dust-190886 --role.name sally
┌───────┬──────────────────────┐
│ Name  │ Created At           │
├───────┼──────────────────────┤
│ sally │ 2023-06-20T00:43:17Z │
└───────┴──────────────────────┘
```

#### Options

| Option       | Description                                    | Type   | Default  |
| ------------ | ---------------------------------------------- | ------ | -------- |
| --project.id | Project ID                                     | string | Required |
| --branch.id  | Branch ID                                      | string | Required |
| --role.name  | The role name. Cannot exceed 63 bytes in length| string | Required |

### roles delete

```bash
neonctl roles delete --project.id spring-sky-578180 --branch.id br-autumn-dust-190886 --role.name sally
┌───────┬──────────────────────┐
│ Name  │ Created At           │
├───────┼──────────────────────┤
│ sally │ 2023-06-20T00:43:17Z │
└───────┴──────────────────────┘
```

#### Options

| Option       | Description                                    | Type   | Default  |
| ------------ | ---------------------------------------------- | ------ | -------- |
| --project.id | Project ID                                     | string | Required |
| --branch.id  | Branch ID                                      | string | Required |
| --role.name  | The role name. Cannot exceed 63 bytes in length| string | Required |

## operations

For viewing operations in a Neon project.

Usage:

```bash
neonctl operations <cmd> [args]
```

Commands:

```bash
  neonctl operations list
```

### operations list

List project operations.

```bash
neonctl operations list --project.id spring-sky-578180 

┌──────────────────────────────────────┬────────────────────┬──────────┬──────────────────────┐
│ Id                                   │ Action             │ Status   │ Created At           │
├──────────────────────────────────────┼────────────────────┼──────────┼──────────────────────┤
│ fce8642e-259e-4662-bdce-518880aee723 │ apply_config       │ finished │ 2023-06-20T00:45:19Z │
├──────────────────────────────────────┼────────────────────┼──────────┼──────────────────────┤
│ dc1dfb0c-b854-474b-be20-2ea1d2172563 │ apply_config       │ finished │ 2023-06-20T00:43:17Z │
├──────────────────────────────────────┼────────────────────┼──────────┼──────────────────────┤
│ 7a83e300-cf5f-4c1a-b9b5-569b6d6feab9 │ suspend_compute    │ finished │ 2023-06-19T23:50:56Z │
└──────────────────────────────────────┴────────────────────┴──────────┴──────────────────────┘
```

#### Options

| Option       | Description | Type   | Default  |
| ------------ | ----------- | ------ | -------- |
| --project.id | Project ID  | string | Required |

### connection-string

Create a connection string for connecting to Neon. The connection string includes the password forthe specified user.

```bash
neonctl connection-string --project.id spring-sky-578180 --endpoint.id ep-still-haze-361517 --role.name daniel --database.name neondb
postgres://daniel:<password>@ep-still-haze-361517.us-east-2.aws.neon.tech/neondb
```

#### Options

| Option        | Description  | Type   | Default  |
| ------------- | ------------ | ------ | -------- |
| --project.id  | Project ID   | string | Required |
| --endpoint.id | Endpoint ID  | string | Required |
| --role.name   | Role name    | string | Required |
| --database.name| Database name| string | Required |
