---
title: Neon Functions authentication
subtitle: Verify callers before a Neon Function does any work.
summary: >-
  A Neon Function has a public URL, so authenticate it yourself. Verify a Neon
  Auth JWT against the injected JWKS, check an API key, and add CORS when the
  browser calls the function directly.
enableTableOfContents: true
updatedOn: '2026-07-14T20:35:24.380Z'
---

<PrivatePreviewEnquire/>

A Neon Function has a public HTTPS URL, so anyone who knows it can reach it. There's no platform gate in front of your handler. Authenticate the caller yourself, at the top of the handler, and reject anything that doesn't check out.

<Callout title="Looking for credentials to call Neon services?">
This page covers verifying inbound requests to your function. For the credentials Neon injects into a function to call Object Storage or AI Gateway, see [Environment variables](/docs/compute/functions/environment-variables), [Object Storage authentication](/docs/storage/authentication#credentials-in-neon-functions), or [AI Gateway authentication](/docs/ai-gateway/authentication#credentials-in-neon-functions).
</Callout>

How you authenticate depends on who calls the function:

- A browser or another service holding a **JWT**: verify the token (see [Verify a JWT](#verify-a-jwt)).
- Your own scripts, cron jobs, or internal tools: check an **API key** (see [Check an API key](#check-an-api-key)).
- A WebSocket or SSE client: the browser can't set headers, so pass the token as a query parameter or cookie (see [WebSocket and SSE clients](#websocket-and-sse-clients)).

## Verify a JWT

When [Managed BetterAuth](/docs/auth/overview) is enabled on the branch, the function gets `NEON_AUTH_JWKS_URL` and `NEON_AUTH_BASE_URL` injected at runtime. Verify incoming tokens against the JWKS with [`jose`](https://github.com/panva/jose), and check that the token's issuer matches your Managed BetterAuth URL. Build the remote key set once at module scope, then verify on each request:

```bash
npm install jose
```

```ts filename="functions/secure.ts"
import { createRemoteJWKSet, jwtVerify } from 'jose';

const jwks = createRemoteJWKSet(new URL(process.env.NEON_AUTH_JWKS_URL!));
const issuer = new URL(process.env.NEON_AUTH_BASE_URL!).origin;

export default {
  async fetch(request: Request) {
    const auth = request.headers.get('authorization');
    if (!auth?.toLowerCase().startsWith('bearer ')) {
      return new Response('Unauthorized', { status: 401 });
    }
    try {
      const { payload } = await jwtVerify(auth.slice(7), jwks, { issuer });
      const userId = payload.sub; // scope the work to this user
      // ... do the work, return a response
      return Response.json({ ok: true, userId });
    } catch {
      return new Response('Unauthorized', { status: 401 });
    }
  },
};
```

Managed BetterAuth issues these tokens for your signed-in users; they're EdDSA-signed and short-lived (15 minutes), so see the [JWT plugin](/docs/auth/guides/plugins/jwt) for retrieving and refreshing them. The function only verifies. If you sign your own tokens instead (with a signer like NextAuth or [Better Auth](https://better-auth.com)'s `jwt` plugin), verify against your app's JWKS and issuer rather than the Managed BetterAuth ones.

## Call a function directly from the client

A long stream (an agent, an SSE feed) stays long only if nothing in front of it times out. Proxy it through your web app's backend on Vercel, Netlify, or Cloudflare, and that host's short serverless limit cuts the stream off. So call the function directly from the browser. That means there's no app backend in front of it, which is exactly why the handler has to authenticate the request itself.

Two things make the direct call work:

- **A short-lived token.** With Managed BetterAuth, the signed-in client gets one from the Managed BetterAuth SDK (`authClient.token()`). With a custom signer, mint it on your app backend (a fast call, well within host limits). Either way, the client sends it as `Authorization: Bearer <token>`.
- **CORS.** The browser calls the function cross-origin, so handle the preflight and set the headers:

```ts filename="functions/cors.ts"
function cors(request: Request) {
  return {
    'Access-Control-Allow-Origin': request.headers.get('origin') ?? '*',
    'Access-Control-Allow-Headers': 'authorization, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };
}

export default {
  async fetch(request: Request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors(request) });
    }
    // ... verify the JWT as above, then return responses with cors(request) headers
  },
};
```

This example echoes any request origin. In production, check `request.headers.get('origin')` against an allowlist of your app's domains and reject the rest, so the function only answers calls from sites you control.

With the [Vercel AI SDK](/docs/compute/functions/agents), point the transport at the function URL and attach the token in `fetch`:

```ts
import { DefaultChatTransport } from 'ai';

new DefaultChatTransport({
  api: NEON_FUNCTION_URL,
  fetch: (url, init) =>
    fetch(url, { ...init, headers: { ...init?.headers, authorization: `Bearer ${token}` } }),
});
```

## Check an API key

When the callers are your own scripts, cron jobs, or internal tools, you don't need full user auth. Check a shared secret instead. Set it on the deployment with `--env` (see [Environment variables](/docs/compute/functions/environment-variables)), then compare it on every request:

```ts
export default {
  async fetch(request: Request) {
    if (request.headers.get('authorization') !== `Bearer ${process.env.API_KEY}`) {
      return new Response('Unauthorized', { status: 401 });
    }
    // ... do the work
    return Response.json({ ok: true });
  },
};
```

```bash
neon functions deploy secure --src functions/secure.ts --env API_KEY=your-secret
```

The secret stays server-side, and rotating it is a redeploy with a new value. It's a solid default until you need real per-user identity, at which point use JWTs.

## WebSocket and SSE clients

Browsers can't set request headers on a WebSocket or an `EventSource`, so the `Authorization` header isn't available. Pass the token as a query parameter (or a cookie for SSE) and verify it before accepting the connection. See [WebSockets and SSE](/docs/compute/functions/websockets#authentication) for the pattern.

## OAuth and MCP clients

Managed BetterAuth handles user sign-in and issues JWTs you verify as above. A different case is a third-party client like an MCP client (Cursor or Claude) self-authorizing against your server through the OAuth flow in the MCP spec. That's a larger setup: run your own OAuth provider (such as [Better Auth](https://better-auth.com)) alongside your app and have the function verify the access tokens it issues. See the [with-mcp example](https://github.com/neondatabase/examples/tree/main/with-mcp) for a working server.

## Example

[with-realtime-chat](https://github.com/neondatabase/examples/tree/main/with-realtime-chat) authenticates a WebSocket connection with a Managed BetterAuth JWT end to end.

<NeedHelp/>
