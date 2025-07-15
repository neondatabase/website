---
title: Neon CLI commands — auth
subtitle: Use the Neon CLI to manage Neon directly from the terminal
enableTableOfContents: true
updatedOn: '2025-07-12T14:19:52.053Z'
---

## Before you begin

Before running the `auth` command, ensure that you have [installed the Neon CLI](/docs/reference/cli-install).

## The `auth` command

Authenticates the user or caller to Neon.

### Usage

```bash
neon auth
```

The command launches a browser window where you can authorize the Neon CLI to access your Neon account. After granting permissions to the Neon CLI, your credentials are saved locally to a configuration file named `credentials.json`, enabling you manage your account's projects from the command line.

```text
/home/<home>/.config/neonctl/credentials.json
```

<Admonition type="note">
If you use Neon through the [Vercel-Managed Integration](/docs/guides/vercel-managed-integration), you must authenticate connections from the CLI client using a Neon API key (see below). The `neon auth` command requires an account registered through Neon rather than Vercel.
</Admonition>

An alternative to authenticating using `neon auth` is to provide an API key when running a CLI command. You can do this using the global `--api-key` option or by setting the `NEON_API_KEY` variable. See [Global options](/docs/reference/neon-cli#global-options) for instructions.

<Admonition type="info">

The authentication flow for the Neon CLI follows this order:

- If the `--api-key` option is provided, it takes precedence and is used for authentication.
- If the `--api-key` option is not provided, the `NEON_API_KEY` environment variable is used if it is set.
- If both `--api-key` option and `NEON_API_KEY` environment variable are not provided or set, the CLI falls back to the
  `credentials.json` file created by the `neon auth` command.
- If the credentials file is not found, the Neon CLI initiates the `neon auth` web authentication process.

</Admonition>

#### Options

Only [global options](/docs/reference/neon-cli#global-options) apply.

<NeedHelp/>
