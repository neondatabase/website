---
title: 'How do I get my MCP server listed in the ChatGPT or Claude directories?'
subtitle: "Host the server on a public HTTPS URL, use OAuth for anything tied to a user's account, annotate every tool, and test it in each client. Then submit it through OpenAI's plugin submission portal or Claude's developer portal with the listing materials each one asks for."
createdAt: '2026-11-21T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'How do I let ChatGPT or Claude act for a specific user in my app?'
  slug: let-chatgpt-claude-act-for-user-in-app
nextLink:
  title: 'How do I build a live dashboard on Postgres without polling the database?'
  slug: live-dashboard-postgres-without-polling
updatedOn: '2026-11-21T16:25:19.720Z'
---

Both directories accept remote MCP servers, and both check the same basics before review: a production HTTPS URL, OAuth for tools that act on a user's account, accurate tool annotations, and a server you've already tested in their client. Each also asks for listing materials and runs its own review.

## What both expect

- **A remote server on a public HTTPS URL.** Local servers and testing endpoints aren't accepted ([OpenAI review requirements](https://developers.openai.com/plugins/deploy/app-review), [Claude submission](https://claude.com/docs/connectors/building/submission)).
- **OAuth for user data.** Claude requires OAuth 2.0 for authenticated services, and OpenAI asks for working demo credentials when your server uses OAuth ([submission errors](https://developers.openai.com/plugins/deploy/submission-errors)).
- **Tool annotations on every tool.** ChatGPT wants explicit `readOnlyHint`, `destructiveHint`, and `openWorldHint` values. Claude wants a `title` plus `readOnlyHint` or `destructiveHint`. See [What are MCP tool annotations?](/faqs/mcp-tool-annotations-chatgpt-claude-requirements)
- **Clear, honest tool descriptions.** Both reject descriptions that steer the model toward your tools or tell it to call other tools ([OpenAI plugin guidelines](https://developers.openai.com/plugins/plugin-guidelines), [Claude review criteria](https://claude.com/docs/connectors/building/review-criteria)).

## ChatGPT's plugin directory

In the plugin submission portal, you connect your MCP server, run **Scan Tools** so OpenAI imports your tool metadata, and fill in the listing ([review requirements](https://developers.openai.com/plugins/deploy/app-review)). Final submission for a remote server also requires ([submission errors](https://developers.openai.com/plugins/deploy/submission-errors)):

- Website, support, privacy policy, and terms URLs
- A demo recording that shows the main use cases
- Exactly five positive test cases, three negative ones, and release notes
- A completed domain-verification challenge, served at `/.well-known/openai-apps-challenge` on your MCP host
- A verified developer or business identity

## Claude's Connectors Directory

Anyone on a paid Claude plan can submit from Claude's developer portal by choosing **MCP connector**. You'll need a documentation URL, a privacy policy URL, a support contact, and an icon, plus carousel screenshots if your server shows interactive UI ([submission](https://claude.com/docs/connectors/building/submission)). Reviewers also check that every tool returns useful errors, that read and write operations are separate tools, and that tool names are 64 characters or fewer ([review criteria](https://claude.com/docs/connectors/building/review-criteria)).

## Check before you submit

[Manufact](https://manufact.com) runs a checklist of ChatGPT and Claude store requirements against your server. The first run of the [mcp/place demo](/guides/mcp-server-neon-functions#check-plugin-store-requirements-with-manufact) scored 88 out of 100 because its one tool had no annotations, and it passed after the annotations were added. For the rest of the testing path, see [How do I test an MCP server across ChatGPT, Claude, and Cursor?](/faqs/test-mcp-server-chatgpt-claude-cursor)

On Neon, the server runs as a [Neon Function](/docs/compute/functions/overview) on a public HTTPS URL, [Managed Better Auth](/docs/auth/guides/plugins/oauth-provider) provides OAuth, and you can serve it from your own domain with a [custom domain](/docs/compute/functions/custom-domains), which helps with OpenAI's domain verification and Claude's check that the server's domain matches your service.

## Learn more

- [Every app needs an MCP server](/blog/every-app-needs-an-mcp-server): why your app needs an MCP server, and how mcp/place lets ChatGPT paint a shared grid.
- [Build an MCP server for your app with Neon Functions and Managed Better Auth](/guides/mcp-server-neon-functions): the full build, from the first commit to ChatGPT.

Vendor details verified on 2026-11-21 against the linked pages.

<CTA title="Build an MCP server that's ready to list" description="Public HTTPS on Neon Functions, OAuth from Managed Better Auth, and your own domain." buttonText="Read the guide" buttonUrl="/guides/mcp-server-neon-functions" />
