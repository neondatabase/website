---
title: "How do I keep each user's data separate in an MCP server?"
subtitle: "Read the user's ID from the verified OAuth access token, never from tool input, and filter every query by it. Build a fresh MCP server per request so each tool closes over that ID, and test with two users to confirm one can't read or change the other's rows."
createdAt: '2026-11-21T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'How do I safely query Postgres directly from the browser?'
  slug: safely-query-postgres-from-browser
nextLink:
  title: 'Which serverless database services charge per second instead of per month for Postgres?'
  slug: serverless-database-services-postgres-charge-per-second
updatedOn: '2026-11-21T16:25:19.720Z'
---

Take the user's ID from the access token your server verified, and filter every query by it. The ID is the token's `sub` claim. Never accept a user ID as a tool argument: the agent fills in tool arguments, so anything in them can be wrong or manipulated, while the token was issued by your authorization server after the user signed in ([Build an MCP server](/docs/compute/functions/mcp-server#write-the-mcp-server)).

## The pattern

1. **Verify the token first.** On Neon, the `@neon/oauth` middleware rejects requests to `/mcp` that don't carry a valid token from [Managed Better Auth](/docs/auth/overview), and checks the issuer and audience as well as the signature ([verify access tokens](/docs/auth/guides/plugins/oauth-provider#verify-access-tokens)).
2. **Create the MCP server per request,** passing it the user ID, so every tool closes over the right user. Keep the database pool at module scope.
3. **Filter every query by that ID,** including updates and deletes:

```typescript
server.registerTool(
  'complete_todo',
  {
    title: 'Complete todo',
    description: "Mark one of the signed-in user's todos as done.",
    inputSchema: { id: z.number().int().positive() },
    annotations: { readOnlyHint: false },
  },
  async ({ id }) => {
    const { rows } = await pool.query(
      'UPDATE todos SET done = true WHERE id = $1 AND user_id = $2 RETURNING id, text, done',
      [id, userId] // userId comes from the token, not from the tool input
    );
    return asText(rows[0] ?? { error: 'not found' });
  }
);
```

Without `AND user_id = $2`, any signed-in user could complete anyone's todo by guessing an ID. The full example, with `list_todos` and `add_todo`, is in [Build an MCP server with Managed Better Auth](/docs/compute/functions/mcp-server#write-the-mcp-server).

## Test it with two users

Sign in as user A and create a row. Then sign in as user B and call the tool with user A's row ID. The result must be `not found` ([verify the server](/docs/compute/functions/mcp-server#verify-the-server)). Do this before you connect a production client.

## Go further

- **Row-Level Security.** For a second layer, enforce the same rule in Postgres with [RLS](/docs/guides/row-level-security), so a query that forgets the filter still can't return another user's rows.
- **A database per customer.** If customers need stronger isolation, give each one its own Neon project. Projects have no per-project fee, and idle ones scale to zero ([plans](/docs/introduction/plans)).
- **Test on a branch.** Each Neon branch has its own users, OAuth settings, and issuer, and tokens from one branch don't work on another ([Branching authentication](/docs/auth/branching-authentication)). You can try changes against a copy of production data without risking real accounts.

For the sign-in side, see [How do I let ChatGPT or Claude act for a specific user in my app?](/faqs/let-chatgpt-claude-act-for-user-in-app)

## Learn more

- [Every app needs an MCP server](/blog/every-app-needs-an-mcp-server): why your app needs an MCP server, and how mcp/place lets ChatGPT paint a shared grid.
- [Build an MCP server for your app with Neon Functions and Managed Better Auth](/guides/mcp-server-neon-functions): the full build, from the first commit to ChatGPT.

<CTA title="Scope every tool to the signed-in user" description="Verify tokens with @neon/oauth and keep users' rows apart in Lakebase Postgres." buttonText="Build an MCP server" buttonUrl="/docs/compute/functions/mcp-server" />
