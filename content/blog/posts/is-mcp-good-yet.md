---
title: 'Is MCP good yet?'
subtitle: We added support for the stateless 2026-07-28 spec to the Neon MCP server and finally retired our old SSE endpoints
description: >-
  We added support for MCP's stateless 2026-07-28 spec to the Neon MCP server and retired our old HTTP+SSE endpoints. Here's what the new spec changes, which clients already support it and what to do if you still use /sse.
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
    We added support for MCP's stateless 2026-07-28 spec to the Neon MCP server and retired our old HTTP+SSE endpoints.
  keywords: []
  noindex: false
  ogTitle: 'Is MCP good yet? - Neon'
  ogDescription: >-
    We added support for MCP's stateless 2026-07-28 spec to the Neon MCP server and retired our old HTTP+SSE endpoints.
  image: 'https://cdn.neonapi.io/public/images/pages/blog/is-mcp-good-yet/social.png'
---

![Neon blog cover with the headline Is MCP good yet?](https://cdn.neonapi.io/public/images/pages/blog/is-mcp-good-yet/cover.png)

This week, we added support for the new stateless MCP spec (2026-07-28) to the [Neon MCP server](https://neon.com/docs/ai/neon-mcp-server) and finally retired our old Server-Sent Events (SSE) endpoints. I want to use that as an excuse to talk about where MCP is today, because our own numbers tell a pretty different story than the discussion online.

## MCP is outgrowing our CLI

If you've followed the CLI vs. MCP discussion online, you've probably noticed that it's been pretty down on MCP lately. Funny enough, our own agent skills are on the CLI side of that debate. Deploying a [Neon Function](https://neon.com/docs/compute/functions/overview) means bundling your code, zipping it up and uploading it. The [Neon CLI](https://neon.com/docs/cli) does all of that for you with `neon deploy`, while the MCP server's `deploy_function` tool only accepts a zip that's already built. That's why our skills tell agents to prefer the CLI over the MCP server. We also recommend that everyone using Neon with an agent installs our skills. (By the way, you can install them right now by running `npx neon@latest init` in your project repo 😉)

But even though our skills point agents at the CLI and the CLI can do more, agents keep picking the MCP server. Since August, the Neon MCP server has had about twice as many daily active users as the CLI. Between the first week of August and the last week of October, MCP tool calls grew 4.6x while CLI commands grew 2.7x. Daily active users roughly tripled on both, so it's mostly the volume of work agents do over MCP that's pulling ahead.

![Line chart of weekly Neon MCP tool calls, Neon CLI commands, MCP daily active users and CLI daily active users from the week of August 3 to the week of October 26, 2026, each indexed to 100 in the first week. MCP tool calls end at 461, CLI commands at 266, MCP daily active users at 303 and CLI daily active users at 295.](https://cdn.neonapi.io/public/images/pages/blog/is-mcp-good-yet/mcp-vs-cli-growth.png)

I think a lot of this comes down to discoverability. A harness puts the tools of every connected MCP server right in front of the model, while a CLI only gets used if the model remembers it exists and decides to shell out to it. So when someone has both installed, the agent tends to reach for the MCP server first.

Agent plugins push this even further. We ship a Neon plugin for Cursor, Claude Code and Codex (`npx neon@latest plugins`) that bundles the MCP server with our agent skills. ChatGPT and Claude Desktop connect to Neon through the MCP server, too. In fact, those last two are now our biggest clients: in October, ChatGPT made 24% of all tool calls on mcp.neon.tech and Claude Desktop 22%, ahead of Codex (21%) and Claude Code (13%). Claude Desktop's tool calls alone grew almost 5x since August.

Just a quick disclaimer: we run a pretty busy MCP server, so I'm biased. That said, a lot of the criticism of MCP is fair. The spec is barely two years old and until this summer every remote MCP server had to keep sessions around. So it's fair to ask whether MCP is good yet, and that's exactly the question we track at [ismcpgoodyet.com](https://ismcpgoodyet.com), a scoreboard of which MCP features Codex, Cursor, Claude Code, Grok Build, OpenCode and Factory Droid support.

Today, the scoreboard says no, at 64%. But it's moving and I'd argue the biggest step this year is the [2026-07-28 spec](https://blog.modelcontextprotocol.io/posts/2026-07-28/). You can think of it as MCP 2.0; the maintainers call it the largest revision of the protocol since launch. In this post, I want to walk you through how MCP's transports got here, what the new spec changes, which clients already support it and what we changed on our side.

## How we got here

MCP has gone through three designs for remote servers in just two years and we've been along for the ride since the early days.

- **November 2024:** Anthropic open-sources MCP. Servers run locally over stdio or remotely over HTTP+SSE, which uses a long-lived SSE stream for messages from the server and a separate endpoint for the client's POST requests.
- **March 26, 2025:** [Spec 2025-03-26](https://modelcontextprotocol.io/specification/2025-03-26/changelog) replaces HTTP+SSE with Streamable HTTP. Every message becomes a POST to a single endpoint and sessions live in an `Mcp-Session-Id` header.
- **April 4, 2025:** We [launch our remote MCP server](https://neon.com/blog/announcing-neons-remote-mcp-server) at mcp.neon.tech, on SSE.
- **December 19, 2025:** The Transport Working Group [publishes its plan](https://blog.modelcontextprotocol.io/posts/2025-12-19-mcp-transport-future/) for a stateless protocol, because sticky sessions and shared session stores were making remote servers hard to scale.
- **May 21, 2026:** The [release candidate](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/) for 2026-07-28 comes out.
- **July 28, 2026:** The final spec ships and officially deprecates HTTP+SSE, with a year-long offramp.
- **November 2, 2026:** We add 2026-07-28 support to mcp.neon.tech and retire our SSE endpoints.

Funny enough, we launched our remote server on SSE nine days after the spec had already replaced it. It took us a while to clean that up, but we got there.

## So what does stateless actually mean?

With the 2026-07-28 spec, the `initialize` handshake and the `Mcp-Session-Id` header are gone. Instead, every request carries its own protocol version, client info and client capabilities in `_meta`. That means any request can land on any server instance behind a plain round-robin load balancer, which is great news for anyone running an MCP server at scale (like us).

Here's what a `tools/list` request against our anonymous docs endpoint looks like now:

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

You get back `search_docs`, `get_doc` and `send_feedback` without a session id. You might have also noticed the `Mcp-Method` header. Requests now carry `Mcp-Method` and `Mcp-Name` headers, so a gateway or rate limiter can route requests without parsing the JSON body.

The rest of the spec follows the same idea. When a tool needs input from the user mid-call, the server now returns `input_required` and the client retries the call with the answers, so elicitation no longer needs a stream that stays open. List responses like `tools/list` carry `ttlMs` and `cacheScope`, so clients can cache tool catalogs. On the auth side, clients now validate the `iss` parameter (RFC 9207), and Dynamic Client Registration is deprecated in favor of Client ID Metadata Documents. And there's finally a formal deprecation policy: deprecated features keep working for at least twelve months, and HTTP+SSE, Roots, Sampling and Logging are on that clock now.

Of course, your app can still be stateful. The spec suggests minting a handle from a tool, say a `basket_id`, and letting the model pass it back as an argument on the next call. I personally like that pattern a lot, because the model can see the state it's carrying around.

## Is Streamable HTTP going away?

No, Streamable HTTP is staying. It's still one of the two standard transports next to stdio. The [Transport Working Group](https://blog.modelcontextprotocol.io/posts/2025-12-19-mcp-transport-future/) committed to keeping it that way so every client and server can keep talking to each other out of the box.

What changes is what travels over it. Each POST request now stands on its own and the [reply comes back as a JSON object or a request-scoped SSE stream](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports). So SSE is still around as a way to stream a single response. What's going away are the long-lived parts: the session id and the separate GET stream for messages from the server, which multi round-trip requests and an opt-in `subscriptions/listen` stream replace.

The transport that's actually on its way out is the original 2024 HTTP+SSE design. The offramp runs until roughly July 2027, so we could have kept our SSE endpoints around a while longer. We decided not to.

## Which clients already support it?

Not many yet. Claude Code is the only client on the [ismcpgoodyet.com](https://ismcpgoodyet.com) scoreboard that uses 2026-07-28 by default. Codex and OpenCode support it if you opt in and the rest still use the 2025 handshake:

| Client        | 2026-07-28 support                                                        |
| ------------- | ------------------------------------------------------------------------- |
| Claude Code   | Default for HTTP servers since 2.1.274, stdio since 2.1.292               |
| Codex         | Opt-in with `mcp_2026_07_28`; the default is still 2025-06-18             |
| OpenCode 2.2  | Per-server `protocol` setting: `legacy` (default), `auto` or `2026-07-28` |
| Cursor        | No public support yet                                                     |
| Grok Build    | Pinned to 2025-11-25                                                      |
| Factory Droid | Behind a server-side flag that is off                                     |

That's why we couldn't just switch over. Our server has to answer stateless requests and still accept the `initialize` handshake from every client that hasn't moved yet.

## What we changed on the Neon MCP server

We moved mcp.neon.tech to `@modelcontextprotocol/server` 2.0 and [`mcp-handler`](https://github.com/vercel/mcp-handler) 2.1, so we now serve 2026-07-28 on `https://mcp.neon.tech/mcp`. Clients that still send `initialize` keep working on the same URL, and we test the 2025-03-26 and 2025-11-25 fallbacks to make sure they stay that way. You don't need to change anything: your OAuth tokens, API keys and grant URLs like `/mcp?projectId=<project-id>&readonly=true` work exactly like before.

Going stateless also let us delete code. HTTP+SSE needed Redis to bind each session to a server instance and we removed all of that. We now resolve authentication, tool grants and client attribution on every request. And while we were at it, we made cancellation reach the Neon API: if you cancel a tool call or close the request, we abort the Neon API call behind it.

Finally, we retired our SSE endpoints. `/sse`, `/message`, `/api/sse` and `/api/message` now return `410 Gone` with a pointer to the new URL:

```json
{
  "error": "transport_gone",
  "message": "HTTP+SSE was removed. Connect to https://mcp.neon.tech/mcp using Streamable HTTP. Stdio-only clients can bridge it with `npx -y mcp-remote https://mcp.neon.tech/mcp`. See https://neon.com/docs/ai/neon-mcp-server#retired-sse."
}
```

The Neon MCP server is open source, so if you're curious, you can find the full change in [neondatabase/mcp-server-neon#320](https://github.com/neondatabase/mcp-server-neon/pull/320).

## Still using our SSE endpoint?

If your MCP config still points at `https://mcp.neon.tech/sse`, you'll need to swap it for `https://mcp.neon.tech/mcp`. We built [add-mcp](https://github.com/neondatabase/add-mcp) for exactly this kind of thing and it can update every agent on your machine in one go:

```bash
npx add-mcp https://mcp.neon.tech/mcp --name Neon -g
```

**Note:** `--name` has to match the name of your existing entry (`Neon` if you followed our old setup instructions). With a different name, add-mcp adds a second server next to the old one instead of replacing it. Drop `-g` if you want to update a project-level config instead.

If your client only supports local stdio servers, you can bridge to Streamable HTTP with [`mcp-remote`](https://www.npmjs.com/package/mcp-remote):

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

If you haven't tried the Neon MCP server yet, you can add it to every agent add-mcp detects on your machine with one command:

```bash
npx add-mcp https://mcp.neon.tech/mcp -g
```

On first use, your agent opens a browser window so you can sign in with OAuth. If you also want our agent skills and a linked Neon project, run `npx neon@latest init` instead. And if you want to use an API key, run the server in read-only mode or scope it to a single project, check out the [config generator](https://neon.com/docs/ai/neon-mcp-server#config-generator) in our docs.

## So, is MCP good yet?

Not quite, at least according to our own scoreboard: 64%, with only one of six clients using the new spec by default. But I think the stateless spec fixes the part of MCP that hurt server authors the most, and every client that adopts it moves that number up. We'll keep updating [ismcpgoodyet.com](https://ismcpgoodyet.com) as clients ship, so check back in a few months.

Happy coding!
