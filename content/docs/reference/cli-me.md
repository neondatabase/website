---
title: Neon CLI commands — me
subtitle: Use the Neon CLI to manage Neon projects directly from your terminal
enableTableOfContents: true
isDraft: true
---

## Before you begin

Ensure that you have [installed the Neon CLI](../reference/neon-cli/install-the-neon-cli).

## The `me` command

This command retrieves information about the current Neon CLI user.

### Usage

```bash
neonctl me
```

### Options

Only [global options](../reference/neon-cli/global-options) apply.

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
