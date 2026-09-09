---
title: 'Neon CLI command: functions'
subtitle: 'Deploy, list, inspect, and delete Neon Functions, and manage their custom domains'
summary: >-
  The Neon CLI `neon functions` command manages Neon Functions on a branch: deploy,
  list, get, and delete functions, and register and manage their custom domains with
  the `domains` subcommands.
enableTableOfContents: true
redirectFrom:
  - /docs/cli/function
---

<FeatureBetaProps feature_name="Neon Functions" />

The `functions` command manages [Neon Functions](/docs/compute/functions/overview) on a branch. This is the command reference; for the full deployment workflow, see [Deploy functions](/docs/compute/functions/deploy). To run functions locally, see [`neon dev`](/docs/cli/dev).

<CliSubcommands command="functions" />

## neon functions deploy (#deploy)

Deploys a function from a local directory or entry file. The `<slug>` is the permanent function identifier: 1 to 20 lowercase letters and digits (`^[a-z0-9]{1,20}$`).

<CliUsage command="functions deploy" />

<CliOptions command="functions deploy" />

By default, `deploy` waits until the deployment finishes building (`--wait=true`), which is the predictable path for scripts and CI. Use `--no-wait` to return immediately after triggering the deployment.

By default, `deploy` bundles your `--src` with esbuild before uploading. Pass `--no-bundle` to skip bundling and deploy a prebuilt source instead: the directory root (or the file you point at) must be named or contain `index.mjs` or `index.js`. This is useful when you run your own build step and want to ship the output as-is.

Deploy a function from an entry file:

```bash
neon functions deploy hello --src functions/hello.ts
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
neon functions deploy hello --src functions/hello.ts --env LOG_LEVEL=info --wait
```

## neon functions list (#list)

Lists the functions on the branch.

<CliUsage command="functions list" />

<CliOptions command="functions list" />

```bash
neon functions list
```

```text filename="Output"
┌───────┬───────┬─────────────────────────────────────────────────────────────────────────────┬─────────────────────────────┐
│ Slug  │ Name  │ Invocation Url                                                              │ Created At                  │
├───────┼───────┼─────────────────────────────────────────────────────────────────────────────┼─────────────────────────────┤
│ hello │ hello │ https://br-cool-darkness-123456-hello.compute.c-1.us-east-2.aws.neon.tech/ │ 2026-06-12T00:14:57.942988Z │
└───────┴───────┴─────────────────────────────────────────────────────────────────────────────┴─────────────────────────────┘
```

List with full deployment details for scripts and agents:

```bash
neon functions list --output json
```

<details>
<summary>Show output</summary>

```json
[
  {
    "id": "hello",
    "slug": "hello",
    "name": "hello",
    "invocation_url": "https://br-cool-darkness-123456-hello.compute.c-1.us-east-2.aws.neon.tech/",
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

## neon functions get (#get)

Shows a function's details.

<CliUsage command="functions get" />

<CliOptions command="functions get" />

```bash
neon functions get hello
```

```text filename="Output"
function
┌───────┬───────┬─────────────────────────────────────────────────────────────────────────────┬─────────────────────────────┐
│ Slug  │ Name  │ Invocation Url                                                              │ Created At                  │
├───────┼───────┼─────────────────────────────────────────────────────────────────────────────┼─────────────────────────────┤
│ hello │ hello │ https://br-cool-darkness-123456-hello.compute.c-1.us-east-2.aws.neon.tech/ │ 2026-06-12T00:14:57.942988Z │
└───────┴───────┴─────────────────────────────────────────────────────────────────────────────┴─────────────────────────────┘
deployment (current, active)
┌────┬───────────┬──────────┬────────────┬─────────────────────────────┐
│ Id │ Status    │ Runtime  │ Memory Mib │ Created At                  │
├────┼───────────┼──────────┼────────────┼─────────────────────────────┤
│ 1  │ completed │ nodejs24 │ 2048       │ 2026-06-12T00:14:58.044690Z │
└────┴───────────┴──────────┴────────────┴─────────────────────────────┘
```

## neon functions delete (#delete)

Deletes a function on the branch.

<CliUsage command="functions delete" />

<CliOptions command="functions delete" />

```bash
neon functions delete hello
```

```text filename="Output"
INFO: Function hello deleted from branch br-cool-darkness-123456
```

## neon functions domains (#domains)

Manage custom domains for functions on the branch. Custom domains are in beta.

<CliSubcommands command="functions domains" anchorParts="domains" />

### neon functions domains list (#domains-list)

Lists the custom domains registered on the branch.

<CliUsage command="functions domains list" />

<CliOptions command="functions domains list" />

```bash
neon functions domains list
```

The default table shows the domain, target function, and CNAME target. To inspect DNS and routing status, use JSON output:

```bash
neon functions domains list --output json
```

```json filename="Output"
[
  {
    "domain": "docs.example.com",
    "entity_type": "function",
    "entity_id": "hello",
    "cname_target": "fn-custom-domains.us-east-2.aws.neon.tech",
    "status": "active",
    "dns_status": "ok",
    "binding_status": "present",
    "status_reason": ""
  }
]
```

An `active` status confirms that DNS, CAA authorization, and routing are ready. Verify the domain with an HTTPS request because certificate issuance isn't included in this status.

### neon functions domains register (#domains-register)

Points a domain you already own at a function on the branch. Both `--slug` and the domain are required. The command prints a CNAME target; create a CNAME record for the domain at your DNS provider pointing at that target. See [Custom domains](/docs/compute/functions/custom-domains) for DNS, CAA, and TLS details.

<CliUsage command="functions domains register" />

<CliOptions command="functions domains register" />

```bash
neon functions domains register docs.example.com --slug hello
```

### neon functions domains delete (#domains-delete)

Deletes a custom domain from the branch.

<CliUsage command="functions domains delete" />

<CliOptions command="functions domains delete" />

```bash
neon functions domains delete docs.example.com
```

Routing changes are eventually consistent, so the custom URL can continue reaching the function briefly after deletion. Deleting a function doesn't delete its custom-domain registration; delete the domain separately.
