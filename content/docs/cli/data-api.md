---
title: 'Neon CLI command: data-api'
subtitle: Provision and manage the Neon Data API from the CLI
summary: >-
  Covers the usage of the `data-api` command in the Neon CLI to create, inspect,
  update, refresh, and delete the Neon Data API for a database.
enableTableOfContents: true
updatedOn: '2026-06-12T00:40:08.097Z'
redirectFrom:
  - /docs/reference/cli-data-api
---

The `data-api` command provisions and manages the [Neon Data API](/docs/data-api/overview) for a database. For Console-based management, see [Manage Data API](/docs/data-api/manage).

Requires neonctl 2.22.2 or later. Check your version with `neonctl --version`.

<CliSubcommands command="data-api" />

If `--project-id`, `--branch`, or `--database` are omitted, the CLI resolves them from your [context file](/docs/cli/set-context), auto-selects when there is only one option, and prompts otherwise.

## Settings flags (#settings-flags)

The `create` and `update` subcommands share a set of settings flags that configure how the Data API serves your database:

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

## neonctl data-api create (#create)

Provisions the Neon Data API for a database.

<CliUsage command="data-api create" />

<CliOptions command="data-api create" />

`create` also accepts [settings flags](#settings-flags) to configure the Data API at provision time.

Provision the Data API with Neon Auth:

```bash
neonctl data-api create --database neondb --auth-provider neon_auth
```

## neonctl data-api get (#get)

Shows the Neon Data API status and settings.

<CliUsage command="data-api get" />

<CliOptions command="data-api get" />

```bash
neonctl data-api get --database neondb
```

## neonctl data-api update (#update)

Updates Neon Data API settings. By default, the flags you provide are merged with the current settings. Pass `--replace` to overwrite all settings with only the flags you provide.

<CliUsage command="data-api update" />

<CliOptions command="data-api update" />

`update` requires at least one [settings flag](#settings-flags). To refresh the schema cache without changing settings, use [`refresh-schema`](#refresh-schema) instead.

```bash
neonctl data-api update --database neondb --db-max-rows 1000
```

## neonctl data-api refresh-schema (#refresh-schema)

Refreshes the Data API schema cache without changing settings.

<CliUsage command="data-api refresh-schema" />

<CliOptions command="data-api refresh-schema" />

```bash
neonctl data-api refresh-schema --database neondb
```

## neonctl data-api delete (#delete)

Deletes the Neon Data API for a database.

<CliUsage command="data-api delete" />

<CliOptions command="data-api delete" />

```bash
neonctl data-api delete --database neondb
```
