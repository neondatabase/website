---
title: 'Neon CLI command: ip-allow'
subtitle: 'Manage the IP allowlist: list, add, remove, and reset allowed IPs'
summary: >-
  The Neon CLI `ip-allow` command controls project-level IP allowlists with
  subcommands `list`, `add`, `remove`, and `reset`, supporting individual IP
  addresses, IP ranges, and CIDR notation. Use this page when you need to
  restrict database access to specific IPs from the command line, rather than
  through the Neon console. The `add` subcommand accepts a `--protected-only`
  flag to scope the allowlist to protected branches only.
enableTableOfContents: true
updatedOn: '2026-06-12T00:33:31.980Z'
redirectFrom:
  - /docs/reference/cli-ip-allow
---

The `ip-allow` command lists, adds, removes, and resets the IP allowlist for your Neon project. An allowlist can contain individual IP addresses, IP ranges, or [CIDR notation](/docs/reference/glossary#cidr-notation). For information about Neon's IP Allow feature, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow).

## Subcommands

<CliUsage command="ip-allow" />

<CliSubcommands command="ip-allow" />

The `--project-id` option is required only if your Neon account has more than one project and no project is set in your [context file](/docs/cli/set-context).

## neonctl ip-allow list (#list)

Lists the addresses in the IP allowlist.

<CliUsage command="ip-allow list" />

<CliOptions command="ip-allow list" />

List the IP allowlist:

```bash
neonctl ip-allow list --project-id cold-grass-40154007
```

List the IP allowlist with the `--output` format set to `json`:

```bash
neonctl ip-allow list --project-id cold-grass-40154007 --output json
```

## neonctl ip-allow add (#add)

Adds IP addresses to the IP allowlist for your Neon project.

<CliUsage command="ip-allow add" />

<CliOptions command="ip-allow add" />

Use `--protected-only` to apply the allowlist to [protected branches](/docs/guides/protected-branches) only. Use `--protected-only false` to remove this setting.

```bash
neonctl ip-allow add 192.0.2.3 --project-id cold-grass-40154007
```

## neonctl ip-allow remove (#remove)

Removes IP addresses from the IP allowlist for your project.

<CliUsage command="ip-allow remove" />

<CliOptions command="ip-allow remove" />

```bash
neonctl ip-allow remove 192.0.2.3 --project-id cold-grass-40154007
```

## neonctl ip-allow reset (#reset)

Resets the allowlist to the IP addresses you specify. If you specify no addresses, the currently defined IP addresses are removed.

<CliUsage command="ip-allow reset" />

<CliOptions command="ip-allow reset" />

```bash
neonctl ip-allow reset 192.0.2.1 --project-id cold-grass-40154007
```
