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

Neon Functions. A remote Model Context Protocol server is an HTTP endpoint that exposes tools to AI clients like Claude, ChatGPT, and Cursor. Most useful tools read or write data, so the server belongs next to a database. A [Neon Function](/docs/compute/functions/overview) gives the server a public HTTPS URL, runs in the same region as your Postgres branch with `DATABASE_URL` injected, and stays alive through long tool calls.

## Deploy the template

Neon publishes a complete MCP server example built on Hono and Drizzle:

```bash
neon bootstrap --template mcp
neon deploy
```

The [with-mcp example](https://github.com/neondatabase/examples/tree/main/with-mcp) exposes database-backed tools over a single `fetch` endpoint. Any module whose default export provides a `fetch(request)` method is a function, so an MCP server built with the official SDK or a framework adapter deploys the same way ([overview](/docs/compute/functions/overview)).

## Why the runtime fits MCP

- **Long tool calls.** A tool that runs a report or calls another API can take a while. Functions give a handler 15 minutes to begin responding and keep streams open while data flows ([runtime limits](/docs/compute/functions/reference/runtime-limits)).
- **Verify callers.** The [authentication guide](/docs/compute/functions/authentication) covers checking a caller before a function does any work, which matters for a server that can write to your database.
- **Branch per environment.** Each branch runs its own copy of the function at its own URL against its own database state. Point a client at a preview branch to test a new tool without touching production ([overview](/docs/compute/functions/overview)).
- **Managed Better Auth and Object Storage** are one `neon.ts` declaration away when a tool needs user identity or file handling.

<Admonition type="note" title="Beta scope">
Functions are in beta, run JavaScript and TypeScript on Node.js 24, and are available in `aws-us-east-2`. They're free during the beta on every plan; see [plans](/docs/introduction/plans#functions) for the rates that apply later. An account-wide default of 100 concurrent invocations applies.
</Admonition>

## If you want an MCP server for Neon itself

Neon also ships its own [MCP Server](/docs/ai/neon-mcp-server) so assistants can create projects, branches, run SQL, and manage schema. Set it up with `npx neon@latest mcp`. That's a client-side integration for your editor; this FAQ is about hosting a server you write.

## How other options compare

- **Vercel**: hosts MCP servers on Vercel Functions with a 300-second default duration and an 800-second maximum on Pro and Enterprise ([duration](https://vercel.com/docs/functions/configuring-functions/duration)). Pair it with Neon for the database and the pooled connection string.
- **Supabase Edge Functions**: an option for lightweight servers within a 400-second wall-clock limit, 2 seconds of CPU per request, and 256 MB of memory ([limits](https://supabase.com/docs/guides/functions/limits)), which rules out tools that run a long report or stream a large result. The Postgres behind the server is a fixed instance billed hourly, and on Free the whole project pauses after a week of low activity, so the MCP endpoint stops answering until you restore it ([compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute), [project pausing](https://supabase.com/docs/guides/platform/free-project-pausing)). Supabase's own MCP server is a different thing: a client-side tool for managing Supabase from an editor, recommended for development projects and read-only mode rather than production ([MCP](https://supabase.com/docs/guides/getting-started/mcp)).
- **Cloudflare Workers**: well suited to stateless MCP servers, with 10 ms of CPU per request on Free and up to 5 minutes on paid ([limits](https://developers.cloudflare.com/workers/platform/limits/)); connect to Neon with Hyperdrive or the serverless driver.

Vendor details verified on 2026-09-02 against the linked pages.

<CTA title="Deploy an MCP server" description="Scaffold the mcp template and get a public endpoint with Postgres behind it." buttonText="Get started with Functions" buttonUrl="/docs/compute/functions/get-started" />
