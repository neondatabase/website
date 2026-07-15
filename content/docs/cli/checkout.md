---
title: 'Neon CLI command: checkout'
subtitle: Pin a branch in your local .neon context file
summary: >-
  Covers the usage of the `checkout` command in the Neon CLI to switch the
  active branch in your local context, so subsequent commands target that
  branch without specifying `--branch` on every command.
enableTableOfContents: true
updatedOn: '2026-07-11T13:23:16.265Z'
redirectFrom:
  - /docs/reference/cli-checkout
---

The `checkout` command pins a branch in the local context so subsequent commands target it. It's a focused helper over [`set-context`](/docs/cli/set-context) for the common "switch the branch I'm working on" case. The `checkout` command requires neon 2.22.2 or later; check your version with `neon --version`.

`checkout` resolves the branch (by name or ID) against the project, then heals the `.neon` file: it always (re)writes `projectId`, `branch`, and `orgId` (when the project has one), so a `.neon` that was missing fields or drifted ends up complete and consistent.

## Usage

<CliUsage command="checkout" />

The branch argument is optional. Run `neon checkout` with no branch in an interactive terminal to fetch the project's branches and pick one from a list. In a non-interactive context (CI or no TTY), you must pass a branch explicitly.

## Options

<CliOptions command="checkout" />

By default, `checkout` pulls environment variables into a `.env` file after checking out the branch; use `--no-env-pull` to skip this.

## Branch ID vs name

Branch ID vs name is detected automatically (a `br-…` value is treated as an ID):

- **ID:** Matched strictly by ID. A non-existent ID is a hard "not found" error (IDs are server-assigned, so `checkout` never creates one).
- **Name:** Matched by name. If the name does not exist, in an interactive terminal `checkout` offers to create it (equivalent to `neon branches create --name <name>`: branched from the project's default branch with a read-write compute), then checks it out. In a non-interactive context, a missing name is the usual "not found" error.

## Project resolution

The project is resolved through the standard Neon CLI chain, each entry winning over the next:

1. `--project-id <id>` flag
2. `projectId` from the closest `.neon` file (found by walking up from the current directory)
3. If still unresolved and the API key maps to exactly one project, that project is auto-detected (same behavior as `branches` and `connection-string`)

If none of those resolve a project, `checkout` prints an error explaining the chain above. In an interactive terminal it then offers to run [`neon link`](/docs/cli/link) in the current folder so you can pick (or create) a project on the spot. In non-interactive contexts, it exits with a non-zero code instead of prompting.

## Examples

Pin a branch by name. New Neon projects create a default branch named `production`:

```bash
neon checkout production --project-id polished-snowflake-12345678
```

```text filename="Output"
INFO: Checked out branch br-steep-math-aiu3vve7 on project polished-snowflake-12345678. Updated /path/to/cwd/.neon.
```

The updated `.neon` file:

```json
{
  "orgId": "org-abc123",
  "projectId": "polished-snowflake-12345678",
  "branch": "br-steep-math-aiu3vve7"
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

After checking out a branch, commands such as [`connection-string`](/docs/cli/connection-string) and [`psql`](/docs/cli/psql) use the pinned branch by default.
