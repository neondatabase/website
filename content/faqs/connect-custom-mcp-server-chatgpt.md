---
title: 'How do I connect a custom MCP server to ChatGPT?'
subtitle: "On ChatGPT's website, open Plugins, select the plus button, then Add custom MCP server. Enter the server's public HTTPS URL ending in /mcp, choose OAuth if it signs users in, accept the risk warning, and select Create as a plugin. Full support, including write tools, requires a Business or Enterprise/Edu workspace."
createdAt: '2026-11-21T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'How do I connect my application to my Neon database using the connection string?'
  slug: connect-application-using-connection-string
nextLink:
  title: 'How do I create a new database in my Neon project?'
  slug: create-new-database-neon-project
updatedOn: '2026-11-21T16:25:19.720Z'
---

Add it from **Plugins** on ChatGPT's website. You no longer need to turn on Developer Mode first ([OpenAI Help Center](https://help.openai.com/en/articles/12584461-connecting-custom-mcp-servers-in-chatgpt)):

1. Go to **Plugins**, select the plus button, then **Add custom MCP server**.
2. Enter a name and, optionally, a description.
3. Under **Connection**, enter the server's public HTTPS URL, including the `/mcp` path.
4. Configure authentication. Choose **OAuth** if your server signs users in.
5. Review the risk warning, check **I understand and want to continue**, and select **Create as a plugin**.
6. Complete the sign-in and consent flow, then install the plugin. In a chat, type `@` and select it.

ChatGPT supports Streamable HTTP and SSE servers. For OAuth, it can identify itself with a Client ID Metadata Document (CIMD) when your authorization server supports it, or use dynamic client registration if you've configured that ([Add custom MCP server](https://developers.openai.com/api/docs/guides/custom-mcp-server)).

## Who can add one

Full MCP support, including write actions, is available on ChatGPT Business and Enterprise/Edu on the web. On Business, only admins and owners can create these plugins. On Enterprise/Edu, admins can grant the **Create plugins with MCPs** permission to selected members ([OpenAI Help Center](https://help.openai.com/en/articles/12584461-connecting-custom-mcp-servers-in-chatgpt)). Pro users can connect custom MCP servers with read and fetch permissions only.

## If something doesn't work

- **Use the server URL, not your app's URL.** If your app is on Vercel and the MCP server is a Neon Function, enter the function URL ending in `/mcp` ([Connect ChatGPT](/docs/compute/functions/mcp-server#connect-chatgpt)).
- **Reads work but writes fail** with an error like "Unknown tool": open the plugin's details and allow write tools. ChatGPT treats a tool without `readOnlyHint: true` as a write.
- **You changed your tools** and ChatGPT doesn't see it: refresh the plugin or start a new chat, because ChatGPT caches the tool list.
- **It can't connect at all:** ChatGPT connects from OpenAI's servers, so `localhost` and private networks won't work. Check the endpoint with [MCP Inspector](https://github.com/modelcontextprotocol/inspector) first ([Connect and test your plugin](https://developers.openai.com/plugins/deploy/connect-chatgpt)).

## Build the server first

If you don't have a server yet, the guide [Build an MCP server for your app](/guides/mcp-server-neon-functions) builds one on a [Neon Function](/docs/compute/functions/overview), protects it with [Managed Better Auth](/docs/auth/overview), and ends with ChatGPT painting squares on a live grid. To connect the same server to Claude, add it as a custom connector under **Customize** > **Connectors**, which works on every Claude plan ([Claude Help Center](https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities)).

## Learn more

- [Every app needs an MCP server](/blog/every-app-needs-an-mcp-server): why your app needs an MCP server, and how mcp/place lets ChatGPT paint a shared grid.
- [Build an MCP server for your app with Neon Functions and Managed Better Auth](/guides/mcp-server-neon-functions): the full build, from the first commit to ChatGPT.

Vendor details verified on 2026-11-21 against the linked pages.

<CTA title="Build a server ChatGPT can connect to" description="Run it on Neon Functions and sign users in with Managed Better Auth." buttonText="Read the guide" buttonUrl="/guides/mcp-server-neon-functions" />
