---
title: 'How do I let ChatGPT or Claude act for a specific user in my app?'
subtitle: "Give your app an MCP server protected by OAuth. The user signs in with their existing account and approves the agent, the agent gets a token tied to that user, and your server reads the user's ID from the token on every call. On Neon, Managed Better Auth's OAuth provider plugin handles the sign-in flow."
createdAt: '2026-11-21T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'How do I let an AI agent change my database schema safely?'
  slug: let-ai-agent-change-database-schema-safely
nextLink:
  title: 'How do I get my MCP server listed in the ChatGPT or Claude directories?'
  slug: list-mcp-server-chatgpt-claude-directory
updatedOn: '2026-11-21T16:25:19.720Z'
---

Build an MCP server for your app and protect it with OAuth. That's how ChatGPT and Claude act as a signed-in user: the user signs in to your app and approves the agent, the agent receives an access token issued for that user, and it sends the token with every tool call. Your server checks the token and uses its `sub` claim, the user's ID, to decide whose data a tool can touch ([MCP authorization](https://modelcontextprotocol.io/specification/latest/basic/authorization)).

## How the flow works

1. The agent calls your MCP server without a token and gets a `401` that points to the server's protected resource metadata.
2. The metadata names your authorization server, so the agent knows where to send the user.
3. The user signs in on your app's sign-in page and clicks **Allow** on your consent page.
4. The agent gets an access token and calls your tools with it.

The user never shares a password with ChatGPT or Claude, and they can revoke the agent's access without changing their login. See [Build an MCP server with Managed Better Auth](/docs/compute/functions/mcp-server#how-it-works) for the full sequence.

## Set it up on Neon

- **[Managed Better Auth](/docs/auth/overview)** already stores your users. Its [OAuth provider plugin](/docs/auth/guides/plugins/oauth-provider) (beta) turns that user database into the authorization server, so agents sign in the same accounts your app uses.
- **A [Neon Function](/docs/compute/functions/overview)** runs the MCP server. The `@neon/oauth` SDK (beta) rejects requests without a valid token and gives each request the user's ID.
- **Your app** hosts the sign-in and consent pages on a public HTTPS origin, because ChatGPT and Claude can't complete OAuth against `localhost`.

With the [Neon agent skills](/docs/ai/agent-skills) installed, a coding agent builds all three from one prompt. The guide [Build an MCP server for your app](/guides/mcp-server-neon-functions) shows the result: ChatGPT paints squares on a shared grid, and every change records the signed-in user who made it.

## Scope every tool to that user

Signing the user in is only half of it. Each tool must filter by the token's user ID, and never take a user ID from the tool's input, which the agent controls. See [How do I keep each user's data separate in an MCP server?](/faqs/separate-user-data-mcp-server)

## Limits to know

- The OAuth provider plugin and `@neon/oauth` are in beta.
- Every token is issued for a signed-in user. There's no `client_credentials` grant for machine-to-machine access ([limitations](/docs/auth/guides/plugins/oauth-provider#limitations)).
- In ChatGPT, adding a custom MCP server with write tools requires a Business or Enterprise/Edu workspace; Pro can connect with read and fetch permissions only ([OpenAI Help Center](https://help.openai.com/en/articles/12584461-connecting-custom-mcp-servers-in-chatgpt)). Claude's custom connectors work on every plan ([Claude Help Center](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp)).

## Learn more

- [Every app needs an MCP server](/blog/every-app-needs-an-mcp-server): why your app needs an MCP server, and how mcp/place lets ChatGPT paint a shared grid.
- [Build an MCP server for your app with Neon Functions and Managed Better Auth](/guides/mcp-server-neon-functions): the full build, from the first commit to ChatGPT.

Vendor details verified on 2026-11-21 against the linked pages.

<CTA title="Let agents act as your users" description="Managed Better Auth signs users in, and a Neon Function serves the MCP server." buttonText="Read the guide" buttonUrl="/guides/mcp-server-neon-functions" />
