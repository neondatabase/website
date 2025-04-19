---
title: Neon CLI Quickstart
subtitle: Learn how to use the Neon CLI to manage your Neon resources
enableTableOfContents: true
updatedOn: '2025-04-19T00:09:59.925Z'
---

The Neon CLI is a command-line interface that lets you manage Neon directly from the terminal. This guide will help you quickly set up and start using the Neon CLI.

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

For the latest version, refer to the [Neon CLI GitHub repository](https://github.com/neondatabase/neonctl)

## Authenticate

Authenticate with your Neon account using one of these methods:

**Web Authentication (recommended)**

Run the command below to authenticate through your browser:

```bash
neon auth
```

This will open a browser window where you can authorize the CLI to access your Neon account.

**API Key Authentication**

Alternatively, you can use a Neon API key. You can create one in the Neon Console. See [Create a personal API key](https://neon.tech/docs/manage/api-keys#create-a-personal-api-key).

```bash
neon projects list --api-key <your-api-key>
```

To avoid entering your API key with each command, you can set it as an environment variable:

```bash
export NEON_API_KEY=<your-api-key>
```

For more about authenticating, see [Neon CLI commands — auth](/docs/reference/cli-auth).

## Set up your context file

Context files allow you to use CLI commands without specifying your project or organization IDs every time.

To set the context for your Neon project:

```bash
neon set-context --project-id <your-project-id>
```

You can find your Neon project ID by opening your project in the Neon Console and navigating to **Settings** > **General**.

Th the `set-context` command creates a `.neon` file in your current directory with your project context.

```bash
$ cat .neon

{
  "projectId": "cool-darkness-12345678"
}%
```

You can also create named context files for different projects:

```bash
neon set-context --project-id <your-project-id> --context-file my-project-context
```

For organization-level operations, you can create named organization context file:

```bash
neon set-context --org-id <your-org-id> --context-file my-org-context
```

To switch contexts, add the `--context-file` option to any command, specifying your context file:

```bash
neon branches list --context-file Documents/my-org-context
```

For more about the `set-context` command, see [Neon CLI commands — set-context](/docs/reference/cli-set-context).

## Enable shell completion

Next, you can set up autocompletion to make using the CLI faster:

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

Now you can press **Tab** to complete commands and options. For further details, see [Neon CLI commands — completion](/docs/reference/cli-completion).

## Common operations

Here are some common operations you can perform with the Neon CLI:

### List your projects

```bash
neon projects list
```

If you want to list projects in your organization, don't forget to set your organization context or specify `--org-id <your-org-id>`. Otherwise, you'll list the projects in your personal Neon account.

For more about the `projects` command, see [Neon CLI commands — projects](/docs/reference/cli-projects).

### Create a branch

```bash
neon branches create --name <branch-name>
```

Set your project context or specify `--project-id <your-project-id>` if you have more than one Neon project.

For more about the `branches` command, see [Neon CLI commands — branches](/docs/reference/cli-branches).

### Get a connection string

This will give you the connection string for the default branch in your project:

```bash
neon connection-string
```

For a specific branch, specify the branch name:

```bash
neon connection-string <branch-name>
```

There's lots more you can do with the `connection-string` command. See [Neon CLI commands — connection-string](/docs/reference/cli-connection-string).

## Next steps

Now that you're set up with the Neon CLI, you can:

- Create more Neon projects with `neon projects create`
- Manage your branches with various `neon branches` commands such as `reset`, `restore`, `rename`, `schema-diff`, and more
- Create and manage databases with `neon databases create`
- Create and manage roles with `neon roles create`
- View the full set of Neon CLI commands available to you with `neon --help`

For more details on all available commands, see the [CLI Reference](/docs/reference/neon-cli).

</Steps>
