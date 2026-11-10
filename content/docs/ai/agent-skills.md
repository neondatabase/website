---
title: Agent Skills
subtitle: Teach your AI coding assistant how to work with Neon
summary: >-
  Agent Skills are structured context files (SKILL.md) that give AI coding
  assistants accurate knowledge of Neon's cloud backend primitives, APIs, SDKs,
  and best practices. Install them when using Cursor, Claude Code, OpenAI Codex, or any
  Agent Skills-compatible tool. Skills cover Postgres, Managed Better Auth, Neon Functions,
  Object Storage, AI Gateway, branching workflows, and more. Install them
  with `neon skills`, `npx skills add neondatabase/agent-skills -y`, `neon init`,
  or the Neon plugin, at project or user level.
enableTableOfContents: true
updatedOn: '2026-11-05T13:53:34.719Z'
redirectFrom:
  - /docs/ai/ai-rules
  - /docs/ai/ai-rules-neon-toolkit
  - /docs/ai/ai-rules-neon-auth
  - /docs/ai/ai-rules-neon-drizzle
  - /docs/ai/ai-rules-neon-serverless
  - /docs/ai/ai-rules-neon-typescript-sdk
  - /docs/ai/ai-rules-neon-python-sdk
  - /docs/ai/ai-rules-neon-api
---

Agent Skills provide your AI coding assistant with structured context about Neon's platform, APIs, and best practices. With skills installed, your assistant produces more accurate code and avoids common mistakes when working with Neon, from Postgres and Auth to [Neon Functions](/docs/compute/functions/overview), [Object Storage](/docs/storage/overview), and the [AI Gateway](/docs/ai-gateway/overview).

<YoutubeIframe embedId="NN251KTjAo8" title="Neon Agent Skills demo" />

## Install

There are several ways to install Neon skills depending on your editor and workflow.

### neon skills

The [Neon CLI](/docs/cli) installs skills interactively:

```bash
neon skills
```

It pre-selects your detected agents, lets you pick which skills to add, and confirms before writing. Pass `-s <skill>` and `--agent <name>` to skip the prompts, `--global` to install user-level, and run `neon skills update` to refresh installed skills. To see which installed skills have updates, run `neon skills status`. Other `neon` commands also warn you once a day when a skill is out of date. Both cover skills installed with `neon skills` or `npx skills add`, not plugins. See the [`neon skills` reference](/docs/cli/skills) for all options.

### npx skills

For any AI tool that supports the [Agent Skills](https://agentskills.io) format, install skills from the [Agent Skills repository](https://github.com/neondatabase/agent-skills):

```bash
npx skills add neondatabase/agent-skills -y
```

This installs **all** skills in the repository. To install a specific skill instead, pass the `-s` flag:

```bash
npx skills add neondatabase/agent-skills -s neon -y
```

Useful flags:

- `-y` skips the interactive prompt and installs immediately
- `-s` selects one or more skills (repeat the flag for multiple skills)
- `-g` installs globally instead of at the project level (see [Project vs. user level](#project-level-vs-global-install))

### Plugins

<NeonPluginContents/>

For most coding agents, the plugin is the easier option. To install it, see [Set up your AI agent](/docs/ai/agent-setup).

### neon init

[`npx neon@latest init`](/docs/cli/init) installs the plugin, or skills and the MCP Server, for your coding agents and links a Neon project.

## Available skills

Skills are grouped by area. Each skill is a `SKILL.md` entry point that your agent reads and invokes when relevant. Browse and install individual skills on [skills.sh](https://skills.sh/neondatabase/agent-skills).

Install any of them by name with [`neon skills`](/docs/cli/skills) (`-s` is repeatable):

```bash
neon skills -s neon -s neon-postgres
```

Without the Neon CLI, run `npx skills add neondatabase/agent-skills -s neon -s neon-postgres` instead.

### Core

Start here for platform overview and Postgres development.

| Skill                                                                        | Description                                                                                                                                                |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`neon`](https://skills.sh/neondatabase/agent-skills/neon)                   | Platform overview for apps and agents: Postgres, Auth, Data API, Functions, Storage, and AI Gateway, including Claimable Neon when there is no account yet |
| [`neon-postgres`](https://skills.sh/neondatabase/agent-skills/neon-postgres) | Full index of Neon Serverless Postgres documentation and best practices, including branching workflows and egress optimization                             |

### Neon Platform

Use Neon services beyond core Postgres. **Functions**, **Object Storage**, **AI Gateway**, and **Realtime** are available in AWS US East (Ohio), US East (N. Virginia), Europe (Frankfurt), and Asia Pacific (Singapore), with more regions coming. See the [backend overview](/docs/get-started/backend-overview) for details.

| Skill                                                                                    | Description                                                                                                         | Docs                                               |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| [`neon-functions`](https://skills.sh/neondatabase/agent-skills/neon-functions)           | Long-running serverless Node.js HTTP functions on your branch, with `DATABASE_URL` injected automatically           | [Neon Functions](/docs/compute/functions/overview) |
| [`neon-object-storage`](https://skills.sh/neondatabase/agent-skills/neon-object-storage) | S3-compatible object storage that branches with your project                                                        | [Object Storage](/docs/storage/overview)           |
| [`neon-ai-gateway`](https://skills.sh/neondatabase/agent-skills/neon-ai-gateway)         | One API and credential for frontier and open-source LLMs; compatible with OpenAI, Anthropic, and Vercel AI SDKs     | [AI Gateway](/docs/ai-gateway/overview)            |
| [`neon-auth`](https://skills.sh/neondatabase/agent-skills/neon-auth)                     | Add authentication with Managed Better Auth: sign-up, sign-in, OAuth, magic links, OTP, passkeys, and organizations | [Managed Better Auth](/docs/auth/overview)         |
| [`neon-realtime`](https://skills.sh/neondatabase/agent-skills/neon-realtime)             | Live SQL queries and reactivity primitives, so app UI and agent state update as rows change                         | [Realtime](/docs/realtime/overview)                |

### Agent platforms

For codegen tools and multi-tenant products that provision Neon for their users, see the companion skill in [neondatabase/neon-for-agent-platforms](https://github.com/neondatabase/neon-for-agent-platforms) (`neon-postgres-agent-platforms` on [skills.sh](https://skills.sh/neondatabase/neon-for-agent-platforms/neon-postgres-agent-platforms)).

## Project vs. user level (#project-level-vs-global-install)

Project-level installs live in your project directory and can be committed with it. User-level (global) installs apply across all your projects. Each install method has its own default:

| How you install                             | Where it goes                                                                                                                                                                         |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Set up agent prompt](/docs/ai/agent-setup) | User level                                                                                                                                                                            |
| `neon init` (recommended setup)             | User level, for each detected agent. With no agent detected, skills go in the current directory. [Custom setup](/docs/cli/init#recommended-and-custom-setup) can write to the project |
| [`neon plugins`](/docs/cli/plugins)         | User level                                                                                                                                                                            |
| [`neon skills`](/docs/cli/skills)           | Project by default; `--global` for user level                                                                                                                                         |
| `npx skills add`                            | Project by default; `-g` for user level                                                                                                                                               |
| [`neon mcp`](/docs/cli/mcp)                 | Asks; `--project` for the project, `-y` for user level                                                                                                                                |

## What's covered

With the full skill set installed, your assistant can guide you across Neon:

**Postgres and platform basics (`neon`, `neon-postgres`)**

- **Getting started** with Neon, including project setup and key features (branching, autoscaling, scale-to-zero, instant restore, read replicas)
- **Connections**, including the serverless driver, connection pooling, and connection strings
- **Authentication** with Managed Better Auth
- **Data API** via `@neon/neon-js`
- **Platform APIs and SDKs**, including the REST API, TypeScript SDK, and Python SDK
- **Developer tools**, including the CLI, VS Code extension, and MCP server

**Database workflows**

- **Disposable projects** via [Claimable Neon](/claimable-neon), for agents and tests
- **Branch types and workflows** for migrations, schema-only branches, and reset-from-parent
- **Egress optimization** for high transfer costs and query anti-patterns

**Platform services**

- **Neon Functions**: declare, deploy, and connect long-running compute next to your database
- **Object Storage**: S3-compatible storage that branches with your data
- **AI Gateway**: model routing, logging, and cost controls with a single Neon credential

For example, ask your assistant to "set up Managed Better Auth in my Next.js app" and it will provide the correct imports, configuration, and middleware setup. Or ask it to "add an AI Gateway route in my `neon.ts` file" and it will follow the correct constraints and SDK patterns.

## Example prompts

```
Get started with Neon
```

```
Recommend a connection method for this project
```

```
Set up Drizzle ORM with Neon
```

```
Set up Managed Better Auth for my Next.js app
```

```
Create a Neon branch for this feature
```

```
Give me a quick temporary Postgres database
```

```
Why is my Neon bill so high?
```

```
Add a serverless function to my Neon branch
```

```
Set up S3-compatible storage in neon.ts
```

```
Route LLM calls through the Neon AI Gateway
```

## How it works

Your AI assistant reads the `SKILL.md` file to understand what Neon guidance is available. When you ask about a specific topic, the skill fetches the relevant documentation from online, so your assistant always has up-to-date context without bundling everything locally. For the complete source, see the [Agent Skills repository](https://github.com/neondatabase/agent-skills).
