---
title: Branching with the Neon CLI
subtitle: Learn how you can create and delete branches with the Neon CLI
enableTableOfContents: true
isDraft: true
---

Branch actions performed in the Neon Console can also be performed using the Neon CLI. The following examples demonstrate how to create, view, and delete branches using the Neon CLI. For other branch-related CLI commands, refer to the [Neon CLI reference](/docs/reference/neon-cli).

### Prerequisites

- The Neon CLI is installed. See [Install the Neon CLI](/docs/reference/neon-cli#install-the-neon-cli) for instructions.
Before you can run CLI commands, you must be authenticated. Alternatively, you can supply an API key using the `--api-key` option when running a CLI command.

### Create a branch with the CLI

The following Neon CLI command creates a branch. To view the CLI documentation for this method, refer to the [Neon CLI reference](/docs/reference/cli-branches).

```bash
neonctl branches create
┌───────────────────────────┬───────────────────────────┬──────────────────────┬──────────────────────┐
│ Id                        │ Name                      │ Created At           │ Updated At           │
├───────────────────────────┼───────────────────────────┼──────────────────────┼──────────────────────┤
│ br-tight-waterfall-174832 │ br-tight-waterfall-174832 │ 2023-07-09T20:42:18Z │ 2023-07-09T20:42:18Z │
└───────────────────────────┴───────────────────────────┴──────────────────────┴──────────────────────┘

endpoints

┌─────────────────────┬──────────────────────┐
│ Id                  │ Created At           │
├─────────────────────┼──────────────────────┤
│ ep-cold-star-253608 │ 2023-07-09T20:42:18Z │
└─────────────────────┴──────────────────────┘

connection_uris

┌───────────────────────────────────────────────────────────────────────────────────┐
│ Connection Uri                                                                    │
├───────────────────────────────────────────────────────────────────────────────────┤
│ postgres://daniel:<password>@ep-cold-star-253608.us-east-2.aws.neon.tech/neondb   │
└───────────────────────────────────────────────────────────────────────────────────┘
```

### List branches with the CLI

The following Neon CLI command lists branches for the specified project. To view the CLI documentation for this method, refer to the [Neon CLI reference](/docs/reference/cli-branches).

```bash
neonctl branches list --project-id solitary-leaf-288182
┌────────────────────────┬──────────┬──────────────────────┬──────────────────────┐
│ Id                     │ Name     │ Created At           │ Updated At           │
├────────────────────────┼──────────┼──────────────────────┼──────────────────────┤
│ br-small-meadow-878874 │ main     │ 2023-07-06T13:15:12Z │ 2023-07-06T14:26:32Z │
├────────────────────────┼──────────┼──────────────────────┼──────────────────────┤
│ br-round-queen-335380  │ mybranch │ 2023-07-06T14:45:50Z │ 2023-07-06T14:45:50Z │
└────────────────────────┴──────────┴──────────────────────┴──────────────────────┘
```

### Delete a branch with the CLI

The following Neon CLI command deletes the specified branch. To view the CLI documentation for this command, refer to the [Neon CLI reference](/docs/reference/cli-branches).

```bash
neonctl branches delete br-rough-sky-158193
┌─────────────────────┬─────────────────┬──────────────────────┬──────────────────────┐
│ Id                  │ Name            │ Created At           │ Updated At           │
├─────────────────────┼─────────────────┼──────────────────────┼──────────────────────┤
│ br-rough-sky-158193 │ my_child_branch │ 2023-07-09T20:57:39Z │ 2023-07-09T21:06:41Z │
└─────────────────────┴─────────────────┴──────────────────────┴──────────────────────┘
```

You can verify that a branch is deleted by listing the branches for your project. See [List branches](tbd). The deleted branch should no longer be listed.

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
