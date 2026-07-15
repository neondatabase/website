---
name: neon
description: >-
  Overview of the Neon platform for apps and agents, spanning Postgres, Auth,
  the Data API, and the new services: Object Storage, Compute Functions, and AI
  Gateway. Use when "Neon" is mentioned, or when any of its individual
  capabilities are the trigger: "object storage" or "S3", "buckets", "serverless
  functions", "AI gateway", "call an LLM", "postgres", "database", or "backend".
---

# Neon

Important: Neon is no longer just a Serverless Postgres provider. Neon is the backend for apps and agents with Serverless Postgres, Auth, Functions, Object Storage, and an AI Gateway: instant, branchable, serverless.

Use this skill as the starting point for anything Neon: get an overview of its capabilities, find your way around the Neon agent skills and documentation, and follow best practices for getting started and for branch-first development workflows.

## Platform Services

Neon bundles several backend primitives for building apps and agents that all branch together with your project:

- **Postgres** — Serverless Postgres that scales and branches with your app. _Generally available._
- **Auth** — Managed authentication with users and sessions stored in Postgres. _Generally available._
- **Object Storage** — S3-compatible object storage that branches with your projects. _Public beta._
- **Functions** — Long-running serverless functions - Neon's compute offering - running close to your database — for WebSocket servers, long agent HTTP streams, APIs, and server-sent event servers. _Public beta._
- **AI Gateway** — One API for all frontier and open-source models, with routing, logging, and cost controls, powered by Databricks. _Public beta._

### Public Beta Service Availability

Object Storage, Functions, and AI Gateway are in public beta.

Beta access features are only available on net-new projects created in the `us-east-2` region; they cannot be enabled on existing projects for now. Before guiding a user through any of these services, confirm they are working with a new project in `us-east-2`. If not, they will need to create a new project in that region.

## Architecture: how Neon fits

Neon is **not** a place to host your full-stack app — it's backend primitives (Postgres, Auth, Object Storage, Functions, AI Gateway) that **compose with** the application platform you already use. Host the app on **Vercel** (or Netlify, or another frontend/app host); Neon is the backend it talks to.

A typical setup:

- **Full-stack app on Vercel** (or Netlify) — e.g. Next.js or TanStack Start. It owns your UI and auth (e.g. **Neon Auth**) and talks directly to your **Neon Postgres** database and **Neon Object Storage**.
- **Reach for Neon Functions when you outgrow the host's limits** — a WebSocket or SSE server, or long-running agents that risk timing out on short, lambda-style serverless. Run that one piece on a Neon Function, next to your data.

You can also move your **whole backend control plane** onto Neon Functions. This is especially useful when the frontend is **client-only** rather than full-stack — TanStack Router, React Router in client mode, and similar SPAs hosted on Vercel or Netlify. The client talks **directly to Neon Functions**, where you build REST APIs and request/response agents, host **MCP servers**, and run anything stateful or that should live close to Postgres and Object Storage. Secure these functions like any standalone REST API — verify a JWT or API key at the top of each handler (see the `neon-functions` skill).

Because Functions are just your backend, they compose with a full-stack app too: if you already have a backend (Next.js route handlers, etc.), Neon Functions sit alongside it, and you can **move pieces between the two** — e.g. relocate a long-running agent or a stateful WebSocket server off your host onto a Function when it needs more runtime.

## Neon Documentation

The Neon documentation is the source of truth for all Neon-related information. Always verify claims against the official docs before responding. Neon features and APIs evolve, so prefer fetching current docs over relying on training data.

### Fetching Docs as Markdown

Any Neon doc page can be fetched as markdown in two ways:

1. **Append `.md` to the URL** (simplest): https://neon.com/docs/introduction/branching.md
2. **Request `text/markdown`** on the standard URL: `curl -H "Accept: text/markdown" https://neon.com/docs/introduction/branching`

Both return the same markdown content. Use whichever method your tools support.

### Finding the Right Page

The docs index lists every available page with its URL and a short description:

```
https://neon.com/docs/llms.txt
```

Common doc URLs are organized in the topic links below. If you need a page not listed here, search the docs index: https://neon.com/docs/llms.txt. Don't guess URLs.

## Choosing the Right Skill

- Working with the database, connections, schema, queries, autoscaling, or the CLI/MCP/API → `neon-postgres`.
- Choosing or creating the right branch type for dev, preview, test, or CI workflows → `neon-postgres-branches`.
- Storing and serving files (uploads, images, blobs) that branch with the database → `neon-object-storage`.
- Deploying long-running or streaming serverless functions — APIs, agents, SSE/WebSocket servers — next to the database → `neon-functions`.
- Calling an LLM or routing across model providers with one credential — including discovering the branch's servable models at runtime via the OpenAI-compatible `/v1/models` endpoint → `neon-ai-gateway`.
- Provisioning instant, claimable temporary Postgres databases (for example, one per end user or demo) → `claimable-postgres`.
- Diagnosing or fixing excessive Postgres egress (network data-transfer) costs in a codebase → `neon-postgres-egress-optimizer`.

### Installing the Right Skill

First check whether the target skill is already installed and accessible (for example, it appears in the available skills list or its `SKILL.md` is present). If it is, use it directly. If it is not installed, install it via the `skills` CLI with `npx`/`bunx`:

```bash
npx skills add neondatabase/agent-skills -s <skill-name>
```

Replace `<skill-name>` with the skill you need (for example, `neon-object-storage`, `neon-functions`, or `neon-ai-gateway`). Useful flags:

- `-g` — install globally instead of into the current project.
- `-y` — non-interactive mode (skip prompts).
- `-a <agent-name>` — pick the target agent(s) for non-interactive mode.

For example, to install the object storage skill globally for a specific agent without prompts:

```bash
npx skills add neondatabase/agent-skills -s neon-object-storage -g -y -a <agent-name>
```

You should also make sure the skills are up to date. You can run the same command or replace `add` with `update` to update all Neon skills.

## Getting Started with Neon

Use this section when guiding a user through first-time Neon setup, or when adding a new Neon service (Auth, object storage, functions, and so on) to a project that is already onboarded (for example, one already using Neon Postgres).

### Check Status Quo

Before starting setup, inspect the user's codebase and environment:

- Existing database connection code
- Existing `.neon` or `neon.ts` files in the workspace
- Existing Neon MCP server or Neon CLI configuration
- Existence of a `.env` file and `DATABASE_URL` environment variable
- Existing ORM (Prisma, Drizzle, TypeORM) configuration

### Self-Driving Setup With Neon's CLI or MCP Server

Offer to inspect existing connected Neon projects or create new ones using the Neon CLI or MCP server. If neither is set up yet, run `npx -y neon init`. Use `npx -y` to skip the package install prompt. Auth is handled automatically. If the user is not logged in, it opens their browser for OAuth and waits for completion before proceeding.

```bash
npx -y neon@latest init
```

This installs the Neon CLI and MCP server globally, installs the VSCode extension (for Cursor/VS Code), and adds the `neon` and `neon-postgres` agent skills to the project.

If `init` is not suitable, the individual steps can be run non-interactively, using the user's preferred package manager (npm, bun, pnpm):

- **CLI:** `npm i -g neon`
- **Extension:** `cursor --install-extension databricks.neon-local-connect`
- **MCP server:** `npx -y add-mcp https://mcp.neon.tech/mcp -g -n Neon -y -a <agent-name>`
- **Agent skill:** `npx skills add neondatabase/agent-skills --skill neon-postgres --skill neon --agent <agent-name> -y`

Prefer the CLI over the MCP server unless the user instructs otherwise, since it provides more capabilities, including deploying Neon Functions. For full CLI installation options, see https://neon.com/docs/cli/install.md

### Setup Flow

Once the CLI, MCP server, and agent skills are installed, ensure the local workspace is linked to a Neon project through the `neon init` flow. If it isn't, run `npx -y neon link` to let the user interactively link a project. This produces a `.neon` file pointing to the organization, project, and branch the user wants to work with.

For each Neon service, consult that component's agent skill for service-specific setup instructions (Functions, Postgres, Object Storage, Gateway, and so on).

### Resume Support

If resuming setup, check what's already configured (MCP connection, `.env` with `DATABASE_URL`, dependencies, schema) and continue from the next incomplete step.

### Security Reminders

Remind users to use environment variables for credentials, never commit connection strings, and use least-privilege database roles.

## Branch-First Dev Flow

Default to a branch-first loop that mirrors `git`: one isolated Neon branch per feature, so nothing leaks between features and there are no shared connection strings to copy around. Two commands drive it — `link` once per project, then `checkout` per feature — and a third, `env pull`, runs automatically under the hood so the branch you pin is immediately usable:

- `neon link` — Interactively links the workspace to a Neon org, project, and branch, writing the IDs to a git-ignored `.neon` file. Run once per project. Once linked, project- and branch-scoped commands no longer need `--project-id` or `--branch` (for example, `neon branch list`).
- `neon checkout <branch-name>` — Creates the branch if it doesn't exist, or checks out the existing one, by updating only the branch pointer in `.neon`. Run without a name for an interactive picker. It does not touch code or local Postgres.
- `neon env pull` — Fetches the current branch's Neon environment variables (`DATABASE_URL`, …) into your existing `.env`, or `.env.local` if you don't have one (override the target with `--file`). No branch ID needed; it reads `.neon`. **`link` and `checkout` run this for you by default**, so you rarely call it directly.

Run `link` once when starting on a project, then `checkout` per feature:

```bash
neon link                     # once; also pulls the linked branch's env
neon checkout dev-add-search  # per feature; also pulls the branch's env
```

Because `link` and `checkout` pull env by default, the branch's `DATABASE_URL` lands in your local `.env` automatically — build against it, then `checkout` the next branch and repeat. As the agent, drive this loop yourself: run `checkout` between tasks to get a fresh, isolated database per feature with no shared state to corrupt.

### Updating `.neon` without interactive prompts

Plain `neon link` / `neon checkout` prompt interactively, which an agent can't answer. Use one of these non-interactive paths instead:

- **`neon link --agent`** — a JSON state machine for agents. Each call returns a single JSON object with a `status` (`needs_org` → `needs_project` → `needs_project_details` → `linked`, or `error`), the available `options`, and the exact `next_command_template` to run next. Drive it step by step until `status: "linked"`. (Errors also come back as JSON with exit code 1, so you can always parse the result.)
- **`neon set-context --project-id <id> --org-id <id> --branch-id <id>`** — when you already know the IDs, write all three into `.neon` in one shot. This is a **destructive write**: it replaces the file's contents entirely with exactly these fields, so it's the most direct way to point `.neon` at a specific org / project / branch.

Both avoid prompts entirely; reach for `set-context` when you have the IDs and `link --agent` when you need to discover them.

### Opting out of local env vars

If env vars are injected at runtime instead of written to disk — or you simply don't want secrets in the working tree — pass `--no-env-pull` to `link` / `checkout` and supply the env another way:

- `neon-env run -- <your dev command>` (from `@neon/env`) fetches the branch's vars from your `neon.ts` and injects them into the child process at runtime — no `.env` file needed. This is the runtime counterpart to the on-disk `env pull`.
- `neon-env export` (from `@neon/env`) prints the branch's env to stdout as dotenv lines or, with `--format json`, JSON — for piping into another env manager rather than running a command. For example, [varlock](https://varlock.dev) can bulk-load it from a `.env.schema` with `@setValuesBulk(exec("neon-env export --format json"), format=json)`.
- `fetchEnv` from `@neon/env` is the programmatic version of the same thing: resolve the branch's env in code at runtime instead of shelling out to `neon-env run`.
- `neon dev` injects the same vars into your local dev server — it's part of Neon Functions local development (a public beta feature).

When an agent should not write a local `.env`, instruct it (for example in your `AGENTS.md`) to run `neon checkout <branch> --no-env-pull` and rely on runtime injection.

For reading env you _already_ have on disk (typed and validated against your `neon.ts`), use `parseEnv` — see [Neon Infrastructure as Code](#neon-infrastructure-as-code) below.

## Neon Infrastructure as Code

`neon.ts` is Neon's branch config and infrastructure-as-code file: declare which Neon services your project's branches should have, get type-safe env vars, and program branch settings — all in TypeScript. It's the config layer for Neon as a platform, and it composes with the branch-first loop above. Add it with `@neon/config`:

```bash
npm i @neon/config
```

```typescript
// neon.ts
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  auth: true,
  dataApi: true,
});
```

### Provision services with neon config

Every project ships with serverless Postgres; `neon.ts` lets you also declare Neon Auth and the Data API today, with Functions, buckets, and the AI Gateway under a `preview` block — every service for the branch composes in one file:

```typescript
// neon.ts
export default defineConfig({
  auth: true,
  dataApi: true,
  preview: {
    functions: {
      /* ... */
    }, // see the neon-functions skill
    buckets: {
      /* ... */
    }, // see the neon-object-storage skill
    aiGateway: true, // see the neon-ai-gateway skill
  },
});
```

Reconcile the declaration from the CLI — the Neon equivalent of `terraform status` / `plan` / `apply`:

```bash
neon config status   # print the branch's live config (read-only)
neon config plan     # dry-run diff of what apply would change (read-only)
neon config apply    # provision the declared services
neon deploy          # alias for `neon config apply`
```

`config status` and `config plan` only read state. `apply` / `deploy` — like `link` and `checkout` — provision the declared services **and then pull the branch's env into your local `.env.local`** (e.g. `Pulled 5 Neon variables into .env.local: DATABASE_URL, …`), so your local env always matches what's deployed.

### Type-safe env vars with parseEnv

`@neon/env`'s `parseEnv` takes your `neon.ts` config object and returns a parsed, typed env object, validated against the services you declared. The shape of `env` follows your config — enable `auth` and you get `env.auth`, enable `dataApi` and you get `env.dataApi` — and missing variables are flagged with clear errors (for you and your agents). Use it to read env you already have (typically pulled into `.env` by `checkout` / `env pull`); for fetching env at runtime without a file, reach for `fetchEnv` / `neon-env run` instead.

```bash
npm i @neon/env
```

```typescript
import { parseEnv } from "@neon/env";
import config from "./neon";

const env = parseEnv(config);

console.log(env.postgres.databaseUrl);
console.log(env.auth.baseUrl);
```

By default `parseEnv` requires _every_ variable your config implies. When a process only uses a subset — a common case in frameworks like Next.js, where you might read `DATABASE_URL` but never the unpooled URL — pass an array of env-var keys to require and return only those. The keys are typesafe: autocomplete only offers variables your config enables, and the returned shape is narrowed to exactly what you selected (so unselected variables are neither enforced nor present).

```typescript
import { parseEnv } from "@neon/env";
import config from "./neon";

// Only DATABASE_URL is required and returned; DATABASE_URL_UNPOOLED is not enforced.
const { postgres } = parseEnv(config, ["DATABASE_URL"]);
console.log(postgres.databaseUrl);

// Selecting across services — only these keys are validated/returned.
const env = parseEnv(config, ["DATABASE_URL", "NEON_AUTH_BASE_URL"]);
console.log(env.postgres.databaseUrl, env.auth.baseUrl);
```

### How checkout composes with neon.ts

When a `neon.ts` is present, `neon checkout` applies your policy as it **creates** a branch, so a fresh branch comes up with its declared settings and services already in place. Checking out an _existing_ branch never reconciles it — apply config changes to it explicitly with `neon config apply` (or `neon deploy`). The bundled `env pull` also checks `neon.ts` against the linked branch and fails fast if the branch is missing a declared service, pointing you at `neon deploy` to provision it, so your local env and the remote branch never drift apart silently.

### Branch configuration

Beyond services, `neon.ts` can program what configuration _new_ branches receive via the `branch` property — a function of the branch being evaluated that returns its settings:

```typescript
// neon.ts
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  auth: true,
  dataApi: true,
  branch: (branch) => {
    if (branch.exists) {
      // leave existing branches untouched
      return {};
    }
    if (branch.name.startsWith("dev")) {
      return {
        ttl: "7d", // clean up the branch after 7 days
        postgres: {
          computeSettings: {
            autoscalingLimitMinCu: 0.25, // scale to zero
            autoscalingLimitMaxCu: 1, // keep it cheap
            suspendTimeout: "5m",
          },
        },
      };
    }
    return {};
  },
});
```

The `branch` function receives the target branch (its `name`, whether it `exists` yet, whether it's the default, and more) and returns the tuning you want. Here new `dev-*` branches get a 7-day TTL so they clean themselves up, plus a cheap scale-to-zero compute profile, while existing branches and everything else fall through to the defaults. Because `neon checkout` applies this policy on create, a fresh `dev-*` branch comes up with these settings already in place.

### Type-safe config: invalid setups don't compile

Because `neon.ts` is TypeScript, the compiler catches invalid infrastructure before you ever deploy — and Neon encodes the actual rules (and their fixes) into the types, so the error tells you what to do rather than failing with a useless `Type 'true' is not assignable to type 'never'`. The canonical case: the Data API verifies requests with Neon Auth by default, so enabling it on its own is a type error _on_ `dataApi`:

```typescript
export default defineConfig({
  dataApi: true, // type error: `dataApi` (default authProvider 'neon') requires Neon Auth
});
```

The message names both fixes, so pick one:

```typescript
// 1. Enable Neon Auth (the default Data API auth provider):
export default defineConfig({ auth: true, dataApi: true });

// 2. Or verify a third-party IdP instead of Neon Auth:
export default defineConfig({
  dataApi: {
    authProvider: "external",
    jwksUrl: "https://your-idp/.well-known/jwks.json",
  },
});
```

Treat a `neon.ts` type error as the config telling you which services must go together — read the message, it spells out the valid combinations.

## Gotchas

### Neon Auth: "invalid domain"

Neon Auth only redirects back to domains on its trusted-domains list. Anytime the domain your app runs on changes — a new production custom domain, a new deploy/preview URL, moving from `localhost` to a hosted environment, and so on — you must register the new domain with Neon Auth. Otherwise sign-in and OAuth callbacks fail with an **`invalid domain`** error because the redirect target isn't trusted.

The easiest way to fix this is the CLI. With the workspace linked to the project (see the branch-first flow above), add the new domain to the trusted list:

```bash
neon neon-auth domain add <domain>   # e.g. neon neon-auth domain add https://app.example.com
neon neon-auth domain list           # verify what's currently trusted
neon neon-auth domain delete <domain> # remove one you no longer use
```

If the workspace isn't linked, pass `--project-id <id>` (and `--branch <id|name>`) explicitly. For local development, `neon neon-auth domain allow-localhost` manages whether `localhost` is permitted. Register the domain before pointing users at the new URL, so they never hit the `invalid domain` error.
