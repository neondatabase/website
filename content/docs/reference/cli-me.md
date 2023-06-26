---
title: Neon CLI commands — me
subtitle: Use the Neon CLI to manage Neon projects directly from your terminal
enableTableOfContents: true
isDraft: true
---

## Before you begin

- Ensure that you have [installed the Neon CLI](/docs/reference/neon-cli#install-the-neon-cli).
- If you have not authenticated with the [neonctl auth](/docs/reference/cli-auth) command, running a Neon CLI command automatically launches the Neon CLI browser authentication process. Alternatively, you can specify a Neon API key using the `--api-key` option when running a command. See [Connect](/docs/reference/neon-cli#connect).

## The `me` command

This command retrieves information about the current Neon CLI user.

### Usage

```bash
neonctl me
```

### Options

Only [global options](/docs/reference/neon-cli/global-options) apply.

### Example

```bash
neonctl me
┌────────────────┬──────────────────────────┬────────────┬────────────────┐
│ Login          │ Email                    │ Name       │ Projects Limit │
├────────────────┼──────────────────────────┼────────────┼────────────────┤
│ user1          │ user1@example.com        │ User1      │ 1              │
└────────────────┴──────────────────────────┴────────────┴────────────────┘
```

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
