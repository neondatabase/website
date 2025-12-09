---
title: Neon Auth
subtitle: Managed authentication that branches with your database
enableTableOfContents: true
updatedOn: '2025-12-08T00:00:00.000Z'
---

Neon Auth is a managed authentication service that stores users, sessions, and OAuth configuration directly in your Neon database. When you branch your database, your entire auth state branches with it. This enables isolated testing of real authentication workflows in preview environments.

## Why Neon Auth?

- **Auth that branches with your data**  
  Test sign-up, login, password reset, and OAuth flows in isolated branches without touching production data.

- **Identity lives in your database**  
  All authentication data is stored in the `neon_auth` schema. It's queryable with SQL and compatible with Row Level Security (RLS) policies.

- **Zero server management**  
  Neon Auth runs as a managed REST API service. Configure settings in the Console; use the [SDK](/docs/reference/javascript-sdk) in your app. No infrastructure to maintain.

## Built on Better Auth

Neon Auth is powered by Better Auth, which means you get familiar APIs and can use Better Auth UI components.

## Quick example

Enable Auth in your Neon project, then add authentication to your app:

<CodeWithLabel label="src/auth.ts">

```typescript
import { createAuthClient } from '@neondatabase/neon-js/auth';

export const authClient = createAuthClient(import.meta.env.VITE_NEON_AUTH_URL);
```

</CodeWithLabel>

<CodeWithLabel label="src/App.tsx">

```tsx
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

</CodeWithLabel>

## Use cases

- **Preview environments**  
  Test full authentication flows in Vercel previews with real users and sessions

- **Multi-tenant SaaS**  
  Test complex org and role hierarchies safely in isolated branches

- **CI/CD workflows**  
  Run end-to-end auth tests without touching production

- **Development workflows**  
  Spin up complete environments instantly with database and auth together

See [Branching authentication](/docs/auth/branching-authentication) for details on how auth branches with your database.

## Get started

Choose your framework to get started:

<DetailIconCards>

<a href="/docs/auth/quick-start/nextjs" description="Next.js app with authentication" icon="code">Next.js</a>

<a href="/docs/auth/quick-start/react-router-components" description="Multi-page React application with routing" icon="code">React Router</a>

<a href="/docs/auth/quick-start/tanstack-router" description="Multi-page React application with routing" icon="code">TanStack Router</a>

<a href="/docs/auth/quick-start/react" description="Single-page app with sign-up and sign-in" icon="code">React</a>

</DetailIconCards>

## Availability

Neon Auth is currently available for AWS regisions only. Azure support is not yet available.

## Migration from Stack Auth

If you're using the previous Neon Auth implementation via Stack Auth, your version will continue to work. When you're ready to migrate to the new Better Auth implementation, see our [migration guide](/docs/auth/migrate/from-stack-auth).

<NeedHelp/>
