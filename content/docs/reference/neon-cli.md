---
title: Neon CLI
subtitle: Use the Neon CLI to manage Neon directly from the terminal
enableTableOfContents: true
updatedOn: '2023-10-07T10:43:33.425Z'
---

The Neon CLI is a command-line interface that lets you manage Neon directly from the terminal. This documentation references all commands and options available in the Neon CLI.

For installation instructions, see [Neon CLI — Install and connect](/docs/reference/cli-install).

## Synopsis

```bash
neonctl --help
usage: neonctl <command> [options]

Commands:
  neonctl auth                        Authenticate              [aliases: login]
  neonctl me                          Show current user
  neonctl projects                    Manage projects         [aliases: project]
  neonctl branches                    Manage branches          [aliases: branch]
  neonctl databases                   Manage databases   [aliases: database, db]
  neonctl roles                       Manage roles               [aliases: role]
  neonctl operations                  Manage operations     [aliases: operation]
  neonctl connection-string [branch]  Get connection string        [aliases: cs]
  neonctl set-context                 Set the current context
  neonctl completion                  generate completion script

Global options:
  -o, --output      Set output format
                  [string] [choices: "json", "yaml", "table"] [default: "table"]
      --config-dir  Path to config directory
                             [string] [default: ""]
      --api-key     API key  [string] [default: ""]
      --analytics   Manage analytics. Example: --no-analytics, --analytics false
                                                       [boolean] [default: true]
  -v, --version     Show version number                                [boolean]
  -h, --help        Show help                                          [boolean]
```

## Commands

| Command                                                 | Subcommands                            | Description               |
|---------------------------------------------------------|----------------------------------------|---------------------------|
| [auth](../reference/cli-auth)                                     |                                        | Authenticate              |
| [me](../reference/cli-me)                                         |                                        | Show current user         |
| [projects](../reference/cli-projects)                             | `list`, `create`, `update`, `delete`, `get` | Manage projects           |
| [branches](../reference/cli-branches)                             | `list`, `create`, `reset`, `rename`, `add-compute`, `set-primary`, `delete`, `get` | Manage branches           |
| [databases](../reference/cli-databases)                           | `list`, `create`, `delete`             | Manage databases          |
| [roles](../reference/cli-roles)                                   | `list`, `create`,  `delete`            | Manage roles              |
| [operations](../reference/cli-operations)                         | `list`                                 | Manage operations         |
| [connection-string](../reference/cli-connection-string)           |                                        | Get connection string     |
| [set-context](../reference/cli-set-context)                       | `project-id`, `branch`                 | Set context for session   |
| [completion](../reference/cli-completion)                         |                                        | Generate a completion script     |

## Global options

Global options are supported with any Neon CLI command.

| Option      | Description                         | Type   | Default                           |
| :---------  | :---------------------------------- | :----- | :-------------------------------- |
| [-o, --output](#output)| Set the Neon CLI output format (`json`, `yaml`, or `table`)                 | string | table                           |
| [--config-dir](#config-dir)| Path to the Neon CLI configuration directory            | string | `/home/<user>/.config/neonctl`   |
| [--api-key](#api-key)   | Neon API key                             | string | `NEON_API_KEY` environment variable                                |
| [--analytics](#analytics) | Manage analytics                    | boolean| true                              |
| [-v, --version](#version)   | Show the Neon CLI version number                 | boolean| -                                 |
| [-h, --help](#help)      | Show the Neon CLI help                           | boolean| -                                 |

- <a id="output"></a>`-o, --output`

  Sets the output format. Supported options are `json`, `yaml`, and `table`. The default is `table`. Table output may be limited. The `json` and `yaml` output formats show all data.

  ```bash
  neonctl me --output json
  ```

- <a id="config-dir"></a>`--config-dir`

  Specifies the path to the `neonctl` configuration directory. To view the default configuration directory containing you `credentials.json` file, run `neonctl --help`. The credentials file is created when you authenticate using the `neonctl auth` command. This option is only necessary if you move your `neonctl` configuration file to a location other than the default.

  ```bash
  neonctl projects list --config-dir /home/<user>/.config/neonctl
  ```

- <a id="api-key"></a>`--api-key`

  Specifies your Neon API key. You can authenticate using a Neon API key when running a Neon CLI command instead of using `neonctl auth`. For information about obtaining an Neon API key, see [Create an API key](https://neon.tech/docs/manage/api-keys#create-an-api-key).

  ```bash
  neonctl <command> --api-key <neon_api_key>
  ```

  To avoid including the `--api-key` option with each CLI command, you can export your API key to the `NEON_API_KEY` environment variable.

  ```bash
  export NEON_API_KEY=<neon_api_key>
  ```
  
  <Admonition type="info">
  The authentication flow for the Neon CLI follows this order:

  - If the `--api-key` option is provided, it is used for authentication.
  - If the `--api-key` option is not provided, the `NEON_API_KEY` environment variable setting is used.
  - If there is no `--api-key` option or `NEON_API_KEY` environment variable setting, the CLI looks for the `credentials.json` file created by the `neonctl auth` command.
  - If the credentials file is not found, the Neon CLI initiates the `neonctl auth` web authentication process.
  </Admonition>
  
- <a id="analytics"></a>`--analytics`

  Analytics are enabled by default to gather information about the CLI commands and options that are used by our customers. This data collection assists in offering support, and allows for a better understanding of typical usage patterns so that we can improve user experience. Neon does not collect user-defined data, such as project IDs or command payloads. To opt-out of analytics data collection, specify `--no-analytics` or `--analytics false`.

- <a id="version"></a>`-v, --version`

  Shows the Neon CLI version number.

  ```bash
  $ neonctl --version
  1.15.0
  ```

- <a id="help"></a>`-h, --help`

  Shows the `neonctl` command-line help. You can view help for `neonctl`, a `neonctl` command, or a `neonctl` subcommand, as shown in the following examples:

  ```bash
  neonctl --help
 
  neonctl branches --help
  
  neonctl branches create --help
  ```

## GitHub

The GitHub repository for the Neon CLI is found [here](https://github.com/neondatabase/neonctl).
