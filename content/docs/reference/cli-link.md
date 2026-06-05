---
title: 'Neon CLI command: link'
subtitle: Link a directory to a Neon project and write a `.neon` context file
summary: >-
  Covers the usage of the `link` command in the Neon CLI to bind the current
  directory to a Neon project, including interactive, non-interactive, and
  agent-oriented workflows.
enableTableOfContents: true
updatedOn: '2026-06-05T12:06:47.985Z'
---

## Before you begin

- Before running the `link` command, ensure that you have [installed the Neon CLI](/docs/reference/cli-install).
- The `link` command requires **neonctl 2.22.2** or later. Check your version with `neon --version`.
- If you have not authenticated with the [neon auth](/docs/reference/cli-auth) command, running a Neon CLI command automatically launches the Neon CLI browser authentication process. Alternatively, you can specify a Neon API key using the `--api-key` option when running a command. See [Connect](/docs/reference/neon-cli#connect).

## The `link` command

The `link` command binds the current directory to a Neon project. It picks (or creates) an organization, picks (or creates) a project, resolves the project's default branch, and writes a `.neon` file with `orgId`, `projectId`, and `branchId`. Subsequent commands run in this directory (or any subdirectory) automatically pick up that context.

`link` is a thin wrapper around [`set-context`](/docs/reference/cli-set-context): both write to the same `.neon` file, so anything `link` can write, `set-context` can write too.

<Admonition type="tip" title="Prefer link over set-context">
For most workflows, use `neon link` instead of manually running `neon set-context --project-id ...`. The `link` command guides you through organization and project selection and ensures the context file is complete.
</Admonition>

### Usage

```bash
neon link [options]
```

### Interactive mode (default)

Run `neon link` with no flags for guided prompts:

```bash
neon link
```

Example output:

```text
? Which organization would you like to link? › Personal Org (org-abc123)
? Which project would you like to link? › + Create new project
? Name for the new project: › my-app
? Which region should the new project run in? › AWS US East (Ohio) (aws-us-east-2)
Created project polished-snowflake-12345678 ("my-app") in aws-us-east-2.
Linked .neon:
  orgId:    org-abc123
  projectId: polished-snowflake-12345678
  branchId:  br-steep-math-aiu3vve7
```

### Non-interactive mode

Use flags or a `--params` JSON blob for scripts and CI:

```bash
# Link to an existing project
neon link --org-id org-abc123 --project-id polished-snowflake-12345678

# Create a new project and link
neon link --org-id org-abc123 --project-name my-app --region-id aws-us-east-2

# Same payload, one JSON blob
neon link --params '{"orgId":"org-abc123","projectName":"my-app","regionId":"aws-us-east-2"}'
```

Flags take precedence over fields in `--params`.

### Agent mode

Use `--agent` for a JSON state machine designed for AI coding assistants. Each invocation returns a single JSON object with a `status` discriminator describing the next step, the available options, and the exact follow-up command to run.

```bash
neon link --agent
```

Example response when an organization must be selected:

```json
{
  "status": "needs_org",
  "instruction": "Ask the user which of these 2 organizations they want to link the current directory to. After they pick one, re-run the next_command_template with the chosen --org-id value.",
  "options": [
    { "id": "org-abc123", "name": "Personal Org" },
    { "id": "org-team", "name": "Team Org" }
  ],
  "next_command_template": "neon link --agent --org-id <org_id>"
}
```

When linking completes, the response includes `status: "linked"` with the context file path and project details.

Any unexpected failure in `--agent` mode is reported as JSON to stdout with exit code 1:

```json
{
  "status": "error",
  "code": "CLIENT_ERROR",
  "message": "user has no access to projects"
}
```

### Options

In addition to the Neon CLI [global options](/docs/reference/neon-cli#global-options), the `link` command supports these options:

| Option           | Description                                                                                 | Type    |
| ---------------- | ------------------------------------------------------------------------------------------- | ------- |
| `--org-id`       | Organization ID to link to                                                                  | string  |
| `--project-id`   | Existing project ID to link to                                                              | string  |
| `--project-name` | Name for a new project to create and link to                                                | string  |
| `--region-id`    | Region ID for a new project (for example, `aws-us-east-2`). Required with `--project-name`. | string  |
| `--params`       | JSON object with link parameters. Flags take precedence over fields in `--params`.          | string  |
| `--agent`        | Emit a JSON state-machine response for AI agents instead of prompting                       | boolean |
| `-y, --yes`      | Skip the "already linked" confirmation in interactive mode and re-link anyway               | boolean |
| `--context-file` | [Context file](/docs/reference/cli-set-context) path and file name                          | string  |

### The `.neon` context file

`link` writes a `.neon` file into the **current working directory** by default. If an existing `.neon` is found in any parent directory, that file is reused — so commands run from a subdirectory of a linked project still pick up the project's context. To pin the location explicitly, pass `--context-file <path>`.

Example `.neon` file:

```json
{
  "orgId": "org-abc123",
  "projectId": "polished-snowflake-12345678",
  "branchId": "br-steep-math-aiu3vve7"
}
```

The first time a `.neon` file is created, the CLI adds `.neon` to `.gitignore` in that folder so local project settings are not committed by accident. If you want to commit `.neon` and share context with your team, remove the entry from `.gitignore` — the CLI will not re-add it when updating an existing file.

<Admonition type="note">
Neon does not save confidential information to the context file (for example, auth tokens). You can safely commit this file to your repository or share it with others.
</Admonition>

### Organization-scoped API keys

Organization-scoped API keys (those created at the organization level rather than the user level) cannot list user organizations or call the regions endpoint. `link` handles this transparently:

- If the API key is org-scoped and at least one project already exists in the org, the CLI auto-detects the `org_id` from the first project.
- If the API key is org-scoped and no projects exist yet, `--agent` returns a `needs_org` response with `options: []` and an instruction to find the org ID in the Neon Console. Interactive mode prints an error pointing to `--org-id`.
- When the regions endpoint is not allowed, `link` falls back to a built-in static region list.

<NeedHelp/>
