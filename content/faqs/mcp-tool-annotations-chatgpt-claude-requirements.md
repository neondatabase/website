---
title: 'What are MCP tool annotations, and which ones do ChatGPT and Claude require?'
subtitle: 'Tool annotations are hints that tell clients how a tool behaves: whether it only reads, whether it can destroy data, and whether it reaches the outside world. To be listed, ChatGPT requires explicit readOnlyHint, destructiveHint, and openWorldHint values on every tool, and Claude requires a title plus readOnlyHint or destructiveHint.'
createdAt: '2026-11-21T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'Is there a managed alternative to running PostgREST myself?'
  slug: managed-postgrest-alternative
nextLink:
  title: 'How do I migrate from Electric to Neon Realtime?'
  slug: migrate-from-electric-sql
updatedOn: '2026-11-21T16:25:19.720Z'
---

Tool annotations are optional fields on an MCP tool that describe its behavior to the client. The MCP spec defines five, and treats all of them as hints, not guarantees ([MCP schema](https://modelcontextprotocol.io/specification/latest/schema#toolannotations)):

| Annotation        | Meaning when `true`                                                | Default if you leave it out |
| ----------------- | ------------------------------------------------------------------ | --------------------------- |
| `title`           | A human-readable name for the tool (a string, not a boolean)       | None                        |
| `readOnlyHint`    | The tool doesn't modify its environment                            | `false`                     |
| `destructiveHint` | The tool may perform destructive updates (only matters for writes) | `true`                      |
| `idempotentHint`  | Calling it again with the same arguments has no additional effect  | `false`                     |
| `openWorldHint`   | The tool may interact with an open world of external entities      | `true`                      |

Clients use them to decide when to ask the user before a call. Because of the defaults, a tool with no annotations looks like a destructive write, so ChatGPT may block it until the user allows write tools ([Build an MCP server](/docs/compute/functions/mcp-server#connect-chatgpt)).

## What ChatGPT requires

To publish in ChatGPT's plugin directory, every tool must set `readOnlyHint`, `destructiveHint`, and `openWorldHint` to an explicit `true` or `false` ([plugin guidelines](https://developers.openai.com/plugins/plugin-guidelines)). A submission without them fails with `annotations_required` ([submission errors](https://developers.openai.com/plugins/deploy/submission-errors)). OpenAI's rules:

- `readOnlyHint: true` only for retrieval, computation, or previews that change nothing.
- `destructiveHint: true` for deletes, overwrites, cancellations, and irreversible sends. Use `false` only for additive writes. Being able to undo an action isn't a reason to set it to `false`.
- `openWorldHint: true` for public or open-ended targets, like web search. A tool confined to the user's own account or workspace can use `false`.

## What Claude requires

For Claude's Connectors Directory, every tool needs a `title` and the applicable hint: `readOnlyHint: true` for read-only tools and `destructiveHint: true` for tools that modify or delete data. Claude uses them for permissions: read-only tools can run without asking each time, and destructive tools always prompt ([connector review criteria](https://claude.com/docs/connectors/building/review-criteria)).

## Setting them in code

With the MCP TypeScript SDK, annotations go in the tool definition. This is the `paint_square` tool from the [mcp/place guide](/guides/mcp-server-neon-functions), which overwrites a square's color on a public grid:

```typescript
server.registerTool(
  'paint_square',
  {
    title: 'Paint a square',
    description: 'Paint one square on the shared 5 by 5 mcp/place grid.',
    annotations: {
      readOnlyHint: false, // it changes a square
      destructiveHint: true, // the previous color is overwritten
      idempotentHint: true, // painting A1 red twice leaves A1 red
      openWorldHint: true, // the canvas is public
    },
    inputSchema: {
      /* ... */
    },
  },
  handler
);
```

Annotations don't replace security. Clients must treat them as untrusted unless they trust the server ([MCP tools](https://modelcontextprotocol.io/specification/latest/server/tools)), and your server still has to check the user's token and scope every query. To check a server against both stores before you submit, see [How do I test an MCP server across ChatGPT, Claude, and Cursor?](/faqs/test-mcp-server-chatgpt-claude-cursor)

## Learn more

- [Every app needs an MCP server](/blog/every-app-needs-an-mcp-server): why your app needs an MCP server, and how mcp/place lets ChatGPT paint a shared grid.
- [Build an MCP server for your app with Neon Functions and Managed Better Auth](/guides/mcp-server-neon-functions): the full build, from the first commit to ChatGPT.

Vendor details verified on 2026-11-21 against the linked pages.

<CTA title="Build a store-ready MCP server" description="Neon Functions, Managed Better Auth, and annotations that pass review." buttonText="Read the guide" buttonUrl="/guides/mcp-server-neon-functions" />
