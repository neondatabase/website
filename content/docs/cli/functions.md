---
title: 'Neon CLI command: functions'
subtitle: 'Deploy, list, inspect, and delete Neon Functions'
summary: >-
  The Neon CLI `neonctl functions` command manages Neon Functions on a branch:
  `neonctl functions deploy <slug>` bundles and deploys a function from a local
  directory or entry file (with --src, --runtime, --env, and --wait), and the list,
  get, and delete subcommands manage deployed functions. The slug is the
  permanent function identifier: 1 to 20 lowercase letters and digits.
enableTableOfContents: true
---

<PrivatePreviewEnquire/>

The `functions` command manages [Neon Functions](/docs/compute/functions/overview) on a branch. This is the command reference; for the full deployment workflow, see [Deploy functions](/docs/compute/functions/deploy). To run functions locally, see [`neonctl dev`](/docs/cli/dev).

<CliSubcommands command="functions" />

## neonctl functions deploy (#deploy)

Deploys a function from a local directory or entry file. The `<slug>` is the permanent function identifier: 1 to 20 lowercase letters and digits (`^[a-z0-9]{1,20}$`).

<CliUsage command="functions deploy" />

<CliOptions command="functions deploy" />

Use `--wait` to block until the deployment finishes building, which is the predictable path for scripts and CI.

Deploy a function from an entry file:

```bash
neonctl functions deploy hello --src functions/hello.ts
```

```text filename="Output"
INFO: Function deployment triggered for function hello.
┌────┬───────────┬──────────┬────────────┬─────────────────────────────┐
│ Id │ Status    │ Runtime  │ Memory Mib │ Created At                  │
├────┼───────────┼──────────┼────────────┼─────────────────────────────┤
│ 1  │ completed │ nodejs24 │ 2048       │ 2026-06-12T00:14:58.044690Z │
└────┴───────────┴──────────┴────────────┴─────────────────────────────┘
INFO: Function deployment hello/1 completed.
```

Deploy with environment variables and wait for the build:

```bash
neonctl functions deploy hello --src functions/hello.ts --env LOG_LEVEL=info --wait
```

## neonctl functions list (#list)

Lists the functions on the branch.

<CliUsage command="functions list" />

<CliOptions command="functions list" />

```bash
neonctl functions list
```

```text filename="Output"
┌───────┬───────┬─────────────────────────────────────────────────────────────────────────────┬─────────────────────────────┐
│ Slug  │ Name  │ Invocation Url                                                              │ Created At                  │
├───────┼───────┼─────────────────────────────────────────────────────────────────────────────┼─────────────────────────────┤
│ hello │ hello │ https://br-cool-darkness-123456-hello.compute.c-1.us-east-2.aws.neon.build/ │ 2026-06-12T00:14:57.942988Z │
└───────┴───────┴─────────────────────────────────────────────────────────────────────────────┴─────────────────────────────┘
```

List with full deployment details for scripts and agents:

```bash
neonctl functions list --output json
```

<details>
<summary>Show output</summary>

```json
[
  {
    "id": "hello",
    "slug": "hello",
    "name": "hello",
    "invocation_url": "https://br-cool-darkness-123456-hello.compute.c-1.us-east-2.aws.neon.build/",
    "current_deployment": {
      "id": 1,
      "status": "completed",
      "memory_mib": 2048,
      "runtime": "nodejs24",
      "created_at": "2026-06-12T00:14:58.044690Z"
    },
    "active_deployment": {
      "id": 1,
      "status": "completed",
      "memory_mib": 2048,
      "runtime": "nodejs24",
      "created_at": "2026-06-12T00:14:58.044690Z"
    },
    "created_at": "2026-06-12T00:14:57.942988Z"
  }
]
```

</details>

## neonctl functions get (#get)

Shows a function's details.

<CliUsage command="functions get" />

<CliOptions command="functions get" />

```bash
neonctl functions get hello
```

```text filename="Output"
function
┌───────┬───────┬─────────────────────────────────────────────────────────────────────────────┬─────────────────────────────┐
│ Slug  │ Name  │ Invocation Url                                                              │ Created At                  │
├───────┼───────┼─────────────────────────────────────────────────────────────────────────────┼─────────────────────────────┤
│ hello │ hello │ https://br-cool-darkness-123456-hello.compute.c-1.us-east-2.aws.neon.build/ │ 2026-06-12T00:14:57.942988Z │
└───────┴───────┴─────────────────────────────────────────────────────────────────────────────┴─────────────────────────────┘
active deployment
┌────┬───────────┬──────────┬────────────┬─────────────────────────────┐
│ Id │ Status    │ Runtime  │ Memory Mib │ Created At                  │
├────┼───────────┼──────────┼────────────┼─────────────────────────────┤
│ 1  │ completed │ nodejs24 │ 2048       │ 2026-06-12T00:14:58.044690Z │
└────┴───────────┴──────────┴────────────┴─────────────────────────────┘
```

## neonctl functions delete (#delete)

Deletes a function on the branch.

<CliUsage command="functions delete" />

<CliOptions command="functions delete" />

```bash
neonctl functions delete hello
```

```text filename="Output"
INFO: Function hello deleted from branch br-cool-darkness-123456
```
