---
title: React Quickstart with UI Components
subtitle: Build a complete auth flow with pre-built components and React Router
enableTableOfContents: true
updatedOn: '2025-11-19T00:00:00.000Z'
layout: wide
---

<TwoColumnLayout>

<TwoColumnStep title="Create a Neon project with Auth enabled">
  <LeftContent>

If you don't have a Neon project yet, create one at [console.neon.tech](https://console.neon.tech).

Go to the **Auth** page in your project dashboard and click **Enable Auth**.

You can then find your Auth **Base URL** on the Configuration tab. Copy this URL - you'll need it in the next step.

  </LeftContent>
  <RightImage label="Console">

![Neon Auth Base URL](/docs/auth/neon-auth-base-url.png)

  </RightImage>
</TwoColumnStep>

<TwoColumnStep title="Create a React app">
  <LeftContent>

Create a React app using Vite.

  </LeftContent>
  <RightCode label="Terminal">

```bash
npm create vite@latest my-app -- --template react
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Install dependencies">
  <LeftContent>

Install the Neon SDK, UI components, and React Router.

The Neon SDK provides authentication, the UI components provide pre-built forms, and React Router enables multi-page navigation.

  </LeftContent>
  <RightCode label="Terminal">

```bash
cd my-app && npm install @neondatabase/neon-js @neondatabase/neon-auth-ui react-router-dom
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Set up environment variables">
  <LeftContent>

Create a `.env` file in your project root and add your Auth Base URL:

<Admonition type="note">
Replace the URL with your actual Auth Base URL from the Neon Console.
</Admonition>

  </LeftContent>
  <RightCode label=".env">

```bash
VITE_NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.us-east-2.aws.neon.build/neondb/auth
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Configure the Neon client and auth provider">
  <LeftContent>

Create a `src/neon.js` file to configure your Neon client and export the auth provider:

  </LeftContent>
  <RightCode label="src/neon.js">

```javascript
import { createClient } from '@neondatabase/neon-js';

export const neon = createClient({
  auth: {
    baseURL: import.meta.env.VITE_NEON_AUTH_BASE_URL,
  },
});

export const auth = neon.auth;
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Set up providers">
  <LeftContent>

Update `src/main.jsx` to wrap your app with the auth provider and router:

  </LeftContent>
  <RightCode label="src/main.jsx">

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthUIProvider } from '@neondatabase/neon-auth-ui';
import '@neondatabase/neon-auth-ui/css';
import './index.css';
import App from './App.jsx';
import { auth } from './neon';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthUIProvider authClient={auth}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthUIProvider>
  </StrictMode>
);
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Create the auth page">
  <LeftContent>

Create a `src/pages/Auth.jsx` file using the pre-built auth component:

The `<AuthView>` component provides a complete authentication UI with sign-up and sign-in forms, including validation and error handling.

  </LeftContent>
  <RightCode label="src/pages/Auth.jsx">

```jsx
import { AuthView } from '@neondatabase/neon-auth-ui';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { auth } from '../neon';

export default function Auth() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already signed in
    auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate('/dashboard');
      }
    });
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh'
    }}>
      <AuthView redirectTo="/dashboard" />
    </div>
  );
}
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Create the dashboard page">
  <LeftContent>

Create a `src/pages/Dashboard.jsx` file using the pre-built user button:

The `<UserButton>` component provides a dropdown menu with user info and sign-out functionality. The `<SignedIn>` component protects the page content.

  </LeftContent>
  <RightCode label="src/pages/Dashboard.jsx">

```jsx
import { SignedIn, RedirectToSignIn, UserButton } from '@neondatabase/neon-auth-ui';

export default function Dashboard() {
  return (
    <>
      <SignedIn>
        <div style={{ padding: '2rem' }}>
          <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            <h1>Dashboard</h1>
            <UserButton />
          </header>
          <p>Welcome to your dashboard! You're successfully authenticated.</p>
        </div>
      </SignedIn>
      <RedirectToSignIn />
    </>
  );
}
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Set up routes in App.jsx">
  <LeftContent>

Replace the contents of `src/App.jsx` with your route configuration:

  </LeftContent>
  <RightCode label="src/App.jsx">

```jsx
import { Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Start your app">
  <LeftContent>

Start the development server and open `http://localhost:5173`:

1. Sign up with a test email and password
2. Sign in with those credentials
3. You'll be redirected to the dashboard

  </LeftContent>
  <RightCode label="Terminal">

```bash
npm run dev
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="See your users in the database">
  <LeftContent>

As users sign up, their profiles are synced to your Neon database in the `neon_auth.user` table.

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

- [Add email verification](/docs/auth/guides/email-verification) to ensure users own their email addresses
- [View complete SDK reference](/docs/reference/javascript-sdk)
