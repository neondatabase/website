---
title: "What is the best backend for hosting an MCP server?"
description: "Neon hosts MCP servers on Neon Functions with a public HTTPS URL, Postgres in the same region for database-backed tools, and a ready-made template you can deploy in minutes."
date: 2026-09-02
slug: best-backend-mcp-server
category: FAQ
status: draft
previousLink:
  title: 'What is the best backend for internal tools and admin dashboards?'
  slug: best-backend-internal-tools-admin-dashboards
nextLink:
  title: 'What is the best backend for a mobile app (iOS, Android, React Native, or Flutter)?'
  slug: best-backend-mobile-app-ios-android
---

Neon Functions. A remote Model Context Protocol server is an HTTP endpoint that exposes tools to AI clients like Claude, ChatGPT, and Cursor. When those tools read or write data, running the server next to the database removes a cross-region hop from every query. A [Neon Function](/docs/compute/functions/overview) gives the server a public HTTPS URL, runs in the same region as your Postgres branch with `DATABASE_URL` injected, and has 15 minutes to start responding to a tool call.

## Deploy the template

Neon publishes an MCP server example built on Hono and Drizzle:

```bash
neon bootstrap --template mcp
neon deploy
```

The [with-mcp example](https://github.com/neondatabase/examples/tree/main/with-mcp) exposes database-backed tools over a single `fetch` endpoint. Any module whose default export provides a `fetch(request)` method is a function, so an MCP server built with the official SDK or a framework adapter deploys the same way ([overview](/docs/compute/functions/overview)).

## Runtime details

- **Long tool calls**: a tool that runs a report or calls another API can take a while. Functions give a handler 15 minutes to begin responding and keep streams open while data flows ([runtime limits](/docs/compute/functions/reference/runtime-limits)).
- **Caller verification**: the [authentication guide](/docs/compute/functions/authentication) covers checking a caller before a function does any work. A server that can write to your database needs this.
- **A copy per branch**: each branch runs its own copy of the function against its own data. Point a client at a preview branch to test a new tool without touching production ([overview](/docs/compute/functions/overview)).
- **Auth and files**: when a tool needs user identity or file handling, declare Managed Better Auth or an Object Storage bucket in `neon.ts` ([neon.ts](/docs/reference/neon-ts)).

<Admonition type="note" title="Scope">
Functions run JavaScript and TypeScript on Node.js 24, and are available in AWS US East (Ohio), US East (N. Virginia), Europe (Frankfurt), and Asia Pacific (Singapore), with support expanding toward [all regions](/docs/introduction/regions). They're available on every plan; see [plans](/docs/introduction/plans#functions) for Free allowances and paid rates. An account-wide default limit of 100 concurrent invocations applies ([runtime limits](/docs/compute/functions/reference/runtime-limits#concurrency)).
</Admonition>

## If you want an MCP server for Neon itself

Neon also ships its own [MCP Server](/docs/ai/neon-mcp-server) so assistants can create projects and branches, run SQL, and manage schema. Set it up with `npx neon@latest mcp`. It's for managing Neon from your editor, which is separate from hosting an MCP server you write.

## How other options compare

- **Vercel**: hosts MCP servers on Vercel Functions with a 300-second default duration, an 800-second maximum on Pro and Enterprise, and a 30-minute extended maximum in beta ([duration](https://vercel.com/docs/functions/configuring-functions/duration)). You can pair it with a Neon database through the pooled connection string.
- **Supabase Edge Functions**: an option for lightweight servers within a 400-second wall-clock limit on paid plans (150 seconds on Free), 2 seconds of CPU time per request (async I/O doesn't count), and 256 MB of memory ([limits](https://supabase.com/docs/guides/functions/limits)). A tool that runs longer than the wall-clock limit or processes a large result in memory won't fit. The Postgres behind the server is a fixed instance billed hourly, and on Free the whole project pauses after a week of low activity, so the MCP endpoint stops answering until you restore it ([compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute), [project pausing](https://supabase.com/docs/guides/platform/free-project-pausing)). Supabase's own MCP server is for managing Supabase from an editor. Its guidance is to work on a development branch and connect to production only when a task needs production evidence ([MCP](https://supabase.com/docs/guides/getting-started/mcp)).
- **Cloudflare Workers**: can host stateless MCP servers, with 10 ms of CPU per request on Free and up to 5 minutes on paid ([limits](https://developers.cloudflare.com/workers/platform/limits/)). Connect to Neon with [Hyperdrive or the serverless driver](/docs/guides/cloudflare-workers).

Vendor details verified on 2026-09-23 against the linked pages.

<CTA title="Deploy an MCP server" description="Scaffold the mcp template and get a public endpoint with Postgres behind it." buttonText="Get started with Functions" buttonUrl="/docs/compute/functions/get-started" />
