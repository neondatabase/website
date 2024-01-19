---
title: Neon CLI commands — ip-allow
subtitle: Use the Neon CLI to manage Neon directly from the terminal
enableTableOfContents: true
updatedOn: '2023-12-01T19:05:09.476Z'
---

## Before you begin

- Before running the `ip-allow` command, ensure that you have [installed the Neon CLI](/docs/reference/cli-install).
- If you have not authenticated with the [neonctl auth](/docs/reference/cli-auth) command, running a Neon CLI command automatically launches the Neon CLI browser authentication process. Alternatively, you can specify a Neon API key using the `--api-key` option when running a command. See [Connect](/docs/reference/neon-cli#connect).

For information about Neon's **IP Allow** feature, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow).

## The `ip-allow` command

The `ip-allow` command allows you to perform `list`, `add`, `remove`, and `reset` actions on the IP allowlist for your Neon project. You can define an allowlist with individual IP addresses, IP ranges, or [CIDR notation](/docs/reference/glossary#cidr-notation). 

### Usage

```bash
neonctl ip-allow <subcommand> [options]
```

| Subcommand  | Description      |
|---------|------------------|
| [list](#list)    | List the IP allowlist    |
| [add](#add)  | Add IP addresses to the IP allowlist |
| [remove](#remove)  | Remove IP addresses from the IP allowlist |
| [reset](#reset)  | Reset the IP allowlist |

### list

This subcommand allows you to list addresses in the IP allowlist.

#### Usage

```bash
neonctl ip-allow list [options]
```

#### Options

In addition to the Neon CLI [global options](/docs/reference/neon-cli#global-options), the `list` subcommand supports these options:

| Option        | Description | Type   | Required  |
| ------------- | ----------- | ------ | :------: |
| `--context-file` | [Context file](/docs/reference/cli-set-context#using-a-named-context-file) path and file name | string | |
| `--project-id`  | Project ID  | string | Only if your Neon account has more than one project |

#### Examples

```bash
neonctl ip-allow list --project-id cold-grass-40154007
```

List the IP allowlist with the `--output` format set to `json`:

```bash
neonctl ip-allow list --project-id cold-grass-40154007 --output json
```

### add

This subcommand allows you to add IP addresses to the IP allowlist for your Neon project.

#### Usage

```bash
neonctl ip-allow add [ips ...] [options]
```

#### Options

In addition to the Neon CLI [global options](/docs/reference/neon-cli#global-options), the `add` subcommand supports these options:

| Option        | Description | Type   | Required  |
| ------------- | ----------- | ------ | :------: |
| `--context-file` | [Context file](/docs/reference/cli-set-context#using-a-named-context-file) path and file name | string | |
| `--project-id`  | Project ID  | string | Only if your Neon account has more than one project |
| `--primary-branch`  | If true, the list will be applied only to the primary branch. Use `--primary-branch false` to remove this setting. | string | |

#### Example

<CodeBlock shouldWrap>

```bash
neonctl ip-allow add 192.168.1.3 --project-id cold-grass-40154007
```

</CodeBlock>

### remove

This subcommand allows you to remove IP addresses from the IP allowlist for your project.

#### Usage

```bash
neonctl ip-allow remove [ips ...] [options]
```

#### Options

In addition to the Neon CLI [global options](/docs/reference/neon-cli#global-options), the `remove` subcommand supports these options:

| Option        | Description | Type   | Required  |
| ------------- | ----------- | ------ | :------: |
| `--context-file` | [Context file](/docs/reference/cli-set-context#using-a-named-context-file) path and file name | string | |
| `--project-id`  | Project ID  | string | Only if your Neon account has more than one project |

#### Example

<CodeBlock shouldWrap>

```bash
neonctl ip-allow remove 192.168.1.3 --project-id cold-grass-40154007
```

</CodeBlock>

### reset

This subcommand allows you to reset the list of IP addresses. You can reset to different IP addresses. If you specify no addresses, currently defined IP addresses are removed.

#### Usage

```bash
neonctl ip-allow reset [ips ...] [options]
```

#### Options

In addition to the Neon CLI [global options](/docs/reference/neon-cli#global-options), the `reset` subcommand supports these options:

| Option        | Description | Type   | Required  |
| ------------- | ----------- | ------ | :------: |
| `--context-file` | [Context file](/docs/reference/cli-set-context#using-a-named-context-file) path and file name | string | |
| `--project-id`  | Project ID  | string | Only if your Neon account has more than one project |

#### Example

<CodeBlock shouldWrap>

```bash
neonctl ip-allow reset 192.168.1.1 --project-id cold-grass-40154007
```

</CodeBlock>

<NeedHelp/>
