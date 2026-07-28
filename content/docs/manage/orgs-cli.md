---
title: Manage Organizations using the Neon CLI
summary: >-
  The Neon CLI supports organization-scoped commands using the `--org-id` flag
  or a saved context file. Run `neon orgs list` to look up an org ID, and use
  `neon projects list` or `neon projects create` scoped to an org. To avoid
  repeating `--org-id` on every command, set a persistent org context with
  `set-context`.
enableTableOfContents: true
updatedOn: '2026-07-28T11:00:37.343Z'
---

Neon's CLI provides an expanding set of commands to manage your organizations.

## Authorization

Use the `auth` command to authenticate your Neon account from the CLI. This command opens a browser where you will be asked to grant the necessary permissions to manage your Neon resources across all organizations you belong to. Your OAuth token is stored in `~/.config/neonctl/credentials.json`.

Authentication is tied to your Neon user account. Once authenticated, you can access and manage any organization you belong to. When running commands, you'll need to specify which organization to use via `--org-id`, a [context file](/docs/cli/set-context), or by responding to the interactive prompt.

See [Auth - CLI](/docs/cli/auth) to learn more.

## List Organizations

The `neon orgs list` command outputs a list of all organizations that the CLI user currently belongs to. This command is useful for quickly identifying the `org_id` associated with each organization, which can be used in other CLI operations.

Example:

```bash
neon orgs list
Organizations
┌────────────────────────┬──────────────────┐
│ Id                     │ Name             │
├────────────────────────┼──────────────────┤
│ org-ocean-art-12345678 │ Example Org      │
└────────────────────────┴──────────────────┘
```

See [Orgs - CLI](/docs/cli/orgs) to learn more.

## Manage projects within an Organization

The Neon CLI `projects` command supports an `--org-id` option. This allows you to list or create projects within a specified organization.

Example: Listing all projects in an organization:

```bash
neon projects list --org-id org-xxxx-xxxx
Projects
┌───────────────────────────┬───────────────────────────┬────────────────────┬──────────────────────┐
│ Id                        │ Name                      │ Region Id          │ Created At           │
├───────────────────────────┼───────────────────────────┼────────────────────┼──────────────────────┤
│ bright-moon-12345678      │ dev-backend-api           │ aws-us-east-2      │ 2024-07-26T11:43:37Z │
├───────────────────────────┼───────────────────────────┼────────────────────┼──────────────────────┤
│ silent-forest-87654321    │ test-integration-service  │ aws-eu-central-1   │ 2024-05-30T22:14:49Z │
├───────────────────────────┼───────────────────────────┼────────────────────┼──────────────────────┤
│ crystal-stream-23456789   │ staging-web-app           │ aws-us-east-2      │ 2024-05-17T13:47:35Z │
└───────────────────────────┴───────────────────────────┴────────────────────┴──────────────────────┘
```

You can include the `org-id` to apply the following subcommands specifically to your organization:

- [List projects](/docs/cli/projects#list)
- [Create projects](/docs/cli/projects#create)

See [Projects - CLI](/docs/cli/projects) to learn more.

## Manage project access

The CLI doesn't have a dedicated command for [per-project permissions](/docs/manage/user-permissions) yet. To manage who can access a project from the CLI, use the [`neon api`](/docs/cli/api) command, which sends an authenticated request to any Neon API route.

For example, to set an organization member's role on a project, call the member-role endpoint with the role you want to grant (`viewer`, `editor`, or `admin`). You send the role in lowercase; the response reports it as an uppercase permission level (`VIEWER`, `EDITOR`, or `ADMIN`):

```bash
neon api /projects/{project_id}/members/{member_id}/role -X PUT -F role=editor
```

To remove a member's explicit role on a project (they keep whatever their organization role grants by default):

```bash
neon api /projects/{project_id}/members/{member_id}/role -X DELETE
```

The [API key's permissions](/docs/manage/api-keys#types-of-api-keys) determine what these requests can do: only organization admins can manage project access. For the full list of project-access routes and their fields, see the [Neon API reference](/docs/reference/api).

## Setting Organization Context

To simplify your workflow, the Neon CLI `set-context` command supports setting an organization context. This means you don't have to specify an organization ID every time you run a CLI command.

Sees [set-context - CLI](/docs/cli/set-context) to learn more.
