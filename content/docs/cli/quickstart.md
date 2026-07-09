---
title: Neon CLI quickstart
subtitle: Get set up with the Neon CLI in just a few steps
summary: >-
  The Neon CLI quickstart installs neon on macOS, Windows, or Linux via
  Homebrew, npm, or bun, then authenticates using browser-based `neon auth` or
  a personal API key. Use this page when setting up terminal access to Neon for
  the first time, before working through the full CLI reference. It also covers
  the `.neon` context file (`neon set-context`) to avoid repeating
  `--project-id` and `--org-id` flags, shell tab completion, and first commands
  like `neon projects list`, `neon branches create`, and
  `neon connection-string`.
enableTableOfContents: true
updatedOn: '2026-07-01T13:41:48.668Z'
redirectFrom:
  - /docs/reference/cli-quickstart
---

The Neon CLI lets you manage Neon directly from the terminal. This guide helps you set up and start using it. The CLI is invoked as `neon`; `neonctl` is an alias for `neon`, so commands work with either name.

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
npm i -g neon
```

**Install with bun**

```bash
bun install -g neon
```

</TabItem>

<TabItem>

**Install via npm**

```shell
npm i -g neon
```

**Install with bun**

```bash
bun install -g neon
```

</TabItem>

<TabItem>

**Install via npm**

```shell
npm i -g neon
```

**Install with bun**

```bash
bun install -g neon
```

</TabItem>

</Tabs>

Verify the installation by checking the CLI version:

```bash
neon --version
```

For the latest version, refer to the [Neon CLI GitHub repository](https://github.com/neondatabase/neon-pkgs/tree/main/packages/cli).

## Authenticate

Authenticate with your Neon account using one of these methods:

**Web Authentication (recommended)**

Run the command below to authenticate through your browser:

```bash
neon auth
```

This opens a browser window where you can authorize the CLI to access your Neon account.

**API Key Authentication**

Alternatively, use a personal Neon API key, which you can create in the Neon Console. See [Create a personal API key](/docs/manage/api-keys#create-a-personal-api-key).

```bash
neon projects list --api-key <your-api-key>
```

To avoid entering your API key with each command, set it as an environment variable:

```bash
export NEON_API_KEY=<your-api-key>
```

For more about authenticating, see [Neon CLI commands: auth](/docs/cli/auth).

## Link your project

The easiest way to set up CLI context is with [`neon link`](/docs/cli/link). It guides you through organization and project selection and writes a `.neon` context file in your project directory. Requires **neon 2.22.2** or later.

```bash
neon link
```

You can also link non-interactively for scripts and CI:

```bash
neon link --org-id <your-org-id> --project-id <your-project-id>
```

<Admonition type="tip">
If you run a CLI command without an organization context, the CLI prompts you to select an organization and offers to save it as your default, creating a `.neon` context file automatically.
</Admonition>

<Admonition type="tip">
Once linked, you can run CLI commands from any subdirectory of your project; the CLI walks up parent folders to find the `.neon` file. The file is also automatically added to `.gitignore` so it's not committed by accident.
</Admonition>

Alternatively, set context manually with [`neon set-context`](/docs/cli/set-context):

```bash
neon set-context --org-id <your-org-id> --project-id <your-project-id>
```

<Admonition type="info">
You can find your organization ID in the Neon Console by selecting your organization and navigating to **Settings**. You can find your Neon project ID by opening your project in the Neon Console and navigating to **Settings** > **General**.
</Admonition>

The `set-context` command creates a `.neon` file in your current directory with your project context.

```bash
cat .neon
```

```json
{
  "projectId": "broad-surf-52155946",
  "orgId": "org-solid-base-83603457"
}
```

You can also create named context files for different organization and project contexts:

```bash
neon set-context --org-id <your-org-id> --project-id <your-project-id> --context-file dev_project
```

To switch contexts, add the `--context-file` option to any command:

```bash
neon branches list --context-file Documents/dev_project
```

For more about the `set-context` command, see [Neon CLI commands: set-context](/docs/cli/set-context).

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

Now you can press **Tab** to complete Neon CLI commands and options. For further details, see [Neon CLI commands: completion](/docs/cli/completion).

## Common operations

### List your projects

```bash
neon projects list
```

If no organization context is set, the CLI prompts you to select an organization.

For more about the `projects` command, see [Neon CLI commands: projects](/docs/cli/projects).

### Create a branch

```bash
neon branches create --name <branch-name>
```

Set your project context or specify `--project-id <your-project-id>` if you have more than one Neon project.

To switch the active branch in your context file, use [`neon checkout`](/docs/cli/checkout):

```bash
neon checkout <branch>
```

For more about the `branches` command, see [Neon CLI commands: branches](/docs/cli/branches).

### Get a connection string

Get the connection string for the default branch in your project:

```bash
neon connection-string
```

For a specific branch, specify the branch name:

```bash
neon connection-string <branch-name>
```

To connect with `psql` directly, use the dedicated [`neon psql`](/docs/cli/psql) command:

```bash
neon psql
```

For more about the `connection-string` command, see [Neon CLI commands: connection-string](/docs/cli/connection-string).

## Next steps

Now that you're set up with the Neon CLI, you can:

- Create more Neon projects with `neon projects create`
- Manage your branches with various `neon branches` commands such as `reset`, `restore`, `rename`, `schema-diff`, and more
- Create and manage databases with `neon databases` commands
- Create and manage roles with `neon roles` commands
- View the full set of Neon CLI commands available to you with `neon --help`

For more details on all available commands, see the [CLI Reference](/docs/cli).

</Steps>
