---
title: 'How do I build a remote MCP server?'
subtitle: 'A remote MCP server is an HTTPS endpoint that speaks the Streamable HTTP transport and uses OAuth to know which user it acts for. On Neon, you run it as a Neon Function, secure it with Managed Better Auth, and a coding agent with the Neon skills writes most of the code.'
createdAt: '2026-11-21T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'How do I add file uploads to a Postgres app?'
  slug: how-to-add-file-uploads-postgres-app
nextLink:
  title: 'How do I give each preview deployment its own database, file storage, auth, and API endpoints?'
  slug: how-to-give-each-preview-deployment-full-backend
updatedOn: '2026-11-21T16:25:19.720Z'
---

A remote MCP server is a web service that AI apps like ChatGPT, Claude, and Cursor call over the internet. It needs three things: a public HTTPS URL that speaks the MCP [Streamable HTTP transport](https://modelcontextprotocol.io/specification/latest/basic/transports), tools with clear names, schemas, and annotations, and OAuth sign-in if the tools touch a user's account ([MCP authorization](https://modelcontextprotocol.io/specification/latest/basic/authorization)). ChatGPT and Claude both connect to remote servers from their own cloud, so `localhost` won't work ([ChatGPT](https://developers.openai.com/plugins/deploy/connect-chatgpt), [Claude](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp)).

## Build it on Neon

1. **Run the server as a [Neon Function](/docs/compute/functions/overview).** A function gets a public HTTPS URL and runs in the same region as your Lakebase Postgres database, so tools query your data without a cross-region hop. The official MCP TypeScript SDK and Hono work as is.
2. **Turn on [Managed Better Auth](/docs/auth/overview) and its [OAuth provider plugin](/docs/auth/guides/plugins/oauth-provider)** (beta). Your user database becomes the OAuth 2.1 authorization server, so users sign in with the account they already have. The `@neon/oauth` SDK (beta) rejects requests without a valid token and gives each tool the user's ID.
3. **Host a sign-in page and a consent page** in your app, on a public HTTPS origin.
4. **Add tool annotations** so ChatGPT and Claude know which tools only read and which change data. See [What are MCP tool annotations?](/faqs/mcp-tool-annotations-chatgpt-claude-requirements)
5. **Test it, then connect it** to ChatGPT, Claude, or Cursor. See [How do I test an MCP server across ChatGPT, Claude, and Cursor?](/faqs/test-mcp-server-chatgpt-claude-cursor)

You don't have to write it all by hand. With the [Neon agent skills](/docs/ai/agent-skills) installed, a prompt like "Add an MCP server to my app using Neon Functions, with the Better Auth OAuth provider plugin for authentication" gets you the function, the token checks, and the sign-in and consent pages. The guide [Build an MCP server for your app with Neon Functions and Managed Better Auth](/guides/mcp-server-neon-functions) walks through that build end to end, and [Build an MCP server with Managed Better Auth](/docs/compute/functions/mcp-server) covers the same setup by hand with the Neon CLI and Next.js.

If your server doesn't need per-user sign-in, start from the [`mcp-postgres` function template](/functions/templates/mcp-postgres) instead.

## Before you start

- Neon Functions run in AWS US East (Ohio), AWS US East (N. Virginia), AWS Europe (Frankfurt), and AWS Asia Pacific (Singapore) for now ([Build an MCP server](/docs/compute/functions/mcp-server#before-you-start)).
- The OAuth provider plugin and `@neon/oauth` are in beta.
- ChatGPT's custom MCP servers are limited by plan: Business and Enterprise/Edu get full support, including write tools ([OpenAI Help Center](https://help.openai.com/en/articles/12584461-connecting-custom-mcp-servers-in-chatgpt)). Claude's custom connectors are available on every plan, with one on Free ([Claude Help Center](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp)).

Not sure you need a remote server at all? See [Local or remote MCP server: which do I need?](/faqs/local-vs-remote-mcp-server)

## Learn more

- [Every app needs an MCP server](/blog/every-app-needs-an-mcp-server): why your app needs an MCP server, and how mcp/place lets ChatGPT paint a shared grid.
- [Build an MCP server for your app with Neon Functions and Managed Better Auth](/guides/mcp-server-neon-functions): the full build, from the first commit to ChatGPT.

Vendor details verified on 2026-11-21 against the linked pages.

<CTA title="Build your MCP server on Neon" description="A Neon Function for the server, Managed Better Auth for sign-in, and Postgres next to both." buttonText="Read the guide" buttonUrl="/guides/mcp-server-neon-functions" />
