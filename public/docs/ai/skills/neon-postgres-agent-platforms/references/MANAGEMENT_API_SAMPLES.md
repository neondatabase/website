# Management API samples (`scripts/`)

Small **Node.js + TypeScript** scripts that call Neon’s official **[Management API TypeScript SDK](https://neon.com/docs/reference/typescript-sdk.md)** ([`@neondatabase/api-client`](https://registry.npmjs.org/@neondatabase/api-client)) via **`createApiClient`**, **no other Neon npm packages**. Sources live in **[`scripts/`](../scripts/)**; **`npm run build`** runs **`tsc`** and emits **`dist/scripts/*.js`** per **[`tsconfig.json`](../scripts/tsconfig.json)**. **`npm run typecheck`** runs **`tsc --noEmit`** (no emit). Scripts **`import "dotenv/config"`** so variables from **`.env`** load automatically; run with **`node dist/scripts/<name>.js`** or **`npm run …`** (each npm script runs **`build`** then **`node dist/scripts/...`**).

**When we say “Neon TypeScript SDK” here, we mean [`@neondatabase/api-client`](https://registry.npmjs.org/@neondatabase/api-client) and nothing else**, not `@neondatabase/serverless`, `@neondatabase/neon-js`, `@neondatabase/toolkit`, or any other `@neondatabase/*` package.

Use these to prototype **per-tenant provisioning**, **fleet branching/snapshot orchestration**, **database versioning** (snapshots + restore), **org transfer** (free ↔ paid org), **consumption** polling, and **Neon Auth management** endpoints, not introductory app connectivity (that is **`neon-postgres`** + app docs).

### Fleet provisioning and org layout

Agent Program teams usually maintain **two Neon orgs** (sponsored free vs paid) and route **`NEON_ORG_ID`** per customer tier when calling **`create-project.ts`**. Upgrades use **`transfer-project.ts`** with a **personal** API key; fleet-wide usage uses **`consumption-query.ts`** with **`NEON_ORG_ID`**.

For the full mapping (keys, patterns, which script covers which fleet operation), see **[Fleet and org model (summary) in README](../../../README.md#fleet-and-org-model-summary)**.

### Application REST API vs Neon Management API

Scripts in **`scripts/`** call Neon’s **Management API** (`console.neon.tech`, `@neondatabase/api-client`), provisioning, branches, snapshots, org transfer, consumption, Neon Auth management endpoints.

For **`curl`** examples aimed at **your product’s own REST API** (checkpoints, versions, etc.), see **[application-rest-api/CURL_REFERENCE.md](application-rest-api/CURL_REFERENCE.md)**. Those routes are **not** Neon control-plane calls. **Compound checkpoints** are described in **[COMPOUND_CHECKPOINTS_FOR_AGENT_PLATFORMS.md](COMPOUND_CHECKPOINTS_FOR_AGENT_PLATFORMS.md)**.

---

## Prerequisites

| Requirement | Notes |
|-------------|--------|
| Node.js **20+** | Enables `node --env-file=.env` (or export vars manually). |
| `NEON_API_KEY` | [API key](https://neon.com/docs/manage/api-keys.md). **Organization** keys cover one org; **personal** keys can transfer projects across orgs. **Project-scoped** keys are limited to one project (good for per-tenant runtime automation; cannot create org-wide resources or new projects). |
| `NEON_ORG_ID` | Often required when creating projects with a personal key. |
| **`.env`** | Create a local **`.env`** file, **`NEON_API_KEY`** required; scripts load it via **`dotenv`**. You can still use **`node --env-file=.env …`** if you prefer explicit loading. |

Install dependencies:

```bash
cd neon-for-agent-platforms/skills/neon-postgres-agent-platforms/scripts
npm install
touch .env
# Set NEON_API_KEY=... and any IDs your scripts need (see tables below)
npm run build
```

Run a compiled script (**from `scripts/`**, same directory as **`package.json`**):

```bash
node dist/scripts/list-projects.js
# Or: npm run neon:list-projects
```

After editing **`scripts/**/*.ts`**, run **`npm run build`** again (or rely on npm scripts that invoke **`build`** first).

---

## Script catalog

| Script | npm shortcut | What it does |
|--------|----------------|----------------|
| [`scripts/list-projects.ts`](../scripts/list-projects.ts) | `npm run neon:list-projects` | Lists **project id** and **name** (Management API). |
| [`scripts/create-project.ts`](../scripts/create-project.ts) | `npm run create-project` | Creates a Neon **project**; prints `projectId` and `DATABASE_URL`. Waits for initial operations to finish. |
| [`scripts/create-project-with-auth.ts`](../scripts/create-project-with-auth.ts) | `npm run create-project-with-auth` | Same as **create-project**, then enables Neon Auth on the default branch (**Better Auth**). Saves Auth keys once, see stderr note. |
| [`scripts/delete-project.ts`](../scripts/delete-project.ts) | `npm run delete-project` | **Deletes** a project by id (destructive). |
| [`scripts/branch.ts`](../scripts/branch.ts) | `npm run branch` | **`list`**, JSON list of branches. **`create <name>`**, new branch from **main** / **production** (or `NEON_PARENT_BRANCH_ID`). |
| [`scripts/snapshot.ts`](../scripts/snapshot.ts) | `npm run snapshot` | Creates a **logical snapshot** on the default branch. Optional **`NEON_SNAPSHOT_EXPIRES_AT`** (RFC 3339) for auto-deletion per [cleanup strategy](https://neon.com/docs/ai/ai-database-versioning.md#cleanup-strategy). |
| [`scripts/list-snapshots.ts`](../scripts/list-snapshots.ts) | `npm run list-snapshots` | **Lists** all snapshots for **`NEON_PROJECT_ID`**. |
| [`scripts/delete-snapshot.ts`](../scripts/delete-snapshot.ts) | `npm run delete-snapshot` | **Deletes** one snapshot by **`NEON_SNAPSHOT_ID`** (polls operations). |
| [`scripts/rename-snapshot.ts`](../scripts/rename-snapshot.ts) | `npm run rename-snapshot` | **PATCH** rename, **`NEON_SNAPSHOT_NEW_NAME`**. |
| [`scripts/delete-branch.ts`](../scripts/delete-branch.ts) | `npm run delete-branch` | **Deletes** a branch by **`NEON_BRANCH_ID`** (e.g. orphaned **`main (old)`** after restore); destructive. |
| [`scripts/versioning-flow.ts`](../scripts/versioning-flow.ts) | `npm run versioning-flow` | **Versioning demo**: snapshot production → child branch → **restore** baseline onto child (Management API only; no bundled SQL driver). See [AI database versioning](https://neon.com/docs/ai/ai-database-versioning.md). |
| [`scripts/restore-snapshot.ts`](../scripts/restore-snapshot.ts) | `npm run restore-snapshot` | **One-shot restore**: applies an existing snapshot id to a target branch id. |
| [`scripts/promote-safe-production.ts`](../scripts/promote-safe-production.ts) | `npm run promote-safe -- <subcommand>` | **[Promoting Postgres safely](https://neon.com/blog/promoting-postgres-changes-safely-production)**, `bootstrap-dev`, `promote`, `refresh-dev`, `rollback-prod`. |
| [`scripts/transfer-project.ts`](../scripts/transfer-project.ts) | `npm run transfer` | Moves project(s) between orgs (e.g. sponsored → paid). Needs **personal** API key + permissions. **422** if any listed project has a **GitHub or Vercel** integration ([transfer limits](https://neon.com/docs/manage/orgs-project-transfer.md#via-api-for-automation-or-large-numbers-of-projects)). |
| [`scripts/consumption-query.ts`](../scripts/consumption-query.ts) | `npm run consumption` | **`GET /consumption_history/v2/projects`**, usage-based metrics aligned with billing. |
| [`scripts/auth-users.ts`](../scripts/auth-users.ts) | `npm run auth-users` | Neon **Auth** REST: **`meta`** (no API call, prints routing + SQL hint), **`create`**, **`delete`**. Requires Auth enabled on the branch first. |

**Restore / bootstrap:** If the API returns **`ROOT_BRANCHES_LIMIT_EXCEEDED`**, the project has hit Neon’s **root-branch** limit for your plan. Delete old branches (preview restores, `bootstrap-*`, `before_restore_*`, orphaned **`main (old)`**) using **`delete-branch.ts`** or the Console, or point **`NEON_PROJECT_ID`** at an emptier project.

### Compound checkpoints (agent platforms)

These scripts cover **Neon snapshot + restore + branch ops** only, the **database slice** of a version. For agent platforms, a checkpoint usually binds **source revision**, **Neon snapshot/branch ids**, **secrets/env**, **deployment or preview URL**, **agent run metadata**, and **rollback/promotion state**. See **[COMPOUND_CHECKPOINTS_FOR_AGENT_PLATFORMS.md](COMPOUND_CHECKPOINTS_FOR_AGENT_PLATFORMS.md)**. Generic Neon branching guidance stays in **`neon-postgres`**.

---

## Environment variables (by script)

Create a local **`.env`** file and set only what you need.

### Always

| Variable | Used by |
|----------|---------|
| `NEON_API_KEY` | All scripts |

### Projects

| Variable | Used by |
|----------|---------|
| `NEON_ORG_ID` | `create-project.ts` (often required with personal keys) |
| `NEON_PROJECT_NAME` | `create-project.ts` (optional; default `tenant-<timestamp>`) |
| `NEON_PROJECT_ID` | `delete-project`, `branch`, `snapshot`, `list-snapshots`, `delete-snapshot`, `rename-snapshot`, `delete-branch`, `promote-safe-production`, `versioning-flow`, `auth-users`, `restore-snapshot` (with snapshot vars). Not used by `consumption-query.ts` (see **`CONSUMPTION_PROJECT_IDS`** below). |

### Branches

| Variable | Used by |
|----------|---------|
| `NEON_PARENT_BRANCH_ID` | `branch.ts create`, optional; defaults to production branch id |
| `NEON_BRANCH_ID` | `auth-users.ts`, **`delete-branch.ts`** |
| `NEON_PROD_BRANCH_ID` | **`promote-safe-production.ts`**, optional; defaults to **main** / **production** branch |
| `NEON_DEV_BRANCH_ID` | **`promote-safe-production.ts`**, required for **`promote`** and **`refresh-dev`** |
| `NEON_BOOTSTRAP_DEV_BRANCH_NAME` | **`promote-safe-production.ts bootstrap-dev`**, default `dev` |
| `NEON_SNAPSHOT_BOOTSTRAP_NAME` | **`bootstrap-dev`**, optional snapshot label |
| `NEON_SNAPSHOT_PRE_PROMOTION_NAME`, `NEON_SNAPSHOT_DEV_CANDIDATE_NAME` | **`promote`**, optional snapshot labels |
| `NEON_SNAPSHOT_REFRESH_NAME` | **`refresh-dev`**, optional |
| `NEON_RESTORE_BACKUP_BRANCH_NAME` | **`promote-safe-production`** restore steps, optional backup branch name prefix |

### Snapshots & versioning

| Variable | Used by |
|----------|---------|
| `NEON_SNAPSHOT_NAME` | `snapshot.ts`, optional label |
| `NEON_SNAPSHOT_EXPIRES_AT` | `snapshot.ts`, optional RFC 3339 auto-deletion time |
| `NEON_SNAPSHOT_LSN` | `snapshot.ts`, optional; mutually exclusive with default timestamp (advanced) |
| `NEON_SNAPSHOT_ID` | `restore-snapshot.ts`, **`delete-snapshot.ts`**, **`rename-snapshot.ts`**, **`promote-safe-production.ts rollback-prod`** |
| `NEON_SNAPSHOT_NEW_NAME` | **`rename-snapshot.ts`** |
| `NEON_TARGET_BRANCH_ID` | `restore-snapshot.ts` |
| `VERSION_BASELINE_NAME`, `VERSION_DEMO_BRANCH_NAME` | `versioning-flow.ts`, optional branch/snapshot name overrides |

### Org transfer

| Variable | Used by |
|----------|---------|
| `NEON_SOURCE_ORG_ID`, `NEON_DESTINATION_ORG_ID` | `transfer-project.ts` |
| `NEON_PROJECT_IDS` or `NEON_PROJECT_ID` | Comma-separated or single project id |

Projects linked to **GitHub** or **Vercel** in Neon cannot be transferred; the transfer API responds with **422** for those project IDs. Remove or re-home the integration first, or provision a fresh project in the destination org. See [Transfer projects](https://neon.com/docs/manage/orgs-project-transfer.md).

### Consumption API (v2)

| Variable | Used by |
|----------|---------|
| `NEON_ORG_ID` | `consumption-query.ts` |
| `CONSUMPTION_FROM`, `CONSUMPTION_TO` | RFC 3339 range |
| `CONSUMPTION_GRANULARITY` | `hourly` \| `daily` \| `monthly` |
| `CONSUMPTION_METRICS` | Optional comma list (defaults include compute + storage + transfer) |
| `CONSUMPTION_PROJECT_IDS` | Optional comma-separated Neon project ids to include (this script does **not** read `NEON_PROJECT_ID`) |
| `CONSUMPTION_LIMIT`, `CONSUMPTION_CURSOR` | Pagination |

**Legacy account endpoint:** `GET /api/v2/consumption_history/account` is **deprecated** with a planned sunset of **2026-06-01**. Prefer this repo’s **`consumption-query.ts`** (`GET /consumption_history/v2/projects`) for invoice-aligned, per-project metrics. If you still need legacy metric shapes, see [Query consumption metrics (legacy)](https://neon.com/docs/guides/consumption-metrics-legacy.md).

**`metrics` values (v2):** pass a subset or all of: `compute_unit_seconds`, `root_branch_bytes_month`, `child_branch_bytes_month`, `instant_restore_bytes_month`, `snapshot_storage_bytes_month`, `public_network_transfer_bytes`, `private_network_transfer_bytes`, `extra_branches_month`. These are the strings accepted in `CONSUMPTION_METRICS` and by the API `metrics` parameter ([consumption metrics guide](https://neon.com/docs/guides/consumption-metrics.md#required-parameters)).

### Neon Auth users

| Variable | Used by |
|----------|---------|
| `USER_EMAIL`, `USER_NAME` | `auth-users.ts create` |
| `AUTH_USER_ID` | `auth-users.ts delete` |

Enable Auth on the branch once: `POST .../projects/{id}/branches/{id}/auth` with `better_auth`, see [Manage Neon Auth via the API](https://neon.com/docs/auth/guides/manage-auth-api.md).

---

## Typical flows

Commands below assume **current working directory** is **`scripts/`** (where **`dist/scripts/`** is written after **`npm run build`**).

### Provision fleet tenants (free vs paid org)

1. Store **`NEON_ORG_ID`** for each Neon org (free pool vs paid pool) and choose an **API key** that can create projects there ([details](../../../README.md#fleet-and-org-model-summary)).
2. For each new customer, set **`NEON_ORG_ID`** (and optionally **`NEON_PROJECT_NAME`**) and run:

```bash
node --env-file=.env dist/scripts/create-project.js
```

3. Persist **`projectId`** and **`DATABASE_URL`** from the JSON output in your control-plane database.

### Spin up a single tenant project

```bash
node --env-file=.env dist/scripts/create-project.js
```

### List branches, then create a branch (tenant sandbox / preview)

```bash
node --env-file=.env dist/scripts/branch.js list
node --env-file=.env dist/scripts/branch.js create my-feature
```

Use this pattern to script **per-tenant** sandboxes from your control plane. Tutorials on branching concepts for a single app belong in **`neon-postgres`** and Neon’s branching guides, not duplicated here.

### Database versioning (snapshots + restore)

End-to-end demo (creates a **child branch** named `versioning-demo-<timestamp>`):

```bash
node --env-file=.env dist/scripts/versioning-flow.js
```

Restore an arbitrary snapshot onto a branch:

```bash
node --env-file=.env dist/scripts/restore-snapshot.js
# Needs NEON_SNAPSHOT_ID and NEON_TARGET_BRANCH_ID in .env
```

### Move a customer from free org to paid org

```bash
node --env-file=.env dist/scripts/transfer-project.js
```

### Poll usage (invoice-aligned metrics)

```bash
node --env-file=.env dist/scripts/consumption-query.js
```

### Neon Auth app users (REST)

```bash
node --env-file=.env dist/scripts/auth-users.js meta
```

---

## Shared helpers

[`scripts/utils.ts`](../scripts/utils.ts) holds **shared helpers** on top of the same **`@neondatabase/api-client`** surface: **operation polling** (`waitForOperationsToSettle`), **error formatting**, and small **compose** helpers around **`createApiClient`** calls so scripts stay readable. There is no second Neon client package.

---

## Related docs

- [README — fleet and org model](../../../README.md#fleet-and-org-model-summary) · [Neon Auth API](https://neon.com/docs/auth/guides/manage-auth-api.md) · [Postgres roles](https://neon.com/docs/manage/roles.md) · [Consumption metrics](https://neon.com/docs/guides/consumption-metrics.md).
- [README](../../../README.md), Agent Program model (two orgs, keys, skills).
