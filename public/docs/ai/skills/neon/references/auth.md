# Managed Better Auth

Overview and framework quickstarts: https://neon.com/docs/auth/overview.md

Enabling Auth on the branch (`auth: true` in `neon.ts` then `neon deploy`, or `neon neon-auth enable`) is not implementing login. Follow the matching framework quickstart:

- Next.js (API methods): https://neon.com/docs/auth/quick-start/nextjs-api-only.md
- React (API methods): https://neon.com/docs/auth/quick-start/react.md
- TanStack Router (UI components): https://neon.com/docs/auth/quick-start/tanstack-router.md

Cookie secrets follow the selected quickstart. Next.js uses `NEON_AUTH_COOKIE_SECRET` (generate with `openssl rand -base64 32`). React / Vite / TanStack Router use `VITE_NEON_AUTH_URL` and do not take that cookie secret.

Preserve an existing Clerk (or other) provider. Do not migrate it to Managed Better Auth unless the user asks.

## Incompatibilities

Managed Better Auth is available for AWS regions only. It does not support projects with IP Allow or Private Networking. Leave those protections in place; pick another auth provider for that project.

## Trusted domains

Auth only redirects to domains on its allowlist. Production and preview hosts must be registered: https://neon.com/docs/auth/guides/configure-domains.md. `localhost` ports are pre-approved. CLI:

```bash
neon neon-auth domain add https://app.example.com
neon neon-auth domain list
```

Register the domain before pointing users at the new URL.

## Functions: verify the JWT, then authorize the user

A Function that trusts Auth verifies the request JWT with the branch JWKS, then checks that `sub` owns the resource. A valid token is not permission to read another user's rows. Exercise two users: each can access their own data, and cross-user access is denied. Sign-out must invalidate the session. The callback domain must be on the trusted list.

When Auth is provisioned on the branch, Functions receive `NEON_AUTH_BASE_URL` and `NEON_AUTH_JWKS_URL`. Use `NEON_AUTH_JWKS_URL` directly. Tokens are EdDSA (Ed25519) and expire in 15 minutes. Custom claims are not supported. https://neon.com/docs/auth/guides/plugins/jwt.md https://neon.com/docs/compute/functions/authentication.md

```typescript
import { jwtVerify, createRemoteJWKSet } from "jose";

const JWKS = createRemoteJWKSet(new URL(process.env.NEON_AUTH_JWKS_URL!));
const issuer = new URL(process.env.NEON_AUTH_BASE_URL!).origin;

export default {
  async fetch(request: Request) {
    const auth = request.headers.get("authorization");
    if (!auth?.toLowerCase().startsWith("bearer ")) {
      return new Response("Unauthorized", { status: 401 });
    }
    try {
      const { payload } = await jwtVerify(auth.slice(7), JWKS, { issuer });
      const userId = payload.sub;
      if (!userId) return new Response("Unauthorized", { status: 401 });
      // authorize resource access by userId, then do the work
      return Response.json({ ok: true, userId });
    } catch {
      return new Response("Unauthorized", { status: 401 });
    }
  },
};
```

## Data API external JWKS

When the app uses the Data API compatibility path with a third-party IdP instead of Neon Auth:

```typescript
export default defineConfig({
  dataApi: {
    authProvider: "external",
    jwksUrl: "https://your-idp/.well-known/jwks.json",
  },
});
```

An external JWKS is only accepted after claim on a Claimable project.
