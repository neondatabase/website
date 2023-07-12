---
title: Neon CLI commands — auth
subtitle: Use the Neon CLI to manage Neon projects directly from your terminal
enableTableOfContents: true
---

## Before you begin

Ensure that you have [installed the Neon CLI](/docs/reference/neon-cli#install-the-neon-cli).

## The `auth` command

Authenticates the user or caller to Neon.

### Usage

```bash
neonctl auth
```

The command launches a browser window where you can authorize the Neon CLI to access your Neon account. After granting permissions to the Neon CLI, your credentials are saved locally to a configuration file named `credentials.json`, enabling you manage your account's projects from the command line.

```text
/home/<home>/.config/neonctl/credentials.json
```

An alternative to authenticating using `neon auth` is to provide an API key when running a CLI command. You can do this using the global `--api-key` option. See [Global options](/docs/reference/neon-cli#global-options) for instructions.

### Options

Only [global options](/docs/reference/neon-cli/global-options) apply.

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
