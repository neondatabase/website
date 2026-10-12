# Self-managed Better Auth

Use this page only after `SKILL.md` routed here: a required feature is outside Managed Auth, and the installed Better Auth version documents that flow. If that check fails, keep the current identity.

## Keep existing Better Auth

If the app already runs Better Auth, keep that server, its clients, users, and sessions. It works with Lakebase Postgres, Functions, Object Storage, and the AI Gateway. Do not migrate it to Managed Auth unless the user asks.

## New self-managed server

Host it on the existing app (Vercel route handlers, or similar) when that host already serves `/api/auth`. Use a Neon Function when the auth server should sit next to Postgres, or when the Function itself must be an OAuth authorization server (MCP). Function hosting follows the `neon-functions` skill (region, claim, `neon.ts`, `neon deploy --env <file>`).

Keep Lakebase Postgres as the auth database. Use `better-auth` and `better-auth/client`. Fetch upstream docs for the **installed** version:

- https://better-auth.com/docs/installation
- https://better-auth.com/docs/concepts/client
- https://better-auth.com/docs/concepts/plugins

Do not pass `plugins` into `@neondatabase/auth`. Replacing only the client package while Managed Auth is still the backend does not add plugins.

MCP OAuth (Cursor, Claude, and similar clients self-authorizing) is `neon-functions` [references/mcp.md](https://neon.com/docs/ai/skills/neon-functions/references/mcp.md). That can sit beside existing Clerk or Managed login. Do not migrate the whole app's identity unless that was the request.

Function JWT verification, CORS, and direct browser calls: `neon-functions` and https://neon.com/docs/compute/functions/authentication.md.

There is no documented universal import from Managed `neon_auth` into a self-managed Better Auth schema. Inventory users, credentials, sessions, memberships, and application foreign keys before changing existing state. Agree a cutover plan with the owner. Do not promise drop-in session continuity.
