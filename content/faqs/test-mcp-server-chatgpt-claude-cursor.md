---
title: 'How do I test an MCP server across ChatGPT, Claude, and Cursor?'
subtitle: 'Check the protocol with MCP Inspector or mcporter, run your tools against ChatGPT, Claude, and Cursor side by side in MCPJam, check store requirements with Manufact, then connect the real clients. Test with two users to confirm each one only sees their own data.'
createdAt: '2026-11-21T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'How do I test a new embedding model or chunking strategy on production data without affecting production?'
  slug: test-embedding-model-chunking-changes-production-data
nextLink:
  title: 'How do I test cron jobs in staging or a preview environment without running them twice against production?'
  slug: test-scheduled-jobs-preview-branch-without-double-running
updatedOn: '2026-11-21T16:25:19.720Z'
---

Test in layers, from the protocol up to the real clients. That way a failure tells you where the problem is: your server, your OAuth setup, one client's quirks, or a store requirement.

## 1. Check the protocol

- [MCP Inspector](https://github.com/modelcontextprotocol/inspector) is the official testing tool from the MCP project. Connect it to your server's URL to list tools, call them, and walk through the OAuth flow.
- [mcporter](https://github.com/steipete/mcporter) does the same from the command line, which is handy in scripts.

Then check the basics by hand. A request without a token should get a `401` with a `WWW-Authenticate` header that includes `resource_metadata`, which is how clients find your authorization server ([verify the server](/docs/compute/functions/mcp-server#verify-the-server)):

```bash
curl -i https://<your-mcp-server>/mcp
```

## 2. Compare clients side by side

[MCPJam](https://www.mcpjam.com) connects to your server once, runs the OAuth flow, and lets you call a tool in Claude, ChatGPT, and Cursor at the same time. Each client should return the same result. In the [mcp/place guide](/guides/mcp-server-neon-functions#test-across-clients-with-mcpjam), every client returned the painted square and the ID of the signed-in user.

## 3. Check store requirements

Passing the MCP spec is enough to connect, but ChatGPT and Claude have more rules before a server can be listed. [Manufact](https://manufact.com) runs a checklist against them. The mcp/place server scored 88 out of 100 on its first run, because its tool had no annotations ([guide](/guides/mcp-server-neon-functions#check-plugin-store-requirements-with-manufact)). See [What are MCP tool annotations?](/faqs/mcp-tool-annotations-chatgpt-claude-requirements)

## 4. Connect the real clients

- **ChatGPT:** add it from **Plugins** > **Add custom MCP server**. See [How do I connect a custom MCP server to ChatGPT?](/faqs/connect-custom-mcp-server-chatgpt)
- **Claude:** add it as a custom connector under **Customize** > **Connectors** ([Claude Help Center](https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities)).
- **Cursor:** add the server URL to Cursor's MCP settings.

Remote clients connect from their own cloud, so they need a public HTTPS URL, including for your sign-in and consent pages. `localhost` works for MCP Inspector, not for ChatGPT or Claude.

## 5. Test data isolation

Sign in as two different users. Have user B call a tool with the ID of user A's data. The result must be `not found` ([verify the server](/docs/compute/functions/mcp-server#verify-the-server)). See [How do I keep each user's data separate in an MCP server?](/faqs/separate-user-data-mcp-server)

## Test on a branch, not production

On Neon, run all of this against a [branch](/docs/introduction/branching). Each branch has its own copy of your data, its own users and OAuth settings, and its own function URL, so test sign-ins and writes don't touch production. Tokens from one branch don't work on another ([Branching authentication](/docs/auth/branching-authentication)).

## Learn more

- [Every app needs an MCP server](/blog/every-app-needs-an-mcp-server): why your app needs an MCP server, and how mcp/place lets ChatGPT paint a shared grid.
- [Build an MCP server for your app with Neon Functions and Managed Better Auth](/guides/mcp-server-neon-functions): the full build, from the first commit to ChatGPT.

Vendor details verified on 2026-11-21 against the linked pages.

<CTA title="Build and test an MCP server" description="Follow mcp/place from the first commit to ChatGPT, with every test along the way." buttonText="Read the guide" buttonUrl="/guides/mcp-server-neon-functions" />
