---
title: Branching with the Neon CLI
subtitle: Learn how you can create and delete branches with the Neon CLI
enableTableOfContents: true
isDraft: true
---

Branch actions performed in the Neon Console can also be performed using the Neon CLI. The following examples demonstrate how to create, view, and delete branches using the Neon CLI. For other branch-related CLI commands, refer to the [Neon CLI commands — branches](/docs/reference/cli-branches).

### Prerequisites

- The Neon CLI. See [Install the Neon CLI](/docs/reference/neon-cli#install-the-neon-cli) for instructions.
- To run CLI commands, you must either authenticate or supply an API key using the `--api-key` option. See [Connect with the Neon CLI](/docs/reference/neon-cli#connect).

### Create a branch with the CLI

The following Neon CLI command creates a branch. To view the CLI documentation for this method, refer to the [Neon CLI reference](/docs/reference/cli-branches).
The command response includes the brach ID, the compute endpoint ID, and and the connection URI, which you can use to connect to the branch.

<Admonition type="tip">
You add the `--name` option to a `neonctl branches create` command to specify your own branch name. For example, `neonctl branches create --name mybranch`. Also, for any Neon CLI command, command, you can specify `--output json` to change the command output from the default table format to JSON format.
</Admonition>

```bash
neonctl branches create

branch
┌───────────────────────┬───────────────────────┬─────────┬──────────────────────┬──────────────────────┐
│ Id                    │ Name                  │ Primary │ Created At           │ Updated At           │
├───────────────────────┼───────────────────────┼─────────┼──────────────────────┼──────────────────────┤
│ br-lucky-mud-08878834 │ br-lucky-mud-08878834 │ false   │ 2023-07-24T20:22:42Z │ 2023-07-24T20:22:42Z │
└───────────────────────┴───────────────────────┴─────────┴──────────────────────┴──────────────────────┘
endpoints
┌────────────────────────┬──────────────────────┐
│ Id                     │ Created At           │
├────────────────────────┼──────────────────────┤
│ ep-mute-voice-52609794 │ 2023-07-24T20:22:42Z │
└────────────────────────┴──────────────────────┘
connection_uris
┌───────────────────────────────────────────────────────────────────────────────────────┐
│ Connection Uri                                                                        │
├───────────────────────────────────────────────────────────────────────────────────────┤
│ postgres://daniel:<password>@ep-mute-voice-52609794.us-east-2.aws.neon.tech/neondb    │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### List branches with the CLI

The following Neon CLI command lists branches for the specified project. To view the CLI documentation for this method, refer to the [Neon CLI reference](/docs/reference/cli-branches).

```bash
neonctl branches list
┌────────────────────────────┬───────────────────────┬─────────┬──────────────────────┬──────────────────────┐
│ Id                         │ Name                  │ Primary │ Created At           │ Updated At           │
├────────────────────────────┼───────────────────────┼─────────┼──────────────────────┼──────────────────────┤
│ br-lucky-mud-08878834      │ br-lucky-mud-08878834 │ false   │ 2023-07-24T20:22:42Z │ 2023-07-24T20:38:34Z │
├────────────────────────────┼───────────────────────┼─────────┼──────────────────────┼──────────────────────┤
│ br-wandering-king-30669552 │ main                  │ true    │ 2023-07-24T15:31:03Z │ 2023-07-24T16:13:48Z │
└────────────────────────────┴───────────────────────┴─────────┴──────────────────────┴──────────────────────┘
```

### Delete a branch with the CLI

The following Neon CLI command deletes the specified branch. To view the CLI documentation for this command, refer to the [Neon CLI reference](/docs/reference/cli-branches).

```bash
neonctl branches delete br-rough-sky-158193
┌───────────────────────┬───────────────────────┬─────────┬──────────────────────┬──────────────────────┐
│ Id                    │ Name                  │ Primary │ Created At           │ Updated At           │
├───────────────────────┼───────────────────────┼─────────┼──────────────────────┼──────────────────────┤
│ br-lucky-mud-08878834 │ br-lucky-mud-08878834 │ false   │ 2023-07-24T20:22:42Z │ 2023-07-24T20:44:51Z │
└───────────────────────┴───────────────────────┴─────────┴──────────────────────┴──────────────────────┘
```

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
