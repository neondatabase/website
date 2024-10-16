---
title: Neon CLI
subtitle: Use the Neon CLI to manage Neon directly from the terminal
enableTableOfContents: true
updatedOn: '2024-10-07T13:55:51.301Z'
---

The Neon CLI is a command-line interface that lets you manage Neon directly from the terminal. This documentation references all commands and options available in the Neon CLI.

## Install

<Tabs labels={["macOS", "Windows", "Linux"]}>

<TabItem>

**Install with [Homebrew](https://formulae.brew.sh/formula/neonctl)**

```bash
brew install neonctl
```

**Install via [npm](https://www.npmjs.com/package/neonctl)**

```shell
npm i -g neonctl
```

Requires [Node.js 18.0](https://nodejs.org/en/download/) or higher.

**Install with bun**

```bash
bun install -g neonctl
```

**macOS binary**

Download the binary. No installation required.

```bash shouldWrap
curl -sL https://github.com/neondatabase/neonctl/releases/latest/download/neonctl-macos -o neonctl
```

Run the CLI from the download directory:

```bash
neonctl <command> [options]
```

</TabItem>

<TabItem>

**Install via [npm](https://www.npmjs.com/package/neonctl)**

```shell
npm i -g neonctl
```

**Install with bun**

```bash
bun install -g neonctl
```

Requires [Node.js 18.0](https://nodejs.org/en/download/) or higher.

**Windows binary**

Download the binary. No installation required.

```bash shouldWrap
curl -sL -O https://github.com/neondatabase/neonctl/releases/latest/download/neonctl-win.exe
```

Run the CLI from the download directory:

```bash
neonctl-win.exe <command> [options]
```

</TabItem>

<TabItem>

**Install via [npm](https://www.npmjs.com/package/neonctl)**

```shell
npm i -g neonctl
```

**Install with bun**

```bash
bun install -g neonctl
```

**Linux binary**

Download the x64 or ARM64 binary, depending on your processor type. No installation required.

x64:

```bash shouldWrap
curl -sL https://github.com/neondatabase/neonctl/releases/latest/download/neonctl-linux-x64 -o neonctl
```

ARM64:

```bash shouldWrap
 curl -sL https://github.com/neondatabase/neonctl/releases/latest/download/neonctl-linux-arm64 -o neonctl
```

Run the CLI from the download directory:

```bash
neon <command> [options]
```

</TabItem>

</Tabs>

For more about installing, upgrading, and connecting, see [Neon CLI — Install and connect](/docs/reference/cli-install).

<Admonition title="Use the Neon CLI without installing" type="note">
You can run the Neon CLI without installing it using **npx** (Node Package eXecute) or the `bun` equivalent, **bunx**. For example:

```shell
# npx
npx neonctl <command>

# bunx
bunx neonctl <command>
```

</Admonition>

## Synopsis

```bash
neonctl --help
usage: neonctl <command> [options]                               [aliases: neon]

Commands:
  neonctl auth                        Authenticate                      [aliases: login]
  neonctl me                          Show current user
  neonctl orgs                        Manage organizations                [aliases: org]
  neonctl projects                    Manage projects                 [aliases: project]
  neonctl ip-allow                    Manage IP Allow
  neonctl branches                    Manage branches                   [aliases: branch]
  neonctl databases                   Manage databases            [aliases: database, db]
  neonctl roles                       Manage roles                        [aliases: role]
  neonctl operations                  Manage operations               [aliases: operation]
  neonctl connection-string [branch]  Get connection string                  [aliases: cs]
  neonctl set-context                 Set the current context
  neonctl create-app                  Initialize a new Neon project   [aliases: bootstrap]
  neonctl completion                  generate completion script

Global options:
  -o, --output      Set output format
                  [string] [choices: "json", "yaml", "table"] [default: "table"]
  --config-dir      Path to config directory [string] [default: ""]
  --api-key         API key  [string] [default: ""]
  --analytics       Manage analytics. Example: --no-analytics, --analytics false
                                                       [boolean] [default: true]
  -v, --version     Show version number                                [boolean]
  -h, --help        Show help                                          [boolean]

Options:
--context-file      Context file [string] [default: (current-context-file)]
```

## Commands

| Command                                                    | Subcommands                                                                                                  | Description                   |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------- |
| [auth](/docs/reference/cli-auth)                           |                                                                                                              | Authenticate                  |
| [me](/docs/reference/cli-me)                               |                                                                                                              | Show current user             |
| [orgs](/docs/reference/cli-orgs)                           | `list`                                                                                                       | Manage organizations          |
| [projects](/docs/reference/cli-projects)                   | `list`, `create`, `update`, `delete`, `get`                                                                  | Manage projects               |
| [ip-allow](/docs/reference/cli-ip-allow)                   | `list`, `add`, `remove`, `reset`                                                                             | Manage IP Allow               |
| [branches](/docs/reference/cli-branches)                   | `list`, `create`, `reset`, `restore`, `rename`, `schema-diff`, `set-default`, `add-compute`, `delete`, `get` | Manage branches               |
| [databases](/docs/reference/cli-databases)                 | `list`, `create`, `delete`                                                                                   | Manage databases              |
| [roles](/docs/reference/cli-roles)                         | `list`, `create`, `delete`                                                                                   | Manage roles                  |
| [operations](/docs/reference/cli-operations)               | `list`                                                                                                       | Manage operations             |
| [connection-string](/docs/reference/cli-connection-string) |                                                                                                              | Get connection string         |
| [set-context](/docs/reference/cli-set-context)             |                                                                                                              | Set context for session       |
| [create-app](/docs/reference/cli-create-app)               |                                                                                                              | Initialize a new Neon project |
| [completion](/docs/reference/cli-completion)               |                                                                                                              | Generate a completion script  |

## Global options

Global options are supported with any Neon CLI command.

| Option                      | Description                                                 | Type    | Default                             |
| :-------------------------- | :---------------------------------------------------------- | :------ | :---------------------------------- |
| [-o, --output](#output)     | Set the Neon CLI output format (`json`, `yaml`, or `table`) | string  | table                               |
| [--config-dir](#config-dir) | Path to the Neon CLI configuration directory                | string  | `/home/<user>/.config/neonctl`      |
| [--api-key](#api-key)       | Neon API key                                                | string  | `NEON_API_KEY` environment variable |
| [--color](#color)           | Colorize the output. Example: `--no-color`, `--color false` | boolean | true                                |
| [--analytics](#analytics)   | Manage analytics                                            | boolean | true                                |
| [-v, --version](#version)   | Show the Neon CLI version number                            | boolean | -                                   |
| [-h, --help](#help)         | Show the Neon CLI help                                      | boolean | -                                   |

- <a id="output"></a>`-o, --output`

  Sets the output format. Supported options are `json`, `yaml`, and `table`. The default is `table`. Table output may be limited. The `json` and `yaml` output formats show all data.

  ```bash
  neon me --output json
  ```

- <a id="config-dir"></a>`--config-dir`

  Specifies the path to the `neonctl` configuration directory. To view the default configuration directory containing you `credentials.json` file, run `neon --help`. The credentials file is created when you authenticate using the `neon auth` command. This option is only necessary if you move your `neonctl` configuration file to a location other than the default.

  ```bash
  neonctl projects list --config-dir /home/<user>/.config/neonctl
  ```

- <a id="api-key"></a>`--api-key`

  Specifies your Neon API key. You can authenticate using a Neon API key when running a Neon CLI command instead of using `neonctl auth`. For information about obtaining an Neon API key, see [Create an API key](https://neon.tech/docs/manage/api-keys#create-an-api-key).

  ```bash
  neon <command> --api-key <neon_api_key>
  ```

  To avoid including the `--api-key` option with each CLI command, you can export your API key to the `NEON_API_KEY` environment variable.

  ```bash
  export NEON_API_KEY=<neon_api_key>
  ```

  <Admonition type="info">
      
  The authentication flow for the Neon CLI follows this order:

  - If the `--api-key` option is provided, it is used for authentication.
  - If the `--api-key` option is not provided, the `NEON_API_KEY` environment variable setting is used.
  - If there is no `--api-key` option or `NEON_API_KEY` environment variable setting, the CLI looks for the `credentials.json` file created by the `neon auth` command.
  - If the credentials file is not found, the Neon CLI initiates the `neon auth` web authentication process.

  </Admonition>

- <a id="color"></a>`--color`

  Colorize the output. This option is enabled by default, but you can disable it by specifying `--no-color` or `--color false`, which is useful when using Neon CLI commands in your automation pipelines.

- <a id="analytics"></a>`--analytics`

  Analytics are enabled by default to gather information about the CLI commands and options that are used by our customers. This data collection assists in offering support, and allows for a better understanding of typical usage patterns so that we can improve user experience. Neon does not collect user-defined data, such as project IDs or command payloads. To opt-out of analytics data collection, specify `--no-analytics` or `--analytics false`.

- <a id="version"></a>`-v, --version`

  Shows the Neon CLI version number.

  ```bash
  $ neon --version
  1.15.0
  ```

- <a id="help"></a>`-h, --help`

  Shows the `neonctl` command-line help. You can view help for `neonctl`, a `neonctl` command, or a `neonctl` subcommand, as shown in the following examples:

  ```bash
  neon --help

  neon branches --help

  neon branches create --help
  ```

## Options

| Option                          | Description                       | Type   | Default              |
| :------------------------------ | :-------------------------------- | :----- | :------------------- |
| [--context-file](#context-file) | The context file for CLI sessions | string | current-context-file |

- <a id="context-file"></a>`--context-file`

  Sets a background context for your CLI sessions, letting you perform organization, project, or branch-specific actions without having to specify the relevant id in every command. For example, this command lists all branches using the `branches list` command. No need to specify the project since the context file provides it.

  ```bash
  neon branches list --context-file path/to/context_file_name
  ```

  To define a context file, see [Neon CLI commands — set-context](/docs/reference/cli-set-context).

## GitHub repository

The GitHub repository for the Neon CLI is found [here](https://github.com/neondatabase/neonctl).
