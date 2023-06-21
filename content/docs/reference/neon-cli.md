---
title: Neon CLI
subtitle: Use the Neon CLI to manage your Neon project directly from your terminal
enableTableOfContents: true
isDraft: true
---

Utilizing the Neon Command Line Interface (CLI), you can operate Neon directly from a terminal or via automation. The Neon CLI facilitates numerous functions, such as authentication, project creation and management, role assignment, and more.

## Get started

This section describes how to install the Neon CLI, `neonctl`.

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

To install Neon CLI, run the following command:

```shell
npm i -g neonctl
```

### Connect

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

  Specifies the path to the `neonctl` configuration file. To view the default configuration directory containing you `credentials.json` file, run `neonctl --help`. The credentials file is created when you authenticate using the `neonctl auth` command. This option is only used if you have moved your `neonctl` configuration file to a location other than the default.

- `--oauth-host`

  Specifies the URL of Neon OAuth host used to authenticate your neonctl client to Neon. The default is `https://oauth2.neon.tech`. You should need to configure this setting when using the `neonctl` CLI client.

- `--client-id`

  Specifies the OAuth client id. For the `neonctl` CLI client, the client id is `neonctl`. You should need to configure this setting when using the `neonctl` CLI client.

- `--api-key`

  Specifies your Neon API key. You can specify an Neon API with your CLI command instead of authenticating using `neonctl auth`. For information about obtaining an Neon API key token, see [Authentication](https://api-docs.neon.tech/reference/authentication), in the _Neon API Reference_.

- `--analytics`

  Enables analytics.
