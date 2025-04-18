---
title: Getting started with the Neon CLI
subtitle: Learn how to use the Neon CLI to manage your Neon resources
enableTableOfContents: true
updatedOn: '2025-04-18T11:00:00.000Z'
---

The Neon CLI is a command-line interface that lets you manage Neon directly from the terminal. This guide will help you quickly set up and start using the CLI for common tasks.

<Steps>

## Install the CLI

Choose your platform and install the Neon CLI:

<Tabs labels={["macOS", "Windows", "Linux"]}>

<TabItem>

**Install with Homebrew**
```bash
brew install neonctl
```

**Install via npm**
```shell
npm i -g neonctl
```

**Install with bun**
```bash
bun install -g neonctl
```

</TabItem>

<TabItem>

**Install via npm**
```shell
npm i -g neonctl
```

**Install with bun**
```bash
bun install -g neonctl
```

</TabItem>

<TabItem>

**Install via npm**
```shell
npm i -g neonctl
```

**Install with bun**
```bash
bun install -g neonctl
```

</TabItem>

</Tabs>

Verify the installation by checking the CLI version:
```bash
neon --version
```

## Authenticate

Authenticate with your Neon account using one of these methods:

**Web Authentication (recommended)**

Run the command below to authenticate through your browser:
```bash
neon auth
```

This will open a browser window where you can authorize the CLI to access your Neon account.

**API Key Authentication**

Alternatively, you can use a Neon API key. You can create one in the Neon Console under **Settings > API Keys**.

```bash
neon projects list --api-key <your-api-key>
```

To avoid entering your API key with each command, you can set it as an environment variable:
```bash
export NEON_API_KEY=<your-api-key>
```

## Set up your context file

Context files allow you to use CLI commands without specifying your project or branch IDs every time.

If you're in a single project:
```bash
neon set-context --project-id <your-project-id>
```

This creates a `.neon` file in your current directory with your project context.

You can also create named context files for different projects:
```bash
neon set-context --project-id <your-project-id> --context-file my-project-context
```

For organization-level operations:
```bash
neon set-context --org-id <your-org-id> --context-file my-org-context
```

## Enable shell completion

Set up autocompletion to make using the CLI faster:

<Tabs labels={["Bash", "Zsh"]}>

<TabItem>

```bash
neon completion >> ~/.bashrc
source ~/.bashrc
```

</TabItem>

<TabItem>

```bash
neon completion >> ~/.zshrc
source ~/.zshrc
```

</TabItem>

</Tabs>

Now you can press Tab to complete commands and options.

## Common operations

Here are some common operations you can perform with the Neon CLI:

### List your projects

```bash
neon projects list
```

### Create a branch

```bash
neon branches create --name <branch-name>
```

### Get a connection string

```bash
neon connection-string
```

For a specific branch:
```bash
neon connection-string <branch-name>
```

You can include database and role parameters:
```bash
neon connection-string <branch-name> --database <database> --role <role>
```

## Next steps

Now that you're set up with the Neon CLI, you can:

- Create and manage databases with `neon databases create`
- Create and manage roles with `neon roles create`
- View the full CLI reference with `neon --help`

For more details on all available commands, see the [CLI Reference](/docs/reference/neon-cli).

</Steps>
