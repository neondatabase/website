---
title: Neon Functions
subtitle: Long-running Node.js compute, deployed on Neon.
summary: >-
  Neon Functions are long-running Node.js HTTP handlers deployed to Neon
  branches, with DATABASE_URL injected from the branch's Postgres database.
  Use them for AI agents, WebSocket servers, and webhook handlers that need
  compute next to their data.
enableTableOfContents: true
updatedOn: '2026-06-15T17:21:55.421Z'
---

<RequestForm type="backend-platform" />

Neon Functions give you long-running Node.js compute in the same AWS region as your database. Each function deploys to a Neon branch and gets a public HTTPS URL. If the branch has a Postgres database, `DATABASE_URL` is injected automatically. No configuration needed, no cross-region round trips.

During the private preview, Functions are available for **new projects** in the **AWS us-east-2** region only. See [Preview access](/docs/compute/functions/preview-access) for what's included.

Functions are branch-scoped. When you branch a project, the function branches with it: the child branch inherits the function as it was at the branch point, and runs it at its own URL against its own isolated database state. Deploying to the child doesn't affect the parent.

Functions use the Workers-style handler interface standardized by [WinterTC](https://wintertc.org/): a `fetch(request)` export that receives a standard `Request` and returns a `Response`. Hono is the recommended framework.

## When to use Neon Functions

- **AI agents**: hold connections open across multiple LLM calls and tool invocations, write results to Postgres
- **Discord bots and WebSocket servers**: maintain long-lived bidirectional connections without a dedicated server
- **Webhook handlers**: receive events and run multiple database queries without cross-region latency
- **Post-response work**: use `waitUntil` to run follow-up tasks after the response is sent, such as logging, analytics writes, or triggering additional model calls
- **Branch your backend**: each branch runs its own function version at its own URL, against its own isolated database state if the branch has one

## Get started

<DetailIconCards>

<a href="/docs/compute/functions/preview-access" description="Request access and learn what's included in the private preview." icon="screen">Preview access</a>

<a href="/docs/compute/functions/get-started" description="Deploy your first function and call it over HTTP in under 5 minutes." icon="code">Get started</a>

<a href="/docs/compute/functions/environment-variables" description="Neon-injected variables and how to add your own secrets." icon="gear">Environment variables</a>

<a href="/docs/compute/functions/deploy" description="CLI and API reference for deploying and managing functions." icon="cli">Deploy and manage</a>

<a href="/docs/compute/functions/reference/neon-ts" description="Configuration schema for functions and branch policy." icon="setup">neon.ts reference</a>

<a href="/docs/compute/functions/reference/runtime-limits" description="Timeouts, slug constraints, memory, and other hard limits." icon="sparkle">Runtime limits</a>

</DetailIconCards>

## Starter templates

Browse templates at [build-on-neon.vercel.app](https://build-on-neon.vercel.app/), or scaffold one directly with `neonctl bootstrap`:

```bash
neonctl bootstrap
```

Use `--template` to skip the interactive picker:

| Template        | What it builds                                                                         |
| --------------- | -------------------------------------------------------------------------------------- |
| `hono`          | REST API with Drizzle and Postgres on Neon Functions                                   |
| `ai-sdk`        | Image-generation agent with AI Gateway, Object Storage, and Postgres on Neon Functions |
| `mastra`        | Personal assistant with AI Gateway and Postgres-backed memory on Neon Functions        |
| `realtime-chat` | Realtime chat with Next.js, Neon Auth, and WebSockets on Neon Functions                |
| `realtime-sse`  | Realtime counter with TanStack Router and SSE on Neon Functions                        |

`neonctl bootstrap` scaffolds files, links to a Neon project, and pulls env vars. Then follow the README to set up and deploy.

<NeedHelp/>
