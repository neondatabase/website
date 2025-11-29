---
title: Use Neon Auth with React Router
subtitle: Learn how to set up Neon Auth in a React app with routing
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

Install the Neon SDK and React Router.

The Neon SDK provides authentication methods, and React Router enables multi-page navigation.

  </LeftContent>
  <RightCode label="Terminal">

```bash
cd my-app && npm install @neondatabase/neon-js react-router-dom
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
VITE_NEON_BASE_URL=https://ep-xxx.neonauth.us-east-2.aws.neon.build/neondb/auth
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Configure the Neon client">
  <LeftContent>

Create a `src/neon.js` file to configure your Neon client:

  </LeftContent>
  <RightCode label="src/neon.js">

```javascript
import { createClient } from '@neondatabase/neon-js';

export const neon = createClient(import.meta.env.VITE_NEON_BASE_URL);
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Set up the router">
  <LeftContent>

Update `src/main.jsx` to wrap your app with React Router's `BrowserRouter`:

  </LeftContent>
  <RightCode label="src/main.jsx">

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Create the auth page">
  <LeftContent>

Create a new `pages` folder in `src`, then create the `src/pages/Auth.jsx` file with sign-up and sign-in forms:

  </LeftContent>
  <RightCode label="src/pages/Auth.jsx">

```jsx
import { useState } from 'react';
import { neon } from '../neon';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (isSignUp) {
        const { error } = await neon.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Account created! Please sign in.');
        setIsSignUp(false);
      } else {
        const { error } = await neon.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/dashboard');
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
      </form>
      <button
        onClick={() => {
          setIsSignUp(!isSignUp);
          setMessage('');
        }}
      >
        {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Create the dashboard page">
  <LeftContent>

Create a `src/pages/Dashboard.jsx` file to show the authenticated user:

  </LeftContent>
  <RightCode label="src/pages/Dashboard.jsx">

```jsx
import { useState, useEffect } from 'react';
import { neon } from '../neon';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    neon.auth.getSession().then(({ data }) => {
      if (data.session) {
        setUser(data.session.user);
      } else {
        navigate('/');
      }
      setLoading(false);
    });
  }, [navigate]);

  const handleSignOut = async () => {
    await neon.auth.signOut();
    navigate('/');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Logged in as: {user?.email}</p>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
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
