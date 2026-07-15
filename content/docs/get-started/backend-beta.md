---
title: Neon backend beta guide
subtitle: Get started with Neon Functions, Object Storage, and AI Gateway
enableTableOfContents: true
redirectFrom:
  - /docs/get-started/platform-private-preview/
---

The Neon backend for apps and agents is in beta.

<Admonition type="info" title="Beta">
Functions, Object Storage, and AI Gateway are not yet recommended for production workloads. Build something and help us refine them by sharing your feedback in [Discord](https://discord.gg/92vNTzKDGp).
</Admonition>

## What's in the beta

Three new services join Postgres and Managed Better Auth, all scoped to your branches:

- **Neon Functions**: long-running Node.js compute next to your database. WebSocket servers, SSE streams, AI agents.
- **Neon Object Storage**: S3-compatible object storage that branches with your data.
- **Neon AI Gateway**: one credential for frontier and open-source models (Claude, GPT, Gemini, and more).

You declare all of it in one `neon.ts` file, and it branches together: fork a branch and you get an isolated copy of your database, files, storage, functions, and gateway.

## Check your access

Beta access is open to every Neon account, no invite required. Services work in **AWS us-east-2** only, on new or existing projects in that region. Functions and Object Storage are free to use during the beta on any plan, subject to usage limits. AI Gateway requires a paid plan (Launch or Scale); inference is free for paid plans during the beta. See [AI Gateway pricing](/docs/ai-gateway/overview#pricing) for what to expect once billing begins.

To confirm access, go to [console.neon.tech](https://console.neon.tech), open a project in **US East (Ohio)** (`us-east-2`), and check the left navigation for **Storage**, **Credentials**, **AI Gateway**, and **Functions**. If a service is missing, post in [#neon-platform-private-preview](https://discord.com/channels/1176467419317940276/1514002115024916643) on Discord.

![Neon app backend navigation](/docs/get-started/neon_app_backend.png)

## Get started

There are three ways to get started. Pick the one that fits how you work.

### Option 1: AI agent (recommended)

Open Cursor or Claude Code in any directory (an existing project or a new empty folder) and paste this prompt:

```text
I'm using the Neon backend beta (Functions, Object Storage, AI Gateway). Please run and follow `npx neon@latest init --preview`
```

Your agent will install the CLI, walk you through project setup, install agent skills, and pull your environment variables. You'll need to complete a browser OAuth step when prompted.

### Option 2: Bootstrap from a template

In an empty folder, run:

```bash
neon bootstrap
```

Pick a template from the interactive selector, or pass `--template <id>` to skip it:

| Template            | What it builds                                                                                                                                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `hono`              | A todo CRUD API using Hono and Drizzle ORM, deployed as a Neon Function. Includes pre-configured schema and migrations. A good starting point for any HTTP API on Neon Functions.                                  |
| `ai-sdk`            | A streaming AI chat agent on Neon Functions that generates images on demand, stores them in Neon Object Storage, and indexes metadata in Postgres via Drizzle. Uses Neon AI Gateway for model access.              |
| `mastra`            | A personal-assistant chatbot on Neon Functions that remembers you across conversations. Streams responses through Neon AI Gateway and persists context across threads using Mastra Memory backed by Neon Postgres. |
| `mcp`               | An MCP server on Neon Functions that exposes contact management tools (create, update, delete, search) to AI agents via streamable HTTP. Compatible with Cursor, Claude Desktop, and other MCP clients.            |
| `realtime-chat`     | A full-stack realtime chat app: Next.js frontend with Managed Better Auth, a WebSocket server on Neon Functions, and messages persisted and fanned out across isolates with Postgres LISTEN/NOTIFY.                |
| `realtime-sse`      | A realtime shared counter: TanStack Router SPA connected to a Hono server on Neon Functions via server-sent events. State persists in Postgres and broadcasts across isolates with LISTEN/NOTIFY.                  |
| `discord-bot-http`  | A Discord interactions bot on Neon Functions: slash commands, embeds, Components v2 buttons, and user profiles with command usage tracked in Postgres.                                                             |
| `telegram-bot-http` | A Telegram webhook bot on Neon Functions: bot commands, inline keyboard buttons, and user profiles with command usage tracked in Postgres.                                                                         |
| `whatsapp-bot-http` | A WhatsApp Cloud API webhook bot on Neon Functions: bot commands, interactive reply buttons, and user profiles with command usage tracked in Postgres.                                                             |

Each template includes agent skills and a README. Follow the README steps, or tell your agent to follow them.

Browse all bootstrap templates at [github.com/neondatabase/examples](https://github.com/neondatabase/examples).

### Option 3: Manual setup

For exploring the platform primitives directly, or to understand what the agent does under the hood.

**1. Install agent skills**

Agent skills give your agent built-in knowledge of Neon services. Install them for your editor:

```bash
bunx skills add neondatabase/agent-skills -a cursor
```

**2. Install the CLI**

```bash
npm install -g neon@latest
```

**3. Link your project**

In your project directory:

```bash
neon link
```

Similar to `vercel link`, this connects the directory to a Neon project and creates a `.neon` state file that tracks your project and current branch. All CLI commands in this directory will automatically point to the linked project and branch.

**4. Create a neon.ts file**

`neon.ts` is the infrastructure-as-code config for your Neon project. Install the config package first:

```bash
npm install @neon/config
```

Then create `neon.ts` in your project root. This example enables the AI Gateway, creates a storage bucket, and declares a function:

```ts filename="neon.ts"
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  preview: {
    aiGateway: true,
    buckets: {
      uploads: {},
    },
    functions: {
      api: {
        name: "API",
        source: "./functions/api.ts",
      },
    },
  },
});
```

See the [neon.ts reference](/docs/reference/neon-ts) for the full config API.

**5. Plan and apply**

Preview what will change:

```bash
neon config plan
```

Apply it:

```bash
neon config apply
```

Once applied, environment variables for all your services are written to `.env.local` automatically: database URL, storage credentials, AI Gateway key, and more.

## Key CLI commands

The Neon CLI supports a full local development workflow for the platform. You link a directory to a project, declare your infrastructure in `neon.ts`, develop functions locally with hot reload, and deploy when you're ready. Branching is built into the workflow: `neon checkout` creates an isolated branch with its own database, storage, and functions, so you can develop and test without touching your main branch. Here are the commands that make up that workflow, each with a link to its full reference.

| Command                                        | What it does                                                                                                                                                   |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`neon link`](/docs/cli/link)                  | Bind the current directory to a Neon project. Writes a `.neon` context file so all subsequent commands target the right project and branch automatically.      |
| [`neon checkout <branch>`](/docs/cli/checkout) | Switch the active branch in your local context. Creates the branch if it doesn't exist. Pulls updated env vars into `.env.local` after switching.              |
| [`neon config plan`](/docs/cli/config)         | Dry run your `neon.ts` changes. Shows what will be created, updated, or removed without applying anything.                                                     |
| [`neon config apply`](/docs/cli/config)        | Apply your `neon.ts` to the current branch and refresh env vars in `.env.local`.                                                                               |
| [`neon deploy`](/docs/cli/deploy)              | Apply `neon.ts` and deploy your functions in one step. Use this instead of `config apply` when functions are in play.                                          |
| [`neon dev`](/docs/cli/dev)                    | Run your functions locally with hot reload. Serves every function declared in `neon.ts`, each on its own dev server. Essential for local function development. |
| [`neon env pull`](/docs/cli/env)               | Pull the current branch's environment variables into `.env.local`. Run this after switching branches if you skipped the automatic pull.                        |

Keep the CLI up to date: run `npm i -g neon@latest` before each session and before reporting a bug. The beta CLI updates frequently.

## Docs

Docs are evolving daily during the beta. Use the Neon agent skills as your primary reference.

- [Neon Functions](/docs/compute/functions/overview): overview, get started, neon.ts reference, runtime limits
- [Neon Object Storage](/docs/storage/overview): buckets, objects, S3 compatibility
- [Neon AI Gateway](/docs/ai-gateway/overview): get started, model catalog, SDK dialects
- [Model catalog on models.dev](https://models.dev/providers/neon): every model ID the gateway serves

For inspiration, see [Build on Neon](https://build-on-neon.vercel.app/): an index of demo apps built on the full platform stack.

## Known limitations

- AWS us-east-2 only.
- Functions: memory is fixed at 2048 MiB, not configurable during the beta.
- AI Gateway requires a paid plan (Launch or Scale). Functions and Object Storage work on any plan.

## Feedback

Post in [#neon-platform-private-preview](https://discord.com/channels/1176467419317940276/1514002115024916643) on Discord: bugs, confusion, docs gaps, feature requests, and what you build. We run office hours and user interviews throughout the beta. Details in the channel.

Tell us what you build. We'd love to feature it.

<NeedHelp/>
