---
title: Neon CLI
subtitle: 'The Neon command-line interface: every command, with options and examples'
summary: >-
  Neon CLI (neonctl) is the terminal tool for managing Neon projects, branches,
  databases, roles, connection strings, functions, buckets, and the Data API
  without using the web console. This page indexes every command with its
  subcommands and documents the global options, including --output (json, yaml,
  table), --api-key (NEON_API_KEY), and --context-file. Built for terminal
  workflows, CI/CD automation, scripts, and AI agents.
enableTableOfContents: true
redirectFrom:
  - /docs/reference/neon-cli
  - /docs/reference/cli-create-app
  - /docs/neonctl
  - /docs/get-started/neonctl
updatedOn: '2026-06-11T23:50:21.258Z'
---

One CLI for every Neon surface: manage Postgres, Functions, Storage, the Data API, and Neon Auth from the terminal, with branch-scoped workflows built in.

```bash filename="Install"
npm i -g neonctl
```

## Commands

<CliCommandIndex />

## Agent mode

Every command supports `--output json` for machine-readable results, and setting the `NEON_API_KEY` environment variable authenticates non-interactively. For AI agents, [`neonctl link --agent`](/docs/cli/link) emits a JSON state-machine response with a discriminated `status` field describing the next step, instead of prompting.

## Global options

You can use global options with any Neon CLI command.

<CliGlobalOptions />

- <a id="output"></a>`-o, --output`

  Sets the output format. Supported options are `json`, `yaml`, and `table`. The default is `table`. Table output may be limited. The `json` and `yaml` output formats show all data.

  ```bash
  neonctl me --output json
  ```

- <a id="config-dir"></a>`--config-dir`

  Specifies the path to the `neonctl` configuration directory. The credentials file is created there when you authenticate using the `neonctl auth` command. This option is only necessary if you move your `neonctl` configuration file to a location other than the default.

  ```bash
  neonctl projects list --config-dir /home/<user>/.config/neonctl
  ```

- <a id="api-key"></a>`--api-key`

  Specifies your Neon API key. You can authenticate using a Neon API key when running a Neon CLI command instead of using `neonctl auth`. For information about obtaining a Neon API key, see [Create an API key](/docs/manage/api-keys#create-an-api-key).

  ```bash
  neonctl <command> --api-key <neon_api_key>
  ```

  To avoid including the `--api-key` option with each CLI command, you can export your API key to the `NEON_API_KEY` environment variable.

  ```bash
  export NEON_API_KEY=<neon_api_key>
  ```

  The authentication flow for the Neon CLI follows this order:
  - If the `--api-key` option is provided, it takes precedence and is used for authentication.
  - If the `--api-key` option is not provided, the `NEON_API_KEY` environment variable is used if it is set.
  - If both `--api-key` option and `NEON_API_KEY` environment variable are not provided or set, the CLI falls back to the
    `credentials.json` file created by the `neonctl auth` command.
  - If the credentials file is not found, the Neon CLI initiates the `neonctl auth` web authentication process.

- <a id="context-file"></a>`--context-file`

  Sets a background context for your CLI sessions, letting you perform organization, project, or branch-specific actions without having to specify the relevant id in every command. By default the CLI discovers the nearest `.neon` file, searching upward from the current directory.

  ```bash
  neonctl branches list --context-file path/to/context_file_name
  ```

  To define a context file, see [Neon CLI commands: set-context](/docs/cli/set-context).

- <a id="color"></a>`--color`

  Colorize the output. This option is enabled by default, but you can disable it by specifying `--no-color` or `--color false`, which is useful when using Neon CLI commands in your automation pipelines.

- <a id="analytics"></a>`--analytics`

  Analytics are enabled by default to gather information about the CLI commands and options that are used by our customers. This data collection assists in offering support, and allows for a better understanding of typical usage patterns so that we can improve user experience. Neon does not collect user-defined data, such as project IDs or command payloads. To opt-out of analytics data collection, specify `--no-analytics` or `--analytics false`.

- <a id="version"></a>`-v, --version`

  Shows the Neon CLI version number.

  ```bash
  neonctl --version
  ```

- <a id="help"></a>`-h, --help`

  Shows the command-line help. You can view help for `neonctl`, a command, or a subcommand:

  ```bash
  neonctl --help

  neonctl branches --help

  neonctl branches create --help
  ```

## GitHub repository

The Neon CLI is open source. See the [neondatabase/neonctl](https://github.com/neondatabase/neonctl) repository.
