---
title: 'Neon CLI command: orgs'
subtitle: List the Neon organizations you belong to
summary: >-
  The `neon orgs` CLI command lists all Neon organizations associated with the
  authenticated user, returning org ID, name, and plan in table output, or the
  full organization records in JSON output. Use this command to identify which
  organizations your account belongs to before running project or branch
  commands scoped to a specific org.
enableTableOfContents: true
updatedOn: '2026-10-09T15:17:33.920Z'
redirectFrom:
  - /docs/reference/cli-orgs
  - /docs/cli/org
---

The `orgs` command lists the organizations you belong to. Its subcommand takes only the [global options](/docs/cli#global-options).

<CliSubcommands command="orgs" />

## neon orgs list (#list)

Lists all organizations associated with the authenticated Neon CLI user.

<CliUsage command="orgs list" />

<CliOptions command="orgs list" />

List your organizations with the default `table` output format. The organization in your [`.neon` context file](/docs/cli/link#the-neon-context-file) is marked `[current]`:

```bash
neon orgs list
```

```text filename="Output"
Organizations
ID                     Name                   Plan
org-xxxxxxxx-xxxxxxxx  [current] Example Org  Launch
org-yyyyyyyy-yyyyyyyy  Another Org            Free
```

List your organizations with `--output json`, which also shows the fields omitted from the `table` output, such as the handle and timestamps. JSON keeps the API's plan ID (for example, `launch`) rather than the display name:

```bash
neon orgs list -o json
```

<details>
<summary>Show output</summary>

```json
[
  {
    "id": "org-xxxxxxxx-xxxxxxxx",
    "name": "Example Org",
    "handle": "example-org-xxxxxxxx",
    "plan": "launch",
    "created_at": "2026-04-22T16:50:41Z",
    "managed_by": "console",
    "updated_at": "2026-06-28T15:38:26Z",
    "require_mfa": false
  }
]
```

</details>
