---
title: Neon Auth
subtitle: Managed authentication that branches with your database
summary: >-
  Covers the setup of Neon Auth, a managed authentication service that
  integrates with your Neon database, allowing for branch-aware authentication
  and seamless testing of authentication workflows in isolated environments.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.762Z'
redirectFrom:
  - /docs/neon-auth/quick-start/nextjs
  - /docs/auth/migrate/from-stack-auth
  - /docs/neon-auth/overview
  - /docs/neon-auth/claim-project
  - /docs/neon-auth/create-users
  - /docs/neon-auth/api
  - /docs/neon-auth/how-it-works
  - /docs/neon-auth/best-practices
  - /docs/neon-auth/concepts/backend-integration
  - /docs/neon-auth/concepts/custom-user-data
  - /docs/guides/neon-auth-claim-project
  - /docs/guides/neon-auth-api
  - /docs/guides/neon-auth-how-it-works
  - /docs/guides/neon-auth-best-practices
---

<FeatureBetaProps feature_name="Neon Auth with Better Auth" />

Neon Auth is a managed authentication service that stores users, sessions, and auth configuration directly in your Neon database. When you branch your database, your entire auth state branches with it. This lets you test real authentication workflows in preview environments.

<Admonition type="note" title="Before you start">
Neon Auth is in active development. Check the [roadmap](/docs/auth/roadmap) to see what's supported and what's coming next.
</Admonition>

## Why Neon Auth?

- **Identity lives in your database**  
  All authentication data is stored in the `neon_auth` schema. It's queryable with SQL and compatible with Row Level Security (RLS) policies.

- **Zero server management**  
  Neon Auth runs as a managed REST API service. Configure settings in the Console; use the [client SDK](/docs/reference/javascript-sdk) or [server SDK](/docs/auth/reference/nextjs-server) in your app. No infrastructure to maintain.

- **Auth that branches with your data**  
  Test sign-up, login, password reset, and OAuth flows in isolated branches without touching production data.

## Built on Better Auth

Neon Auth is powered by [Better Auth](https://www.better-auth.com/), which means you get familiar APIs. You can use Better Auth UI components or call auth methods directly to build your own UI.

Neon Auth currently supports Better Auth version **1.4.6**.

### When to use Neon Auth vs. self-hosting Better Auth

Neon Auth is a managed authentication service that integrates seamlessly with Neon's architecture and offerings:

- **Branch-aware authentication** — Every Neon branch gets its own isolated auth environment, so you can test authentication features without affecting your production branch.
- **Built-in Data API integration** — JWT token validation for the Data API has native support for Neon Auth.
- **No infrastructure to manage** — Neon Auth is deployed in the same region as your database, reducing latency without requiring you to run auth infrastructure.
- **Shared OAuth credentials for testing** — Get started quickly with out-of-the-box Google OAuth credentials, eliminating the setup complexity for testing and prototyping.

Self-hosting Better Auth makes sense if you need:

- Flexibility in auth configuration—custom plugins, hooks, and options not yet supported by Neon Auth.
- Full control over your auth code and the ability to run it inside your own infrastructure.

For more details on the SDK differences between `@neondatabase/auth` and `better-auth/client`, see [Why use @neondatabase/auth over better-auth/client](https://github.com/neondatabase/neon-js/blob/main/packages/auth/neon-auth_vs_better-auth.md).

As Neon Auth evolves, more Better Auth integrations and features will be added. Check the [roadmap](/docs/auth/roadmap) to see what's currently supported and what's coming next.

## Basic usage

Enable Auth in your Neon project, then add authentication to your app.

**For Next.js (server-side):**

See the [Next.js Server SDK reference](/docs/auth/reference/nextjs-server) for complete API documentation.

```typescript filename="lib/auth/server.ts"
import { createNeonAuth } from '@neondatabase/auth/next/server';

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET! },
});
```

```typescript filename="app/api/auth/[...path]/route.ts"
import { auth } from '@/lib/auth/server';

export const { GET, POST } = auth.handler();
```

**For React/Vite (client-side):**

See the [Client SDK reference](/docs/reference/javascript-sdk) for complete API documentation.

```typescript filename="src/auth.ts"
import { createAuthClient } from '@neondatabase/neon-js/auth';

export const authClient = createAuthClient(import.meta.env.VITE_NEON_AUTH_URL);
```

```tsx filename="src/App.tsx"
import { NeonAuthUIProvider, AuthView } from '@neondatabase/neon-js/auth/react/ui';
import { authClient } from './auth';

export default function App() {
  return (
    <NeonAuthUIProvider authClient={authClient}>
      <AuthView pathname="sign-in" />
    </NeonAuthUIProvider>
  );
}
```

## Use cases

- **Production authentication**  
  Use Neon Auth as the identity system for your app. Store users, sessions, and OAuth configuration directly in Postgres, and pair with RLS for secure, database-centric access control.

- **Preview environments**  
  Test full authentication flows in Vercel previews with real users and sessions

- **Multi-tenant SaaS**  
  Test complex org and role hierarchies safely in isolated branches

- **CI/CD workflows**  
  Run end-to-end auth tests without touching production. The [Neon Create Branch GitHub Action](https://github.com/marketplace/actions/neon-create-branch-github-action) supports retrieving branch-specific auth URLs for testing authentication flows in GitHub Actions workflows.

- **Development workflows**  
  Spin up complete environments instantly with database and auth together

See [Branching authentication](/docs/auth/branching-authentication) for details on how auth branches with your database.

## Quick start guides

Choose your framework to get started:

<TechCards>

<a href="/docs/auth/quick-start/nextjs" title="Next.js" description="With UI components" icon="next-js"></a>

<a href="/docs/auth/quick-start/react" title="React (API methods)" description="Build your own auth UI" icon="react"></a>

<a href="/docs/auth/quick-start/react-router-components" title="React" description="With UI components" icon="react"></a>

<a href="/docs/auth/quick-start/tanstack-router" title="TanStack Router" description="With UI components" icon="tanstack"></a>

</TechCards>

## Availability

Neon Auth is currently available for AWS regions only. Azure support is not yet available.

Neon Auth does not currently support projects with [IP Allow](/docs/manage/projects#configure-ip-allow) or [Private Networking](/docs/guides/neon-private-networking) enabled.

## Pricing

Neon Auth is included in all Neon plans based on Monthly Active Users (MAU):

- **Free**: Up to 60,000 MAU
- **Launch**: Up to 1M MAU
- **Scale**: Up to 1M MAU

An MAU (Monthly Active User) is a unique user who authenticates at least once during a monthly billing period. If you need more than 1M MAU, [contact Sales](/contact-sales).

See [Neon plans](/docs/introduction/plans#auth) for more details.

## Migration from Stack Auth

If you're using the previous Neon Auth implementation via Stack Auth, your version will continue to work. When you're ready to migrate to the new Better Auth implementation, see our [migration guide](/docs/auth/migrate/from-legacy-auth).

<NeedHelp/>
