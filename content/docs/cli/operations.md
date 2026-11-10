---
title: 'Neon CLI command: operations'
subtitle: List operations for a Neon project and check the status of one
summary: >-
  The Neon CLI `neon operations list` command retrieves the history of system
  operations for a Neon project, showing each operation's ID, action type (such
  as `apply_config` or `suspend_compute`), status, and creation timestamp. Use
  this command to inspect or audit long-running or recently completed operations
  when debugging project state or configuration changes. Requires the Neon CLI
  to be installed and authenticated; scope to a specific project with
  `--project-id` when your account has multiple projects.
enableTableOfContents: true
updatedOn: '2026-11-05T15:33:57.188Z'
redirectFrom:
  - /docs/reference/cli-operations
  - /docs/cli/operation
---

From the terminal, the `operations` command lists a project's operations and shows the details of one. For information about operations in Neon, see [System operations](/docs/manage/operations). If `--project-id` is omitted, the CLI resolves it from your [context file](/docs/cli/link), auto-selects when your account has only one project, and otherwise asks you to pass `--project-id`.

<CliSubcommands command="operations" />

## neon operations list (#list)

Lists operations for a Neon project.

<CliUsage command="operations list" />

<CliOptions command="operations list" />

```bash
neon operations list
```

```text filename="Output"
ID                                    Action           Status    Created At
fce8642e-259e-4662-bdce-518880aee723  apply_config     finished  2026-06-20T00:45:19Z
dc1dfb0c-b854-474b-be20-2ea1d2172563  apply_config     finished  2026-06-20T00:43:17Z
7a83e300-cf5f-4c1a-b9b5-569b6d6feab9  suspend_compute  finished  2026-06-19T23:50:56Z
```

## neon operations get (#get)

Shows one operation, including its branch, compute, failure count, and duration. Get the ID from `neon operations list`.

<CliUsage command="operations get" />

<CliOptions command="operations get" />

```bash
neon operations get 8f3c2a1e-5b7d-4c9a-a1e2-3d4f5a6b7c8d
```

```text filename="Output"
ID                 8f3c2a1e-5b7d-4c9a-a1e2-3d4f5a6b7c8d
Action             suspend_compute
Status             finished
Branch ID          br-lively-sunset-123456
Endpoint ID        ep-cool-king-123456
Failures Count     0
Total Duration Ms  84
Created At         2026-11-05T14:24:09Z
Updated At         2026-11-05T14:24:09Z
```
