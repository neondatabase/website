---
title: Build your own Neon MCP server with Neon tools
subtitle: "Learn how to expose Neon operations as tools in your own agent runtime."
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-09-04T00:00:00.000Z'
updatedOn: '2026-09-14T06:50:40.725Z'
---

If you're embedding Neon operations into your own agent runtime, you need a way to expose them as tools: an MCP server for your team, an agent built with a framework like Mastra or Eve, or a dev tool that resets test data. The Model Context Protocol (MCP) lets you publish a catalog of tools with input validation, approval metadata, and auto-pagination for lists. You can then connect your agent to the catalog over stdio or HTTP.

The hosted [Neon MCP Server](/docs/ai/neon-mcp-server) already gives you this by default. It pairs 19 workflow tools for SQL, migrations, diagnostics, docs, and search with 85 Management API tools across projects, branches, endpoints, snapshots, auth, storage, and more. It adds OAuth, category filtering, readonly mode, and project scoping, so you can connect Claude Code, Cursor, or any MCP client.

[`@neon/tools`](https://github.com/neondatabase/neon-pkgs/tree/main/packages/tools) gives you the same building blocks for your own server. You pick the SDK operations to expose, such as `projects.list` for listing projects or `branches.createAndConnect` for creating a ready-to-use branch, and customize how each one appears to the model. Each selection becomes a tool with a Zod schema, flat snake-case inputs, auto-pagination for lists, readiness polling for writes, and approval metadata. The MCP adapter then publishes that catalog with model-facing IDs like `list_projects` and `create_and_connect_branches`.

Choose the approach that fits your workflow:

| Approach                                      | When to use it                       | What you get                                                                                                     |
| --------------------------------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Hosted Neon MCP Server                        | Connect your own agent to Neon       | Full catalog with 19 workflow plus 85 API tools, OAuth, readonly mode, and project scoping. No code to maintain. |
| Custom server with `@neon/tools` (this guide) | Embed Neon tools in your own runtime | Subset catalog, project injection, custom names and descriptions, logging, and multi-tenant HTTP.                |

In this tutorial, you'll build a minimal MCP server with five project and branch tools, run it over stdio, and connect it to Claude Code. You'll then customize it with project injection, custom names and descriptions, and logging. Finally, you'll serve the same catalog remotely over HTTP so multiple agents can call it with their own credentials. The same pattern scales when you add snapshots, endpoints, auth, storage, and functions that the `@neon/tools` package already exposes.

## How credentials flow

Before you start, decide how your server will handle Neon credentials. There are two patterns:

**Single credential, held by the server.** You set `NEON_API_KEY` once, and every tool call runs against that account. This is the stdio pattern covered in the first part of this guide: one user, one agent, one key. It fits a personal coding agent or an internal tool where the operator owns the Neon account.

**Per-request credential, brought by the client.** The server holds no key at all. Each client sends its own token with every request, and tools execute against that client's account. This is the HTTP pattern covered in the final section. The token is the tenant boundary: your server never sees or stores a Neon credential, and a client can only reach projects its token grants.

## Prerequisites

Before you begin, make sure you have the following:

- **Node.js:** Version `22` or later. Download from [Node.js](https://nodejs.org/en/download/).
- **Neon account and project:** A Neon account with at least one project. Sign up at [Neon](https://console.neon.tech/signup) if you do not have one.

<Steps>

## Generate a Neon API key

To allow programmatic access to Neon, you need a Neon API key. Your server uses it to call the Neon API and manage branches on demand.

1. In the Neon Console, open your organization settings and select **API keys**.
2. Click **Create new API key** and give it a name (for example, "custom MCP server").
   ![Create Neon API key](/docs/manage/org_api_keys.png)

   <Admonition type="tip" title="Use an org-wide key">
   Choose **org-wide** for the key type, which allows the server to manage branches across all projects in your organization.
   </Admonition>

3. Copy the generated API key.

To create keys with the CLI or API instead, see [Manage API keys](/docs/manage/api-keys#creating-api-keys).

## Select the tools you want to expose

You will expose five SDK methods as MCP tools:

| SDK path you select         | MCP tool ID the model sees    | What it does                                                     |
| --------------------------- | ----------------------------- | ---------------------------------------------------------------- |
| `projects.list`             | `list_projects`               | Lists projects with auto-pagination                              |
| `branches.list`             | `list_branches`               | Lists branches for a project                                     |
| `branches.createAndConnect` | `create_and_connect_branches` | Creates a branch, waits until ready, returns a connection string |
| `branches.resetFromParent`  | `reset_from_parent_branches`  | Resets a branch from its parent with an optional preserve copy   |
| `branches.compareSchema`    | `compare_schema_branches`     | Diffs schema for a database on a branch                          |

The complete selector list is exported as `toolIds` from `@neon/tools`. View the [`toolIds` source](https://github.com/neondatabase/neon-pkgs/blob/main/packages/tools/src/lib/ergonomic/ids.ts) for the full set of SDK paths you can expose. Each path publishes to the model as a snake-case tool ID: `projects.list` becomes `list_projects`, `branches.createAndConnect` becomes `create_and_connect_branches`, and so on.

## Scaffold the server project

Create a new directory and install dependencies:

```bash
mkdir neon-custom-mcp && cd neon-custom-mcp
npm init -y
npm install @neon/tools @modelcontextprotocol/server
npm install -D typescript @types/node tsx
npx tsc --init
```

The `@neon/tools` package is the SDK adapter that builds a catalog of tools. The MCP server package publishes that catalog over stdio or HTTP. Zod is the schema library used for input validation. TypeScript and `tsx` are for building and running the server.

Update `tsconfig.json` for ESM and strict validation:

```json filename="tsconfig.json"
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "types": ["node"],
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["src/**/*"]
}
```

Create a `.env` file in the project root and add your Neon API key copied from the [Generate a Neon API key](#generate-a-neon-api-key) step:

```bash
NEON_API_KEY="your_neon_api_key"
```

## Create the tool catalog

Create `src/tools.ts` to select the five tools you want to expose:

```typescript filename="src/tools.ts"
import { createNeonTools } from "@neon/tools";

const apiKey = process.env.NEON_API_KEY;
if (!apiKey) throw new Error("NEON_API_KEY is required");

export const tools = createNeonTools({
  apiKey,
  tools: [
    "projects.list",
    "branches.list",
    "branches.createAndConnect",
    "branches.resetFromParent",
    "branches.compareSchema",
  ] as const,
  wait: { timeoutMs: 30_000 },
});
```

The `createNeonTools()` function builds a catalog with Zod schemas, input validation, and approval metadata. The `tools` record is keyed by the SDK path you selected, so `tools["projects.list"]` maps directly to the client method. Each entry has an `execute()` method that takes a flat input object and returns a promise with the result. The catalog has two important behaviors:

- **Flat inputs with auto-pagination:** List tools take `limit` and return the item array with pagination handled for you.
- **Readiness waits on writes:** Write tools run with `waitForReadiness: true`, so a branch create waits for its operations before it resolves. The default deadline is five minutes. Here it is capped at 30 seconds so it stays below typical host timeouts.

You can test the catalog with a script that lists the first five projects:

```typescript filename="src/smoke.ts"
import { tools } from "./tools.js";

const main = async () => {
    const listed = await tools["projects.list"].execute({ limit: 5 });
    console.log(listed.data.map((p) => p.name));
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
```

Run it with:

```bash
npx tsx --env-file=.env src/smoke.ts
```

You should see an array of project names. If you get an error, check your `NEON_API_KEY` in `.env`.

## Register tools with an MCP server

The MCP adapter publishes your selected catalog through `registerNeonTools()`.

Create `src/index.ts` to wire the catalog to an MCP server over stdio:

```typescript filename="src/index.ts"
import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { registerNeonTools } from "@neon/tools/mcp";
import { tools } from "./tools.js";

const server = new McpServer({ name: "neon-custom", version: "1.0.0" });

registerNeonTools(server, tools);

const main = async () => {
    await server.connect(new StdioServerTransport());
};

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
```

<Admonition type="note" title="Using MCP 1.x?">
This code uses the MCP 2.x SDK. If you're maintaining an older MCP 1.x server, import from `@neon/tools/mcp-v1` instead. Your tool IDs and `execute()` behavior stay the same; only the schema format changes.
</Admonition>

## Connect your coding agent to the server

Point your client at the local server over stdio. Use an absolute path to `src/index.ts`.

<Tabs labels={["Claude Code", "opencode"]}>
<TabItem>

Create `.mcp.json` in your project root:

```json filename=".mcp.json"
{
  "mcpServers": {
    "neon-custom": {
      "command": "npx",
      "args": ["tsx", "/absolute/path/to/neon-custom-mcp/src/index.ts"],
      "env": {
        "NEON_API_KEY": "your_neon_api_key"
      }
    }
  }
}
```

> Replace `/absolute/path/to/neon-custom-mcp/src/index.ts` with the absolute path to your `src/index.ts` file, and `your_neon_api_key` with your Neon API key.

Run `claude` in your project directory and select **Use this MCP server** when prompted. You should see the following output:

```bash
$ claude
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  New MCP server found in this project: neon-custom

  MCP servers may execute code or access system resources. All tool calls require approval. Learn more in the MCP
  documentation.

  ❯ Use this MCP server
    Use this and all future MCP servers in this project
    Continue without using this MCP server
```

Exit the session and run the following command to list the connected MCP servers:

```text
$ claude mcp list
neon-custom: npx tsx /absolute/path/to/neon-custom-mcp/src/index.ts - ✔ Connected
```

You should see `neon-custom` listed as connected.

</TabItem>
<TabItem>

Add the server to your opencode config. Create `opencode.jsonc` in your project root, or add the `mcp` block to your existing config:

```json filename="opencode.jsonc"
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "neon-custom": {
      "type": "local",
      "command": ["npx", "tsx", "/absolute/path/to/neon-custom-mcp/src/index.ts"],
      "enabled": true,
      "environment": {
        "NEON_API_KEY": "your_neon_api_key"
      }
    }
  }
}
```

> Replace `/absolute/path/to/neon-custom-mcp/src/index.ts` with the absolute path to your `src/index.ts` file, and `your_neon_api_key` with your Neon API key.

Verify the server connects by starting an opencode session in your project directory and running the `/mcp` command. You should see `neon-custom` listed as connected.

</TabItem>
</Tabs>

<Admonition type="tip" title="Using other clients?">
The same stdio command works for Cursor, Codex, Windsurf, Zed, and Cline. Any client that accepts `command`, `args`, and `env` for a local MCP server can launch this file. Check your client's documentation for how to configure local MCP servers.
</Admonition>

## Try branch workflows from prompts

Open a new agent session in your project directory and confirm that the server works by using the five tools you exposed. The agent will call the server over stdio, which calls the Neon API with your key.

Start with discovery:

```text shouldWrap
List my Neon projects and then list branches for the first project.
```

Then create an isolated branch for testing:

```text shouldWrap
Create a branch named 'mcp-test' from the main branch. Return the connection string and branch ID.
```

Because this is a write tool, your client may ask for approval first. The package marks every non-read operation as requiring approval, along with reads that return credentials. The protocol does not enforce it, so keep your client's approval setting on.

Next, compare schemas without writing SQL by hand:

```text shouldWrap
Compare schema between the mcp-test branch and main.
```

If you want to throw away test changes and start over:

```text shouldWrap
Reset branch mcp-test from its parent. Preserve the current state under mcp-test-before-reset.
```

## Customize names, inputs, and logging

You can change how the catalog appears to the model without changing the underlying SDK. This is useful when you want to hide fields, rename tools, or add workflow-specific guidance.

### Fix project context with injection

Tools take `project_id` as an input. A host that already knows the project can inject it instead, so the agent never has to guess or pass it. This works in two ways depending on your credential model.

With a server-held key, inject a fixed project to lock the server to it. This pairs a single credential with a single project, useful when the server exists to serve one codebase:

```typescript filename="src/scoped-tools.ts"
import { createNeonTools } from "@neon/tools";

export const scopedTools = createNeonTools({
  apiKey: process.env.NEON_API_KEY!,
  tools: ["branches.list", "branches.createAndConnect"] as const,
  inject: {
    projectId: process.env.NEON_PROJECT_ID!,
    omitFromSchema: true,
  },
});
```

With `omitFromSchema: true`, the agent calls `list_branches` without a `project_id`, and your server fills it in. Without it, the field stays optional and a caller-supplied value takes precedence. An empty inject value fails closed rather than silently matching nothing.

For the [HTTP server](#serve-the-same-catalog-remotely-over-http), the server holds no key and each client brings its own. You can still inject a project ID per request: pass a getter as the `inject` value and read the caller's identity from your own request context. See the [project and branch injection docs](https://github.com/neondatabase/neon-pkgs/tree/main/packages/tools#project-and-branch-injection) for an `AsyncLocalStorage` example.

### Offer a narrow variant

Filter the selector list when a workflow only needs exploration. You keep one codebase and publish different catalogs per use case.

```typescript
const READONLY = process.env.READONLY === "true";

const toolNames = READONLY
  ? (["projects.list", "branches.list"] as const)
  : (["projects.list", "branches.list", "branches.createAndConnect"] as const);
```

### Keep stable names and add workflow hints

Use `names` to set the published ID and `descriptions` to add workflow-specific guidance. Keys can be SDK paths or published IDs.

```typescript
export const renamedTools = createNeonTools({
  apiKey: process.env.NEON_API_KEY!,
  tools: ["projects.get", "branches.delete"] as const,
  names: { "projects.get": "describe_project" },
  descriptions: {
    delete_branches: "Delete a Neon branch and all its data. Ask the user for branch ID confirmation first.",
  },
});
```

The record stays keyed by SDK path (`renamedTools["projects.get"]`), while MCP publishes `describe_project`.

### Add logging

Use `onExecute` to log tool use. You must call `event.execute()` inside the wrapper, since that is what runs validation, injection, auth, and the API request.

```typescript
export const loggedTools = createNeonTools({
  apiKey: process.env.NEON_API_KEY!,
  tools: ["projects.list"] as const,
  onExecute: async ({ id, execute }) => {
    console.log(`[neon] tool call: ${id}`);
    return execute();
  },
});
```

This package sends no analytics on its own. Add your own logger here if you need audit trails for internal use.

## Serve the same catalog remotely over HTTP

The stdio server works when one client launches your server locally. Agent platforms usually need the opposite shape: one deployed server that many agents call over HTTP, each with their own credentials. Streamable HTTP in the MCP 2.x SDK handles this with a per-request factory, and `registerNeonTools()` supports it without changing your catalog.

The key change: the server no longer holds a Neon API key. Each client supplies its own as a bearer token, and `registerNeonTools()` picks it up from the MCP request's `authInfo`. Your deployed server becomes credential-free.

### Install dependencies

Install the Node.js transport adapter for MCP 2.x:

```bash
npm install @modelcontextprotocol/node
```

### Build a per-request server factory

Replace `src/index.ts` with `src/http.ts`. Instead of one long-lived `McpServer`, the handler builds a fresh instance per request:

```typescript filename="src/http.ts"
import { McpServer, createMcpHandler, type AuthInfo } from "@modelcontextprotocol/server";
import { toNodeHandler, localhostHostValidation, localhostOriginValidation } from "@modelcontextprotocol/node";
import { createServer, type IncomingMessage } from "node:http";
import { createNeonTools } from "@neon/tools";
import { registerNeonTools } from "@neon/tools/mcp";

const tools = createNeonTools({
    tools: ["projects.list", "branches.list", "branches.createAndConnect"] as const,
    wait: { timeoutMs: 30_000 },
});

const handler = createMcpHandler(() => {
    const server = new McpServer({ name: "neon-custom", version: "1.0.0" });
    registerNeonTools(server, tools);
    return server;
});

const nodeHandler = toNodeHandler(handler);
const validateHost = localhostHostValidation();
const validateOrigin = localhostOriginValidation();

createServer((req, res) => {
    if (!validateHost(req, res) || !validateOrigin(req, res)) return;
    const token = req.headers.authorization?.replace(/^Bearer /, "");
    if (!token) {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "missing bearer token" }));
        return;
    }
    // MCP 2.x expects auth info on the request object. Typecast to add it.
    const authenticatedReq = req as IncomingMessage & { auth?: AuthInfo };
    authenticatedReq.auth = { token, clientId: "neon-custom", scopes: [] };
    void nodeHandler(authenticatedReq, res);
}).listen(3000, "127.0.0.1");
```

Here, `createNeonTools()` takes no `apiKey`. A credential is only needed when a tool executes, and that credential arrives per request. This example trusts any bearer token and passes it straight through to Neon, where an invalid token fails with an API error.

<Admonition type="important" title="Verify tokens in production">
In a real deployment, verify the token yourself before setting `req.auth`, for example by looking it up in your session store, so only your application's users can reach the handler.
</Admonition>

### Test the remote server

Start the server and list tools with a raw HTTP call:

```bash
npx tsx src/http.ts
```

```bash
curl -X POST http://127.0.0.1:3000/mcp \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2026-07-28","capabilities":{},"clientInfo":{"name":"curl","version":"1.0.0"}}}'
```

A successful initialize response advertises your server and protocol version.

### Connect from Claude Code and opencode

Before deploying, confirm real MCP clients can drive the server the same way they will in production. Both Claude Code and opencode accept remote HTTP servers with a bearer-token header.

<Tabs labels={["Claude Code", "opencode"]}>
<TabItem>

Add the server as a remote HTTP server, then check it connected:

```bash
claude mcp add --transport http neon-local http://127.0.0.1:3000/mcp \
  --header "Authorization: Bearer $NEON_API_KEY"

claude mcp list
```

`claude mcp list` shows a health status per server; `✔ Connected` means the handshake and tool discovery succeeded. You can verify the server works by prompting `List my Neon projects` and confirming the tool call runs.

</TabItem>
<TabItem>

Add a remote entry to `opencode.jsonc`:

```json filename="opencode.jsonc"
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "neon-local": {
      "type": "remote",
      "url": "http://127.0.0.1:3000/mcp",
      "headers": {
        "Authorization": "Bearer $NEON_API_KEY"
      }
    }
  }
}
```

</TabItem>
</Tabs>

> Replace `$NEON_API_KEY` with your Neon API key

If either client fails to connect, check the server logs for the request: a missing or malformed `Authorization` header means the header wasn't passed, and a `403` means the Host or Origin guards rejected the client's request rather than the token check.

### Deploy it

The handler is stateless and scales horizontally. Deploy the same file anywhere Node runs: a container, a serverless platform, or a VPC service.

<Admonition type="warning" title="Secure the deployment">
Keep the server behind TLS and mount the token verification in front of the handler; the handler itself validates neither tokens nor headers.
</Admonition>

</Steps>

## Conclusion

You built a custom Neon MCP server, both locally over stdio and remotely over HTTP. You picked the SDK operations your agent requires, shaped how each tool appears to the model, kept naming, inputs, and logging in your own code, and deployed a credential-free server where each client brings its own key. Reach for this pattern when the hosted server's fixed catalog doesn't fit and you're comfortable owning the auth layer yourself. For example: a team exposing only the few operations its workflow needs, or a runtime that already has its own user model and needs Neon operations behind it. If you need Neon-issued tokens and per-user project access without building that layer, the hosted [Neon MCP Server](/docs/ai/neon-mcp-server) is the better fit.

From here you can add snapshots, endpoints, Data API config, Functions, Object Storage, or Managed Better Auth by extending the `tools` array. The complete selector list is exported as `toolIds` from `@neon/tools` (see the [`toolIds` source](https://github.com/neondatabase/neon-pkgs/blob/main/packages/tools/src/lib/ergonomic/ids.ts)), and adapter examples are in the [`@neon/tools` README](https://github.com/neondatabase/neon-pkgs/tree/main/packages/tools).

## Resources

- [@neon/tools on GitHub](https://github.com/neondatabase/neon-pkgs/tree/main/packages/tools)
- [Neon MCP Server reference](/docs/ai/neon-mcp-server)
- [Neon Management SDK](/docs/reference/typescript-sdk)
- [About branching](/docs/introduction/branching)
- [Model Context Protocol](https://modelcontextprotocol.io/docs)

<NeedHelp/>
