---
title: 'Local or remote MCP server: which do I need?'
subtitle: "Build a local MCP server when the tools work on the user's own machine, like files, a local database, or a CLI, and only desktop apps need it. Build a remote one when other people should use your app from ChatGPT, Claude, or Cursor: it runs on a public HTTPS URL and signs each user in with OAuth."
createdAt: '2026-11-21T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'Is there an LLM gateway that charges provider prices and puts all model usage on one bill?'
  slug: llm-gateway-provider-prices-single-bill
nextLink:
  title: 'Should I use Managed Better Auth or self-host Better Auth?'
  slug: managed-better-auth-vs-self-hosting-better-auth
updatedOn: '2026-11-21T16:25:19.720Z'
---

It depends on whose machine the tools need. A **local** MCP server runs on the user's computer: the client launches it as a subprocess and talks to it over standard input and output, the `stdio` transport ([MCP stdio](https://modelcontextprotocol.io/specification/latest/basic/transports/stdio)). A **remote** MCP server runs on the internet, and clients connect to it over the Streamable HTTP transport ([MCP transports](https://modelcontextprotocol.io/specification/latest/basic/transports)).

## How they compare

|                     | Local (`stdio`)                                                   | Remote (Streamable HTTP)                                        |
| ------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------- |
| **Runs on**         | The user's machine                                                | A server with a public HTTPS URL                                |
| **Good for**        | Files, local databases, CLIs, developer tools                     | Letting users act in your app or service                        |
| **Who installs it** | Each user, on each machine                                        | Nobody: users paste a URL                                       |
| **Sign-in**         | Credentials from the environment; the MCP auth spec doesn't apply | OAuth, so each user signs in with their own account             |
| **Works in**        | Desktop and IDE clients, like Claude Desktop and Cursor           | ChatGPT, Claude on web, desktop, and mobile, Cursor, and others |
| **Updates**         | Users update their copy                                           | You deploy once                                                 |

Implementations that use `stdio` shouldn't follow the MCP authorization spec, and should get credentials from the environment instead ([MCP authorization](https://modelcontextprotocol.io/specification/latest/basic/authorization)).

## If you want users to reach your app from ChatGPT or Claude, build a remote server

- **ChatGPT** connects custom MCP servers by URL, from the web, over Streamable HTTP or SSE ([Connect and test your plugin](https://developers.openai.com/plugins/deploy/connect-chatgpt)).
- **Claude's custom connectors** connect to remote servers from Anthropic's cloud, even in Claude Desktop, so the server must be reachable over the public internet on port 443. Local servers configured in `claude_desktop_config.json` are a separate mechanism that only works on that machine ([Claude Help Center](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp)).
- **Both directories** list remote servers. Claude no longer accepts local servers packaged as MCP Bundles as standalone listings ([Claude submission](https://claude.com/docs/connectors/building/submission)).

## Building a remote server on Neon

A remote server needs hosting, a database for its tools, and OAuth. On Neon, all three live in one project: the server runs as a [Neon Function](/docs/compute/functions/overview) on a public HTTPS URL, it queries Lakebase Postgres in the same region, and [Managed Better Auth](/docs/auth/guides/plugins/oauth-provider) signs users in. See [How do I build a remote MCP server?](/faqs/how-to-build-remote-mcp-server)

If what you want is an MCP server for managing Neon itself, from Cursor or Claude Code, use the [Neon MCP server](/docs/ai/neon-mcp-server), which is already hosted.

## Learn more

- [Every app needs an MCP server](/blog/every-app-needs-an-mcp-server): why your app needs an MCP server, and how mcp/place lets ChatGPT paint a shared grid.
- [Build an MCP server for your app with Neon Functions and Managed Better Auth](/guides/mcp-server-neon-functions): the full build, from the first commit to ChatGPT.

Vendor details verified on 2026-11-21 against the linked pages.

<CTA title="Host your remote MCP server on Neon" description="A Neon Function, Postgres in the same region, and OAuth from Managed Better Auth." buttonText="Read the guide" buttonUrl="/guides/mcp-server-neon-functions" />
