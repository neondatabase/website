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

An alternative to authenticating using `neon auth` is to provide an API key when running a CLI command. You can do this using the global `--api-key` option or by setting the `NEON_API_KEY` variable. See [Global options](/docs/reference/neon-cli#global-options) for instructions.

<Admonition type="info">
The authentication flow for the Neon CLI follows this order:

- If the `--api-key` option is provided, it takes precedence and is used for authentication.
- If the `--api-key` option is not provided, the `NEON_API_KEY` environment variable is used.
- If neither the `--api-key` option nor the `NEON_API_KEY` environment variable is available, the CLI looks for the `credentials.json` file created by the `neonctl auth` command.
- If the credentials file is not found, the Neon CLI initiates the `neonctl auth` web authentication process.
</Admonition>

### Options

Only [global options](/docs/reference/neon-cli/global-options) apply.

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
