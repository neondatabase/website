# Managed Better Auth: implement login

Enabling `auth: true` is not implementing login. Follow the matching live quickstart, then verify sign-up, sign-in, sign-out, session, and a protected route.

- Overview: https://neon.com/docs/auth/overview.md
- Next.js (API methods): https://neon.com/docs/auth/quick-start/nextjs-api-only.md
- React (API methods, including React Router): https://neon.com/docs/auth/quick-start/react.md
- TanStack Router (UI components): https://neon.com/docs/auth/quick-start/tanstack-router.md

Keep Clerk, existing Better Auth, Supabase Auth, or another working provider. Do not migrate it unless the user asks. The `SKILL.md` Supabase case is that explicit login-migration request.

Framework-specific companion skills also live in [neondatabase/neon-js](https://github.com/neondatabase/neon-js) (`neon-auth-nextjs`, `neon-auth-react`, `neon-js-react`). Prefer the live Neon guides above; do not copy those SDK-local files into this repo.

## Auth emails

Managed Auth sends verification, email OTP, magic-link, and password-reset messages. Getting started uses the shared SMTP provider (`auth@mail.myneon.app`). Implementing login does not require Resend, SendGrid, or other application email code.

Production requires custom SMTP. Verification codes work on shared or custom SMTP. Verification links require custom SMTP. Checklist: https://neon.com/docs/auth/production-checklist.md. Branding and webhook delivery: https://neon.com/docs/auth/guides/customize-emails.md.

SMS is separate: the Phone Number plugin needs an application `send.otp` webhook.

## Packages

| Need | Package |
| --- | --- |
| Auth only | `@neon/auth` |
| Already using the combined SDK | `@neon/neon-js/auth` re-export |
| Pre-built UI | Better Auth UI: `@better-auth-ui/react` plus shadcn/ui components (`npx shadcn add @better-auth-ui/auth`) |

Keep an existing `SupabaseAuthAdapter()` caller on that API (`signInWithPassword`, `signInWithOAuth`). Do not mix those methods into default Better Auth examples. Password hashes do not migrate from Supabase; `updateUser()` cannot change email or password; email verification needs app UI. Guide: https://neon.com/docs/auth/migrate/from-supabase.md

The Managed client is Better Auth methods through Neon's wrapper. It is not interchangeable with bare `better-auth/client` while Auth is managed: the wrapper rejects extra plugins and implements Neon OAuth verifier / iframe popup / JWT extraction.

## Environment

| Variable | Purpose |
| --- | --- |
| `NEON_AUTH_BASE_URL` | Branch Managed Auth URL (includes path). Next server; injected into Functions. |
| `NEON_AUTH_COOKIE_SECRET` | Next app secret for cached session cookies. Generate with `openssl rand -base64 32` (32+ characters). Not injected by Neon. |
| `VITE_NEON_AUTH_URL` | Public Auth URL for Vite / TanStack browser code. Assign the actual branch URL; env pull does not create this alias. |
| `NEON_AUTH_JWKS_URL` | Injected Functions JWKS. Verify tokens in `neon-functions`, not here. |

`neon env pull` / `neon deploy` write Managed `NEON_AUTH_BASE_URL` and `NEON_AUTH_JWKS_URL` when Auth is declared. The cookie secret and `VITE_*` name are application config.

## Next.js

`createNeonAuth` from `@neon/auth/next/server`. Optional Next peer on current `@neon/auth` is `>=16.0.0`; check the installed package before changing an existing app's router file.

```typescript
import { createNeonAuth } from "@neon/auth/next/server";

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET! },
});
```

`app/api/auth/[...path]/route.ts`:

```typescript
import { auth } from "@/lib/auth/server";

export const { GET, POST, PUT, DELETE, PATCH } = auth.handler();
```

Those five methods are what the installed SDK returns. Existing apps that export only `GET`/`POST` keep serving GET/POST routes.

Browser client takes **no arguments** and talks to that same-origin proxy:

```typescript
import { createAuthClient } from "@neon/auth/next";

export const authClient = createAuthClient();
```

### Middleware

Protect routes with `auth.middleware()` from `proxy.ts` on Next 16. Earlier Next apps may still use `middleware.ts`; match the installed SDK. Use the catch-all matcher and list only the app's own public pages in `publicRoutes`:

```typescript
import { auth } from "@/lib/auth/server";

export default auth.middleware({
  loginUrl: "/auth/sign-in",
  publicRoutes: ["/"],
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

- `/api/auth` and every Better Auth UI signed-out view (sign-in, sign-up, forgot-password, reset-password, verify-email, magic-link, accept-invitation, and the rest) are public by default. `/auth` itself and `/settings/*` stay protected.
- `publicRoutes` matches an exact path or its slash-delimited subpaths. `"/"` matches only `/`. Entries must start with `/`; `""` and `"//"` throw.
- Do not write a custom `proxy.ts` wrapper or re-list the default skip routes.

Before reading protected data or performing a mutation, check the session inside the Route Handler or Server Action and enforce the resource's authorization rules. Verify direct unauthenticated requests are denied, independently of page redirects:

```typescript
const { data: session } = await auth.getSession();
if (!session?.user) {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
```

Server session:

```typescript
const { data: session, error } = await auth.getSession();
const user = session?.user;
```

Do not destructure `{ user }` from the top-level result. Do not pass options into `createAuthClient()` from `/next`. Do not put `fetchOptions` on the Managed `createAuthClient` URL-style config; adapter factories accept fetch options inside `BetterAuthReactAdapter({ fetchOptions })` / `BetterAuthVanillaAdapter(...)`.

JWT: `const { data, error } = await auth.token();` then `data.token`. Do not call `getJWTToken()` on the public client.

**Phone OTP:** the browser client exposes `phoneNumber`. Existing users link a number, then sign in; there is no phone-first signup. Next.js `auth.handler()` forwards the catch-all path to Managed Auth, including phone OTP. A missing `auth.phoneNumber` server method is a missing typed helper, not a proxy rejection. SMS e2e needs a configured `send.otp` webhook and custom UI.

## Organization invitations

`organization.inviteMember()` does not send email unless `send_invitation_email` is on (default `false`) and "Verify email at signup" is enabled. Accepting an emailed invite needs `/auth/accept-invitation?invitationId=` via Better Auth UI's organization plugin (`organizationPlugin()`, view `accept-invitation`) or a custom flow that signs the recipient in and calls `organization.acceptInvitation({ invitationId })`. If email delivery stays off, use an in-app invitation list. https://neon.com/docs/auth/guides/plugins/organization.md

## React / Vite

```typescript
import { createAuthClient } from "@neon/auth";
import { BetterAuthReactAdapter } from "@neon/auth/react/adapters";

export const authClient = createAuthClient(import.meta.env.VITE_NEON_AUTH_URL, {
  adapter: BetterAuthReactAdapter(),
});
```

Vite has no server middleware. Guard protected routes with a session check, for example a router loader that calls `authClient.getSession()` or `useSession()` in a layout component, and redirect to `/auth/sign-in` when there is no user. Add `http://localhost:5173` and the production origin as trusted domains first: see [Trusted domains](../SKILL.md#trusted-domains).

Call adapter factories with `()`. Omit the adapter for vanilla Better Auth methods without `useSession`.

Public calls: `signUp.email({ email, password, name })`, `signIn.email({ email, password })`, `signIn.social({ provider, callbackURL })`, `getSession()`, `signOut()`. Result shape is `{ data, error }`; user is `data.user`. Handle `error` and thrown HTTP errors, pending UI, and authenticated vs unauthenticated display.

JWT: `authClient.token()` then `data.token`.

## UI

Neon hosts the auth server. Do NOT call `betterAuth()`, add a database adapter, or run Better Auth migrations.

Better Auth UI 1.7. The shadcn CLI copies its components into the app; `@better-auth-ui/react` is the data layer and needs TanStack Query:

```bash
npx shadcn@latest init                              # once, if the app has no components.json
npx shadcn@latest add @better-auth-ui/auth          # sign-in, sign-up, password reset
npx shadcn@latest add @better-auth-ui/user-button   # optional
```

```tsx
import { getSafeRedirectTo, viewPaths } from "@better-auth-ui/core";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/components/auth/auth-provider";
import { Auth } from "@/components/auth/auth";
import { Toaster } from "@/components/ui/sonner";

<QueryClientProvider client={queryClient}>
  <AuthProvider
    authClient={authClient}
    emailAndPassword={{ requireEmailVerification: false }} // match the branch's "Verify email at signup"
    navigate={({ to, replace }) => {
      const path = getSafeRedirectTo(to, window.location.origin);
      const target = path.startsWith("//") ? "/" : path;
      if (replace) router.replace(target);
      else router.push(target);
    }}
    Link={Link}
    redirectTo="/"
  >
    {children}
    <Toaster />
  </AuthProvider>
</QueryClientProvider>

// /auth/[path]: valid paths are Object.values(viewPaths.auth)
<Auth path={path} />
```

- `queryClient`, `router` and `Link` are the app's own TanStack Query client and its framework router's `push`/`replace` and `Link`; do not invent imports for them.
- Pass the Neon `authClient` as is; it satisfies Better Auth UI's `AuthClient` type.
- `navigate` receives the URL's `?redirectTo=` after sign-in. Validate it as above: `getSafeRedirectTo` alone returns `//host` for `/a/..//host`.
- Install with one command and let npm resolve it: `npm i @neon/auth @better-auth-ui/core @better-auth-ui/react @tanstack/react-query`. `@neon/auth` declares the Better Auth range, so npm installs a single compatible copy. Do not pin `better-auth` or its plugins, and do not add `overrides` or `resolutions`.
- After the last `npx shadcn add`, run `npm i better-auth@~1.7.12`. The registry items install a bare `better-auth`, which resolves to a newer prerelease and leaves two copies; this range matches `@neon/auth`.
- Protect pages on the server (`auth.middleware()`, see [Middleware](#middleware)). Better Auth UI's `useAuthenticate` redirects while a stale signed-out session is still refetching, which sends a user who just signed up back to sign-in.
- Render `<Toaster />`: the copied `AuthProvider` reports errors with Sonner's `toast.error()` and renders nothing itself.
- Set `requireEmailVerification` to the branch's "Verify email at signup" setting (off by default). It decides whether sign-up shows the verify-email view.
- Better Auth UI plugins (`plugins={[...]}`) do not enable the Managed plugin. Configure the plugin on the branch, then the UI.

Verify before reporting done:

1. Sign up a new user.
2. Sign out, then sign in again.
3. The session survives a reload.
4. A protected route redirects to `/auth/sign-in` while signed out.
5. A wrong password shows an invalid-credentials message, not a generic one.
6. `/auth/reset-password` loads while signed out.

Leave an existing app on `@neondatabase/auth-ui` alone rather than migrating it as a drive-by. New snippets use Better Auth UI.

## Cross-subdomain vs bearer JWT

`cookies.domain` shares session cookies across subdomains of one parent domain (see the neon-js `cross-domain-cookies` example). That is not cookie sharing across unrelated frontend and backend hosts. A Neon Function authenticates with `Authorization: Bearer`. With Managed Auth, verify against the injected JWKS. With another identity, use that identity's token contract — see `neon-functions`. https://neon.com/docs/compute/functions/authentication.md and https://neon.com/docs/auth/guides/plugins/jwt.md.

## Data API identity

Only when the app already uses PostgREST or a Supabase database client:

```typescript
import { defineConfig } from "@neon/config/v1";

export default defineConfig({ auth: true, dataApi: true });
```

Existing external IdP:

```typescript
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  dataApi: {
    authProvider: "external",
    jwksUrl: "https://your-idp/.well-known/jwks.json",
  },
});
```

Do not enable Auth merely to satisfy a `dataApi` type error in an app that never needed the Data API. External JWKS on a Claimable project is accepted only after claim. Combined SDK `createClient({ dataApi: { url, getToken } })` is a query client without `.auth`; confirm the installed `@neon/neon-js` docs before introducing it.
