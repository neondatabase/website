---
title: 'Neon CLI command: functions'
subtitle: 'Create, deploy, list, inspect, and delete Neon Functions, and manage their custom domains'
summary: >-
  The Neon CLI `neon functions` command manages Neon Functions on a branch: create
  functions from Function Registry templates, deploy, list, get, and delete functions,
  and register and manage their custom domains with the `domains` subcommands.
enableTableOfContents: true
redirectFrom:
  - /docs/cli/function
---

The `functions` command manages [Neon Functions](/docs/compute/functions/overview) on a branch. This is the command reference; for the full deployment workflow, see [Deploy functions](/docs/compute/functions/deploy). To run functions locally, see [`neon dev`](/docs/cli/dev).

<CliSubcommands command="functions" />

## neon functions new (#new)

Creates a function from a Neon Function Registry template. It writes the template's files to `functions/<slug>/` and declares the function in `neon.ts`, creating the file if needed. It doesn't need a project or a signed-in session.

<CliUsage command="functions new" />

<CliOptions command="functions new" />

A `router` template becomes one function, with a generated `index.ts` that routes each URL path to an operation. A `separate` template declares one function per operation under slugs the template sets, so `--slug` only renames the directory.

If the template needs environment variables, the command declares them in `neon.ts` and adds their names, without values, to `.env.example`. Set the values in your env file and pass it to `neon config apply --env`; the `Next:` list prints the exact command. For `neon dev`, export them in your shell.

Create a function from the `basic` template:

```bash
neon functions new basic --no-install
```

```text filename="Output"
Function created.
-----------------

  Template      Basic function (Neon)
  Function      basic
  Directory     functions/basic
  Config        neon.ts created: added functions.basic
  Dependencies  not installed

Next:
  npm install @neon/config @neon/env
  neon dev
  neon config apply
```

Use your own slug and skip `neon.ts`:

```bash
neon functions new basic --slug hello --no-add-to-config
```

```text filename="Output"
Function created.
-----------------

  Template   Basic function (Neon)
  Function   hello
  Directory  functions/hello
  Config     not added

Next:
  neon dev --source functions/hello/index.ts
  neon functions deploy hello --src functions/hello/index.ts
```

Templates live in [`registry/`](https://github.com/neondatabase/examples/tree/main/registry) in `neondatabase/examples`. To try an unmerged template, set `NEON_FUNCTION_REGISTRY_DIR` to a local copy of that directory.

## neon functions templates (#templates)

Browse the templates in the Neon Function Registry.

<CliSubcommands command="functions templates" anchorParts="templates" />

### neon functions templates list (#templates-list)

Lists the templates you can pass to [`neon functions new`](#new).

<CliUsage command="functions templates list" />

<CliOptions command="functions templates list" />

```bash
neon functions templates list
```

```text filename="Output"
ID     Title           Provider  Description
basic  Basic function  Neon      A minimal Neon Function with a JSON response.
```

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
Function deployment triggered for function hello.
Function hello
URL            https://br-cool-darkness-123456-hello.compute.c-1.us-east-2.aws.neon.tech/
Deployment ID  1
Status         completed
Runtime        nodejs24
Memory         2048 MiB
Created At     2026-06-12T00:14:58.044690Z
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
Slug   Name   Status     URL                                                                         Created At
hello  hello  completed  https://br-cool-darkness-123456-hello.compute.c-1.us-east-2.aws.neon.tech/  2026-06-12T00:14:57.942988Z
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
Function
Slug        hello
Name        hello
URL         https://br-cool-darkness-123456-hello.compute.c-1.us-east-2.aws.neon.tech/
Created At  2026-06-12T00:14:57.942988Z

Deployment (current, active)
Deployment ID  1
Status         completed
Runtime        nodejs24
Memory         2048 MiB
Created At     2026-06-12T00:14:58.044690Z
```

## neon functions delete (#delete)

Deletes a function on the branch.

<CliUsage command="functions delete" />

<CliOptions command="functions delete" />

```bash
neon functions delete hello
```

```text filename="Output"
Function hello deleted from branch br-cool-darkness-123456
```

## neon functions domains (#domains)

Manage custom domains for functions on the branch.

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
