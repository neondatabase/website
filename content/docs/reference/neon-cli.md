---
title: Neon CLI
subtitle: Use the Neon CLI to manage Neon projects directly from your terminal
enableTableOfContents: true
isDraft: true
---

With the Neon CLI, you can manage Neon directly from your terminal. The Neon CLI supports numerous operations, such as authentication and management of Neon projects, branches, compute endpoints, databases, roles, and more.

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

  If you need to install  `Node.js` or `npm`, refer to instructions on the [official nodejs page](https://nodejs.org) or use the [Node version manager](https://github.com/nvm-sh/nvm).

### Install

To install the Neon CLI, run the following command:

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

The `auth` command launches a browser window where you can authorize the Neon CLI to access your Neon account. Running a Neon CLI command without authenticating with [neonctl auth](/docs/reference/cli-auth) automatically launches the browser authentication process.

Alternatively, you can authenticate a connection with a Neon API key using the `--api-key` option when running a Neon CLI command. For example, an API key is used with the following `neonctl projects list` command:

```bash
neonctl projects list --api-key <neon_api_key>
```

For information about obtaining an Neon API key, see [Authentication](https://api-docs.neon.tech/reference/authentication), in the _Neon API Reference_.

## Configure autocompletion

The Neon CLI supports autocompletion, which you can configure in a few easy steps. See [Neon CLI commands — completion](/docs/reference/cli-completion) for instructions.

## Commands

| Command                                                 | Subcommands                            | Description               |
|---------------------------------------------------------|----------------------------------------|---------------------------|
| [auth](../reference/cli-auth)                                     |                                        | Authenticate              |
| [projects](../reference/cli-projects)                             | `list`, `create`, `update`, `delete`, `get` | Manage projects           |
| [me](../reference/cli-me)                                         |                                        | Show current user         |
| [branches](../reference/cli-branches)                             | `list`, `create`, `update`, `delete`, `get` | Manage branches           |
| [databases](../reference/cli-databases)                           | `list`, `create`, `delete`             | Manage databases          |
| [roles](../reference/cli-roles)                                   | `list`, `create`,  `delete`            | Manage roles              |
| [operations](../reference/cli-operations)                         | `list`                                 | Manage operations         |
| [connection-string](../reference/cli-connection-string)           |                                        | Get connection string     |
| [completion](../reference/completion)           |                                        | Generate a completion script     |

## Global options

Global options are supported with any Neon CLI command.

| Option      | Description                         | Type   | Default                           |
| :---------  | :---------------------------------- | :----- | :-------------------------------- |
| [--version](#version)   | Show the Neon CLI version number                 | boolean| -                                 |
| [--help](#help)      | Show the Neon CLI help                           | boolean| -                                 |
| [-o, --output](#output)| Set the Neon CLI output format (`json`, `yaml`, or `table`)                 | string | table                           |
| [--config-dir](#config-dir)| Path to the Neon CLI configuration directory            | string | `/home/<user>/.config/neonctl`   |
| [--api-key](#api-key)   | Neon API key                             | string | ""                                |
| [--analytics](#analytics) | Manage analytics                    | boolean| true                              |

- <a id="version"></a>`--version`

  Shows the Neon CLI version number.

  ```bash
  $ neonctl --version
  1.14.0
  ```

- <a id="help"></a>`--help`

  Shows the `neonctl` command-line help. You can view help for `neonctl` or a `neonctl` command.

  ```bash
  neonctl --help
  ```

  To view the options supported by a particular command:

  ```bash
  neonctl <command> --help
  ```

- <a id="output"></a>`--output`

  Sets the output format. Supported options are `json`, `yaml`, and `table`. The default is `table`. Table output may limited to a certain number of columns. The `json` and `yaml` output formats show all output.

  ```bash
  neonctl me --output json
  ```

- <a id="config-dir"></a>`--config-dir`

  Specifies the path to the `neonctl` configuration file. To view the default configuration directory containing you `credentials.json` file, run `neonctl --help`. The credentials file is created when you authenticate using the `neonctl auth` command. This option is only necessary if you move your `neonctl` configuration file to a location other than the default.

  ```bash
  neonctl projects list --config-dir /home/dtprice/.config/neonctl
  ```

- <a id="api-key"></a>`--api-key`

  Specifies your Neon API key. You can authenticate using a Neon API key when running a Neon CLI command instead of using `neonctl auth`. For information about obtaining an Neon API key, see [Authentication](https://api-docs.neon.tech/reference/authentication), in the _Neon API Reference_.

  ```bash
  neonctl <command> --api-key <neon_api_key>
  ```

- <a id="analytics"></a>`--analytics`

  Analytics are enabled by default to gather information about the CLI commands and options that are used by our customers. This data collection assists in offering support, and allows for a better understanding of typical usage patterns so that we can improve user experience. Neon does not collect user-defined data, such as project IDs or command payloads. To opt-out of analytics data collection, specify `--no-analytics` or `--analytics false`.
