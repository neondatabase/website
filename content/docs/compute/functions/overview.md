---
title: Neon Functions
subtitle: Deploy a backend onto your Neon branch, next to your data.
summary: >-
  Neon Functions are serverless compute you deploy onto a Neon branch. Host an
  API, AI agent, real-time server, or webhook handler that runs next to your
  Postgres data, with DATABASE_URL injected automatically.
enableTableOfContents: true
redirectFrom:
  - /docs/compute/functions/preview-access
updatedOn: '2026-07-15T19:50:24.946Z'
---

Neon Functions are serverless compute you deploy onto a Neon branch, so your backend code runs right next to your database. Use them to host an API, an AI agent, a real-time server, or a webhook handler without standing up separate infrastructure.

What makes Neon Functions different from lambda-style serverless?

- **Next to your data.** Same region as the branch, with `DATABASE_URL` (plus [AI Gateway](/docs/ai-gateway/overview) and [Object Storage](/docs/storage/overview) credentials) injected automatically. No cross-region hops, and no credentials to wire up.
- **Long-running.** Start responding within 15 minutes, then keep streaming while data flows, so agents and WebSocket/SSE servers aren't cut off by a short execution limit. They're still serverless: idle functions can be evicted (see [Runtime limits](/docs/compute/functions/reference/runtime-limits)).
- **Branches with your data.** Each branch runs its own function at its own URL against its own database state.

Functions run on Neon's own compute platform, the same infrastructure that runs your Postgres, so they sit in the same region as your data.

> Functions are in beta and available only in **AWS US East (Ohio) (`aws-us-east-2`)**, so create your project there to use them. Functions are free to use during beta, subject to usage limits, on any plan.

<Admonition type="important" title="JavaScript and TypeScript only">
Neon Functions currently run JavaScript or TypeScript on the Node.js runtime. Deploy JS/TS handlers, or code that bundles to JS for Node.js 24. Other runtimes and language targets aren't supported during beta.
</Admonition>

## Request/response, not background jobs

A function is always requested (by a `fetch`, a browser, an agent) and always returns a web response: JSON, an HTTP stream, an SSE feed, or a WebSocket upgrade.

That makes functions a fit for request/response work, and not for background jobs. Background jobs and workflows are the other kind of compute: queued, retryable, cancellable work with its own lifecycle, like sending a welcome email after signup. Those need a job queue or workflow engine to own that lifecycle. Today you can pair a function with a third-party queue or scheduler like [Upstash QStash](https://upstash.com/docs/qstash) or [Inngest](https://www.inngest.com): the service owns the queue, retries, and scheduling, and invokes your function over HTTP to run each job. A native Neon job queue and workflow engine is a separate, upcoming offering.

Any module whose default export provides a `fetch(request)` method that returns a `Response` is a function. It embraces the web platform standards: the Fetch API's `Request` and `Response` interface, the same handler shape used by other serverless runtimes and standardized by [WinterTC](https://wintertc.org/). That can be an object with a `fetch` method:

```ts
export default {
  fetch: (request: Request) => new Response('Hello world'),
};
```

Or a bare async function:

```ts
export default async function handler(request: Request) {
  return new Response('Hello world');
}
```

A [Hono](https://hono.dev) app exports the object shape, so `export default app` works directly. Hono is the recommended framework.

## When to use Neon Functions

- **REST APIs and CRUD backends**: request in, JSON out, queries running next to Postgres. See [Quickstart](/docs/compute/functions/get-started).
- **AI agents**: stream tokens back across multiple model calls and tool invocations without a short execution limit cutting the run off. See [AI agents](/docs/compute/functions/agents).
- **Real-time apps**: WebSocket servers for chat and presence, or SSE for live updates. See [WebSockets and SSE](/docs/compute/functions/websockets).
- **MCP servers**: expose database-backed tools to AI clients over a single `fetch` endpoint. See the [with-mcp example](https://github.com/neondatabase/examples/tree/main/with-mcp).
- **File upload APIs**: receive a file, write it to [Object Storage](/docs/storage/overview), return a result.
- **Webhook handlers and bots**: receive events and query Postgres in the same region.

## How Functions fit with your app

Functions are backend primitives, not full-stack app hosting. Host your app on Vercel, Netlify, or another frontend host; reach for a function for the long-running, stateful slice of your backend that belongs next to your data. Two common shapes:

- **Add a function to a full-stack app.** Your Next.js or TanStack Start app owns the UI, auth, and most routes. When one workload outgrows the host's short serverless limit (a WebSocket or SSE server, or a long-running agent), move only that piece onto a function and call it directly from the client. See [Authentication](/docs/compute/functions/authentication) for the direct-call pattern.
- **Run the backend on functions.** When the frontend is client-only (a React or TanStack SPA), the client calls functions directly: REST APIs, request/response agents, MCP servers, and anything stateful that belongs close to Postgres and Object Storage.

## Quickstart

<DetailIconCards>

<a href="/docs/compute/functions/get-started" description="Deploy your first function and call it over HTTP in under 5 minutes." icon="code">Quickstart</a>

<a href="/docs/compute/functions/agents" description="Run streaming, tool-calling AI agents next to your data." icon="openai">AI agents</a>

<a href="/docs/compute/functions/websockets" description="Hold long-lived connections open with WebSockets or SSE." icon="globe">WebSockets and SSE</a>

<a href="/docs/compute/functions/authentication" description="Verify callers before a function does any work." icon="lock-landscape">Authentication</a>

<a href="/docs/compute/functions/environment-variables" description="Neon-injected variables and how to add your own secrets." icon="gear">Environment variables</a>

<a href="/docs/compute/functions/deploy" description="CLI and API reference for deploying and managing functions." icon="cli">Deploy and manage</a>

<a href="/docs/compute/functions/logs" description="View, search, and download a function's logs in the Console." icon="search">Logs</a>

<a href="/docs/compute/functions/reference/runtime-limits" description="Timeouts, slug constraints, memory, and other hard limits." icon="sparkle">Runtime limits</a>

</DetailIconCards>

## Starter templates

Each example is a complete, runnable build. Read the source on GitHub, or scaffold one with `neon bootstrap --template <id>` (it copies the files, links a Neon project, and pulls env vars). You can also browse them at [build-on-neon.vercel.app](https://build-on-neon.vercel.app/).

| Example                  | `--template`        | Source                                                                                              | Neon services                                   | Stack                 |
| ------------------------ | ------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------- | --------------------- |
| REST API                 | `hono`              | [with-hono](https://github.com/neondatabase/examples/tree/main/with-hono)                           | Functions, Postgres                             | Hono, Drizzle         |
| Image-generation agent   | `ai-sdk`            | [with-ai-sdk](https://github.com/neondatabase/examples/tree/main/with-ai-sdk)                       | Functions, Postgres, AI Gateway, Object Storage | AI SDK, Drizzle       |
| Personal-assistant agent | `mastra`            | [with-mastra](https://github.com/neondatabase/examples/tree/main/with-mastra)                       | Functions, Postgres, AI Gateway                 | Mastra                |
| MCP server               | `mcp`               | [with-mcp](https://github.com/neondatabase/examples/tree/main/with-mcp)                             | Functions, Postgres                             | Hono, Drizzle         |
| Realtime chat            | `realtime-chat`     | [with-realtime-chat](https://github.com/neondatabase/examples/tree/main/with-realtime-chat)         | Functions, Postgres, Managed Better Auth        | Next.js, Hono         |
| Realtime counter         | `realtime-sse`      | [with-realtime-sse](https://github.com/neondatabase/examples/tree/main/with-realtime-sse)           | Functions, Postgres                             | TanStack Router, Hono |
| Discord bot              | `discord-bot-http`  | [bots/discord-bot-http](https://github.com/neondatabase/examples/tree/main/bots/discord-bot-http)   | Functions, Postgres                             | Drizzle               |
| Telegram bot             | `telegram-bot-http` | [bots/telegram-bot-http](https://github.com/neondatabase/examples/tree/main/bots/telegram-bot-http) | Functions, Postgres                             | Drizzle               |
| WhatsApp bot             | `whatsapp-bot-http` | [bots/whatsapp-bot-http](https://github.com/neondatabase/examples/tree/main/bots/whatsapp-bot-http) | Functions, Postgres                             | Drizzle               |

<NeedHelp/>
