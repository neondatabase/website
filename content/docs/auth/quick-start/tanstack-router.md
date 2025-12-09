---
title: Use Neon Auth with TanStack Router
subtitle: Learn how to set up Neon Auth in a TanStack Router app
enableTableOfContents: true
updatedOn: '2025-12-07T00:00:00.000Z'
layout: wide
---

<TwoColumnLayout>

<TwoColumnStep title="Create a Neon project with Auth enabled">
  <LeftContent>

If you don't have a Neon project yet, create one at [console.neon.tech](https://console.neon.tech).

Go to the **Auth** page in your project dashboard and click **Enable Auth**.

You can then find your Auth URL on the Configuration tab. Copy this URL - you'll need it in the next step.

  </LeftContent>
  <RightImage label="Console">

![Neon Auth Base URL](/docs/auth/neon-auth-base-url.png)

  </RightImage>
</TwoColumnStep>

<TwoColumnStep title="Create a TanStack Router app">
  <LeftContent>

Create a new TanStack Router app using the file-router template.

  </LeftContent>
  <RightCode label="Terminal">

```bash
bunx create-tsrouter-app@latest my-app --template file-router --tailwind
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Install the Neon Auth SDK">
  <LeftContent>

Install the Neon Auth SDK and UI library:

  </LeftContent>
  <RightCode label="Terminal">

```bash
cd my-app && bun add @neondatabase/neon-js
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Set up environment variables">
  <LeftContent>

Create a `.env` file in your project root and add your Auth URL:

<Admonition type="note">
Replace the URL with your actual Auth URL from the Neon Console.
</Admonition>

  </LeftContent>
  <RightCode label=".env">

```bash
VITE_NEON_AUTH_URL=https://ep-xxx.neonauth.us-east-1.aws.neon.tech/neondb/auth
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Add Neon Auth styles">
  <LeftContent>

Import the Neon Auth UI styles in your `src/styles.css` file. Add this line at the top of the file:

  </LeftContent>
  <RightCode label="src/styles.css">

```css
@import 'tailwindcss';
@import '@neondatabase/neon-js/ui/css'; // [!code ++]

// Your existing styles...
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Configure the auth client">
  <LeftContent>

Create a `src/auth.ts` file to initialize the auth client:

  </LeftContent>
  <RightCode label="src/auth.ts">

```typescript
import { createAuthClient } from '@neondatabase/neon-js/auth';

export const authClient = createAuthClient(import.meta.env.VITE_NEON_AUTH_URL);
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Create the Auth Provider">
  <LeftContent>

Wrap your application with the `NeonAuthUIProvider` in `src/routes/__root.tsx`. This makes the auth state available to the UI components used throughout your app.

  </LeftContent>
  <RightCode label="src/routes/__root.tsx">

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

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Create the Auth page">
  <LeftContent>

Create a route to handle authentication views (sign in, sign up, etc.). Create `src/routes/auth.$pathname.tsx`:

  </LeftContent>
  <RightCode label="src/routes/auth.$pathname.tsx">

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

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Create the Account page">
  <LeftContent>

Create a route to handle account management views. Create `src/routes/account.$pathname.tsx`:

  </LeftContent>
  <RightCode label="src/routes/account.$pathname.tsx">

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

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Protect your routes">
  <LeftContent>

You can protect your routes using the `SignedIn` and `RedirectToSignIn` components.

Update `src/routes/index.tsx` to protect the home page:

  </LeftContent>
  <RightCode label="src/routes/index.tsx">

```tsx
import { createFileRoute } from '@tanstack/react-router';
import { SignedIn, UserButton, RedirectToSignIn } from '@neondatabase/neon-js/auth/react/ui';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
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
          </div>
        </div>
      </SignedIn>
      <RedirectToSignIn />
    </>
  );
}
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Start your app">
  <LeftContent>

Start the development server, then open [http://localhost:3000](http://localhost:3000). You'll be redirected to the sign-in page.

  </LeftContent>
  <RightCode label="Terminal">

```bash
bun run dev
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="See your users in the database">
  <LeftContent>

As users sign up, their profiles are stored in your Neon database in the `neon_auth.user` table.

Query your users table in the SQL Editor to see your new users:

  </LeftContent>
  <RightCode label="SQL Editor">

```sql
SELECT * FROM neon_auth.user;
```

  </RightCode>
</TwoColumnStep>

</TwoColumnLayout>

## Next steps

- [Add email verification](/docs/auth/guides/email-verification)
- [Learn how to branch your auth](/docs/auth/branching-authentication)
