---
title: 'Neon CLI command: data-api'
subtitle: Provision and manage the Neon Data API from the CLI
summary: >-
  Covers the usage of the `data-api` command in the Neon CLI to create, inspect,
  update, refresh, and delete the Neon Data API for a database.
enableTableOfContents: true
updatedOn: '2026-06-05T12:06:47.985Z'
---

## Before you begin

- Before running the `data-api` command, ensure that you have [installed the Neon CLI](/docs/reference/cli-install).
- The `data-api` command requires **neonctl 2.22.2** or later. Check your version with `neon --version`.
- If you have not authenticated with the [neon auth](/docs/reference/cli-auth) command, running a Neon CLI command automatically launches the Neon CLI browser authentication process. Alternatively, you can specify a Neon API key using the `--api-key` option when running a command. See [Connect](/docs/reference/neon-cli#connect).

For an overview of the Neon Data API, see [Data API](/docs/data-api/overview). For Console-based management, see [Manage Data API](/docs/data-api/manage).

## The `data-api` command

The `data-api` command lets you provision and manage the [Neon Data API](/docs/data-api/overview) for a database from the terminal.

### Usage

```bash
neon data-api <subcommand> [options]
```

| Subcommand       | Description                                                 |
| ---------------- | ----------------------------------------------------------- |
| `create`         | Provision the Neon Data API for a database                  |
| `get`            | Show the Neon Data API status and settings                  |
| `update`         | Update Neon Data API settings                               |
| `refresh-schema` | Refresh the Data API schema cache without changing settings |
| `delete`         | Tear down the Neon Data API for a database                  |

### Shared options

These options apply to all `data-api` subcommands:

| Option           | Description                                                        | Type   |
| ---------------- | ------------------------------------------------------------------ | ------ |
| `--project-id`   | Project ID                                                         | string |
| `--branch`       | Branch ID or name                                                  | string |
| `--database`     | Database name                                                      | string |
| `--context-file` | [Context file](/docs/reference/cli-set-context) path and file name | string |

If `--project-id`, `--branch`, or `--database` are omitted, the CLI resolves them from your [context file](/docs/reference/cli-set-context) or prompts when only one option is available.

### `create` options

| Option                 | Description                                                                 | Type    |
| ---------------------- | --------------------------------------------------------------------------- | ------- |
| `--auth-provider`      | Authentication provider. Choices: `neon_auth`, `external`                   | string  |
| `--jwks-url`           | URL that lists the JWKS (used with external auth)                           | string  |
| `--provider-name`      | Name of the auth provider (for example, Clerk, Stytch, Auth0)               | string  |
| `--jwt-audience`       | Expected JWT audience claim                                                 | string  |
| `--add-default-grants` | Grant all permissions on tables in the public schema to authenticated users | boolean |
| `--skip-auth-schema`   | Skip creating the auth schema and RLS functions                             | boolean |

`create` also accepts [settings flags](#settings-flags) to configure the Data API at provision time.

### `update` options

| Option      | Description                                                                                                                             | Type    |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `--replace` | Replace settings with only the flags provided. Omitted settings revert to server defaults. The default is `false` (merge with current). | boolean |

`update` requires at least one [settings flag](#settings-flags), or use `refresh-schema` to refresh the schema cache without changing settings.

### Settings flags

These flags are supported by `create` and `update`:

| Flag                            | Description                                                 | Type    |
| ------------------------------- | ----------------------------------------------------------- | ------- |
| `--db-aggregates-enabled`       | Enable aggregate functions in queries                       | boolean |
| `--db-anon-role`                | Database role used for anonymous (unauthenticated) requests | string  |
| `--db-extra-search-path`        | Extra schemas appended to the search path                   | string  |
| `--db-max-rows`                 | Maximum number of rows returned by a single request         | number  |
| `--db-schemas`                  | Comma-separated list of schemas exposed via the Data API    | string  |
| `--jwt-role-claim-key`          | JWT claim path used to extract the role                     | string  |
| `--jwt-cache-max-lifetime`      | Maximum JWT cache lifetime in seconds                       | number  |
| `--openapi-mode`                | OpenAPI mode. Choices: `ignore-privileges`, `disabled`      | string  |
| `--server-cors-allowed-origins` | CORS allowed origins                                        | string  |
| `--server-timing-enabled`       | Enable Server-Timing response headers                       | boolean |

### Examples

Provision the Data API with Neon Auth:

```bash
neon data-api create --database neondb --auth-provider neon_auth
```

Show current Data API status:

```bash
neon data-api get --database neondb
```

Update the maximum rows setting:

```bash
neon data-api update --database neondb --db-max-rows 1000
```

Refresh the schema cache:

```bash
neon data-api refresh-schema --database neondb
```

Delete the Data API for a database:

```bash
neon data-api delete --database neondb
```

<NeedHelp/>
