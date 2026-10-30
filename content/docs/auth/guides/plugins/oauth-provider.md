---
title: OAuth Provider
subtitle: Let your MCP server, API, or other apps sign in your Managed Better Auth users
summary: >-
  The OAuth provider plugin turns Managed Better Auth into an OAuth 2.1
  authorization server for your own apps. Use it to protect an MCP server so
  MCP clients can sign in your users, or to let other apps call your API on
  behalf of your users. Covers enabling the plugin in the Console or API, the
  login and consent pages you host, Client ID Metadata Documents and legacy
  dynamic client registration, managed confidential and public clients, scopes
  and refresh tokens, and how a resource server verifies the issuer, audience,
  and signature of access tokens.
tag: beta
enableTableOfContents: true
---

Managed Better Auth is built on [Better Auth](https://www.better-auth.com/) and can act as an OAuth 2.1 authorization server for your own apps. With the OAuth provider plugin enabled, Managed Better Auth issues access tokens to OAuth clients on behalf of your signed-in users, and your MCP server or API verifies those tokens.

Use it to:

- **Protect an MCP server.** MCP clients discover your authorization server, identify themselves with a [Client ID Metadata Document](#client-id-metadata-documents) (CIMD), and call your tools with an access token for your users. Legacy [dynamic client registration](#dynamic-client-registration-legacy) (DCR) is available as an opt-in. MCP support is part of this plugin, not a separate plugin: you set it up with the **Server URL** field in the **MCP server** section.
- **Sign in your users to another app or API.** A web app, single-page app, desktop app, or CLI runs the authorization code flow with PKCE and calls your API with the resulting token.

The OAuth provider plugin is available to all Managed Better Auth projects.

## Prerequisites

- A Neon project with **Auth enabled**.
- **A login page and a consent page, both hosted by you.** Both are required. Managed Better Auth doesn't provide default pages. Authorization requests redirect users to your login page, and then to your consent page to approve the client. See [Build your consent page](#build-your-consent-page) and [How the pages complete the flow](#how-the-pages-complete-the-flow).
- The origin of each page added as a [trusted domain](/docs/auth/guides/configure-domains) for the branch. Pages must use `https`, with no query string or fragment. `http` is allowed on `localhost` when [localhost access](/docs/auth/guides/manage-auth-api#related-auth-endpoints) is enabled for the branch.
- At least one protected resource: an MCP server URL, or an API identifier. A resource is an absolute URL that identifies what the token is for. It becomes the token's `aud` claim and doesn't need to resolve.

Configuration is per branch. Each branch has its own issuer, OAuth clients, and settings.

## Enable the OAuth provider

<Tabs labels={["Console", "CLI", "API"]}>

<TabItem>

1. Open the [Neon Console](https://console.neon.tech).
2. Select your project and go to **Settings** > **Better Auth**.
3. In the **OAuth provider** section, toggle **Enable OAuth provider** on.
4. Fill in the settings:
   - **Login page URL**: where authorization requests redirect for sign-in.
   - **Consent page URL**: where authorization requests redirect for user consent.
   - **Server URL** (in the **MCP server** section): the URL of your MCP server, if you're protecting one. MCP is configured here, in the OAuth provider panel.
   - **Client ID Metadata Documents**: on by default once you set a server URL. See [Client ID Metadata Documents](#client-id-metadata-documents).
   - **Dynamic client registration (legacy)**: off by default. Requires a server URL. See [Dynamic client registration (legacy)](#dynamic-client-registration-legacy).
   - **Resource URLs**: URLs of other APIs that clients can request tokens for.
5. Click **Enable**.

You need an MCP server URL or at least one protected resource to enable the provider.

</TabItem>

<TabItem>

Use [`neon neon-auth config oauth-server`](/docs/cli/neon-auth#config-oauth-server). Add a protected resource, then enable the server with its login and consent pages, which must be on a [trusted domain](/docs/auth/guides/configure-domains):

```bash shouldWrap
neon neon-auth config oauth-server resource add https://api.example.com/reports
neon neon-auth config oauth-server update --enabled --login-page https://app.example.com/login --consent-page https://app.example.com/consent
```

To protect an MCP server, add `--mcp-resource https://mcp.example.com/mcp`. `neon neon-auth config oauth-server get` shows the current configuration.

</TabItem>

<TabItem>

Send a `PATCH` request to the [update OAuth provider plugin](/docs/reference/api/auth/update-neon-auth-o-auth-provider-plugin) endpoint. A `GET` on the same path ([retrieve](/docs/reference/api/auth/get-neon-auth-o-auth-provider-plugin)) returns the current configuration.

```bash shouldWrap
curl -X PATCH \
  "https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/auth/plugins/oauth-provider" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "enabled": true,
    "login_page": "https://app.example.com/login",
    "consent_page": "https://app.example.com/consent",
    "mcp": {
      "resource": "https://mcp.example.com/mcp"
    },
    "resources": [
      { "identifier": "https://api.example.com/reports" }
    ]
  }'
```

The response returns the stored configuration:

```json
{
  "enabled": true,
  "login_page": "https://app.example.com/login",
  "consent_page": "https://app.example.com/consent",
  "mcp": {
    "resource": "https://mcp.example.com/mcp",
    "dynamic_registration": false,
    "client_id_metadata_documents": true
  },
  "resources": [{ "identifier": "https://api.example.com/reports" }]
}
```

| Field                              | Type    | Description                                                                                                                                                   |
| ---------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `enabled`                          | boolean | Whether the OAuth provider is active                                                                                                                          |
| `login_page`                       | string  | URL of your login page                                                                                                                                        |
| `consent_page`                     | string  | URL of your consent page                                                                                                                                      |
| `mcp.resource`                     | string  | URL of your MCP server. Required whenever `mcp` is sent                                                                                                       |
| `mcp.client_id_metadata_documents` | boolean | Allow MCP clients to identify themselves with a Client ID Metadata Document. Defaults to `true`; takes effect only when `mcp.resource` is set                 |
| `mcp.dynamic_registration`         | boolean | Legacy. Allow MCP clients to register themselves with RFC 7591 dynamic client registration. Defaults to `false`; takes effect only when `mcp.resource` is set |
| `resources`                        | array   | Other protected resources, as `{ "identifier": "<url>" }` objects. Up to 10                                                                                   |

To remove MCP support, send `"mcp": { "resource": "" }`. CIMD and DCR then have no effect, and clients that onboarded through them stop working. Omitted fields keep their current values. A provided `resources` list replaces the stored list, so send the full list when you add a resource. A provided `mcp` object must include `resource`; its toggles keep their stored values when omitted.

Enabling requires `login_page`, `consent_page`, and at least one of `mcp.resource` or `resources`. Resource identifiers must be absolute `https` URLs (or `http` on a loopback host) without credentials, query string, or fragment. They can't point at your Managed Better Auth host.

</TabItem>

</Tabs>

## Protect an MCP server

An MCP client connects to your MCP server and learns where to authenticate from the server's protected resource metadata ([RFC 9728](https://datatracker.ietf.org/doc/html/rfc9728)). The flow is:

1. The client calls your MCP server and receives a `401` response that points to the server's protected resource metadata.
2. The metadata lists your Managed Better Auth issuer as the authorization server. The client reads the issuer's metadata to find the authorize and token endpoints, and whether the issuer supports client ID metadata documents. The issuer serves the same metadata at `<issuer>/.well-known/oauth-authorization-server` and `<issuer>/.well-known/openid-configuration`, so clients that append the well-known path to the issuer URL find it either way.
3. The client identifies itself, usually with a [Client ID Metadata Document](#client-id-metadata-documents) (or, if you enabled it, [dynamic client registration](#dynamic-client-registration-legacy)).
4. The user signs in on your login page and approves the client on your consent page.
5. The client exchanges the authorization code (with PKCE) for an access token and calls your MCP server with it.

Your MCP server is responsible for two things: serving its protected resource metadata, and verifying access tokens.

### Find the issuer

The issuer is the Auth URL of the branch, for example `https://ep-example.neonauth.us-east-1.aws.neon.tech/neondb/auth`. Copy it from the Console, or read `base_url` from `GET .../auth`. Don't build it from the endpoint ID. The issuer is different on every branch, so keep it in configuration per branch and check that the `issuer` field of the metadata document equals it.

### Verify access tokens

When the client sends the `resource` parameter, access tokens are signed JWTs (EdDSA). Verify them against the JWKS at `<issuer>/.well-known/jwks.json`. Your resource server must check both of these claims:

- `iss` equals the exact issuer of your branch.
- `aud` contains the exact resource identifier of your server.

<Admonition type="important" title="Verify iss and aud, not only the signature">
All branches of a project share the same signing keys, and only the issuer (`iss`) differs per branch. A token issued by one branch has a valid signature on every other branch, so the signature alone doesn't tell you which branch issued it. A resource server must verify `iss` against the issuer of its own branch and `aud` against its own resource identifier. The `aud` claim can be an array: with the `openid` [scope](#scopes-and-refresh-tokens) it also contains the issuer's userinfo endpoint, so check for membership rather than equality. When you create a branch, it starts with the parent's OAuth clients (same client ID and secret), so also pin the issuer in each branch's resource server.
</Admonition>

The following example protects an MCP server built with the [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) and Express. The [`@neon/oauth`](https://www.npmjs.com/package/@neon/oauth) SDK (beta) does the token work: install it with `npm install @neon/oauth`.

```ts shouldWrap filename="src/server.ts"
import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createMcpAuth } from '@neon/oauth/mcp';
import { expressMcp } from '@neon/oauth/mcp/express';

const auth = createMcpAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!, // the Auth URL of your branch
  resource: 'https://mcp.example.com/mcp', // the MCP server URL configured on the provider
});

const app = express();
app.use(expressMcp(auth));
app.use(express.json());

// A stateless transport serves one request, so create the server and transport per request.
app.post('/mcp', async (req, res) => {
  const server = new McpServer({ name: 'reports', version: '1.0.0' });
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  res.on('close', () => {
    transport.close();
    server.close();
  });
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

app.listen(3000);
```

`createMcpAuth()` verifies the signature, `iss`, and `aud` of each access token. `expressMcp()` serves the protected resource metadata, answers requests without a valid token with a `401` that points to it, and sets `req.auth` for valid ones, in the MCP SDK's `AuthInfo` shape, so the transport passes it to your tools as `extra.authInfo`. The full verification result is on `req.authResult`. Use `@neon/oauth` 0.3.0 or later. The SDK also has adapters for Hono, Next.js, and `node:http`.

#### Without the SDK

The same server using only [`jose`](https://github.com/panva/jose) and the MCP TypeScript SDK:

```ts shouldWrap filename="src/server.ts"
import express from 'express';
import { createRemoteJWKSet, errors, jwtVerify } from 'jose';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { requireBearerAuth } from '@modelcontextprotocol/sdk/server/auth/middleware/bearerAuth.js';
import {
  getOAuthProtectedResourceMetadataUrl,
  mcpAuthMetadataRouter,
} from '@modelcontextprotocol/sdk/server/auth/router.js';
import { InvalidTokenError } from '@modelcontextprotocol/sdk/server/auth/errors.js';

const AUTH_URL =
  'https://ep-example.neonauth.us-east-1.aws.neon.tech/neondb/auth'; // the Auth URL of your branch
const RESOURCE = new URL('https://mcp.example.com/mcp'); // the MCP server URL configured on the provider

const discovery = await fetch(
  `${AUTH_URL}/.well-known/oauth-authorization-server`
);
if (!discovery.ok) {
  throw new Error(`Discovery failed with status ${discovery.status}`);
}
const oauthMetadata = await discovery.json();
if (oauthMetadata.issuer !== AUTH_URL) throw new Error('Unexpected issuer'); // RFC 8414 section 3.3

const jwks = createRemoteJWKSet(new URL(oauthMetadata.jwks_uri));

const verifier = {
  async verifyAccessToken(token: string) {
    try {
      const { payload } = await jwtVerify(token, jwks, {
        issuer: AUTH_URL, // exact match
        audience: RESOURCE.href, // must be one of the token's aud values
        algorithms: ['EdDSA'],
      });
      return {
        token,
        clientId: String(payload.client_id ?? ''),
        scopes: String(payload.scope ?? '')
          .split(' ')
          .filter(Boolean),
        expiresAt: payload.exp,
        resource: RESOURCE,
        extra: { sub: payload.sub },
      };
    } catch (error) {
      if (error instanceof errors.JOSEError) {
        throw new InvalidTokenError('Invalid access token');
      }
      throw error;
    }
  },
};

const app = express();

// Serves /.well-known/oauth-protected-resource/mcp, which names the issuer as the authorization server.
// It also mirrors the authorization server metadata at /.well-known/oauth-authorization-server on this origin.
app.use(mcpAuthMetadataRouter({ oauthMetadata, resourceServerUrl: RESOURCE }));

app.use(
  '/mcp',
  requireBearerAuth({
    verifier,
    resourceMetadataUrl: getOAuthProtectedResourceMetadataUrl(RESOURCE),
  })
);
app.use(express.json());

// A stateless transport serves one request, so create the server and transport per request.
// requireBearerAuth sets req.auth, which the transport passes to your tool handlers.
app.post('/mcp', async (req, res) => {
  const server = new McpServer({ name: 'reports', version: '1.0.0' });
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  res.on('close', () => {
    transport.close();
    server.close();
  });
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

app.listen(3000);
```

### Client ID Metadata Documents

With Client ID Metadata Documents (CIMD), an MCP client uses an `https` URL as its `client_id`. The URL serves a JSON document that describes the client, including its `client_name` and `redirect_uris`. Managed Better Auth fetches the document the first time the client is used, so you don't create clients for MCP clients that support CIMD. CIMD is on by default once you set an MCP server, and the authorization server metadata advertises `client_id_metadata_document_supported`. If you build an MCP client, `createClientMetadataDocument` from `@neon/oauth` produces a valid document.

A CIMD client:

- Is a public client that uses PKCE, or a confidential client that authenticates with `private_key_jwt` and publishes its public keys in the document (`jwks` or `jwks_uri`). Symmetric methods such as `client_secret_basic` are rejected.
- Can request tokens for the MCP server resource only. The document can't link the client to other resources.
- Can't skip the consent screen. A document that sets `skip_consent` is rejected with `invalid_client`.
- Must use redirect URIs that follow the [redirect URI rules](#redirect-uri-rules). A loopback `http` redirect URI matches on any port. All other redirect URIs must match the document exactly.

Clear **Client ID Metadata Documents** in the Console, or set `mcp.client_id_metadata_documents` to `false` in the API, if you want to control which clients can request tokens. New CIMD clients are then rejected and existing ones stop working. Clients you create yourself keep working.

<Admonition type="warning" title="Consent screens for self-onboarded clients">
A client's name comes from a document the client controls (or, with DCR, from anyone who registers), so don't treat it as proof of identity. Follow [Build your consent page](#build-your-consent-page) so users can tell what they're approving.
</Admonition>

### Dynamic client registration (legacy)

Dynamic client registration (DCR, [RFC 7591](https://datatracker.ietf.org/doc/html/rfc7591)) is the older way for MCP clients to register themselves, at the issuer's `/oauth2/register` endpoint. Prefer [Client ID Metadata Documents](#client-id-metadata-documents). DCR is off by default. To accept clients that only support DCR, turn on **Dynamic client registration (legacy)** (`mcp.dynamic_registration: true`), which requires an MCP server URL. It applies only to your MCP server resource. A client registered this way can request tokens for the MCP server only, and it can't skip the consent screen on first use. While DCR is on, anyone can register a client with any name and redirect URI, so the consent-screen warning above applies in full.

Branches configured before October 2026 may have relied on DCR being on by default. If yours did, set `mcp.dynamic_registration` to `true` explicitly to keep it.

While DCR is off, `/oauth2/register` returns `403`, and the authorization server metadata omits `registration_endpoint`. Turning DCR off stops new registrations only. Existing clients are unaffected: to stop one, disable or delete it.

### Build your consent page

You host the consent page, so you control what users see before they approve a client. Show:

- The client name.
- The client's host, if the client registered a client URI.
- The host of each redirect URI, because that's where the authorization code is sent.
- The scopes the client requests and the resource it wants a token for. Both are in the `scope` and `resource` parameters of the authorization request your page receives.

Warn the user when the only redirect URIs are `localhost` or loopback addresses. The client then runs on the user's own machine, and a self-asserted name gives no assurance about who built it.

Users approve a client once. Later authorizations for the same client, scopes, and resource reuse the stored consent, and your consent page is shown again when a client asks for scopes or a resource the user hasn't approved.

### How the pages complete the flow

Both pages receive the authorization request as query parameters. The query is signed and expires, so pass it back to Managed Better Auth exactly as received, as the `oauth_query` value.

- **Login page.** The authorization request redirects here when the user has no session. Send `oauth_query` in the body of the sign-in request. This works for email and password sign-in and for social sign-in, such as Google or GitHub. Managed Better Auth verifies the signature, signs the user in, and resumes the authorization request. With email and password, the sign-in response tells your page where to go next, usually your consent page. With social sign-in, the provider returns the user to your login page, signed in, with the same query. When your login page loads with a session, send `POST <issuer>/oauth2/continue` with `{ "selected": true, "oauth_query": "<query>" }` and navigate to the returned `url`. Do the same when a signed-in user reaches the login page.
- **Consent page.** Show what the user is approving, then send `POST <issuer>/oauth2/consent` with a JSON body of `{ "accept": true, "oauth_query": "<query>" }`, or `"accept": false` to deny. The response is JSON with a `redirect` flag and the `url` to navigate the browser to. That URL is the client's redirect URI with the authorization code, or an error.
- **Client details.** To display the client name, call `GET <issuer>/oauth2/public-client?client_id=<client_id>` with the user's session. It returns `client_id` and `client_name` for every client. Clients that identify with a Client ID Metadata Document also return the `client_uri` and `logo_uri` from their document when it sets them. Managed clients don't have these fields.

For example, the buttons on your consent page can call:

```ts shouldWrap filename="consent.ts"
const ISSUER = 'https://ep-example.neonauth.us-east-1.aws.neon.tech/neondb/auth'; // the Auth URL of your branch

async function respond(accept: boolean) {
  const res = await fetch(`${ISSUER}/oauth2/consent`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      accept,
      oauth_query: window.location.search.slice(1), // the query exactly as received
    }),
  });
  if (!res.ok) throw new Error(`Consent failed with status ${res.status}`);
  const { url } = await res.json();
  window.location.assign(url); // the client's redirect URI, with the code or an error
}
```

Calls from your pages carry the user's session cookie, so make them with `credentials: 'include'` and add your pages' origins as [trusted domains](/docs/auth/guides/configure-domains). Navigate the browser to the returned `url`. Neither the sign-in nor the consent response is an HTTP redirect.

<Admonition type="tip" title="Use the Neon Auth client">
If your pages use [`@neon/auth`](/docs/auth/overview) 0.8.0 or later (or `@neondatabase/neon-js` 0.9.0-beta or later), the client handles `oauth_query` for you. Sign-in requests on your login page attach it automatically. When your login page loads with a session, call `authClient.oauth2.continue({ selected: true })`. On your consent page, `authClient.oauth2.consent({ accept })` replaces the `fetch` call above. The client navigates to the returned `url` itself, so don't navigate again.
</Admonition>

## Sign in users to your own apps and APIs

To let an app call your API on behalf of your users, add the API as a protected resource and create a managed OAuth client for the app.

1. Add the API identifier under **Resource URLs**, or in the `resources` list of the API request.
2. [Create an OAuth client](#create-and-manage-oauth-clients) linked to that resource.
3. In the app, run the authorization code flow with PKCE. Send the API identifier as the `resource` parameter on both the authorize and token requests.
4. The API verifies the access token the same way as the MCP example above, with its own identifier as the expected `aud`.

Send the user to the authorize endpoint of the issuer with the PKCE challenge, the `resource`, and the scopes you need (see [Scopes and refresh tokens](#scopes-and-refresh-tokens)):

```text shouldWrap
https://ep-example.neonauth.us-east-1.aws.neon.tech/neondb/auth/oauth2/authorize
  ?response_type=code
  &client_id=<CLIENT_ID>
  &redirect_uri=https%3A%2F%2Freports.example.com%2Fcallback
  &scope=openid%20offline_access
  &state=<STATE>
  &code_challenge=<CODE_CHALLENGE>
  &code_challenge_method=S256
  &resource=https%3A%2F%2Fapi.example.com%2Freports
```

The authorize endpoint is `authorization_endpoint` in the issuer's metadata. After the user signs in and approves the client on your [pages](#how-the-pages-complete-the-flow), the browser returns to `redirect_uri` with `code` and `state`.

A confidential client exchanges the code on the server and authenticates with `client_secret_basic`:

```bash shouldWrap
curl -X POST "$ISSUER/oauth2/token" \
  -u "$CLIENT_ID:$CLIENT_SECRET" \
  -d grant_type=authorization_code \
  -d code="$CODE" \
  -d code_verifier="$CODE_VERIFIER" \
  -d redirect_uri="https://reports.example.com/callback" \
  -d resource="https://api.example.com/reports"
```

A token is issued for the `resource` requested in that call. A token for your API isn't valid at your MCP server, and the reverse.

The `@neon/oauth` SDK (beta) implements this flow for you. `createOAuth()` from `@neon/oauth` handles discovery, PKCE sign-in with encrypted session cookies, token refresh, and token verification for your API. It has adapters for Hono, Express, Next.js, and `node:http`. The sign-in client uses `node:crypto` for cookie encryption, so it doesn't run on the Edge runtime. Token verification doesn't have that limit.

## Create and manage OAuth clients

Managed clients are for resources that clients can't register for themselves. You can also link a managed client to your MCP server resource, which is how you onboard known clients when you turn off CIMD and DCR.

If you work with an AI assistant, the [Neon MCP Server](/docs/ai/neon-mcp-server) can also manage the provider and its clients with the `*_auth_oauth_server` and `*_auth_oauth_client` tools.

<Admonition type="warning" title="Keep the MCP server URL out of the resources list">
For an MCP server, set the URL in `mcp.resource` (the **Server URL** field) and turn off `client_id_metadata_documents` and `dynamic_registration` so that only managed clients can connect. Don't list the MCP server URL under `resources` instead. The refresh-token reuse window (30 seconds) is configured only when `mcp.resource` is set. Without it, an MCP client that refreshes concurrently presents an already-rotated refresh token, and Managed Better Auth revokes that user's refresh tokens for the client.
</Admonition>

| Type           | Secret                    | Token endpoint auth   | Typical use                                |
| -------------- | ------------------------- | --------------------- | ------------------------------------------ |
| `confidential` | Client secret, shown once | `client_secret_basic` | Server-side web apps and backends          |
| `public`       | None                      | `none`, with PKCE     | Single-page, mobile, desktop, and CLI apps |

The type can't be changed after creation. Redirect URIs must match exactly.

<Tabs labels={["Console", "CLI", "API"]}>

<TabItem>

Under the OAuth provider settings, use the **OAuth clients** list:

- **Create OAuth client**: set a name, client type, redirect URIs, and the protected resources the client can request tokens for. For a confidential client, the console shows the client secret once. Copy it before you close the dialog.
- **Edit**: change the name, redirect URIs, resources, **Skip consent**, or **Disabled**. A disabled client can't obtain new tokens.
- **Rotate secret**: generates a new secret for a confidential client. The previous secret stops working immediately.
- **Delete**: removes the client.

</TabItem>

<TabItem>

Use [`neon neon-auth oauth-client`](/docs/cli/neon-auth#oauth-client). Every resource you link must already be configured on the OAuth provider:

```bash shouldWrap
neon neon-auth oauth-client create --name "Reports" --type confidential --redirect-uris https://reports.example.com/callback --resources https://api.example.com/reports
```

For a confidential client, the command prints the client secret only once. Store it before you continue. The `list`, `get`, `update`, `rotate-secret`, and `delete` subcommands manage existing clients.

</TabItem>

<TabItem>

Create a client with the [create OAuth client](/docs/reference/api/auth/create-neon-auth-o-auth-client) endpoint. Every entry in `resources` must already be configured on the OAuth provider.

```bash shouldWrap
curl -X POST \
  "https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/auth/oauth-provider/clients" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Reports",
    "type": "confidential",
    "redirect_uris": ["https://reports.example.com/callback"],
    "resources": ["https://api.example.com/reports"]
  }'
```

The response includes the `client_secret` for confidential clients. It's returned only in this response.

```json
{
  "client_id": "<CLIENT_ID>",
  "client_secret": "<CLIENT_SECRET>",
  "name": "Reports",
  "type": "confidential",
  "redirect_uris": ["https://reports.example.com/callback"],
  "resources": ["https://api.example.com/reports"],
  "skip_consent": false,
  "disabled": false,
  "created_at": "2026-01-01T00:00:00Z"
}
```

| Field           | Description                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------ |
| `name`          | Display name, 1-100 characters                                                                   |
| `type`          | `confidential` or `public`                                                                       |
| `redirect_uris` | 1-10 redirect URIs, following the [redirect URI rules](#redirect-uri-rules)                      |
| `resources`     | 1-11 protected resource identifiers (up to 10 configured resources plus the MCP server resource) |
| `skip_consent`  | Optional. Skip the consent screen for this client. Defaults to `false`                           |

The other client operations are under the same path:

| Operation                                                                       | Request                                                          |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [List](/docs/reference/api/auth/list-neon-auth-o-auth-clients)                  | `GET .../auth/oauth-provider/clients`                            |
| [Retrieve](/docs/reference/api/auth/get-neon-auth-o-auth-client)                | `GET .../auth/oauth-provider/clients/{client_id}`                |
| [Update](/docs/reference/api/auth/update-neon-auth-o-auth-client)               | `PATCH .../auth/oauth-provider/clients/{client_id}`              |
| [Delete](/docs/reference/api/auth/delete-neon-auth-o-auth-client)               | `DELETE .../auth/oauth-provider/clients/{client_id}`             |
| [Rotate secret](/docs/reference/api/auth/rotate-neon-auth-o-auth-client-secret) | `POST .../auth/oauth-provider/clients/{client_id}/rotate_secret` |

Update accepts `name`, `redirect_uris`, `resources`, `skip_consent`, and `disabled`. At least one field is required, and a provided `redirect_uris` or `resources` list replaces the stored list. Rotating the secret of a public client fails because it has no secret. Deleting a client doesn't revoke tokens that were already issued to it.

</TabItem>

</Tabs>

### Redirect URI rules

Redirect URIs can't contain a fragment or credentials, and they must match exactly (except for the loopback port rule for CIMD clients). Register only the redirect URIs the app uses: a broad redirect URI lets another app receive the authorization code. What else is accepted depends on how the client is created:

- **Managed clients.** `https`, or `http` on a loopback host (`localhost`, `127.0.0.1`, or `[::1]`) when [localhost access](/docs/auth/guides/manage-auth-api#related-auth-endpoints) is enabled for the branch. Any other URI, including custom schemes such as `myapp://`, makes the request fail.
- **Dynamic client registration.** `https`, `http` on the same loopback hosts, and reverse-domain private-use schemes for native clients (for example, `com.example.app:/callback`). When the registration doesn't set `application_type`, Managed Better Auth drops the redirect URIs that aren't accepted (custom schemes such as `cursor://` among them), and the registration fails only if none remain. A client that relies on a custom scheme can only connect through an `https` or loopback redirect URI.
- **Client ID Metadata Documents.** `https`, `http` on a loopback host, and reverse-domain private-use schemes, as listed in the document. A loopback `http` redirect URI matches on any port.

### Skip consent

**Skip consent** hides the consent screen for a client. Use it only for first-party apps you control. Don't use it for third-party clients, or for public clients: a public client's ID isn't secret, so any app that can receive a registered redirect URI could complete sign-in without the user seeing a consent screen.

## Token details

- **Send `resource`.** If the authorize and token requests don't include the `resource` parameter, Managed Better Auth issues an opaque token instead of a JWT, and your resource server can't verify it.
- **Access tokens** are JWTs signed with EdDSA and expire after one hour. The `aud` claim contains the requested resource. The `client_id` claim identifies the client, and `scope` lists the granted scopes.
- **JWKS** is at `<issuer>/.well-known/jwks.json`.
- **ID tokens** don't include `name` or `email`. Call the issuer's userinfo endpoint (`<issuer>/oauth2/userinfo`) with the access token to get them.
- **Disabling a resource** (removing it from the configuration) stops new tokens from being issued for it. Clients stop listing it until you add it back. Access tokens that were already issued stay valid until they expire.

### Scopes and refresh tokens

The scopes are fixed. A client can request any of these:

| Scope            | Grants                                                           |
| ---------------- | ---------------------------------------------------------------- |
| `openid`         | An ID token, and access to the userinfo endpoint                 |
| `profile`        | `name`, `given_name`, `family_name`, and `picture` from userinfo |
| `email`          | `email` and `email_verified` from userinfo                       |
| `offline_access` | A refresh token, so the client can renew access without the user |

The supported grant types are `authorization_code` and `refresh_token`. Managed clients are created with both. To get a refresh token, request `offline_access` on the authorize request, with PKCE. Refresh tokens expire after 30 days and rotate on every use: each refresh returns a new refresh token. When you [protect an MCP server](#protect-an-mcp-server) with `mcp.resource`, Managed Better Auth sets a 30-second refresh-token reuse window for every client on the branch, not only MCP clients: a client can repeat the same refresh request for 30 seconds after the token rotates and gets the same response, so concurrent refreshes from one client succeed.

```bash shouldWrap
curl -X POST "$ISSUER/oauth2/token" \
  -u "$CLIENT_ID:$CLIENT_SECRET" \
  -d grant_type=refresh_token \
  -d refresh_token="$REFRESH_TOKEN"
```

A refreshed access token keeps the resource of the original authorization unless you send a `resource` that is one of those resources.

## Limitations

- You must host both the login page and the consent page. There's no default UI.
- Self-onboarding (CIMD or DCR) is available for the MCP server resource only. Other resources need managed clients.
- No `client_credentials` grant. Tokens are always issued on behalf of a signed-in user, so machine-to-machine access isn't supported. The authorization server metadata can still list `client_credentials` in `grant_types_supported`, but token requests that use it are rejected.
- CIMD `client_id` URLs must use `https` on the default port (443) and a hostname, not an IP address. They can't point at a Neon domain (such as `neon.tech` or `neon.com`, including subdomains), so a Neon Function URL doesn't work. The document must be served as JSON without redirects and be at most 5 KiB. If the fetch fails for any of these reasons, the client sees a generic "Failed to fetch metadata document" error. See the [redirect URI rules](#redirect-uri-rules) for what each kind of client can register.
- Managed clients: up to 100 per branch, 10 redirect URIs each, and links to up to 11 resources: up to 10 configured resources plus the MCP server resource.
- Scopes, token lifetimes, and other provider options aren't configurable.
- Authorization requests with `prompt=login` or `max_age=0` loop back to the login page after sign-in, because continuing the flow doesn't clear these parameters.

<NeedHelp/>
