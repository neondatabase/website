---
title: Neon CLI commands — me
subtitle: Use the Neon CLI to manage your Neon project directly from your terminal
enableTableOfContents: true
isDraft: true
---

## Get started

Ensure that you have [installed the Neon CLI](../reference/neon-cli/get-started). Once you have done that, you can use the `me` command to retrieve information about the current user from the command line.

## The `me` command

This command Returns information about the current Neon CLI user account.

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
