---
title: React with Neon Auth UI (UI Components)
subtitle: Build authentication with pre-built UI components
summary: >-
  Covers the setup of authentication in a React application using Neon's
  pre-built UI components, including enabling Neon Auth, creating a React app,
  and configuring the necessary environment variables.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.768Z'
layout: wide
---

<FeatureBetaProps feature_name="Neon Auth with Better Auth" />

<TwoColumnLayout>

<TwoColumnLayout.Step title="Enable Auth in your Neon project">
<TwoColumnLayout.Block>

If you don't have a Neon project yet, create one at [console.neon.tech](https://console.neon.tech).

Go to the **Auth** page in your project dashboard and click **Enable Neon Auth**.

You can then find your Auth URL on the Configuration tab. Copy this URL - you'll need it in the next step.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="Console">

![Neon Auth Base URL](/docs/auth/neon-auth-base-url.png)

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Create your React app">
<TwoColumnLayout.Block>

Create a React app using Vite with TypeScript.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="Terminal">

```bash
npm create vite@latest my-app -- --template react-ts
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Install packages">
<TwoColumnLayout.Block>

Install the Neon SDK, UI components, and React Router:

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="Terminal">

```bash
cd my-app
npm install @neondatabase/neon-js react-router-dom
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Add your Auth URL">
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

<TwoColumnLayout.Step title="Set up authentication">
<TwoColumnLayout.Block>

Create a `src/auth.ts` file to configure your auth client:

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="src/auth.ts">

```typescript
import { createAuthClient } from '@neondatabase/neon-js/auth';

export const authClient = createAuthClient(import.meta.env.VITE_NEON_AUTH_URL);
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Wrap your app with the provider">
<TwoColumnLayout.Block>

Replace the contents of `src/main.tsx` to wrap your app with React Router and the auth provider. Import the Neon Auth UI CSS - no additional setup needed:

Pass props to `NeonAuthUIProvider` for any features you want to use. Only the `authClient` prop is required.

<Admonition type="tip" title="Styling options">
To learn more about applying styles to the Auth UI components, including plain CSS and Tailwind CSS v4 options, see [UI Component Styles](/docs/auth/reference/ui-components#styling).
</Admonition>

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
<TwoColumnLayout.Block label="src/main.tsx">

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { NeonAuthUIProvider } from '@neondatabase/neon-js/auth/react';
import '@neondatabase/neon-js/ui/css';
import App from './App';
import { authClient } from './auth';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NeonAuthUIProvider authClient={authClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </NeonAuthUIProvider>
  </StrictMode>
);
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Build your authentication UI">
<TwoColumnLayout.Block>

Replace the contents of `src/App.tsx` with routes for authentication and account management:

<ul>
<li>The `<AuthView>` component handles navigation between sign-in and sign-up views.</li>
<li>The `<AccountView>` component provides account-management features such as password resets and session management.</li>
</ul>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="src/App.tsx">

```tsx
import { Routes, Route, useParams } from 'react-router-dom';
import {
  AuthView,
  AccountView,
  SignedIn,
  UserButton,
  RedirectToSignIn,
} from '@neondatabase/neon-js/auth/react';

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

function Auth() {
  const { pathname } = useParams();
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '2rem 1rem',
      }}
    >
      <AuthView pathname={pathname} />
    </div>
  );
}

function Account() {
  const { pathname } = useParams();
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '2rem 1rem',
      }}
    >
      <AccountView pathname={pathname} />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth/:pathname" element={<Auth />} />
      <Route path="/account/:pathname" element={<Account />} />
    </Routes>
  );
}
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Start your app">
<TwoColumnLayout.Block>

Start the development server, then open [http://localhost:5173](http://localhost:5173). You'll be redirected to the sign-in page where you can sign up or sign in.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="Terminal">

```bash
npm run dev
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="See your users in the database">
<TwoColumnLayout.Block>

As users sign up, their profiles are synced to your Neon database in the `neon_auth.user` table.

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
