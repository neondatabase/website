# MCP servers on Neon Functions

A [Model Context Protocol](https://modelcontextprotocol.io) server is a textbook Neon Functions workload: it's a long-running HTTP handler that an AI client (Cursor, Claude, ChatGPT, an agent) calls to discover and invoke tools, and those tools usually read and write a database. Running it as a Neon Function puts the MCP server's compute next to its Postgres data, gives it a public HTTPS URL, and lets it branch with the rest of your backend — each branch gets its own MCP server against its own isolated data.

MCP's **streamable HTTP transport** is a plain `POST`/`GET` on a single endpoint (conventionally `/mcp`), so it maps directly onto a function's web-standard `fetch` handler — no `upgrade` method or extra protocol like [WebSockets](../SKILL.md#websocket-servers) needed. A Hono app is the simplest host.

## The server

Two packages do the work: the official [`@modelcontextprotocol/sdk`](https://github.com/modelcontextprotocol/typescript-sdk) (defines the server and its tools) and [`@hono/mcp`](https://github.com/honojs/middleware/tree/main/packages/mcp) (bridges MCP's streamable HTTP transport to a Hono route). Tools query Postgres through Drizzle on a module-scope `pg` pool, exactly like any other function (see [Connecting to Postgres](../SKILL.md#connecting-to-postgres)).

```typescript
// src/index.ts
import { Hono } from "hono";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPTransport } from "@hono/mcp";
import { attachDatabasePool } from "@neon/functions";
import { contacts } from "./db/schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
attachDatabasePool(pool);
const db = drizzle(pool);

const mcpServer = new McpServer({ name: "contacts", version: "1.0.0" });

// Each tool: a name, a config (description + a Zod input schema), and a handler
// that returns MCP content. The Zod shape becomes the tool's JSON schema, which
// the client uses to call the tool correctly.
mcpServer.registerTool(
  "create_contact",
  {
    title: "Create contact",
    description: "Create a new contact.",
    inputSchema: {
      name: z.string().describe("Full name (required)."),
      email: z.string().optional().describe("Email address."),
    },
  },
  async ({ name, email }) => {
    const [row] = await db.insert(contacts).values({ name, email }).returning();
    return { content: [{ type: "text", text: JSON.stringify(row) }] };
  },
);

mcpServer.registerTool(
  "delete_contact",
  {
    title: "Delete contact",
    description: "Delete a contact by id.",
    inputSchema: { id: z.number().int().positive() },
  },
  async ({ id }) => {
    const [row] = await db
      .delete(contacts)
      .where(eq(contacts.id, id))
      .returning();
    return {
      content: [
        { type: "text", text: JSON.stringify(row ?? { error: "not found" }) },
      ],
    };
  },
);

// Connect the server to the transport once per isolate, then let the Hono route
// hand every /mcp request (POST for calls, GET for the stream) to the transport.
const transport = new StreamableHTTPTransport();
const app = new Hono();

app.all("/mcp", async (c) => {
  if (!mcpServer.isConnected()) await mcpServer.connect(transport);
  return transport.handleRequest(c);
});

export default app;
```

Key points:

- **Module scope.** Build the `McpServer`, register its tools, create the `StreamableHTTPTransport`, and open the `pg` pool once at module load — they're reused across every request the isolate serves (see [runtime limits](../SKILL.md#timeouts-and-runtime-limits)). Connect the transport lazily with the `isConnected()` guard so it happens once.
- **State in Postgres.** Module memory doesn't survive isolate eviction, and several isolates run in parallel — so the source of truth for anything a tool reads or writes belongs in Postgres, not an in-memory structure.
- **The URL.** After `neon deploy`, the server lives at `https://<branch_id>-<slug>.compute.…neon.tech/mcp`. Point any streamable-HTTP MCP client at that `/mcp` path.

## Authenticating the server

> [!WARNING]
> A Neon Function has a **public HTTPS URL — anyone can reach it.** An unauthenticated MCP server hands every caller your tools (and the database behind them). Authenticate at the top of the handler before touching the transport, exactly as for [any client-facing function](../SKILL.md#functions-as-an-agent-backend-nextjs-and-similar-frameworks).

Use **Managed Better Auth (Neon Auth) as the OAuth server** and guard the Function with `@neon/oauth` (0.3.0 or later). MCP clients that support OAuth (Cursor, Claude, ChatGPT) discover the server, sign the user in on a login and consent page you host, and call `/mcp` with an access token. Keep the app's existing login; the OAuth server sits beside it. The full path (CLI setup, clients, pages, verification) is [neon-auth references/oauth-server.md](https://neon.com/docs/ai/skills/neon-auth/references/oauth-server.md).

### Option 1 — OAuth via Managed Better Auth (best for third-party clients)

Configure the server once:

```bash
neon neon-auth config oauth-server update --enabled \
  --login-page https://app.example.com/auth/sign-in \
  --consent-page https://app.example.com/auth/consent \
  --mcp-resource https://<your-function-url>/mcp
```

Your Neon Function is the **resource server**. `honoMcp` verifies the token's signature, issuer, and audience, serves the protected-resource metadata, and answers unauthenticated requests with a `401` challenge. It sets `c.get("auth")`, whose `sub` is the user identity. Scope every tool to it:

```typescript
import { createMcpAuth } from "@neon/oauth/mcp";
import { honoMcp, type McpAuthVariables } from "@neon/oauth/mcp/hono";

const mcpAuth = createMcpAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!, // the branch's Auth URL
  resource: process.env.MCP_RESOURCE!, // exactly the --mcp-resource value
});

const app = new Hono<McpAuthVariables>();
app.use(honoMcp(mcpAuth, { path: "/mcp" }));

app.all("/mcp", async (c) => {
  const userId = c.get("auth").sub;
  // Build a McpServer whose tools close over userId; stateless transport per request.
  const server = createServer(userId);
  const transport = new StreamableHTTPTransport({ sessionIdGenerator: undefined });
  await server.connect(transport);
  return transport.handleRequest(c);
});
```

A per-request server and transport replace the module-scope server above because tools need the caller's `sub`; keep the `pg` pool at module scope. Pass `NEON_AUTH_BASE_URL` and `MCP_RESOURCE` via the function's `env` in `neon.ts` (see [Environment variables](../SKILL.md#environment-variables)). `/mcp` has no CORS or `OPTIONS` handling from `honoMcp`, so add it for browser-based clients.

### Option 2 — API key or session JWT (simplest)

When the callers are your own agents/services or a personal MCP server, you don't need the OAuth flow. Either:

- **API keys** — issue and store your own keys, and have the function verify the `Authorization: Bearer <key>` (or an `x-api-key` header) on every request; or
- **Session JWT** — verify a Managed Auth JWT (`NEON_AUTH_JWKS_URL`, issuer from `NEON_AUTH_BASE_URL`) with `jose`, the same pattern used for the [agent backend](../SKILL.md#functions-as-an-agent-backend-nextjs-and-similar-frameworks).

Either way it's one check at the top of the `/mcp` route — reject anything that doesn't carry a valid key/token before connecting the transport:

```typescript
app.all("/mcp", async (c) => {
  const auth = c.req.header("authorization");
  if (!(await isValidApiKey(auth)))
    return c.json({ error: "unauthorized" }, 401);
  if (!mcpServer.isConnected()) await mcpServer.connect(transport);
  return transport.handleRequest(c);
});
```


This keeps the secret server-side, costs nothing to operate, and is trivial to rotate — a solid default until you need third-party clients to self-authorize, at which point reach for Option 1.

## Testing

Drive the server with any MCP client. [`mcporter`](https://github.com/instructa/mcporter) is a quick CLI for it — `mcporter list <url>/mcp --schema` lists the tools and `mcporter call "<url>/mcp.<tool>" key=value` invokes one (`--allow-http` for a local `neon dev` URL). To wire it into a client interactively, `npx add-mcp <url>/mcp -a <agent>` writes the client config for you.
