---
title: Neon CLI commands — auth
subtitle: Use the Neon CLI to manage your Neon project directly from your terminal
enableTableOfContents: true
isDraft: true
---

## Before you begin

Ensure that you have [installed the Neon CLI](../reference/neon-cli/install-the-neon-cli). Once installed, you can manage your Neon projects directly from the command line.

## The `auth` command

Authenticates the user or caller to Neon.

### Usage

```bash
neonctl auth
```

The command launches a browser window where you can authorize the Neon CLI to access your Neon account. After granting permission, your credentials are saved locally to a configuration file named `credentials.json`.

```text
/home/<home>/.config/neonctl/credentials.json
```

### Options

Only [global options](../reference/neon-cli/global-options) apply.

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
