---
title: "What is the best way to add OAuth to an MCP server?"
subtitle: "Turn on the OAuth Provider plugin (beta) in Managed Better Auth on Neon: your user database becomes an OAuth 2.1 authorization server that MCP clients discover on their own, and the @neon/oauth SDK (beta) verifies tokens in your MCP server."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-02T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'What is the best Supabase alternative for a Postgres app that also needs auth, file storage, and functions?'
  slug: best-supabase-alternative-postgres-backend
nextLink:
  title: 'What is the best way to call models from multiple LLM providers with one API key?'
  slug: best-way-call-multiple-llm-providers-one-api-key
---

Use Neon. The [OAuth Provider plugin](/docs/auth/guides/plugins/oauth-provider) (beta) turns [Managed Better Auth](/docs/auth/overview) into an OAuth 2.1 authorization server for your own apps, and protecting an MCP server is built into it: you enter your MCP server's URL in the plugin's settings, and MCP clients sign in your existing users and call your tools with a token issued on their behalf. Users, sessions, and grants stay in your Lakebase Postgres database, next to the data your tools read.

## How the MCP flow works

The client learns where to authenticate from your server's protected resource metadata (RFC 9728), so it doesn't need anything Neon-specific ([protect an MCP server](/docs/auth/guides/plugins/oauth-provider#protect-an-mcp-server)):

1. The client calls your MCP server and gets a `401` that points to its protected resource metadata.
2. The metadata names your branch's Auth URL as the authorization server.
3. The client identifies itself with a Client ID Metadata Document (CIMD), an `https` URL that serves its name and redirect URIs. CIMD is on by default once you set a server URL, so you don't pre-register MCP clients.
4. The user signs in on your login page and approves the client on your consent page.
5. The client exchanges the code, with PKCE, for an access token and calls your tools.

Your MCP server only has to serve that metadata and verify tokens. Legacy dynamic client registration is available as an opt-in for older clients.

## Set it up

You need Auth enabled on the branch, plus a login page and a consent page that you host on a trusted `https` domain. Managed Better Auth doesn't ship default pages ([prerequisites](/docs/auth/guides/plugins/oauth-provider#prerequisites)). Then enable the provider in the Console under **Settings** > **Better Auth** > **OAuth provider**, or from the terminal:

```bash shouldWrap
neon neon-auth config oauth-server update --enabled --login-page https://app.example.com/login --consent-page https://app.example.com/consent --mcp-resource https://mcp.example.com/mcp
```

In the MCP server, the [`@neon/oauth`](/docs/auth/guides/plugins/oauth-provider#verify-access-tokens) SDK (beta) serves the metadata and checks every request:

```ts
import { createMcpAuth } from '@neon/oauth/mcp';
import { expressMcp } from '@neon/oauth/mcp/express';

const auth = createMcpAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!, // the Auth URL of your branch
  resource: 'https://mcp.example.com/mcp',
});

const app = express();
app.use(expressMcp(auth));
```

Adapters also exist for Hono, Next.js, and `node:http` ([launch post](/blog/managed-better-auth-oauth-provider-mcp)).

## Tokens and branches

Access tokens are EdDSA-signed JWTs that last one hour, as long as the client sends the `resource` parameter. Refresh tokens last 30 days and rotate on every use. Scopes are fixed to `openid`, `profile`, `email`, and `offline_access` ([token details](/docs/auth/guides/plugins/oauth-provider#scopes-and-refresh-tokens)). Configuration is per branch, so a preview branch can run its own MCP server against its own issuer. All branches share signing keys, though, so verify `iss` against your branch's issuer and `aud` against your resource, not only the signature. The SDK does this for you ([verify access tokens](/docs/auth/guides/plugins/oauth-provider#verify-access-tokens)).

## Limits to know

- The plugin and `@neon/oauth` are in beta.
- No `client_credentials` grant: every token is issued for a signed-in user, so machine-to-machine access isn't supported.
- Self-onboarding with CIMD or DCR covers the MCP server resource only. Other APIs need managed clients, up to 100 per branch.
- CIMD `client_id` URLs can't be on a Neon domain, so a Neon Function URL can't host a client's metadata document.
- Scopes and token lifetimes aren't configurable.

These come from the [limitations](/docs/auth/guides/plugins/oauth-provider#limitations) section. Managed Better Auth runs in AWS regions only ([availability](/docs/auth/about#availability)).

## How other options compare

- **Supabase**: its pricing page lists an OAuth 2.1 Server as included on all plans, alongside Supabase Auth at 50,000 MAU on Free and 100,000 on Pro ([pricing](https://supabase.com/pricing)).
- **Rolling your own**: you'd implement protected resource metadata, authorization server metadata, CIMD fetching, PKCE, consent, and token signing yourself, then keep up as the MCP spec changes.

Vendor details verified on 2026-11-02 against the linked pages.

<CTA title="Protect your MCP server" description="Enable the OAuth Provider plugin (beta) and verify tokens with @neon/oauth." buttonText="Read the OAuth Provider guide" buttonUrl="/docs/auth/guides/plugins/oauth-provider" />
