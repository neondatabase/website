I want to give my app an MCP server that my customers connect from Claude, Cursor, or ChatGPT. Each customer signs in with their existing account, and every tool reads and writes only that customer's rows. Build it on Neon: the MCP server runs on Neon Functions, Managed Better Auth is the OAuth authorization server, and my app hosts the sign-in and consent pages.

Use this guide as the reference:
https://neon.com/docs/compute/functions/mcp-server.md

Supporting docs:

- OAuth provider (page requirements, CIMD, token verification): https://neon.com/docs/auth/guides/plugins/oauth-provider.md
- `@neon/oauth` SDK reference: https://github.com/neondatabase/neon-pkgs/tree/main/packages/oauth
- Managed Better Auth with Next.js: https://neon.com/docs/auth/quick-start/nextjs-api-only.md
- Trusted domains: https://neon.com/docs/auth/guides/configure-domains.md
- Branching authentication: https://neon.com/docs/auth/branching-authentication.md
- CLI references: https://neon.com/docs/cli/functions.md and https://neon.com/docs/cli/neon-auth.md

Use these libraries:

- MCP server (Neon Function): `@neon/oauth` 0.3.0 or later (`createMcpAuth` from `@neon/oauth/mcp`, `honoMcp` from `@neon/oauth/mcp/hono`), `@modelcontextprotocol/sdk` 1.25.0 or later (`McpServer`, `WebStandardStreamableHTTPServerTransport`), `hono`, `pg` with `attachDatabasePool` from `@neon/functions`, and `zod`.
- Sign-in and consent pages: `@neon/auth` 0.8.0 or later (`oauth2.continue`, `oauth2.publicClient`, `oauth2.consent`).
- `@neon/config` for `neon.ts`.

Before writing code:

1. Inspect my project. If I don't have an app yet, create a Next.js 16 or later app with `npx create-next-app@latest`. If my app isn't Next.js, build the pages in my framework and follow the guide's "What your sign-in and consent pages must do" list.
2. Check that the Neon CLI is authenticated with `neon me`. If it isn't, run `neon login` and wait for me to finish signing in.
3. Install the agent skills: `neon skills -s neon -s neon-functions -s neon-auth -y`. Where a skill and the guide differ, follow the guide.
4. Run `neon link`, then `neon checkout --create <branch>` before any other Neon command, so all work happens on a development branch, not production.
5. Ask only what you need: which data and tools the server should expose, which MCP clients I care about, where my app is deployed (it needs a public HTTPS origin), and whether I want the optional MCP Apps widget for ChatGPT.
6. Propose a concise plan and wait for my confirmation before making significant changes.

Follow these rules from the guide:

- Enable Managed Better Auth with `auth: true` in `neon.ts` and `neon deploy`, as in the guide.
- Protect every route except `/` and the sign-in and sign-up pages, so the consent page always has a session. Block framing of the auth pages with a `frame-ancestors 'none'` header in `next.config.ts` `headers()`.
- Take the user ID only from the verified token's `sub`, and filter every query by it. Never take a user ID from tool input.
- Build a new `McpServer` per request so the tools close over `sub`. Keep the `pg` pool at module scope.
- `MCP_RESOURCE` must be the function's own `/mcp` URL. Choose the function slug carefully, because it can't change after the first deploy. Deploy once with `neon functions deploy <slug> --src <dir>` to get the URL, then deploy again with the same command plus `--env MCP_RESOURCE=<url>`. Until then, a new function returns `502`, and a function inherited from the parent branch serves the parent's `MCP_RESOURCE`. A redeploy can take a few minutes to serve, so poll the protected resource metadata instead of assuming. The guide keeps the function out of `neon.ts` for this two-step setup. Declaring it in `neon.ts` with `env: { MCP_RESOURCE: process.env.MCP_RESOURCE! }` and deploying with `neon deploy --env .env.local` also works once you know the URL; `neon deploy` and `neon checkout --create` then refuse to run until the value is set.
- Add my app's origin as a trusted domain, then enable the OAuth server with `neon neon-auth config oauth-server update --enabled` and `--login-page`, `--consent-page`, `--mcp-resource`, and `--mcp-client-id-metadata-documents`.
- On the sign-in page, resume with `oauth2.continue` only when the URL has `client_id` and `response_type`.
- On the consent page, read `window.location.search` in an effect, not during render.
- On a child branch, point both `MCP_RESOURCE` and `--mcp-resource` at that branch's function URL.

If I want the optional MCP Apps widget, follow the guide's "Render todos in chat with MCP Apps" section and https://modelcontextprotocol.io/extensions/apps/overview:

- Put the widget HTML in a TypeScript module so `neon functions deploy` bundles it. Don't read a sibling `.html` file with `readFileSync`.
- Register the UI as two resources: an MCP Apps resource (`text/html;profile=mcp-app`) and the ChatGPT skybridge variant (`text/html+skybridge`).
- Point the tool at the UI with `_meta` (`ui.resourceUri`, `ui/resourceUri`, `openai/outputTemplate`, `openai/widgetAccessible`), and return a short text summary plus `structuredContent`.
- If the widget calls tools (for example a Complete button), fetch the list again after the call and re-render.
- If the widget loads anything from another origin, declare those domains in the resource's `_meta.ui.csp`: https://developers.openai.com/plugins/build/chatgpt-ui#content-security-policy-csp

After implementation, run the guide's "Verify the server" checks, show me how to connect my MCP clients, and test isolation with two users. If something fails, explain the likely cause and help me troubleshoot before making unrelated changes.

Run Neon commands from the linked directory so they target the checked-out branch. If you pass `--project-id`, also pass `--branch`, or the command targets the default branch. When you need to inspect or query my database, use `neon psql` and pass the correct branch name. Never run destructive commands against my database (`DELETE`, `UPDATE`, `DROP`, `TRUNCATE`, and similar) without showing me the exact command and getting my approval. If `neon deploy` asks for `--allow-protected`, `--update-existing`, or `-y`, show me the changes it printed and ask me before re-running with any of them.
