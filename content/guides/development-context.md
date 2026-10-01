---
title: 'Setting up a robust development environment with Neon'
subtitle: 'A comprehensive guide to Neon APIs, SDKs, the Neon CLI, config-as-code with neon.ts, branching, snapshots, and platform integrations for developers and AI agents.'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-07-31T00:00:00.000Z'
updatedOn: '2026-08-03T07:35:40.609Z'
---

When building enterprise integrations, platform backends, or AI agents, you need infrastructure that is both flexible and resilient. Early prototypes often emphasize rapid iteration to validate an MVP quickly, favoring speed over robustness. At this stage, teams focus on shipping features rather than carefully designing which microservices, schemas, or workflows to adopt. But as systems scale, growth demands stronger foundations. Shared databases, schema migrations, and automated workflows introduce risks that require isolation, programmability, and reliability at every layer.

A productive development workflow requires database environments that are isolated, easy to provision, and simple to keep in sync. Setting up a local or team development context with traditional databases often introduces friction, such as sharing a single database, schema drift, or time wasted provisioning test environments.

Neon provides an API-first platform designed for these exact needs. With [branching](/docs/introduction/branching), [snapshots](/blog/checkpoints-for-agents-with-neon-snapshots), [SDKs](/docs/reference/sdk), a [CLI](/docs/cli), and [config-as-code](/docs/reference/neon-ts), you can create ephemeral environments, enforce isolation, declare backend services as code, and integrate seamlessly in your systems or AI-driven workflows. This guide covers the core concepts, best practices, and integration patterns for building a robust development environment with Neon.

## Key concepts

The core principles for building a development environment with Neon are:

1. **Branch-per-task isolation:** Each developer, feature branch, or CI run operates in its own isolated Postgres environment via a [copy-on-write](/docs/reference/glossary#copy-on-write) branch. This ensures safe experimentation without impacting shared resources.
2. **Replayable state with snapshots:** Revert databases to a specific point-in-time to test migrations, debug issues, or reset agent environments.
3. **Resilient orchestration:** Programmatically provision databases with automatic retry and backoff mechanisms to handle concurrent CI jobs or scripts.

<Admonition type="important" title="Neon is API-first">
Every action available in the [Neon Console](https://console.neon.tech) is also exposed through the [public REST API](https://api-docs.neon.tech/reference/getting-started-with-neon-api). Developers can build custom CLI scripts, automation pipelines, or provisioning tools for their teams, while enterprises can design tailored orchestration layers, embed lightweight dashboards into their own UIs, or fully white‑label the database provisioning experience for their users.
</Admonition>

## Prerequisites

Before diving into the integration patterns, ensure you have the following in place:

**A Neon account and an Organization**

Sign up for free at [console.neon.tech/signup](https://console.neon.tech/signup) and create an Organization. You can have multiple projects within an Organization, and you can also create multiple Organizations if needed for different teams.

<Admonition type="note" title="Organization roles">
Neon Organizations support three roles: **Admin** (full access to billing, members, and all projects), **Member** (access to all organizational projects), and **Collaborator** (limited access to specific shared projects). For details, see [Organizations](/docs/manage/organizations).
</Admonition>

<Steps>

## Install the SDK

Neon's Management SDKs are built for infrastructure automation: creating projects, branching databases, and configuring computes. Use the [Neon Management SDK](/docs/reference/typescript-sdk) (`@neon/sdk`) for TypeScript or the [Python SDK](/docs/reference/python-sdk) for Python.

To install the SDK for your language, run the appropriate command:

<CodeTabs labels={["npm", "yarn", "pnpm", "python"]}>

```bash
npm install @neon/sdk
```

```bash
yarn add @neon/sdk
```

```bash
pnpm add @neon/sdk
```

```bash
pip install neon-api
```

</CodeTabs>

## Install the Neon CLI

The [Neon CLI](/docs/cli) (`neon`) is the terminal interface to every Neon surface: Postgres, branching, and the backend features like [Managed Better Auth](/docs/auth/overview), the [Data API](/docs/data-api/get-started), [Functions](/docs/compute/functions/overview), and [Object Storage](/docs/storage/overview). The CLI is invoked via `neon <command>`, and it supports both interactive and non-interactive workflows. It is the recommended way to manage Neon projects, especially for local development, CI/CD pipelines, and AI agent orchestration.

Install it globally via `npm` or run it directly with `npx`:

<CodeTabs labels={["npm", "npx"]}>

```bash
npm i -g neon
```

```bash
npx neon <command>
```

</CodeTabs>

Then authenticate. For interactive use, `neon auth` opens your browser for OAuth. For CI/CD and scripts, set `NEON_API_KEY` or pass `--api-key` to any command:

```bash
neon auth   # or: export NEON_API_KEY="your_api_key_here"
```

**Set up and link a project.** Run [`neon link`](/docs/cli/link) from your project root to bind the directory to a Neon project. It writes a `.neon` context file (automatically git-ignored), and pulls the branch's connection strings into your `.env` / `.env.local` file. You can also create and link a new project in one step, non-interactively:

```bash
neon link --project-name my-app --region-id aws-us-east-2
```

**Work branch-first.** Use [`neon checkout`](/docs/cli/checkout) to switch branches like you switch git branches. It creates the branch if it doesn't exist, pins it in your context, and re-syncs your `.env` with that branch's `DATABASE_URL` and Auth/Data API URLs, so your app always talks to the isolated branch:

```bash
neon checkout dev-feature   # creates + switches, then updates .env.local
```

For a complete task-to-merge walkthrough of this loop, see [Sync Neon branches with Git branches](#sync-neon-branches-with-git-branches-using-neon-checkout) below.

**Equip your AI assistant.** A single [`neon init`](/docs/cli/init) command configures the Neon MCP server for your editor, installs Neon's agent skills, and adds the Neon Local Connect extension for Cursor and VS Code:

<CodeTabs labels={["neon CLI", "npx"]}>

```bash
neon init
```

```bash
npx neon@latest init
```

</CodeTabs>

Run it from your project root; see [Connect to AI assistants](#connect-to-ai-assistants) below for details on what this gives your assistant.

**Built for automation.** Every command supports `--output json` for machine-readable results, `NEON_API_KEY` authenticates non-interactively, and [`neon link --agent`](/docs/cli/link) returns a JSON state machine instead of prompting, so AI agents and CI pipelines can drive the CLI end to end. Backend features are equally scriptable: [`neon neon-auth`](/docs/cli/neon-auth), [`neon data-api`](/docs/cli/data-api), [`neon functions`](/docs/cli/functions), and [`neon buckets`](/docs/cli/buckets) manage Auth, the Data API, Functions, and Object Storage directly from the terminal.

For a deep dive into the CLI and its commands, see the [CLI install guide](/docs/cli/install), the [CLI quickstart](/docs/cli/quickstart), and [Branching with the Neon CLI](/docs/guides/branching-neon-cli).

## Authenticate with API Keys

To programmatically manage your Neon resources (like creating branches or database projects), you need an API key.

1. Go to the **Settings** page in the [Neon Console](https://console.neon.tech).
2. Create a new API Key and copy it.
   ![Create API Key](/docs/manage/org_api_keys.png)
   <Admonition type="tip" title="Choose the right scope">
   Use an [**Organization-level API key**](/docs/manage/api-keys#create-an-organization-api-key) for platform applications that need to manage multiple projects. For scripts or applications limited to a single project, create a [**project-level API key**](/docs/manage/api-keys#create-project-scoped-organization-api-keys) instead.  
    </Admonition>
   <br/>
3. Export it as an environment variable in your development environment or project configuration:

   ```bash
   export NEON_API_KEY="your_api_key_here"
   ```

   In your application code, initialize the client using this key:

   ```typescript
   import { createNeonClient } from '@neon/sdk';

   const neon = createNeonClient({ apiKey: process.env.NEON_API_KEY! });
   ```

With your key in place, browse the [Neon API reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api) and the [Neon SDK reference](/docs/reference/typescript-sdk) to see everything you can automate: creating projects, provisioning branches and computes, managing roles and databases, scheduling snapshots, and more.

## Handle asynchronous operations and retries

In Neon, infrastructure operations are asynchronous. Most changes such as creating a branch return an `operations` array. To track progress, poll the `/operations/{operation_id}` endpoint until the operation reaches a **terminal status** (`finished`, `skipped`, or `cancelled`).

When orchestrating these operations, you’ll also need to account for Control Plane safeguards:

- **Rate limits (`429 Too Many Requests`):** 700 requests per minute, with a burst limit of 40 requests per second per route. See [Rate limiting](/docs/reference/api/key-concepts#rate-limiting) for details.
- **Concurrency locks (`423 Locked`):** Neon prevents conflicting operations from running simultaneously. For example, if you attempt to create a branch while the system’s [Availability Checker](/docs/reference/glossary#availability-checker) is active, the API will reject the request. See [Handle concurrent operation errors](/docs/manage/operations#handle-concurrent-operation-errors) for guidance.

The [`@neon/sdk`](/docs/reference/typescript-sdk) client handles both safeguards automatically. It retries requests that fail with safe statuses (`423`, `429`, `503`), and workflow methods poll provisioning operations to a terminal state for you. The following example creates a branch with its own read-write compute, waiting for all operations to finish before it resolves:

```typescript
import { createNeonClient } from '@neon/sdk';

const neon = createNeonClient({
  apiKey: process.env.NEON_API_KEY!,
  retries: 5, // automatic retries on 423/429/503; defaults to 2
});

// Creates a branch from the specified parent branch with its own read-write
// compute, polling provisioning operations to a terminal state before resolving.
export async function safelyCreateBranch(projectId: string, parentBranchId: string) {
  const { data, error } = await neon.branches.createWithCompute(projectId, {
    parentId: parentBranchId,
  });
  if (error) throw error;
  return data.branch;
}
```

For [raw layer](/docs/reference/typescript-sdk#raw-layer) calls that return an `operations` array, you can poll them to completion with `neon.operations.waitFor()`:

```typescript
import { createNeonClient, raw } from '@neon/sdk';

const neon = createNeonClient({
  apiKey: process.env.NEON_API_KEY!,
  retries: 5
});

const { data } = await raw.createProjectBranch({
  client: neon.client,
  path: { project_id: "my-project-id" },
  body: { branch: { name: "feature_x" } },
});

const operations = data?.operations;
const { error: waitError } = await neon.operations.waitFor(operations, { timeoutMs: 120_000 });
```

## Manage API drift

Neon’s APIs are stable and backwards compatible, so drift is exceptionally rare. In practice, your automation and environments remain synchronized without issue. The only exceptions occur when new capabilities are introduced in beta where occasional adjustments may be needed. Managing API drift ensures your systems stay aligned even as experimental features evolve into fully supported platform capabilities.

### Stay updated on API and SDK changes

Subscribe to the [Neon Changelog](/docs/changelog) RSS feed to stay informed about new features, API changes, and SDK updates. This is the primary way to learn about changes that might affect your integration.

```bash
https://neon.com/docs/changelog/rss.xml
```

You can also follow the changelog via [Slack](/docs/reference/feeds#subscribe-to-feeds-in-slack) or your preferred RSS reader. For details on all available feeds, see [Neon RSS feeds](/docs/reference/feeds).

### Automating API drift detection

For teams that want automated detection of API changes, set up a CI pipeline that tracks the Neon OpenAPI spec (`https://neon.com/api_spec/release/v2.json`):

1. **Use openapi-typescript:** Run a weekly GitHub Action that fetches the `v2.json` file and generates TypeScript interfaces using [openapi-typescript](https://openapi-ts.dev/).
2. **Compile and compare:** If the freshly generated types cause a TypeScript compilation error (`tsc`) against your existing codebase, the pipeline fails safely. This alerts your team that Neon has introduced a breaking or changed API surface.

## Connect to AI assistants

If you are developing alongside an LLM or building an autonomous agent, equip your environment with Neon's capabilities so the agent understands your infrastructure natively.

### The Neon MCP Server (for IDEs and assistants)

Equip IDEs like [Cursor](/docs/ai/ai-cursor-plugin), [Claude Code](/docs/ai/ai-claude-code-plugin), or [Codex](/docs/ai/ai-codex-plugin) with the ability to safely query schemas and branch databases using the [Model Context Protocol (MCP)](/docs/ai/connect-mcp-clients-to-neon). Initialize it in your workspace with the CLI (introduced in [Install the Neon CLI](#install-the-neon-cli)):

<CodeTabs labels={["neon CLI", "npx"]}>

```bash
neon init
```

```bash
npx neon@latest init
```

</CodeTabs>

Beyond the MCP server config, `init` also authenticates you over OAuth, installs Neon's agent skills, and adds the Neon Local Connect extension for Cursor and VS Code. Once configured, you can say "Create a branch for this feature and test it end to end" and your assistant will provision a branch, run migrations, and test your code against it.

### Agent Skills (for coding assistants)

[Agent Skills](/docs/ai/agent-skills) give AI assistants the _knowledge_ to write correct code. Skills are structured context files (`SKILL.md`) that teach your assistant Neon's APIs, SDKs, and best practices so generated code works on the first attempt, avoiding common mistakes like wrong imports, missing connection pooling, or incorrect serverless driver usage. When you ask about a specific topic, the skill fetches the relevant documentation on demand, so your assistant works from current docs rather than stale training data.

This matters more as the platform grows. Neon is no longer just serverless Postgres: it's a full backend platform with [Managed Better Auth](/docs/auth/overview), the [Data API](/docs/data-api/get-started), [Functions](/docs/compute/functions/overview), [Object Storage](/docs/storage/overview), and an [AI Gateway](/docs/ai-gateway/overview). Many models still treat Neon as "a place to get a `DATABASE_URL`", so ask an unassisted model to add authentication, file uploads, or LLM access to your app and it may scaffold third-party tooling even though Neon has those services built in. Skills close that gap by injecting up-to-date, curated context at prompt time: the assistant proposes the Neon-native solution with the correct imports, configuration, and constraints, instead of an approximation based on an older version of the platform.

The `neon init` step above already installed the core skill for you: under the hood it runs `npx skills add neondatabase/agent-skills` for each selected editor, writing to `.agents/skills/` in your project. Commit those files so teammates share the same context. To install the skill without the rest of the init flow, run:

```bash
npx skills add neondatabase/agent-skills
```

Choose which skills to install from the catalog:

- `neon`: platform overview that routes questions across Postgres, Auth, Data API, Functions, Storage, and the AI Gateway
- `neon-postgres-branches`: branch management patterns for migrations, schema-only branches, and reset-from-parent workflows
- `neon-postgres-egress-optimizer`: diagnosing and fixing excessive Postgres egress and query overfetching
- `claimable-postgres`: instant, temporary databases via [Claimable Postgres](/docs/reference/claimable-postgres), useful for agents and tests
- `neon-functions`, `neon-object-storage`, `neon-ai-gateway` (beta): serverless functions on your branch, S3-compatible storage that branches with your data, and unified access to frontier and open-source LLMs through one credential

Check out the [Neon Agent Skills repository](https://github.com/neondatabase/agent-skills) for full details and the complete skill catalog.

### LLMs.txt (for autonomous agents)

To ensure your custom AI tools understand Neon's platform architecture and API surface without hallucinating, provide them with the `llms.txt` context files:

- **Platform documentation:** [`https://neon.com/llms.txt`](https://neon.com/llms.txt)
- **API documentation:** [`https://api-docs.neon.tech/llms.txt`](https://api-docs.neon.tech/llms.txt)

</Steps>

## Define your backend as code with neon.ts

Imperative CLI commands like `neon neon-auth enable` and `neon data-api create` are great for one-off changes, but a development environment that stays reproducible across branches and teammates needs those services declared as code. [`neon.ts`](/docs/reference/neon-ts) is Neon's infrastructure-as-code file: a TypeScript config you commit to your repository that declares which Neon services exist on your project and how each branch is configured. It's stateless: the CLI reconciles the file against your live Neon project, so there are no state files like Terraform.

Scaffold it with [`neon config init`](/docs/cli/config) (also offered automatically after an interactive `neon link`), which creates `neon.ts` and installs the `@neon/config` and `@neon/env` packages:

```bash
neon link           # required first: binds the directory to a project
neon config init    # scaffolds neon.ts
```

The full-stack example below declares [Managed Better Auth](/docs/auth/overview), the [Data API](/docs/data-api/get-started), and the beta services (AI Gateway, Object Storage, Functions), alongside a per-branch policy that protects production and caps ephemeral branches:

```ts filename="neon.ts"
import { defineConfig } from '@neon/config/v1';

export default defineConfig({
  // Services available on every branch (Postgres is on by default)
  auth: true,
  dataApi: true,

  // Beta services
  preview: {
    aiGateway: true,
    buckets: {
      uploads: {},
    },
    functions: {
      api: {
        name: 'API',
        source: './functions/api.ts',
      },
    },
  },

  // Branch policy: per-branch tuning
  branch: (branch) => {
    if (branch.isDefault) {
      // Production: protected against deletion, sized for real load
      return {
        protected: true,
        postgres: {
          computeSettings: {
            autoscalingLimitMinCu: 0.5,
            autoscalingLimitMaxCu: 4,
          },
        },
      };
    }
    if (!branch.exists) {
      // New branches (CI, agents, teammates): minimal compute, auto-expire
      return {
        ttl: '7d',
        postgres: {
          computeSettings: {
            autoscalingLimitMinCu: 0.25,
            autoscalingLimitMaxCu: 0.25,
            suspendTimeout: '5m',
          },
        },
      };
    }
    // Existing branches: leave current settings untouched
    return {};
  },
});
```

Apply the config with the CLI. [`neon config plan`](/docs/cli/config) previews pending changes as a git-style diff without touching your project, and [`neon deploy`](/docs/cli/deploy) reconciles the file against the branch, provisions each service, and writes its credentials into your local env file:

```bash
neon config plan    # dry-run preview
neon deploy         # apply + pull env vars
```

Each declared service injects standard environment variables, so `neon env pull` (run automatically by `deploy` and `checkout`) keeps your `.env` in sync with whatever the branch has provisioned:

| Service             | Declared in `neon.ts` | Injected environment variables                                                    |
| ------------------- | --------------------- | --------------------------------------------------------------------------------- |
| Postgres            | on by default         | `DATABASE_URL`, `DATABASE_URL_UNPOOLED`                                           |
| Managed Better Auth | `auth: true`          | `NEON_AUTH_BASE_URL`, `NEON_AUTH_JWKS_URL`                                        |
| Data API            | `dataApi: true`       | `NEON_DATA_API_URL`                                                               |
| AI Gateway          | `preview.aiGateway`   | `NEON_AI_GATEWAY_BASE_URL`, `NEON_AI_GATEWAY_TOKEN`                               |
| Object Storage      | `preview.buckets`     | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_ENDPOINT_URL_S3`, `AWS_REGION` |

Inside your application, the companion [`@neon/env`](/docs/reference/neon-ts#type-safe-environment-variables) package validates these variables against your config with strict typing. Namespaces only exist for services you actually declared, so refactoring `neon.ts` surfaces mismatches at compile time instead of at runtime:

```ts
import { parseEnv } from '@neon/env';
import config from './neon';

const env = parseEnv(config);

env.postgres.databaseUrl; // DATABASE_URL
env.auth.baseUrl; // NEON_AUTH_BASE_URL (only present when auth: true)
env.dataApi.url; // NEON_DATA_API_URL (only present when dataApi is enabled)
```

The `branch` key in `neon.ts` lets you define per-branch policies for new and existing branches. When [`neon checkout`](/docs/cli/checkout) creates a new branch, the `branch` closure runs with `branch.exists === false`, so ephemeral CI and agent branches automatically get their TTL, capped compute, and suspend timeouts, and the whole declared backend (database, buckets, functions) forks copy-on-write together. Checking out an existing branch never reconciles policy, so long-lived branches are never clobbered. For local work, [`neon dev`](/docs/cli/dev) runs declared functions with hot reload against your linked branch, with the same injected variables they get in production.

<Admonition type="info" title="Beta services and regions">
Functions, Object Storage, and the AI Gateway are in beta and available only in AWS US East (Ohio) (`aws-us-east-2`), so create or link your project there to use them. Declare them under the `preview` key; they graduate to top-level fields at GA. Postgres, Managed Better Auth, and the Data API work in any region.
</Admonition>

For CI pipelines and custom provisioning scripts that can't shell out to the CLI, [`@neon/config-runtime`](/docs/reference/config-runtime) exposes the same `inspect`, `plan`, and `apply` logic as a programmatic API.

## Branching workflows and lifecycle

Just like your codebase, database changes should follow a strict promotion lifecycle. You should build your development or team workflows around this pattern:

1. **Clone from production:** Create a copy-on-write branch from your default branch.
2. **Make schema and data changes:** Develop, migrate, and test on the isolated branch.
3. **Run tests:** Execute your CI/CD test suite against the branch.
4. **Promote to production:** Promote the schema changes to the parent branch (e.g., production).

<Admonition type="warning" title="Protect sensitive data in branches">
When creating ephemeral branches for AI agents or external users, use [data anonymization](/docs/workflows/data-anonymization) or [schema-only branching](/docs/guides/branching-schema-only) to ensure PII is not exposed to third-party LLMs or untrusted sandbox environments. The [Data Anonymization API](/docs/workflows/data-anonymization-api) lets you programmatically create branches with masked data.
</Admonition>

### Sync Neon branches with Git branches using `neon checkout`

This lifecycle maps directly onto your daily Git workflow because [`neon checkout`](/docs/cli/checkout) treats Neon branches like Git treats code branches. It pins a branch in your local `.neon` context file, and automatically updates your `.env` / `.env.local` with the branch's connection strings. Subsequent commands like [`neon psql`](/docs/cli/psql), [`neon diff`](/docs/cli/diff), or [`neon branches`](/docs/cli/branches) automatically target the pinned branch, so you never juggle connection strings or repeat `--branch` flags.

Say you're assigned a new task. The workflow is a one-line pairing with the Git command you already run:

```bash filename="Terminal"
# Start a new task: create matching Git and Neon branches
git checkout -b feature_x
neon checkout feature_x
```

If `feature_x` doesn't exist yet, `checkout` offers to create it from your default branch (equivalent to `neon branches create --name feature_x`), then pins it. Because branches are [copy-on-write](/docs/reference/glossary#copy-on-write), creation is instant and duplicates no data; storage is only consumed as your changes diverge. The CLI then pulls the branch's `DATABASE_URL`, plus Auth and Data API URLs for any services declared in [`neon.ts`](#define-your-backend-as-code-with-neonts), into your `.env` file. From that point on, your app talks to a fully isolated copy of the database: run migrations, seed test data, or drop tables, all without touching production or a teammate's environment.

When the work is done, switch back and clean up:

```bash filename="Terminal"
# Merge the PR, then return to your default branch and clean up
git checkout main && git pull
neon checkout production
neon branches delete feature_x
```

Run `neon checkout` with no argument to pick a branch from an interactive list. If you'd rather not write env files to disk, pass `--no-env-pull` and inject the branch's variables at runtime instead. Checkout [A branch-first dev loop for Neon](/blog/branch-first-dev-loop) for a full example of this workflow in action.

Pairing Git and Neon branches this way reinforces several practices that are otherwise hard to enforce on a team:

- **One isolated environment per task:** every feature branch gets its own database branch, so schema experiments never leak into shared development or staging data. This is the branch-per-task isolation pattern from [Key concepts](#key-concepts) made automatic.
- **No connection string drift:** `.env` / `.env.local` is rewritten on every checkout, so your app, tests, and CLI commands always point at the branch you've checked out. There's no stale `DATABASE_URL` left over from yesterday's task.
- **Automatic guardrails:** with a [`neon.ts` branch policy](#define-your-backend-as-code-with-neonts), branches created during `checkout` inherit TTL-based expiry and capped compute, so forgotten feature branches clean themselves up instead of accumulating spend.
- **A convention machines can follow:** naming Neon branches after Git branches is predictable enough to automate. Add a Git hook to check out a matching Neon branch whenever you create a Git branch, or reuse the same naming in the [CI/CD integrations](#automate-branching-with-cicd-integrations) so each pull request gets its corresponding database branch.

### Branch lifecycle management

Ephemeral branches can accumulate if not managed. Use these features to keep your project organized:

- **Branch expiration:** Set an expiration timestamp when creating a branch. Neon automatically deletes the branch after the specified time. Ideal for CI/CD preview branches or agent sandboxes. See [Branch expiration](/docs/guides/branch-expiration).
- **Reset from parent:** Reset a development branch to match its parent's current state, pulling in the latest production data without creating a new branch. See [Reset from parent](/docs/guides/reset-from-parent).
- **Protected branches:** Mark critical branches (like production) as protected to prevent accidental deletion, resets, or archiving. Computes attached to protected branches also cannot be deleted. See [Protected branches](/docs/guides/protected-branches).
- **Automated snapshot schedules:** Configure daily, weekly, or monthly automated snapshots for backup and compliance. See [Backup and restore](/docs/guides/backup-restore).

All of these lifecycle operations have CLI equivalents (`neon branches create --expires-at`, `neon branches reset`, `neon branches delete`, and `neon checkout`), which are often the simplest way to script them. See [Branching with the Neon CLI](/docs/guides/branching-neon-cli).

## Automate branching with CI/CD integrations

The branching lifecycle described above becomes most powerful when it is automated directly in your CI/CD pipeline. Instead of manually creating branches via the SDK, Console, or CLI, let your pull requests and preview deployments handle provisioning and cleanup automatically.

### GitHub Actions

Neon provides a set of [GitHub Actions](/docs/guides/branching-github-actions) that wire database branching into your Git workflow. The typical pattern is:

1. **Pull request opens** → a [Create branch action](https://github.com/neondatabase/create-branch-action) provisions an isolated copy-on-write branch named after the PR. Run your tests against this branch to ensure schema changes are validated in an environment identical to production.
2. **Schema changes** → run migrations against the branch, then use the [Schema diff action](https://github.com/neondatabase/schema-diff-action) to post a diff comment directly on the pull request for review.
3. **Pull request closes** → a [Delete branch action](https://github.com/neondatabase/delete-branch-action) tears down the ephemeral branch, so no resources are wasted.

A [Reset branch action](https://github.com/neondatabase/reset-branch-action) is also available for refreshing a long-lived development branch to match its parent before starting new work.

The [Neon GitHub integration](/docs/guides/neon-github-integration) handles authentication automatically: it installs a GitHub App that injects a `NEON_API_KEY` secret and `NEON_PROJECT_ID` variable into your repository, so your workflows are ready to run with zero manual secret configuration.

The following is a simplified psuedo-example of how your GitHub Actions workflow might look. Check the [integration docs](/docs/guides/neon-github-integration) for full example workflows and best practices.

```yaml
on:
  pull_request:
    types: [opened, synchronize, closed]

jobs:
  create_branch:
    if: github.event.action != 'closed'
    steps:
      - uses: neondatabase/create-branch-action@v5
        with:
          project_id: ${{ vars.NEON_PROJECT_ID }}
          api_key: ${{ secrets.NEON_API_KEY }}

  delete_branch:
    if: github.event.action == 'closed'
    steps:
      - uses: neondatabase/delete-branch-action@v3
        with:
          project_id: ${{ vars.NEON_PROJECT_ID }}
          api_key: ${{ secrets.NEON_API_KEY }}
          branch: ${{ branch-name-or-id-from-create-action }}
```

<Admonition type="tip" title="Combine with preview deployments">
Pair Neon's GitHub Actions with hosting platforms like Vercel, Cloudflare Pages, or Fly.io to get a fully isolated preview environment (application and database) for every pull request. See the [example applications](/docs/guides/neon-github-integration#example-applications-with-github-actions-workflows) for deployable starters.
</Admonition>

### Vercel integration

If your application is deployed on Vercel, Neon offers first-class integrations that automatically provision a database branch for every Vercel preview deployment. Three paths are available:

- **Vercel-Managed**: Neon is provisioned and billed entirely through the Vercel Marketplace. Ideal for new users who want a single bill.
- **Neon-Managed**: Link an existing Neon project to Vercel while keeping billing with Neon. Best if you already have a Neon account.
- **Manual**: Connect via environment variables for full CI/CD control with no automatic branching.

Both managed integrations auto-provision isolated branches for preview deployments. They differ in branch cleanup timing: Vercel-Managed follows Vercel's deployment retention policy, while Neon-Managed cleans up branches when the corresponding Git branch is deleted.

For a full comparison and setup instructions, see [Integrating Neon with Vercel](/docs/guides/vercel-overview).

## Configure compute, scaling, and connection pooling

Your integration must account for Neon's autoscaling and lifecycle features to prevent unexpected runtime errors and optimize costs.

### Region selection

When programmatically creating projects for your users or teams, select a `region_id` closest to your application's compute (e.g., Vercel or Cloudflare Workers) to minimize latency. Retrieve available regions using the `GET /api/v2/regions` endpoint.

### Autoscaling

Neon dynamically adjusts [Compute Units (CU)](/docs/reference/glossary#compute-unit-cu) based on load. Each CU allocates approximately 4 GB of RAM. Autoscaling adjusts resources instantly with no restarts required.

- **Maximum autoscaling range:** The difference between your minimum and maximum compute size cannot exceed 8 CU. For example, if you set the minimum to 1 CU, the maximum can be at most 9 CU. See [Autoscaling](/docs/introduction/autoscaling) for details.
- **Compute size range:** Autoscaling supports from 0.25 CU to 16 CU. For available sizes, see [Compute size and autoscaling configuration](/docs/manage/computes#compute-size-and-autoscaling-configuration).
- **Project-level defaults:** You can configure default autoscaling settings at the project level so that newly created computes (including those for new branches or read replicas) inherit the same configuration. See [Change your project's default compute settings](/docs/manage/projects#change-your-projects-default-compute-settings).

### Scale to Zero

Computes with no active queries for 5 minutes automatically [scale to zero](/docs/introduction/scale-to-zero). When a new connection arrives, activation generally takes a few hundred milliseconds. Ensure your CI/CD test runners, agent toolkits, and client database drivers are configured with adequate connection timeouts to tolerate this brief activation latency.

<Admonition type="tip" title="Disable Scale to Zero">
On paid plans, you can disable Scale to Zero for an always-active compute. This is useful for latency-sensitive production workloads. See [Edit a compute](/docs/manage/computes#edit-a-compute).
</Admonition>

### Connection pooling

If your application serves many concurrent users or uses serverless functions, enable [connection pooling](/docs/connect/connection-pooling). Neon uses PgBouncer in transaction mode, supporting up to 10,000 concurrent client connections.

- **Pooled connections:** Add `-pooler` to your compute endpoint hostname to route through PgBouncer. You can copy a pooled connection string from the Neon Console by enabling the **Connection pooling** toggle on your project dashboard.
  ![Connection pooling toggle](/docs/connect/connection_details.png)
- **Direct connections:** Use unpooled (direct) connections for schema migrations, `LISTEN/NOTIFY`, temporary tables, and `SET`/`RESET` commands, which are not supported in transaction mode.
- **Serverless and edge runtimes:** For HTTP-based or WebSocket queries from environments like Cloudflare Workers or Vercel Edge Functions, use the [Neon Serverless Driver](/docs/serverless/serverless-driver) (`@neondatabase/serverless`).

## Use Neon Snapshots for checkpoints

Neon Snapshots let you capture the state of a branch at a specific point in time and restore it later. This is ideal for testing schema migrations, debugging issues, or resetting AI agent environments without affecting production data.

1. **Take a snapshot:** Programmatically call the Neon API to create a snapshot of the active branch.
2. **Save agent state:** Serialize the agent's memory to JSON.
3. **Execute:** Allow the agent to proceed.

If the action fails or produces incorrect results, call the Neon [Restore API](https://api-docs.neon.tech/reference/restoresnapshot) with `"finalize_restore": true`. This restores the data in-place without changing your `DATABASE_URL`. You can then load the agent's saved memory, reject the bad decision, and let the AI try a different path against the cleanly restored database.

## Conclusion

When you build a robust development environment on Neon, you treat your database as software, eliminating the friction associated with traditional database administration. A robust setup means:

1. Installing SDKs and the Neon CLI, and authenticating via API keys for programmatic control.
2. Driving the branch-first local loop with `neon link` and `neon checkout` so your app always talks to the right isolated branch.
3. Declaring services and branch policies as code in `neon.ts` so environments stay reproducible across branches and teammates.
4. Handling `423 Locked` states and async polling gracefully so your provisioning pipelines never fail.
5. Subscribing to the changelog and automating drift detection to keep integrations in sync.
6. Equipping your AI assistants with MCP, Agent Skills, and `llms.txt` so they understand your infrastructure.
7. Isolating developers and feature branches with branching and snapshots.
8. Automating branch provisioning and cleanup with GitHub Actions and Vercel preview deployments.
9. Enabling connection pooling and connection limits for scalable database access.

With these foundations, your development teams and platform applications can provision, scale, and manage thousands of isolated Postgres environments securely and reliably.

## Resources

- [Neon API Reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api)
- [Neon Management SDK](/docs/reference/typescript-sdk)
- [Neon Python SDK](/docs/reference/python-sdk)
- [Neon Serverless Driver](/docs/serverless/serverless-driver)
- [Neon CLI](/docs/cli)
- [Neon CLI: `checkout`](/docs/cli/checkout)
- [Neon CLI: `init`](/docs/cli/init)
- [Branching with the Neon CLI](/docs/guides/branching-neon-cli)
- [A branch-first dev loop for Neon: link, checkout and env pull](/blog/branch-first-dev-loop)
- [neon.ts reference](/docs/reference/neon-ts)
- [Manage Neon projects with neon.ts](/guides/neon-ts-demo)
- [How a Neon backend fits together](/docs/get-started/backend-overview)
- [Poll operation status](/docs/manage/operations#poll-operation-status)
- [Connect MCP clients to Neon](/docs/ai/connect-mcp-clients-to-neon)
- [Agent Skills](/docs/ai/agent-skills)
- [Connection pooling](/docs/connect/connection-pooling)
- [Data Anonymization](/docs/workflows/data-anonymization)
- [Organizations](/docs/manage/organizations)
- [The Neon GitHub Integration](/docs/guides/neon-github-integration)
- [Automate Branching with GitHub Actions](/docs/guides/branching-github-actions)
- [Integrating Neon with Vercel](/docs/guides/vercel-overview)

<NeedHelp />
