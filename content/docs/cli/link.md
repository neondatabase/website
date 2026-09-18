---
title: 'Neon CLI command: link'
subtitle: Link a directory to a Neon project and write a `.neon` context file
summary: >-
  Covers the usage of the `link` command in the Neon CLI to bind the current
  directory to a Neon project, including interactive and non-interactive
  workflows for CI, scripts, and AI agents.
enableTableOfContents: true
updatedOn: '2026-09-18T04:16:26.638Z'
redirectFrom:
  - /docs/reference/cli-link
---

The `link` command binds the current directory to a Neon project and writes a `.neon` context file. Once linked, commands you run here (or in any subdirectory) know which organization, project, and branch to use, so you don't repeat `--org-id` and `--project-id` every time.

`link` always pins a branch as part of that context. Pass `--branch` to choose one, or use [`checkout`](/docs/cli/checkout) to switch it later.

<Admonition type="note" title="Behavior changed in Neon CLI 5.0.0">
Before 5.0.0, `link` wrote `orgId` and `projectId` but pinned a branch only when you passed `--branch`, so a `.neon` file could be incomplete. From 5.0.0, `link` always pins a branch, and `--no-checks` also requires `--branch`. In non-interactive scripts, pass `--branch` (or `-y` for the default branch).
</Admonition>

<Admonition type="tip" title="Prefer link over set-context">
For most workflows, use `neon link` instead of manually running `neon set-context --project-id ...`. The `link` command guides you through organization and project selection and ensures the context file is complete.
</Admonition>

## Usage

<CliUsage command="link" />

## Options

<CliOptions command="link" />

By default, linking pulls the linked branch's environment variables (such as `DATABASE_URL`) into a local `.env` file. Use `--no-env-pull` to skip this step, for example when you inject environment variables at runtime instead.

After an interactive link, `link` also prompts you to create a [`neon.ts` config](/docs/cli/config) when the directory doesn't already have one, so you can manage the project's Neon setup as code. Accept the prompt to write `neon.ts`, or pass `--no-config` to skip it. This applies to interactive linking only; non-interactive runs never prompt.

## Interactive mode (default)

Run `neon link` with no flags for guided prompts:

```bash
neon link
```

```text filename="Output"
? Which organization would you like to link? › Personal Org (org-abc123)
? Which project would you like to link? › + Create new project
? Name for the new project: › my-app
? Which region should the new project run in? › AWS US East (Ohio) (aws-us-east-2)
Created project polished-snowflake-12345678 ("my-app") in aws-us-east-2.
Linked .neon:
  orgId:     org-abc123
  projectId: polished-snowflake-12345678
  branch:    br-steep-math-aiu3vve7
```

## Non-interactive mode

Use flags or a `--params` JSON blob for scripts, CI, and AI agents:

```bash
# Link to an existing project (pin a branch, or pass -y for the default)
neon link --org-id org-abc123 --project-id polished-snowflake-12345678 --branch main

# Create a new project and link
neon link --org-id org-abc123 --project-name my-app --region-id aws-us-east-2

# Same payload, one JSON blob
neon link --params '{"orgId":"org-abc123","projectName":"my-app","regionId":"aws-us-east-2"}'
```

Flags take precedence over fields in `--params`.

Because `link` writes a complete context, a non-interactive run needs a branch: pass `--branch` (or `--branch-id`), or use `-y` to pin the project's default branch. `link` pins the only branch automatically when a project has just one.

Agents find the IDs with `neon orgs list --output json` and `neon projects list --org-id <org-id> --output json`, then link with `--project-id` (or create a project with `--org-id`, `--project-name`, and `--region-id`).

## The `.neon` context file

`link` is a thin wrapper around [`set-context`](/docs/cli/set-context): both write to the same `.neon` file, so anything `link` can write, `set-context` can write too. `link` writes the file into the current working directory by default. If an existing `.neon` is found in any parent directory, that file is reused, so commands run from a subdirectory of a linked project still pick up the project's context. To pin the location explicitly, pass the global `--context-file <path>` option. See [Using a named context file](/docs/cli/set-context#using-a-named-context-file).

Example `.neon` file:

```json
{
  "orgId": "org-abc123",
  "projectId": "polished-snowflake-12345678",
  "branch": "br-steep-math-aiu3vve7"
}
```

The first time a `.neon` file is created, the CLI adds `.neon` to `.gitignore` in that folder so local project settings are not committed by accident. If you want to commit `.neon` and share context with your team, remove the entry from `.gitignore`. The CLI doesn't re-add it when updating an existing file.

<Admonition type="note">
Neon does not save confidential information to the context file (for example, auth tokens). You can safely commit this file to your repository or share it with others.
</Admonition>

## Organization-scoped API keys

Organization-scoped API keys (those created at the organization level rather than the user level) cannot list user organizations or call the regions endpoint. `link` handles this transparently:

- If the API key is org-scoped and at least one project already exists in the org, the CLI auto-detects the `org_id` from the first project.
- When the regions endpoint is not allowed, `link` falls back to a built-in static region list.
