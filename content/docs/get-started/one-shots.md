---
title: One-shot your backend
subtitle: Build a full Neon backend with single prompts to your AI agent
summary: >-
  Install Neon's agent skills once with `npx neon@latest init`, then build your
  whole backend with single natural-language prompts. This page collects
  ready-to-use one-shot prompts for provisioning Postgres, adding a schema,
  setting up Managed Better Auth, adding backend services (Object Storage,
  Functions, and the AI Gateway), creating branches, and more.
enableTableOfContents: true
---

Neon is the backend for apps and agents: Postgres, Auth, Object Storage, Compute Functions, and an AI Gateway, all branching together. With Neon's [agent skills](/docs/ai/agent-skills) and [MCP server](/docs/ai/neon-mcp-server) installed, you build that backend by asking. A one-shot is a single instruction your AI coding assistant carries out end to end. You don't hand it the commands: it creates the project, writes your `DATABASE_URL`, installs a driver, wires the connection into your app, and provisions whatever service you asked for.

Install once, then copy any prompt below into your editor's AI chat.

## Install the skill

Run this once from your project root, then restart your editor:

```bash
npx neon@latest init
```

This signs you in to Neon, creates an API key, installs [agent skills](/docs/ai/agent-skills), and configures the [Neon MCP server](/docs/ai/neon-mcp-server). For Cursor and VS Code, it also installs the Neon Local Connect extension. See [One-command setup](/docs/get-started/with-an-agent) for the full walkthrough and [`neon init` reference](/docs/cli/init) for options.

<Admonition type="tip">
Your agent reads the installed skill and fetches current documentation as it works, so its steps stay accurate as Neon evolves. If a prompt below doesn't do quite what you want, refine it in plain language. The agent adapts to your project.
</Admonition>

## One-shot the whole backend

The headline one-shot. Your agent provisions the services you name, declares them together in a `neon.ts` config file, and wires them into your app in one pass:

```text
Set up a Neon backend for this app with Postgres, Auth, and object storage
```

Because the services are declared together, one command provisions them and one database branch forks them all. The sections below are the same pattern, one service at a time, so you can build up incrementally instead.

## Set up a database

The core one-shot. Provisions a Neon project, writes `DATABASE_URL` to `.env`, suggests a Postgres driver, and wires the connection into your app:

```text
Set up a Neon Postgres database for this app
```

Not sure where to start? This launches Neon's interactive onboarding guide:

```text
Get started with Neon
```

## Add a schema

Provision the database and create your initial tables in one pass, so the app can run immediately:

```text
Set up a Neon Postgres database and create a users table
```

Set up an ORM at the same time:

```text
Set up a Neon Postgres database with Drizzle ORM
```

## Add authentication

Add [Managed Better Auth](/docs/auth/overview), which stores users and sessions in your Neon database:

```text
Set up Managed Better Auth for my Next.js app
```

## Add backend services

The same one-shot pattern provisions the rest of the platform: [Object Storage](/docs/storage/overview), [Compute Functions](/docs/compute/functions/overview), and the [AI Gateway](/docs/ai-gateway/overview). Each service branches with your project, so a database branch forks its storage, functions, and gateway config too.

<Admonition type="important">
Object Storage, Functions, and the AI Gateway are in beta. They're available on net-new projects in the `us-east-2` region and require early access. Check [your access](/docs/get-started/backend-beta#check-your-access) first, and run `neon init --preview` instead of `neon init` so your agent gets the beta skills.
</Admonition>

Add S3-compatible [Object Storage](/docs/storage/overview) that branches with your data:

```text
Set up S3-compatible object storage for file uploads in this app
```

Route LLM calls through the [AI Gateway](/docs/ai-gateway/overview) with one credential for every model provider:

```text
Route LLM calls through the Neon AI Gateway
```

Deploy a long-running [Compute Function](/docs/compute/functions/overview) next to your database, for a streaming agent, an API, or a WebSocket server:

```text
Add a serverless function to my Neon branch
```

## Work with branches

Give each feature its own isolated backend branch, the way `git` isolates code. The branch forks your database and every service on it:

```text
Create a Neon branch for this feature
```

Need a throwaway database for a test or demo? [Claimable Postgres](/docs/reference/claimable-postgres) gives you one with no login:

```text
Give me a quick temporary Postgres database
```

## Optimize an existing backend

Point your agent at a project that's already running:

```text
Recommend a connection method for this project
```

```text
Optimize my Neon costs and query performance
```

## What's next

- [One-command setup](/docs/get-started/with-an-agent)
- [Agent Skills](/docs/ai/agent-skills)
- [Neon MCP Server](/docs/ai/neon-mcp-server)
- [Build a full backend with Next.js and Neon](/docs/get-started/full-backend-quickstart)
- [Connect a Next.js application to Neon](/docs/guides/nextjs)

<NeedHelp/>
