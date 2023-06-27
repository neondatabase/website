---
title: Automate branching with the Neon CLI
subtitle: Learn how you can automatically create and delete database branches with the Neon CLI
enableTableOfContents: true
isDraft: true
---

## Branching with the Neon CLI

Branch actions performed in the Neon Console can also be performed using the Neon CLI. The following examples demonstrate how to create, view, and delete branches using the Neon CLI. For other branch-related CLI methods, refer to the [Neon CLI reference](tbd).

### Prerequisites

Before you can run CLI commands, you must be authenticated. ALternative, you can supply an API key usign the `--api-key` option when running a CLI command.

### Create a branch with the API

The following Neon API method creates a branch. To view the CLI documentation for this method, refer to the [Neon CLI reference](tbd).

```bash
neonctl branches create [options] 
```

### List branches with the CLI

The following Neon CLI command lists branches for the specified project. To view the CLI documentation for this method, refer to the [Neon CLI reference](tbd).

```bash
neonctl branches liste [options] 
```

### Delete a branch with the CLI

The following Neon CLI command deletes the specified branch. To view the CLI documentation for this command, refer to the [Neon CLI reference](tbd).

```bash
neonctl branches delete [options] 
```

You can verify that a branch is deleted by listing the branches for your project. See [List branches](tbd). The deleted branch should no longer be listed.

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
