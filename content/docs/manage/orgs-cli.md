---
title: Manage Organizations using the Neon CLI
enableTableOfContents: true
updatedOn: '2024-08-23T13:51:17.454Z'
---

<EarlyAccess/>

Neon's CLI (`neonctl`) provides an expanding set of commands to manage your organizations.

## Authorization

Use the `auth` command to authenticate your Neon account from the CLI. This command opens a browser where you will be asked to grant the necessary permissions to managae both your personal and organization resources.

Note that authentication is tied to your personal account. Once authenticated, you can access and manage any Organizations that you belong to.

See [Auth - CLI](/docs/reference/cli-auth) to learn more.

## List Organizations

The `neonctl orgs list` command outputs a list of all organizations that the CLI user currently belongs to. This command is useful for quickly identifying the `org_id` associated with each organization, which can be used in other CLI operations.

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

See [Orgs - CLI](/docs/reference/cli-orgs) to learn more.

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

- [List projects](/docs/reference/cli-projects#list)
- [Create projects](/docs/reference/cli-projects#create)

See [Projects - CLI](/docs/reference/cli-projects) to learn more.

## Setting Organization Context

To simplify your workflow, the Neon CLI `set-context` command supports setting an organization context. This means you don't have to specify an organization ID every time you run a CLI command.

Sees [set-context - CLI](/docs/reference/cli-set-context) to learn more.
