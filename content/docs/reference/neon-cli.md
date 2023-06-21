---
title: Neon CLI
subtitle: Use the Neon CLI to manage your Neon project directly from your terminal
enableTableOfContents: true
isDraft: true
---

Utilizing the Neon Command Line Interface (CLI), you can operate Neon directly from a terminal or via automation. The Neon CLI supports numerous functions, such as authentication, management of Neon projects, branches, compute endpoints, databases, roles, and more.

The Neon CLI command name is `neonctl`. The GitHub repository for the Neon CLI is found [here](https://github.com/neondatabase/neonctl).

## Install the Neon CLI

This section describes how to install the Neon CLI.

### Prerequisites

Before installing, ensure that you have met the following prerequisites:

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

To install, run the following command:

```shell
npm i -g neonctl
```

### Upgrade

To upgrade to the latest version of the Neon CLI, simply run the `npm i -g neonctl` command again.

## Connect

Run the following command to authenticate a connection to Neon:

```bash
neonctl auth
```

The command launches a browser window where you can authorize the Neon CLI to access your Neon account.

Alternatively, you can authenticate a connection with a Neon API key using the `--api-key` option when executing a command. For example:

```bash
neonctl <command> --api-key <neon_api_key>
```

For information about obtaining an Neon API key, see [Authentication](https://api-docs.neon.tech/reference/authentication), in the _Neon API Reference_.

## Commands

| Command                                                 | Subcommands                            | Description               |
|---------------------------------------------------------|----------------------------------------|---------------------------|
| [auth](../reference/cli-auth)                                     |                                        | Authenticate              |
| [projects](../reference/cli-projects)                             | `list`, `create`, `update`, `delete`, `get` | Manage projects           |
| [me](../reference/cli-me)                                         |                                        | Show current user         |
| [branches](../reference/cli-branches)                             | `list`, `create`, `update`, `delete`, `get` | Manage branches           |
| [endpoints](../reference/cli-endpoints)                           | `list`, `create`, `update`, `delete`, `get` | Manage endpoints          |
| [databases](../reference/cli-databases)                           | `list`, `create`, `delete`             | Manage databases          |
| [roles](../reference/cli-roles)                                   | `list`, `create`,  `delete`            | Manage roles              |
| [operations](../reference/cli-operations)                         | `list`                                 | Manage operations         |
| [connection-string](../reference/cli-connection-string)           |                                        | Get connection string     |

## Global options

Global options are supported for use with any Neon CLI command.

| Option      | Description                         | Type   | Default                           |
| :---------  | :---------------------------------- | :----- | :-------------------------------- |
| [--version](#version)   | Show version number                 | boolean| -                                 |
| [--help](#help)      | Show help                           | boolean| -                                 |
| [-o, --output](#output)| Set output format                   | string | table                           |
|             | Possible choices: "json", "yaml", "table" | |                                  |
| [--api-host](#api-host)  | The API host                        | -      | https://console.neon.tech/api/v2|
| [--config-dir](#config-dir)| Path to config directory            | string | `/home/<user>/.config/neonctl`   |
| [--oauth-host](#oauth-host)| URL to Neon OAuth host              | -      | https://oauth2.neon.tech        |
| [--client-id](#client-id) | OAuth client id                     | string | neonctl                         |
| [--api-key](#api-key)   | API key                             | string | ""                                |
| [--analytics](#analytics) | Enable analytics                    | boolean| true                              |

### --version

  Shows the `neonctl` version number.

  ```bash
  $ neonctl --version
  1.9.4
  ```

### --help

  Shows the `neonctl` command-line help. You can view help for `neonctl` or a `neonctl` command.

  ```bash
  neonctl --help
  ```

  To view the options supported by a particular command:

  ```bash
  neonctl <command> --help
  ```

### --output

Sets the output format. Supported options are `json`, `yaml`, and `table`. The default is `table`. Table output may limited to a certain number of columns. The `json` and `yaml` show all output.

```bash
neonctl me --output json
```

### --api-host

Specifies the Neon API host (the base URL for the Neon API) when running a CLI command. The default setting is `https://console.neon.tech/api/v2`, which is the base URL for Neon's public API. Generally, you should not have to specify a different value unless directed to do so by Neon. For more information, see [Neon API base URL](https://api-docs.neon.tech/reference/getting-started-with-neon-api#neon-api-base-url).

```bash
neonctl projects list --api-host https://console.neon.tech/api/v2
```

### --config-dir

Specifies the path to the `neonctl` configuration file. To view the default configuration directory containing you `credentials.json` file, run `neonctl --help`. The credentials file is created when you authenticate using the `neonctl auth` command. This option is only necessary if you move your `neonctl` configuration file to a location other than the default.

### --oauth-host

Specifies the URL of Neon OAuth host used to authenticate your neonctl client to Neon. The default is `https://oauth2.neon.tech`. You should need to configure this setting when using the `neonctl` CLI client.

### --client-id

Specifies the OAuth `client-id`. For the the Neon CLI client, the `client-id` is `neonctl`. You do not need to configure this setting when using the Neon CLI client.

### --api-key

Specifies your Neon API key. You can authenticate using a Neon API key when running a Neon CLI command instead of using `neonctl auth`. For information about obtaining an Neon API key token, see [Authentication](https://api-docs.neon.tech/reference/authentication), in the _Neon API Reference_.

```bash
neonctl <command> --api-key <token>
```

### --analytics

Enables analytics.
