---
title: Neon CLI commands — set-context
subtitle: Use the Neon CLI to manage Neon directly from the terminal
enableTableOfContents: true
updatedOn: '2023-11-24T11:25:06.765Z'
---

## Before you begin

- Before running the `set-context` command, ensure that you have [installed the Neon CLI](/docs/reference/neon-cli#install-the-neon-cli).
- If you have not authenticated with the [neonctl auth](/docs/reference/cli-auth) command, running a Neon CLI command automatically launches the Neon CLI browser authentication process. Alternatively, you can specify a Neon API key using the `--api-key` option when running a command. See [Connect](/docs/reference/neon-cli#connect).

## The `set-context` command

This command sets a background context for your CLI session, letting you perform project or branch specific actions without having to specify the project or branch id in every command. There are two ways to set conext:

* Hidden file &#8212; the specified context is saved to a hidden file that gets added to whichever directory you run the command from
* Named `context-file` &#8212; the context is included in a named `context-file`, saved in whichever directory you specify

These two methods can be used independently from one another; the contexts in your hidden and named files can be different. When running commands, the hidden file gets used by default; the `context-file` is only used when explictly included in a command.

The settings remain in place until you set a new context, or you remove the `context-file`.

### Usage

#### set-context (hidden file)

```bash
neonctl set-context [option]
```
#### set-context to context-file

```bash
neonctl set-context [option] --context-file <your_context_file>
```

#### set-context during project creation

You can also set context for a new project during project creation:

```bash
neonctl projects create --name <project_name> --set-context <your_context_file>
```

### Options

The `set-context` command requires you set at least one of these options:
| Option       | Description   | Type   | Required  |
| ------------ | ------------- | ------ | :------: |
| `--project-id` | Project ID    | string | Sets the identified project as the context until you reset or remove context-file |
| `--branch` | Branch ID or name | string | Sets the identified branch as the context until you reset or remove context-file |
| `--context-file` | path and file name | string | Creates a file that holds project-id or branch context 

[Global options](/docs/reference/neon-cli#global-options) are also supported.

## Examples of using a context

Here is an example of setting a hidden context to a project, and then using it in a branch list command:

### Using hidden file

Setting the context:
```bash
neonctl set-context --project-id patient-frost-50125040
```
This branches list command does not need to specify the project, even though multiple projects exist for this account:
```bash
neonctl branches list
```
The results show details for all branches in the `patient-frost-50125040` project:
```bash
┌──────────────────────────┬─────────────┬─────────┬──────────────────────┬──────────────────────┐
│ Id                       │ Name        │ Primary │ Created At           │ Updated At           │
├──────────────────────────┼─────────────┼─────────┼──────────────────────┼──────────────────────┤
│ br-raspy-meadow-26349337 │ development │ false   │ 2023-11-28T19:19:11Z │ 2023-12-01T00:18:21Z │
├──────────────────────────┼─────────────┼─────────┼──────────────────────┼──────────────────────┤
│ br-curly-bar-82389180    │ main        │ true    │ 2023-10-23T12:49:41Z │ 2023-12-01T00:18:21Z │
└──────────────────────────┴─────────────┴─────────┴──────────────────────┴──────────────────────┘
```

### Using a named `context-file`

Setting the context to a different project in the same account:
```bash
neonctl set-context --project-id plain-waterfall-84865553 --context-file Documents/MyContext
```
This branches list command does not need to specify the project, even though other projects exist for this account:
```bash
neonctl branches list --context-file Documents/MyContext
```
The results show details for all branches in the `plain-waterfall-84865553` project:
```bash
┌─────────────────────────────┬─────────────┬─────────┬──────────────────────┬──────────────────────┐
│ Id                          │ Name        │ Primary │ Created At           │ Updated At           │
├─────────────────────────────┼─────────────┼─────────┼──────────────────────┼──────────────────────┤
│ br-soft-base-86343042       │ development │ false   │ 2023-11-21T18:41:47Z │ 2023-12-01T00:00:14Z │
├─────────────────────────────┼─────────────┼─────────┼──────────────────────┼──────────────────────┤
│ br-young-bush-89857627      │ main        │ true    │ 2023-11-21T18:00:10Z │ 2023-12-01T03:33:53Z │
├─────────────────────────────┼─────────────┼─────────┼──────────────────────┼──────────────────────┤
│ br-billowing-union-41102466 │ staging     │ false   │ 2023-11-21T18:44:22Z │ 2023-12-01T08:32:40Z │
└─────────────────────────────┴─────────────┴─────────┴──────────────────────┴──────────────────────
```

<Admonition type="note">
Notice that these two `branches list` commands are using different contexts for the same account: the hidden file is set to `patient-frost-50125040` and the named `context-file` is set to `plain-waterfall-84865553`. Each can be called independently. You can set as many `context-files` as you'd like, using different names or saved to different directories, depending on your needs.
</Admonition>




