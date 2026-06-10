---
title: Deploy and manage functions
subtitle: CLI and API reference for deploying and managing Neon Functions.
summary: >-
  Reference for deploying Neon Functions with neonctl functions deploy or the
  Neon API, including flags, deployment states, and slug rules. Also covers
  checking status, listing functions, and deleting them.
enableTableOfContents: true
---

<Admonition type="note" title="Private Preview">
Neon Functions is currently in Private Preview, available for new projects in the AWS us-east-2 region only. To request access, sign up at [We're building backends](https://neon.com/blog/were-building-backends).
</Admonition>

## Deploy with the CLI

```bash shouldWrap
neonctl functions deploy <slug> [--path <dir>] [--entry <file>] [--env KEY=VALUE] [--wait]
```

The CLI bundles with esbuild, zips the output, and uploads it. The first deploy creates the function; subsequent deploys update it. At least one of `--path`, `--entry`, `--env`, or `--runtime` is required; bare `neonctl functions deploy <slug>` with no flags will error.

| Flag              | Default       | Description                                                        |
| ----------------- | ------------- | ------------------------------------------------------------------ |
| `--path`          | `.`           | Directory containing the function source                           |
| `--entry`         | `index.ts`    | Entry file relative to `--path`                                    |
| `--env KEY=VALUE` | (none)        | Set an environment variable. Repeatable. Baked into the deployment |
| `--runtime`       | `nodejs24`    | Function runtime. `nodejs24` is the only valid value               |
| `--branch`        | linked branch | Target branch. Defaults to the branch in `.neon`                   |
| `--wait`          | `true`        | Poll until `completed` or `failed`, up to 10 minutes               |

**Examples:**

```bash
neonctl functions deploy hello --path . --entry functions/hello.ts
```

```bash
neonctl functions deploy hello --path . --env OPENAI_API_KEY=sk-...
```

```bash
neonctl functions deploy hello --path . --branch feat/my-feature
```

<Callout>
If you use `neon.ts`, `neonctl deploy` applies your entire branch config (functions and all) in one step. See `neonctl deploy --help` for details.
</Callout>

## Deploy with the API

Bundle with esbuild, zip the output, then POST to the deploy endpoint.

**1. Bundle:**

```bash
esbuild functions/hello.ts --bundle --platform=node --target=node24 --outfile=dist/index.js
```

**2. Zip:**

```bash
zip -j function.zip dist/index.js
```

From Node.js, `buildFunctionBundle` from [`@neondatabase/config-runtime`](https://www.npmjs.com/package/@neondatabase/config-runtime) does both steps in one call and produces exactly the archive the deploy endpoint expects:

```ts
import { buildFunctionBundle } from "@neondatabase/config-runtime/v1";

const zip = await buildFunctionBundle({
  slug: "hello",
  name: "My first function",
  source: "./functions/hello.ts",
  env: {},
  runtime: "nodejs24",
});
```

**3. Deploy:**

```bash shouldWrap
curl -X POST \
  "https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/functions/{slug}/deployments" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -F "zip=@function.zip" \
  -F 'environment={"MY_SECRET":"value"}'
```

| Field         | Type   | Required          | Description                                                |
| ------------- | ------ | ----------------- | ---------------------------------------------------------- |
| `zip`         | binary | First deploy only | ZIP of the bundled function. Omit to reuse existing bundle |
| `runtime`     | string | No                | `nodejs24` is the only valid value                         |
| `environment` | string | No                | JSON-encoded string-to-string map                          |

The API returns immediately. Poll the get endpoint to check status.

## Slugs

The slug is the permanent identifier assigned at first deploy: either the key in `neon.ts` or the positional argument to `neonctl functions deploy`. It becomes part of the invocation URL and can't be changed. Slugs must match `^[a-z0-9]{1,20}$`: lowercase letters and digits only, 1 to 20 characters, no hyphens.

## Deployment states

| State       | Meaning                                 |
| ----------- | --------------------------------------- |
| `pending`   | Queued, not yet building                |
| `building`  | Source is being compiled and bundled    |
| `completed` | Function is live and accepting requests |
| `failed`    | Build or deployment error               |

## Manage functions

### Check status

<Tabs labels={["CLI", "API"]}>
<TabItem>

```bash
neonctl functions get hello
```

</TabItem>
<TabItem>

```bash shouldWrap
GET /projects/{project_id}/branches/{branch_id}/functions/{slug}
```

</TabItem>
</Tabs>

The response includes `invocation_url`, the public URL for your function:

```
https://<branch_id>-<slug>.compute.c-1.us-east-2.aws.neon.tech
```

### List functions

<Tabs labels={["CLI", "API"]}>
<TabItem>

```bash
neonctl functions list
```

</TabItem>
<TabItem>

```bash shouldWrap
GET /projects/{project_id}/branches/{branch_id}/functions
```

</TabItem>
</Tabs>

### Delete a function

<Tabs labels={["CLI", "API"]}>
<TabItem>

```bash
neonctl functions delete hello
```

</TabItem>
<TabItem>

```bash shouldWrap
DELETE /projects/{project_id}/branches/{branch_id}/functions/{slug}
```

</TabItem>
</Tabs>

<NeedHelp/>
