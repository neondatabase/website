---
title: 'Neon CLI command: vpc'
subtitle: Manage Private Networking VPC endpoints and project-level restrictions
summary: >-
  The Neon CLI `neonctl vpc` command controls Private Networking by
  registering, updating, removing, and checking VPC endpoints at the
  organization level, and by restricting or removing per-project VPC access.
  Use it when you need to limit Neon project connections to a specific AWS or
  Azure VPC rather than the public internet.
enableTableOfContents: true
updatedOn: '2026-06-11T23:50:21.258Z'
redirectFrom:
  - /docs/reference/cli-vpc
---

The `vpc` command manages [Private Networking](/docs/guides/neon-private-networking) configurations in Neon. Use it to register VPC endpoints at the organization level and to restrict individual projects to connections from a specific VPC.

## Subcommands

<CliUsage command="vpc" />

<CliSubcommands command="vpc" />

## VPC endpoints (#endpoint)

The `vpc endpoint` subcommands list, assign, remove, and check the status of VPC endpoints for a Neon organization.

<CliSubcommands command="vpc endpoint" anchorParts="endpoint" />

These options apply to all `vpc endpoint` subcommands:

<CliOptions command="vpc endpoint" />

You only need `--org-id` if your Neon account belongs to more than one organization. If your account has a single organization, the CLI uses it automatically. Instead of passing IDs on each command, you can also set them in a [context file](/docs/cli/set-context#using-a-named-context-file) and reference it with the `--context-file` option.

### neonctl vpc endpoint list (#endpoint-list)

Lists the VPC endpoints configured for a Neon organization.

<CliUsage command="vpc endpoint list" />

<CliOptions command="vpc endpoint list" />

```bash
neonctl vpc endpoint list --org-id org-bold-bonus-12345678
```

### neonctl vpc endpoint assign (#endpoint-assign)

Adds or updates a VPC endpoint in a Neon organization. `add` and `update` are aliases for this command.

<CliUsage command="vpc endpoint assign" />

<CliOptions command="vpc endpoint assign" />

Add a VPC endpoint to a Neon organization in a specific region:

```bash
neonctl vpc endpoint assign vpce-1234567890abcdef0 --org-id org-bold-bonus-12345678 --region-id aws-us-east-1
```

After you assign a VPC endpoint to a Neon organization, client connections are accepted from the corresponding VPC for all projects in the organization unless you restrict access at the project level with [vpc project restrict](#project-restrict).

### neonctl vpc endpoint remove (#endpoint-remove)

Removes a VPC endpoint from a Neon organization.

<CliUsage command="vpc endpoint remove" />

<CliOptions command="vpc endpoint remove" />

```bash
neonctl vpc endpoint remove vpce-1234567890abcdef0 --org-id org-bold-bonus-12345678
```

<Admonition type="note">
A removed VPC endpoint cannot be added back to the Neon organization.
</Admonition>

### neonctl vpc endpoint status (#endpoint-status)

Gets the status of a VPC endpoint in a Neon organization.

<CliUsage command="vpc endpoint status" />

<CliOptions command="vpc endpoint status" />

```bash
neonctl vpc endpoint status vpce-1234567890abcdef0 --org-id org-bold-bonus-12345678
```

## Project VPC restrictions (#project)

The `vpc project` subcommands list, configure, or remove VPC endpoint restrictions for specific projects in your Neon organization. By default, a project accepts connections from any VPC configured at the organization level. A restriction limits a project to connections from a specific VPC.

<CliSubcommands command="vpc project" anchorParts="project" />

These options apply to all `vpc project` subcommands:

<CliOptions command="vpc project" />

You only need `--project-id` if your Neon account has more than one project.

### neonctl vpc project list (#project-list)

Lists all VPC endpoint restrictions for a Neon project.

<CliUsage command="vpc project list" />

<CliOptions command="vpc project list" />

```bash
neonctl vpc project list --project-id orange-credit-12345678
```

### neonctl vpc project restrict (#project-restrict)

Configures or updates a VPC endpoint restriction for a Neon project. `update` is an alias for this command.

<CliUsage command="vpc project restrict" />

<CliOptions command="vpc project restrict" />

```bash
neonctl vpc project restrict vpce-1234567890abcdef0 --project-id orange-credit-12345678
```

### neonctl vpc project remove (#project-remove)

Removes a VPC endpoint restriction from a Neon project.

<CliUsage command="vpc project remove" />

<CliOptions command="vpc project remove" />

```bash
neonctl vpc project remove vpce-1234567890abcdef0 --project-id orange-credit-12345678
```
