---
title: OAuth provider
subtitle: Let your MCP server, API, or other apps sign in your Managed Better Auth users
summary: >-
  The OAuth provider plugin turns Managed Better Auth into an OAuth 2.1
  authorization server for your own apps. Use it to protect an MCP server so
  MCP clients can sign in your users, or to let other apps call your API on
  behalf of your users. Covers enabling the plugin in the Console or API, the
  login and consent pages you host, dynamic client registration, managed
  confidential and public clients, and how a resource server verifies the
  issuer, audience, and signature of access tokens. Currently in private
  preview.
tag: beta
enableTableOfContents: true
---

Managed Better Auth is built on [Better Auth](https://www.better-auth.com/) and can act as an OAuth 2.1 authorization server for your own apps. With the OAuth provider plugin enabled, Managed Better Auth issues access tokens to OAuth clients on behalf of your signed-in users, and your MCP server or API verifies those tokens.

Use it to:

- **Protect an MCP server.** MCP clients that support OAuth dynamic client registration (DCR) discover your authorization server, register themselves, and call your tools with an access token for your users. MCP support is part of this plugin, not a separate plugin: you set it up with the **MCP server** field.
- **Sign in your users to another app or API.** A web app, single-page app, desktop app, or CLI runs the authorization code flow with PKCE and calls your API with the resulting token.

<Admonition type="comingSoon" title="Private preview">
The OAuth provider plugin is in private preview. Access is enabled per account on request. To ask for access, [contact support](/docs/introduction/support).
</Admonition>

## Prerequisites

- A Neon project with **Auth enabled**.
- **A login page and a consent page, both hosted by you.** Both are required. Managed Better Auth doesn't provide default pages. Authorization requests redirect users to your login page, and then to your consent page to approve the client. See [Build your consent page](#build-your-consent-page).
- The origin of each page added as a [trusted domain](/docs/auth/guides/configure-domains) for the branch. Pages must use `https`, with no query string or fragment. `http` is allowed on `localhost` when [localhost access](/docs/auth/guides/manage-auth-api#related-auth-endpoints) is enabled for the branch.
- At least one protected resource: an MCP server URL, or an API identifier. A resource is an absolute URL that identifies what the token is for. It becomes the token's `aud` claim and doesn't need to resolve.

Configuration is per branch. Each branch has its own issuer, OAuth clients, and settings.

## Enable the OAuth provider

<Tabs labels={["Console", "API"]}>

<TabItem>

1. Open the [Neon Console](https://console.neon.tech).
2. Select your project and go to **Settings** > **Better Auth** > **Plugins**.
3. In the **OAuth provider** section, toggle **Enable OAuth provider** on.
4. Fill in the settings:
   - **Login page URL**: where authorization requests redirect for sign-in.
   - **Consent page URL**: where authorization requests redirect for user consent.
   - **MCP server**: the URL of your MCP server, if you're protecting one. MCP is configured here, in the OAuth provider panel.
   - **Allow MCP clients to dynamically register themselves**: on by default. Requires an MCP server URL. See [Dynamic client registration](#dynamic-client-registration).
   - **Protected resources**: URLs of other APIs that clients can request tokens for.
5. Click **Enable**.

You need an MCP server URL or at least one protected resource to enable the provider.

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
      "resource": "https://mcp.example.com/mcp",
      "dynamic_registration": true
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
    "dynamic_registration": true
  },
  "resources": [{ "identifier": "https://api.example.com/reports" }]
}
```

| Field                      | Type    | Description                                                                                                |
| -------------------------- | ------- | ---------------------------------------------------------------------------------------------------------- |
| `enabled`                  | boolean | Whether the OAuth provider is active                                                                       |
| `login_page`               | string  | URL of your login page                                                                                     |
| `consent_page`             | string  | URL of your consent page                                                                                   |
| `mcp.resource`             | string  | URL of your MCP server. Required whenever `mcp` is sent                                                    |
| `mcp.dynamic_registration` | boolean | Allow MCP clients to register themselves. Defaults to `true`; takes effect only when `mcp.resource` is set |
| `resources`                | array   | Other protected resources, as `{ "identifier": "<url>" }` objects. Up to 10                                |

Omitted fields keep their current values. A provided `mcp` object or `resources` list replaces the stored value, so send the full list when you add a resource.

Enabling requires `login_page`, `consent_page`, and at least one of `mcp.resource` or `resources`. Resource identifiers must be absolute `https` URLs (or `http` on a loopback host) without credentials, query string, or fragment. They can't point at your Managed Better Auth host.

</TabItem>

</Tabs>

## Protect an MCP server

An MCP client connects to your MCP server and learns where to authenticate from the server's protected resource metadata ([RFC 9728](https://datatracker.ietf.org/doc/html/rfc9728)). The flow is:

1. The client calls your MCP server and receives a `401` response that points to the server's protected resource metadata.
2. The metadata lists your Managed Better Auth issuer as the authorization server. The client reads the issuer's `/.well-known/oauth-authorization-server` document to find the registration, authorize, and token endpoints.
3. The client registers itself (see [Dynamic client registration](#dynamic-client-registration)).
4. The user signs in on your login page and approves the client on your consent page.
5. The client exchanges the authorization code (with PKCE) for an access token and calls your MCP server with it.

Your MCP server is responsible for two things: serving its protected resource metadata, and verifying access tokens.

### Find the issuer

The issuer is the Auth URL of the branch (the `base_url` returned by `GET .../auth`), for example `https://ep-example.neonauth.us-east-1.aws.neon.tech/neondb/auth`. The issuer is different on every branch. To avoid templating it, read the `issuer` field from `<base_url>/.well-known/oauth-authorization-server`.

### Verify access tokens

When the client sends the `resource` parameter, access tokens are signed JWTs (EdDSA). Verify them against the JWKS at `<issuer>/.well-known/jwks.json`. Your resource server must check both of these claims:

- `iss` equals the exact issuer of your branch.
- `aud` contains the exact resource identifier of your server.

<Admonition type="important" title="Verify iss and aud, not only the signature">
All branches of a project share the same signing keys, and only the issuer (`iss`) differs per branch. A token issued by one branch has a valid signature on every other branch, so the signature alone doesn't tell you which branch issued it. A resource server must verify `iss` against the issuer of its own branch and `aud` against its own resource identifier. The `aud` claim can be an array: with the `openid` scope it also contains the issuer's userinfo endpoint, so check for membership rather than equality. When you create a branch, it starts with the parent's OAuth clients (same client ID and secret), so also pin the issuer in each branch's resource server.
</Admonition>

The following example protects an MCP server built with the [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) and Express. It verifies tokens with [`jose`](https://github.com/panva/jose) and serves the protected resource metadata.

```ts shouldWrap filename="src/server.ts"
import express from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { requireBearerAuth } from '@modelcontextprotocol/sdk/server/auth/middleware/bearerAuth.js';
import {
  getOAuthProtectedResourceMetadataUrl,
  mcpAuthMetadataRouter,
} from '@modelcontextprotocol/sdk/server/auth/router.js';
import { InvalidTokenError } from '@modelcontextprotocol/sdk/server/auth/errors.js';

const ISSUER = process.env.NEON_AUTH_BASE_URL!; // https://<endpoint>.neonauth.<cell-domain>/<db>/auth
const RESOURCE = new URL('https://mcp.example.com/mcp'); // the MCP server URL configured on the provider

const jwks = createRemoteJWKSet(new URL(`${ISSUER}/.well-known/jwks.json`));

const oauthMetadata = await (
  await fetch(`${ISSUER}/.well-known/oauth-authorization-server`)
).json();

const verifier = {
  async verifyAccessToken(token: string) {
    try {
      const { payload } = await jwtVerify(token, jwks, {
        issuer: ISSUER, // exact match
        audience: RESOURCE.href, // must be one of the token's aud values
        algorithms: ['EdDSA'],
      });
      return {
        token,
        clientId: String(payload.azp ?? ''),
        scopes: String(payload.scope ?? '')
          .split(' ')
          .filter(Boolean),
        expiresAt: payload.exp,
        resource: RESOURCE,
        extra: { sub: payload.sub },
      };
    } catch {
      throw new InvalidTokenError('Invalid access token');
    }
  },
};

const app = express();

// Serves /.well-known/oauth-protected-resource/mcp, which names the issuer as the authorization server.
app.use(mcpAuthMetadataRouter({ oauthMetadata, resourceServerUrl: RESOURCE }));

app.use(
  '/mcp',
  requireBearerAuth({
    verifier,
    resourceMetadataUrl: getOAuthProtectedResourceMetadataUrl(RESOURCE),
  })
);
// ...mount your MCP transport on /mcp
```

An SDK that wraps these steps is coming. Until then, the code above uses only standard libraries.

### Dynamic client registration

With dynamic client registration (DCR, [RFC 7591](https://datatracker.ietf.org/doc/html/rfc7591)), MCP clients register themselves at the issuer's `/oauth2/register` endpoint, so you don't create clients for them. It's on by default when you set an MCP server, and you can turn it off in the Console or the API. It applies only to your MCP server resource. A client registered this way can request tokens for the MCP server only, and it can't skip the consent screen on first use.

Turn off **Allow MCP clients to dynamically register themselves** (`mcp.dynamic_registration: false`) if you want to control which clients can request tokens. Then `/oauth2/register` returns `403`, and the authorization server metadata omits `registration_endpoint`. Clients you create yourself keep working, and new registrations stop. Existing clients are unaffected: to stop one, disable or delete it.

<Admonition type="warning" title="Consent screens for dynamically registered clients">
While DCR is on, anyone can register a client with any name and redirect URI. A client's name is self-asserted, so don't treat it as proof of identity. Follow [Build your consent page](#build-your-consent-page) so users can tell what they're approving.
</Admonition>

Custom URI schemes such as `cursor://` are rejected. DCR drops those redirect URIs and accepts only `https`, loopback `http`, and reverse-domain private-use schemes for native clients (for example, `com.example.app:/callback`). A client that relies on a custom scheme can only connect through an `https` or loopback redirect URI. [Managed clients](#create-and-manage-oauth-clients) accept only `https` and loopback `http` redirect URIs.

### Build your consent page

You host the consent page, so you control what users see before they approve a client. Show:

- The client name.
- The client's host, if the client registered a client URI.
- The host of each redirect URI, because that's where the authorization code is sent.

Warn the user when the only redirect URIs are `localhost` or loopback addresses. The client then runs on the user's own machine, and a self-registered name gives no assurance about who built it.

## Sign in users to your own apps and APIs

To let an app call your API on behalf of your users, add the API as a protected resource and create a managed OAuth client for the app.

1. Add the API identifier under **Protected resources**, or in the `resources` list of the API request.
2. [Create an OAuth client](#create-and-manage-oauth-clients) linked to that resource.
3. In the app, run the authorization code flow with PKCE. Send the API identifier as the `resource` parameter on both the authorize and token requests.
4. The API verifies the access token the same way as the MCP example above, with its own identifier as the expected `aud`.

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

## Create and manage OAuth clients

Managed clients are for resources that clients can't register for themselves. You can also link a managed client to your MCP server resource, which is how you onboard known clients when DCR is off.

| Type           | Secret                    | Token endpoint auth   | Typical use                                |
| -------------- | ------------------------- | --------------------- | ------------------------------------------ |
| `confidential` | Client secret, shown once | `client_secret_basic` | Server-side web apps and backends          |
| `public`       | None                      | `none`, with PKCE     | Single-page, mobile, desktop, and CLI apps |

The type can't be changed after creation. Redirect URIs must match exactly.

<Tabs labels={["Console", "API"]}>

<TabItem>

Under the OAuth provider settings, use the **OAuth clients** list:

- **Create OAuth client**: set a name, client type, redirect URIs, and the protected resources the client can request tokens for. For a confidential client, the console shows the client secret once. Copy it before you close the dialog.
- **Edit**: change the name, redirect URIs, resources, **Skip consent**, or **Disabled**. A disabled client can't obtain new tokens.
- **Rotate secret**: generates a new secret for a confidential client. The previous secret stops working immediately.
- **Delete**: removes the client.

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
| `redirect_uris` | 1-10 redirect URIs                                                                               |
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

- Redirect URIs must use `https`, or `http` on a loopback host (such as `localhost` or `127.0.0.1`) when localhost access is enabled for the branch.
- Custom URI schemes (for example, `myapp://`) aren't accepted for managed clients. Use an `https` or loopback redirect URI instead.
- Register only the redirect URIs the app uses. A broad redirect URI lets another app receive the authorization code.

### Skip consent

**Skip consent** hides the consent screen for a client. Use it only for first-party apps you control. Don't use it for third-party clients, or for public clients: a public client's ID isn't secret, so any app that can receive a registered redirect URI could complete sign-in without the user seeing a consent screen.

## Token details

- **Send `resource`.** If the authorize and token requests don't include the `resource` parameter, Managed Better Auth issues an opaque token instead of a JWT, and your resource server can't verify it.
- **Access tokens** are JWTs signed with EdDSA and expire after one hour. The `aud` claim is the requested resource.
- **JWKS** is at `<issuer>/.well-known/jwks.json`.
- **ID tokens** don't include `name` or `email`. Call the issuer's userinfo endpoint (`<issuer>/oauth2/userinfo`) with the access token to get them.
- **Disabling a resource** (removing it from the configuration) stops new tokens from being issued for it. Access tokens that were already issued stay valid until they expire.

## Limitations

- You must host both the login page and the consent page. There's no default UI.
- Dynamic client registration is available for the MCP server resource only. Other resources need managed clients.
- Managed clients: up to 100 per project, 10 redirect URIs each, and links to up to 11 resources.
- Scopes, token lifetimes, and other provider options aren't configurable.
- Custom URI schemes (for example, `myapp://` or `cursor://`) are rejected for managed clients. Dynamic client registration accepts only reverse-domain private-use schemes, such as `com.example.app:/callback`.

<NeedHelp/>
