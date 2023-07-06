---
title: Neon CLI commands — connection-string
subtitle: Use the Neon CLI to manage Neon projects directly from your terminal
enableTableOfContents: true
isDraft: true
---

## Before you begin

- Ensure that you have [installed the Neon CLI](/docs/reference/neon-cli#install-the-neon-cli).
- If you have not authenticated with the [neonctl auth](/docs/reference/cli-auth) command, running a Neon CLI command automatically launches the Neon CLI browser authentication process. Alternatively, you can specify a Neon API key using the `--api-key` option when running a command. See [Connect](/docs/reference/neon-cli#connect).

## The `connection string` command

This command constructs a PostgreSQL connection string for connecting to a database in your Neon project. The connection string includes the password for the specified role.

### Usage

```bash
neonctl connection-string [options]
```

### Options

In addition to the Neon CLI [global options](/docs/reference/neon-cli/global-options), the the `connect-string` command supports these options:

| Option        | Description  | Type   | Required  |
| ------------- | ------------ | ------ | :------: |
| --project.id  | Project ID   | string |  Only if your Neon account has more than one project |
| --role.name   | Role name    | string |  |
| --database.name| Database name| string | |
| --pooled | Use a pooled connection. The default is `false`. |boolean||
| --prisma | Use connection string for Prisma setup. The default is `false`. |boolean||

### Examples

- Generate a basic connection string for the current project, branch, and database:

<CodeBlock shouldWrap>

```bash
neonctl connection-string
postgres://daniel:<password>@ep-still-haze-361517.us-east-2.aws.neon.tech/neondb
```

</CodeBlock>

- Generate a pooled connection string for the current project, branch, and database with the `--pooled` option:

<CodeBlock shouldWrap>

```bash
neonctl connection-string
postgres://daniel:<password>@ep-still-haze-361517-pooler.us-east-2.aws.neon.tech/neondb
```

</CodeBlock>

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
