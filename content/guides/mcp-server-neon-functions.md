---
title: Build an MCP server for your app with Neon Functions and Managed Better Auth
subtitle: Add an OAuth-protected MCP server to your app so ChatGPT, Claude, and Cursor can call its tools as your signed-in users, then test it and connect it to ChatGPT.
author: tony-dang
enableTableOfContents: true
createdAt: '2026-11-18T00:00:00.000Z'
---

Your users already ask agents like ChatGPT and Claude to do work for them. An MCP server lets those agents use your app too: they call the tools you expose, signed in as the user they act for.

This guide shows you how to build an MCP server for an existing app. The server runs on [Neon Functions](/docs/compute/functions/overview), and [Managed Better Auth](/docs/auth/overview) secures it with OAuth, so users sign in with the account they already have. A coding agent with the Neon agent skills writes most of the code. You'll read what it built at each step, test the server, and connect it to ChatGPT.

<YoutubeIframe embedId="xwgdvbpVMG8" />

The example app is [mcp/place](https://github.com/thisistonydang/mcp-place-demo), a shared 5 by 5 grid with no controls in the UI. The only way to paint a square is to ask an agent. If you'd rather write every file by hand, [Build an MCP server with Managed Better Auth](/docs/compute/functions/mcp-server) covers the same setup with the Neon CLI and Next.js.

## What you'll build

When a user asks ChatGPT to "make A1 red," ChatGPT calls a `paint_square` tool on the MCP server. The server writes the color to Lakebase Postgres, and [Neon Realtime](/docs/realtime/overview) pushes the change to every browser showing the grid.

![The agent calls tools on an MCP server that runs as a Neon Function, protected by Managed Better Auth. The function writes to Lakebase Postgres, and Neon Realtime updates the web app.](/guides/images/mcp-server-neon-functions/01-architecture.png)

The pieces:

- **Lakebase Postgres** stores the grid in a `canvas_squares` table, one row per square.
- **A Neon Function** runs the MCP server at `/mcp`, built with Hono and the official MCP TypeScript SDK.
- **Managed Better Auth** is the OAuth 2.1 authorization server, through its [OAuth provider plugin](/docs/auth/guides/plugins/oauth-provider). Your app hosts the sign-in and consent pages.
- **The web app** is a Vite and React frontend on Vercel. Any host with a public HTTPS URL works.

<Admonition type="note">
The OAuth provider plugin and the `@neon/oauth` SDK are in beta ([changelog](/docs/changelog/2026-10-23)). Neon Realtime is also in beta. The MCP server doesn't depend on Realtime; mcp/place uses it only to update the grid live.
</Admonition>

## Prerequisites

- A [Neon account](https://console.neon.tech/signup) and a project in AWS US East (Ohio), AWS US East (N. Virginia), AWS Europe (Frankfurt), or AWS Asia Pacific (Singapore). These are the regions the MCP server setup supports today ([Build an MCP server](/docs/compute/functions/mcp-server#before-you-start)).
- A coding agent such as Cursor, Claude Code, or Codex. The video uses Pi.
- Node.js and pnpm, to run the app locally.
- A [Vercel](https://vercel.com) account, or another host for the frontend.

## Start from the canvas app

The starting app is the grid, a `canvas_squares` table with 25 rows, and a Neon Function that serves a live query of that table. Clone the repo and check out the first commit:

```bash
git clone https://github.com/thisistonydang/mcp-place-demo
cd mcp-place-demo
git checkout 2562a29
pnpm install
```

Each square is a row with an `x` column (`A` through `E`), a `y` column (`1` through `5`), and a `color`:

```typescript filename="db/schema.ts"
export const canvasSquares = pgTable(
  "canvas_squares",
  {
    x: text("x").notNull(),
    y: smallint("y").notNull(),
    color: canvasColor("color").notNull().default("white"),
  },
  (table) => [
    primaryKey({ columns: [table.x, table.y] }),
    check("canvas_squares_valid_x", sql`${table.x} in ('A', 'B', 'C', 'D', 'E')`),
    check("canvas_squares_valid_y", sql`${table.y} between 1 and 5`),
  ],
);
```

![Each row in canvas_squares is one square on the grid. Updating a row's color changes the square in the browser.](/guides/images/mcp-server-neon-functions/03-app-and-database.png)

To confirm the app works, change a row in the [SQL Editor](/docs/get-started/query-with-neon-sql-editor) and watch the square change in the browser:

```sql
UPDATE canvas_squares SET color = 'green' WHERE x = 'C' AND y = 3;
```

Agents shouldn't write to the database directly, though. The rest of this guide gives them a narrower way in: one tool that paints one square, called as a signed-in user.

## Install the Neon agent skills

The agent skills give your coding agent the context it needs to build on Neon, including how to build MCP servers on Neon Functions. Without them, you'd have to describe the sign-in page, the consent page, and the token checks yourself.

Paste this prompt into your coding agent, from the project root:

```text
Set me up for Neon. Fetch https://neon.com/prompts/agent-setup.md and follow it.
```

You can also copy the prompt from the [docs home page](/docs).

## Turn on Managed Better Auth

The app needs users before agents can act on their behalf.

1. In the [Neon Console](https://console.neon.tech), open your project and select **Better Auth** in the sidebar.
2. Click **Copy prompt** and paste it into your coding agent. You can also click **Enable** to set it up yourself.

The agent turns on auth in `neon.ts`, installs `@neon/auth`, adds an auth client to the frontend, and adds a sign-up page at `/signup`. The change to `neon.ts` is one line:

```typescript filename="neon.ts" {2}
export default defineConfig({
  auth: true,
  functions: {
    api: { /* ... */ },
  },
});
```

To check your work against the demo, compare it with commit [`445bb51`](https://github.com/thisistonydang/mcp-place-demo/commit/445bb51). The agent may also create a test user to check sign-up, which you'll see in the Console.

## How OAuth protects the MCP server

When an agent first connects, the MCP server has to answer one question: which user is this agent acting for? OAuth answers it. The user signs in, approves the agent, and the agent gets an access token it sends with every request.

![The first request has no token and gets a 401. The agent sends the user to the auth server to sign in and give consent, receives an access token, and calls the MCP server with it.](/guides/images/mcp-server-neon-functions/04-oauth-flow.png)

The OAuth provider plugin runs this flow for you. To turn it on, Managed Better Auth needs three URLs:

![The OAuth provider settings in the Neon Console need a login page URL and a consent page URL from your web app, and the URL of the MCP server function.](/guides/images/mcp-server-neon-functions/05-oauth-settings.png)

The app doesn't have a sign-in page, a consent page, or an MCP server yet. The next step builds all three.

## Build the MCP server

The MCP server exposes one tool, `paint_square`. It takes a column, a row, and a color. When the agent calls it, the server writes the color to the square's row, and Realtime updates the grid.

![The user asks the agent to paint A1 red. The agent calls paint_square with x "A", y 1, and color "red", the MCP server writes the row, and the canvas updates.](/guides/images/mcp-server-neon-functions/06-tool-call.png)

Give your coding agent this prompt:

```text
Add an MCP server to my app using Neon Functions. Use the Better Auth OAuth provider plugin for MCP server authentication, and add a paint_square tool that agents can call to paint squares on the grid.
```

You don't have to describe the sign-in and consent pages. The agent skills already cover them.

### The function

The agent adds a second function to `neon.ts`. Its `MCP_RESOURCE` variable is the function's own `/mcp` URL, which Managed Better Auth puts in each token as the audience:

```typescript filename="neon.ts"
export default defineConfig({
  auth: true,
  functions: {
    api: {
      name: "Canvas API",
      source: "functions/api/index.ts",
      env: { NEON_REALTIME_SECRET },
    },
    mcp: {
      name: "Canvas MCP Server",
      source: "functions/mcp/index.ts",
      env: { MCP_RESOURCE },
    },
  },
});
```

The server itself is a Hono app. `createMcpAuth` from `@neon/oauth` points at your Managed Better Auth URL, and the `honoMcp` middleware rejects any request to `/mcp` without a valid token. After that, `context.get("auth").sub` is the signed-in user's ID:

```typescript filename="functions/mcp/index.ts"
const mcpAuth = createMcpAuth({
  baseUrl: NEON_AUTH_BASE_URL,
  resource: MCP_RESOURCE,
});

const app = new Hono<McpAuthVariables>();
app.use(honoMcp(mcpAuth, { path: "/mcp" }));

app.all("/mcp", async (context) => {
  const userId = context.get("auth").sub;
  const server = createServer(userId);
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

  await server.connect(transport);
  return transport.handleRequest(context.req.raw, {
    authInfo: context.get("authInfo"),
  });
});
```

`createServer` registers `paint_square`. The input schema limits the arguments to valid squares and colors, and the handler upserts the row:

```typescript filename="functions/mcp/index.ts"
server.registerTool(
  "paint_square",
  {
    title: "Paint a square",
    description: "Paint one square on the shared 5 by 5 mcp/place grid.",
    inputSchema: {
      color: z.enum(canvasColors).describe("The new square color."),
      x: z.enum(["A", "B", "C", "D", "E"]).describe("Grid column from A through E."),
      y: z.number().int().min(1).max(5).describe("Grid row from 1 through 5."),
    },
  },
  async ({ color, x, y }) => {
    const [square] = await db
      .insert(canvasSquares)
      .values({ color, x, y })
      .onConflictDoUpdate({
        target: [canvasSquares.x, canvasSquares.y],
        set: { color },
      })
      .returning();
    const result = { paintedBy: userId, square };

    return {
      content: [{ type: "text", text: JSON.stringify(result) }],
      structuredContent: result,
    };
  },
);
```

The full file, with CORS headers and error messages, is [`functions/mcp/index.ts`](https://github.com/thisistonydang/mcp-place-demo/blob/main/functions/mcp/index.ts).

### The sign-in and consent pages

The agent adds two routes to the frontend:

- **`/auth/sign-in`** signs the user in, then resumes the authorization request with `oauth2.continue({ selected: true })`. If the user is already signed in, it resumes right away.
- **`/auth/consent`** loads the client's name and redirect hosts with `oauth2.publicClient`, shows them with the requested scope, and calls `oauth2.consent({ accept })` when the user clicks **Allow** or **Deny**.

It also adds a `frame-ancestors 'none'` header for `/auth/*` in `vercel.json`, so other sites can't embed the pages. These are the [page requirements](/docs/compute/functions/mcp-server#what-your-sign-in-and-consent-pages-must-do) for any framework. Compare your work with commit [`91a80cc`](https://github.com/thisistonydang/mcp-place-demo/commit/91a80cc).

### The OAuth provider settings

In the Console, go to **Settings** > **Better Auth** and scroll to **OAuth provider**. The agent has filled in the login page URL, the consent page URL, and the MCP server URL.

Under the server URL, **Client ID Metadata Documents** (CIMD) is on by default. With CIMD, clients like ChatGPT and Claude identify themselves with a URL, so you don't create an OAuth client for each one. Turn on **Dynamic client registration (legacy)** only if you need to support a client that can't use CIMD ([OAuth provider](/docs/auth/guides/plugins/oauth-provider#client-id-metadata-documents)).

## Deploy the frontend

The login and consent URLs point at `localhost`. That works for development, but ChatGPT and other remote clients can only complete the OAuth flow against a public HTTPS origin. Deploy the frontend with this prompt:

```text
Deploy my frontend to Vercel as a new project with the name mcp-place-demo, and update my login and consent page URLs on Neon.
```

Back in **Settings** > **Better Auth**, check two things:

- The login and consent page URLs now use your Vercel domain, for example `https://mcp-place-demo.vercel.app/auth/sign-in`.
- The Vercel domain is listed under **Domains** > **Your trusted domains**. Managed Better Auth only redirects to trusted domains ([Configure trusted domains](/docs/auth/guides/configure-domains)).

## Test the server

Test the server before you connect a production client. Copy the MCP server URL from the OAuth provider section. It ends in `/mcp`.

![Testing goes from protocol checks with MCP Inspector or mcporter, to cross-client testing with MCPJam, to store readiness checks with Manufact, to production clients.](/guides/images/mcp-server-neon-functions/07-testing-path.png)

For low-level checks, [MCP Inspector](https://github.com/modelcontextprotocol/inspector) is the official testing tool from the MCP project, and [mcporter](https://github.com/steipete/mcporter) tests servers from the command line. This guide uses two tools with a web UI: MCPJam and Manufact.

### Test across clients with MCPJam

[MCPJam](https://www.mcpjam.com) runs your server's tools against several AI clients at once.

1. Create a free account at [app.mcpjam.com](https://app.mcpjam.com) and open the **Connect** tab.
2. Click **Add Server**, enter a name and your MCP server URL, and leave **Authentication** on **Auto**.
3. MCPJam starts the OAuth flow and opens your sign-in page on Vercel. Create an account, sign in, and click **Allow** on the consent page.

MCPJam then shows the server as connected. In the **Playground** tab, it lists `paint_square`. Set a color and a square, then click **Run** to call the tool in Claude, ChatGPT, and Cursor side by side. Each client should return the same result: the painted square and the `paintedBy` user ID from your sign-in.

### Check plugin store requirements with Manufact

Passing the MCP spec is enough to connect a client, but ChatGPT and Claude have more requirements before a server can be listed in their plugin stores. [Manufact](https://manufact.com) checks for them.

1. Create a free account and choose **Connect an existing server**.
2. Paste your MCP server URL, click **Connect MCP**, and complete the same OAuth flow.
3. Open **Checklist** and click **Run checklist**.

The first run of mcp/place scored 88 out of 100: 19 checks passed and 2 failed, so Manufact marked it **Not ready to submit**. Both errors were the same problem. OpenAI and Claude require tool annotations, and `paint_square` had none.

Manufact writes a prompt that fixes the failed checks. Click **Copy fix prompt** and paste it into your coding agent.

### Add tool annotations

Tool annotations are optional hints that describe how a tool behaves. Clients use them to decide whether to ask the user before calling the tool. The agent adds four to `paint_square`:

```typescript filename="functions/mcp/index.ts" {6-11}
server.registerTool(
  "paint_square",
  {
    title: "Paint a square",
    description: "Paint one square on the shared 5 by 5 mcp/place grid.",
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: true,
      openWorldHint: true,
    },
    inputSchema: { /* ... */ },
  },
  // ...
);
```

![paint_square sets readOnlyHint to false, and destructiveHint, idempotentHint, and openWorldHint to true.](/guides/images/mcp-server-neon-functions/08-tool-annotations.png)

Set the annotations to match what each of your tools does:

- `readOnlyHint` is `false` because the tool changes a square.
- `destructiveHint` is `true` because the previous color is overwritten.
- `idempotentHint` is `true` because painting A1 red twice leaves A1 red.
- `openWorldHint` covers tools that may interact with "an open world of external entities" ([MCP spec](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations)). mcp/place sets it to `true` because the canvas is public.

ChatGPT treats a tool without `readOnlyHint` as a write ([Build an MCP server](/docs/compute/functions/mcp-server#write-the-mcp-server)), so set it to `true` on tools that only read.

Run the Manufact checklist again. This time every check passes. Compare your work with commit [`eadb7ff`](https://github.com/thisistonydang/mcp-place-demo/commit/eadb7ff).

## Connect ChatGPT

1. In ChatGPT, open **Plugins** and add a custom MCP server.
2. Enter a name and your MCP server URL, the function URL ending in `/mcp`, not the Vercel URL. Set **Authentication** to **OAuth**.
3. Read the safety notice, check **I understand and want to continue**, and click **Create as a plugin**.
4. Complete the sign-in and consent flow.

If writes fail with an error like "Unknown tool" while reads work, open the connector's details and allow write tools. After you change tools on the server, refresh the connector or start a new chat, because ChatGPT caches the tool list ([Connect ChatGPT](/docs/compute/functions/mcp-server#connect-chatgpt)).

Start a new chat and ask ChatGPT to change B4 to blue and D2 to purple. It calls `paint_square` once for each square and replies that both are done. Open your app in another tab: B4 and D2 change color without a reload.

## Next steps

- **Scope tools to the user.** `paint_square` writes to a shared grid. For per-user data, filter every query by the token's `sub`, as the [to-do example](/docs/compute/functions/mcp-server#write-the-mcp-server) does. Never take the user ID from tool input.
- **Serve the MCP server from your domain.** Register a [custom domain](/docs/compute/functions/custom-domains) for the function, such as `https://mcp.example.com/mcp`.
- **Test on a branch.** Each branch has its own OAuth settings, trusted domains, and issuer, and tokens from one branch don't work on another branch's server ([Branching authentication](/docs/auth/branching-authentication)).

## Resources

- [mcp/place demo repo](https://github.com/thisistonydang/mcp-place-demo)
- [Build an MCP server with Managed Better Auth](/docs/compute/functions/mcp-server)
- [OAuth provider plugin](/docs/auth/guides/plugins/oauth-provider)
- [Neon Functions](/docs/compute/functions/overview)
- [Neon Realtime](/docs/realtime/overview)
- [MCP tool annotations](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations)
