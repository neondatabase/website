---
title: Agent Skills
subtitle: Teach your AI coding assistant how to work with Neon
summary: >-
  Agent Skills are structured context files (SKILL.md) that give AI coding
  assistants accurate knowledge of Neon's platform, APIs, SDKs, and best
  practices. Install them when using Cursor, Claude Code, OpenAI Codex, or any
  Agent Skills-compatible tool. Skills cover Postgres, Auth, Neon Functions,
  Object Storage, AI Gateway, branching workflows, and more. Install all skills
  with `npx skills add neondatabase/agent-skills -y`, a single skill with `-s`,
  `neon init`, or editor plugins at project level or globally.
enableTableOfContents: true
updatedOn: '2026-06-26T10:41:58.102Z'
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

<YoutubeIframe embedId="NN251KTjAo8" />

## Install

There are several ways to install Neon skills depending on your editor and workflow.

### npx skills

For any AI tool that supports the [Agent Skills](https://agentskills.io) format, install skills from the [Agent Skills repository](https://github.com/neondatabase/agent-skills):

```bash
npx skills add neondatabase/agent-skills -y
```

This installs **all** skills in the repository. To install a specific skill instead, pass the `-s` flag:

```bash
npx skills add neondatabase/agent-skills -s neon-postgres -y
```

Useful flags:

- `-y` skips the interactive prompt and installs immediately
- `-s` selects one or more skills (repeat the flag for multiple skills)
- `-g` installs globally instead of at the project level (see [Project-level vs. global install](#project-level-vs-global-install))

### Cursor plugin

If you're using Cursor, install the Neon plugin from the marketplace. It bundles core Postgres skills and the Neon MCP Server in one package.

In Cursor chat, run:

```text
/add-plugin neon-postgres
```

Or install from [cursor.com/marketplace/neon](https://cursor.com/marketplace/neon). See [Cursor plugin for Neon](/docs/ai/ai-cursor-plugin) for details.

<Admonition type="note">
Editor plugins currently bundle the core Postgres skill set and MCP integration. To give your assistant context for **Neon Functions**, **Object Storage**, and **AI Gateway**, run `npx skills add neondatabase/agent-skills -y` or install the platform skills individually (see [Available skills](#available-skills)).
</Admonition>

### Claude Code plugin

If you're using Claude Code, install the Neon plugin for skills and MCP integration:

```bash
/plugin marketplace add neondatabase/agent-skills
/plugin install neon-postgres@neon
```

See [Claude Code plugin for Neon](/docs/ai/ai-claude-code-plugin) for details.

### Codex plugin

If you're using OpenAI Codex, install the **Neon Postgres** plugin from the [Codex plugin directory](https://developers.openai.com/codex/plugins/) (in the Codex app under **Plugins**, or in the Codex CLI with `/plugins`). It includes the Neon Postgres app (MCP), the main Neon skill, and the egress optimizer skill.

See [Codex plugin for Neon](/docs/ai/ai-codex-plugin) for details.

### neon init

The `neon init` command sets up your project to use Neon with your AI coding assistant. It authenticates via OAuth, creates an API key, configures the MCP server, installs the Neon extension for Cursor and VS Code where applicable, and installs agent skills at the project level:

```bash
npx neon@latest init
```

If you're in the **platform private preview** (Functions, Storage, AI Gateway), use `neon init --preview` instead. See the [Platform private preview guide](/docs/get-started/platform-private-preview) for access and setup.

After running `init`, restart your editor and ask your AI assistant to "Get started with Neon" to launch the interactive onboarding guide. See the [`neon init` reference](/docs/cli/init) for details.

## Available skills

Skills are grouped by area. Each skill is a `SKILL.md` entry point that your agent reads and invokes when relevant. Browse and install individual skills on [skills.sh](https://skills.sh/neondatabase/agent-skills).

### Core

Start here for platform overview and Postgres development.

| Skill                                                                        | Description                                                                                                                 |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| [`neon`](https://skills.sh/neondatabase/agent-skills/neon)                   | Platform overview for apps and agents: Postgres, Auth, Data API, Functions, Storage, and AI Gateway, and how to get started |
| [`neon-postgres`](https://skills.sh/neondatabase/agent-skills/neon-postgres) | Comprehensive index of Neon Serverless Postgres documentation and best practices                                            |

### Database workflows

Provision, branch, and optimize Postgres projects.

| Skill                                                                                                          | Description                                                                                                       |
| -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| [`claimable-postgres`](https://skills.sh/neondatabase/agent-skills/claimable-postgres)                         | Instant temporary Postgres via [Claimable Postgres](/docs/reference/claimable-postgres) — no login or credit card |
| [`neon-postgres-branches`](https://skills.sh/neondatabase/agent-skills/neon-postgres-branches)                 | Choose and create the right branch type for migrations, schema-only branches, and reset-from-parent workflows     |
| [`neon-postgres-egress-optimizer`](https://skills.sh/neondatabase/agent-skills/neon-postgres-egress-optimizer) | Diagnose and fix excessive Postgres egress and query overfetching                                                 |

### Neon Platform

Use Neon services beyond core Postgres. **Functions**, **Object Storage**, and **AI Gateway** are in private preview. See [Who has access](/docs/get-started/platform-private-preview#who-has-access) before using these skills in production workflows.

| Skill                                                                                    | Description                                                                                                     | Docs                                               |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| [`neon-functions`](https://skills.sh/neondatabase/agent-skills/neon-functions)           | Long-running serverless Node.js HTTP functions on your branch, with `DATABASE_URL` injected automatically       | [Neon Functions](/docs/compute/functions/overview) |
| [`neon-object-storage`](https://skills.sh/neondatabase/agent-skills/neon-object-storage) | S3-compatible object storage that branches with your project                                                    | [Object Storage](/docs/storage/overview)           |
| [`neon-ai-gateway`](https://skills.sh/neondatabase/agent-skills/neon-ai-gateway)         | One API and credential for frontier and open-source LLMs; compatible with OpenAI, Anthropic, and Vercel AI SDKs | [AI Gateway](/docs/ai-gateway/overview)            |

### Agent platforms

For codegen tools and multi-tenant products that provision Neon for their users, see the companion skill in [neondatabase/neon-for-agent-platforms](https://github.com/neondatabase/neon-for-agent-platforms) (`neon-postgres-agent-platforms` on [skills.sh](https://skills.sh/neondatabase/neon-for-agent-platforms/neon-postgres-agent-platforms)).

## Project-level vs. global install

Skills can be installed at two levels:

- **Project level** (default): Skills are installed in your project directory, for example via `neon init` or `npx skills add`. Your AI assistant picks them up when working in that project. This is best for team workflows since the configuration can be committed with the project.
- **Global**: Skills are installed at the user or system level and available across all projects. Useful for personal development environments where you want Neon context everywhere. Pass the `-g` flag to install globally:

  ```bash
  npx skills add neondatabase/agent-skills -y -g
  ```

## What's covered

With the full skill set installed, your assistant can guide you across the Neon platform:

**Postgres and platform basics (`neon`, `neon-postgres`)**

- **Getting started** with Neon, including project setup and key features (branching, autoscaling, scale-to-zero, instant restore, read replicas)
- **Connections**, including the serverless driver, connection pooling, and connection strings
- **Authentication** with Neon Auth
- **Data API** via `@neondatabase/neon-js`
- **Platform APIs and SDKs**, including the REST API, TypeScript SDK, and Python SDK
- **Developer tools**, including the CLI, VS Code extension, and MCP server

**Database workflows**

- **Disposable databases** via Claimable Postgres for agents and tests
- **Branch types and workflows** for migrations, schema-only branches, and reset-from-parent
- **Egress optimization** for high transfer costs and query anti-patterns

**Platform services (private preview)**

- **Neon Functions**: declare, deploy, and connect long-running compute next to your database
- **Object Storage**: S3-compatible storage that branches with your data
- **AI Gateway**: model routing, logging, and cost controls with a single Neon credential

For example, ask your assistant to "set up Neon Auth in my Next.js app" and it will provide the correct imports, configuration, and middleware setup. Or ask it to "add an AI Gateway route in my `neon.ts` file" and it will follow platform preview constraints and the right SDK patterns.

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
Set up Neon Auth for my Next.js app
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
