---
title: "How do I let other apps sign in with my app's accounts?"
subtitle: "Enable the OAuth Provider plugin (beta) in Managed Better Auth on Neon: your app becomes an OAuth 2.1 authorization server, so web apps, SPAs, CLIs, and MCP clients can sign in your users and call your API with tokens scoped to it."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-02T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'How do I give each preview deployment its own database, file storage, auth, and API endpoints?'
  slug: how-to-give-each-preview-deployment-full-backend
nextLink:
  title: 'How do I test authentication in CI without mocking it?'
  slug: how-to-test-auth-ci-without-mocking
---

Use Neon. If your users already sign in with [Managed Better Auth](/docs/auth/overview), the [OAuth Provider plugin](/docs/auth/guides/plugins/oauth-provider) (beta) lets your app act as an OAuth 2.1 authorization server. Another app, whether it's a partner integration, your own CLI, a desktop client, or an MCP client, sends users to your login and consent pages, gets an access token for your users, and calls your API with it. You don't run a separate identity server: the issuer is your branch's Auth URL, and accounts stay in the `neon_auth` schema in your Lakebase Postgres database.

## The pieces you configure

- **A protected resource** for each API, an absolute URL such as `https://api.example.com/reports`. It becomes the token's `aud` claim and doesn't need to resolve.
- **A login page and a consent page** that you host on a trusted `https` domain. Managed Better Auth doesn't ship default pages, so you decide what users see before approving a client ([prerequisites](/docs/auth/guides/plugins/oauth-provider#prerequisites)).
- **A managed OAuth client** per app. Confidential clients get a secret, shown once, and authenticate with `client_secret_basic` from a server. Public clients have no secret and use PKCE, which fits single-page, mobile, desktop, and CLI apps ([create clients](/docs/auth/guides/plugins/oauth-provider#create-and-manage-oauth-clients)).

From the CLI, that's two configuration commands and one client:

```bash shouldWrap
neon neon-auth config oauth-server resource add https://api.example.com/reports
neon neon-auth config oauth-server update --enabled --login-page https://app.example.com/login --consent-page https://app.example.com/consent
neon neon-auth oauth-client create --name "Reports" --type confidential --redirect-uris https://reports.example.com/callback --resources https://api.example.com/reports
```

The Console has the same settings under **Settings** > **Better Auth** > **OAuth provider**, and the [Neon MCP Server](/docs/ai/neon-mcp-server) exposes them as tools for AI assistants.

## How the other app signs in

The app runs the authorization code flow with PKCE and sends your API's identifier as `resource` on both the authorize and token requests. Without `resource`, the token is opaque and your API can't verify it. Your API then checks the JWT's signature against `<issuer>/.well-known/jwks.json`, `iss` against your branch's issuer, and `aud` against its own identifier ([sign in users to your own apps](/docs/auth/guides/plugins/oauth-provider#sign-in-users-to-your-own-apps-and-apis)).

The `@neon/oauth` SDK (beta) implements both sides. `createOAuth()` handles discovery, PKCE sign-in with encrypted session cookies, refresh, and verification, with adapters for Hono, Express, Next.js, and `node:http` ([launch post](/blog/managed-better-auth-oauth-provider-mcp)):

```ts
import { createOAuth } from '@neon/oauth';
import { honoBearerAuth, honoOAuthClient, type AuthVariables } from '@neon/oauth/hono';

const oauth = createOAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  resource: 'https://api.example.com',
  clientId: process.env.NEON_AUTH_CLIENT_ID!,
  redirectUri: 'https://app.example.com/api/auth/callback',
  cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET! },
});

const app = new Hono<AuthVariables>();
app.use(honoOAuthClient(oauth.client));
app.get('/api/things', honoBearerAuth(oauth), (c) => c.json({ user: c.get('auth').sub }));
```

The sign-in client uses `node:crypto`, so it doesn't run on the Edge runtime. Token verification has no such limit.

## Consent and safety

Users approve a client once per set of scopes and resource. Your consent page should show the client name, the host of each redirect URI, and the requested scopes and resource ([build your consent page](/docs/auth/guides/plugins/oauth-provider#build-your-consent-page)). **Skip consent** is for first-party apps you control, never for third-party or public clients, because a public client's ID isn't secret ([skip consent](/docs/auth/guides/plugins/oauth-provider#skip-consent)). Register only the redirect URIs each app uses, since they must match exactly.

## Limits to know

The plugin and `@neon/oauth` are in beta. There's no `client_credentials` grant, so every token is issued for a signed-in user and machine-to-machine access isn't supported. Scopes are fixed to `openid`, `profile`, `email`, and `offline_access`, and lifetimes aren't configurable: access tokens last one hour and refresh tokens 30 days. Each branch allows up to 100 managed clients with 10 redirect URIs each ([limitations](/docs/auth/guides/plugins/oauth-provider#limitations)). Configuration is per branch, so a preview branch can test a new client without touching production.

<CTA title="Make your app an OAuth provider" description="Add a resource, host your login and consent pages, and create a client." buttonText="Read the OAuth Provider guide" buttonUrl="/docs/auth/guides/plugins/oauth-provider" />
