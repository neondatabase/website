---
title: Neon backend beta guide
subtitle: Get started with Neon Functions, Object Storage, and AI Gateway
enableTableOfContents: true
redirectFrom:
  - /docs/get-started/platform-private-preview/
---

<Admonition type="info" title="Beta">
Functions, Object Storage, and the AI Gateway are in beta and not yet recommended for production workloads. They're available to every Neon account, no invite required, on new or existing projects in **AWS US East (Ohio) (`aws-us-east-2`)**.

Functions and Object Storage are free on any plan during the beta, subject to usage limits. The AI Gateway requires a paid plan (Launch or Scale), with inference free during the beta. Build something and help us refine them by sharing your feedback in Discord.
</Admonition>

## What's in the beta

Three new services join Postgres and Managed Better Auth, all scoped to your branches:

- **Neon Functions**: long-running Node.js compute next to your database. WebSocket servers, SSE streams, AI agents.
- **Neon Object Storage**: S3-compatible object storage that branches with your data.
- **Neon AI Gateway**: one credential for frontier and open-source models (Claude, GPT, Gemini, and more).

You declare all of it in one `neon.ts` file, and it branches together: fork a branch and you get an isolated copy of your database, files, storage, functions, and gateway.

## Check your access

To confirm access, go to [console.neon.tech](https://console.neon.tech), open a project in **US East (Ohio)**, and check the left navigation for **Storage**, **Credentials**, **AI Gateway**, and **Functions**. For what AI Gateway costs once billing begins, see [AI Gateway pricing](/docs/ai-gateway/overview#pricing).

<img src="/docs/get-started/neon_app_backend.png" alt="Neon app backend navigation" width="240" />

Not seeing the services? The most common reason is region: the project isn't in `us-east-2`. Create a new project in **US East (Ohio)**, or switch to an existing one there. If AI Gateway is the only thing missing, check your plan, it requires Launch or Scale. If a service is still missing after that, post in [#neon-platform-beta](https://discord.com/channels/1176467419317940276/1525919714541437058) on Discord.

Using the CLI? Keep it current, the beta CLI updates frequently. Run `npm i -g neon@latest` before each session and before reporting a bug.

## Start building

The fastest path is to hand the setup to your AI assistant. Open Cursor or Claude Code in any directory, copy this prompt, and paste it in. Your agent installs the CLI, sets up the project, installs the agent skills, and pulls your environment variables.

<CopyPrompt src="/prompts/neon-backend.md" description="Hand this to your AI assistant to set up Neon: skills, project, and all capabilities. Then tell it what to build." buttonText="Copy prompt" />

For a guided path instead, pick the one that fits how you work:

- [Tour the Neon backend](/docs/get-started/backend-overview): how Postgres, Object Storage, Functions, the AI Gateway, and Auth fit together in one `neon.ts`, with a copyable prompt to hand your AI assistant.
- [Full backend quickstart](/docs/get-started/full-backend-quickstart): build a working Next.js backend end-to-end, wiring Postgres, Object Storage, and a Neon Function that calls the AI Gateway.

### Bootstrap from a template

Run `neon bootstrap` in an empty folder to scaffold a ready-made app, then follow its README. Pick from the templates below, or browse them all at [github.com/neondatabase/examples](https://github.com/neondatabase/examples). See the [`bootstrap` reference](/docs/cli/bootstrap) for command options.

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

For per-service details, see [Neon Functions](/docs/compute/functions/overview), [Neon Object Storage](/docs/storage/overview), and [Neon AI Gateway](/docs/ai-gateway/overview). For inspiration, [Build on Neon](https://build-on-neon.vercel.app/) indexes demo apps built on the full platform stack.

## Known limitations

- Functions: memory is fixed at 2048 MiB, not configurable during the beta.

## Feedback

Post in [#neon-platform-beta](https://discord.com/channels/1176467419317940276/1525919714541437058) on Discord: bugs, confusion, docs gaps, feature requests, and what you build. We run office hours and user interviews throughout the beta. Details in the channel.

Tell us what you build. We'd love to feature it.

<NeedHelp/>
