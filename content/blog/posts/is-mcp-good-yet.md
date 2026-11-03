---
title: 'Is MCP good yet?'
subtitle: Agents keep picking our MCP server. We share our MCP usage numbers, what the new stateless 2026-07-28 spec changes and why we finally retired our old SSE endpoints.
description: >-
  Agents keep picking our MCP server. We share our MCP usage numbers, what the new stateless 2026-07-28 spec changes and why we finally retired our old SSE endpoints.
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
    Agents keep picking our MCP server over our CLI. Here are our MCP usage numbers, what the stateless 2026-07-28 spec changes and why we retired SSE.
  keywords: []
  noindex: false
  ogTitle: 'Is MCP good yet? - Neon'
  ogDescription: >-
    Agents keep picking our MCP server over our CLI. Here are our MCP usage numbers, what the stateless 2026-07-28 spec changes and why we retired SSE.
  image: 'https://cdn.neonapi.io/public/images/pages/blog/is-mcp-good-yet/social.png'
---

![Neon blog cover with the headline Is MCP good yet?](https://cdn.neonapi.io/public/images/pages/blog/is-mcp-good-yet/cover.png)

This week, we added support for the new stateless [MCP spec (2026-07-28)](https://blog.modelcontextprotocol.io/posts/2026-07-28/) to the [Neon MCP server](https://neon.com/docs/ai/neon-mcp-server) and finally retired our old Server-Sent Events (SSE) endpoints. This seems like as good a time as any to share some of our MCP usage numbers and talk about where MCP is today and where it's heading.

## MCP is outgrowing our CLI

After all the CLI vs. MCP discourse online, lately folks have been sharing how fast their MCP servers are growing. [Zeno Rocha](https://x.com/zenorocha) shared that Resend went from [1 million MCP calls in August](https://x.com/zenorocha/status/2093355692484854138) to [3 million in September](https://x.com/zenorocha/status/2107501161913729527), [Max Stoiber](https://x.com/mxstbr) shared that [tool calls by ChatGPT users are up 98x in 2026](https://x.com/mxstbr/status/2094541583307678165) and [we shared ours, too](https://x.com/andrelandgraf/status/2093496335064568285)! It's been wild to see just how fast MCP usage is growing for us: since August, tool calls on the Neon MCP server grew about 14% week over week on average, with some weeks above 20%.

And that's even though we recommend the CLI over the MCP server in our own agent skills. The context here is that our CLI works together with [`neon.ts`](https://neon.com/docs/reference/neon-ts), our infra-as-code config, and it bundles, zips and deploys your [Neon Functions](https://neon.com/docs/compute/functions/overview) with `neon deploy`. The MCP server's `deploy_function` tool only accepts a zip that's already built. So our skills nudge agents toward `neon.ts` and the CLI to make sure function deployments happen properly.

However, agents are picking the MCP server anyway! In October, 28% of all function deploys came through the MCP server instead of the CLI, including 10% from ChatGPT alone. This means ChatGPT agents are writing `index.mjs` files, zipping them up (I'm honestly not sure how) and then calling our MCP server to deploy them. The future is weird.

And it's not just function deploys. Here's how our remote MCP server compares to the CLI (this doesn't include our deprecated stdio package):

| Growth from December 2025 to October 2026 | Neon MCP server | Neon CLI |
| ----------------------------------------- | --------------- | -------- |
| Tool calls / commands                     | 79x             | 21x      |
| Daily active users                        | 36x             | 25x      |

The MCP server overtook the CLI in daily active users last November and now has about twice as many. By August, it was also handling more tool calls than our CLI ran commands.

I think a lot of this comes down to discoverability. A harness puts the tools of every connected MCP server right in front of the model, while a CLI only gets used if the model remembers it exists or is instructed to do so via prompts, skills or `AGENTS.md` files. So when someone has both installed, the agent tends to reach for the MCP server first.

Agent plugins push this even further. We ship a Neon plugin for Cursor, Claude Code and Codex (`npx neon@latest plugins`) that bundles the MCP server with our agent skills. ChatGPT and Claude Desktop connect to Neon through the MCP server, too. In fact, those last two are now our biggest clients: in October, ChatGPT made 24% of all tool calls on mcp.neon.tech and Claude Desktop 22%, ahead of Codex (21%), Claude Code (13%) and Cursor (8%). Claude Desktop's tool calls alone grew almost 5x since August.

It's also fun to watch the share move whenever a new frontier model comes out:

![Line chart of the 7-day rolling share of tool calls on mcp.neon.tech from September 13 to November 1, 2026, for ChatGPT plus Codex, Claude Desktop plus Claude Code, Cursor and everyone else. ChatGPT plus Codex starts above 50% and Claude Desktop plus Claude Code around 30%. After Claude Opus 5.5 on September 22 the two lines cross, with Claude clients peaking near 44% around September 29. After GPT-6.1 Sol on September 29 they cross back, and from mid-October ChatGPT plus Codex holds around 46% and Claude clients around 34%. Cursor stays between 7% and 12%.](https://cdn.neonapi.io/public/images/pages/blog/is-mcp-good-yet/mcp-client-share.png)

So MCP is clearly winning, but is it good yet? Let's look at the timeline and where we're at today.

## How we got here

MCP has gone through three designs for remote servers in just two years and we've been along for the ride since the early days.

- **November 25, 2024:** Anthropic open-sources MCP. Servers run locally over stdio or remotely over HTTP+SSE, which uses a long-lived SSE stream for messages from the server and a separate endpoint for the client's POST requests.
- **December 3, 2024:** We [publish our first MCP server](https://neon.com/blog/let-claude-manage-your-neon-databases-our-mcp-server-is-here), [`@neondatabase/mcp-server-neon`](https://www.npmjs.com/package/@neondatabase/mcp-server-neon), as a local stdio server on npm, just eight days after MCP launched.
- **March 26, 2025:** [Spec 2025-03-26](https://modelcontextprotocol.io/specification/2025-03-26/changelog) replaces HTTP+SSE with Streamable HTTP. Every message becomes a POST to a single endpoint and sessions live in an `Mcp-Session-Id` header.
- **April 4, 2025:** We [launch our remote MCP server](https://neon.com/blog/announcing-neons-remote-mcp-server) at mcp.neon.tech, on SSE.
- **December 19, 2025:** The Transport Working Group [publishes its plan](https://blog.modelcontextprotocol.io/posts/2025-12-19-mcp-transport-future/) for a stateless protocol, because sticky sessions and shared session stores were making remote servers hard to scale.
- **February 16, 2026:** We [remove the local stdio server](https://github.com/neondatabase/mcp-server-neon/pull/198) from the repo and deprecate the npm package in favor of mcp.neon.tech.
- **May 21, 2026:** The [release candidate](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/) for 2026-07-28 comes out.
- **July 28, 2026:** The final spec ships and officially deprecates HTTP+SSE, with a year-long offramp.
- **November 2, 2026:** We add 2026-07-28 support to mcp.neon.tech and retire our SSE endpoints.

The MCP spec has come a long way and so has our own MCP offering. We were really early and have closely followed the latest developments across MCP, harness plugins and agent tooling ever since.

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

Of course, your app can still be stateful. The spec suggests minting a handle from a tool, say a `basket_id`, and letting the model pass it back as an argument on the next call. I personally like that pattern a lot, because the model can see the state it's carrying around.

## Why stateless is great news for serverless MCP servers

This is the part I'm most excited about. A lot of remote MCP servers run on serverless infra. A serverless function handles a request and the next request can land on a completely different instance. That's perfect for plain request/response, but it's a real problem for a protocol with sessions.

That's why it was common practice to pair a serverless MCP server with Redis to keep track of sessions. With HTTP+SSE, the stream stayed open on one function instance while the client's requests could land on any other, so Redis had to get those messages to the instance holding the stream. That's a lot easier to get wrong than plain request/response, and we fixed our share of session bugs over the months of maintaining the Neon MCP server.

With 2026-07-28, every request carries everything the server needs to answer it, so any instance can handle any request and there's nothing to share between them. In fact, retiring SSE already let us delete our Redis session store. Streamable HTTP lets a server skip session ids, so we answer 2025-era clients statelessly too. What the new spec adds is a stateless way to do the things that used to need a held-open stream, like asking the user for input in the middle of a tool call. Once every client is on 2026-07-28, those features work on any serverless function without any state on our side, and we can stop supporting the old `initialize` handshake altogether.

## Is Streamable HTTP going away?

No, Streamable HTTP is staying. It's still one of the two standard transports next to stdio. The [Transport Working Group](https://blog.modelcontextprotocol.io/posts/2025-12-19-mcp-transport-future/) committed to keeping it that way so every client and server can keep talking to each other out of the box.

What changes is what travels over it. Each POST request now stands on its own and the [reply comes back as a JSON object or a request-scoped SSE stream](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports). So SSE is still around as a way to stream a single response. What's going away are the long-lived parts: the session id and the separate GET stream for messages from the server, which multi round-trip requests and an opt-in `subscriptions/listen` stream replace.

The transport that's actually on its way out is the original 2024 HTTP+SSE design. The offramp runs until roughly July 2027, so we could have kept our SSE endpoints around a while longer. We decided not to.

## Which clients already support it?

Not many yet. Of the six coding agents I track, Claude Code is the only one that uses 2026-07-28 by default. Codex and OpenCode support it if you opt in and the rest still use the 2025 handshake:

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

The Neon MCP server now supports the 2026-07-28 spec on the same URL as before, `https://mcp.neon.tech/mcp`, and it still works with every client that hasn't moved to the new spec yet. You don't need to change anything: your OAuth sign-in, API keys and config keep working. The only thing we turned off is the old SSE endpoint.

Going stateless also meant deleting a lot of code. The change removed about 1,850 more lines than it added, including our 373-line session-binding module and the five test suites around SSE sessions. And I have to say, it felt amazing to take Redis out of the MCP request path. We still use it to coordinate OAuth token refreshes, but no MCP request depends on it anymore.

The Neon MCP server is open source, so if you're curious, you can find the full change in [neondatabase/mcp-server-neon#320](https://github.com/neondatabase/mcp-server-neon/pull/320).

## Still using our SSE endpoint?

If your MCP config still points at `https://mcp.neon.tech/sse`, you'll need to swap it for `https://mcp.neon.tech/mcp`. Update every agent on your machine by running [add-mcp](https://github.com/neondatabase/add-mcp):

```bash
npx add-mcp https://mcp.neon.tech/mcp --name Neon -g
```

**Note:** Set `--name` to the name of your existing Neon MCP server entry to override it. Drop `-g` to update a project-level config instead.

## New to the Neon MCP server?

If you haven't tried the Neon MCP server yet, you can add it to every agent add-mcp detects on your machine with one command:

```bash
npx add-mcp https://mcp.neon.tech/mcp -g
```

On first use, your agent opens a browser window so you can sign in with OAuth. If you also want our agent skills and a linked Neon project, run `npx neon@latest init` instead. And if you want to use an API key, run the server in read-only mode or scope it to a single project, check out the [config generator](https://neon.com/docs/ai/neon-mcp-server#config-generator) in our docs.

## Every product needs an MCP server

We strongly believe that every product will need an MCP server. People want their agents to work with the services they already use, and MCP is how agents find and call those services today, in ChatGPT and Claude Desktop just as much as in a coding agent.

If you're building on Neon, adding one is pretty easy. A [Neon Function](https://neon.com/docs/compute/functions/overview) can host an MCP server right next to your database, and with the new spec it doesn't need to keep any state between requests. To start a new project from our MCP starter, run:

```bash
npx neon@latest bootstrap --template mcp
```

Or, to add an MCP server backed by your Postgres database to an existing project:

```bash
npx neon@latest functions new mcp-postgres
```

Both use Hono and the MCP TypeScript SDK and come with create, list, update and delete tools over Lakebase Postgres, so you can swap in your own tables or wrap the REST API you already have. You can find the template and its source on our [function templates page](https://neon.com/functions/templates/mcp-postgres).

## So, is MCP good yet?

MCP is clearly winning and the spec keeps getting better. I'd personally say MCP is good once all the popular clients support MCP 2.0 (the 2026-07-28 spec), tool pagination and code mode! I'm tracking spec developments and client support on [ismcpgoodyet.com](https://ismcpgoodyet.com), so check there for more details.

Happy tool calling!
