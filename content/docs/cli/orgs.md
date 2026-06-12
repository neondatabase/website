---
title: 'Neon CLI command: orgs'
subtitle: List the Neon organizations you belong to
summary: >-
  The `neonctl orgs` CLI command lists all Neon organizations associated with the
  authenticated user, returning org ID, name, handle, and timestamps in table
  or JSON output. Use this command to identify which organizations your account
  belongs to before running project or branch commands scoped to a specific org.
enableTableOfContents: true
updatedOn: '2026-06-12T00:29:16.599Z'
redirectFrom:
  - /docs/reference/cli-orgs
---

The `orgs` command lists the organizations you belong to. Its subcommand takes only the [global options](/docs/cli#global-options).

## Subcommands

<CliUsage command="orgs" />

<CliSubcommands command="orgs" />

## neonctl orgs list (#list)

Lists all organizations associated with the authenticated Neon CLI user.

<CliUsage command="orgs list" />

<CliOptions command="orgs list" />

- List your organizations with the default `table` output format:

  ```bash
  neonctl orgs list
  ```

  ```text
  Organizations
  ┌────────────────────────┬──────────────────┐
  │ Id                     │ Name             │
  ├────────────────────────┼──────────────────┤
  │ org-xxxxxxxx-xxxxxxxx  │ Example Org      │
  └────────────────────────┴──────────────────┘
  ```

- List your organizations with `--output json`, which also shows the `created_at` and `updated_at` timestamps omitted from the `table` output:

  ```bash
  neonctl orgs list -o json
  ```

  <details>
  <summary>Show output</summary>

  ```json
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

  </details>
