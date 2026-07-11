---
title: Deploy and manage Neon Functions
subtitle: CLI and API reference for deploying and managing Neon Functions.
summary: >-
  Reference for deploying Neon Functions with neon deploy, neon functions
  deploy, or the Neon API, including flags, deployment states, and slug rules.
  Also covers checking status, listing functions, and deleting them.
enableTableOfContents: true
updatedOn: '2026-07-11T13:26:09.521Z'
---

<PrivatePreviewEnquire/>

## Deploy with `neon.ts`

If your project has a [`neon.ts`](/docs/reference/neon-ts) config, this is the recommended way to deploy. `neon deploy` reads the config and applies the entire branch policy in one step: services, per-branch tuning, and every function it declares:

```bash
neon deploy
```

| Flag                | Default           | Description                                                                                          |
| ------------------- | ----------------- | ---------------------------------------------------------------------------------------------------- |
| `--config`          | walks up from cwd | Path to the `neon.ts` policy                                                                         |
| `--env`             | (none)            | Path to a `.env` file loaded before `neon.ts` is evaluated, so function `env` values resolve from it |
| `--branch`          | linked branch     | Target branch ID or name                                                                             |
| `--project-id`      | linked project    | Project ID                                                                                           |
| `--update-existing` | `false`           | Auto-confirm overriding existing remote settings on the branch                                       |
| `--allow-protected` | `false`           | Auto-confirm applying to a branch marked protected on Neon                                           |

`neon deploy` is an alias for `neon config apply`. To preview what a deploy would change without applying it, run `neon config plan`.

Note that `--env` here takes a path to a `.env` file. The `--env` flag on `neon functions deploy` below takes `KEY=VALUE` pairs instead.

## Deploy with `neon functions deploy`

To deploy one function directly, without a `neon.ts` config:

```bash shouldWrap
neon functions deploy <slug> [--src <dir-or-entry-file>] [--env KEY=VALUE] [--wait]
```

The CLI bundles with esbuild, zips the output, and uploads it. The first deploy creates the function; subsequent deploys update it. See the [neon functions reference](/docs/cli/functions) for the full command surface.

| Flag              | Default       | Description                                                                                                                                   |
| ----------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `--src`           | (none)        | Function source: a directory containing `index.ts`, `index.mjs`, or `index.js`, or a path to the entry file                                   |
| `--env KEY=VALUE` | (none)        | Set an environment variable. Repeatable. Stored with the deployment. Takes `KEY=VALUE` pairs, not a `.env` file path like `neon deploy --env` |
| `--runtime`       | `nodejs24`    | Function runtime. `nodejs24` is the only valid value                                                                                          |
| `--branch`        | linked branch | Target branch. Defaults to the branch in `.neon`                                                                                              |
| `--wait`          | `true`        | Poll until `completed` or `failed`, up to 10 minutes                                                                                          |

**Examples:**

```bash
neon functions deploy hello --src functions/hello.ts
```

```bash
neon functions deploy hello --src . --env RESEND_API_KEY=re_...
```

```bash
neon functions deploy hello --src functions/hello.ts --branch feat/my-feature
```

The CLI doesn't support a config-only deploy. Every `neon functions deploy` call bundles and uploads source, whether you pass `--src` or let it default to the current directory, so there's no way to change just an environment variable without also pointing at valid source, as in the example above.

For a deploy that skips bundling and updates only the environment or runtime, use [the API](#deploy-with-the-api), which accepts config-only updates.

## Deploy with the API

Bundle with esbuild, zip the output, then POST to the deploy endpoint.

**1. Bundle:**

```bash
esbuild functions/hello.ts --bundle --platform=node --target=node24 --outfile=dist/index.mjs
```

**2. Zip:**

```bash
zip -j function.zip dist/index.mjs
```

The archive's entry file must be named `index.mjs` or `index.js`; the runtime looks for those names.

From Node.js, `buildFunctionBundle` from [`@neon/config-runtime`](https://www.npmjs.com/package/@neon/config-runtime) does both steps in one call and produces exactly the archive the deploy endpoint expects:

```ts
import { buildFunctionBundle } from "@neon/config-runtime/v1";

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

| Field         | Type   | Required          | Description                                                                                           |
| ------------- | ------ | ----------------- | ----------------------------------------------------------------------------------------------------- |
| `zip`         | binary | When code changes | ZIP of the bundled function. Omit only to update `environment` or `runtime` on an existing deployment |
| `runtime`     | string | No                | `nodejs24` is the only valid value                                                                    |
| `environment` | string | No                | JSON-encoded string-to-string map                                                                     |

The deploy endpoint accepts `multipart/form-data`. Use a `zip` part for code deploys and a single `environment` part containing the JSON-encoded map; don't send bracketed fields such as `environment[KEY]=value`. The first deployment for a function must include `zip`; later deployments can omit it for config-only changes.

The API returns immediately for code deploys. Poll the get endpoint (see [Check status](#check-status)) until the deployment completes. Config-only deployments can complete synchronously because they reuse the latest bundle. Builds have an absolute 2-minute budget from the time the deploy is accepted; if the build can't complete within that window, the deployment fails.

### Deploy with `@neon/sdk`

The beta [`@neon/sdk`](https://www.npmjs.com/package/@neon/sdk) client includes a `neon.functions` namespace for branch-scoped function management:

```ts
import { createNeonClient } from '@neon/sdk';
import { readFile } from 'node:fs/promises';

const neon = createNeonClient({ apiKey: process.env.NEON_API_KEY! });
const projectId = process.env.NEON_PROJECT_ID!;
const branchId = process.env.NEON_BRANCH_ID!;
const zipBytes = await readFile('function.zip');

const { data: deployment } = await neon.functions.deploy(projectId, branchId, 'hello', {
  zip: new File([zipBytes], 'function.zip', { type: 'application/zip' }),
  runtime: 'nodejs24',
  environment: JSON.stringify({ MY_SECRET: 'value' }),
});
```

`neon.functions.deploy` uses the same multipart API fields as the raw endpoint. `list`, `get`, `update`, and `delete` are also available under `neon.functions`.

## Slugs

The slug is assigned at first deploy: either the key in `neon.ts` or the positional argument to `neon functions deploy`. It becomes part of the invocation URL and can't be changed afterward. Slugs must match `^[a-z0-9]{1,20}$`: lowercase letters and digits only, 1 to 20 characters, no hyphens.

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
neon functions get hello
```

</TabItem>
<TabItem>

```text shouldWrap
GET /projects/{project_id}/branches/{branch_id}/functions/{slug}
```

</TabItem>
</Tabs>

The response includes `invocation_url`, the public URL for your function:

```
https://<branch_id>-<slug>.compute.<cell>.us-east-2.aws.neon.tech
```

### List functions

<Tabs labels={["CLI", "API"]}>
<TabItem>

```bash
neon functions list
```

</TabItem>
<TabItem>

```text shouldWrap
GET /projects/{project_id}/branches/{branch_id}/functions
```

</TabItem>
</Tabs>

### Delete a function

<Tabs labels={["CLI", "API"]}>
<TabItem>

```bash
neon functions delete hello
```

</TabItem>
<TabItem>

```text shouldWrap
DELETE /projects/{project_id}/branches/{branch_id}/functions/{slug}
```

</TabItem>
</Tabs>

<NeedHelp/>
