---
title: 'Is MCP good yet?'
subtitle: The stateless 2026-07-28 spec is the biggest step MCP has taken, and mcp.neon.tech now speaks it
description: >-
  MCP's 2026-07-28 spec makes the protocol stateless. mcp.neon.tech now supports it and has retired the old HTTP+SSE transport. Here's what changed, which clients support it and what to do if you still use /sse.
date: '2026-11-04T09:00:00'
updatedOn: '2026-11-04T09:00:00'
category: product
categories:
  - product
authors:
  - andre-landgraf
cover:
  image: 'https://cdn.neonapi.io/public/images/pages/blog/is-mcp-good-yet/cover.png'
  alt: 'Neon blog cover with the headline Is MCP good yet?'
isFeatured: false
seo:
  title: 'Is MCP good yet? - Neon'
  description: >-
    MCP's 2026-07-28 spec makes the protocol stateless. mcp.neon.tech now supports it and has retired the old HTTP+SSE transport.
  keywords: []
  noindex: false
  ogTitle: 'Is MCP good yet? - Neon'
  ogDescription: >-
    MCP's 2026-07-28 spec makes the protocol stateless. mcp.neon.tech now supports it and has retired the old HTTP+SSE transport.
  image: 'https://cdn.neonapi.io/public/images/pages/blog/is-mcp-good-yet/social.png'
---

![Neon blog cover with the headline Is MCP good yet?](https://cdn.neonapi.io/public/images/pages/blog/is-mcp-good-yet/cover.png)

The [Neon MCP server](https://neon.com/docs/ai/neon-mcp-server) has about twice as many daily active users as the [Neon CLI](https://neon.com/docs/cli). Between the first week of August and the last week of October, MCP tool calls grew 4.6x while CLI commands grew 2.7x. Daily active users roughly tripled on both.

![Line chart of weekly Neon MCP tool calls, Neon CLI commands, MCP daily active users and CLI daily active users from the week of August 3 to the week of October 26, 2026, each indexed to 100 in the first week. MCP tool calls end at 461, CLI commands at 266, MCP daily active users at 303 and CLI daily active users at 295.](https://cdn.neonapi.io/public/images/pages/blog/is-mcp-good-yet/mcp-vs-cli-growth.png)

I think the gap comes down to discoverability. A harness puts the tools of every connected MCP server in front of the model, while a CLI only gets used if the model remembers it exists and decides to shell out to it. When someone has both installed, the agent tends to reach for the MCP server.

Agent plugins push this further. [`neon plugins`](https://neon.com/docs/cli/plugins) installs a Neon plugin into Cursor, Claude Code and Codex that bundles the MCP server with our agent skills, and ChatGPT and Claude Desktop connect to Neon through the MCP server. In October, ChatGPT (24%) and Claude Desktop (22%) were the two biggest sources of tool calls on mcp.neon.tech, ahead of Codex (21%) and Claude Code (13%). Claude Desktop's tool calls grew almost 5x since August.

Just a quick disclaimer: we run a busy MCP server, so I'm biased. That said, a lot of the MCP vs. CLI debate is fair. The spec is barely two years old, and until this summer every remote MCP server had to keep sessions around. It's fair to ask whether MCP is good yet.

We track that question at [ismcpgoodyet.com](https://ismcpgoodyet.com), a scoreboard of which MCP features Codex, Cursor, Claude Code, Grok Build, OpenCode and Factory Droid support. Today it says no, at 64%. But it's moving, and the biggest move this year is the [2026-07-28 spec](https://blog.modelcontextprotocol.io/posts/2026-07-28/). Think of it as MCP 2.0: the maintainers call it the largest revision of the protocol since launch.

In this post, I want to walk through how MCP's transports got here, what the stateless spec changes, which clients support it and what we just changed on mcp.neon.tech.

## How MCP's transports got here

MCP has had three remote transport designs in two years. Here's the short version:

- **November 2024:** Anthropic open-sources MCP. Servers run locally over stdio or remotely over HTTP+SSE, a long-lived Server-Sent Events stream for server messages plus a separate endpoint for client POSTs.
- **March 26, 2025:** [Spec 2025-03-26](https://modelcontextprotocol.io/specification/2025-03-26/changelog) replaces HTTP+SSE with Streamable HTTP. Every message is a POST to one endpoint and sessions live in an `Mcp-Session-Id` header.
- **April 4, 2025:** We [launch the remote Neon MCP server](https://neon.com/blog/announcing-neons-remote-mcp-server) at mcp.neon.tech, on SSE.
- **December 19, 2025:** The Transport Working Group [publishes its plan](https://blog.modelcontextprotocol.io/posts/2025-12-19-mcp-transport-future/) for a stateless protocol, because sticky sessions and shared session stores made remote servers hard to scale.
- **May 21, 2026:** The [release candidate](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/) for 2026-07-28 ships.
- **July 28, 2026:** The final spec ships, and HTTP+SSE is officially deprecated with a year-long offramp.
- **November 2, 2026:** mcp.neon.tech speaks 2026-07-28 and retires HTTP+SSE.

Funny enough, we launched our remote server on SSE nine days after the spec had already replaced it. It took us a while to clean that up.

## What stateless means in 2026-07-28

The 2026-07-28 spec drops the `initialize` handshake and the `Mcp-Session-Id` header. Each request carries its own protocol version, client info and client capabilities in `_meta`, so any request can land on any server instance behind a plain round-robin load balancer.

Here's a `tools/list` request against mcp.neon.tech's anonymous docs endpoint:

```bash
curl 'https://mcp.neon.tech/mcp?category=docs' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -H 'MCP-Protocol-Version: 2026-07-28' \
  -H 'Mcp-Method: tools/list' \
  --data '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list",
    "params": {
      "_meta": {
        "io.modelcontextprotocol/protocolVersion": "2026-07-28",
        "io.modelcontextprotocol/clientInfo": { "name": "example-client", "version": "1.0.0" },
        "io.modelcontextprotocol/clientCapabilities": {}
      }
    }
  }'
```

It returns `search_docs`, `get_doc` and `send_feedback`, and no session id. The rest of the spec follows from the same idea:

- **Header routing:** Requests carry `Mcp-Method` and `Mcp-Name` headers, so a gateway or rate limiter can route on headers without parsing JSON bodies.
- **Multi round-trip requests:** When a tool needs user input mid-call, the server returns `input_required` and the client retries the call with the answers. Elicitation no longer needs a held-open stream.
- **Cacheable lists:** `tools/list` and friends return `ttlMs` and `cacheScope`, so clients can cache tool catalogs and keep prompt caches stable.
- **Auth hardening:** Clients validate the `iss` parameter (RFC 9207), and Dynamic Client Registration is deprecated in favor of Client ID Metadata Documents.
- **Deprecation policy:** Deprecated features keep working for at least twelve months. HTTP+SSE, Roots, Sampling and Logging are on that clock now.

Your app can still be stateful. The spec's suggestion is to mint a handle from a tool, say a `basket_id`, and let the model pass it back as an argument. I like that pattern because the model can see the state it's threading through.

## Is Streamable HTTP going away?

Streamable HTTP is staying. It's still one of the two standard transports, next to stdio, and the [Transport Working Group](https://blog.modelcontextprotocol.io/posts/2025-12-19-mcp-transport-future/) committed to keeping it that way so every client and server can interoperate.

What changed is what travels over it. Each POST now stands alone, and the [reply arrives as a JSON object or a request-scoped SSE stream](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports). SSE survives as a way to stream a single response. What's gone are the long-lived parts: the session id and the separate GET stream for server-initiated messages, replaced by multi round-trip requests and an opt-in `subscriptions/listen` stream.

The transport on its way out is the original 2024 HTTP+SSE design. The offramp runs until roughly July 2027, so servers could keep it around a while longer. We decided not to.

## Which clients speak 2026-07-28 today

Claude Code is the only client on the [ismcpgoodyet.com](https://ismcpgoodyet.com) scoreboard that negotiates 2026-07-28 by default. Codex and OpenCode support it behind an opt-in, and the rest still use the 2025 handshake:

| Client        | 2026-07-28 support                                                        |
| ------------- | ------------------------------------------------------------------------- |
| Claude Code   | Default for HTTP servers since 2.1.274, stdio since 2.1.292               |
| Codex         | Opt-in with `mcp_2026_07_28`; the default is still 2025-06-18             |
| OpenCode 2.2  | Per-server `protocol` setting: `legacy` (default), `auto` or `2026-07-28` |
| Cursor        | No public support yet                                                     |
| Grok Build    | Pinned to 2025-11-25                                                      |
| Factory Droid | Behind a server-side flag that is off                                     |

That's why a server can't just switch over. It has to answer stateless requests and still accept the `initialize` handshake from every client that hasn't moved yet.

## What we changed on mcp.neon.tech

mcp.neon.tech now speaks MCP 2026-07-28 on `https://mcp.neon.tech/mcp`, keeps serving 2025-era clients on the same URL and retires the old HTTP+SSE endpoints. Concretely:

- **Same URL, both generations:** The server moved to `@modelcontextprotocol/server` 2.0 and [`mcp-handler`](https://github.com/vercel/mcp-handler) 2.1. Clients that still send `initialize` keep working, and we test the 2025-03-26 and 2025-11-25 fallbacks.
- **No session store:** HTTP+SSE needed Redis to bind sessions to server instances. That code is gone, and authentication, tool grants and client attribution are resolved per request.
- **Cancellation reaches Neon:** Cancelling a tool call, or closing the request, aborts the Neon API call behind it.
- **Nothing to reconfigure on `/mcp`:** Existing OAuth tokens, API keys and grant URLs like `/mcp?projectId=<project-id>&readonly=true` mean what they meant before.

`/sse`, `/message`, `/api/sse` and `/api/message` now return `410 Gone` with a pointer to the new URL:

```json
{
  "error": "transport_gone",
  "message": "HTTP+SSE was removed. Connect to https://mcp.neon.tech/mcp using Streamable HTTP. Stdio-only clients can bridge it with `npx -y mcp-remote https://mcp.neon.tech/mcp`. See https://neon.com/docs/ai/neon-mcp-server#retired-sse."
}
```

The source is on [GitHub](https://github.com/neondatabase/mcp-server-neon), and [neondatabase/mcp-server-neon#320](https://github.com/neondatabase/mcp-server-neon/pull/320) has the full change.

## Still pointing at /sse?

If your MCP config still has `https://mcp.neon.tech/sse`, swap it for `https://mcp.neon.tech/mcp`. [add-mcp](https://github.com/neondatabase/add-mcp) can do that for every agent on your machine:

```bash
npx add-mcp https://mcp.neon.tech/mcp --name Neon -g
```

**Note:** `--name` has to match the name of your existing entry (`Neon` in our old setup instructions). With a different name, add-mcp adds a second server next to the old one. Drop `-g` to update a project-level config instead.

If your client only supports local stdio servers, bridge to Streamable HTTP with [`mcp-remote`](https://www.npmjs.com/package/mcp-remote):

```json
{
  "mcpServers": {
    "Neon": {
      "command": "npx",
      "args": ["-y", "mcp-remote@latest", "https://mcp.neon.tech/mcp"]
    }
  }
}
```

## New to the Neon MCP server?

One command adds the Neon MCP server to every agent add-mcp detects on your machine:

```bash
npx add-mcp https://mcp.neon.tech/mcp -g
```

Your agent opens a browser window to sign in with OAuth on first use. If you also want our agent skills and a linked Neon project, run `npx neon@latest init` instead. For API keys, read-only mode or scoping the server to one project, use the [config generator](https://neon.com/docs/ai/neon-mcp-server#config-generator) in our docs.

## So, is MCP good yet?

Not quite. Our own scoreboard says 64%, and only one of six clients speaks the new spec by default. But the stateless spec fixes the part of MCP that hurt server authors most, and every client that adopts it moves the number up. Keep an eye on [ismcpgoodyet.com](https://ismcpgoodyet.com); we update it as clients ship.

Happy coding!
