---
title: Use Neon Auth with TanStack Router
subtitle: Set up authentication using pre-built UI components
summary: >-
  Step-by-step guide for setting up Neon Auth with TanStack Router, including
  project creation, SDK installation, environment variable configuration, and
  style integration.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.771Z'
layout: wide
---

<FeatureBetaProps feature_name="Neon Auth with Better Auth" />

<TwoColumnLayout>

<TwoColumnLayout.Step title="Create a Neon project with Auth enabled">
<TwoColumnLayout.Block>

If you don't have a Neon project yet, create one at [console.neon.tech](https://console.neon.tech).

Go to the **Auth** page in your project dashboard and click **Enable Auth**.

You can then find your Auth URL on the Configuration tab. Copy this URL - you'll need it in the next step.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="Console">

![Neon Auth Base URL](/docs/auth/neon-auth-base-url.png)

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Create a TanStack Router app">
<TwoColumnLayout.Block>

Create a new TanStack Router app using the file-router template.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="Terminal">

```bash
npx create-tsrouter-app@latest my-app --template file-router --tailwind
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Install the Neon Auth SDK">
<TwoColumnLayout.Block>

Install the Neon Auth SDK and UI library:

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="Terminal">

```bash
cd my-app && npm install @neondatabase/neon-js
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Set up environment variables">
<TwoColumnLayout.Block>

Create a `.env` file in your project root and add your Auth URL:

<Admonition type="note">
Replace the URL with your actual Auth URL from the Neon Console.
</Admonition>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label=".env">

```bash
VITE_NEON_AUTH_URL=https://ep-xxx.neonauth.us-east-1.aws.neon.tech/neondb/auth
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Add Neon Auth styles">
<TwoColumnLayout.Block>

Open your existing `src/styles.css` file and add this import at the **top**, right after the Tailwind import:

<Admonition type="tip" title="Not using Tailwind?">
See [UI Component Styles](/docs/auth/reference/ui-components#styling) for alternative setup options.
</Admonition>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="Add to src/styles.css">

```css
@import '@neondatabase/neon-js/ui/tailwind';
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Configure the auth client">
<TwoColumnLayout.Block>

Create a `src/auth.ts` file to initialize the auth client:

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="src/auth.ts">

```typescript
import { createAuthClient } from '@neondatabase/neon-js/auth';
import { BetterAuthReactAdapter } from '@neondatabase/neon-js/auth/react';

export const authClient = createAuthClient(import.meta.env.VITE_NEON_AUTH_URL, { adapter: BetterAuthReactAdapter() });
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Create the Auth Provider">
<TwoColumnLayout.Block>

Wrap your application with the `NeonAuthUIProvider` in `src/routes/__root.tsx`. This makes the auth state available to the UI components used throughout your app.

Pass props to `NeonAuthUIProvider` for any features you want to use. Only the `authClient` prop is required.

<details>
<summary>Example: Adding optional props</summary>

```tsx
<NeonAuthUIProvider
  authClient={authClient}
  social={{ providers: ['google', 'github', 'vercel'] }}
  navigate={navigate}
  credentials={{ forgotPassword: true }}
>
  {children}
</NeonAuthUIProvider>
```

</details>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="src/routes/\_\_root.tsx">

```tsx {4-5,9,22}
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { NeonAuthUIProvider } from '@neondatabase/neon-js/auth/react';
import { authClient } from '../auth';

export const Route = createRootRoute({
  component: () => (
    <NeonAuthUIProvider authClient={authClient}>
      <Outlet />
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </NeonAuthUIProvider>
  ),
});
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Create the Auth page">
<TwoColumnLayout.Block>

Create a route to handle authentication views (sign in, sign up, etc.). Create `src/routes/auth.$pathname.tsx`:

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="src/routes/auth.$pathname.tsx">

```tsx
import { createFileRoute } from '@tanstack/react-router';
import { AuthView } from '@neondatabase/neon-js/auth/react/ui';

export const Route = createFileRoute('/auth/$pathname')({
  component: Auth,
});

function Auth() {
  const { pathname } = Route.useParams();
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <AuthView pathname={pathname} />
    </div>
  );
}
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Create the Account page">
<TwoColumnLayout.Block>

Create a route to handle account management views. Create `src/routes/account.$pathname.tsx`:

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="src/routes/account.$pathname.tsx">

```tsx
import { createFileRoute } from '@tanstack/react-router';
import { AccountView } from '@neondatabase/neon-js/auth/react/ui';

export const Route = createFileRoute('/account/$pathname')({
  component: Account,
});

function Account() {
  const { pathname } = Route.useParams();
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <AccountView pathname={pathname} />
    </div>
  );
}
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Protect your routes">
<TwoColumnLayout.Block>

You can protect your routes using the `SignedIn` and `RedirectToSignIn` components. Access the user's session and profile data using the `useSession` hook.

Update `src/routes/index.tsx` to protect the home page:

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="src/routes/index.tsx">

```tsx
import { createFileRoute } from '@tanstack/react-router';
import { SignedIn, UserButton, RedirectToSignIn } from '@neondatabase/neon-js/auth/react/ui';
import { authClient } from '@/auth';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  const { data } = authClient.useSession();

  return (
    <>
      <SignedIn>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            gap: '2rem',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <h1>Welcome!</h1>
            <p>You're successfully authenticated.</p>
            <UserButton />
            <p className="font-medium text-gray-700 dark:text-gray-200 mt-4">
              Session and User Data:
            </p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap break-words w-full max-w-full sm:max-w-2xl mx-auto text-left">
              <code>
                {JSON.stringify({ session: data?.session, user: data?.user }, null, 2)}
              </code>
            </pre>
          </div>
        </div>
      </SignedIn>
      <RedirectToSignIn />
    </>
  );
}
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Start your app">
<TwoColumnLayout.Block>

Start the development server, then open [http://localhost:3000](http://localhost:3000). You'll be redirected to the sign-in page.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="Terminal">

```bash
npm run dev
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="See your users in the database">
<TwoColumnLayout.Block>

As users sign up, their profiles are stored in your Neon database in the `neon_auth.user` table.

Query your users table in the SQL Editor to see your new users:

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="SQL Editor">

```sql
SELECT * FROM neon_auth.user;
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

</TwoColumnLayout>

## Next steps

- [Add email verification](/docs/auth/guides/email-verification)
- [Learn how to branch your auth](/docs/auth/branching-authentication)
