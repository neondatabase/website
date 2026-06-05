---
title: 'Neon CLI command: checkout'
subtitle: Pin a branch in your local `.neon` context file
summary: >-
  Covers the usage of the `checkout` command in the Neon CLI to switch the
  active branch in your local context, so subsequent commands target that
  branch without specifying `--branch` on every command.
enableTableOfContents: true
updatedOn: '2026-06-05T12:06:47.985Z'
---

## Before you begin

- Before running the `checkout` command, ensure that you have [installed the Neon CLI](/docs/reference/cli-install).
- The `checkout` command requires **neonctl 2.22.2** or later. Check your version with `neon --version`.
- If you have not authenticated with the [neon auth](/docs/reference/cli-auth) command, running a Neon CLI command automatically launches the Neon CLI browser authentication process. Alternatively, you can specify a Neon API key using the `--api-key` option when running a command. See [Connect](/docs/reference/neon-cli#connect).

## The `checkout` command

The `checkout` command pins a branch in the local context so subsequent commands target it. It is a focused helper over [`set-context`](/docs/reference/cli-set-context) for the common "switch the branch I'm working on" case.

`checkout` resolves the branch (by name or ID) against the project, then **heals** the `.neon` file: it always (re)writes `projectId`, `branchId`, and `orgId` (when the project has one), so a `.neon` that was missing fields or drifted ends up complete and consistent.

### Usage

```bash
neon checkout [id|name] [options]
```

The branch argument is **optional**. Run `neon checkout` with no branch in an interactive terminal to fetch the project's branches and pick one from a list. In a non-interactive context (CI or no TTY), a branch must be passed explicitly.

### Branch ID vs name

Branch **ID vs name** is detected automatically (a `br-…` value is treated as an ID):

- **ID** — matched strictly by ID. A non-existent ID is a hard "not found" error (IDs are server-assigned, so `checkout` never creates one).
- **Name** — matched by name. If the name does not exist, in an interactive terminal `checkout` offers to **create** it (equivalent to `neon branches create --name <name>`: branched from the project's default branch with a read-write compute), then checks it out. In a non-interactive context, a missing name is the usual "not found" error.

### Project resolution

The project is resolved through the standard Neon CLI chain, each entry winning over the next:

1. `--project-id <id>` flag
2. `projectId` from the closest `.neon` file (found by walking up from the current directory)
3. If still unresolved and the API key maps to exactly one project, that project is auto-detected (same behavior as `branches` and `connection-string`)

If none of those resolve a project, `checkout` prints an error explaining the chain above. In an interactive terminal it then offers to run [`neon link`](/docs/reference/cli-link) in the current folder so you can pick (or create) a project on the spot. In non-interactive contexts, it exits with a non-zero code instead of prompting.

### Options

In addition to the Neon CLI [global options](/docs/reference/neon-cli#global-options), the `checkout` command supports these options:

| Option           | Description                                                        | Type   |
| ---------------- | ------------------------------------------------------------------ | ------ |
| `--project-id`   | Project ID                                                         | string |
| `--context-file` | [Context file](/docs/reference/cli-set-context) path and file name | string |

### Examples

Pin a branch by name. New Neon projects create a default branch named `production`:

```bash
neon checkout production --project-id polished-snowflake-12345678
```

```text
INFO: Checked out branch br-steep-math-aiu3vve7 on project polished-snowflake-12345678. Updated /path/to/cwd/.neon.
```

The updated `.neon` file:

```json
{
  "orgId": "org-abc123",
  "projectId": "polished-snowflake-12345678",
  "branchId": "br-steep-math-aiu3vve7"
}
```

Pick a branch interactively (requires a linked project or `--project-id`):

```bash
neon checkout
```

Pin a branch by ID:

```bash
neon checkout br-cool-snow-12345678 --project-id polished-snowflake-12345678
```

After checking out a branch, commands such as [`connection-string`](/docs/reference/cli-connection-string) and [`psql`](/docs/reference/cli-psql) use the pinned branch by default.

<NeedHelp/>
