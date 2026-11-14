# MCP servers on Neon Functions

A [Model Context Protocol](https://modelcontextprotocol.io) server is a textbook Neon Functions workload: it's a long-running HTTP handler that an AI client (Cursor, Claude, ChatGPT, an agent) calls to discover and invoke tools, and those tools usually read and write a database. Running it as a Neon Function puts the MCP server's compute next to its Postgres data, gives it a public HTTPS URL, and lets it branch with the rest of your backend — each branch gets its own MCP server against its own isolated data.

MCP's **streamable HTTP transport** is a plain `POST`/`GET` on a single endpoint (conventionally `/mcp`), so it maps directly onto a function's web-standard `fetch` handler — no `upgrade` method or extra protocol like [WebSockets](../SKILL.md#websocket-servers) needed. A Hono app is the simplest host.

## The server

Use the official [`@modelcontextprotocol/sdk`](https://github.com/modelcontextprotocol/typescript-sdk) for both the server and its Web Standard streamable HTTP transport. Neon Functions and Hono expose Web Standard `Request` and `Response` objects, so no transport adapter is needed. Tools query Postgres through Drizzle on a module-scope `pg` pool, exactly like any other function (see [Connecting to Postgres](../SKILL.md#connecting-to-postgres)).

```bash
npm install @modelcontextprotocol/sdk@^1.30.0 hono zod drizzle-orm pg @neon/functions
npm install -D @types/pg @types/node
```

SDK 1.30.0 is the first version that sends SSE keep-alives, so pin at least that.

```typescript
// src/index.ts
import { Hono } from "hono";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { attachDatabasePool } from "@neon/functions";
import { contacts } from "./db/schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
attachDatabasePool(pool);
const db = drizzle(pool);

function createServer() {
  const server = new McpServer({ name: "contacts", version: "1.0.0" });

  // Each tool: a name, a config (description + a Zod input schema), and a handler
  // that returns MCP content. The Zod shape becomes the tool's JSON schema, which
  // the client uses to call the tool correctly.
  server.registerTool(
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
      const [row] = await db
        .insert(contacts)
        .values({ name, email })
        .returning();
      return { content: [{ type: "text", text: JSON.stringify(row) }] };
    },
  );

  server.registerTool(
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

  return server;
}

const app = new Hono();

// Stateless servers never push on a standalone stream or end a session, so
// refuse GET and DELETE instead of holding an idle SSE stream open.
app.on(["GET", "DELETE"], "/mcp", (c) =>
  c.json(
    {
      jsonrpc: "2.0",
      error: { code: -32000, message: "Method not allowed." },
      id: null,
    },
    405,
    { Allow: "POST" },
  ),
);

app.post("/mcp", async (c) => {
  const server = createServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  await server.connect(transport);
  return transport.handleRequest(c.req.raw);
});

export default app;
```

Key points:

- **Official transport.** Default to `WebStandardStreamableHTTPServerTransport`. It matches the Neon Functions runtime directly and, from `@modelcontextprotocol/sdk` 1.30.0, sends SSE keep-alives every 15 seconds while a tool call runs. `@hono/mcp` sends no keep-alives on POST responses, so a slow tool call can hit a client's 30-second connection timeout.
- **Strict headers.** The official transport enforces the MCP `Accept` headers. Use `@hono/mcp` only as a compatibility fallback for a known client that does not send the required headers (see [the fallback](#fallback-for-non-compliant-clients)).
- **Per request.** Build a stateless server and transport for each request. Keep only the `pg` pool and other concurrency-safe resources at module scope (see [runtime limits](../SKILL.md#timeouts-and-runtime-limits)).
- **POST only.** A stateless server answers each POST on that request's own response, so it has no use for the standalone GET stream or a DELETE that ends a session. Return `405` with an `Allow: POST` header for both, as the SDK's stateless examples do. Otherwise a GET opens an SSE stream that nothing ever writes to, and it stays open until the client leaves or the function times out.
- **Cleanup.** No `close()` call is needed. The transport closes a POST's stream once the last response is sent, and clears the stream and its keep-alive timer if the client cancels. The per-request server and transport are then garbage collected.
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

Your Neon Function is the **resource server**. `honoMcp` verifies the token's signature, issuer, and audience, serves the protected-resource metadata, and answers unauthenticated requests with a `401` challenge. It sets `c.get("auth")`, whose `sub` is the user identity. Scope every tool to it. This server factory takes the caller's `userId`, and its tools close over it (the example assumes `contacts` has an `ownerId` column).

This code replaces the main example's `createServer`, `app`, and routes. Keep its imports, pool, and `db`:

```bash
npm install @neon/oauth
```

```typescript
import { and } from "drizzle-orm"; // eq, z, db, and contacts come from the main example
import { createMcpAuth } from "@neon/oauth/mcp";
import { honoMcp, type McpAuthVariables } from "@neon/oauth/mcp/hono";

function createUserServer(userId: string) {
  const server = new McpServer({ name: "contacts", version: "1.0.0" });

  // Register create_contact as in the main example, but insert
  // .values({ name, email, ownerId: userId }) so the row belongs to the caller.

  server.registerTool(
    "delete_contact",
    {
      title: "Delete contact",
      description: "Delete one of your contacts by id.",
      inputSchema: { id: z.number().int().positive() },
    },
    async ({ id }) => {
      const [row] = await db
        .delete(contacts)
        .where(and(eq(contacts.id, id), eq(contacts.ownerId, userId)))
        .returning();
      return {
        content: [
          { type: "text", text: JSON.stringify(row ?? { error: "not found" }) },
        ],
      };
    },
  );

  return server;
}

const mcpAuth = createMcpAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!, // the branch's Auth URL
  resource: process.env.MCP_RESOURCE!, // exactly the --mcp-resource value
});

const app = new Hono<McpAuthVariables>();
app.use(honoMcp(mcpAuth, { path: "/mcp" }));

app.on(["GET", "DELETE"], "/mcp", (c) =>
  c.json(
    {
      jsonrpc: "2.0",
      error: { code: -32000, message: "Method not allowed." },
      id: null,
    },
    405,
    { Allow: "POST" },
  ),
);

app.post("/mcp", async (c) => {
  const userId = c.get("auth").sub;
  const server = createUserServer(userId);
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  await server.connect(transport);
  return transport.handleRequest(c.req.raw, {
    authInfo: c.get("authInfo"),
  });
});

export default app;
```

Keep the `pg` pool at module scope. Never take the user id from tool arguments. Pass the raw Web Standard request and the verified MCP `AuthInfo` to the transport. Pass `NEON_AUTH_BASE_URL` and `MCP_RESOURCE` via the function's `env` in `neon.ts` (see [Environment variables](../SKILL.md#environment-variables)). `/mcp` has no CORS or `OPTIONS` handling from `honoMcp`, so add it for browser-based clients.

### Option 2 — API key or session JWT (simplest)

When the callers are your own agents/services or a personal MCP server, you don't need the OAuth flow. Either:

- **API keys** — issue and store your own keys, and have the function verify the `Authorization: Bearer <key>` (or an `x-api-key` header) on every request; or
- **Session JWT** — verify a Managed Auth JWT (`NEON_AUTH_JWKS_URL`, issuer from `NEON_AUTH_BASE_URL`) with `jose`, the same pattern used for the [agent backend](../SKILL.md#functions-as-an-agent-backend-nextjs-and-similar-frameworks).

Either way it's one check at the top of the `/mcp` route — reject anything that doesn't carry a valid key/token before connecting the transport:

```typescript
// Keep the GET/DELETE 405 route from the main example. Without it, Hono answers
// GET with 404, which MCP clients report as an error.
app.post("/mcp", async (c) => {
  const auth = c.req.header("authorization");
  if (!(await isValidApiKey(auth)))
    return c.json({ error: "unauthorized" }, 401);
  const server = createServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  await server.connect(transport);
  return transport.handleRequest(c.req.raw);
});
```

This keeps the secret server-side, costs nothing to operate, and is trivial to rotate — a solid default until you need third-party clients to self-authorize, at which point reach for Option 1.

## Fallback for non-compliant clients

The official transport returns `406` when a POST's `Accept` header does not list both `application/json` and `text/event-stream`. If a client you must support lists only one of them, or sends `*/*` or no `Accept` header, swap in [`@hono/mcp`](https://github.com/honojs/middleware/tree/main/packages/mcp). It accepts any of those by default:

```bash
npm install @hono/mcp
```

Replace only the transport lines inside your existing `/mcp` handler. Keep its auth check and its server factory (`createUserServer(userId)` with OAuth):

```typescript
import { StreamableHTTPTransport } from "@hono/mcp";

// Inside app.post("/mcp", ...), after the auth check and the server factory:
const transport = new StreamableHTTPTransport({
  sessionIdGenerator: undefined,
  // JSON-only clients need a JSON reply instead of an SSE stream.
  enableJsonResponse: !(c.req.header("accept") ?? "").includes(
    "text/event-stream",
  ),
});
await server.connect(transport);
return transport.handleRequest(c); // the Hono context, not c.req.raw
```

Things to know before you use it:

- **No keep-alives on POST.** `@hono/mcp` sends keep-alives only on GET streams, which a stateless server refuses. A tool call that runs longer than the client's connection timeout (often 30 seconds) fails. Use the fallback only for clients whose tool calls finish quickly.
- **JSON replies.** By default it answers every POST with an SSE stream, which a client that accepts only `application/json` may reject. The `enableJsonResponse` line above returns plain JSON to those clients.
- **Auth info.** `handleRequest` passes `c.get("auth")` to tools as their auth info. With `@neon/oauth`, that is Neon's verified result, not the MCP SDK's `AuthInfo`. Scope tools through the `userId` you pass to the factory, as in Option 1, rather than through the tool's auth info.

## Testing

Drive the server with any MCP client. [`mcporter`](https://github.com/instructa/mcporter) is a quick CLI for it — `mcporter list <url>/mcp --schema` lists the tools and `mcporter call "<url>/mcp.<tool>" key=value` invokes one (`--allow-http` for a local `neon dev` URL). To wire it into a client interactively, `npx add-mcp <url>/mcp -a <agent>` writes the client config for you.
