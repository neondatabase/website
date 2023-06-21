---
title: Neon CLI commands — databases
subtitle: Use the Neon CLI to manage Neon projects directly from your terminal
enableTableOfContents: true
isDraft: true
---

## Before you begin

Ensure that you have [installed the Neon CLI](../reference/neon-cli#install-the-neon-cli).

## The `databases` command

### Usage

The `databases` command allows you to list, create, and delete databases in a Neon project.

### Subcommands

| Subcommand  | Description      |
|---------|------------------|
| [list](#list)    | List databases    |
| [create](#create)  | Create a database |
| [delete](#delete)  | Delete a database |

### list

This subcommand allows you to list databases.

#### Usage

```bash
neonctl databases list [options]
```

#### Options

In addition to the Neon CLI [global options](../neon-cli/global-options), the `list` subcommand supports these options:

| Option        | Description | Type   | Required  |
| ------------- | ----------- | ------ | :------: |
| --project.id  | Project ID  | string | &check; |
| --branch.id   | Branch ID   | string | &check; |

#### Example

<CodeBlock shouldWrap>

```bash
neonctl databases list --project.id spring-sky-578180 --branch.id br-autumn-dust-190886
┌────────┬────────────┬──────────────────────┐
│ Name   │ Owner Name │ Created At           │
├────────┼────────────┼──────────────────────┤
│ neondb │ daniel     │ 2023-06-19T18:27:19Z │
└────────┴────────────┴──────────────────────┘
```

</CodeBlock>

### create

This subcommand allows you to create a database.

#### Usage

```bash
neonctl databases create [options]
```

#### Options

In addition to the Neon CLI [global options](../neon-cli/global-options), the `create` subcommand supports these options:

| Option               | Description                          | Type   | Required  |
| -------------------- | ------------------------------------ | ------ | :------: |
| --project.id         | Project ID                           | string | &check; |
| --branch.id          | Branch ID                            | string | &check; |
| --database.name      | The name of the database             | string | &check; |
| --database.owner_name| The name of the role that owns the database | string | &check; |

#### Example

<CodeBlock shouldWrap>

```bash
neonctl databases create --project.id spring-sky-578180 --branch.id br-autumn-dust-190886 --database.name mynewdb --database.owner_name daniel
┌─────────┬────────────┬──────────────────────┐
│ Name    │ Owner Name │ Created At           │
├─────────┼────────────┼──────────────────────┤
│ mynewdb │ daniel     │ 2023-06-19T23:45:45Z │
└─────────┴────────────┴──────────────────────┘
```

</CodeBlock>

### delete

This subcommand allows you to delete a database.

#### Usage

```bash
neonctl databases delete [options]
```

#### Options

In addition to the Neon CLI [global options](../neon-cli/global-options), the `delete` subcommand supports these options:

| Option           | Description  | Type   | Required  |
| ---------------- | ------------ | ------ | :------: |
| --project.id     | Project ID   | string | &check; |
| --branch.id      | Branch ID    | string | &check; |
| --database.name  | Database name| string | &check; |

#### Example

<CodeBlock shouldWrap>

```bash
neonctl databases delete --project.id spring-sky-578180 --branch.id br-autumn-dust-190886 --database.name mynewdb
┌─────────┬────────────┬──────────────────────┐
│ Name    │ Owner Name │ Created At           │
├─────────┼────────────┼──────────────────────┤
│ mynewdb │ daniel     │ 2023-06-19T23:45:45Z │
└─────────┴────────────┴──────────────────────┘
```

</CodeBlock>

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
