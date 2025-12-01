---
title: React Quickstart with UI Components
subtitle: Build a complete auth flow with pre-built components and React Router
enableTableOfContents: true
updatedOn: '2025-11-19T00:00:00.000Z'
layout: wide
---

<TwoColumnLayout>

<TwoColumnStep title="Enable Auth in your Neon project">
  <LeftContent>

If you don't have a Neon project yet, create one at [console.neon.tech](https://console.neon.tech).

Go to the **Auth** page in your project dashboard and click **Enable Auth**.

You can then find your Auth URL on the Configuration tab. Copy this URL - you'll need it in the next step.

  </LeftContent>
  <RightImage label="Console">

![Neon Auth Base URL](/docs/auth/neon-auth-base-url.png)

  </RightImage>
</TwoColumnStep>

<TwoColumnStep title="Create your React app">
  <LeftContent>

Create a React app using Vite.

  </LeftContent>
  <RightCode label="Terminal">

```bash
npm create vite@latest my-app -- --template react
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Install packages">
  <LeftContent>

Install the Neon SDK, UI components, and React Router.

  </LeftContent>
  <RightCode label="Terminal">

```bash
cd my-app
npm install @neondatabase/neon-js @neondatabase/neon-auth-ui react-router-dom
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Add your Auth URL">
  <LeftContent>

Create a `.env` file in your project root and add your Auth URL:

<Admonition type="note">
Replace the URL with your actual Auth URL from the Neon Console.
</Admonition>

  </LeftContent>
  <RightCode label=".env">

```bash
VITE_NEON_AUTH_URL=https://ep-xxx.neonauth.us-east-2.aws.neon.build/neondb/auth
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Set up authentication">
  <LeftContent>

Create a `src/auth.js` file to configure your auth client. The default vanilla Better Auth adapter is used automatically:

  </LeftContent>
  <RightCode label="src/auth.js">

```javascript
import { createAuthClient } from '@neondatabase/neon-js';

export const auth = createAuthClient(import.meta.env.VITE_NEON_AUTH_URL);
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Install Tailwind PostCSS plugin">
  <LeftContent>

Install the PostCSS plugin for Tailwind CSS v4 integration with Vite.

<Admonition type="note">
Tailwind CSS v4 is bundled with `@neondatabase/neon-auth-ui`, so you don't need to install it separately. You only need the PostCSS plugin for Vite integration.
</Admonition>

  </LeftContent>
  <RightCode label="Terminal">

```bash
npm install -D @tailwindcss/postcss
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Set up Tailwind CSS">
  <LeftContent>

Create the Tailwind and PostCSS configuration files:

  </LeftContent>
  <RightCode label="tailwind.config.js">

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
    './node_modules/@neondatabase/neon-auth-ui/**/*.js',
  ],
};
```

  </RightCode>
  <RightCode label="postcss.config.js">

```javascript
import tailwindcssPostcss from '@tailwindcss/postcss';

export default {
  plugins: [tailwindcssPostcss],
};
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Wrap your app with providers">
  <LeftContent>

Replace the contents of `src/main.jsx` to wrap your app with the auth provider and React Router, and replace the contents of `src/index.css` with Tailwind directives:

  </LeftContent>
  <RightCode label="src/main.jsx">

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { NeonAuthUIProvider } from '@neondatabase/neon-auth-ui';
import '@neondatabase/neon-auth-ui/css';
import './index.css';
import App from './App.jsx';
import { auth } from './auth';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NeonAuthUIProvider authClient={auth}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </NeonAuthUIProvider>
  </StrictMode>
);
```

  </RightCode>
  <RightCode label="src/index.css">

Replace the entire contents of `src/index.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Build the sign-in page">
  <LeftContent>

Create a `src/pages` directory, then add `src/pages/Auth.jsx` using the pre-built auth component:

The `<AuthView>` component provides a complete authentication UI with sign-up and sign-in forms, including validation and error handling.

<Admonition type="note">
The `pathname` prop syncs with React Router. `redirectTo` must be a full URL.
</Admonition>

  </LeftContent>
  <RightCode label="src/pages/Auth.jsx">

```jsx
import { AuthView } from '@neondatabase/neon-auth-ui';
import { useLocation } from 'react-router-dom';

export default function Auth() {
  const location = useLocation();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <AuthView redirectTo={window.location.origin + '/dashboard'} pathname={location.pathname} />
    </div>
  );
}
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Build the dashboard page">
  <LeftContent>

Create `src/pages/Dashboard.jsx` using the pre-built user button:

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
          <header
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
            }}
          >
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

<TwoColumnStep title="Define your routes">
  <LeftContent>

Replace the contents of `src/App.jsx` with your route configuration:

<Admonition type="note">
The `/auth/*` route handles navigation between sign-in and sign-up views.
</Admonition>

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
      <Route path="/auth/*" element={<Auth />} />
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
