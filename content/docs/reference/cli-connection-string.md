---
title: Neon CLI commands — connection-string
subtitle: Use the Neon CLI to manage Neon directly from the terminal
enableTableOfContents: true
updatedOn: '2023-10-07T08:16:00.624Z'
---

## Before you begin

- Before running the `connection-string` command, ensure that you have [installed the Neon CLI](/docs/reference/neon-cli#install-the-neon-cli).
- If you have not authenticated with the [neonctl auth](/docs/reference/cli-auth) command, running a Neon CLI command automatically launches the Neon CLI browser authentication process. Alternatively, you can specify a Neon API key using the `--api-key` option when running a command. See [Connect](/docs/reference/neon-cli#connect).

For information about connecting to Neon, see [Connect from any application](/docs/connect/connect-from-any-app).

## The `connection string` command

This command constructs a Postgres connection string for connecting to a database in your Neon project. You can construct a connection string for any database in any branch. The connection string includes the password for the specified role.

### Usage

```bash
neonctl connection-string [branch] [options]
```

`branch` specifies the branch name or id. If a branch name or ID is ommited, the primary branch is used.

### Options

In addition to the Neon CLI [global options](/docs/reference/neon-cli#global-options), the `connect-string` command supports these options:

| Option        | Description  | Type   | Required  |
| ------------- | ------------ | ------ | :------: |
| --project-id  | Project ID   | string |  Only if your Neon account has more than one project |
| --role-name   | Role name    | string | Only if your branch has more than one role |
| --database-name| Database name| string | Only if your branch has more than one database |
| --pooled | Construct a pooled connection. The default is `false`. |boolean||
| --prisma | Construct a connection string for use with Prisma. The default is `false`. |boolean||

### Examples

- Generate a basic connection string for the current project, branch, and database:

    <CodeBlock shouldWrap>

    ```bash
    neonctl connection-string mybranch
    postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname
    ```

    </CodeBlock>

- Generate a pooled connection string for the current project, branch, and database with the `--pooled` option. This option adds a `-pooler` flag to the host name which enables connection pooling for clients that use this connection string.

    <CodeBlock shouldWrap>

    ```bash
    neonctl connection-string --pooled
    postgres://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname
    ```

    </CodeBlock>

- Generate a connection string for use with Prisma for the current project, branch, and database. The `--prisma` options adds `connect_timeout=30` option to the connection string to ensure that connections from Prisma Client do not timeout.

    <CodeBlock shouldWrap>

    ```bash
    neonctl connection-string --prisma
   postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?connect_timeout=30
    ```

    </CodeBlock>

## Need help?

To get help from our support team, open a ticket from the console. Look for the **Support** link in the left sidebar. For more detail, see [Getting Support](/docs/introduction/support). You can also join the [Neon community forum](https://community.neon.tech/) to ask questions or see what others are doing with Neon.
