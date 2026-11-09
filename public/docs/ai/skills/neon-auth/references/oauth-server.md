# Managed Better Auth as the OAuth server

Use this page when the request is "let MCP clients sign in my users", "protect my MCP server with OAuth", or "let another app or OAuth client call my API on behalf of my users". Managed Better Auth is the OAuth 2.1 / OIDC authorization server (the OAuth provider plugin, beta, available to all Managed projects). Do not move to self-managed Better Auth for this, and keep the app's existing login method.

"OAuth server" and "OAuth clients" here are not the social providers (Google, GitHub, Apple) of `neon neon-auth oauth-provider`. Those sign users in to Neon Auth. This page makes Neon Auth issue tokens to other apps.

- Docs: https://neon.com/docs/auth/guides/plugins/oauth-provider.md
- Configuration is per branch: each branch has its own issuer, clients, and settings.
- Prerequisites: Auth enabled; a login page and a consent page that you host (there is no default UI); the origin of each page on the branch's [trusted domains](../SKILL.md#trusted-domains); at least one protected resource (the MCP server URL, or an API identifier URL).

## 1. Enable and configure the server

CLI (Console and the API `PATCH .../branches/{branch_id}/auth/plugins/oauth-provider` do the same):

```bash
# MCP server
neon neon-auth config oauth-server update --enabled \
  --login-page https://app.example.com/auth/sign-in \
  --consent-page https://app.example.com/auth/consent \
  --mcp-resource https://mcp.example.com/mcp

# A non-MCP API instead (or as well)
neon neon-auth config oauth-server resource add https://api.example.com/reports

neon neon-auth config oauth-server get
```

- Enabling needs both pages and at least one of `--mcp-resource` or a resource. Resources are absolute `https` URLs (or `http` on loopback) with no query or fragment, and they must not be the Auth host. They do not need to resolve.
- `--mcp-resource` turns on Client ID Metadata Documents (CIMD): MCP clients that support CIMD identify themselves, so you create no client for them. Turn it off with `--no-mcp-client-id-metadata-documents` to allow only clients you create. Legacy dynamic registration is off by default; leave it off.
- Keep the MCP server URL in `--mcp-resource`, not in the resources list.
- `resource add|remove` rewrites the full stored list. `--resources` replaces it.

Programmatic equivalents: `neon.auth.oauthServer.get|update` and `neon.auth.oauthClients.*` in `@neon/sdk`, and the `get_auth_oauth_server` / `update_auth_oauth_server` / `*_auth_oauth_client` tools in the Neon MCP server (`neon_auth` scope).

## 2. Register clients

Skip this for MCP clients that use CIMD. Create managed clients for known apps, for non-MCP resources, or when CIMD is off. Every `--resources` URL must already be configured on the server.

```bash
neon neon-auth oauth-client create --name "Reports" --type confidential \
  --redirect-uris https://reports.example.com/callback \
  --resources https://api.example.com/reports

neon neon-auth oauth-client list
neon neon-auth oauth-client get <client-id>
neon neon-auth oauth-client update <client-id> --redirect-uris https://reports.example.com/callback
neon neon-auth oauth-client rotate-secret <client-id>
neon neon-auth oauth-client delete <client-id>
```

- `confidential` (server-side apps, token endpoint auth `client_secret_basic`) or `public` (SPA, mobile, desktop, CLI; PKCE, no secret). The type cannot change after creation.
- The `client_secret` of a confidential client is returned only by `create` and `rotate-secret`. Store it in a secret manager or the host's environment variables immediately. The old secret stops working at once on rotation. Never put it in client-side code, the repo, or logs.
- Redirect URIs must match exactly: `https`, or `http` on `localhost`/`127.0.0.1`/`[::1]` when localhost access is enabled. No fragments, credentials, or custom schemes. Register only the URIs the app uses.
- At most 100 OAuth clients per project (`OAUTH_CLIENT_LIMIT_REACHED` past that). Run `oauth-client list` before creating more, and reuse or delete a client rather than creating duplicates.
- `--skip-consent` only for first-party confidential clients you control.
- A new branch starts with its parent's clients (same IDs and secrets). Rotate secrets on branches that must differ.

## 3. Build the login and consent pages

Both pages receive the signed authorization query. Use `@neon/auth` 0.8.0 or later: the client forwards that query (`oauth_query`) for you. There is no `auth.oauth.resume()` or `getConsentRequest()` helper; do not call or write one, and do not build consent URLs by hand.

```tsx
// lib/auth/client.ts
import { createAuthClient } from "@neon/auth";
export const authClient = createAuthClient(process.env.NEXT_PUBLIC_NEON_AUTH_URL!);
```

Login page. Existing sign-in calls (`signIn.email`, `signIn.social`) carry the query automatically. On every load, including the return from a social sign-in, resume if the user already has a session:

```tsx
const { data } = await authClient.getSession();
if (data?.user) {
  const { error } = await authClient.oauth2.continue({ selected: true });
  if (error) showError("This sign-in link expired. Go back to the app and try again.");
}
```

`continue` navigates to the consent page or back to the client; a 400 means the link expired. After `signIn.email`, skip your own redirect when `data.redirect` is true.

Consent page. Show the client name, the redirect URI hosts, and the requested `scope` and `resource` (query parameters), and warn when every redirect URI is loopback:

```tsx
const params = new URLSearchParams(window.location.search);
const { data: client } = await authClient.oauth2.publicClient({
  query: { client_id: params.get("client_id") ?? "" },
});
// Allow / Deny buttons:
await authClient.oauth2.consent({ accept }); // navigates the browser itself; do not redirect again
```

`publicClient` and `consent` need a signed-in user. Send `Content-Security-Policy: frame-ancestors 'none'` on both pages.

## 4. Protect an MCP server

The user identity is the token's `sub`. Never trust a user id from tool arguments.

Verify `iss` (the exact Auth URL of the branch) and `aud` (the exact MCP server URL) as well as the signature. All branches of a project share signing keys, so the signature alone does not identify the branch. `@neon/oauth` 0.3.0 or later (beta) does all three.

```bash
npm install @neon/oauth @modelcontextprotocol/sdk hono @hono/mcp
```

On a Neon Function, the default export is a Hono app (see the `neon-functions` skill, [references/mcp.md](https://neon.com/docs/ai/skills/neon-functions/references/mcp.md)):

```typescript
import { Hono } from "hono";
import { StreamableHTTPTransport } from "@hono/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createMcpAuth } from "@neon/oauth/mcp";
import { honoMcp, type McpAuthVariables } from "@neon/oauth/mcp/hono";

const mcpAuth = createMcpAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!, // the branch's Auth URL
  resource: process.env.MCP_RESOURCE!, // exactly the --mcp-resource value
});

const app = new Hono<McpAuthVariables>();
app.use(honoMcp(mcpAuth, { path: "/mcp" })); // metadata routes + bearer guard

app.all("/mcp", async (c) => {
  const userId = c.get("auth").sub; // verified identity; scope every query by it
  const server = new McpServer({ name: "my-mcp", version: "1.0.0" });
  // register tools that close over userId
  const transport = new StreamableHTTPTransport({ sessionIdGenerator: undefined });
  await server.connect(transport);
  return transport.handleRequest(c);
});

export default app;
```

- Stateless: build the server and transport per request.
- `c.get("auth")` is the verified result (`sub`, `clientId`, `scopes`, `claims`); `c.get("authInfo")` is the MCP SDK `AuthInfo`. Express, Next.js, and `node:http` adapters exist (`@neon/oauth/mcp/express`, `/next`, `/node`).
- Set `NEON_AUTH_BASE_URL` and `MCP_RESOURCE` through the Function's `env` in `neon.ts`, and deploy with `neon deploy` (or `neon functions deploy <name> --src <file>`).
- Known gaps: a request with no token gets a challenge with `error="invalid_token"` rather than a bare RFC 6750 challenge, and `/mcp` has no CORS or `OPTIONS` handling, so browser-based MCP clients need CORS added by you.
- Without the SDK, use `jose` against the issuer's JWKS with the same `iss` and `aud` checks. See the docs.

## 5. Endpoints and discovery

- Issuer = the branch's Auth URL, e.g. `https://ep-example.neonauth.us-east-1.aws.neon.tech/neondb/auth`. Copy it from the Console or `base_url` from `GET .../auth`; do not construct it. It differs per branch, so keep it in per-branch config.
- Authorization server metadata: `<issuer>/.well-known/oauth-authorization-server` (also `<issuer>/.well-known/openid-configuration`). It lists the authorize, token, and userinfo endpoints, so read them from there.
- JWKS: `<issuer>/.well-known/jwks.json`. Userinfo: `<issuer>/oauth2/userinfo`.
- The MCP server serves protected resource metadata (RFC 9728); `honoMcp` does this.
- Clients must send `resource` on both the authorize and token requests, or the token is opaque and cannot be verified. Access tokens are EdDSA JWTs valid for one hour. Scopes are fixed: `openid`, `profile`, `email`, `offline_access`. Grants are `authorization_code` and `refresh_token`; there is no `client_credentials`.

## 6. Verify

1. `neon neon-auth config oauth-server get` shows `enabled`, both pages, and the resource.
2. `curl <issuer>/.well-known/oauth-authorization-server`: `issuer` equals the Auth URL.
3. `curl -i <mcp-url>` without a token: 401 whose `WWW-Authenticate` points to the protected resource metadata, and that metadata names the issuer.
4. Run the real flow with MCP Inspector (`npx @modelcontextprotocol/inspector`, Streamable HTTP, the MCP URL) or an MCP client such as Cursor or Claude. Expect: redirect to your login page, then your consent page, then a token, then a successful tool call.
5. Confirm a tool returns data for the signed-in user only, and that a token for another resource or branch is rejected.
6. For a managed client, run authorize with PKCE and `resource`, then exchange the code at the token endpoint.

Report any step you could not run.

## Do NOT

- Do not move to self-managed Better Auth or the Better Auth MCP plugin for this. Managed supports it.
- Do not confuse this with `neon neon-auth oauth-provider` (social login) or Generic OAuth.
- Do not call `auth.oauth.resume()`, `getConsentRequest()`, or any resume helper. Use `oauth2.continue`, `oauth2.publicClient`, and `oauth2.consent`.
- Do not put client secrets, or Neon API keys, in browser or mobile code.
- Do not skip `iss` and `aud` checks, or trust a user id from tool input instead of `sub`.
- Do not enable dynamic client registration or `--skip-consent` for third-party or public clients.
- Do not list the MCP server URL under resources instead of `--mcp-resource`.
