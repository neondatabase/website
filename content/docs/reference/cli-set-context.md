---
title: Neon CLI commands — set-context
subtitle: Use the Neon CLI to manage Neon directly from the terminal
enableTableOfContents: true
updatedOn: '2024-08-15T12:36:39.367Z'
---

## Before you begin

- Before running the `set-context` command, ensure that you have [installed the Neon CLI](/docs/reference/neon-cli#install-the-neon-cli).
- If you have not authenticated with the [neon auth](/docs/reference/cli-auth) command, running a Neon CLI command automatically launches the Neon CLI browser authentication process. Alternatively, you can specify a Neon API key using the `--api-key` option when running a command. See [Connect](/docs/reference/neon-cli#connect).

## The `set-context` command

This command sets a background context for your CLI sessions, letting you perform project or branch-specific actions without having to specify the project id in every command. Using the `context-file` parameter, you can save the context to a file of your choice. If you don't specify a file, a default `.neon` file is saved to the current directory. You can switch contexts by providing different files.

The context remains in place until you reset to a new context or remove the `context-file`.

### Usage

#### set-context (hidden file)

```bash
neon set-context [option]
```

#### set-context to context-file

```bash
neon set-context [option] --context-file <your_context_file>
```

#### set-context during project creation

You can also set context for a new project during project creation.

```bash
neon projects create --name <project_name> --set-context <your_context_file>
```

### Options

The `set-context` command requires you set at least one of these options:

| Option           | Description        | Type   |                                               Required                                               |
| ---------------- | ------------------ | ------ | :--------------------------------------------------------------------------------------------------: |
| `--project-id`   | Project ID         | string |          Sets the identified project as the context until you reset or remove context-file           |
| `--org-id`       | Organization ID    | string | Sets the organization context, which allows you to perform actions in the context of an organization |
| `--context-file` | Path and file name | string |              Creates a file that holds organization-id, project-id, and branch context               |

[Global options](/docs/reference/neon-cli#global-options) are also supported.

## Examples of setting and using a context

Here are some examples of setting contexts to specific projects, then using them in an example command.

### Using the default file

Set the context to the default `.neon` file:

```bash
neon set-context --project-id patient-frost-50125040 --org-id org-bright-sky-12345678
```

List all branches for this project using `branches list`. There's no need to include `--project-id` or `--org-id`, even if you belong to multiple organizations or have multiple projects:

```bash
neon branches list
```

The results show details for all branches in the `patient-frost-50125040` project within the `org-bright-sky-12345678` organization:

```bash
┌──────────────────────────┬─────────────┬─────────┬──────────────────────┬──────────────────────┐
│ Id                       │ Name        │ Default │ Created At           │ Updated At           │
├──────────────────────────┼─────────────┼─────────┼──────────────────────┼──────────────────────┤
│ br-raspy-meadow-26349337 │ development │ false   │ 2023-11-28T19:19:11Z │ 2023-12-01T00:18:21Z │
├──────────────────────────┼─────────────┼─────────┼──────────────────────┼──────────────────────┤
│ br-curly-bar-82389180    │ main        │ true    │ 2023-10-23T12:49:41Z │ 2023-12-01T00:18:21Z │
└──────────────────────────┴─────────────┴─────────┴──────────────────────┴──────────────────────┘
```

### Using a named `context-file`

Set the context to the `context-file` of your choice:

```bash
neon set-context --project-id plain-waterfall-84865553 --context-file Documents/MyContext
```

List all branches using the `branches list` command. No need to specify the project since the context file provides it.

```bash
neon branches list --context-file Documents/MyContext
```

The results show details for all branches in the `plain-waterfall-84865553` project:

```bash
┌─────────────────────────────┬─────────────┬─────────┬──────────────────────┬──────────────────────┐
│ Id                          │ Name        │ Default │ Created At           │ Updated At           │
├─────────────────────────────┼─────────────┼─────────┼──────────────────────┼──────────────────────┤
│ br-soft-base-86343042       │ development │ false   │ 2023-11-21T18:41:47Z │ 2023-12-01T00:00:14Z │
├─────────────────────────────┼─────────────┼─────────┼──────────────────────┼──────────────────────┤
│ br-young-bush-89857627      │ main        │ true    │ 2023-11-21T18:00:10Z │ 2023-12-01T03:33:53Z │
├─────────────────────────────┼─────────────┼─────────┼──────────────────────┼──────────────────────┤
│ br-billowing-union-41102466 │ staging     │ false   │ 2023-11-21T18:44:22Z │ 2023-12-01T08:32:40Z │
└─────────────────────────────┴─────────────┴─────────┴──────────────────────┴──────────────────────
```

<Admonition type="note">
These two `branches list` commands demonstrate the use of different contexts in the same account. The default `.neon` context is set to `patient-frost-50125040` while the named `context-file` is set to `plain-waterfall-84865553`. These contexts operate independently. You can set as many `context-files` as you'd like, using unique names or in different directories, depending on your needs.
</Admonition>

### Setting context when creating a new project

Let's say you want to create a new project called `MyLatest`. You can automatically set the project ID at the same time as you create the project.

```bash
neon projects create --name MyLatest --set-context
```

This creates a hidden `.neon` file by default with the following context:

```json
{
  "projectId": "quiet-water-76237589"
}
```

You can now use any command that would normally require an additional `--project-id` parameter and the command will default to this context.

<Admonition type="note">
Neon does not save any confidential information to the context file (for example, auth tokens). You can safely commit this file to your repository or share with others.
</Admonition>
