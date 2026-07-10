---
title: 'Neon CLI command: projects'
subtitle: 'List, create, update, delete, recover, and get Neon projects'
summary: >-
  The Neon CLI `neon projects` command provides subcommands to list, create,
  update, delete, recover, and retrieve Neon projects from the terminal,
  including support for region selection (AWS and Azure), blocking public or VPC
  connections, and filtering shared projects. Use this page when you need CLI
  automation for project lifecycle tasks or to recover a deleted project within
  its 7-day recovery window. Projects created via the CLI default to Postgres
  18; use the Neon Console or API to create projects on earlier Postgres
  versions.
enableTableOfContents: true
updatedOn: '2026-07-01T13:41:48.668Z'
redirectFrom:
  - /docs/reference/cli-projects
  - /docs/cli/project
---

The `projects` command lists, creates, updates, deletes, recovers, and retrieves Neon projects from the terminal. For information about projects in Neon, see [Projects](/docs/manage/projects). Subcommands that show no options table accept only the [global options](/docs/cli#global-options). If `--project-id` is omitted, the CLI resolves it from your [context file](/docs/cli/set-context), auto-selects when your account has only one project, and prompts otherwise.

<CliSubcommands command="projects" />

## neon projects list (#list)

Lists projects that belong to your Neon account, as well as any projects that were shared with you.

<CliUsage command="projects list" />

<CliOptions command="projects list" />

- List projects in your [default organization](/docs/reference/glossary#default-organization). If no organization context is set, the CLI prompts you to select one.

  ```bash
  neon projects list
  ```

  ```text
  Projects
  ┌────────────────────────┬────────────────────┬───────────────┬──────────────────────┐
  │ Id                     │ Name               │ Region Id     │ Created At           │
  ├────────────────────────┼────────────────────┼───────────────┼──────────────────────┤
  │ crimson-voice-12345678 │ frontend           │ aws-us-east-2 │ 2024-04-15T11:17:30Z │
  ├────────────────────────┼────────────────────┼───────────────┼──────────────────────┤
  │ calm-thunder-12121212  │ backend            │ aws-us-east-2 │ 2024-04-10T15:21:01Z │
  ├────────────────────────┼────────────────────┼───────────────┼──────────────────────┤
  │ nameless-hall-87654321 │ billing            │ aws-us-east-2 │ 2024-04-10T14:35:17Z │
  └────────────────────────┴────────────────────┴───────────────┴──────────────────────┘
  Shared with you
  ┌───────────────────┬────────────────────┬──────────────────┬──────────────────────┐
  │ Id                │ Name               │ Region Id        │ Created At           │
  ├───────────────────┼────────────────────┼──────────────────┼──────────────────────┤
  │ noisy-fire-212121 │ API                │ aws-eu-central-1 │ 2023-04-22T18:41:13Z │
  └───────────────────┴────────────────────┴──────────────────┴──────────────────────┘
  ```

List all projects belonging to a specific organization:

```bash
neon projects list --org-id org-xxxx-xxxx
```

List projects that can be recovered (deleted within the last 7 days):

```bash
neon projects list --recoverable-only
```

```text filename="Output"
Projects
┌─────────────────────┬───────────┬───────────────┬──────────────────────┬──────────────────────┬──────────────────────┐
│ Id                  │ Name      │ Region Id     │ Created At           │ Deleted At           │ Recoverable Until    │
├─────────────────────┼───────────┼───────────────┼──────────────────────┼──────────────────────┼──────────────────────┤
│ crimson-voice-12345 │ myproject │ aws-us-east-2 │ 2024-04-15T11:17:30Z │ 2024-04-16T14:22:15Z │ 2024-04-23T14:22:15Z │
└─────────────────────┴───────────┴───────────────┴──────────────────────┴──────────────────────┴──────────────────────┘
```

## neon projects create (#create)

Creates a Neon project.

<CliUsage command="projects create" />

<CliOptions command="projects create" />

The `--region-id` value defaults to `aws-us-east-2` if not specified. `--block-public-connections` and `--block-vpc-connections` are part of [Private Networking](/docs/guides/neon-private-networking); `--hipaa` enables [HIPAA compliance](/docs/security/hipaa) for the project.

<Admonition type="note">
Neon projects created using the CLI use the default Postgres version, which is Postgres 18. To create a project with a different Postgres version, you can use the [Neon Console](/docs/manage/projects#create-a-project) or [Neon API](https://api-docs.neon.tech/reference/createproject).
</Admonition>

Create a project with a user-defined name in a specific region:

```bash
neon projects create --name mynewproject --region-id aws-us-west-2
```

```text filename="Output"
┌───────────────────┬──────────────┬───────────────┬──────────────────────┐
│ Id                │ Name         │ Region Id     │ Created At           │
├───────────────────┼──────────────┼───────────────┼──────────────────────┤
│ muddy-wood-859533 │ mynewproject │ aws-us-west-2 │ 2023-07-09T17:04:29Z │
└───────────────────┴──────────────┴───────────────┴──────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────┐
│ Connection Uri                                                                       │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ postgresql://[user]:[password]@[neon_hostname]/[dbname]                              │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

<Admonition type="tip">
The Neon CLI provides a `neon connection-string` command you can use to extract a connection URI programmatically. See [the connection-string command](/docs/cli/connection-string).
</Admonition>

- Create a project with `--output json`, which returns the full project response data and is the recommended format for scripts and agents. The output below was captured on an earlier CLI version; new projects report `"pg_version": 18`.

  ```bash
  neon projects create --output json
  ```

  <details>
  <summary>Show output</summary>

  ```json
  {
    "project": {
      "data_storage_bytes_hour": 0,
      "data_transfer_bytes": 0,
      "written_data_bytes": 0,
      "compute_time_seconds": 0,
      "active_time_seconds": 0,
      "cpu_used_sec": 0,
      "id": "long-wind-77910944",
      "platform_id": "aws",
      "region_id": "aws-us-east-2",
      "name": "long-wind-77910944",
      "provisioner": "k8s-pod",
      "default_endpoint_settings": {
        "autoscaling_limit_min_cu": 1,
        "autoscaling_limit_max_cu": 1,
        "suspend_timeout_seconds": 0
      },
      "pg_version": 17,
      "proxy_host": "us-east-2.aws.neon.tech",
      "branch_logical_size_limit": 204800,
      "branch_logical_size_limit_bytes": 214748364800,
      "store_passwords": true,
      "creation_source": "neon",
      "history_retention_seconds": 604800,
      "created_at": "2023-08-04T16:16:45Z",
      "updated_at": "2023-08-04T16:16:45Z",
      "consumption_period_start": "0001-01-01T00:00:00Z",
      "consumption_period_end": "0001-01-01T00:00:00Z",
      "owner_id": "e56ad68e-7f2f-4d74-928c-9ea25d7e9864"
    },
    "connection_uris": [
      {
        "connection_uri": "postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require",
        "connection_parameters": {
          "database": "dbname",
          "password": "AbC123dEf",
          "role": "alex",
          "host": "ep-cool-darkness-123456.us-east-2.aws.neon.tech",
          "pooler_host": "ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech"
        }
      }
    ]
  }
  ```

  </details>

Create a project and connect to it with `psql` immediately. Arguments after `--` are passed through to psql, so you can run an `.sql` file or a query on creation:

```bash
neon projects create --psql
neon projects create --psql -- -f dump.sql
neon projects create --psql -- -c "SELECT version()"
```

Create a project and set the Neon CLI project context to it:

```bash
neon projects create --set-context
```

## neon projects update (#update)

Updates a Neon project. The `<id>` is the project ID, which you can obtain by listing your projects or from the **Settings** page in the Neon Console.

<CliUsage command="projects update" />

<CliOptions command="projects update" />

`--block-public-connections`, `--block-vpc-connections`, and `--hipaa` behave as described under [projects create](#create).

Update the project name:

```bash
neon projects update muddy-wood-859533 --name dev_project_1
```

```text filename="Output"
┌───────────────────┬───────────────┬───────────────┬──────────────────────┐
│ Id                │ Name          │ Region Id     │ Created At           │
├───────────────────┼───────────────┼───────────────┼──────────────────────┤
│ muddy-wood-859533 │ dev_project_1 │ aws-us-west-2 │ 2023-07-09T17:04:29Z │
└───────────────────┴───────────────┴───────────────┴──────────────────────┘
```

Block connections from the public internet (see [restrict public internet access](/docs/guides/neon-private-networking#restrict-public-internet-access)):

```bash
neon projects update orange-credit-12345678 --block-public-connections=true
```

## neon projects delete (#delete)

Deletes a Neon project. The `<id>` is the project ID.

<CliUsage command="projects delete" />

<CliOptions command="projects delete" />

```bash
neon projects delete muddy-wood-859533
```

```text filename="Output"
┌───────────────────┬───────────────┬───────────────┬──────────────────────┐
│ Id                │ Name          │ Region Id     │ Created At           │
├───────────────────┼───────────────┼───────────────┼──────────────────────┤
│ muddy-wood-859533 │ dev_project_1 │ aws-us-west-2 │ 2023-07-09T17:04:29Z │
└───────────────────┴───────────────┴───────────────┴──────────────────────┘
```

Verify the deletion with `neon projects list`.

## neon projects recover (#recover)

Recovers a deleted project within the deletion recovery period. The `<id>` is the project ID, which you can obtain by listing recoverable projects with `neon projects list --recoverable-only`.

<CliUsage command="projects recover" />

<CliOptions command="projects recover" />

```bash
neon projects recover crimson-voice-12345678
```

```text filename="Output"
┌────────────────────────┬───────────┬───────────────┬──────────────────────┐
│ Id                     │ Name      │ Region Id     │ Created At           │
├────────────────────────┼───────────┼───────────────┼──────────────────────┤
│ crimson-voice-12345678 │ myproject │ aws-us-east-2 │ 2024-04-15T11:17:30Z │
└────────────────────────┴───────────┴───────────────┴──────────────────────┘
```

For details on what's recovered and what requires reconfiguration after recovery, see [Recover a deleted project](/docs/manage/projects#recover-a-deleted-project).

## neon projects get (#get)

Retrieves details about a Neon project. The `<id>` is the project ID.

<CliUsage command="projects get" />

<CliOptions command="projects get" />

```bash
neon projects get muddy-wood-859533
```

```text filename="Output"
┌───────────────────┬───────────────┬───────────────┬──────────────────────┐
│ Id                │ Name          │ Region Id     │ Created At           │
├───────────────────┼───────────────┼───────────────┼──────────────────────┤
│ muddy-wood-859533 │ dev_project_1 │ aws-us-west-2 │ 2023-07-09T17:04:29Z │
└───────────────────┴───────────────┴───────────────┴──────────────────────┘
```
