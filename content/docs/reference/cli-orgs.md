---
title: Neon CLI commands — orgs
subtitle: Use the Neon CLI to manage Neon organizations directly from the terminal
enableTableOfContents: true
updatedOn: '2024-07-05T19:12:26.343Z'
---

## Before you begin

- Before running the `orgs` command, ensure that you have [installed the Neon CLI](/docs/reference/cli-install).
- If you have not authenticated with the [neon auth](/docs/reference/cli-auth) command, running a Neon CLI command automatically launches the Neon CLI browser authentication process. Alternatively, you can specify a Neon API key using the `--api-key` option when running a command. See [Connect](/docs/reference/neon-cli#connect).

## The `orgs` command

Use this command to manage the organizations you belong to within the Neon CLI.

### Usage

```bash
neon orgs <sub-command> [options]
```

### Sub-commands

#### `list`

This sub-command lists all organizations associated with the authenticated Neon CLI user.

```bash
neon orgs list
```

### Options

Only [global options](/docs/reference/neon-cli#global-options) apply.

### Examples

Here is the default output in table format.

```bash
neon orgs list
Organizations
┌────────────────────────┬──────────────────┐
│ Id                     │ Name             │
├────────────────────────┼──────────────────┤
│ org-xxxxxxxx-xxxxxxxx  │ Example Org      │
└────────────────────────┴──────────────────┘
```

This next example shows `neon orgs list` with `--output json`, which also shows the `created_at` and `updated_at` timestamps not shown with the default `table` output format.

```json
neon orgs list -o json

[
  {
    "id": "org-xxxxxxxx-xxxxxxxx",
    "name": "Example Org",
    "handle": "example-org-xxxxxxxx",
    "created_at": "2024-04-22T16:50:41Z",
    "updated_at": "2024-06-28T15:38:26Z"
  }
]
```

<NeedHelp/>
