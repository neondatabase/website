---
title: '@neon/config-runtime'
subtitle: Programmatic API for running a neon.ts policy from your own scripts and CI.
summary: >-
  @neon/config-runtime is the lower-level, scriptable engine behind neon
  config / neon deploy: inspect, plan, and apply a neon.ts policy directly
  from Node.js, without going through the neon CLI. Use it to build a custom
  CI step, a deploy script, or another tool that needs to reconcile a branch
  against a neon.ts policy.
enableTableOfContents: true
---

`@neon/config-runtime` is the package the [`neon` CLI](/docs/cli/config) itself uses to run a [`neon.ts`](/docs/reference/neon-ts) policy: read a branch's live state, diff a policy against it, apply the result, and bundle and deploy Neon Functions. Import it directly when you're writing your own CI step or script and the CLI commands (`neon config plan`, `neon deploy`) don't fit. For example, a custom GitHub Actions job that applies a policy to a freshly created preview branch.

If you just want to run `neon.ts` from the command line, use the [`neon config` / `neon deploy` commands](/docs/cli/config) instead. Reach for this package only when you need to call the same logic from your own Node.js code.

<Admonition type="note">
`@neon/config-runtime` is filesystem- and env-agnostic: it never reads a `.neon` context file or `NEON_*` environment variables (except the `NEON_API_KEY` / `NEON_API_HOST` fallbacks documented under [Authentication](#authentication)). You resolve `projectId` and `branchId` yourself and pass them in explicitly. This is different from the `neon` CLI, which resolves both from `.neon` / `NEON_*` for you.
</Admonition>

## Install

```bash
npm install @neon/config-runtime
```

Requires Node.js 20.19 or later. Import from the `/v1` subpath to pin a specific major version:

```ts
import { inspect, plan, apply } from "@neon/config-runtime/v1";
```

This package pulls in `esbuild` (a native binary) to bundle Neon Functions for deploy, so it belongs in a CLI, CI job, or deploy script, not in `neon.ts` itself. `neon.ts` should only ever import [`@neon/config`](/docs/reference/neon-ts), which has no native dependencies.

## Resolving project and branch ids

Every function on this page takes `projectId` and a Neon branch id (`br-…`), not a branch name. Look these up yourself before calling in:

- `neon projects list --output json` and `neon branches list --output json` (the [Neon CLI](/docs/cli))
- The Neon API's [list branches](https://api-docs.neon.tech/reference/listprojectbranches) endpoint
- The `.neon` context file written by `neon link` (the CLI's own resolution mechanism, if your script runs alongside it)

Passing a branch name where an id is expected fails with a `PLATFORM_BRANCH_NOT_FOUND` error (see [Error handling](#error-handling)).

## Quick example

```ts
import config from "../neon";
import { apply, inspect, plan } from "@neon/config-runtime/v1";

const target = { projectId: "solitary-fog-12345678", branchId: "br-cool-forest-12345678" };

const live = await inspect(target); // read the branch's current live state
const diff = await plan(config, target); // dry-run: what would apply change?
const result = await apply(config, target); // apply the policy for real
```

`apply` throws if the branch already has settings your policy would override. See [`apply`](#apply) for how to allow that.

## Authentication

None of the functions on this page take a Neon session or browser login. They authenticate with a Neon API key, resolved in this order:

1. The `apiKey` option, if you pass one.
2. The `NEON_API_KEY` environment variable.
3. `~/.config/neonctl/credentials.json`, written after running `neon auth` (or `npx neonctl auth`): the same file the CLI itself uses.

If none of these resolve, every function throws a `PlatformError` with code `PLATFORM_MISSING_API_KEY` and a message pointing you to [console.neon.tech/app/settings/api-keys](https://console.neon.tech/app/settings/api-keys) to generate a key. `apiHost` follows the same pattern for `inspect`, `plan`, `apply`, `pullConfig`, and `pushConfig`: pass it explicitly, or let it fall back to `NEON_API_HOST` and then Neon's production API. `createBranch` is the exception: `CreateBranchOptions` has no `apiHost` field, so you can't override the host per call there. It still honors `NEON_API_HOST` from the environment if you set it.

Pass `api` instead to inject your own `NeonApi` adapter (used internally for tests; most callers don't need this).

## Operations

The three functions below mirror the Terraform mental model (`inspect` reads state, `plan` previews a diff, `apply` reconciles it) and are what `neon config status` / `plan` / `apply` call internally.

### `inspect`

```ts
function inspect(options: ConfigOperationOptions): Promise<PulledBranchConfig>;
```

Reads a branch's live Neon state and reverse-engineers it into a `neon.ts`-shaped `Config`, plus raw project/branch metadata. Read-only, and never mutates anything.

| `ConfigOperationOptions` field | Type       | Description                                                               |
| ------------------------------ | ---------- | ------------------------------------------------------------------------- |
| `projectId`                    | `string`   | Required.                                                                 |
| `branchId`                     | `string`   | Required. Must already exist on the project; `inspect` never creates one. |
| `apiKey`                       | `string?`  | See [Authentication](#authentication).                                    |
| `apiHost`                      | `string?`  | See [Authentication](#authentication).                                    |
| `api`                          | `NeonApi?` | Inject a custom adapter (mainly for tests).                               |

Returns a `PulledBranchConfig`:

| Field     | Type                                                      | Description                                                                                                                                                 |
| --------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `project` | `{ id, name, region, pgVersion, orgId? }`                 | Project metadata.                                                                                                                                           |
| `branch`  | `{ id, name, parent?, isDefault, protected, expiresAt? }` | Branch metadata.                                                                                                                                            |
| `config`  | `Config`                                                  | The branch's state, expressed as a `neon.ts`-shaped policy (static `auth`/`dataApi` toggles plus a `branch` closure carrying its lifecycle/compute tuning). |
| `preview` | `PulledPreview?`                                          | Buckets, functions, and issued credentials on the branch. Omitted entirely when the branch has none.                                                        |

A pulled function is reported as `{ slug, name }` only: the remote has no record of the local `source` file path, so a pulled config can't redeploy a function without you re-adding `source` by hand.

### `plan`

```ts
function plan(config: Config, options: ConfigOperationOptions): Promise<PushResult>;
```

Computes what `apply` would do, without mutating anything (the equivalent of `terraform plan`). Takes the same options as `inspect`.

### `apply`

```ts
function apply(config: Config, options: ApplyOptions): Promise<PushResult>;
```

Applies a `neon.ts` policy to an existing branch. Never creates a project or branch: both must already exist (use [`createBranch`](#createbranch) to provision one from a policy). `ApplyOptions` extends `ConfigOperationOptions` with:

| Field                  | Type               | Default | Description                                                                                                                                                          |
| ---------------------- | ------------------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `updateExisting`       | `boolean`          | `false` | Auto-confirm overriding existing remote settings (TTL, `protected`, compute settings). Without it, drift from the branch's current state throws `PushConflictError`. |
| `allowProtectedBranch` | `boolean`          | `false` | Auto-confirm applying to a branch marked protected on Neon (see the note below the table).                                                                           |
| `bundleFunction`       | `FunctionBundler?` | esbuild | Custom bundler for function source. See [Function bundling](#function-bundling).                                                                                     |

`apply` doesn't accept an interactive confirmation callback (that's only on the lower-level [`pushConfig`](#pushconfig)), so it's either non-interactive (pass `updateExisting`/`allowProtectedBranch` up front) or it fails closed: unresolved drift throws `PushConflictError` (see [Error handling](#error-handling)). Note that a protected branch with **no** other drift is not itself blocked by `allowProtectedBranch: false`; that flag only matters together with the interactive `confirm` callback on `pushConfig`.

### `createBranch`

```ts
function createBranch(config: Config, options: CreateBranchOptions): Promise<CreateBranchResult>;
```

Creates a branch **from** a `neon.ts` policy and brings it up with its declared settings in one step: it calls the Neon API directly to create the branch, then applies the rest of the policy to it with `pushConfig`. This is the flow `neon checkout <new-name>` needs when it creates a new branch, and the CLI calls this function to get it (not the other way around). Concretely, `createBranch` evaluates the policy with `branch.exists: false` (so creation-time tuning gated on `!branch.exists` actually resolves), creates the branch from the policy's `parent` (falling back to the project's default branch), then reconciles the rest of the policy onto it.

| `CreateBranchOptions` field | Type               | Description                                                  |
| --------------------------- | ------------------ | ------------------------------------------------------------ |
| `projectId`                 | `string`           | Required.                                                    |
| `branchName`                | `string`           | Required. Must not already exist on the project.             |
| `apiKey`                    | `string?`          | See [Authentication](#authentication).                       |
| `api`                       | `NeonApi?`         | Inject a custom adapter.                                     |
| `bundleFunction`            | `FunctionBundler?` | Custom bundler. See [Function bundling](#function-bundling). |

Returns `{ branchId, branchName, result: PushResult }`. Throws a `PlatformError` (`PLATFORM_CONFLICT`) if `branchName` already exists, or (`PLATFORM_BRANCH_NOT_FOUND`) if the policy's `parent` names a branch that doesn't exist on the project.

## Lower-level: `pullConfig` and `pushConfig`

`inspect`, `plan`, and `apply` are thin, intent-revealing wrappers over two lower-level primitives. Reach for these directly when you need control they don't expose: most commonly, an interactive confirmation prompt, or evaluating the `branch` closure as a creation (`branchExists: false`) so creation-time tuning resolves.

`pushConfig` always requires a `branchId` that already exists on the project; `branchExists: false` only changes how the policy is evaluated, not whether the branch has to exist. `pushConfig` never creates a branch, on `dryRun` or otherwise. If the branch doesn't exist yet, use [`createBranch`](#createbranch) instead.

### `pullConfig`

```ts
function pullConfig(options: PullConfigOptions): Promise<PulledBranchConfig>;
```

Functionally identical to [`inspect`](#inspect): `inspect` forwards its options (`projectId`, `branchId`, `api`, `apiKey`, `apiHost`) to `pullConfig` unchanged and returns its result directly, with no other logic in between. The two names exist so call sites can read naturally (`inspect` next to `plan`/`apply`) while the engine module stays named after what it does.

### `pushConfig`

```ts
function pushConfig(config: Config, options: PushConfigOptions): Promise<PushResult>;
```

The engine behind `plan` and `apply`. `PushConfigOptions` is `ApplyOptions` plus:

| Field          | Type                                                           | Default | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| -------------- | -------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `branchExists` | `boolean`                                                      | `true`  | Evaluate the policy's `branch` closure as if the target branch doesn't exist yet (`branch.exists: false`), without changing whether it physically exists on Neon. `createBranch` uses this internally so creation-time tuning (TTL, compute, `parent`) resolves right after provisioning.                                                                                                                                                                                                                                                                   |
| `confirm`      | `(context: PushConfirmContext) => boolean \| Promise<boolean>` | none    | Invoked once, before any mutation, when the push needs confirmation: either the branch is protected (and `allowProtectedBranch` isn't `true`) or applying would override existing settings (and `updateExisting` isn't `true`). Return `true` to proceed; a `false` return throws `PushAbortedError`. Not invoked, and no mutation runs, when the plan has unresolvable conflicts (immutable fields, such as region or Postgres version, that can never be reconciled): those throw `PushConflictError` regardless of `confirm`. Never invoked on `dryRun`. |
| `dryRun`       | `boolean`                                                      | `false` | Compute the full plan against live remote state without executing any mutations. `plan(config, target)` is exactly `pushConfig(config, { ...target, dryRun: true, updateExisting: true })`.                                                                                                                                                                                                                                                                                                                                                                 |

`PushConfirmContext` passed to `confirm`:

| Field             | Type      | Description                                                                                                                                                            |
| ----------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `branchName`      | `string`  | Target branch's name.                                                                                                                                                  |
| `protectedBranch` | `boolean` | `true` when the branch is protected on Neon and `allowProtectedBranch` wasn't set.                                                                                     |
| `overrideUpdates` | `boolean` | `true` when the plan would override existing remote settings and `updateExisting` wasn't set. Additive changes (enabling a service for the first time) never set this. |

Use `confirm` to render your own "are you sure?" prompt instead of failing closed with `PushConflictError`, for example in an interactive CLI built on top of this package.

## Function bundling

Deploying a Neon Function means bundling its source into a ZIP archive. By default, `apply`, `pushConfig`, and `createBranch` do this with esbuild:

```ts
type FunctionBundler = (fn: ResolvedFunctionConfig) => Promise<Uint8Array>;

function buildFunctionBundle(fn: ResolvedFunctionConfig): Promise<Uint8Array>;
```

`buildFunctionBundle` is loaded lazily and only when a deploy actually bundles a function, so a caller that never deploys functions, or that supplies its own `bundleFunction`, never pulls esbuild's native binary into their build. Inject a custom bundler via the `bundleFunction` option on `apply` / `pushConfig` / `createBranch` when your runtime can't ship that binary, for example a single-file packaged CLI, or a restricted CI sandbox.

`ResolvedFunctionConfig` (what your bundler receives) has all deploy defaults already applied: `slug`, `name`, `source` (path to the entry file), `env` (resolved key/value pairs), `runtime`, and an optional `dev` block used only by `neon dev`.

<Admonition type="note">
The `neon` CLI has its own separate `NEON_ESBUILD_PATH` escape hatch for "esbuild not found" errors (see [Preview access](/docs/compute/functions/preview-access#known-limitations)). That variable is read by the CLI's own bundler, not by `buildFunctionBundle` in this package, so it has no effect when you call `@neon/config-runtime` directly. Pass `bundleFunction` instead.
</Admonition>

## Load a `neon.ts` file

```ts
function loadConfigFromFile(options?: LoadConfigOptions): Promise<{ config: Config; resolvedPath: string }>;
```

Re-exported from `@neon/config` for convenience. Use it when your script doesn't already have a `Config` object in scope, for example a CI step that runs independently of a bundler that could `import` `neon.ts` directly.

| `LoadConfigOptions` field | Type      | Description                                                             |
| ------------------------- | --------- | ----------------------------------------------------------------------- |
| `path`                    | `string?` | Explicit path to a config file. Takes precedence over the search below. |
| `cwd`                     | `string?` | Starting directory for the upward search. Defaults to `process.cwd()`.  |
| `stopAt`                  | `string?` | Hard ceiling for the upward walk. Defaults to the OS home directory.    |

Without `path`, it walks up from `cwd` looking for `neon.ts` / `neon.mts` / `neon.js` / `neon.mjs`, stopping at the first directory containing `.git` (monorepo-friendly: an intermediate `package.json` doesn't stop the walk).

## A custom CI step

Putting the pieces together: a script that plans and applies a policy against a specific branch, suitable as its own CI job:

```ts filename="scripts/deploy-branch.ts"
import { loadConfigFromFile, apply } from "@neon/config-runtime/v1";

// Resolve these yourself: from CI variables you set, `neon branches list --output json`,
// or the Neon API. This package never reads `.neon` or `NEON_*` (besides NEON_API_KEY / NEON_API_HOST).
const projectId = process.env.NEON_PROJECT_ID!;
const branchId = process.env.NEON_BRANCH_ID!;

const { config } = await loadConfigFromFile();

// NEON_API_KEY in the environment is picked up automatically, so there's no need to pass apiKey.
const result = await apply(config, {
  projectId,
  branchId,
  updateExisting: true,
  allowProtectedBranch: true,
});

console.log(`Applied ${result.applied.length} change(s) to ${result.branchName}`);
```

Run it with `tsx` or after compiling with `tsc`, the same as any Node.js script:

```bash
npx tsx scripts/deploy-branch.ts
```

## Error handling

Every error this package throws extends `PlatformError` (also re-exported here from `@neon/config`), which carries a stable `code` string plus optional `details`. Prefer `isPlatformError(err)` over `err instanceof PlatformError`: a `neon.ts` loaded through the internal TypeScript loader ([jiti](https://github.com/unjs/jiti)) imports its own copy of this package, so an error it throws can fail `instanceof` across that boundary. `isPlatformError` checks the `code` string instead, which survives it.

The subclasses relevant to programmatic use:

| Class                                                 | `code`                        | Thrown by             | When                                                                                                                                                                           |
| ----------------------------------------------------- | ----------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `PushConflictError`                                   | `PLATFORM_PUSH_CONFLICT`      | `apply`, `pushConfig` | Local policy conflicts with remote state and you didn't pass `updateExisting`. Carries a `conflicts: ConflictReport[]` array.                                                  |
| `PushAbortedError`                                    | `PLATFORM_PUSH_ABORTED`       | `pushConfig`          | Your `confirm` callback returned `false`. Carries `branchName` and `reasons`.                                                                                                  |
| `ConfigLoadError`                                     | `PLATFORM_CONFIG_LOAD_FAILED` | `loadConfigFromFile`  | No config file found, or it failed to evaluate.                                                                                                                                |
| `PlatformError` with code `PLATFORM_MISSING_API_KEY`  | `PLATFORM_MISSING_API_KEY`    | any operation         | No `apiKey` could be resolved. See [Authentication](#authentication).                                                                                                          |
| `PlatformError` with code `PLATFORM_BRANCH_NOT_FOUND` | `PLATFORM_BRANCH_NOT_FOUND`   | any operation         | `branchId` doesn't exist on the project (see [Resolving project and branch ids](#resolving-project-and-branch-ids)), or a policy's `parent` names a branch that doesn't exist. |

A `ConflictReport` (on `PushConflictError.conflicts` and `PushResult.conflicts`) has `kind`, `identifier`, `field`, `current`, `desired`, and a human-readable `reason`.

## Related

- [`neon.ts` reference](/docs/reference/neon-ts): the policy this package operates on, and the `neon config` / `neon deploy` CLI commands that wrap it.
- [neon-pkgs source](https://github.com/neondatabase/neon-pkgs/tree/main/packages/config-runtime) on GitHub.

<NeedHelp/>
